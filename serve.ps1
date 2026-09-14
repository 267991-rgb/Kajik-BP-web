param(
    [string]$Port = '8000',
    [string]$Root = (Get-Location).Path
)

$prefix = "http://localhost:$Port/"
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "Serving $Root at $prefix"

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $requestedPath = $context.Request.Url.AbsolutePath
        if ($requestedPath -eq '/') {
            $requestedPath = '/index.html'
        }

        $relativePath = $requestedPath.TrimStart('/')
        $fullPath = [System.IO.Path]::GetFullPath((Join-Path $Root $relativePath))
        $rootFullPath = [System.IO.Path]::GetFullPath($Root)

        if (-not $fullPath.StartsWith($rootFullPath, [System.StringComparison]::OrdinalIgnoreCase)) {
            $context.Response.StatusCode = 403
            $content = 'Forbidden'
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
            $context.Response.ContentLength64 = $buffer.Length
            $context.Response.OutputStream.Write($buffer, 0, $buffer.Length)
            $context.Response.OutputStream.Close()
            continue
        }

        if ([System.IO.File]::Exists($fullPath)) {
            $extension = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()
            $mimeTypes = @{
                '.html' = 'text/html; charset=utf-8'
                '.css'  = 'text/css; charset=utf-8'
                '.js'   = 'application/javascript; charset=utf-8'
                '.json' = 'application/json; charset=utf-8'
                '.png'  = 'image/png'
                '.jpg'  = 'image/jpeg'
                '.jpeg' = 'image/jpeg'
                '.gif'  = 'image/gif'
                '.svg'  = 'image/svg+xml'
                '.mp3'  = 'audio/mpeg'
                '.wav'  = 'audio/wav'
                '.xlsx' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                '.xls'  = 'application/vnd.ms-excel'
                '.pdf'  = 'application/pdf'
                '.ico'  = 'image/x-icon'
            }

            $mime = if ($mimeTypes.ContainsKey($extension)) { $mimeTypes[$extension] } else { 'application/octet-stream' }
            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $context.Response.StatusCode = 200
            $context.Response.ContentType = $mime
            $context.Response.ContentLength64 = $bytes.Length
            if ($context.Request.HttpMethod -ne 'HEAD') {
                $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            $context.Response.OutputStream.Close()
        }
        else {
            $context.Response.StatusCode = 404
            $content = 'Not Found'
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
            $context.Response.ContentLength64 = $buffer.Length
            if ($context.Request.HttpMethod -ne 'HEAD') {
                $context.Response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            $context.Response.OutputStream.Close()
        }
    }
}
finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
