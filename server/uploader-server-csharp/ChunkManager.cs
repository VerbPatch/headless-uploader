using System.Collections.Concurrent;

namespace UploaderServer;

public static class ChunkManager
{
    
    private static readonly ConcurrentDictionary<string, ConcurrentDictionary<int, MemoryStream>> ChunkCache = new();

    
    
    private static readonly ConcurrentDictionary<string, string> RecentlyMergedFiles = new();

    public static async Task SaveChunkAsync(string fileId, int chunkIndex, Stream chunkStream)
    {
        var fileChunks = ChunkCache.GetOrAdd(fileId, _ => new ConcurrentDictionary<int, MemoryStream>());

        var ms = new MemoryStream();
        await chunkStream.CopyToAsync(ms);
        ms.Position = 0;
        
        fileChunks[chunkIndex] = ms;
        
        Console.WriteLine($"🧠 Chunk {chunkIndex} stored in memory for file {fileId}");
    }

    public static bool AreAllChunksPresent(string fileId, int totalChunks)
    {
        
        if (RecentlyMergedFiles.ContainsKey(fileId)) return true;

        if (!ChunkCache.TryGetValue(fileId, out var fileChunks)) return false;
        
        for (int i = 0; i < totalChunks; i++)
        {
            if (!fileChunks.ContainsKey(i)) return false;
        }

        return true;
    }

    private static readonly SemaphoreSlim MergeLock = new SemaphoreSlim(1, 1);

    public static async Task<string?> MergeChunksAsync(string fileId, string fileName, int totalChunks)
    {
        
        if (RecentlyMergedFiles.TryGetValue(fileId, out var existingFileName))
        {
            return existingFileName;
        }

        await MergeLock.WaitAsync();
        try
        {
            
            if (RecentlyMergedFiles.TryGetValue(fileId, out existingFileName))
            {
                return existingFileName;
            }

            
            if (!ChunkCache.TryRemove(fileId, out var fileChunks))
            {
                return null; 
            }

            var finalFileName = $"{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}-{fileName}";
            var finalPath = Path.Combine(Config.UploadsDir, finalFileName);

            using (var finalStream = new FileStream(finalPath, FileMode.Create, FileAccess.Write, FileShare.None, 4096, true))
            {
                for (int i = 0; i < totalChunks; i++)
                {
                    if (fileChunks.TryRemove(i, out var chunkStream))
                    {
                        using (chunkStream)
                        {
                            await chunkStream.CopyToAsync(finalStream);
                        }
                    }
                    else
                    {
                        throw new Exception($"Chunk {i} missing during merge for file {fileId}");
                    }
                }
            }

            
            RecentlyMergedFiles.TryAdd(fileId, finalFileName);
            
            
            _ = Task.Delay(TimeSpan.FromMinutes(1)).ContinueWith(_ => {
                RecentlyMergedFiles.TryRemove(fileId, out string? _);
            });
            
            Console.WriteLine($"✅ Successfully merged {totalChunks} chunks into: {finalFileName}");
            return finalFileName;
        }
        finally
        {
            MergeLock.Release();
        }
    }
}
