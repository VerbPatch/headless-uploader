import fs from 'fs';
import path from 'path';
import { config } from './config.js';

/**
 * Background job to delete files older than a certain age
 */
const CLEANUP_INTERVAL = 60 * 1000;
const MAX_AGE_MS = 2 * 60 * 1000;

async function performCleanup(dirPath) {
  if (!fs.existsSync(dirPath)) return;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const now = Date.now();

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await performCleanup(fullPath);

      if (
        fullPath !== config.UPLOADS_DIR &&
        fullPath !== config.CHUNKS_DIR &&
        fs.readdirSync(fullPath).length === 0
      ) {
        try {
          fs.rmdirSync(fullPath);
          console.log(`[Cleanup] Removed empty directory: ${entry.name}`);
        } catch {
          // eslint-disable-next-line
        }
      }
    } else {
      try {
        const stats = fs.statSync(fullPath);
        const age = now - stats.mtimeMs;

        if (age > MAX_AGE_MS) {
          fs.unlinkSync(fullPath);
          console.log(`[Cleanup] Deleted file: ${entry.name} (Age: ${Math.round(age / 1000)}s)`);
        }
      } catch (err) {
        console.error(`[Cleanup] Error processing file ${entry.name}:`, err.message);
      }
    }
  }
}

export function startCleanupJob() {
  console.log(`[Cleanup] Background job started. Monitoring ${config.UPLOADS_DIR}`);
  console.log(`[Cleanup] Interval: 1m, Max Age: 2m`);

  performCleanup(config.UPLOADS_DIR).catch((err) =>
    console.error('[Cleanup] Initial run failed:', err),
  );

  setInterval(() => {
    performCleanup(config.UPLOADS_DIR).catch((err) =>
      console.error('[Cleanup] Periodic run failed:', err),
    );
  }, CLEANUP_INTERVAL);
}
