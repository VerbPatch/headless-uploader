import { setupUploader } from './uploader.js';

document.querySelector('#app').innerHTML = `
  <header>
    <h1>Vanilla Uploader - TUS example</h1>
    <p>Resumable uploads using the TUS protocol. Minimal UI to showcase headless logic.</p>
  </header>

  <section id="configuration">
    <h2>1. Input</h2>
    <div>
      <label for="auth-token">Authorization Token:</label>
      <input type="text" id="auth-token" placeholder="Enter 'verbpatch-secret-token'" value="verbpatch-secret-token">
      <p>The server requires 'verbpatch-secret-token' to allow uploads. Try changing it to see auth failure.</p>
    </div>

    <div id="drop-zone">
      <strong>Drop files here</strong> or click to select
    </div>
    <input type="file" id="file-input" multiple style="display:none" accept="application/pdf">
    
    <div class="controls">
      <button id="upload-all">Upload All</button>
      <button id="clear-all">Clear Queue</button>
    </div>
  </section>

  <section id="file-queue">
    <h2>2. File Queue & Progress</h2>
    <div id="file-list">
      <p>Queue is empty.</p>
    </div>
  </section>

  <section id="uploader-state">
    <h2>3. Internal State (Reactive)</h2>
    <pre id="stats-raw">Waiting for activity...</pre>
  </section>
`;

setupUploader();
