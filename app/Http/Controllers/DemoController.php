<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\BrandIdentity;
use App\Models\Demo;
use App\Models\Partner;

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

    public function partnerGuide()
    {
        return Inertia::render('Demos/PartnerGuide');
    }

    public function destroy($id)
    {
        
    }


    // public function activateDemo(Request $request)
    // {

    //     $request->validate([
    //         'facebook_page_id' => 'required|string',
    //         'instagram_account_id' => 'required|string',
    //     ]);


    //     if(request()->has('partner_id')) {
    //         $user = User::where('id', auth()->id())->first();
    //         $user->partner_id = $request->partner_id;
    //         $partner = Partner::where('id', $request->partner_id)->first();
    //         $branding = json_decode($partner->branding);
    //         $user->save();
    //         $user->brand_identity()->update([
    //             'facebook_page_id' => $request->facebook_page_id,
    //             'instagram_account_id' => $request->instagram_account_id,
    //             'website'=> $branding->url,
    //             'whatsapp_number' => $branding->whatsapp
    //         ]);
    //     }else{       
    //         BrandIdentity::create([
    //             'user_id' => auth()->id(),
    //             'facebook_page_id' => $request->facebook_page_id,
    //         'instagram_account_id' => $request->instagram_account_id,
    //     ]); 
    // }

    //     Demo::create([
    //         'user_id' => auth()->id(),
    //         'valid_until' => now()->addDays(30),
    //     ]);

    //     return redirect()->route('brand-identities.index');
    // }
  public function activateDemo(Request $request)
    {
        $request->validate([
            'facebook_page_id' => 'required|string',
            'instagram_account_id' => 'required|string',
            'partner_id' => 'nullable|integer|exists:partners,id',
        ]);

        $user = auth()->user();

        // Si hay partner, actualiza con datos del branding
        if ($request->filled('partner_id')) {

            $user->partner_id = $request->partner_id;
            $user->save();

            $partner = Partner::find($request->partner_id);
            $branding = $partner->branding ?? [];  
            BrandIdentity::create([
                'user_id'               => $user->id,
                'facebook_page_id'      => $request->facebook_page_id,
                'instagram_account_id'  => $request->instagram_account_id,
                'website'               => $branding['url'] ?? null,
                'whatsapp_number'       => $branding['whatsapp'] ?? null,
            ]);
        } 
        // Si no hay partner, crea una BrandIdentity básica
        else {
            BrandIdentity::create([
                'user_id'               => $user->id,
                'facebook_page_id'      => $request->facebook_page_id,
                'instagram_account_id'  => $request->instagram_account_id,
            ]);
        }

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
