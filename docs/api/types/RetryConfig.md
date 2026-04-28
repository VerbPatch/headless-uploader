---
title: RetryConfig
description: Defines how the uploader should handle failed requests and retries.
---

# RetryConfig

Defined in: [packages/headless-uploader/src/types/uploader.ts:125](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L125)

Retry configuration

## Properties

### maxRetries

> **maxRetries**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:127](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L127)

Maximum number of retry attempts per file/chunk

***

### retryableStatuses

> **retryableStatuses**: `number`[]

Defined in: [packages/headless-uploader/src/types/uploader.ts:133](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L133)

List of HTTP status codes that should trigger a retry

***

### retryDelay

> **retryDelay**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:129](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L129)

Initial delay before first retry in milliseconds

***

### retryDelayMultiplier

> **retryDelayMultiplier**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:131](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/types/uploader.ts#L131)

Factor to multiply delay by for each subsequent retry (exponential backoff)
