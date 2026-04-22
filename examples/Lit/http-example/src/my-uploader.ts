import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import {
  useUploader,
  formatBytes,
  formatTime,
  ValidationError,
  UploadFile,
} from '@verbpatch/lit-uploader';

@customElement('my-uploader')
export class MyUploader extends LitElement {
  @state()
  private authToken = 'verbpatch-secret-token';

  @state()
  private isDragOver = false;

  @state()
  private notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }> = [];

  @query('#file-input')
  private fileInput!: HTMLInputElement;

  private uploader = useUploader(this, {
    protocol: 'http',
    http: {
      endpoint: 'https://nus.verbpatch.com/upload',
      method: 'POST',
      enableChunking: true,
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
          Authorization: `Bearer ${this.authToken}`,
        },
      };
    },

    onFilesRejected: (rejections: ValidationError[]) => {
      rejections.forEach((err) => {
        this.showNotification(`File rejected: ${err.file.name}. Reason: ${err.message}`, 'error');
      });
    },

    onUploadSuccess: (file: UploadFile) => {
      this.showNotification(`File uploaded successfully: ${file.metadata.name}`, 'success');
    },

    onUploadError: (file: UploadFile, error: Error) => {
      this.showNotification(`Error uploading ${file.metadata.name}: ${error.message}`, 'error');
    },

    onAllComplete: (files: UploadFile[]) => {
      this.showNotification('[Complete] All ' + files.length + ' uploads finished!', 'success');
    },
  });

  private showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = Math.random().toString(36).substring(7);
    this.notifications = [...this.notifications, { id, message, type }];
    setTimeout(() => this.removeNotification(id), 5000);
  }

  private removeNotification(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }

  static styles = css`
    :host {
      font-family: monospace;
      padding: 20px;
      line-height: 1.5;
      color: #333;
    }

    h1,
    h2 {
      border-bottom: 1px solid #ccc;
      padding-bottom: 5px;
    }

    section {
      margin-bottom: 30px;
      border: 1px solid #eee;
      padding: 15px;
    }

    .file-item {
      border: 1px solid #ddd;
      padding: 10px;
      margin-bottom: 10px;
    }

    .progress-bg {
      background: #eee;
      width: 100%;
      height: 10px;
      margin: 5px 0;
    }

    .progress-fg {
      background: #4caf50;
      height: 100%;
      transition: width 0.2s;
    }

    .controls {
      margin: 10px 0;
      display: flex;
      gap: 10px;
    }

    pre {
      background: #f4f4f4;
      padding: 10px;
      overflow: auto;
      font-size: 12px;
    }

    .notifications-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 1000;
    }

    .notification {
      background: #fff;
      padding: 12px 20px;
      border: 0 none;
      border-bottom: 2px solid;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 250px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease-out;
      max-width: 300px;
    }

    .notification.success {
      border-color: #4caf50;
    }

    .notification.error {
      border-color: #f44336;
    }

    .notification.info {
      border-color: #333;
    }

    .notification .close-btn {
      margin-left: 15px;
      cursor: pointer;
      font-weight: bold;
      font-size: 18px;
      border: 0 none;
      background: transparent;
    }

    .notification .close-btn:hover {
      background: #000;
      color: #fff;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }

      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    #drop-zone {
      border: 2px dashed #ccc;
      padding: 40px;
      text-align: center;
      cursor: pointer;
      margin-bottom: 10px;
    }

    #drop-zone.drag-over {
      background: #e1f5fe;
      border-color: #03a9f4;
    }
  `;

  render() {
    const s = this.uploader.state;
    return html`
      <header>
        <h1>Lit Uploader - HTTP example</h1>
        <p>This example demonstrates the <strong>headless</strong> nature of the library in Lit.</p>
      </header>

      <div class="notifications-container">
        ${this.notifications.map(
          (n) => html`
            <div class="notification ${n.type}">
              <span>${n.message}</span>
              <span class="close-btn" @click=${() => this.removeNotification(n.id)}>×</span>
            </div>
          `,
        )}
      </div>

      <section id="configuration">
        <h2>1. Input</h2>
        <div>
          <label>Authorization Token:</label>
          <input
            type="text"
            .value=${this.authToken}
            @input=${(e: any) => (this.authToken = e.target.value)}
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
          />
        </div>

        <div
          id="drop-zone"
          class=${this.isDragOver ? 'drag-over' : ''}
          @dragover=${(e: DragEvent) => {
            e.preventDefault();
            this.isDragOver = true;
          }}
          @dragleave=${() => (this.isDragOver = false)}
          @drop=${this.onDrop}
          @click=${() => this.fileInput.click()}
        >
          <strong>Drop files here</strong> or click to select
        </div>
        <input
          id="file-input"
          type="file"
          multiple
          style="display:none"
          accept="application/pdf"
          @change=${(e: any) => e.target.files && this.uploader.uploader.addFiles(e.target.files)}
        />

        <div>
          <button @click=${() => this.uploader.uploader.uploadAll()}>Upload All</button>
          <button @click=${() => this.uploader.uploader.clearAll()}>Clear Queue</button>
        </div>
      </section>

      <section id="file-queue">
        <h2>2. File Queue & Progress</h2>
        <div id="file-list">
          ${s.files.length === 0
            ? html`<p>Queue is empty.</p>`
            : s.files.map(
                (file) => html`
                  <div class="file-item">
                    <div>
                      <strong>${file.metadata.name}</strong> (${formatBytes(file.metadata.size)})
                    </div>
                    <div>
                      Status: [${file.status.toUpperCase()}] • ${formatBytes(file.progress.loaded)}
                      uploaded
                    </div>

                    <div>
                      ${file.progress.percentage.toFixed(1)}%
                      ${file.status === 'uploading'
                        ? html`• ${formatBytes(file.progress.speed)}/s •
                          ${formatTime(file.progress.timeRemaining)} left`
                        : ''}
                    </div>
                    <div class="controls">
                      ${file.status === 'uploading'
                        ? html`
                            <button @click=${() => this.uploader.uploader.pauseUpload(file.id)}>
                              Pause
                            </button>
                            <button @click=${() => this.uploader.uploader.cancelUpload(file.id)}>
                              Cancel
                            </button>
                          `
                        : ''}
                      ${file.status === 'paused'
                        ? html`
                            <button @click=${() => this.uploader.uploader.resumeUpload(file.id)}>
                              Resume
                            </button>
                            <button @click=${() => this.uploader.uploader.cancelUpload(file.id)}>
                              Cancel
                            </button>
                          `
                        : ''}
                      ${file.status === 'failed'
                        ? html`<button @click=${() => this.uploader.uploader.retryUpload(file.id)}>
                            Retry
                          </button>`
                        : ''}
                      ${file.status === 'pending' || file.status === 'queued'
                        ? html`<button @click=${() => this.uploader.uploader.uploadFile(file.id)}>
                            Upload
                          </button>`
                        : ''}
                      <button @click=${() => this.uploader.uploader.removeFile(file.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                `,
              )}
        </div>
      </section>

      <section id="uploader-state">
        <h2>3. Internal State</h2>
        <pre>
${JSON.stringify(
            {
              protocol: 'HTTP',
              isUploading: s.isUploading,
              totalProgress: s.totalProgress.percentage.toFixed(2) + '%',
              filesCount: s.files.length,
              uploading: s.uploadingFiles.length,
              completed: s.completedFiles.length,
              failed: s.failedFiles.length,
            },
            null,
            2,
          )}</pre
        >
      </section>
    `;
  }

  private async onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragOver = false;
    await this.uploader.uploader.handleDrop(e);
  }
}
