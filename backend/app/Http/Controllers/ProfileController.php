<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json(['success' => true, 'data' => $request->user()]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'location' => 'nullable|string',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($request->hasFile('profile_image')) {
            $path = $request->file('profile_image')->store('profiles', 'public');
            $user->profile_image = asset('storage/' . $path);
        }

        $user->update($request->only(['first_name', 'last_name', 'email', 'location']));

        return response()->json(['success' => true, 'message' => 'Profile updated', 'data' => $user]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'old_password' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json(['success' => false, 'message' => 'Old password does not match.'], 400);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return response()->json(['success' => true, 'message' => 'Password updated']);
    }
}
