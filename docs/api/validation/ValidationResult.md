---
title: ValidationResult
description: Represents the outcome of a file validation process.
---

# ValidationResult

Defined in: [packages/headless-uploader/src/types/validation.ts:7](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/validation.ts#L7)

Validation result for one or more files

## Properties

### errors

> **errors**: [`ValidationError`](/uploader/docs/api/validation/ValidationError)[]

Defined in: [packages/headless-uploader/src/types/validation.ts:11](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/validation.ts#L11)

List of validation errors, if any

***

### valid

> **valid**: `boolean`

Defined in: [packages/headless-uploader/src/types/validation.ts:9](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/types/validation.ts#L9)

Whether all files passed validation
