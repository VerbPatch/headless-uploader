---
title: UploaderError
description: Extends the standard Error with additional fields for machine-readable codes and file identification.
---

# UploaderError

Defined in: [packages/headless-uploader/src/types/uploader.ts:161](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L161)

Custom error object for uploader operations

## Extends

- `Error`

## Constructors

### Constructor

> **new UploaderError**(`message`, `options?`): `UploaderError`

Defined in: [packages/headless-uploader/src/types/uploader.ts:169](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L169)

#### Parameters

##### message

`string`

##### options?

###### code?

[`UploaderErrorCode`](/uploader/docs/api/Exception_Handling/UploaderErrorCode)

###### fileId?

`string`

###### response?

`unknown`

#### Returns

`UploaderError`

#### Overrides

`Error.constructor`

## Properties

### code?

> `optional` **code?**: [`UploaderErrorCode`](/uploader/docs/api/Exception_Handling/UploaderErrorCode)

Defined in: [packages/headless-uploader/src/types/uploader.ts:163](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L163)

Machine-readable error code (e.g., 'INVALID_FILE_TYPE', 'FILE_TOO_LARGE')

***

### fileId?

> `optional` **fileId?**: `string`

Defined in: [packages/headless-uploader/src/types/uploader.ts:165](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L165)

The unique identifier of the file associated with this error

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@6.0.2/node\_modules/typescript/lib/lib.es5.d.ts:1075

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@6.0.2/node\_modules/typescript/lib/lib.es5.d.ts:1074

#### Inherited from

`Error.name`

***

### response?

> `optional` **response?**: `unknown`

Defined in: [packages/headless-uploader/src/types/uploader.ts:167](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L167)

The raw server response if the error occurred during a network request

***

### stack?

> `optional` **stack?**: `string`

Defined in: node\_modules/.pnpm/typescript@6.0.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.stack`
