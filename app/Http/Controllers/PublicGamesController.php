<?php

namespace App\Http\Controllers;

use App\Services\RawgService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicGamesController extends Controller
{
    public function index(Request $request, RawgService $rawg): Response
    {
        $search = $request->input('search');
        $genre = $request->input('genre');
        $page = max(1, (int) $request->input('page', 1));

        try {
            if ($search) {
                $response = $rawg->search($search, $page);
            } else {
                $response = $rawg->popular($page);
            }

            $games = collect($response['results'] ?? [])
                ->map(function ($item) {
                    $cover = $item['background_image']
                        ?? $item['background_image_additional']
                        ?? ($item['short_screenshots'][0]['image'] ?? null);

                    $genreList = collect($item['genres'] ?? [])->pluck('name')->join(', ');

                    return [
                        'external_id' => $item['id'],
                        'title' => $item['name'],
                        'cover_url' => $cover,
                        'rawg_rating' => $item['rating'] ?? 0,
                        'released' => isset($item['released']) ? substr($item['released'], 0, 4) : 'N/A',
                        'genres' => $genreList ?: 'General',
                        'platforms' => collect($item['platforms'] ?? [])->map(fn($p) => $p['platform']['name'] ?? '')->take(3)->filter()->join(', '),
                    ];
                })
                ->filter(fn ($g) => !empty($g['cover_url']))
                ->values();

            $totalCount = $response['count'] ?? 0;
        } catch (\Throwable $e) {
            $games = collect([]);
            $totalCount = 0;
        }

        $genresList = [
            'Action', 'RPG', 'Adventure', 'Shooter', 'Strategy', 'Indie', 'Sports', 'Racing', 'Fighting'
        ];

        return Inertia::render('PublicGames', [
            'games' => $games,
            'totalCount' => $totalCount,
            'filters' => [
                'search' => $search ?? '',
                'genre' => $genre ?? '',
                'page' => $page,
            ],
            'genresList' => $genresList,
        ]);
    }
}
