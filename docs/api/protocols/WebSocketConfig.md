---
title: WebSocketConfig
description: Configuration options for uploading files via WebSockets.
---

# WebSocketConfig

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:89](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L89)

WebSocket Configuration

## Properties

### binaryType

> **binaryType**: `"blob"` \| `"arraybuffer"`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:103](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L103)

Preferred binary type for data transfer

***

### heartbeatInterval

> **heartbeatInterval**: `number`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:101](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L101)

Interval for sending heartbeat messages in milliseconds

***

### maxReconnectAttempts

> **maxReconnectAttempts**: `number`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:99](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L99)

Maximum number of reconnection attempts

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:105](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L105)

Optional metadata to send during initialization

***

### onClose?

> `optional` **onClose?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:109](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L109)

Callback fired when the connection closes

#### Returns

`void`

***

### onError?

> `optional` **onError?**: (`error`) => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:111](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L111)

Callback fired on connection error

#### Parameters

##### error

`Event`

#### Returns

`void`

***

### onOpen?

> `optional` **onOpen?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:107](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L107)

Callback fired when the connection opens

#### Returns

`void`

***

### protocols?

> `optional` **protocols?**: `string` \| `string`[]

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:93](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L93)

WebSocket sub-protocols

***

### reconnect

> **reconnect**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:95](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L95)

Whether to automatically reconnect on disconnection

***

### reconnectDelay

> **reconnectDelay**: `number`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:97](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L97)

Delay between reconnection attempts in milliseconds

***

### url

> **url**: `string`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:91](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L91)

The WebSocket server URL
