import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import websocket from '@fastify/websocket';
import fastifyStatic from '@fastify/static';

import { config, corsOptions } from './config.js';
import { ensureDirSync } from './utils.js';
import { startCleanupJob } from './cleanup.js';
import { setupHTTP } from './protocols/http.js';
import { setupTUS } from './protocols/tus.js';
import { setupCloud } from './protocols/cloud.js';
import { setupWebSocket } from './protocols/websocket.js';

const start = async () => {
  ensureDirSync(config.UPLOADS_DIR);
  ensureDirSync(config.CHUNKS_DIR);

  startCleanupJob();

  const fastify = Fastify({
    logger: true,
    connectionTimeout: 0,
    keepAliveTimeout: 0,
  });

  await fastify.register(cors, corsOptions);
  await fastify.register(multipart, {
    limits: {
      fieldNameSize: 100,
      fieldSize: 100,
      fields: 10,
      fileSize: 1024 * 1024 * 100,
      files: 1,
    },
  });
  await fastify.register(websocket, {
    maxPayload: 1024 * 1024 * 100,
  });
  await fastify.register(fastifyStatic, {
    root: config.UPLOADS_DIR,
    prefix: '/uploads/',
  });

  fastify.get('/health', async () => {
    return 'OK';
  });

  setupHTTP(fastify);
  setupTUS(fastify);
  setupCloud(fastify);
  setupWebSocket(fastify);

  const protocol = 'http';
  const listenTarget = process.env.PORT || config.APP_PORT;
  const isPipe = isNaN(Number(listenTarget));
  const listenOptions = isPipe
    ? { path: listenTarget }
    : { port: Number(listenTarget), host: config.APP_HOST };

  try {
    fastify.listen(listenOptions);

    const displayPort = isPipe ? '[IIS Named Pipe]' : listenTarget;
    console.log(
      `\n🚀 ${protocol.toUpperCase()} Server running on ${protocol}://${config.APP_HOST}:${displayPort}`,
    );
    console.log(`\n📍 Available Endpoints:`);
    console.log(`   - HTTP Upload: ${protocol}://${config.APP_HOST}:${displayPort}/upload`);
    console.log(`   - TUS Upload: ${protocol}://${config.APP_HOST}:${displayPort}/tus/`);
    console.log(`   - Cloud (S3): ${protocol}://${config.APP_HOST}:${displayPort}/generate-s3-url`);
    console.log(
      `   - Cloud (Azure): ${protocol}://${config.APP_HOST}:${displayPort}/generate-azure-sas`,
    );
    console.log(
      `   - Cloud (GCS): ${protocol}://${config.APP_HOST}:${displayPort}/generate-gcs-url`,
    );
    console.log(
      `   - WebSocket: ${protocol === 'https' ? 'wss' : 'ws'}://${config.APP_HOST}:${displayPort}/ws-upload`,
    );
    console.log('\n' + '='.repeat(60) + '\n');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
