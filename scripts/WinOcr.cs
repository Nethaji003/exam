using System;
using System.IO;
using System.Threading.Tasks;
using Windows.Graphics.Imaging;
using Windows.Media.Ocr;

class Program
{
    static void Main(string[] args)
    {
        if (args.Length == 0)
        {
            Console.WriteLine("Usage: WinOcr <image_path> [out_txt]");
            return;
        }
        string imgPath = args[0];
        string outTxt = args.Length > 1 ? args[1] : null;
        RunOcr(imgPath, outTxt).GetAwaiter().GetResult();
    }

    static async Task RunOcr(string path, string outTxt)
    {
        using (var fs = File.OpenRead(Path.GetFullPath(path)))
        using (var ras = WindowsRuntimeStreamExtensions.AsRandomAccessStream(fs))
        {
            var decoder = await WindowsRuntimeSystemExtensions.AsTask(BitmapDecoder.CreateAsync(ras));
            var bitmap = await WindowsRuntimeSystemExtensions.AsTask(decoder.GetSoftwareBitmapAsync());
            var engine = OcrEngine.TryCreateFromLanguage(OcrEngine.AvailableRecognizerLanguages[0]);
            var result = await WindowsRuntimeSystemExtensions.AsTask(engine.RecognizeAsync(bitmap));
            
            if (!string.IsNullOrEmpty(outTxt))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(Path.GetFullPath(outTxt)));
                File.WriteAllText(outTxt, result.Text);
            }
            else
            {
                Console.WriteLine(result.Text);
            }
        }
    }
}
