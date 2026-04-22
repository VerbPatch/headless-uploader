using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using tusdotnet;
using UploaderServer;
using UploaderServer.Protocols;
using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Http.Features;

var builder = WebApplication.CreateBuilder(args);


builder.WebHost.ConfigureKestrel((context, options) =>
{
    
    options.ListenAnyIP(Config.AppPort, listenOptions =>
    {
        listenOptions.Protocols = HttpProtocols.Http1AndHttp2;
    });

    
    options.ListenAnyIP(Config.WebTransportPort, listenOptions =>
    {
        listenOptions.Protocols = HttpProtocols.Http3;
        
        var certPath = Path.Combine(AppContext.BaseDirectory, "cert.pem");
        var keyPath = Path.Combine(AppContext.BaseDirectory, "key.pem");
        
        if (File.Exists(certPath) && File.Exists(keyPath))
        {
            try {
                
                var cert = X509Certificate2.CreateFromPemFile(certPath, keyPath);
                
                
                
                if (OperatingSystem.IsWindows())
                {
                    var pfx = cert.Export(X509ContentType.Pfx);
                    cert = new X509Certificate2(pfx, (string?)null, X509KeyStorageFlags.PersistKeySet | X509KeyStorageFlags.Exportable);
                }

                Console.WriteLine($"📜 Cert Loaded: {cert.Subject} (Expires: {cert.NotAfter})");
                Console.WriteLine($"🔑 Private Key: {cert.HasPrivateKey}");
                
                listenOptions.UseHttps(cert);
                Console.WriteLine($"✅ WebTransport (HTTP/3) listening on port {Config.WebTransportPort}");
            } catch (Exception ex) {
                Console.WriteLine($"❌ Failed to load certificates: {ex.Message}");
            }
        }
        else
        {
            Console.WriteLine($"⚠️ Certificates not found at: {certPath}");
        }
    });
});


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader()
              .WithExposedHeaders("Location", "Upload-Offset", "Tus-Resumable", "Upload-Length", "Upload-Metadata");
    });
});

var app = builder.Build();


var webRootPath = app.Environment.WebRootPath;
if (string.IsNullOrEmpty(webRootPath))
{
    webRootPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot");
}
Config.Initialize(webRootPath);


app.UseCors();


app.Use(async (context, next) =>
{
    
    context.Response.Headers.Append("Alt-Svc", $"h3=\":{Config.WebTransportPort}\"");
    
    if (context.Request.Path != "/webtransport-config")
    {
        Console.WriteLine($"🔍 Request: {context.Request.Method} {context.Request.Path} (Protocol: {context.Request.Protocol})");
    }
    
    
    var wtFeature = context.Features.Get<IHttpWebTransportFeature>();
    if (wtFeature != null && wtFeature.IsWebTransportRequest)
    {
        Console.WriteLine("🚀 WebTransport handshake (CONNECT) detected!");
    }
    
    await next();
});

app.UseWebSockets();
app.UseStaticFiles();



app.MapTus("/tus", ctx => Task.FromResult(TusProtocol.GetTusConfiguration(ctx)));
app.MapPost("/upload", UploaderServer.Protocols.HttpProtocol.HandleUploadAsync);
app.Map("/ws-upload", WebSocketProtocol.HandleWebSocketAsync);


app.Map("/wt-upload", async (HttpContext context) => {
    Console.WriteLine("🎯 WebTransport Endpoint (/wt-upload) matched");
    await WebTransportProtocol.HandleWebTransportAsync(context);
});


app.MapGet("/webtransport-config", () => {
    var certPath = Path.Combine(AppContext.BaseDirectory, "cert.pem");
    if (File.Exists(certPath)) {
        try {
            var certHash = WebTransportProtocol.GetCertFingerprint(certPath);
            return Results.Json(new { certHash = certHash.Select(b => (int)b).ToArray() });
        } catch (Exception ex) {
            return Results.Problem($"Fingerprint error: {ex.Message}");
        }
    }
    return Results.NotFound("Certificate not found");
});

app.MapGet("/debug-wt", (HttpContext context) => {
    var wtFeature = context.Features.Get<IHttpWebTransportFeature>();
    return Results.Json(new { 
        isHttps = context.Request.IsHttps,
        protocol = context.Request.Protocol,
        hasWtFeature = wtFeature != null,
        webTransportPort = Config.WebTransportPort
    });
});


app.MapGet("/", () => "Uploader Server (.NET) is running.\n" +
                    $"- HTTP: http://127.0.0.1:{Config.AppPort}/upload\n" +
                    $"- TUS: http://127.0.0.1:{Config.AppPort}/tus\n" +
                    $"- WebSocket: ws://127.0.0.1:{Config.AppPort}/ws-upload\n" +
                    $"- WebTransport: https://127.0.0.1:{Config.WebTransportPort}/wt-upload (HTTP/3)\n" +
                    $"- Static Files: http://127.0.0.1:{Config.AppPort}/uploads/");

Console.WriteLine($"🚀 Server starting...");
Console.WriteLine($"📍 HTTP/WS on port {Config.AppPort}");
Console.WriteLine($"📍 WebTransport (HTTP/3) on port {Config.WebTransportPort}");

app.Run();
