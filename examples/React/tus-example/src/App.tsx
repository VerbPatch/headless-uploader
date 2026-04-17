import { useState, useRef } from 'react';
import {
  useUploader,
  formatBytes,
  formatTime,
  safeBase64,
  ValidationError,
  UploadFile,
} from '@verbpatch/react-uploader';

export default function App() {
  const [authToken, setAuthToken] = useState('verbpatch-secret-token');
  const [isDragOver, setIsDragOver] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: number; message: string; type: 'success' | 'error' | 'info' }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
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
    maxFileSize: 50 * 1024 * 1024, // 50MB
    acceptedTypes: ['application/pdf'],
    chunkSize: 500 * 1024,
    maxConcurrent: 2,
    autoRetry: true,
    enablePreviews: false,

    onBeforeRequest: async (file, chunk) => {
      // eslint-disable-next-line
      console.log(
        `[Auth] Preparing request for ${file.metadata.name}${chunk ? ` (Chunk ${chunk.index})` : ''}`,
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
      showNotification(`Success: ${file.metadata.name}`, 'success');
    },
    onUploadError: (file: UploadFile, error: Error) => {
      showNotification(`Error: ${file.metadata.name} - ${error.message}`, 'error');
    },

    onAllComplete: (files: UploadFile[]) => {
      showNotification('[Complete] All ' + files.length + ' uploads finished!', 'success');
    },
  });

  const onDrop = async (e: React.DragEvent) => {
    setIsDragOver(false);
    await handleDrop(e as any);
  };

  return (
    <div>
      <header>
        <h1>React Uploader - TUS example</h1>
        <p>
          This example demonstrates the <strong>TUS protocol</strong> in React.
        </p>
      </header>

      <section id="configuration">
        <h2>1. Input</h2>
        <div>
          <label>Authorization Token:</label>
          <input
            type="text"
            value={authToken}
            onChange={(e) => setAuthToken(e.target.value)}
            placeholder="Enter 'verbpatch-secret-token'"
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>

        <div
          id="drop-zone"
          onDragOver={(e) => {
            handleDragOver(e as any);
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed #ccc',
            padding: '40px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '10px',
            background: isDragOver ? '#e1f5fe' : 'transparent',
            borderColor: isDragOver ? '#03a9f4' : '#ccc',
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
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />

        <div className="controls">
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
              <div className="file-item" key={file.id}>
                <div>
                  <strong>{file.metadata.name}</strong> ({formatBytes(file.metadata.size)})
                </div>
                <div>
                  Status: [{file.status.toUpperCase()}] • {formatBytes(file.progress.loaded)}{' '}
                  uploaded
                </div>

                <div>
                  {file.progress.percentage.toFixed(1)}%
                  {file.status === 'uploading' &&
                    ` • ${formatBytes(file.progress.speed)}/s • ${formatTime(file.progress.timeRemaining)} left`}
                </div>
                <div className="controls">
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
        <h2>3. Internal State (Reactive)</h2>
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

      <div className="notifications-container">
        {notifications.map((n) => (
          <div className={`notification ${n.type}`} key={n.id}>
            <span>{n.message}</span>
            <button onClick={() => removeNotification(n.id)} className="close-btn">
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
