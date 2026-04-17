---
title: getRecommendedProtocol
description: Suggests the most suitable upload protocol based on file size and modern browser feature support.
---

# getRecommendedProtocol()

> **getRecommendedProtocol**(`fileSize`, `browserCapabilities?`): [`UploadProtocol`](/uploader/docs/api/types/UploadProtocol)

Defined in: packages/headless-uploader/src/adapters/index.ts:59

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
