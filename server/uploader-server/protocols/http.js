import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream/promises';
import { config } from '../config.js';
import { ensureDirSync, mergeChunks } from '../utils.js';

export function setupHTTP(fastify) {
  fastify.post('/upload', async (req, reply) => {
    try {
      const authHeader = req.headers.authorization;
      if (
        config.AUTH_TOKEN &&
        authHeader !== `Bearer ${config.AUTH_TOKEN}` &&
        authHeader !== config.AUTH_TOKEN
      ) {
        console.log('❌ HTTP Auth Failed: Invalid token');
        return reply.status(401).send({
          success: false,
          message: 'Unauthorized: Invalid or missing token',
        });
      }

      const parts = req.parts();
      const body = {};
      let fileInfo = null;

      for await (const part of parts) {
        if (part.file) {
          const isPdf =
            part.mimetype === 'application/pdf' ||
            (part.filename && part.filename.toLowerCase().endsWith('.pdf'));

          if (!isPdf) {
            return reply.status(400).send({
              success: false,
              code: 'INVALID_FILE_TYPE',
              message: 'Invalid file type. Only PDF files are allowed.',
            });
          }

          const chunkIndex = body.chunkIndex;
          const totalChunks = body.totalChunks;
          const fileId = body.fileId;

          let savePath;
          if (fileId && chunkIndex !== undefined && totalChunks) {
            const chunkDir = path.join(config.CHUNKS_DIR, String(fileId));
            ensureDirSync(chunkDir);
            savePath = path.join(chunkDir, `chunk-${chunkIndex}`);
          } else {
            savePath = path.join(config.UPLOADS_DIR, part.filename);
          }

          const writeStream = fs.createWriteStream(savePath);
          await pipeline(part.file, writeStream);

          fileInfo = {
            name: part.filename,
            path: savePath,
          };
        } else {
          body[part.fieldname] = part.value;
        }
      }

      const { chunkIndex, totalChunks, filename, fileId } = body;

      if (fileId && chunkIndex !== undefined && totalChunks) {
        const currentChunkIndex = parseInt(chunkIndex);
        const totalChunksCount = parseInt(totalChunks);

        if (isNaN(currentChunkIndex) || isNaN(totalChunksCount)) {
          return reply.status(400).send({
            success: false,
            message: 'Invalid chunk index or total chunks',
          });
        }

        if (currentChunkIndex === totalChunksCount - 1) {
          const chunkDir = path.join(config.CHUNKS_DIR, String(fileId));
          const finalFilePath = path.join(
            config.UPLOADS_DIR,
            `${Date.now()}-${filename || 'file'}`,
          );

          try {
            await mergeChunks(chunkDir, finalFilePath, totalChunksCount);
            return reply.send({
              success: true,
              message: 'All chunks received and file merged.',
              path: finalFilePath,
            });
          } catch (error) {
            console.error('Merge error:', error);
            return reply.status(500).send({
              success: false,
              message: 'Merge failed',
              error: error.message,
            });
          }
        }

        return reply.send({
          success: true,
          message: `Chunk ${currentChunkIndex} uploaded`,
        });
      } else {
        if (!fileInfo) {
          return reply.status(400).send({ success: false, message: 'No file provided' });
        }

        const stats = fs.statSync(fileInfo.path);
        return reply.send({
          success: true,
          message: 'File uploaded via HTTP',
          file: {
            name: fileInfo.name,
            size: stats.size,
            path: fileInfo.path,
          },
        });
      }
    } catch (error) {
      console.error('Upload handler error:', error);
      return reply.status(500).send({
        success: false,
        message: 'Server error',
        error: error.message,
      });
    }
  });
}
