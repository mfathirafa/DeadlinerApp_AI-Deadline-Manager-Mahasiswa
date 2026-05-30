<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Upload user avatar.
     * Accepts: jpg, jpeg, png, webp. Max 2MB.
     * Storage: storage/app/public/avatars
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $user = $request->user();

        // Delete old avatar if exists
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return response()->json([
            'success' => true,
            'data' => [
                'avatar' => $path,
                'avatar_url' => Storage::disk('public')->url($path),
                'user' => $user->fresh(),
            ]
        ]);
    }

    /**
     * Delete user avatar.
     */
    public function deleteAvatar(Request $request)
    {
        $user = $request->user();

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
            $user->update(['avatar' => null]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'message' => 'Avatar deleted successfully.',
                'user' => $user->fresh(),
            ]
        ]);
    }
}
