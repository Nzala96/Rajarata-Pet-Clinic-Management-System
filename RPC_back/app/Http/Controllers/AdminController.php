<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Pets;
use App\Models\Contact;
use Carbon\Carbon;

class AdminController extends Controller
{
    /**
     * Get admin dashboard statistics
     */
    public function getStats()
    {
        try {
            $today = Carbon::today();
            
            $stats = [
                'totalUsers' => User::count(),
                'todayAppointments' => Appointment::whereDate('date', $today)->count(),
                'totalAppointments' => Appointment::count(),
                'totalPets' => Pets::count(),
                'pendingAppointments' => Appointment::where('status', 'pending')->count(),
                'completedAppointments' => Appointment::where('status', 'completed')->count(),
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch stats'], 500);
        }
    }

    /**
     * Get today's appointments
     */
    public function getTodayAppointments()
    {
        try {
            $today = Carbon::today();
            
            $appointments = Appointment::whereDate('date', $today)
                ->orderBy('time', 'asc')
                ->get()
                ->map(function ($appointment) {
                    return [
                        'id' => $appointment->id,
                        'date' => $appointment->date,
                        'time' => $appointment->time,
                        'petname' => $appointment->petname,
                        'docname' => $appointment->docname,
                        'name' => $appointment->name,
                        'email' => $appointment->email,
                        'status' => $appointment->status,
                        'contactNumber' => $appointment->contactNumber,
                        'appointmentType' => $appointment->appointmentType,
                        'notes' => $appointment->notes,
                    ];
                });

            return response()->json($appointments);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch today\'s appointments'], 500);
        }
    }

    /**
     * Get admin notifications (all appointment notifications)
     */
    public function getAdminNotifications()
    {
        try {
            $notifications = [];
            
            // Get upcoming appointments (next 24 hours)
            $upcomingAppointments = Appointment::where('date', '>=', Carbon::today())
                ->where('date', '<=', Carbon::tomorrow())
                ->where('status', 'confirmed')
                ->get();

            foreach ($upcomingAppointments as $appointment) {
                $notifications[] = [
                    'id' => 'appt_' . $appointment->id,
                    'message' => "Upcoming appointment: {$appointment->petname} with {$appointment->docname} at {$appointment->time}",
                    'type' => 'appointment',
                    'date' => $appointment->date,
                    'userEmail' => $appointment->email,
                    'userName' => $appointment->name,
                    'appointmentId' => $appointment->id,
                    'isRead' => false,
                    'priority' => 'medium'
                ];
            }

            // Get pending appointments that need attention
            $pendingAppointments = Appointment::where('status', 'pending')
                ->where('date', '>=', Carbon::today())
                ->get();

            foreach ($pendingAppointments as $appointment) {
                $notifications[] = [
                    'id' => 'pending_' . $appointment->id,
                    'message' => "Pending appointment needs approval: {$appointment->petname} with {$appointment->docname}",
                    'type' => 'alert',
                    'date' => $appointment->date,
                    'userEmail' => $appointment->email,
                    'userName' => $appointment->name,
                    'appointmentId' => $appointment->id,
                    'isRead' => false,
                    'priority' => 'high'
                ];
            }

            // Get recent contact messages
            $recentMessages = Contact::where('created_at', '>=', Carbon::now()->subDays(7))
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();

            foreach ($recentMessages as $message) {
                $notifications[] = [
                    'id' => 'msg_' . $message->id,
                    'message' => "New contact message from {$message->name}: " . substr($message->message, 0, 50) . "...",
                    'type' => 'info',
                    'date' => $message->created_at->format('Y-m-d'),
                    'userEmail' => $message->email,
                    'userName' => $message->name,
                    'isRead' => false,
                    'priority' => 'low'
                ];
            }

            // Sort by priority and date
            usort($notifications, function ($a, $b) {
                $priorityOrder = ['high' => 3, 'medium' => 2, 'low' => 1];
                if ($priorityOrder[$a['priority']] !== $priorityOrder[$b['priority']]) {
                    return $priorityOrder[$b['priority']] - $priorityOrder[$a['priority']];
                }
                return strtotime($b['date']) - strtotime($a['date']);
            });

            return response()->json($notifications);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch notifications'], 500);
        }
    }

    /**
     * Get appointment statistics
     */
    public function getAppointmentStats()
    {
        try {
            $stats = [
                'totalAppointments' => Appointment::count(),
                'pendingAppointments' => Appointment::where('status', 'pending')->count(),
                'confirmedAppointments' => Appointment::where('status', 'confirmed')->count(),
                'completedAppointments' => Appointment::where('status', 'completed')->count(),
                'cancelledAppointments' => Appointment::where('status', 'cancelled')->count(),
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch appointment stats'], 500);
        }
    }

    /**
     * Mark notification as read
     */
    public function markNotificationAsRead($notificationId)
    {
        try {
            // For now, we'll just return success since we're not storing notification read status
            // In a real application, you would update a notifications table
            return response()->json([
                'success' => true,
                'message' => 'Notification marked as read'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to mark notification as read'
            ], 500);
        }
    }
} 