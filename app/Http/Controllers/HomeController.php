<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $topHits = Game::with('interests')
            ->orderByDesc('rawg_rating')
            ->take(10)
            ->get();

        $newGames = Game::with('interests')
            ->orderByDesc('release_date')
            ->take(10)
            ->get();

        $myListIds = auth()->user()
            ->gameList()
            ->pluck('games.id')
            ->toArray();

        return Inertia::render('Home', [
            'topHits' => $topHits,
            'newGames' => $newGames,
            'myListIds' => $myListIds,
        ]);
    }
}