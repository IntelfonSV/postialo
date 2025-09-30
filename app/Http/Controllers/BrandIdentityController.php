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
        $brandIdentity = BrandIdentity::where('user_id', Auth::id())
        ->with('logos')
        ->first();
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
            'website' => 'nullable|string',
            'whatsapp_number' => 'nullable|string',
            'facebook_page_id' => 'required|string',
            'instagram_account_id' => 'string',
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
            'website' => 'nullable|string',
            'whatsapp_number' => 'nullable|string',
            'facebook_page_id' => 'nullable|string',
            'instagram_account_id' => 'nullable|string',
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
        $brandIdentity->website = $validated['website'] ?? null;
        $brandIdentity->whatsapp_number = $validated['whatsapp_number'] ?? null;
        $brandIdentity->facebook_page_id = $validated['facebook_page_id'] ?? null;
        $brandIdentity->instagram_account_id = $validated['instagram_account_id'] ?? null;
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


    public function persistBrandIdentityFromEvaluation(array $r, ?int $userId = null)
    {
        try {
            $nv = function ($v) {
                if (is_null($v)) return null;
                if (is_string($v)) {
                    $t = trim($v);
                    return ($t === '' || strtolower($t) === 'null') ? null : $t;
                }
                return $v;
            };

            $identity = BrandIdentity::where('user_id', $userId)->first();
            if (!$identity) {
                $identity = new BrandIdentity();
            }

            // OBLIGATORIO: asignar user_id real (NO auth() en webhook)
            $identity->user_id = $userId;
            // $identity->user_id = auth()->id();

            if (is_null($identity->user_id)) {
                \Log::error('persistBrandIdentity: user_id es NULL (columna NOT NULL)', [
                    'hint' => 'Pasa (int)$user_id desde evaluateCall',
                    'payload_user_id' => $r['__user_id'] ?? null,
                ]);
                return null;
            }

            $identity->company_identity = $nv($r['identity'] ?? null);
            $identity->company_history  = $nv($r['historia'] ?? null);

            $mission = $nv($r['mision'] ?? null);
            $vision  = $nv($r['vision'] ?? null);
            $identity->mission_vision = ($mission !== null || $vision !== null)
                ? json_encode(['mision' => $mission, 'vision' => $vision], JSON_UNESCAPED_UNICODE)
                : null;

            $productos = $nv($r['productos'] ?? null);
            $servicios = $nv($r['servicios'] ?? null);
            $identity->products_services = (($productos !== null) ? "Productos: ".$productos : "") . "\n" . (($servicios !== null) ? "Servicios: ".$servicios : "");
            

            $fb = $r['lineamientos_facebook']  ?? [];
            $ig = $r['lineamientos_instagram'] ?? [];
            $tw = $r['lineamientos_twitter']   ?? [];

            $guidelines = [
                'facebook' => [
                    'tone'       => $nv($fb['tono'] ?? null),
                    'guidelines' => $nv($fb['guia_estilo'] ?? null),
                    'audience'   => $nv($fb['publico'] ?? null),
                ],
                'instagram' => [
                    'tone'       => $nv($ig['tono'] ?? null),
                    'guidelines' => $nv($ig['guia_estilo'] ?? null),
                    'audience'   => $nv($ig['publico'] ?? null),
                ],
                'x' => [
                    'tone'       => $nv($tw['tono'] ?? null),
                    'guidelines' => $nv($tw['guia_estilo'] ?? null),
                    'audience'   => $nv($tw['publico'] ?? null),
                ],
            ];
            $identity->guidelines_json = json_encode($guidelines, JSON_UNESCAPED_UNICODE);

            $identity->save();

            \Log::info('BrandIdentity guardada', ['id' => $identity->id, 'user_id' => $identity->user_id]);
            return $identity;
        } catch (\Throwable $e) {
            \Log::error(sprintf('[%s] %s in %s:%d', get_class($e), $e->getMessage(), $e->getFile(), $e->getLine()));
            return null;
        }
    }


}
