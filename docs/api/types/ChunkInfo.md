---
title: ChunkInfo
description: Contains metadata and state for a single part of a chunked upload.
---

# ChunkInfo

Defined in: [packages/headless-uploader/src/types/uploader.ts:100](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L100)

Chunk information

## Properties

### blob

> **blob**: `Blob`

Defined in: [packages/headless-uploader/src/types/uploader.ts:112](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L112)

The raw slice of the file for this chunk

***

### end

> **end**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:106](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L106)

Byte offset where the chunk ends

***

### index

> **index**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:102](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L102)

Zero-based index of the chunk

***

### retries

> **retries**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:116](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L116)

Current number of retry attempts for this chunk

***

### size

> **size**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:108](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L108)

Size of this specific chunk in bytes

***

### start

> **start**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:104](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L104)

Byte offset where the chunk starts

***

### status

> **status**: [`ChunkStatus`](/uploader/docs/api/types/ChunkStatus)

Defined in: [packages/headless-uploader/src/types/uploader.ts:110](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L110)

Current status of this chunk

***

### uploadedBytes

> **uploadedBytes**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:114](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L114)

Number of bytes successfully uploaded for this chunk
