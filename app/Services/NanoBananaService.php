<?php

namespace App\Services;

use App\Models\ScheduleImage;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use App\Models\AiUsage;



class NanoBananaService
{
    /**
     * Genera una imagen usando Gemini/Nano Banana
     * - $image: imagen base (p.e. ScheduleImage)
     * - $images: imágenes extra que sube el usuario (request->file('images', []))
     * - $prompt: prompt de texto
     * - $user: para resolver la imagen de overlay asociada al partner
     */
    public function generateImage(?ScheduleImage $image, array $images, string $prompt, ?User $user = null): array {
        $parts = [];

        // 1) Imagen principal ($image)

        if($image){
            if ($image->image_source == 'api') {
                $imgResponse = Http::get($image->image_path);
                if (!$imgResponse->successful()) {
                    return [
                        'ok'=> false,
                        'error' => 'No se pudo descargar la imagen base',
                    ];
                }

                $imageData = base64_encode($imgResponse->body());
                $mimeType  = 'image/png'; // si sabes el real, mejor
            } else {
                $path = Storage::disk('public')->path($image->image_path);
                if (!file_exists($path)) {
                    throw new \Exception("No existe la imagen en el path: $path");
                }

                $binary   = file_get_contents($path);
                $imageData = base64_encode($binary);
                $mimeType  = mime_content_type($path) ?: 'image/png';
            }

            $parts[] = [
                'inlineData' => [
                    'mimeType' => $mimeType,
                    'data'     => $imageData,
                ],
            ];
        }


        // 3) Todas las imágenes adicionales que sube el usuario por formulario
        foreach ($images as $img) {
            $mimeType = $img->getMimeType();

            try {
                $imgData = base64_encode(file_get_contents($img->getRealPath()));
            } catch (\Exception $e) {
                return [
                    'ok'=> false,
                    'error' => 'Error al procesar imagen extra: ' . $e->getMessage(),
                ];
            }

            $parts[] = [
                'inlineData' => [
                    'mimeType' => $mimeType,
                    'data'     => $imgData,
                ],
            ];
        }


        // 2) Overlay del usuario (logo/imagen definida por partner) – OPCIONAL
        if ($user) {
            //$overlayImagePath = $user->partnerOverlayImagePath(); // puede ser null
            $overlayImagePath = null;

            if ($overlayImagePath) {

                $path = Storage::disk('public')->path($overlayImagePath);
                if (!file_exists($path)) {
                    throw new \Exception("No existe la imagen en el path: $path");
                }

                
                $file  = file_get_contents($path);
                $imageData = base64_encode($file);
                $mimeType  = mime_content_type($path) ?: 'image/png';
                
                
                if ($imageData) {
                    $parts[] = [
                        'inlineData' => [
                            'mimeType' => $mimeType,
                            'data'     => $imageData,
                        ],
                    ];                    
                    // Si quieres, puedes reforzar el prompt para decirle que use esa imagen extra:
                    $prompt .= "\n\nIncorpora también la ultima imagen adicional proporcionada (logo/producto) de forma coherente en el diseño.";
                }
            }
        }

        // 4) Añadir el prompt de texto
        $parts[] = [
            'text' => $prompt,
        ];

        // 5) Payload final
        $payload = [
            'contents' => [
                [
                    'parts' => $parts,
                ],
            ],
            'generationConfig' => [
                'responseModalities' => ['IMAGE'],
                'imageConfig'=> [
                    'aspectRatio' => '1:1',
                ],
            ],
        ];


        $response = Http::timeout(180)
            ->withHeaders([
                'Content-Type'   => 'application/json',
                'x-goog-api-key' => config('services.google.api_key'),
            ])
            ->post(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent',
                //"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",
                $payload
            );
        if (!$response->successful()) {
            return [
                'ok'    => false,
                'error' => 'No se pudo generar la imagen',
            ];
        }
        $data  = $response->json();

        if (!isset($data['candidates'][0]['content'])) {
            return [
                'ok'    => false,
                'error' => 'No se pudo generar la imagen',
            ];
        }

        $parts = $data['candidates'][0]['content']['parts'] ?? [];
        $usage = $data['usageMetadata'] ?? null;
        
        if ($usage) {
            AiUsage::create([
                'user_id'           => $user?->id,
                'model'             => $data['modelVersion'] ?? 'gemini-2.5-flash-image',
                'prompt_tokens'     => $usage['promptTokenCount']        ?? null,
                'candidates_tokens' => $usage['candidatesTokenCount']    ?? null,
                'total_tokens'      => $usage['totalTokenCount']         ?? null,
                'operation'         => 'image_generate',
                'meta'              => [
                    'schedule_image_id'        => $image?->id,
                    'response_id'              => $data['responseId']          ?? null,
                    'promptTokensDetails'      => $usage['promptTokensDetails'] ?? null,
                    'candidatesTokensDetails'  => $usage['candidatesTokensDetails'] ?? null,
                ],
            ]);
        }

        foreach ($parts as $part) {
            if (isset($part['inlineData'])) {
                $imgBase64 = $part['inlineData']['data'];
                $fileName = 'gemini_output_' . time() . '.png';
                Storage::disk('public')->put("images/{$fileName}", base64_decode($imgBase64));
                return [
                    'ok'    => true,
                    'status'   => 'success',
                    'image' => "images/{$fileName}",
                ];
            }
        }

        return [
            'ok'    => false,
            'status'    =>  'error',
            'message' => 'No se encontró imagen en la respuesta',
        ];
    }
}
