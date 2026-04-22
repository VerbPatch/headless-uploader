---
title: compareProtocols
description: Ranks available protocols based on their suitability for a specific upload scenario.
---

# compareProtocols()

> **compareProtocols**(`fileSize`, `requirements?`): `ProtocolComparison`[]

Defined in: [packages/headless-uploader/src/adapters/index.ts:205](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/adapters/index.ts#L205)

Compare and rank protocols for a specific set of requirements

## Parameters

### fileSize

`number`

Size of the file in bytes

### requirements?

Optional set of functional requirements

#### needsResumability?

`boolean`

## Returns

`ProtocolComparison`[]

An array of ProtocolComparison objects sorted by score
