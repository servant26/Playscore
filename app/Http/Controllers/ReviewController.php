<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Review;
use App\Notifications\GameAlsoReviewed;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, string $gameIdentifier): RedirectResponse
    {
        $request->validate([
            'rating' => ['required', 'numeric', 'min:0', 'max:10'],
            'body' => ['nullable', 'string', 'max:2000'],
        ]);

        // Find game by slug, id, or external_id (from RAWG API)
        $game = Game::where('slug', $gameIdentifier)
            ->orWhere('id', $gameIdentifier)
            ->orWhere('external_id', $gameIdentifier)
            ->first();

        // If game is not in database yet (e.g. searched directly from RAWG API), import it first
        if (!$game && is_numeric($gameIdentifier)) {
            $rawg = app(\App\Services\RawgService::class);
            $detail = $rawg->detail((int) $gameIdentifier);
            if ($detail) {
                $trailers = $rawg->trailers((int) $gameIdentifier);
                $trailerUrl = $trailers[0]['data']['max'] ?? $trailers[0]['data']['480'] ?? null;
                $coverUrl = $detail['background_image'] ?? $detail['background_image_additional'] ?? null;

                $game = Game::create([
                    'external_id' => $detail['id'],
                    'title' => $detail['name'],
                    'slug' => \Illuminate\Support\Str::slug($detail['name']).'-'.$detail['id'],
                    'cover_url' => $coverUrl,
                    'trailer_url' => $trailerUrl,
                    'description' => strip_tags($detail['description'] ?? ''),
                    'release_date' => $detail['released'] ?? null,
                    'developer' => $detail['developers'][0]['name'] ?? null,
                    'publisher' => $detail['publishers'][0]['name'] ?? null,
                    'rawg_rating' => $detail['rating'] ?? null,
                ]);

                $genreSlugs = collect($detail['genres'] ?? [])->pluck('slug');
                if ($genreSlugs->isNotEmpty()) {
                    $interestIds = \App\Models\Interest::whereIn('slug', $genreSlugs)->pluck('id');
                    $game->interests()->sync($interestIds);
                }
            }
        }

        if (!$game) {
            abort(404, 'Game not found.');
        }

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

        if ($request->boolean('post_to_story')) {
            \App\Models\Story::updateOrCreate(
                ['review_id' => $review->id],
                [
                    'user_id' => auth()->id(),
                    'expires_at' => now()->addHours(24),
                ]
            );
        }

        if ($isNewReview) {
            $totalReviews = auth()->user()->reviews()->count();
            $rankThresholds = [10, 25, 100, 250, 500, 1000];

            if (in_array($totalReviews, $rankThresholds)) {
                session()->flash('rank_up', [
                    'new_count' => $totalReviews,
                    'review_id' => $review->id,
                ]);
            }
        }

        return back();
    }

    public function publishToStory(Review $review): RedirectResponse
    {
        abort_unless($review->user_id === auth()->id(), 403);

        \App\Models\Story::updateOrCreate(
            ['review_id' => $review->id],
            [
                'user_id' => auth()->id(),
                'type' => 'review',
                'expires_at' => now()->addHours(24),
            ]
        );

        return back()->with('success', 'Published to story!');
    }

    public function publishRankStory(Request $request): RedirectResponse
    {
        $request->validate([
            'rank_name' => ['required', 'string'],
            'rank_count' => ['required', 'integer'],
        ]);

        \App\Models\Story::create([
            'user_id' => auth()->id(),
            'type' => 'rank_up',
            'rank_name' => $request->rank_name,
            'rank_count' => $request->rank_count,
            'expires_at' => now()->addHours(24),
        ]);

        return back()->with('success', 'Rank achievement posted to story!');
    }

    public function destroyStory(\App\Models\Story $story): RedirectResponse
    {
        abort_unless($story->user_id === auth()->id(), 403);

        $story->delete();
        \App\Models\Highlight::whereDoesntHave('stories')->delete();

        return back()->with('success', 'Story deleted!');
    }

    public function congratulateRank(Request $request, \App\Models\User $user): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'rank_name' => ['required', 'string'],
            'message' => ['nullable', 'string', 'max:500'],
        ]);

        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot congratulate yourself'], 422);
        }

        $messageText = trim($request->message) ?: "Congratulations on reaching {$request->rank_name}! 🎉";

        $user->notify(new \App\Notifications\RankCongratulated(
            auth()->user(),
            $request->rank_name,
            $messageText
        ));

        return response()->json(['success' => true, 'message' => 'Congratulations sent!']);
    }

    public function destroy(Review $review): RedirectResponse
    {
        abort_unless($review->user_id === auth()->id(), 403);

        $review->delete();
        \App\Models\Highlight::whereDoesntHave('stories')->delete();

        return back();
    }
}