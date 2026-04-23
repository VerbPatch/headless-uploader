/**
 * Common uploader error codes
 * @group Exception Handling
 * @title UploaderErrorCodes
 * @description Enumeration of machine-readable error codes for identifying specific failure conditions.
 */
export const UploaderErrorCodes = {
  /** The file exceeds the `maxFileSize` limit. */
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  /** The file is smaller than the `minFileSize` limit. */
  FILE_TOO_SMALL: 'FILE_TOO_SMALL',
  /** The file MIME type or extension is not in `acceptedTypes`. */
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  /** The file is already in the queue and `allowDuplicates` is false. */
  DUPLICATE_FILE: 'DUPLICATE_FILE',
  /** The total number of files exceeds `maxFiles`. */
  TOO_MANY_FILES: 'TOO_MANY_FILES',
  /** A custom validator function returned an error or threw an exception. */
  CUSTOM_VALIDATION_ERROR: 'CUSTOM_VALIDATION_ERROR',
  /** The total number of files exceeds `maxFiles`. (Legacy alias for TOO_MANY_FILES) */
  MAX_FILES_EXCEEDED: 'MAX_FILES_EXCEEDED',
  /** The browser does not support a required API (e.g., WebTransport). */
  BROWSER_UNSUPPORTED: 'BROWSER_UNSUPPORTED',
  /** A required configuration property is missing or invalid. */
  CONFIG_ERROR: 'CONFIG_ERROR',
  /** A standard HTTP request failed (non-2xx response). */
  HTTP_ERROR: 'HTTP_ERROR',
  /** A physical network failure or DNS resolution issue occurred. */
  NETWORK_ERROR: 'NETWORK_ERROR',
  /** The request exceeded the configured `timeout`. */
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  /** A protocol-level error occurred within the Tus client. */
  TUS_ERROR: 'TUS_ERROR',
  /** The server sent an invalid or malformed response. */
  SERVER_ERROR: 'SERVER_ERROR',
  /** An internal error occurred during data formatting. */
  FORMATTING_ERROR: 'FORMATTING_ERROR',
  /** A generic catch-all for failed upload attempts. */
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  /** The upload was intentionally stopped (paused/cancelled). */
  ABORT_ERROR: 'ABORT_ERROR',
  /** An error occurred that does not fit into other categories. */
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

/**
 * Type representing all possible uploader error codes
 * @group Exception Handling
 * @title UploaderErrorCode
 * @description Type representing all possible uploader error codes.
 */
export type UploaderErrorCode = (typeof UploaderErrorCodes)[keyof typeof UploaderErrorCodes];
