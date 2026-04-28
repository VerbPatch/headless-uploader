import type { UploadFile, UploaderConfig, HttpMethod, UploaderError } from './uploader';
import type { UploadOptions } from 'tus-js-client';
import { UploaderErrorCode } from '../constants/error-codes';
import { Logger } from '../utils/logger';

/**
 * Upload protocol types
 * @group types
 * @title UploadProtocol
 * @description Defines the available communication protocols for file transfer.
 */
export type UploadProtocol = 'http' | 'tus' | 'websocket' | 'webtransport';

/**
 * Protocol adapter interface
 * @group internal
 * @title ProtocolAdapter
 * @description Internal interface for implementing specific upload protocols.
 * @internal
 */
export interface ProtocolAdapter {
  name: string;
  protocol: UploadProtocol;
  logger?: Logger;

  initialize?: (config: UploaderConfig) => Promise<void>;

  upload: (file: UploadFile, config: UploaderConfig) => Promise<ProtocolUploadResult>;

  pause?: (uploadId: string) => Promise<void>;
  resume?: (file: UploadFile, config: UploaderConfig) => Promise<ProtocolUploadResult>;
  cancel?: (uploadId: string) => Promise<void>;

  cleanup?: () => Promise<void>;
}

/**
 * Protocol upload result
 * @group internal
 * @title ProtocolUploadResult
 * @description Represents the outcome of a protocol-specific upload operation.
 * @internal
 */
export interface ProtocolUploadResult {
  /** Whether the operation was successful */
  success: boolean;
  /** Protocol-specific identifier for the upload session */
  uploadId?: string;
  /** Final URL of the uploaded file if provided by the server */
  url?: string;
  /** Raw server response data */
  response?: unknown;
  /** Error details if success is false */
  error?: UploaderError;
  /** Cumulative bytes successfully accepted by the server */
  bytesUploaded?: number;
}

/**
 * HTTP Protocol Configuration
 * @group protocol configurations
 * @title HttpConfig
 * @description Configuration options for standard HTTP-based uploads (Multipart or Chunked).
 */
export interface HttpConfig {
  /**
   * The server endpoint for uploads.
   * Defaults to `/upload` if not specified.
   */
  endpoint?: string;
  /**
   * The HTTP method to use.
   * @default 'POST'
   */
  method?: HttpMethod;
  /**
   * Static custom headers for every request.
   * For dynamic headers, use `onBeforeRequest` in the main config.
   */
  headers?: Record<string, string>;
  /**
   * Whether to send cookies and authentication headers in cross-origin requests.
   * @default false
   */
  withCredentials?: boolean;
  /**
   * Whether to split files into smaller chunks.
   * Recommended for files > 10MB to avoid server timeouts.
   * @default false
   */
  enableChunking?: boolean;
  /**
   * Maximum number of chunks to upload at the same time for a single file.
   * Higher values increase speed but consume more bandwidth and memory.
   * @default 3
   */
  maxConcurrentChunks?: number;
}

/**
 * TUS Protocol Configuration
 * @group protocol configurations
 * @title TusConfig
 * @description Configuration for the Tus resumable upload protocol.
 * Extends the official `tus-js-client` options.
 */
export interface TusConfig extends Partial<UploadOptions> {
  /**
   * The server endpoint for Tus uploads (e.g., `https://tus.io/files/`).
   * This is a required field for the Tus protocol.
   */
  endpoint: string;
}

/**
 * WebSocket Configuration
 * @group protocol configurations
 * @title WebSocketConfig
 * @description Configuration for uploading files over a persistent WebSocket connection.
 */
export interface WebSocketConfig {
  /** The WebSocket server URL (e.g., `wss://api.example.com/upload`) */
  url: string;
  /** Sub-protocols to use during handshake */
  protocols?: string | string[];
  /**
   * Interval for sending heartbeat messages to keep connection alive.
   * @default 30000
   */
  heartbeatInterval: number;
  /**
   * Preferred binary type for data transfer.
   * @default 'blob'
   */
  binaryType: 'blob' | 'arraybuffer';
  /** Optional static metadata sent during the initial handshake */
  metadata?: Record<string, string>;
  /** Callback fired when the WebSocket connection opens successfully */
  onOpen?: () => void;
  /** Callback fired when the WebSocket connection closes */
  onClose?: () => void;
  /** Callback fired on connection-level errors */
  onError?: (error: Event) => void;
}

/**
 * WebTransport Configuration
 * @group protocol configurations
 * @title WebTransportConfig
 * @description Configuration for the modern WebTransport protocol (HTTP/3 + QUIC).
 */
export interface WebTransportConfig {
  /**
   * The WebTransport server URL.
   * Must use the `https` scheme and support HTTP/3.
   */
  url: string;
  /**
   * SHA-256 hashes of server certificates for self-signed development environments.
   */
  serverCertificateHashes?: Array<{
    algorithm: string;
    value: BufferSource;
  }>;
  /**
   * Whether to allow pooling multiple sessions over a single connection.
   * @default true
   */
  allowPooling: boolean;
  /**
   * Congestion control preference.
   * @default 'default'
   */
  congestionControl: 'default' | 'throughput' | 'low-latency';
  /**
   * Whether to use bidirectional streams (allows server to send ACKs).
   * @default true
   */
  bidirectionalStreams: boolean;
  /** Optional static metadata sent during stream initialization */
  metadata?: Record<string, string>;
  /** Callback fired when the WebTransport session is ready for data */
  onReady?: () => void;
  /** Callback fired when the transport session is closed */
  onClosed?: () => void;
}

/**
 * Protocol factory configuration
 * @group internal
 * @title ProtocolFactoryConfig
 * @description Configuration used by the internal protocol factory.
 * @internal
 */
export interface ProtocolFactoryConfig {
  protocol: UploadProtocol;
  http?: HttpConfig;
  tus?: TusConfig;
  websocket?: WebSocketConfig;
  webtransport?: WebTransportConfig;
  logger?: Logger;
}

/**
 * Upload session data
 * @group types
 * @title UploadSession
 * @description Data used to track and resume upload sessions across browser refreshes.
 */
export interface UploadSession {
  /** Unique session ID */
  id: string;
  /** Protocol used for this session */
  protocol: UploadProtocol;
  /** Original file ID */
  fileId: string;
  /** Name of the file */
  fileName: string;
  /** Total size in bytes */
  fileSize: number;
  /** Total bytes successfully uploaded */
  uploadedBytes: number;
  /** The server-side URL of the upload resource */
  uploadUrl?: string;
  /** Additional session metadata */
  metadata?: Record<string, unknown>;
  /** Timestamp when session was created */
  createdAt: number;
  /** Timestamp when session will expire on server */
  expiresAt?: number;
}

/**
 * WebSocket message types
 * @group internal
 * @title WebSocketMessage
 * @description Defines the structure of control and data messages exchanged over WebSockets.
 * @internal
 */
export interface WebSocketMessage {
  type: 'init' | 'init_ack' | 'chunk' | 'complete' | 'error' | 'progress' | 'heartbeat';
  uploadId?: string;
  fileId?: string;
  fileName?: string;
  fileSize?: number;
  chunkIndex?: number;
  totalChunks?: number;
  data?: ArrayBuffer | Blob;
  bytesUploaded?: number;
  message?: string;
  code?: UploaderErrorCode;
  url?: string;
  auth?: {
    headers?: Record<string, string>;
    params?: Record<string, unknown>;
  };
}
