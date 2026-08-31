<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    // Get all users
    public function getUsers()
    {
        $users = User::all();
        return response()->json($users, 200);
    }

    // Get a specific user by ID
    public function getUserById($id)
    {
        $user = User::find($id);
        if (is_null($user)) {
            return response()->json(['message' => 'User Not Found'], 404);
        }
        return response()->json($user, 200);
    }

    // Add a new user
    public function addUser(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:191',
            'email' => 'required|string|email|max:191|unique:users',
            'password' => 'required|string|min:8',
            'isAdmin' => 'nullable|string|max:191',
        ]);
        $validatedData['password'] = bcrypt($validatedData['password']); // Hash the password

        $user = User::create($validatedData);
        return response()->json($user, 201);
    }

    // Update an existing user
    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);
        if (is_null($user)) {
            return response()->json(['message' => 'User Not Found'], 404);
        }

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:191',
            'email' => 'sometimes|required|string|email|max:191|unique:users,email,' . $user->id,
            'password' => 'sometimes|nullable|string|min:8',
            'isAdmin' => 'nullable|string|max:191',
        ]);
        if (isset($validatedData['password'])) {
            $validatedData['password'] = bcrypt($validatedData['password']); // Hash the password
        }

        $user->update($validatedData);
        return response()->json($user, 200);
    }

    // Delete a user
    public function deleteUser($id)
    {
        $user = User::find($id);
        if (is_null($user)) {
            return response()->json(['message' => 'User Not Found'], 404);
        }

        $user->delete();
        return response()->json(null, 204);
    }
}
