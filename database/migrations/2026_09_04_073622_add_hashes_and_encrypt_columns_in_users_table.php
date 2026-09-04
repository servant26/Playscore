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
        // 1. Tambah kolom hash dan ubah email + google_id jadi text
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'email_hash')) {
                $table->string('email_hash', 64)->nullable()->after('email')->unique();
            }
            if (!Schema::hasColumn('users', 'google_id_hash')) {
                $table->string('google_id_hash', 64)->nullable()->after('google_id')->index();
            }
            try { $table->dropUnique(['email']); } catch (\Throwable $e) {}
            try { $table->dropUnique(['google_id']); } catch (\Throwable $e) {}
            $table->text('email')->change();
            $table->text('google_id')->nullable()->change();
        });

        // 2. Migrasi data user yang sudah ada agar terenkripsi dan ter-hash
        $key = config('app.key');
        $users = \Illuminate\Support\Facades\DB::table('users')->get();
        foreach ($users as $user) {
            $updates = [];
            if ($user->email && !str_starts_with($user->email, 'eyJpdiI6')) {
                $updates['email_hash'] = hash_hmac('sha256', strtolower(trim($user->email)), $key);
                $updates['email'] = \Illuminate\Support\Facades\Crypt::encryptString($user->email);
            }
            if ($user->google_id && !str_starts_with($user->google_id, 'eyJpdiI6')) {
                $updates['google_id_hash'] = hash_hmac('sha256', (string)$user->google_id, $key);
                $updates['google_id'] = \Illuminate\Support\Facades\Crypt::encryptString((string)$user->google_id);
            }
            if (!empty($updates)) {
                \Illuminate\Support\Facades\DB::table('users')->where('id', $user->id)->update($updates);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['email_hash', 'google_id_hash']);
        });
    }
};
