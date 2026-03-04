<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Dog;
use App\Models\Event;
use App\Models\Notification;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_users' => User::count(),
            'total_dogs' => Dog::count(),
            'lost_dogs' => Dog::where('status', 'lost')->count(),
            'found_dogs' => Dog::where('status', 'found')->count(),
            'total_events' => Event::count(),
        ];
        
        $recent_dogs = Dog::latest()->take(6)->get();
        $missing_dogs = Dog::where('status', 'lost')->latest()->take(6)->get();
        
        return view('admin.dashboard', compact('stats', 'recent_dogs', 'missing_dogs'));
    }

    public function users()
    {
        $users = User::latest()->paginate(10);
        return view('admin.users', compact('users'));
    }

    public function dogs()
    {
        $dogs = Dog::latest()->paginate(12);
        return view('admin.dogs', compact('dogs'));
    }

    public function missingDogs()
    {
        $dogs = Dog::where('status', 'lost')->latest()->paginate(12);
        return view('admin.missing-dogs', compact('dogs'));
    }

    public function events()
    {
        $events = Event::latest()->paginate(10);
        return view('admin.events', compact('events'));
    }

    public function createEvent()
    {
        return view('admin.event-create');
    }

    public function storeEvent(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|max:255',
            'description' => 'required',
            'location' => 'required',
            'time' => 'required|date',
            'image' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads'), $imageName);
            $validated['image_path'] = 'uploads/' . $imageName;
        }

        $event = Event::create($validated);
        
        \App\Models\Notification::create([
            'title' => 'New Event: ' . $event->title,
            'description' => $event->description,
            'type' => 'event',
            'related_id' => $event->id
        ]);

        return redirect()->route('admin.events')->with('success', 'Event created successfully');
    }

    public function editEvent(Event $event)
    {
        return view('admin.event-edit', compact('event'));
    }

    public function updateEvent(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'required|max:255',
            'description' => 'required',
            'location' => 'required',
            'time' => 'required|date',
            'image' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads'), $imageName);
            $validated['image_path'] = 'uploads/' . $imageName;
        }

        $event->update($validated);
        return redirect()->route('admin.events')->with('success', 'Event updated successfully');
    }

    public function destroyEvent(Event $event)
    {
        $event->delete();
        return redirect()->route('admin.events')->with('success', 'Event deleted successfully');
    }
}
