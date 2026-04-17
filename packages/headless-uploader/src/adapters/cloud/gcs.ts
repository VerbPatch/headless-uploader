import type { CloudAdapter, UploadFile, UploaderConfig, GCSAdapterOptions } from '../../types';

/**
 * Create a Google Cloud Storage adapter
 * @param options - Configuration options for GCS
 * @group cloud
 * @title createGCSAdapter
 * @description Factory function that creates an adapter for direct uploads to Google Cloud Storage using Signed URLs.
 */
export function createGCSAdapter(options: GCSAdapterOptions): CloudAdapter {
  const abortControllers = new Map<string, AbortController>();

  return {
    name: 'Google Cloud Storage',

    async getUploadUrl(file: UploadFile): Promise<string> {
      return options.getUploadUrl(file);
    },

    async upload(file: UploadFile, config: UploaderConfig): Promise<unknown> {
      const url = await this.getUploadUrl!(file);
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
        throw new Error(`GCS upload failed: ${response.statusText}`);
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
