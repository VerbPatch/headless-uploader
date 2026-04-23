---
title: UploadFile
description: The internal object representing a file in the uploader, including its state and progress.
---

# UploadFile

Defined in: [packages/headless-uploader/src/types/uploader.ts:189](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L189)

Upload file representation

## Properties

### abortController?

> `optional` **abortController?**: `AbortController`

Defined in: [packages/headless-uploader/src/types/uploader.ts:213](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L213)

Internal controller used to abort active requests

***

### chunks?

> `optional` **chunks?**: [`ChunkInfo`](/uploader/docs/api/Types/ChunkInfo)[]

Defined in: [packages/headless-uploader/src/types/uploader.ts:203](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L203)

Metadata for individual chunks if chunking is enabled

***

### error?

> `optional` **error?**: [`UploaderError`](/uploader/docs/api/Exception_Handling/UploaderError)

Defined in: [packages/headless-uploader/src/types/uploader.ts:207](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L207)

The last error encountered during the lifecycle

***

### file

> **file**: `File`

Defined in: [packages/headless-uploader/src/types/uploader.ts:193](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L193)

The original browser File object

***

### id

> **id**: `string`

Defined in: [packages/headless-uploader/src/types/uploader.ts:191](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L191)

Unique identifier generated for the upload session

***

### metadata

> **metadata**: [`FileMetadata`](/uploader/docs/api/Types/FileMetadata)

Defined in: [packages/headless-uploader/src/types/uploader.ts:195](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L195)

Extracted file properties and metadata

***

### preview?

> `optional` **preview?**: `string`

Defined in: [packages/headless-uploader/src/types/uploader.ts:201](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L201)

Local preview URL (data URL or blob URL)

***

### processedFile?

> `optional` **processedFile?**: `File` \| `Blob`

Defined in: [packages/headless-uploader/src/types/uploader.ts:205](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L205)

The final data being uploaded (may be a compressed Blob if enabled)

***

### progress

> **progress**: [`UploadProgress`](/uploader/docs/api/Types/UploadProgress)

Defined in: [packages/headless-uploader/src/types/uploader.ts:199](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L199)

Real-time progress metrics

***

### response?

> `optional` **response?**: `unknown`

Defined in: [packages/headless-uploader/src/types/uploader.ts:211](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L211)

Final server response data after successful upload

***

### retries

> **retries**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:209](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L209)

Total number of retry attempts made for this file

***

### status

> **status**: [`UploadStatus`](/uploader/docs/api/Types/UploadStatus)

Defined in: [packages/headless-uploader/src/types/uploader.ts:197](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L197)

Current state of the upload (e.g., 'uploading', 'completed')
