---
title: useUploader
description: Initializes a new headless uploader instance with the provided configuration.
---

# useUploader()

> **useUploader**(`config?`): [`UploaderInterface`](/uploader/docs/api/Types/UploaderInterface)

Defined in: [packages/headless-uploader/src/core/instance.ts:518](https://github.com/VerbPatch/headless-uploader/blob/9533dd838fe6a6d6e04bf01dcdc5ddac530f3814/packages/headless-uploader/src/core/instance.ts#L518)

Initializes a new headless uploader instance with the provided configuration.

## Parameters

### config?

[`UploaderConfig`](/uploader/docs/api/Types/UploaderConfig)

Optional configuration for the uploader

## Returns

[`UploaderInterface`](/uploader/docs/api/Types/UploaderInterface)

The UploaderInterface to interact with the uploader

## Example

```typescript
function MyComponent() {
  const uploader = useUploader({
    maxFiles: 5,
    onUploadSuccess: (file, response) => {
      console.log('Upload finished!', response);
    }
  });

  return (
    <div onDrop={uploader.handleDrop} onDragOver={uploader.handleDragOver}>
      Drop files here
    </div>
  );
}
```
