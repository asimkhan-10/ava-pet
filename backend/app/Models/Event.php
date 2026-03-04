<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'location', 'time',
        'interested_count', 'coming_count', 'not_coming_count', 'image_path'
    ];

    public function interestedUsers()
    {
        return $this->belongsToMany(User::class, 'event_user');
    }
}
