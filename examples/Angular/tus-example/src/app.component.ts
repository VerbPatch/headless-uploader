import { Component, signal } from '@angular/core';
import {
  useUploader,
  formatBytes,
  formatTime,
  safeBase64,
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
export class AppComponent {
  authToken = signal('verbpatch-secret-token');
  formatBytes = formatBytes;
  formatTime = formatTime;

  uploader: UploaderInterface & { state: any };
  notifications = signal<Notification[]>([]);

  constructor() {
    this.uploader = useUploader({
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
      autoRetry: true,
      maxConcurrent: 2,
      enablePreviews: false,
      onBeforeRequest: async (file, chunk) => {
        // eslint-disable-next-line
        console.log(
          `[Auth] Preparing request for ${file.metadata.name}${chunk ? ` (Chunk ${chunk.index})` : ''}`,
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
    setTimeout(() => this.removeNotification(id), 5000);
  }

  removeNotification(id: number) {
    this.notifications.update((prev) => prev.filter((n) => n.id !== id));
  }

  stats() {
    const s = this.uploader.state();
    return JSON.stringify(
      {
        protocol: 'TUS',
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

  handleFileSelect(event: any) {
    const files = event.target.files;
    if (files) this.uploader.addFiles(files);
  }

  handleDrop(event: DragEvent) {
    this.uploader.handleDrop(event);
  }
}
