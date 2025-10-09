<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Spatie\Browsershot\Browsershot;
use App\Models\Schedule;
use Illuminate\Support\Facades\Log;
use App\Models\BrandIdentity;

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
        #$brandIdentity = $schedule->user->brandIdentity->with('logos')->first();
        $brandIdentity = BrandIdentity::with('logos')->where('user_id', $schedule->user_id)->first();

        $safeText = static function (?string $txt): string {
            return htmlspecialchars($txt ?? '', ENT_QUOTES, 'UTF-8', false);
        };
        
    
        $html = $schedule->template->html_code ?? '';
        $bgPath = storage_path('app/public/' . $schedule->selectedImage->image_path);
        if (!is_file($bgPath)) {
            throw new \RuntimeException("Imagen no encontrada: {$bgPath}");
        }
    
        $finalHtml = preg_replace(
            '/<img\s+class="background-img"[^>]*src="[^"]*"([^>]*)>/i',
            '<img class="background-img" src="' . $bgPath . '" $1>',
            $html
        );

        if($brandIdentity->logos[0]->image){
            $logoPathFs = storage_path('app/public/' . $brandIdentity->logos[0]->image);
            $replaced = preg_replace(
                '/<img\s+class="logo"[^>]*src="[^"]*"([^>]*)>/iu',
                '<img class="logo" src="' . $logoPathFs . '" $1>',
                $finalHtml,
                1
            );
            if ($replaced !== null) {
                $finalHtml = $replaced;
            }        
        }

        if ($brandIdentity->website !== null) {
            $safeWebsite = $safeText($brandIdentity->website);
            $replaced = preg_replace(
                '/<span\s+class="website">.*?<\/span>/isu',
                '<span class="website">' . $safeWebsite . '</span>',
                $finalHtml,
                1
            );
            if ($replaced !== null) {
                $finalHtml = $replaced;
            }
        }
    
        // 4) Reemplazar <span class="whatsapp">...</span> si viene whatsapp
        if ( $brandIdentity->whatsapp_number !== null) {
            $safeWhats = $safeText( $brandIdentity->whatsapp_number);
            $replaced = preg_replace(
                '/<span\s+class="whatsapp">.*?<\/span>/isu',
                '<span class="whatsapp">' . $safeWhats . '</span>',
                $finalHtml,
                1
            );
            if ($replaced !== null) {
                $finalHtml = $replaced;
            }
        }

    
        $dir = 'published';
        if (!Storage::disk('public')->exists($dir)) {
            Storage::disk('public')->makeDirectory($dir);
        }
        $filename   = $dir . '/' . Str::uuid() . '.png';
        $outputPath = Storage::disk('public')->path($filename);
    
        $chromeBase = storage_path('app/chrome'); // coincide con XDG_* del pool
        @mkdir($chromeBase, 0775, true);
        @mkdir($chromeBase.'/cache', 0775, true);
        @mkdir($chromeBase.'/data',  0775, true);
    
        Browsershot::html($finalHtml)
            ->windowSize(630, 630)
            ->waitUntilNetworkIdle(true)
            ->quality(90)
            ->timeout(120)
            ->setNodeBinary('/usr/bin/node')
            ->setNpmBinary('/usr/bin/npm')
            ->setChromePath('/usr/bin/google-chrome')
            ->noSandbox()
            ->addChromiumArguments([
                // sin "--"
                'headless=new',
                'no-sandbox',
                'disable-dev-shm-usage',
                'disable-gpu',
                'disable-setuid-sandbox',
                'no-first-run',
                // perfil/cache en storage (escribible por www-data)
                'user-data-dir=' . $chromeBase,
                'data-path='     . $chromeBase . '/data',
                'disk-cache-dir='. $chromeBase . '/cache',
            ])
            ->save($outputPath);
    
        return $filename; // => "published/xxxx.png"
    }
}
