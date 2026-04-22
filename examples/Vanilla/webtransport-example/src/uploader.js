import { useUploader, formatBytes, formatTime } from '@verbpatch/headless-uploader';

let uploader;
let dropZone, fileInput, fileList, uploadAllBtn, clearAllBtn, statsRaw;

function renderFileList() {
  const files = uploader.getFiles();

  if (files.length === 0) {
    fileList.innerHTML = '<p>No files selected.</p>';
    return;
  }

  if (fileList.querySelector('p')) {
    fileList.innerHTML = '';
  }

  const existingIds = new Set(files.map((f) => f.id));

  Array.from(fileList.children).forEach((el) => {
    if (el.dataset.id && !existingIds.has(el.dataset.id)) {
      el.remove();
    }
  });

  files.forEach((file) => {
    let fileItem = fileList.querySelector(`[data-id="${file.id}"]`);

    if (!fileItem) {
      fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.dataset.id = file.id;
      fileItem.innerHTML = `
        <div><strong>${file.metadata.name}</strong> (${formatBytes(file.metadata.size)})</div>
        <div class="file-status"></div>
        <div class="progress-fg" style="display:none"></div>
        <div class="progress-info"></div>
        <div class="controls"></div>
      `;
      fileList.appendChild(fileItem);
    }

    const statusEl = fileItem.querySelector('.file-status');
    const newStatusText = `Status: [${file.status.toUpperCase()}] • ${formatBytes(file.progress.loaded)} uploaded`;
    if (statusEl.textContent !== newStatusText) {
      statusEl.textContent = newStatusText;
    }

    fileItem.querySelector('.progress-fg').style.width = `${file.progress.percentage}%`;

    fileItem.querySelector('.progress-info').textContent = `
      ${file.progress.percentage.toFixed(1)}% 
      ${file.status === 'uploading' ? `• ${formatBytes(file.progress.speed)}/s • ${formatTime(file.progress.timeRemaining)} left` : ''}
    `;

    const controls = fileItem.querySelector('.controls');
    const currentStatus = fileItem.dataset.status;

    if (currentStatus !== file.status) {
      fileItem.dataset.status = file.status;

      let buttons = '';
      if (file.status === 'uploading') {
        buttons = `
          <button data-action="pause" data-id="${file.id}">Pause</button>
          <button data-action="cancel" data-id="${file.id}">Cancel</button>
        `;
      } else if (file.status === 'paused') {
        buttons = `
          <button data-action="resume" data-id="${file.id}">Resume</button>
          <button data-action="cancel" data-id="${file.id}">Cancel</button>
        `;
      } else if (file.status === 'failed') {
        buttons = `<button data-action="retry" data-id="${file.id}">Retry</button>`;
      } else if (file.status === 'pending' || file.status === 'queued') {
        buttons = `<button data-action="upload" data-id="${file.id}">Upload</button>`;
      }

      controls.innerHTML = `${buttons} <button data-action="remove" data-id="${file.id}">Remove</button>`;
    }
  });
}

function updateStats() {
  const state = uploader.getState();
  statsRaw.textContent = JSON.stringify(
    {
      protocol: 'WebTransport',
      isUploading: state.isUploading,
      totalProgress: state.totalProgress.percentage.toFixed(2) + '%',
      filesCount: state.files.length,
      uploading: state.uploadingFiles.length,
      completed: state.completedFiles.length,
      failed: state.failedFiles.length,
    },
    null,
    2,
  );
}

function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container');
  if (!container) return;

  const id = Date.now();
  const n = document.createElement('div');
  n.className = `notification ${type}`;
  n.dataset.id = id;
  n.innerHTML = `
    <span>${message}</span>
    <span class="close-btn">&times;</span>
  `;

  container.appendChild(n);

  n.querySelector('.close-btn').onclick = () => removeNotification(id);

  setTimeout(() => removeNotification(id), 5000);
}

function removeNotification(id) {
  const n = document.querySelector(`.notification[data-id="${id}"]`);
  if (n) n.remove();
}

async function fetchWebTransportConfig() {
  try {
    const response = await fetch('https://nus.verbpatch.com/webtransport-config');
    if (response.ok) return await response.json();
  } catch (err) {
    // eslint-disable-next-line
    console.warn('WT config fetch failed:', err);
  }
  return null;
}

export async function setupUploader() {
  const wtConfig = await fetchWebTransportConfig();
  const transportOptions = {
    url: 'https://127.0.0.1:4443/wt-upload',
    bidirectionalStreams: true,
    congestionControl: 'throughput',
  };

  if (wtConfig?.certHash) {
    transportOptions.serverCertificateHashes = [
      {
        algorithm: 'sha-256',
        value: new Uint8Array(wtConfig.certHash),
      },
    ];
  }

  uploader = useUploader({
    protocol: 'webtransport',
    webtransport: transportOptions,
    maxFiles: 10,
    maxFileSize: 50 * 1024 * 1024,
    acceptedTypes: ['application/pdf'],
    chunkSize: 500 * 1024,
    maxConcurrent: 2,
    autoRetry: true,
    enablePreviews: false,
    onFilesRejected: (rejections) => {
      rejections.forEach((rejection) => {
        showNotification(`Rejected: ${rejection.file.name} - ${rejection.message}`, 'error');
      });
      renderFileList();
      updateStats();
    },

    onBeforeRequest: async (file, chunk) => {
      const tokenInput = document.getElementById('auth-token');
      const token = tokenInput ? tokenInput.value : '';
      // eslint-disable-next-line
      console.log(
        `[Auth] Preparing request for ${file.metadata.name}${chunk ? ` (Chunk ${chunk.index})` : ''}`,
      );

      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    },
    onFilesAdded: () => {
      renderFileList();
      updateStats();
    },
    onUploadStart: (_file) => {
      renderFileList();
    },
    onUploadProgress: () => {
      renderFileList();
      updateStats();
    },
    onUploadSuccess: (file) => {
      showNotification(`Success: ${file.metadata.name}`, 'success');
      renderFileList();
      updateStats();
    },
    onUploadError: (file, error) => {
      showNotification(`Error: ${file.metadata.name} - ${error.message}`, 'error');
      renderFileList();
      updateStats();
    },
    onAllComplete: (files) => {
      showNotification('[Complete] All ' + files.length + ' uploads finished!', 'success');
      renderFileList();
      updateStats();
    },
  });

  dropZone = document.getElementById('drop-zone');
  fileInput = document.getElementById('file-input');
  fileList = document.getElementById('file-list');
  uploadAllBtn = document.getElementById('upload-all');
  clearAllBtn = document.getElementById('clear-all');
  statsRaw = document.getElementById('stats-raw');

  fileInput.addEventListener('change', (e) => uploader.handleFileSelect(e));
  dropZone.addEventListener('dragover', (e) => {
    uploader.handleDragOver(e);
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', async (e) => {
    dropZone.classList.remove('drag-over');
    await uploader.handleDrop(e);
  });
  dropZone.addEventListener('click', () => fileInput.click());

  uploadAllBtn.addEventListener('click', () => uploader.uploadAll());
  clearAllBtn.addEventListener('click', async () => {
    await uploader.clearAll();
    renderFileList();
    updateStats();
  });

  fileList.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

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
        updateStats();
        break;
    }
    renderFileList();
  });

  renderFileList();
  updateStats();
}
