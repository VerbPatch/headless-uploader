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
import { Logger } from '../utils/logger';

/**
 * Supported HTTP methods for upload
 * @group Types
 * @title HttpMethod
 * @description Defines the valid HTTP verbs used for upload requests.
 */
export type HttpMethod = 'POST' | 'PUT' | 'PATCH';

/**
 * Upload status states
 * @group Types
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
 * @group Types
 * @title UploadProgress
 * @description Contains detailed metrics about the current progress of an upload.
 */
export interface UploadProgress {
  /** Total bytes transferred so far */
  loaded: number;
  /** Total size of the file/blob in bytes */
  total: number;
  /** Progress as a percentage (0-100) */
  percentage: number;
  /** Current upload speed in bytes per second */
  speed: number;
  /** Estimated seconds remaining based on current speed */
  timeRemaining: number;
  /** Timestamp when the upload session started */
  startTime: number;
  /** Seconds elapsed since the upload started */
  elapsedTime: number;
}

/**
 * File metadata interface
 * @group Types
 * @title FileMetadata
 * @description Describes the properties and extracted metadata of a file.
 */
export interface FileMetadata {
  /** Original name of the file */
  name: string;
  /** Total size in bytes */
  size: number;
  /** MIME type of the file */
  type: string;
  /** Unix timestamp of last modification */
  lastModified: number;
  /** File extension (e.g., '.jpg') derived from name */
  extension?: string;
  /** Dimensions for image/video files (requires `extractMetadata: true`) */
  dimensions?: {
    width: number;
    height: number;
  };
  /** Duration in seconds for audio/video files (requires `extractMetadata: true`) */
  duration?: number;
}

/**
 * Chunk upload status
 * @group Types
 * @title ChunkStatus
 * @description Represents the status of an individual file chunk.
 */
export type ChunkStatus = 'pending' | 'queued' | 'uploading' | 'completed' | 'failed';

/**
 * Chunk information
 * @group Types
 * @title ChunkInfo
 * @description Contains metadata and state for a single part of a chunked upload.
 */
export interface ChunkInfo {
  /** Zero-based index of the chunk */
  index: number;
  /** Byte offset where the chunk starts */
  start: number;
  /** Byte offset where the chunk ends */
  end: number;
  /** Size of this specific chunk in bytes */
  size: number;
  /** Current status of this chunk */
  status: ChunkStatus;
  /** The raw slice of the file for this chunk */
  blob: Blob;
  /** Number of bytes successfully uploaded for this chunk */
  uploadedBytes: number;
  /** Current number of retry attempts for this chunk */
  retries: number;
}

/**
 * Retry configuration
 * @group Types
 * @title RetryConfig
 * @description Defines how the uploader should handle failed requests and retries.
 */
export interface RetryConfig {
  /** Maximum number of retry attempts per file/chunk */
  maxRetries: number;
  /** Initial delay before first retry in milliseconds */
  retryDelay: number;
  /** Factor to multiply delay by for each subsequent retry (exponential backoff) */
  retryDelayMultiplier: number;
  /** List of HTTP status codes that should trigger a retry */
  retryableStatuses: number[];
}

/**
 * Compression options
 * @group Types
 * @title CompressionOptions
 * @description Configuration for client-side file compression.
 */
export interface CompressionOptions {
  /** Whether to enable image compression before upload */
  enabled: boolean;
  /** Compression quality (0 to 1) */
  quality: number;
  /** Target maximum width in pixels */
  maxWidth?: number;
  /** Target maximum height in pixels */
  maxHeight?: number;
  /** Output MIME type (defaults to original type) */
  mimeType?: string;
}

/**
 * Custom error object for uploader operations
 * @group Exception Handling
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
 * @group Types
 * @title UploadFile
 * @description The internal object representing a file in the uploader, including its state and progress.
 */
export interface UploadFile {
  /** Unique identifier generated for the upload session */
  id: string;
  /** The original browser File object */
  file: File;
  /** Extracted file properties and metadata */
  metadata: FileMetadata;
  /** Current state of the upload (e.g., 'uploading', 'completed') */
  status: UploadStatus;
  /** Real-time progress metrics */
  progress: UploadProgress;
  /** Local preview URL (data URL or blob URL) */
  preview?: string;
  /** Metadata for individual chunks if chunking is enabled */
  chunks?: ChunkInfo[];
  /** The final data being uploaded (may be a compressed Blob if enabled) */
  processedFile?: Blob | File;
  /** The last error encountered during the lifecycle */
  error?: UploaderError;
  /** Total number of retry attempts made for this file */
  retries: number;
  /** Final server response data after successful upload */
  response?: unknown;
  /** Internal controller used to abort active requests */
  abortController?: AbortController;
}

/**
 * Drag and drop event data
 * @group Types
 * @title DropEventData
 * @description Data structure passed to drop event handlers.
 */
export interface DropEventData {
  /** Array of files extracted from the drop event */
  files: File[];
  /** The original browser DragEvent */
  event: DragEvent;
}

/**
 * Blueprint for customizing network requests
 * @group Types
 * @title RequestBlueprint
 * @description Allows for fine-grained customization of individual network requests.
 * @example
 * ```typescript
 * // In onBeforeRequest:
 * return {
 *   headers: { 'Authorization': `Bearer ${token}` },
 *   url: 'https://custom-upload-url.com',
 *   params: { folderId: '123' }
 * };
 * ```
 */
export interface RequestBlueprint {
  /** Custom headers to append to the request */
  headers?: Record<string, string>;
  /** Override the target URL for this specific request */
  url?: string;
  /** Override the HTTP method for this specific request */
  method?: HttpMethod;
  /** Additional parameters to include in FormData or query string */
  params?: Record<string, unknown>;
}

/**
 * Main uploader configuration
 * @group Types
 * @title UploaderConfig
 * @description The primary configuration object for initializing the uploader.
 * @example
 * ```typescript
 * const config: UploaderConfig = {
 *   maxFileSize: 5 * 1024 * 1024,
 *   autoUpload: true,
 *   http: { endpoint: '/api/upload' },
 *   onUploadSuccess: (file, response) => {
 *     console.log(`${file.metadata.name} is safe on the server!`);
 *   }
 * };
 * ```
 */
export interface UploaderConfig {
  /** The protocol to use for uploading (http, tus, websocket, webtransport). */
  protocol?: UploadProtocol;
  /** Configuration for standard HTTP multipart/chunked uploads */
  http?: HttpConfig;
  /** Configuration for the Tus resumable protocol */
  tus?: TusConfig;
  /** Configuration for persistent WebSocket streams */
  websocket?: WebSocketConfig;
  /** Configuration for modern WebTransport streams */
  webtransport?: WebTransportConfig;

  /** Maximum number of files allowed in the queue at once */
  maxFiles?: number;
  /** Maximum allowed size for a single file in bytes */
  maxFileSize?: number;
  /** Minimum required size for a single file in bytes */
  minFileSize?: number;
  /** Allowed MIME types or extensions (e.g. `['image/*', '.pdf']`) */
  acceptedTypes?: string[];
  /** Whether to allow adding the same file multiple times to the queue */
  allowDuplicates?: boolean;

  /** Size of each chunk in bytes for protocols that support chunking */
  chunkSize?: number;

  /** Whether to start uploading immediately when files are added */
  autoUpload?: boolean;
  /** Maximum number of files to transmit simultaneously */
  maxConcurrent?: number;

  /** Whether to automatically retry failed uploads */
  autoRetry?: boolean;
  /** Detailed exponential backoff and retry strategy */
  retryConfig?: RetryConfig;

  /** Options for client-side image compression before upload */
  compression?: CompressionOptions;
  /** Whether to generate local preview URLs for media files */
  enablePreviews?: boolean;
  /** Maximum width for generated previews */
  previewMaxWidth?: number;
  /** Maximum height for generated previews */
  previewMaxHeight?: number;

  /** Whether to extract extended metadata like dimensions or duration */
  extractMetadata?: boolean;

  /** Global request timeout in milliseconds (0 for no timeout) */
  timeout?: number;

  /** Whether to enable debug logging */
  debug?: boolean;

  /** Callback fired when file validation begins */
  onValidationStart?: (files: File[]) => void;
  /** Function for custom file validation logic (local or remote) */
  customValidator?: (file: File) => Promise<ValidationResult>;
  /** Callback fired when files are rejected by internal or custom validation */
  onFilesRejected?: (errors: ValidationError[]) => void;
  /** Callback fired when validation is complete for all files in a batch */
  onValidationComplete?: (results: ValidationResult[]) => void;
  /** Callback fired when metadata (dimensions, etc) has been extracted */
  onMetadataExtracted?: (file: UploadFile, metadata: FileMetadata) => void;
  /** Callback fired when a local preview URL has been generated */
  onPreviewGenerated?: (file: UploadFile, preview: string) => void;
  /** Callback fired when valid files have been added to the internal Map */
  onFilesAdded?: (files: UploadFile[]) => void;
  /**
   * Callback fired whenever the queue content changes (add/remove/clear).
   * Ideal for syncing framework state.
   */
  onQueueChange?: (files: UploadFile[]) => void;
  /**
   * Callback fired whenever a file's `status` changes.
   * Preferred for UI reactivity over `onUploadProgress`.
   */
  onStateChange?: (file: UploadFile) => void;
  /**
   * Hook to perform actions before a file starts uploading.
   * Return `false` to cancel the upload for this specific file.
   * @example
   * ```typescript
   * onBeforeUpload: async (file) => {
   *   const permitted = await checkUserPermissions();
   *   return permitted; // returning false stops the upload
   * }
   * ```
   */
  onBeforeUpload?: (file: UploadFile) => void | boolean | Promise<void | boolean>;
  /** Callback fired when a file transitions to the `uploading` state */
  onUploadStart?: (file: UploadFile) => void;
  /** Callback fired periodically to report upload progress metrics */
  onUploadProgress?: (file: UploadFile, progress: UploadProgress) => void;
  /**
   * Hook to modify the network request before it is sent.
   * Allows injecting dynamic headers or changing the endpoint per-chunk.
   * @example
   * ```typescript
   * onBeforeRequest: async (file, chunk) => {
   *   return {
   *     headers: { 'X-Chunk-Index': chunk?.index.toString() || '0' }
   *   };
   * }
   * ```
   */
  onBeforeRequest?: (file: UploadFile, chunkInfo?: ChunkInfo) => Promise<RequestBlueprint | void>;
  /** Callback fired immediately before a chunk transmission begins */
  onChunkStart?: (file: UploadFile, chunk: ChunkInfo) => void;
  /** Callback fired when a single chunk has been acknowledged by the server */
  onChunkComplete?: (file: UploadFile, chunk: ChunkInfo) => void;
  /**
   * Callback fired when the server confirms a successful upload.
   * This is the final terminal event for a successful transfer.
   */
  onUploadSuccess?: (file: UploadFile, response: unknown) => void;
  /**
   * Callback fired when all files in the uploader have finished (success or failure).
   * Fires reliably even in `autoUpload` mode once the engine becomes idle.
   */
  onAllComplete?: (files: UploadFile[]) => void;
  /** Callback fired when an upload is intentionally paused */
  onUploadPause?: (file: UploadFile) => void;
  /** Callback fired when an upload is resumed from a paused state */
  onUploadResume?: (file: UploadFile) => void;
  /** Callback fired when an upload is aborted by the user */
  onUploadCancel?: (file: UploadFile) => void;
  /** Callback fired when an upload fails permanently or exceeds retries */
  onUploadError?: (file: UploadFile, error: UploaderError) => void;
  /** Callback fired before a retry attempt is made for a file/chunk */
  onRetry?: (file: UploadFile, attempt: number) => void;
}

/**
 * Internal uploader instance state
 * @group Types
 * @title UploaderInstance
 * @internal
 */
export interface UploaderInstance {
  files: Map<string, UploadFile>;
  activeUploads: Map<string, AbortController>;
  config: UploaderConfig;
  adapter?: ProtocolAdapter;
  logger: Logger;
}

/**
 * UI-friendly representation of the uploader state
 * @group Types
 * @title UploaderState
 * @description A read-only snapshot of the uploader's current state.
 */
export interface UploaderState {
  /** List of all files currently in the uploader */
  files: UploadFile[];
  /** Subset of files currently in the `uploading` state */
  uploadingFiles: UploadFile[];
  /** Subset of files in the `completed` state */
  completedFiles: UploadFile[];
  /** Subset of files in the `failed` state */
  failedFiles: UploadFile[];
  /** Subset of files in the `queued` state */
  queuedFiles: UploadFile[];
  /** Aggregate progress metrics across all managed files */
  totalProgress: {
    loaded: number;
    total: number;
    percentage: number;
  };
  /** Whether at least one file is actively uploading */
  isUploading: boolean;
  /** Whether at least one file is currently paused */
  isPaused: boolean;
}

/**
 * Uploader public interface
 * @group Types
 * @title UploaderInterface
 * @description The public API for interacting with a headless uploader instance.
 */
export interface UploaderInterface {
  /**
   * @group State
   * @description Get all files currently in the uploader
   */
  getFiles: () => UploadFile[];
  /**
   * @group State
   * @description Get a specific file by its identifier
   */
  getFile: (fileId: string) => UploadFile | undefined;
  /**
   * @group State
   * @description Get a reactive-friendly snapshot of the current state
   */
  getState: () => UploaderState;
  /**
   * @group State
   * @description Get the preview URL for a specific file
   */
  getPreview: (fileId: string) => string | undefined;
  /**
   * @group State
   * @description Get the aggregate progress of all files
   */
  getTotalProgress: () => { loaded: number; total: number; percentage: number };

  /**
   * @group Queue Actions
   * @description Add files to the upload queue. Triggers validation.
   */
  addFiles: (fileList: FileList | File[]) => Promise<void>;
  /**
   * @group Queue Actions
   * @description Remove a file from the uploader and cancel its upload if active
   */
  removeFile: (fileId: string) => Promise<void>;
  /**
   * @group Queue Actions
   * @description Cancel all uploads and clear the file list
   */
  clearAll: () => Promise<void>;

  /**
   * @group Upload Actions
   * @description Start uploading all currently queued/pending files
   */
  uploadAll: () => Promise<void>;
  /**
   * @group Upload Actions
   * @description Start or resume uploading a specific file
   */
  uploadFile: (fileId: string) => Promise<void>;
  /**
   * @group Upload Actions
   * @description Pause an active file upload. Supports resumption.
   */
  pauseUpload: (fileId: string) => Promise<void>;
  /**
   * @group Upload Actions
   * @description Resume a paused file upload from the last known state
   */
  resumeUpload: (fileId: string) => Promise<void>;
  /**
   * @group Upload Actions
   * @description Cancel an active or queued file upload. Aborts requests.
   */
  cancelUpload: (fileId: string) => Promise<void>;
  /**
   * @group Upload Actions
   * @description Retry a failed file upload
   */
  retryUpload: (fileId: string) => Promise<void>;

  /**
   * @group Event Handlers
   * @description Helper for handling dragover events. Sets drop effect.
   */
  handleDragOver: (event: DragEvent) => void;
  /**
   * @group Event Handlers
   * @description Helper for handling drop events. Extracts files.
   */
  handleDrop: (event: DragEvent) => Promise<void>;
  /**
   * @group Event Handlers
   * @description Helper for handling file input change events. Extracts files.
   */
  handleFileSelect: (event: Event) => Promise<void>;
  /**
   * @group Actions
   * @description Update the uploader's configuration on the fly
   */
  updateConfig: (config: Partial<UploaderConfig>) => void;
  /**
   * @group Lifecycle
   * @description Cleanup the uploader instance, release memory and abort requests
   */
  destroy: () => Promise<void>;
}
