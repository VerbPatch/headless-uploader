<script setup>
import { ref, computed } from 'vue';
import { useUploader, formatBytes, formatTime } from '@verbpatch/vue-uploader';

const authToken = ref('verbpatch-secret-token');
const isDragOver = ref(false);
const fileInput = ref(null);
const notifications = ref([]);

function showNotification(message, type = 'info') {
  const id = Date.now();
  notifications.value.push({ id, message, type });
  setTimeout(() => {
    removeNotification(id);
  }, 3000);
}

function removeNotification(id) {
  notifications.value = notifications.value.filter((n) => n.id !== id);
}

const uploader = useUploader({
  protocol: 'websocket',
  websocket: {
    url: 'wss://nus.verbpatch.com/ws-upload',
    reconnect: true,
    reconnectDelay: 3000,
    maxReconnectAttempts: 5,
    heartbeatInterval: 30000,
    binaryType: 'arraybuffer',
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
        Authorization: `Bearer ${authToken.value}`,
      },
    };
  },
  onFilesRejected: (rejections) => {
    rejections.forEach((rejection) => {
      showNotification(`Rejected: ${rejection.file.name} - ${rejection.reason}`, 'error');
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

const stats = computed(() => {
  const state = uploader.state;
  return {
    protocol: 'WebSocket',
    isUploading: state.isUploading,
    totalProgress: state.totalProgress.percentage.toFixed(2) + '%',
    filesCount: state.files.length,
    uploading: state.uploadingFiles.length,
    completed: state.completedFiles.length,
    failed: state.failedFiles.length,
  };
});

const onDrop = async (e) => {
  isDragOver.value = false;
  await uploader.handleDrop(e);
};
</script>

<template>
  <div v-if="uploader.state" id="app">
    <header>
      <h1>Vue Uploader - WEBSOCKET example</h1>
      <p>Real-time uploads using WebSockets. Minimal UI to showcase headless logic.</p>
    </header>

    <section id="configuration">
      <h2>1. Input</h2>
      <div>
        <label>Authorization Token:</label>
        <input type="text" v-model="authToken" placeholder="Enter 'verbpatch-secret-token'" />
        <p>
          The server requires 'verbpatch-secret-token' to allow uploads. Try changing it to see auth
          failure.
        </p>
      </div>

      <div
        id="drop-zone"
        @dragover.prevent="
          uploader.handleDragOver($event);
          isDragOver = true;
        "
        @dragleave="isDragOver = false"
        @drop.prevent="onDrop"
        @click="fileInput.click()"
        style="
          border: 2px dashed #ccc;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          margin-bottom: 10px;
        "
        :style="{
          'background-color': isDragOver ? '#f3e5f5' : 'transparent',
          'border-color': isDragOver ? '#9c27b0' : '#ccc',
        }"
      >
        <strong>Drop files here</strong> or click to select
      </div>
      <input
        type="file"
        ref="fileInput"
        multiple
        style="display: none"
        accept="application/pdf"
        @change="(e) => uploader.handleFileSelect(e)"
      />

      <div class="controls">
        <button @click="uploader.uploadAll()">Upload All</button>
        <button @click="uploader.clearAll()">Clear Queue</button>
      </div>
    </section>

    <section id="file-queue">
      <h2>2. File Queue & Progress</h2>
      <div id="file-list">
        <p v-if="uploader.state.files.length === 0">No files selected.</p>
        <div v-for="file in uploader.state.files" :key="file.id" class="file-item">
          <div>
            <strong>{{ file.metadata.name }}</strong> ({{ formatBytes(file.metadata.size) }})
          </div>
          <div>
            Status: [{{ file.status.toUpperCase() }}] •
            {{ formatBytes(file.progress.loaded) }} uploaded
          </div>
          <div>
            <div />
          </div>
          <div>
            {{ file.progress.percentage.toFixed(1) }}%
            <span v-if="file.status === 'uploading'">
              • {{ formatBytes(file.progress.speed) }}/s •
              {{ formatTime(file.progress.timeRemaining) }} left</span
            >
          </div>
          <div class="controls">
            <template v-if="file.status === 'uploading'">
              <button @click="uploader.pauseUpload(file.id)">Pause</button>
              <button @click="uploader.cancelUpload(file.id)">Cancel</button>
            </template>
            <template v-else-if="file.status === 'paused'">
              <button @click="uploader.resumeUpload(file.id)">Resume</button>
              <button @click="uploader.cancelUpload(file.id)">Cancel</button>
            </template>
            <button v-else-if="file.status === 'failed'" @click="uploader.retryUpload(file.id)">
              Retry
            </button>
            <button
              v-else-if="file.status === 'pending' || file.status === 'queued'"
              @click="uploader.uploadFile(file.id)"
            >
              Upload
            </button>
            <button @click="uploader.removeFile(file.id)">Remove</button>
          </div>
        </div>
      </div>
    </section>

    <section id="uploader-state">
      <h2>3. Internal State (Reactive)</h2>
      <pre>{{ JSON.stringify(stats, null, 2) }}</pre>
    </section>

    <div class="notifications-container">
      <div v-for="n in notifications" :key="n.id" class="notification" :class="n.type">
        <span>{{ n.message }}</span>
        <button class="close-btn" @click="removeNotification(n.id)">×</button>
      </div>
    </div>
  </div>
</template>
