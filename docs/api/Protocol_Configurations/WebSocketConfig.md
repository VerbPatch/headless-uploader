---
title: WebSocketConfig
description: Configuration for uploading files over a persistent WebSocket connection.
---

# WebSocketConfig

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:119](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L119)

WebSocket Configuration

## Properties

### binaryType

> **binaryType**: `"blob"` \| `"arraybuffer"`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:148](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L148)

Preferred binary type for data transfer.

#### Default

```ts
'blob'
```

***

### heartbeatInterval

> **heartbeatInterval**: `number`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:143](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L143)

Interval for sending heartbeat messages to keep connection alive.

#### Default

```ts
30000
```

***

### maxReconnectAttempts

> **maxReconnectAttempts**: `number`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:138](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L138)

Maximum number of reconnection attempts before failing.

#### Default

```ts
5
```

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:150](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L150)

Optional static metadata sent during the initial handshake

***

### onClose?

> `optional` **onClose?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:154](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L154)

Callback fired when the WebSocket connection closes

#### Returns

`void`

***

### onError?

> `optional` **onError?**: (`error`) => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:156](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L156)

Callback fired on connection-level errors

#### Parameters

##### error

`Event`

#### Returns

`void`

***

### onOpen?

> `optional` **onOpen?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:152](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L152)

Callback fired when the WebSocket connection opens successfully

#### Returns

`void`

***

### protocols?

> `optional` **protocols?**: `string` \| `string`[]

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:123](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L123)

Sub-protocols to use during handshake

***

### reconnect

> **reconnect**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:128](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L128)

Whether to automatically reconnect if the connection drops.

#### Default

```ts
true
```

***

### reconnectDelay

> **reconnectDelay**: `number`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:133](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L133)

Delay in milliseconds before attempting to reconnect.

#### Default

```ts
3000
```

***

### url

> **url**: `string`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:121](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L121)

The WebSocket server URL (e.g., `wss://api.example.com/upload`)
