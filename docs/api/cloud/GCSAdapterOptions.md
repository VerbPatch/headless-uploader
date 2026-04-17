---
title: GCSAdapterOptions
description: Configuration options for the Google Cloud Storage adapter.
---

# GCSAdapterOptions

Defined in: packages/headless-uploader/src/types/cloudTypes.ts:55

Google Cloud Storage Adapter Configuration

## Properties

### getUploadUrl

> **getUploadUrl**: (`file`) => `Promise`\<`string`\>

Defined in: packages/headless-uploader/src/types/cloudTypes.ts:60

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

Defined in: packages/headless-uploader/src/types/cloudTypes.ts:65

Additional custom headers to include in the GCS PUT request
