/**
 * Common file type presets for easy configuration
 * @ignore
 */
export const FileTypePresets = {
  // Images
  IMAGES: ['image/*'],
  IMAGES_COMMON: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  IMAGES_ALL: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
  ],

  // Videos
  VIDEOS: ['video/*'],
  VIDEOS_COMMON: ['video/mp4', 'video/webm', 'video/ogg'],
  VIDEOS_ALL: [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
  ],

  // Audio
  AUDIO: ['audio/*'],
  AUDIO_COMMON: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  AUDIO_ALL: [
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/webm',
    'audio/aac',
    'audio/flac',
    'audio/x-m4a',
  ],

  // Documents
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
  ],
  PDF: ['application/pdf', '.pdf'],
  WORD: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.doc',
    '.docx',
  ],
  EXCEL: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls',
    '.xlsx',
  ],
  POWERPOINT: [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.ppt',
    '.pptx',
  ],

  // Archives
  ARCHIVES: [
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/x-tar',
    'application/gzip',
    '.zip',
    '.rar',
    '.7z',
    '.tar',
    '.gz',
  ],

  // Code files
  CODE: [
    'text/javascript',
    'text/typescript',
    'text/html',
    'text/css',
    'application/json',
    'application/xml',
    '.js',
    '.ts',
    '.jsx',
    '.tsx',
    '.html',
    '.css',
    '.json',
    '.xml',
    '.py',
    '.java',
    '.c',
    '.cpp',
    '.php',
    '.rb',
    '.go',
    '.rs',
  ],

  // Text files
  TEXT: ['text/*', '.txt', '.md', '.log'],

  // All common types (for general uploads)
  ALL_MEDIA: ['image/*', 'video/*', 'audio/*'],

  // Everything except executables (safer default)
  SAFE_FILES: [
    'image/*',
    'video/*',
    'audio/*',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.*',
    'application/vnd.ms-*',
    'text/*',
    'application/json',
    'application/zip',
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.txt',
    '.csv',
  ],
} as const;
