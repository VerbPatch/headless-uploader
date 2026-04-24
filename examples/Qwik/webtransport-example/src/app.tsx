import { component$, useSignal, $, useStore, useVisibleTask$ } from '@builder.io/qwik';
import {
  useUploader,
  formatBytes,
  formatTime,
  type UploadFile,
  type ChunkInfo,
  type ValidationError,
} from '@verbpatch/qwik-uploader';

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

async function fetchWebTransportConfig() {
  try {
    const response = await fetch('https://nus.verbpatch.com/webtransport-config');
    if (response.ok) return await response.json();
  } catch (err) {
    // eslint-disable-next-line
    console.warn('WT config fetch failed:', err);
  }
  return null;
}

export const App = component$(() => {
  const authToken = useSignal('verbpatch-secret-token');
  const isDragOver = useSignal(false);
  const notifications = useStore<{ list: Notification[] }>({ list: [] });

  const removeNotification = $((id: number) => {
    notifications.list = notifications.list.filter((n) => n.id !== id);
  });

  const showNotification = $((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    notifications.list = [...notifications.list, { id, message, type }];
    setTimeout(() => removeNotification(id), 5000);
  });

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
    maxFileSize: 50 * 1024 * 1024,
    acceptedTypes: ['application/pdf'],
    chunkSize: 500 * 1024,
    maxConcurrent: 2,
    autoRetry: true,
    enablePreviews: false,

    onBeforeRequest: $(async (file: UploadFile, chunk?: ChunkInfo) => {
      // eslint-disable-next-line
      console.log(
        `[Auth] Preparing WT request for ${file.metadata.name}${chunk ? ` (Chunk ${chunk.index})` : ''}`,
      );
      return {
        headers: {
          Authorization: `Bearer ${authToken.value}`,
        },
      };
    }),
    onFilesRejected: $((rejections: ValidationError[]) => {
      rejections.forEach((err) => {
        showNotification(`${err.file.name}: ${err.message}`, 'error');
      });
    }),

    onUploadSuccess: $((file: UploadFile) => {
      showNotification(`File ${file.metadata.name} uploaded successfully!`, 'success');
    }),

    onUploadError: $((file: UploadFile, error: Error) => {
      showNotification(`Error uploading ${file.metadata.name}: ${error.message}`, 'error');
    }),

    onAllComplete: $((files: UploadFile[]) => {
      showNotification('[Complete] All ' + files.length + ' uploads finished!', 'success');
    }),
  });

  useVisibleTask$(async () => {
    const wtConfig = await fetchWebTransportConfig();
    if (wtConfig?.certHash) {
      await uploader.updateConfig({
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

  const state = uploader.state;

  return (
    <div>
      <header>
        <h1>Qwik Uploader - WEBTRANSPORT example</h1>
        <p>
          Low-latency streaming using the <strong>WebTransport protocol</strong> in Qwik.
        </p>
      </header>

      <section>
        <h2>1. Input</h2>
        <div>
          <label>Authorization Token:</label>
          <input
            type="text"
            value={authToken.value}
            onInput$={(e) => (authToken.value = (e.target as HTMLInputElement).value)}
            placeholder="Enter 'verbpatch-secret-token'"
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <p>The server requires 'verbpatch-secret-token' to allow uploads.</p>
        </div>

        <div
          id="drop-zone"
          onDragOver$={(e) => {
            e.preventDefault();
            uploader.handleDragOver(e);
            isDragOver.value = true;
          }}
          onDragLeave$={() => (isDragOver.value = false)}
          onDrop$={async (e) => {
            isDragOver.value = false;
            await uploader.handleDrop(e);
          }}
          onClick$={async (_, el) => {
            const input = el.nextElementSibling as HTMLInputElement;
            input.click();
          }}
          style={{
            border: '2px dashed #ccc',
            padding: '40px',
            textAlign: 'center',
            borderRadius: '8px',
            cursor: 'pointer',
            background: isDragOver.value ? '#fff3e0' : '#f9f9f9',
            borderColor: isDragOver.value ? '#ff5722' : '#ccc',
            transition: 'all 0.2s',
          }}
        >
          <strong>Drop files here</strong> or click to select
        </div>

        <input
          type="file"
          multiple
          style={{ display: 'none' }}
          accept="application/pdf"
          onChange$={async (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files) await uploader.addFiles(files);
          }}
        />

        <div class="controls">
          <button onClick$={async () => await uploader.uploadAll()}>Upload All</button>
          <button onClick$={async () => await uploader.clearAll()}>Clear Queue</button>
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
                <div>
                  {file.status === 'uploading' && (
                    <>
                      <button onClick$={async () => await uploader.pauseUpload(file.id)}>
                        Pause
                      </button>
                      <button onClick$={async () => await uploader.cancelUpload(file.id)}>
                        Cancel
                      </button>
                    </>
                  )}
                  {file.status === 'paused' && (
                    <>
                      <button onClick$={async () => await uploader.resumeUpload(file.id)}>
                        Resume
                      </button>
                      <button onClick$={async () => await uploader.cancelUpload(file.id)}>
                        Cancel
                      </button>
                    </>
                  )}
                  {file.status === 'failed' && (
                    <button onClick$={async () => await uploader.retryUpload(file.id)}>
                      Retry
                    </button>
                  )}
                  {(file.status === 'pending' || file.status === 'queued') && (
                    <button onClick$={async () => await uploader.uploadFile(file.id)}>
                      Upload
                    </button>
                  )}
                  <button onClick$={async () => await uploader.removeFile(file.id)}>Remove</button>
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
              protocol: 'WebTransport',
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
        {notifications.list.map((n) => (
          <div class={`notification ${n.type}`} key={n.id}>
            <span>{n.message}</span>
            <button onClick$={() => removeNotification(n.id)} class="close-btn">
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});
