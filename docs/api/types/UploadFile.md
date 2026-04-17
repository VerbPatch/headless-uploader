---
title: UploadFile
description: The internal object representing a file in the uploader, including its state and progress.
---

# UploadFile

Defined in: [packages/headless-uploader/src/types/uploader.ts:128](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/uploader.ts#L128)

Upload file representation

## Properties

### abortController?

> `optional` **abortController?**: `AbortController`

Defined in: [packages/headless-uploader/src/types/uploader.ts:140](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/uploader.ts#L140)

***

### chunks?

> `optional` **chunks?**: [`ChunkInfo`](/uploader/docs/api/types/ChunkInfo)[]

Defined in: [packages/headless-uploader/src/types/uploader.ts:135](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/uploader.ts#L135)

***

### error?

> `optional` **error?**: `Error`

Defined in: [packages/headless-uploader/src/types/uploader.ts:137](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/uploader.ts#L137)

***

### file

> **file**: `File`

Defined in: [packages/headless-uploader/src/types/uploader.ts:130](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/uploader.ts#L130)

***

### id

> **id**: `string`

Defined in: [packages/headless-uploader/src/types/uploader.ts:129](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/uploader.ts#L129)

***

### metadata

> **metadata**: [`FileMetadata`](/uploader/docs/api/types/FileMetadata)

Defined in: [packages/headless-uploader/src/types/uploader.ts:131](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/uploader.ts#L131)

***

### preview?

> `optional` **preview?**: `string`

Defined in: [packages/headless-uploader/src/types/uploader.ts:134](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/uploader.ts#L134)

***

### processedFile?

> `optional` **processedFile?**: `File` \| `Blob`

Defined in: [packages/headless-uploader/src/types/uploader.ts:136](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/uploader.ts#L136)

***

### progress

> **progress**: [`UploadProgress`](/uploader/docs/api/types/UploadProgress)

Defined in: [packages/headless-uploader/src/types/uploader.ts:133](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/uploader.ts#L133)

***

### response?

> `optional` **response?**: `unknown`

Defined in: [packages/headless-uploader/src/types/uploader.ts:139](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/uploader.ts#L139)

***

### retries

> **retries**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:138](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/uploader.ts#L138)

***

### status

> **status**: [`UploadStatus`](/uploader/docs/api/types/UploadStatus)

Defined in: [packages/headless-uploader/src/types/uploader.ts:132](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/uploader.ts#L132)
