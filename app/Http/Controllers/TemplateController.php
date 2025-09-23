<?php

namespace App\Http\Controllers;

use App\Models\Template;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        if($user->hasRole('admin')) {
            $users = User::all();
            $templates = Template::orderBy('id', 'asc')->get();
        }else{
           //$templates = Template::where('user_id', $user->id)->orderBy('id', 'asc')->get();
           $templates = Template::orderBy('id', 'asc')->get();
        }
        return Inertia::render('Templates/Index', [
            'templates' => $templates,
            'users' => $users ?? null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'html_code' => 'nullable|string',
        ]);
        $user = auth()->user();
        if($user->hasRole('admin') || $user->id == $request->user_id) {

        $template = Template::create($validated);
        return back()->with("success", "Plantilla creada correctamente");}
        return back()->with("error", "No tienes permiso para crear plantillas para este usuario");
    }

    /**
     * Display the specified resource.
     */
    public function show(Template $template)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Template $template)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Template $template)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'html_code' => 'nullable|string'
        ]);

        $template->update($validated);
        return back()->with("success", "Plantilla actualizada correctamente");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Template $template)
    {
        $template->delete();
        return back()->with("success", "Plantilla eliminada correctamente");
    }
}
