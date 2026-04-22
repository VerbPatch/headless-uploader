import { ReactiveController, ReactiveControllerHost } from 'lit';
import {
  useUploader as createUploader,
  UploaderConfig,
  UploaderState,
  UploaderInterface,
} from '@verbpatch/headless-uploader';
export * from '@verbpatch/headless-uploader';

/**
 * Lit controller for managing the uploader
 */
export class UploaderController implements ReactiveController {
  private host: ReactiveControllerHost;
  private options: UploaderConfig;
  private _uploader: UploaderInterface;

  /**
   * Get the uploader instance
   */
  public get uploader(): UploaderInterface {
    return this._uploader;
  }

  /**
   * Get the current uploader state
   */
  public get state(): UploaderState {
    return this._uploader.getState();
  }

  constructor(host: ReactiveControllerHost, options: UploaderConfig) {
    this.host = host;
    this.options = options;

    const refresh = () => this.host.requestUpdate();

    const instance = createUploader({
      ...this.options,
      onFilesAdded: (files) => {
        refresh();
        this.options.onFilesAdded?.(files);
      },
      onQueueChange: (files) => {
        refresh();
        this.options.onQueueChange?.(files);
      },
      onStateChange: (file) => {
        refresh();
        this.options.onStateChange?.(file);
      },
      onFilesRejected: (errors) => {
        refresh();
        this.options.onFilesRejected?.(errors);
      },
      onValidationStart: (files) => {
        refresh();
        this.options.onValidationStart?.(files);
      },
      onValidationComplete: (results) => {
        refresh();
        this.options.onValidationComplete?.(results);
      },
      onBeforeUpload: async (file) => {
        const result = await this.options.onBeforeUpload?.(file);
        refresh();
        return result;
      },
      onUploadStart: (file) => {
        refresh();
        this.options.onUploadStart?.(file);
      },
      onUploadProgress: (file, progress) => {
        refresh();
        this.options.onUploadProgress?.(file, progress);
      },
      onChunkStart: (file, chunk) => {
        refresh();
        this.options.onChunkStart?.(file, chunk);
      },
      onChunkComplete: (file, chunk) => {
        refresh();
        this.options.onChunkComplete?.(file, chunk);
      },
      onUploadPause: (file) => {
        refresh();
        this.options.onUploadPause?.(file);
      },
      onUploadResume: (file) => {
        refresh();
        this.options.onUploadResume?.(file);
      },
      onUploadCancel: (file) => {
        refresh();
        this.options.onUploadCancel?.(file);
      },
      onUploadSuccess: (file, response) => {
        refresh();
        this.options.onUploadSuccess?.(file, response);
      },
      onUploadError: (file, error) => {
        refresh();
        this.options.onUploadError?.(file, error);
      },
      onRetry: (file, attempt) => {
        refresh();
        this.options.onRetry?.(file, attempt);
      },
      onAllComplete: (files) => {
        refresh();
        this.options.onAllComplete?.(files);
      },
      onMetadataExtracted: (file, metadata) => {
        refresh();
        this.options.onMetadataExtracted?.(file, metadata);
      },
      onPreviewGenerated: (file, preview) => {
        refresh();
        this.options.onPreviewGenerated?.(file, preview);
      },
    });

    this._uploader = {
      ...instance,
      addFiles: async (fileList) => {
        await instance.addFiles(fileList);
        refresh();
      },
      removeFile: async (fileId) => {
        await instance.removeFile(fileId);
        refresh();
      },
      clearAll: async () => {
        await instance.clearAll();
        refresh();
      },
      uploadAll: async () => {
        await instance.uploadAll();
        refresh();
      },
      uploadFile: async (fileId) => {
        await instance.uploadFile(fileId);
        refresh();
      },
      pauseUpload: async (fileId) => {
        await instance.pauseUpload(fileId);
        refresh();
      },
      resumeUpload: async (fileId) => {
        await instance.resumeUpload(fileId);
        refresh();
      },
      cancelUpload: async (fileId) => {
        await instance.cancelUpload(fileId);
        refresh();
      },
      retryUpload: async (fileId) => {
        await instance.retryUpload(fileId);
        refresh();
      },
      handleDrop: async (event) => {
        await instance.handleDrop(event);
        refresh();
      },
      handleFileSelect: async (event) => {
        await instance.handleFileSelect(event);
        refresh();
      },
      updateConfig: (config) => {
        instance.updateConfig(config);
        refresh();
      },
    };

    host.addController(this);
  }

  hostConnected() {}

  hostDisconnected() {
    this._uploader.destroy();
  }
}

/**
 * Lit hook for using the uploader
 * @param host - Reactive controller host
 * @param options - Uploader configuration
 * @returns An uploader controller
 */
export function useUploader(host: ReactiveControllerHost, options: UploaderConfig) {
  return new UploaderController(host, options);
}
