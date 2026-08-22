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

        try {
            $topHitsResponse = $rawg->popular(1);
            $newGamesResponse = $rawg->newReleases(1);

            $topHitsPool = collect($topHitsResponse['results'] ?? [])
                ->filter(fn ($item) => !empty($item['rating']))
                ->take(30)
                ->values();

            $newGamesPool = collect($newGamesResponse['results'] ?? [])
                ->filter(fn ($item) => !empty($item['rating']))
                ->take(25)
                ->values();

            $topHits = $this->deterministicPick($topHitsPool, $dailySeed, 10)
                ->map(fn ($item) => $this->mapGame($item))
                ->values();

            $newGames = $this->deterministicPick($newGamesPool, $dailySeed + 1, 10)
                ->map(fn ($item) => $this->mapGame($item))
                ->values();
        } catch (\Throwable $e) {
            $topHits = collect([]);
            $newGames = collect([]);
        }

        $user = auth()->user();

        $formatStory = function ($story) {
            if (!$story) return null;

            if ($story->type === 'rank_up') {
                return [
                    'id' => $story->id,
                    'type' => 'rank_up',
                    'user_id' => $story->user_id,
                    'user_name' => $story->user->name,
                    'user_avatar' => $story->user->avatar,
                    'created_at' => $story->created_at->diffForHumans(),
                    'rank_name' => $story->rank_name,
                    'rank_count' => $story->rank_count,
                ];
            }

            if (!$story->review || !$story->review->game) return null;

            return [
                'id' => $story->id,
                'type' => 'review',
                'user_id' => $story->user_id,
                'user_name' => $story->user->name,
                'user_avatar' => $story->user->avatar,
                'created_at' => $story->created_at->diffForHumans(),
                'review' => [
                    'rating' => (float) $story->review->rating,
                    'body' => $story->review->body,
                    'game_title' => $story->review->game->title,
                    'game_cover' => $story->review->game->cover_url,
                    'game_slug' => $story->review->game->slug,
                ],
            ];
        };

        $myStoriesModels = \App\Models\Story::active()
            ->where('user_id', $user->id)
            ->with(['review.game', 'user'])
            ->oldest()
            ->get();

        $myStories = $myStoriesModels
            ->map($formatStory)
            ->filter()
            ->values();

        $followingIds = $user->following()->pluck('users.id')->toArray();
        $followingStoryModels = \App\Models\Story::active()
            ->whereIn('user_id', $followingIds)
            ->with(['review.game', 'user'])
            ->oldest()
            ->get();

        $followingStoryGroups = $followingStoryModels
            ->groupBy('user_id')
            ->map(function ($group) use ($formatStory) {
                $firstStoryUser = $group->first()->user;
                $stories = $group->map($formatStory)->filter()->values();
                return [
                    'user_id' => $firstStoryUser->id,
                    'user_name' => $firstStoryUser->name,
                    'user_avatar' => $firstStoryUser->avatar,
                    'stories' => $stories,
                ];
            })
            ->values();

        $myListIds = $user ? $user->gameList()->pluck('games.id')->toArray() : [];
        $myListExternalIds = $user ? $user->gameList()->whereNotNull('external_id')->pluck('games.external_id')->toArray() : [];

        $userReviewCount = $user ? $user->reviews()->count() : 0;
        $recommendedGames = collect([]);

        if ($userReviewCount > 0) {
            // Find genres from games the user has reviewed with high ratings or interests
            $userReviewedGameIds = $user->reviews()->pluck('game_id')->toArray();

            $userReviewedGenreIds = \App\Models\Interest::whereHas('games', function ($q) use ($userReviewedGameIds) {
                $q->whereIn('games.id', $userReviewedGameIds);
            })->pluck('id')->toArray();

            $userInterestIds = $user->interests()->pluck('interests.id')->toArray();
            $targetGenreIds = array_unique(array_merge($userReviewedGenreIds, $userInterestIds));

            $dbRecommendations = \App\Models\Game::with('interests')
                ->whereHas('interests', function ($q) use ($targetGenreIds) {
                    if (!empty($targetGenreIds)) {
                        $q->whereIn('interests.id', $targetGenreIds);
                    }
                })
                ->whereNotIn('id', $userReviewedGameIds)
                ->inRandomOrder()
                ->limit(10)
                ->get()
                ->map(fn ($g) => [
                    'external_id' => $g->external_id ?? $g->id,
                    'title' => $g->title,
                    'cover_url' => $g->cover_url,
                    'rawg_rating' => $g->rawg_rating ? (float)$g->rawg_rating : null,
                    'genres' => $g->interests->pluck('name')->implode(', '),
                ]);

            $recommendedGames = $dbRecommendations;
        }

        return Inertia::render('Home', [
            'topHits' => $topHits,
            'newGames' => $newGames,
            'myStories' => $myStories,
            'followingStoryGroups' => $followingStoryGroups,
            'myListIds' => $myListIds,
            'myListExternalIds' => $myListExternalIds,
            'userReviewCount' => $userReviewCount,
            'recommendedGames' => $recommendedGames,
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

        return [
            'external_id' => $item['id'],
            'title' => $item['name'],
            'cover_url' => $cover,
            'rawg_rating' => $item['rating'] ?? null,
            'genres' => collect($item['genres'] ?? [])->pluck('name')->implode(', '),
        ];
    }
}