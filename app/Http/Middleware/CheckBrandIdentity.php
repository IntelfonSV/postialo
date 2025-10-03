<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckBrandIdentity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();
        $user->loadMissing('brandIdentity');
        $brand = $user->brandIdentity;
        if ($brand && $brand->isCompleted()) {
            return $next($request);
        }
        return redirect()->route('brand-identities.index')->with('error', 'Debes completar la identidad de marca.');
    }
}
