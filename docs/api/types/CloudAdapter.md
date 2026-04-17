---
title: CloudAdapter
description: Interface for implementing custom cloud storage providers (e.g., S3, Cloudinary).
---

# CloudAdapter

Defined in: [packages/headless-uploader/src/types/uploader.ts:149](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/uploader.ts#L149)

Cloud storage adapter interface

## Properties

### abortUpload?

> `optional` **abortUpload?**: (`uploadId`) => `Promise`\<`void`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:153](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/uploader.ts#L153)

#### Parameters

##### uploadId

`string`

#### Returns

`Promise`\<`void`\>

***

### getUploadUrl?

> `optional` **getUploadUrl?**: (`file`) => `Promise`\<`string`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:152](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/uploader.ts#L152)

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

#### Returns

`Promise`\<`string`\>

***

### name

> **name**: `string`

Defined in: [packages/headless-uploader/src/types/uploader.ts:150](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/uploader.ts#L150)

***

### upload

> **upload**: (`file`, `config`) => `Promise`\<`unknown`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:151](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/uploader.ts#L151)

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

##### config

[`UploaderConfig`](/uploader/docs/api/types/UploaderConfig)

#### Returns

`Promise`\<`unknown`\>
