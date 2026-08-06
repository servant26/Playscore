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

        $myReviewsWithGame = $user->reviews()
            ->with(['game.interests'])
            ->latest()
            ->get();

        // Stats calculation from reviewed games
        $genreCounts = [];
        $yearCounts = [];
        $ratingDistribution = [
            '1-3' => 0,
            '4-6' => 0,
            '7-8' => 0,
            '9-10' => 0,
        ];

        foreach ($myReviewsWithGame as $rev) {
            // Genre aggregation
            if ($rev->game && $rev->game->interests) {
                foreach ($rev->game->interests as $genre) {
                    $genreCounts[$genre->name] = ($genreCounts[$genre->name] ?? 0) + 1;
                }
            }

            // Release Year aggregation
            if ($rev->game && $rev->game->release_date) {
                $year = (string) \Carbon\Carbon::parse($rev->game->release_date)->year;
                $yearCounts[$year] = ($yearCounts[$year] ?? 0) + 1;
            }

            // Rating score distribution
            $score = (float) $rev->rating;
            if ($score <= 3.9) {
                $ratingDistribution['1-3']++;
            } elseif ($score <= 6.9) {
                $ratingDistribution['4-6']++;
            } elseif ($score <= 8.9) {
                $ratingDistribution['7-8']++;
            } else {
                $ratingDistribution['9-10']++;
            }
        }

        ksort($yearCounts);
        arsort($genreCounts);

        $avgScore = $myReviewsWithGame->count() > 0
            ? round($myReviewsWithGame->avg('rating'), 1)
            : 0;

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'allInterests' => \App\Models\Interest::orderBy('name')->get(['id', 'name', 'slug']),
            'userInterestIds' => $userInterestIds,
            'recommendations' => $recommendations,
            'gameList' => $user->gameList()->with('interests')->get(),
            'myReviews' => $myReviewsWithGame,
            'stats' => [
                'totalReviews' => $myReviewsWithGame->count(),
                'totalGamesInList' => $user->gameList()->count(),
                'averageScore' => $avgScore,
                'reviewsByGenre' => $genreCounts,
                'reviewsByYear' => $yearCounts,
                'ratingDistribution' => $ratingDistribution,
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
