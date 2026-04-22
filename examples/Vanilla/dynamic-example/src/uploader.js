import { useUploader } from '@verbpatch/headless-uploader';

let uploader = null;

/**
 * Fetch WebTransport Fingerprint for local dev
 */
async function fetchWTFingerprint(onEvent) {
  try {
    const response = await fetch('http://127.0.0.1:3000/webtransport-config');
    if (response.ok) {
      const data = await response.json();
      if (data.certHash) {
        onEvent('success', '[WT] Successfully fetched server fingerprint.');
        return [
          {
            algorithm: 'sha-256',
            value: new Uint8Array(data.certHash),
          },
        ];
      }
    }
  } catch (err) {
    onEvent('warn', `[WT] Fingerprint fetch failed (Normal if server not HTTPS): ${err.message}`);
  }
  return undefined;
}

/**
 * Initialize or Re-initialize the uploader
 */
export async function initUploader(config, onEvent) {
  if (uploader) {
    onEvent('info', '[System] Destroying existing uploader instance...');
    await uploader.destroy();
  }

  if (config.protocol === 'webtransport' && config.webtransport) {
    const fingerprint = await fetchWTFingerprint(onEvent);
    if (fingerprint) {
      config.webtransport.serverCertificateHashes = fingerprint;
    }
  }

  onEvent('info', `[System] Initializing ${config.protocol.toUpperCase()} engine...`);

  const { onStateChange, ...restConfig } = config;

  const enhancedConfig = {
    ...restConfig,

    customValidator: config.customValidator
      ? async (file) => {
          onEvent('info', `[Hook] customValidator: Scanning ${file.name}...`);
          return { valid: true };
        }
      : undefined,

    onFilesAdded: (files) => {
      if (config.onFilesAdded)
        onEvent('success', `[Event] onFilesAdded: ${files.length} file(s) accepted.`);
      if (onStateChange) onStateChange();
    },

    onFilesRejected: (errors) => {
      if (config.onFilesRejected) {
        onEvent('error', `[Event] onFilesRejected: ${errors.length} file(s) failed.`);
        errors.forEach((err) => onEvent('error', `  -> ${err.file.name}: ${err.message}`));
      }
      if (onStateChange) onStateChange();
    },

    onValidationStart: (files) => {
      if (config.onValidationStart)
        onEvent('info', `[Event] onValidationStart: Validating ${files.length} files...`);
    },

    onValidationComplete: (results) => {
      if (config.onValidationComplete) {
        const valid = results.filter((r) => r.valid).length;
        onEvent('info', `[Event] onValidationComplete: ${valid} passed.`);
      }
    },

    onBeforeUpload: async (file) => {
      if (config.onBeforeUpload)
        onEvent('info', `[Hook] onBeforeUpload: Final check for ${file.metadata.name}`);
    },

    onUploadStart: (file) => {
      if (config.onUploadStart) onEvent('info', `[Event] onUploadStart: ${file.metadata.name}`);
      if (onStateChange) onStateChange();
    },

    onUploadProgress: (file, progress) => {
      if (
        config.onUploadProgress &&
        Math.floor(progress.percentage) % 25 === 0 &&
        progress.percentage > 0
      ) {
        onEvent(
          'info',
          `[Event] onUploadProgress: ${file.metadata.name} (${progress.percentage.toFixed(0)}%)`,
        );
      }
      if (onStateChange) onStateChange();
    },

    onChunkComplete: (file, chunk) => {
      if (config.onChunkComplete)
        onEvent(
          'info',
          `[Event] onChunkComplete: ${file.metadata.name} - Chunk ${chunk.index + 1} done.`,
        );
    },

    onUploadComplete: (file) => {
      if (config.onUploadComplete)
        onEvent('success', `[Event] onUploadComplete: ${file.metadata.name} finished.`);
      if (onStateChange) onStateChange();
    },

    onUploadSuccess: (file) => {
      if (config.onUploadSuccess)
        onEvent('success', `[Event] onUploadSuccess: ${file.metadata.name} processed by server.`);
      if (onStateChange) onStateChange();
    },

    onUploadError: (file, error) => {
      if (config.onUploadError) {
        onEvent('error', `[Event] onUploadError: ${file.metadata.name} failed!`);
        onEvent('error', `  -> Reason: ${error.message}`);
        // eslint-disable-next-line
        console.error(`Upload error for ${file.metadata.name}:`, error);
      }
      if (onStateChange) onStateChange();
    },

    onUploadPause: (file) => {
      if (config.onUploadPause)
        onEvent('warn', `[Event] onUploadPause: Halted ${file.metadata.name}`);
      if (onStateChange) onStateChange();
    },

    onUploadResume: (file) => {
      if (config.onUploadResume)
        onEvent('info', `[Event] onUploadResume: Resuming ${file.metadata.name}`);
      if (onStateChange) onStateChange();
    },

    onUploadCancel: (file) => {
      if (config.onUploadCancel)
        onEvent('warn', `[Event] onUploadCancel: Cancelled ${file.metadata.name}`);
      if (onStateChange) onStateChange();
    },

    onRetry: (file, attempt) => {
      if (config.onRetry)
        onEvent('warn', `[Event] onRetry: ${file.metadata.name} (Attempt ${attempt})...`);
      if (onStateChange) onStateChange();
    },

    onAllComplete: (files) => {
      if (config.onAllComplete)
        onEvent('success', `[Event] onAllComplete: Batch finished. Total files: ${files.length}`);
      if (onStateChange) onStateChange();
    },

    onMetadataExtracted: (file) => {
      if (config.onMetadataExtracted)
        onEvent('info', `[Event] onMetadataExtracted: ${file.metadata.name}`);
      if (onStateChange) onStateChange();
    },

    onPreviewGenerated: (file) => {
      if (config.onPreviewGenerated)
        onEvent('info', `[Event] onPreviewGenerated: Preview ready for ${file.metadata.name}`);
      if (onStateChange) onStateChange();
    },

    onBeforeRequest: async (file) => {
      if (config.onBeforeRequest) {
        onEvent(
          'info',
          `[Hook] onBeforeRequest: Preparing handshake/auth for ${file.metadata.name}`,
        );
        return {
          headers: { Authorization: 'Bearer verbpatch-secret-token' },
          params: { token: 'verbpatch-secret-token' },
        };
      }
    },
  };

  if (config.protocol === 'tus' && config.tus) {
    enhancedConfig.tus = {
      ...config.tus,
      onUploadUrlAvailable: () => onEvent('info', '[TUS] Session URL created.'),
      onShouldRetry: (err, retryAttempt) => {
        onEvent('warn', `[TUS] Should Retry? Attempt ${retryAttempt}`);
        return true;
      },
    };
  } else if (config.protocol === 'websocket' && config.websocket) {
    enhancedConfig.websocket = {
      ...config.websocket,
      onOpen: () => onEvent('success', '[WS] Connection established.'),
      onClose: () => onEvent('warn', '[WS] Connection closed.'),
      onError: (err) => onEvent('error', `[WS] Error: ${err.message || 'Unknown'}`),
    };
  } else if (config.protocol === 'webtransport' && config.webtransport) {
    enhancedConfig.webtransport = {
      ...config.webtransport,
      onReady: () => onEvent('success', '[WT] Transport ready.'),
      onClosed: () => onEvent('warn', '[WT] Transport closed.'),
    };
  }

  uploader = useUploader(enhancedConfig);
  return uploader;
}

export const getUploader = () => uploader;
