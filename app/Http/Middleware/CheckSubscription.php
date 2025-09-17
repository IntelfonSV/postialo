<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscription
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if ($user->hasRole('admin')) {
            return $next($request);
        }
        if (!$user->hasActiveSubscription()) {
            return redirect()->route('billing.show')->with('error', 'Tu suscripción no está activa, por favor realiza el pago.');
        }

        return $next($request);
    }
}
