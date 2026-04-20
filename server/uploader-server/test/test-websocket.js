import { WebSocket } from 'ws';

const fileData = 'Hello WebSocket protocol! This is a test upload using bidirectional streaming.';
const fileName = 'test-file-websocket.txt';
const chunkSize = 20;
const WS_URL = 'ws://localhost:3000/ws-upload';
const fileId = `test-${Date.now()}`;

async function runTest() {
  return new Promise((resolve, reject) => {
    try {
      console.log('--- WebSocket Protocol Test ---');
      console.log(`File ID: ${fileId}`);
      console.log(`File Name: ${fileName}`);
      console.log(`File Size: ${Buffer.byteLength(fileData)} bytes\n`);

      const ws = new WebSocket(WS_URL);
      let uploadComplete = false;
      const totalChunks = Math.ceil(fileData.length / chunkSize);

      ws.on('open', () => {
        console.log('✅ WebSocket Connected\n');

        // Send init message
        const initMessage = {
          type: 'init',
          fileId: fileId,
          fileName: fileName,
          totalChunks: totalChunks,
          totalSize: Buffer.byteLength(fileData),
        };

        console.log('--- Sending Init Message ---');
        ws.send(JSON.stringify(initMessage));

        // Wait a bit, then start sending chunks
        setTimeout(() => {
          console.log('--- Uploading Chunks ---\n');
          uploadChunks();
        }, 100);
      });

      function uploadChunks() {
        for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, fileData.length);
          const chunkData = fileData.slice(start, end);

          // First send chunk metadata
          const chunkMetadata = {
            type: 'chunk',
            fileId: fileId,
            chunkIndex: i,
            totalChunks: totalChunks,
            chunkSize: chunkData.length,
          };

          console.log(`Chunk ${i + 1}/${totalChunks} - Size: ${chunkData.length} bytes`);
          ws.send(JSON.stringify(chunkMetadata));

          // Then send chunk data
          setTimeout(
            () => {
              ws.send(Buffer.from(chunkData));
            },
            50 + i * 50,
          );
        }

        // Send complete message after all chunks
        setTimeout(
          () => {
            console.log('\n--- Sending Complete Message ---');
            const completeMessage = {
              type: 'complete',
              fileId: fileId,
            };
            ws.send(JSON.stringify(completeMessage));
          },
          50 + totalChunks * 50,
        );
      }

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);

          if (message.type === 'progress') {
            console.log(`Progress: ${message.bytesUploaded} bytes uploaded`);
          } else if (message.type === 'complete') {
            if (message.success) {
              console.log(`✅ Upload Complete!`);
              console.log(`File URL: ${message.url}\n`);
              console.log('✅ WebSocket Upload Test Completed Successfully!');
              uploadComplete = true;
              ws.close();
              resolve();
            }
          }
        } catch (e) {
          console.error('Message parse error:', e.message);
        }
      });

      ws.on('close', () => {
        console.log('WebSocket Closed');
        if (uploadComplete) {
          resolve();
        } else {
          reject(new Error('WebSocket closed before upload completed'));
        }
      });

      ws.on('error', (error) => {
        console.error('❌ WebSocket Error:', error.message);
        reject(error);
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!uploadComplete) {
          ws.close();
          reject(new Error('Upload timeout'));
        }
      }, 30000);
    } catch (error) {
      reject(error);
    }
  });
}

runTest().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
