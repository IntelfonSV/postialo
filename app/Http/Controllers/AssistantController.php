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

    public function generateContentWithChat(string $user_prompt, string $system_prompt, string $model = 'gpt-4o-mini')
    {
        // $prompt = $request->input('user_prompt') ?? ($request['user_prompt'] ?? '');

        if ($user_prompt === '') {
            abort(400, 'Falta user_prompt');
        }

        $client = OpenAI::client(env('OPENAI_API_KEY'));

        $response = $client->chat()->create([
            'model' => $model,
            'messages' => [
                ['role' => 'system', 'content' => $system_prompt],
                ['role' => 'user', 'content' => $user_prompt],
            ],
            'temperature' => 0.7,
        ]);

        return $response->choices[0]->message->content ?? '';
    }

}
