<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = \App\Models\User::where('email', $request->email)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['We could not find a user with that email address.'],
            ]);
        }

        $pendingRequest = \App\Models\PasswordResetRequest::where('email', $user->email)
            ->where('status', 'pending')
            ->first();

        if ($pendingRequest) {
            return back()->with(
                'status',
                'Your password reset request is currently pending Admin review. Please wait for Admin approval.'
            );
        }

        // Clear any old approved requests for this email before creating a new one
        \App\Models\PasswordResetRequest::where('email', $user->email)
            ->where('status', 'approved')
            ->delete();

        // Create new pending request for Admin
        \App\Models\PasswordResetRequest::create([
            'user_id' => $user->id,
            'email' => $user->email,
            'status' => 'pending',
        ]);

        return back()->with(
            'status',
            'Password reset request submitted successfully! An Admin will review your request.'
        );
    }
}
