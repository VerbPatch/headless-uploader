// ============================================================================
// WEBSOCKET PROTOCOL ADAPTER
// Persistent connection per file with pause/resume support
// ============================================================================

import type {
  ProtocolAdapter,
  ProtocolUploadResult,
  WebSocketConfig,
  WebSocketMessage,
  UploadFile,
  UploaderConfig,
} from '../types';
import { UploaderError } from '../types/uploader';
import { UploaderErrorCodes } from '../constants/error-codes';
import { sleep } from '../utils';

interface ActiveConnection {
  ws: WebSocket;
  heartbeatInterval: number;
  resolve: (result: ProtocolUploadResult) => void;
  reject: (error: UploaderError) => void;
  file: UploadFile;
  isStreaming: boolean;
  onInitAck?: () => void;
  onInitError?: (err: UploaderError) => void;
}

/**
 * WebSocket Upload Implementation
 * Maintains a persistent connection for each file that survives pause/resume cycles.
 */
export function createWebSocketAdapter(wsConfig: WebSocketConfig): ProtocolAdapter {
  const connections = new Map<string, ActiveConnection>();

  /**
   * Close a specific connection and cleanup
   */
  function closeConnection(fileId: string, code = 1000, reason = 'Normal closure') {
    const conn = connections.get(fileId);
    if (conn) {
      //console.log(`Closing WebSocket for ${fileId}: ${reason}`);
      clearInterval(conn.heartbeatInterval);

      if (conn.ws.readyState === WebSocket.OPEN || conn.ws.readyState === WebSocket.CONNECTING) {
        // Ensure reason is within 123 bytes limit for WebSocket close
        const safeReason = reason.substring(0, 100);
        try {
          conn.ws.close(code, safeReason);
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
          conn.ws.close(code);
        }
      }
      connections.delete(fileId);
    }
  }

  async function disconnect(): Promise<void> {
    for (const fileId of connections.keys()) {
      closeConnection(fileId);
    }
  }

  return {
    name: 'WebSocket',
    protocol: 'websocket',

    async initialize(): Promise<void> {
      if (typeof WebSocket === 'undefined') {
        throw new UploaderError('WebSocket is not supported in this environment', {
          code: UploaderErrorCodes.BROWSER_UNSUPPORTED,
        });
      }
    },

    async upload(file: UploadFile, config: UploaderConfig): Promise<ProtocolUploadResult> {
      return new Promise((resolve, reject) => {
        let conn = connections.get(file.id);

        if (
          conn &&
          (conn.ws.readyState === WebSocket.CLOSED || conn.ws.readyState === WebSocket.CLOSING)
        ) {
          closeConnection(file.id);
          conn = undefined;
        }

        const onOpen = async (socket: WebSocket, connection: ActiveConnection) => {
          if (connection.isStreaming) {
            //console.log(`Connection for ${file.id} is already streaming.`);
            return;
          }

          //console.log(`WebSocket ready for ${file.metadata.name}`);
          connection.isStreaming = true;

          const signal = file.abortController?.signal;

          try {
            await uploadFileInChunks(socket, file, config, wsConfig, connection, signal);
          } catch (err) {
            const error =
              err instanceof UploaderError
                ? err
                : new UploaderError(err instanceof Error ? err.message : String(err), {
                    fileId: file.id,
                    code: UploaderErrorCodes.UPLOAD_FAILED,
                  });
            connection.isStreaming = false;
            if (error.code === UploaderErrorCodes.ABORT_ERROR || error.message.includes('paused')) {
              //console.log(`Upload loop paused for ${file.id}. Keeping socket alive.`);
              resolve({
                success: false,
                error,
                bytesUploaded: file.progress.loaded,
              });
            } else {
              // eslint-disable-next-line
              console.error(`Upload loop error for ${file.id}:`, error);
              closeConnection(file.id, 1011, error.message);
              reject(error);
            }
          }
        };

        if (conn) {
          // console.log(`Reusing existing WebSocket for ${file.metadata.name}`);
          conn.resolve = resolve;
          conn.reject = reject;
          conn.file = file;

          if (conn.ws.readyState === WebSocket.OPEN) {
            onOpen(conn.ws, conn);
          } else {
            const originalOnOpen = conn.ws.onopen;
            conn.ws.onopen = function (this: WebSocket, ev: Event) {
              if (originalOnOpen) originalOnOpen.call(this, ev);
              const currentConn = connections.get(file.id);
              if (currentConn) onOpen(currentConn.ws, currentConn);
            };
          }
        } else {
          // console.log(`Creating new WebSocket for ${file.metadata.name}`);
          const protocols =
            wsConfig.protocols &&
            (Array.isArray(wsConfig.protocols) ? wsConfig.protocols.length > 0 : true)
              ? wsConfig.protocols
              : undefined;

          const ws = new WebSocket(wsConfig.url, protocols);
          ws.binaryType = wsConfig.binaryType || 'blob';

          const heartbeatInterval = window.setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'heartbeat' }));
            }
          }, wsConfig.heartbeatInterval);

          const newConn: ActiveConnection = {
            ws,
            heartbeatInterval,
            resolve,
            reject,
            file,
            isStreaming: false,
          };
          connections.set(file.id, newConn);

          ws.onopen = () => {
            const currentConn = connections.get(file.id);
            if (currentConn) onOpen(ws, currentConn);
          };

          ws.onmessage = (event) => {
            try {
              const message: WebSocketMessage = JSON.parse(event.data);
              const currentConn = connections.get(file.id);
              if (!currentConn) return;

              if (message.type === 'init_ack') {
                // console.log(`Received init_ack for ${file.id}`);
                if (currentConn.onInitAck) currentConn.onInitAck();
              } else if (message.type === 'complete') {
                // console.log(`Received complete for ${file.id}`);
                currentConn.isStreaming = false;
                const res = {
                  success: true,
                  uploadId: message.uploadId || file.id,
                  url: message.url,
                  bytesUploaded: message.bytesUploaded || file.metadata.size,
                  response: message,
                };
                currentConn.resolve(res);
                closeConnection(file.id);
              } else if (message.type === 'error') {
                // eslint-disable-next-line
                console.error(`Received error for ${file.id}:`, message.error);
                const err = new UploaderError(message.error || 'Upload failed', {
                  code: (message as any).code,
                  fileId: message.fileId || file.id,
                  response: message,
                });
                currentConn.isStreaming = false;

                if (currentConn.onInitError) {
                  currentConn.onInitError(err);
                } else {
                  currentConn.reject(err);
                  closeConnection(file.id, 1011, message.error);
                }
              }
            } catch (err) {
              const error =
                err instanceof UploaderError
                  ? err
                  : new UploaderError(err instanceof Error ? err.message : String(err), {
                      code: UploaderErrorCodes.SERVER_ERROR,
                    });
              // eslint-disable-next-line
              console.error('Failed to parse WS message:', error);
            }
          };

          ws.onerror = (error) => {
            // eslint-disable-next-line
            console.error(`WebSocket error for ${file.id}:`, error);
            const currentConn = connections.get(file.id);
            if (currentConn) {
              const err = new UploaderError('WebSocket connection failed', {
                fileId: file.id,
                code: UploaderErrorCodes.NETWORK_ERROR,
              });
              if (currentConn.onInitError) {
                currentConn.onInitError(err);
              } else {
                currentConn.isStreaming = false;
                currentConn.reject(err);
              }
            }
            closeConnection(file.id, 1006, 'Connection error');
          };

          ws.onclose = (event) => {
            // console.log(`WebSocket closed for ${file.id} (Code: ${event.code})`);
            const currentConn = connections.get(file.id);
            if (currentConn) {
              const err = new UploaderError(
                `WebSocket closed: ${event.reason || 'Unknown reason'}`,
                {
                  fileId: file.id,
                  code: String(event.code) as any,
                },
              );
              if (currentConn.onInitError) {
                currentConn.onInitError(err);
              } else {
                currentConn.isStreaming = false;
                if (event.code !== 1000) {
                  currentConn.reject(err);
                }
              }
            }
            connections.delete(file.id);
          };
        }
      });
    },

    async pause(uploadId: string): Promise<void> {
      // eslint-disable-next-line
      console.log(`WebSocket upload paused: ${uploadId}`);
    },

    async cancel(uploadId: string): Promise<void> {
      // console.log(`WebSocket upload cancelled: ${uploadId}`);
      closeConnection(uploadId, 1000, 'Cancelled by user');
    },

    cleanup: disconnect,
  };
}

/**
 * Upload file in chunks over a specific WebSocket
 */
async function uploadFileInChunks(
  socket: WebSocket,
  file: UploadFile,
  config: UploaderConfig,
  wsConfig: WebSocketConfig,
  connection: ActiveConnection,
  signal?: AbortSignal,
): Promise<void> {
  const blueprint = config.onBeforeRequest ? await config.onBeforeRequest(file) : null;

  const chunkSize = config.chunkSize || 64 * 1024;
  const totalChunks = Math.ceil(file.metadata.size / chunkSize);

  const startChunk = Math.floor((file.progress.loaded || 0) / chunkSize);
  let uploadedBytes = file.progress.loaded || 0;

  // 1. Send Init (Auth included)
  socket.send(
    JSON.stringify({
      type: 'init',
      fileId: file.id,
      fileName: file.metadata.name,
      fileSize: file.metadata.size,
      totalChunks,
      bytesUploaded: uploadedBytes,
      auth: blueprint
        ? {
            headers: blueprint.headers,
            params: blueprint.params,
          }
        : undefined,
    }),
  );

  // 2. Wait for Ack from server (Handshake)
  await new Promise<void>((resolve, reject) => {
    connection.onInitAck = () => {
      connection.onInitAck = undefined;
      connection.onInitError = undefined;
      resolve();
    };
    connection.onInitError = (err) => {
      connection.onInitAck = undefined;
      connection.onInitError = undefined;
      reject(err);
    };
  });

  for (let i = startChunk; i < totalChunks; i++) {
    if (signal?.aborted) {
      const error = new UploaderError('Upload paused or cancelled', {
        fileId: file.id,
        code: UploaderErrorCodes.ABORT_ERROR,
      });
      throw error;
    }

    if (socket.readyState !== WebSocket.OPEN) {
      throw new UploaderError('WebSocket disconnected', {
        fileId: file.id,
        code: UploaderErrorCodes.NETWORK_ERROR,
      });
    }

    await waitForBuffer(socket);

    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.metadata.size);
    const chunk = file.file.slice(start, end);

    const buffer = wsConfig.binaryType === 'arraybuffer' ? await chunk.arrayBuffer() : chunk;

    socket.send(
      JSON.stringify({
        type: 'chunk',
        fileId: file.id,
        chunkIndex: i,
        totalChunks,
      }),
    );

    await sleep(5);

    socket.send(buffer);

    uploadedBytes = end;
    file.progress.loaded = uploadedBytes;
    file.progress.percentage = (uploadedBytes / file.metadata.size) * 100;
    config.onUploadProgress?.(file, file.progress);
  }

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: 'complete',
        fileId: file.id,
      }),
    );
  }
}

/**
 * Wait until the buffer is low enough to send more data
 */
async function waitForBuffer(socket: WebSocket): Promise<void> {
  const HIGH_WATER_MARK = 1024 * 1024;
  if (socket.bufferedAmount < HIGH_WATER_MARK) return;

  while (socket.bufferedAmount >= HIGH_WATER_MARK) {
    if (socket.readyState !== WebSocket.OPEN)
      throw new UploaderError('WebSocket closed', { code: UploaderErrorCodes.NETWORK_ERROR });
    await sleep(50);
  }
}
