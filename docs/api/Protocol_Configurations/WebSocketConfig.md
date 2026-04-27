---
title: WebSocketConfig
description: Configuration for uploading files over a persistent WebSocket connection.
---

# WebSocketConfig

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:121](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/types/protocolTypes.ts#L121)

WebSocket Configuration

## Properties

### binaryType

> **binaryType**: `"blob"` \| `"arraybuffer"`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:135](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/types/protocolTypes.ts#L135)

Preferred binary type for data transfer.

#### Default

```ts
'blob'
```

***

### heartbeatInterval

> **heartbeatInterval**: `number`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:130](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/types/protocolTypes.ts#L130)

Interval for sending heartbeat messages to keep connection alive.

#### Default

```ts
30000
```

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:137](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/types/protocolTypes.ts#L137)

Optional static metadata sent during the initial handshake

***

### onClose?

> `optional` **onClose?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:141](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/types/protocolTypes.ts#L141)

Callback fired when the WebSocket connection closes

#### Returns

`void`

***

### onError?

> `optional` **onError?**: (`error`) => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:143](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/types/protocolTypes.ts#L143)

Callback fired on connection-level errors

#### Parameters

##### error

`Event`

#### Returns

`void`

***

### onOpen?

> `optional` **onOpen?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:139](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/types/protocolTypes.ts#L139)

Callback fired when the WebSocket connection opens successfully

#### Returns

`void`

***

### protocols?

> `optional` **protocols?**: `string` \| `string`[]

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:125](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/types/protocolTypes.ts#L125)

Sub-protocols to use during handshake

***

### url

> **url**: `string`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:123](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/types/protocolTypes.ts#L123)

The WebSocket server URL (e.g., `wss://api.example.com/upload`)
