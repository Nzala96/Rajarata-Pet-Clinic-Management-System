<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contact;

class ContactController extends Controller
{
    
    
    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'subject' => 'required|string|max:255',
        'message' => 'required|string',
    ]);

    // Save to database
    $contact = contact::create($validated);

    return response()->json([
        'message' => 'Contact message submitted successfully!',
        'data' => $contact
    ], 201);
}

public function index()
{
    $contacts = contact::all();
    return response()->json([
        'success' => true,
        'data' => $contacts
    ]);
}

}


?>