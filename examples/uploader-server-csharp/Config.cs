namespace UploaderServer;

public static class Config
{
    public const int AppPort = 3000;
    public const int WebTransportPort = 4443;
    
    public static string UploadsDir { get; private set; } = string.Empty;
    public static string ChunksDir { get; private set; } = string.Empty;

    public static void Initialize(string webRootPath)
    {
        // Use the provided WebRootPath (wwwroot)
        UploadsDir = Path.Combine(webRootPath, "uploads");
        ChunksDir = Path.Combine(webRootPath, "chunks");

        if (!Directory.Exists(UploadsDir)) Directory.CreateDirectory(UploadsDir);
        if (!Directory.Exists(ChunksDir)) Directory.CreateDirectory(ChunksDir);
    }
}
