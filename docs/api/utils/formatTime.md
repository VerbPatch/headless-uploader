---
title: formatTime
description: Converts a duration in seconds into a standard HH:MM:SS format.
---

# formatTime()

> **formatTime**(`seconds`): `string`

Defined in: [packages/headless-uploader/src/utils/helpers.ts:48](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/utils/helpers.ts#L48)

Format seconds into a human-readable duration string

## Parameters

### seconds

`number`

The number of seconds to format

## Returns

`string`

A formatted string like "02:30" or "1:05:20"

## Example

```typescript
formatTime(150); // "2:30"
formatTime(3661); // "1:01:01"
```
