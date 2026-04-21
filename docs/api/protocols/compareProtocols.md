---
title: compareProtocols
description: Ranks available protocols based on their suitability for a specific upload scenario.
---

# compareProtocols()

> **compareProtocols**(`fileSize`, `requirements?`): `ProtocolComparison`[]

Defined in: [packages/headless-uploader/src/adapters/index.ts:283](https://github.com/VerbPatch/headless-uploader/blob/759bfa998061b3af5e7b9f53fc466f76606d4b64/packages/headless-uploader/src/adapters/index.ts#L283)

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
