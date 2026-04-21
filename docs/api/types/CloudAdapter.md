---
title: CloudAdapter
description: Interface for implementing custom cloud storage providers (e.g., S3, Cloudinary).
---

# CloudAdapter

Defined in: [packages/headless-uploader/src/types/uploader.ts:180](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/uploader.ts#L180)

Cloud storage adapter interface

## Properties

### abortUpload?

> `optional` **abortUpload?**: (`uploadId`) => `Promise`\<`void`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:184](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/uploader.ts#L184)

#### Parameters

##### uploadId

`string`

#### Returns

`Promise`\<`void`\>

***

### getUploadUrl?

> `optional` **getUploadUrl?**: (`file`) => `Promise`\<`string`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:183](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/uploader.ts#L183)

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

#### Returns

`Promise`\<`string`\>

***

### name

> **name**: `string`

Defined in: [packages/headless-uploader/src/types/uploader.ts:181](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/uploader.ts#L181)

***

### upload

> **upload**: (`file`, `config`) => `Promise`\<`unknown`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:182](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/types/uploader.ts#L182)

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

##### config

[`UploaderConfig`](/uploader/docs/api/types/UploaderConfig)

#### Returns

`Promise`\<`unknown`\>
