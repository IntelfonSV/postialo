<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'freepik' => [
        'api_key' => env('FREEPIK_API_KEY'),
    ],
    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
    ],
    'ideogram' => [
        'api_key' => env('IDEOGRAM_API_KEY'),
    ],
    'pagadito' => [
        'endpoint'       => env('PAGADITO_ENDPOINT', 'https://api.pagadito.com'),
        'recurring_path' => env('PAGADITO_RECURRING_PATH', '/v1/recurring/link'),
        'uid'            => env('PAGADITO_UID'),
        'wsk'            => env('PAGADITO_WSK'),
    ],

];
