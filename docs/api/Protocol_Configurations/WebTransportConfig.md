---
title: WebTransportConfig
description: Configuration for the modern WebTransport protocol (HTTP/3 + QUIC).
---

# WebTransportConfig

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:165](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L165)

WebTransport Configuration

## Properties

### allowPooling

> **allowPooling**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:182](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L182)

Whether to allow pooling multiple sessions over a single connection.

#### Default

```ts
true
```

***

### bidirectionalStreams

> **bidirectionalStreams**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:192](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L192)

Whether to use bidirectional streams (allows server to send ACKs).

#### Default

```ts
true
```

***

### congestionControl

> **congestionControl**: `"default"` \| `"throughput"` \| `"low-latency"`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:187](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L187)

Congestion control preference.

#### Default

```ts
'default'
```

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:194](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L194)

Optional static metadata sent during stream initialization

***

### onClosed?

> `optional` **onClosed?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:198](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L198)

Callback fired when the transport session is closed

#### Returns

`void`

***

### onReady?

> `optional` **onReady?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:196](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L196)

Callback fired when the WebTransport session is ready for data

#### Returns

`void`

***

### serverCertificateHashes?

> `optional` **serverCertificateHashes?**: `object`[]

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:174](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L174)

SHA-256 hashes of server certificates for self-signed development environments.

#### algorithm

> **algorithm**: `string`

#### value

> **value**: `BufferSource`

***

### url

> **url**: `string`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:170](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L170)

The WebTransport server URL.
Must use the `https` scheme and support HTTP/3.
