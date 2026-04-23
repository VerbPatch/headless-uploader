---
title: UploadProgress
description: Contains detailed metrics about the current progress of an upload.
---

# UploadProgress

Defined in: [packages/headless-uploader/src/types/uploader.ts:42](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L42)

Upload progress information

## Properties

### elapsedTime

> **elapsedTime**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:56](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L56)

Seconds elapsed since the upload started

***

### loaded

> **loaded**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:44](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L44)

Total bytes transferred so far

***

### percentage

> **percentage**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:48](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L48)

Progress as a percentage (0-100)

***

### speed

> **speed**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:50](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L50)

Current upload speed in bytes per second

***

### startTime

> **startTime**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:54](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L54)

Timestamp when the upload session started

***

### timeRemaining

> **timeRemaining**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:52](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L52)

Estimated seconds remaining based on current speed

***

### total

> **total**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:46](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L46)

Total size of the file/blob in bytes
