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
        try {
            $response = Http::timeout(60)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'api-key' => config('services.ideogram.api_key'),
                ])
                ->post('https://api.ideogram.ai/v1/ideogram-v3/generate', [
                    'prompt' => $prompt,
                    'aspect_ratio' => '1x1',
                    'rendering_speed' => 'QUALITY',
                    'style_type' => 'REALISTIC'
                ]);

            // Si la API devuelve un error
            if (isset($response->json()['error'])) {
                return [
                    "status" => "error",
                    "message" => $response->json()['error']
                ];
            }

            // Validar que la respuesta tenga datos
            $data = $response->json()['data'][0] ?? null;
            if (!$data || empty($data['url'])) {
                return [
                    "status" => "error",
                    "message" => "No se pudo generar la imagen o la respuesta está vacía."
                ];
            }

            // Guardar imagen
            $image = $this->saveImage($data['url']);

            return [
                "status" => "success",
                "image" => $image
            ];

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            // Error tipo cURL (como el 28)
            \Log::error("Error de conexión con Ideogram: " . $e->getMessage());
            return [
                "status" => "error",
                "message" => "No se pudo generar la imagen. Inténtelo de nuevo."
            ];
        } catch (\Exception $e) {
            // Otros errores inesperados
            \Log::error("Error al generar imagen: " . $e->getMessage());
            return [
                "status" => "error",
                "message" => "Ocurrió un error inesperado al generar la imagen."
            ];
        }
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


    public function generateWithNanoBanana($image, $prompt) {
        // 1) Leer imagen y convertirla a base64
        if ($image->image_source == 'api') {
            $imgResponse = Http::get($image->image_path);
            if (!$imgResponse->successful()) {
                return [
                    'ok'=> false,
                    'error' => 'No se pudo descargar la imagen'
                ];
            }
            $imageData = base64_encode($imgResponse->body());
        } else {
            //validar error
            
            $path = Storage::disk('public')->path($image->image_path); 
            //dd($path);
                if (!file_exists($path)) {
                    // para depurar
                    // dd("No existe: " . $path);
                    throw new \Exception("No existe la imagen en el path: $path");
                }

            $imageData = base64_encode(file_get_contents($path));
        }

        // 👈 FORMATO CORRECTO PARA GEMINI (REST)
        $payload = [
            "contents" => [
                [
                    // "role" => "user", // opcional, pero válido
                    "parts" => [
                        [
                            "inlineData" => [
                                "mimeType" => "image/png",
                                "data" => $imageData,
                            ],
                        ],
                        [
                            "text" => $prompt,
                        ],
                    ],
                ],
            ],
            // Opcional, pero recomendado para forzar imagen como salida
            "generationConfig" => [
                "responseModalities" => ["IMAGE"],
            ],
        ];

        $response = Http::withHeaders([
                "Content-Type"   => "application/json",
                "x-goog-api-key" => config('services.google.api_key'),
            ])->post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",
                $payload
            );

        if (!$response->successful()) {
            return [
                'ok' => false,
                'error' => 'No se pudo generar la imagen'
            ];
        }

        $data  = $response->json();
        $parts = $data["candidates"][0]["content"]["parts"] ?? [];
        //dd($parts);
        foreach ($parts as $part) {
            if (isset($part["inlineData"])) {
                $imgBase64 = $part["inlineData"]["data"];

                $fileName = 'gemini_output_' . time() . '.png';
                //guardar en storage/images
                Storage::disk('public')->put('images/' . $fileName, base64_decode($imgBase64));

                return [
                    'ok' => true,
                    'file' => "images/$fileName",
                ];
            }
        }

        return [
            'ok' => false,
            'error' => 'No se encontró imagen'
        ];
    }

    public function generateWithNanoBanana2($image, array $images, $prompt) {
        
        $parts = [];
        if ($image->image_source == 'api') {
            $imgResponse = Http::get($image->image_path);
            if (!$imgResponse->successful()) {
                return [
                    'ok'=> false,
                    'error' => 'No se pudo descargar la imagen'
                ];
            }
            $imageData = base64_encode($imgResponse->body());
        } else {
            //validar error
            
            $path = Storage::disk('public')->path($image->image_path); 
            if (!file_exists($path)) {
                // para depurar
                // dd("No existe: " . $path);
                throw new \Exception("No existe la imagen en el path: $path");
            }

            $imageData = base64_encode(file_get_contents($path));
        }

        $parts[] = [
            "inlineData" => [
                "mimeType" => "image/png",
                "data"     => $imageData,
            ],
        ];
        // --- 1) Procesar todas las imágenes de entrada que vienen del formulario ---
        foreach ($images as $img) {
            
            $imageData = '';
            //obtener el mime type de la imagen que viene en el array 
            $mimeType = $img->getMimeType(); // Ajustar si tienes distintos tipos (JPG, etc.)

            try {
                $imageData = base64_encode(file_get_contents($img->getRealPath()));
            } catch (\Exception $e) {
                return ['ok'=> false, 'error' => 'Error al procesar imagen: ' . $e->getMessage()];
            }

            // Añadir la imagen al array de 'parts'
            $parts[] = [
                "inlineData" => [
                    "mimeType" => $mimeType,
                    "data"     => $imageData,
                ],
            ];
        }
    
    // --- 2) Añadir el prompt de texto al final ---
    $parts[] = [
        "text" => $prompt,
    ];

    // --- 3) Construir el payload final ---
    $payload = [
        "contents" => [
            [
                "parts" => $parts, // Aquí usamos el array $parts que contiene todas las imágenes y el prompt
            ],
        ],
        "generationConfig" => [
            "responseModalities" => ["IMAGE"],
        ],
    ];

    //dd($payload);

     $response = Http::withHeaders([
                "Content-Type"   => "application/json",
                "x-goog-api-key" => config('services.google.api_key'),
            ])->post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",
                $payload
            );

        if (!$response->successful()) {
            return [
                'ok' => false,
                'error' => 'No se pudo generar la imagen'
            ];
        }

        $data  = $response->json();
        $parts = $data["candidates"][0]["content"]["parts"] ?? [];
        //dd($parts);
        foreach ($parts as $part) {
            if (isset($part["inlineData"])) {
                $imgBase64 = $part["inlineData"]["data"];

                $fileName = 'gemini_output_' . time() . '.png';
                //guardar en storage/images
                Storage::disk('public')->put('images/' . $fileName, base64_decode($imgBase64));

                return [
                    'ok' => true,
                    'file' => "images/$fileName",
                ];
            }
        }

        return [
            'ok' => false,
            'error' => 'No se encontró imagen'
        ];
    }
}
