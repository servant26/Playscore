<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        $userInterestIds = $user->interests()->pluck('interests.id');
        $gameListIds = $user->gameList()->pluck('games.id');

        $recommendations = \App\Models\Game::with('interests')
            ->whereHas('interests', function ($q) use ($userInterestIds) {
                $q->whereIn('interests.id', $userInterestIds);
            })
            ->whereNotIn('id', $gameListIds)
            ->inRandomOrder()
            ->limit(10)
            ->get();

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'allInterests' => \App\Models\Interest::orderBy('name')->get(['id', 'name', 'slug']),
            'userInterestIds' => $userInterestIds,
            'recommendations' => $recommendations,
            'gameList' => $user->gameList()->with('interests')->get(),
            'stats' => [
                'totalReviews' => $user->reviews()->count(),
                'totalGamesInList' => $user->gameList()->count(),
                'reviewsByRating' => $user->reviews()
                    ->selectRaw('rating, count(*) as count')
                    ->groupBy('rating')
                    ->pluck('count', 'rating'),
                'gamesByGenre' => $user->gameList()
                    ->with('interests')
                    ->get()
                    ->flatMap(fn ($game) => $game->interests->pluck('name'))
                    ->countBy(),
            ],
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        $user->fill($request->safe()->except('avatar'));

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar);
            }

            $user->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        $user->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
