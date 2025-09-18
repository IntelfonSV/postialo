<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PasarelaController extends Controller
{
    public function webhook(Request $request)
    {
        try {
            // Loguea todo el contenido crudo que llega en el body
            Log::info('Webhook Pagadito recibido', [
                'raw' => $request->getContent(),
            ]);
        } catch (\Throwable $e) {
            Log::error('Error al procesar webhook de Pagadito', [
                'error' => $e->getMessage(),
            ]);
        }

        // Siempre responde ok:true
        return response()->json(['ok' => true]);
    }
}
