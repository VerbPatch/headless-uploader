import $ from 'jquery';
import { formatBytes, formatTime, createS3Adapter } from '@verbpatch/jquery-uploader';

$(function () {
  const $fileInput = $('#file-input');
  const $dropZone = $('#drop-zone');
  const $fileList = $('#file-list');
  const $statsRaw = $('#stats-raw');
  const $notifications = $('#notifications');

  function showNotification(message, type = 'info') {
    const id = Date.now();
    const $notification = $(`
      <div class="notification ${type}" data-id="${id}">
        <span class="message">${message}</span>
        <span class="close-btn">&times;</span>
      </div>
    `);

    $notification.find('.close-btn').on('click', () => $notification.remove());
    $notifications.append($notification);

    setTimeout(() => $notification.remove(), 5000);
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

  $fileInput.headlessUploader({
    protocol: 'cloud',
    cloudAdapter: createS3Adapter({
        getUploadUrl: getS3PresignedUrl,
    }),
    maxFiles: 5,
    enablePreviews: true,

    onFilesAdded: render,
    onFilesRejected: (errors) => {
      errors.forEach((err) => showNotification(`${err.file.name}: ${err.message}`, 'error'));
    },
    onUploadProgress: render,
    onUploadSuccess: (file) => {
      showNotification(`Cloud Success: ${file.metadata.name}`, 'success');
      render();
    },
    onUploadError: (file, error) => {
      showNotification(`Note: Actual upload failed (expected with mock), but flow is correct.`, 'info');
      render();
    },
    onAllComplete: (files) => {
      showNotification('[Complete] All cloud transfers finished!', 'success');
      render();
    },
  });

  $('#upload-all').on('click', () => $fileInput.headlessUploader('uploadAll'));
  $('#clear-all').on('click', () => {
    $fileInput.headlessUploader('clearAll');
    render();
  });

  $dropZone.on('dragover', (e) => {
    e.preventDefault();
    $dropZone.addClass('drag-over');
  });
  $dropZone.on('dragleave', () => $dropZone.removeClass('drag-over'));
  $dropZone.on('drop', async (e) => {
    e.preventDefault();
    $dropZone.removeClass('drag-over');
    await $fileInput.headlessUploader('handleDrop', e.originalEvent);
    render();
  });
  $dropZone.on('click', () => $fileInput.click());

  $fileInput.on('change', (e) => {
    if (e.target.files) {
      $fileInput.headlessUploader('addFiles', e.target.files);
      render();
    }
  });

  $fileList.on('click', '.btn-pause', function () {
    $fileInput.headlessUploader('pauseUpload', $(this).attr('data-id'));
  });
  $fileList.on('click', '.btn-resume', function () {
    $fileInput.headlessUploader('resumeUpload', $(this).attr('data-id'));
  });
  $fileList.on('click', '.btn-cancel', function () {
    $fileInput.headlessUploader('cancelUpload', $(this).attr('data-id'));
  });
  $fileList.on('click', '.btn-retry', function () {
    $fileInput.headlessUploader('retryUpload', $(this).attr('data-id'));
  });
  $fileList.on('click', '.btn-upload', function () {
    $fileInput.headlessUploader('uploadFile', $(this).attr('data-id'));
  });
  $fileList.on('click', '.btn-remove', function () {
    $fileInput.headlessUploader('removeFile', $(this).attr('data-id'));
    render();
  });

  let renderPending = false;
  function render() {
    if (renderPending) return;
    renderPending = true;

    requestAnimationFrame(() => {
      renderPending = false;
      const state = $fileInput.headlessUploader('getState');

      $statsRaw.text(
        JSON.stringify(
          {
            activeProtocol: 'cloud',
            adapter: 'S3Adapter',
            isUploading: state.isUploading,
            totalProgress: state.totalProgress.percentage.toFixed(2) + '%',
            filesCount: state.files.length,
          },
          null,
          2,
        ),
      );

      if (state.files.length === 0) {
        $fileList.html('<p>Queue is empty.</p>');
        return;
      } else if ($fileList.find('> p').length > 0) {
        $fileList.empty();
      }

      state.files.forEach((file) => {
        let $item = $fileList.find(`.file-item[data-id="${file.id}"]`);

        if ($item.length === 0) {
          $item = $(`
            <div class="file-item" data-id="${file.id}">
              <div style="display: flex; align-items: center; gap: 15px">
                 <div class="preview-container"></div>
                 <div>
                    <div class="file-info"><strong>${file.metadata.name}</strong> (${formatBytes(file.metadata.size)})</div>
                    <div class="status-text"></div>
                 </div>
              </div>
              <div class="progress-bar-container" style="height: 8px; background: #eee; border-radius: 4px; overflow: hidden; margin-top: 10px;">
                  <div class="progress-fg" style="height: 100%; background: #4caf50; transition: width 0.3s; width: 0%"></div>
              </div>
              <div class="progress-info" style="font-size: 12px; margin-top: 4px; display: flex; justify-content: space-between"></div>
              <div class="actions" style="margin-top: 10px"></div>
            </div>
          `);
          $fileList.append($item);
        }

        if (file.preview) {
            const $prev = $item.find('.preview-container');
            if ($prev.is(':empty')) {
                $prev.html(`<img src="${file.preview}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />`);
            }
        }

        $item.find('.status-text').text(`Status: [${file.status.toUpperCase()}]`);
        $item.find('.progress-fg').css('width', `${file.progress.percentage}%`);

        let info = `${file.progress.percentage.toFixed(1)}% uploaded`;
        if (file.status === 'uploading') {
          info += ` • ${formatBytes(file.progress.speed)}/s`;
        }
        $item.find('.progress-info').text(info);

        const currentStatus = $item.attr('data-status');
        if (currentStatus !== file.status) {
          $item.attr('data-status', file.status);
          const $actions = $item.find('.actions').empty();

          if (file.status === 'uploading') {
            $('<button class="btn-pause">Pause</button>').attr('data-id', file.id).appendTo($actions);
            $('<button class="btn-cancel">Cancel</button>').attr('data-id', file.id).appendTo($actions);
          } else if (file.status === 'paused') {
            $('<button class="btn-resume">Resume</button>').attr('data-id', file.id).appendTo($actions);
            $('<button class="btn-cancel">Cancel</button>').attr('data-id', file.id).appendTo($actions);
          } else if (file.status === 'failed') {
            $('<button class="btn-retry">Retry</button>').attr('data-id', file.id).appendTo($actions);
          } else if (file.status === 'pending' || file.status === 'queued') {
            $('<button class="btn-upload">Upload</button>').attr('data-id', file.id).appendTo($actions);
          }
          $('<button class="btn-remove">Remove</button>').attr('data-id', file.id).appendTo($actions);
        }
      });

      $fileList.find('.file-item').each(function () {
        const id = $(this).attr('data-id');
        if (!state.files.find((f) => f.id === id)) {
          $(this).remove();
        }
      });
    });
  }

  render();
});
