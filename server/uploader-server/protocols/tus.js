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
      // Validate PDF only for creation requests
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
  });
  return tusServer;
}

export function setupTUS(fastify) {
  if (!tusServer) {
    initTUS();
  }

  // Allow TUS content types to pass through without Fastify parsing them
  fastify.addContentTypeParser('application/offset+octet-stream', (request, payload, done) => {
    done(null, payload);
  });

  // Fastify route for TUS
  fastify.all('/tus', (req, reply) => {
    handleTusRequest(req, reply);
  });

  fastify.all('/tus/*', (req, reply) => {
    handleTusRequest(req, reply);
  });
}

function handleTusRequest(req, reply) {
  // Allow OPTIONS requests for CORS preflight
  if (req.method === 'OPTIONS') {
    return tusServer.handle(req.raw, reply.raw);
  }

  // Simple Auth Check
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

  // TUS handles the response using raw node objects
  tusServer.handle(req.raw, reply.raw);
}
