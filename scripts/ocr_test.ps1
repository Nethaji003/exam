[System.Reflection.Assembly]::LoadWithPartialName("System.Runtime.WindowsRuntime") | Out-Null

function AwaitTask($asyncOp) {
    $asTaskMethods = [System.WindowsRuntimeSystemExtensions].GetMethods()
    foreach ($m in $asTaskMethods) {
        if ($m.Name -eq "AsTask" -and $m.GetParameters().Count -eq 1) {
            $genArgs = $m.GetGenericArguments()
            if ($genArgs.Count -eq 1) {
                # Find the IAsyncOperation`1 interface implemented by $asyncOp
                foreach ($interface in $asyncOp.GetType().GetInterfaces()) {
                    if ($interface.IsGenericType -and $interface.GetGenericTypeDefinition().Name -eq "IAsyncOperation`1") {
                        $itemType = $interface.GetGenericArguments()[0]
                        $typedAsTask = $m.MakeGenericMethod($itemType)
                        $task = $typedAsTask.Invoke($null, @($asyncOp))
                        $task.Wait()
                        return $task.Result
                    }
                }
            }
        }
    }
    throw "AsTask method not found"
}

[Windows.Storage.StorageFile, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null

$filePath = "C:\Users\acer\OneDrive\Desktop\exam\public\tnpsc_pages\page_33.png"
$file = AwaitTask ([Windows.Storage.StorageFile]::GetFileFromPathAsync($filePath))
$stream = AwaitTask ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read))
$decoder = AwaitTask ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream))
$bitmap = AwaitTask ($decoder.GetSoftwareBitmapAsync())

$lang = [Windows.Media.Ocr.OcrEngine]::AvailableRecognizerLanguages[0]
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($lang)
$ocrResult = AwaitTask ($engine.RecognizeAsync($bitmap))

Write-Output "--- OCR RESULT ---"
Write-Output $ocrResult.Text

