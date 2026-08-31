<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\appointment;
use Carbon\Carbon; // Include Carbon for date manipulation

class AppointmentController extends Controller
{
    //get all appointment
    public function getAppointment(){
        $appoint = appointment::all();
        return response()->json($appoint, 200);
    }

    //get all appointments (for admin)
    public function getAllAppointments(){
        $appointments = appointment::all();
        return response()->json($appointments, 200);
    }

    //get specific appointment
    public function getAppointmentById($id)
     {
         $appoin = appointment::find($id);
         if (is_null($appoin)) {
             return response()->json(['message' => 'appointment Not Found'], 404);
         }
         return response()->json($appoin, 200);
     }

    // Get appointments by email
    public function getAppointments(Request $request) {
        $email = $request->query('email');  // Retrieve email from query parameter
        if ($email) {
            // Ensure correct filtering by email
            $appointments = Appointment::where('email', $email)->get();

            if ($appointments->isEmpty()) {
                return response()->json(['message' => 'No appointments found for this email'], 404);
            }

            return response()->json($appointments, 200);  // Return matched appointments
        }

        return response()->json(['message' => 'Email is required'], 400);  // Bad Request if email is missing
    }

    //Create Appointment
    // public function addAppointment(Request $request){
    //     $appoin = appointment::create($request->all());
    //     return response($appoin, 201);
    // }


    // Update Appointment
    public function updateAppointment(Request $request, $id) {

        $appoin = Appointment::find($id);
        if (is_null($appoin)) {
            return response()->json(['message' => 'Appointment Not Found'], 404);
        }
        $appoin->update(array_merge($request->all(), ['updated_at' => Carbon::now()]));
        return response($appoin, 200);
    }



     // Delete appointment
     public function deleteAppointment($id)
     {
         $appoin = appointment::find($id);
         if (is_null($appoin)) {
             return response()->json(['message' => 'Appointment Not Found'], 404);
         }
         $appoin->delete();
         return response()->json(null, 204);
     }

     //update appontment status
     public function updateStatus(Request $request, $id)
{
    $appointment = Appointment::find($id);

    if (!$appointment) {
        return response()->json(['message' => 'Appointment not found'], 404);
    }

    $appointment->status = $request->input('status');
    $appointment->save();

    return response()->json(['message' => 'Appointment status updated']);
}

public function index()
{
    $appointments = Appointment::all();
    return response()->json($appointments);
}

public function getAppointmentNotifications()
{
    $now = Carbon::now();
    $fiveDaysLater = $now->copy()->addDays(5);

    $appointments = Appointment::whereDate('date', '>=', $now->toDateString())
        ->whereDate('date', '<=', $fiveDaysLater->toDateString())
        ->get();

    $notifications = [];

    foreach ($appointments as $appt) {
        $apptDate = Carbon::parse($appt->date);

        // If the appointment is still upcoming
        if ($apptDate->greaterThanOrEqualTo($now)) {
            $notifications[] = [
                'message' => "{$appt->petname}: Appointment with Dr. {$appt->docname} on " . $apptDate->format('Y-m-d'),
                'type' => 'reminder',
                'date' => now()->format('Y-m-d H:i:s')
            ];
        }
    }

    return response()->json($notifications, 200);
}

/**
 * Get user-specific notifications (only for the logged-in user's appointments)
 */
public function getUserNotifications(Request $request)
{
    try {
        // Get the authenticated user's email
        $userEmail = $request->user()->email;
        
        $now = Carbon::now();
        $fiveDaysLater = $now->copy()->addDays(5);

        // Get appointments for this specific user
        $userAppointments = Appointment::where('email', $userEmail)
            ->whereDate('date', '>=', $now->toDateString())
            ->whereDate('date', '<=', $fiveDaysLater->toDateString())
            ->orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->get();

        $notifications = [];

        foreach ($userAppointments as $appointment) {
            $apptDate = Carbon::parse($appointment->date);
            
            // Create notification for upcoming appointments
            if ($apptDate->greaterThanOrEqualTo($now)) {
                $notifications[] = [
                    'id' => 'user_appt_' . $appointment->id,
                    'message' => "Your appointment: {$appointment->petname} with Dr. {$appointment->docname} on " . $apptDate->format('M d, Y') . " at {$appointment->time}",
                    'type' => 'appointment',
                    'date' => $appointment->date,
                    'appointmentId' => $appointment->id,
                    'isRead' => false,
                    'priority' => 'medium'
                ];
            }

            // Add status-specific notifications
            if ($appointment->status === 'pending') {
                $notifications[] = [
                    'id' => 'pending_' . $appointment->id,
                    'message' => "Your appointment for {$appointment->petname} is pending approval",
                    'type' => 'alert',
                    'date' => $appointment->date,
                    'appointmentId' => $appointment->id,
                    'isRead' => false,
                    'priority' => 'high'
                ];
            } elseif ($appointment->status === 'confirmed') {
                $notifications[] = [
                    'id' => 'confirmed_' . $appointment->id,
                    'message' => "Your appointment for {$appointment->petname} has been confirmed!",
                    'type' => 'info',
                    'date' => $appointment->date,
                    'appointmentId' => $appointment->id,
                    'isRead' => false,
                    'priority' => 'medium'
                ];
            }
        }

        // Sort by priority and date
        usort($notifications, function ($a, $b) {
            $priorityOrder = ['high' => 3, 'medium' => 2, 'low' => 1];
            if ($priorityOrder[$a['priority']] !== $priorityOrder[$b['priority']]) {
                return $priorityOrder[$b['priority']] - $priorityOrder[$a['priority']];
            }
            return strtotime($a['date']) - strtotime($b['date']);
        });

        return response()->json($notifications);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to fetch user notifications'], 500);
    }
}

/**
 * Mark user notification as read
 */
public function markUserNotificationAsRead($notificationId)
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

public function addAppointment(Request $request)
{
    // ✅ Validate required fields
    $validator = Validator::make($request->all(), [
        'date'            => 'required|date',
        'time'            => 'required',
        'petname'         => 'required|string|max:255',
        'docname'         => 'required|string|max:255',
        'name'            => 'required|string|max:255',
        'email'           => 'required|email|max:255',
        // 'status'          => 'required|in:pending,confirmed,completed,cancelled',
        'contactNumber'   => 'nullable|string|max:20',
        'appointmentType' => 'nullable|string|max:255',
        'notes'           => 'nullable|string',
        'petAge'          => 'nullable|string|max:255',
        'petBreed'        => 'nullable|string|max:255',
        'reasonForVisit'  => 'nullable|string|max:255',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors()
        ], 422);
    }

    // ✅ Create the appointment
    $appointment = Appointment::create($request->all());

    return response()->json([
        'success' => true,
        'message' => 'Appointment created successfully',
        'data' => $appointment
    ], 201);
}


}

