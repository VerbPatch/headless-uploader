---
title: formatBytes
description: Converts a byte count into a readable format (KB, MB, GB, etc.).
---

# formatBytes()

> **formatBytes**(`bytes`, `decimals?`): `string`

Defined in: [packages/headless-uploader/src/utils/helpers.ts:26](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/utils/helpers.ts#L26)

Format bytes into a human-readable string

## Parameters

### bytes

`number`

The number of bytes to format

### decimals?

`number` = `2`

Number of decimal places (default: 2)

## Returns

`string`

A formatted string like "1.5 MB"

## Example

```typescript
formatBytes(1024); // "1 KB"
formatBytes(1234567, 1); // "1.2 MB"
```
