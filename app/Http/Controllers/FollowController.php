<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\UserFollowed;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    public function toggle(Request $request, User $user): RedirectResponse
    {
        $authUser = auth()->user();

        if ($authUser->id === $user->id) {
            return back();
        }

        $isFollowing = $authUser->isFollowing($user);

        if ($isFollowing) {
            $authUser->following()->detach($user->id);
        } else {
            $authUser->following()->attach($user->id);
            $user->notify(new UserFollowed($authUser));
        }

        return back();
    }

    public function followers(User $user): JsonResponse
    {
        $authUser = auth()->user();

        $followers = $user->followers()
            ->withCount('reviews')
            ->get()
            ->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'avatar' => $u->avatar,
                'reviews_count' => $u->reviews_count,
                'is_following' => $authUser ? $authUser->isFollowing($u) : false,
                'is_self' => $authUser ? $authUser->id === $u->id : false,
            ]);

        return response()->json(['users' => $followers]);
    }

    public function following(User $user): JsonResponse
    {
        $authUser = auth()->user();

        $following = $user->following()
            ->withCount('reviews')
            ->get()
            ->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'avatar' => $u->avatar,
                'reviews_count' => $u->reviews_count,
                'is_following' => $authUser ? $authUser->isFollowing($u) : false,
                'is_self' => $authUser ? $authUser->id === $u->id : false,
            ]);

        return response()->json(['users' => $following]);
    }
}
