<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedTinyInteger('month');
            $table->year('year');
            $table->text('idea')->nullable();
            $table->text('objective')->nullable();
            $table->text('prompt_image')->nullable();
            $table->json('networks')->nullable(); // [ "facebook", "instagram" ]
            $table->foreignId('template_id')->nullable();
            $table->foreign('template_id')->references('id')->on('templates')->nullOnDelete();
            $table->enum('status', ['pending', 'in_progress', 'generated', 'approved', 'published'])->default('pending');
            $table->date('scheduled_date')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'year', 'month'], 'idx_publications_user_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
