---
title: getRecommendedProtocol
description: Suggests the most suitable upload protocol based on file size and modern browser feature support.
---

# getRecommendedProtocol()

> **getRecommendedProtocol**(`fileSize`, `browserCapabilities?`): [`UploadProtocol`](/uploader/docs/api/types/UploadProtocol)

Defined in: [packages/headless-uploader/src/adapters/index.ts:73](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/adapters/index.ts#L73)

Get the recommended protocol based on file size and browser capabilities

## Parameters

### fileSize

`number`

Size of the file in bytes

### browserCapabilities?

Optional overrides for browser capability detection

#### supportsWebSocket?

`boolean`

#### supportsWebTransport?

`boolean`

## Returns

[`UploadProtocol`](/uploader/docs/api/types/UploadProtocol)

The recommended UploadProtocol
