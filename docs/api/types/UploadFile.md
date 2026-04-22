---
title: UploadFile
description: The internal object representing a file in the uploader, including its state and progress.
---

# UploadFile

Defined in: [packages/headless-uploader/src/types/uploader.ts:158](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L158)

Upload file representation

## Properties

### abortController?

> `optional` **abortController?**: `AbortController`

Defined in: [packages/headless-uploader/src/types/uploader.ts:170](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L170)

***

### chunks?

> `optional` **chunks?**: [`ChunkInfo`](/uploader/docs/api/types/ChunkInfo)[]

Defined in: [packages/headless-uploader/src/types/uploader.ts:165](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L165)

***

### error?

> `optional` **error?**: [`UploaderError`](/uploader/docs/api/types/UploaderError)

Defined in: [packages/headless-uploader/src/types/uploader.ts:167](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L167)

***

### file

> **file**: `File`

Defined in: [packages/headless-uploader/src/types/uploader.ts:160](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L160)

***

### id

> **id**: `string`

Defined in: [packages/headless-uploader/src/types/uploader.ts:159](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L159)

***

### metadata

> **metadata**: [`FileMetadata`](/uploader/docs/api/types/FileMetadata)

Defined in: [packages/headless-uploader/src/types/uploader.ts:161](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L161)

***

### preview?

> `optional` **preview?**: `string`

Defined in: [packages/headless-uploader/src/types/uploader.ts:164](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L164)

***

### processedFile?

> `optional` **processedFile?**: `File` \| `Blob`

Defined in: [packages/headless-uploader/src/types/uploader.ts:166](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L166)

***

### progress

> **progress**: [`UploadProgress`](/uploader/docs/api/types/UploadProgress)

Defined in: [packages/headless-uploader/src/types/uploader.ts:163](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L163)

***

### response?

> `optional` **response?**: `unknown`

Defined in: [packages/headless-uploader/src/types/uploader.ts:169](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L169)

***

### retries

> **retries**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:168](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L168)

***

### status

> **status**: [`UploadStatus`](/uploader/docs/api/types/UploadStatus)

Defined in: [packages/headless-uploader/src/types/uploader.ts:162](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L162)
