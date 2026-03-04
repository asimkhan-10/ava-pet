<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'name', 'last_location', 'description', 'breed',
        'latitude', 'longitude', 'images', 'status'
    ];

    protected $casts = [
        'images' => 'array',
    ];
}
