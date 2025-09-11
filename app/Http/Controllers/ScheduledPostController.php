<?php

namespace App\Http\Controllers;

use App\Models\ScheduledPost;
use App\Models\Schedule;
use App\Models\Template;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use App\Http\Controllers\AssistantController;
use App\Models\ScheduledPostText;

class ScheduledPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $user->load('roles');
        if($user->hasRole('admin')){
            $users = User::all();
            $posts = Schedule::whereIn('status', ['generated', 'approved', 'published'])
            ->with(['posts' => function ($q) {
                $q->with('selectedText')->with('texts')->orderBy('network', 'asc');
            }])->with('template')->with('selectedImage')->with('images')
            ->with('user')->orderBy('id', 'asc')->get();
        }else{
            $posts = Schedule::where('user_id', $user->id)->whereIn('status', ['generated', 'approved', 'published'])
            ->with(['posts' => function ($q) {
                $q->with('selectedText')->with('texts')->orderBy('network', 'asc');
            }])->with('template')->with('selectedImage')->with('images')->orderBy('id', 'asc')
            ->get();
        }

        $months =  Schedule::select('month', 'year')->distinct()->orderBy('year', 'desc')->orderBy('month', 'desc')->get();


        $templates = Template::where('user_id', $user->id)->get();
        return Inertia::render('ScheduledPosts/Index', [
            'scheduledPosts' => $posts,
            'months' => $months,
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ScheduledPost $scheduledPost)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ScheduledPost $scheduledPost)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ScheduledPost $scheduledPost)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $scheduledPost->update($request->all());

        return back()->with('success', 'Publicación actualizada exitosamente');
    }


    public function updateStatus(Request $request, ScheduledPost $scheduledPost)
    {
        $request->validate([
            'status' => 'required|string',
        ]);

        $scheduledPost->update([    
            'status' => $request->input('status'),
        ]);

        return back()->with('success', 'Publicación actualizada exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ScheduledPost $scheduledPost)
    {
        //
    }

    /**
     * Regenerate the specified resource in storage.
     */
    public function regenerate(Request $request, ScheduledPost $scheduledPost)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $scheduledPost->update([
            'content' => $request->input('content'),
            'status' => 'draft',
        ]);

        return redirect()->route('scheduled-posts.index');
    }


    public function regenerateText(Request $request, ScheduledPost $scheduledPost){
        $count = $scheduledPost->texts()->count();
        if($count >= 3){
            return back()->with('error', 'No se puede generar más de 3 textos');
        }
        $user_prompt = "Modifica el copy de la publicación:
        copy original: {$request->content}
        Objetivo: {$request->objective}
        cambios: {$request->changes}
        red social: {$request->network}
        Reglas:
        generame el copy para la red social indicada. y no lo retornes en json  solo el copy.
        Sin formato Markdown ni backticks.
        Para Twitter: máximo 250 caracteres.";

        $assistant = new AssistantController();
        $response = $assistant->generateContent([
            'user_prompt' => $user_prompt,
        ]);

        $scheduledPostText = ScheduledPostText::create([
            'scheduled_post_id' => $scheduledPost->id,
            'content' => $response,
        ]);

        $scheduledPost->update([
            'selected_text_id' => $scheduledPostText->id,
        ]);
        return back()->with('success', 'Publicación actualizada exitosamente');
    }

    public function updateText(Request $request, ScheduledPost $scheduledPost){
        $request->validate([
            'text_id' => 'required|exists:scheduled_post_texts,id',
        ]);
        $scheduledPost->update([
            'selected_text_id' => $request->text_id,
        ]);
        return back()->with('success', 'Publicación actualizada exitosamente');
    }
}
