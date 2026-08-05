<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function index(): Response
    {
        $previewGames = Game::whereNotNull('cover_url')
            ->whereNotNull('rawg_rating')
            ->inRandomOrder()
            ->take(6)
            ->get(['external_id', 'title', 'cover_url', 'rawg_rating']);

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'previewGames' => $previewGames,
        ]);
    }
}