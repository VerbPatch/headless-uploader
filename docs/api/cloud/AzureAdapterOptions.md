---
title: AzureAdapterOptions
description: Configuration options for the Azure Blob Storage cloud storage adapter.
---

# AzureAdapterOptions

Defined in: packages/headless-uploader/src/types/cloudTypes.ts:29

Azure Blob Storage Adapter Configuration

## Properties

### blobType?

> `optional` **blobType?**: `"BlockBlob"` \| `"PageBlob"` \| `"AppendBlob"`

Defined in: packages/headless-uploader/src/types/cloudTypes.ts:40

The type of blob to create in Azure

#### Default

```ts
'BlockBlob'
```

***

### getUploadUrl

> **getUploadUrl**: (`file`) => `Promise`\<`string`\>

Defined in: packages/headless-uploader/src/types/cloudTypes.ts:34

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

Defined in: packages/headless-uploader/src/types/cloudTypes.ts:46

Additional custom headers to include in the Azure PUT request
`e.g., { 'x-ms-meta-category': 'images' }`
