import type {
  UploaderInstance,
  UploadFile,
  UploaderConfig,
  UploadProgress,
  ChunkInfo,
  RequestBlueprint,
} from '../types';
import { calculateSpeed, calculateTimeRemaining } from './helpers';

/**
 * Update file status and trigger onStateChange
 * @internal
 */
export function updateFileStatus(
  instance: UploaderInstance,
  file: UploadFile,
  status: UploadFile['status'],
) {
  if (file.status !== status) {
    file.status = status;
    instance.config.onStateChange?.(file);
  }
}

/**
 * Check if all uploads are complete and trigger onAllComplete
 * @internal
 */
export function checkAllComplete(instance: UploaderInstance) {
  const { config, files, activeUploads } = instance;
  const allFiles = Array.from(files.values());

  if (allFiles.length === 0) return;

  const hasIncomplete = allFiles.some(
    (f) => f.status === 'pending' || f.status === 'queued' || f.status === 'uploading',
  );

  if (activeUploads.size === 0 && !hasIncomplete) {
    config.onAllComplete?.(allFiles);
  }
}

/**
 * Trigger onQueueChange event
 * @internal
 */
export function triggerQueueChange(instance: UploaderInstance) {
  instance.config.onQueueChange?.(Array.from(instance.files.values()));
}

/**
 * Common progress calculator for adapters
 */
export function calculateProgress(
  loaded: number,
  total: number,
  startTime: number,
): UploadProgress {
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
 * Apply the onBeforeRequest hook if present
 */
export async function applyBeforeRequestHook(
  file: UploadFile,
  config: UploaderConfig,
  chunk?: ChunkInfo,
): Promise<RequestBlueprint | null> {
  if (config.onBeforeRequest) {
    return (await config.onBeforeRequest(file, chunk)) || null;
  }
  return null;
}

/**
 * Standardized FormData preparation for HTTP/Multipart
 */
export function prepareFormData(
  file: UploadFile,
  dataToUpload: Blob | File,
  blueprint: RequestBlueprint | null,
  chunk?: ChunkInfo,
): FormData {
  const formData = new FormData();
  formData.append('fileId', file.id);

  if (file.metadata) {
    formData.append('metadata', JSON.stringify(file.metadata));
  }

  if (chunk) {
    formData.append('chunkIndex', chunk.index.toString());
    formData.append('totalChunks', file.chunks?.length.toString() || '0');
    formData.append('filename', file.file.name);
  }

  if (blueprint?.params) {
    Object.entries(blueprint.params).forEach(([key, value]) => {
      formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    });
  }

  formData.append('file', dataToUpload, file.file.name);

  return formData;
}
