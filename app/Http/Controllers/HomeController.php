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
            if (!$story || !$story->review || !$story->review->game) return null;
            return [
                'id' => $story->id,
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

        return Inertia::render('Home', [
            'topHits' => $topHits,
            'newGames' => $newGames,
            'myStories' => $myStories,
            'followingStoryGroups' => $followingStoryGroups,
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