using System.Buffers.Binary;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Newtonsoft.Json;
using UploaderServer.Models;
using System.Security.Cryptography.X509Certificates;
using System.IO.Pipelines;
using Microsoft.AspNetCore.Connections;

namespace UploaderServer.Protocols;

public static class WebTransportProtocol
{
    private class UploadSession
    {
        public string? FileName { get; set; }
        public int TotalChunks { get; set; }
        public int ReceivedChunks { get; set; }
        public long ReceivedBytes { get; set; }
        public string? FileId { get; set; }
        public int? NextChunkIndex { get; set; }
    }

    public static async Task HandleWebTransportAsync(HttpContext context)
    {
        var feature = context.Features.Get<IHttpWebTransportFeature>();
        if (feature == null || !feature.IsWebTransportRequest)
        {
            Console.WriteLine("⚠️ Not a WebTransport request");
            context.Response.StatusCode = 400;
            return;
        }

        try 
        {
            var session = await feature.AcceptAsync(context.RequestAborted);
            if (session == null) return;
            
            Console.WriteLine("✅ WebTransport session accepted");
            await HandleIncomingStreamsAsync(session);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ WebTransport session error: {ex.Message}");
        }
    }

    private static async Task HandleIncomingStreamsAsync(IWebTransportSession session)
    {
        while (true)
        {
            var connectionContext = await session.AcceptStreamAsync(CancellationToken.None);
            if (connectionContext == null) break;

            // Simple check: if we can't write, it's unidirectional
            if (connectionContext.Transport.Output == null)
            {
                Console.WriteLine("📥 Accepted unidirectional stream");
                _ = Task.Run(() => HandleStreamAsync(connectionContext.Transport.Input, null));
            }
            else
            {
                Console.WriteLine("📥 Accepted bidirectional stream");
                _ = Task.Run(() => HandleStreamAsync(connectionContext.Transport.Input, connectionContext.Transport.Output));
            }
        }
    }

    private static async Task HandleStreamAsync(PipeReader reader, PipeWriter? writer)
    {
        var uploadInfo = new UploadSession();
        var readerStream = reader.AsStream();
        var writerStream = writer?.AsStream();

        try
        {
            while (true)
            {
                // 1. Read message type (1 byte)
                var typeBuf = await ReadExactAsync(readerStream, 1);
                if (typeBuf == null) break;
                byte msgType = typeBuf[0]; // 0 = JSON, 1 = Binary

                // 2. Read message length (4 bytes)
                var lenBuf = await ReadExactAsync(readerStream, 4);
                if (lenBuf == null) 
                {
                    Console.WriteLine("⚠️ Stream closed while reading length");
                    break;
                }
                uint msgLen = BinaryPrimitives.ReadUInt32LittleEndian(lenBuf);

                // 3. Read message content
                var msgBuf = await ReadExactAsync(readerStream, (int)msgLen);
                if (msgBuf == null)
                {
                    Console.WriteLine("⚠️ Stream closed while reading content");
                    break;
                }

                // 4. Process
                if (msgType == 0)
                {
                    var text = Encoding.UTF8.GetString(msgBuf);
                    var message = JsonConvert.DeserializeObject<UploaderMessage>(text);

                    if (message != null)
                    {
                        if (message.Type == "init")
                        {
                            uploadInfo.FileName = message.FileName;
                            uploadInfo.TotalChunks = message.TotalChunks;
                            uploadInfo.FileId = $"wt-{message.FileName}-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
                            
                            var chunkDir = Path.Combine(Config.ChunksDir, uploadInfo.FileId);
                            if (!Directory.Exists(chunkDir)) Directory.CreateDirectory(chunkDir);
                            
                            Console.WriteLine($"🚀 WT Init: {message.FileName} ({message.TotalChunks} chunks)");
                        }
                        else if (message.Type == "chunk")
                        {
                            uploadInfo.NextChunkIndex = message.ChunkIndex;
                        }
                        else if (message.Type == "complete")
                        {
                            if (uploadInfo.FileId != null && uploadInfo.FileName != null)
                            {
                                Console.WriteLine($"🏁 WT Complete: {uploadInfo.FileName}");
                                var finalFileName = await ChunkManager.MergeChunksAsync(uploadInfo.FileId, uploadInfo.FileName, uploadInfo.TotalChunks);

                                if (writerStream != null)
                                {
                                    var response = new WebSocketMessage
                                    {
                                        Type = "complete",
                                        Success = true,
                                        Url = $"/uploads/{finalFileName}",
                                        Message = "File upload completed successfully"
                                    };
                                    var responseJson = JsonConvert.SerializeObject(response);
                                    await writerStream.WriteAsync(Encoding.UTF8.GetBytes(responseJson));
                                    await writerStream.FlushAsync();
                                }
                                return;
                            }
                        }
                    }
                }
                else if (msgType == 1)
                {
                    if (uploadInfo.FileId != null && uploadInfo.NextChunkIndex.HasValue)
                    {
                        using var ms = new MemoryStream(msgBuf);
                        await ChunkManager.SaveChunkAsync(uploadInfo.FileId, uploadInfo.NextChunkIndex.Value, ms);
                        
                        uploadInfo.ReceivedChunks++;
                        uploadInfo.ReceivedBytes += msgBuf.Length;
                        
                        Console.WriteLine($"📦 Chunk {uploadInfo.NextChunkIndex + 1}/{uploadInfo.TotalChunks} saved ({msgBuf.Length} bytes)");

                        if (writerStream != null)
                        {
                            var response = new WebSocketMessage
                            {
                                Type = "progress",
                                FileId = uploadInfo.FileId,
                                ChunksReceived = uploadInfo.ReceivedChunks,
                                ChunkIndex = uploadInfo.NextChunkIndex.Value
                            };
                            var responseJson = JsonConvert.SerializeObject(response);
                            await writerStream.WriteAsync(Encoding.UTF8.GetBytes(responseJson));
                            await writerStream.FlushAsync();
                        }
                        
                        uploadInfo.NextChunkIndex = null;
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ WT Stream error: {ex.Message}");
        }
        finally
        {
            if (writerStream != null) await writerStream.DisposeAsync();
            await readerStream.DisposeAsync();
        }
    }

    private static async Task<byte[]?> ReadExactAsync(Stream stream, int n)
    {
        byte[] buffer = new byte[n];
        int offset = 0;
        while (offset < n)
        {
            try 
            {
                int read = await stream.ReadAsync(buffer.AsMemory(offset, n - offset));
                if (read == 0) return null;
                offset += read;
            }
            catch 
            {
                return null;
            }
        }
        return buffer;
    }

    public static byte[] GetCertFingerprint(string certPath)
    {
        using var cert = X509CertificateLoader.LoadCertificateFromFile(certPath);
        return SHA256.HashData(cert.RawData);
    }
}
