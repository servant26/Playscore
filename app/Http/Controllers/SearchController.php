<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\RawgService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function index(Request $request, RawgService $rawg): Response
    {
        $query = trim($request->input('q', ''));

        $games = collect();
        $users = collect();

        if ($query) {
            // 1. Search Games from RAWG API
            try {
                $response = $rawg->search($query);

                $games = collect($response['results'] ?? [])
                    ->filter(fn ($item) => !empty($item['rating']))
                    ->filter(fn ($item) => str_contains(
                        strtolower($item['name']),
                        strtolower($query)
                    ))
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
                    ->values();
            } catch (\Throwable $e) {
                $games = collect();
            }

            // 2. Search Users in Database (Exclude Admin)
            $users = User::where(function ($q) {
                    $q->where('role', '!=', 'admin')->orWhereNull('role');
                })
                ->where(function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                      ->orWhere('email', 'like', "%{$query}%");
                })
                ->get()
                ->map(function ($u) {
                    $reviews = $u->reviews()->with('game.interests')->get();
                    $totalReviews = $reviews->count();

                    $genreCounts = [];
                    foreach ($reviews as $review) {
                        if ($review->game && $review->game->interests) {
                            foreach ($review->game->interests as $genre) {
                                $name = $genre->name;
                                $genreCounts[$name] = ($genreCounts[$name] ?? 0) + 1;
                            }
                        }
                    }
                    arsort($genreCounts);
                    $topGenres = array_slice(array_keys($genreCounts), 0, 3);

                    if (empty($topGenres)) {
                        $topGenres = $u->interests()->take(3)->pluck('name')->toArray();
                    }

                    return [
                        'id' => $u->id,
                        'name' => $u->name,
                        'avatar' => $u->avatar,
                        'total_reviews' => $totalReviews,
                        'top_genres' => $topGenres,
                    ];
                })
                ->values();
        }

        // 3. Compute 10 Closest Recommended Users based on interests, game list, & reviews (Exclude Admin)
        $authUser = auth()->user();
        $recommendedUsers = collect();

        if ($authUser) {
            $myInterestIds = $authUser->interests()->pluck('interests.id')->map(fn($id) => (int)$id)->toArray();
            $myGameListIds = $authUser->gameList()->pluck('games.id')->map(fn($id) => (int)$id)->toArray();
            $myReviewMap = $authUser->reviews()->pluck('rating', 'game_id')->toArray();
            $myReviewedGameIds = array_keys($myReviewMap);

            $candidates = User::where('id', '!=', $authUser->id)
                ->where(function ($q) {
                    $q->where('role', '!=', 'admin')->orWhereNull('role');
                })
                ->where('name', 'not like', '%test%')
                ->where('email', 'not like', '%test%')
                ->with(['interests', 'gameList', 'reviews.game.interests'])
                ->get();

            $scoredCandidates = $candidates->map(function ($u) use ($authUser, $myInterestIds, $myGameListIds, $myReviewMap, $myReviewedGameIds) {
                // Shared interests
                $theirInterestIds = $u->interests->pluck('id')->map(fn($id) => (int)$id)->toArray();
                $sharedInterests = array_intersect($myInterestIds, $theirInterestIds);
                $sharedInterestsCount = count($sharedInterests);

                // Shared game list
                $theirGameListIds = $u->gameList->pluck('id')->map(fn($id) => (int)$id)->toArray();
                $sharedGameList = array_intersect($myGameListIds, $theirGameListIds);
                $sharedGameListCount = count($sharedGameList);

                // Shared reviews & rating proximity
                $theirReviewMap = $u->reviews->pluck('rating', 'game_id')->toArray();
                $theirReviewedGameIds = array_keys($theirReviewMap);
                $sharedReviews = array_intersect($myReviewedGameIds, $theirReviewedGameIds);
                $sharedReviewsCount = count($sharedReviews);

                $ratingBonus = 0;
                foreach ($sharedReviews as $gId) {
                    $diff = abs(($myReviewMap[$gId] ?? 0) - ($theirReviewMap[$gId] ?? 0));
                    if ($diff <= 1.0) {
                        $ratingBonus += 2;
                    }
                }

                $totalScore = ($sharedInterestsCount * 15) + ($sharedGameListCount * 10) + ($sharedReviewsCount * 10) + $ratingBonus;

                $genreCounts = [];
                foreach ($u->reviews as $review) {
                    if ($review->game && $review->game->interests) {
                        foreach ($review->game->interests as $genre) {
                            $genreCounts[$genre->name] = ($genreCounts[$genre->name] ?? 0) + 1;
                        }
                    }
                }
                arsort($genreCounts);
                $topGenres = array_slice(array_keys($genreCounts), 0, 3);
                if (empty($topGenres)) {
                    $topGenres = $u->interests->take(3)->pluck('name')->toArray();
                }

                $matchPercentage = 0;
                if ($totalScore > 0) {
                    $matchPercentage = min(99, max(65, 65 + ($totalScore * 2)));
                } else {
                    $matchPercentage = min(75, 50 + ($u->reviews->count() * 3));
                }

                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'avatar' => $u->avatar,
                    'total_reviews' => $u->reviews->count(),
                    'top_genres' => $topGenres,
                    'match_score' => $totalScore,
                    'match_percentage' => $matchPercentage,
                    'shared_interests_count' => $sharedInterestsCount,
                    'shared_gamelist_count' => $sharedGameListCount,
                    'shared_reviews_count' => $sharedReviewsCount,
                    'is_following' => $authUser->isFollowing($u),
                ];
            });

            $recommendedUsers = $scoredCandidates
                ->sortByDesc(function ($item) {
                    return [$item['match_score'], $item['total_reviews']];
                })
                ->take(10)
                ->values();
        }

        return Inertia::render('Search', [
            'query' => $query,
            'games' => $games,
            'users' => $users,
            'recommendedUsers' => $recommendedUsers,
        ]);
    }
}