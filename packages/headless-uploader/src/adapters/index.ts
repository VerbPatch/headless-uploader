import type { ProtocolAdapter, ProtocolFactoryConfig, UploadProtocol } from '../types';
import { UploaderError } from '../types/uploader';
import { UploaderErrorCodes } from '../constants/error-codes';
import { createHttpAdapter } from './http';
import { createTusAdapter } from './tus';
import { createWebSocketAdapter } from './websocket';
import { createWebTransportAdapter, isWebTransportSupported } from './webtransport';

/**
 * Create a protocol adapter based on the provided configuration
 * @param config - The configuration for the protocol factory
 * @returns A protocol adapter instance
 * @group protocols
 * @title createProtocolAdapter
 * @description Factory function that instantiates the appropriate adapter (HTTP, TUS, WebSocket, or WebTransport).
 * @internal
 */
export function createProtocolAdapter(config: ProtocolFactoryConfig): ProtocolAdapter {
  switch (config.protocol) {
    case 'http':
      if (!config.http) {
        throw new UploaderError('HTTP configuration is required', {
          code: UploaderErrorCodes.CONFIG_ERROR,
        });
      }
      return createHttpAdapter(config.http);

    case 'tus':
      if (!config.tus) {
        throw new UploaderError('TUS configuration is required', {
          code: UploaderErrorCodes.CONFIG_ERROR,
        });
      }
      return createTusAdapter(config.tus);

    case 'websocket':
      if (!config.websocket) {
        throw new UploaderError('WebSocket configuration is required', {
          code: UploaderErrorCodes.CONFIG_ERROR,
        });
      }
      return createWebSocketAdapter(config.websocket);

    case 'webtransport':
      if (!isWebTransportSupported()) {
        throw new UploaderError('WebTransport is not supported in this browser', {
          code: UploaderErrorCodes.BROWSER_UNSUPPORTED,
        });
      }
      if (!config.webtransport) {
        throw new UploaderError('WebTransport configuration is required', {
          code: UploaderErrorCodes.CONFIG_ERROR,
        });
      }
      return createWebTransportAdapter(config.webtransport);

    default:
      throw new UploaderError(`Unknown protocol: ${config.protocol}`, {
        code: UploaderErrorCodes.CONFIG_ERROR,
      });
  }
}

/**
 * Get the recommended protocol based on file size and browser capabilities
 * @param fileSize - Size of the file in bytes
 * @param browserCapabilities - Optional overrides for browser capability detection
 * @returns The recommended UploadProtocol
 * @group protocols
 * @title getRecommendedProtocol
 * @description Suggests the most suitable upload protocol based on file size and modern browser feature support.
 */
export function getRecommendedProtocol(
  fileSize: number,
  browserCapabilities?: {
    supportsWebTransport?: boolean;
    supportsWebSocket?: boolean;
  },
): UploadProtocol {
  const caps = {
    supportsWebTransport: isWebTransportSupported(),
    supportsWebSocket: 'WebSocket' in window,
    ...browserCapabilities,
  };

  if (fileSize > 100 * 1024 * 1024) {
    return 'tus';
  }

  if (fileSize > 10 * 1024 * 1024) {
    if (caps.supportsWebTransport) {
      return 'webtransport';
    }
    return 'tus';
  }

  if (caps.supportsWebTransport) {
    return 'webtransport';
  }

  if (caps.supportsWebSocket) {
    return 'websocket';
  }

  return 'http';
}

/**
 * Detailed feature matrix for each supported protocol
 * @group protocols
 * @title PROTOCOL_FEATURES
 * @description Comparison matrix showing capabilities like resumability and chunking.
 */
export const PROTOCOL_FEATURES = {
  http: {
    resumable: 'conditional',
    chunking: true,
    support: 'universal',
  },
  tus: {
    resumable: 'native',
    chunking: true,
    support: 'universal',
  },
  websocket: {
    resumable: 'native',
    chunking: true,
    support: 'modern',
  },
  webtransport: {
    resumable: 'native',
    chunking: true,
    support: 'bleeding-edge',
  },
} as const;

/**
 * Check if a specific protocol is supported in the current environment
 * @param protocol - The protocol to check
 * @returns True if the protocol is supported
 * @group protocols
 * @title isProtocolSupported
 * @description Verifies if the browser environment supports the required APIs for a given protocol.
 */
export function isProtocolSupported(protocol: UploadProtocol): boolean {
  switch (protocol) {
    case 'http':
    case 'tus':
      return true;

    case 'websocket':
      return 'WebSocket' in window;

    case 'webtransport':
      return isWebTransportSupported();

    default:
      return false;
  }
}

/**
 * Get a list of all protocols supported by the current environment
 * @returns Array of supported UploadProtocol values
 * @group protocols
 * @title getSupportedProtocols
 * @description Returns all protocols that can be used in the current browser or environment.
 */
export function getSupportedProtocols(): UploadProtocol[] {
  const protocols: UploadProtocol[] = ['http', 'tus'];

  if ('WebSocket' in window) {
    protocols.push('websocket');
  }

  if (isWebTransportSupported()) {
    protocols.push('webtransport');
  }

  return protocols;
}

/**
 * Detailed comparison result for a protocol
 * @group protocols
 * @title ProtocolComparison
 * @internal
 */
export interface ProtocolComparison {
  protocol: UploadProtocol;
  score: number;
  reasons: string[];
  supported: boolean;
}

/**
 * Compare and rank protocols for a specific set of requirements
 * @param fileSize - Size of the file in bytes
 * @param requirements - Optional set of functional requirements
 * @returns An array of ProtocolComparison objects sorted by score
 * @group protocols
 * @title compareProtocols
 * @description Ranks available protocols based on their suitability for a specific upload scenario.
 */
export function compareProtocols(
  fileSize: number,
  requirements: {
    needsResumability?: boolean;
  } = {},
): ProtocolComparison[] {
  const protocols: UploadProtocol[] = ['http', 'tus', 'websocket', 'webtransport'];

  const comparisons: ProtocolComparison[] = protocols.map((protocol) => {
    const features = PROTOCOL_FEATURES[protocol as keyof typeof PROTOCOL_FEATURES];
    const supported = isProtocolSupported(protocol);
    const reasons: string[] = [];
    let score = 0;

    if (supported) {
      score += 10;
      reasons.push('Supported in browser');
    } else {
      reasons.push('Not supported in browser');
      return { protocol, score: 0, reasons, supported };
    }

    if (fileSize > 100 * 1024 * 1024) {
      if (protocol === 'tus') {
        score += 20;
        reasons.push('Optimized for large files');
      }
      if (features.resumable === 'native') {
        score += 15;
        reasons.push('Native resumability important for large files');
      }
    }

    if (requirements.needsResumability) {
      if (features.resumable === 'native') {
        score += 20;
        reasons.push('Supports native resumability');
      } else if (features.resumable === 'conditional') {
        score += 10;
        reasons.push('Supports resumability when chunked');
      }
    }

    if (protocol === 'webtransport') {
      score += 10;
      reasons.push('Best performance (HTTP/3 + QUIC)');
    }

    return { protocol, score, reasons, supported };
  });

  return comparisons.sort((a, b) => b.score - a.score);
}

/**
 * Example usage guide
 */
export const PROTOCOL_USAGE_EXAMPLES = {
  tus: `
    const uploader = useUploader({
      protocol: 'tus',
      tus: {
        endpoint: 'https://api.example.com/files',
        chunkSize: 1024 * 1024,
      }
    });
  `,

  websocket: `
    const uploader = useUploader({
      protocol: 'websocket',
      websocket: {
        url: 'wss://api.example.com/upload',
        chunkSize: 64 * 1024,
        reconnect: true
      }
    });
  `,

  webtransport: `
    const uploader = useUploader({
      protocol: 'webtransport',
      webtransport: {
        url: 'https://api.example.com:4433/upload',
        bidirectionalStreams: true,
        congestionControl: 'throughput'
      }
    });
  `,
};
