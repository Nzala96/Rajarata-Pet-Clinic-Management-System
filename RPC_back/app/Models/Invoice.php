<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $table = 'invoices';

    protected $fillable = [
        'patient_name',
        'patient_email',
        'patient_phone',
        'pet_name',
        'doctor_name',
        'service_name',
        'service_description',
        'service_price',
        'additional_charges',
        'discount',
        'tax_rate',
        'total_amount',
        'invoice_number',
        'issue_date',
        'due_date',
        'payment_status',
        'notes',
        'created_at',
        'updated_at'
    ];

    public $timestamps = false;
}