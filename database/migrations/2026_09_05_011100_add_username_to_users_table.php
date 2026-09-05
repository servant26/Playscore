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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'username')) {
                $table->string('username', 50)->nullable()->unique()->after('name');
            }
            $table->text('email')->nullable()->change();
        });

        // Generate username for existing users
        $users = \Illuminate\Support\Facades\DB::table('users')->get();
        $usedUsernames = [];

        foreach ($users as $u) {
            if ($u->role === 'admin') {
                $baseUsername = 'admin';
            } else {
                $baseUsername = \Illuminate\Support\Str::slug($u->name, '');
                if (empty($baseUsername)) {
                    $baseUsername = 'user';
                }
            }

            $username = $baseUsername;
            $counter = 1;
            while (in_array(strtolower($username), $usedUsernames)) {
                $username = $baseUsername . $counter;
                $counter++;
            }

            $usedUsernames[] = strtolower($username);

            \Illuminate\Support\Facades\DB::table('users')->where('id', $u->id)->update([
                'username' => $username,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'username')) {
                $table->dropColumn('username');
            }
        });
    }
};
