<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('webhook_events', function (Blueprint $t) {
            $t->bigIncrements('id');

            $t->string('provider', 32)->default('pagadito')->index();
            $t->string('event_id', 128)->nullable();          // id de evento si lo envía la pasarela
            $t->string('ern', 64)->nullable()->index();       // referencia del cargo
            $t->string('status', 32)->nullable()->index();    // REGISTERED|PENDING|COMPLETED|...

            $t->text('raw_body');                             // cuerpo crudo (JSON roto permitido)
            $t->json('headers')->nullable();                  // snapshot de headers (firma, ts, etc.)
            $t->string('signature', 255)->nullable();         // firma si aplica (X-Signature/HMAC)
            $t->json('parsed')->nullable();                   // datos normalizados extraídos del raw

            $t->timestamp('processed_at')->nullable();

            $t->timestamps();

            // Idempotencia por event_id (si existe)
            $t->unique(['provider', 'event_id']);
            $t->index(['provider', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('webhook_events');
    }
};
