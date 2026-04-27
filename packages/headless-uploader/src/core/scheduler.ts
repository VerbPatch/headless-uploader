import type { UploaderInstance } from '../types';
import { UploaderError } from '../types';
import { UploaderErrorCodes } from '../constants/error-codes';
import { uploadFile } from './processor';
import { updateFileStatus } from '../utils';

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
}

/**
 * Upload a specific file
 */
export async function uploadSingleFile(instance: UploaderInstance, fileId: string): Promise<void> {
  const uploadFileObj = instance.files.get(fileId);
  if (!uploadFileObj) {
    throw new UploaderError(`File with id ${fileId} not found`, {
      fileId,
      code: UploaderErrorCodes.UNKNOWN_ERROR,
    });
  }

  if (uploadFileObj.status === 'uploading' || uploadFileObj.status === 'queued') {
    return;
  }

  updateFileStatus(instance, uploadFileObj, 'queued');

  await uploadFile(instance, uploadFileObj);
}
