<?php

namespace App\Console\Commands;

use App\Models\Game;
use App\Models\Interest;
use App\Services\RawgService;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class ImportRawgGames extends Command
{
    protected $signature = 'rawg:import-games {--pages=3 : Number of pages to import} {--type=popular : popular or new}';
    protected $description = 'Import games from RAWG API into the local games table';

    public function handle(RawgService $rawg): int
    {
        $pages = (int) $this->option('pages');
        $type = $this->option('type');

        $imported = 0;
        $skipped = 0;

        for ($page = 1; $page <= $pages; $page++) {
            $this->info("Fetching page {$page} ({$type})...");

            $response = $type === 'new'
                ? $rawg->newReleases($page)
                : $rawg->popular($page);

            $results = $response['results'] ?? [];

            if (empty($results)) {
                $this->warn("No results on page {$page}, stopping.");
                break;
            }

            foreach ($results as $item) {
                if (empty($item['background_image'])) {
                    $skipped++;
                    continue;
                }

                $trailers = $rawg->trailers($item['id']);
                $trailerUrl = $trailers[0]['data']['max'] ?? $trailers[0]['data']['480'] ?? null;

                $game = Game::updateOrCreate(
                    ['external_id' => $item['id']],
                    [
                        'title' => $item['name'],
                        'slug' => Str::slug($item['name']).'-'.$item['id'],
                        'cover_url' => $item['background_image'],
                        'trailer_url' => $trailerUrl,
                        'description' => null,
                        'release_date' => $item['released'] ?? null,
                        'rawg_rating' => $item['rating'] ?? null,
                    ]
                );

                $genreSlugs = collect($item['genres'] ?? [])->pluck('slug');

                if ($genreSlugs->isNotEmpty()) {
                    $interestIds = Interest::whereIn('slug', $genreSlugs)->pluck('id');
                    $game->interests()->syncWithoutDetaching($interestIds);
                }

                $imported++;
            }
        }

        $this->info("Import complete. Imported/updated: {$imported}, skipped (no image): {$skipped}.");

        return self::SUCCESS;
    }
}