<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class MailTestCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mail:test {email? : The email address to send the test to}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test SMTP configuration by sending a test email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing SMTP Configuration...');

        $mailUsername = config('mail.mailers.smtp.username');
        $mailPassword = config('mail.mailers.smtp.password');

        if (
            empty($mailUsername) || empty($mailPassword) ||
            $mailUsername === 'email@gmail.com' ||
            $mailPassword === 'APP_PASSWORD_GMAIL' ||
            str_contains($mailUsername, 'your-email') ||
            str_contains($mailPassword, 'your-') ||
            $mailUsername === 'null' || $mailPassword === 'null'
        ) {
            $this->error('SMTP Configuration is incomplete or still using placeholders.');
            $this->line('MAIL_USERNAME: ' . $mailUsername);
            $this->line('MAIL_PASSWORD: ' . (empty($mailPassword) ? 'EMPTY' : '***'));
            return Command::FAILURE;
        }

        $email = $this->argument('email');

        if (!$email) {
            $email = $mailUsername; // Default to sending to the configured username
            $this->info("No email provided. Sending test email to configured MAIL_USERNAME: {$email}");
        } else {
            $this->info("Sending test email to: {$email}");
        }

        try {
            Mail::raw('This is a test email from AuraAI Deadliner to verify SMTP configuration.', function ($message) use ($email) {
                $message->to($email)
                    ->subject('AuraAI Deadliner - SMTP Test');
            });

            $this->info('✅ Test email sent successfully! SMTP configuration is correct.');
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('❌ Failed to send test email.');
            $this->error('Error Message: ' . $e->getMessage());
            \Log::error('SMTP Test Error: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
