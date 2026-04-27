import { UploaderError } from '../types/uploader';
import { UploaderErrorCodes, UploaderErrorCode } from '../constants/error-codes';

/**
 * Internal logger class that respects the debug flag
 */
export class Logger {
  private debug: boolean;
  private prefix = '[HeadlessUploader]';

  constructor(debug = false) {
    this.debug = debug;
  }

  // eslint-disable-next-line
  log(...args: any[]) {
    if (this.debug) {
      // eslint-disable-next-line no-console
      console.log(this.prefix, ...args);
    }
  }

  // eslint-disable-next-line
  warn(...args: any[]) {
    if (this.debug) {
      // eslint-disable-next-line no-console
      console.warn(this.prefix, ...args);
    }
  }

  // eslint-disable-next-line
  error(...args: any[]) {
    if (this.debug) {
      // eslint-disable-next-line no-console
      console.error(this.prefix, ...args);
    }
  }

  /**
   * Create and log a standardized UploaderError
   */
  createError(
    message: string,
    options?: {
      code?: UploaderErrorCode;
      fileId?: string;
      response?: unknown;
      originalError?: unknown;
    },
  ): UploaderError {
    const error = new UploaderError(message, {
      code: options?.code || UploaderErrorCodes.UNKNOWN_ERROR,
      fileId: options?.fileId,
      response: options?.response,
    });

    if (options?.originalError) {
      // eslint-disable-next-line
      (error as any).cause = options.originalError;
    }

    this.error(`Error [${error.code}]: ${message}`, options?.originalError || '');

    return error;
  }
}

/**
 * Default logger instance for when a config is not yet available
 */
export const defaultLogger = new Logger(false);
