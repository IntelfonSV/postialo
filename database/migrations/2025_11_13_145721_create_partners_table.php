<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Ej: AEROMALL, BANKO, TECHLAB
            $table->string('name');
            $table->string('contact_email')->nullable();
            $table->string('logo_path')->nullable();
            $table->json('restrictions')->nullable(); // Ej: {"fixed_fields":["logo","whatsapp_number","make_url"]}
            $table->json('branding')->nullable(); // Colores, url fija, whatsapp fijo, etc.
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partners');
    }
};
