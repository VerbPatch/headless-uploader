import fs from 'fs';
import path from 'path';
import { Server } from '@tus/server';
import { FileStore } from '@tus/file-store';
import { config } from '../config.js';

let tusServer;

export function initTUS() {
  tusServer = new Server({
    path: '/tus',
    relativeLocation: true,
    datastore: new FileStore({
      directory: config.UPLOADS_DIR,
    }),
    onUploadCreate: async (req, upload) => {
      if (req.method === 'POST') {
        const filetype = upload.metadata.filetype || '';
        const filename = upload.metadata.filename || '';

        const isPdf = filetype === 'application/pdf' || filename.toLowerCase().endsWith('.pdf');

        if (!isPdf) {
          throw {
            status_code: 400,
            body: JSON.stringify({
              success: false,
              code: 'INVALID_FILE_TYPE',
              message: 'Invalid file type. Only PDF files are allowed.',
            }),
          };
        } else {
          return upload.metadata;
        }
      }
    },
    onUploadFinish: async (req, upload) => {
      const { id, metadata } = upload;
      if (metadata.filename) {
        const oldPath = path.join(config.UPLOADS_DIR, id);
        const newPath = path.join(config.UPLOADS_DIR, `${Date.now()}-${metadata.filename}`);

        if (fs.existsSync(oldPath)) {
          fs.renameSync(oldPath, newPath);
          console.log(`✅ TUS: File ${id} renamed to ${path.basename(newPath)}`);
        }
      }
    },
  });
  return tusServer;
}

export function setupTUS(fastify) {
  if (!tusServer) {
    initTUS();
  }

  fastify.addContentTypeParser('application/offset+octet-stream', (request, payload, done) => {
    done(null, payload);
  });

  fastify.all('/tus', (req, reply) => {
    handleTusRequest(req, reply);
  });

  fastify.all('/tus/*', (req, reply) => {
    handleTusRequest(req, reply);
  });
}

function handleTusRequest(req, reply) {
  if (req.method === 'OPTIONS') {
    return tusServer.handle(req.raw, reply.raw);
  }

  const authHeader = req.headers.authorization;
  if (
    config.AUTH_TOKEN &&
    authHeader !== `Bearer ${config.AUTH_TOKEN}` &&
    authHeader !== config.AUTH_TOKEN
  ) {
    console.log(`❌ TUS Auth Failed: Invalid token`);
    return reply.status(401).send({
      success: false,
      message: 'Unauthorized: Invalid or missing token',
    });
  }

  tusServer.handle(req.raw, reply.raw);
}
