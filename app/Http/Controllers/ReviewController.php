<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Review;
use App\Notifications\GameAlsoReviewed;
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

        $isNewReview = !$game->reviews()->where('user_id', auth()->id())->exists();

        $review = $game->reviews()->updateOrCreate(
            ['user_id' => auth()->id()],
            [
                'rating' => $request->rating,
                'body' => $request->body,
            ]
        );

        if ($isNewReview) {
            $review->load('user', 'game');

            $otherReviewers = $game->reviews()
                ->where('user_id', '!=', auth()->id())
                ->with('user')
                ->get()
                ->pluck('user')
                ->unique('id');

            foreach ($otherReviewers as $reviewer) {
                $reviewer->notify(new GameAlsoReviewed($review));
            }
        }

        return back();
    }

    public function destroy(Review $review): RedirectResponse
    {
        abort_unless($review->user_id === auth()->id(), 403);

        $review->delete();

        return back();
    }
}