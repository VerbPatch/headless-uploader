---
title: UploaderInterface
description: The public API for interacting with a headless uploader instance.
---

# UploaderInterface

Defined in: [packages/headless-uploader/src/types/uploader.ts:455](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L455)

Uploader public interface

## Actions

### updateConfig

> **updateConfig**: (`config`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:548](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L548)

#### Parameters

##### config

`Partial`\<[`UploaderConfig`](/uploader/docs/api/Types/UploaderConfig)\>

#### Returns

`void`

#### Description

Update the uploader's configuration on the fly

## Event Handlers

### handleDragOver

> **handleDragOver**: (`event`) => `void`

Defined in: [packages/headless-uploader/src/types/uploader.ts:533](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L533)

#### Parameters

##### event

`DragEvent`

#### Returns

`void`

#### Description

Helper for handling dragover events. Sets drop effect.

***

### handleDrop

> **handleDrop**: (`event`) => `Promise`\<`void`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:538](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L538)

#### Parameters

##### event

`DragEvent`

#### Returns

`Promise`\<`void`\>

#### Description

Helper for handling drop events. Extracts files.

***

### handleFileSelect

> **handleFileSelect**: (`event`) => `Promise`\<`void`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:543](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L543)

#### Parameters

##### event

`Event`

#### Returns

`Promise`\<`void`\>

#### Description

Helper for handling file input change events. Extracts files.

## Lifecycle

### destroy

> **destroy**: () => `Promise`\<`void`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:553](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L553)

#### Returns

`Promise`\<`void`\>

#### Description

Cleanup the uploader instance, release memory and abort requests

## Queue Actions

### addFiles

> **addFiles**: (`fileList`) => `Promise`\<`void`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:486](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L486)

#### Parameters

##### fileList

`File`[] \| `FileList`

#### Returns

`Promise`\<`void`\>

#### Description

Add files to the upload queue. Triggers validation.

***

### clearAll

> **clearAll**: () => `Promise`\<`void`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:496](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L496)

#### Returns

`Promise`\<`void`\>

#### Description

Cancel all uploads and clear the file list

***

### removeFile

> **removeFile**: (`fileId`) => `Promise`\<`void`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:491](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L491)

#### Parameters

##### fileId

`string`

#### Returns

`Promise`\<`void`\>

#### Description

Remove a file from the uploader and cancel its upload if active

## State

### getFile

> **getFile**: (`fileId`) => [`UploadFile`](/uploader/docs/api/Types/UploadFile) \| `undefined`

Defined in: [packages/headless-uploader/src/types/uploader.ts:465](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L465)

#### Parameters

##### fileId

`string`

#### Returns

[`UploadFile`](/uploader/docs/api/Types/UploadFile) \| `undefined`

#### Description

Get a specific file by its identifier

***

### getFiles

> **getFiles**: () => [`UploadFile`](/uploader/docs/api/Types/UploadFile)[]

Defined in: [packages/headless-uploader/src/types/uploader.ts:460](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L460)

#### Returns

[`UploadFile`](/uploader/docs/api/Types/UploadFile)[]

#### Description

Get all files currently in the uploader

***

### getPreview

> **getPreview**: (`fileId`) => `string` \| `undefined`

Defined in: [packages/headless-uploader/src/types/uploader.ts:475](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L475)

#### Parameters

##### fileId

`string`

#### Returns

`string` \| `undefined`

#### Description

Get the preview URL for a specific file

***

### getState

> **getState**: () => [`UploaderState`](/uploader/docs/api/Types/UploaderState)

Defined in: [packages/headless-uploader/src/types/uploader.ts:470](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L470)

#### Returns

[`UploaderState`](/uploader/docs/api/Types/UploaderState)

#### Description

Get a reactive-friendly snapshot of the current state

***

### getTotalProgress

> **getTotalProgress**: () => `object`

Defined in: [packages/headless-uploader/src/types/uploader.ts:480](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L480)

#### Returns

`object`

##### loaded

> **loaded**: `number`

##### percentage

> **percentage**: `number`

##### total

> **total**: `number`

#### Description

Get the aggregate progress of all files

## Upload Actions

### cancelUpload

> **cancelUpload**: (`fileId`) => `Promise`\<`void`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:522](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L522)

#### Parameters

##### fileId

`string`

#### Returns

`Promise`\<`void`\>

#### Description

Cancel an active or queued file upload. Aborts requests.

***

### pauseUpload

> **pauseUpload**: (`fileId`) => `Promise`\<`void`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:512](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L512)

#### Parameters

##### fileId

`string`

#### Returns

`Promise`\<`void`\>

#### Description

Pause an active file upload. Supports resumption.

***

### resumeUpload

> **resumeUpload**: (`fileId`) => `Promise`\<`void`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:517](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L517)

#### Parameters

##### fileId

`string`

#### Returns

`Promise`\<`void`\>

#### Description

Resume a paused file upload from the last known state

***

### retryUpload

> **retryUpload**: (`fileId`) => `Promise`\<`void`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:527](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L527)

#### Parameters

##### fileId

`string`

#### Returns

`Promise`\<`void`\>

#### Description

Retry a failed file upload

***

### uploadAll

> **uploadAll**: () => `Promise`\<`void`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:502](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L502)

#### Returns

`Promise`\<`void`\>

#### Description

Start uploading all currently queued/pending files

***

### uploadFile

> **uploadFile**: (`fileId`) => `Promise`\<`void`\>

Defined in: [packages/headless-uploader/src/types/uploader.ts:507](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L507)

#### Parameters

##### fileId

`string`

#### Returns

`Promise`\<`void`\>

#### Description

Start or resume uploading a specific file
