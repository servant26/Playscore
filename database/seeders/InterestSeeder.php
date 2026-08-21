<?php

namespace Database\Seeders;

use App\Models\Interest;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InterestSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Full RAWG API Official Genres + Popular Sub-genres
        $genres = [
            'Action',
            'Indie',
            'Adventure',
            'RPG',
            'Strategy',
            'Shooter',
            'Casual',
            'Simulation',
            'Puzzle',
            'Arcade',
            'Platformer',
            'Massively Multiplayer',
            'Racing',
            'Sports',
            'Fighting',
            'Family',
            'Board Games',
            'Educational',
            'Card',
            // Popular Sub-genres
            'MOBA',
            'Battle Royale',
            'Open World',
            'Horror',
        ];

        foreach ($genres as $genre) {
            Interest::firstOrCreate(
                ['slug' => Str::slug($genre)],
                ['name' => $genre]
            );
        }
    }
}