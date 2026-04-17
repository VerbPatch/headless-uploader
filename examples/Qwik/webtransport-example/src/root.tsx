import { component$ } from '@builder.io/qwik';
import { App } from './app';

export default component$(() => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Uploader - WebTransport</title>
        <link href="src/styles.css" rel="stylesheet" />
      </head>
      <body>
        <div id="app">
          <App />
        </div>
      </body>
    </html>
  );
});
