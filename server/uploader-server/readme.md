# Multi-Protocol Upload Server

This is a versatile demonstration server for handling file uploads across multiple protocols. It is built using **Fastify** for high performance and serves as a backend for the `headless-uploader` library.

## Supported Protocols

-  **HTTP**: Standard `POST` requests using `multipart/form-data`. Supports both simple single-file uploads and manual chunked uploads with server-side merging.
- **TUS**: Resumable, reliable uploads following the [TUS protocol](https://tus.io/) (v1.0.0). Ideal for large files and unstable connections.
- **Cloud (Indirect)**: Generates presigned URLs for **AWS S3**, **Azure Blob Storage**, and **Google Cloud Storage (GCS)**, allowing clients to upload directly to the cloud while maintaining server control.
- **WebSocket**: Real-time bidirectional streaming uploads using a custom binary framing protocol. Supports resuming and progress tracking.

## Prerequisites

- Node.js (v18+ recommended)
- `pnpm` or `npm`

## Setup & Running

1.  **Install dependencies**:
  ```bash
    pnpm install
    ```

2.  **Environment Configuration**:
    Create a `.env` file for Cloud uploads (optional):
    ```env
    AWS_REGION=us-east-1
    AWS_ACCESS_KEY_ID=your_id
    AWS_SECRET_ACCESS_KEY=your_secret
    AWS_S3_BUCKET=your_bucket

    AZURE_STORAGE_ACCOUNT_NAME=your_account
    AZURE_STORAGE_ACCOUNT_KEY=your_key
    AZURE_STORAGE_CONTAINER=your_container

    GCS_PROJECT_ID=your_project
    GCS_BUCKET=your_bucket
    GCS_KEY_FILE='{"type": "service_account", ...}'
    ```

3.  **Start the server**:
    ```bash
    pnpm start
    ```

## Project Structure

-   `server.js`: Main entry point initializing all protocols.
-   `protocols/`: Individual implementation for each upload method.
-   `utils.js`: Shared utilities like chunk merging.
-   `cleanup.js`: Background job that removes uploaded files/chunks older than 2 minutes.
-   `config.js`: Centralized configuration for ports and directories.

## API Endpoints

The following endpoints are available (host and ports are configurable in `.env`):

-   **Health Check**: `GET /health`
-   **HTTP Upload**: `POST /upload`
-   **TUS Protocol**: `ANY /tus/*`
-   **S3 Signed URL**: `POST /generate-s3-url`
-   **Azure SAS**: `POST /generate-azure-sas`
-   **GCS Signed URL**: `POST /generate-gcs-url`
-   **WebSocket**: `ws://{host}:{port}/ws-upload`
