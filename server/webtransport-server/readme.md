# WebTransport Upload Server

This is a dedicated server for handling file uploads using the **WebTransport (HTTP/3)** protocol. It is built as a standalone service to allow independent scaling and deployment.

## Key Features

- **WebTransport (HTTP/3)**: Next-generation, low-latency protocol built on QUIC. Uses binary framing for high-performance uploads.
- **Standalone Config Server**: Includes a Fastify-based HTTP server for certificate fingerprint negotiation and health checks.
- **Secure by Default**: Designed to work with HTTP/3 and requires valid or accepted self-signed TLS certificates.

## Prerequisites

- Node.js (v18+ recommended)
- `pnpm` or `npm`
- OpenSSL (for generating local development certificates)

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
    WEBTRANSPORT_PORT=4443
    AUTH_TOKEN=your-secret-token
    ```

3.  **Start the server**:
    ```bash
    pnpm start
    ```

## WebTransport Certificate Setup

WebTransport requires a secure connection. For local development, Chromium-based browsers allow self-signed certificates if they meet specific criteria (ECDSA P-256, valid for ≤ 14 days).

### Generate Certificates

Run the following command in the server directory to generate `cert.pem` and `key.pem`. This command uses ECDSA P-256 and includes `127.0.0.1` in the Subject Alternative Name, which is required by some browsers for WebTransport.

```bash
openssl req -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -nodes -keyout key.pem -x509 -days 14 -out cert.pem -subj "/CN=127.0.0.1" -addext "subjectAltName=IP:127.0.0.1,DNS:localhost"
```

The server will automatically:
1.  Detect these files on startup.
2.  Calculate the SHA-256 fingerprint.
3.  Expose the fingerprint via the `/webtransport-config` endpoint.

## API Endpoints

- **Health Check**: `GET http://{host}:{port}/health`
- **Config & Fingerprint**: `GET http://{host}:{port}/webtransport-config`
- **Test Page**: `GET http://{host}:{port}/test-webtransport`
- **WebTransport Endpoint**: `https://{host}:{wt_port}/wt-upload` (via HTTP/3)
