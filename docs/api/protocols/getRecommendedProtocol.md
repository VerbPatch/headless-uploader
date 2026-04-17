---
title: getRecommendedProtocol
description: Suggests the most suitable upload protocol based on file size and modern browser feature support.
---

# getRecommendedProtocol()

> **getRecommendedProtocol**(`fileSize`, `browserCapabilities?`): [`UploadProtocol`](/uploader/docs/api/types/UploadProtocol)

Defined in: [packages/headless-uploader/src/adapters/index.ts:115](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/adapters/index.ts#L115)

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
