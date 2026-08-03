<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [App\Http\Controllers\WelcomeController::class, 'index'])->name('welcome');

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
    Route::delete('/reviews/{review}', [App\Http\Controllers\ReviewController::class, 'destroy'])->name('reviews.destroy');
    Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::get('/users/{user}', [App\Http\Controllers\PublicProfileController::class, 'show'])->name('users.show');
});

require __DIR__.'/auth.php';