<?php

namespace App\Http\Controllers;

use App\Services\RawgService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(RawgService $rawg): Response
    {
        $topHitsResponse = $rawg->popular(1);
        $newGamesResponse = $rawg->newReleases(1);

        $topHits = collect($topHitsResponse['results'] ?? [])
            ->filter(fn ($item) => !empty($item['rating']))
            ->take(10)
            ->map(fn ($item) => $this->mapGame($item))
            ->values();

        $newGames = collect($newGamesResponse['results'] ?? [])
            ->filter(fn ($item) => !empty($item['rating']))
            ->take(10)
            ->map(fn ($item) => $this->mapGame($item))
            ->values();

        return Inertia::render('Home', [
            'topHits' => $topHits,
            'newGames' => $newGames,
        ]);
    }

    private function mapGame(array $item): array
    {
        return [
            'external_id' => $item['id'],
            'title' => $item['name'],
            'cover_url' => $item['background_image'],
            'rawg_rating' => $item['rating'] ?? null,
            'genres' => collect($item['genres'] ?? [])->pluck('name')->implode(', '),
        ];
    }
}