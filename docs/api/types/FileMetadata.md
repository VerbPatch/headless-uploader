---
title: FileMetadata
description: Describes the properties and extracted metadata of a file.
---

# FileMetadata

Defined in: [packages/headless-uploader/src/types/uploader.ts:66](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L66)

File metadata interface

## Properties

### dimensions?

> `optional` **dimensions?**: `object`

Defined in: [packages/headless-uploader/src/types/uploader.ts:78](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L78)

Dimensions for image/video files (requires `extractMetadata: true`)

#### height

> **height**: `number`

#### width

> **width**: `number`

***

### duration?

> `optional` **duration?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:83](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L83)

Duration in seconds for audio/video files (requires `extractMetadata: true`)

***

### extension?

> `optional` **extension?**: `string`

Defined in: [packages/headless-uploader/src/types/uploader.ts:76](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L76)

File extension (e.g., '.jpg') derived from name

***

### lastModified

> **lastModified**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:74](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L74)

Unix timestamp of last modification

***

### name

> **name**: `string`

Defined in: [packages/headless-uploader/src/types/uploader.ts:68](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L68)

Original name of the file

***

### size

> **size**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:70](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L70)

Total size in bytes

***

### type

> **type**: `string`

Defined in: [packages/headless-uploader/src/types/uploader.ts:72](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L72)

MIME type of the file
