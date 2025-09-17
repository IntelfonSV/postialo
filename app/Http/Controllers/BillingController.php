<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Product;


class BillingController extends Controller
{


    // public function show()
    // {
    //     // Aquí muestras la vista React con Inertia
    //     return Inertia::render('Billing/Index', [
    //         'subscription' => auth()->user()->subscription
    //     ]);
    // }

    // public function pay(Request $request)
    // {
    //     // Aquí integras Stripe, PayPal, o el gateway que uses
    //     // Si el pago es exitoso:
    //     $subscription = auth()->user()->subscription;
    //     $subscription->update([
    //         'status' => 'active',
    //         'expires_at' => now()->addMonth(), // o el periodo que decidas
    //     ]);

    //     return redirect()->route('dashboard')->with('success', 'Pago realizado con éxito.');
    // }


    public function show(Request $request)
    {
        $products = Product::query()
            ->where('active', true)
            ->orderBy('id')
            ->get(['id', 'name', 'price', 'currency', 'description']); // agrega 'desc' si existe en tu tabla

        return Inertia::render('Billing/Index', [
            'subscription' => auth()->user()->subscription,
            'products' => $products,
        ]);
    }

    public function pay(Request $request)
    {
        $data = $request->validate([
            'product_id'    => 'required|integer|exists:products,id',
            'qty'           => 'nullable|numeric|min:1',
            'custom_params' => 'nullable|array',
        ]);

        $qty = (float)($data['qty'] ?? 1);

        // 1) Traer producto (fuente de verdad de precio/moneda/nombre)
        $product = \App\Models\Product::query()->findOrFail($data['product_id']);

        // 2) Armar payload EXACTO para Pagadito (sin pedir nada más al front)
        $amount = round($product->price * $qty, 2);
        $ern    = 'POSTIALO-' . now()->format('YmdHis') . '-' . $product->id;

        $payload = [
            'permissions'     => 'initial_payment,automatic_charges,receive_payments',
            'currency'        => $product->currency ?? 'USD',
            'country_code'    => 'SV',
            'pending_charges' => [[
                'amount'      => $amount,
                'ern'         => $ern,
                'description' => 'Compra de ' . $product->name,
                'date'        => now()->toDateString(),
                'details'     => [[
                    'quantity'    => $qty,
                    'description' => $product->name,
                    'price'       => (float)$product->price,
                ]],
            ]],
            'custom_params'   => $data['custom_params'] ?? new \stdClass(),
        ];

        // 3) (Opcional ahora / recomendado) Registrar en BD: session + payment + items
        //    ... lo dejamos para el siguiente paso si querés

        // 4) Llamar Pagadito
        $endpoint = rtrim(config('services.pagadito.endpoint'), '/');
        $path     = ltrim(config('services.pagadito.recurring_path'), '/');

        $resp = \Illuminate\Support\Facades\Http::timeout(25)
            ->withBasicAuth(config('services.pagadito.uid'), config('services.pagadito.wsk'))
            ->acceptJson()
            ->post("{$endpoint}/{$path}", $payload);

        if ($resp->failed()) {
            \Log::warning('Pagadito genLinkRecurring HTTP failed', [
                'status' => $resp->status(),
                'body'   => $resp->body(),
            ]);
            return response()->json([
                'ok'      => false,
                'message' => 'Pagadito no respondió OK',
                'error'   => $resp->json(),
            ], 502);
        }

        $body = $resp->json();
        if (($body['code'] ?? null) === 'PG1008' && !empty($body['data']['url'])) {
            return response()->json(['url' => $body['data']['url']]);
        }

        return response()->json([
            'ok'      => false,
            'message' => 'Código de éxito no recibido',
            'code'    => $body['code'] ?? null,
            'data'    => $body['data'] ?? null,
        ], 502);
    }


    public function cancel(Request $request)
    {
        // Aquí integras Stripe, PayPal, o el gateway que uses
        // Si el pago es exitoso:
        $subscription = auth()->user()->subscription;
        $subscription->update([
            'status' => 'canceled',
            'expires_at' => now()->addMonth(), // o el periodo que decidas
        ]);

        return redirect()->route('dashboard')->with('success', 'Pago realizado con éxito.');
    }

    public function update(Request $request)
    {
        // Aquí integras Stripe, PayPal, o el gateway que uses
        // Si el pago es exitoso:
        $subscription = auth()->user()->subscription;
        $subscription->update([
            'status' => 'active',
            'expires_at' => now()->addMonth(), // o el periodo que decidas
        ]);

        return redirect()->route('dashboard')->with('success', 'Pago realizado con éxito.');
    }
}
