<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [App\Http\Controllers\HomeController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/games/{game}', [App\Http\Controllers\GameController::class, 'show'])
    ->middleware(['auth', 'verified'])
    ->name('games.show');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/game-list/{game}/toggle', [App\Http\Controllers\GameListController::class, 'toggle'])->name('game-list.toggle');
    Route::get('/search', [App\Http\Controllers\SearchController::class, 'index'])->name('search');
    Route::post('/interests', [App\Http\Controllers\InterestController::class, 'update'])->name('interests.update');
    Route::post('/games/{game}/reviews', [App\Http\Controllers\ReviewController::class, 'store'])->name('reviews.store');
    Route::post('/games/{game}/comments', [App\Http\Controllers\CommentController::class, 'store'])->name('comments.store');
    Route::delete('/comments/{comment}', [App\Http\Controllers\CommentController::class, 'destroy'])->name('comments.destroy');
});

require __DIR__.'/auth.php';