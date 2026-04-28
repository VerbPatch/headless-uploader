---
title: UploadFile
description: The internal object representing a file in the uploader, including its state and progress.
---

# UploadFile

Defined in: [packages/headless-uploader/src/types/uploader.ts:190](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L190)

Upload file representation

## Properties

### abortController?

> `optional` **abortController?**: `AbortController`

Defined in: [packages/headless-uploader/src/types/uploader.ts:214](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L214)

Internal controller used to abort active requests

***

### chunks?

> `optional` **chunks?**: [`ChunkInfo`](/uploader/docs/api/Types/ChunkInfo)[]

Defined in: [packages/headless-uploader/src/types/uploader.ts:204](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L204)

Metadata for individual chunks if chunking is enabled

***

### error?

> `optional` **error?**: [`UploaderError`](/uploader/docs/api/Exception_Handling/UploaderError)

Defined in: [packages/headless-uploader/src/types/uploader.ts:208](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L208)

The last error encountered during the lifecycle

***

### file

> **file**: `File`

Defined in: [packages/headless-uploader/src/types/uploader.ts:194](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L194)

The original browser File object

***

### id

> **id**: `string`

Defined in: [packages/headless-uploader/src/types/uploader.ts:192](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L192)

Unique identifier generated for the upload session

***

### metadata

> **metadata**: [`FileMetadata`](/uploader/docs/api/Types/FileMetadata)

Defined in: [packages/headless-uploader/src/types/uploader.ts:196](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L196)

Extracted file properties and metadata

***

### preview?

> `optional` **preview?**: `string`

Defined in: [packages/headless-uploader/src/types/uploader.ts:202](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L202)

Local preview URL (data URL or blob URL)

***

### processedFile?

> `optional` **processedFile?**: `File` \| `Blob`

Defined in: [packages/headless-uploader/src/types/uploader.ts:206](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L206)

The final data being uploaded (may be a compressed Blob if enabled)

***

### progress

> **progress**: [`UploadProgress`](/uploader/docs/api/Types/UploadProgress)

Defined in: [packages/headless-uploader/src/types/uploader.ts:200](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L200)

Real-time progress metrics

***

### response?

> `optional` **response?**: `unknown`

Defined in: [packages/headless-uploader/src/types/uploader.ts:212](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L212)

Final server response data after successful upload

***

### retries

> **retries**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:210](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L210)

Total number of retry attempts made for this file

***

### status

> **status**: [`UploadStatus`](/uploader/docs/api/Types/UploadStatus)

Defined in: [packages/headless-uploader/src/types/uploader.ts:198](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L198)

Current state of the upload (e.g., 'uploading', 'completed')
