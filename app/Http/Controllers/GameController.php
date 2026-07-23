<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Interest;
use App\Services\RawgService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    public function show(Game $game): Response
    {
        $game->load([
            'interests',
            'comments' => fn ($q) => $q->with('user')->latest(),
        ]);

        $userReview = auth()->user()
            ->reviews()
            ->where('game_id', $game->id)
            ->first();

        $moreLikeThis = Game::with('interests')
            ->whereHas('interests', function ($q) use ($game) {
                $q->whereIn('interests.id', $game->interests->pluck('id'));
            })
            ->where('id', '!=', $game->id)
            ->inRandomOrder()
            ->limit(6)
            ->get();

        $isInList = auth()->user()
            ->gameList()
            ->where('game_id', $game->id)
            ->exists();

        $myListIds = auth()->user()
            ->gameList()
            ->pluck('games.id')
            ->toArray();

        return Inertia::render('Games/Show', [
            'game' => $game,
            'userReview' => $userReview,
            'moreLikeThis' => $moreLikeThis,
            'isInList' => $isInList,
            'myListIds' => $myListIds,
            'reviewsCount' => $game->reviews()->count(),
            'averageRating' => round($game->reviews()->avg('rating') ?? 0, 1),
        ]);
    }

    public function importAndShow(int $external_id, RawgService $rawg): RedirectResponse
    {
        $game = Game::where('external_id', $external_id)->first();

        if (!$game) {
            $detail = $rawg->detail($external_id);

            if (!$detail) {
                abort(404);
            }

            $trailers = $rawg->trailers($external_id);
            $trailerUrl = $trailers[0]['data']['max'] ?? $trailers[0]['data']['480'] ?? null;

            $game = Game::create([
                'external_id' => $detail['id'],
                'title' => $detail['name'],
                'slug' => \Illuminate\Support\Str::slug($detail['name']).'-'.$detail['id'],
                'cover_url' => $detail['background_image'],
                'trailer_url' => $trailerUrl,
                'description' => strip_tags($detail['description'] ?? ''),
                'release_date' => $detail['released'] ?? null,
                'developer' => $detail['developers'][0]['name'] ?? null,
                'publisher' => $detail['publishers'][0]['name'] ?? null,
                'rawg_rating' => $detail['rating'] ?? null,
            ]);

            $genreSlugs = collect($detail['genres'] ?? [])->pluck('slug');

            if ($genreSlugs->isNotEmpty()) {
                $interestIds = Interest::whereIn('slug', $genreSlugs)->pluck('id');
                $game->interests()->sync($interestIds);
            }
        }

        return redirect()->route('games.show', $game->slug);
    }
}