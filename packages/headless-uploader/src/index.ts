export { useUploader } from './core/instance';
export { UploaderError } from './types/uploader';
export type { UploaderErrorCode } from './constants/error-codes';
export type {
  HttpMethod,
  UploadStatus,
  ChunkStatus,
  FileMetadata,
  UploadProgress,
  ChunkInfo,
  UploadFile,
  ValidationResult,
  ValidationError,
  RetryConfig,
  CompressionOptions,
  UploaderConfig,
  UploaderState,
  UploaderInterface,
  DropEventData,
} from './types';

export type {
  HttpConfig,
  TusConfig,
  WebSocketConfig,
  WebTransportConfig,
  UploadProtocol,
} from './types/protocolTypes';

export { DEFAULT_CONFIG, FileTypePresets, UploaderErrorCodes } from './constants';

export { getRecommendedProtocol, compareProtocols, getSupportedProtocols } from './adapters';

export {
  generateId,
  formatBytes,
  formatTime,
  calculateSpeed,
  calculateTimeRemaining,
  safeBase64,
} from './utils';
