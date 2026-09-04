<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [App\Http\Controllers\WelcomeController::class, 'index'])->name('welcome');
Route::get('/about', [App\Http\Controllers\AboutController::class, 'index'])->name('about');
Route::get('/blog', [App\Http\Controllers\BlogController::class, 'index'])->name('blog');
Route::get('/blog/{id}', [App\Http\Controllers\BlogController::class, 'show'])->name('blog.show');
Route::get('/reviews-community', [App\Http\Controllers\PublicReviewsController::class, 'index'])->name('reviews.index');
Route::get('/games', [App\Http\Controllers\PublicGamesController::class, 'index'])->name('games.index');
Route::get('/leaderboard', [App\Http\Controllers\LeaderboardController::class, 'index'])->name('leaderboard');

// SEO: Dynamic XML Sitemap for Googlebot
Route::get('/sitemap.xml', function () {
    $baseUrl = config('app.url', 'https://playscore.my.id');
    $articles = \App\Models\Article::latest()->get(['id', 'updated_at']);

    $xml = '<?xml version="1.0" encoding="UTF-8"?>';
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    // Static public pages
    $staticRoutes = ['/', '/about', '/blog', '/reviews-community', '/games', '/leaderboard'];
    foreach ($staticRoutes as $route) {
        $xml .= '<url>';
        $xml .= '<loc>' . rtrim($baseUrl, '/') . $route . '</loc>';
        $xml .= '<changefreq>daily</changefreq>';
        $xml .= '<priority>' . ($route === '/' ? '1.0' : '0.8') . '</priority>';
        $xml .= '</url>';
    }

    // Dynamic blog articles
    foreach ($articles as $article) {
        $xml .= '<url>';
        $xml .= '<loc>' . rtrim($baseUrl, '/') . '/blog/' . $article->id . '</loc>';
        $xml .= '<lastmod>' . ($article->updated_at ? $article->updated_at->toAtomString() : now()->toAtomString()) . '</lastmod>';
        $xml .= '<changefreq>weekly</changefreq>';
        $xml .= '<priority>0.7</priority>';
        $xml .= '</url>';
    }

    $xml .= '</urlset>';

    return response($xml, 200)->header('Content-Type', 'text/xml');
});

Route::get('/dashboard', [App\Http\Controllers\HomeController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/all-games', [App\Http\Controllers\AllGamesController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('all-games');

Route::get('/games/rawg/{external_id}', [App\Http\Controllers\GameController::class, 'importAndShow'])
    ->middleware(['auth', 'verified'])
    ->name('games.import-and-show');

Route::get('/games/{game}', [App\Http\Controllers\GameController::class, 'show'])
    ->middleware(['auth', 'verified'])
    ->name('games.show');

Route::post('/check-email', function (\Illuminate\Http\Request $request) {
    // Validasi format email dulu sebelum query ke DB
    $email = $request->input('email', '');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return response()->json(['available' => true]); // Email tidak valid = tidak ada di DB
    }

    $hash = \App\Models\User::hashEmail($email);
    $exists = \App\Models\User::where('email_hash', $hash)->exists();

    // Gunakan key 'available' (bukan 'exists') — lebih netral dan tidak eksplisit
    // Rate limit sangat ketat: 5 request per menit per IP
    return response()->json(['available' => !$exists]);
})->middleware('throttle:5,1');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/game-list/{game}/toggle', [App\Http\Controllers\GameListController::class, 'toggle'])
        ->middleware('throttle:30,1')   // 30/menit — wajar untuk toggle daftar game
        ->name('game-list.toggle');

    Route::get('/search', [App\Http\Controllers\SearchController::class, 'index'])
        ->middleware('throttle:60,1')
        ->name('search');

    Route::post('/interests', [App\Http\Controllers\InterestController::class, 'update'])
        ->middleware('throttle:10,1')   // 10/menit — jarang diupdate
        ->name('interests.update');

    Route::post('/games/{game}/reviews', [App\Http\Controllers\ReviewController::class, 'store'])
        ->middleware('throttle:15,1')
        ->name('reviews.store');

    Route::delete('/reviews/{review}', [App\Http\Controllers\ReviewController::class, 'destroy'])
        ->middleware('throttle:10,1')   // 10/menit — cegah mass delete
        ->name('reviews.destroy');

    Route::post('/reviews/{review}/story', [App\Http\Controllers\ReviewController::class, 'publishToStory'])
        ->middleware('throttle:20,1')   // 20/menit — publish story dari review
        ->name('reviews.story');

    Route::post('/stories/rank', [App\Http\Controllers\ReviewController::class, 'publishRankStory'])
        ->middleware('throttle:5,1')    // 5/menit — posting rank story jarang dilakukan
        ->name('stories.rank');

    Route::get('/stories/feed', [App\Http\Controllers\ReviewController::class, 'storiesFeed'])
        ->name('stories.feed');

    Route::delete('/stories/{story}', [App\Http\Controllers\ReviewController::class, 'destroyStory'])
        ->middleware('throttle:10,1')   // 10/menit — cegah mass delete story
        ->name('stories.destroy');

    Route::post('/users/{user}/congratulate-rank', [App\Http\Controllers\ReviewController::class, 'congratulateRank'])
        ->middleware('throttle:10,1')
        ->name('users.congratulate-rank');

    Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/unread', [App\Http\Controllers\NotificationController::class, 'unread'])->name('notifications.unread');

    Route::post('/notifications/{id}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead'])
        ->middleware('throttle:60,1')   // 60/menit — wajar saat user aktif baca notif
        ->name('notifications.read');

    Route::post('/notifications/read-all', [App\Http\Controllers\NotificationController::class, 'markAllAsRead'])
        ->middleware('throttle:10,1')   // 10/menit — tombol "baca semua"
        ->name('notifications.read-all');

    Route::get('/users/{user}', [App\Http\Controllers\PublicProfileController::class, 'show'])->name('users.show');

    Route::post('/users/{user}/follow', [App\Http\Controllers\FollowController::class, 'toggle'])
        ->middleware('throttle:30,1')
        ->name('users.follow');

    Route::get('/users/{user}/followers', [App\Http\Controllers\FollowController::class, 'followers'])->name('users.followers');
    Route::get('/users/{user}/following', [App\Http\Controllers\FollowController::class, 'following'])->name('users.following');

    // Highlight routes
    Route::post('/highlights', [App\Http\Controllers\HighlightController::class, 'store'])
        ->middleware('throttle:20,1')   // 20/menit — buat highlight baru
        ->name('highlights.store');

    Route::post('/highlights/reorder', [App\Http\Controllers\HighlightController::class, 'reorder'])
        ->middleware('throttle:20,1')   // 20/menit — drag-drop reorder
        ->name('highlights.reorder');

    Route::post('/highlights/{highlight}/update', [App\Http\Controllers\HighlightController::class, 'update'])
        ->middleware('throttle:20,1')   // 20/menit — edit highlight
        ->name('highlights.update');

    Route::post('/highlights/{highlight}/stories', [App\Http\Controllers\HighlightController::class, 'addStory'])
        ->middleware('throttle:30,1')   // 30/menit — tambah story ke highlight
        ->name('highlights.add-story');

    Route::delete('/highlights/{highlight}', [App\Http\Controllers\HighlightController::class, 'destroy'])
        ->middleware('throttle:5,1')    // 5/menit — hapus highlight (operasi destruktif)
        ->name('highlights.destroy');

    Route::delete('/highlights/{highlight}/stories/{story}', [App\Http\Controllers\HighlightController::class, 'removeStory'])
        ->middleware('throttle:10,1')   // 10/menit — hapus story dari highlight
        ->name('highlights.remove-story');
});


Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [App\Http\Controllers\AdminController::class, 'index'])->name('dashboard');
    Route::post('/requests/{passwordResetRequest}/approve', [App\Http\Controllers\AdminController::class, 'approveRequest'])->name('requests.approve');
    Route::post('/users/{user}/reset-password', [App\Http\Controllers\AdminController::class, 'resetUserPassword'])->name('users.reset-password');
    Route::delete('/users/{user}', [App\Http\Controllers\AdminController::class, 'deleteUser'])->name('users.delete');

    // Article Management Routes
    Route::resource('articles', App\Http\Controllers\Admin\AdminArticleController::class)->except(['show']);
    Route::patch('/articles/{article}/toggle-status', [App\Http\Controllers\Admin\AdminArticleController::class, 'toggleStatus'])->name('articles.toggle-status');
});

require __DIR__.'/auth.php';