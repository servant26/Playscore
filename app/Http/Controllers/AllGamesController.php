<?php

namespace App\Http\Controllers;

use App\Services\RawgService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AllGamesController extends Controller
{
    public function index(Request $request, RawgService $rawg): Response
    {
        $page = max(1, (int) $request->input('page', 1));

        $response = $rawg->popular($page);

        $games = collect($response['results'] ?? [])
            ->filter(fn ($item) => !empty($item['rating']))
            ->map(function ($item) {
                return [
                    'external_id' => $item['id'],
                    'title' => $item['name'],
                    'cover_url' => $item['background_image'],
                    'rawg_rating' => $item['rating'] ?? null,
                    'genres' => collect($item['genres'] ?? [])->pluck('name')->implode(', '),
                ];
            })
            ->values();

        $totalCount = $response['count'] ?? 0;
        $perPage = 20;
        $lastPage = (int) ceil($totalCount / $perPage);

        return Inertia::render('AllGames', [
            'games' => $games,
            'currentPage' => $page,
            'lastPage' => min($lastPage, 500),
        ]);
    }
}