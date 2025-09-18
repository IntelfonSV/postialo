<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $t) {
            $t->bigIncrements('id');

            $t->foreignId('payment_session_id')->constrained('payment_sessions')->cascadeOnDelete();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();

            $t->string('ern', 64)->unique();          // clave del cargo (uno por pending_charge)
            $t->string('description', 255);
            $t->date('charge_date')->nullable();

            $t->decimal('amount', 12, 2)->default(0); // se recalcula server-side
            $t->char('currency', 3)->default('USD');
            $t->char('country_code', 3)->default('SV');

            $t->string('status', 32)->default('initiated')->index(); // initiated|registered|pending|completed|failed|canceled|expired
            $t->string('master_token', 128)->nullable()->index();  
            $t->string('pending_token', 128)->nullable()->index();   // token_pending por cargo (si aplica)
            $t->string('reference', 128)->nullable()->index();       // referencia de la pasarela

            $t->timestamps();

            $t->index(['user_id', 'created_at']);
        });

        // Checks (PostgreSQL)
        DB::statement("ALTER TABLE payments ADD CONSTRAINT payments_amount_nonneg CHECK (amount >= 0)");
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
