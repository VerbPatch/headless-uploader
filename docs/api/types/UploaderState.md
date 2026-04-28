---
title: UploaderState
description: A read-only snapshot of the uploader's current state.
---

# UploaderState

Defined in: [packages/headless-uploader/src/types/uploader.ts:426](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L426)

UI-friendly representation of the uploader state

## Properties

### completedFiles

> **completedFiles**: [`UploadFile`](/uploader/docs/api/types/UploadFile)[]

Defined in: [packages/headless-uploader/src/types/uploader.ts:432](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L432)

Subset of files in the `completed` state

***

### failedFiles

> **failedFiles**: [`UploadFile`](/uploader/docs/api/types/UploadFile)[]

Defined in: [packages/headless-uploader/src/types/uploader.ts:434](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L434)

Subset of files in the `failed` state

***

### files

> **files**: [`UploadFile`](/uploader/docs/api/types/UploadFile)[]

Defined in: [packages/headless-uploader/src/types/uploader.ts:428](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L428)

List of all files currently in the uploader

***

### isPaused

> **isPaused**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:446](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L446)

Whether at least one file is currently paused

***

### isUploading

> **isUploading**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:444](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L444)

Whether at least one file is actively uploading

***

### queuedFiles

> **queuedFiles**: [`UploadFile`](/uploader/docs/api/types/UploadFile)[]

Defined in: [packages/headless-uploader/src/types/uploader.ts:436](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L436)

Subset of files in the `queued` state

***

### totalProgress

> **totalProgress**: `object`

Defined in: [packages/headless-uploader/src/types/uploader.ts:438](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L438)

Aggregate progress metrics across all managed files

#### loaded

> **loaded**: `number`

#### percentage

> **percentage**: `number`

#### total

> **total**: `number`

***

### uploadingFiles

> **uploadingFiles**: [`UploadFile`](/uploader/docs/api/types/UploadFile)[]

Defined in: [packages/headless-uploader/src/types/uploader.ts:430](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/types/uploader.ts#L430)

Subset of files currently in the `uploading` state
