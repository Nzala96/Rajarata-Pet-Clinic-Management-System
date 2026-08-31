<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;

class CustomerController extends Controller
{

    //get all Customers
    public function getCustomer(){
        $cust = Customer::all();
        return response()->json($cust, 200);
    }

    //get specific Customer
    public function getCustomerById($id)
     {
         $cus = Customer::find($id);
         if (is_null($cus)) {
             return response()->json(['message' => 'Customer Not Found'], 404);
         }
         return response()->json($cus, 200);
     }


    //Add Customers
    public function addCustomer(Request $request){
        $cus = Customer::create($request->all());
        return response($cus, 201);
    }


     // Update Customer details
    public function updateCustomer(Request $request, $id)
    {
    $cus = Customer::find($id);
    if (is_null($cus)) {
        return response()->json(['message' => 'Customer Not Found'], 404);
    }
    $cus->update($request->all());
    return response($cus, 200);
    }



     // Delete Customer
     public function deleteCustomer($id)
     {
         $cus = Customer::find($id);
         if (is_null($cus)) {
             return response()->json(['message' => 'Customer Not Found'], 404);
         }
         $cus->delete();
         return response()->json(null, 204);
     }

     public function getAllCustomers()
    {
        try {
            // Fetch all customers and load their pets relationship
            $customers = Customer::with('pets')->get();

            // Map customers to include pet count if needed
            $mappedCustomers = $customers->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'name' => $customer->name ?? $customer->cname ?? '',
                    'email' => $customer->email ?? $customer->cemail ?? '',
                    'phone' => $customer->phone ?? $customer->cphone ?? '',
                    'created_at' => $customer->created_at,
                    'updated_at' => $customer->updated_at,
                    'is_active' => $customer->is_active ?? true,
                    'pets' => $customer->pets ?? [],
                    'total_pets' => $customer->pets ? count($customer->pets) : 0,
                ];
            });

            return response()->json($mappedCustomers);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch customers', 'message' => $e->getMessage()], 500);
        }
    }

}
