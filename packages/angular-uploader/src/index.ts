import { signal, inject, DestroyRef, NgZone, Signal } from '@angular/core';
import {
  useUploader as createUploader,
  UploaderConfig,
  UploaderState,
  UploaderInterface,
} from '@verbpatch/headless-uploader';

export * from '@verbpatch/headless-uploader';

/**
 * Simplified Angular options
 */
export interface AngularUploaderConfig extends UploaderConfig {
  destroyRef?: DestroyRef;
  zone?: NgZone;
}

/**
 * Cleaned up Angular Composable for Headless Uploader
 */
export function useUploader(
  config: AngularUploaderConfig = {},
): UploaderInterface & { state: Signal<UploaderState> } {
  let destroyRef: DestroyRef | null = config.destroyRef ?? null;
  let zone: NgZone | null = config.zone ?? null;

  try {
    if (!destroyRef) destroyRef = inject(DestroyRef, { optional: true });
    if (!zone) zone = inject(NgZone, { optional: true });
  } catch (e) {
    // eslint-disable-next-line
    console.error(e);
  }

  const _state = signal<UploaderState>({
    files: [],
    uploadingFiles: [],
    completedFiles: [],
    failedFiles: [],
    queuedFiles: [],
    totalProgress: { loaded: 0, total: 0, percentage: 0 },
    isUploading: false,
    isPaused: false,
  });

  const refresh = () => {
    const s = uploader.getState();
    const next: UploaderState = {
      ...s,
      files: s.files.map((f) => ({ ...f, progress: { ...f.progress } })),
      totalProgress: { ...s.totalProgress },
    };
    if (zone) zone.run(() => _state.set(next));
    else _state.set(next);
  };

  const uploader = createUploader({
    ...config,
    onFilesAdded: (f) => {
      refresh();
      config.onFilesAdded?.(f);
    },
    onFilesRejected: (e) => {
      refresh();
      config.onFilesRejected?.(e);
    },
    onUploadStart: (f) => {
      refresh();
      config.onUploadStart?.(f);
    },
    onUploadProgress: (f, p) => {
      refresh();
      config.onUploadProgress?.(f, p);
    },
    onUploadComplete: (f) => {
      refresh();
      config.onUploadComplete?.(f);
    },
    onUploadError: (f, e) => {
      refresh();
      config.onUploadError?.(f, e);
    },
    onUploadPause: (f) => {
      refresh();
      config.onUploadPause?.(f);
    },
    onUploadResume: (f) => {
      refresh();
      config.onUploadResume?.(f);
    },
    onUploadCancel: (f) => {
      refresh();
      config.onUploadCancel?.(f);
    },
    onAllComplete: (f) => {
      refresh();
      config.onAllComplete?.(f);
    },
    onMetadataExtracted: (f, m) => {
      refresh();
      config.onMetadataExtracted?.(f, m);
    },
    onPreviewGenerated: (f, p) => {
      refresh();
      config.onPreviewGenerated?.(f, p);
    },
  });

  if (destroyRef) destroyRef.onDestroy(() => uploader.destroy());

  refresh();

  return {
    ...uploader,
    state: _state.asReadonly(),
    removeFile: async (id) => {
      refresh();
      await uploader.removeFile(id);
    },
    clearAll: async () => {
      refresh();
      await uploader.clearAll();
    },
    updateConfig: (c) => {
      refresh();
      uploader.updateConfig(c);
    },
  };
}
