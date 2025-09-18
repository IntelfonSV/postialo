<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_sessions', function (Blueprint $t) {
            $t->bigIncrements('id');

            // Dueño de la sesión (cliente = user autenticado)
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Snapshot de lo enviado a la pasarela
            $t->string('permissions', 255);          // ej: initial_payment,automatic_charges,receive_payments
            $t->char('currency', 3)->default('USD');
            $t->char('country_code', 3)->default('SV');
            $t->json('custom_params')->nullable();   // metadata libre (jsonb en PG)

            // Respuesta/estado del proveedor
            $t->string('provider', 32)->default('pagadito')->index();
            $t->string('status', 32)->default('initiated')->index(); // initiated|authorized|...

            $t->string('auth_token', 128)->nullable()->unique();     // data.token (PG1008)
            $t->string('provider_url', 512)->nullable();             // data.url (PG1008)
            $t->string('provider_code', 32)->nullable();             // ej: PG1008
            $t->string('provider_ref', 128)->nullable();             // id/suscripción si aplica

            $t->timestamps();

            $t->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_sessions');
    }
};
