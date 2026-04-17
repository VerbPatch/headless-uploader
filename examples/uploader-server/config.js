import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const config = {
  APP_PORT: 3000,
  WEBTRANSPORT_PORT: 4443,
  UPLOADS_DIR: path.join(__dirname, 'uploads'),
  CHUNKS_DIR: path.join(__dirname, 'uploads', 'chunks'),
  AUTH_TOKEN: 'verbpatch-secret-token', // For demonstration
  WT_HTML_PATH: path.join(__dirname, 'test', 'test-webtransport.html'),
};

export const corsOptions = {
  origin: (origin, callback) => {
    callback(null, origin || '*');
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Custom-Header',
    'X-Tus-Header',
    'Tus-Resumable',
    'Upload-Length',
    'Upload-Metadata',
    'Upload-Offset',
    'Upload-Concat',
    'Upload-Defer-Length',
    'Tus-Extension',
    'Tus-Max-Size',
    'Tus-Checksum-Algorithm',
  ],
  exposedHeaders: [
    'Location',
    'Upload-Offset',
    'Tus-Resumable',
    'Tus-Version',
    'Tus-Extension',
    'Tus-Max-Size',
    'Tus-Checksum-Algorithm',
    'Upload-Metadata',
  ],
};
