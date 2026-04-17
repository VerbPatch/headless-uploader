import fs from 'fs';
import path from 'path';
import http from 'http';
import { WebSocketServer } from 'ws';
import { config } from '../config.js';
import { ensureDirSync, mergeChunks } from '../utils.js';

const wsUploads = new Map();

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws) => {
    console.log('WS Connection established');

    ws.chunkMetadataQueue = new Map();

    ws.on('message', async (message, isBinary) => {
      try {
        if (!isBinary) {
          const data = JSON.parse(message.toString());

          if (data.type === 'init') {
            // Simple Auth Check
            const token = data.auth?.headers?.Authorization || data.auth?.params?.token;
            if (
              config.AUTH_TOKEN &&
              token !== `Bearer ${config.AUTH_TOKEN}` &&
              token !== config.AUTH_TOKEN
            ) {
              console.log(`❌ WS Auth Failed: Invalid token`);
              ws.send(
                JSON.stringify({
                  type: 'error',
                  fileId: data.fileId,
                  error: 'Unauthorized: Invalid or missing token',
                }),
              );
              // Close the socket after a small delay to ensure the error message is sent
              setTimeout(() => {
                ws.close(4001, 'Unauthorized');
              }, 100);
              return;
            }

            const fileId = data.fileId;
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

            console.log(`WS Init: ${data.fileName} (Resuming from ${bytesUploaded} bytes)`);

            // Send Ack to client to start sending chunks
            ws.send(
              JSON.stringify({
                type: 'init_ack',
                fileId: data.fileId,
              }),
            );
          } else if (data.type === 'chunk') {
            const fileId = data.fileId;
            if (!ws.chunkMetadataQueue.has(fileId)) {
              ws.chunkMetadataQueue.set(fileId, []);
            }
            ws.chunkMetadataQueue.get(fileId).push(data);
            console.log(
              `WS Chunk metadata queued: chunk ${data.chunkIndex + 1}/${data.totalChunks}`,
            );
          } else if (data.type === 'complete') {
            const upload = wsUploads.get(data.fileId);
            if (upload) {
              console.log(`WS Complete: ${upload.fileName}`);

              try {
                const finalFilePath = path.join(
                  config.UPLOADS_DIR,
                  `${Date.now()}-${upload.fileName}`,
                );

                await mergeChunks(upload.chunkDir, finalFilePath, upload.totalChunks);

                console.log(`  ✅ Merged to: ${finalFilePath}`);

                ws.send(
                  JSON.stringify({
                    type: 'complete',
                    fileId: data.fileId,
                    success: true,
                    url: `/uploads/${path.basename(finalFilePath)}`,
                  }),
                );

                wsUploads.delete(data.fileId);
                ws.chunkMetadataQueue.delete(data.fileId);
              } catch (mergeError) {
                console.error(`  ❌ Merge failed: ${mergeError.message}`);
                ws.send(
                  JSON.stringify({
                    type: 'complete',
                    fileId: data.fileId,
                    success: false,
                    message: `Merge failed: ${mergeError.message}`,
                  }),
                );
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
              fs.writeFileSync(chunkPath, message);
              upload.receivedChunks += 1;
              upload.receivedBytes += message.length;

              console.log(
                `  Chunk ${chunkInfo.chunkIndex + 1}/${upload.totalChunks} saved (${message.length} bytes)`,
              );

              ws.send(
                JSON.stringify({
                  type: 'progress',
                  fileId: fileId,
                  bytesUploaded: upload.receivedBytes,
                  chunksReceived: upload.receivedChunks,
                }),
              );
            } else {
              console.warn(`Upload not found for fileId: ${fileId}`);
            }
          } else {
            console.warn('Binary data received but no chunk metadata in queue');
          }
        }
      } catch (e) {
        console.error('WS Error:', e);
      }
    });
  });

  server.on('upgrade', (request, socket, head) => {
    if (request.url === '/ws-upload') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });
}
