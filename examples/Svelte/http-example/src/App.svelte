<script>
  import { useUploader, formatBytes, formatTime } from '@verbpatch/svelte-uploader';

  let authToken = $state('verbpatch-secret-token');
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

  const uploader = useUploader({
    protocol: 'http',
    http: {
      endpoint: 'http://localhost:3000/upload',
      method: 'POST',
      enableChunking: true,
    },
    maxFiles: 10,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    acceptedTypes: ['application/pdf'],
    chunkSize: 500 * 1024,
    maxConcurrent: 2,
    autoRetry: true,
    enablePreviews: false,
    onBeforeRequest: async (file, chunk) => {
      console.log(
        `[Auth] Preparing request for ${file.metadata.name}${chunk ? ` (Chunk ${chunk.index})` : ''}`,
      );
      return {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
    },
    onFilesRejected: (rejections) => {
      rejections.forEach((r) => {
        showNotification(`Rejected: ${r.file.name} - ${r.message}`, 'error');
      });
    },

    onUploadSuccess: (file) => {
      showNotification(`Success: ${file.metadata.name}`, 'success');
    },

    onUploadError: (file, error) => {
      showNotification(`Error: ${file.metadata.name} - ${error.message}`, 'error');
    },

    onAllComplete: (files) => {
      showNotification('[Complete] All ' + files.length + ' uploads finished!', 'success');
    },
  });

  async function onDrop(e) {
    isDragOver = false;
    await $uploader.handleDrop(e);
  }
</script>

<header>
  <h1>Svelte Uploader - HTTP example</h1>
  <p>
    This example demonstrates the <strong>headless</strong> nature of the library. No built-in UI components
    are used; the logic is completely decoupled from the rendering.
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
  <h2>1. Input</h2>
  <div>
    <label for="auth-token">Authorization Token:</label>
    <input
      type="text"
      id="auth-token"
      placeholder="Enter 'verbpatch-secret-token'"
      bind:value={authToken}
    />
    <p>
      The server requires 'verbpatch-secret-token' to allow uploads. Try changing it to see auth
      failure.
    </p>
  </div>

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
            background-color: {isDragOver ? '#f3e5f5' : 'transparent'}; 
            border-color: {isDragOver ? '#9c27b0' : '#ccc'};"
  >
    <strong>Drop files here</strong> or click to select
  </div>
  <input
    type="file"
    id="file-input"
    multiple
    style="display:none"
    accept="application/pdf"
    onchange={(e) => $uploader.handleFileSelect(e)}
  />

  <div class="controls">
    <button onclick={() => $uploader.uploadAll()}>Upload All</button>
    <button onclick={() => $uploader.clearAll()}>Clear Queue</button>
  </div>
</section>

<section id="file-queue">
  <h2>2. File Queue & Progress</h2>
  <div id="file-list">
    {#if $uploader.state.files.length === 0}
      <p>Queue is empty.</p>
    {:else}
      {#each $uploader.state.files as file (file.id)}
        <div class="file-item">
          <div>
            <strong>{file.metadata.name}</strong> ({formatBytes(file.metadata.size)})
          </div>
          <div>
            Status: [{file.status.toUpperCase()}] • {formatBytes(file.progress.loaded)} uploaded
          </div>

          <div>
            {file.progress.percentage.toFixed(1)}%
            {#if file.status === 'uploading'}
              • {formatBytes(file.progress.speed)}/s • {formatTime(file.progress.timeRemaining)} left
            {/if}
          </div>
          <div class="controls">
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
  <h2>3. Internal State (Reactive)</h2>
  <pre id="stats-raw">{JSON.stringify(
      {
        protocol: 'HTTP',
        isUploading: $uploader.state.isUploading,
        totalProgress: $uploader.state.totalProgress.percentage.toFixed(2) + '%',
        filesCount: $uploader.state.files.length,
        uploading: $uploader.state.uploadingFiles.length,
        completed: $uploader.state.completedFiles.length,
        failed: $uploader.state.failedFiles.length,
      },
      null,
      2,
    )}</pre>
</section>
