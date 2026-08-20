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
        Schema::table('stories', function (Blueprint $table) {
            $table->foreignId('review_id')->nullable()->change();
            $table->string('type')->default('review')->after('user_id');
            $table->string('rank_name')->nullable()->after('type');
            $table->integer('rank_count')->nullable()->after('rank_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stories', function (Blueprint $table) {
            $table->foreignId('review_id')->nullable(false)->change();
            $table->dropColumn(['type', 'rank_name', 'rank_count']);
        });
    }
};
