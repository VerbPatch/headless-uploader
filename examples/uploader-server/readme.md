# Multi-Protocol Upload Server

This is a demonstration server for the `headless-uploader` library. It supports multiple protocols in a single environment.

## Supported Protocols

- **HTTP**: Standard `POST` requests with `multipart/form-data` using `multer`.
- **TUS**: Resumable uploads using the TUS protocol.
- **WebSocket**: Real-time bidirectional streaming uploads.
- **WebTransport**: Next-generation low-latency protocol (requires valid TLS/HTTPS).

## Setup & Running

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start the server:
   ```bash
   node server.js
   ```

## Endpoints

- **HTTP**: `http://localhost:3000/upload`
- **TUS**: `http://localhost:3000/tus/`
- **WebSocket**: `ws://localhost:3000/ws-upload`
- **WebTransport**: `https://127.0.0.1:4443/wt-upload`

## Notes on WebTransport

WebTransport requires a secure connection (HTTPS) with a valid certificate or a certificate hash. For local development, it is often easier to test with the other 4 protocols unless you have a specific certificate setup.
