import type { CloudAdapter, UploadFile, UploaderConfig, S3AdapterOptions } from '../../types';
import { UploaderError } from '../../types/uploader';
import { UploaderErrorCodes } from '../../constants/error-codes';

/**
 * Create an AWS S3 cloud storage adapter
 * @param options - Configuration options for S3
 * @group cloud
 * @title createS3Adapter
 * @description Factory function that creates an adapter for direct uploads to AWS S3 using presigned URLs.
 */
export function createS3Adapter(options: S3AdapterOptions): CloudAdapter {
  const abortControllers = new Map<string, AbortController>();

  return {
    name: 'AWS S3',

    async upload(file: UploadFile, _config: UploaderConfig): Promise<unknown> {
      const url = await options.getUploadUrl(file);
      const controller = new AbortController();
      abortControllers.set(file.id, controller);

      const response = await fetch(url, {
        method: 'PUT',
        body: file.processedFile || file.file,
        headers: {
          'Content-Type': file.metadata.type || 'application/octet-stream',
          ...options.headers,
        },
        signal: controller.signal,
      });

      abortControllers.delete(file.id);

      if (!response.ok) {
        throw new UploaderError(`S3 upload failed: ${response.statusText}`, {
          fileId: file.id,
          code: UploaderErrorCodes.CLOUD_UPLOAD_ERROR,
          response: response.status,
        });
      }

      return {
        success: true,
        url: url.split('?')[0],
        status: response.status,
      };
    },

    async abortUpload(fileId: string): Promise<void> {
      const controller = abortControllers.get(fileId);
      if (controller) {
        controller.abort();
        abortControllers.delete(fileId);
      }
    },
  };
}
