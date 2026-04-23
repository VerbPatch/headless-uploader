---
title: HttpConfig
description: Configuration options for standard HTTP-based uploads (Multipart or Chunked).
---

# HttpConfig

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:63](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L63)

HTTP Protocol Configuration

## Properties

### enableChunking?

> `optional` **enableChunking?**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:89](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L89)

Whether to split files into smaller chunks.
Recommended for files > 10MB to avoid server timeouts.

#### Default

```ts
false
```

***

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:68](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L68)

The server endpoint for uploads.
Defaults to `/upload` if not specified.

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:78](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L78)

Static custom headers for every request.
For dynamic headers, use `onBeforeRequest` in the main config.

***

### maxConcurrentChunks?

> `optional` **maxConcurrentChunks?**: `number`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:95](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L95)

Maximum number of chunks to upload at the same time for a single file.
Higher values increase speed but consume more bandwidth and memory.

#### Default

```ts
3
```

***

### method?

> `optional` **method?**: [`HttpMethod`](/uploader/docs/api/Types/HttpMethod)

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:73](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L73)

The HTTP method to use.

#### Default

```ts
'POST'
```

***

### withCredentials?

> `optional` **withCredentials?**: `boolean`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:83](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L83)

Whether to send cookies and authentication headers in cross-origin requests.

#### Default

```ts
false
```
