<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ScheduledPostText;

class ScheduledPostTextController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ScheduledPostText $scheduled_post_text)
    {
        $scheduled_post_text->update($request->all());
        return back()->with('success', 'Publicación actualizada exitosamente');
    }

    public function updateContent(Request $request, ScheduledPostText $scheduled_post_text)
    {
        $request->validate([
            'content' => 'string',
        ]);
        $scheduled_post_text->update([
            'content' => $request->content,
        ]);
        return back()->with('success', 'Contenido actualizado exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
