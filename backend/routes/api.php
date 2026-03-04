<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DogController;
use App\Http\Controllers\EventController;

use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/otp-send', [AuthController::class, 'sendOtp']);
Route::post('/otp-verify', [AuthController::class, 'verifyOtp']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);


Route::get('/dogs/feed', [DogController::class, 'index']);
Route::get('/dogs/nearby', [DogController::class, 'nearby']);
Route::get('/dogs/{id}', [DogController::class, 'show']);
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);



Route::middleware('auth:sanctum')->group(function () {

    // Auth Logout

    // Profile Management
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile', [ProfileController::class, 'update']);
    Route::post('/change-password', [ProfileController::class, 'changePassword']);

    // User's Own Dogs
    Route::get('/my-dogs', [DogController::class, 'myDogs']);
    Route::get('/my-dogs/{id}', [DogController::class, 'myDogDetail']);
    Route::post('/dogs/mine', [DogController::class, 'storeMyDog']);

    // Missing Dogs Reporting
    Route::post('/dogs/missing', [DogController::class, 'storeMissing']);

    // Events & Notifications
    Route::post('/events', [EventController::class, 'store']);
    Route::post('/events/{id}/interested', [EventController::class, 'markInterested']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/read', [NotificationController::class, 'markAllAsRead']);
});
