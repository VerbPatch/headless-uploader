import type { ProtocolAdapter, ProtocolFactoryConfig, UploadProtocol, CloudAdapter } from '../types';
import { createHttpAdapter } from './http';
import { createTusAdapter } from './tus';
import { createWebSocketAdapter } from './websocket';
import { createWebTransportAdapter, isWebTransportSupported } from './webtransport';

export * from './cloud';

/**
 * Creates a wrapper that adapts a CloudAdapter to the ProtocolAdapter interface
 * @internal
 */
function createCloudProtocolWrapper(cloudAdapter: CloudAdapter): ProtocolAdapter {
  return {
    name: cloudAdapter.name,
    protocol: 'cloud',

    async initialize() {
      // Cloud adapters usually don't need explicit initialization at connection level
    },

    async upload(file, config) {
      try {
        const response = await cloudAdapter.upload(file, config);
        return {
          success: true,
          response,
          bytesUploaded: file.file.size,
        };
      } catch (error) {
        return {
          success: false,
          error: error as Error,
          bytesUploaded: file.progress.loaded,
        };
      }
    },

    async pause(fileId) {
      if (cloudAdapter.abortUpload) {
        await cloudAdapter.abortUpload(fileId);
      }
    },

    async resume(file, config) {
      return this.upload(file, config);
    },

    async cancel(fileId) {
      if (cloudAdapter.abortUpload) {
        await cloudAdapter.abortUpload(fileId);
      }
    },
  };
}

/**
 * Create a protocol adapter based on the provided configuration
 * @param config - The configuration for the protocol factory
 * @returns A protocol adapter instance
 * @group protocols
 * @title createProtocolAdapter
 * @description Factory function that instantiates the appropriate adapter (HTTP, TUS, WebSocket, WebTransport, or Cloud).
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

    case 'cloud':
      if (!config.cloudAdapter) {
        throw new Error('Cloud adapter is required when protocol is set to "cloud"');
      }
      return createCloudProtocolWrapper(config.cloudAdapter);

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
 * @description Comparison matrix showing capabilities like resumability and chunking.
 */
export const PROTOCOL_FEATURES = {
  http: {
    resumable: 'conditional', // Only if chunking is enabled
    chunking: true,
    support: 'universal',
  },
  tus: {
    resumable: 'native',
    chunking: true,
    support: 'universal',
  },
  websocket: {
    resumable: 'native', // Internal chunking supports pause/resume
    chunking: true,
    support: 'modern',
  },
  webtransport: {
    resumable: 'native', // Internal streaming supports pause/resume
    chunking: true,
    support: 'bleeding-edge', // Chrome 97+, Edge 97+, Firefox 114+
  },
  cloud: {
    resumable: 'no', // Simple PUT uploads, usually not resumable on client side
    chunking: false,
    support: 'universal',
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
    case 'cloud':
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
  const protocols: UploadProtocol[] = ['http', 'tus', 'cloud'];

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
  const protocols: UploadProtocol[] = ['http', 'tus', 'websocket', 'webtransport', 'cloud'];

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
      if (features.resumable === 'native') {
        score += 15;
        reasons.push('Native resumability important for large files');
      }
    }

    // Requirements
    if (requirements.needsResumability) {
      if (features.resumable === 'native') {
        score += 20;
        reasons.push('Supports native resumability');
      } else if (features.resumable === 'conditional') {
        score += 10;
        reasons.push('Supports resumability when chunked');
      }
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
    const uploader = useUploader({
      protocol: 'tus',
      tus: {
        endpoint: 'https://api.example.com/files',
        chunkSize: 1024 * 1024, // 1MB
      }
    });
  `,

  websocket: `
    // WebSocket - Real-time streaming
    const uploader = useUploader({
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
    const uploader = useUploader({
      protocol: 'webtransport',
      webtransport: {
        url: 'https://api.example.com:4433/upload',
        bidirectionalStreams: true,
        congestionControl: 'throughput'
      }
    });
  `,
  
  cloud: `
    // Cloud - Direct S3/Azure/GCS
    const uploader = useUploader({
      protocol: 'cloud',
      cloudAdapter: createS3Adapter({
        getUploadUrl: async (file) => {
           // ...
        }
      })
    });
  `
};
