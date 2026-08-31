<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class appointment extends Model
{
    use HasFactory;

    protected $table = 'appointments';
    public $timestamps = false; // can remove and add update time in future

    protected $fillable = [
    'date',
    'time',
    'petname',
    'docname',
    'name',
    'email',
    'status',
    'contactNumber',
    'appointmentType',
    'notes',
    'petAge',
    'petBreed',
    'reasonForVisit'
];

}
