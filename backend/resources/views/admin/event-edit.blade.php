@extends('admin.layout')

@section('title', 'Edit Event')

@section('content')
<div class="top-bar">
    <h1>Edit Event</h1>
    <a href="{{ route('admin.events') }}" class="btn btn-primary">← Back to Events</a>
</div>

<style>
    .form-container {
        background: white;
        border-radius: 10px;
        padding: 30px;
        max-width: 700px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #333;
    }

    .form-control {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 0.95em;
    }

    .form-control:focus {
        outline: none;
        border-color: #2a5298;
    }

    textarea.form-control {
        min-height: 120px;
        resize: vertical;
    }

    .error {
        color: #c62828;
        font-size: 0.85em;
        margin-top: 5px;
    }

    .current-image {
        max-width: 200px;
        border-radius: 8px;
        margin-top: 10px;
    }
</style>

<div class="form-container">
    <form action="{{ route('admin.events.update', $event) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        
        <div class="form-group">
            <label>Event Title *</label>
            <input type="text" name="title" class="form-control" value="{{ old('title', $event->title) }}" required>
            @error('title')<div class="error">{{ $message }}</div>@enderror
        </div>

        <div class="form-group">
            <label>Description *</label>
            <textarea name="description" class="form-control" required>{{ old('description', $event->description) }}</textarea>
            @error('description')<div class="error">{{ $message }}</div>@enderror
        </div>

        <div class="form-group">
            <label>Location *</label>
            <input type="text" name="location" class="form-control" value="{{ old('location', $event->location) }}" required>
            @error('location')<div class="error">{{ $message }}</div>@enderror
        </div>

        <div class="form-group">
            <label>Date & Time *</label>
            <input type="datetime-local" name="time" class="form-control" value="{{ old('time', \Carbon\Carbon::parse($event->time)->format('Y-m-d\TH:i')) }}" required>
            @error('time')<div class="error">{{ $message }}</div>@enderror
        </div>

        <div class="form-group">
            <label>Event Image</label>
            @if($event->image_path)
                <img src="{{ asset($event->image_path) }}" alt="{{ $event->title }}" class="current-image">
            @endif
            <input type="file" name="image" class="form-control" accept="image/*">
            @error('image')<div class="error">{{ $message }}</div>@enderror
        </div>

        <button type="submit" class="btn btn-success">Update Event</button>
    </form>
</div>
@endsection
