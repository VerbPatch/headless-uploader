---
title: calculateSpeed
description: Computes the average upload speed based on bytes loaded and elapsed time.
---

# calculateSpeed()

> **calculateSpeed**(`loaded`, `startTime`): `number`

Defined in: [packages/headless-uploader/src/utils/helpers.ts:69](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/utils/helpers.ts#L69)

Calculate the current upload speed

## Parameters

### loaded

`number`

Number of bytes already uploaded

### startTime

`number`

The timestamp when the upload started

## Returns

`number`

Speed in bytes per second
