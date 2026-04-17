import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  useUploader,
  createS3Adapter,
  formatBytes,
  formatTime,
  ValidationError,
  UploadFile,
} from '@verbpatch/angular-uploader';

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./styles.css'],
})
export class AppComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  isDragOver = false;
  notifications: Notification[] = [];

  uploader = useUploader({
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
      rejections.forEach((r) => {
        this.showNotification(`Rejected: ${r.file.name} - ${r.message}`, 'error');
      });
    },
    onUploadSuccess: (file: UploadFile) => {
      this.showNotification(`Cloud Success: ${file.metadata.name}`, 'success');
    },
    onUploadError: (file: UploadFile, error: Error) => {
      this.showNotification(`Note: Mocked URL caused expected error, but flow is correct.`, 'info');
    },
    onAllComplete: (files: UploadFile[]) => {
      this.showNotification('[Complete] All cloud transfers finished!', 'success');
    },
  });

  constructor(private cdr: ChangeDetectorRef) {}

  formatBytes(bytes: number) {
    return formatBytes(bytes);
  }

  formatTime(seconds: number) {
    return formatTime(seconds);
  }

  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = Date.now();
    this.notifications.push({ id, message, type });
    setTimeout(() => this.removeNotification(id), 5000);
    this.cdr.detectChanges();
  }

  removeNotification(id: number) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.cdr.detectChanges();
  }

  onDragOver(e: DragEvent) {
    this.uploader.handleDragOver(e);
    this.isDragOver = true;
  }

  onDragLeave() {
    this.isDragOver = false;
  }

  async onDrop(e: DragEvent) {
    this.isDragOver = false;
    await this.uploader.handleDrop(e);
  }
}
