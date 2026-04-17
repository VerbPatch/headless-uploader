---
title: WebSocketConfig
description: Configuration options for uploading files via WebSockets.
---

# WebSocketConfig

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:94

WebSocket Configuration

## Properties

### binaryType

> **binaryType**: `"blob"` \| `"arraybuffer"`

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:108

Preferred binary type for data transfer

***

### heartbeatInterval

> **heartbeatInterval**: `number`

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:106

Interval for sending heartbeat messages in milliseconds

***

### maxReconnectAttempts

> **maxReconnectAttempts**: `number`

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:104

Maximum number of reconnection attempts

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:110

Optional metadata to send during initialization

***

### onClose?

> `optional` **onClose?**: () => `void`

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:114

Callback fired when the connection closes

#### Returns

`void`

***

### onError?

> `optional` **onError?**: (`error`) => `void`

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:116

Callback fired on connection error

#### Parameters

##### error

`Event`

#### Returns

`void`

***

### onOpen?

> `optional` **onOpen?**: () => `void`

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:112

Callback fired when the connection opens

#### Returns

`void`

***

### protocols?

> `optional` **protocols?**: `string` \| `string`[]

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:98

WebSocket sub-protocols

***

### reconnect

> **reconnect**: `boolean`

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:100

Whether to automatically reconnect on disconnection

***

### reconnectDelay

> **reconnectDelay**: `number`

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:102

Delay between reconnection attempts in milliseconds

***

### url

> **url**: `string`

Defined in: packages/headless-uploader/src/types/protocolTypes.ts:96

The WebSocket server URL
