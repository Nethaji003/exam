param (
    [string]$ImagePath
)

[Windows.Storage.StorageFile, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null

$op = [Windows.Storage.StorageFile]::GetFileFromPathAsync($ImagePath)
while ($op.Status.ToString() -eq 'Started') { Start-Sleep -Milliseconds 10 }
$file = $op.GetResults()

$op2 = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read)
while ($op2.Status.ToString() -eq 'Started') { Start-Sleep -Milliseconds 10 }
$stream = $op2.GetResults()

$op3 = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
while ($op3.Status.ToString() -eq 'Started') { Start-Sleep -Milliseconds 10 }
$decoder = $op3.GetResults()

$op4 = $decoder.GetSoftwareBitmapAsync()
while ($op4.Status.ToString() -eq 'Started') { Start-Sleep -Milliseconds 10 }
$bitmap = $op4.GetResults()

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Media.Ocr.OcrEngine]::AvailableRecognizerLanguages[0])
$op5 = $engine.RecognizeAsync($bitmap)
while ($op5.Status.ToString() -eq 'Started') { Start-Sleep -Milliseconds 10 }
$ocr = $op5.GetResults()

Write-Output $ocr.Text

