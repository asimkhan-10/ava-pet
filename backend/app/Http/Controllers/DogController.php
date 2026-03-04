<?php

namespace App\Http\Controllers;

use App\Models\Dog;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DogController extends Controller
{
    // --- PUBLIC ROUTES ---

    public function index(Request $request)
    {
        $query = Dog::where('created_at', '>=', Carbon::now()->subDays(15))
                   ->where('status', 'missing');

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where('name', 'like', '%' . $search . '%');
        }

        $dogs = $query->latest()->paginate(10);

        return response()->json(['success' => true, 'data' => $dogs]);
    }

    public function nearby(Request $request)
    {
        $request->validate([
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
            'radius' => 'nullable|numeric'
        ]);

        $latitude = $request->lat;
        $longitude = $request->lng;
        $radius = $request->radius ?? 100;

        $haversine = "(6371 * acos(cos(radians($latitude)) * cos(radians(latitude)) * cos(radians(longitude) - radians($longitude)) + sin(radians($latitude)) * sin(radians(latitude))))";

        $dogs = Dog::selectRaw("*, {$haversine} AS distance")
              ->where('status', 'missing')
              ->whereRaw("{$haversine} < ?", [$radius])
              ->orderBy('distance')
              ->get();

        return response()->json(['success' => true, 'data' => $dogs]);
    }

    public function show($id)
    {
        return response()->json(['success' => true, 'data' => Dog::findOrFail($id)]);
    }

    // --- PROTECTED ROUTES ---

    public function myDogs(Request $request)
    {
        $dogs = Dog::where('user_id', $request->user()->id)->latest()->get();
        return response()->json(['success' => true, 'data' => $dogs]);
    }

    public function myDogDetail(Request $request, $id)
    {
        $dog = Dog::where('user_id', $request->user()->id)->findOrFail($id);
        return response()->json(['success' => true, 'data' => $dog]);
    }

    // SCREEN 2064522621: Add Missing Post
    public function storeMissing(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'last_location' => 'required|string',
            'description' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:8048'
        ]);

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePaths[] = asset('storage/' . $image->store('dogs/missing', 'public'));
            }
        }

        $dog = Dog::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'last_location' => $request->last_location,
            'description' => $request->description,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'images' => $imagePaths,
            'status' => 'missing'
        ]);

        return response()->json(['success' => true, 'message' => 'Missing post created', 'data' => $dog], 201);
    }

    // SCREEN 21: Add Personal Dog Profile
    public function storeMyDog(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'breed' => 'required|string|max:255',
            'location' => 'required|string',
            'description' => 'required|string',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePaths[] = asset('storage/' . $image->store('dogs/owned', 'public'));
            }
        }

        $dog = Dog::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'breed' => $request->breed,
            'last_location' => $request->location,
            'description' => $request->description,
            'images' => $imagePaths,
            'status' => 'owned'
        ]);

        return response()->json(['success' => true, 'message' => 'Dog profile created', 'data' => $dog], 201);
    }
}
