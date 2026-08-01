<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class PublicProfileController extends Controller
{
    public function show(User $user): Response
    {
        $reviews = $user->reviews()->with('game.interests')->latest()->get();

        $myListIds = auth()->user()
            ->gameList()
            ->pluck('games.id')
            ->toArray();

        return Inertia::render('Profile/PublicShow', [
            'profileUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
            ],
            'interests' => $user->interests()->get(['interests.id', 'interests.name']),
            'reviews' => $reviews,
            'myListIds' => $myListIds,
        ]);
    }
}