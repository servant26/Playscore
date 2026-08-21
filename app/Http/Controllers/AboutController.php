<?php

namespace App\Http\Controllers;

use App\Services\RawgService;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function index(RawgService $rawg): Response
    {
        try {
            // Fetch popular games from random page (1-3) and shuffle on every request
            $randomPage = rand(1, 3);
            $popularResponse = $rawg->popular($randomPage);
            $rawCount = $popularResponse['count'] ?? 870000;

            if ($rawCount >= 1000000) {
                $totalGamesCount = (floor($rawCount / 100000) / 10) . 'M+';
            } else if ($rawCount >= 1000) {
                $totalGamesCount = (floor($rawCount / 10000) * 10) . 'K+';
            } else {
                $totalGamesCount = $rawCount . '+';
            }

            $trendingGames = collect($popularResponse['results'] ?? [])
                ->filter(fn ($item) => !empty($item['background_image']))
                ->shuffle()
                ->take(8)
                ->map(function ($item) {
                    return [
                        'title' => $item['name'],
                        'image' => $item['background_image'],
                        'rating' => $item['rating'] ?? null,
                    ];
                })
                ->shuffle()
                ->values();
        } catch (\Throwable $e) {
            $totalGamesCount = '870K+';
            $trendingGames = collect([
                [
                    'title' => 'Elden Ring',
                    'image' => 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
                    'rating' => 4.8,
                ],
                [
                    'title' => 'Cyberpunk 2077',
                    'image' => 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
                    'rating' => 4.6,
                ],
                [
                    'title' => 'The Witcher 3',
                    'image' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
                    'rating' => 4.9,
                ],
                [
                    'title' => 'God of War Ragnarök',
                    'image' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
                    'rating' => 4.7,
                ],
            ])->shuffle()->values();
        }

        return Inertia::render('About', [
            'totalGamesCount' => $totalGamesCount,
            'trendingGames' => $trendingGames,
        ]);
    }
}
