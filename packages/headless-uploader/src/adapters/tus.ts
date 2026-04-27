import type {
  UploadOptions,
  Upload,
  PreviousUpload,
  DetailedError,
  OnSuccessPayload,
} from 'tus-js-client';
import type {
  ProtocolAdapter,
  ProtocolUploadResult,
  TusConfig,
  UploaderConfig,
  UploadFile,
} from '../types';
import { UploaderErrorCodes } from '../constants/error-codes';
import * as tus from 'tus-js-client';
import { Logger, defaultLogger } from '../utils/logger';
import { calculateProgress, applyBeforeRequestHook } from '../utils';

/**
 * TUS Protocol Adapter Implementation
 */
export function createTusAdapter(
  tusConfig: TusConfig,
  logger: Logger = defaultLogger,
): ProtocolAdapter {
  const activeUploads = new Map<string, Upload>();

  return {
    name: 'TUS',
    protocol: 'tus',
    logger,

    async upload(file: UploadFile, config: UploaderConfig): Promise<ProtocolUploadResult> {
      const fileId = file.id;
      const startTime = Date.now();

      const blueprint = await applyBeforeRequestHook(file, config);

      return new Promise((resolve, reject) => {
        const options: UploadOptions = {
          ...tusConfig,
          endpoint: tusConfig.endpoint,
          retryDelays: tusConfig.retryDelays || [0, 1000, 3000, 5000],
          metadata: {
            filename: file.metadata.name,
            filetype: file.metadata.type,
            ...tusConfig.metadata,
          },
          headers: {
            ...tusConfig.headers,
            ...blueprint?.headers,
          },
          chunkSize: tusConfig.chunkSize || config.chunkSize || 1024 * 1024,
          onProgress: (bytesUploaded, bytesTotal) => {
            const progress = calculateProgress(bytesUploaded, bytesTotal, startTime);
            file.progress = progress;
            config.onUploadProgress?.(file, progress);
          },
          onSuccess: (payload?: OnSuccessPayload) => {
            file.response = payload;
            activeUploads.delete(fileId);
            resolve({
              success: true,
              bytesUploaded: file.metadata.size,
              response: payload,
            });
          },
          onError: (err: Error | DetailedError) => {
            activeUploads.delete(fileId);

            const error = logger.createError(err.message, {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              code: (err as any).originalResponse?.status
                ? UploaderErrorCodes.HTTP_ERROR
                : UploaderErrorCodes.UPLOAD_FAILED,
              fileId,
              response: (err as DetailedError).originalResponse,
              originalError: err,
            });

            reject(error);
          },
        };

        const upload = new tus.Upload(file.file, options);
        activeUploads.set(fileId, upload);

        if (tusConfig.storeFingerprintForResuming !== false) {
          upload.findPreviousUploads().then((previousUploads: PreviousUpload[]) => {
            if (previousUploads.length > 0) {
              upload.resumeFromPreviousUpload(previousUploads[0]);
            }
            upload.start();
          });
        } else {
          upload.start();
        }
      });
    },

    async pause(fileId: string): Promise<void> {
      const active = activeUploads.get(fileId);
      if (active) {
        logger.log(`TUS upload paused: ${fileId}`);
        active.abort();
      }
    },

    async cancel(fileId: string): Promise<void> {
      const active = activeUploads.get(fileId);
      if (active) {
        logger.log(`TUS upload cancelled: ${fileId}`);
        active.abort(true);
        activeUploads.delete(fileId);
      }
    },
  };
}
