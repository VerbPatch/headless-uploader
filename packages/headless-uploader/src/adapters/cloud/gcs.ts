import type { CloudAdapter, UploadFile, UploaderConfig, GCSAdapterOptions } from '../../types';
import { UploaderError } from '../../types/uploader';
import { UploaderErrorCodes } from '../../constants/error-codes';

/**
 * Create a Google Cloud Storage adapter
 * @param options - Configuration options for GCS
 * @group cloud
 * @title createGCSAdapter
 * @description Factory function that creates an adapter for direct uploads to Google Cloud Storage using signed URLs.
 */
export function createGCSAdapter(options: GCSAdapterOptions): CloudAdapter {
  const abortControllers = new Map<string, AbortController>();

  return {
    name: 'Google Cloud Storage',

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
        throw new UploaderError(`GCS upload failed: ${response.statusText}`, {
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
