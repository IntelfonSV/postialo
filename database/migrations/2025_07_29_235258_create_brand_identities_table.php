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
        Schema::create('brand_identities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('company_identity')->nullable();
            $table->text('mission_vision')->nullable();
            $table->text('products_services')->nullable();
            $table->text('company_history')->nullable();
            $table->json('guidelines_json')->nullable();
            $table->string('website')->nullable();
            $table->string('whatsapp_number')->nullable();
            $table->string('facebook_page_id')->nullable();
            $table->string('instagram_account_id')->nullable();
            $table->string('logo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('brand_identities');
    }
};
