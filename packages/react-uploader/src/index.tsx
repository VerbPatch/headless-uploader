import { useState, useEffect, useMemo, useRef } from 'react';
export * from '@verbpatch/headless-uploader';

import { useUploader as createUploader, UploaderConfig } from '@verbpatch/headless-uploader';

export function useUploader(config: UploaderConfig = {}) {
  const configRef = useRef(config);
  configRef.current = config;

  const [, setStateChanged] = useState(0);

  const uploader = useMemo(() => {
    const updateState = () => {
      // Force a new reference for the whole state to trigger React re-render
      setStateChanged((prev) => prev + 1);
    };

    const instance = createUploader({
      ...config,
      onFilesAdded: (files) => {
        configRef.current.onFilesAdded?.(files);
        updateState();
      },
      onFilesRejected: (errors) => {
        configRef.current.onFilesRejected?.(errors);
        updateState();
      },
      onValidationStart: (files) => {
        configRef.current.onValidationStart?.(files);
        updateState();
      },
      onValidationComplete: (results) => {
        configRef.current.onValidationComplete?.(results);
        updateState();
      },
      onBeforeUpload: async (file) => {
        await configRef.current.onBeforeUpload?.(file);
        updateState();
      },
      onUploadStart: (file) => {
        configRef.current.onUploadStart?.(file);
        updateState();
      },
      onUploadProgress: (file, progress) => {
        configRef.current.onUploadProgress?.(file, progress);
        updateState();
      },
      onChunkComplete: (file, chunk) => {
        configRef.current.onChunkComplete?.(file, chunk);
        updateState();
      },
      onUploadPause: (file) => {
        configRef.current.onUploadPause?.(file);
        updateState();
      },
      onUploadResume: (file) => {
        configRef.current.onUploadResume?.(file);
        updateState();
      },
      onUploadCancel: (file) => {
        configRef.current.onUploadCancel?.(file);
        updateState();
      },
      onUploadComplete: (file) => {
        configRef.current.onUploadComplete?.(file);
        updateState();
      },
      onUploadSuccess: (file, response) => {
        configRef.current.onUploadSuccess?.(file, response);
        updateState();
      },
      onUploadError: (file, error) => {
        configRef.current.onUploadError?.(file, error);
        updateState();
      },
      onRetry: (file, attempt) => {
        configRef.current.onRetry?.(file, attempt);
        updateState();
      },
      onAllComplete: (files) => {
        configRef.current.onAllComplete?.(files);
        updateState();
      },
      onMetadataExtracted: (file, metadata) => {
        configRef.current.onMetadataExtracted?.(file, metadata);
        updateState();
      },
      onPreviewGenerated: (file, preview) => {
        configRef.current.onPreviewGenerated?.(file, preview);
        updateState();
      },
    });

    return {
      ...instance,
      removeFile: async (fileId: string) => {
        await instance.removeFile(fileId);
        updateState();
      },
      clearAll: async () => {
        await instance.clearAll();
        updateState();
      },
    };
  }, []);

  useEffect(() => {
    return () => {
      uploader.destroy();
    };
  }, [uploader]);

  return {
    ...uploader,
    state: uploader.getState(),
  };
}
