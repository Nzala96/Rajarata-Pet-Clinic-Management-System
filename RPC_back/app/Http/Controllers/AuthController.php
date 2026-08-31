<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Str; // For generating remember_token
use Carbon\Carbon; // For handling timestamps
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log; // Import the Log facade

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        // Validate the request data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed', // Ensure password confirmation
            'isAdmin' => 'required|string' // Validate isAdmin as boolean (0 or 1)
        ]);

        // Log incoming request data for debugging
        Log::info($request->all()); // Log all incoming request data

        // Create the user with generated fields
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'email_verified_at' => Carbon::now(),
            'password' => Hash::make($request->password), // Hash the password
            'remember_token' => Str::random(10), // Generate a random 10-character remember token
            'created_at' => Carbon::now(), // Set current timestamp for created_at
            'updated_at' => Carbon::now(), // Set current timestamp for updated_at
            'isAdmin' => $request->isAdmin, // Store isAdmin as it is from the request
        ]);

        Log::info('User created successfully:', ['user_id' => $user->id, 'email' => $user->email, 'isAdmin' => $user->isAdmin]);

        // Return success response
        return response()->json(['message' => 'User registered successfully!', 'user' => $user], 201);
    }

    public function login(Request $request)
    {
        // Validate the input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        Log::info('Login attempt:', [
            'email' => $request->email,
            // Avoid logging sensitive information like passwords in production
        ]);

        // Find the user by email
        $user = User::where('email', $request->email)->first();

        // Check if user exists and verify the password using Hash::check
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['success' => false, 'message' => 'Invalid credentials'], 401);
        }

        // Create Sanctum token for API authentication
        $token = $user->createToken('auth-token')->plainTextToken;

        // Return success response with token
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'name' => $user->name,
            'email' => $user->email,
            'isAdmin' => $user->isAdmin,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        // Revoke the current user's token
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }
}
