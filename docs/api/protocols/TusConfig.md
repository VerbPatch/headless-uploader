---
title: TusConfig
description: Configuration options for the Tus resumable upload protocol.
---

# TusConfig

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:83](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/protocolTypes.ts#L83)

TUS Protocol Configuration

## Extends

- `Partial`\<`UploadOptions`\>

## Properties

### addRequestId?

> `optional` **addRequestId?**: `boolean`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:47

#### Inherited from

`Partial.addRequestId`

***

### chunkSize?

> `optional` **chunkSize?**: `number`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:51

#### Inherited from

`Partial.chunkSize`

***

### endpoint

> **endpoint**: `string`

Defined in: [packages/headless-uploader/src/types/protocolTypes.ts:85](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/protocolTypes.ts#L85)

The server endpoint for Tus uploads

#### Overrides

`Partial.endpoint`

***

### fileReader?

> `optional` **fileReader?**: `FileReader`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:61

#### Inherited from

`Partial.fileReader`

***

### fingerprint?

> `optional` **fingerprint?**: (`file`, `options`) => `Promise`\<`string`\>

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:33

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

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:46

#### Index Signature

\[`key`: `string`\]: `string`

#### Inherited from

`Partial.headers`

***

### httpStack?

> `optional` **httpStack?**: `HttpStack`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:62

#### Inherited from

`Partial.httpStack`

***

### metadata?

> `optional` **metadata?**: `object`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:31

#### Index Signature

\[`key`: `string`\]: `string`

#### Inherited from

`Partial.metadata`

***

### metadataForPartialUploads?

> `optional` **metadataForPartialUploads?**: `object`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:32

#### Index Signature

\[`key`: `string`\]: `string`

#### Inherited from

`Partial.metadataForPartialUploads`

***

### onAfterResponse?

> `optional` **onAfterResponse?**: (`req`, `res`) => `void` \| `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:49

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

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:48

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

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:37

#### Inherited from

`Partial.onChunkComplete`

***

### onError?

> `optional` **onError?**: ((`error`) => `void`) \| `null`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:39

#### Inherited from

`Partial.onError`

***

### onProgress?

> `optional` **onProgress?**: ((`bytesSent`, `bytesTotal`) => `void`) \| `null`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:36

#### Inherited from

`Partial.onProgress`

***

### onShouldRetry?

> `optional` **onShouldRetry?**: ((`error`, `retryAttempt`, `options`) => `boolean`) \| `null`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:40

#### Inherited from

`Partial.onShouldRetry`

***

### onSuccess?

> `optional` **onSuccess?**: ((`payload`) => `void`) \| `null`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:38

#### Inherited from

`Partial.onSuccess`

***

### onUploadUrlAvailable?

> `optional` **onUploadUrlAvailable?**: (() => `void`) \| `null`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:43

#### Inherited from

`Partial.onUploadUrlAvailable`

***

### overridePatchMethod?

> `optional` **overridePatchMethod?**: `boolean`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:45

#### Inherited from

`Partial.overridePatchMethod`

***

### parallelUploadBoundaries?

> `optional` **parallelUploadBoundaries?**: `object`[] \| `null`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:54

#### Inherited from

`Partial.parallelUploadBoundaries`

***

### parallelUploads?

> `optional` **parallelUploads?**: `number`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:53

#### Inherited from

`Partial.parallelUploads`

***

### removeFingerprintOnSuccess?

> `optional` **removeFingerprintOnSuccess?**: `boolean`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:56

#### Inherited from

`Partial.removeFingerprintOnSuccess`

***

### retryDelays?

> `optional` **retryDelays?**: `number`[] \| `null`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:52

#### Inherited from

`Partial.retryDelays`

***

### storeFingerprintForResuming?

> `optional` **storeFingerprintForResuming?**: `boolean`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:55

#### Inherited from

`Partial.storeFingerprintForResuming`

***

### uploadDataDuringCreation?

> `optional` **uploadDataDuringCreation?**: `boolean`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:58

#### Inherited from

`Partial.uploadDataDuringCreation`

***

### uploadLengthDeferred?

> `optional` **uploadLengthDeferred?**: `boolean`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:57

#### Inherited from

`Partial.uploadLengthDeferred`

***

### uploadSize?

> `optional` **uploadSize?**: `number` \| `null`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:34

#### Inherited from

`Partial.uploadSize`

***

### uploadUrl?

> `optional` **uploadUrl?**: `string` \| `null`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:30

#### Inherited from

`Partial.uploadUrl`

***

### urlStorage?

> `optional` **urlStorage?**: `UrlStorage`

Defined in: node\_modules/.pnpm/tus-js-client@4.3.1/node\_modules/tus-js-client/lib/index.d.ts:60

#### Inherited from

`Partial.urlStorage`
