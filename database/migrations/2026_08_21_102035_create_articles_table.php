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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('cover')->nullable();
            $table->longText('content')->nullable();
            $table->string('category')->default('PC'); // PC, PlayStation, Xbox, Nintendo Switch
            $table->string('publisher')->default('Playscore');
            $table->string('publisher_logo')->nullable();
            $table->string('publisher_bg')->nullable();
            $table->string('author')->nullable();
            $table->string('read_time')->nullable();
            $table->string('source_name')->nullable();
            $table->string('source_url')->nullable();
            $table->json('tags')->nullable();
            $table->enum('status', ['published', 'archived'])->default('published');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
