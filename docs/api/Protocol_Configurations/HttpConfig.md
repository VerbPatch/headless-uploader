---
title: HttpConfig
description: Configuration options for standard HTTP-based uploads (Multipart or Chunked).
---

# HttpConfig

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:65](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/protocolTypes.ts#L65)

HTTP Protocol Configuration

## Properties

### enableChunking?

> `optional` **enableChunking?**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:91](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/protocolTypes.ts#L91)

Whether to split files into smaller chunks.
Recommended for files > 10MB to avoid server timeouts.

#### Default

```ts
false
```

***

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:70](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/protocolTypes.ts#L70)

The server endpoint for uploads.
Defaults to `/upload` if not specified.

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:80](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/protocolTypes.ts#L80)

Static custom headers for every request.
For dynamic headers, use `onBeforeRequest` in the main config.

***

### maxConcurrentChunks?

> `optional` **maxConcurrentChunks?**: `number`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:97](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/protocolTypes.ts#L97)

Maximum number of chunks to upload at the same time for a single file.
Higher values increase speed but consume more bandwidth and memory.

#### Default

```ts
3
```

***

### method?

> `optional` **method?**: [`HttpMethod`](/uploader/docs/api/Types/HttpMethod)

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:75](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/protocolTypes.ts#L75)

The HTTP method to use.

#### Default

```ts
'POST'
```

***

### withCredentials?

> `optional` **withCredentials?**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:85](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/protocolTypes.ts#L85)

Whether to send cookies and authentication headers in cross-origin requests.

#### Default

```ts
false
```
