import type { UploaderInstance } from '../types';
import { uploadFile } from './processor';

/**
 * Upload all pending files
 */
export async function uploadAll(instance: UploaderInstance): Promise<void> {
  const pendingFiles = Array.from(instance.files.values()).filter(
    (file) => file.status === 'pending',
  );
  const maxConcurrent = instance.config.maxConcurrent || 3;

  for (let i = 0; i < pendingFiles.length; i += maxConcurrent) {
    const batch = pendingFiles.slice(i, i + maxConcurrent);
    const batchPromises = batch.map((file) => uploadSingleFile(instance, file.id));
    await Promise.all(batchPromises);
  }

  instance.config.onAllComplete?.(Array.from(instance.files.values()));
}

/**
 * Upload a specific file
 */
export async function uploadSingleFile(instance: UploaderInstance, fileId: string): Promise<void> {
  const uploadFileObj = instance.files.get(fileId);
  if (!uploadFileObj) {
    throw new Error(`File with id ${fileId} not found`);
  }

  if (uploadFileObj.status === 'uploading') {
    return;
  }

  uploadFileObj.status = 'queued';

  await uploadFile(instance, uploadFileObj);
}
