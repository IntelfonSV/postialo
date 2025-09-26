<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Spatie\Browsershot\Browsershot;
use App\Models\Schedule;
use Illuminate\Support\Facades\Log;

class GenerateImageController extends Controller
{
    public function generateImage($prompt)
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'api-key' => config('services.ideogram.api_key'),
        ])->post('https://api.ideogram.ai/v1/ideogram-v3/generate', [
            'prompt' => $prompt,
            'aspect_ratio' => '1x1',
            'rendering_speed' => 'QUALITY',
            'style_type' => 'REALISTIC'
        ]);
        

        if (isset($response->json()['error'])) {
            return ["status" => "error", "message" => $response->json()['error']];
        }
        
        //en data.url esta la url de la imagen quiero retornar la imagen
        if($response->json()['data'][0]['url'] == null){
            return ["status" => "error", "message" => "No se pudo generar la imagen"];
        }
            
        $image = $this->saveImage($response->json()['data'][0]['url']);
        return ["status" => "success", "image" => $image];
    }

    private function saveImage($url)
    {
        $response = Http::get($url);
        $imageData = $response->body();
        $contentType = $response->header('Content-Type');
        $extension = match($contentType) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
            default => pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'jpg'
        };
        //obtener el nombre del archivo original 
        $originalName = pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_BASENAME);
        $fileName = "images/{$originalName}";
        Storage::disk('public')->put($fileName, $imageData);
        return $fileName;
    }

    use Illuminate\Support\Facades\Storage;
    use Illuminate\Support\Str;
    use Spatie\Browsershot\Browsershot;
    use App\Models\Schedule;
    
    public function generateImageFromHtml(Schedule $schedule): string
    {
        $schedule->load('template', 'selectedImage');
    
        $html = $schedule->template->html_code ?? '';
        if ($html === '') {
            throw new \RuntimeException('Template HTML vacío.');
        }
    
        $relativeImagePath = $schedule->selectedImage->image_path ?? null;
        if (!$relativeImagePath) {
            throw new \RuntimeException('No se encontró image_path en selectedImage.');
        }
    
        $absoluteImagePath = Storage::disk('public')->path($relativeImagePath);
        if (!is_file($absoluteImagePath)) {
            throw new \RuntimeException("Imagen no encontrada: {$absoluteImagePath}");
        }
    
        // Embebe la imagen como data URI para evitar dependencias de red/file://
        $mime = mime_content_type($absoluteImagePath) ?: 'image/png';
        $imageData = base64_encode(file_get_contents($absoluteImagePath));
        $dataUri = "data:{$mime};base64,{$imageData}";
    
        $finalHtml = preg_replace(
            '/<img\s+class="background-img"[^>]*src="[^"]*"([^>]*)>/i',
            '<img class="background-img" src="' . $dataUri . '" $1>',
            $html
        );
    
        // Directorio de salida
        $dir = 'published';
        if (!Storage::disk('public')->exists($dir)) {
            Storage::disk('public')->makeDirectory($dir);
        }
        $filename   = $dir . '/' . Str::uuid() . '.png';
        $outputPath = Storage::disk('public')->path($filename);
    
        // Dirs para perfil/cache de Chromium (evita crashpad issues)
        $chromeBase = storage_path('app/chrome'); // fuera del "public" disk
        @mkdir($chromeBase.'/cache', 0775, true);
        @mkdir($chromeBase.'/data',  0775, true);
    
        $browsershot = Browsershot::html($finalHtml)
            ->windowSize(630, 630)
            ->deviceScaleFactor(2)
            ->waitUntilNetworkIdle(true)
            ->quality(90)
            ->timeout(120)
            ->noSandbox()
            ->setChromePath(env('BROWSERSHOT_CHROME_PATH', '/usr/bin/chromium'))
            ->addChromiumArguments([
                // IMPORTANTE: sin "--" porque Browsershot los añade
                'no-sandbox',
                'disable-dev-shm-usage',
                'disable-gpu',
                'disable-setuid-sandbox',
                // Crashpad/Breakpad off para evitar el error mostrado
                'disable-crashpad',
                'disable-breakpad',
                // Perfil/cache a rutas escribibles
                'user-data-dir=' . $chromeBase,
                'data-path=' . $chromeBase . '/data',
                'disk-cache-dir=' . $chromeBase . '/cache',
                // Más estabilidad en contenedores/servers headless
                'no-zygote',
                'no-first-run',
                'single-process',
                'headless=new', // o 'headless' según versión de Chromium
            ]);
    
        $browsershot->save($outputPath);
    
        return $filename; // "published/xxxx.png"
    }
    
}
