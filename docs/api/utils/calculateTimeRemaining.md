---
title: calculateTimeRemaining
description: Predicts how much longer an upload will take based on current speed.
---

# calculateTimeRemaining()

> **calculateTimeRemaining**(`loaded`, `total`, `speed`): `number`

Defined in: [packages/headless-uploader/src/utils/helpers.ts:84](https://github.com/VerbPatch/headless-uploader/blob/fa87929455581a674ea388abbe1f6a0fd686dc13/packages/headless-uploader/src/utils/helpers.ts#L84)

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
