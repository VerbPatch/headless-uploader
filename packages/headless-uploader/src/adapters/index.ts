import type { ProtocolAdapter, ProtocolFactoryConfig, UploadProtocol } from '../types';
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
        throw new Error('HTTP configuration is required');
      }
      return createHttpAdapter(config.http);

    case 'tus':
      if (!config.tus) {
        throw new Error('TUS configuration is required');
      }
      return createTusAdapter(config.tus);

    case 'websocket':
      if (!config.websocket) {
        throw new Error('WebSocket configuration is required');
      }
      return createWebSocketAdapter(config.websocket);

    case 'webtransport':
      if (!isWebTransportSupported()) {
        throw new Error('WebTransport is not supported in this browser');
      }
      if (!config.webtransport) {
        throw new Error('WebTransport configuration is required');
      }
      return createWebTransportAdapter(config.webtransport);

    default:
      throw new Error(`Unknown protocol: ${config.protocol}`);
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

  // Very large files (>100MB) - Use TUS
  if (fileSize > 100 * 1024 * 1024) {
    return 'tus';
  }

  // Medium files (10MB-100MB) - Use modern protocols if available
  if (fileSize > 10 * 1024 * 1024) {
    if (caps.supportsWebTransport) {
      return 'webtransport'; // Best performance
    }
    return 'tus'; // Fallback with resumability
  }

  // Small files (<10MB) - Any protocol works
  if (caps.supportsWebTransport) {
    return 'webtransport'; // Best performance
  }

  if (caps.supportsWebSocket) {
    return 'websocket'; // Real-time feedback
  }

  return 'http'; // Standard HTTP fallback
}

/**
 * Detailed feature matrix for each supported protocol
 * @group protocols
 * @title PROTOCOL_FEATURES
 * @description Comparison matrix showing capabilities like resumability, streaming, and real-time support.
 */
export const PROTOCOL_FEATURES = {
  http: {
    resumable: false,
    streaming: false,
    bidirectional: false,
    realtime: false,
    chunking: true,
    support: 'universal',
  },
  tus: {
    resumable: true,
    streaming: false,
    bidirectional: false,
    realtime: false,
    chunking: true,
    support: 'universal',
  },
  websocket: {
    resumable: false,
    streaming: true,
    bidirectional: true,
    realtime: true,
    chunking: true,
    support: 'modern',
  },
  webtransport: {
    resumable: false,
    streaming: true,
    bidirectional: true,
    realtime: true,
    chunking: true,
    support: 'bleeding-edge', // Chrome 97+, Edge 97+
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
    needsRealtime?: boolean;
    needsBidirectional?: boolean;
    needsStreaming?: boolean;
  } = {},
): ProtocolComparison[] {
  const protocols: UploadProtocol[] = ['http', 'tus', 'websocket', 'webtransport'];

  const comparisons: ProtocolComparison[] = protocols.map((protocol) => {
    const features = PROTOCOL_FEATURES[protocol];
    const supported = isProtocolSupported(protocol);
    const reasons: string[] = [];
    let score = 0;

    // Base score for support
    if (supported) {
      score += 10;
      reasons.push('Supported in browser');
    } else {
      reasons.push('Not supported in browser');
      return { protocol, score: 0, reasons, supported };
    }

    // File size considerations
    if (fileSize > 100 * 1024 * 1024) {
      if (protocol === 'tus') {
        score += 20;
        reasons.push('Optimized for large files');
      }
      if (features.resumable) {
        score += 15;
        reasons.push('Resumability important for large files');
      }
    }

    // Requirements
    if (requirements.needsResumability && features.resumable) {
      score += 20;
      reasons.push('Supports resumability');
    }

    if (requirements.needsRealtime && features.realtime) {
      score += 15;
      reasons.push('Supports real-time feedback');
    }

    if (requirements.needsBidirectional && features.bidirectional) {
      score += 15;
      reasons.push('Supports bidirectional communication');
    }

    if (requirements.needsStreaming && features.streaming) {
      score += 10;
      reasons.push('Supports streaming');
    }

    // Performance bonuses
    if (protocol === 'webtransport') {
      score += 10;
      reasons.push('Best performance (HTTP/3 + QUIC)');
    }

    return { protocol, score, reasons, supported };
  });

  // Sort by score descending
  return comparisons.sort((a, b) => b.score - a.score);
}

/**
 * Example usage guide
 */
export const PROTOCOL_USAGE_EXAMPLES = {
  tus: `
    // TUS - Resumable uploads
    const adapter = createProtocolAdapter({
      protocol: 'tus',
      tus: {
        endpoint: 'https://api.example.com/files',
        chunkSize: 1024 * 1024, // 1MB
        resumable: true
      }
    });
  `,

  websocket: `
    // WebSocket - Real-time streaming
    const adapter = createProtocolAdapter({
      protocol: 'websocket',
      websocket: {
        url: 'wss://api.example.com/upload',
        chunkSize: 64 * 1024, // 64KB for real-time
        reconnect: true
      }
    });
  `,

  webtransport: `
    // WebTransport - Cutting-edge low-latency
    const adapter = createProtocolAdapter({
      protocol: 'webtransport',
      webtransport: {
        url: 'https://api.example.com:4433/upload',
        bidirectionalStreams: true,
        congestionControl: 'throughput'
      }
    });
  `,
};
