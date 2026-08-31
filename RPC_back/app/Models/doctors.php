<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class doctors extends Model
{
    use HasFactory;

    protected $table = 'doctors';
    public $timestamps = true; // Enable timestamps for created_at and updated_at

   protected $fillable = [
    'dname', 'demail', 'dtp', 'specialization', 'experience',
    'education', 'available', 'created_at', 'updated_at'
];


    protected $casts = [
        'available' => 'boolean',
        'experience' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
