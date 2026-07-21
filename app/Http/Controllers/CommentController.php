<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Game $game): RedirectResponse
    {
        $request->validate([
            'body' => ['required', 'string', 'max:1000'],
        ]);

        $game->comments()->create([
            'user_id' => auth()->id(),
            'body' => $request->body,
        ]);

        return back();
    }

    public function destroy(\App\Models\Comment $comment): RedirectResponse
    {
        abort_unless($comment->user_id === auth()->id(), 403);

        $comment->delete();

        return back();
    }
}