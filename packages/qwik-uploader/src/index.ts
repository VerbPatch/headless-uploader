import { useStore, useVisibleTask$, $, noSerialize, NoSerialize, QRL } from '@builder.io/qwik';
import {
  useUploader as createUploader,
  UploaderConfig,
  UploaderState,
  UploaderInterface,
  UploadFile,
} from '@verbpatch/headless-uploader';

export * from '@verbpatch/headless-uploader';

/**
 * Qwik-specific uploader interface.
 * All methods are QRLs (wrapped in $()) so they can be passed across serializable boundaries.
 */
export interface QwikUploader {
  state: UploaderState;

  getFiles: QRL<() => UploadFile[]>;
  getFile: QRL<(fileId: string) => UploadFile | undefined>;
  getState: QRL<() => UploaderState>;
  getPreview: QRL<(fileId: string) => string | undefined>;
  getTotalProgress: QRL<() => { loaded: number; total: number; percentage: number }>;

  addFiles: QRL<(fileList: FileList | File[]) => Promise<void>>;
  removeFile: QRL<(fileId: string) => Promise<void>>;
  clearAll: QRL<() => Promise<void>>;

  uploadAll: QRL<() => Promise<void>>;
  uploadFile: QRL<(fileId: string) => Promise<void>>;
  pauseUpload: QRL<(fileId: string) => Promise<void>>;
  resumeUpload: QRL<(fileId: string) => Promise<void>>;
  cancelUpload: QRL<(fileId: string) => Promise<void>>;
  retryUpload: QRL<(fileId: string) => Promise<void>>;

  handleDragOver: QRL<(event: DragEvent) => void>;
  handleDrop: QRL<(event: DragEvent) => Promise<void>>;
  handleFileSelect: QRL<(event: Event) => Promise<void>>;
  updateConfig: QRL<(config: Partial<UploaderConfig>) => void>;
}

/**
 * Qwik Hook for the Headless Uploader.
 * Manages a persistent uploader instance and provides reactive state.
 */
export function useUploader(config: UploaderConfig = {}): QwikUploader {
  const store = useStore({
    state: {
      files: [],
      uploadingFiles: [],
      completedFiles: [],
      failedFiles: [],
      queuedFiles: [],
      totalProgress: { loaded: 0, total: 0, percentage: 0 },
      isUploading: false,
      isPaused: false,
    } as UploaderState,
    instance: undefined as NoSerialize<UploaderInterface> | undefined,
  });

  useVisibleTask$(({ cleanup }) => {
    const refresh = () => {
      if (!store.instance) return;
      const s = store.instance.getState();

      store.state = {
        ...s,
        files: s.files.map((f) => ({ ...f, progress: { ...f.progress } })),
        totalProgress: { ...s.totalProgress },
      };
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

    store.instance = noSerialize(uploader);

    refresh();

    cleanup(() => uploader.destroy());
  });

  return {
    get state() {
      return store.state;
    },

    getFiles: $(() => store.instance?.getFiles() || []),
    getFile: $((id: string) => store.instance?.getFile(id)),
    getState: $(() => store.instance?.getState() || store.state),
    getPreview: $((id: string) => store.instance?.getPreview(id)),
    getTotalProgress: $(() => store.instance?.getTotalProgress() || store.state.totalProgress),

    addFiles: $(async (files: FileList | File[]) => {
      await store.instance?.addFiles(files);
    }),
    removeFile: $(async (id: string) => {
      await store.instance?.removeFile(id);
      if (store.instance) {
        const s = store.instance.getState();
        store.state = { ...s, files: s.files.map((f) => ({ ...f })) };
      }
    }),
    clearAll: $(async () => {
      await store.instance?.clearAll();
      if (store.instance) {
        const s = store.instance.getState();
        store.state = { ...s, files: [] };
      }
    }),
    uploadAll: $(async () => {
      await store.instance?.uploadAll();
    }),
    uploadFile: $(async (id: string) => {
      await store.instance?.uploadFile(id);
    }),
    pauseUpload: $(async (id: string) => {
      await store.instance?.pauseUpload(id);
    }),
    resumeUpload: $(async (id: string) => {
      await store.instance?.resumeUpload(id);
    }),
    cancelUpload: $(async (id: string) => {
      await store.instance?.cancelUpload(id);
    }),
    retryUpload: $(async (id: string) => {
      await store.instance?.retryUpload(id);
    }),

    handleDragOver: $((e: DragEvent) => store.instance?.handleDragOver(e)),
    handleDrop: $(async (e: DragEvent) => {
      await store.instance?.handleDrop(e);
    }),
    handleFileSelect: $(async (e: Event) => {
      await store.instance?.handleFileSelect(e);
    }),
    updateConfig: $((c: Partial<UploaderConfig>) => {
      store.instance?.updateConfig(c);
      if (store.instance) {
        const s = store.instance.getState();
        store.state = { ...s };
      }
    }),
  } as any as QwikUploader;
}
