import type { ProtocolAdapter, ProtocolUploadResult, HttpConfig } from '../types/protocolTypes';
import type { UploadFile, UploaderConfig, ChunkInfo, UploadProgress } from '../types';
import { UploaderError } from '../types/uploader';
import { UploaderErrorCodes } from '../constants/error-codes';
import { calculateSpeed, calculateTimeRemaining } from '../utils/helpers';
import { createChunks } from '../utils/files';

/**
 * Calculate progress information
 */
function calculateProgress(loaded: number, total: number, startTime: number): UploadProgress {
  const rawPercentage = total > 0 ? (loaded / total) * 100 : 0;
  const percentage = Math.min(Math.round(rawPercentage), 100);
  const speed = calculateSpeed(loaded, startTime);
  const timeRemaining = calculateTimeRemaining(loaded, total, speed);
  const elapsedTime = (Date.now() - startTime) / 1000;

  return {
    loaded,
    total,
    percentage,
    speed,
    timeRemaining,
    startTime,
    elapsedTime,
  };
}

/**
 * HTTP Protocol Adapter Implementation
 */
export function createHttpAdapter(httpConfig: HttpConfig = {}): ProtocolAdapter {
  return {
    name: 'HTTP',
    protocol: 'http',

    async upload(file: UploadFile, config: UploaderConfig): Promise<ProtocolUploadResult> {
      const fileToUpload = file.processedFile || file.file;
      const useChunking = httpConfig.enableChunking && file.file.size > (config.chunkSize || 0);

      try {
        if (useChunking) {
          await uploadWithChunks(file, fileToUpload, config, httpConfig);
        } else {
          await uploadSimple(file, fileToUpload, config, httpConfig);
        }

        if (file.abortController?.signal.aborted) {
          return {
            success: false,
            error: new UploaderError('Upload paused', {
              fileId: file.id,
              code: UploaderErrorCodes.ABORT_ERROR,
            }),
            bytesUploaded: file.progress.loaded,
          };
        }

        return {
          success: true,
          response: file.response,
          bytesUploaded: file.file.size,
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof UploaderError
              ? error
              : new UploaderError(error instanceof Error ? error.message : String(error), {
                  fileId: file.id,
                  code: UploaderErrorCodes.UPLOAD_FAILED,
                }),
          bytesUploaded: file.progress.loaded,
        };
      }
    },

    async resume(file: UploadFile, config: UploaderConfig): Promise<ProtocolUploadResult> {
      return this.upload(file, config);
    },

    async pause(_fileId: string): Promise<void> {},

    async cancel(_fileId: string): Promise<void> {},
  };
}

/**
 * Upload file without chunking
 */
async function uploadSimple(
  uploadFile: UploadFile,
  fileToUpload: File | Blob,
  config: UploaderConfig,
  httpConfig: HttpConfig,
): Promise<void> {
  const blueprint = config.onBeforeRequest ? await config.onBeforeRequest(uploadFile) : null;

  const formData = new FormData();
  formData.append('fileId', uploadFile.id);
  if (uploadFile.metadata) {
    formData.append('metadata', JSON.stringify(uploadFile.metadata));
  }

  if (blueprint?.params) {
    Object.entries(blueprint.params).forEach(([key, value]) => {
      formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    });
  }

  formData.append('file', fileToUpload, uploadFile.file.name);

  const startTime = Date.now();
  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    const onAbort = () => xhr.abort();

    const cleanup = () => {
      uploadFile.abortController?.signal.removeEventListener('abort', onAbort);
    };

    uploadFile.abortController?.signal.addEventListener('abort', onAbort);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const progress = calculateProgress(e.loaded, e.total, startTime);
        uploadFile.progress = progress;
        config.onUploadProgress?.(uploadFile, progress);
      }
    });

    xhr.onload = () => {
      cleanup();
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          uploadFile.response = JSON.parse(xhr.responseText);
        } catch {
          uploadFile.response = xhr.responseText;
        }
        resolve();
      } else {
        let responseData;
        let message = `Upload failed with status ${xhr.status}`;
        try {
          responseData = JSON.parse(xhr.responseText);
          message = responseData.message || message;
        } catch {
          responseData = xhr.responseText;
        }
        reject(
          new UploaderError(message, {
            code: responseData?.code || UploaderErrorCodes.HTTP_ERROR,
            fileId: uploadFile.id,
            response: responseData,
          }),
        );
      }
    };

    xhr.onerror = () => {
      cleanup();
      const msg =
        xhr.status === 0
          ? 'Network error: Likely CORS or connection refused'
          : `Network error: Status ${xhr.status}`;
      reject(
        new UploaderError(msg, { code: UploaderErrorCodes.NETWORK_ERROR, fileId: uploadFile.id }),
      );
    };

    xhr.ontimeout = () => {
      cleanup();
      reject(
        new UploaderError('Upload timed out', {
          code: UploaderErrorCodes.TIMEOUT_ERROR,
          fileId: uploadFile.id,
        }),
      );
    };

    xhr.onabort = () => {
      cleanup();
      resolve();
    };

    xhr.open(
      blueprint?.method || httpConfig.method || 'POST',
      blueprint?.url || httpConfig.endpoint || '/upload',
    );

    if (config.timeout) {
      xhr.timeout = config.timeout;
    }

    if (httpConfig.headers) {
      Object.entries(httpConfig.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }

    if (blueprint?.headers) {
      Object.entries(blueprint.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }

    if (httpConfig.withCredentials) {
      xhr.withCredentials = true;
    }

    if (uploadFile.abortController?.signal.aborted) {
      resolve();
      return;
    }

    xhr.send(formData);
  });
}

/**
 * Upload a single chunk
 */
async function uploadChunk(
  uploadFile: UploadFile,
  chunk: ChunkInfo,
  config: UploaderConfig,
  httpConfig: HttpConfig,
  onProgressUpdate: () => void,
): Promise<void> {
  const blueprint = config.onBeforeRequest ? await config.onBeforeRequest(uploadFile, chunk) : null;

  const formData = new FormData();
  formData.append('fileId', uploadFile.id);
  formData.append('chunkIndex', chunk.index.toString());
  formData.append('totalChunks', uploadFile.chunks?.length.toString() || '0');
  formData.append('filename', uploadFile.file.name);

  if (uploadFile.metadata) {
    formData.append('metadata', JSON.stringify(uploadFile.metadata));
  }

  if (blueprint?.params) {
    Object.entries(blueprint.params).forEach(([key, value]) => {
      formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    });
  }

  formData.append('file', chunk.blob, uploadFile.file.name);

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    const onAbortSignal = () => {
      xhr.abort();
      cleanup();
      resolve();
    };

    const cleanup = () => {
      uploadFile.abortController?.signal.removeEventListener('abort', onAbortSignal);
    };

    uploadFile.abortController?.signal.addEventListener('abort', onAbortSignal);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        chunk.uploadedBytes = e.loaded;
        onProgressUpdate();
      }
    });

    xhr.onload = () => {
      cleanup();
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        let responseData;
        let message = `Server responded with ${xhr.status}`;
        try {
          responseData = JSON.parse(xhr.responseText);
          message = responseData.message || message;
        } catch {
          responseData = xhr.responseText;
        }
        reject(
          new UploaderError(message, {
            code: responseData?.code || UploaderErrorCodes.HTTP_ERROR,
            fileId: uploadFile.id,
            response: responseData,
          }),
        );
      }
    };

    xhr.onerror = () => {
      cleanup();
      const msg =
        xhr.status === 0
          ? 'Network error: Likely CORS or connection refused'
          : `Network error: Status ${xhr.status}`;
      reject(
        new UploaderError(msg, { code: UploaderErrorCodes.NETWORK_ERROR, fileId: uploadFile.id }),
      );
    };

    xhr.ontimeout = () => {
      cleanup();
      reject(
        new UploaderError('Upload timeout exceeded', {
          code: UploaderErrorCodes.TIMEOUT_ERROR,
          fileId: uploadFile.id,
        }),
      );
    };

    xhr.onabort = () => {
      cleanup();
      resolve();
    };

    if (config.timeout) {
      xhr.timeout = config.timeout;
    }

    xhr.open(
      blueprint?.method || httpConfig.method || 'POST',
      blueprint?.url || httpConfig.endpoint || '/upload',
    );

    if (httpConfig.headers) {
      Object.entries(httpConfig.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }

    if (blueprint?.headers) {
      Object.entries(blueprint.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }

    if (httpConfig.withCredentials) {
      xhr.withCredentials = true;
    }

    if (uploadFile.abortController?.signal.aborted) {
      cleanup();
      resolve();
      return;
    }

    xhr.send(formData);
  });
}

/**
 * Upload file with chunking
 */
async function uploadWithChunks(
  uploadFile: UploadFile,
  fileToUpload: File | Blob,
  config: UploaderConfig,
  httpConfig: HttpConfig,
): Promise<void> {
  const file =
    fileToUpload instanceof File
      ? fileToUpload
      : new File([fileToUpload], uploadFile.file.name, {
          type: fileToUpload.type,
        });

  if (!uploadFile.chunks) {
    uploadFile.chunks = createChunks(file, config.chunkSize || 1024 * 1024);
  }

  const maxConcurrent = httpConfig.maxConcurrentChunks || 3;
  const maxRetries = config.retryConfig?.maxRetries || 3;
  const startTime = Date.now();

  let currentIndex = 0;
  let isTerminated = false;

  const updateGlobalProgress = () => {
    if (!uploadFile.chunks || isTerminated) return;

    const totalFileBytes = file.size;
    const totalLoadedBytes = uploadFile.chunks.reduce((sum, c) => {
      if (c.status === 'completed') return sum + c.size;
      return sum + (c.status !== 'failed' ? c.uploadedBytes || 0 : 0);
    }, 0);

    uploadFile.progress = calculateProgress(totalLoadedBytes, totalFileBytes, startTime);
    config.onUploadProgress?.(uploadFile, uploadFile.progress);
  };

  updateGlobalProgress();

  const worker = async () => {
    while (!isTerminated && !uploadFile.abortController?.signal.aborted) {
      const myIndex = currentIndex++;
      if (myIndex >= uploadFile.chunks!.length) break;

      const chunk = uploadFile.chunks![myIndex];

      if (chunk.status === 'completed') continue;

      chunk.status = 'uploading';
      config.onChunkStart?.(uploadFile, chunk);

      let attempt = 0;
      let success = false;

      while (attempt <= maxRetries && !success && !isTerminated) {
        if (uploadFile.abortController?.signal.aborted) {
          chunk.status = 'pending';
          isTerminated = true;
          break;
        }

        try {
          await uploadChunk(uploadFile, chunk, config, httpConfig, updateGlobalProgress);

          if (uploadFile.abortController?.signal.aborted) {
            chunk.status = 'pending';
            isTerminated = true;
            break;
          }

          chunk.status = 'completed';
          chunk.uploadedBytes = chunk.size;
          success = true;

          updateGlobalProgress();
          config.onChunkComplete?.(uploadFile, chunk);
        } catch (error) {
          if (uploadFile.abortController?.signal.aborted) {
            chunk.status = 'pending';
            isTerminated = true;
            return;
          }

          attempt++;
          chunk.uploadedBytes = 0;
          updateGlobalProgress();

          if (attempt > maxRetries) {
            chunk.status = 'failed';
            isTerminated = true;
            throw error;
          }

          await new Promise((r) => setTimeout(r, 100));
        }
      }
    }
  };

  const pool = Array.from({ length: Math.min(maxConcurrent, uploadFile.chunks.length) }, worker);

  try {
    await Promise.all(pool);
  } catch (err) {
    if (!uploadFile.abortController?.signal.aborted) {
      throw err;
    }
  }
}
