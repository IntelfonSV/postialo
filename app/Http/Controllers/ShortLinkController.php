<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShortLink;

class ShortLinkController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(['url' => 'required|url']);

        $code = ShortLink::generateCode();
        $link = ShortLink::create([
            'code' => $code,
            'original_url' => $request->url,
            'user_id' => auth()->id(),
        ]);

        return response()->json([
            'short_url' => url("/s/{$link->code}")
        ]);
    }

    public function redirect($code)
    {
        $link = ShortLink::where('code', $code)->firstOrFail();
        return redirect()->away($link->original_url);
    }

}
