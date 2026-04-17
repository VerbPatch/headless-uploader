---
title: WebTransportConfig
description: Configuration options for the modern WebTransport protocol.
---

# WebTransportConfig

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:125](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/protocolTypes.ts#L125)

WebTransport Configuration

## Properties

### allowPooling

> **allowPooling**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:134](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/protocolTypes.ts#L134)

Whether to allow connection pooling

***

### bidirectionalStreams

> **bidirectionalStreams**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:138](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/protocolTypes.ts#L138)

Whether to use bidirectional streams

***

### congestionControl

> **congestionControl**: `"default"` \| `"throughput"` \| `"low-latency"`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:136](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/protocolTypes.ts#L136)

Congestion control strategy

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:140](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/protocolTypes.ts#L140)

Optional metadata to send during initialization

***

### onClosed?

> `optional` **onClosed?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:144](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/protocolTypes.ts#L144)

Callback fired when the transport is closed

#### Returns

`void`

***

### onReady?

> `optional` **onReady?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:142](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/protocolTypes.ts#L142)

Callback fired when the transport is ready

#### Returns

`void`

***

### serverCertificateHashes?

> `optional` **serverCertificateHashes?**: `object`[]

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:129](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/protocolTypes.ts#L129)

Certificate hashes for server validation

#### algorithm

> **algorithm**: `string`

#### value

> **value**: `BufferSource`

***

### url

> **url**: `string`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:127](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/protocolTypes.ts#L127)

The WebTransport server URL (must be HTTPS)
