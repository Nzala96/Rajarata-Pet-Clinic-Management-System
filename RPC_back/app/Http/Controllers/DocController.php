<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\doctors;

class DocController extends Controller
{
    //get all doctors
    public function getDoctors(){
        $doctors = doctors::all();
        return response()->json($doctors, 200);
    }

    //get specific Doctor
    public function getDoctorById($id)
     {
         $doc = doctors::find($id);
         if (is_null($doc)) {
             return response()->json(['message' => 'appointment Not Found'], 404);
         }
         return response()->json($doc, 200);
     }


    //Add Doctor
    // public function addDoc(Request $request){

    //     // Check if a doctor with the same email already exists
    //     $existingDoctor = doctors::where('demail', $request->demail)->first();

    //     if ($existingDoctor) {
    //         return response()->json(['message' => 'Doctor already created'], 409); // 409 Conflict
    //     }

    //     // Create the new doctor
    //     $doc = doctors::create($request->all());

    //     return response($doc, 201);
    // }

    public function addDoc(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'dname' => 'required|string|max:100',
            'demail' => 'required|email|unique:doctors,demail',
            'dtp' => 'required|string|max:20',
            'specialization' => 'required|string|max:100',
            'experience' => 'required|integer|min:0',
            'education' => 'required|string|max:255',
            'available' => 'required|boolean',
            'created_at' => 'nullable|date',
            'updated_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Create new doctor
        $doctor = doctors::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Doctor created successfully',
            'data' => $doctor
        ], 201);
    }


     // Update Doctor details
    public function updateDoc(Request $request, $id)
    {
    $doc = doctors::find($id);
    if (is_null($doc)) {
        return response()->json(['message' => 'Appointment Not Found'], 404);
    }
    $doc->update($request->all());
    return response($doc, 200);
    }



     // Delete doctor details
     public function deleteDoc($id)
     {
         $doc = doctors::find($id);
         if (is_null($doc)) {
             return response()->json(['message' => 'Appointment Not Found'], 404);
         }
         $doc->delete();
         return response()->json(null, 204);
     }

}



