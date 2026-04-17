/**
 * Validation result for one or more files
 * @group validation
 * @title ValidationResult
 * @description Represents the outcome of a file validation process.
 */
export interface ValidationResult {
  /** Whether all files passed validation */
  valid: boolean;
  /** List of validation errors, if any */
  errors: ValidationError[];
}

/**
 * Detailed validation error information
 * @group validation
 * @title ValidationError
 * @description Contains specific information about why a file failed validation.
 */
export interface ValidationError {
  /** Machine-readable error code */
  code: string;
  /** Human-readable error message */
  message: string;
  /** The file that failed validation */
  file: File;
}
