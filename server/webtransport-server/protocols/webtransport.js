import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { config } from '../config.js';
import { ensureDirSync, mergeChunks, sleep } from '../utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wtUploads = new Map();
let certFingerprint = null;

export function getWebTransportFingerprint() {
  return certFingerprint;
}

export async function setupWebTransport() {
  try {
    const certPath = path.join(__dirname, '..', 'cert.pem');
    const keyPath = path.join(__dirname, '..', 'key.pem');

    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
      console.warn('⚠️ WebTransport certificates not found. Skipping WebTransport setup.');
      return;
    }

    const certData = fs.readFileSync(certPath);
    const keyData = fs.readFileSync(keyPath, 'utf-8');

    const cert = new crypto.X509Certificate(certData);
    const hash = crypto.createHash('sha256').update(cert.raw).digest();
    certFingerprint = Array.from(hash);

    let Http3Server;
    try {
      try {
        await import('@fails-components/webtransport-transport-http3-quiche');
      } catch (e) {
        throw new Error('WebTransport quiche transport native module not found.', { cause: e });
      }
      const wt = await import('@fails-components/webtransport');
      Http3Server = wt.Http3Server;
    } catch (importErr) {
      console.warn(`⚠️ WebTransport setup failed: ${importErr.message}`);
      return;
    }

    let h3Server;
    try {
      h3Server = new Http3Server({
        port: config.WEBTRANSPORT_PORT,
        host: '0.0.0.0',
        secret: 'my_secret_phrase',
        cert: certData.toString('utf-8'),
        privKey: keyData,
      });
      h3Server.startServer();
      console.log(`🚀 HTTP/3 Server listening on port ${config.WEBTRANSPORT_PORT} (WebTransport)`);
    } catch (serverErr) {
      console.warn(`⚠️ Could not start HTTP/3 server: ${serverErr.message}`);
      return;
    }

    const sessionStream = await h3Server.sessionStream('/wt-upload');
    const sessionReader = sessionStream.getReader();

    while (true) {
      const { done, value: session } = await sessionReader.read();
      if (done) break;

      console.log('WebTransport session started via HTTP/3');

      (async () => {
        try {
          const bidiReader = session.incomingBidirectionalStreams.getReader();
          (async () => {
            while (true) {
              const { done: streamDone, value: stream } = await bidiReader.read();
              if (streamDone) break;
              handleWTStream(stream);
            }
          })();

          const uniReader = session.incomingUnidirectionalStreams.getReader();
          (async () => {
            while (true) {
              const { done: streamDone, value: stream } = await uniReader.read();
              if (streamDone) break;
              handleWTStream(stream, true);
            }
          })();
        } catch (err) {
          console.error('Session stream error:', err);
        }
      })();
    }
  } catch (e) {
    console.warn('⚠️ HTTP/3 Server Error:', e.message);
  }
}

/**
 * Helper to read exactly N bytes from a stream reader
 */
async function readExact(reader, n, leftover = null) {
  const buffer = Buffer.alloc(n);
  let offset = 0;

  if (leftover && leftover.length > 0) {
    const toCopy = Math.min(leftover.length, n);
    Buffer.from(leftover).copy(buffer, 0, 0, toCopy);
    offset += toCopy;
    if (toCopy < leftover.length) {
      return { buffer, leftover: leftover.subarray(toCopy) };
    }
  }

  while (offset < n) {
    const { done, value } = await reader.read();
    if (done) {
      if (offset === 0) return { buffer: null, leftover: null };
      throw new Error(`Unexpected end of stream, needed ${n} bytes but got ${offset}`);
    }

    const valBuf = Buffer.from(value);
    const toCopy = Math.min(valBuf.length, n - offset);
    valBuf.copy(buffer, offset, 0, toCopy);
    offset += toCopy;

    if (toCopy < valBuf.length) {
      return { buffer, leftover: valBuf.subarray(toCopy) };
    }
  }

  return { buffer, leftover: null };
}

async function handleWTStream(stream, isUni = false) {
  const reader = stream.readable.getReader();
  const writer = isUni ? null : stream.writable.getWriter();
  let uploadInfo = null;
  let fileId = null;
  let leftover = null;

  try {
    while (true) {
      const { buffer: typeBuf, leftover: nextLeftover1 } = await readExact(reader, 1, leftover);
      leftover = nextLeftover1;
      if (!typeBuf) break;
      const msgType = typeBuf[0];

      const { buffer: lenBuf, leftover: nextLeftover2 } = await readExact(reader, 4, leftover);
      leftover = nextLeftover2;
      if (!lenBuf) throw new Error('Stream closed while reading message length');
      const msgLen = lenBuf.readUInt32LE(0);

      const { buffer: msgBuf, leftover: nextLeftover3 } = await readExact(reader, msgLen, leftover);
      leftover = nextLeftover3;
      if (!msgBuf) throw new Error('Stream closed while reading message content');

      if (msgType === 0) {
        const text = new TextDecoder().decode(msgBuf);
        const message = JSON.parse(text);

        if (message.type === 'init') {
          const token = message.auth?.headers?.Authorization || message.auth?.params?.token;
          if (
            config.AUTH_TOKEN &&
            token !== `Bearer ${config.AUTH_TOKEN}` &&
            token !== config.AUTH_TOKEN
          ) {
            console.log('❌ WT Auth Failed: Invalid token');
            if (writer) {
              const response = JSON.stringify({
                type: 'error',
                fileId: message.fileId,
                error: 'Unauthorized: Invalid or missing token',
              });
              await writer.write(new TextEncoder().encode(response));
              await sleep(100);
              await writer.close();
            }
            return;
          }

          fileId = message.fileId;
          const fileName = message.fileName || '';

          if (!fileId) {
            console.error('❌ WT Init: No fileId provided by client');
            return;
          }

          const isAllowed =
            fileName.toLowerCase().endsWith('.pdf') || fileName.toLowerCase().endsWith('.txt');
          if (!isAllowed) {
            console.log(`❌ WT Validation Failed: Invalid file type attempt: ${fileName}`);
            if (writer) {
              const response = JSON.stringify({
                fileId: fileId,
                success: false,
                code: 'INVALID_FILE_TYPE',
                message: 'Invalid file type. Only PDF and TXT files are allowed.',
              });
              await writer.write(new TextEncoder().encode(response));
              await sleep(100);
              await writer.close();
            }
            return;
          }

          const bytesUploaded = message.bytesUploaded || 0;

          if (wtUploads.has(fileId)) {
            uploadInfo = wtUploads.get(fileId);
            console.log(`🚀 WT Resume: ${uploadInfo.fileName} (ID: ${fileId})`);
          } else {
            const chunkDir = path.join(config.CHUNKS_DIR, fileId);
            ensureDirSync(chunkDir);

            uploadInfo = {
              fileName: message.fileName,
              totalChunks: message.totalChunks,
              receivedChunks: Math.floor(bytesUploaded / 16384),
              receivedBytes: bytesUploaded,
              chunkDir: chunkDir,
            };

            wtUploads.set(fileId, uploadInfo);
            console.log(`🚀 WT New Session: ${message.fileName} (ID: ${fileId})`);
          }

          if (writer) {
            const ackResponse = JSON.stringify({
              type: 'init_ack',
              fileId: fileId,
            });
            await writer.write(new TextEncoder().encode(ackResponse));
          }
        } else if (message.type === 'chunk') {
          if (uploadInfo) {
            uploadInfo.nextChunkIndex = message.chunkIndex;
          }
        } else if (message.type === 'complete') {
          if (uploadInfo) {
            console.log(`🏁 WT Complete for: ${uploadInfo.fileName} (ID: ${fileId})`);
            const finalFilePath = path.join(
              config.UPLOADS_DIR,
              `${Date.now()}-${uploadInfo.fileName}`,
            );

            await mergeChunks(uploadInfo.chunkDir, finalFilePath, uploadInfo.totalChunks);
            console.log(`✅ Merged to: ${finalFilePath}`);

            if (writer) {
              const response = JSON.stringify({
                type: 'complete',
                success: true,
                uploadId: fileId,
                url: `/uploads/${path.basename(finalFilePath)}`,
                message: 'File upload completed successfully',
              });
              await writer.write(new TextEncoder().encode(response));
              await writer.close();
            }
            wtUploads.delete(fileId);
            return;
          }
        }
      } else if (msgType === 1) {
        if (uploadInfo && typeof uploadInfo.nextChunkIndex === 'number') {
          const chunkIndex = uploadInfo.nextChunkIndex;
          const chunkPath = path.join(uploadInfo.chunkDir, `chunk-${chunkIndex}`);
          fs.writeFileSync(chunkPath, msgBuf);
          uploadInfo.receivedChunks += 1;

          console.log(
            `📦 Chunk ${chunkIndex + 1}/${uploadInfo.totalChunks} saved (${msgBuf.length} bytes)`,
          );

          if (writer) {
            const progressResponse = JSON.stringify({
              type: 'progress',
              fileId: fileId,
              chunksReceived: uploadInfo.receivedChunks,
              chunkIndex: chunkIndex,
            });
            try {
              await writer.write(new TextEncoder().encode(progressResponse));
            } catch {
              // eslint-disable-next-line
            }
          }
          delete uploadInfo.nextChunkIndex;
        } else {
          console.warn('⚠️ Received binary data but no chunk index was set');
        }
      }
    }
  } catch (err) {
    console.error('❌ WT Stream handling error:', err);
    if (fileId) wtUploads.delete(fileId);
  }
}
