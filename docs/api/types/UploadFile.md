---
title: UploadFile
description: The internal object representing a file in the uploader, including its state and progress.
---

# UploadFile

Defined in: packages/headless-uploader/src/types/uploader.ts:128

Upload file representation

## Properties

### abortController?

> `optional` **abortController?**: `AbortController`

Defined in: packages/headless-uploader/src/types/uploader.ts:140

***

### chunks?

> `optional` **chunks?**: [`ChunkInfo`](/uploader/docs/api/types/ChunkInfo)[]

Defined in: packages/headless-uploader/src/types/uploader.ts:135

***

### error?

> `optional` **error?**: `Error`

Defined in: packages/headless-uploader/src/types/uploader.ts:137

***

### file

> **file**: `File`

Defined in: packages/headless-uploader/src/types/uploader.ts:130

***

### id

> **id**: `string`

Defined in: packages/headless-uploader/src/types/uploader.ts:129

***

### metadata

> **metadata**: [`FileMetadata`](/uploader/docs/api/types/FileMetadata)

Defined in: packages/headless-uploader/src/types/uploader.ts:131

***

### preview?

> `optional` **preview?**: `string`

Defined in: packages/headless-uploader/src/types/uploader.ts:134

***

### processedFile?

> `optional` **processedFile?**: `File` \| `Blob`

Defined in: packages/headless-uploader/src/types/uploader.ts:136

***

### progress

> **progress**: [`UploadProgress`](/uploader/docs/api/types/UploadProgress)

Defined in: packages/headless-uploader/src/types/uploader.ts:133

***

### response?

> `optional` **response?**: `unknown`

Defined in: packages/headless-uploader/src/types/uploader.ts:139

***

### retries

> **retries**: `number`

Defined in: packages/headless-uploader/src/types/uploader.ts:138

***

### status

> **status**: [`UploadStatus`](/uploader/docs/api/types/UploadStatus)

Defined in: packages/headless-uploader/src/types/uploader.ts:132
