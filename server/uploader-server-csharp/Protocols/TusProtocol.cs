using tusdotnet;
using tusdotnet.Models;
using tusdotnet.Models.Configuration;
using tusdotnet.Stores;
using Microsoft.AspNetCore.Builder;
using System.Text;
using Microsoft.AspNetCore.Http;

namespace UploaderServer.Protocols;

public static class TusProtocol
{
    public static DefaultTusConfiguration GetTusConfiguration(HttpContext context)
    {
        var store = new TusDiskStore(Config.UploadsDir);
        
        return new DefaultTusConfiguration
        {
            Store = store,
            
            Events = new Events
            {
                OnFileCompleteAsync = async eventContext =>
                {
                    var file = await eventContext.GetFileAsync();
                    
                    
                    var tusMetadata = await file.GetMetadataAsync(eventContext.CancellationToken);
                    
                    
                    var decodedMetadata = new Dictionary<string, string>();
                    foreach (var item in tusMetadata)
                    {
                        decodedMetadata[item.Key] = item.Value.GetString(Encoding.UTF8);
                    }

                    
                    long fileSize = await store.GetUploadLengthAsync(file.Id, eventContext.CancellationToken) ?? 0;

                    
                    var resultMetadata = new
                    {
                        id = file.Id,
                        metadata = decodedMetadata,
                        size = fileSize,
                        offset = fileSize, 
                        creation_date = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
                    };
                    
                    var metadataPath = Path.Combine(Config.UploadsDir, $"{file.Id}.json");
                    var metadataJson = Newtonsoft.Json.JsonConvert.SerializeObject(resultMetadata, Newtonsoft.Json.Formatting.None);
                    await File.WriteAllTextAsync(metadataPath, metadataJson);

                    
                    if (decodedMetadata.TryGetValue("filename", out var filename))
                    {
                        var oldPath = Path.Combine(Config.UploadsDir, file.Id);
                        var newPath = Path.Combine(Config.UploadsDir, $"{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}-{filename}");
                        if (File.Exists(oldPath))
                        {
                            File.Move(oldPath, newPath);
                            Console.WriteLine($"✅ TUS: File {file.Id} renamed to {Path.GetFileName(newPath)}");
                        }
                    }
                    
                    Console.WriteLine($"✅ Tus upload complete: {file.Id}");
                }
            }
        };
    }
}
