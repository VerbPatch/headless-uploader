---
title: UploaderConfig
description: The primary configuration object for initializing the uploader.
---

# UploaderConfig

Defined in: [packages/headless-uploader/src/types/uploader.ts:273](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L273)

Main uploader configuration

## Example

```typescript
const config: UploaderConfig = {
  maxFileSize: 5 * 1024 * 1024,
  autoUpload: true,
  http: { endpoint: '/api/upload' },
  onUploadSuccess: (file, response) => {
    console.log(`${file.metadata.name} is safe on the server!`);
  }
};
```

## Properties

### acceptedTypes?

> `optional` **acceptedTypes?**: `string`[]

Defined in: [packages/headless-uploader/src/types/uploader.ts:292](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L292)

Allowed MIME types or extensions (e.g. `['image/*', '.pdf']`)

***

### allowDuplicates?

> `optional` **allowDuplicates?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:294](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L294)

Whether to allow adding the same file multiple times to the queue

***

### autoRetry?

> `optional` **autoRetry?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:305](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L305)

Whether to automatically retry failed uploads

***

### autoUpload?

> `optional` **autoUpload?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:300](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L300)

Whether to start uploading immediately when files are added

***

### chunkSize?

> `optional` **chunkSize?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:297](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L297)

Size of each chunk in bytes for protocols that support chunking

***

### compression?

> `optional` **compression?**: [`CompressionOptions`](/uploader/docs/api/Types/CompressionOptions)

Defined in: [packages/headless-uploader/src/types/uploader.ts:310](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L310)

Options for client-side image compression before upload

***

### customValidator?

> `optional` **customValidator?**: (`file`) => `Promise`\<[`ValidationResult`](/uploader/docs/api/validation/ValidationResult)\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:330](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L330)

Function for custom file validation logic (local or remote)

#### Parameters

##### file

`File`

#### Returns

`Promise`\<[`ValidationResult`](/uploader/docs/api/validation/ValidationResult)\>

***

### debug?

> `optional` **debug?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:325](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L325)

Whether to enable debug logging

***

### enablePreviews?

> `optional` **enablePreviews?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:312](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L312)

Whether to generate local preview URLs for media files

***

### extractMetadata?

> `optional` **extractMetadata?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:319](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L319)

Whether to extract extended metadata like dimensions or duration

***

### http?

> `optional` **http?**: [`HttpConfig`](/uploader/docs/api/Protocol_Configurations/HttpConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:277](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L277)

Configuration for standard HTTP multipart/chunked uploads

***

### maxConcurrent?

> `optional` **maxConcurrent?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:302](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L302)

Maximum number of files to transmit simultaneously

***

### maxFiles?

> `optional` **maxFiles?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:286](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L286)

Maximum number of files allowed in the queue at once

***

### maxFileSize?

> `optional` **maxFileSize?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:288](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L288)

Maximum allowed size for a single file in bytes

***

### minFileSize?

> `optional` **minFileSize?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:290](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L290)

Minimum required size for a single file in bytes

***

### onAllComplete?

> `optional` **onAllComplete?**: (`files`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:393](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L393)

Callback fired when all files in the uploader have finished (success or failure).
Fires reliably even in `autoUpload` mode once the engine becomes idle.

#### Parameters

##### files

[`UploadFile`](/uploader/docs/api/Types/UploadFile)[]

#### Returns

`void`

***

### onBeforeRequest?

> `optional` **onBeforeRequest?**: (`file`, `chunkInfo?`) => `Promise`\<`void` \| `RequestBlueprint`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:379](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L379)

Hook to modify the network request before it is sent.
Allows injecting dynamic headers or changing the endpoint per-chunk.

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/Types/UploadFile)

##### chunkInfo?

[`ChunkInfo`](/uploader/docs/api/Types/ChunkInfo)

#### Returns

`Promise`\<`void` \| `RequestBlueprint`\>

#### Example

```typescript
onBeforeRequest: async (file, chunk) => {
  return {
    headers: { 'X-Chunk-Index': chunk?.index.toString() || '0' }
  };
}
```

***

### onBeforeUpload?

> `optional` **onBeforeUpload?**: (`file`) => `boolean` \| `void` \| `Promise`\<`boolean` \| `void`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:362](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L362)

Hook to perform actions before a file starts uploading.
Return `false` to cancel the upload for this specific file.

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/Types/UploadFile)

#### Returns

`boolean` \| `void` \| `Promise`\<`boolean` \| `void`\>

#### Example

```typescript
onBeforeUpload: async (file) => {
  const permitted = await checkUserPermissions();
  return permitted; // returning false stops the upload
}
```

***

### onChunkComplete?

> `optional` **onChunkComplete?**: (`file`, `chunk`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:383](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L383)

Callback fired when a single chunk has been acknowledged by the server

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/Types/UploadFile)

##### chunk

[`ChunkInfo`](/uploader/docs/api/Types/ChunkInfo)

#### Returns

`void`

***

### onChunkStart?

> `optional` **onChunkStart?**: (`file`, `chunk`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:381](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L381)

Callback fired immediately before a chunk transmission begins

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/Types/UploadFile)

##### chunk

[`ChunkInfo`](/uploader/docs/api/Types/ChunkInfo)

#### Returns

`void`

***

### onFilesAdded?

> `optional` **onFilesAdded?**: (`files`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:340](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L340)

Callback fired when valid files have been added to the internal Map

#### Parameters

##### files

[`UploadFile`](/uploader/docs/api/Types/UploadFile)[]

#### Returns

`void`

***

### onFilesRejected?

> `optional` **onFilesRejected?**: (`errors`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:332](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L332)

Callback fired when files are rejected by internal or custom validation

#### Parameters

##### errors

[`ValidationError`](/uploader/docs/api/validation/ValidationError)[]

#### Returns

`void`

***

### onMetadataExtracted?

> `optional` **onMetadataExtracted?**: (`file`, `metadata`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:336](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L336)

Callback fired when metadata (dimensions, etc) has been extracted

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/Types/UploadFile)

##### metadata

[`FileMetadata`](/uploader/docs/api/Types/FileMetadata)

#### Returns

`void`

***

### onPreviewGenerated?

> `optional` **onPreviewGenerated?**: (`file`, `preview`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:338](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L338)

Callback fired when a local preview URL has been generated

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/Types/UploadFile)

##### preview

`string`

#### Returns

`void`

***

### onQueueChange?

> `optional` **onQueueChange?**: (`files`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:345](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L345)

Callback fired whenever the queue content changes (add/remove/clear).
Ideal for syncing framework state.

#### Parameters

##### files

[`UploadFile`](/uploader/docs/api/Types/UploadFile)[]

#### Returns

`void`

***

### onRetry?

> `optional` **onRetry?**: (`file`, `attempt`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:403](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L403)

Callback fired before a retry attempt is made for a file/chunk

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/Types/UploadFile)

##### attempt

`number`

#### Returns

`void`

***

### onStateChange?

> `optional` **onStateChange?**: (`file`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:350](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L350)

Callback fired whenever a file's `status` changes.
Preferred for UI reactivity over `onUploadProgress`.

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/Types/UploadFile)

#### Returns

`void`

***

### onUploadCancel?

> `optional` **onUploadCancel?**: (`file`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:399](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L399)

Callback fired when an upload is aborted by the user

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/Types/UploadFile)

#### Returns

`void`

***

### onUploadError?

> `optional` **onUploadError?**: (`file`, `error`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:401](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L401)

Callback fired when an upload fails permanently or exceeds retries

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/Types/UploadFile)

##### error

[`UploaderError`](/uploader/docs/api/Exception_Handling/UploaderError)

#### Returns

`void`

***

### onUploadPause?

> `optional` **onUploadPause?**: (`file`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:395](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L395)

Callback fired when an upload is intentionally paused

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/Types/UploadFile)

#### Returns

`void`

***

### onUploadProgress?

> `optional` **onUploadProgress?**: (`file`, `progress`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:366](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L366)

Callback fired periodically to report upload progress metrics

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/Types/UploadFile)

##### progress

[`UploadProgress`](/uploader/docs/api/Types/UploadProgress)

#### Returns

`void`

***

### onUploadResume?

> `optional` **onUploadResume?**: (`file`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:397](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L397)

Callback fired when an upload is resumed from a paused state

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/Types/UploadFile)

#### Returns

`void`

***

### onUploadStart?

> `optional` **onUploadStart?**: (`file`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:364](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L364)

Callback fired when a file transitions to the `uploading` state

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/Types/UploadFile)

#### Returns

`void`

***

### onUploadSuccess?

> `optional` **onUploadSuccess?**: (`file`, `response`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:388](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L388)

Callback fired when the server confirms a successful upload.
This is the final terminal event for a successful transfer.

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/Types/UploadFile)

##### response

`unknown`

#### Returns

`void`

***

### onValidationComplete?

> `optional` **onValidationComplete?**: (`results`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:334](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L334)

Callback fired when validation is complete for all files in a batch

#### Parameters

##### results

[`ValidationResult`](/uploader/docs/api/validation/ValidationResult)[]

#### Returns

`void`

***

### onValidationStart?

> `optional` **onValidationStart?**: (`files`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:328](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L328)

Callback fired when file validation begins

#### Parameters

##### files

`File`[]

#### Returns

`void`

***

### previewMaxHeight?

> `optional` **previewMaxHeight?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:316](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L316)

Maximum height for generated previews

***

### previewMaxWidth?

> `optional` **previewMaxWidth?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:314](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L314)

Maximum width for generated previews

***

### protocol?

> `optional` **protocol?**: [`UploadProtocol`](/uploader/docs/api/Types/UploadProtocol)

Defined in: [packages/headless-uploader/src/types/uploader.ts:275](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L275)

The protocol to use for uploading (http, tus, websocket, webtransport).

***

### retryConfig?

> `optional` **retryConfig?**: [`RetryConfig`](/uploader/docs/api/Types/RetryConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:307](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L307)

Detailed exponential backoff and retry strategy

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:322](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L322)

Global request timeout in milliseconds (0 for no timeout)

***

### tus?

> `optional` **tus?**: [`TusConfig`](/uploader/docs/api/Protocol_Configurations/TusConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:279](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L279)

Configuration for the Tus resumable protocol

***

### websocket?

> `optional` **websocket?**: [`WebSocketConfig`](/uploader/docs/api/Protocol_Configurations/WebSocketConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:281](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L281)

Configuration for persistent WebSocket streams

***

### webtransport?

> `optional` **webtransport?**: [`WebTransportConfig`](/uploader/docs/api/Protocol_Configurations/WebTransportConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:283](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L283)

Configuration for modern WebTransport streams
