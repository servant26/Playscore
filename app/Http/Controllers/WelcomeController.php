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
        $response = $rawg->popular(1);

        $previewGames = collect($response['results'] ?? [])
            ->filter(fn ($item) => !empty($item['rating']))
            ->take(6)
            ->map(fn ($item) => [
                'external_id' => $item['id'],
                'title' => $item['name'],
                'cover_url' => $item['background_image'],
                'rawg_rating' => $item['rating'] ?? null,
            ])
            ->values();

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'previewGames' => $previewGames,
        ]);
    }
}