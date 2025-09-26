<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Proxies
    |--------------------------------------------------------------------------
    |
    | Aquí defines las IPs de tus proxies de confianza.
    | Usa '*' si quieres confiar en todos (útil en entornos Docker).
    |
    */

    'proxies' => env('TRUSTED_PROXIES', '*'),

    /*
    |--------------------------------------------------------------------------
    | Headers
    |--------------------------------------------------------------------------
    |
    | Estos headers indican a Laravel cómo detectar host, puerto y protocolo
    | original de la request.
    |
    */

    'headers' => Illuminate\Http\Request::HEADER_X_FORWARDED_FOR |
                 Illuminate\Http\Request::HEADER_X_FORWARDED_HOST |
                 Illuminate\Http\Request::HEADER_X_FORWARDED_PORT |
                 Illuminate\Http\Request::HEADER_X_FORWARDED_PROTO |
                 Illuminate\Http\Request::HEADER_X_FORWARDED_AWS_ELB,
];
