<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_usages', function (Blueprint $table) {
            $table->id();

            // FK a users.id
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            // Campos del modelo
            $table->string('model', 100);
            $table->unsignedInteger('prompt_tokens')->default(0);
            $table->unsignedInteger('candidates_tokens')->default(0);
            $table->unsignedInteger('total_tokens')->default(0);

            // Ej: "stt", "tts", "chat", "embed", "tool_call", etc.
            $table->string('operation', 100)->index();

            // meta como JSON (se castea a array en Eloquent)
            $table->json('meta')->nullable();

            $table->timestamps();

            // Índices útiles para reportes
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_usages');
    }
};
