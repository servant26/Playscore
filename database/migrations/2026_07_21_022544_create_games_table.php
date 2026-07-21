<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('external_id')->unique();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('cover_url')->nullable();
            $table->string('trailer_url')->nullable();
            $table->text('description')->nullable();
            $table->date('release_date')->nullable();
            $table->string('developer')->nullable();
            $table->string('publisher')->nullable();
            $table->decimal('rawg_rating', 3, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};