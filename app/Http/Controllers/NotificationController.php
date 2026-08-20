<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(): Response
    {
        $notifications = auth()->user()
            ->notifications()
            ->latest()
            ->paginate(10)
            ->through(fn ($n) => [
                'id' => $n->id,
                'data' => $n->data,
                'read_at' => $n->read_at,
                'created_at' => $n->created_at->diffForHumans(),
            ]);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'unreadCount' => auth()->user()->unreadNotifications()->count(),
        ]);
    }

    public function unread(): JsonResponse
    {
        $notifications = auth()->user()
            ->unreadNotifications()
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($n) => [
                'id' => $n->id,
                'data' => $n->data,
                'read_at' => $n->read_at,
                'created_at' => $n->created_at->diffForHumans(),
            ]);

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => auth()->user()->unreadNotifications()->count(),
        ]);
    }

    public function markAsRead(string $id): JsonResponse|RedirectResponse
    {
        $notification = auth()->user()->notifications()->find($id);
        if ($notification) {
            $notification->markAsRead();
        }

        if (request()->wantsJson() || request()->header('Accept') === 'application/json') {
            return response()->json(['success' => true]);
        }

        return back();
    }

    public function markAllAsRead(): RedirectResponse
    {
        auth()->user()->unreadNotifications->markAsRead();

        return back();
    }
}