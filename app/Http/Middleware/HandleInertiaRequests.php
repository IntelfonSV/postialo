<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Partner;
class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'partner_id' => $request->user()->partner_id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'image' => $request->user()->image,
                    'roles' => $request->user()->roles->pluck('name'), // Solo nombres de roles
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
            ],
            'partner' => $request->user() && $request->user()->partner_id
                ? Partner::find($request->user()->partner_id)
                : null,
        ];
    }
}
