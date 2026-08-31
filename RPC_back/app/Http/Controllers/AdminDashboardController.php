<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\adminDashboard;
use Carbon\Carbon; // Include Carbon for date manipulation

class AdminDashboardController extends Controller
{
    //get all appointment
    public function getAppointment(){
        $appoint = appointment::all();
        return response()->json($appoint, 200);
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
    public function addAppointment(Request $request){
        $appoin = appointment::create($request->all());
        return response($appoin, 201);
    }


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


}

