<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class PublicProfileController extends Controller
{
    public function show(User $user): Response
    {
        $reviews = $user->reviews()->with('game.interests')->latest()->get();

        $totalReviews = $reviews->count();
        $totalGamesInList = $user->gameList()->count();
        $averageScore = $totalReviews > 0 ? round($reviews->avg('rating'), 1) : 0;

        $reviewsByGenre = [];
        foreach ($reviews as $review) {
            if ($review->game && $review->game->interests) {
                foreach ($review->game->interests as $genre) {
                    $name = $genre->name;
                    $reviewsByGenre[$name] = ($reviewsByGenre[$name] ?? 0) + 1;
                }
            }
        }
        arsort($reviewsByGenre);

        $reviewsByYear = [];
        foreach ($reviews as $review) {
            if ($review->game) {
                $year = null;
                if (!empty($review->game->release_date)) {
                    $year = (string) \Carbon\Carbon::parse($review->game->release_date)->year;
                } elseif (!empty($review->game->release_year)) {
                    $year = (string) $review->game->release_year;
                }
                if ($year) {
                    $reviewsByYear[$year] = ($reviewsByYear[$year] ?? 0) + 1;
                }
            }
        }
        ksort($reviewsByYear);

        $ratingDistribution = [
            '1-3'  => 0,
            '4-6'  => 0,
            '7-8'  => 0,
            '9-10' => 0,
        ];
        foreach ($reviews as $review) {
            $r = (float) $review->rating;
            if ($r >= 1 && $r <= 3.9) {
                $ratingDistribution['1-3']++;
            } elseif ($r >= 4 && $r <= 6.9) {
                $ratingDistribution['4-6']++;
            } elseif ($r >= 7 && $r <= 8.9) {
                $ratingDistribution['7-8']++;
            } elseif ($r >= 9 && $r <= 10) {
                $ratingDistribution['9-10']++;
            }
        }

        $myListIds = auth()->user()
            ->gameList()
            ->pluck('games.id')
            ->toArray();

        return Inertia::render('Profile/PublicShow', [
            'profileUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
            ],
            'interests' => $user->interests()->get(['interests.id', 'interests.name']),
            'reviews' => $reviews,
            'myListIds' => $myListIds,
            'stats' => [
                'totalReviews' => $totalReviews,
                'totalGamesInList' => $totalGamesInList,
                'averageScore' => $averageScore,
                'reviewsByGenre' => $reviewsByGenre,
                'reviewsByYear' => $reviewsByYear,
                'ratingDistribution' => $ratingDistribution,
            ],
        ]);
    }
}