import { UploaderConfig } from '../types';

/**
 * Default configuration for the uploader
 * @ignore
 */
export const DEFAULT_CONFIG: Required<
  Omit<
    UploaderConfig,
    | 'tus'
    | 'websocket'
    | 'webtransport'
    | 'customValidator'
    | 'onBeforeRequest'
    | 'onFilesAdded'
    | 'onFilesRejected'
    | 'onValidationStart'
    | 'onValidationComplete'
    | 'onBeforeUpload'
    | 'onUploadStart'
    | 'onUploadProgress'
    | 'onChunkComplete'
    | 'onUploadPause'
    | 'onUploadResume'
    | 'onUploadCancel'
    | 'onUploadComplete'
    | 'onUploadSuccess'
    | 'onUploadError'
    | 'onRetry'
    | 'onAllComplete'
    | 'onMetadataExtracted'
    | 'onPreviewGenerated'
  >
> = {
  protocol: 'http',
  http: {
    method: 'POST',
    headers: {},
    withCredentials: false,
    enableChunking: false,
    maxConcurrentChunks: 3,
  },
  maxFiles: 10,
  maxFileSize: 10 * 1024 * 1024,
  minFileSize: 0,
  acceptedTypes: [],
  allowDuplicates: true,
  chunkSize: 1024 * 1024,
  autoUpload: false,
  maxConcurrent: 3,
  autoRetry: true,
  retryConfig: {
    maxRetries: 3,
    retryDelay: 1000,
    retryDelayMultiplier: 2,
    retryableStatuses: [408, 429, 500, 502, 503, 504],
  },
  compression: {
    enabled: false,
    quality: 0.8,
  },
  enablePreviews: true,
  previewMaxWidth: 200,
  previewMaxHeight: 200,
  extractMetadata: true,
  timeout: 0,
};
