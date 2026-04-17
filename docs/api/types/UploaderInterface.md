---
title: UploaderInterface
description: The public API for interacting with a headless uploader instance.
---

# UploaderInterface

Defined in: packages/headless-uploader/src/types/uploader.ts:351

Uploader public interface

## Properties

### addFiles

> **addFiles**: (`fileList`) => `Promise`\<`void`\>

Defined in: packages/headless-uploader/src/types/uploader.ts:364

Add files to the upload queue

#### Parameters

##### fileList

`File`[] \| `FileList`

#### Returns

`Promise`\<`void`\>

***

### cancelUpload

> **cancelUpload**: (`fileId`) => `Promise`\<`void`\>

Defined in: packages/headless-uploader/src/types/uploader.ts:379

Cancel an active or queued file upload

#### Parameters

##### fileId

`string`

#### Returns

`Promise`\<`void`\>

***

### clearAll

> **clearAll**: () => `Promise`\<`void`\>

Defined in: packages/headless-uploader/src/types/uploader.ts:368

Cancel all uploads and clear the file list

#### Returns

`Promise`\<`void`\>

***

### destroy

> **destroy**: () => `Promise`\<`void`\>

Defined in: packages/headless-uploader/src/types/uploader.ts:392

Cleanup the uploader instance and release resources

#### Returns

`Promise`\<`void`\>

***

### getFile

> **getFile**: (`fileId`) => [`UploadFile`](/uploader/docs/api/types/UploadFile) \| `undefined`

Defined in: packages/headless-uploader/src/types/uploader.ts:355

Get a specific file by its identifier

#### Parameters

##### fileId

`string`

#### Returns

[`UploadFile`](/uploader/docs/api/types/UploadFile) \| `undefined`

***

### getFiles

> **getFiles**: () => [`UploadFile`](/uploader/docs/api/types/UploadFile)[]

Defined in: packages/headless-uploader/src/types/uploader.ts:353

Get all files currently in the uploader

#### Returns

[`UploadFile`](/uploader/docs/api/types/UploadFile)[]

***

### getPreview

> **getPreview**: (`fileId`) => `string` \| `undefined`

Defined in: packages/headless-uploader/src/types/uploader.ts:359

Get the preview URL for a specific file

#### Parameters

##### fileId

`string`

#### Returns

`string` \| `undefined`

***

### getState

> **getState**: () => [`UploaderState`](/uploader/docs/api/types/UploaderState)

Defined in: packages/headless-uploader/src/types/uploader.ts:357

Get a reactive-friendly snapshot of the current state

#### Returns

[`UploaderState`](/uploader/docs/api/types/UploaderState)

***

### getTotalProgress

> **getTotalProgress**: () => `object`

Defined in: packages/headless-uploader/src/types/uploader.ts:361

Get the aggregate progress of all files

#### Returns

`object`

##### loaded

> **loaded**: `number`

##### percentage

> **percentage**: `number`

##### total

> **total**: `number`

***

### handleDragOver

> **handleDragOver**: (`event`) => `void`

Defined in: packages/headless-uploader/src/types/uploader.ts:384

Helper for handling dragover events

#### Parameters

##### event

`DragEvent`

#### Returns

`void`

***

### handleDrop

> **handleDrop**: (`event`) => `Promise`\<`void`\>

Defined in: packages/headless-uploader/src/types/uploader.ts:386

Helper for handling drop events

#### Parameters

##### event

`DragEvent`

#### Returns

`Promise`\<`void`\>

***

### handleFileSelect

> **handleFileSelect**: (`event`) => `Promise`\<`void`\>

Defined in: packages/headless-uploader/src/types/uploader.ts:388

Helper for handling file input change events

#### Parameters

##### event

`Event`

#### Returns

`Promise`\<`void`\>

***

### pauseUpload

> **pauseUpload**: (`fileId`) => `Promise`\<`void`\>

Defined in: packages/headless-uploader/src/types/uploader.ts:375

Pause an active file upload

#### Parameters

##### fileId

`string`

#### Returns

`Promise`\<`void`\>

***

### removeFile

> **removeFile**: (`fileId`) => `Promise`\<`void`\>

Defined in: packages/headless-uploader/src/types/uploader.ts:366

Remove a file from the uploader and cancel its upload if active

#### Parameters

##### fileId

`string`

#### Returns

`Promise`\<`void`\>

***

### resumeUpload

> **resumeUpload**: (`fileId`) => `Promise`\<`void`\>

Defined in: packages/headless-uploader/src/types/uploader.ts:377

Resume a paused file upload

#### Parameters

##### fileId

`string`

#### Returns

`Promise`\<`void`\>

***

### retryUpload

> **retryUpload**: (`fileId`) => `Promise`\<`void`\>

Defined in: packages/headless-uploader/src/types/uploader.ts:381

Retry a failed file upload

#### Parameters

##### fileId

`string`

#### Returns

`Promise`\<`void`\>

***

### updateConfig

> **updateConfig**: (`config`) => `void`

Defined in: packages/headless-uploader/src/types/uploader.ts:390

Update the uploader's configuration on the fly

#### Parameters

##### config

`Partial`\<[`UploaderConfig`](/uploader/docs/api/types/UploaderConfig)\>

#### Returns

`void`

***

### uploadAll

> **uploadAll**: () => `Promise`\<`void`\>

Defined in: packages/headless-uploader/src/types/uploader.ts:371

Start uploading all queued files

#### Returns

`Promise`\<`void`\>

***

### uploadFile

> **uploadFile**: (`fileId`) => `Promise`\<`void`\>

Defined in: packages/headless-uploader/src/types/uploader.ts:373

Start or resume uploading a specific file

#### Parameters

##### fileId

`string`

#### Returns

`Promise`\<`void`\>
