<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\invoice;
// use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class InvoiceController extends Controller
{
   
public function getInvoices()
    {
        return response()->json([
            'success' => true,
            'data' => Invoice::all()
        ]);
    }

    public function createInvoice(Request $request)
    {
        $validated = $request->validate([
            'patient_name' => 'required|string',
            'patient_email' => 'nullable|email',
            'patient_phone' => 'nullable|string',
            'doctor_name' => 'nullable|string',
            'pet_name' => 'nullable|string',
            'service_name' => 'nullable|string',
            'service_description' => 'nullable|string',
            'service_price' => 'required|numeric',
            'additional_charges' => 'nullable|numeric',
            'discount' => 'nullable|numeric',
            'tax_rate' => 'nullable|numeric',
            'total_amount' => 'required|numeric',
            'invoice_number' => 'required|string|unique:invoices,invoice_number',
            'issue_date' => 'required|date',
            'due_date' => 'nullable|date',
            'payment_status' => 'required|string',
            'notes' => 'nullable|string',
            'created_at' => 'required|date',
            'updated_at' => 'required|date'
        ]);

        $invoice = Invoice::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Invoice created successfully',
            'data' => $invoice
        ]);
    }

    public function updateInvoice(Request $request, $id)
    {
        $invoice = Invoice::find($id);
        if (!$invoice) {
            return response()->json(['success' => false, 'message' => 'Invoice not found'], 404);
        }

        $validated = $request->validate([
            'patient_name' => 'sometimes|string',
            'patient_email' => 'sometimes|email',
            'patient_phone' => 'sometimes|string',
            'doctor_name' => 'sometimes|string',
            'service_name' => 'sometimes|string',
            'service_description' => 'sometimes|string',
            'service_price' => 'sometimes|numeric',
            'additional_charges' => 'sometimes|numeric',
            'discount' => 'sometimes|numeric',
            'tax_rate' => 'sometimes|numeric',
            'total_amount' => 'sometimes|numeric',
            'due_date' => 'sometimes|date',
            'payment_status' => 'sometimes|string',
            'notes' => 'sometimes|string',
            'updated_at' => 'required|date'
        ]);

        $invoice->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Invoice updated successfully',
            'data' => $invoice
        ]);
    }

    public function deleteInvoice($id)
    {
        $invoice = Invoice::find($id);
        if (!$invoice) {
            return response()->json(['success' => false, 'message' => 'Invoice not found'], 404);
        }

        $invoice->delete();

        return response()->json([
            'success' => true,
            'message' => 'Invoice deleted successfully'
        ]);
    }



    public function getInvoiceById($id)
    {
        $invoice = Invoice::find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $invoice
        ]);
    }


}
