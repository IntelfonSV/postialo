<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->string('name', 150);
            $table->string('sku', 64)->nullable()->unique();

            $table->decimal('price', 12, 2);        // CHECK price >= 0 (abajo)
            $table->char('currency', 3)->default('USD');

            $table->unsignedInteger('intervalo_meses')->default(1); // CHECK >= 1 (abajo)
            $table->char('country_code', 3)->default('SV');

            $table->text('description')->nullable();
            $table->json('metadata')->nullable();   // en Postgres será jsonb
            $table->boolean('active')->default(true);

            $table->timestamps();

            $table->index('active');
            $table->index('country_code');
        });

        // Checks (PostgreSQL)
        DB::statement("ALTER TABLE products ADD CONSTRAINT products_price_nonneg CHECK (price >= 0)");
        DB::statement("ALTER TABLE products ADD CONSTRAINT products_intervalo_meses_min CHECK (intervalo_meses >= 1)");
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
