import { writable, type Writable } from 'svelte/store';
import { onDestroy } from 'svelte';
import {
  useUploader as createUploader,
  UploaderConfig,
  UploaderState,
} from '@verbpatch/headless-uploader';

export * from '@verbpatch/headless-uploader';

/**
 * Svelte uploader instance that includes the current state
 */
export interface SvelteUploader extends ReturnType<typeof createUploader> {
  state: UploaderState;
}

/**
 * Svelte hook for using the uploader
 * @param config - Uploader configuration
 * @returns A writable store containing the uploader instance and its state
 */
export function useUploader(config: UploaderConfig = {}): Writable<SvelteUploader> {
  const uploaderStore = writable<SvelteUploader>({
    state: {
      files: [],
      uploadingFiles: [],
      completedFiles: [],
      failedFiles: [],
      queuedFiles: [],
      totalProgress: { loaded: 0, total: 0, percentage: 0 },
      isUploading: false,
      isPaused: false,
    },
  } as any);

  function refreshStore() {
    if (!uploader) return;

    const rawState = uploader.getState();
    const clonedState: UploaderState = {
      ...rawState,
      files: rawState.files.map((f) => ({
        ...f,
        progress: { ...f.progress },
      })),
      uploadingFiles: rawState.uploadingFiles.map((f) => ({
        ...f,
        progress: { ...f.progress },
      })),
      completedFiles: rawState.completedFiles.map((f) => ({
        ...f,
        progress: { ...f.progress },
      })),
      failedFiles: rawState.failedFiles.map((f) => ({
        ...f,
        progress: { ...f.progress },
      })),
      queuedFiles: rawState.queuedFiles.map((f) => ({
        ...f,
        progress: { ...f.progress },
      })),
      totalProgress: { ...rawState.totalProgress },
    };

    uploaderStore.set({
      ...uploader,
      removeFile: async (fileId: string) => {
        await uploader.removeFile(fileId);
        refreshStore();
      },
      clearAll: async () => {
        await uploader.clearAll();
        refreshStore();
      },
      state: clonedState,
    });
  }

  const uploader: ReturnType<typeof createUploader> = createUploader({
    ...config,
    onFilesAdded: (files) => {
      refreshStore();
      config.onFilesAdded?.(files);
    },
    onQueueChange: (files) => {
      refreshStore();
      config.onQueueChange?.(files);
    },
    onStateChange: (file) => {
      refreshStore();
      config.onStateChange?.(file);
    },
    onFilesRejected: (errors) => {
      refreshStore();
      config.onFilesRejected?.(errors);
    },
    onValidationStart: (files) => {
      refreshStore();
      config.onValidationStart?.(files);
    },
    onValidationComplete: (results) => {
      refreshStore();
      config.onValidationComplete?.(results);
    },
    onBeforeUpload: async (file) => {
      const result = await config.onBeforeUpload?.(file);
      refreshStore();
      return result;
    },
    onUploadStart: (file) => {
      refreshStore();
      config.onUploadStart?.(file);
    },
    onUploadProgress: (file, progress) => {
      refreshStore();
      config.onUploadProgress?.(file, progress);
    },
    onChunkStart: (file, chunk) => {
      refreshStore();
      config.onChunkStart?.(file, chunk);
    },
    onChunkComplete: (file, chunk) => {
      refreshStore();
      config.onChunkComplete?.(file, chunk);
    },
    onUploadPause: (file) => {
      refreshStore();
      config.onUploadPause?.(file);
    },
    onUploadResume: (file) => {
      refreshStore();
      config.onUploadResume?.(file);
    },
    onUploadCancel: (file) => {
      refreshStore();
      config.onUploadCancel?.(file);
    },
    onUploadSuccess: (file, response) => {
      refreshStore();
      config.onUploadSuccess?.(file, response);
    },
    onUploadError: (file, error) => {
      refreshStore();
      config.onUploadError?.(file, error);
    },
    onRetry: (file, attempt) => {
      refreshStore();
      config.onRetry?.(file, attempt);
    },
    onAllComplete: (files) => {
      refreshStore();
      config.onAllComplete?.(files);
    },
    onMetadataExtracted: (file, metadata) => {
      refreshStore();
      config.onMetadataExtracted?.(file, metadata);
    },
    onPreviewGenerated: (file, preview) => {
      refreshStore();
      config.onPreviewGenerated?.(file, preview);
    },
  });

  refreshStore();

  try {
    onDestroy(() => {
      uploader.destroy();
    });
  } catch (e) {
    // eslint-disable-next-line
    console.error(e);
  }

  return uploaderStore;
}
