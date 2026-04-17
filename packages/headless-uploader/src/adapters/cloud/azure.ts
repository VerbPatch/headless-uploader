import type { CloudAdapter, UploadFile, UploaderConfig, AzureAdapterOptions } from '../../types';

/**
 * Create an Azure Blob Storage cloud storage adapter
 * @param options - Configuration options for Azure
 * @group cloud
 * @title createAzureAdapter
 * @description Factory function that creates an adapter for direct uploads to Azure Blob Storage using SAS URLs.
 */
export function createAzureAdapter(options: AzureAdapterOptions): CloudAdapter {
  const abortControllers = new Map<string, AbortController>();

  return {
    name: 'Azure Blob Storage',

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
          'x-ms-blob-type': options.blobType || 'BlockBlob',
          'Content-Type': file.metadata.type || 'application/octet-stream',
          ...options.headers,
        },
        signal: controller.signal,
      });

      abortControllers.delete(file.id);

      if (!response.ok) {
        throw new Error(`Azure upload failed: ${response.statusText}`);
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
