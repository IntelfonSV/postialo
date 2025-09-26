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
        // 1) Cargar relaciones necesarias
        $schedule->load('template', 'selectedImage');
    
        // 2) HTML base del template
        $html = $schedule->template->html_code ?? '';
        if ($html === '') {
            throw new \RuntimeException('Template HTML vacío.');
        }
    
        // 3) Resolver imagen de fondo desde el disk "public"
        $relativeImagePath = $schedule->selectedImage->image_path ?? null;
        if (!$relativeImagePath) {
            throw new \RuntimeException('No se encontró image_path en selectedImage.');
        }
    
        $absoluteImagePath = Storage::disk('public')->path($relativeImagePath);
        if (!is_file($absoluteImagePath)) {
            throw new \RuntimeException("Imagen no encontrada: {$absoluteImagePath}");
        }
    
        // 4) Convertir a data URI (base64) para evitar problemas de red/CORS/file://
        $mime = mime_content_type($absoluteImagePath) ?: 'image/png';
        $imageData = base64_encode(file_get_contents($absoluteImagePath));
        $dataUri = "data:{$mime};base64,{$imageData}";
    
        // 5) Reemplazar la <img class="background-img" ...> por la versión inline
        $finalHtml = preg_replace(
            '/<img\s+class="background-img"[^>]*src="[^"]*"([^>]*)>/i',
            '<img class="background-img" src="' . $dataUri . '" $1>',
            $html
        );
    
        // 6) Asegurar directorio de salida en storage/app/public/published
        $dir = 'published';
        if (!Storage::disk('public')->exists($dir)) {
            Storage::disk('public')->makeDirectory($dir);
        }
    
        // 7) Nombre de archivo final (PNG) — devolveremos esta ruta relativa
        $filename = $dir . '/' . Str::uuid() . '.png';
        $outputPath = Storage::disk('public')->path($filename);
    
        // 8) Configurar Browsershot / Chromium
        $browsershot = Browsershot::html($finalHtml)
            ->windowSize(630, 630)
            ->deviceScaleFactor(2) // nitidez
            ->waitUntilNetworkIdle(true)
            ->quality(90)
            ->timeout(120)
            ->noSandbox()
            ->setChromePath(env('BROWSERSHOT_CHROME_PATH', '/usr/bin/chromium'))
            ->setChromeArguments([
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--disable-gpu',
            ]);
    
        // 9) Render y guardado
        $browsershot->save($outputPath);
    
        // 10) Retornar SOLO la ruta relativa dentro del disk 'public'
        return $filename; // ej: "published/xxxxxxxx-xxxx-....png"
    }
}
