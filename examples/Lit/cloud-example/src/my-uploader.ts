import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import {
  useUploader,
  createS3Adapter,
  formatBytes,
  formatTime,
  ValidationError,
  UploadFile,
} from '@verbpatch/lit-uploader';

@customElement('my-uploader')
export class MyUploader extends LitElement {
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
    protocol: 'cloud',
    cloudAdapter: createS3Adapter({
      getUploadUrl: async (file) => {
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
      },
    }),
    maxFiles: 5,
    autoUpload: false,
    enablePreviews: true,

    onFilesRejected: (rejections: ValidationError[]) => {
      rejections.forEach((err) => {
        this.showNotification(`File rejected: ${err.file.name}. Reason: ${err.message}`, 'error');
      });
    },

    onUploadSuccess: (file: UploadFile) => {
      this.showNotification(`Cloud Upload Success: ${file.metadata.name}`, 'success');
    },

    onUploadError: (file: UploadFile, error: Error) => {
      this.showNotification(`Upload error for ${file.metadata.name}: ${error.message}`, 'error');
    },

    onAllComplete: () => {
      this.showNotification('[Complete] All cloud transfers finished!', 'success');
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
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 8px;
    }

    .progress-bar-container {
      height: 8px;
      background: #eee;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 10px;
    }

    .progress-fg {
      background: #4caf50;
      height: 100%;
      transition: width 0.3s;
    }

    .controls {
      margin-top: 10px;
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
      transition: all 0.2s;
    }

    #drop-zone.drag-over {
      background: #f1f8e9;
      border-color: #4caf50;
    }

    .preview-img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #eee;
    }

    .status-text {
      font-weight: bold;
    }
  `;

  render() {
    const s = this.uploader.state;
    return html`
      <header>
        <h1>Lit Uploader - Cloud Protocol</h1>
        <p>Direct-to-cloud (S3) uploads using <strong>protocol: 'cloud'</strong> in Lit.</p>
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
        <h2>1. Cloud Upload</h2>
        <p>
          Configured with <code>S3Adapter</code>. It requests a signed URL from the
          <code>uploader-server</code> and then uploads the file directly.
        </p>

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
          @change=${(e: any) => e.target.files && this.uploader.uploader.addFiles(e.target.files)}
        />

        <div class="controls">
          <button
            @click=${() => this.uploader.uploader.uploadAll()}
            ?disabled=${s.files.length === 0 || s.isUploading}
          >
            ${s.isUploading ? 'Uploading...' : 'Start Cloud Upload'}
          </button>
          <button @click=${() => this.uploader.uploader.clearAll()}>Clear Queue</button>
        </div>
      </section>

      <section id="file-queue">
        <h2>2. Queue & Progress</h2>
        <div id="file-list">
          ${s.files.length === 0
            ? html`<p>Queue is empty.</p>`
            : s.files.map(
                (file) => html`
                  <div class="file-item">
                    <div style="display: flex; align-items: center; gap: 15px">
                      ${file.preview
                        ? html`<img src="${file.preview}" alt="preview" class="preview-img" />`
                        : ''}
                      <div>
                        <strong>${file.metadata.name}</strong> (${formatBytes(file.metadata.size)})
                        <div>
                          Status: <span class="status-text">${file.status.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div class="progress-bar-container">
                      <div class="progress-fg" style="width: ${file.progress.percentage}%"></div>
                    </div>
                    <div
                      style="font-size: 12px; margin-top: 4px; display: flex; justify-content: space-between"
                    >
                      <span>${file.progress.percentage.toFixed(1)}% uploaded</span>
                      ${file.status === 'uploading'
                        ? html`<span
                            >${formatBytes(file.progress.speed)}/s •
                            ${formatTime(file.progress.timeRemaining)} left</span
                          >`
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
        <h2>3. Instance State</h2>
        <pre>
${JSON.stringify(
            {
              activeProtocol: 'cloud',
              adapter: 'S3Adapter',
              isUploading: s.isUploading,
              totalProgress: s.totalProgress.percentage.toFixed(2) + '%',
              filesCount: s.files.length,
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
