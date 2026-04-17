# 📤 Headless File Uploader

A powerful, flexible, and completely headless file upload library for applications. Built with TypeScript, zero dependencies, and designed to work with any UI framework or design system.

## ✨ Features

- 🎯 **Completely Headless** - No UI components, just pure logic and state management
- 📁 **Multi-File Upload** - Effortlessly handle single or multiple files simultaneously
- 🎨 **Framework Agnostic** - Provides stable, isolated wrappers for React, Vue, Svelte, Angular, Solid, Qwik, Lit, and jQuery
- 📊 **Real-time Progress** - Precise tracking with speed (bps) and time remaining estimates
- 🧩 **Chunked Upload** - Intelligent large file splitting with concurrent chunk processing
- ⏸️ **Pause & Resume** - Full control over the upload lifecycle at any moment
- 🔁 **Auto Retry** - Robust error handling with customizable exponential backoff
- 🖼️ **Preview Generation** - Built-in high-performance preview generation for images and videos
- 📋 **Metadata Extraction** - Automatically extract dimensions, duration, and extended file metadata
- ☁️ **Cloud Ready** - Flexible adapter pattern for AWS S3, Google Cloud, Azure, and more: TBD
- 🗜️ **Smart Compression** - Optional client-side image compression before transfer
- ✅ **Advanced Validation** - Deep validation for MIME types, extensions, size, and custom logic
- 🎭 **TypeScript First** - 100% type safety and excellent IntelliSense support
- 🌳 **Tree Shakeable** - Import only what you need, keeping bundles tiny
- 📦 **Zero Dependencies** - Highly secure, fast, and completely self-contained core engine

## 🚀 Installation

Install the relevant library for use in available framework.

| Framework                                                                                          | Package Name                                                                               | Installation Command                        |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------- |
| <img src="https://cdn.simpleicons.org/javascript" alt="JavaScript" height="16" width="16"> Vanilla | [@verbpatch/headless-uploader](https://www.npmjs.com/package/@verbpatch/headless-uploader) | `npm install @verbpatch/headless-uploader` |
| <img src="https://cdn.simpleicons.org/react" alt="React" height="16" width="16"> React             | [@verbpatch/react-uploader](https://www.npmjs.com/package/@verbpatch/react-uploader)       | `npm install @verbpatch/react-uploader`    |
| <img src="https://cdn.simpleicons.org/svelte" alt="Svelte" height="16" width="16"> Svelte          | [@verbpatch/svelte-uploader](https://www.npmjs.com/package/@verbpatch/svelte-uploader)     | `npm install @verbpatch/svelte-uploader`   |
| <img src="https://cdn.simpleicons.org/vue.js" alt="Vue.js" height="16" width="16"> Vuejs           | [@verbpatch/vue-uploader](https://www.npmjs.com/package/@verbpatch/vue-uploader)           | `npm install @verbpatch/vue-uploader`      |
| <img src="https://cdn.simpleicons.org/jquery" alt="jQuery" height="16" width="16"> jQuery          | [@verbpatch/jquery-uploader](https://www.npmjs.com/package/@verbpatch/jquery-uploader)     | `npm install @verbpatch/jquery-uploader`   |
| <img src="https://cdn.simpleicons.org/angular" alt="Angular" height="16" width="16"> Angular       | [@verbpatch/angular-uploader](https://www.npmjs.com/package/@verbpatch/angular-uploader)   | `npm install @verbpatch/angular-uploader` |
| <img src="https://cdn.simpleicons.org/lit" alt="Lit" height="16" width="16"> Lit                   | [@verbpatch/lit-uploader](https://www.npmjs.com/package/@verbpatch/lit-uploader)           | `npm install @verbpatch/lit-uploader`      |
| <img src="https://cdn.simpleicons.org/preact" alt="Preact" height="16" width="16"> Preact          | [@verbpatch/preact-uploader](https://www.npmjs.com/package/@verbpatch/preact-uploader)     | `npm install @verbpatch/preact-uploader`   |
| <img src="https://cdn.simpleicons.org/qwik" alt="Qwik" height="16" width="16"> Qwik                | [@verbpatch/qwik-uploader](https://www.npmjs.com/package/@verbpatch/qwik-uploader)         | `npm install @verbpatch/qwik-uploader`     |
| <img src="https://cdn.simpleicons.org/solid" alt="Solid" height="16" width="16"> SolidJs           | [@verbpatch/solid-uploader](https://www.npmjs.com/package/@verbpatch/solid-uploader)       | `npm install @verbpatch/solid-uploader`    |

### 🪁 Basic Javascript/Typescript Example

```js
import { useUploader } from "@verbpatch/headless-uploader";

const uploader = useUploader({
  http: {
    endpoint: "/api/upload",
  },
  autoUpload: true,
  onUploadProgress: (file, progress) => {
    console.log(`${file.metadata.name}: ${progress.percentage}%`);
  },
});

// Bind to a file input
const input = document.getElementById('my-input');
input.addEventListener('change', (e) => uploader.handleFileSelect(e));

// Or handle drag & drop
const dropzone = document.getElementById('dropzone');
dropzone.addEventListener('dragover', (e) => uploader.handleDragOver(e));
dropzone.addEventListener('drop', (e) => uploader.handleDrop(e));
```

### 🎨 Basic React Example

```tsx
import { useUploader } from "@verbpatch/react-uploader";

function MyUploader() {
  const uploader = useUploader({
    http: { endpoint: "/api/upload" },
    maxFiles: 5,
    onUploadSuccess: (file, response) => {
      console.log('Upload finished!', response);
    }
  });

  const state = uploader.getState();

  return (
    <div>
      <div 
        onDrop={uploader.handleDrop} 
        onDragOver={uploader.handleDragOver}
        style={{ border: '2px dashed #ccc', padding: '20px' }}
      >
        Drop files here or <input type="file" onChange={uploader.handleFileSelect} multiple />
      </div>

      <ul>
        {state.files.map(file => (
          <li key={file.id}>
            {file.metadata.name} - {file.status} 
            ({file.progress.percentage.toFixed(1)}%)
            <button onClick={() => uploader.cancelUpload(file.id)}>Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## 🔗 Helpful Links

- [Documentation](https://www.verbpatch.com/uploader/docs/introduction)
- [Examples](https://github.com/VerbPatch/headless-uploader/tree/main/examples)
- [Issues](https://github.com/verbpatch/headless-uploader/issues)
- [Contributing Guide](https://github.com/verbpatch/headless-uploader/blob/main/CONTRIBUTING.md)
- [Changelog](https://github.com/verbpatch/headless-uploader/blob/main/CHANGELOG.md)
