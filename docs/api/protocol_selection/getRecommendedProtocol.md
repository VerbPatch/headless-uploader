---
title: getRecommendedProtocol
description: Suggests the most suitable upload protocol based on file size and modern browser feature support.
---

# getRecommendedProtocol()

> **getRecommendedProtocol**(`fileSize`, `browserCapabilities?`): [`UploadProtocol`](/uploader/docs/api/types/UploadProtocol)

Defined in: [packages/headless-uploader/src/adapters/index.ts:78](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/adapters/index.ts#L78)

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

## Example

```typescript
const protocol = getRecommendedProtocol(file.size);
console.log(`We suggest using: ${protocol}`);
```
