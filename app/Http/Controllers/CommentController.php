<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Game;
use App\Notifications\CommentReplied;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Game $game): RedirectResponse
    {
        $request->validate([
            'body' => ['required', 'string', 'max:1000'],
            'parent_id' => ['nullable', 'exists:comments,id'],
        ]);

        $comment = $game->comments()->create([
            'user_id' => auth()->id(),
            'parent_id' => $request->parent_id,
            'body' => $request->body,
        ]);

        if ($request->parent_id) {
            $parentComment = Comment::with('user')->find($request->parent_id);

            if ($parentComment && $parentComment->user_id !== auth()->id()) {
                $comment->load('user', 'game');
                $parentComment->user->notify(new CommentReplied($comment));
            }
        }

        return back();
    }

    public function destroy(Comment $comment): RedirectResponse
    {
        abort_unless($comment->user_id === auth()->id(), 403);

        $comment->delete();

        return back();
    }
}