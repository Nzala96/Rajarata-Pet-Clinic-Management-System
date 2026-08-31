<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class MailjetService
{
    /**
     * Send appointment confirmation email from admin to user
     */
    public function sendAppointmentConfirmation($appointment)
    {
        try {
            $data = [
                'appointment' => $appointment,
                'pet_name' => $appointment->pet_name ?? 'Your Pet',
                'owner_name' => $appointment->owner_name ?? 'Pet Owner',
                'appointment_date' => $appointment->appointment_date,
                'appointment_time' => $appointment->appointment_time,
                'doctor_name' => $appointment->doctor_name ?? 'Veterinarian',
                'service_type' => $appointment->service_type ?? 'Veterinary Service',
                'clinic_name' => 'Pet Clinic Management System'
            ];

            Mail::send('emails.appointment-confirmation', $data, function ($message) use ($appointment) {
                $message->to($appointment->owner_email, $appointment->owner_name)
                        ->subject('Appointment Confirmation - Pet Clinic')
                        ->from(config('mail.from.address'), config('mail.from.name'));
            });

            Log::info('Appointment confirmation email sent successfully to: ' . $appointment->owner_email);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send appointment confirmation email: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send appointment reminder email from admin to user
     */
    public function sendAppointmentReminder($appointment)
    {
        try {
            $data = [
                'appointment' => $appointment,
                'pet_name' => $appointment->pet_name ?? 'Your Pet',
                'owner_name' => $appointment->owner_name ?? 'Pet Owner',
                'appointment_date' => $appointment->appointment_date,
                'appointment_time' => $appointment->appointment_time,
                'doctor_name' => $appointment->doctor_name ?? 'Veterinarian',
                'service_type' => $appointment->service_type ?? 'Veterinary Service',
                'clinic_name' => 'Pet Clinic Management System'
            ];

            Mail::send('emails.appointment-reminder', $data, function ($message) use ($appointment) {
                $message->to($appointment->owner_email, $appointment->owner_name)
                        ->subject('Appointment Reminder - Pet Clinic')
                        ->from(config('mail.from.address'), config('mail.from.name'));
            });

            Log::info('Appointment reminder email sent successfully to: ' . $appointment->owner_email);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send appointment reminder email: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send invoice alert email from admin to user
     */
    public function sendInvoiceAlert($invoice, $pdfPath = null)
    {
        try {
            $data = [
                'invoice' => $invoice,
                'owner_name' => $invoice->owner_name ?? 'Pet Owner',
                'total_amount' => $invoice->total_amount,
                'invoice_number' => $invoice->invoice_number ?? $invoice->id,
                'clinic_name' => 'Pet Clinic Management System'
            ];

            $message = Mail::send('emails.invoice-alert', $data, function ($message) use ($invoice, $pdfPath) {
                $message->to($invoice->owner_email, $invoice->owner_name)
                        ->subject('Invoice Alert #' . ($invoice->invoice_number ?? $invoice->id) . ' - Pet Clinic')
                        ->from(config('mail.from.address'), config('mail.from.name'));
                
                if ($pdfPath && file_exists($pdfPath)) {
                    $message->attach($pdfPath, [
                        'as' => 'invoice-' . ($invoice->invoice_number ?? $invoice->id) . '.pdf',
                        'mime' => 'application/pdf'
                    ]);
                }
            });

            Log::info('Invoice alert email sent successfully to: ' . $invoice->owner_email);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send invoice alert email: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send email from user to admin (rpc@gmail.com)
     */
    public function sendUserToAdminEmail($userData)
    {
        try {
            $data = [
                'user_name' => $userData['name'],
                'user_email' => $userData['email'],
                'subject' => $userData['subject'],
                'user_message' => $userData['message'],
                'clinic_name' => 'Pet Clinic Management System'
            ];

            Mail::send('emails.user-to-admin', $data, function ($mailMessage) use ($userData) {
                $mailMessage->to('rajaratapetclinic@gmail.com', 'Pet Clinic Admin')
                        ->subject('User Contact: ' . $userData['subject'])
                        ->from(config('mail.from.address'), config('mail.from.name'))
                        ->replyTo($userData['email'], $userData['name']);
            });

            Log::info('User contact email sent successfully from: ' . $userData['email'] . ' to admin');
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send user contact email: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send welcome email to new users
     */
    public function sendWelcomeEmail($user, $password = null)
    {
        try {
            $data = [
                'name' => $user->name,
                'email' => $user->email,
                'password' => $password,
                'clinic_name' => 'Pet Clinic Management System'
            ];

            Mail::send('emails.welcome', $data, function ($message) use ($user) {
                $message->to($user->email, $user->name)
                        ->subject('Welcome to Pet Clinic Management System')
                        ->from(config('mail.from.address'), config('mail.from.name'));
            });

            Log::info('Welcome email sent successfully to: ' . $user->email);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send welcome email: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send password reset email
     */
    public function sendPasswordResetEmail($user, $resetToken)
    {
        try {
            $data = [
                'name' => $user->name,
                'email' => $user->email,
                'reset_url' => url('/reset-password?token=' . $resetToken . '&email=' . $user->email),
                'clinic_name' => 'Pet Clinic Management System'
            ];

            Mail::send('emails.password-reset', $data, function ($message) use ($user) {
                $message->to($user->email, $user->name)
                        ->subject('Password Reset Request - Pet Clinic')
                        ->from(config('mail.from.address'), config('mail.from.name'));
            });

            Log::info('Password reset email sent successfully to: ' . $user->email);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send password reset email: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Test email configuration
     */
    public function testEmailConfiguration($testEmail)
    {
        try {
            $data = [
                'test_message' => 'This is a test email from your Pet Clinic Management System using Mailjet.',
                'timestamp' => now()->format('Y-m-d H:i:s'),
                'clinic_name' => 'Pet Clinic Management System'
            ];

            Mail::send('emails.test', $data, function ($message) use ($testEmail) {
                $message->to($testEmail)
                        ->subject('Test Email - Pet Clinic System (Mailjet)')
                        ->from(config('mail.from.address'), config('mail.from.name'));
            });

            Log::info('Test email sent successfully to: ' . $testEmail);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send test email: ' . $e->getMessage());
            return false;
        }
    }
} 