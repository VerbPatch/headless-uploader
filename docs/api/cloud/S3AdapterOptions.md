---
title: S3AdapterOptions
description: Configuration options for the AWS S3 cloud storage adapter.
---

# S3AdapterOptions

Defined in: packages/headless-uploader/src/types/cloudTypes.ts:9

AWS S3 Adapter Configuration

## Properties

### getUploadUrl

> **getUploadUrl**: (`file`) => `Promise`\<`string`\>

Defined in: packages/headless-uploader/src/types/cloudTypes.ts:14

Function to get a pre-signed PUT URL from your backend

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

The file being uploaded

#### Returns

`Promise`\<`string`\>

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: packages/headless-uploader/src/types/cloudTypes.ts:20

Additional custom headers to include in the S3 PUT request
`e.g., { 'x-amz-acl': 'public-read' }`
