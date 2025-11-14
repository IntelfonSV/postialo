<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Partner;

class PartnerController extends Controller
{
    //
    public function validatePartnerCode(Request $request)
    {
        $request->validate([
            'partner_code' => 'required|string|max:50',
        ]);

        $partner = Partner::where('code', strtoupper($request->partner_code))
            ->where('active', true)
            ->first();

        if (!$partner) {
            return response()->json([
                'success' => false,
                'message' => 'Código de alianza no encontrado o inactivo.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Código de alianza válido.',
            'partner' => $partner,
        ], 200);
    }
}
