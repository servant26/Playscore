<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\User;
use App\Services\RawgService;
use Inertia\Inertia;
use Inertia\Response;

class LeaderboardController extends Controller
{
    public function index(RawgService $rawg): Response
    {
        // 1. Fetch Top Gamers (Ranked by reviews & game lists)
        $topUsers = User::withCount(['reviews', 'gameList'])
            ->get()
            ->map(function ($user) {
                $totalActivity = ($user->reviews_count * 3) + $user->game_list_count;
                
                // Calculate Rank Title based on review count
                $reviewsCount = $user->reviews_count;
                if ($reviewsCount >= 250) {
                    $rankTitle = 'Platinum Gamer';
                    $rankBadge = '💎';
                    $rankColor = '#22D3EE';
                } elseif ($reviewsCount >= 100) {
                    $rankTitle = 'Gold Gamer';
                    $rankBadge = '🥇';
                    $rankColor = '#FACC15';
                } elseif ($reviewsCount >= 25) {
                    $rankTitle = 'Silver Gamer';
                    $rankBadge = '🥈';
                    $rankColor = '#94A3B8';
                } elseif ($reviewsCount >= 10) {
                    $rankTitle = 'Bronze Gamer';
                    $rankBadge = '🥉';
                    $rankColor = '#F59E0B';
                } else {
                    $rankTitle = 'Novice Reviewer';
                    $rankBadge = '🌱';
                    $rankColor = '#8B948F';
                }

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'avatar' => $user->avatar,
                    'reviews_count' => $user->reviews_count,
                    'game_list_count' => $user->game_list_count,
                    'score' => $totalActivity,
                    'rank_title' => $rankTitle,
                    'rank_badge' => $rankBadge,
                    'rank_color' => $rankColor,
                ];
            })
            ->sortByDesc('score')
            ->values()
            ->take(10);

        // 2. Fetch Top Rated Games (from database + fallback RAWG)
        $dbTopGames = Game::withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->having('reviews_count', '>', 0)
            ->orderByDesc('reviews_avg_rating')
            ->take(10)
            ->get()
            ->map(function ($game) {
                return [
                    'id' => $game->id,
                    'title' => $game->title,
                    'cover_url' => $game->cover_url,
                    'rating' => round($game->reviews_avg_rating ?? 0, 1),
                    'reviews_count' => $game->reviews_count,
                    'genres' => $game->genre ?? 'General',
                ];
            });

        if ($dbTopGames->isEmpty()) {
            try {
                $popular = $rawg->popular(1);
                $dbTopGames = collect($popular['results'] ?? [])
                    ->take(10)
                    ->map(function ($item) {
                        return [
                            'id' => $item['id'],
                            'title' => $item['name'],
                            'cover_url' => $item['background_image'] ?? null,
                            'rating' => $item['rating'] ? round($item['rating'] * 2, 1) : 9.2, // scale 0-10
                            'reviews_count' => $item['ratings_count'] ?? 150,
                            'genres' => collect($item['genres'] ?? [])->pluck('name')->join(', ') ?: 'Action',
                        ];
                    });
            } catch (\Throwable $e) {
                $dbTopGames = collect([]);
            }
        }

        return Inertia::render('Leaderboard', [
            'topUsers' => $topUsers,
            'topGames' => $dbTopGames,
        ]);
    }
}
