using Newtonsoft.Json;

namespace UploaderServer.Models;

public class WebSocketMessage
{
    [JsonProperty("type")]
    public string? Type { get; set; }

    [JsonProperty("fileId")]
    public string? FileId { get; set; }

    [JsonProperty("fileName")]
    public string? FileName { get; set; }

    [JsonProperty("fileSize")]
    public long FileSize { get; set; }

    [JsonProperty("chunkIndex")]
    public int ChunkIndex { get; set; }

    [JsonProperty("totalChunks")]
    public int TotalChunks { get; set; }

    [JsonProperty("bytesUploaded")]
    public long BytesUploaded { get; set; }

    [JsonProperty("chunksReceived")]
    public int ChunksReceived { get; set; }

    [JsonProperty("success")]
    public bool Success { get; set; }

    [JsonProperty("url")]
    public string? Url { get; set; }

    [JsonProperty("message")]
    public string? Message { get; set; }
}

public class WebTransportConfigResponse
{
    [JsonProperty("certHash")]
    public byte[]? CertHash { get; set; }
}

public class UploaderMessage
{
    [JsonProperty("type")]
    public string? Type { get; set; }

    [JsonProperty("fileName")]
    public string? FileName { get; set; }

    [JsonProperty("fileSize")]
    public long FileSize { get; set; }

    [JsonProperty("totalChunks")]
    public int TotalChunks { get; set; }

    [JsonProperty("chunkIndex")]
    public int ChunkIndex { get; set; }

    [JsonProperty("chunkSize")]
    public long ChunkSize { get; set; }
}
