---
title: GCSAdapterOptions
description: Configuration options for the Google Cloud Storage adapter.
---

# GCSAdapterOptions

Defined in: [packages/headless-uploader/src/types/cloudTypes.ts:55](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/cloudTypes.ts#L55)

Google Cloud Storage Adapter Configuration

## Properties

### getUploadUrl

> **getUploadUrl**: (`file`) => `Promise`\<`string`\>

Defined in: [packages/headless-uploader/src/types/cloudTypes.ts:60](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/cloudTypes.ts#L60)

Function to get a Signed URL from your backend

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

The file being uploaded

#### Returns

`Promise`\<`string`\>

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: [packages/headless-uploader/src/types/cloudTypes.ts:65](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/cloudTypes.ts#L65)

Additional custom headers to include in the GCS PUT request
