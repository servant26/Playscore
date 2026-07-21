<?php

namespace App\Http\Controllers;

use App\Models\Game;
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

        return Inertia::render('Games/Show', [
            'game' => $game,
            'userReview' => $userReview,
            'moreLikeThis' => $moreLikeThis,
            'isInList' => $isInList,
            'reviewsCount' => $game->reviews()->count(),
            'averageRating' => round($game->reviews()->avg('rating') ?? 0, 1),
        ]);
    }
}