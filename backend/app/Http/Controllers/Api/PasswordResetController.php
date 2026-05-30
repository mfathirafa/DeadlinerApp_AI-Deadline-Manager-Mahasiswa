<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Validation\Rules\Password as PasswordRule;

use Illuminate\Support\Facades\Log;

class PasswordResetController extends Controller
{
    /**
     * Send a password reset link to the given email.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Validate SMTP configuration
        $mailUsername = env('MAIL_USERNAME');
        $mailPassword = env('MAIL_PASSWORD');

        if (
            empty($mailUsername) || empty($mailPassword) ||
            $mailUsername === 'your-email@gmail.com' ||
            $mailPassword === 'your-gmail-app-password' ||
            $mailUsername === 'email@gmail.com' ||
            $mailPassword === 'APP_PASSWORD_GMAIL' ||
            $mailUsername === 'null' || $mailPassword === 'null'
        ) {
            Log::warning('SMTP configuration is missing or using placeholders. MAIL_USERNAME: ' . $mailUsername);

            return response()->json([
                'success' => false,
                'message' => 'Konfigurasi email belum lengkap. Silakan hubungi administrator.',
            ], 500);
        }

        try {
            $status = Password::sendResetLink(
                $request->only('email')
            );

            if ($status === Password::RESET_LINK_SENT) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'message' => __($status),
                    ]
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => __($status),
            ], 422);
        } catch (\Exception $e) {
            Log::error('SMTP Error during password reset: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Konfigurasi email belum lengkap. Email gagal dikirim.',
            ], 500);
        }
    }

    /**
     * Reset the user's password with a valid token.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', PasswordRule::defaults()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'success' => true,
                'data' => [
                    'message' => __($status),
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => __($status),
        ], 422);
    }
}
