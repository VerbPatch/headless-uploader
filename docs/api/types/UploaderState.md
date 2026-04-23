---
title: UploaderState
description: A read-only snapshot of the uploader's current state.
---

# UploaderState

Defined in: [packages/headless-uploader/src/types/uploader.ts:421](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L421)

UI-friendly representation of the uploader state

## Properties

### completedFiles

> **completedFiles**: [`UploadFile`](/uploader/docs/api/Types/UploadFile)[]

Defined in: [packages/headless-uploader/src/types/uploader.ts:427](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L427)

Subset of files in the `completed` state

***

### failedFiles

> **failedFiles**: [`UploadFile`](/uploader/docs/api/Types/UploadFile)[]

Defined in: [packages/headless-uploader/src/types/uploader.ts:429](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L429)

Subset of files in the `failed` state

***

### files

> **files**: [`UploadFile`](/uploader/docs/api/Types/UploadFile)[]

Defined in: [packages/headless-uploader/src/types/uploader.ts:423](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L423)

List of all files currently in the uploader

***

### isPaused

> **isPaused**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:441](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L441)

Whether at least one file is currently paused

***

### isUploading

> **isUploading**: `boolean`

Defined in: [packages/headless-uploader/src/types/uploader.ts:439](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L439)

Whether at least one file is actively uploading

***

### queuedFiles

> **queuedFiles**: [`UploadFile`](/uploader/docs/api/Types/UploadFile)[]

Defined in: [packages/headless-uploader/src/types/uploader.ts:431](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L431)

Subset of files in the `queued` state

***

### totalProgress

> **totalProgress**: `object`

Defined in: [packages/headless-uploader/src/types/uploader.ts:433](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L433)

Aggregate progress metrics across all managed files

#### loaded

> **loaded**: `number`

#### percentage

> **percentage**: `number`

#### total

> **total**: `number`

***

### uploadingFiles

> **uploadingFiles**: [`UploadFile`](/uploader/docs/api/Types/UploadFile)[]

Defined in: [packages/headless-uploader/src/types/uploader.ts:425](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L425)

Subset of files currently in the `uploading` state
