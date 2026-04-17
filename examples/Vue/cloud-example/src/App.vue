<script setup>
import { ref, computed } from 'vue';
import { useUploader, createS3Adapter, formatBytes, formatTime } from '@verbpatch/vue-uploader';

const isDragOver = ref(false);
const fileInput = ref(null);
const notifications = ref([]);

function showNotification(message, type = 'info') {
  const id = Date.now();
  notifications.value.push({ id, message, type });
  setTimeout(() => {
    removeNotification(id);
  }, 5000);
}

function removeNotification(id) {
  notifications.value = notifications.value.filter((n) => n.id !== id);
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

const stats = computed(() => {
  const state = uploader.state;
  return {
    activeProtocol: 'cloud',
    adapter: 'S3Adapter',
    isUploading: state.isUploading,
    totalProgress: state.totalProgress.percentage.toFixed(2) + '%',
    filesCount: state.files.length,
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
      <h1>Vue Uploader - Cloud Protocol</h1>
      <p>
        This example demonstrates direct-to-cloud (S3) uploads using the <strong>protocol: 'cloud'</strong> setting in Vue.
      </p>
    </header>

    <section id="configuration">
      <h2>1. Cloud Upload</h2>
      <p>
          Configured with <code>S3Adapter</code>. Uses mocked backend signing logic.
      </p>

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
          'background-color': isDragOver ? '#f1f8e9' : 'transparent',
          'border-color': isDragOver ? '#4caf50' : '#ccc',
        }"
      >
        <strong>Drop files here</strong> or click to select
      </div>
      <input
        type="file"
        ref="fileInput"
        multiple
        style="display: none"
        @change="(e) => uploader.handleFileSelect(e)"
      />

      <div class="controls">
        <button @click="uploader.uploadAll()" :disabled="uploader.state.files.length === 0 || uploader.state.isUploading">
           {{ uploader.state.isUploading ? 'Uploading...' : 'Start Cloud Upload' }}
        </button>
        <button @click="uploader.clearAll()">Clear Queue</button>
      </div>
    </section>

    <section id="file-queue">
      <h2>2. Queue & Progress</h2>
      <div id="file-list">
        <p v-if="uploader.state.files.length === 0">No files selected.</p>
        <div v-for="file in uploader.state.files" :key="file.id" class="file-item">
          <div style="display: flex; align-items: center; gap: 15px">
             <img v-if="file.preview" :src="file.preview" alt="preview" style="border-radius: 4px; border: 1px solid #eee; width: 60px; height: 60px; object-fit: cover;" />
             <div>
                  <strong>{{ file.metadata.name }}</strong> ({{ formatBytes(file.metadata.size) }})
                  <div>Status: <span :class="'status-' + file.status">{{ file.status.toUpperCase() }}</span></div>
             </div>
          </div>

          <div style="margin-top: 10px">
            <div style="height: 8px; background: #eee; border-radius: 4px; overflow: hidden">
                <div :style="{ width: file.progress.percentage + '%' }" style="height: 100%; background: #4caf50; transition: width 0.3s"></div>
            </div>
            <div style="font-size: 12px; margin-top: 4px; display: flex; justify-content: space-between">
               <span>{{ file.progress.percentage.toFixed(1) }}% uploaded</span>
               <span v-if="file.status === 'uploading'">
                   {{ formatBytes(file.progress.speed) }}/s • {{ formatTime(file.progress.timeRemaining) }} left
               </span>
            </div>
          </div>

          <div class="controls" style="margin-top: 10px">
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
      <h2>3. Instance State</h2>
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
