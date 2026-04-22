import { createSignal, Show, For } from 'solid-js';
import { useUploader, formatBytes, formatTime } from '@verbpatch/solid-uploader';
import type { UploadFile, ValidationError } from '@verbpatch/solid-uploader';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

export default function App() {
  const [authToken, setAuthToken] = createSignal('verbpatch-secret-token');
  const [isDragOver, setIsDragOver] = createSignal(false);
  const [notifications, setNotifications] = createSignal<Notification[]>([]);

  // eslint-disable-next-line
  let fileInput: HTMLInputElement | undefined;

  const showNotification = (message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const {
    state,
    addFiles,
    uploadAll,
    uploadFile,
    pauseUpload,
    resumeUpload,
    cancelUpload,
    retryUpload,
    removeFile,
    clearAll,
    handleDragOver,
    handleDrop,
  } = useUploader({
    protocol: 'websocket',
    websocket: {
      url: 'ws://localhost:3000/ws-upload',
      reconnect: true,
      reconnectDelay: 3000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      binaryType: 'arraybuffer',
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
          Authorization: `Bearer ${authToken()}`,
        },
      };
    },
    onFilesRejected: (rejections: ValidationError[]) => {
      rejections.forEach((r) => {
        showNotification('File ' + r.file.name + ' rejected: ' + r.message, 'error');
      });
    },
    onUploadSuccess: (file: UploadFile) => {
      showNotification('Success: ' + file.metadata.name, 'success');
    },
    onUploadError: (file: UploadFile, error: Error) => {
      showNotification('Error: ' + file.file.name + ' - ' + error.message, 'error');
    },
    onAllComplete: (files: UploadFile[]) => {
      showNotification('[Complete] All ' + files.length + ' uploads finished!', 'success');
    },
  });

  const onDrop = async (e: DragEvent) => {
    setIsDragOver(false);
    await handleDrop(e);
  };

  return (
    <div>
      <header>
        <h1>Solid Uploader - WebSocket Example</h1>
        <p>Real-time streaming using the WebSocket protocol in SolidJS.</p>
      </header>

      <section>
        <h2>1. Input</h2>
        <div>
          <label>Authorization Token:</label>
          <input
            type="text"
            value={authToken()}
            onInput={(e) => setAuthToken(e.currentTarget.value)}
            placeholder="Enter 'verbpatch-secret-token'"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              'border-radius': '4px',
              'box-sizing': 'border-box',
            }}
          />
        </div>

        <div
          onDragOver={(e) => {
            handleDragOver(e);
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInput!.click()}
          style={{
            border: '2px dashed #ccc',
            padding: '40px',
            'text-align': 'center',
            cursor: 'pointer',
            'margin-bottom': '10px',
            background: isDragOver() ? '#f3e5f5' : 'transparent',
            'border-color': isDragOver() ? '#9c27b0' : '#ccc',
          }}
        >
          <strong>Drop files here</strong> or click to select
        </div>
        <input
          type="file"
          ref={fileInput!}
          multiple
          style={{ display: 'none' }}
          accept="application/pdf"
          onChange={(e) => e.currentTarget.files && addFiles(e.currentTarget.files)}
        />

        <div class="controls">
          <button onClick={() => uploadAll()}>Upload All</button>
          <button onClick={() => clearAll()}>Clear Queue</button>
        </div>
      </section>

      <section>
        <h2>2. File Queue & Progress</h2>
        <div id="file-list">
          <Show when={state.files.length > 0} fallback={<p>Queue is empty.</p>}>
            <For each={state.files}>
              {(file) => (
                <div class="file-item">
                  <div>
                    <strong>{file.metadata.name}</strong>
                  </div>
                  <div>Status: [{file.status.toUpperCase()}]</div>

                  <div>
                    {file.progress.percentage.toFixed(1)}%
                    <Show when={file.status === 'uploading'}>
                      • {formatBytes(file.progress.speed)}/s •{' '}
                      {formatTime(file.progress.timeRemaining)} left
                    </Show>
                  </div>
                  <div class="controls">
                    <Show when={file.status === 'uploading'}>
                      <button onClick={() => pauseUpload(file.id)}>Pause</button>
                      <button onClick={() => cancelUpload(file.id)}>Cancel</button>
                    </Show>
                    <Show when={file.status === 'paused'}>
                      <button onClick={() => resumeUpload(file.id)}>Resume</button>
                      <button onClick={() => cancelUpload(file.id)}>Cancel</button>
                    </Show>
                    <Show when={file.status === 'failed'}>
                      <button onClick={() => retryUpload(file.id)}>Retry</button>
                    </Show>
                    <Show when={file.status === 'pending' || file.status === 'queued'}>
                      <button onClick={() => uploadFile(file.id)}>Upload</button>
                    </Show>
                    <button onClick={() => removeFile(file.id)}>Remove</button>
                  </div>
                </div>
              )}
            </For>
          </Show>
        </div>
      </section>

      <section>
        <h2>3. Internal State (Reactive)</h2>
        <pre>
          {JSON.stringify(
            {
              protocol: 'WebSocket',
              isUploading: state.isUploading,
              totalProgress: state.totalProgress.percentage.toFixed(2) + '%',
              filesCount: state.files.length,
              uploading: state.uploadingFiles.length,
              completed: state.completedFiles.length,
              failed: state.failedFiles.length,
            },
            null,
            2,
          )}
        </pre>
      </section>

      <div class="notifications-container">
        <For each={notifications()}>
          {(n) => (
            <div class={`notification ${n.type}`}>
              <span>{n.message}</span>
              <button onClick={() => removeNotification(n.id)} class="close-btn">
                ×
              </button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
