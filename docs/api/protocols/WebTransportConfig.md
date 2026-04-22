---
title: WebTransportConfig
description: Configuration options for the modern WebTransport protocol.
---

# WebTransportConfig

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:120](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L120)

WebTransport Configuration

## Properties

### allowPooling

> **allowPooling**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:129](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L129)

Whether to allow connection pooling

***

### bidirectionalStreams

> **bidirectionalStreams**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:133](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L133)

Whether to use bidirectional streams

***

### congestionControl

> **congestionControl**: `"default"` \| `"throughput"` \| `"low-latency"`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:131](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L131)

Congestion control strategy

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:135](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L135)

Optional metadata to send during initialization

***

### onClosed?

> `optional` **onClosed?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:139](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L139)

Callback fired when the transport is closed

#### Returns

`void`

***

### onReady?

> `optional` **onReady?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:137](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L137)

Callback fired when the transport is ready

#### Returns

`void`

***

### serverCertificateHashes?

> `optional` **serverCertificateHashes?**: `object`[]

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:124](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L124)

Certificate hashes for server validation

#### algorithm

> **algorithm**: `string`

#### value

> **value**: `BufferSource`

***

### url

> **url**: `string`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:122](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L122)

The WebTransport server URL (must be HTTPS)
