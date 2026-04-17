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
  ChunkInfo,
} from '../types';
import { calculateSpeed, calculateTimeRemaining } from '../utils/helpers';

/**
 * TUS Protocol Implementation
 * Uses the official tus-js-client for robust resumable uploads.
 */
export function createTusAdapter(tusConfig: TusConfig): ProtocolAdapter {
  const activeUploads = new Map<
    string,
    {
      instance: Upload;
      resolve: (result: ProtocolUploadResult) => void;
      currentBytes: number;
    }
  >();

  return {
    name: 'TUS',
    protocol: 'tus',

    async upload(file: UploadFile, config: UploaderConfig): Promise<ProtocolUploadResult> {
      try {
        const tusModule = await import('tus-js-client');

        const tus =
          (
            tusModule as unknown as {
              default?: typeof import('tus-js-client');
              Upload: typeof Upload;
            }
          ).default || tusModule;

        if (!tus || !tus.Upload) {
          throw new Error('Failed to load TUS client');
        }

        return new Promise(async (resolve) => {
          let currentBytesUploaded = file.progress.loaded || 0;

          const blueprint = config.onBeforeRequest ? await config.onBeforeRequest(file) : null;

          const uploadInstance = new tus.Upload(file.processedFile || file.file, {
            ...tusConfig,
            endpoint: (blueprint?.url as string) || tusConfig.endpoint,
            headers: {
              ...(tusConfig.headers || {}),
              ...(blueprint?.headers || {}),
            },
            storeFingerprintForResuming: true,
            removeFingerprintOnSuccess: true,

            retryDelays:
              tusConfig.retryDelays ||
              (config.retryConfig
                ? [
                    0,
                    config.retryConfig.retryDelay,
                    config.retryConfig.retryDelay * (config.retryConfig.retryDelayMultiplier || 2),
                  ]
                : [0, 1000, 3000, 5000]),
            metadata: {
              filename: file.metadata.name,
              filetype: file.metadata.type || 'application/octet-stream',
              ...tusConfig.metadata,
            },
            chunkSize: tusConfig.chunkSize || config.chunkSize,

            onError: (error: Error) => {
              if (error.message?.includes('tus: upload was aborted')) {
                return;
              }
              // eslint-disable-next-line
              console.error('TUS Error:', error);
              activeUploads.delete(file.id);
              tusConfig.onError?.(error);

              resolve({
                success: false,
                error,
                bytesUploaded: currentBytesUploaded,
              });
            },

            onProgress: (bytesUploaded: number, bytesTotal: number) => {
              if (file.progress.startTime === 0) {
                file.progress.startTime = Date.now();
              }

              currentBytesUploaded = bytesUploaded;
              file.progress.loaded = bytesUploaded;
              file.progress.total = bytesTotal;
              file.progress.percentage = (bytesUploaded / bytesTotal) * 100;
              file.progress.speed = calculateSpeed(bytesUploaded, file.progress.startTime);
              file.progress.timeRemaining = calculateTimeRemaining(
                bytesUploaded,
                bytesTotal,
                file.progress.speed,
              );

              const active = activeUploads.get(file.id);
              if (active) active.currentBytes = bytesUploaded;

              tusConfig.onProgress?.(bytesUploaded, bytesTotal);
              config.onUploadProgress?.(file, file.progress);
            },

            onSuccess: (successPayload: OnSuccessPayload) => {
              activeUploads.delete(file.id);

              file.status = 'completed';
              file.progress.percentage = 100;
              file.progress.loaded = file.metadata.size;

              const payload = (uploadInstance as unknown as { url: string }).url;

              // TUS success doesn't always provide a payload in all versions
              // We pass the URL as the payload
              tusConfig.onSuccess?.(successPayload);

              resolve({
                success: true,
                uploadId: uploadInstance.url ?? undefined,
                url: uploadInstance.url ?? undefined,
                response: payload,
                bytesUploaded: file.metadata.size,
              });
            },

            onChunkComplete: (chunkSize: number, bytesAccepted: number, bytesTotal: number) => {
              const chunkInfo: ChunkInfo = {
                index: -1,
                start: bytesAccepted - chunkSize,
                end: bytesAccepted,
                blob: new Blob([]),
                size: chunkSize,
                status: 'completed',
                uploadedBytes: bytesAccepted,
                retries: 0,
              };

              tusConfig.onChunkComplete?.(chunkSize, bytesAccepted, bytesTotal);
              config.onChunkComplete?.(file, chunkInfo);
            },

            onShouldRetry: (error: DetailedError, retryAttempt: number, options: UploadOptions) => {
              let shouldRetry = true;
              if (tusConfig.onShouldRetry) {
                shouldRetry = tusConfig.onShouldRetry(error, retryAttempt, options);
              }
              config.onRetry?.(file, retryAttempt);
              return shouldRetry;
            },

            onUploadUrlAvailable: () => {
              tusConfig.onUploadUrlAvailable?.();
            },
          });

          activeUploads.set(file.id, {
            instance: uploadInstance,
            resolve,
            currentBytes: currentBytesUploaded,
          });

          uploadInstance.findPreviousUploads().then((previousUploads: PreviousUpload[]) => {
            if (previousUploads.length > 0) {
              uploadInstance.resumeFromPreviousUpload(previousUploads[0]);
            }
            uploadInstance.start();
          });
        });
      } catch (err) {
        // eslint-disable-next-line
        console.error('TUS Adapter Initialization Error:', err);
        return {
          success: false,
          error: err instanceof Error ? err : new Error('Unknown TUS error'),
          bytesUploaded: 0,
        };
      }
    },

    async resume(file: UploadFile, config: UploaderConfig): Promise<ProtocolUploadResult> {
      config.onUploadResume?.(file);
      return this.upload(file, config);
    },

    async pause(fileId: string): Promise<void> {
      const active = activeUploads.get(fileId);
      if (active) {
        active.instance.abort();

        active.resolve({
          success: false,
          error: new Error('Upload paused'),
          bytesUploaded: active.currentBytes,
        });

        activeUploads.delete(fileId);
      }
    },

    async cancel(fileId: string): Promise<void> {
      const active = activeUploads.get(fileId);
      if (active) {
        active.instance.abort(true);

        active.resolve({
          success: false,
          error: new Error('Upload cancelled'),
          bytesUploaded: active.currentBytes,
        });

        activeUploads.delete(fileId);
      }
    },
  };
}
