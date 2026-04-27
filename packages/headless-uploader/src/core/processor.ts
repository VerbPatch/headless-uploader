import type { UploaderInstance, UploadFile } from '../types';
import { UploaderError } from '../types';
import { UploaderErrorCodes } from '../constants/error-codes';
import type { ProtocolFactoryConfig } from '../types/protocolTypes';
import { sleep, compressImage, isImage, updateFileStatus, checkAllComplete } from '../utils';
import { createProtocolAdapter } from '../adapters';

/**
 * Retry failed upload with exponential backoff
 */
async function retryUpload(instance: UploaderInstance, uploadFileData: UploadFile): Promise<void> {
  const { config } = instance;
  uploadFileData.retries++;

  const retryConfig = config.retryConfig || {
    maxRetries: 3,
    retryDelay: 1000,
    retryDelayMultiplier: 2,
    retryableStatuses: [408, 429, 500, 502, 503, 504],
  };

  const delay =
    retryConfig.retryDelay * Math.pow(retryConfig.retryDelayMultiplier, uploadFileData.retries - 1);

  config.onRetry?.(uploadFileData, uploadFileData.retries);

  await sleep(delay);

  updateFileStatus(instance, uploadFileData, 'queued');
  uploadFileData.error = undefined;

  await uploadFile(instance, uploadFileData);
}

/**
 * Upload a single file
 */
export async function uploadFile(
  instance: UploaderInstance,
  uploadFileData: UploadFile,
): Promise<void> {
  const { config, activeUploads } = instance;
  const { id, file } = uploadFileData;

  updateFileStatus(instance, uploadFileData, 'uploading');
  uploadFileData.abortController = new AbortController();
  activeUploads.set(id, uploadFileData.abortController);

  try {
    if (config.onBeforeUpload) {
      const result = await config.onBeforeUpload(uploadFileData);
      if (result === false) {
        updateFileStatus(instance, uploadFileData, 'cancelled');
        return;
      }
    }

    config.onUploadStart?.(uploadFileData);

    let fileToUpload: File | Blob = file;
    if (config.compression?.enabled && isImage(file)) {
      fileToUpload = await compressImage(
        file,
        config.compression.quality,
        config.compression.maxWidth,
        config.compression.maxHeight,
        config.compression.mimeType,
      );
      uploadFileData.processedFile = fileToUpload;
    }

    if (!instance.adapter) {
      const factoryConfig: ProtocolFactoryConfig = {
        protocol: config.protocol || 'http',
        http: config.http,
        tus: config.tus,
        websocket: config.websocket,
        webtransport: config.webtransport,
        logger: instance.logger,
      };
      instance.adapter = createProtocolAdapter(factoryConfig);
    }

    if (instance.adapter.initialize) {
      await instance.adapter.initialize(config);
    }

    const result = await instance.adapter.upload(uploadFileData, config);

    if (result.success) {
      uploadFileData.response = result.response;
      updateFileStatus(instance, uploadFileData, 'completed');
      config.onUploadSuccess?.(uploadFileData, uploadFileData.response);
    } else {
      throw (
        result.error ||
        new UploaderError('Upload failed', { fileId: id, code: UploaderErrorCodes.UPLOAD_FAILED })
      );
    }
  } catch (err) {
    const error =
      err instanceof UploaderError
        ? err
        : new UploaderError(err instanceof Error ? err.message : String(err), {
            fileId: id,
            code: UploaderErrorCodes.UPLOAD_FAILED,
          });

    const status = uploadFileData.status as string;
    if (
      error.code === UploaderErrorCodes.ABORT_ERROR ||
      status === 'paused' ||
      status === 'cancelled'
    ) {
      return;
    }

    updateFileStatus(instance, uploadFileData, 'failed');
    uploadFileData.error = error;
    config.onUploadError?.(uploadFileData, error);

    if (config.autoRetry && uploadFileData.retries < (config.retryConfig?.maxRetries || 3)) {
      await retryUpload(instance, uploadFileData);
    }
  } finally {
    activeUploads.delete(id);
    checkAllComplete(instance);
  }
}

/**
 * Pause upload
 */
export async function pauseUpload(instance: UploaderInstance, fileId: string): Promise<void> {
  // console.log("Process pauseUpload", instance, fileId);
  const controller = instance.activeUploads.get(fileId);
  if (controller) {
    controller.abort();
    instance.activeUploads.delete(fileId);
  }

  if (instance.adapter?.pause) {
    await instance.adapter.pause(fileId);
  }
}

/**
 * Cancel upload
 */
export async function cancelUpload(instance: UploaderInstance, fileId: string): Promise<void> {
  const controller = instance.activeUploads.get(fileId);
  if (controller) {
    controller.abort();
    instance.activeUploads.delete(fileId);
  }

  if (instance.adapter?.cancel) {
    await instance.adapter.cancel(fileId);
  }
}
