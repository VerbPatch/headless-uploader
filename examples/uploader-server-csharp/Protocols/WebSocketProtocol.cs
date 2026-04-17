using System.Net.WebSockets;
using System.Text;
using Newtonsoft.Json;
using UploaderServer.Models;

namespace UploaderServer.Protocols;

public static class WebSocketProtocol
{
    private class UploadSession
    {
        public string? FileName { get; set; }
        public int TotalChunks { get; set; }
        public int ReceivedChunks { get; set; }
        public long ReceivedBytes { get; set; }
    }

    private static readonly Dictionary<string, UploadSession> Sessions = new();

    public static async Task HandleWebSocketAsync(HttpContext context)
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
            var chunkMetadataQueue = new Dictionary<string, Queue<WebSocketMessage>>();
            
            await ProcessWebSocketAsync(webSocket, chunkMetadataQueue);
        }
        else
        {
            context.Response.StatusCode = 400;
        }
    }

    private static async Task ProcessWebSocketAsync(WebSocket webSocket, Dictionary<string, Queue<WebSocketMessage>> metadataQueues)
    {
        var buffer = new byte[1024 * 64]; // 64KB buffer
        
        try
        {
            while (webSocket.State == WebSocketState.Open)
            {
                var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                if (result.MessageType == WebSocketMessageType.Close)
                {
                    await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
                }
                else if (result.MessageType == WebSocketMessageType.Text)
                {
                    var messageText = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    var message = JsonConvert.DeserializeObject<WebSocketMessage>(messageText);

                    if (message != null)
                    {
                        await HandleTextMessageAsync(webSocket, message, metadataQueues);
                    }
                }
                else if (result.MessageType == WebSocketMessageType.Binary)
                {
                    // For binary messages, we might need to handle multi-part frames if buffer is too small
                    // But for now, let's assume one chunk per binary message or handle it simply.
                    using var ms = new MemoryStream();
                    ms.Write(buffer, 0, result.Count);
                    while (!result.EndOfMessage)
                    {
                        result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                        ms.Write(buffer, 0, result.Count);
                    }

                    await HandleBinaryMessageAsync(webSocket, ms.ToArray(), metadataQueues);
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WebSocket Error: {ex.Message}");
        }
    }

    private static async Task HandleTextMessageAsync(WebSocket webSocket, WebSocketMessage message, Dictionary<string, Queue<WebSocketMessage>> metadataQueues)
    {
        if (string.IsNullOrEmpty(message.FileId)) return;

        switch (message.Type)
        {
            case "init":
                Sessions[message.FileId] = new UploadSession
                {
                    FileName = message.FileName,
                    TotalChunks = message.TotalChunks,
                    ReceivedChunks = 0,
                    ReceivedBytes = 0
                };
                metadataQueues[message.FileId] = new Queue<WebSocketMessage>();
                Console.WriteLine($"WS Init: {message.FileName}");
                break;

            case "chunk":
                if (metadataQueues.TryGetValue(message.FileId, out var queue))
                {
                    queue.Enqueue(message);
                }
                break;

            case "complete":
                if (Sessions.TryGetValue(message.FileId, out var session))
                {
                    var finalFileName = await ChunkManager.MergeChunksAsync(message.FileId, session.FileName!, session.TotalChunks);
                    
                    var response = new WebSocketMessage
                    {
                        Type = "complete",
                        FileId = message.FileId,
                        Success = true,
                        Url = $"/uploads/{finalFileName}"
                    };
                    
                    await SendJsonAsync(webSocket, response);
                    Sessions.Remove(message.FileId);
                    metadataQueues.Remove(message.FileId);
                }
                break;
        }
    }

    private static async Task HandleBinaryMessageAsync(WebSocket webSocket, byte[] data, Dictionary<string, Queue<WebSocketMessage>> metadataQueues)
    {
        // Find which fileId this belongs to
        foreach (var (fileId, queue) in metadataQueues)
        {
            if (queue.Count > 0)
            {
                var chunkInfo = queue.Dequeue();
                if (Sessions.TryGetValue(fileId, out var session))
                {
                    using var ms = new MemoryStream(data);
                    await ChunkManager.SaveChunkAsync(fileId, chunkInfo.ChunkIndex, ms);
                    
                    session.ReceivedChunks++;
                    session.ReceivedBytes += data.Length;

                    var response = new WebSocketMessage
                    {
                        Type = "progress",
                        FileId = fileId,
                        BytesUploaded = session.ReceivedBytes,
                        ChunksReceived = session.ReceivedChunks
                    };
                    
                    await SendJsonAsync(webSocket, response);
                    return;
                }
            }
        }
    }

    private static async Task SendJsonAsync(WebSocket webSocket, object data)
    {
        var json = JsonConvert.SerializeObject(data);
        var bytes = Encoding.UTF8.GetBytes(json);
        await webSocket.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Text, true, CancellationToken.None);
    }
}
