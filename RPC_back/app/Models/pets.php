<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class pets extends Model
{
    use HasFactory;

    protected $fillable = [
    'name', 'type', 'breed', 'age', 'gender', 'weight',
    'owner', 'ownerName', 'ownerPhone', 'notes', 'isActive'
];

}