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
        Schema::table('password_reset_requests', function (Blueprint $table) {
            if (!Schema::hasColumn('password_reset_requests', 'username')) {
                $table->string('username', 50)->nullable()->after('user_id');
            }
            $table->string('email')->nullable()->change();
        });

        // Backfill username from user relationship
        $requests = \App\Models\PasswordResetRequest::with('user')->get();
        foreach ($requests as $req) {
            if ($req->user && $req->user->username) {
                $req->update(['username' => $req->user->username]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('password_reset_requests', function (Blueprint $table) {
            if (Schema::hasColumn('password_reset_requests', 'username')) {
                $table->dropColumn('username');
            }
        });
    }
};
