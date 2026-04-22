import type {
  UploaderConfig,
  UploaderState,
  UploadFile,
  UploadStatus,
  UploaderInstance,
  UploaderInterface,
} from '../types';
import { pauseUpload, cancelUpload } from './processor';
import { uploadAll, uploadSingleFile } from './scheduler';
import { generateId, extractMetadata, generatePreview, validateFiles } from '../utils';
import { DEFAULT_CONFIG } from '../constants/defaults';

/**
 * Create upload file object
 */
async function createUploadFile(file: File, config: UploaderConfig): Promise<UploadFile> {
  const id = generateId();

  const uploadFile: UploadFile = {
    id,
    file,
    metadata: {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    },
    status: 'pending',
    progress: {
      loaded: 0,
      total: file.size,
      percentage: 0,
      speed: 0,
      timeRemaining: 0,
      startTime: 0,
      elapsedTime: 0,
    },
    retries: 0,
  };

  if (config.extractMetadata) {
    try {
      uploadFile.metadata = await extractMetadata(file);
      config.onMetadataExtracted?.(uploadFile, uploadFile.metadata);
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error while extracting metadata', error);
    }
  }

  if (config.enablePreviews) {
    try {
      const preview = await generatePreview(file, config.previewMaxWidth, config.previewMaxHeight);
      uploadFile.preview = preview;
      config.onPreviewGenerated?.(uploadFile, preview);
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error while generating preview', error);
    }
  }

  return uploadFile;
}

/**
 * Trigger onQueueChange event
 */
function triggerQueueChange(instance: UploaderInstance) {
  instance.config.onQueueChange?.(Array.from(instance.files.values()));
}

/**
 * Update file status and trigger onStateChange
 */
function updateFileStatus(
  instance: UploaderInstance,
  file: UploadFile,
  status: UploadFile['status'],
) {
  if (file.status !== status) {
    file.status = status;
    instance.config.onStateChange?.(file);
  }
}

/**
 * Add files to upload queue
 * @param instance - The uploader instance
 * @param fileList - List of files to add
 * @group core
 * @title addFiles
 * @description Adds files to the upload queue after validation.
 */
export async function addFiles(
  instance: UploaderInstance,
  fileList: FileList | File[],
): Promise<void> {
  const files = Array.from(fileList);

  instance.config.onValidationStart?.(files);

  const existingFiles = Array.from(instance.files.values()).map((f) => f.file);

  const { validFiles, errors } = await validateFiles(files, instance.config, existingFiles);

  if (errors.length > 0 && instance.config.onFilesRejected) {
    instance.config.onFilesRejected(errors);
  }

  if (instance.config.onValidationComplete) {
    instance.config.onValidationComplete(
      files.map((file) => ({
        valid: validFiles.includes(file),
        errors: errors.filter((e) => e.file === file),
      })),
    );
  }

  const uploadFiles: UploadFile[] = [];

  for (const file of validFiles) {
    const uploadFile = await createUploadFile(file, instance.config);
    instance.files.set(uploadFile.id, uploadFile);
    uploadFiles.push(uploadFile);
  }

  if (uploadFiles.length > 0) {
    instance.config.onFilesAdded?.(uploadFiles);
    triggerQueueChange(instance);
  }

  if (instance.config.autoUpload && uploadFiles.length > 0) {
    await uploadAll(instance);
  }
}

/**
 * Pause upload for a specific file
 * @param instance - The uploader instance
 * @param fileId - The unique identifier of the file
 * @group core
 * @title pauseUploadFile
 * @description Pauses the upload process for the specified file.
 */
export async function pauseUploadFile(instance: UploaderInstance, fileId: string): Promise<void> {
  const uploadFileObj = instance.files.get(fileId);
  if (!uploadFileObj) return;

  if (uploadFileObj.chunks && uploadFileObj.chunks.length > 0) {
    const remainingChunks = uploadFileObj.chunks.filter((c) => c.status !== 'completed');
    const uploadingChunks = uploadFileObj.chunks.filter((c) => c.status === 'uploading');

    if (remainingChunks.length > 0 && remainingChunks.length === uploadingChunks.length) {
      // eslint-disable-next-line
      console.warn(
        `[Core] pauseUploadFile: Pause disabled for ${fileId} - last set of chunks in flight.`,
      );
      return;
    }
  } else {
    const percentage = uploadFileObj.progress.percentage;
    if (percentage > 95) {
      // eslint-disable-next-line
      console.warn(
        `[Core] pauseUploadFile: Pause disabled for ${fileId} - upload nearly complete (${percentage.toFixed(1)}%).`,
      );
      return;
    }
  }

  updateFileStatus(instance, uploadFileObj, 'paused');
  await pauseUpload(instance, fileId);
  instance.config.onUploadPause?.(uploadFileObj);
}

/**
 * Resume upload for a specific file
 * @param instance - The uploader instance
 * @param fileId - The unique identifier of the file
 * @group core
 * @title resumeUploadFile
 * @description Resumes the upload process for a previously paused file.
 */
export async function resumeUploadFile(instance: UploaderInstance, fileId: string): Promise<void> {
  const uploadFileObj = instance.files.get(fileId);
  if (!uploadFileObj) return;

  updateFileStatus(instance, uploadFileObj, 'queued');
  instance.config.onUploadResume?.(uploadFileObj);

  await uploadSingleFile(instance, fileId);
}

/**
 * Cancel upload for a specific file
 * @param instance - The uploader instance
 * @param fileId - The unique identifier of the file
 * @group core
 * @title cancelUploadFile
 * @description Cancels the upload process for the specified file and removes it from active uploads.
 */
export async function cancelUploadFile(instance: UploaderInstance, fileId: string): Promise<void> {
  const uploadFileObj = instance.files.get(fileId);
  if (!uploadFileObj) return;

  updateFileStatus(instance, uploadFileObj, 'cancelled');
  await cancelUpload(instance, fileId);
  instance.config.onUploadCancel?.(uploadFileObj);
}

/**
 * Retry failed upload for a specific file
 * @param instance - The uploader instance
 * @param fileId - The unique identifier of the file
 * @group core
 * @title retryUploadFile
 * @description Retries the upload process for a file that previously failed.
 */
export async function retryUploadFile(instance: UploaderInstance, fileId: string): Promise<void> {
  const uploadFileObj = instance.files.get(fileId);
  if (!uploadFileObj || uploadFileObj.status !== 'failed') return;

  uploadFileObj.retries = 0;
  uploadFileObj.error = undefined;
  updateFileStatus(instance, uploadFileObj, 'queued');

  await uploadSingleFile(instance, fileId);
}

/**
 * Remove file from the uploader
 * @param instance - The uploader instance
 * @param fileId - The unique identifier of the file
 * @group core
 * @title removeFile
 * @description Cancels any active upload and removes the file from the uploader state.
 */
export async function removeFile(instance: UploaderInstance, fileId: string): Promise<void> {
  const uploadFileObj = instance.files.get(fileId);
  if (!uploadFileObj) return;

  if (uploadFileObj.status === 'uploading') {
    await cancelUploadFile(instance, fileId);
  }

  instance.files.delete(fileId);
  triggerQueueChange(instance);
}

/**
 * Clear all files from the uploader
 * @param instance - The uploader instance
 * @group core
 * @title clearAll
 * @description Cancels all active uploads and removes all files from the uploader state.
 */
export async function clearAll(instance: UploaderInstance): Promise<void> {
  const promises: Promise<void>[] = [];

  instance.files.forEach((file) => {
    if (file.status === 'uploading' || file.status === 'paused') {
      promises.push(cancelUploadFile(instance, file.id));
    }
  });

  await Promise.all(promises);
  instance.files.clear();
  triggerQueueChange(instance);
}

/**
 * Get a file by its ID
 * @param instance - The uploader instance
 * @param fileId - The unique identifier of the file
 * @returns The UploadFile object if found, otherwise undefined
 * @group core
 * @title getFile
 * @description Retrieves the state of a specific file by its identifier.
 */
export function getFile(instance: UploaderInstance, fileId: string): UploadFile | undefined {
  return instance.files.get(fileId);
}

/**
 * Get all files in the uploader
 * @param instance - The uploader instance
 * @returns An array of all UploadFile objects
 * @group core
 * @title getFiles
 * @description Retrieves an array of all files currently managed by the uploader.
 */
export function getFiles(instance: UploaderInstance): UploadFile[] {
  return Array.from(instance.files.values());
}

/**
 * Get files filtered by their status
 * @param instance - The uploader instance
 * @param status - The status to filter by
 * @returns An array of UploadFile objects with the specified status
 * @group core
 * @title getFilesByStatus
 * @description Retrieves a list of files that match the given upload status.
 */
export function getFilesByStatus(instance: UploaderInstance, status: UploadStatus): UploadFile[] {
  return getFiles(instance).filter((file) => file.status === status);
}

/**
 * Get the preview URL for a file
 * @param instance - The uploader instance
 * @param fileId - The unique identifier of the file
 * @returns The preview URL string if available, otherwise undefined
 * @group core
 * @title getPreview
 * @description Retrieves the data URL or blob URL for a file's preview.
 */
export function getPreview(instance: UploaderInstance, fileId: string): string | undefined {
  return instance.files.get(fileId)?.preview;
}

/**
 * Get the total upload progress
 * @param instance - The uploader instance
 * @returns An object containing loaded bytes, total bytes, and overall percentage
 * @group core
 * @title getTotalProgress
 * @description Calculates the aggregate progress for all files in the uploader.
 */
export function getTotalProgress(instance: UploaderInstance): {
  loaded: number;
  total: number;
  percentage: number;
} {
  const files = getFiles(instance);

  const total = files.reduce((sum, file) => sum + file.file.size, 0);
  const loaded = files.reduce((sum, file) => {
    if (file.status === 'completed') {
      return sum + file.file.size;
    }
    return sum + file.progress.loaded;
  }, 0);

  const percentage = total > 0 ? (loaded / total) * 100 : 0;

  return { loaded, total, percentage };
}

/**
 * Get the complete state of the uploader
 * @param instance - The uploader instance
 * @returns The current uploader state
 * @group core
 * @title getState
 * @description Retrieves a summary of the current uploader state, including file lists and progress.
 */
export function getState(instance: UploaderInstance): UploaderState {
  return {
    files: getFiles(instance),
    uploadingFiles: getFilesByStatus(instance, 'uploading'),
    completedFiles: getFilesByStatus(instance, 'completed'),
    failedFiles: getFilesByStatus(instance, 'failed'),
    queuedFiles: getFilesByStatus(instance, 'queued'),
    totalProgress: getTotalProgress(instance),
    isUploading: getFilesByStatus(instance, 'uploading').length > 0,
    isPaused: getFilesByStatus(instance, 'paused').length > 0,
  };
}

/**
 * Update the uploader configuration
 * @param instance - The uploader instance
 * @param newConfig - Partial configuration to merge
 * @group core
 * @title updateConfig
 * @description Updates the uploader configuration and resets the adapter if relevant settings changed.
 */
export function updateConfig(instance: UploaderInstance, newConfig: Partial<UploaderConfig>): void {
  instance.config = { ...instance.config, ...newConfig };

  if (
    newConfig.protocol ||
    newConfig.http ||
    newConfig.tus ||
    newConfig.websocket ||
    newConfig.webtransport
  ) {
    instance.adapter = undefined;
  }
}

/**
 * Destroy the uploader instance
 * @param instance - The uploader instance
 * @group core
 * @title disposeUploader
 * @description Cleans up the uploader instance, cancelling uploads and clearing files.
 */
export async function disposeUploader(instance: UploaderInstance): Promise<void> {
  await clearAll(instance);
  if (instance.adapter?.cleanup) {
    await instance.adapter.cleanup();
  }

  instance.files.clear();
  instance.activeUploads.clear();
}

/**
 * Handle the dragover event for drop zones
 * @param event - The DragEvent
 * @group core
 * @title handleDragOver
 * @description Prevents default browser behavior and sets dropEffect to 'copy'.
 */
export function handleDragOver(event: DragEvent): void {
  event.preventDefault();
  event.stopPropagation();

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy';
  }
}

/**
 * Handle the drop event for drop zones
 * @param instance - The uploader instance
 * @param event - The DragEvent
 * @group core
 * @title handleDrop
 * @description Extracts files from the drop event and adds them to the uploader.
 */
export async function handleDrop(instance: UploaderInstance, event: DragEvent): Promise<void> {
  event.preventDefault();
  event.stopPropagation();

  if (!event.dataTransfer) return;

  const files = Array.from(event.dataTransfer.files);
  await addFiles(instance, files);
}

/**
 * Handle the change event for file inputs
 * @param instance - The uploader instance
 * @param event - The change Event
 * @group core
 * @title handleFileSelect
 * @description Extracts files from a file input element and adds them to the uploader.
 */
export async function handleFileSelect(instance: UploaderInstance, event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  await addFiles(instance, input.files);

  input.value = '';
}

/**
 * Internal function to create a new uploader instance
 * @param config - Optional configuration for the uploader
 * @returns The UploaderInterface to interact with the uploader
 * @group hooks
 * @title createUploader
 * @internal
 */
export function createUploader(config: UploaderConfig = {}): UploaderInterface {
  const instance: UploaderInstance = {
    files: new Map(),
    activeUploads: new Map(),
    config: { ...DEFAULT_CONFIG, ...config },
  };

  return {
    getFiles: () => getFiles(instance),
    getFile: (fileId) => getFile(instance, fileId),
    getState: () => getState(instance),
    getPreview: (fileId) => getPreview(instance, fileId),
    getTotalProgress: () => getTotalProgress(instance),

    addFiles: (fileList) => addFiles(instance, fileList),
    removeFile: (fileId) => removeFile(instance, fileId),
    clearAll: () => clearAll(instance),

    uploadAll: () => uploadAll(instance),
    uploadFile: (fileId) => uploadSingleFile(instance, fileId),
    pauseUpload: (fileId) => pauseUploadFile(instance, fileId),
    resumeUpload: (fileId) => resumeUploadFile(instance, fileId),
    cancelUpload: (fileId) => cancelUploadFile(instance, fileId),
    retryUpload: (fileId) => retryUploadFile(instance, fileId),

    handleDragOver,
    handleDrop: (event) => handleDrop(instance, event),
    handleFileSelect: (event) => handleFileSelect(instance, event),

    updateConfig: (newConfig) => updateConfig(instance, newConfig),
    destroy: () => disposeUploader(instance),
  };
}

/**
 * Initializes a new headless uploader instance with the provided configuration.
 * @param config - Optional configuration for the uploader
 * @returns The UploaderInterface to interact with the uploader
 * @group hooks
 * @title useUploader
 * @description Initializes a new headless uploader instance with the provided configuration.
 * @example
 * ```typescript
 * function MyComponent() {
 *   const uploader = useUploader({
 *     maxFiles: 5,
 *     onUploadSuccess: (file, response) => {
 *       console.log('Upload finished!', response);
 *     }
 *   });
 *
 *   return (
 *     <div onDrop={uploader.handleDrop} onDragOver={uploader.handleDragOver}>
 *       Drop files here
 *     </div>
 *   );
 * }
 * ```
 */
export function useUploader(config?: UploaderConfig): UploaderInterface {
  return createUploader(config);
}
