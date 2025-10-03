<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\BrandIdentity;
use App\Models\Demo;

class DemoController extends Controller
{
    public function index()
    {
        return Inertia::render('Demo/Index');
    }

    public function store(Request $request)
    {
        
    }

    public function guide()
    {
        return Inertia::render('Demos/Guide');
    }

    public function destroy($id)
    {
        
    }


    public function activateDemo(Request $request)
    {

        $request->validate([
            'facebook_page_id' => 'required|string',
            'instagram_account_id' => 'required|string',
        ]);

        BrandIdentity::create([
            'user_id' => auth()->id(),
            'facebook_page_id' => $request->facebook_page_id,
            'instagram_account_id' => $request->instagram_account_id,
        ]); 

        Demo::create([
            'user_id' => auth()->id(),
            'valid_until' => now()->addDays(30),
        ]);

        return redirect()->route('brand-identities.index');
    }

    public function update(Request $request, $id)
    {
        
    }

    public function show($id)
    {
        
    }

}
