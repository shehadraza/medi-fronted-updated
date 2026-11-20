
$ErrorActionPreference = "Stop"

$path = "src\app\dashboard\page.tsx"

if (-not (Test-Path -LiteralPath $path)) {
    throw "Dashboard file not found. Run this script from C:\Users\VICTUS\medi"
}

$content = Get-Content -LiteralPath $path -Raw

if ($content -notmatch 'import AICompanion from "@/components/ai/ai-companion";') {
    $content = $content.Replace(
        'import NotificationCenter from "@/components/dashboard/notification-center";',
        'import NotificationCenter from "@/components/dashboard/notification-center";' +
        [Environment]::NewLine +
        'import AICompanion from "@/components/ai/ai-companion";'
    )
}

$pattern = '(?s)<article\s+id="ai-companion"[^>]*>.*?</article>'

$replacement = @'
<article
  id="ai-companion"
  className="relative scroll-mt-28"
>
  <AICompanion language={language} />
</article>
'@

$updated = [regex]::Replace($content, $pattern, $replacement, 1)

if ($updated -eq $content) {
    throw "AI Companion section was not found or no changes were needed. Check the file."
}

Copy-Item -LiteralPath $path -Destination "$path.phase7-backup" -Force
Set-Content -LiteralPath $path -Value $updated -Encoding utf8

Write-Host "Dashboard AI Companion integration completed."
