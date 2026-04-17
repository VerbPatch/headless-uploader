---
title: WebTransportConfig
description: Configuration options for the modern WebTransport protocol.
---

# WebTransportConfig

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:125

WebTransport Configuration

## Properties

### allowPooling

> **allowPooling**: `boolean`

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:134

Whether to allow connection pooling

***

### bidirectionalStreams

> **bidirectionalStreams**: `boolean`

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:138

Whether to use bidirectional streams

***

### congestionControl

> **congestionControl**: `"default"` \| `"throughput"` \| `"low-latency"`

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:136

Congestion control strategy

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:140

Optional metadata to send during initialization

***

### onClosed?

> `optional` **onClosed?**: () => `void`

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:144

Callback fired when the transport is closed

#### Returns

`void`

***

### onReady?

> `optional` **onReady?**: () => `void`

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:142

Callback fired when the transport is ready

#### Returns

`void`

***

### serverCertificateHashes?

> `optional` **serverCertificateHashes?**: `object`[]

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:129

Certificate hashes for server validation

#### algorithm

> **algorithm**: `string`

#### value

> **value**: `BufferSource`

***

### url

> **url**: `string`

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:127

The WebTransport server URL (must be HTTPS)
