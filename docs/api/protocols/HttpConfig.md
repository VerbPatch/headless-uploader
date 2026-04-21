---
title: HttpConfig
description: Configuration options for standard HTTP-based uploads.
---

# HttpConfig

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:69](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L69)

HTTP Protocol Configuration

## Properties

### enableChunking?

> `optional` **enableChunking?**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:79](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L79)

Whether to enable file chunking for large files

***

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:71](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L71)

The server endpoint for uploads

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:75](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L75)

Custom headers for the request

***

### maxConcurrentChunks?

> `optional` **maxConcurrentChunks?**: `number`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:81](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L81)

Maximum number of concurrent chunk uploads

***

### method?

> `optional` **method?**: [`HttpMethod`](/uploader/docs/api/types/HttpMethod)

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:73](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L73)

The HTTP method to use (POST, PUT, PATCH)

***

### withCredentials?

> `optional` **withCredentials?**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:77](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/protocolTypes.ts#L77)

Whether to send credentials with the request
