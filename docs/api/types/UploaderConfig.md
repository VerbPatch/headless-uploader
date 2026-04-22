---
title: UploaderConfig
description: The primary configuration object for initializing the uploader.
---

# UploaderConfig

Defined in: [packages/headless-uploader/src/types/uploader.ts:225](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L225)

Main uploader configuration

## Example

```typescript
const config: UploaderConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  acceptedTypes: ['image/*', 'application/pdf'],
  autoUpload: false,
  http: {
    endpoint: '/api/upload',
  },
  onUploadProgress: (file, progress) => {
    console.log(`${file.metadata.name}: ${progress.percentage}%`);
  }
};
```

## Properties

### acceptedTypes?

> `optional` **acceptedTypes?**: `string`[]

Defined in: [packages/headless-uploader/src/types/uploader.ts:244](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L244)

Allowed MIME types or file extensions

***

### allowDuplicates?

> `optional` **allowDuplicates?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:246](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L246)

Whether to allow adding the same file multiple times

***

### autoRetry?

> `optional` **autoRetry?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:257](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L257)

Whether to automatically retry failed uploads

***

### autoUpload?

> `optional` **autoUpload?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:252](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L252)

Whether to start uploading immediately after adding files

***

### chunkSize?

> `optional` **chunkSize?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:249](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L249)

Size of each chunk in bytes for chunked uploads

***

### compression?

> `optional` **compression?**: [`CompressionOptions`](/uploader/docs/api/types/CompressionOptions)

Defined in: [packages/headless-uploader/src/types/uploader.ts:262](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L262)

Options for client-side image compression

***

### customValidator?

> `optional` **customValidator?**: (`file`) => `Promise`\<[`ValidationResult`](/uploader/docs/api/validation/ValidationResult)\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:279](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L279)

Function for custom file validation logic

#### Parameters

##### file

`File`

#### Returns

`Promise`\<[`ValidationResult`](/uploader/docs/api/validation/ValidationResult)\>

***

### enablePreviews?

> `optional` **enablePreviews?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:264](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L264)

Whether to generate preview URLs for images and videos

***

### extractMetadata?

> `optional` **extractMetadata?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:271](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L271)

Whether to extract extended metadata (dimensions, duration) from files

***

### http?

> `optional` **http?**: [`HttpConfig`](/uploader/docs/api/protocols/HttpConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:229](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L229)

Configuration for HTTP protocol

***

### maxConcurrent?

> `optional` **maxConcurrent?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:254](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L254)

Maximum number of files to upload simultaneously

***

### maxFiles?

> `optional` **maxFiles?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:238](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L238)

Maximum number of files allowed in the queue

***

### maxFileSize?

> `optional` **maxFileSize?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:240](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L240)

Maximum size for a single file in bytes

***

### minFileSize?

> `optional` **minFileSize?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:242](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L242)

Minimum size for a single file in bytes

***

### onAllComplete?

> `optional` **onAllComplete?**: (`files`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:305](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L305)

Callback fired when all files in the queue have finished (success or failure)

#### Parameters

##### files

[`UploadFile`](/uploader/docs/api/types/UploadFile)[]

#### Returns

`void`

***

### onBeforeRequest?

> `optional` **onBeforeRequest?**: (`file`, `chunkInfo?`) => `Promise`\<`void` \| `RequestBlueprint`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:297](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L297)

Hook to modify the network request before it is sent

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

##### chunkInfo?

[`ChunkInfo`](/uploader/docs/api/types/ChunkInfo)

#### Returns

`Promise`\<`void` \| `RequestBlueprint`\>

***

### onBeforeUpload?

> `optional` **onBeforeUpload?**: (`file`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:291](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L291)

Hook to perform actions before a file starts uploading

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onChunkComplete?

> `optional` **onChunkComplete?**: (`file`, `chunk`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:299](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L299)

Callback fired when a single chunk has completed uploading

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

##### chunk

[`ChunkInfo`](/uploader/docs/api/types/ChunkInfo)

#### Returns

`void`

***

### onFilesAdded?

> `optional` **onFilesAdded?**: (`files`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:289](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L289)

Callback fired when files have been successfully added to the queue

#### Parameters

##### files

[`UploadFile`](/uploader/docs/api/types/UploadFile)[]

#### Returns

`void`

***

### onFilesRejected?

> `optional` **onFilesRejected?**: (`errors`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:281](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L281)

Callback fired when files are rejected by validation

#### Parameters

##### errors

[`ValidationError`](/uploader/docs/api/validation/ValidationError)[]

#### Returns

`void`

***

### onMetadataExtracted?

> `optional` **onMetadataExtracted?**: (`file`, `metadata`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:285](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L285)

Callback fired when metadata has been extracted for a file

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

##### metadata

[`FileMetadata`](/uploader/docs/api/types/FileMetadata)

#### Returns

`void`

***

### onPreviewGenerated?

> `optional` **onPreviewGenerated?**: (`file`, `preview`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:287](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L287)

Callback fired when a preview has been generated for a file

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

##### preview

`string`

#### Returns

`void`

***

### onRetry?

> `optional` **onRetry?**: (`file`, `attempt`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:315](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L315)

Callback fired before a retry attempt is made

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

##### attempt

`number`

#### Returns

`void`

***

### onUploadCancel?

> `optional` **onUploadCancel?**: (`file`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:311](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L311)

Callback fired when an upload is cancelled

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

#### Returns

`void`

***

### onUploadComplete?

> `optional` **onUploadComplete?**: (`file`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:301](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L301)

Callback fired when all chunks of a file have been sent

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

#### Returns

`void`

***

### onUploadError?

> `optional` **onUploadError?**: (`file`, `error`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:313](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L313)

Callback fired when an upload fails with an error

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

##### error

[`UploaderError`](/uploader/docs/api/types/UploaderError)

#### Returns

`void`

***

### onUploadPause?

> `optional` **onUploadPause?**: (`file`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:307](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L307)

Callback fired when an upload is paused

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

#### Returns

`void`

***

### onUploadProgress?

> `optional` **onUploadProgress?**: (`file`, `progress`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:295](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L295)

Callback fired periodically to report upload progress

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

##### progress

[`UploadProgress`](/uploader/docs/api/types/UploadProgress)

#### Returns

`void`

***

### onUploadResume?

> `optional` **onUploadResume?**: (`file`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:309](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L309)

Callback fired when an upload is resumed

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

#### Returns

`void`

***

### onUploadStart?

> `optional` **onUploadStart?**: (`file`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:293](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L293)

Callback fired when a file upload starts

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

#### Returns

`void`

***

### onUploadSuccess?

> `optional` **onUploadSuccess?**: (`file`, `response`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:303](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L303)

Callback fired when the server confirms a successful upload

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

##### response

`unknown`

#### Returns

`void`

***

### onValidationComplete?

> `optional` **onValidationComplete?**: (`results`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:283](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L283)

Callback fired when validation is complete for all files

#### Parameters

##### results

[`ValidationResult`](/uploader/docs/api/validation/ValidationResult)[]

#### Returns

`void`

***

### onValidationStart?

> `optional` **onValidationStart?**: (`files`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:277](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L277)

Callback fired when file validation begins

#### Parameters

##### files

`File`[]

#### Returns

`void`

***

### previewMaxHeight?

> `optional` **previewMaxHeight?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:268](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L268)

Maximum height for generated previews

***

### previewMaxWidth?

> `optional` **previewMaxWidth?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:266](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L266)

Maximum width for generated previews

***

### protocol?

> `optional` **protocol?**: [`UploadProtocol`](/uploader/docs/api/types/UploadProtocol)

Defined in: [packages/headless-uploader/src/types/uploader.ts:227](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L227)

The protocol to use for uploading (http, tus, websocket, etc.).

***

### retryConfig?

> `optional` **retryConfig?**: [`RetryConfig`](/uploader/docs/api/types/RetryConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:259](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L259)

Detailed retry strategy configuration

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:274](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L274)

Global request timeout in milliseconds

***

### tus?

> `optional` **tus?**: [`TusConfig`](/uploader/docs/api/protocols/TusConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:231](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L231)

Configuration for Tus protocol

***

### websocket?

> `optional` **websocket?**: [`WebSocketConfig`](/uploader/docs/api/protocols/WebSocketConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:233](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L233)

Configuration for WebSocket protocol

***

### webtransport?

> `optional` **webtransport?**: [`WebTransportConfig`](/uploader/docs/api/protocols/WebTransportConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:235](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L235)

Configuration for WebTransport protocol
