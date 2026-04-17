import type { UploaderConfig, ValidationError, ValidationResult } from '../types';
import { getFileExtension } from './files';

/**
 * Check if a file's type matches the list of accepted types
 * @param file - The file to check
 * @param acceptedTypes - Array of MIME types or extensions (e.g., ['image/*', '.pdf'])
 * @returns True if the file type is accepted
 * @group validation
 * @title isAcceptedType
 * @description Validates a file against a set of allowed MIME types or file extensions.
 */
export function isAcceptedType(file: File, acceptedTypes: string[]): boolean {
  if (!acceptedTypes || acceptedTypes.length === 0) return true;

  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  const extension = getFileExtension(fileName);

  return acceptedTypes.some((type) => {
    const lowerType = type.toLowerCase();

    if (fileType === lowerType) return true;

    if (lowerType.endsWith('/*')) {
      const baseType = lowerType.slice(0, -2);
      if (fileType.startsWith(`${baseType}/`)) return true;
    }

    if (lowerType.includes('*')) {
      const pattern = lowerType.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(fileType)) return true;
    }

    if (lowerType.startsWith('.')) {
      const acceptedExt = lowerType.slice(1);
      if (extension === acceptedExt) return true;
    }

    if (!lowerType.includes('/') && !lowerType.startsWith('.')) {
      if (extension === lowerType) return true;
    }

    return false;
  });
}

/**
 * Validate a single file
 * @internal
 */
async function validateFile(
  file: File,
  config: UploaderConfig,
  existingFiles: File[] = [],
): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  if (config.maxFileSize && file.size > config.maxFileSize) {
    errors.push({
      code: 'FILE_TOO_LARGE',
      message: `File size exceeds maximum allowed size of ${config.maxFileSize} bytes`,
      file,
    });
  }

  if (config.minFileSize && file.size < config.minFileSize) {
    errors.push({
      code: 'FILE_TOO_SMALL',
      message: `File size is below minimum required size of ${config.minFileSize} bytes`,
      file,
    });
  }

  if (config.acceptedTypes && config.acceptedTypes.length > 0) {
    if (!isAcceptedType(file, config.acceptedTypes)) {
      errors.push({
        code: 'INVALID_FILE_TYPE',
        message: `File type "${file.type}" is not accepted. Accepted types: ${config.acceptedTypes.join(', ')}`,
        file,
      });
    }
  }

  if (!config.allowDuplicates) {
    const isDuplicate = existingFiles.some(
      (existingFile) =>
        existingFile.name === file.name &&
        existingFile.size === file.size &&
        existingFile.lastModified === file.lastModified,
    );

    if (isDuplicate) {
      errors.push({
        code: 'DUPLICATE_FILE',
        message: `File "${file.name}" is already in the upload queue`,
        file,
      });
    }
  }

  if (config.customValidator) {
    try {
      const customResult = await config.customValidator(file);
      if (!customResult.valid) {
        errors.push(...customResult.errors);
      }
    } catch (error) {
      errors.push({
        code: 'CUSTOM_VALIDATION_ERROR',
        message: error instanceof Error ? error.message : 'Custom validation failed',
        file,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate multiple files against the uploader configuration
 * @param files - Array of files to validate
 * @param config - Uploader configuration containing constraints
 * @param existingFiles - Files already in the queue to check for duplicates or count limits
 * @returns An object containing the list of valid files and any validation errors
 * @group validation
 * @title validateFiles
 * @description Performs comprehensive validation on multiple files, including size, type, and duplicate checks.
 */
export async function validateFiles(
  files: File[],
  config: UploaderConfig,
  existingFiles: File[] = [],
): Promise<{ validFiles: File[]; errors: ValidationError[] }> {
  const validFiles: File[] = [];
  const allErrors: ValidationError[] = [];

  if (config.maxFiles) {
    const totalFiles = existingFiles.length + files.length;
    if (totalFiles > config.maxFiles) {
      const excess = totalFiles - config.maxFiles;
      allErrors.push({
        code: 'TOO_MANY_FILES',
        message: `Cannot add ${files.length} files. Maximum allowed is ${config.maxFiles}. Remove ${excess} file(s).`,
        file: files[0],
      });
      return { validFiles, errors: allErrors };
    }
  }

  for (const file of files) {
    const result = await validateFile(file, config, existingFiles);

    if (result.valid) {
      validFiles.push(file);
    } else {
      allErrors.push(...result.errors);
    }
  }

  return { validFiles, errors: allErrors };
}
