<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PasswordOtp extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     * Laravel usually assumes 'password_otps', so this is safe.
     */
    protected $table = 'password_otps';

    /**
     * The attributes that are mass assignable.
     * This allows you to use PasswordOtp::create() or ::updateOrCreate().
     */
    protected $fillable = [
        'email',
        'otp_code',
        'created_at'
    ];

    /**
     * Disable standard timestamps because your migration
     * only contains 'created_at'.
     */
    public $timestamps = false;
}
