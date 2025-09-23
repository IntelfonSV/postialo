<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasNoSubscription
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
            return redirect()->route('dashboard')->with('error', 'No Necesitas una suscripción para acceder a esta página.');
        }
        if ($user->hasActivePayment()) {
            return redirect()->route('dashboard')->with('error', 'Ya tienes una suscripción activa.');
        }
        
        if ($user->hasActiveDemo()) {
            return redirect()->route('dashboard')->with('error', 'Ya tienes una demo activa.');
        }
        
        return $next($request);
    }
}
