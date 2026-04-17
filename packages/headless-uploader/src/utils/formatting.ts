import { FileMetadata } from '../types';
import { getFileExtension } from './files';

/**
 * Check if file is an image
 */
export function isImage(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Check if file is a video
 */
export function isVideo(file: File): boolean {
  return file.type.startsWith('video/');
}

/**
 * Check if file is audio
 */
export function isAudio(file: File): boolean {
  return file.type.startsWith('audio/');
}

/**
 * Get image dimensions
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Get video metadata
 */
export function getVideoMetadata(file: File): Promise<{
  duration: number;
  dimensions: { width: number; height: number };
}> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve({
        duration: video.duration,
        dimensions: {
          width: video.videoWidth,
          height: video.videoHeight,
        },
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load video'));
    };

    video.src = url;
  });
}

/**
 * Get audio duration
 */
export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio');
    const url = URL.createObjectURL(file);

    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(audio.duration);
    };

    audio.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load audio'));
    };

    audio.src = url;
  });
}

/**
 * Generate preview for file
 */
export async function generatePreview(
  file: File,
  maxWidth: number = 200,
  maxHeight: number = 200,
): Promise<string> {
  if (isImage(file)) {
    return generateImagePreview(file, maxWidth, maxHeight);
  }

  if (isVideo(file)) {
    return generateVideoPreview(file);
  }

  return '';
}

/**
 * Generate image preview
 */
export function generateImagePreview(
  file: File,
  maxWidth: number,
  maxHeight: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL());
      };

      img.onerror = () => reject(new Error('Failed to load image for preview'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Generate video preview (thumbnail from first frame)
 */
export function generateVideoPreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);

    video.onloadeddata = () => {
      video.currentTime = 0;
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(video, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL());
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load video'));
    };

    video.src = url;
  });
}

/**
 * Compress image file
 */
export async function compressImage(
  file: File,
  quality: number = 0.8,
  maxWidth?: number,
  maxHeight?: number,
  mimeType?: string,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (maxWidth && width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
        if (maxHeight && height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          mimeType || file.type,
          quality,
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Extract metadata from file
 */
export async function extractMetadata(file: File): Promise<FileMetadata> {
  const metadata: FileMetadata = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    extension: getFileExtension(file.name),
  };
  try {
    if (isImage(file)) {
      const dimensions = await getImageDimensions(file);
      metadata.dimensions = dimensions;
    }

    if (isVideo(file)) {
      const videoData = await getVideoMetadata(file);
      metadata.duration = videoData.duration;
      metadata.dimensions = videoData.dimensions;
    }

    if (isAudio(file)) {
      const duration = await getAudioDuration(file);
      metadata.duration = duration;
    }
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error while extracting metadata', error);
  }
  return metadata;
}
