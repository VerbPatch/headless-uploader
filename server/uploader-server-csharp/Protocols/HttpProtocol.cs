using Microsoft.AspNetCore.Http;

namespace UploaderServer.Protocols;

public static class HttpProtocol
{
    public static async Task HandleUploadAsync(HttpContext context)
    {
        if (!context.Request.HasFormContentType || context.Request.Form.Files.Count == 0)
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsync("No file uploaded");
            return;
        }

        var file = context.Request.Form.Files[0];
        
        var fileId = context.Request.Form["fileId"].ToString();
        if (string.IsNullOrEmpty(fileId)) fileId = context.Request.Query["fileId"].ToString();

        var chunkIndexStr = context.Request.Form["chunkIndex"].ToString();
        if (string.IsNullOrEmpty(chunkIndexStr)) chunkIndexStr = context.Request.Query["chunkIndex"].ToString();

        var totalChunksStr = context.Request.Form["totalChunks"].ToString();
        if (string.IsNullOrEmpty(totalChunksStr)) totalChunksStr = context.Request.Query["totalChunks"].ToString();

        if (!string.IsNullOrEmpty(fileId) && int.TryParse(chunkIndexStr, out var chunkIndex) && int.TryParse(totalChunksStr, out var totalChunks))
        {
            
            await ChunkManager.SaveChunkAsync(fileId, chunkIndex, file.OpenReadStream());

            if (ChunkManager.AreAllChunksPresent(fileId, totalChunks))
            {
                var finalFileName = await ChunkManager.MergeChunksAsync(fileId, file.FileName, totalChunks);
                
                if (!string.IsNullOrEmpty(finalFileName))
                {
                    await context.Response.WriteAsJsonAsync(new { success = true, url = $"/uploads/{finalFileName}" });
                }
                else
                {
                    
                    
                    await context.Response.WriteAsJsonAsync(new { success = true, message = "Chunk received and file merged by another process" });
                }
            }
            else
            {
                await context.Response.WriteAsJsonAsync(new { success = true, message = $"Chunk {chunkIndex + 1}/{totalChunks} received" });
            }
        }
        else
        {
            
            var safeFileName = string.IsNullOrEmpty(fileId) 
                ? $"{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}-{file.FileName}"
                : $"{fileId}-{file.FileName}";
                
            var finalPath = Path.Combine(Config.UploadsDir, safeFileName);
            
            using (var stream = new FileStream(finalPath, FileMode.Create, FileAccess.Write, FileShare.None, 4096, true))
            {
                await file.CopyToAsync(stream);
            }
            
            await context.Response.WriteAsJsonAsync(new { success = true, url = $"/uploads/{safeFileName}" });
        }
    }
}
