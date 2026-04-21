import fs from 'fs/promises';
import path from 'path';
import { config } from '../config.js';
import { ensureDirSync, mergeChunks } from '../utils.js';

const wsUploads = new Map();

export function setupWebSocket(fastify) {
  // Add a pre-handler to log incoming WS handshake attempts
  fastify.addHook('onRequest', async (request) => {
    if (request.url === '/ws-upload') {
      console.log(
        `[WS Handshake] Incoming request from ${request.ip}. Upgrade: ${request.headers.upgrade}`,
      );
    }
  });

  fastify.get('/ws-upload', { websocket: true }, (connection, req) => {
    // Robustly find the WebSocket instance
    const ws = connection.socket || connection;

    if (!ws) {
      console.error('❌ WS Error: No socket found in connection object', req);
      return;
    }

    console.log('✅ WS Connection established successfully');

    // Heartbeat mechanism
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    const interval = setInterval(() => {
      if (ws.readyState === ws.CLOSED || ws.readyState === ws.CLOSING) {
        clearInterval(interval);
        return;
      }
      if (ws.isAlive === false) {
        console.log('WS: Terminating connection due to heartbeat failure');
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    }, 30000);

    ws.on('close', () => {
      console.log('WS Connection closed');
      clearInterval(interval);
    });

    ws.chunkMetadataQueue = new Map();

    ws.on('error', (err) => {
      console.error('WS Socket Error:', err);
    });

    ws.on('message', async (message, isBinary) => {
      try {
        if (!isBinary) {
          const data = JSON.parse(message.toString());

          if (data.type === 'init') {
            const token = data.auth?.headers?.Authorization || data.auth?.params?.token;
            if (
              config.AUTH_TOKEN &&
              token !== `Bearer ${config.AUTH_TOKEN}` &&
              token !== config.AUTH_TOKEN
            ) {
              console.log(`❌ WS Auth Failed: Invalid token`);
              ws.send(
                JSON.stringify({ type: 'error', fileId: data.fileId, error: 'Unauthorized' }),
              );
              setTimeout(() => ws.close(4001, 'Unauthorized'), 100);
              return;
            }

            const fileId = data.fileId;
            const fileName = data.fileName || '';

            // Validate PDF only
            const isPdf = fileName.toLowerCase().endsWith('.pdf');
            if (!isPdf) {
              console.log(`❌ WS Validation Failed: Non-PDF file attempt: ${fileName}`);
              ws.send(
                JSON.stringify({
                  fileId: data.fileId,
                  success: false,
                  code: 'INVALID_FILE_TYPE',
                  message: 'Invalid file type. Only PDF files are allowed.',
                }),
              );
              return;
            }

            const chunkDir = path.join(config.CHUNKS_DIR, fileId);
            ensureDirSync(chunkDir);

            const bytesUploaded = data.bytesUploaded || 0;
            wsUploads.set(fileId, {
              fileName: data.fileName,
              totalChunks: data.totalChunks,
              receivedChunks: Math.floor(bytesUploaded / (config.chunkSize || 64 * 1024)),
              receivedBytes: bytesUploaded,
              chunkDir: chunkDir,
            });

            ws.chunkMetadataQueue.set(fileId, []);
            console.log(`WS Init: ${data.fileName}`);

            ws.send(JSON.stringify({ type: 'init_ack', fileId: data.fileId }));
          } else if (data.type === 'chunk') {
            const fileId = data.fileId;
            if (!ws.chunkMetadataQueue.has(fileId)) ws.chunkMetadataQueue.set(fileId, []);
            ws.chunkMetadataQueue.get(fileId).push(data);
          } else if (data.type === 'complete') {
            const upload = wsUploads.get(data.fileId);
            if (upload) {
              try {
                const finalFilePath = path.join(
                  config.UPLOADS_DIR,
                  `${Date.now()}-${upload.fileName}`,
                );
                await mergeChunks(upload.chunkDir, finalFilePath, upload.totalChunks);
                ws.send(
                  JSON.stringify({
                    type: 'complete',
                    fileId: data.fileId,
                    success: true,
                    url: `/uploads/${path.basename(finalFilePath)}`,
                  }),
                );
              } catch (mergeError) {
                ws.send(
                  JSON.stringify({
                    type: 'complete',
                    fileId: data.fileId,
                    success: false,
                    message: mergeError.message,
                  }),
                );
              } finally {
                wsUploads.delete(data.fileId);
                ws.chunkMetadataQueue.delete(data.fileId);
              }
            }
          }
        } else {
          let chunkInfo = null;
          let fileId = null;

          for (const [fId, metadataQueue] of ws.chunkMetadataQueue.entries()) {
            if (metadataQueue.length > 0) {
              chunkInfo = metadataQueue.shift();
              fileId = fId;
              break;
            }
          }

          if (chunkInfo && fileId) {
            const upload = wsUploads.get(fileId);
            if (upload) {
              const chunkPath = path.join(upload.chunkDir, `chunk-${chunkInfo.chunkIndex}`);
              await fs.writeFile(chunkPath, message);
              upload.receivedChunks += 1;
              upload.receivedBytes += message.length;

              if (ws.readyState === ws.OPEN) {
                ws.send(
                  JSON.stringify({
                    type: 'progress',
                    fileId: fileId,
                    bytesUploaded: upload.receivedBytes,
                    chunksReceived: upload.receivedChunks,
                  }),
                );
              }
            }
          }
        }
      } catch (e) {
        console.error('WS Message Handler Error:', e);
      }
    });
  });
}
