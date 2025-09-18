<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Product;

use Illuminate\Support\Facades\DB;
use App\Models\PaymentSession;
use App\Models\Payment;
use App\Models\PaymentItem;


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

        $userId  = auth()->id();
        $qty     = (float)($data['qty'] ?? 1);
        $product = \App\Models\Product::findOrFail($data['product_id']);

        $amount  = round((float)$product->price * $qty, 2);
        $ern     = 'POSTIALO-' . now()->format('YmdHis') . '-' . $product->id;
        $today   = now()->toDateString();

        \DB::beginTransaction();
        try {
            // 1) payment_sessions (tu schema real)
            $session = new \App\Models\PaymentSession();
            $session->user_id       = $userId;
            $session->permissions   = 'initial_payment,automatic_charges,receive_payments';
            $session->currency      = $product->currency ?? 'USD';
            $session->country_code  = 'SV';
            $session->custom_params = json_encode($data['custom_params'] ?? []);
            $session->provider      = 'pagadito';
            $session->status        = 'initiated';
            // auth_token / provider_url / provider_code / provider_ref se llenan después
            $session->save();

            // 2) payments (incluye user_id NOT NULL)
            $payment = new \App\Models\Payment();
            $payment->payment_session_id = $session->id;
            $payment->user_id            = $userId;                 // ← requerido por tu tabla
            $payment->ern                = $ern;
            $payment->charge_date        = $today;
            $payment->description        = 'Compra de ' . $product->name;
            $payment->amount             = $amount;
            $payment->status             = 'initiated';
            $payment->currency           = $session->currency;
            $payment->country_code       = $session->country_code;
            $payment->save();

            // 3) payment_items (FK a payments.id)
            $item = new \App\Models\PaymentItem();
            $item->payment_id  = $payment->id;
            $item->product_id  = $product->id;
            $item->description = $product->name;
            $item->price       = (float)$product->price;
            $item->quantity    = $qty;
            $item->line_total  = $amount;
            $item->save();

            // 4) payment_transactions (snapshot del intento)
            $txn = new \App\Models\PaymentTransaction();
            $txn->payment_id         = $payment->id;
            $txn->user_id            = $userId;
            $txn->transacted_at      = now();
            $txn->snapshot           = json_encode([
                'session_id'   => $session->id,
                'payment_id'   => $payment->id,
                'product_id'   => $product->id,
                'product_name' => $product->name,
                'price'        => (float)$product->price,
                'qty'          => $qty,
                'currency'     => $session->currency,
                'country_code' => $session->country_code,
            ]);
            $txn->first_seen_at      = now();
            $txn->last_seen_at       = now();
            $txn->amount             = $amount;
            $txn->provider           = 'pagadito';
            $txn->ern                = $ern;
            $txn->provider_token     = null;
            $txn->provider_reference = null;
            $txn->status             = 'initiated';
            $txn->currency           = $session->currency;
            $txn->save();

            \DB::commit();
        } catch (\Throwable $e) {
            \DB::rollBack();
            \Log::error('DB persist failed before Pagadito', ['e' => [
                'class' => get_class($e),
                'message' => $e->getMessage()
            ]]);
            return response()->json(['ok' => false, 'message' => 'Error al preparar la sesión de pago'], 500);
        }

        // 5) Llamada a Pagadito (usa tus env/servicios actuales)
        $payload = [
            'permissions'     => $session->permissions,
            'currency'        => $session->currency,
            'country_code'    => $session->country_code,
            'pending_charges' => [[
                'amount'      => $amount,
                'ern'         => $ern,
                'description' => $payment->description,
                'date'        => $today,
                'details'     => [[
                    'quantity'    => $qty,
                    'description' => $product->name,
                    'price'       => (float)$product->price,
                ]],
            ]],
            'custom_params'   => $data['custom_params'] ?? new \stdClass(),
        ];

        $endpoint = rtrim(config('services.pagadito.endpoint'), '/');
        $path     = ltrim(config('services.pagadito.recurring_path'), '/');

        try {
            $resp = \Http::timeout(30)
                ->withBasicAuth(config('services.pagadito.uid'), config('services.pagadito.wsk'))
                ->acceptJson()
                ->post("{$endpoint}/{$path}", $payload);

            $body = $resp->json();

            if ($resp->failed()) {
                // marcar fallidos pero conservar trazas
                $session->status        = 'failed';
                $session->provider_code = $body['code'] ?? null;
                $session->save();

                $payment->status = 'failed';
                $payment->save();

                $txn->status       = 'failed';
                $txn->last_seen_at = now();
                $txn->save();

                \Log::warning('Pagadito genLinkRecurring HTTP failed', [
                    'status' => $resp->status(),
                    'body' => $resp->body(),
                ]);
                return response()->json(['ok' => false, 'message' => 'Pagadito no respondió OK', 'error' => $body], 502);
            }

            $url = $body['url'] ?? ($body['data']['url'] ?? null);

            // token del query (si viene) → auth_token / provider_token
            $token = null;
            if ($url) {
                $parts = parse_url($url);
                if (!empty($parts['query'])) {
                    parse_str($parts['query'], $q);
                    $token = $q['token'] ?? null;
                }
            }

            // actualizar session
            $session->provider_code = $body['code'] ?? $session->provider_code;
            if ($url)   $session->provider_url = $url;
            if ($token) $session->auth_token   = $token;
            $session->save();

            // actualizar transacción
            if ($token) $txn->provider_token = $token;
            $txn->provider_reference = $body['authorization_id'] ?? ($body['data']['authorization_id'] ?? null);
            $txn->last_seen_at       = now();
            $txn->save();

            if (!$url) {
                return response()->json([
                    'ok' => false,
                    'message' => 'No vino URL de autorización en la respuesta',
                    'data' => $body,
                ], 502);
            }

            return response()->json(['url' => $url]);
        } catch (\Throwable $e) {
            $session->status = 'failed';
            $session->save();

            $payment->status = 'failed';
            $payment->save();

            $txn->status       = 'failed';
            $txn->last_seen_at = now();
            $txn->save();

            \Log::error('Pagadito genLinkRecurring exception', ['e' => $e->getMessage()]);
            return response()->json(['ok' => false, 'message' => 'Error interno al generar link recurrente'], 500);
        }
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
