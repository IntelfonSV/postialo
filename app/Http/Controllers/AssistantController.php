<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI;

class AssistantController extends Controller
{
    public function generateContent($request)
    {
    $client = OpenAI::client(env('OPENAI_API_KEY'));
    $response = $client->responses()->create([
        'model' => 'gpt-4o-mini',
        'input' => [
            ['role' => 'user', 'content' => $request['user_prompt']], 
            ['role' => 'system', 'content' => $request['system_prompt']],
        ],
    ]);
    $respuesta = $response['output'][0]['content'][0]['text'] ?? null;
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
