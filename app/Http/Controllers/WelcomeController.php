<?php

namespace App\Http\Controllers;

use App\Services\RawgService;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function index(RawgService $rawg): Response
    {
        try {
            // Fetch popular games with random page (1-3) and shuffle to randomize on every refresh
            $randomPage = rand(1, 3);
            $popularResponse = $rawg->popular($randomPage);
            $results = collect($popularResponse['results'] ?? [])
                ->filter(fn ($item) => !empty($item['background_image']))
                ->shuffle()
                ->take(6);

            $rawCount = $popularResponse['count'] ?? 870000;
            if ($rawCount >= 1000000) {
                $totalGamesCount = (floor($rawCount / 100000) / 10) . 'M+';
            } else if ($rawCount >= 1000) {
                $totalGamesCount = (floor($rawCount / 10000) * 10) . 'K+';
            } else {
                $totalGamesCount = $rawCount . '+';
            }

            $previewGames = $results->map(function ($item) {
                return [
                    'external_id' => $item['id'],
                    'title' => $item['name'],
                    'cover_url' => $item['background_image'] ?? $item['background_image_additional'] ?? null,
                    'rawg_rating' => $item['rating'] ?? null,
                ];
            })->values();
        } catch (\Throwable $e) {
            $previewGames = collect([]);
            $totalGamesCount = '800K+';
        }

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'previewGames' => $previewGames,
            'totalGamesCount' => $totalGamesCount,
        ]);
    }
}