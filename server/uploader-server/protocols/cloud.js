import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
} from '@azure/storage-blob';
import { Storage } from '@google-cloud/storage';
import 'dotenv/config';

/**
 * PRODUCTION IMPLEMENTATION
 */

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

async function generateS3PresignedUrl(fileName, contentType) {
  if (!process.env.AWS_S3_BUCKET) throw new Error('AWS_S3_BUCKET not configured');

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `uploads/${Date.now()}-${fileName}`,
    ContentType: contentType,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

let azureBlobServiceClient = null;
let azureSharedKeyCredential = null;

if (process.env.AZURE_STORAGE_ACCOUNT_NAME && process.env.AZURE_STORAGE_ACCOUNT_KEY) {
  azureSharedKeyCredential = new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT_NAME,
    process.env.AZURE_STORAGE_ACCOUNT_KEY,
  );
  azureBlobServiceClient = new BlobServiceClient(
    `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    azureSharedKeyCredential,
  );
}

async function generateAzureSAS(blobName) {
  if (!azureSharedKeyCredential || !process.env.AZURE_STORAGE_CONTAINER) {
    throw new Error('Azure storage not fully configured');
  }

  const containerName = process.env.AZURE_STORAGE_CONTAINER;
  const timestampedName = `${Date.now()}-${blobName}`;

  const sas = generateBlobSASQueryParameters(
    {
      containerName,
      blobName: timestampedName,
      permissions: BlobSASPermissions.parse('w'),
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
    },
    azureSharedKeyCredential,
  ).toString();

  return `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${containerName}/${timestampedName}?${sas}`;
}

let gcsStorage = null;
if (process.env.GCS_PROJECT_ID) {
  gcsStorage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    credentials: process.env.GCS_KEY_FILE ? JSON.parse(process.env.GCS_KEY_FILE) : undefined,
  });
}

async function generateGCSSignedUrl(fileName, contentType) {
  if (!gcsStorage || !process.env.GCS_BUCKET) {
    throw new Error('GCS storage not fully configured');
  }

  const bucket = gcsStorage.bucket(process.env.GCS_BUCKET);
  const file = bucket.file(`uploads/${Date.now()}-${fileName}`);

  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000,
    contentType: contentType,
  });

  return url;
}

/**
 * Controller setup for Fastify
 */
export function setupCloud(fastify) {
  fastify.post('/generate-s3-url', async (req, reply) => {
    try {
      const { fileName, contentType } = req.body;
      if (!fileName) return reply.status(400).send({ error: 'fileName is required' });

      const isPdf =
        (contentType && contentType === 'application/pdf') ||
        (fileName && fileName.toLowerCase().endsWith('.pdf'));

      if (!isPdf) {
        return reply.status(400).send({
          error: 'Invalid file type. Only PDF files are allowed.',
          code: 'INVALID_FILE_TYPE',
        });
      }

      const url = await generateS3PresignedUrl(fileName, contentType || 'application/pdf');
      return { url };
    } catch (error) {
      console.error('[S3] Error:', error.message);
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.post('/generate-azure-sas', async (req, reply) => {
    try {
      const { fileName } = req.body;
      if (!fileName) return reply.status(400).send({ error: 'fileName is required' });

      const isPdf = fileName && fileName.toLowerCase().endsWith('.pdf');

      if (!isPdf) {
        return reply.status(400).send({
          error: 'Invalid file type. Only PDF files are allowed.',
          code: 'INVALID_FILE_TYPE',
        });
      }

      const url = await generateAzureSAS(fileName);
      return { url };
    } catch (error) {
      console.error('[Azure] Error:', error.message);
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.post('/generate-gcs-url', async (req, reply) => {
    try {
      const { fileName, contentType } = req.body;
      if (!fileName) return reply.status(400).send({ error: 'fileName is required' });

      const isPdf =
        (contentType && contentType === 'application/pdf') ||
        (fileName && fileName.toLowerCase().endsWith('.pdf'));

      if (!isPdf) {
        return reply.status(400).send({
          error: 'Invalid file type. Only PDF files are allowed.',
          code: 'INVALID_FILE_TYPE',
        });
      }

      const url = await generateGCSSignedUrl(fileName, contentType || 'application/pdf');
      return { url };
    } catch (error) {
      console.error('[GCS] Error:', error.message);
      return reply.status(500).send({ error: error.message });
    }
  });
}
