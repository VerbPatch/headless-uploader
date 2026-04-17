import express from 'express';
import cors from 'cors';
import http from 'http';

import { config, corsOptions } from './config.js';
import { ensureDirSync } from './utils.js';
import { startCleanupJob } from './cleanup.js';
import { setupHTTP } from './protocols/http.js';
import { setupTUS } from './protocols/tus.js';
import { setupCloud } from './protocols/cloud.js';
import { setupWebSocket } from './protocols/websocket.js';
import { setupWebTransport, getWebTransportFingerprint } from './protocols/webtransport.js';

// Ensure directories exist
ensureDirSync(config.UPLOADS_DIR);
ensureDirSync(config.CHUNKS_DIR);

// Start background cleanup job
startCleanupJob();

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

// --- HTTP Implementation ---
setupHTTP(app);

// --- TUS Implementation ---
setupTUS(app);

// --- Cloud Implementation ---
setupCloud(app);

// --- WebSocket Implementation ---
const server = http.createServer(app);
setupWebSocket(server);

// --- HTTP/3 & WebTransport Implementation ---
setupWebTransport();

app.get('/webtransport-config', (req, res) => {
  const certHash = getWebTransportFingerprint();
  res.json({ certHash });
});

app.get('/test-webtransport', (req, res) => {
  res.sendFile(config.WT_HTML_PATH);
});

server.on('error', (e) => {
  console.log('Server Error', e);
});

// Start Servers
const protocol = 'http';
server.listen(config.APP_PORT, () => {
  console.log(
    `\n🚀 ${protocol.toUpperCase()} Server running on ${protocol}://localhost:${config.APP_PORT}`,
  );
  console.log(`\n📍 Available Endpoints:`);
  console.log(`   - HTTP Upload: ${protocol}://localhost:${config.APP_PORT}/upload`);
  console.log(`   - TUS Upload: ${protocol}://localhost:${config.APP_PORT}/tus/`);
  console.log(`   - Cloud (S3): ${protocol}://localhost:${config.APP_PORT}/generate-s3-url`);
  console.log(`   - Cloud (Azure): ${protocol}://localhost:${config.APP_PORT}/generate-azure-sas`);
  console.log(`   - Cloud (GCS): ${protocol}://localhost:${config.APP_PORT}/generate-gcs-url`);
  console.log(
    `   - WebSocket: ${protocol === 'https' ? 'wss' : 'ws'}://localhost:${config.APP_PORT}/ws-upload`,
  );
  console.log(
    `   - WebTransport Test: ${protocol}://localhost:${config.APP_PORT}/test-webtransport`,
  );
  console.log('\n' + '='.repeat(60) + '\n');
});
