<script>
  import { useUploader, createS3Adapter, formatBytes, formatTime } from '@verbpatch/svelte-uploader';

  let isDragOver = $state(false);
  let notifications = $state([]);

  function showNotification(message, type = 'info') {
    const id = Math.random().toString(36).substring(2, 9);
    notifications.push({ id, message, type });
    setTimeout(() => removeNotification(id), 5000);
  }

  function removeNotification(id) {
    notifications = notifications.filter((n) => n.id !== id);
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

  const uploader = useUploader({
    protocol: 'cloud',
    cloudAdapter: createS3Adapter({
      getUploadUrl: getS3PresignedUrl,
    }),
    maxFiles: 5,
    maxFileSize: 100 * 1024 * 1024,
    autoUpload: false,
    enablePreviews: true,
    onFilesRejected: (rejections) => {
      rejections.forEach((r) => {
        showNotification(`Rejected: ${r.file.name} - ${r.message}`, 'error');
      });
    },

    onUploadSuccess: (file) => {
      showNotification(`Cloud Upload Success: ${file.metadata.name}`, 'success');
    },

    onUploadError: (file, error) => {
      showNotification(`Note: Actual upload failed (expected with mock), but the flow is correct.`, 'info');
    },

    onAllComplete: (files) => {
      showNotification('[Complete] All cloud transfers finished!', 'success');
    },
  });

  async function onDrop(e) {
    isDragOver = false;
    await $uploader.handleDrop(e);
  }
</script>

<header>
  <h1>Svelte Uploader - Cloud Protocol</h1>
  <p>
    This example demonstrates direct-to-cloud (S3) uploads using the <strong>protocol: 'cloud'</strong> setting in Svelte.
  </p>
</header>

<div class="notifications-container">
  {#each notifications as notification (notification.id)}
    <div class={`notification ${notification.type}`}>
      <span>{notification.message}</span>
      <button
        class="close-btn"
        onclick={() => removeNotification(notification.id)}
        aria-label="Close">×</button
      >
    </div>
  {/each}
</div>

<section id="configuration">
  <h2>1. Cloud Upload</h2>
  <p>
      Configured with <code>S3Adapter</code>. Uses mocked backend signing logic.
  </p>

  <div
    class:drag-over={isDragOver}
    role="button"
    tabindex="0"
    ondragover={(e) => {
      e.preventDefault();
      $uploader.handleDragOver(e);
      isDragOver = true;
    }}
    ondragleave={() => (isDragOver = false)}
    ondrop={(e) => {
      e.preventDefault();
      onDrop(e);
    }}
    onclick={() => document.getElementById('file-input').click()}
    onkeydown={() => {}}
    style="border: 2px dashed #ccc;padding: 40px;text-align: center;cursor: pointer;margin-bottom: 10px; 
            background-color: {isDragOver ? '#f1f8e9' : 'transparent'}; 
            border-color: {isDragOver ? '#4caf50' : '#ccc'};"
  >
    <strong>Drop files here</strong> or click to select
  </div>
  <input
    type="file"
    id="file-input"
    multiple
    style="display:none"
    onchange={(e) => $uploader.handleFileSelect(e)}
  />

  <div class="controls">
    <button onclick={() => $uploader.uploadAll()} disabled={$uploader.state.files.length === 0 || $uploader.state.isUploading}>
       {$uploader.state.isUploading ? 'Uploading...' : 'Start Cloud Upload'}
    </button>
    <button onclick={() => $uploader.clearAll()}>Clear Queue</button>
  </div>
</section>

<section id="file-queue">
  <h2>2. Queue & Progress</h2>
  <div id="file-list">
    {#if $uploader.state.files.length === 0}
      <p>Queue is empty.</p>
    {:else}
      {#each $uploader.state.files as file (file.id)}
        <div class="file-item">
          <div style="display: flex; align-items: center; gap: 15px">
             {#if file.preview}
                 <img src={file.preview} alt="preview" style="border-radius: 4px; border: 1px solid #eee; width: 60px; height: 60px; object-fit: cover;" />
             {/if}
             <div>
                  <strong>{file.metadata.name}</strong> ({formatBytes(file.metadata.size)})
                  <div>Status: <span class="status-{file.status}">{file.status.toUpperCase()}</span></div>
             </div>
          </div>

          <div style="margin-top: 10px">
            <div style="height: 8px; background: #eee; border-radius: 4px; overflow: hidden">
                <div style="width: {file.progress.percentage}%; height: 100%; background: #4caf50; transition: width 0.3s"></div>
            </div>
            <div style="font-size: 12px; margin-top: 4px; display: flex; justify-content: space-between">
               <span>{file.progress.percentage.toFixed(1)}% uploaded</span>
               {#if file.status === 'uploading'}
                   <span>{formatBytes(file.progress.speed)}/s • {formatTime(file.progress.timeRemaining)} left</span>
               {/if}
            </div>
          </div>

          <div class="controls" style="margin-top: 10px">
            {#if file.status === 'uploading'}
              <button onclick={() => $uploader.pauseUpload(file.id)}>Pause</button>
              <button onclick={() => $uploader.cancelUpload(file.id)}>Cancel</button>
            {:else if file.status === 'paused'}
              <button onclick={() => $uploader.resumeUpload(file.id)}>Resume</button>
              <button onclick={() => $uploader.cancelUpload(file.id)}>Cancel</button>
            {:else if file.status === 'failed'}
              <button onclick={() => $uploader.retryUpload(file.id)}>Retry</button>
            {:else if file.status === 'pending' || file.status === 'queued'}
              <button onclick={() => $uploader.uploadFile(file.id)}>Upload</button>
            {/if}
            <button onclick={() => $uploader.removeFile(file.id)}>Remove</button>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</section>

<section id="uploader-state">
  <h2>3. Instance State</h2>
  <pre id="stats-raw">{JSON.stringify(
      {
        activeProtocol: 'cloud',
        adapter: 'S3Adapter',
        isUploading: $uploader.state.isUploading,
        totalProgress: $uploader.state.totalProgress.percentage.toFixed(2) + '%',
        filesCount: $uploader.state.files.length,
      },
      null,
      2,
    )}</pre>
</section>
