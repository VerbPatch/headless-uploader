---
title: compareProtocols
description: Ranks available protocols based on their suitability for a specific upload scenario.
---

# compareProtocols()

> **compareProtocols**(`fileSize`, `requirements?`): `ProtocolComparison`[]

Defined in: [packages/headless-uploader/src/adapters/index.ts:256](https://github.com/VerbPatch/headless-uploader/blob/f38e759ac298841ab72a7b52e9b46bf3740f2af7/packages/headless-uploader/src/adapters/index.ts#L256)

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
