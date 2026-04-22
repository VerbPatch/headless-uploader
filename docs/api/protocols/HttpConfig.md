---
title: HttpConfig
description: Configuration options for standard HTTP-based uploads.
---

# HttpConfig

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:57](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L57)

HTTP Protocol Configuration

## Properties

### enableChunking?

> `optional` **enableChunking?**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:67](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L67)

Whether to enable file chunking for large files

***

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:59](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L59)

The server endpoint for uploads

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:63](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L63)

Custom headers for the request

***

### maxConcurrentChunks?

> `optional` **maxConcurrentChunks?**: `number`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:69](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L69)

Maximum number of concurrent chunk uploads

***

### method?

> `optional` **method?**: [`HttpMethod`](/uploader/docs/api/types/HttpMethod)

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:61](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L61)

The HTTP method to use (POST, PUT, PATCH)

***

### withCredentials?

> `optional` **withCredentials?**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:65](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/protocolTypes.ts#L65)

Whether to send credentials with the request
