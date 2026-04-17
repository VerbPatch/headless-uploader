export { useUploader } from './core/instance';
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
  CloudAdapter,
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

export { DEFAULT_CONFIG, FileTypePresets, ValidationErrorCodes } from './constants';

export { getRecommendedProtocol, compareProtocols, getSupportedProtocols } from './adapters';

export {
  generateId,
  formatBytes,
  formatTime,
  calculateSpeed,
  calculateTimeRemaining,
  sleep,
  safeBase64,
} from './utils';
