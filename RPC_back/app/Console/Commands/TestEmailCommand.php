<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class TestEmailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:test {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test email configuration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        $this->info('Testing email configuration...');
        $this->info('Target email: ' . $email);
        
        // Check configuration
        $this->info('Mail driver: ' . config('mail.default'));
        $this->info('Mail host: ' . config('mail.mailers.mailjet.host'));
        $this->info('Mail port: ' . config('mail.mailers.mailjet.port'));
        $this->info('Mail username: ' . config('mail.mailers.mailjet.username'));
        $this->info('Mail from address: ' . config('mail.from.address'));
        $this->info('Mail from name: ' . config('mail.from.name'));
        
        try {
            Mail::send('emails.test', [
                'test_message' => 'This is a test email from your Pet Clinic Management System using Mailjet.',
                'timestamp' => now()->format('Y-m-d H:i:s'),
                'clinic_name' => 'Pet Clinic Management System'
            ], function ($message) use ($email) {
                $message->to($email)
                        ->subject('Test Email - Pet Clinic System (Mailjet)')
                        ->from(config('mail.from.address'), config('mail.from.name'));
            });
            
            $this->info('✅ Email sent successfully!');
            Log::info('Test email sent successfully to: ' . $email);
            
        } catch (\Exception $e) {
            $this->error('❌ Failed to send email: ' . $e->getMessage());
            Log::error('Failed to send test email: ' . $e->getMessage());
            
            // Additional debugging
            $this->error('Error details:');
            $this->error('File: ' . $e->getFile());
            $this->error('Line: ' . $e->getLine());
        }
    }
} 