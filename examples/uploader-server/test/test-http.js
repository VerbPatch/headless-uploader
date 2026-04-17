const fileData = 'Hello HTTP protocol! This is a test upload using chunked multipart/form-data.';
const fileName = 'test-file-http.txt';
const chunkSize = 20; // Split into smaller chunks for testing
const BASE_URL = 'http://localhost:3000/upload';
const fileId = `test-${Date.now()}`;

async function uploadChunk(chunkIndex, totalChunks, chunkData) {
  const formData = new FormData();
  formData.append('chunkIndex', chunkIndex);
  formData.append('totalChunks', totalChunks);
  formData.append('filename', fileName);
  formData.append('fileId', fileId);
  formData.append('file', new Blob([chunkData]), `chunk-${chunkIndex}`);

  const res = await fetch(BASE_URL, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed with status: ${res.status}`);
  }

  const json = await res.json();
  return json;
}

async function runTest() {
  try {
    console.log('--- HTTP Protocol Test ---');
    console.log(`File ID: ${fileId}`);
    console.log(`File Name: ${fileName}`);
    console.log(`File Size: ${Buffer.byteLength(fileData)} bytes\n`);

    // Calculate chunks
    const totalChunks = Math.ceil(fileData.length / chunkSize);
    console.log(`Total Chunks: ${totalChunks}\n`);

    // Upload each chunk
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, fileData.length);
      const chunkData = fileData.slice(start, end);

      console.log(`--- Uploading Chunk ${i + 1}/${totalChunks} ---`);
      console.log(`Chunk Size: ${chunkData.length} bytes`);

      const result = await uploadChunk(i, totalChunks, chunkData);

      if (result.success) {
        if (result.path) {
          console.log(`✅ All chunks uploaded and merged!`);
          console.log(`File Path: ${result.path}\n`);
        } else {
          console.log(`✅ ${result.message}\n`);
        }
      } else {
        throw new Error(result.message);
      }
    }

    console.log('✅ HTTP Upload Test Completed Successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runTest();
