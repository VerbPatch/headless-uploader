/**
 * Generate a unique identifier for files or uploads
 * @returns A cryptographically secure random UUID string
 * @ignore
 * @title generateId
 * @description Generates a unique ID using `crypto.randomUUID()`.
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Format bytes into a human-readable string
 * @param bytes - The number of bytes to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns A formatted string like "1.5 MB"
 * @group utils
 * @title formatBytes
 * @description Converts a byte count into a readable format (KB, MB, GB, etc.).
 * @example
 * ```typescript
 * formatBytes(1024); // "1 KB"
 * formatBytes(1234567, 1); // "1.2 MB"
 * ```
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format seconds into a human-readable duration string
 * @param seconds - The number of seconds to format
 * @returns A formatted string like "02:30" or "1:05:20"
 * @group utils
 * @title formatTime
 * @description Converts a duration in seconds into a standard HH:MM:SS format.
 * @example
 * ```typescript
 * formatTime(150); // "2:30"
 * formatTime(3661); // "1:01:01"
 * ```
 */
export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '--:--';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Calculate the current upload speed
 * @param loaded - Number of bytes already uploaded
 * @param startTime - The timestamp when the upload started
 * @returns Speed in bytes per second
 * @group utils
 * @title calculateSpeed
 * @description Computes the average upload speed based on bytes loaded and elapsed time.
 */
export function calculateSpeed(loaded: number, startTime: number): number {
  const elapsed = (Date.now() - startTime) / 1000;
  return elapsed > 0 ? loaded / elapsed : 0;
}

/**
 * Calculate the estimated time remaining for an upload
 * @param loaded - Number of bytes already uploaded
 * @param total - Total number of bytes to upload
 * @param speed - Current upload speed in bytes per second
 * @returns Estimated seconds remaining
 * @group utils
 * @title calculateTimeRemaining
 * @description Predicts how much longer an upload will take based on current speed.
 */
export function calculateTimeRemaining(loaded: number, total: number, speed: number): number {
  if (speed === 0) return Infinity;
  const remaining = total - loaded;
  return remaining / speed;
}

/**
 * Pause execution for a specified duration
 * @param ms - Milliseconds to sleep
 * @ignore
 * @title sleep
 * @description Simple utility for introducing delays, useful for retry strategies.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Encode a string into a UTF-8 safe Base64 format
 * @param str - The string to encode
 * @returns A base64 encoded string
 * @group utils
 * @title safeBase64
 * @description Provides a way to encode strings for use in headers or metadata that is safe for UTF-8 characters.
 */
export function safeBase64(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    }),
  );
}
