<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        $userInterestIds = $user->interests()->pluck('interests.id');
        $gameListIds = $user->gameList()->pluck('games.id');

        $recommendations = \App\Models\Game::with('interests')
            ->whereHas('interests', function ($q) use ($userInterestIds) {
                $q->whereIn('interests.id', $userInterestIds);
            })
            ->whereNotIn('id', $gameListIds)
            ->inRandomOrder()
            ->limit(10)
            ->get();

        $myReviewsWithGame = $user->reviews()
            ->with(['game.interests'])
            ->latest()
            ->get();

        // Stats calculation from reviewed games
        $genreCounts = [];
        $yearCounts = [];
        $ratingDistribution = [
            '1-3' => 0,
            '4-6' => 0,
            '7-8' => 0,
            '9-10' => 0,
        ];

        foreach ($myReviewsWithGame as $rev) {
            if ($rev->game && $rev->game->interests) {
                foreach ($rev->game->interests as $genre) {
                    $genreCounts[$genre->name] = ($genreCounts[$genre->name] ?? 0) + 1;
                }
            }

            if ($rev->game && $rev->game->release_date) {
                $year = (string) \Carbon\Carbon::parse($rev->game->release_date)->year;
                $yearCounts[$year] = ($yearCounts[$year] ?? 0) + 1;
            }

            $score = (float) $rev->rating;
            if ($score <= 3.9) {
                $ratingDistribution['1-3']++;
            } elseif ($score <= 6.9) {
                $ratingDistribution['4-6']++;
            } elseif ($score <= 8.9) {
                $ratingDistribution['7-8']++;
            } else {
                $ratingDistribution['9-10']++;
            }
        }

        ksort($yearCounts);
        arsort($genreCounts);

        $avgScore = $myReviewsWithGame->count() > 0
            ? round($myReviewsWithGame->avg('rating'), 1)
            : 0;

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

        // Archived Stories (All stories created by the user, saved permanently)
        $myArchivedStories = \App\Models\Story::where('user_id', $user->id)
            ->with(['review.game', 'user'])
            ->latest()
            ->get()
            ->map($formatStory)
            ->filter()
            ->values();

        // All User Stories (Active + Archived combined for highlights creation & viewing)
        $allUserStories = \App\Models\Story::where('user_id', $user->id)
            ->with(['review.game', 'user'])
            ->latest()
            ->get()
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

        $highlights = $user->highlights()
            ->has('stories')
            ->with(['stories.review.game', 'stories.user'])
            ->orderBy('order', 'asc')
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

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'followersCount' => $user->followers()->count(),
            'followingCount' => $user->following()->count(),
            'allInterests' => \App\Models\Interest::orderBy('name')->get(['id', 'name', 'slug']),
            'userInterestIds' => $userInterestIds,
            'recommendations' => $recommendations,
            'gameList' => $user->gameList()->with('interests')->get(),
            'myReviews' => $myReviewsWithGame,
            'myStories' => $myStories,
            'myArchivedStories' => $myArchivedStories,
            'allUserStories' => $allUserStories,
            'followingStoryGroups' => $followingStoryGroups,
            'highlights' => $highlights,
            'stats' => [
                'totalReviews' => $myReviewsWithGame->count(),
                'totalGamesInList' => $user->gameList()->count(),
                'averageScore' => $avgScore,
                'reviewsByGenre' => $genreCounts,
                'reviewsByYear' => $yearCounts,
                'ratingDistribution' => $ratingDistribution,
            ],
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        $user->fill($request->safe()->except('avatar'));

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar);
            }

            $user->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        $user->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
