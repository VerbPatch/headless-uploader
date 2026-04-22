import { ValidationError, ValidationResult } from './validation';
import { UploaderErrorCode, UploaderErrorCodes } from '../constants/error-codes';
import {
  HttpConfig,
  TusConfig,
  WebSocketConfig,
  WebTransportConfig,
  UploadProtocol,
  ProtocolAdapter,
} from './protocolTypes';

/**
 * Supported HTTP methods for upload
 * @group types
 * @title HttpMethod
 * @description Defines the valid HTTP verbs used for upload requests.
 */
export type HttpMethod = 'POST' | 'PUT' | 'PATCH';

/**
 * Upload status states
 * @group types
 * @title UploadStatus
 * @description Enumerates all possible states a file can be in during its lifecycle.
 */
export type UploadStatus =
  | 'pending'
  | 'validating'
  | 'queued'
  | 'uploading'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

/**
 * Upload progress information
 * @group types
 * @title UploadProgress
 * @description Contains detailed metrics about the current progress of an upload.
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed: number;
  timeRemaining: number;
  startTime: number;
  elapsedTime: number;
}

/**
 * File metadata interface
 * @group types
 * @title FileMetadata
 * @description Describes the properties and extracted metadata of a file.
 */
export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  extension?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number;
}

/**
 * Chunk upload status
 * @group types
 * @title ChunkStatus
 * @description Represents the status of an individual file chunk.
 */
export type ChunkStatus = 'pending' | 'queued' | 'uploading' | 'completed' | 'failed';

/**
 * Chunk information
 * @group types
 * @title ChunkInfo
 * @description Contains metadata and state for a single part of a chunked upload.
 */
export interface ChunkInfo {
  index: number;
  start: number;
  end: number;
  size: number;
  status: ChunkStatus;
  blob: Blob;
  uploadedBytes: number;
  retries: number;
}

/**
 * Retry configuration
 * @group types
 * @title RetryConfig
 * @description Defines how the uploader should handle failed requests and retries.
 */
export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryDelayMultiplier: number;
  retryableStatuses: number[];
}

/**
 * Compression options
 * @group types
 * @title CompressionOptions
 * @description Configuration for client-side file compression.
 */
export interface CompressionOptions {
  enabled: boolean;
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  mimeType?: string;
}

/**
 * Custom error object for uploader operations
 * @group types
 * @title UploaderError
 * @description Extends the standard Error with additional fields for machine-readable codes and file identification.
 */
export class UploaderError extends Error {
  /** Machine-readable error code (e.g., 'INVALID_FILE_TYPE', 'FILE_TOO_LARGE') */
  code?: UploaderErrorCode;
  /** The unique identifier of the file associated with this error */
  fileId?: string;
  /** The raw server response if the error occurred during a network request */
  response?: unknown;

  constructor(
    message: string,
    options?: { code?: UploaderErrorCode; fileId?: string; response?: unknown },
  ) {
    super(message);
    this.name = 'UploaderError';
    this.code = options?.code || UploaderErrorCodes.UNKNOWN_ERROR;
    if (options) {
      this.fileId = options.fileId;
      this.response = options.response;
    }
    Object.setPrototypeOf(this, UploaderError.prototype);
  }
}

/**
 * Upload file representation
 * @group types
 * @title UploadFile
 * @description The internal object representing a file in the uploader, including its state and progress.
 */
export interface UploadFile {
  id: string;
  file: File;
  metadata: FileMetadata;
  status: UploadStatus;
  progress: UploadProgress;
  preview?: string;
  chunks?: ChunkInfo[];
  processedFile?: Blob | File;
  error?: UploaderError;
  retries: number;
  response?: unknown;
  abortController?: AbortController;
}

/**
 * Cloud storage adapter interface
 * @group types
 * @title CloudAdapter
 * @description Interface for implementing custom cloud storage providers (e.g., S3, Cloudinary).
 */
export interface CloudAdapter {
  name: string;
  upload: (file: UploadFile, config: UploaderConfig) => Promise<unknown>;
  getUploadUrl?: (file: UploadFile) => Promise<string>;
  abortUpload?: (uploadId: string) => Promise<void>;
}

/**
 * Drag and drop event data
 * @group types
 * @title DropEventData
 * @description Data structure passed to drop event handlers.
 */
export interface DropEventData {
  files: File[];
  event: DragEvent;
}

/**
 * Blueprint for customizing network requests
 * @group types
 * @title RequestBlueprint
 * @description Allows for fine-grained customization of individual network requests.
 * @example
 * ```typescript
 * const blueprint: RequestBlueprint = {
 *   headers: { 'Authorization': 'Bearer token' },
 *   url: 'https://custom-upload-url.com',
 *   params: { folder: 'images' }
 * };
 * ```
 */
export interface RequestBlueprint {
  headers?: Record<string, string>;
  url?: string;
  method?: HttpMethod;
  params?: Record<string, unknown>;
}

/**
 * Main uploader configuration
 * @group types
 * @title UploaderConfig
 * @description The primary configuration object for initializing the uploader.
 * @example
 * ```typescript
 * const config: UploaderConfig = {
 *   maxFileSize: 5 * 1024 * 1024, // 5MB
 *   acceptedTypes: ['image/*', 'application/pdf'],
 *   autoUpload: false,
 *   http: {
 *     endpoint: '/api/upload',
 *   },
 *   onUploadProgress: (file, progress) => {
 *     console.log(`${file.metadata.name}: ${progress.percentage}%`);
 *   }
 * };
 * ```
 */
export interface UploaderConfig {
  /** The protocol to use for uploading (http, tus, websocket, etc.). Set to 'cloud' to use cloudAdapter. */
  protocol?: UploadProtocol;
  /** Configuration for HTTP protocol */
  http?: HttpConfig;
  /** Configuration for Tus protocol */
  tus?: TusConfig;
  /** Configuration for WebSocket protocol */
  websocket?: WebSocketConfig;
  /** Configuration for WebTransport protocol */
  webtransport?: WebTransportConfig;

  /** Maximum number of files allowed in the queue */
  maxFiles?: number;
  /** Maximum size for a single file in bytes */
  maxFileSize?: number;
  /** Minimum size for a single file in bytes */
  minFileSize?: number;
  /** Allowed MIME types or file extensions */
  acceptedTypes?: string[];
  /** Whether to allow adding the same file multiple times */
  allowDuplicates?: boolean;

  /** Size of each chunk in bytes for chunked uploads */
  chunkSize?: number;

  /** Whether to start uploading immediately after adding files */
  autoUpload?: boolean;
  /** Maximum number of files to upload simultaneously */
  maxConcurrent?: number;

  /** Whether to automatically retry failed uploads */
  autoRetry?: boolean;
  /** Detailed retry strategy configuration */
  retryConfig?: RetryConfig;

  /** Options for client-side image compression */
  compression?: CompressionOptions;
  /** Whether to generate preview URLs for images and videos */
  enablePreviews?: boolean;
  /** Maximum width for generated previews */
  previewMaxWidth?: number;
  /** Maximum height for generated previews */
  previewMaxHeight?: number;

  /** Whether to extract extended metadata (dimensions, duration) from files */
  extractMetadata?: boolean;

  /** Global request timeout in milliseconds */
  timeout?: number;

  /** Custom cloud storage adapter. Required when protocol is set to 'cloud'. */
  cloudAdapter?: CloudAdapter;

  /** Callback fired when file validation begins */
  onValidationStart?: (files: File[]) => void;
  /** Function for custom file validation logic */
  customValidator?: (file: File) => Promise<ValidationResult>;
  /** Callback fired when files are rejected by validation */
  onFilesRejected?: (errors: ValidationError[]) => void;
  /** Callback fired when validation is complete for all files */
  onValidationComplete?: (results: ValidationResult[]) => void;
  /** Callback fired when metadata has been extracted for a file */
  onMetadataExtracted?: (file: UploadFile, metadata: FileMetadata) => void;
  /** Callback fired when a preview has been generated for a file */
  onPreviewGenerated?: (file: UploadFile, preview: string) => void;
  /** Callback fired when files have been successfully added to the queue */
  onFilesAdded?: (files: UploadFile[]) => void;
  /** Hook to perform actions before a file starts uploading */
  onBeforeUpload?: (file: UploadFile) => void | Promise<void>;
  /** Callback fired when a file upload starts */
  onUploadStart?: (file: UploadFile) => void;
  /** Callback fired periodically to report upload progress */
  onUploadProgress?: (file: UploadFile, progress: UploadProgress) => void;
  /** Hook to modify the network request before it is sent */
  onBeforeRequest?: (file: UploadFile, chunkInfo?: ChunkInfo) => Promise<RequestBlueprint | void>;
  /** Callback fired when a single chunk has completed uploading */
  onChunkComplete?: (file: UploadFile, chunk: ChunkInfo) => void;
  /** Callback fired when all chunks of a file have been sent */
  onUploadComplete?: (file: UploadFile) => void;
  /** Callback fired when the server confirms a successful upload */
  onUploadSuccess?: (file: UploadFile, response: unknown) => void;
  /** Callback fired when all files in the queue have finished (success or failure) */
  onAllComplete?: (files: UploadFile[]) => void;
  /** Callback fired when an upload is paused */
  onUploadPause?: (file: UploadFile) => void;
  /** Callback fired when an upload is resumed */
  onUploadResume?: (file: UploadFile) => void;
  /** Callback fired when an upload is cancelled */
  onUploadCancel?: (file: UploadFile) => void;
  /** Callback fired when an upload fails with an error */
  onUploadError?: (file: UploadFile, error: UploaderError) => void;
  /** Callback fired before a retry attempt is made */
  onRetry?: (file: UploadFile, attempt: number) => void;
}

/**
 * Internal uploader instance state
 * @group types
 * @title UploaderInstance
 * @internal
 */
export interface UploaderInstance {
  files: Map<string, UploadFile>;
  activeUploads: Map<string, AbortController>;
  config: UploaderConfig;
  adapter?: ProtocolAdapter;
}

/**
 * UI-friendly representation of the uploader state
 * @group types
 * @title UploaderState
 * @description A read-only snapshot of the uploader's current state.
 */
export interface UploaderState {
  files: UploadFile[];
  uploadingFiles: UploadFile[];
  completedFiles: UploadFile[];
  failedFiles: UploadFile[];
  queuedFiles: UploadFile[];
  totalProgress: {
    loaded: number;
    total: number;
    percentage: number;
  };
  isUploading: boolean;
  isPaused: boolean;
}

/**
 * Uploader public interface
 * @group types
 * @title UploaderInterface
 * @description The public API for interacting with a headless uploader instance.
 */
export interface UploaderInterface {
  /** Get all files currently in the uploader */
  getFiles: () => UploadFile[];
  /** Get a specific file by its identifier */
  getFile: (fileId: string) => UploadFile | undefined;
  /** Get a reactive-friendly snapshot of the current state */
  getState: () => UploaderState;
  /** Get the preview URL for a specific file */
  getPreview: (fileId: string) => string | undefined;
  /** Get the aggregate progress of all files */
  getTotalProgress: () => { loaded: number; total: number; percentage: number };

  /** Add files to the upload queue */
  addFiles: (fileList: FileList | File[]) => Promise<void>;
  /** Remove a file from the uploader and cancel its upload if active */
  removeFile: (fileId: string) => Promise<void>;
  /** Cancel all uploads and clear the file list */
  clearAll: () => Promise<void>;

  /** Start uploading all queued files */
  uploadAll: () => Promise<void>;
  /** Start or resume uploading a specific file */
  uploadFile: (fileId: string) => Promise<void>;
  /** Pause an active file upload */
  pauseUpload: (fileId: string) => Promise<void>;
  /** Resume a paused file upload */
  resumeUpload: (fileId: string) => Promise<void>;
  /** Cancel an active or queued file upload */
  cancelUpload: (fileId: string) => Promise<void>;
  /** Retry a failed file upload */
  retryUpload: (fileId: string) => Promise<void>;

  /** Helper for handling dragover events */
  handleDragOver: (event: DragEvent) => void;
  /** Helper for handling drop events */
  handleDrop: (event: DragEvent) => Promise<void>;
  /** Helper for handling file input change events */
  handleFileSelect: (event: Event) => Promise<void>;
  /** Update the uploader's configuration on the fly */
  updateConfig: (config: Partial<UploaderConfig>) => void;
  /** Cleanup the uploader instance and release resources */
  destroy: () => Promise<void>;
}
