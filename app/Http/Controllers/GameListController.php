<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\RedirectResponse;

class GameListController extends Controller
{
    public function toggle(Game $game): RedirectResponse
    {
        $user = auth()->user();

        if ($user->gameList()->where('game_id', $game->id)->exists()) {
            $user->gameList()->detach($game->id);
        } else {
            $user->gameList()->attach($game->id);
        }

        return back();
    }
}