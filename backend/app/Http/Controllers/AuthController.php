<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller {


    public function register(Request $request) {
        User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'location' => $request->location
        ]);
        return response()->json(['message' => 'Account Created']);
    }


    public function login(Request $request) {
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid Login'], 401);
        }
        $token = $user->createToken('token')->plainTextToken;

        $is_first_login = $user->is_first_login;
        if ($is_first_login) {
            $user->is_first_login = false;
            $user->save();
        }

        return response()->json([
            'token' => $token,
            'user' => $user,
            'is_first_login' => $is_first_login
        ]);
    }


    public function sendOtp(Request $request) {
        $code = rand(1000, 9999);
        DB::table('password_otps')->updateOrInsert(
            ['email' => $request->email],
            ['otp_code' => $code, 'created_at' => now()]
        );
        Mail::raw("Your code is $code", function($m) use ($request) {
            $m->to($request->email)->subject('Verification Code');
        });
        return response()->json(['message' => 'Code Sent']);
    }


    public function verifyOtp(Request $request) {
        $check = DB::table('password_otps')
            ->where('email', $request->email)
            ->where('otp_code', $request->otp)
            ->first();
        return $check ? response()->json(['message' => 'Verified']) : response()->json(['message' => 'Invalid'], 400);
    }


    public function resetPassword(Request $request) {
        User::where('email', $request->email)->update([
            'password' => Hash::make($request->password)
        ]);
        DB::table('password_otps')->where('email', $request->email)->delete();
        return response()->json(['message' => 'Password Updated']);
    }
}
