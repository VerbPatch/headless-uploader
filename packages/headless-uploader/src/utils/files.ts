import { ChunkInfo } from '../types';

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Get human-readable file type category
 */
export function getFileCategory(file: File): string {
  const type = file.type.toLowerCase();

  if (type.startsWith('image/')) return 'Image';
  if (type.startsWith('video/')) return 'Video';
  if (type.startsWith('audio/')) return 'Audio';
  if (type.includes('pdf')) return 'PDF';
  if (type.includes('word') || type.includes('document')) return 'Document';
  if (type.includes('excel') || type.includes('spreadsheet')) return 'Spreadsheet';
  if (type.includes('powerpoint') || type.includes('presentation')) return 'Presentation';
  if (type.includes('zip') || type.includes('rar') || type.includes('compressed')) return 'Archive';
  if (type.startsWith('text/')) return 'Text';
  if (type.includes('json') || type.includes('xml')) return 'Data';

  return 'File';
}

/**
 * Check if file type is potentially dangerous (executable)
 */
export function isDangerousFileType(file: File): boolean {
  const dangerousExtensions = [
    'exe',
    'bat',
    'cmd',
    'com',
    'pif',
    'scr',
    'vbs',
    'js',
    'jar',
    'app',
    'deb',
    'rpm',
    'dmg',
    'pkg',
    'msi',
    'dll',
    'sys',
    'drv',
  ];

  const extension = getFileExtension(file.name);
  return dangerousExtensions.includes(extension);
}

/**
 * Create file chunks for chunked upload
 */
export function createChunks(file: File, chunkSize: number): ChunkInfo[] {
  const chunks: ChunkInfo[] = [];
  let start = 0;
  let index = 0;

  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size);
    const blob = file.slice(start, end);

    chunks.push({
      index,
      start,
      end,
      size: end - start,
      status: 'pending',
      blob,
      uploadedBytes: 0,
      retries: 0,
    });

    start = end;
    index++;
  }

  return chunks;
}
