<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * Las rutas que deben estar exentas de protección CSRF.
     *
     * @var array<int, string>
     */
    protected $except = [
        'freepik/webhook', // Aquí pones tu ruta para excluirla
        '/webhook',
        'api/webhook',
    ];
}
