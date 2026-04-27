---
title: calculateSpeed
description: Computes the average upload speed based on bytes loaded and elapsed time.
---

# calculateSpeed()

> **calculateSpeed**(`loaded`, `startTime`): `number`

Defined in: [packages/headless-uploader/src/utils/helpers.ts:69](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/utils/helpers.ts#L69)

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
