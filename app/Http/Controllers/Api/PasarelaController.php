<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Payment;
use App\Models\WebhookEvent;
use Carbon\Carbon;

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
            $data = json_decode($raw, true);

            if (json_last_error() === JSON_ERROR_NONE) {
                Log::info('Webhook Pagadito recibido (JSON válido)', [
                    'data' => json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
                ]);

                // Insertar registro en webhook_events
                WebhookEvent::create([
                    'created_at' => isset($data['event_create_timestamp'])
                        ? Carbon::parse($data['event_create_timestamp'])
                        : now(),
                    'provider'   => 'pagadito',
                    'event_id'   => $data['id'] ?? null,
                    'ern'        => $data['resource']['ern'] ?? null,
                    'status'     => $data['resource']['status'] ?? null,
                    'raw_body'   => $raw,
                ]);

                $status = $data['resource']['status'] ?? null;
                $ern    = $data['resource']['ern'] ?? null;

                if ($ern && $status) {
                    $payment = Payment::where('ern', $ern)->first();

                    if ($payment) {
                        if ($status === 'REGISTERED') {
                            $payment->status = $status;
                            $payment->pending_token = $data['resource']['token_pending'] ?? null;
                            $payment->save();

                            Log::info("Payment actualizado desde webhook (REGISTERED)", [
                                'ern' => $payment->ern,
                                'status' => $payment->status,
                                'pending_token' => $payment->pending_token,
                            ]);
                        } elseif ($status === 'COMPLETED') {
                            $payment->status = $status;
                            $payment->reference = $data['resource']['reference'] ?? null;
                            $payment->save();

                            Log::info("Payment actualizado desde webhook (COMPLETED)", [
                                'ern' => $payment->ern,
                                'status' => $payment->status,
                                'reference' => $payment->reference,
                            ]);
                        } else {
                            $payment->status = $status;
                            $payment->save();

                            Log::info("Payment actualizado desde webhook (OTRO STATUS)", [
                                'ern' => $payment->ern,
                                'status' => $payment->status,
                            ]);
                        }
                    }
                }
            } else {
                Log::warning('Webhook Pagadito recibido (NO es JSON válido)', [
                    'raw'        => $raw,
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
