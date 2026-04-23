---
title: calculateTimeRemaining
description: Predicts how much longer an upload will take based on current speed.
---

# calculateTimeRemaining()

> **calculateTimeRemaining**(`loaded`, `total`, `speed`): `number`

Defined in: [packages/headless-uploader/src/utils/helpers.ts:84](https://github.com/VerbPatch/headless-uploader/blob/082c5bec110f6e902077af4c9022810c190c723f/packages/headless-uploader/src/utils/helpers.ts#L84)

Calculate the estimated time remaining for an upload

## Parameters

### loaded

`number`

Number of bytes already uploaded

### total

`number`

Total number of bytes to upload

### speed

`number`

Current upload speed in bytes per second

## Returns

`number`

Estimated seconds remaining
