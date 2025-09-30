<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Logo;
use Illuminate\Support\Str;
class LogoController extends Controller
{
    //
    public function store(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);
        $logo = $request->file('logo');

        $originalName = pathinfo($logo->getClientOriginalName(), PATHINFO_FILENAME);
        $extension    = $logo->getClientOriginalExtension();
        $fileName = Str::slug($originalName) . '.' . $extension;
        
        $path = $logo->storeAs('logos', $fileName, 'public');  // <- recomendado

        $user = auth()->user();
        $brandIdentityId = $user->brandIdentity->id;
        
        $record = Logo::create([
            'brand_identity_id' => $brandIdentityId,
            'image' => $path, // guarda "logos/archivo.png"
        ]);

        return back()->with('success', 'Logo guardado correctamente');
    }


    public function destroy($id)
    {
        $logo = Logo::findOrFail($id);
        Storage::disk('public')->delete($logo->image);
        $logo->delete();
        return back()->with('success', 'Logo eliminado correctamente');
    }
}
