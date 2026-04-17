---
title: AzureAdapterOptions
description: Configuration options for the Azure Blob Storage cloud storage adapter.
---

# AzureAdapterOptions

Defined in: [packages/headless-uploader/src/types/cloudTypes.ts:29](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/cloudTypes.ts#L29)

Azure Blob Storage Adapter Configuration

## Properties

### blobType?

> `optional` **blobType?**: `"BlockBlob"` \| `"PageBlob"` \| `"AppendBlob"`

Defined in: [packages/headless-uploader/src/types/cloudTypes.ts:40](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/cloudTypes.ts#L40)

The type of blob to create in Azure

#### Default

```ts
'BlockBlob'
```

***

### getUploadUrl

> **getUploadUrl**: (`file`) => `Promise`\<`string`\>

Defined in: [packages/headless-uploader/src/types/cloudTypes.ts:34](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/cloudTypes.ts#L34)

Function to get a Shared Access Signature (SAS) URL from your backend

#### Parameters

##### file

[`UploadFile`](/uploader/docs/api/types/UploadFile)

The file being uploaded

#### Returns

`Promise`\<`string`\>

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: [packages/headless-uploader/src/types/cloudTypes.ts:46](https://github.com/VerbPatch/headless-uploader/blob/24e7558f0c45149fa75d59a07ac324f7e3fbff0d/packages/headless-uploader/src/types/cloudTypes.ts#L46)

Additional custom headers to include in the Azure PUT request
`e.g., { 'x-ms-meta-category': 'images' }`
