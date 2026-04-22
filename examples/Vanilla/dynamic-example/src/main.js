import { initUploader, getUploader } from './uploader.js';
import { formatBytes, formatTime } from '@verbpatch/headless-uploader';

const configEditor = document.getElementById('config-editor');
const logContainer = document.getElementById('log-container');
const clearLogsBtn = document.getElementById('clear-logs');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
const uploadAllBtn = document.getElementById('upload-all');
const clearAllBtn = document.getElementById('clear-all');
const stateView = document.getElementById('state-view');
const totalProgressBar = document.querySelector('#total-progress-bar .fill');

const STORAGE_KEY = 'headless_uploader_config';

const PRESETS = {
  http: {
    protocol: 'http',
    http: {
      endpoint: 'http://localhost:3000/upload',
      method: 'POST',
      enableChunking: true,
      maxConcurrentChunks: 3,
      withCredentials: false,
      headers: { 'X-Custom-Header': 'value' },
    },
    maxFiles: 20,
    maxFileSize: 50 * 1024 * 1024,
    minFileSize: 0,
    acceptedTypes: ['application/pdf'],
    allowDuplicates: false,
    chunkSize: 1024 * 1024,
    autoUpload: false,
    maxConcurrent: 2,
    autoRetry: true,
    retryConfig: {
      maxRetries: 5,
      retryDelay: 2000,
      retryDelayMultiplier: 2,
      retryableStatuses: [408, 429, 500, 502, 503, 504],
    },
    compression: {
      enabled: true,
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080,
    },
    enablePreviews: true,
    previewMaxWidth: 200,
    previewMaxHeight: 200,
    extractMetadata: true,
    timeout: 30000,
    customValidator: true,
    onBeforeRequest: true,
    onFilesAdded: true,
    onFilesRejected: true,
    onValidationStart: true,
    onValidationComplete: true,
    onBeforeUpload: true,
    onUploadStart: true,
    onUploadProgress: true,
    onChunkComplete: true,
    onUploadPause: true,
    onUploadResume: true,
    onUploadCancel: true,
    onUploadComplete: true,
    onUploadSuccess: true,
    onUploadError: true,
    onRetry: true,
    onAllComplete: true,
    onMetadataExtracted: true,
    onPreviewGenerated: true,
  },
  tus: {
    protocol: 'tus',
    tus: {
      endpoint: 'http://localhost:3000/tus',
      retryDelays: [0, 1000, 3000, 5000],
      metadata: { appName: 'HeadlessDemo' },
      addChunkSizeHeader: true,
      parallelUploads: 1,
      storeFingerprintForResuming: true,
      removeFingerprintOnSuccess: true,
      overridePatchMethod: false,
      headers: { 'X-Tus-Header': 'demo' },
      chunkSize: 1024 * 1024,
      onUploadUrlAvailable: true,
      onShouldRetry: true,
    },
    maxFiles: 5,
    maxFileSize: 50 * 1024 * 1024,
    minFileSize: 0,
    acceptedTypes: ['application/pdf'],
    allowDuplicates: true,
    chunkSize: 1024 * 1024,
    autoUpload: false,
    maxConcurrent: 1,
    autoRetry: true,
    enablePreviews: true,
    extractMetadata: true,
    customValidator: true,
    onBeforeRequest: true,
    onFilesAdded: true,
    onFilesRejected: true,
    onValidationStart: true,
    onValidationComplete: true,
    onBeforeUpload: true,
    onUploadStart: true,
    onUploadProgress: true,
    onChunkComplete: true,
    onUploadPause: true,
    onUploadResume: true,
    onUploadCancel: true,
    onUploadComplete: true,
    onUploadSuccess: true,
    onUploadError: true,
    onRetry: true,
    onAllComplete: true,
    onMetadataExtracted: true,
    onPreviewGenerated: true,
  },
  websocket: {
    protocol: 'websocket',
    websocket: {
      url: 'ws://localhost:3000/ws-upload',
      protocols: [],
      reconnect: true,
      reconnectDelay: 3000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      binaryType: 'arraybuffer',
      metadata: { connectionType: 'persistent' },
    },
    maxFiles: 10,
    maxFileSize: 50 * 1024 * 1024,
    minFileSize: 0,
    acceptedTypes: ['application/pdf'],
    allowDuplicates: false,
    chunkSize: 1024 * 1024,
    autoUpload: false,
    maxConcurrent: 2,
    autoRetry: false,
    enablePreviews: true,
    extractMetadata: true,
    customValidator: true,
    onBeforeRequest: true,
    onFilesAdded: true,
    onFilesRejected: true,
    onValidationStart: true,
    onValidationComplete: true,
    onBeforeUpload: true,
    onUploadStart: true,
    onUploadProgress: true,
    onChunkComplete: true,
    onUploadPause: true,
    onUploadResume: true,
    onUploadCancel: true,
    onUploadComplete: true,
    onUploadSuccess: true,
    onUploadError: true,
    onRetry: true,
    onAllComplete: true,
    onMetadataExtracted: true,
    onPreviewGenerated: true,
  },
  webtransport: {
    protocol: 'webtransport',
    webtransport: {
      url: 'https://127.0.0.1:4443/wt-upload',
      allowPooling: true,
      congestionControl: 'throughput',
      bidirectionalStreams: true,
      metadata: { transport: 'quic' },
      serverCertificateHashes: [],
    },
    maxFiles: 10,
    maxFileSize: 50 * 1024 * 1024,
    minFileSize: 0,
    acceptedTypes: ['application/pdf'],
    allowDuplicates: false,
    chunkSize: 500 * 1024,
    autoUpload: false,
    maxConcurrent: 4,
    autoRetry: true,
    enablePreviews: true,
    extractMetadata: true,
    customValidator: true,
    onBeforeRequest: true,
    onFilesAdded: true,
    onFilesRejected: true,
    onValidationStart: true,
    onValidationComplete: true,
    onBeforeUpload: true,
    onUploadStart: true,
    onUploadProgress: true,
    onChunkComplete: true,
    onUploadPause: true,
    onUploadResume: true,
    onUploadCancel: true,
    onUploadComplete: true,
    onUploadSuccess: true,
    onUploadError: true,
    onRetry: true,
    onAllComplete: true,
    onMetadataExtracted: true,
    onPreviewGenerated: true,
  },
};

/**
 * Log to UI
 */
function log(type, message) {
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  const time = new Date().toLocaleTimeString();
  entry.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-msg">${message}</span>`;
  logContainer.prepend(entry);
}

/**
 * UI Syncing
 */
function syncUI() {
  const uploader = getUploader();
  if (!uploader) return;

  const files = uploader.getFiles();
  const state = uploader.getState();

  document.querySelectorAll('.preset-btn').forEach((btn) => {
    btn.classList.toggle(
      'active',
      btn.dataset.protocol === state.files[0]?.protocol ||
        configEditor.value.includes(`"protocol": "${btn.dataset.protocol}"`),
    );
  });

  stateView.textContent = JSON.stringify(
    state,
    (key, value) => {
      if (
        key === 'file' ||
        key === 'preview' ||
        key === 'abortController' ||
        key === 'processedFile'
      )
        return undefined;
      return value;
    },
    2,
  );

  totalProgressBar.style.width = `${state.totalProgress.percentage}%`;

  if (files.length === 0) {
    fileList.innerHTML = '<div class="empty">Queue is empty.</div>';
    return;
  }

  const currentIds = new Set(files.map((f) => f.id));
  Array.from(fileList.children).forEach((el) => {
    if (el.dataset.id && !currentIds.has(el.dataset.id)) el.remove();
  });

  if (fileList.querySelector('.empty')) fileList.innerHTML = '';

  files.forEach((file) => {
    let item = fileList.querySelector(`[data-id="${file.id}"]`);
    if (!item) {
      item = document.createElement('div');
      item.className = 'file-item';
      item.dataset.id = file.id;
      item.innerHTML = `
                <div class="file-item-top">
                    <div style="display: flex; gap: 10px; align-items: center;">
                        ${file.preview ? `<img src="${file.preview}" class="file-preview">` : `<div class="file-preview" style="display: flex; align-items: center; justify-content: center; font-size: 20px;">📄</div>`}
                        <div>
                            <strong>${file.metadata.name}</strong>
                            <div class="file-meta" style="font-size: 10px; color: #666;">${formatBytes(file.metadata.size)}</div>
                        </div>
                    </div>
                    <div class="file-status-badge">${file.status.toUpperCase()}</div>
                </div>
                <div class="progress-container"><div class="progress-fill"></div></div>
                <div class="progress-text" style="font-size: 10px; margin-top: 5px;">0.0%</div>
                <div class="file-controls"></div>
            `;
      fileList.appendChild(item);
    }

    item.querySelector('.progress-fill').style.width = `${file.progress.percentage}%`;
    item.querySelector('.file-status-badge').textContent = file.status.toUpperCase();

    const progressText = item.querySelector('.progress-text');
    const speedText = file.status === 'uploading' ? ` • ${formatBytes(file.progress.speed)}/s` : '';
    const timeText =
      file.status === 'uploading' && file.progress.timeRemaining > 0
        ? ` • ${formatTime(file.progress.timeRemaining)} left`
        : '';
    progressText.textContent = `${file.progress.percentage.toFixed(1)}%${speedText}${timeText}`;
    item.querySelector('.file-meta').textContent =
      `${formatBytes(file.metadata.size)} • ${formatBytes(file.progress.loaded)} uploaded`;

    const controls = item.querySelector('.file-controls');
    if (item.dataset.status !== file.status) {
      item.dataset.status = file.status;
      let btns = '';
      if (file.status === 'uploading')
        btns = `<button data-action="pause">Pause</button><button data-action="cancel">Cancel</button>`;
      else if (file.status === 'paused')
        btns = `<button data-action="resume">Resume</button><button data-action="cancel">Cancel</button>`;
      else if (file.status === 'failed') btns = `<button data-action="retry">Retry</button>`;
      else if (file.status === 'pending' || file.status === 'queued')
        btns = `<button data-action="upload">Upload</button>`;

      controls.innerHTML = `${btns} <button data-action="remove">Remove</button>`;
    }
  });
}

/**
 * Event Handlers
 */
async function handleUpdateConfig() {
  try {
    const config = JSON.parse(configEditor.value);

    localStorage.setItem(STORAGE_KEY, configEditor.value);

    if (config.acceptedTypes && Array.isArray(config.acceptedTypes)) {
      fileInput.setAttribute('accept', config.acceptedTypes.join(','));
    } else {
      fileInput.removeAttribute('accept');
    }

    await initUploader({ ...config, onStateChange: () => syncUI() }, log);
    syncUI();
    log('success', 'Configuration applied and persisted.');
  } catch (e) {
    log('error', `Invalid JSON: ${e.message}`);
  }
}

async function init() {
  const savedConfigStr = localStorage.getItem(STORAGE_KEY);
  if (savedConfigStr) {
    try {
      const savedConfig = JSON.parse(savedConfigStr);

      const protocol = savedConfig.protocol || 'http';
      const mergedConfig = { ...PRESETS[protocol], ...savedConfig };
      configEditor.value = JSON.stringify(mergedConfig, null, 2);
      log('info', 'Restored and merged configuration from Local Storage.');
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
      configEditor.value = JSON.stringify(PRESETS.http, null, 2);
    }
  } else {
    configEditor.value = JSON.stringify(PRESETS.http, null, 2);
  }
  await handleUpdateConfig();
}

configEditor.addEventListener('blur', handleUpdateConfig);
clearLogsBtn.addEventListener('click', () => (logContainer.innerHTML = ''));

dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', async (e) => {
  const uploader = getUploader();
  if (uploader) await uploader.handleFileSelect(e);
  syncUI();
});

dropZone.addEventListener('dragover', (e) => {
  getUploader()?.handleDragOver(e);
  dropZone.classList.add('drag-over');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', async (e) => {
  dropZone.classList.remove('drag-over');
  await getUploader()?.handleDrop(e);
  syncUI();
});

uploadAllBtn.addEventListener('click', () => getUploader()?.uploadAll());
clearAllBtn.addEventListener('click', async () => {
  await getUploader()?.clearAll();
  syncUI();
});

fileList.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.closest('.file-item').dataset.id;
  const uploader = getUploader();

  switch (action) {
    case 'pause':
      await uploader.pauseUpload(id);
      break;
    case 'resume':
      await uploader.resumeUpload(id);
      break;
    case 'cancel':
      await uploader.cancelUpload(id);
      break;
    case 'retry':
      await uploader.retryUpload(id);
      break;
    case 'upload':
      await uploader.uploadFile(id);
      break;
    case 'remove':
      await uploader.removeFile(id);
      break;
  }
  syncUI();
});

document.querySelectorAll('.preset-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    configEditor.value = JSON.stringify(PRESETS[btn.dataset.protocol], null, 2);
    handleUpdateConfig();
  });
});

init();
