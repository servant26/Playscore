<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$rawg = new \App\Services\RawgService();
$game = \App\Models\Game::where('title', 'like', '%Ninja STORM 2%')->first();

echo "DB Game ID: {$game->id} | Title: {$game->title} | External ID: {$game->external_id} | Cover: {$game->cover_url}\n\n";

if ($game->external_id) {
    $detail = $rawg->detail($game->external_id);
    echo "RAWG Detail by external_id ({$game->external_id}):\n";
    echo "Title: " . ($detail['name'] ?? 'NULL') . "\n";
    echo "Bg image: " . ($detail['background_image'] ?? 'NULL') . "\n\n";
}

$search = $rawg->search("NARUTO SHIPPUDEN: Ultimate Ninja STORM 2");
echo "RAWG Search results for 'NARUTO SHIPPUDEN: Ultimate Ninja STORM 2':\n";
foreach (array_slice($search['results'] ?? [], 0, 5) as $res) {
    echo "ID: {$res['id']} | Name: {$res['name']} | Img: {$res['background_image']}\n";
}
