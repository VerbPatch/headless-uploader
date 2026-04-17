import multer from 'multer';
import path from 'path';
import { config } from '../config.js';
import { ensureDirSync, mergeChunks } from '../utils.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { chunkIndex, totalChunks, fileId } = req.body || {};
    if (fileId && chunkIndex !== undefined && totalChunks) {
      const chunkDir = path.join(config.CHUNKS_DIR, fileId);
      ensureDirSync(chunkDir);
      cb(null, chunkDir);
    } else {
      cb(null, config.UPLOADS_DIR);
    }
  },
  filename: function (req, file, cb) {
    const { chunkIndex, totalChunks, fileId } = req.body || {};
    if (fileId && chunkIndex !== undefined && totalChunks) {
      cb(null, `chunk-${chunkIndex}`);
    } else {
      cb(null, file.originalname);
    }
  },
});

const upload = multer({ storage });

export function setupHTTP(app) {
  app.post('/upload', upload.any(), async (req, res) => {
    try {
      // Simple Auth Check
      const authHeader = req.headers.authorization;
      if (
        config.AUTH_TOKEN &&
        authHeader !== `Bearer ${config.AUTH_TOKEN}` &&
        authHeader !== config.AUTH_TOKEN
      ) {
        console.log(`❌ HTTP Auth Failed: Invalid token`);
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Invalid or missing token',
        });
      }

      const { chunkIndex, totalChunks, filename, fileId } = req.body || {};
      console.log({ chunkIndex, totalChunks, filename, fileId });
      if (fileId && chunkIndex !== undefined && totalChunks) {
        const currentChunkIndex = parseInt(chunkIndex);
        const totalChunksCount = parseInt(totalChunks);

        if (isNaN(currentChunkIndex) || isNaN(totalChunksCount)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid chunk index or total chunks',
          });
        }

        if (currentChunkIndex === totalChunksCount - 1) {
          const chunkDir = path.join(config.CHUNKS_DIR, fileId);
          const finalFilePath = path.join(config.UPLOADS_DIR, `${Date.now()}-${filename}`);

          try {
            await mergeChunks(chunkDir, finalFilePath, totalChunksCount);
            return res.json({
              success: true,
              message: 'All chunks received and file merged.',
              path: finalFilePath,
            });
          } catch (error) {
            console.error('Merge error:', error);
            return res.status(500).json({
              success: false,
              message: 'Merge failed',
              error: error.message,
            });
          }
        }

        return res.json({
          success: true,
          message: `Chunk ${currentChunkIndex} uploaded`,
        });
      } else {
        if (!req.files || req.files.length === 0) {
          return res.status(400).json({ success: false, message: 'No file provided' });
        }

        return res.json({
          success: true,
          message: 'File uploaded via HTTP',
          file: {
            name: req.files[0].originalname,
            size: req.files[0].size,
            path: req.files[0].path,
          },
        });
      }
    } catch (error) {
      console.error('Upload handler error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message,
      });
    }
  });
}
