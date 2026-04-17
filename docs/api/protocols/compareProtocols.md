---
title: compareProtocols
description: Ranks available protocols based on their suitability for a specific upload scenario.
---

# compareProtocols()

> **compareProtocols**(`fileSize`, `requirements?`): `ProtocolComparison`[]

Defined in: packages/headless-uploader/src/adapters/index.ts:206

Compare and rank protocols for a specific set of requirements

## Parameters

### fileSize

`number`

Size of the file in bytes

### requirements?

Optional set of functional requirements

#### needsBidirectional?

`boolean`

#### needsRealtime?

`boolean`

#### needsResumability?

`boolean`

#### needsStreaming?

`boolean`

## Returns

`ProtocolComparison`[]

An array of ProtocolComparison objects sorted by score
