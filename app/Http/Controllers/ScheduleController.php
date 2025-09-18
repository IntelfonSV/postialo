<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Template;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ScheduledPost;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\ScheduleImage;
use App\Models\ScheduledPostText;
use App\Models\User;
use Illuminate\Support\Facades\Http;
class ScheduleController extends Controller

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
            $templates = Template::all();
            $schedules = Schedule::with('user')->get();
            $months =  Schedule::select('month', 'year')->distinct()->orderBy('year', 'desc')->orderBy('month', 'desc')->get();
        }else{
            $templates = Template::where('user_id', $user->id)->get();
            $schedules = Schedule::where('user_id', $user->id)->orderBy('id', 'asc')->get();
            $months =  Schedule::where('user_id', $user->id)->select('month', 'year')->distinct()->orderBy('year', 'desc')->orderBy('month', 'desc')->get();
        }
        return Inertia::render('Schedules/Index', [
            'schedules' => $schedules,
            'templates' => $templates,
            'months' => $months,
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
    public function store(Request $request){
        $user = auth()->user();
        if(!$user->hasRole('admin')){
            $request->merge([
                'user_id' => $user->id,
            ]);
        }
        else{
            $request->validate([
                'user_id' => 'required|exists:users,id',
            ]);
        }

        $request->validate([
            'month' => 'required|numeric',
            'year' => 'required|numeric',
            'idea' => 'required',
            'objective' => 'required',
            'prompt_image' => 'required',
            'networks' => 'required|array',
            'template_id' => 'nullable|exists:templates,id',
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
            'schedules' => 'nullable|array',
        ]);

        $user = auth()->user();
        if($request->schedules && $user->hasRole('admin')){
            $schedules = Schedule::whereIn('id', $request->schedules)->where('status', 'pending')->get();
        }else{
            $schedules = Schedule::where('user_id', $user->id)->where('month', $request->month)->where('year', $request->year)->where('status', 'pending')->get();
        }

        $imageController = new GenerateImageController();
        $assistant = new AssistantController();
        try{
        foreach ($schedules as $schedule) {

            if($schedule->image){
                Storage::disk('public')->delete($schedule->image);
            }

            $response = $imageController->generateImage($schedule->prompt_image);

            if($response['status'] === 'success'){
                $scheduleImage = ScheduleImage::create([
                    'schedule_id' => $schedule->id,
                    'image_path' => $response['image'],
                ]);

                $schedule->update([
                    'selected_image_id' => $scheduleImage->id,
                ]);
            }else{
                return back()->with('error', $response['message']);
            }   

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
                    'network' => $network,
                    'scheduled_date' => $schedule->scheduled_date,
                    ]);
    
                    $scheduled_post_text = ScheduledPostText::create([
                        'scheduled_post_id' => $scheduled_post->id,
                        'content' => $post[$network],
                    ]);

                    $scheduled_post->update([
                        'selected_text_id' => $scheduled_post_text->id,
                    ]);
            }
           $schedule->update([
            'status' => 'generated',
        ]);
        }
        }catch(Exception $e){
            return back()->with('error', 'Error al generar las publicaciones es probable que no se hayan generado todas las publicaciones');
        }
        return back()->with('success', 'Publicaciones generadas exitosamente');
    }

    public function regenerateImage(Request $request, Schedule $schedule){
        $count = $schedule->images()->count();
        if($count >= 3){
            return back()->with('error', 'No se puede generar más de 3 imágenes');
        }
        $request->validate([
            'prompt_image' => 'required',
        ]);
        $imageController = new GenerateImageController();
        $response = $imageController->generateImage($request->prompt_image);

        if($response['status'] == 'error'){
            return back()->with('error', $response['message']);
        }

        // if($schedule->image){
        //     Storage::disk('public')->delete($schedule->image);
        // }
        $scheduleImage = ScheduleImage::create([
            'schedule_id' => $schedule->id,
            'image_path' => $response['image'],
        ]);
        $schedule->update([
            'prompt_image' => $request->prompt_image,
            'selected_image_id' => $scheduleImage->id,
        ]);
        return back()->with('success', 'Imagen regenerada exitosamente');
    }
    
    public function updateTemplate(Request $request, Schedule $schedule){
        $request->validate([
            'template_id' => 'nullable|exists:templates,id',
        ]);
        if($request->template_id == null){
            $schedule->update([
                'template_id' => null,
            ]);
        }  else {

            $schedule->update([
                'template_id' => $request->template_id,
            ]);
        } 
        return back()->with('success', 'Plantilla actualizada exitosamente');
    }

    public function updateImage(Request $request, Schedule $schedule){
        $request->validate([
            'image_id' => 'required|exists:schedule_images,id',
        ]);
        $schedule->update([
            'selected_image_id' => $request->image_id,
        ]);
        return back()->with('success', 'Imagen actualizada exitosamente');
    }

    public function approveTexts(Request $request, Schedule $schedule){
        $schedule->posts()->update([
            'status' => 'approved',
        ]);
        if($schedule->selectedImage()->first()->is_approved && $schedule->posts()->where('status', 'approved')->count() === $schedule->posts()->count()){
            $schedule->update([
                'status' => 'approved',
            ]);
        }
        return back()->with('success', 'Textos aprobados exitosamente');
    }

    public function approveImage(Request $request, Schedule $schedule){
        $imageController = new GenerateImageController();
        try {
            if($schedule->template){
            $image = $imageController->generateImageFromHtml($schedule);
            $schedule->selectedImage()->update([
                'is_approved' => true,
                'generated_image_path' => $image,
            ]);}
            else{
                $schedule->selectedImage()->update([
                    'is_approved' => true,
                    'generated_image_path' => $schedule->selectedImage()->first()->image_path,
                ]);
            }



            if($schedule->posts()->where('status', 'approved')->count() === $schedule->posts()->count()){
                $schedule->update([
                    'status' => 'approved',
                ]);
            }
            return back()->with('success', 'Imagen aprobada exitosamente');
        } catch (\Throwable $th) {
            return back()->with('error', 'Error al generar la imagen');
        }
    }

    public function getSchedules(User $user){
        $schedules = Schedule::where('user_id', $user->id)->where('status', 'approved')->orderBy('id', 'desc')->with('posts.selectedText')->with('selectedImage')->get();
        return response()->json($schedules);
    }

    public function sendSchedules(){
        $user = auth()->user();
        $schedules = Schedule::where('user_id', $user->id)
        ->where('status', 'approved')
        ->orderBy('id', 'desc')
        ->with('posts.selectedText')
        ->with('selectedImage')
        ->get();
    
        // URL del webhook
        $webhook = "https://hook.eu2.make.com/u0oocwzbxukbkg37phfjviyrblvzh7lx";
        
        // Enviar como JSON
        $response = Http::post($webhook, [
            'schedules' => $schedules->toArray()
        ]);
        
        return back()->with('success', 'Posts enviados exitosamente');

    }

    public function cancelSchedule(Schedule $schedule){
        $schedule->update([
            'status' => 'cancelled',
        ]);
        return back()->with('success', 'Publicación cancelada exitosamente');
    }

}