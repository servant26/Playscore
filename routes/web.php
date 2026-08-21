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
    $exists = \App\Models\User::where('email', $request->input('email'))->exists();
    return response()->json(['exists' => $exists]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/game-list/{game}/toggle', [App\Http\Controllers\GameListController::class, 'toggle'])->name('game-list.toggle');
    Route::get('/search', [App\Http\Controllers\SearchController::class, 'index'])->name('search');
    Route::post('/interests', [App\Http\Controllers\InterestController::class, 'update'])->name('interests.update');
    Route::post('/games/{game}/reviews', [App\Http\Controllers\ReviewController::class, 'store'])->name('reviews.store');
    Route::post('/reviews/{review}/story', [App\Http\Controllers\ReviewController::class, 'publishToStory'])->name('reviews.story');
    Route::post('/stories/rank', [App\Http\Controllers\ReviewController::class, 'publishRankStory'])->name('stories.rank');
    Route::delete('/stories/{story}', [App\Http\Controllers\ReviewController::class, 'destroyStory'])->name('stories.destroy');
    Route::post('/users/{user}/congratulate-rank', [App\Http\Controllers\ReviewController::class, 'congratulateRank'])->name('users.congratulate-rank');
    Route::delete('/reviews/{review}', [App\Http\Controllers\ReviewController::class, 'destroy'])->name('reviews.destroy');
    Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/unread', [App\Http\Controllers\NotificationController::class, 'unread'])->name('notifications.unread');
    Route::post('/notifications/{id}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::get('/users/{user}', [App\Http\Controllers\PublicProfileController::class, 'show'])->name('users.show');
    Route::post('/users/{user}/follow', [App\Http\Controllers\FollowController::class, 'toggle'])->name('users.follow');
    Route::get('/users/{user}/followers', [App\Http\Controllers\FollowController::class, 'followers'])->name('users.followers');
    Route::get('/users/{user}/following', [App\Http\Controllers\FollowController::class, 'following'])->name('users.following');

    Route::post('/highlights', [App\Http\Controllers\HighlightController::class, 'store'])->name('highlights.store');
    Route::post('/highlights/{highlight}/update', [App\Http\Controllers\HighlightController::class, 'update'])->name('highlights.update');
    Route::post('/highlights/{highlight}/stories', [App\Http\Controllers\HighlightController::class, 'addStory'])->name('highlights.add-story');
    Route::delete('/highlights/{highlight}', [App\Http\Controllers\HighlightController::class, 'destroy'])->name('highlights.destroy');
    Route::delete('/highlights/{highlight}/stories/{story}', [App\Http\Controllers\HighlightController::class, 'removeStory'])->name('highlights.remove-story');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [App\Http\Controllers\AdminController::class, 'index'])->name('dashboard');
    Route::post('/requests/{passwordResetRequest}/approve', [App\Http\Controllers\AdminController::class, 'approveRequest'])->name('requests.approve');
    Route::post('/users/{user}/reset-password', [App\Http\Controllers\AdminController::class, 'resetUserPassword'])->name('users.reset-password');
    Route::delete('/users/{user}', [App\Http\Controllers\AdminController::class, 'deleteUser'])->name('users.delete');
});

require __DIR__.'/auth.php';