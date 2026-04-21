---
title: WebTransportConfig
description: Configuration options for the modern WebTransport protocol.
---

# WebTransportConfig

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:132](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L132)

WebTransport Configuration

## Properties

### allowPooling

> **allowPooling**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:141](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L141)

Whether to allow connection pooling

***

### bidirectionalStreams

> **bidirectionalStreams**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:145](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L145)

Whether to use bidirectional streams

***

### congestionControl

> **congestionControl**: `"default"` \| `"throughput"` \| `"low-latency"`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:143](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L143)

Congestion control strategy

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:147](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L147)

Optional metadata to send during initialization

***

### onClosed?

> `optional` **onClosed?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:151](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L151)

Callback fired when the transport is closed

#### Returns

`void`

***

### onReady?

> `optional` **onReady?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:149](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L149)

Callback fired when the transport is ready

#### Returns

`void`

***

### serverCertificateHashes?

> `optional` **serverCertificateHashes?**: `object`[]

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:136](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L136)

Certificate hashes for server validation

#### algorithm

> **algorithm**: `string`

#### value

> **value**: `BufferSource`

***

### url

> **url**: `string`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:134](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L134)

The WebTransport server URL (must be HTTPS)
