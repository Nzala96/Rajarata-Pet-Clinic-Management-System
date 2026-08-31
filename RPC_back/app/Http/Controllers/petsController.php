<?php


namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;

use Illuminate\Http\Request;
use App\Models\pets;

class PetsController extends Controller
{
    // Get all pets
    public function getPets()
    {
        $pets = pets::all();
        return response()->json($pets, 200);
    }

    // Get specific pet by ID
    public function getPetById($id)
    {
        $pet = pets::find($id);
        if (is_null($pet)) {
            return response()->json(['message' => 'Pet Not Found'], 404);
        }
        return response()->json($pet, 200);
    }

    // Add new pet
    // public function addPet(Request $request)
    // {
    //     $existingPet = pets::where('name', $request->Name)
    //         ->where('owner', $request->Owner)
    //         ->first();

    //     if ($existingPet) {
    //         return response()->json(['message' => 'Pet already created'], 409);
    //     }

    //     $pet = pets::create($request->all());
    //     return response($pet, 201);
    // }

    // Update existing pet
    public function updatePet(Request $request, $id)
    {
        $pet = pets::find($id);
        if (is_null($pet)) {
            return response()->json(['message' => 'Pet Not Found'], 404);
        }

        $pet->update($request->all());
        return response($pet, 200);
    }

    // Delete pet
    public function deletePet($id)
    {
        $pet = pets::find($id);
        if (is_null($pet)) {
            return response()->json(['message' => 'Pet Not Found'], 404);
        }

        $pet->delete();
        return response()->json(null, 204);
    }

    // Get pet by pet name and owner name
    // public function findByPetnameAndOwner(Request $request)
    // {
    //     $name = $request->query('name');
    //     $owner = $request->query('owner');

    //     $pet = pets::where('name', $name)
    //         ->where('owner', $owner)
    //         ->first();

    //     if (!$pet) {
    //         return response()->json(['message' => 'Pet not found'], 404);
    //     }

    //     return response()->json($pet);
    // }
    public function findByPetnameAndOwner(Request $request)
{
    $name = $request->query('petname');
    $owner = $request->query('owner');

    $pet = pets::where('Name', $name)
              ->where('Owner', $owner)
              ->first();

    if (!$pet) {
        return response()->json(['message' => 'Pet not found'], 404);
    }

    return response()->json($pet, 200);
}

 public function addPet(Request $request)
    {
        // Validation
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:100',
            'type' => 'nullable|string|max:100',
            'breed' => 'nullable|string|max:100',
            'age' => 'nullable|integer|min:0',
            'gender' => 'nullable|in:male,female',
            'weight' => 'nullable|numeric|min:0',
            'owner' => 'nullable|string|max:100',
            'ownerName' => 'nullable|string|max:100',
            'ownerPhone' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
            'isActive' => 'nullable|boolean'
        ]);

        // Handle validation errors
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        // Create and return the pet
        $pet = pets::create($request->all());

        return response()->json([
            'message' => 'Pet added successfully.',
            'data' => $pet
        ], 201);
    }

}


