import { useState, useRef } from 'preact/hooks';
import {
  useUploader,
  formatBytes,
  formatTime,
  safeBase64,
  ValidationError,
  UploadFile,
} from '@verbpatch/preact-uploader';

export default function App() {
  const [authToken, setAuthToken] = useState('verbpatch-secret-token');
  const [notifications, setNotifications] = useState<
    { id: number; message: string; type: 'success' | 'error' | 'info' }[]
  >([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: number) => {
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
    protocol: 'tus',
    tus: {
      endpoint: 'http://localhost:3000/tus',
      metadata: {
        uploadType: safeBase64('headless-demo'),
      },
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
          Authorization: `Bearer ${authToken}`,
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

  return (
    <div>
      <header>
        <h1>Preact Uploader - TUS example</h1>
        <p>
          This example demonstrates the <strong>TUS protocol</strong> in Preact.
        </p>
      </header>

      <section id="configuration">
        <h2>1. Input</h2>
        <div>
          <label>Authorization Token:</label>
          <input
            type="text"
            value={authToken}
            onChange={(e: any) => setAuthToken(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <p>
            The server requires 'verbpatch-secret-token' to allow uploads. Try changing it to see
            auth failure.
          </p>
        </div>

        <div
          onDragOver={(e) => {
            handleDragOver(e);
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            setIsDragOver(false);
            handleDrop(e);
          }}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed #ccc',
            padding: '40px',
            textAlign: 'center',
            borderRadius: '8px',
            cursor: 'pointer',
            background: isDragOver ? '#e3f2fd' : '#f9f9f9',
            borderColor: isDragOver ? '#2196f3' : '#ccc',
          }}
        >
          <strong>Drop files here</strong> or click to select
        </div>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          style={{ display: 'none' }}
          accept="application/pdf"
          onChange={(e: any) => e.target.files && addFiles(e.target.files)}
        />

        <div>
          <button onClick={() => uploadAll()}>Upload All</button>
          <button onClick={() => clearAll()}>Clear Queue</button>
        </div>
      </section>

      <section id="file-queue">
        <h2>2. File Queue & Progress</h2>
        <div id="file-list">
          {state.files.length === 0 ? (
            <p>Queue is empty.</p>
          ) : (
            state.files.map((file) => (
              <div class="file-item" key={file.id}>
                <div>
                  <strong>{file.metadata.name}</strong>
                </div>
                <div>Status: [{file.status.toUpperCase()}]</div>

                <div>
                  {file.progress.percentage.toFixed(1)}%
                  {file.status === 'uploading' &&
                    ` • ${formatBytes(file.progress.speed)}/s • ${formatTime(file.progress.timeRemaining)} left`}
                </div>
                <div class="controls">
                  {file.status === 'uploading' && (
                    <>
                      <button onClick={() => pauseUpload(file.id)}>Pause</button>
                      <button onClick={() => cancelUpload(file.id)}>Cancel</button>
                    </>
                  )}
                  {file.status === 'paused' && (
                    <>
                      <button onClick={() => resumeUpload(file.id)}>Resume</button>
                      <button onClick={() => cancelUpload(file.id)}>Cancel</button>
                    </>
                  )}
                  {file.status === 'failed' && (
                    <button onClick={() => retryUpload(file.id)}>Retry</button>
                  )}
                  {(file.status === 'pending' || file.status === 'queued') && (
                    <button onClick={() => uploadFile(file.id)}>Upload</button>
                  )}
                  <button onClick={() => removeFile(file.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section id="uploader-state">
        <h2>3. Internal State</h2>
        <pre>
          {JSON.stringify(
            {
              protocol: 'TUS',
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
        {notifications.map((notification) => (
          <div class={`notification ${notification.type}`} key={notification.id}>
            <span>{notification.message}</span>
            <button onClick={() => removeNotification(notification.id)} class="close-btn">
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
