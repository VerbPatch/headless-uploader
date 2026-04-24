<script setup>
import { ref, onMounted } from 'vue';
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
  protocol: 'webtransport',
  webtransport: {
    url: 'https://127.0.0.1:443/wt-upload',
    allowPooling: true,
    congestionControl: 'throughput',
    bidirectionalStreams: true,
    metadata: { connectionType: 'persistent' },
    onReady: () => console.log('Webtransport connected at https://127.0.0.1:443/wt-upload'),
    onClosed: () => console.log('Webtransport closed at https://127.0.0.1:443/wt-upload'),
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
      `[Auth] Preparing WT request for ${file.metadata.name}${chunk ? ` (Chunk ${chunk.index})` : ''}`,
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

onMounted(async () => {
  const wtConfig = await fetchWebTransportConfig();
  if (wtConfig?.certHash) {
    uploader.updateConfig({
      chunkSize: 500 * 1024,
      webtransport: {
        url: 'https://127.0.0.1:443/wt-upload',
        bidirectionalStreams: true,
        allowPooling: true,
        congestionControl: 'throughput',
        serverCertificateHashes: [
          {
            algorithm: 'sha-256',
            value: new Uint8Array(wtConfig.certHash),
          },
        ],
      },
    });
  }
});

async function fetchWebTransportConfig() {
  try {
    const response = await fetch('https://nus.verbpatch.com/webtransport-config');
    if (response.ok) return await response.json();
  } catch (err) {
    console.warn('WT config fetch failed:', err);
  }
  return null;
}

const onDrop = async (e) => {
  isDragOver.value = false;
  await uploader.handleDrop(e);
};
</script>

<template>
  <div>
    <header>
      <h1>Vue Uploader - WEBTRANSPORT example</h1>
      <p>
        This example demonstrates the <strong>headless</strong> nature of the library in Vue using
        WebTransport (HTTP/3).
      </p>
    </header>
    <section>
      <h2>1. Input</h2>
      <div>
        <label>Authorization Token:</label>
        <input type="text" v-model="authToken" />
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
        @change="uploader.handleFileSelect"
      />
      <div class="controls">
        <button @click="uploader.uploadAll()">Upload All</button>
        <button @click="uploader.clearAll()">Clear Queue</button>
      </div>
    </section>
    <section>
      <h2>2. File Queue & Progress</h2>
      <div id="file-list">
        <p v-if="uploader.state.files.length === 0">Queue is empty.</p>
        <template v-else>
          <div v-for="file in uploader.state.files" :key="file.id" class="file-item">
            <div>
              <strong>{{ file.metadata.name }}</strong> ({{ formatBytes(file.metadata.size) }})
            </div>
            <div>
              Status: [{{ file.status.toUpperCase() }}] •
              {{ formatBytes(file.progress.loaded) }} uploaded
            </div>
            <div>
              <div></div>
            </div>
            <div>
              {{ file.progress.percentage.toFixed(1) }}%
              <span v-if="file.status === 'uploading'"
                >• {{ formatBytes(file.progress.speed) }}/s •
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
        </template>
      </div>
    </section>

    <section>
      <h2>3. Internal State (Reactive)</h2>
      <pre>{{
        JSON.stringify(
          {
            protocol: 'WebTransport',
            isUploading: uploader.state.isUploading,
            totalProgress: uploader.state.totalProgress.percentage.toFixed(2) + '%',
            filesCount: uploader.state.files.length,
            uploading: uploader.state.uploadingFiles.length,
            completed: uploader.state.completedFiles.length,
            failed: uploader.state.failedFiles.length,
          },
          null,
          2,
        )
      }}</pre>
    </section>

    <div class="notifications-container">
      <div v-for="n in notifications" :key="n.id" class="notification" :class="n.type">
        <span>{{ n.message }}</span>
        <button class="close-btn" @click="removeNotification(n.id)">×</button>
      </div>
    </div>
  </div>
</template>
