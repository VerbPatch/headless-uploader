import { setupUploader } from './uploader.js';

document.querySelector('#app').innerHTML = `
  <header>
    <h1>Vanilla Uploader - Cloud Protocol</h1>
    <p>This example demonstrates direct-to-cloud (S3) uploads using the <strong>protocol: 'cloud'</strong> setting.</p>
  </header>

  <section id="configuration">
    <h2>1. Cloud Upload</h2>
    <p>Configured with <code>S3Adapter</code>. Uses mocked backend signing logic.</p>

    <div id="drop-zone">
      <strong>Drop files here</strong> or click to select
    </div>
    <input type="file" id="file-input" multiple style="display:none">
    
    <div class="controls">
      <button id="upload-all">Start Cloud Upload</button>
      <button id="clear-all">Clear Queue</button>
    </div>
  </section>

  <section id="file-queue">
    <h2>2. Queue & Progress</h2>
    <div id="file-list">
      <p>Queue is empty.</p>
    </div>
  </section>

  <section id="uploader-state">
    <h2>3. Instance State</h2>
    <pre id="stats-raw">Waiting for activity...</pre>
  </section>
`;

setupUploader();
