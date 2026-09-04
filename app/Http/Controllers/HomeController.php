<?php

namespace App\Http\Controllers;

use App\Services\RawgService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request, RawgService $rawg): Response
    {
        $tab = $request->input('tab', 'all'); // 'all', 'popular', 'new', 'for-you'
        $page = max(1, (int) $request->input('page', 1));
        
        // Auto detect device type from User-Agent if per_page is not explicitly provided
        $defaultPerPage = 8;
        $userAgent = strtolower($request->header('User-Agent', ''));
        if (preg_match('/(ipad|tablet|playbook|silk)|(android(?!.*mobi))/i', $userAgent)) {
            $defaultPerPage = 9; // Tablet: 3 columns x 3 rows = 9 data
        } elseif (preg_match('/(mobile|iphone|ipod|android.*mobile|blackberry|iemobile|kindle|opera mini)/i', $userAgent)) {
            $defaultPerPage = 8; // Mobile: 1 column x 8 rows = 8 data
        }

        $perPage = max(1, min(50, (int) $request->input('per_page', $defaultPerPage)));
        $dailySeed = (int) now()->format('Ymd');
        $user = auth()->user();

        // 1. Featured games for the Hero Showcase
        try {
            $heroResponse = $rawg->popular(1);
            $heroPool = collect($heroResponse['results'] ?? [])
                ->filter(fn ($item) => !empty($item['rating']))
                ->take(20)
                ->values();
            $heroGames = $this->deterministicPick($heroPool, $dailySeed, 8)
                ->map(fn ($item) => $this->mapGame($item))
                ->values();
        } catch (\Throwable $e) {
            $heroGames = collect([]);
        }

        // 2. Tab Data & Pagination (Dynamic per_page: 10 on mobile, 9 on tablet, 8 on desktop)
        $tabGames = collect([]);
        $lastPage = 1;

        if ($tab === 'popular') {
            try {
                $response = $rawg->popular($page);
                $tabGames = collect($response['results'] ?? [])
                    ->filter(fn ($item) => !empty($item['rating']))
                    ->map(fn ($item) => $this->mapGame($item))
                    ->take($perPage)
                    ->values();
                $totalCount = $response['count'] ?? 0;
                $lastPage = min((int) ceil($totalCount / $perPage), 100);
            } catch (\Throwable $e) {
                $tabGames = collect([]);
            }
        } elseif ($tab === 'new') {
            try {
                $response = $rawg->newReleases($page);
                $tabGames = collect($response['results'] ?? [])
                    ->filter(fn ($item) => !empty($item['rating']))
                    ->map(fn ($item) => $this->mapGame($item))
                    ->take($perPage)
                    ->values();
                $totalCount = $response['count'] ?? 0;
                $lastPage = min((int) ceil($totalCount / $perPage), 100);
            } catch (\Throwable $e) {
                $tabGames = collect([]);
            }
        } elseif ($tab === 'for-you') {
            $userReviewedGameIds = $user ? $user->reviews()->pluck('game_id')->toArray() : [];
            $userReviewedGenreIds = \App\Models\Interest::whereHas('games', function ($q) use ($userReviewedGameIds) {
                $q->whereIn('games.id', $userReviewedGameIds);
            })->pluck('id')->toArray();

            $userInterestIds = $user ? $user->interests()->pluck('interests.id')->toArray() : [];
            $targetGenreIds = array_unique(array_merge($userReviewedGenreIds, $userInterestIds));

            $dbQuery = \App\Models\Game::with('interests')
                ->whereHas('interests', function ($q) use ($targetGenreIds) {
                    if (!empty($targetGenreIds)) {
                        $q->whereIn('interests.id', $targetGenreIds);
                    }
                })
                ->whereNotIn('id', $userReviewedGameIds)
                ->orderBy('id', 'asc')
                ->limit(40)
                ->get();

            $totalCount = $dbQuery->count();
            $lastPage = 1; // Strict 1-page only for 'For You'

            if ($totalCount > 0) {
                $pickedGames = $this->deterministicPick($dbQuery, $dailySeed + 5, $perPage);
                $tabGames = $pickedGames->map(fn ($g) => [
                    'external_id' => $g->external_id ?? $g->id,
                    'title' => $g->title,
                    'cover_url' => $g->cover_url,
                    'rawg_rating' => $g->rawg_rating ? (float)$g->rawg_rating : null,
                    'genres' => $g->interests->pluck('name')->implode(', '),
                    'is_popular' => (bool) ($g->rawg_rating >= 4.2),
                ])->values();
            } else {
                // Fallback to top rated
                try {
                    $response = $rawg->popular(1);
                    $tabGames = collect($response['results'] ?? [])
                        ->filter(fn ($item) => !empty($item['rating']))
                        ->map(fn ($item) => $this->mapGame($item))
                        ->take($perPage)
                        ->values();
                } catch (\Throwable $e) {
                    $tabGames = collect([]);
                }
            }
        } else {
            // 'all' tab - Combined All Games
            try {
                $response = $rawg->popular($page);
                $tabGames = collect($response['results'] ?? [])
                    ->filter(fn ($item) => !empty($item['rating']))
                    ->map(fn ($item) => $this->mapGame($item))
                    ->take($perPage)
                    ->values();
                $totalCount = $response['count'] ?? 0;
                $lastPage = min((int) ceil($totalCount / $perPage), 100);
            } catch (\Throwable $e) {
                $tabGames = collect([]);
            }
        }

        $myListIds = $user ? $user->gameList()->pluck('games.id')->toArray() : [];
        $myListExternalIds = $user ? $user->gameList()->whereNotNull('external_id')->pluck('games.external_id')->toArray() : [];

        return Inertia::render('Home', [
            'heroGames' => $heroGames,
            'tabGames' => $tabGames,
            'currentTab' => $tab,
            'currentPage' => $page,
            'lastPage' => max(1, $lastPage),
            'perPage' => $perPage,
            'myListIds' => $myListIds,
            'myListExternalIds' => $myListExternalIds,
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
        $cover = $item['background_image']
            ?? $item['background_image_additional']
            ?? ($item['short_screenshots'][0]['image'] ?? null);

        $isPopular = ($item['added'] ?? 0) >= 4000 
            || (($item['rating'] ?? 0) >= 4.2 && ($item['ratings_count'] ?? 0) >= 300);

        return [
            'external_id' => $item['id'],
            'title' => $item['name'],
            'cover_url' => $cover,
            'rawg_rating' => $item['rating'] ?? null,
            'genres' => collect($item['genres'] ?? [])->pluck('name')->implode(', '),
            'is_popular' => (bool) $isPopular,
        ];
    }
}