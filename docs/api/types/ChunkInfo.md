---
title: ChunkInfo
description: Contains metadata and state for a single part of a chunked upload.
---

# ChunkInfo

Defined in: [packages/headless-uploader/src/types/uploader.ts:99](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L99)

Chunk information

## Properties

### blob

> **blob**: `Blob`

Defined in: [packages/headless-uploader/src/types/uploader.ts:111](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L111)

The raw slice of the file for this chunk

***

### end

> **end**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:105](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L105)

Byte offset where the chunk ends

***

### index

> **index**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:101](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L101)

Zero-based index of the chunk

***

### retries

> **retries**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:115](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L115)

Current number of retry attempts for this chunk

***

### size

> **size**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:107](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L107)

Size of this specific chunk in bytes

***

### start

> **start**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:103](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L103)

Byte offset where the chunk starts

***

### status

> **status**: [`ChunkStatus`](/uploader/docs/api/Types/ChunkStatus)

Defined in: [packages/headless-uploader/src/types/uploader.ts:109](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L109)

Current status of this chunk

***

### uploadedBytes

> **uploadedBytes**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:113](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L113)

Number of bytes successfully uploaded for this chunk
