@extends('admin.layout')

@section('title', 'Events')

@section('content')
<div class="top-bar d-flex justify-content-between align-items-center mb-4">
    <h1 class="page-title m-0">Events Management</h1>
    <button class="btn btn-primary d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#createEventModal">
        <i class="material-icons">add_circle</i> Create Event
    </button>
</div>

<style>
    .table-container {
        background: white;
        border-radius: 10px;
        padding: 25px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th {
        background: #f8f9fa;
        padding: 15px;
        text-align: left;
        font-weight: 600;
        color: var(--color-primary);
        border-bottom: 2px solid #dee2e6;
    }

    td {
        padding: 15px;
        border-bottom: 1px solid #f0f0f0;
        vertical-align: middle;
    }

    tr:hover { background: #f8f9fa; }

    .event-img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
        background: #e0e0e0;
    }
</style>

<div class="card">
    <div class="card-header">Events</div>
    <div class="card-body table-container">
        <table class="datatable">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Time</th>
                    <th>Interested</th>
                    <th>Coming</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($events as $event)
                <tr>
                    <td>
                        @if($event->image_path)
                            <img src="{{ asset($event->image_path) }}" alt="{{ $event->title }}" class="event-img">
                        @else
                            <div class="event-img" style="display:flex;align-items:center;justify-content:center;">📅</div>
                        @endif
                    </td>
                    <td>{{ $event->title }}</td>
                    <td>{{ $event->location }}</td>
                    <td>{{ \Carbon\Carbon::parse($event->time)->format('M d, Y - h:i A') }}</td>
                    <td>{{ $event->interested_count ?? 0 }}</td>
                    <td>{{ $event->coming_count ?? 0 }}</td>
                    <td>
                        <div class="d-flex gap-2">
                            <button class="btn btn-warning btn-sm d-flex align-items-center justify-content-center p-2" style="color:white; border-radius:8px;" data-bs-toggle="modal" data-bs-target="#editEventModal{{ $event->id }}" title="Edit">
                                <i class="material-icons" style="font-size:18px;">edit</i>
                            </button>
                            <form action="{{ route('admin.events.destroy', $event) }}" method="POST" class="m-0">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm d-flex align-items-center justify-content-center p-2" style="border-radius:8px;" onclick="return confirm('Delete this event?')" title="Delete">
                                    <i class="material-icons" style="font-size:18px;">delete</i>
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>

                <!-- Edit Event Modal -->
                <div class="modal fade" id="editEventModal{{ $event->id }}" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-centered">
                        <div class="modal-content" style="border-radius:10px; border:none; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
                            <div class="modal-header border-0 pb-0">
                                <h5 class="modal-title" style="color:var(--color-primary); font-weight:600;"><i class="material-icons align-middle me-2">edit_calendar</i>Edit Event</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form action="{{ route('admin.events.update', $event) }}" method="POST" enctype="multipart/form-data">
                                @csrf
                                @method('PUT')
                                <div class="modal-body p-4">
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">Title *</label>
                                            <input type="text" name="title" class="form-control" value="{{ $event->title }}" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-bold">Location *</label>
                                            <input type="text" name="location" class="form-control" value="{{ $event->location }}" required>
                                        </div>
                                        <div class="col-md-12">
                                            <label class="form-label fw-bold">Date & Time *</label>
                                            <input type="datetime-local" name="time" class="form-control" value="{{ \Carbon\Carbon::parse($event->time)->format('Y-m-d\TH:i') }}" required>
                                        </div>
                                        <div class="col-md-12">
                                            <label class="form-label fw-bold">Description *</label>
                                            <textarea name="description" class="form-control" rows="3" required>{{ $event->description }}</textarea>
                                        </div>
                                        <div class="col-md-12">
                                            <label class="form-label fw-bold">Event Image</label>
                                            <input type="file" name="image" class="form-control" accept="image/*">
                                            @if($event->image_path)
                                                <div class="mt-2 text-muted small">Current image: <img src="{{ asset($event->image_path) }}" height="40" class="ms-2 rounded"></div>
                                            @endif
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer border-0 pt-0">
                                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                                    <button type="submit" class="btn btn-primary">Update Event</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="pagination">
            {{ $events->links() }}
        </div>
    </div>
</div>

<!-- Create Event Modal -->
<div class="modal fade" id="createEventModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content" style="border-radius:10px; border:none; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title" style="color:var(--color-primary); font-weight:600;"><i class="material-icons align-middle me-2">event_note</i>Create New Event</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form action="{{ route('admin.events.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="modal-body p-4">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Title *</label>
                            <input type="text" name="title" class="form-control" required placeholder="Event Name">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Location *</label>
                            <input type="text" name="location" class="form-control" required placeholder="Event Location">
                        </div>
                        <div class="col-md-12">
                            <label class="form-label fw-bold">Date & Time *</label>
                            <input type="datetime-local" name="time" class="form-control" required>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label fw-bold">Description *</label>
                            <textarea name="description" class="form-control" rows="3" required placeholder="What is this event about?"></textarea>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label fw-bold">Event Image</label>
                            <input type="file" name="image" class="form-control" accept="image/*">
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-success d-flex align-items-center gap-1"><i class="material-icons" style="font-size:18px;">save</i> Save Event</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
