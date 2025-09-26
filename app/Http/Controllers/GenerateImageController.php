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

    public function generateImageFromHtml( Schedule $schedule)
    {
        $schedule->load('template', 'selectedImage');
        $html = $schedule->template->html_code;      
        // 2. Construir la URL completa de la imagen en el servidor

        if(env('APP_ENV') === 'local'){
        $fullImageUrl =  storage_path('app/public/' . $schedule->selectedImage->image_path);
        }else{
        $fullImageUrl = rtrim(config('app.url'), '/') . Storage::url($schedule->selectedImage->image_path);
        }
        // 3. Reemplazar el placeholder en el HTML
        $finalHtml = preg_replace(
            '/<img class="background-img"[^>]*src="[^"]*"([^>]*)>/i',
            '<img class="background-img" src="' . $fullImageUrl . '" $1>',
            $html
        );
    
        // 4. Generar un nombre de archivo único
        $filename = 'published/' . Str::uuid() . '.png';
    
        // 5. Usar Browsershot para generar y guardar la imagen
            $browsershot = Browsershot::html($finalHtml)
            ->windowSize(630, 630)
            ->waitUntilNetworkIdle(true)
            ->quality(90)
            ->timeout(60);

        // Especificar rutas manualmente (ajusta según tu instalación) si esta en nvm hay que especificar
        // $browsershot->setNodeBinary(env('BROWSERSHOT_NODE_BINARY'))
        //            ->setNpmBinary(env('BROWSERSHOT_NPM_BINARY'));

        $browsershot->save(Storage::disk('public')->path($filename));
        Storage::disk('public')->url($filename);
        dd($filename);
        return $filename;
    }
}
