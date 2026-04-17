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
                    
                    // Get raw TUS metadata (it's a Dictionary<string, MetadataValue>)
                    var tusMetadata = await file.GetMetadataAsync(eventContext.CancellationToken);
                    
                    // Decode metadata values to match Node.js behavior (which stores decoded strings)
                    var decodedMetadata = new Dictionary<string, string>();
                    foreach (var item in tusMetadata)
                    {
                        decodedMetadata[item.Key] = item.Value.GetString(Encoding.UTF8);
                    }

                    // Get file length using the store
                    long fileSize = await store.GetUploadLengthAsync(file.Id, eventContext.CancellationToken) ?? 0;

                    // Create the exact structure matching Node.js TUS implementation
                    var resultMetadata = new
                    {
                        id = file.Id,
                        metadata = decodedMetadata,
                        size = fileSize,
                        offset = fileSize, // Since it's complete, offset equals size
                        creation_date = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
                    };
                    
                    var metadataPath = Path.Combine(Config.UploadsDir, $"{file.Id}.json");
                    var metadataJson = Newtonsoft.Json.JsonConvert.SerializeObject(resultMetadata, Newtonsoft.Json.Formatting.None);
                    await File.WriteAllTextAsync(metadataPath, metadataJson);
                    
                    Console.WriteLine($"✅ Tus upload complete: {file.Id}");
                }
            }
        };
    }
}
