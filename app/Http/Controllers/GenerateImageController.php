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

    public function generateImageFromHtml(Schedule $schedule): string
    {
        $schedule->load('template', 'selectedImage');
    
        $html = $schedule->template->html_code ?? '';
        $fullImagePath = storage_path('app/public/' . $schedule->selectedImage->image_path);
        if (!is_file($fullImagePath)) {
            throw new \RuntimeException("Imagen no encontrada: {$fullImagePath}");
        }
    
        $finalHtml = preg_replace(
            '/<img\s+class="background-img"[^>]*src="[^"]*"([^>]*)>/i',
            '<img class="background-img" src="' . $fullImagePath . '" $1>',
            $html
        );
    
        $filename   = 'published/' . Str::uuid() . '.png';
        $outputPath = Storage::disk('public')->path($filename);
    
        // (Opcional recomendado) perfil/cache para Chromium en storage
        $chromeBase = storage_path('app/chrome');
        @mkdir($chromeBase, 0775, true);
        @mkdir($chromeBase.'/cache', 0775, true);
        @mkdir($chromeBase.'/data', 0775, true);
        @mkdir($chromeBase.'/Crashpad', 0775, true);
    
        $browsershot = Browsershot::html($finalHtml)
            ->windowSize(630, 630)
            ->waitUntilNetworkIdle(true)
            ->quality(90)
            ->timeout(120)
            ->setNodeBinary('/usr/bin/node')
            ->setNpmBinary('/usr/bin/npm')
            ->setChromePath('/usr/bin/chromium')
            ->noSandbox()
            ->addChromiumArguments([
                // sin "--" (Browsershot los agrega)
                'headless',
                'no-sandbox',
                'disable-dev-shm-usage',
                'disable-gpu',
                'disable-setuid-sandbox',
                'disable-features=Crashpad',
                'disable-breakpad',
                'no-crash-upload',
                // usa el perfil escribible (evita rarezas de crashpad)
                'user-data-dir='.$chromeBase,
                'data-path='.$chromeBase.'/data',
                'disk-cache-dir='.$chromeBase.'/cache',
            ]);
    
        $browsershot->save($outputPath);
        return $filename; // "published/xxxx.png"
    }
}
