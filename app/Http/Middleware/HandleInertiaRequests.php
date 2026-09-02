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
            $formatStory = fn ($story) => $story?->formatForFrontend();

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

            $highlights = $user->highlights()
                ->has('stories')
                ->with(['stories.review.game', 'stories.user'])
                ->latest()
                ->get()
                ->map(function ($hl) use ($formatStory) {
                    $stories = $hl->stories->map($formatStory)->filter()->values();
                    if ($stories->count() === 0) return null;
                    $coverUrl = $hl->cover_image ? asset('storage/' . $hl->cover_image) : null;
                    if (!$coverUrl && $stories->count() > 0) {
                        $firstReviewStory = $stories->first(fn ($s) => isset($s['review']['game_cover']));
                        if ($firstReviewStory) {
                            $coverUrl = $firstReviewStory['review']['game_cover'];
                        }
                    }
                    return [
                        'id' => $hl->id,
                        'title' => $hl->title,
                        'cover_url' => $coverUrl,
                        'stories' => $stories,
                        'story_ids' => $hl->stories->pluck('id')->toArray(),
                    ];
                })
                ->filter()
                ->values();
        }

        return [
            ...parent::share($request),
            'auth' => [
                // Hanya kirim field yang benar-benar dibutuhkan UI.
                // Field lain (created_at, updated_at, dst.) tidak perlu terekspos ke browser.
                'user' => $user ? $user->only([
                    'id',
                    'name',
                    'email',
                    'email_verified_at',
                    'avatar',
                    'role',
                ]) : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'rank_up' => fn () => $request->session()->get('rank_up'),
            ],
            'myStories' => $myStories,
            'followingStoryGroups' => $followingStoryGroups,
            'highlights' => $user ? $highlights : [],
            'rawgAuthImages' => $rawgAuthImages,
        ];
    }
}
