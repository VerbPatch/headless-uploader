import fs from 'fs';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';

import { config, corsOptions } from './config.js';
import { ensureDirSync } from './utils.js';
import { startCleanupJob } from './cleanup.js';
import { setupWebTransport, getWebTransportFingerprint } from './protocols/webtransport.js';

const start = async () => {
  // Ensure directories exist
  ensureDirSync(config.UPLOADS_DIR);
  ensureDirSync(config.CHUNKS_DIR);

  // Start background cleanup job
  startCleanupJob();

  const fastify = Fastify({
    logger: true,
    connectionTimeout: 0,
    keepAliveTimeout: 0,
  });

  // Register Plugins
  await fastify.register(cors, corsOptions);
  await fastify.register(fastifyStatic, {
    root: config.UPLOADS_DIR,
    prefix: '/uploads/',
  });

  // Health Check
  fastify.get('/health', async () => {
    return 'OK';
  });

  // --- WebTransport Setup ---
  setupWebTransport();

  fastify.get('/webtransport-config', async () => {
    const certHash = getWebTransportFingerprint();
    return { certHash };
  });

  fastify.get('/test-webtransport', async (request, reply) => {
    const html = fs.readFileSync(config.WT_HTML_PATH, 'utf8');
    return reply.type('text/html').send(html);
  });

  // Start HTTP Server (for config and static files)
  const listenTarget = process.env.PORT || config.APP_PORT;
  const isPipe = isNaN(Number(listenTarget));
  const listenOptions = isPipe
    ? { path: listenTarget }
    : { port: Number(listenTarget), host: '0.0.0.0' };

  try {
    console.log({ port: listenOptions });
    fastify.listen(listenOptions);
    console.log(
      `🚀 WebTransport Config Server running on http://${config.APP_HOST}:${listenTarget}`,
    );
    console.log(
      `📍 WebTransport Endpoint: https://${config.APP_HOST}:${config.WEBTRANSPORT_PORT}/wt-upload`,
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
