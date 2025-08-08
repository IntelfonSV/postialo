<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\BrandIdentity;
use Illuminate\Support\Facades\Auth;

class BrandIdentityController extends Controller
{
    public function index()
    {
        $brandIdentity = BrandIdentity::where('user_id', Auth::id())->first();
        return Inertia::render('BrandIdentities/Index', [
            'brandIdentity' => $brandIdentity
        ]);
    }

    /**
     * Guarda una nueva identidad de marca.
     */
    public function store(Request $request)
    {
            $validated = $request->validate([
                'company_identity' => 'string',
                'mission_vision' => 'string',
                'products_services' => 'string',
                'company_history' => 'string',
                'facebook.tone' => 'nullable|string',
                'facebook.guidelines' => 'nullable|string',
                'facebook.audience' => 'nullable|string',
                'instagram.tone' => 'nullable|string',
                'instagram.guidelines' => 'nullable|string',
                'instagram.audience' => 'nullable|string',
                'x.tone' => 'nullable|string',
                'x.guidelines' => 'nullable|string',
                'x.audience' => 'nullable|string',
            ]);
        
            // Combinar las directrices en un solo JSON
            $guidelines_json = [
                'facebook' => $validated['facebook'] ?? [],
                'instagram' => $validated['instagram'] ?? [],
                'x' => $validated['x'] ?? [],
            ];
        
            $identity = new BrandIdentity();
            $identity->user_id = auth()->id(); // o $request->user()->id
            $identity->company_identity = $validated['company_identity'] ?? null;
            $identity->mission_vision = $validated['mission_vision'] ?? null;
            $identity->products_services = $validated['products_services'] ?? null;
            $identity->company_history = $validated['company_history'] ?? null;
            $identity->guidelines_json = $guidelines_json;
            $identity->save();
            return back()->with('success', 'Identidad de marca guardada correctamente');
    }

    /**
     * Muestra una identidad de marca específica.
     */
    public function show(BrandIdentity $brandIdentity)
    {
        $this->authorize('view', $brandIdentity);

        return response()->json($brandIdentity);
    }

    /**
     * Actualiza una identidad de marca.
     */
    public function update(Request $request, BrandIdentity $brandIdentity)
    {
        $validated = $request->validate([
            'id' => 'required',
            'company_identity' => 'string',
            'mission_vision' => 'string',
            'products_services' => 'string',
            'company_history' => 'string',
            'facebook.tone' => 'nullable|string',
            'facebook.guidelines' => 'nullable|string',
            'facebook.audience' => 'nullable|string',
            'instagram.tone' => 'nullable|string',
            'instagram.guidelines' => 'nullable|string',
            'instagram.audience' => 'nullable|string',
            'x.tone' => 'nullable|string',
            'x.guidelines' => 'nullable|string',
            'x.audience' => 'nullable|string',
        ]);
                    // Combinar las directrices en un solo JSON
                    $guidelines_json = [
                        'facebook' => $validated['facebook'] ?? [],
                        'instagram' => $validated['instagram'] ?? [],
                        'x' => $validated['x'] ?? [],
                    ];
                
                    $brandIdentity->company_identity = $validated['company_identity'] ?? null;
                    $brandIdentity->mission_vision = $validated['mission_vision'] ?? null;
                    $brandIdentity->products_services = $validated['products_services'] ?? null;
                    $brandIdentity->company_history = $validated['company_history'] ?? null;
                    $brandIdentity->guidelines_json = $guidelines_json;
                    $brandIdentity->save();
        return back()->with('success', 'Identidad de marca actualizada correctamente');
    }

    /**
     * Elimina una identidad de marca.
     */
    public function destroy(BrandIdentity $brandIdentity)
    {
        $this->authorize('delete', $brandIdentity);

        $brandIdentity->delete();

        return response()->json(['message' => 'Eliminado correctamente']);
    }
}
