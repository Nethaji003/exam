$outDir = "public\tnpsc_ocr"
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

1..52 | ForEach-Object {
    $img = "public\tnpsc_pages\page_$_.png"
    $txt = "$outDir\page_$_.txt"
    if (Test-Path $img) {
        .\scripts\WinOcr.exe $img $txt
        Write-Host "Processed page $_"
    }
}

Write-Output "OCR process finished for all 52 pages."

