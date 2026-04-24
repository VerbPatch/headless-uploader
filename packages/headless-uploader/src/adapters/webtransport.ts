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

interface ActiveStream {
  writer: WritableStreamDefaultWriter;
  reader?: ReadableStreamDefaultReader;
  file: UploadFile;
  isStreaming: boolean;
}

/**
 * WebTransport Upload Implementation
 * Maintains persistent streams for each file to ensure reliable pause/resume cycles.
 */
export function createWebTransportAdapter(wtConfig: WebTransportConfig): ProtocolAdapter {
  let transport: WebTransport | null = null;
  const streams = new Map<string, ActiveStream>();

  /**
   * Close a specific stream and cleanup
   */
  async function closeStream(fileId: string, reason = 'Normal closure') {
    const active = streams.get(fileId);
    if (active) {
      // eslint-disable-next-line
      console.log(`Closing WebTransport stream for ${fileId}: ${reason}`);
      try {
        await active.writer.close();
        if (active.reader) await active.reader.cancel();
        wtConfig.onClosed?.();
      } catch (e) {
        // eslint-disable-next-line
        console.error(`Error closing stream ${fileId}:`, e);
      }
      streams.delete(fileId);
    }
  }

  return {
    name: 'WebTransport',
    protocol: 'webtransport',

    async initialize(): Promise<void> {
      if (!('WebTransport' in window)) {
        throw new UploaderError('WebTransport is not supported in this browser', {
          code: UploaderErrorCodes.BROWSER_UNSUPPORTED,
        });
      }
      return connectWebTransport();
    },

    async upload(file: UploadFile, config: UploaderConfig): Promise<ProtocolUploadResult> {
      if (!transport) await connectWebTransport();

      let active = streams.get(file.id);

      if (active) {
        // eslint-disable-next-line
        console.log(`Reusing persistent WebTransport stream for ${file.id}`);
      } else {
        // eslint-disable-next-line
        console.log(`Creating new WebTransport stream for ${file.id}`);
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
        if (active.isStreaming) {
          // eslint-disable-next-line
          console.log(
            `WebTransport stream for ${file.id} is already active. Skipping redundant loop.`,
          );
          return {
            success: false,
            error: new UploaderError('Stream already active', {
              fileId: file.id,
              code: UploaderErrorCodes.CONFIG_ERROR,
            }),
          };
        }

        const result = await uploadToStream(active, file, config);

        if (result.success) {
          await closeStream(file.id, 'Upload completed');
        } else if (result.error?.code === UploaderErrorCodes.ABORT_ERROR) {
          // eslint-disable-next-line
          console.log(`WebTransport stream paused for ${file.id}. Keeping stream alive.`);
        } else {
          await closeStream(file.id, result.error?.message || 'Error occurred');
        }

        return result;
      } catch (err) {
        const error =
          err instanceof UploaderError
            ? err
            : new UploaderError(err instanceof Error ? err.message : String(err), {
                fileId: file.id,
                code: UploaderErrorCodes.UPLOAD_FAILED,
              });
        await closeStream(file.id, error.message);
        throw error;
      }
    },

    async pause(uploadId: string): Promise<void> {
      // eslint-disable-next-line
      console.log(`WebTransport upload paused: ${uploadId}`);
    },

    async cancel(uploadId: string): Promise<void> {
      // console.log(`WebTransport upload cancelled: ${uploadId}`);
      await closeStream(uploadId, 'Cancelled by user');
    },

    async cleanup(): Promise<void> {
      for (const fileId of Array.from(streams.keys())) {
        await closeStream(fileId);
      }
      if (transport) {
        await transport.close();
        transport = null;
      }
    },
  };

  /**
   * Connect to WebTransport server
   */
  async function connectWebTransport(): Promise<void> {
    if (transport) return;
    try {
      const options: WebTransportOptions = {
        allowPooling: wtConfig.allowPooling,
        congestionControl: wtConfig.congestionControl,
      };
      if (wtConfig.serverCertificateHashes) {
        options.serverCertificateHashes = wtConfig.serverCertificateHashes;
      }
      const conn = new WebTransport(wtConfig.url, options);
      await conn.ready;
      transport = conn;
      // console.log("WebTransport connected");
      wtConfig.onReady?.();

      transport.closed
        .then(() => {
          // console.log("WebTransport connection closed");
          transport = null;
        })
        .catch((e) => {
          // eslint-disable-next-line
          console.error('WebTransport connection failed:', e);
          transport = null;
        });
    } catch (error) {
      console.error('WebTransport connection failed:', error);
      transport = null;
      throw error;
    }
  }

  /**
   * Helper to write messages
   */
  async function writeMessage(
    writer: WritableStreamDefaultWriter,
    data: Uint8Array | string,
    type: number,
  ): Promise<void> {
    const encoded = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    const headerBuf = new ArrayBuffer(5);
    const view = new DataView(headerBuf);
    view.setUint8(0, type);
    view.setUint32(1, encoded.length, true);

    await writer.write(new Uint8Array(headerBuf));
    await writer.write(encoded);
  }

  /**
   * Shared upload logic
   */
  async function uploadToStream(
    active: ActiveStream,
    file: UploadFile,
    config: UploaderConfig,
  ): Promise<ProtocolUploadResult> {
    const writer = active.writer;
    const reader = active.reader;
    const blueprint = config.onBeforeRequest ? await config.onBeforeRequest(file) : null;

    const chunkSize = config.chunkSize || 16 * 1024;
    const totalChunks = Math.ceil(file.metadata.size / chunkSize);
    const startChunk = Math.floor((file.progress.loaded || 0) / chunkSize);
    const signal = file.abortController?.signal;

    try {
      active.isStreaming = true;

      // console.log(`Sending WebTransport init for file: ${file.metadata.name}, fileId: ${file.id}, bytes: ${file.progress.loaded}`);
      await writeMessage(
        writer,
        JSON.stringify({
          type: 'init',
          fileId: file.id,
          fileName: file.metadata.name,
          fileSize: file.metadata.size,
          totalChunks,
          bytesUploaded: file.progress.loaded || 0,
          auth: blueprint
            ? {
                headers: blueprint.headers,
                params: blueprint.params,
              }
            : undefined,
        }),
        0,
      );

      if (reader) {
        // console.log(`Waiting for WebTransport init_ack for ${file.id}...`);
        await waitForMessage(reader, 'init_ack');
        // console.log(`WebTransport handshake successful for ${file.id}`);
      }

      for (let i = startChunk; i < totalChunks; i++) {
        if (signal?.aborted) {
          const err = new UploaderError('Upload paused', {
            fileId: file.id,
            code: UploaderErrorCodes.ABORT_ERROR,
          });
          throw err;
        }

        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.metadata.size);
        const chunkBlob = file.processedFile || file.file;
        const chunk = chunkBlob.slice(start, end);

        const chunkInfo: ChunkInfo = {
          index: i,
          start,
          end,
          size: end - start,
          status: 'uploading',
          blob: chunk,
          uploadedBytes: 0,
          retries: 0,
        };

        config.onChunkStart?.(file, chunkInfo);

        const arrayBuffer = await chunk.arrayBuffer();

        await writeMessage(
          writer,
          JSON.stringify({
            type: 'chunk',
            chunkIndex: i,
            chunkSize: arrayBuffer.byteLength,
          }),
          0,
        );

        await writeMessage(writer, new Uint8Array(arrayBuffer), 1);

        file.progress.loaded = end;
        file.progress.percentage = (end / file.metadata.size) * 100;
        config.onUploadProgress?.(file, file.progress);

        chunkInfo.status = 'completed';
        chunkInfo.uploadedBytes = chunkInfo.size;
        config.onChunkComplete?.(file, chunkInfo);
      }

      await writeMessage(
        writer,
        JSON.stringify({
          type: 'complete',
          fileName: file.metadata.name,
          fileId: file.id,
        }),
        0,
      );

      if (reader) {
        const response: Record<string, unknown> = await waitForMessage(reader, 'complete');

        active.isStreaming = false;
        return {
          success: true,
          uploadId: (response.uploadId as string) || file.id,
          url: response.url as string,
          response,
          bytesUploaded: file.metadata.size,
        };
      }

      active.isStreaming = false;
      return {
        success: true,
        uploadId: file.id,
        bytesUploaded: file.metadata.size,
      };
    } catch (err) {
      active.isStreaming = false;
      const error =
        err instanceof UploaderError
          ? err
          : new UploaderError(err instanceof Error ? err.message : String(err), {
              fileId: file.id,
              code: UploaderErrorCodes.UPLOAD_FAILED,
            });
      if (error.code === UploaderErrorCodes.ABORT_ERROR) {
        return { success: false, error, bytesUploaded: file.progress.loaded };
      }
      throw error;
    }
  }

  /**
   * Wait for a specific JSON message from the stream
   */
  async function waitForMessage(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    expectedType: string,
  ): Promise<Record<string, unknown>> {
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done)
        throw new UploaderError(`Stream closed while waiting for ${expectedType}`, {
          code: UploaderErrorCodes.NETWORK_ERROR,
        });

      if (value) {
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
            // console.log(`WebTransport message:`, resMessage);

            if (wtMessage.type === expectedType) {
              return wtMessage;
            } else if (wtMessage.type === 'progress' || wtMessage.type === 'heartbeat') {
              // eslint-disable-next-line
              console.log(`Received ${wtMessage.type} while waiting for ${expectedType}`);
            } else {
              throw new UploaderError(wtMessage.message || 'Server error', {
                // eslint-disable-next-line
                code: (wtMessage as any).code || UploaderErrorCodes.SERVER_ERROR,
                fileId: wtMessage.fileId,
                response: wtMessage,
              });
            }

            start = closeBrace + 1;
          } catch (e) {
            const error =
              e instanceof UploaderError
                ? e
                : new UploaderError(e instanceof Error ? e.message : String(e), {
                    code: UploaderErrorCodes.SERVER_ERROR,
                  });
            if (
              error.code === UploaderErrorCodes.SERVER_ERROR ||
              error.code === UploaderErrorCodes.INVALID_FILE_TYPE ||
              error.message.includes('Unauthorized')
            )
              throw error;
            start = openBrace + 1;
          }
        }
        if (start > 0) buffer = buffer.substring(start);
      }
    }
  }
}

/**
 * Browser support check
 */
export function isWebTransportSupported(): boolean {
  return 'WebTransport' in window;
}
