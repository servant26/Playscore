<?php

namespace App\Http\Controllers;

use App\Services\RawgService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AllGamesController extends Controller
{
    public function index(Request $request, RawgService $rawg): Response
    {
        $page = max(1, (int) $request->input('page', 1));

        $response = $rawg->popular($page);

        $games = collect($response['results'] ?? [])
            ->filter(fn ($item) => !empty($item['rating']))
            ->map(function ($item) {
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
            })
            ->take(9)
            ->values();

        $totalCount = $response['count'] ?? 0;
        $perPage = 9;
        $lastPage = (int) ceil($totalCount / $perPage);

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

        return Inertia::render('AllGames', [
            'games' => $games,
            'currentPage' => $page,
            'lastPage' => min($lastPage, 500),
            'myStories' => $myStories,
            'followingStoryGroups' => $followingStoryGroups,
            'myListIds' => $myListIds,
            'myListExternalIds' => $myListExternalIds,
        ]);
    }
}