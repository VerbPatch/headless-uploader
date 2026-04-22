import {
  useUploader,
  UploaderConfig,
  UploadFile,
  ValidationError,
  ValidationResult,
  ChunkInfo,
  UploadProgress,
  FileMetadata,
  UploaderError,
  UploaderErrorCodes,
} from '@verbpatch/headless-uploader';
import jqModule from 'jquery';

const $: JQueryStatic =
  typeof jqModule === 'function' ? jqModule : (jqModule as any).default || (window as any).jQuery;

export * from '@verbpatch/headless-uploader';

export interface JQueryUploaderOptions extends UploaderConfig {
  onRender?: (uploader: ReturnType<typeof useUploader>) => void;
}

/**
 * jQuery uploader state
 */
interface JQueryUploaderState {
  $el: JQuery<HTMLElement>;
  options: JQueryUploaderOptions;
  uploader: ReturnType<typeof useUploader>;
}

declare global {
  interface JQuery {
    headlessUploader(options?: JQueryUploaderOptions | string, ...args: any[]): JQuery | any;
  }
}

(function ($) {
  'use strict';

  const PLUGIN_NAME = 'headlessUploader';
  const DATA_KEY = 'jq.headlessUploader';

  /**
   * Initialize the uploader instance
   */
  function initInstance(element: HTMLElement, options: JQueryUploaderOptions) {
    const $el = $(element);

    const refresh = () => {
      if (options.onRender) options.onRender(uploader);
      $el.trigger('uploader:updated', [uploader.getState()]);
    };

    const mergedOptions: JQueryUploaderOptions = $.extend({}, options, {
      onFilesAdded: (files: UploadFile[]) => {
        refresh();
        options.onFilesAdded?.(files);
        $el.trigger('uploader:filesAdded', [files]);
      },
      onQueueChange: (files: UploadFile[]) => {
        refresh();
        options.onQueueChange?.(files);
        $el.trigger('uploader:queueChange', [files]);
      },
      onStateChange: (file: UploadFile) => {
        refresh();
        options.onStateChange?.(file);
        $el.trigger('uploader:stateChange', [file]);
      },
      onFilesRejected: (errors: ValidationError[]) => {
        refresh();
        options.onFilesRejected?.(errors);
        $el.trigger('uploader:filesRejected', [errors]);
      },
      onValidationStart: (files: File[]) => {
        refresh();
        options.onValidationStart?.(files);
        $el.trigger('uploader:validationStart', [files]);
      },
      onValidationComplete: (results: ValidationResult[]) => {
        refresh();
        options.onValidationComplete?.(results);
        $el.trigger('uploader:validationComplete', [results]);
      },
      onBeforeUpload: async (file: UploadFile) => {
        const result = await options.onBeforeUpload?.(file);
        refresh();
        $el.trigger('uploader:beforeUpload', [file]);
        return result;
      },
      onUploadStart: (file: UploadFile) => {
        refresh();
        options.onUploadStart?.(file);
        $el.trigger('uploader:uploadStart', [file]);
      },
      onUploadProgress: (file: UploadFile, progress: UploadProgress) => {
        refresh();
        options.onUploadProgress?.(file, progress);
        $el.trigger('uploader:uploadProgress', [file, progress]);
      },
      onChunkStart: (file: UploadFile, chunk: ChunkInfo) => {
        refresh();
        options.onChunkStart?.(file, chunk);
        $el.trigger('uploader:chunkStart', [file, chunk]);
      },
      onChunkComplete: (file: UploadFile, chunk: ChunkInfo) => {
        refresh();
        options.onChunkComplete?.(file, chunk);
        $el.trigger('uploader:chunkComplete', [file, chunk]);
      },
      onUploadPause: (file: UploadFile) => {
        refresh();
        options.onUploadPause?.(file);
        $el.trigger('uploader:uploadPause', [file]);
      },
      onUploadResume: (file: UploadFile) => {
        refresh();
        options.onUploadResume?.(file);
        $el.trigger('uploader:uploadResume', [file]);
      },
      onUploadCancel: (file: UploadFile) => {
        refresh();
        options.onUploadCancel?.(file);
        $el.trigger('uploader:uploadCancel', [file]);
      },
      onUploadSuccess: (file: UploadFile, response: any) => {
        refresh();
        options.onUploadSuccess?.(file, response);
        $el.trigger('uploader:uploadSuccess', [file, response]);
      },
      onUploadError: (file: UploadFile, error: UploaderError) => {
        refresh();
        options.onUploadError?.(file, error);
        $el.trigger('uploader:uploadError', [file, error]);
      },
      onRetry: (file: UploadFile, attempt: number) => {
        refresh();
        options.onRetry?.(file, attempt);
        $el.trigger('uploader:retry', [file, attempt]);
      },
      onAllComplete: (files: UploadFile[]) => {
        refresh();
        options.onAllComplete?.(files);
        $el.trigger('uploader:allComplete', [files]);
      },
      onMetadataExtracted: (file: UploadFile, metadata: FileMetadata) => {
        refresh();
        options.onMetadataExtracted?.(file, metadata);
        $el.trigger('uploader:metadataExtracted', [file, metadata]);
      },
      onPreviewGenerated: (file: UploadFile, preview: string) => {
        refresh();
        options.onPreviewGenerated?.(file, preview);
        $el.trigger('uploader:previewGenerated', [file, preview]);
      },
    });

    const uploader = useUploader(mergedOptions);
    const state: JQueryUploaderState = {
      $el,
      options: mergedOptions,
      uploader,
    };
    $el.data(DATA_KEY, state);

    if (mergedOptions.onRender) mergedOptions.onRender(uploader);
    $el.trigger('uploader:initialized', [uploader]);
  }

  /**
   * Method definitions for the jQuery plugin
   */
  const methods = {
    addFiles(state: JQueryUploaderState, fileList: FileList | File[]) {
      return state.uploader.addFiles(fileList);
    },
    removeFile(state: JQueryUploaderState, fileId: string) {
      return state.uploader.removeFile(fileId);
    },
    clearAll(state: JQueryUploaderState) {
      return state.uploader.clearAll();
    },
    uploadAll(state: JQueryUploaderState) {
      return state.uploader.uploadAll();
    },
    uploadFile(state: JQueryUploaderState, fileId: string) {
      return state.uploader.uploadFile(fileId);
    },
    pauseUpload(state: JQueryUploaderState, fileId: string) {
      return state.uploader.pauseUpload(fileId);
    },
    resumeUpload(state: JQueryUploaderState, fileId: string) {
      return state.uploader.resumeUpload(fileId);
    },
    cancelUpload(state: JQueryUploaderState, fileId: string) {
      return state.uploader.cancelUpload(fileId);
    },
    retryUpload(state: JQueryUploaderState, fileId: string) {
      return state.uploader.retryUpload(fileId);
    },
    handleDragOver(state: JQueryUploaderState, event: DragEvent) {
      return state.uploader.handleDragOver(event);
    },
    handleDrop(state: JQueryUploaderState, event: DragEvent) {
      return state.uploader.handleDrop(event);
    },
    handleFileSelect(state: JQueryUploaderState, event: Event) {
      return state.uploader.handleFileSelect(event);
    },
    getState(state: JQueryUploaderState) {
      return state.uploader.getState();
    },
    getFiles(state: JQueryUploaderState) {
      return state.uploader.getFiles();
    },
    getFile(state: JQueryUploaderState, fileId: string) {
      return state.uploader.getFile(fileId);
    },
    getPreview(state: JQueryUploaderState, fileId: string) {
      return state.uploader.getPreview(fileId);
    },
    getTotalProgress(state: JQueryUploaderState) {
      return state.uploader.getTotalProgress();
    },
    destroy(state: JQueryUploaderState) {
      state.uploader.destroy();
      state.$el.removeData(DATA_KEY);
      state.$el.trigger('uploader:destroyed');
    },
  };

  /**
   * jQuery plugin entry point
   */
  $.fn.headlessUploader = function (
    this: JQuery,
    optionsOrMethod?: JQueryUploaderOptions | string,
    ...args: any[]
  ): any {
    let returnValue: any = this;

    this.each(function () {
      const $el = $(this);
      const state = $el.data(DATA_KEY);

      if (!state) {
        if (typeof optionsOrMethod === 'string') {
          throw new UploaderError(
            `Cannot call method '${optionsOrMethod}' before initialization.`,
            { code: UploaderErrorCodes.CONFIG_ERROR },
          );
        }
        initInstance(this, optionsOrMethod || {});
        return;
      }

      if (typeof optionsOrMethod === 'string') {
        const method = optionsOrMethod as keyof typeof methods;
        const fn = methods[method];
        if (!fn)
          throw new UploaderError(`Method '${method}' does not exist on ${PLUGIN_NAME}`, {
            code: UploaderErrorCodes.CONFIG_ERROR,
          });

        const result = (fn as any)(state, ...(args as any[]));
        if (result !== undefined) {
          returnValue = result;
          return false;
        }
      }
    });

    return returnValue;
  };
})($);
