# 📤 Headless File Uploader

A powerful, flexible, and completely headless file uploader library. Built with TypeScript, zero dependencies, and designed to work with any UI framework or design system.

## ✨ Features

- 🎯 **Completely Headless** - No UI components, just logic and data
- 📁 **Multi-File Upload** - Handle single or multiple files simultaneously
- 🎨 **Framework Agnostic** - Works with any CSS framework or component library
- 🔄 **Drag & Drop** - Built-in drag and drop support
- 📊 **Real-time Progress** - Track upload progress with speed and time estimates
- 🧩 **Chunked Upload** - Split large files into chunks with concurrent uploading
- ⏸️ **Pause & Resume** - Pause and resume uploads at any time
- 🔁 **Auto Retry** - Automatic retry with exponential backoff
- 🖼️ **Preview Generation** - Automatic preview for images and videos
- 📋 **Metadata Extraction** - Extract file metadata, dimensions, duration
- ☁️ **Cloud Integration** - Adapter pattern for AWS S3, Google Cloud, Azure, etc.
- 🗜️ **Compression** - Optional image compression before upload
- ✅ **Validation** - File type, size, and custom validation
- 🎭 **TypeScript First** - Full type safety and IntelliSense support
- 🌳 **Tree Shakeable** - Import only what you need
- 📦 **Zero Dependencies** - Completely self-contained

## 🚀 Installation

```bash
npm install @VerbPatch/headless-uploader
# or
yarn add @VerbPatch/headless-uploader
# or
pnpm add @VerbPatch/headless-uploader
```

## 📖 Quick Start

### Basic Usage (Vanilla JS/TS)

```typescript
import { useUploader } from "@VerbPatch/headless-uploader";

const uploader = useUploader({
  endpoint: "/api/upload",
  maxFiles: 10,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  acceptedTypes: ["image/*", ".pdf", ".docx"],

  onUploadProgress: (file, progress) => {
    console.log(`${file.metadata.name}: ${progress.percentage}%`);
  },

  onUploadComplete: (file) => {
    console.log("✅ Upload complete:", file.metadata.name);
  },
});

// Add files from input
const input = document.querySelector('input[type="file"]');
input.addEventListener("change", async (e) => {
  await uploader.handleFileSelect(e);
});

// Or add files programmatically
await uploader.addFiles(fileList);

// Upload all files
await uploader.uploadAll();
```

### With Drag & Drop

```typescript
const dropZone = document.querySelector(".drop-zone");

dropZone.addEventListener("dragover", (e) => {
  uploader.handleDragOver(e);
  dropZone.classList.add("dragging");
});

dropZone.addEventListener("drop", async (e) => {
  await uploader.handleDrop(e);
  dropZone.classList.remove("dragging");
});
```

## ✅ File Type Validation

The uploader supports **ANY file type** with flexible validation options:

### Accept All Files (No Restrictions)

```typescript
const uploader = useUploader({
  endpoint: "/api/upload",
  // No acceptedTypes = accept all file types
});
```

### Accept by MIME Type

```typescript
const uploader = useUploader({
  acceptedTypes: [
    "image/jpeg", // Exact MIME type
    "image/png",
    "application/pdf",
  ],
});
```

### Accept by Wildcard

```typescript
const uploader = useUploader({
  acceptedTypes: [
    "image/*", // All images
    "video/*", // All videos
    "audio/*", // All audio
    "text/*", // All text files
  ],
});
```

### Accept by File Extension

```typescript
const uploader = useUploader({
  acceptedTypes: [".jpg", ".png", ".pdf", ".docx", ".zip"],
});
```

### Use Built-in Presets

```typescript
import { useUploader, FileTypePresets } from "@VerbPatch/headless-uploader";

// Images only
const uploader = useUploader({
  acceptedTypes: FileTypePresets.IMAGES_COMMON,
  // ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
});

// Documents only
const uploader = useUploader({
  acceptedTypes: FileTypePresets.DOCUMENTS,
  // Includes PDF, Word, Excel, PowerPoint, text, CSV
});

// Videos only
const uploader = useUploader({
  acceptedTypes: FileTypePresets.VIDEOS_COMMON,
  // ['video/mp4', 'video/webm', 'video/ogg']
});

// Safe files (no executables)
const uploader = useUploader({
  acceptedTypes: FileTypePresets.SAFE_FILES,
  // Images, videos, audio, documents, archives - no .exe, .bat, etc.
});
```

### Available Presets

- `IMAGES` - All image types (`image/*`)
- `IMAGES_COMMON` - JPEG, PNG, GIF, WebP
- `IMAGES_ALL` - All common image formats including SVG, BMP, TIFF
- `VIDEOS` - All video types (`video/*`)
- `VIDEOS_COMMON` - MP4, WebM, OGG
- `VIDEOS_ALL` - All common video formats
- `AUDIO` - All audio types (`audio/*`)
- `AUDIO_COMMON` - MP3, WAV, OGG
- `AUDIO_ALL` - All common audio formats
- `DOCUMENTS` - PDF, Word, Excel, PowerPoint, text, CSV
- `PDF` - PDF files only
- `WORD` - Word documents (.doc, .docx)
- `EXCEL` - Excel files (.xls, .xlsx)
- `POWERPOINT` - PowerPoint files (.ppt, .pptx)
- `ARCHIVES` - ZIP, RAR, 7z, TAR, GZ
- `CODE` - JavaScript, TypeScript, Python, Java, C++, etc.
- `TEXT` - All text files
- `ALL_MEDIA` - Images, videos, and audio
- `SAFE_FILES` - Everything except executables

### Mix Multiple Types

```typescript
const uploader = useUploader({
  acceptedTypes: [
    "image/*", // All images
    "video/mp4", // Specific video format
    ".pdf", // PDF by extension
    "application/zip", // ZIP files
  ],
});

// Or combine presets
const uploader = useUploader({
  acceptedTypes: [...FileTypePresets.IMAGES, ...FileTypePresets.DOCUMENTS],
});
```

```typescript
interface UploaderConfig {
  // Upload endpoint
  endpoint?: string; // Default: '/upload'
  method?: "POST" | "PUT" | "PATCH"; // Default: 'POST'
  headers?: Record<string, string>;
  withCredentials?: boolean; // Default: false

  // File constraints
  maxFiles?: number; // Default: 10
  maxFileSize?: number; // Default: 10MB
  minFileSize?: number; // Default: 0
  acceptedTypes?: string[]; // MIME types or extensions
  allowDuplicates?: boolean; // Default: true

  // Chunking
  enableChunking?: boolean; // Default: false
  chunkSize?: number; // Default: 1MB
  maxConcurrentChunks?: number; // Default: 3

  // Upload behavior
  autoUpload?: boolean; // Default: false
  maxConcurrent?: number; // Default: 3
  enableResumable?: boolean; // Default: false

  // Retry configuration
  autoRetry?: boolean; // Default: true
  retryConfig?: {
    maxRetries: number; // Default: 3
    retryDelay: number; // Default: 1000ms
    retryDelayMultiplier: number; // Default: 2
    retryableStatuses: number[]; // Default: [408, 429, 500, 502, 503, 504]
  };

  // Compression
  compression?: {
    enabled: boolean;
    quality: number; // 0-1 for images
    maxWidth?: number;
    maxHeight?: number;
    mimeType?: string;
  };

  // Preview
  enablePreviews?: boolean; // Default: true
  previewMaxWidth?: number; // Default: 200
  previewMaxHeight?: number; // Default: 200

  // Metadata extraction
  extractMetadata?: boolean; // Default: true             // Default: false

  // Cloud integration
  cloudAdapter?: CloudAdapter;

  // Network
  timeout?: number;

  // Events (see Events section)
}
```

## 🎪 Events

All lifecycle events are available as callbacks:

```typescript
const uploader = useUploader({
  // Pre-upload events
  onFilesAdded: (files) => {
    console.log("Files added:", files);
  },
  onFilesRejected: (errors) => {
    console.error("Files rejected:", errors);
  },
  onValidationStart: (files) => {
    console.log("Validating files...");
  },
  onValidationComplete: (results) => {
    console.log("Validation complete");
  },
  onBeforeUpload: async (file) => {
    // Can be async - do something before upload starts
  },

  // During upload events
  onUploadStart: (file) => {
    console.log("Upload started:", file.metadata.name);
  },
  onUploadProgress: (file, progress) => {
    console.log(`Progress: ${progress.percentage}%`);
    console.log(`Speed: ${progress.speed} bytes/sec`);
    console.log(`Time remaining: ${progress.timeRemaining}s`);
  },
  onChunkComplete: (file, chunk) => {
    console.log(`Chunk ${chunk.index} complete`);
  },

  // Control events
  onUploadPause: (file) => {
    console.log("Upload paused");
  },
  onUploadResume: (file) => {
    console.log("Upload resumed");
  },
  onUploadCancel: (file) => {
    console.log("Upload cancelled");
  },

  // Post-upload events
  onUploadComplete: (file) => {
    console.log("Upload complete");
  },
  onUploadSuccess: (file, response) => {
    console.log("Server response:", response);
  },
  onUploadError: (file, error) => {
    console.error("Upload failed:", error);
  },
  onRetry: (file, attempt) => {
    console.log(`Retry attempt ${attempt}`);
  },
  onAllComplete: (files) => {
    console.log("All uploads complete!");
  },

  // Metadata events
  onMetadataExtracted: (file, metadata) => {
    console.log("Metadata:", metadata);
  },
  onPreviewGenerated: (file, preview) => {
    console.log("Preview URL:", preview);
  },
});
```

## 🎮 API Methods

```typescript
// Add files
await uploader.addFiles(fileList);

// Upload operations
await uploader.uploadAll(); // Upload all pending files
await uploader.uploadFile(fileId); // Upload specific file
uploader.pauseUpload(fileId); // Pause upload
await uploader.resumeUpload(fileId); // Resume upload
uploader.cancelUpload(fileId); // Cancel upload
await uploader.retryUpload(fileId); // Retry failed upload

// File management
uploader.removeFile(fileId); // Remove file from queue
uploader.clearAll(); // Clear all files

// Get files
const file = uploader.getFile(fileId);
const allFiles = uploader.getFiles();
const pending = uploader.getPendingFiles();
const uploading = uploader.getUploadingFiles();
const completed = uploader.getCompletedFiles();
const failed = uploader.getFailedFiles();

// Get preview
const preview = uploader.getPreview(fileId);

// Get progress
const totalProgress = uploader.getTotalProgress();
// Returns: { loaded: number, total: number, percentage: number }

// Get state
const state = uploader.getState();
```

## 📊 State Management

```typescript
const state = uploader.getState();

// State interface
interface UploaderState {
  files: UploadFile[];
  uploadingFiles: UploadFile[];
  completedFiles: UploadFile[];
  failedFiles: UploadFile[];
  queuedFiles: UploadFile[];
  totalProgress: {
    loaded: number;
    total: number;
    percentage: number;
  };
  isUploading: boolean;
  isPaused: boolean;
}
```

## 🧩 Chunked Uploads

For large files, enable chunked uploading:

```typescript
const uploader = useUploader({
  enableChunking: true,
  chunkSize: 1024 * 1024, // 1MB chunks
  maxConcurrentChunks: 3, // Upload 3 chunks at a time

  onChunkComplete: (file, chunk) => {
    console.log(`Chunk ${chunk.index + 1}/${file.chunks?.length} complete`);
  },
});
```

## ☁️ Cloud Integration

Create custom adapters for cloud storage:

```typescript
const s3Adapter: CloudAdapter = {
  name: "AWS S3",

  async getUploadUrl(file) {
    // Get pre-signed URL from your backend
    const response = await fetch("/api/s3/presigned-url", {
      method: "POST",
      body: JSON.stringify({
        filename: file.metadata.name,
        contentType: file.metadata.type,
      }),
    });
    return response.json();
  },

  async upload(file, config) {
    const url = await this.getUploadUrl(file);
    // Upload directly to S3
    const response = await fetch(url, {
      method: "PUT",
      body: file.file,
    });
    return response;
  },
};

const uploader = useUploader({
  cloudAdapter: s3Adapter,
});
```

## 🗜️ Image Compression

Compress images before upload:

```typescript
const uploader = useUploader({
  compression: {
    enabled: true,
    quality: 0.8, // 80% quality
    maxWidth: 1920,
    maxHeight: 1080,
    mimeType: "image/jpeg",
  },
});
```

## ✅ Custom Validation

Add custom validation logic:

```typescript
const uploader = useUploader({
  customValidator: async (file) => {
    const errors = [];

    // Check aspect ratio for images
    if (file.type.startsWith("image/")) {
      const img = await loadImage(file);
      const aspectRatio = img.width / img.height;

      if (aspectRatio < 1) {
        errors.push({
          code: "INVALID_ASPECT_RATIO",
          message: "Image must be landscape",
          file,
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
});
```

## 🛠️ Utilities

The library exports helpful utilities:

```typescript
import {
  formatBytes,
  formatTime,
  isImage,
  isVideo,
  isAudio,
  getImageDimensions,
  compressImage,
} from "@VerbPatch/headless-uploader";

formatBytes(1024 * 1024); // "1 MB"
formatTime(125); // "2:05"
isImage(file); // true/false
await getImageDimensions(file); // { width: 1920, height: 1080 }
```

## 📱 Framework Adapters

- **React**: `@VerbPatch/react-uploader`
- **Vue**: `@VerbPatch/vue-uploader`
- **Svelte**: `@VerbPatch/svelte-uploader`
- **Angular**: `@VerbPatch/angular-uploader`
- **Solid**: `@VerbPatch/solidjs-uploader`

## 📄 License

MIT © Your Organization

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 🔗 Links

- [Documentation](https://VerbPatch.com/uploader/docs)
- [Examples](https://github.com/VerbPatch/headless-uploader/tree/main/examples)
- [Issues](https://github.com/VerbPatch/headless-uploader/issues)
- [Changelog](https://github.com/VerbPatch/headless-uploader/blob/main/CHANGELOG.md)
