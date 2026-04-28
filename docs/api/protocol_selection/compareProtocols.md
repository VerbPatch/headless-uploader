---
title: compareProtocols
description: Ranks available protocols based on their suitability for a specific upload scenario.
---

# compareProtocols()

> **compareProtocols**(`fileSize`, `requirements?`): `ProtocolComparison`[]

Defined in: [packages/headless-uploader/src/adapters/index.ts:220](https://github.com/VerbPatch/headless-uploader/blob/456dd2546a7f41612bded6927e1ffa83bace7039/packages/headless-uploader/src/adapters/index.ts#L220)

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

## Example

```typescript
const results = compareProtocols(500 * 1024 * 1024, { needsResumability: true });
console.log('Best protocol:', results[0].protocol);
console.log('Why:', results[0].reasons.join(', '));
```
