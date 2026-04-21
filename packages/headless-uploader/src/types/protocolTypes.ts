import type {
  UploadFile,
  UploaderConfig,
  HttpMethod,
  CloudAdapter,
  UploaderError,
} from './uploader';
import type { UploadOptions } from 'tus-js-client';
import { UploaderErrorCode } from '../constants/error-codes';

/**
 * Upload protocol types
 * @group types
 * @title UploadProtocol
 * @description Defines the available communication protocols for file transfer.
 */
export type UploadProtocol = 'http' | 'tus' | 'websocket' | 'webtransport' | 'cloud';

/**
 * Protocol adapter interface
 * @group protocols
 * @title ProtocolAdapter
 * @description Internal interface for implementing specific upload protocols.
 * @internal
 */
export interface ProtocolAdapter {
  name: string;
  protocol: UploadProtocol;

  // Initialize the protocol (connect, authenticate, etc.)
  initialize?: (config: UploaderConfig) => Promise<void>;

  // Upload a file using this protocol
  upload: (file: UploadFile, config: UploaderConfig) => Promise<ProtocolUploadResult>;

  // Pause upload
  pause?: (uploadId: string) => Promise<void>;
  // Resume an interrupted upload
  resume?: (file: UploadFile, config: UploaderConfig) => Promise<ProtocolUploadResult>;
  // Cancel upload
  cancel?: (uploadId: string) => Promise<void>;

  // Cleanup/disconnect
  cleanup?: () => Promise<void>;
}

/**
 * Protocol upload result
 * @group protocols
 * @title ProtocolUploadResult
 * @description Represents the outcome of a protocol-specific upload operation.
 * @internal
 */
export interface ProtocolUploadResult {
  success: boolean;
  uploadId?: string;
  url?: string;
  response?: unknown;
  error?: UploaderError;
  bytesUploaded?: number;
}

/**
 * HTTP Protocol Configuration
 * @group protocols
 * @title HttpConfig
 * @description Configuration options for standard HTTP-based uploads.
 */
export interface HttpConfig {
  /** The server endpoint for uploads */
  endpoint?: string;
  /** The HTTP method to use (POST, PUT, PATCH) */
  method?: HttpMethod;
  /** Custom headers for the request */
  headers?: Record<string, string>;
  /** Whether to send credentials with the request */
  withCredentials?: boolean;
  /** Whether to enable file chunking for large files */
  enableChunking?: boolean;
  /** Maximum number of concurrent chunk uploads */
  maxConcurrentChunks?: number;
}

/**
 * TUS Protocol Configuration
 * @group protocols
 * @title TusConfig
 * @description Configuration options for the Tus resumable upload protocol.
 */
export interface TusConfig extends Partial<UploadOptions> {
  /** The server endpoint for Tus uploads */
  endpoint: string;
}

/**
 * WebSocket Configuration
 * @group protocols
 * @title WebSocketConfig
 * @description Configuration options for uploading files via WebSockets.
 */
export interface WebSocketConfig {
  /** The WebSocket server URL */
  url: string;
  /** WebSocket sub-protocols */
  protocols?: string | string[];
  /** Whether to automatically reconnect on disconnection */
  reconnect: boolean;
  /** Delay between reconnection attempts in milliseconds */
  reconnectDelay: number;
  /** Maximum number of reconnection attempts */
  maxReconnectAttempts: number;
  /** Interval for sending heartbeat messages in milliseconds */
  heartbeatInterval: number;
  /** Preferred binary type for data transfer */
  binaryType: 'blob' | 'arraybuffer';
  /** Optional metadata to send during initialization */
  metadata?: Record<string, string>;
  /** Callback fired when the connection opens */
  onOpen?: () => void;
  /** Callback fired when the connection closes */
  onClose?: () => void;
  /** Callback fired on connection error */
  onError?: (error: Event) => void;
}

/**
 * WebTransport Configuration
 * @group protocols
 * @title WebTransportConfig
 * @description Configuration options for the modern WebTransport protocol.
 */
export interface WebTransportConfig {
  /** The WebTransport server URL (must be HTTPS) */
  url: string;
  /** Certificate hashes for server validation */
  serverCertificateHashes?: Array<{
    algorithm: string;
    value: BufferSource;
  }>;
  /** Whether to allow connection pooling */
  allowPooling: boolean;
  /** Congestion control strategy */
  congestionControl: 'default' | 'throughput' | 'low-latency';
  /** Whether to use bidirectional streams */
  bidirectionalStreams: boolean;
  /** Optional metadata to send during initialization */
  metadata?: Record<string, string>;
  /** Callback fired when the transport is ready */
  onReady?: () => void;
  /** Callback fired when the transport is closed */
  onClosed?: () => void;
}

/**
 * Protocol factory configuration
 * @group protocols
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
  cloudAdapter?: CloudAdapter;
}

/**
 * Upload session data
 * @group protocols
 * @title UploadSession
 * @description Data used to track and resume upload sessions.
 */
export interface UploadSession {
  id: string;
  protocol: UploadProtocol;
  fileId: string;
  fileName: string;
  fileSize: number;
  uploadedBytes: number;
  uploadUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: number;
  expiresAt?: number;
}

/**
 * WebSocket message types
 * @group protocols
 * @title WebSocketMessage
 * @description Defines the structure of messages exchanged over WebSockets.
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
