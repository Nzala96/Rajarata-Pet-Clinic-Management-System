<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\PetsController;
use App\Http\Controllers\API\ContactController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DocController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EmailController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes (no authentication required)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup', [AuthController::class, 'signup']);

// Public email routes (no authentication required)
Route::post('/email/user-to-admin', [EmailController::class, 'sendUserToAdmin']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // User info and logout
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin routes
    Route::get('/admin/stats', [AdminController::class, 'getStats']);
    Route::get('/admin/appointments/today', [AdminController::class, 'getTodayAppointments']);
    Route::get('/admin/notifications', [AdminController::class, 'getAdminNotifications']);
    Route::get('/admin/appointments/stats', [AdminController::class, 'getAppointmentStats']);
    Route::put('/admin/notifications/{id}/read', [AdminController::class, 'markNotificationAsRead']);

    // Appointments
    Route::get('/appointments', [AppointmentController::class, 'getAllAppointments']);
    Route::get('/admin/appointments', [AppointmentController::class, 'getAllAppointments']); // Admin appointments endpoint
    Route::get('/appointment/{id}', [AppointmentController::class, 'getAppointmentById']);
    Route::post('/addappointment', [AppointmentController::class, 'addAppointment']);
    Route::put('/updateappointments/{id}', [AppointmentController::class, 'updateAppointment']);
    Route::delete('/deleteappointment/{id}', [AppointmentController::class, 'deleteAppointment']);
    Route::put('/appointments/{id}/status', [AppointmentController::class, 'updateStatus']);
    Route::get('/appointment-notifications', [AppointmentController::class, 'getAppointmentNotifications']);
    Route::get('/user/notifications', [AppointmentController::class, 'getUserNotifications']);
    Route::put('/user/notifications/{id}/read', [AppointmentController::class, 'markUserNotificationAsRead']);

    // Pets
    Route::get('/pets', [petsController::class, 'getPets']);
    Route::get('/pets/{id}', [petsController::class, 'getPetById']);
    Route::post('/pets', [petsController::class, 'addPet']);
    Route::put('/pets/{id}', [petsController::class, 'updatePet']);
    Route::delete('/pets/{id}', [petsController::class, 'deletePet']);
    Route::get('/pets/search', [petsController::class, 'findByPetnameAndOwner']);

    // Services
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{id}', [ServiceController::class, 'getServiceById']);
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{id}', [ServiceController::class, 'updateService']);
    Route::delete('/services/{id}', [ServiceController::class, 'deleteService']);

    // Invoices
    Route::get('/invoices', [InvoiceController::class, 'getInvoices']);
    Route::get('/invoices/{id}', [InvoiceController::class, 'getInvoiceById']);
    Route::post('/invoices', [InvoiceController::class, 'createInvoice']);
    Route::put('/invoices/{id}', [InvoiceController::class, 'updateInvoice']);
    Route::delete('/invoices/{id}', [InvoiceController::class, 'deleteInvoice']);

    // Customers
    Route::get('/customers', [CustomerController::class, 'getCustomer']);
    Route::get('/getallcustomers', [CustomerController::class, 'getAllCustomers']);
    Route::get('/customer/{id}', [CustomerController::class, 'getCustomerById']);
    Route::post('/addcustomer', [CustomerController::class, 'addCustomer']);
    Route::put('/updatecustomer/{id}', [CustomerController::class, 'updateCustomer']);
    Route::delete('/deletecustomer/{id}', [CustomerController::class, 'deleteCustomer']);
    Route::post('/clients', [CustomerController::class, 'getCustomer']);

    // Doctors
    Route::get('/doctors', [DocController::class, 'getDoctors']);
    Route::get('/doctor/{id}', [DocController::class, 'getDoctorById']);
    Route::post('/addDoc', [DocController::class, 'addDoc']);
    Route::put('/updatedoc/{id}', [DocController::class, 'updateDoc']);
    Route::delete('/deletedoc/{id}', [DocController::class, 'deleteDoc']);

    // Users
    Route::get('/users', [UserController::class, 'getUsers']);
    Route::get('/user/{id}', [UserController::class, 'getUserById']);
    Route::post('/adduser', [UserController::class, 'addUser']);
    Route::put('/updateuser/{id}', [UserController::class, 'updateUser']);
    Route::delete('/deleteuser/{id}', [UserController::class, 'deleteUser']);

    // Contact Messages (both store and index protected)
    Route::post('/contact-messages', [ContactController::class, 'store']);
    Route::get('/contact-messages', [ContactController::class, 'index']);

    // Email Management with Mailjet
    Route::post('/email/test', [EmailController::class, 'testEmail']);
    Route::post('/email/appointment-confirmation', [EmailController::class, 'sendAppointmentConfirmation']);
    Route::post('/email/appointment-reminder', [EmailController::class, 'sendAppointmentReminder']);
    Route::post('/email/invoice-alert', [EmailController::class, 'sendInvoiceAlert']);
    Route::post('/email/welcome', [EmailController::class, 'sendWelcomeEmail']);
    Route::post('/email/password-reset', [EmailController::class, 'sendPasswordResetEmail']);
});

