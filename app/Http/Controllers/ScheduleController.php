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
use App\Models\BrandIdentity;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Models\ShortLink;
use Illuminate\Support\Str;

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
            $schedules = Schedule::with('selectedImage')->with('user')->orderBy('id', 'asc')->get();
            $months =  Schedule::select('month', 'year')->distinct()->orderBy('year', 'desc')->orderBy('month', 'desc')->get();
        }else{
            //$templates = Template::where('user_id', $user->id)->get();
            $templates = Template::orderBy('id', 'asc')->get();
            $schedules = Schedule::where('user_id', $user->id)->with('selectedImage')->orderBy('id', 'asc')->get();
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
            'image_source' => 'required|in:generated,uploaded,api',
        ]);


        //validate if image_source is generated
        switch ($request->image_source) {
            case 'generated':
                $request->validate([
                    'prompt_image' => 'required',
                    'month' => 'required|numeric',
                    'year' => 'required|numeric',
                    'idea' => 'required',
                    'objective' => 'required',
                    'networks' => 'required|array',
                    'template_id' => 'nullable|exists:templates,id',
                    'property_id' => 'nullable',
                    'scheduled_date' => 'required|date_format:Y-m-d\TH:i|after_or_equal:today',
                    ]);
        break;
        case 'uploaded':
              $request->validate([
                'month' => 'required|numeric',
                'year' => 'required|numeric',
                'idea' => 'required',
                'objective' => 'required',
                'networks' => 'required|array',
                'template_id' => 'nullable|exists:templates,id',
                'property_id' => 'nullable',
                'scheduled_date' => 'required|date_format:Y-m-d\TH:i|after_or_equal:today',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            ]);
        break;
        case 'api':
            $request->validate([
                'month' => 'required|numeric',
                'year' => 'required|numeric',
                'idea' => 'required',
                'objective' => 'required',
                'networks' => 'required|array',
                'template_id' => 'nullable|exists:templates,id',
                'property_id' => 'nullable',
                'scheduled_date' => 'required|date_format:Y-m-d\TH:i|after_or_equal:today',
                'image' => 'required',
            ]);
        }

        $scheduledDateUtc = \Carbon\Carbon::createFromFormat(
            'Y-m-d\TH:i',
            $request->scheduled_date,
            config('app.timezone') // ejemplo: 'America/El_Salvador'
        )->utc();

        //return json_encode($request->all());
        $schedule = Schedule::create($request->all());
        if($request->image_source == 'uploaded'){
            $image = $request->file('image');
            $originalName = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
            $extension    = $image->getClientOriginalExtension();
            
            $fileName = Str::slug($originalName) . '_' . Carbon::now()->timestamp . '.' . $extension;
            $path = $image->storeAs('images', $fileName, 'public');  // <- recomendado

            $scheduleImage = ScheduleImage::create([
                'schedule_id' => $schedule->id,
                'image_source' => 'uploaded',
                'image_path' => $path,
            ]);
            $schedule->update([
                'selected_image_id' => $scheduleImage->id,
            ]);
        }

        if($request->image_source == 'api') {
            $scheduleImage = ScheduleImage::create([
                'schedule_id' => $schedule->id,
                'image_source' => 'api',
                'image_path' => $request->image,
            ]);
            $schedule->update([
                'selected_image_id' => $scheduleImage->id,
            ]);
        } 
        //retorna a index
        return redirect()->route('schedules.index')->with('success', 'Publicación creada exitosamente');
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
        //dd($request->all());  
        $request->validate([
                'image_source' => 'required|in:generated,uploaded',
            ]);

        //validate
        if($request->image_source == 'generated') {        
            $request->validate([
            'prompt_image' => 'required',
            'image_source' => 'required|in:generated,uploaded',
            'month' => 'required|numeric',
            'year' => 'required|numeric',
            'idea' => 'required',
            'objective' => 'required',
            'networks' => 'required|array',
            'template_id' => 'nullable|exists:templates,id',
            'property_id' => 'nullable',
            'scheduled_date' => 'required|date_format:Y-m-d\TH:i|after_or_equal:today',
            ]);
        }elseif($request->image_source == 'uploaded') {
            $request->validate([
                'month' => 'required|numeric',
                'year' => 'required|numeric',
                'idea' => 'required',
                'objective' => 'required',
                'networks' => 'required|array',
                'template_id' => 'nullable|exists:templates,id',
                'property_id' => 'nullable',
                'scheduled_date' => 'required|date_format:Y-m-d\TH:i|after_or_equal:today',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            ]);
        } 

        
        $current_image_source = $schedule->image_source;
        $schedule->update($request->all());
        if($request->image_source == 'uploaded'){
            $image = $request->file('image');
            $originalName = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
            $extension    = $image->getClientOriginalExtension();
            
            $fileName = Str::slug($originalName) . '_' . Carbon::now()->timestamp . '.' . $extension;
            $path = $image->storeAs('images', $fileName, 'public');  // <- recomendado

            if($schedule->selected_image_id){

                $scheduleImage = ScheduleImage::where('id', $schedule->selected_image_id)->first();
                //dd($scheduleImage);
                Storage::disk('public')->delete($scheduleImage->image_path);
                $scheduleImage->update([
                    'image_path' => $path,
                ]);
            }else{
                $scheduleImage = ScheduleImage::create([
                    'schedule_id' => $schedule->id,
                    'image_source' => 'uploaded',
                    'image_path' => $path,
                ]);
                $schedule->update([
                    'selected_image_id' => $scheduleImage->id,
                ]);
            }
        }elseif($request->image_source == 'generated' && $current_image_source == 'uploaded'){
            $scheduleImage = ScheduleImage::where('id', $schedule->selected_image_id)->first();
            //dd($scheduleImage);
            Storage::disk('public')->delete($scheduleImage->image_path);
            $schedule->update([
                'selected_image_id' => null,
            ]);
            $scheduleImage->delete();
        }
        
        return back()->with('success', 'Publicación actualizada exitosamente');
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

    public function uploadImage(Request $request, Schedule $schedule){
        $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        $image = $request->file('image');
        $originalName = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
        $extension    = $image->getClientOriginalExtension();
        
        $fileName = Str::slug($originalName) . '_' . Carbon::now()->timestamp . '.' . $extension;
        $path = $image->storeAs('images', $fileName, 'public');  // <- recomendado

        $scheduleImage = ScheduleImage::create([
            'schedule_id' => $schedule->id,
                'image_source' => 'uploaded',
                'image_path' => $path,
            ]);
            $schedule->update([
                'selected_image_id' => $scheduleImage->id,
            ]);
        return back()->with('success', 'Imagen cargada exitosamente');
    }   

        public function editImage(Request $request, Schedule $schedule){
        $imageController = new GenerateImageController();
        $request->validate([
            'prompt' => 'required',
        ]);
        $response = $imageController->generateWithNanoBanana($schedule->selectedImage,  $request->prompt);
        if($response['ok']){

            $schedule_image = $schedule->images()->create([
                'image_path' => $response['file'],
                'image_source' => 'generated',
            ]);
            $schedule->update([
                'image_source' => 'generated',
                'selected_image_id' => $schedule_image->id,
            ]);
            
            return back()->with('success', 'Imagen editada exitosamente');
        }else{
            return back()->with('error', $response['error']);
        }
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

        $brandIdentity = BrandIdentity::where('user_id', $user->id)->first();
        if (!$brandIdentity) {
            return back()->with('error', 'No se ha completado la informacion de identidad de marca para el usuario');
        }

        $imageController = new GenerateImageController();
        $assistant = new AssistantController();
        try{
        foreach ($schedules as $schedule) {

            if($schedule->image_source == 'generated'){
                    
                    if($schedule->image){
                        Storage::disk('public')->delete($schedule->image);
                }
                
                $response = $imageController->generateImage($schedule->prompt_image);   

                if($response['status'] === 'success'){
                    $scheduleImage = ScheduleImage::create([
                        'schedule_id' => $schedule->id,
                        'image_source' => 'generated',
                        'image_path' => $response['image'],
                    ]);

                    $schedule->update([
                        'selected_image_id' => $scheduleImage->id,
                    ]);
                }else{
                    return back()->with('error', $response['message']);
                }   
            }

            
            
            $website = $brandIdentity->website ?? null;
            $whatsapp = $brandIdentity->whatsapp_number ?? null;
            $wa_base_url = $whatsapp ? "https://wa.me/" . preg_replace('/\D/', '', $whatsapp) : null;
            $closing = "";
            if ($website) {
                $closing .= "✨ Visita nuestra página para descubrir más productos: {$website}\n\n";
            }
            if ($wa_base_url) {
                $closing .= "📲 Escríbenos por WhatsApp y te ayudamos con todo lo que necesites.\n👉*espacio*{$wa_base_url}\n" . 
                " también agregale mensaje prellenado para iniciar conversación en WhatsApp: por ejemplo  {$wa_base_url}?text=Hola%2C%20me%20interesa%20la%20Alexa%20Echo%20Dot%205ta%20generacion
                    - Mensaje máximo 10 palabras, tono claro y directo.
                    - Sin emojis, sin hashtags, sin comillas.
                    - Codifica la frase en URL  
                    - usa el tema y el objetivo para crear la frase
                ";
            }

            if($closing){
                $closing = "\n\n" . $closing;
            }else{
                $closing = "\n\n Escribir un cierre obligatorio incitando al usuario a que se ponga en contacto con nosotros";
            }
            
            $system_prompt = "Esta es la informacion de identidad de marca:
                company_identity: {$brandIdentity->company_identity}
                mission_vision: {$brandIdentity->mission_vision}
                products_services: {$brandIdentity->products_services}
                company_history: {$brandIdentity->company_history}
                lINEAMIENTOS PARA LAS REDES SOCIALES :
               
            " . json_encode($brandIdentity->guidelines_json) . "
            Cierre obligatorio:
            Antes del cierre obligatorio agrega 2 saltos de linea
            {$closing}";


            $social_networks = json_encode($schedule->networks);
            $user_prompt = "
            Sos un agente de copywriting para redes sociales (Facebook, Instagram, Twitter), adaptados a las características de cada plataforma.
            
            Genera un copy por cada red social indicada usando:
            Tema: {$schedule->idea}
            Redes Sociales: {$social_networks}
            Objetivo: {$schedule->objective}
            Reglas:
            1. Recibís instrucciones con tema, objetivo, red y formato.
            2.Redactás copies completos, claros, extensos y específicos. Nunca generales ni vagos.
            3.Solo generás los copies. No des introducción, explicación ni conclusión.
            Salida: JSON por cada red social, solo con el texto de la publicación.
            Sin formato Markdown ni backticks.
            Para Twitter: máximo 250 caracteres.
            Responde ÚNICAMENTE con un solo objeto JSON válido que contenga todas las redes sociales pedidas como claves.
            No devuelvas múltiples objetos. 
            No uses backticks, explicaciones ni texto fuera del JSON.
            ejemplo:
            {
                \"facebook\": \"publicación para facebook\",
                \"instagram\": \"publicación para instagram\",
                \"x\": \"publicación para x\"
            }
            ";



            $response = $assistant->generateContent([
                'user_prompt' => $user_prompt,
                'system_prompt' => $system_prompt,
            ]);


            //return response()->json($response);
            $post = json_decode($response, true);


           foreach ($schedule->networks as $network) {
            if (isset($post[$network])) {

                $scheduled_post = ScheduledPost::create([
                    'schedule_id' => $schedule->id,
                    'network' => $network,
                    'scheduled_date' => $schedule->scheduled_date,
                ]);

                $postText = $post[$network];
                preg_match('/https?:\/\/(?:www\.)?wa\.me\/[^\s]+/i',$postText,$matches);

                // Si encontramos un enlace válido
                // if (!empty($matches[0])) {
                //     $whatsappUrl = $matches[0];

                //     // 2️⃣ Generar código corto y guardar en base de datos
                //     $code = ShortLink::generateCode();

                //     $shortLink = ShortLink::create([
                //         'code'         => $code,
                //         'original_url' => $whatsappUrl,
                //         'user_id'      => auth()->id(),
                //     ]);

                //     $shortUrl = route('shortLink.redirect', ['code' => $shortLink->code]);
                //     $postText = str_replace($whatsappUrl, $shortUrl, $postText);
                // }
    
                    $scheduled_post_text = ScheduledPostText::create([
                        'scheduled_post_id' => $scheduled_post->id,
                        'content' => $postText,
                    ]);

                    $scheduled_post->update([
                        'selected_text_id' => $scheduled_post_text->id,
                    ]);
                }
            }
            //si se generaron todos cambiar el estado 
            // if($schedule->posts()->where('status', 'generated')->count() == count($schedule->networks)){
            //     $schedule->update([
            //         'status' => 'generated',
            //     ]);
            // }

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
        // try {
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
        // } catch (\Throwable $th) {
        // }
            return back()->with('error', 'Error al generar la imagen');
    }

    //quiza ya no se use 
    public function getSchedules(User $user){
        $schedules = Schedule::where('user_id', $user->id)->where('status', 'approved')->orderBy('id', 'desc')->with('posts.selectedText')->with('selectedImage')->get();
        return response()->json($schedules);
    }

    public function publishSchedules(){
       // return response()->json(["now" =>now()]);
        $schedules = Schedule::where('status', 'approved')
        ->where('scheduled_date', '<=', now())  //en utc sin localstring
        ->orderBy('id', 'desc')
        ->with(['posts' => function ($query) {
            $query->where('status', 'approved')->with('selectedText');
        }])
        ->with('user')
        ->with('selectedImage')
        ->get();

        if($schedules->isEmpty()) return response()->json(  [
            'message' => 'No hay publicaciones programadas',
        ]);

        foreach ($schedules as $schedule) {
            $webhook = $schedule->user->make_url;
            $webhook = "https://hook.eu2.make.com/4aw4r07qtlkfdqad97jtyd5vuv932hrb";
            $brandIdentity = BrandIdentity::where('user_id', $schedule->user_id)->first();
            $schedule->facebook_page_id = $brandIdentity->facebook_page_id;
            $schedule->instagram_account_id = $brandIdentity->instagram_account_id;
            $fecha_ddmmyyyy = Carbon::parse($schedule->scheduled_date)
            ->tz('America/El_Salvador')
            ->format('d/m/Y');
            $schedule->fecha = $fecha_ddmmyyyy;
            
            if($webhook){
                try{
                $response = Http::post($webhook, [
                    'schedule' => $schedule        
                ]);
                }catch(Exception $e){
                    return back()->with('error', 'Error al enviar la publicación');
                }
            }else{
                return back()->with('error', 'No se encontro el webhook de publicacion');
            }
        }
        
        return response()->json($schedules);

    }

    public function cancelSchedule(Schedule $schedule){
        $schedule->update([
            'status' => 'cancelled',
        ]);
        return back()->with('success', 'Publicación cancelada exitosamente');
    }

    public function sendSchedule(Schedule $schedule){
        $schedule->load([
            'posts'=> function($query){
                $query->where('status', 'approved')->with('selectedText');
            },
            'selectedImage',
            'user',
        ]); 
        $webhook = $schedule->user->make_url;
        $webhook = "https://hook.eu2.make.com/4aw4r07qtlkfdqad97jtyd5vuv932hrb";
        $brandIdentity = BrandIdentity::where('user_id', $schedule->user_id)->first();
        $schedule->facebook_page_id = $brandIdentity->facebook_page_id;
        $schedule->instagram_account_id = $brandIdentity->instagram_account_id;
        $fecha_ddmmyyyy = Carbon::parse($schedule->scheduled_date)
        ->tz('America/El_Salvador')
        ->format('d/m/Y');
        $schedule->fecha = $fecha_ddmmyyyy;
        if($webhook){
            try{
            $response = Http::post($webhook, [
                'schedule' => $schedule        
            ]);
            }catch(Exception $e){
                return back()->with('error', 'Error al enviar la publicación');
            }
        }else{
            return back()->with('error', 'No se encontro el webhook de publicacion');
        }

            return back()->with('success', 'Posts enviados exitosamente');
    }


}