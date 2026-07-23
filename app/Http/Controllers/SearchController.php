<?php

namespace App\Http\Controllers;

use App\Services\RawgService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function index(Request $request, RawgService $rawg): Response
    {
        $query = $request->input('q', '');

        $games = collect();

        if ($query) {
            $response = $rawg->search($query);

            $games = collect($response['results'] ?? [])
                ->filter(fn ($item) => !empty($item['rating']))
                ->filter(fn ($item) => str_contains(
                    strtolower($item['name']),
                    strtolower($query)
                ))
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
        }

        return Inertia::render('Search', [
            'query' => $query,
            'games' => $games,
        ]);
    }
}