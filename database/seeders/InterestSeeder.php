<?php

namespace Database\Seeders;

use App\Models\Interest;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InterestSeeder extends Seeder
{
    public function run(): void
    {
        $genres = [
            'Action',
            'Adventure',
            'RPG',
            'Strategy',
            'Simulation',
            'Sports',
            'Racing',
            'Fighting',
            'Puzzle',
            'Horror',
            'Shooter',
            'Platformer',
            'MOBA',
            'Battle Royale',
            'Open World',
            'Indie',
        ];

        foreach ($genres as $genre) {
            Interest::create([
                'name' => $genre,
                'slug' => Str::slug($genre),
            ]);
        }
    }
}