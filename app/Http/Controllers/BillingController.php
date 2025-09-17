<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class BillingController extends Controller
{
   


    public function show()
    {
        // Aquí muestras la vista React con Inertia
        return Inertia::render('Billing/Index', [
            'subscription' => auth()->user()->subscription
        ]);
    }

    public function pay(Request $request)
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
