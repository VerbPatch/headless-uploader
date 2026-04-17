import { Server } from '@tus/server';
import { FileStore } from '@tus/file-store';
import { config } from '../config.js';

let tusServer;

export function initTUS() {
  tusServer = new Server({
    path: '/tus',
    datastore: new FileStore({
      directory: config.UPLOADS_DIR,
    }),
  });
  return tusServer;
}

export function setupTUS(app) {
  if (!tusServer) {
    initTUS();
  }

  app.all(['/tus', '/tus/*path'], (req, res) => {
    // Simple Auth Check
    const authHeader = req.headers.authorization;
    if (
      config.AUTH_TOKEN &&
      authHeader !== `Bearer ${config.AUTH_TOKEN}` &&
      authHeader !== config.AUTH_TOKEN
    ) {
      console.log(`❌ TUS Auth Failed: Invalid token`);
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid or missing token',
      });
    }

    tusServer.handle(req, res);
  });
}
