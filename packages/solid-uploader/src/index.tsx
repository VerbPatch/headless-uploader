import { onCleanup } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
export * from '@verbpatch/headless-uploader';

import {
  useUploader as createUploader,
  UploaderConfig,
  UploaderState,
  UploaderInterface,
} from '@verbpatch/headless-uploader';

/**
 * Solid uploader instance that includes the reactive state
 */
export interface SolidUploader extends Omit<UploaderInterface, 'getState'> {
  state: UploaderState;
}

/**
 * Solid hook for using the uploader
 * @param config - Uploader configuration
 * @returns The uploader instance and its reactive state
 */
export function useUploader(config: UploaderConfig = {}): SolidUploader {
  const [state, setState] = createStore<UploaderState>({
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
    const rawState = uploader.getState();
    // Deep clone state to ensure Solid's store reactivity picks up changes
    const newState: UploaderState = {
      ...rawState,
      files: rawState.files.map((f) => ({ ...f, progress: { ...f.progress } })),
      uploadingFiles: rawState.uploadingFiles.map((f) => ({ ...f, progress: { ...f.progress } })),
      completedFiles: rawState.completedFiles.map((f) => ({ ...f, progress: { ...f.progress } })),
      failedFiles: rawState.failedFiles.map((f) => ({ ...f, progress: { ...f.progress } })),
      queuedFiles: rawState.queuedFiles.map((f) => ({ ...f, progress: { ...f.progress } })),
      totalProgress: { ...rawState.totalProgress },
    };
    setState(reconcile(newState));
  }

  const uploader: UploaderInterface = createUploader({
    ...config,
    onFilesAdded: (files) => {
      refresh();
      config.onFilesAdded?.(files);
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
      await config.onBeforeUpload?.(file);
      refresh();
    },
    onUploadStart: (file) => {
      refresh();
      config.onUploadStart?.(file);
    },
    onUploadProgress: (file, progress) => {
      refresh();
      config.onUploadProgress?.(file, progress);
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
    onUploadComplete: (file) => {
      refresh();
      config.onUploadComplete?.(file);
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

  // Initial sync
  refresh();

  onCleanup(() => {
    uploader.destroy();
  });

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
