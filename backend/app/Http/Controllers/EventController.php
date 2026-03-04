<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        return response()->json(['success' => true, 'data' => Event::latest()->get()]);
    }

    public function show($id)
    {
        return response()->json(['success' => true, 'data' => Event::findOrFail($id)]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string',
            'time' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = asset('storage/' . $request->file('image')->store('events', 'public'));
        }

        $event = Event::create(array_merge($request->all(), ['image_path' => $imagePath]));

        \App\Models\Notification::create([
            'title' => 'New Event: ' . $event->title,
            'description' => $event->description,
            'type' => 'event',
            'related_id' => $event->id
        ]);

        return response()->json(['success' => true, 'message' => 'Event created', 'data' => $event], 201);
    }

    public function markInterested($id)
    {
        $event = Event::findOrFail($id);
        $user = auth()->user();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized. Please log in first.'], 401);
        }

        // Check if the user has already marked as interested
        if ($event->interestedUsers()->where('user_id', $user->id)->exists()) {
            return response()->json(['success' => false, 'message' => 'You are already interested in this event.']);
        }

        $event->interestedUsers()->attach($user->id);
        $event->increment('interested_count');

        return response()->json(['success' => true, 'message' => 'Marked as interested', 'data' => $event]);
    }
}
