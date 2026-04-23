---
title: TusConfig
description: |-
  Configuration for the Tus resumable upload protocol.
  Extends the official 
   options.
---

# TusConfig

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:105](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L105)

TUS Protocol Configuration

## Extends

- `Partial`\<`UploadOptions`\>

## Properties

### addRequestId?

> `optional` **addRequestId?**: `boolean`

#### Inherited from

`Partial.addRequestId`

***

### chunkSize?

> `optional` **chunkSize?**: `number`

#### Inherited from

`Partial.chunkSize`

***

### endpoint

> **endpoint**: `string`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:110](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/protocolTypes.ts#L110)

The server endpoint for Tus uploads (e.g., `https://tus.io/files/`).
This is a required field for the Tus protocol.

#### Overrides

`Partial.endpoint`

***

### fileReader?

> `optional` **fileReader?**: `FileReader`

#### Inherited from

`Partial.fileReader`

***

### fingerprint?

> `optional` **fingerprint?**: (`file`, `options`) => `Promise`\<`string`\>

#### Parameters

##### file

`File`

##### options

`UploadOptions`

#### Returns

`Promise`\<`string`\>

#### Inherited from

`Partial.fingerprint`

***

### headers?

> `optional` **headers?**: `object`

#### Index Signature

\[`key`: `string`\]: `string`

#### Inherited from

`Partial.headers`

***

### httpStack?

> `optional` **httpStack?**: `HttpStack`

#### Inherited from

`Partial.httpStack`

***

### metadata?

> `optional` **metadata?**: `object`

#### Index Signature

\[`key`: `string`\]: `string`

#### Inherited from

`Partial.metadata`

***

### metadataForPartialUploads?

> `optional` **metadataForPartialUploads?**: `object`

#### Index Signature

\[`key`: `string`\]: `string`

#### Inherited from

`Partial.metadataForPartialUploads`

***

### onAfterResponse?

> `optional` **onAfterResponse?**: (`req`, `res`) => `void` \| `Promise`\<`void`\>

#### Parameters

##### req

`HttpRequest`

##### res

`HttpResponse`

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`Partial.onAfterResponse`

***

### onBeforeRequest?

> `optional` **onBeforeRequest?**: (`req`) => `void` \| `Promise`\<`void`\>

#### Parameters

##### req

`HttpRequest`

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

`Partial.onBeforeRequest`

***

### onChunkComplete?

> `optional` **onChunkComplete?**: ((`chunkSize`, `bytesAccepted`, `bytesTotal`) => `void`) \| `null`

#### Inherited from

`Partial.onChunkComplete`

***

### onError?

> `optional` **onError?**: ((`error`) => `void`) \| `null`

#### Inherited from

`Partial.onError`

***

### onProgress?

> `optional` **onProgress?**: ((`bytesSent`, `bytesTotal`) => `void`) \| `null`

#### Inherited from

`Partial.onProgress`

***

### onShouldRetry?

> `optional` **onShouldRetry?**: ((`error`, `retryAttempt`, `options`) => `boolean`) \| `null`

#### Inherited from

`Partial.onShouldRetry`

***

### onSuccess?

> `optional` **onSuccess?**: ((`payload`) => `void`) \| `null`

#### Inherited from

`Partial.onSuccess`

***

### onUploadUrlAvailable?

> `optional` **onUploadUrlAvailable?**: (() => `void`) \| `null`

#### Inherited from

`Partial.onUploadUrlAvailable`

***

### overridePatchMethod?

> `optional` **overridePatchMethod?**: `boolean`

#### Inherited from

`Partial.overridePatchMethod`

***

### parallelUploadBoundaries?

> `optional` **parallelUploadBoundaries?**: `object`[] \| `null`

#### Inherited from

`Partial.parallelUploadBoundaries`

***

### parallelUploads?

> `optional` **parallelUploads?**: `number`

#### Inherited from

`Partial.parallelUploads`

***

### removeFingerprintOnSuccess?

> `optional` **removeFingerprintOnSuccess?**: `boolean`

#### Inherited from

`Partial.removeFingerprintOnSuccess`

***

### retryDelays?

> `optional` **retryDelays?**: `number`[] \| `null`

#### Inherited from

`Partial.retryDelays`

***

### storeFingerprintForResuming?

> `optional` **storeFingerprintForResuming?**: `boolean`

#### Inherited from

`Partial.storeFingerprintForResuming`

***

### uploadDataDuringCreation?

> `optional` **uploadDataDuringCreation?**: `boolean`

#### Inherited from

`Partial.uploadDataDuringCreation`

***

### uploadLengthDeferred?

> `optional` **uploadLengthDeferred?**: `boolean`

#### Inherited from

`Partial.uploadLengthDeferred`

***

### uploadSize?

> `optional` **uploadSize?**: `number` \| `null`

#### Inherited from

`Partial.uploadSize`

***

### uploadUrl?

> `optional` **uploadUrl?**: `string` \| `null`

#### Inherited from

`Partial.uploadUrl`

***

### urlStorage?

> `optional` **urlStorage?**: `UrlStorage`

#### Inherited from

`Partial.urlStorage`
