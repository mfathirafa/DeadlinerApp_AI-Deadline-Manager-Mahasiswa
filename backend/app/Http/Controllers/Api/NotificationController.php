<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user.
     */
    public function index(Request $request)
    {
        $notifications = $request->user()->notifications;

        return response()->json([
            'success' => true,
            'data' => $notifications->map(function ($notif) {
                return [
                    'id' => $notif->id,
                    'type' => $notif->type,
                    'data' => is_string($notif->data) ? json_decode($notif->data, true) : $notif->data,
                    'read_at' => $notif->read_at ? $notif->read_at->toIso8601String() : null,
                    'created_at' => $notif->created_at->toIso8601String(),
                ];
            })
        ]);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'data' => [
                'message' => 'Notification marked as read.'
            ]
        ]);
    }

    /**
     * Mark a specific notification as read via request body.
     */
    public function markReadBody(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string',
        ]);

        $notification = $request->user()->notifications()->findOrFail($validated['id']);
        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'data' => [
                'message' => 'Notification marked as read.'
            ]
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json([
            'success' => true,
            'data' => [
                'message' => 'All notifications marked as read.'
            ]
        ]);
    }
}
