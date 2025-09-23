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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Datos generales
            $table->string('nombre_cliente');
            $table->string('nombre_comercial')->nullable();
            $table->string('pais')->nullable();
            $table->string('telefono')->nullable();
            $table->string('correo')->nullable();
            $table->string('direccion')->nullable();
            $table->string('correo_factura')->nullable();

            // Datos fiscales
            $table->string('actividad_comercial')->nullable();
            $table->string('documento_tipo')->nullable(); // NIT, NRC, Pasaporte, Otro
            $table->string('documento_numero')->nullable();
            $table->string('tipo_persona')->nullable();   // Natural/Jurídica
            $table->string('departamento')->nullable();
            $table->string('municipio')->nullable();

            // Campos exclusivos para crédito fiscal
            $table->string('contacto_nombre')->nullable();
            $table->string('contacto_telefono')->nullable();
            $table->string('contacto_direccion')->nullable();
            $table->string('nit')->nullable();
            $table->string('nrc')->nullable();
            $table->string('categoria')->nullable(); // Gran contribuyente, Mediano, etc.

            // Tipo de cliente (exterior, consumidor final, crédito fiscal)
            $table->enum('tipo_cliente', ['exterior', 'consumidor_final', 'credito_fiscal']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
