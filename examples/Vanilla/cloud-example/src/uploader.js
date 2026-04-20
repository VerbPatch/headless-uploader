import { useUploader, createS3Adapter, formatBytes } from '@verbpatch/headless-uploader';

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
        <div style="display: flex; align-items: center; gap: 15px">
            <div class="preview-container"></div>
            <div>
                <strong>${file.metadata.name}</strong> (${formatBytes(file.metadata.size)})
                <div class="file-status"></div>
            </div>
        </div>
        <div class="progress-container" style="margin-top: 10px">
            <div style="height: 8px; background: #eee; border-radius: 4px; overflow: hidden">
                <div class="progress-fg" style="height: 100%; background: #4caf50; transition: width 0.3s; width: 0%"></div>
            </div>
            <div class="progress-info" style="font-size: 12px; margin-top: 4px; display: flex; justify-content: space-between"></div>
        </div>
        <div class="controls" style="margin-top: 10px"></div>
      `;
      fileList.appendChild(fileItem);
    }

    if (file.preview) {
      const previewContainer = fileItem.querySelector('.preview-container');
      if (!previewContainer.innerHTML) {
        previewContainer.innerHTML = `<img src="${file.preview}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />`;
      }
    }

    const statusEl = fileItem.querySelector('.file-status');
    const newStatusText = `Status: [${file.status.toUpperCase()}]`;
    if (statusEl.textContent !== newStatusText) {
      statusEl.textContent = newStatusText;
    }

    fileItem.querySelector('.progress-fg').style.width = `${file.progress.percentage}%`;

    fileItem.querySelector('.progress-info').textContent = `
      ${file.progress.percentage.toFixed(1)}% uploaded 
      ${file.status === 'uploading' ? `• ${formatBytes(file.progress.speed)}/s` : ''}
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
      activeProtocol: 'cloud',
      adapter: 'S3Adapter',
      isUploading: state.isUploading,
      totalProgress: state.totalProgress.percentage.toFixed(2) + '%',
      filesCount: state.files.length,
    },
    null,
    2,
  );
}

function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container');
  if (!container) return;

  const n = document.createElement('div');
  n.className = `notification ${type}`;
  n.innerHTML = `<span>${message}</span><span class="close-btn">&times;</span>`;
  container.appendChild(n);
  n.querySelector('.close-btn').onclick = () => n.remove();
  setTimeout(() => n.remove(), 5000);
}

/**
 * Fetch S3 Presigned URL from local uploader-server
 */
const getS3PresignedUrl = async (file) => {
  const response = await fetch('http://localhost:3000/generate-s3-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.metadata.name,
      contentType: file.metadata.type,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get presigned URL from server');
  }

  const { url } = await response.json();
  return url;
};

export function setupUploader() {
  uploader = useUploader({
    protocol: 'cloud',
    cloudAdapter: createS3Adapter({
      getUploadUrl: getS3PresignedUrl,
    }),
    maxFiles: 5,
    enablePreviews: true,
    onFilesAdded: () => {
      renderFileList();
      updateStats();
    },
    onUploadProgress: () => {
      renderFileList();
      updateStats();
    },
    onUploadSuccess: (file) => {
      showNotification(`Cloud Success: ${file.metadata.name}`, 'success');
      renderFileList();
      updateStats();
    },
    onUploadError: (file, error) => {
      showNotification(`Upload error for ${file.metadata.name}: ${error.message}`, 'error');
      renderFileList();
      updateStats();
    },
    onAllComplete: () => {
      showNotification('All cloud transfers finished!', 'success');
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
    if (action === 'pause') await uploader.pauseUpload(id);
    else if (action === 'resume') await uploader.resumeUpload(id);
    else if (action === 'cancel') await uploader.cancelUpload(id);
    else if (action === 'retry') await uploader.retryUpload(id);
    else if (action === 'upload') await uploader.uploadFile(id);
    else if (action === 'remove') await uploader.removeFile(id);
    renderFileList();
    updateStats();
  });

  renderFileList();
  updateStats();
}
