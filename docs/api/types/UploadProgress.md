---
title: UploadProgress
description: Contains detailed metrics about the current progress of an upload.
---

# UploadProgress

Defined in: [packages/headless-uploader/src/types/uploader.ts:43](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L43)

Upload progress information

## Properties

### elapsedTime

> **elapsedTime**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:57](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L57)

Seconds elapsed since the upload started

***

### loaded

> **loaded**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:45](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L45)

Total bytes transferred so far

***

### percentage

> **percentage**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:49](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L49)

Progress as a percentage (0-100)

***

### speed

> **speed**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:51](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L51)

Current upload speed in bytes per second

***

### startTime

> **startTime**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:55](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L55)

Timestamp when the upload session started

***

### timeRemaining

> **timeRemaining**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:53](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L53)

Estimated seconds remaining based on current speed

***

### total

> **total**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:47](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L47)

Total size of the file/blob in bytes
