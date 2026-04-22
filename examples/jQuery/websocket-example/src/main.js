import $ from 'jquery';
import { formatBytes, formatTime } from '@verbpatch/jquery-uploader';

$(function () {
  const $authToken = $('#auth-token');
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

    $notification.find('.close-btn').on('click', () => removeNotification(id));
    $notifications.append($notification);

    setTimeout(() => removeNotification(id), 5000);
  }

  function removeNotification(id) {
    const $notification = $notifications.find(`.notification[data-id="${id}"]`);

    setTimeout(() => $notification.remove(), 300);
  }

  $fileInput.headlessUploader({
    protocol: 'websocket',
    websocket: {
      url: `ws://localhost:3000/ws-upload`,
      reconnect: true,
      reconnectDelay: 3000,
      maxReconnectAttempts: 5,
      binaryType: 'blob',
    },
    maxFiles: 10,
    maxFileSize: 50 * 1024 * 1024,
    acceptedTypes: ['application/pdf'],
    chunkSize: 500 * 1024,
    maxConcurrent: 2,
    autoRetry: true,
    enablePreviews: false,

    onBeforeRequest: async (file, chunk) => {
      // eslint-disable-next-line
      console.log(
        '[Auth] Preparing request for ' +
          file.file.name +
          (chunk ? ' (Chunk ' + chunk.index + ')' : ''),
      );
      return {
        headers: {
          Authorization: `Bearer ${$authToken.val()}`,
        },
      };
    },
    onFilesAdded: render,
    onFilesRejected: (errors) => {
      errors.forEach((err) => showNotification(`${err.file.name}: ${err.message}`, 'error'));
    },
    onUploadProgress: render,
    onUploadSuccess: (file) => {
      showNotification(`Upload successful: ${file.metadata.name}`, 'success');
      render();
    },
    onUploadError: (file, error) => {
      showNotification(`Upload failed: ${file.metadata.name} - ${error.message}`, 'error');
      render();
    },
    onUploadPause: render,
    onUploadResume: render,
    onUploadCancel: render,
    onAllComplete: (files) => {
      showNotification('[Complete] All ' + files.length + ' uploads finished!', 'success');
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
  });
  $dropZone.on('dragleave', () => $dropZone);
  $dropZone.on('drop', async (e) => {
    e.preventDefault();

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
            protocol: 'WebSocket',
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
              <div class="file-info"><strong>${file.metadata.name}</strong> (${formatBytes(file.metadata.size)})</div>
              <div class="status-text"></div>
              <div class="progress-fg" style="display:none"></div>
              <div class="progress-info"></div>
              <div class="actions"></div>
            </div>
          `);
          $fileList.append($item);
        }

        $item.find('.status-text').text(`Status: [${file.status.toUpperCase()}]`);

        let info = `${file.progress.percentage.toFixed(1)}%`;
        if (file.status === 'uploading') {
          info += ` • ${formatBytes(file.progress.speed)}/s • ${formatTime(file.progress.timeRemaining)} left`;
        }
        $item.find('.progress-info').text(info);

        const currentStatus = $item.attr('data-status');
        if (currentStatus !== file.status) {
          $item.attr('data-status', file.status);
          const $actions = $item.find('.actions').empty();

          if (file.status === 'uploading') {
            $('<button class="btn-pause">Pause</button>')
              .attr('data-id', file.id)
              .appendTo($actions);
            $('<button class="btn-cancel">Cancel</button>')
              .attr('data-id', file.id)
              .appendTo($actions);
          } else if (file.status === 'paused') {
            $('<button class="btn-resume">Resume</button>')
              .attr('data-id', file.id)
              .appendTo($actions);
            $('<button class="btn-cancel">Cancel</button>')
              .attr('data-id', file.id)
              .appendTo($actions);
          } else if (file.status === 'failed') {
            $('<button class="btn-retry">Retry</button>')
              .attr('data-id', file.id)
              .appendTo($actions);
          } else if (file.status === 'pending' || file.status === 'queued') {
            $('<button class="btn-upload">Upload</button>')
              .attr('data-id', file.id)
              .appendTo($actions);
          }
          $('<button class="btn-remove">Remove</button>')
            .attr('data-id', file.id)
            .appendTo($actions);
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
