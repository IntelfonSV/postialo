<?php

namespace App\Http\Controllers;

use App\Models\ScheduledPost;
use App\Models\Schedule;
use Illuminate\Http\Request;

use Inertia\Inertia;

class ScheduledPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $months =  Schedule::select('month', 'year')->distinct()->orderBy('year', 'desc')->orderBy('month', 'desc')->get();
        $posts = Schedule::where('user_id', $user->id)->with('posts')->get();
        return Inertia::render('ScheduledPosts/Index', [
            'scheduledPosts' => $posts,
            'months' => $months,
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
}
