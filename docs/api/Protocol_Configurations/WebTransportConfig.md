---
title: WebTransportConfig
description: Configuration for the modern WebTransport protocol (HTTP/3 + QUIC).
---

# WebTransportConfig

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:152](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/types/protocolTypes.ts#L152)

WebTransport Configuration

## Properties

### allowPooling

> **allowPooling**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:169](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/types/protocolTypes.ts#L169)

Whether to allow pooling multiple sessions over a single connection.

#### Default

```ts
true
```

***

### bidirectionalStreams

> **bidirectionalStreams**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:179](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/types/protocolTypes.ts#L179)

Whether to use bidirectional streams (allows server to send ACKs).

#### Default

```ts
true
```

***

### congestionControl

> **congestionControl**: `"default"` \| `"throughput"` \| `"low-latency"`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:174](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/types/protocolTypes.ts#L174)

Congestion control preference.

#### Default

```ts
'default'
```

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:181](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/types/protocolTypes.ts#L181)

Optional static metadata sent during stream initialization

***

### onClosed?

> `optional` **onClosed?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:185](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/types/protocolTypes.ts#L185)

Callback fired when the transport session is closed

#### Returns

`void`

***

### onReady?

> `optional` **onReady?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:183](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/types/protocolTypes.ts#L183)

Callback fired when the WebTransport session is ready for data

#### Returns

`void`

***

### serverCertificateHashes?

> `optional` **serverCertificateHashes?**: `object`[]

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:161](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/types/protocolTypes.ts#L161)

SHA-256 hashes of server certificates for self-signed development environments.

#### algorithm

> **algorithm**: `string`

#### value

> **value**: `BufferSource`

***

### url

> **url**: `string`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:157](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/types/protocolTypes.ts#L157)

The WebTransport server URL.
Must use the `https` scheme and support HTTP/3.
