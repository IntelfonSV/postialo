<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Payment;
use App\Models\PaymentSession;


class PasarelaController extends Controller
{
    // public function webhook(Request $request)
    // {
    //     try {
    //         // Loguea todo el contenido crudo que llega en el body
    //         Log::info('Webhook Pagadito recibido', [
    //             'raw' => $request->getContent(),
    //         ]);
    //     } catch (\Throwable $e) {
    //         Log::error('Error al procesar webhook de Pagadito', [
    //             'error' => $e->getMessage(),
    //         ]);
    //     }

    //     // Siempre responde ok:true
    //     return response()->json(['ok' => true]);
    // }


    public function webhook(Request $request)
    {
        try {
            $raw = $request->getContent();

            // Intentar parsear a JSON
            $data = json_decode($raw, true);

            if (json_last_error() === JSON_ERROR_NONE) {
                // Es un JSON válido
                Log::info('Webhook Pagadito recibido (JSON válido)', [
                    'data' => json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
                ]);

                $payment = Payment::where('ern', $data['ern'])->first();
                if ($payment) {
                    $payment->status = $data['resource']['status'];
                    $payment->save();
                }

            } else {
                // No es JSON válido
                Log::warning('Webhook Pagadito recibido (NO es JSON válido)', [
                    'raw' => $raw,
                    'json_error' => json_last_error_msg(),
                ]);
            }
        } catch (\Throwable $e) {
            Log::error('Error al procesar webhook de Pagadito', [
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json(['ok' => true]);
    }
}
