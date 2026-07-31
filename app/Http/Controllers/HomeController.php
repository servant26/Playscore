<?php

namespace App\Http\Controllers;

use App\Services\RawgService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(RawgService $rawg): Response
    {
        $dailySeed = (int) now()->format('Ymd');

        $topHitsResponse = $rawg->popular(1);
        $newGamesResponse = $rawg->newReleases(1);

        $topHitsPool = collect($topHitsResponse['results'] ?? [])
            ->filter(fn ($item) => !empty($item['rating']))
            ->take(30)
            ->values();

$newGamesPool = collect($newGamesResponse['results'] ?? [])
            ->filter(fn ($item) => !empty($item['rating']))
            ->take(50)
            ->values();

        $topHits = $this->deterministicPick($topHitsPool, $dailySeed, 10)
            ->map(fn ($item) => $this->mapGame($item))
            ->values();

        $newGames = $this->deterministicPick($newGamesPool, $dailySeed + 1, 10)
            ->map(fn ($item) => $this->mapGame($item))
            ->values();

        return Inertia::render('Home', [
            'topHits' => $topHits,
            'newGames' => $newGames,
        ]);
    }

    /**
     * Deterministically pick $count items from the collection, using a fixed seed.
     * Same seed always produces the same result — no randomness across requests.
     */
    private function deterministicPick($collection, int $seed, int $count)
    {
        $items = $collection->values()->all();
        $total = count($items);

        if ($total <= $count) {
            return collect($items);
        }

        mt_srand($seed);
        $indices = range(0, $total - 1);

        for ($i = $total - 1; $i > 0; $i--) {
            $j = mt_rand(0, $i);
            [$indices[$i], $indices[$j]] = [$indices[$j], $indices[$i]];
        }

        mt_srand();

        $selectedIndices = array_slice($indices, 0, $count);

        return collect($selectedIndices)->map(fn ($i) => $items[$i]);
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