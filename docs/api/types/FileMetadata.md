---
title: FileMetadata
description: Describes the properties and extracted metadata of a file.
---

# FileMetadata

Defined in: [packages/headless-uploader/src/types/uploader.ts:65](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L65)

File metadata interface

## Properties

### dimensions?

> `optional` **dimensions?**: `object`

Defined in: [packages/headless-uploader/src/types/uploader.ts:77](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L77)

Dimensions for image/video files (requires `extractMetadata: true`)

#### height

> **height**: `number`

#### width

> **width**: `number`

***

### duration?

> `optional` **duration?**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:82](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L82)

Duration in seconds for audio/video files (requires `extractMetadata: true`)

***

### extension?

> `optional` **extension?**: `string`

Defined in: [packages/headless-uploader/src/types/uploader.ts:75](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L75)

File extension (e.g., '.jpg') derived from name

***

### lastModified

> **lastModified**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:73](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L73)

Unix timestamp of last modification

***

### name

> **name**: `string`

Defined in: [packages/headless-uploader/src/types/uploader.ts:67](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L67)

Original name of the file

***

### size

> **size**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:69](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L69)

Total size in bytes

***

### type

> **type**: `string`

Defined in: [packages/headless-uploader/src/types/uploader.ts:71](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L71)

MIME type of the file
