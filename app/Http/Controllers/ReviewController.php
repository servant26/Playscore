<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, Game $game): RedirectResponse
    {
$request->validate([
            'rating' => ['required', 'numeric', 'min:0', 'max:10'],
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $game->reviews()->updateOrCreate(
            ['user_id' => auth()->id()],
            [
                'rating' => $request->rating,
                'body' => $request->body,
            ]
        );

        return back();
    }

    public function destroy(Review $review): RedirectResponse
    {
        abort_unless($review->user_id === auth()->id(), 403);

        $review->delete();

        return back();
    }
}