<?php

namespace App\Http\Controllers;

use App\Models\PasswordResetRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function index(Request $request): Response
    {
        $requests = PasswordResetRequest::with('user')
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(function ($req) {
                return [
                    'id' => $req->id,
                    'user_id' => $req->user_id,
                    'user_name' => $req->user ? $req->user->name : 'N/A',
                    'user_email' => $req->email,
                    'user_avatar' => $req->user ? $req->user->avatar : null,
                    'status' => $req->status,
                    'created_at' => $req->created_at ? $req->created_at->diffForHumans() : '',
                    'reset_at' => $req->reset_at ? $req->reset_at->diffForHumans() : null,
                ];
            });

        $users = User::select(['id', 'name', 'email', 'role', 'avatar', 'created_at'])
            ->where(function ($q) {
                $q->where('role', '!=', 'admin')->orWhereNull('role');
            })
            ->latest()
            ->limit(200)
            ->get()
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role,
                    'avatar' => $u->avatar,
                    'created_at' => $u->created_at ? $u->created_at->format('d M Y') : '',
                ];
            });

        $articles = \App\Models\Article::latest()->get();

        return Inertia::render('Admin/Dashboard', [
            'resetRequests' => $requests,
            'users' => $users,
            'articles' => $articles,
            'stats' => [
                'total_users' => User::where(function ($q) {
                    $q->where('role', '!=', 'admin')->orWhereNull('role');
                })->count(),
                'pending_requests' => PasswordResetRequest::where('status', 'pending')->count(),
                'approved_requests' => PasswordResetRequest::where('status', 'approved')->count(),
                'total_articles' => \App\Models\Article::count(),
            ],
        ]);
    }

    public function approveRequest(PasswordResetRequest $passwordResetRequest): RedirectResponse
    {
        $user = $passwordResetRequest->user ?: User::where('email', $passwordResetRequest->email)->first();

        if ($user) {
            $user->password = '12345678';
            $user->save();

            try {
                DB::table('sessions')->where('user_id', $user->id)->delete();
            } catch (\Throwable $e) {
                // Session driver might not be database
            }
        }

        $passwordResetRequest->update([
            'status' => 'approved',
            'reset_at' => now(),
        ]);

        return back()->with('success', "Password for {$passwordResetRequest->email} has been successfully reset to 12345678.");
    }

    public function resetUserPassword(User $user): RedirectResponse
    {
        $user->password = '12345678';
        $user->save();

        try {
            DB::table('sessions')->where('user_id', $user->id)->delete();
        } catch (\Throwable $e) {
            // Session driver might not be database
        }

        PasswordResetRequest::where('email', $user->email)
            ->where('status', 'pending')
            ->update([
                'status' => 'approved',
                'reset_at' => now(),
            ]);

        return back()->with('success', "Password for user {$user->name} ({$user->email}) has been successfully reset to 12345678.");
    }

    public function deleteUser(User $user): RedirectResponse
    {
        if ($user->isAdmin()) {
            return back()->with('error', 'Administrator accounts cannot be deleted.');
        }

        $userName = $user->name;
        $userEmail = $user->email;

        // Delete user's reset requests if any
        PasswordResetRequest::where('email', $userEmail)->delete();

        // Delete user
        $user->delete();

        return back()->with('success', "User {$userName} ({$userEmail}) has been permanently deleted.");
    }
}
