import { useState, useRef } from 'preact/hooks';
import {
  useUploader,
  createS3Adapter,
  formatBytes,
  formatTime,
  ValidationError,
  UploadFile,
} from '@verbpatch/preact-uploader';

export default function App() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: number; message: string; type: 'success' | 'error' | 'info' }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        showNotification('File ' + r.file.name + ' rejected: ' + r.message, 'error');
      });
    },
    onUploadSuccess: (file: UploadFile) => {
      showNotification(`Cloud Success: ${file.metadata.name}`, 'success');
    },
    onUploadError: (file: UploadFile, error: Error) => {
      showNotification(`Upload error for ${file.metadata.name}: ${error.message}`, 'error');
    },
    onAllComplete: (files: UploadFile[]) => {
      showNotification('[Complete] All cloud transfers finished!', 'success');
    },
  });

  return (
    <div>
      <header>
        <h1>Preact Uploader - Cloud Protocol</h1>
        <p>
          This example demonstrates direct-to-cloud (S3) uploads using the <strong>protocol: 'cloud'</strong> setting in Preact.
        </p>
      </header>

      <section id="configuration">
        <h2>1. Cloud Upload</h2>
        <p>Configured with <code>S3Adapter</code>. It requests a signed URL from the <code>uploader-server</code> and then uploads the file directly.</p>

        <div
          onDragOver={(e) => {
            handleDragOver(e as any);
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            setIsDragOver(false);
            handleDrop(e as any);
          }}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed #ccc',
            padding: '40px',
            textAlign: 'center',
            borderRadius: '8px',
            cursor: 'pointer',
            background: isDragOver ? '#e8f5e9' : '#f9f9f9',
            borderColor: isDragOver ? '#4caf50' : '#ccc',
            transition: 'all 0.2s',
          }}
        >
          <strong>Drop files here</strong> or click to select
        </div>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          style={{ display: 'none' }}
          onChange={(e: any) => e.target.files && addFiles(e.target.files)}
        />

        <div class="controls">
          <button onClick={() => uploadAll()} disabled={state.files.length === 0 || state.isUploading}>
             {state.isUploading ? 'Uploading...' : 'Start Cloud Upload'}
          </button>
          <button onClick={() => clearAll()}>Clear Queue</button>
        </div>
      </section>

      <section id="file-queue">
        <h2>2. Queue & Progress</h2>
        <div id="file-list">
          {state.files.length === 0 ? (
            <p>Queue is empty.</p>
          ) : (
            state.files.map((file) => (
              <div class="file-item" key={file.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                   {file.preview && (
                       <img src={file.preview} alt="preview" style={{ borderRadius: '4px', border: '1px solid #eee', width: '60px', height: '60px', objectFit: 'cover' }} />
                   )}
                   <div>
                        <strong>{file.metadata.name}</strong> ({formatBytes(file.metadata.size)})
                        <div>Status: <span class={`status-${file.status}`}>{file.status.toUpperCase()}</span></div>
                   </div>
                </div>

                <div style={{ marginTop: '10px' }}>
                  <div style={{ height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${file.progress.percentage}%`, height: '100%', background: '#4caf50', transition: 'width 0.3s' }}></div>
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                     <span>{file.progress.percentage.toFixed(1)}% uploaded</span>
                     {file.status === 'uploading' && (
                         <span>{formatBytes(file.progress.speed)}/s • {formatTime(file.progress.timeRemaining)} left</span>
                     )}
                  </div>
                </div>

                <div class="controls" style={{ marginTop: '10px' }}>
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
