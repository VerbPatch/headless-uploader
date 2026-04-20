/**
 * Common uploader error codes
 * @ignore
 */
export const UploaderErrorCodes = {
  // Validation Errors
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_TOO_SMALL: 'FILE_TOO_SMALL',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  DUPLICATE_FILE: 'DUPLICATE_FILE',
  TOO_MANY_FILES: 'TOO_MANY_FILES',
  CUSTOM_VALIDATION_ERROR: 'CUSTOM_VALIDATION_ERROR',

  // Configuration & Environment Errors
  CONFIG_ERROR: 'CONFIG_ERROR',
  BROWSER_UNSUPPORTED: 'BROWSER_UNSUPPORTED',

  // Network & Protocol Errors
  HTTP_ERROR: 'HTTP_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  TUS_ERROR: 'TUS_ERROR',
  CLOUD_UPLOAD_ERROR: 'CLOUD_UPLOAD_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',

  // Internal Errors
  FORMATTING_ERROR: 'FORMATTING_ERROR',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  ABORT_ERROR: 'ABORT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

/**
 * Type representing all possible uploader error codes
 */
export type UploaderErrorCode = (typeof UploaderErrorCodes)[keyof typeof UploaderErrorCodes];

/**
 * @deprecated Use UploaderErrorCodes instead
 */
export const ValidationErrorCodes = UploaderErrorCodes;
