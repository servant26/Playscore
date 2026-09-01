<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Services\RawgService;
use Illuminate\Http\RedirectResponse;

class GameListController extends Controller
{
    public function toggle($gameParam, RawgService $rawg): RedirectResponse
    {
        $user = auth()->user();

        $game = Game::where('id', $gameParam)
            ->orWhere('slug', $gameParam)
            ->orWhere('external_id', $gameParam)
            ->first();

        if (!$game && is_numeric($gameParam)) {
            try {
                $detail = $rawg->detail((int) $gameParam);
                if ($detail) {
                    $coverUrl = $detail['background_image'] ?? $detail['background_image_additional'] ?? null;
                    $trailers = $rawg->trailers((int) $gameParam);
                    $trailerUrl = $trailers[0]['data']['max'] ?? $trailers[0]['data']['480'] ?? null;

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
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('RAWG API Import failed in GameListController: ' . $e->getMessage());
            }
        }

        if ($game) {
            if ($user->gameList()->where('game_id', $game->id)->exists()) {
                $user->gameList()->detach($game->id);
            } else {
                $user->gameList()->attach($game->id);
            }
        }

        return back();
    }
}