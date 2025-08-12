<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\AssistantController;
use App\Http\Controllers\BrandIdentityController;

class CallEvaluator extends Controller
{
    //Controlador que evalua el texto de la llamada para extraer los campos

    public function evaluateCall(string $text, string $user_name, string $user_id)
    {
        // $text = $request->input('text');
        // $system_prompt = $request->input('system_prompt', 'You are a helpful assistant.');
        // $model = $request->input('model', 'gpt-4o-mini');
        $model = 'gpt-4o-mini';

        $assistant = new AssistantController();
        $respuesta_final = [];

        //Identidad de la empresa
        $system_prompt = "
        <identity>
        You are a brand identity evaluator.
        </identity>

        <purpose>
        You will be given a text and you will evaluate it to extract the brand identity.
        </purpose>

        <guidelines>
        1 Si en la conversacion existe contexto para extraer la identidad de la empresa, extrae la identidad de la empresa.
        2 Si no existe contexto para extraer la identidad de la empresa, devuelve la propiedad identity con valor null
        3 respuesta en formato json         
        </guidelines>

        <output>
        1 no uses markdown, ni backstick en la respuesta, devuelve el json sin mas explicaciones
        Responde con un json con la siguiente estructura:
        {
            \"identity\": \"identidad de la empresa\" //puede ser null
        }
        </output>
        ";
        $response = $assistant->generateContentWithChat($text, $system_prompt, $model);
        // Convertir a array asociativo
        $diccionario_identidad = json_decode($response, true);
        $respuesta_final['identity'] = $diccionario_identidad['identity'];

        //mision y vision
        $system_prompt = "
        <identity>
        Tu eres un agente, que sintetisa informacion, de los usuarios.
        </identity>

        <purpose>
        Tienes que extraer la mision y vision de la empresa.
        </purpose>

        <guidelines>
        1 Extraer la vision de la empresa
        2 Extraer la mision de la empresa
        3 Si no existe contexto para alguna propiedad siempre la debes devolver pero con valor null
        5 respuesta en formato json
        </guidelines>

        <output>
        1 no uses markdown, ni backstick en la respuesta, devuelve el json sin mas explicaciones
        Responde con un json con la siguiente estructura:
        {
            \"vision\": \"vision de la empresa\",
            \"mision\": \"mision de la empresa\"
        }
        </output>
        ";
        $response = $assistant->generateContentWithChat($text, $system_prompt, $model);
        $diccionario_mision_vision = json_decode($response, true);
        $respuesta_final['mision'] = $diccionario_mision_vision['mision'];
        $respuesta_final['vision'] = $diccionario_mision_vision['vision'];


        //Extraer productos y servicios
        $system_prompt = "
        <identity>
        Tu eres un agente, que sintetisa informacion, de los usuarios.
        </identity>

        <purpose>
        Tienes que extraer los productos y servicios de la empresa.
        </purpose>

        <guidelines>
        1 Extraer los productos y servicios de la empresa
        2 Si no existe la contexto para extraer los productos y servicios responde con un null
        3 respuesta en formato json
        </guidelines>

        <output>
        1 no uses markdown, ni backstick en la respuesta, devuelve el json sin mas explicaciones
        Responde con un json con la siguiente estructura:
        {
            \"productos\": \"productos de la empresa\",
            \"servicios\": \"servicios de la empresa\"
        }
        </output>
        ";
        $response = $assistant->generateContentWithChat($text, $system_prompt, $model);
        $diccionario_productos_servicios = json_decode($response, true);
        $respuesta_final['productos'] = $diccionario_productos_servicios['productos'];
        $respuesta_final['servicios'] = $diccionario_productos_servicios['servicios'];


        //Extraer historia de la empresa
        $system_prompt = "
        <identity>
        Tu eres un agente, que sintetisa informacion, de los usuarios.
        </identity>

        <purpose>
        Tienes que extraer la historia de la empresa.
        </purpose>

        <guidelines>
        1 Extraer la historia de la empresa
        2 Si no existe la contexto para extraer la historia de la empresa responde con un null
        3 respuesta en formato json
        </guidelines>

        <output>
        1 no uses markdown, ni backstick en la respuesta, devuelve el json sin mas explicaciones
        Responde con un json con la siguiente estructura:
        {
            \"historia\": \"historia de la empresa\"
        }
        </output>
        ";
        $response = $assistant->generateContentWithChat($text, $system_prompt, $model);
        $diccionario_historia = json_decode($response, true);
        $respuesta_final['historia'] = $diccionario_historia['historia'];

        //Extraer lineamientos para publicar en facebook
        $system_prompt = "
        <identity>
        Tu eres un agente, que sintetisa informacion, de los usuarios.
        </identity>

        <purpose>
        Tienes que extraer los lineamientos para publicar en facebook, solo de facebook.
        </purpose>

        <guidelines>
        1 Extraer los lineamientos para tono de comunicacion, solo de facebook
        2 Extraer los lineamientos para guias de estilo y contenido, solo de facebook
        3 Extraer los lineamientos para publico o segmento objetivo, solo de facebook
        4 Si no existe contexto para extraer algun lineamiento responde con un null a la clave correspondiente
        5 respuesta en formato json
        </guidelines>

        <output>
        1 no uses markdown, ni backstick en la respuesta, devuelve el json sin mas explicaciones
        Responde con un json con la siguiente estructura:
        {
            \"tono\": \"tono de comunicacion\",
            \"guia_estilo\": \"guia de estilo\",
            \"publico\": \"publico objetivo\"
        }
        </output>
        ";
        $response = $assistant->generateContentWithChat($text, $system_prompt, $model);
        $diccionario_lineamientos = json_decode($response, true);
        $respuesta_final['lineamientos_facebook'] = [
            'tono' => $diccionario_lineamientos['tono'],
            'guia_estilo' => $diccionario_lineamientos['guia_estilo'],
            'publico' => $diccionario_lineamientos['publico']
        ];

        //Extraer lineamientos para publicar en instagram
        $system_prompt = "
        <identity>
        Tu eres un agente, que sintetisa informacion, de los usuarios.
        </identity>

        <purpose>
        Tienes que extraer los lineamientos para publicar en instagram, solo de instagram.
        </purpose>

        <guidelines>
        1 Extraer los lineamientos para tono de comunicacion, solo de instagram
        2 Extraer los lineamientos para guias de estilo y contenido, solo de instagram
        3 Extraer los lineamientos para publico o segmento objetivo, solo de instagram
        4 Si no existe contexto para extraer algun lineamiento responde con un null a la clave correspondiente
        5 respuesta en formato json
        </guidelines>

        <output>
        1 no uses markdown, ni backstick en la respuesta, devuelve el json sin mas explicaciones
        Responde con un json con la siguiente estructura:
        {
            \"tono\": \"tono de comunicacion\",
            \"guia_estilo\": \"guia de estilo\",
            \"publico\": \"publico objetivo\"
        }
        </output>
        ";
        $response = $assistant->generateContentWithChat($text, $system_prompt, $model);
        $diccionario_lineamientos = json_decode($response, true);
        $respuesta_final['lineamientos_instagram'] = [
            'tono' => $diccionario_lineamientos['tono'],
            'guia_estilo' => $diccionario_lineamientos['guia_estilo'],
            'publico' => $diccionario_lineamientos['publico']
        ];

        //Extraer lineamientos para publicar en twitter
        $system_prompt = "
        <identity>
        Tu eres un agente, que sintetisa informacion, de los usuarios.
        </identity>

        <purpose>
        Tienes que extraer los lineamientos para publicar en twitter, solo de twitter.
        </purpose>

        <guidelines>
        1 Extraer los lineamientos para tono de comunicacion, solo de twitter
        2 Extraer los lineamientos para guias de estilo y contenido, solo de twitter
        3 Extraer los lineamientos para publico o segmento objetivo
        4 Si no existe contexto para extraer algun lineamiento responde con un null a la clave correspondiente
        5 respuesta en formato json
        </guidelines>

        <output>
        1 no uses markdown, ni backstick en la respuesta, devuelve el json sin mas explicaciones
        Responde con un json con la siguiente estructura:
        {
            \"tono\": \"tono de comunicacion\",
            \"guia_estilo\": \"guia de estilo\",
            \"publico\": \"publico objetivo\"
        }
        </output>
        ";
        $response = $assistant->generateContentWithChat($text, $system_prompt, $model);
        $diccionario_lineamientos = json_decode($response, true);
        $respuesta_final['lineamientos_twitter'] = [
            'tono' => $diccionario_lineamientos['tono'],
            'guia_estilo' => $diccionario_lineamientos['guia_estilo'],
            'publico' => $diccionario_lineamientos['publico']
        ];
        

        $respuesta_final['__user_id'] = is_numeric($user_id ?? null) ? (int)$user_id : null;
        \Log::info('PersistBrandIdentity: intento', [
            'has_identity' => isset($respuesta_final['identity']),
            'has_fb' => isset($respuesta_final['lineamientos_facebook']),
            'user_id' => $respuesta_final['__user_id'],
        ]);
        $brandIdentityController = new BrandIdentityController();
        $brandIdentityController->persistBrandIdentityFromEvaluation($respuesta_final, (int) $user_id);
        

        return response()->json([
            'response' => $respuesta_final,
        ]);
    }

    public function whCall11Lab(Request $request)
    {
        // 1) Decodificar el body de la forma más tolerante posible
        $raw = $request->getContent();
        $payload = json_decode($raw, true);

        if (!is_array($payload) || empty($payload)) {
            // Puede que Laravel ya lo haya parseado
            $payload = $request->all();
        }

        // Caso A: n8n envía [{ body: {...} }]
        if (isset($payload[0]) && is_array($payload[0]) && isset($payload[0]['body'])) {
            $body = $payload[0]['body'];
            if (is_string($body)) {
                $payload = json_decode($body, true) ?: [];
            } elseif (is_array($body)) {
                $payload = $body;
            }
        }

        // Caso B: n8n envía { body: {...} } o { body: "json-string" }
        if (isset($payload['body'])) {
            $body = $payload['body'];
            if (is_string($body)) {
                $payload = json_decode($body, true) ?: [];
            } elseif (is_array($body)) {
                $payload = $body;
            }
        }

        // En este punto $payload DEBE ser el JSON de ElevenLabs
        $type = (string) data_get($payload, 'type', '');

        if ($type !== 'post_call_transcription') {
            // Si llegas aquí con "", tu cliente NO está mandando JSON válido o falta Content-Type
            \Log::warning('11Labs webhook: tipo no soportado o faltante', [
                'type' => $type,
                'sample_keys' => array_keys((array)$payload),
            ]);
            return response()->json([
                'ok' => false,
                'msg' => 'Tipo de webhook no soportado para este handler',
                'type' => $type,
                'is_wrapper' => isset($payload[0]) || isset($request['body']),
            ], 200);
        }

        // 2) Armar la conversación user/agent
        $turns = (array) data_get($payload, 'data.transcript', []);
        $lines = [];
        foreach ($turns as $turn) {
            $role = strtolower((string) data_get($turn, 'role', ''));
            $msg  = trim((string) data_get($turn, 'message', ''));
            if ($msg === '') continue;
            $label = in_array($role, ['agent', 'assistant', 'ai'], true) ? 'agent' : 'user';
            $lines[] = "{$label}: {$msg}";
        }
        $conversacion = implode(PHP_EOL, $lines);

        // 3) IDs útiles
        $conversationId = data_get($payload, 'data.conversation_id');
        $userId   = data_get($payload, 'data.conversation_initiation_client_data.dynamic_variables.user_id');
        $userName = data_get($payload, 'data.conversation_initiation_client_data.dynamic_variables.user_name');

        // 4) Ejecutar tu evaluador sin romper
        try {
            $llamada_evaluada = $this->evaluateCall($conversacion, $userName, $userId);
            print_r($llamada_evaluada);
        } catch (\Throwable $e) {
            \Log::error('evaluateCall failed', [
                'conversation_id' => $conversationId,
                'error' => $e->getMessage(),
            ]);            
        }

        // 5) Responder
        return response()->json([
            'ok' => true,
            'conversation_id' => $conversationId,
            'user_id'   => $userId,
            'user_name' => $userName,
            'status'    => data_get($payload, 'data.status'),
            'lines'     => count($lines),
            'conversacion' => $conversacion,
            'llamada_evaluada' => $llamada_evaluada,
        ], 200);
    }
}
