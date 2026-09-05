<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Exception;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google.
     */
    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $googleIdHash = User::hashGoogleId($googleUser->getId());
            $emailHash = User::hashEmail($googleUser->getEmail());

            // Cek apakah user sudah ada berdasarkan google_id_hash atau email_hash
            $user = User::where('google_id_hash', $googleIdHash)
                ->orWhere('email_hash', $emailHash)
                ->first();

            if ($user) {
                // Jika user sudah ada tapi google_id belum tersambung, sambungkan
                $updates = [];
                if (! $user->google_id) {
                    $updates['google_id'] = $googleUser->getId();
                }
                if (! $user->avatar && $googleUser->getAvatar()) {
                    $updates['avatar'] = $googleUser->getAvatar();
                }
                if (! $user->username) {
                    $baseUsername = \Illuminate\Support\Str::slug($user->name ?: 'user', '');
                    $candidate = $baseUsername ?: 'user';
                    $c = 1;
                    while (User::where('username', $candidate)->exists()) {
                        $candidate = $baseUsername . $c;
                        $c++;
                    }
                    $updates['username'] = $candidate;
                }
                if (!empty($updates)) {
                    $user->update($updates);
                }
            } else {
                // Buat username unik dari nama / email Google
                $rawBase = $googleUser->getNickname() ?: explode('@', $googleUser->getEmail() ?? '')[0] ?: $googleUser->getName();
                $baseUsername = \Illuminate\Support\Str::slug($rawBase, '');
                if (empty($baseUsername)) {
                    $baseUsername = 'user';
                }

                $username = $baseUsername;
                $counter = 1;
                while (User::where('username', $username)->exists()) {
                    $username = $baseUsername . $counter;
                    $counter++;
                }

                // Buat user baru jika belum ada
                $user = User::create([
                    'name' => $googleUser->getName() ?: $username,
                    'username' => $username,
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => null, // Login dengan Google tidak butuh password
                ]);
            }

            Auth::login($user, true);

            return redirect()->intended(route('dashboard', absolute: false));
        } catch (Exception $e) {
            return redirect()->route('login')->withErrors([
                'username' => 'Gagal login menggunakan Google. Silakan coba lagi.',
            ]);
        }
    }
}
