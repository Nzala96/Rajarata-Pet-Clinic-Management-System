<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\MailjetService;
use Illuminate\Support\Facades\Validator;

class EmailController extends Controller
{
    protected $mailjetService;

    public function __construct(MailjetService $mailjetService)
    {
        $this->mailjetService = $mailjetService;
    }

    /**
     * Test email configuration
     */
    public function testEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $result = $this->mailjetService->testEmailConfiguration($request->email);
            
            if ($result) {
                return response()->json([
                    'success' => true,
                    'message' => 'Test email sent successfully! Please check your inbox at ' . $request->email
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send test email. Please check your configuration.'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error sending test email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send appointment confirmation email (Admin to User)
     */
    public function sendAppointmentConfirmation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'appointment_id' => 'required|exists:appointments,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $appointment = \App\Models\appointment::find($request->appointment_id);
            $result = $this->mailjetService->sendAppointmentConfirmation($appointment);
            
            if ($result) {
                return response()->json([
                    'success' => true,
                    'message' => 'Appointment confirmation email sent successfully! The patient will receive the confirmation at ' . $appointment->owner_email
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send appointment confirmation email. Please try again.'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error sending appointment confirmation email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send appointment reminder email (Admin to User)
     */
    public function sendAppointmentReminder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'appointment_id' => 'required|exists:appointments,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $appointment = \App\Models\appointment::find($request->appointment_id);
            $result = $this->mailjetService->sendAppointmentReminder($appointment);
            
            if ($result) {
                return response()->json([
                    'success' => true,
                    'message' => 'Appointment reminder email sent successfully! The patient will receive the reminder at ' . $appointment->owner_email
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send appointment reminder email. Please try again.'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error sending appointment reminder email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send invoice alert email (Admin to User)
     */
    public function sendInvoiceAlert(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'invoice_id' => 'required|exists:invoices,id',
            'pdf_path' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $invoice = \App\Models\Invoice::find($request->invoice_id);
            $result = $this->mailjetService->sendInvoiceAlert($invoice, $request->pdf_path);
            
            if ($result) {
                return response()->json([
                    'success' => true,
                    'message' => 'Invoice alert email sent successfully! The patient will receive the invoice at ' . $invoice->owner_email
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send invoice alert email. Please try again.'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error sending invoice alert email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send email from user to admin (User to Admin)
     */
    public function sendUserToAdmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'subject' => $request->subject,
                'message' => $request->message
            ];

            $result = $this->mailjetService->sendUserToAdminEmail($userData);
            
            if ($result) {
                return response()->json([
                    'success' => true,
                    'message' => 'Your message has been sent successfully! We will respond to you as soon as possible.'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send message. Please try again later.'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error sending message to admin: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send welcome email to new users
     */
    public function sendWelcomeEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'password' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = \App\Models\User::find($request->user_id);
            $result = $this->mailjetService->sendWelcomeEmail($user, $request->password);
            
            if ($result) {
                return response()->json([
                    'success' => true,
                    'message' => 'Welcome email sent successfully! The new user will receive the welcome message at ' . $user->email
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send welcome email. Please try again.'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error sending welcome email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send password reset email
     */
    public function sendPasswordResetEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'reset_token' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = \App\Models\User::find($request->user_id);
            $result = $this->mailjetService->sendPasswordResetEmail($user, $request->reset_token);
            
            if ($result) {
                return response()->json([
                    'success' => true,
                    'message' => 'Password reset email sent successfully! The user will receive the reset link at ' . $user->email
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send password reset email. Please try again.'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error sending password reset email: ' . $e->getMessage()
            ], 500);
        }
    }
} 