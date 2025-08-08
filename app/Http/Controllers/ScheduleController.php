<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Template;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ScheduledPost;
use Illuminate\Support\Facades\Storage;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $schedules = Schedule::where('user_id', $user->id)->get();
        $templates = Template::where('user_id', $user->id)->get();
        return Inertia::render('Schedules/Index', [
            'schedules' => $schedules,
            'templates' => $templates,
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
    public function store(Request $request){
        $user = auth()->user();
        $request->merge([
            'user_id' => $user->id,
        ]);
        $request->validate([
            'month' => 'required|numeric',
            'year' => 'required|numeric',
            'idea' => 'required',
            'objective' => 'required',
            'prompt_image' => 'required',
            'networks' => 'required|array',
            'template_id' => 'required|exists:templates,id',
            'scheduled_date' => 'required|date|after_or_equal:today',
        ]);

        //return json_encode($request->all());
        $schedule = Schedule::create($request->all());
        return back()->with('success', 'Publicación creada exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Schedule $schedule)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Schedule $schedule)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Schedule $schedule)
    {
        $request->validate([
            'idea' => 'required',
            'objective' => 'required',
            'prompt_image' => 'required',
            'networks' => 'required|array',
            'template_id' => 'required|exists:templates,id',
            'scheduled_date' => 'required|date|after_or_equal:today',
        ]);

        $schedule->update($request->all());
        return back()->with('success', 'Publicación editada exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Schedule $schedule)
    {
        //eliminar la imagen de la publicación
        if($schedule->image){
            Storage::disk('public')->delete($schedule->image);
        }
        $schedule->delete();
        return back()->with('success', 'Publicación eliminada exitosamente');
    }


    public function generatePosts(Request $request){
        $request->validate([
            'month' => 'required|numeric',
            'year' => 'required|numeric',
        ]);

        $user = auth()->user();
        $schedules = Schedule::where('user_id', $user->id)->where('month', $request->month)->where('year', $request->year)->get();
        $freepik = new FreepikController();
        foreach ($schedules as $schedule) {

            $data = $freepik->generateImage($schedule->prompt_image);
            $schedule->update([
                'task_id' => $data['task_id'],
            ]);

           foreach ($schedule->networks as $network) {
               $scheduled_post = ScheduledPost::create([
                'schedule_id' => $schedule->id,
                'content' => "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                'network' => $network,
                'scheduled_date' => $schedule->scheduled_date,
            ]);
           }
           $schedule->update([
            'status' => 'in_progress',
        ]);
        }
        return back()->with('success', 'Publicaciones generadas exitosamente');
    }
}
