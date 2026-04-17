---
title: WebSocketConfig
description: Configuration options for uploading files via WebSockets.
---

# WebSocketConfig

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:94](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/protocolTypes.ts#L94)

WebSocket Configuration

## Properties

### binaryType

> **binaryType**: `"blob"` \| `"arraybuffer"`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:108](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/protocolTypes.ts#L108)

Preferred binary type for data transfer

***

### heartbeatInterval

> **heartbeatInterval**: `number`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:106](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/protocolTypes.ts#L106)

Interval for sending heartbeat messages in milliseconds

***

### maxReconnectAttempts

> **maxReconnectAttempts**: `number`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:104](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/protocolTypes.ts#L104)

Maximum number of reconnection attempts

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:110](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/protocolTypes.ts#L110)

Optional metadata to send during initialization

***

### onClose?

> `optional` **onClose?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:114](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/protocolTypes.ts#L114)

Callback fired when the connection closes

#### Returns

`void`

***

### onError?

> `optional` **onError?**: (`error`) => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:116](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/protocolTypes.ts#L116)

Callback fired on connection error

#### Parameters

##### error

`Event`

#### Returns

`void`

***

### onOpen?

> `optional` **onOpen?**: () => `void`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:112](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/protocolTypes.ts#L112)

Callback fired when the connection opens

#### Returns

`void`

***

### protocols?

> `optional` **protocols?**: `string` \| `string`[]

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:98](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/protocolTypes.ts#L98)

WebSocket sub-protocols

***

### reconnect

> **reconnect**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:100](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/protocolTypes.ts#L100)

Whether to automatically reconnect on disconnection

***

### reconnectDelay

> **reconnectDelay**: `number`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:102](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/protocolTypes.ts#L102)

Delay between reconnection attempts in milliseconds

***

### url

> **url**: `string`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:96](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/protocolTypes.ts#L96)

The WebSocket server URL
