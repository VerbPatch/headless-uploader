---
title: UploaderConfig
description: The primary configuration object for initializing the uploader.
---

# UploaderConfig

Defined in: [packages/headless-uploader/src/types/uploader.ts:208](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L208)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:228](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L228)

Allowed MIME types or file extensions

***

### allowDuplicates?

> `optional` **allowDuplicates?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:230](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L230)

Whether to allow adding the same file multiple times

***

### autoRetry?

> `optional` **autoRetry?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:244](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L244)

Whether to automatically retry failed uploads

***

### autoUpload?

> `optional` **autoUpload?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:238](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L238)

Whether to start uploading immediately after adding files

***

### chunkSize?

> `optional` **chunkSize?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:234](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L234)

Size of each chunk in bytes for chunked uploads

***

### cloudAdapter?

> `optional` **cloudAdapter?**: [`CloudAdapter`](/uploader/docs/api/types/CloudAdapter)

Defined in: [packages/headless-uploader/src/types/uploader.ts:267](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L267)

Custom cloud storage adapter. Required when protocol is set to 'cloud'.

***

### compression?

> `optional` **compression?**: [`CompressionOptions`](/uploader/docs/api/types/CompressionOptions)

Defined in: [packages/headless-uploader/src/types/uploader.ts:250](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L250)

Options for client-side image compression

***

### customValidator?

> `optional` **customValidator?**: (`file`) => `Promise`\<[`ValidationResult`](/uploader/docs/api/validation/ValidationResult)\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:272](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L272)

Function for custom file validation logic

#### Parameters

##### file

`File`

#### Returns

`Promise`\<[`ValidationResult`](/uploader/docs/api/validation/ValidationResult)\>

***

### enablePreviews?

> `optional` **enablePreviews?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:252](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L252)

Whether to generate preview URLs for images and videos

***

### extractMetadata?

> `optional` **extractMetadata?**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:260](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L260)

Whether to extract extended metadata (dimensions, duration) from files

***

### http?

> `optional` **http?**: [`HttpConfig`](/uploader/docs/api/protocols/HttpConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:212](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L212)

Configuration for HTTP protocol

***

### maxConcurrent?

> `optional` **maxConcurrent?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:240](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L240)

Maximum number of files to upload simultaneously

***

### maxFiles?

> `optional` **maxFiles?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:222](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L222)

Maximum number of files allowed in the queue

***

### maxFileSize?

> `optional` **maxFileSize?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:224](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L224)

Maximum size for a single file in bytes

***

### minFileSize?

> `optional` **minFileSize?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:226](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L226)

Minimum size for a single file in bytes

***

### onAllComplete?

> `optional` **onAllComplete?**: (`files`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:298](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L298)

Callback fired when all files in the queue have finished (success or failure)

#### Parameters

##### files

[`UploadFile`](/uploader/docs/api/types/UploadFile)[]

#### Returns

`void`

***

### onBeforeRequest?

> `optional` **onBeforeRequest?**: (`file`, `chunkInfo?`) => `Promise`\<`void` \| `RequestBlueprint`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:290](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L290)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:284](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L284)

Hook to perform actions before a file starts uploading

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onChunkComplete?

> `optional` **onChunkComplete?**: (`file`, `chunk`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:292](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L292)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:282](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L282)

Callback fired when files have been successfully added to the queue

#### Parameters

##### files

[`UploadFile`](/uploader/docs/api/types/UploadFile)[]

#### Returns

`void`

***

### onFilesRejected?

> `optional` **onFilesRejected?**: (`errors`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:274](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L274)

Callback fired when files are rejected by validation

#### Parameters

##### errors

[`ValidationError`](/uploader/docs/api/validation/ValidationError)[]

#### Returns

`void`

***

### onMetadataExtracted?

> `optional` **onMetadataExtracted?**: (`file`, `metadata`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:278](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L278)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:280](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L280)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:308](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L308)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:304](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L304)

Callback fired when an upload is cancelled

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

#### Returns

`void`

***

### onUploadComplete?

> `optional` **onUploadComplete?**: (`file`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:294](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L294)

Callback fired when all chunks of a file have been sent

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

#### Returns

`void`

***

### onUploadError?

> `optional` **onUploadError?**: (`file`, `error`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:306](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L306)

Callback fired when an upload fails with an error

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

##### error

`Error`

#### Returns

`void`

***

### onUploadPause?

> `optional` **onUploadPause?**: (`file`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:300](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L300)

Callback fired when an upload is paused

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

#### Returns

`void`

***

### onUploadProgress?

> `optional` **onUploadProgress?**: (`file`, `progress`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:288](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L288)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:302](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L302)

Callback fired when an upload is resumed

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

#### Returns

`void`

***

### onUploadStart?

> `optional` **onUploadStart?**: (`file`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:286](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L286)

Callback fired when a file upload starts

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

#### Returns

`void`

***

### onUploadSuccess?

> `optional` **onUploadSuccess?**: (`file`, `response`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:296](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L296)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:276](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L276)

Callback fired when validation is complete for all files

#### Parameters

##### results

[`ValidationResult`](/uploader/docs/api/validation/ValidationResult)[]

#### Returns

`void`

***

### onValidationStart?

> `optional` **onValidationStart?**: (`files`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:270](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L270)

Callback fired when file validation begins

#### Parameters

##### files

`File`[]

#### Returns

`void`

***

### previewMaxHeight?

> `optional` **previewMaxHeight?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:256](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L256)

Maximum height for generated previews

***

### previewMaxWidth?

> `optional` **previewMaxWidth?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:254](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L254)

Maximum width for generated previews

***

### protocol?

> `optional` **protocol?**: [`UploadProtocol`](/uploader/docs/api/types/UploadProtocol)

Defined in: [packages/headless-uploader/src/types/uploader.ts:210](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L210)

The protocol to use for uploading (http, tus, websocket, etc.). Set to 'cloud' to use cloudAdapter.

***

### retryConfig?

> `optional` **retryConfig?**: [`RetryConfig`](/uploader/docs/api/types/RetryConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:246](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L246)

Detailed retry strategy configuration

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:264](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L264)

Global request timeout in milliseconds

***

### tus?

> `optional` **tus?**: [`TusConfig`](/uploader/docs/api/protocols/TusConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:214](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L214)

Configuration for Tus protocol

***

### websocket?

> `optional` **websocket?**: [`WebSocketConfig`](/uploader/docs/api/protocols/WebSocketConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:216](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L216)

Configuration for WebSocket protocol

***

### webtransport?

> `optional` **webtransport?**: [`WebTransportConfig`](/uploader/docs/api/protocols/WebTransportConfig)

Defined in: [packages/headless-uploader/src/types/uploader.ts:218](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/uploader.ts#L218)

Configuration for WebTransport protocol
