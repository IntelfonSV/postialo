<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\Schedule;

class FreepikController extends Controller
{
    public function generateImage($prompt){

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'x-freepik-api-key' => config('services.freepik.api_key'),
        ])->post('https://api.freepik.com/v1/ai/text-to-image/flux-dev', [
            'prompt' => $prompt,
            'webhook_url' => 'https://1952ff0fa74c.ngrok-free.app/api/freepik/saveImage',
            'aspect_ratio' => 'square_1_1',
            'colors' => [],
            'num_images' => 1,
        ]);
        $data = $response->json();

        return $data['data'];
    }

    public function getImage($id){
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'x-freepik-api-key' => config('services.freepik.api_key'),
        ])->get('https://api.freepik.com/v1/ai/text-to-image/flux-dev/'.$id);

        return response()->json([
            'success' => true,
            'image' => $response->json(),
        ]);
    }


    
    public function saveImage(Request $request)
    {
        $generated = $request->input('generated', []);
        $taskId = $request->input('task_id', uniqid());
        $status = $request->input('status', 'unknown');
    
        if (empty($generated)) {
            return response()->json(['message' => 'No images to save'], 400);
        }
    
        $savedFiles = [];
        $failedUrls = [];
    
        foreach ($generated as $index => $url) {
            try {
                // 1. Configuración avanzada de la petición
                $response = Http::withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                    'Referer' => 'https://www.freepik.com/',
                    'Accept' => 'image/webp,image/apng,image/*,*/*;q=0.8',
                    'Accept-Language' => 'es-ES,es;q=0.9',
                    'Sec-Fetch-Dest' => 'image',
                    'Sec-Fetch-Mode' => 'no-cors',
                    'Sec-Fetch-Site' => 'cross-site',
                    ])->timeout(15)->get($url);
    
                // 2. Verificación del contenido
                if (!$response->successful()) {
                    Log::error("Failed to download image", [
                        'url' => $url,
                        'status' => $response->status(),
                        'response' => $response->body()
                    ]);
                    $failedUrls[] = $url;
                    continue;
                }
    
                $imageData = $response->body();
                $contentType = $response->header('Content-Type');
                
                if (!str_contains($contentType, 'image/')) {
                    Log::error("Invalid content type", [
                        'url' => $url,
                        'content_type' => $contentType
                    ]);
                    $failedUrls[] = $url;
                    continue;
                }
                
                // 3. Determinar extensión
                $extension = match($contentType) {
                    'image/jpeg' => 'jpg',
                    'image/png' => 'png',
                    'image/webp' => 'webp',
                    'image/gif' => 'gif',
                    default => pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'jpg'
                };
                
                // 4. Guardar imagen
                $fileName = "freepik_images/{$taskId}_{$index}.{$extension}";
                Storage::disk('public')->put($fileName, $imageData);

                $schedule = Schedule::where('task_id', $taskId)->first();
                $schedule->update([
                    'status' => 'generated',
                    'image' => $fileName,
                ]);

    
                // 5. Verificar que se guardó correctamente
                if (!Storage::disk('public')->exists($fileName)) {
                    throw new \Exception("Failed to save file to storage");
                }
    
                $savedFiles[] = [
                    'path' => $fileName,
                    'url' => Storage::url($fileName),
                    'size' => Storage::disk('public')->size($fileName)
                ];
    
            } catch (\Exception $e) {
                Log::error("Error processing image", [
                    'url' => $url,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                $failedUrls[] = $url;
            }
        }
    
        // 6. Preparar respuesta
        $responseData = [
            'message' => count($savedFiles) > 0 ? 'Images processed' : 'All images failed',
            'saved_count' => count($savedFiles),
            'failed_count' => count($failedUrls),
            'saved_files' => $savedFiles
        ];
    
        if (count($failedUrls) > 0) {
            $responseData['failed_urls'] = $failedUrls;
        }
    
        return response()->json($responseData, count($savedFiles) > 0 ? 200 : 400);
    }
}
