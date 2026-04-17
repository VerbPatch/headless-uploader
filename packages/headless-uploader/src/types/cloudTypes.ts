import type { UploadFile } from './uploader';

/**
 * AWS S3 Adapter Configuration
 * @group cloud
 * @title S3AdapterOptions
 * @description Configuration options for the AWS S3 cloud storage adapter.
 */
export interface S3AdapterOptions {
  /**
   * Function to get a pre-signed PUT URL from your backend
   * @param file - The file being uploaded
   */
  getUploadUrl: (file: UploadFile) => Promise<string>;

  /**
   * Additional custom headers to include in the S3 PUT request
   * `e.g., { 'x-amz-acl': 'public-read' }`
   */
  headers?: Record<string, string>;
}

/**
 * Azure Blob Storage Adapter Configuration
 * @group cloud
 * @title AzureAdapterOptions
 * @description Configuration options for the Azure Blob Storage cloud storage adapter.
 */
export interface AzureAdapterOptions {
  /**
   * Function to get a Shared Access Signature (SAS) URL from your backend
   * @param file - The file being uploaded
   */
  getUploadUrl: (file: UploadFile) => Promise<string>;

  /**
   * The type of blob to create in Azure
   * @default 'BlockBlob'
   */
  blobType?: 'BlockBlob' | 'PageBlob' | 'AppendBlob';

  /**
   * Additional custom headers to include in the Azure PUT request
   * `e.g., { 'x-ms-meta-category': 'images' }`
   */
  headers?: Record<string, string>;
}

/**
 * Google Cloud Storage Adapter Configuration
 * @group cloud
 * @title GCSAdapterOptions
 * @description Configuration options for the Google Cloud Storage adapter.
 */
export interface GCSAdapterOptions {
  /**
   * Function to get a Signed URL from your backend
   * @param file - The file being uploaded
   */
  getUploadUrl: (file: UploadFile) => Promise<string>;

  /**
   * Additional custom headers to include in the GCS PUT request
   */
  headers?: Record<string, string>;
}
