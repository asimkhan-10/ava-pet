@extends('admin.layout')

@section('title', 'Create Event')

@section('content')
<div class="top-bar">
    <h1>Create New Event</h1>
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
</style>

<div class="form-container">
    <form action="{{ route('admin.events.store') }}" method="POST" enctype="multipart/form-data">
        @csrf
        
        <div class="form-group">
            <label>Event Title *</label>
            <input type="text" name="title" class="form-control" value="{{ old('title') }}" required>
            @error('title')<div class="error">{{ $message }}</div>@enderror
        </div>

        <div class="form-group">
            <label>Description *</label>
            <textarea name="description" class="form-control" required>{{ old('description') }}</textarea>
            @error('description')<div class="error">{{ $message }}</div>@enderror
        </div>

        <div class="form-group">
            <label>Location *</label>
            <input type="text" name="location" class="form-control" value="{{ old('location') }}" required>
            @error('location')<div class="error">{{ $message }}</div>@enderror
        </div>

        <div class="form-group">
            <label>Date & Time *</label>
            <input type="datetime-local" name="time" class="form-control" value="{{ old('time') }}" required>
            @error('time')<div class="error">{{ $message }}</div>@enderror
        </div>

        <div class="form-group">
            <label>Event Image</label>
            <input type="file" name="image" class="form-control" accept="image/*">
            @error('image')<div class="error">{{ $message }}</div>@enderror
        </div>

        <button type="submit" class="btn btn-success">Create Event</button>
    </form>
</div>
@endsection
