---
title: RetryConfig
description: Defines how the uploader should handle failed requests and retries.
---

# RetryConfig

Defined in: [packages/headless-uploader/src/types/uploader.ts:124](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L124)

Retry configuration

## Properties

### maxRetries

> **maxRetries**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:126](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L126)

Maximum number of retry attempts per file/chunk

***

### retryableStatuses

> **retryableStatuses**: `number`[]

Defined in: [packages/headless-uploader/src/types/uploader.ts:132](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L132)

List of HTTP status codes that should trigger a retry

***

### retryDelay

> **retryDelay**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:128](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L128)

Initial delay before first retry in milliseconds

***

### retryDelayMultiplier

> **retryDelayMultiplier**: `number`

Defined in: [packages/headless-uploader/src/types/uploader.ts:130](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/types/uploader.ts#L130)

Factor to multiply delay by for each subsequent retry (exponential backoff)
