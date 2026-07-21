<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function index(\Illuminate\Http\Request $request): Response
    {
        $query = $request->input('q', '');

        $games = Game::with('interests')
            ->when($query, fn ($q) => $q->where('title', 'like', "%{$query}%"))
            ->orderByDesc('rawg_rating')
            ->get();

        $myListIds = auth()->user()
            ->gameList()
            ->pluck('games.id')
            ->toArray();

        return Inertia::render('Search', [
            'query' => $query,
            'games' => $games,
            'myListIds' => $myListIds,
        ]);
    }
}