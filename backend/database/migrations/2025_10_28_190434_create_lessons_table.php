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
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->string('type', 50)->default('video'); // video, pdf, interactive
            $table->string('duration', 20)->nullable(); // e.g., "12:30"
            $table->integer('order')->default(0); // Lesson sequence in module
            $table->text('video_url')->nullable();
            $table->text('pdf_url')->nullable();
            $table->text('content')->nullable(); // For interactive/text content
            $table->boolean('is_published')->default(true);
            $table->boolean('is_free')->default(false); // For freemium features
            $table->timestamps();

            // Index for faster queries
            $table->index(['module_id', 'order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
