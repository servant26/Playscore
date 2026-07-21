<?php

namespace App\Console\Commands;

use App\Models\Interest;
use App\Services\RawgService;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class SyncRawgGenres extends Command
{
    protected $signature = 'rawg:sync-genres';
    protected $description = 'Sync game genres from RAWG API into the interests table';

    public function handle(RawgService $rawg): int
    {
        $this->info('Fetching genres from RAWG...');

        $genres = $rawg->genres();

        if (empty($genres)) {
            $this->error('No genres returned from RAWG API.');
            return self::FAILURE;
        }

        $created = 0;
        $updated = 0;

        foreach ($genres as $genre) {
            $slug = Str::slug($genre['name']);

            $interest = Interest::updateOrCreate(
                ['slug' => $slug],
                ['name' => $genre['name']]
            );

            $interest->wasRecentlyCreated ? $created++ : $updated++;
        }

        $this->info("Done. Created: {$created}, Updated: {$updated}.");

        return self::SUCCESS;
    }
}