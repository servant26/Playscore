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

            // 2. Search Users in Database
            $users = User::where('id', '!=', auth()->id())
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

        return Inertia::render('Search', [
            'query' => $query,
            'games' => $games,
            'users' => $users,
        ]);
    }
}