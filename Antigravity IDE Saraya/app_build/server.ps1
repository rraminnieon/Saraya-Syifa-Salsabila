param (
    [int]$Port = 8080
)

$HostIP = "localhost"
$BaseDir = $PSScriptRoot

$listener = $null
while ($Port -lt 9000) {
    try {
        $listener = New-Object System.Net.HttpListener
        $prefix = "http://$HostIP`:$Port/"
        $listener.Prefixes.Add($prefix)
        $listener.Start()
        Write-Host "================================================="
        Write-Host " Stitch Adventure Server running at: $prefix"
        Write-Host " Serving files from: $BaseDir"
        Write-Host " Press Ctrl+C to stop."
        Write-Host "================================================="
        break
    } catch {
        if ($listener) {
            $listener.Close()
            $listener = $null
        }
        $Port++
    }
}

if (-not $listener -or -not $listener.IsListening) {
    Write-Error "Failed to bind to any port."
    exit 1
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".mjs"  = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".wav"  = "audio/wav"
    ".mp3"  = "audio/mpeg"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        $rawUrl = $req.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($rawUrl)) {
            $rawUrl = "index.html"
        }

        $cleanPath = [System.Uri]::UnescapeDataString($rawUrl).Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $localFilePath = [System.IO.Path]::Combine($BaseDir, $cleanPath)

        if ([System.IO.File]::Exists($localFilePath)) {
            $ext = [System.IO.Path]::GetExtension($localFilePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $res.ContentType = $mime
            $res.Headers.Add("Access-Control-Allow-Origin", "*")
            $res.Headers.Add("Cache-Control", "no-cache")

            $bytes = [System.IO.File]::ReadAllBytes($localFilePath)
            $res.ContentLength64 = $bytes.Length
            $res.StatusCode = 200

            if ($req.HttpMethod -ne "HEAD") {
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        } else {
            $res.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $res.ContentLength64 = $errBytes.Length
            if ($req.HttpMethod -ne "HEAD") {
                $res.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
        }
        $res.Close()
    } catch {
        # Loop never exits on individual request errors
    }
}
