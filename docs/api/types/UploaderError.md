---
title: UploaderError
description: Extends the standard Error with additional fields for machine-readable codes and file identification.
---

# UploaderError

Defined in: [packages/headless-uploader/src/types/uploader.ts:129](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L129)

Custom error object for uploader operations

## Extends

- `Error`

## Constructors

### Constructor

> **new UploaderError**(`message`, `options?`): `UploaderError`

Defined in: [packages/headless-uploader/src/types/uploader.ts:137](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L137)

#### Parameters

##### message

`string`

##### options?

###### code?

`UploaderErrorCode`

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

> `optional` **code?**: `UploaderErrorCode`

Defined in: [packages/headless-uploader/src/types/uploader.ts:131](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L131)

Machine-readable error code (e.g., 'INVALID_FILE_TYPE', 'FILE_TOO_LARGE')

***

### fileId?

> `optional` **fileId?**: `string`

Defined in: [packages/headless-uploader/src/types/uploader.ts:133](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L133)

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

Defined in: [packages/headless-uploader/src/types/uploader.ts:135](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/types/uploader.ts#L135)

The raw server response if the error occurred during a network request

***

### stack?

> `optional` **stack?**: `string`

Defined in: node\_modules/.pnpm/typescript@6.0.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.stack`
