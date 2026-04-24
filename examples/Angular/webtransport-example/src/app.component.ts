import { Component, signal, OnInit } from '@angular/core';
import {
  useUploader,
  formatBytes,
  formatTime,
  ValidationError,
  UploadFile,
  UploaderInterface,
} from '@verbpatch/angular-uploader';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: `./app.html`,
})
export class AppComponent implements OnInit {
  authToken = signal('verbpatch-secret-token');
  formatBytes = formatBytes;
  formatTime = formatTime;

  uploader: UploaderInterface & { state: any };
  notifications = signal<Notification[]>([]);

  constructor() {
    this.uploader = useUploader({
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

      onBeforeRequest: async (file, chunk) => {
        // eslint-disable-next-line
        console.log(
          `[Auth] Preparing WT request for ${file.metadata.name}${chunk ? ` (Chunk ${chunk.index})` : ''}`,
        );
        return {
          headers: {
            Authorization: `Bearer ${this.authToken()}`,
          },
        };
      },

      onFilesRejected: (rejections: ValidationError[]) => {
        rejections.forEach((r: ValidationError) => {
          this.showNotification(`File ${r.file.name} rejected: ${r.message}`, 'error');
        });
      },
      onAllComplete: (files: UploadFile[]) => {
        this.showNotification('[Complete] All ' + files.length + ' uploads finished!', 'success');
      },
      onUploadSuccess: (file: UploadFile) => {
        this.showNotification(`File ${file.metadata.name} uploaded successfully!`, 'success');
      },
      onUploadError: (file: UploadFile, error: Error) => {
        this.showNotification(`Error uploading ${file.metadata.name}: ${error.message}`, 'error');
      },
    });
  }

  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = Date.now();
    this.notifications.update((prev) => [...prev, { id, message, type }]);
  }

  removeNotification(id: number) {
    this.notifications.update((prev) => prev.filter((n) => n.id !== id));
  }

  stats() {
    const s = this.uploader.state();
    return JSON.stringify(
      {
        protocol: 'WebTransport',
        isUploading: s.isUploading,
        totalProgress: s.totalProgress.percentage.toFixed(2) + '%',
        filesCount: s.files.length,
        uploading: s.uploadingFiles.length,
        completed: s.completedFiles.length,
        failed: s.failedFiles.length,
      },
      null,
      2,
    );
  }

  async ngOnInit() {
    const wtConfig = await this.fetchWebTransportConfig();
    if (wtConfig?.certHash) {
      this.uploader.updateConfig({
        chunkSize: 500 * 1024,
        webtransport: {
          url: 'https://127.0.0.1:443/wt-upload',
          bidirectionalStreams: true,
          congestionControl: 'throughput',
          allowPooling: true,
          serverCertificateHashes: [
            {
              algorithm: 'sha-256',
              value: new Uint8Array(wtConfig.certHash),
            },
          ],
        },
      });
    }
  }

  async fetchWebTransportConfig() {
    try {
      const response = await fetch('https://nus.verbpatch.com/webtransport-config');
      if (response.ok) return await response.json();
    } catch (err) {
      console.warn('WT config fetch failed:', err);
    }
    return null;
  }

  handleFileSelect(event: any) {
    const files = event.target.files;
    if (files) this.uploader.addFiles(files);
  }

  handleDrop(event: DragEvent) {
    this.uploader.handleDrop(event);
  }
}
