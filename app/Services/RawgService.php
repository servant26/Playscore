<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class RawgService
{
    protected string $baseUrl = 'https://api.rawg.io/api';
    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.rawg.key');
    }

    /**
     * Search games by keyword.
     */
    public function search(string $query, int $page = 1): array
    {
        $response = Http::get("{$this->baseUrl}/games", [
            'key' => $this->apiKey,
            'search' => $query,
            'page' => $page,
            'page_size' => 20,
        ]);

        return $response->json() ?? [];
    }

    /**
     * Get a list of popular/new games (for homepage).
     */
    public function popular(int $page = 1): array
    {
        $response = Http::get("{$this->baseUrl}/games", [
            'key' => $this->apiKey,
            'ordering' => '-added',
            'page' => $page,
            'page_size' => 20,
        ]);

        return $response->json() ?? [];
    }

    /**
     * Get new releases (for "New Games" section).
     */
    public function newReleases(int $page = 1): array
    {
        $today = now()->format('Y-m-d');
        $sixMonthsAgo = now()->subMonths(6)->format('Y-m-d');

        $response = Http::get("{$this->baseUrl}/games", [
            'key' => $this->apiKey,
            'dates' => "{$sixMonthsAgo},{$today}",
            'ordering' => '-rating',
            'page' => $page,
            'page_size' => 40,
        ]);

        return $response->json() ?? [];
    }

    /**
     * Get full detail of a single game by its RAWG id.
     */
    public function detail(int $externalId): ?array
    {
        $response = Http::get("{$this->baseUrl}/games/{$externalId}", [
            'key' => $this->apiKey,
        ]);

        return $response->successful() ? $response->json() : null;
    }

    /**
     * Get trailers/movies for a game.
     */
    public function trailers(int $externalId): array
    {
        $response = Http::get("{$this->baseUrl}/games/{$externalId}/movies", [
            'key' => $this->apiKey,
        ]);

        return $response->json()['results'] ?? [];
    }

    /**
     * Get game genres list from RAWG (useful for mapping to our interests).
     */
    public function genres(): array
    {
        $response = Http::get("{$this->baseUrl}/genres", [
            'key' => $this->apiKey,
        ]);

        return $response->json()['results'] ?? [];
    }
}