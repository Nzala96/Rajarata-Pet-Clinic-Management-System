<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $table = 'customers';
    public $timestamps = false; // can remove and add update time in future

    protected $fillable = ['cname','cemail','ctp','cpetname','address'];


}
