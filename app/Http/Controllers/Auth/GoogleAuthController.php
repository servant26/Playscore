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
                if (! $user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'avatar' => $user->avatar ?: $googleUser->getAvatar(),
                    ]);
                }
            } else {
                // Buat user baru jika belum ada
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => null, // Login dengan Google tidak butuh password
                ]);
            }

            Auth::login($user, true);

            return redirect()->intended(route('home', absolute: false));
        } catch (Exception $e) {
            return redirect()->route('login')->withErrors([
                'email' => 'Gagal login menggunakan Google. Silakan coba lagi.',
            ]);
        }
    }
}
