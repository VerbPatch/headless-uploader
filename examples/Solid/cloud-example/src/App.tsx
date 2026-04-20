import { createSignal, Show, For } from 'solid-js';
import {
  useUploader,
  createS3Adapter,
  formatBytes,
  formatTime,
  ValidationError,
  UploadFile,
} from '@verbpatch/solid-uploader';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

export default function App() {
  const [isDragOver, setIsDragOver] = createSignal(false);
  const [notifications, setNotifications] = createSignal<Notification[]>([]);
  // eslint-disable-next-line no-unassigned-vars
  let fileInput: HTMLInputElement | undefined;

  const showNotification = (message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  /**
   * Fetch S3 Presigned URL from local uploader-server
   */
  const getS3PresignedUrl = async (file: UploadFile) => {
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
    protocol: 'cloud',
    cloudAdapter: createS3Adapter({
      getUploadUrl: getS3PresignedUrl,
    }),
    maxFiles: 5,
    maxFileSize: 100 * 1024 * 1024,
    autoUpload: false,
    enablePreviews: true,
    onFilesRejected: (rejections: ValidationError[]) => {
      rejections.forEach((r) => {
        showNotification(`Rejected: ${r.file.name} - ${r.message}`, 'error');
      });
    },
    onUploadSuccess: (file: UploadFile) => {
      showNotification(`Cloud Success: ${file.metadata.name}`, 'success');
    },
    onUploadError: (file: UploadFile, error: Error) => {
      showNotification(`Upload error for ${file.metadata.name}: ${error.message}`, 'error');
    },
    onAllComplete: () => {
      showNotification('[Complete] All cloud transfers finished!', 'success');
    },
  });

  const onDrop = async (e: DragEvent) => {
    setIsDragOver(false);
    await handleDrop(e);
  };

  return (
    <div>
      <header>
        <h1>Solid Uploader - Cloud Protocol</h1>
        <p>
          This example demonstrates direct-to-cloud (S3) uploads using the{' '}
          <strong>protocol: 'cloud'</strong> setting in SolidJS.
        </p>
      </header>

      <section>
        <h2>1. Cloud Upload</h2>
        <p>
          Configured with <code>S3Adapter</code>. It requests a signed URL from the{' '}
          <code>uploader-server</code> and then uploads the file directly.
        </p>

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
            background: isDragOver() ? '#f1f8e9' : 'transparent',
            'border-color': isDragOver() ? '#4caf50' : '#ccc',
          }}
        >
          <strong>Drop files here</strong> or click to select
        </div>
        <input
          type="file"
          ref={fileInput!}
          multiple
          style={{ display: 'none' }}
          onChange={(e) => e.currentTarget.files && addFiles(e.currentTarget.files)}
        />

        <div class="controls">
          <button
            onClick={() => uploadAll()}
            disabled={state.files.length === 0 || state.isUploading}
          >
            {state.isUploading ? 'Uploading...' : 'Start Cloud Upload'}
          </button>
          <button onClick={() => clearAll()}>Clear Queue</button>
        </div>
      </section>

      <section>
        <h2>2. Queue & Progress</h2>
        <div id="file-list">
          <Show when={state.files.length > 0} fallback={<p>Queue is empty.</p>}>
            <For each={state.files}>
              {(file) => (
                <div class="file-item">
                  <div style={{ display: 'flex', 'align-items': 'center', gap: '15px' }}>
                    <Show when={file.preview}>
                      <img
                        src={file.preview}
                        alt="preview"
                        style={{
                          'border-radius': '4px',
                          border: '1px solid #eee',
                          width: '60px',
                          height: '60px',
                          'object-fit': 'cover',
                        }}
                      />
                    </Show>
                    <div>
                      <strong>{file.metadata.name}</strong> ({formatBytes(file.metadata.size)})
                      <div>
                        Status:{' '}
                        <span class={`status-${file.status}`}>{file.status.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ 'margin-top': '10px' }}>
                    <div
                      style={{
                        height: '8px',
                        background: '#eee',
                        'border-radius': '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${file.progress.percentage}%`,
                          height: '100%',
                          background: '#4caf50',
                          transition: 'width 0.3s',
                        }}
                      ></div>
                    </div>
                    <div
                      style={{
                        'font-size': '12px',
                        'margin-top': '4px',
                        display: 'flex',
                        'justify-content': 'space-between',
                      }}
                    >
                      <span>{file.progress.percentage.toFixed(1)}% uploaded</span>
                      <Show when={file.status === 'uploading'}>
                        <span>
                          {formatBytes(file.progress.speed)}/s •{' '}
                          {formatTime(file.progress.timeRemaining)} left
                        </span>
                      </Show>
                    </div>
                  </div>

                  <div class="controls" style={{ 'margin-top': '10px' }}>
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
        <h2>3. Instance State</h2>
        <pre>
          {JSON.stringify(
            {
              activeProtocol: 'cloud',
              adapter: 'S3Adapter',
              isUploading: state.isUploading,
              totalProgress: state.totalProgress.percentage.toFixed(2) + '%',
              filesCount: state.files.length,
            },
            null,
            2,
          )}
        </pre>
      </section>

      <div class="notifications-container">
        <For each={notifications()}>
          {(notification) => (
            <div class={`notification ${notification.type}`}>
              <span>{notification.message}</span>
              <button onClick={() => removeNotification(notification.id)} class="close-btn">
                ×
              </button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
