<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_transactions', function (Blueprint $t) {
            $t->bigIncrements('id');

            // FKs
            $t->foreignId('payment_id')->nullable()->constrained('payments')->nullOnDelete();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // Identificación / referencias
            $t->string('provider', 32)->default('pagadito')->index();
            $t->string('ern', 64)->index();
            $t->string('provider_token', 128)->nullable();     // único por proveedor (si existe)
            $t->string('provider_reference', 128)->nullable(); // ref/ID de la pasarela

            // Estado y montos
            $t->string('status', 32)->nullable()->index();     // REGISTERED|PENDING|COMPLETED|FAILED|...
            $t->decimal('amount', 12, 2)->nullable();
            $t->char('currency', 3)->nullable();

            // Tiempos y snapshot
            $t->timestamp('transacted_at')->nullable();        // fecha normalizada de la transacción
            $t->json('snapshot');                              // fila normalizada (PG1010/WH)
            $t->timestamp('first_seen_at')->nullable();
            $t->timestamp('last_seen_at')->nullable();

            $t->timestamps();

            // Índices/uniques útiles
            $t->unique(['provider', 'provider_token']); // Postgres permite múltiples NULL
            $t->index('provider_reference');
            $t->index(['user_id', 'status']);
        });

        // Checks (PostgreSQL)
        DB::statement("ALTER TABLE payment_transactions ADD CONSTRAINT payment_tx_amount_nonneg CHECK (amount IS NULL OR amount >= 0)");
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
