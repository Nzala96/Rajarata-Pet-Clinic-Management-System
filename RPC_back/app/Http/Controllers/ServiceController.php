<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\service;
// use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{
    /**
     * Store a newly created service in the database.
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:100',
        'description' => 'nullable|string',
        'price' => 'required|numeric',
        'available' => 'required|boolean',
    ]);

    $service = service::create([
        ...$validated,
        'created_at' => $request->created_at ?? now(),
        'updated_at' => $request->updated_at ?? now(),
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Service created successfully.',
        'data' => $service
    ], 201);
}

public function index()
{
    try {
        $services = service::all();

        return response()->json([
            'success' => true,
            'data' => $services
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error retrieving services',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function updateService(Request $request, $id)
{
    $service = service::find($id);

    if (!$service) {
        return response()->json(['success' => false, 'message' => 'Service not found'], 404);
    }

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'required|numeric',
        'available' => 'required|boolean',
        'updated_at' => 'required|date'
    ]);

    $service->update($validated);

    return response()->json([
        'success' => true,
        'message' => 'Service updated successfully',
        'data' => $service
    ]);
}


public function deleteService($id)
{
    $service = service::find($id);

    if (!$service) {
        return response()->json(['success' => false, 'message' => 'Service not found'], 404);
    }

    $service->delete();

    return response()->json([
        'success' => true,
        'message' => 'Service deleted successfully'
    ]);
}

public function getServiceById($id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json([
                'success' => false,
                'message' => 'Service not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $service
        ]);
    }

}
