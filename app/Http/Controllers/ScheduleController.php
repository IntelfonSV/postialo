<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Template;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ScheduledPost;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

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
        $months =  Schedule::select('month', 'year')->distinct()->orderBy('year', 'desc')->orderBy('month', 'desc')->get();
        return Inertia::render('Schedules/Index', [
            'schedules' => $schedules,
            'templates' => $templates,
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
        $assistant = new AssistantController();
        foreach ($schedules as $schedule) {

            $data = $freepik->generateImage($schedule->prompt_image);
            $schedule->update([
                'task_id' => $data['task_id'],
            ]);

            $social_networks = json_encode($schedule->networks);
            $user_prompt = "Genera un copy por cada red social indicada usando:
            Tema: {$schedule->idea}
            Redes Sociales: {$social_networks}
            Objetivo: {$schedule->objective}
            Reglas:
            Salida: JSON por cada red social, solo con el texto de la publicación.
            Sin formato Markdown ni backticks.
            Para Twitter: máximo 250 caracteres.
            **Responde en formato json para cada red social**
            de esta manera:
            
            {
                \"facebook\": \"publicación para facebook\",
                \"instagram\": \"publicación para instagram\",
                \"x\": \"publicación para x\"
            }";

            $response = $assistant->generateContent([
                'user_prompt' => $user_prompt,
            ]);

            $post = json_decode($response, true);

           foreach ($schedule->networks as $network) {

               $scheduled_post = ScheduledPost::create([
                'schedule_id' => $schedule->id,
                'content' => $post[$network],
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

    public function regenerateImage(Request $request, Schedule $schedule){
        $request->validate([
            'image' => 'required',
            'prompt_image' => 'required',
        ]);

        $freepik = new FreepikController();
        $data = $freepik->generateImage($request->prompt_image);

        if($data['status'] == 'error'){
            return back()->with('error', 'Error al generar la imagen');
        }
    
        $schedule->update([
            'prompt_image' => $request->prompt_image,
            'task_id' => $data['task_id'],
        ]);

        sleep(10);

        return back()->with('success', 'Imagen regenerada exitosamente');
    }
    
}
