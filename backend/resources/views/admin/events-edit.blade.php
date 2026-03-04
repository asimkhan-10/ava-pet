@extends('admin.layout')

@section('title', 'Edit Event')

@section('content')
<div class="card">
    <h3><i class="fas fa-edit" style="margin-right:10px;color:#667eea;"></i>Edit Event: {{ $event->title }}</h3>
    
    <form action="{{ route('admin.events.update', $event->id) }}" method="POST" enctype="multipart/form-data" style="margin-top:30px;">
        @csrf
        @method('PUT')
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
            <div>
                <label style="display:block;margin-bottom:8px;font-weight:600;color:#2d3748;">Title</label>
                <input type="text" name="title" value="{{ $event->title }}" required style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;">
            </div>
            <div>
                <label style="display:block;margin-bottom:8px;font-weight:600;color:#2d3748;">Location</label>
                <input type="text" name="location" value="{{ $event->location }}" required style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;">
            </div>
        </div>
        
        <div style="margin-bottom:20px;">
            <label style="display:block;margin-bottom:8px;font-weight:600;color:#2d3748;">Event Time</label>
            <input type="datetime-local" name="event_time" value="{{ $event->event_time ? \Carbon\Carbon::parse($event->event_time)->format('Y-m-d\TH:i') : '' }}" required style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;">
        </div>
        
        <div style="margin-bottom:20px;">
            <label style="display:block;margin-bottom:8px;font-weight:600;color:#2d3748;">Description</label>
            <textarea name="description" rows="4" required style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;resize:vertical;">{{ $event->description }}</textarea>
        </div>
        
        <div style="margin-bottom:20px;">
            <label style="display:block;margin-bottom:8px;font-weight:600;color:#2d3748;">Current Image</label>
            @if($event->image_url)
                <img src="{{ asset($event->image_url) }}" alt="{{ $event->title }}" style="width:150px;height:150px;object-fit:cover;border-radius:10px;margin-bottom:15px;">
            @else
                <div style="width:150px;height:150px;background:#f7fafc;border:2px dashed #cbd5e0;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:15px;color:#a0aec0;">
                    <i class="fas fa-image"></i>
                </div>
            @endif
        </div>
        
        <div style="margin-bottom:30px;">
            <label style="display:block;margin-bottom:8px;font-weight:600;color:#2d3748;">Update Image (Optional)</label>
            <input type="file" name="image" accept="image/*" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;">
        </div>
        
        <div style="display:flex;gap:15px;">
            <button type="submit" class="btn" style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:12px 30px;">
                <i class="fas fa-save"></i>Update Event
            </button>
            <a href="{{ route('admin.events') }}" class="btn" style="background:#e2e8f0;color:#2d3748;padding:12px 30px;">
                <i class="fas fa-times"></i>Cancel
            </a>
        </div>
    </form>
</div>
@endsection