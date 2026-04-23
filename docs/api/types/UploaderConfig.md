---
title: UploaderConfig
description: The primary configuration object for initializing the uploader.
---

# UploaderConfig

Defined in: [packages/headless-uploader/src/types/uploader.ts:272](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L272)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:291](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L291)

Allowed MIME types or extensions (e.g. `['image/*', '.pdf']`)

***

### allowDuplicates?

> `optional` **allowDuplicates?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:293](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L293)

Whether to allow adding the same file multiple times to the queue

***

### autoRetry?

> `optional` **autoRetry?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:304](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L304)

Whether to automatically retry failed uploads

***

### autoUpload?

> `optional` **autoUpload?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:299](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L299)

Whether to start uploading immediately when files are added

***

### chunkSize?

> `optional` **chunkSize?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:296](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L296)

Size of each chunk in bytes for protocols that support chunking

***

### compression?

> `optional` **compression?**: [`CompressionOptions`](/uploader/docs/api/Types/CompressionOptions)

Defined in: [packages/headless-uploader/src/types/uploader.ts:309](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L309)

Options for client-side image compression before upload

***

### customValidator?

> `optional` **customValidator?**: (`file`) => `Promise`\<[`ValidationResult`](/uploader/docs/api/validation/ValidationResult)\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:326](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L326)

Function for custom file validation logic (local or remote)

#### Parameters

##### file

`File`

#### Returns

`Promise`\<[`ValidationResult`](/uploader/docs/api/validation/ValidationResult)\>

***

### enablePreviews?

> `optional` **enablePreviews?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:311](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L311)

Whether to generate local preview URLs for media files

***

### extractMetadata?

> `optional` **extractMetadata?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:318](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L318)

Whether to extract extended metadata like dimensions or duration

***

### http?

> `optional` **http?**: [`HttpConfig`](/uploader/docs/api/Protocol_Configurations/HttpConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:276](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L276)

Configuration for standard HTTP multipart/chunked uploads

***

### maxConcurrent?

> `optional` **maxConcurrent?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:301](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L301)

Maximum number of files to transmit simultaneously

***

### maxFiles?

> `optional` **maxFiles?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:285](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L285)

Maximum number of files allowed in the queue at once

***

### maxFileSize?

> `optional` **maxFileSize?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:287](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L287)

Maximum allowed size for a single file in bytes

***

### minFileSize?

> `optional` **minFileSize?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:289](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L289)

Minimum required size for a single file in bytes

***

### onAllComplete?

> `optional` **onAllComplete?**: (`files`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:389](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L389)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:375](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L375)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:358](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L358)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:379](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L379)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:377](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L377)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:336](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L336)

Callback fired when valid files have been added to the internal Map

#### Parameters

##### files

[`UploadFile`](/uploader/docs/api/Types/UploadFile)[]

#### Returns

`void`

***

### onFilesRejected?

> `optional` **onFilesRejected?**: (`errors`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:328](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L328)

Callback fired when files are rejected by internal or custom validation

#### Parameters

##### errors

[`ValidationError`](/uploader/docs/api/validation/ValidationError)[]

#### Returns

`void`

***

### onMetadataExtracted?

> `optional` **onMetadataExtracted?**: (`file`, `metadata`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:332](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L332)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:334](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L334)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:341](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L341)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:399](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L399)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:346](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L346)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:395](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L395)

Callback fired when an upload is aborted by the user

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/Types/UploadFile)

#### Returns

`void`

***

### onUploadError?

> `optional` **onUploadError?**: (`file`, `error`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:397](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L397)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:391](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L391)

Callback fired when an upload is intentionally paused

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/Types/UploadFile)

#### Returns

`void`

***

### onUploadProgress?

> `optional` **onUploadProgress?**: (`file`, `progress`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:362](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L362)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:393](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L393)

Callback fired when an upload is resumed from a paused state

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/Types/UploadFile)

#### Returns

`void`

***

### onUploadStart?

> `optional` **onUploadStart?**: (`file`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:360](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L360)

Callback fired when a file transitions to the `uploading` state

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/Types/UploadFile)

#### Returns

`void`

***

### onUploadSuccess?

> `optional` **onUploadSuccess?**: (`file`, `response`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:384](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L384)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:330](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L330)

Callback fired when validation is complete for all files in a batch

#### Parameters

##### results

[`ValidationResult`](/uploader/docs/api/validation/ValidationResult)[]

#### Returns

`void`

***

### onValidationStart?

> `optional` **onValidationStart?**: (`files`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:324](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L324)

Callback fired when file validation begins

#### Parameters

##### files

`File`[]

#### Returns

`void`

***

### previewMaxHeight?

> `optional` **previewMaxHeight?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:315](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L315)

Maximum height for generated previews

***

### previewMaxWidth?

> `optional` **previewMaxWidth?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:313](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L313)

Maximum width for generated previews

***

### protocol?

> `optional` **protocol?**: [`UploadProtocol`](/uploader/docs/api/Types/UploadProtocol)

Defined in: [packages/headless-uploader/src/types/uploader.ts:274](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L274)

The protocol to use for uploading (http, tus, websocket, webtransport).

***

### retryConfig?

> `optional` **retryConfig?**: [`RetryConfig`](/uploader/docs/api/Types/RetryConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:306](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L306)

Detailed exponential backoff and retry strategy

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:321](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L321)

Global request timeout in milliseconds (0 for no timeout)

***

### tus?

> `optional` **tus?**: [`TusConfig`](/uploader/docs/api/Protocol_Configurations/TusConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:278](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L278)

Configuration for the Tus resumable protocol

***

### websocket?

> `optional` **websocket?**: [`WebSocketConfig`](/uploader/docs/api/Protocol_Configurations/WebSocketConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:280](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L280)

Configuration for persistent WebSocket streams

***

### webtransport?

> `optional` **webtransport?**: [`WebTransportConfig`](/uploader/docs/api/Protocol_Configurations/WebTransportConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:282](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L282)

Configuration for modern WebTransport streams
