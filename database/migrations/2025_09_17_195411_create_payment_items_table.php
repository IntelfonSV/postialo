<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_items', function (Blueprint $t) {
            $t->bigIncrements('id');

            // FKs
            $t->foreignId('payment_id')->constrained('payments')->cascadeOnDelete(); // cada ítem pertenece a un pago
            $t->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete(); // vínculo opcional al catálogo

            // Snapshot de la línea
            $t->string('description', 255);     // nombre/desc del ítem en el momento del cobro
            $t->decimal('price', 12, 2);        // precio unitario
            $t->decimal('quantity', 12, 2);     // cantidad
            $t->decimal('line_total', 12, 2);   // price * quantity (guardado explícito)

            $t->timestamps();

            // Índices útiles
            $t->index('payment_id');
            $t->index('product_id');
        });

        // Checks (PostgreSQL)
        DB::statement("ALTER TABLE payment_items ADD CONSTRAINT payment_items_price_nonneg CHECK (price >= 0)");
        DB::statement("ALTER TABLE payment_items ADD CONSTRAINT payment_items_quantity_pos CHECK (quantity > 0)");
        DB::statement("ALTER TABLE payment_items ADD CONSTRAINT payment_items_total_nonneg CHECK (line_total >= 0)");
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_items');
    }
};
