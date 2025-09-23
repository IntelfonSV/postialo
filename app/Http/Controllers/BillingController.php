<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Product;
use Carbon\Carbon;


use Illuminate\Support\Facades\DB;
use App\Models\PaymentSession;
use App\Models\Payment;
use App\Models\PaymentItem;
use App\Services\Payment\ScheduleGenerator;
use Illuminate\Support\Str;
use App\Models\PaymentTransaction;





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
        $user = auth()->user();
        $products = Product::query()
            ->where('active', true)
            ->orderBy('id')
            ->get(['id', 'name', 'price', 'currency', 'description']); // agrega 'desc' si existe en tu tabla

        return Inertia::render('Billing/Index', [
            'subscription' => auth()->user()->subscription,
            'products' => $products,
            'demos' => $user->demos(),
        ]);
    }

    public function pay1(Request $request)
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

        // NEW: construir custom params asegurando convención paramX
        $customParams = $data['custom_params'] ?? [];
        $customParams['param1'] = (string)$userId; // ← id de usuario en param1

        \DB::beginTransaction();
        try {
            // 1) payment_sessions (tu schema real)
            $session = new \App\Models\PaymentSession();
            $session->user_id       = $userId;
            $session->permissions   = 'initial_payment,automatic_charges,receive_payments';
            $session->currency      = $product->currency ?? 'USD';
            $session->country_code  = 'SV';
            $session->custom_params = json_encode($customParams); // NEW: usar customParams con param1
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
            // NEW: enviar objeto con param1 (id usuario)
            'custom_params'   => $customParams ?: new \stdClass(),
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

    public function pay(Request $request)
    {
        $data = $request->validate([
            'product_id'    => 'required|integer|exists:products,id',
            'qty'           => 'nullable|numeric|min:1',
            'custom_params' => 'nullable|array',
        ]);

        $userId  = auth()->id();
        $qty     = (float)($data['qty'] ?? 1);

        $product = Product::findOrFail($data['product_id']);

        $amountPerCharge = round((float)$product->price * $qty, 2);
        $today           = now()->toDateString();

        // Custom params (param1 = userId)
        $customParams = $data['custom_params'] ?? [];
        $customParams['param1'] = (string)$userId;

        // Intervalo (meses) desde producto
        $intervalMonths = (int)($product->intervalo_meses ?? 1);

        // Normaliza country_code
        $countryCode = strtoupper((string)($product->country_code ?? 'SV'));
        if (!preg_match('/^[A-Z]{2}$/', $countryCode)) {
            $countryCode = 'SV';
        }

        $datesCarbon = \App\Services\Payment\ScheduleGenerator::generate(now(), $intervalMonths, 1, true);

        \Log::info('Dates Carbon', ['dates' => $datesCarbon]);

        \DB::beginTransaction();
        try {
            // 1) payment_sessions  
            $session = new PaymentSession();
            $session->user_id       = $userId;
            $session->permissions   = 'initial_payment,automatic_charges,receive_payments';
            $session->currency      = $product->currency ?? 'USD';
            $session->country_code  = $countryCode;
            $session->custom_params = json_encode($customParams);
            $session->provider      = 'pagadito';
            $session->status        = 'initiated';
            $session->save();

         
            // 2) Fechas -> Carbon[] -> ['Y-m-d', ...] para evitar ISO-8601 en JSON
            $datesCarbon = \App\Services\Payment\ScheduleGenerator::generate(now(), $intervalMonths, 1, true);
            $dateStrings = collect(\App\Services\Payment\ScheduleGenerator::asYmdArray($datesCarbon))
                ->unique()
                ->sort()
                ->values();

            if ($dateStrings->isEmpty()) {
                throw new \Exception('No se generaron fechas de cobro');
            }

            $paymentsCreated = [];
            $seq = 0;

            foreach ($dateStrings as $dateStr) {
                $seq++;

                // ERN único: POSTIALO-{productId}-{YYYYMMDD}-{seq}-{RANDOM}
                $datePart  = str_replace('-', '', $dateStr);
                $attempts  = 0;
                $exists    = false;
                $candidate = null;
                do {
                    $salt      = strtoupper(\Illuminate\Support\Str::random(6));
                    $candidate = "POSTIALO-{$product->id}-{$datePart}-" . str_pad($seq, 3, '0', STR_PAD_LEFT) . "-{$salt}";
                    $exists    = \App\Models\Payment::where('ern', $candidate)->exists();
                    $attempts++;
                } while ($exists && $attempts < 8);

                if ($exists) {
                    throw new \Exception("No fue posible generar ERN único para la fecha {$dateStr}");
                }

                // 3) payments (UNO por cada fecha programada)
                $p = new Payment();
                $p->payment_session_id = $session->id;
                $p->user_id            = $userId;
                $p->charge_date        = $dateStr;              // 'Y-m-d'
                $p->valid_until        = \Carbon\Carbon::parse($dateStr)->addMonths($intervalMonths)->format('Y-m-d');
                $p->amount             = $amountPerCharge;
                $p->currency           = $session->currency;
                $p->country_code       = $session->country_code;
                $p->status             = 'REGISTRED';
                $p->ern                = $candidate;
                $p->description        = 'Compra de ' . $product->name . ' - cuota ' . $seq;
                $p->reference          = null;
                $p->master_token       = null;                  // ← token global (se setea tras la respuesta del gateway)
                $p->save();

                // 4) payment_items (FK a payments.id) — UNO por cada payment
                $item = new PaymentItem();
                $item->payment_id    = $p->id;
                $item->product_id  = $product->id;
                $item->description = $product->name;
                $item->price       = (float)$product->price;
                $item->quantity    = $qty;
                $item->line_total  = $amountPerCharge; // = price * qty
                $item->save();

                // 5) payment_transactions (snapshot del intento)
                $txn = new PaymentTransaction();
                $txn->payment_id         = $p->id;
                $txn->user_id            = $userId;
                $txn->transacted_at      = now();
                $txn->snapshot           = json_encode([
                    'session_id'   => $session->id,
                    'payment_id'   => $p->id,
                    'product_id'   => $product->id,
                    'product_name' => $product->name,
                    'price'        => (float)$product->price,
                    'qty'          => $qty,
                    'currency'     => $session->currency,
                    'country_code' => $session->country_code,
                    'planned_date' => $p->charge_date, // Y-m-d
                ]);
                $txn->first_seen_at      = now();
                $txn->last_seen_at       = now();
                $txn->amount             = $p->amount;
                $txn->provider           = 'pagadito';
                $txn->ern                = $p->ern;
                $txn->provider_token     = null;                // ← se pobla luego por webhook con token_pending
                $txn->provider_reference = null;
                $txn->status             = 'REGISTRED';
                $txn->currency           = $p->currency;
                $txn->save();

                $paymentsCreated[] = $p;
            }

            \DB::commit();
        } catch (\Throwable $e) {
            \DB::rollBack();
            \Log::error('DB persist failed before Pagadito', ['e' => [
                'class'   => get_class($e),
                dd($e),
                'message' => $e->getMessage(),
            ]]);
            return response()->json(['ok' => false, 'message' => 'Error al preparar la sesión de pago'], 500);
        }

        // 6) Construcción de pending_charges (1:1 con payments) con fecha en Y-m-d
        $maxCharges = (int) config('services.pagadito.max_charges', 12); // opcional
        $pendingCharges = [];

        foreach (collect($paymentsCreated)->take($maxCharges) as $idx => $p) {
            $dateStr = \Carbon\Carbon::parse($p->charge_date)->format('Y-m-d');

            $details = [[
                'quantity'    => (int) round($qty),
                'description' => preg_replace('/[^\x20-\x7E]/', '', (string) $product->name),
                'price'       => (float) $product->price,
            ]];

            // asegurar amount == suma(details)
            $sumDetails = round($details[0]['quantity'] * $details[0]['price'], 2);
            if (round((float) $p->amount, 2) !== $sumDetails) {
                $p->amount = $sumDetails;
                $p->save();
            }

            $desc = 'Compra de ' . (string) $product->name . ' - cuota ' . ($idx + 1);
            $desc = preg_replace('/[^\x20-\x7E]/', '', $desc);
            if (strlen($desc) > 120) $desc = substr($desc, 0, 120);

            $pendingCharges[] = [
                'amount'      => (float) $p->amount,
                'ern'         => (string) $p->ern,
                'description' => $desc,
                'date'        => $dateStr,
                'details'     => $details,
            ];
        }

        // 7) Payload final
        $payload = [
            'permissions'     => $session->permissions,
            'currency'        => $session->currency,
            'country_code'    => $session->country_code,
            'pending_charges' => $pendingCharges,
            'custom_params'   => $customParams ?: new \stdClass(),
        ];

        $endpoint = rtrim(config('services.pagadito.endpoint'), '/');
        $path     = ltrim(config('services.pagadito.recurring_path'), '/');

        // LOG: payload JSON exactamente como se envía
        \Log::debug('[Pagadito] AuthorizationRecurringPayments payload', [
            'endpoint' => "{$endpoint}/{$path}",
            'payload'  => json_decode(json_encode($payload), true),
        ]);

        try {
            $resp = \Http::timeout(30)
                ->withBasicAuth(config('services.pagadito.uid'), config('services.pagadito.wsk'))
                ->acceptJson()
                ->post("{$endpoint}/{$path}", $payload);

            // LOG: respuesta cruda
            \Log::debug('[Pagadito] HTTP response', [
                'status'  => $resp->status(),
                'json'    => $resp->json(),
                'body'    => $resp->body(),
                'headers' => $resp->headers(),
            ]);

            $body  = $resp->json() ?? [];
            $url   = $body['url'] ?? data_get($body, 'data.url');
            $token = $body['token'] ?? data_get($body, 'data.token'); // ← token global (master)

            if ($resp->failed()) {
                $session->status        = 'failed';
                $session->provider_code = $body['code'] ?? null;
                $session->save();

                foreach ($paymentsCreated as $p) {
                    $p->status = 'failed';
                    $p->save();
                }

                \Log::warning('Pagadito genLinkRecurring HTTP failed', [
                    'status' => $resp->status(),
                    'body'   => $resp->body(),
                ]);

                return response()->json([
                    'ok'      => false,
                    'message' => 'Pagadito no respondió OK',
                    'error'   => $body,
                ], 502);
            }

            // 8) Actualizamos session y payments (master_token)
            $session->provider_code = $body['code'] ?? $session->provider_code;
            if ($url)   $session->provider_url = $url;
            if ($token) $session->auth_token   = $token;  // token global en sesión
            $session->status = 'initiated';
            $session->save();

            foreach ($paymentsCreated as $p) {
                if ($token) $p->master_token = $token; // ← guardar el master_token en cada Payment
                $p->status = 'initiated';
                $p->save();

                // No seteamos provider_token aquí; se pobla con token_pending en el webhook
                $txn = \App\Models\PaymentTransaction::where('ern', $p->ern)->first();
                if ($txn) {
                    $txn->provider_reference = $body['authorization_id'] ?? data_get($body, 'data.authorization_id');
                    $txn->last_seen_at = now();
                    $txn->status = 'initiated';
                    $txn->save();
                }
            }

            if (!$url) {
                return response()->json([
                    'ok'      => false,
                    'message' => 'No vino URL de autorización en la respuesta',
                    'data'    => $body,
                ], 502);
            }

            return response()->json(['url' => $url]);
            //redirect to $url
            //dd($url);
            //return redirect()->away($url);
        } catch (\Throwable $e) {
            $session->status = 'failed';
            $session->save();

            foreach ($paymentsCreated as $p) {
                $p->status = 'failed';
                $p->save();
            }

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

    public function thanksPage(Request $request)
    {
        // Aquí integras Stripe, PayPal, o el gateway que uses
        // Si el pago es exitoso:
        $token = $request->input('token');
        $ern   = $request->input('comprobante');

        return Inertia::render('Billing/ThanksPage', [
            'token' => $token,
            'ern'   => $ern,
        ]);
    }

}
