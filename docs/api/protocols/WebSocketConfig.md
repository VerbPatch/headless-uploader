---
title: WebSocketConfig
description: Configuration options for uploading files via WebSockets.
---

# WebSocketConfig

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:101](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L101)

WebSocket Configuration

## Properties

### binaryType

> **binaryType**: `"blob"` \| `"arraybuffer"`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:115](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L115)

Preferred binary type for data transfer

***

### heartbeatInterval

> **heartbeatInterval**: `number`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:113](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L113)

Interval for sending heartbeat messages in milliseconds

***

### maxReconnectAttempts

> **maxReconnectAttempts**: `number`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:111](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L111)

Maximum number of reconnection attempts

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:117](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L117)

Optional metadata to send during initialization

***

### onClose?

> `optional` **onClose?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:121](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L121)

Callback fired when the connection closes

#### Returns

`void`

***

### onError?

> `optional` **onError?**: (`error`) => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:123](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L123)

Callback fired on connection error

#### Parameters

##### error

`Event`

#### Returns

`void`

***

### onOpen?

> `optional` **onOpen?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:119](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L119)

Callback fired when the connection opens

#### Returns

`void`

***

### protocols?

> `optional` **protocols?**: `string` \| `string`[]

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:105](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L105)

WebSocket sub-protocols

***

### reconnect

> **reconnect**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:107](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L107)

Whether to automatically reconnect on disconnection

***

### reconnectDelay

> **reconnectDelay**: `number`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:109](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L109)

Delay between reconnection attempts in milliseconds

***

### url

> **url**: `string`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:103](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L103)

The WebSocket server URL
