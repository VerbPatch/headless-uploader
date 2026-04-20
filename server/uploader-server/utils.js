import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

export function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export async function mergeChunks(chunkDir, outputPath, totalChunks) {
  const writeStream = fs.createWriteStream(outputPath);

  try {
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(chunkDir, `chunk-${i}`);

      if (!fs.existsSync(chunkPath)) {
        throw new Error(`Chunk ${i} is missing at ${chunkPath}`);
      }

      const readStream = fs.createReadStream(chunkPath);
      await pipeline(readStream, writeStream, { end: false });

      fs.unlinkSync(chunkPath);
    }

    writeStream.end();

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    fs.rmdirSync(chunkDir);
  } catch (error) {
    writeStream.destroy();
    throw error;
  }
}
