@extends('admin.layout')

@section('title', 'Create Event')

@section('content')
<div class="card">
    <h3><i class="fas fa-plus-circle" style="margin-right:10px;color:#667eea;"></i>Create New Event</h3>
    
    <form action="{{ route('admin.events.store') }}" method="POST" enctype="multipart/form-data" style="margin-top:30px;">
        @csrf
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
            <div>
                <label style="display:block;margin-bottom:8px;font-weight:600;color:#2d3748;">Title</label>
                <input type="text" name="title" required style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;">
            </div>
            <div>
                <label style="display:block;margin-bottom:8px;font-weight:600;color:#2d3748;">Location</label>
                <input type="text" name="location" required style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;">
            </div>
        </div>
        
        <div style="margin-bottom:20px;">
            <label style="display:block;margin-bottom:8px;font-weight:600;color:#2d3748;">Event Time</label>
            <input type="datetime-local" name="event_time" required style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;">
        </div>
        
        <div style="margin-bottom:20px;">
            <label style="display:block;margin-bottom:8px;font-weight:600;color:#2d3748;">Description</label>
            <textarea name="description" rows="4" required style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;resize:vertical;"></textarea>
        </div>
        
        <div style="margin-bottom:30px;">
            <label style="display:block;margin-bottom:8px;font-weight:600;color:#2d3748;">Event Image</label>
            <input type="file" name="image" accept="image/*" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;">
        </div>
        
        <div style="display:flex;gap:15px;">
            <button type="submit" class="btn" style="background:linear-gradient(135deg,#38a169,#2f855a);color:white;padding:12px 30px;">
                <i class="fas fa-save"></i>Create Event
            </button>
            <a href="{{ route('admin.events') }}" class="btn" style="background:#e2e8f0;color:#2d3748;padding:12px 30px;">
                <i class="fas fa-times"></i>Cancel
            </a>
        </div>
    </form>
</div>
@endsection