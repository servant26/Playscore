<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class PublicProfileController extends Controller
{
    public function show(User $user)
    {
        $reviews = $user->reviews()->with('game.interests')->latest()->get();

        $totalReviews = $reviews->count();
        $totalGamesInList = $user->gameList()->count();
        $averageScore = $totalReviews > 0 ? round($reviews->avg('rating'), 1) : 0;

        $reviewsByGenre = [];
        foreach ($reviews as $review) {
            if ($review->game && $review->game->interests) {
                foreach ($review->game->interests as $genre) {
                    $name = $genre->name;
                    $reviewsByGenre[$name] = ($reviewsByGenre[$name] ?? 0) + 1;
                }
            }
        }
        arsort($reviewsByGenre);

        $reviewsByYear = [];
        foreach ($reviews as $review) {
            if ($review->game) {
                $year = null;
                if (!empty($review->game->release_date)) {
                    $year = (string) \Carbon\Carbon::parse($review->game->release_date)->year;
                } elseif (!empty($review->game->release_year)) {
                    $year = (string) $review->game->release_year;
                }
                if ($year) {
                    $reviewsByYear[$year] = ($reviewsByYear[$year] ?? 0) + 1;
                }
            }
        }
        ksort($reviewsByYear);

        $ratingDistribution = [
            '1-3'  => 0,
            '4-6'  => 0,
            '7-8'  => 0,
            '9-10' => 0,
        ];
        foreach ($reviews as $review) {
            $r = (float) $review->rating;
            if ($r >= 1 && $r <= 3.9) {
                $ratingDistribution['1-3']++;
            } elseif ($r >= 4 && $r <= 6.9) {
                $ratingDistribution['4-6']++;
            } elseif ($r >= 7 && $r <= 8.9) {
                $ratingDistribution['7-8']++;
            } elseif ($r >= 9 && $r <= 10) {
                $ratingDistribution['9-10']++;
            }
        }

        $myListIds = auth()->user()
            ->gameList()
            ->pluck('games.id')
            ->toArray();

        $authUser = auth()->user();
        $isFollowing = $authUser ? $authUser->isFollowing($user) : false;
        $myInterestIds = $authUser ? $authUser->interests()->pluck('interests.id')->toArray() : [];
        $myReviewedGameIds = $authUser ? $authUser->reviews()->pluck('game_id')->toArray() : [];

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

        $userStoriesModels = \App\Models\Story::active()
            ->where('user_id', $user->id)
            ->with(['review.game', 'user'])
            ->oldest()
            ->get();

        $userStories = $userStoriesModels
            ->map($formatStory)
            ->filter()
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

        // Map only required fields to avoid sending unnecessary data & bloated payloads to frontend
        $mappedReviews = $reviews->map(function ($review) {
            return [
                'id' => $review->id,
                'rating' => (float) $review->rating,
                'body' => $review->body,
                'created_at' => $review->created_at ? $review->created_at->toISOString() : null,
                'game' => $review->game ? [
                    'id' => $review->game->id,
                    'title' => $review->game->title,
                    'slug' => $review->game->slug,
                    'cover_url' => $review->game->cover_url,
                    'release_date' => $review->game->release_date,
                    'interests' => $review->game->interests ? $review->game->interests->map(fn($i) => [
                        'id' => $i->id,
                        'name' => $i->name,
                    ]) : [],
                ] : null,
            ];
        })->values();

        return Inertia::render('Profile/PublicShow', [
            'profileUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
                'followers_count' => $user->followers()->count(),
                'following_count' => $user->following()->count(),
                'is_following' => $isFollowing,
            ],
            'userStories' => $userStories,
            'highlights' => $highlights,
            'interests' => $user->interests()->get(['interests.id', 'interests.name']),
            'myInterestIds' => $myInterestIds,
            'myReviewedGameIds' => $myReviewedGameIds,
            'reviews' => $mappedReviews,
            'myListIds' => $myListIds,
            'stats' => [
                'totalReviews' => $totalReviews,
                'totalGamesInList' => $totalGamesInList,
                'averageScore' => $averageScore,
                'reviewsByGenre' => $reviewsByGenre,
                'reviewsByYear' => $reviewsByYear,
                'ratingDistribution' => $ratingDistribution,
            ],
        ]);
    }
}