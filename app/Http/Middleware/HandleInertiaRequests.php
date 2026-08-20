<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $rawgAuthImages = Cache::remember('rawg_auth_bg_images_pool', 1800, function () {
            try {
                $rawg = new \App\Services\RawgService();
                $pop1 = $rawg->popular(1);
                $pop2 = $rawg->popular(2);
                $merged = array_merge($pop1['results'] ?? [], $pop2['results'] ?? []);

                return collect($merged)
                    ->pluck('background_image')
                    ->filter()
                    ->unique()
                    ->values()
                    ->all();
            } catch (\Throwable $e) {
                return [];
            }
        });

        $user = $request->user();
        $myStories = [];
        $followingStoryGroups = [];

        if ($user) {
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

            $myStories = $myStoriesModels->map($formatStory)->filter()->values();

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
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'rank_up' => fn () => $request->session()->get('rank_up'),
            ],
            'myStories' => $myStories,
            'followingStoryGroups' => $followingStoryGroups,
            'rawgAuthImages' => $rawgAuthImages,
        ];
    }
}
