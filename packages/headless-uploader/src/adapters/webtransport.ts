import type {
  ProtocolAdapter,
  ProtocolUploadResult,
  WebTransportConfig,
  UploadFile,
  UploaderConfig,
  ChunkInfo,
} from '../types';
import { UploaderError } from '../types/uploader';
import { UploaderErrorCodes } from '../constants/error-codes';
import { Logger, defaultLogger } from '../utils/logger';
import { calculateProgress, applyBeforeRequestHook } from '../utils';

interface ActiveStream {
  writer: WritableStreamDefaultWriter;
  reader?: ReadableStreamDefaultReader;
  file: UploadFile;
  isStreaming: boolean;
}

/**
 * WebTransport Upload Implementation (HTTP/3)
 */
export function createWebTransportAdapter(
  wtConfig: WebTransportConfig,
  logger: Logger = defaultLogger,
): ProtocolAdapter {
  let transport: WebTransport | null = null;
  const streams = new Map<string, ActiveStream>();

  async function connectWebTransport() {
    if (transport) return;

    logger.log('Connecting to WebTransport server:', wtConfig.url);
    const transportOptions: WebTransportOptions = {
      allowPooling: wtConfig.allowPooling,
      congestionControl: wtConfig.congestionControl,
    };

    if (wtConfig.serverCertificateHashes) {
      transportOptions.serverCertificateHashes = wtConfig.serverCertificateHashes;
    }

    try {
      transport = new WebTransport(wtConfig.url, transportOptions);
      await transport.ready;
      wtConfig.onReady?.();
      logger.log('WebTransport connection established');

      transport.closed
        .then(() => {
          logger.log('WebTransport connection closed normally');
          wtConfig.onClosed?.();
          transport = null;
        })
        .catch((err) => {
          logger.error('WebTransport connection closed with error:', err);
          transport = null;
        });
    } catch (err) {
      transport = null;
      throw logger.createError('WebTransport connection failed', {
        code: UploaderErrorCodes.NETWORK_ERROR,
        originalError: err,
      });
    }
  }

  return {
    name: 'WebTransport',
    protocol: 'webtransport',
    logger,

    async initialize(): Promise<void> {
      if (!isWebTransportSupported()) {
        throw logger.createError('WebTransport is not supported in this environment', {
          code: UploaderErrorCodes.BROWSER_UNSUPPORTED,
        });
      }
      return connectWebTransport();
    },

    async upload(file: UploadFile, config: UploaderConfig): Promise<ProtocolUploadResult> {
      if (!transport) await connectWebTransport();

      let active = streams.get(file.id);

      if (active) {
        logger.log(`Reusing persistent WebTransport stream for ${file.id}`);
      } else {
        logger.log(`Creating new WebTransport stream for ${file.id}`);
        const isBidi = wtConfig.bidirectionalStreams !== false;
        const stream = isBidi
          ? await transport!.createBidirectionalStream()
          : await transport!.createUnidirectionalStream();

        const writer = (stream as { writable: WritableStream }).writable
          ? (stream as { writable: WritableStream }).writable.getWriter()
          : (stream as WritableStream).getWriter();

        let reader: ReadableStreamDefaultReader | undefined;
        if (isBidi) {
          reader = (stream as WebTransportBidirectionalStream).readable.getReader();
          // esline-disable-next-line
        } else if ((stream as any).getReader) {
          reader = (stream as unknown as ReadableStream).getReader();
        }

        active = {
          writer,
          reader,
          file,
          isStreaming: false,
        };
        streams.set(file.id, active);
      }

      try {
        if (!active.isStreaming) {
          active.isStreaming = true;
          await uploadInStream(active, config, wtConfig, logger);
        }

        return {
          success: true,
          bytesUploaded: file.metadata.size,
          response: file.response,
        };
      } catch (err) {
        active.isStreaming = false;
        const error =
          err instanceof UploaderError
            ? err
            : logger.createError(err instanceof Error ? err.message : String(err), {
                fileId: file.id,
                code: UploaderErrorCodes.UPLOAD_FAILED,
                originalError: err,
              });

        if (error.code === UploaderErrorCodes.ABORT_ERROR) {
          return { success: false, error, bytesUploaded: file.progress.loaded };
        }
        throw error;
      }
    },

    async pause(uploadId: string): Promise<void> {
      logger.log(`WebTransport upload paused: ${uploadId}`);
    },

    async cancel(uploadId: string): Promise<void> {
      const active = streams.get(uploadId);
      if (active) {
        try {
          await active.writer.abort();
          if (active.reader) await active.reader.cancel();
        } catch (e) {
          logger.error('Error cancelling WT stream:', e);
        }
        streams.delete(uploadId);
      }
    },

    async cleanup(): Promise<void> {
      for (const [id] of streams) {
        await this.cancel?.(id);
      }
      if (transport) {
        transport.close();
        transport = null;
      }
    },
  };
}

/**
 * Helper to write a length-prefixed message with type flag
 * type: 0 = JSON, 1 = Binary
 */
async function writeMessage(
  writer: WritableStreamDefaultWriter,
  data: string | Uint8Array,
  type: number,
) {
  const encoded = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const length = encoded.length;

  // 1 byte for type + 4 bytes for length (Uint32LE)
  const headerBuf = new ArrayBuffer(5);
  const view = new DataView(headerBuf);
  view.setUint8(0, type);
  view.setUint32(1, length, true);

  await writer.write(new Uint8Array(headerBuf));
  await writer.write(encoded);
}

/**
 * Perform upload over the established stream
 */
async function uploadInStream(
  active: ActiveStream,
  config: UploaderConfig,
  wtConfig: WebTransportConfig,
  logger: Logger,
): Promise<void> {
  const { writer, reader, file } = active;
  const signal = file.abortController?.signal;

  const blueprint = await applyBeforeRequestHook(file, config);

  const chunkSize = config.chunkSize || 64 * 1024;
  const totalChunks = Math.ceil(file.metadata.size / chunkSize);
  const startChunk = Math.floor((file.progress.loaded || 0) / chunkSize);
  const startTime = Date.now();

  // 1. Initial Handshake
  const initMsg = JSON.stringify({
    type: 'init',
    fileId: file.id,
    fileName: file.metadata.name,
    fileSize: file.metadata.size,
    totalChunks,
    bytesUploaded: file.progress.loaded || 0,
    metadata: wtConfig.metadata,
    auth: blueprint ? { headers: blueprint.headers, params: blueprint.params } : undefined,
  });

  await writeMessage(writer, initMsg, 0);

  // 2. Wait for ACK if bidirectional
  if (reader) {
    const ack = await waitForMessage(reader, 'init_ack', logger);
    if (!ack) throw logger.createError('Failed to receive init_ack from WT server');
  }

  // 3. Upload chunks
  for (let i = startChunk; i < totalChunks; i++) {
    if (signal?.aborted) {
      throw logger.createError('Upload paused or cancelled', {
        fileId: file.id,
        code: UploaderErrorCodes.ABORT_ERROR,
      });
    }

    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.metadata.size);
    const chunkBlob = file.file.slice(start, end);

    const chunkInfo: ChunkInfo = {
      index: i,
      start,
      end,
      size: end - start,
      status: 'uploading',
      blob: chunkBlob,
      uploadedBytes: 0,
      retries: 0,
    };

    config.onChunkStart?.(file, chunkInfo);

    // Write chunk header
    const chunkHeader = JSON.stringify({
      type: 'chunk',
      fileId: file.id,
      chunkIndex: i,
      chunkSize: chunkInfo.size,
    });
    await writeMessage(writer, chunkHeader, 0);

    // Write binary data
    const buffer = await chunkBlob.arrayBuffer();
    await writeMessage(writer, new Uint8Array(buffer), 1);

    file.progress = calculateProgress(end, file.metadata.size, startTime);
    config.onUploadProgress?.(file, file.progress);

    chunkInfo.status = 'completed';
    chunkInfo.uploadedBytes = chunkInfo.size;
    config.onChunkComplete?.(file, chunkInfo);
  }

  // 4. Complete upload
  const completeMsg = JSON.stringify({ type: 'complete', fileId: file.id });
  await writeMessage(writer, completeMsg, 0);

  if (reader) {
    const complete = await waitForMessage(reader, 'complete', logger);
    file.response = complete;
  }
}

/**
 * Utility to wait for a specific JSON message type from the stream
 */
async function waitForMessage(
  reader: ReadableStreamDefaultReader,
  expectedType: string,
  logger: Logger,
  // eslint-disable-next-line
): Promise<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) return null;

    // Server sends raw JSON messages for now in the responses
    // We should ideally align server responses to the same framing too
    buffer += decoder.decode(value, { stream: true });

    let start = 0;
    while (start < buffer.length) {
      const openBrace = buffer.indexOf('{', start);
      if (openBrace === -1) break;

      const closeBrace = buffer.indexOf('}', openBrace);
      if (closeBrace === -1) break;

      const jsonStr = buffer.substring(openBrace, closeBrace + 1);
      try {
        const wtMessage = JSON.parse(jsonStr);
        if (wtMessage.type === expectedType) {
          return wtMessage;
        } else if (wtMessage.type === 'error') {
          throw logger.createError(wtMessage.error || wtMessage.message || 'Server error', {
            code: wtMessage.code || UploaderErrorCodes.SERVER_ERROR,
            fileId: wtMessage.fileId,
            response: wtMessage,
          });
        }
        // Skip other types
        start = closeBrace + 1;
      } catch (err) {
        if (err instanceof UploaderError) throw err;
        start = openBrace + 1;
      }
    }
    if (start > 0) buffer = buffer.substring(start);
  }
}

/**
 * Browser support check
 */
export function isWebTransportSupported(): boolean {
  return 'WebTransport' in window;
}
