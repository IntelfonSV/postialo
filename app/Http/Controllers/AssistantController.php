<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI;

class AssistantController extends Controller
{
    public function generateContent($request)
    {
        // Cliente de OpenAI
        $client = OpenAI::client(env('OPENAI_API_KEY'));

        // Llamada a ChatGPT
        $thread = $client->threads()->create();
        $client->threads()->messages()->create($thread['id'], [
            'role' => 'user',
            'content' => $request['user_prompt'],
        ]);

        $run = $client->threads()->runs()->create($thread['id'], [
            'model' => 'gpt-4o-mini',
            'assistant_id' => 'asst_TgAGC2Q6u7EoWesLZe8yeqQe',
        ]);
        
        // 4. Esperar que termine (polling)
        do {
            $runStatus = $client->threads()->runs()->retrieve($thread->id, $run->id);
            sleep(1);
        } while ($runStatus->status !== 'completed');

        // 5. Obtener mensajes
        $messages = $client->threads()->messages()->list($thread->id);

        // 6. Leer respuesta
        $respuesta = $messages->data[0]->content[0]->text->value;
        return $respuesta;
    }
}
