const fileData = 'Hello TUS protocol! This is a test upload using fetch.';
const fileName = 'test-file.txt';
const metadata = `filename ${Buffer.from(fileName).toString('base64')}`;
const BASE_URL = 'http://localhost:3000/tus';

async function runTest() {
  try {
    console.log('--- Step 1: Creating Upload ---');

    const createRes = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Tus-Resumable': '1.0.0',
        'Upload-Length': Buffer.byteLength(fileData).toString(),
        'Upload-Metadata': metadata,
      },
    });

    const location = createRes.headers.get('location');

    if (createRes.status !== 201 || !location) {
      throw new Error(`Creation failed with status: ${createRes.status}`);
    }

    // Resolve relative URLs if the server only returns the path
    const uploadUrl = new URL(location, BASE_URL).href;
    console.log(`✅ Upload created at: ${uploadUrl}`);

    console.log('\n--- Step 2: Uploading Data (PATCH) ---');

    const patchRes = await fetch(uploadUrl, {
      method: 'PATCH',
      headers: {
        'Tus-Resumable': '1.0.0',
        'Upload-Offset': '0',
        'Content-Type': 'application/offset+octet-stream',
      },
      body: fileData,
    });

    if (patchRes.status === 204) {
      console.log('✅ Success! Data uploaded.');
      console.log(`New Offset: ${patchRes.headers.get('upload-offset')}`);
    } else {
      throw new Error(`PATCH failed with status: ${patchRes.status}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runTest();
