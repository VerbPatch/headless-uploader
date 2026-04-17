---
title: HttpConfig
description: Configuration options for standard HTTP-based uploads.
---

# HttpConfig

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:62](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/protocolTypes.ts#L62)

HTTP Protocol Configuration

## Properties

### enableChunking?

> `optional` **enableChunking?**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:72](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/protocolTypes.ts#L72)

Whether to enable file chunking for large files

***

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:64](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/protocolTypes.ts#L64)

The server endpoint for uploads

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:68](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/protocolTypes.ts#L68)

Custom headers for the request

***

### maxConcurrentChunks?

> `optional` **maxConcurrentChunks?**: `number`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:74](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/protocolTypes.ts#L74)

Maximum number of concurrent chunk uploads

***

### method?

> `optional` **method?**: [`HttpMethod`](/uploader/docs/api/types/HttpMethod)

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:66](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/protocolTypes.ts#L66)

The HTTP method to use (POST, PUT, PATCH)

***

### withCredentials?

> `optional` **withCredentials?**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:70](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/protocolTypes.ts#L70)

Whether to send credentials with the request
