import { shallowReactive, onUnmounted } from 'vue';
export * from '@verbpatch/headless-uploader';

import {
  useUploader as createUploader,
  UploaderConfig,
  UploaderState,
  UploaderInterface,
} from '@verbpatch/headless-uploader';

/**
 * Vue uploader instance that includes the reactive state
 */
export interface VueUploader extends Omit<UploaderInterface, 'getState'> {
  state: UploaderState;
}

/**
 * Vue hook for using the uploader
 * @param config - Uploader configuration
 * @returns The uploader instance and its reactive state
 */
export function useUploader(config: UploaderConfig = {}): VueUploader {
  const state = shallowReactive<UploaderState>({
    files: [],
    uploadingFiles: [],
    completedFiles: [],
    failedFiles: [],
    queuedFiles: [],
    totalProgress: { loaded: 0, total: 0, percentage: 0 },
    isUploading: false,
    isPaused: false,
  });

  function refresh() {
    if (!uploader) return;

    const raw = uploader.getState();
    state.files = raw.files.map((f) => ({ ...f, progress: { ...f.progress } }));
    state.uploadingFiles = raw.uploadingFiles.map((f) => ({ ...f, progress: { ...f.progress } }));
    state.completedFiles = raw.completedFiles.map((f) => ({ ...f, progress: { ...f.progress } }));
    state.failedFiles = raw.failedFiles.map((f) => ({ ...f, progress: { ...f.progress } }));
    state.queuedFiles = raw.queuedFiles.map((f) => ({ ...f, progress: { ...f.progress } }));
    state.totalProgress = { ...raw.totalProgress };
    state.isUploading = raw.isUploading;
    state.isPaused = raw.isPaused;
  }

  const uploader: UploaderInterface = createUploader({
    ...config,
    onFilesAdded: (files) => {
      refresh();
      config.onFilesAdded?.(files);
    },
    onQueueChange: (files) => {
      refresh();
      config.onQueueChange?.(files);
    },
    onStateChange: (file) => {
      refresh();
      config.onStateChange?.(file);
    },
    onFilesRejected: (errors) => {
      refresh();
      config.onFilesRejected?.(errors);
    },
    onValidationStart: (files) => {
      refresh();
      config.onValidationStart?.(files);
    },
    onValidationComplete: (results) => {
      refresh();
      config.onValidationComplete?.(results);
    },
    onBeforeUpload: async (file) => {
      const result = await config.onBeforeUpload?.(file);
      refresh();
      return result;
    },
    onUploadStart: (file) => {
      refresh();
      config.onUploadStart?.(file);
    },
    onUploadProgress: (file, progress) => {
      refresh();
      config.onUploadProgress?.(file, progress);
    },
    onChunkStart: (file, chunk) => {
      refresh();
      config.onChunkStart?.(file, chunk);
    },
    onChunkComplete: (file, chunk) => {
      refresh();
      config.onChunkComplete?.(file, chunk);
    },
    onUploadPause: (file) => {
      refresh();
      config.onUploadPause?.(file);
    },
    onUploadResume: (file) => {
      refresh();
      config.onUploadResume?.(file);
    },
    onUploadCancel: (file) => {
      refresh();
      config.onUploadCancel?.(file);
    },
    onUploadSuccess: (file, response) => {
      refresh();
      config.onUploadSuccess?.(file, response);
    },
    onUploadError: (file, error) => {
      refresh();
      config.onUploadError?.(file, error);
    },
    onRetry: (file, attempt) => {
      refresh();
      config.onRetry?.(file, attempt);
    },
    onAllComplete: (files) => {
      refresh();
      config.onAllComplete?.(files);
    },
    onMetadataExtracted: (file, metadata) => {
      refresh();
      config.onMetadataExtracted?.(file, metadata);
    },
    onPreviewGenerated: (file, preview) => {
      refresh();
      config.onPreviewGenerated?.(file, preview);
    },
  });

  refresh();

  try {
    onUnmounted(() => {
      uploader.destroy();
    });
  } catch (e) {
    // eslint-disable-next-line
    console.error(e);
  }

  return {
    ...uploader,
    state,
    removeFile: async (fileId: string) => {
      await uploader.removeFile(fileId);
      refresh();
    },
    clearAll: async () => {
      await uploader.clearAll();
      refresh();
    },
    updateConfig: (c) => {
      uploader.updateConfig(c);
      refresh();
    },
    handleDrop: async (event: DragEvent) => {
      await uploader.handleDrop(event);
      refresh();
    },
    handleFileSelect: async (event: Event) => {
      await uploader.handleFileSelect(event);
      refresh();
    },
  };
}
