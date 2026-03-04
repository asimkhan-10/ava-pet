<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        return response()->json(['success' => true, 'data' => Notification::latest()->get()]);
    }

    public function markAllAsRead()
    {
        Notification::where('is_read', false)->update(['is_read' => true]);
        return response()->json(['success' => true, 'message' => 'All notifications marked as read']);
    }
}
