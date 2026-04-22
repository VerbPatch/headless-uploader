# Multi-Protocol Upload Server

This is a versatile demonstration server for handling file uploads across multiple protocols. It is built using **Fastify** for high performance and serves as a backend for the `headless-uploader` library.

## Supported Protocols

-  **HTTP**: Standard `POST` requests using `multipart/form-data`. Supports both simple single-file uploads and manual chunked uploads with server-side merging.
- **TUS**: Resumable, reliable uploads following the [TUS protocol](https://tus.io/) (v1.0.0). Ideal for large files and unstable connections.
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
    Create a `.env` file (optional):
    ```env
    APP_HOST=localhost
    APP_PORT=3000
    AUTH_TOKEN=verbpatch-secret-token
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
-   **WebSocket**: `ws://{host}:{port}/ws-upload`
