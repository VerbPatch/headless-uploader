---
title: useUploader
description: Initializes a new headless uploader instance with the provided configuration.
---

# useUploader()

> **useUploader**(`config?`): [`UploaderInterface`](/uploader/docs/api/types/UploaderInterface)

Defined in: [packages/headless-uploader/src/core/instance.ts:505](https://github.com/VerbPatch/headless-uploader/blob/fc7195783146195f65e16cb9514b37913d6e03b9/packages/headless-uploader/src/core/instance.ts#L505)

Initializes a new headless uploader instance with the provided configuration.

## Parameters

### config?

[`UploaderConfig`](/uploader/docs/api/types/UploaderConfig)

Optional configuration for the uploader

## Returns

[`UploaderInterface`](/uploader/docs/api/types/UploaderInterface)

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
