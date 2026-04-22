---
title: formatTime
description: Converts a duration in seconds into a standard HH:MM:SS format.
---

# formatTime()

> **formatTime**(`seconds`): `string`

Defined in: [packages/headless-uploader/src/utils/helpers.ts:48](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/utils/helpers.ts#L48)

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
