@extends('admin.layout')

@section('title', 'All Dogs')

@section('content')
<div class="top-bar">
    <h1 class="page-title">All Dogs</h1>
</div>

<style>
    /* reuse user table styles, adapted for dogs */
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

    tr:hover {
        background: #f8f9fa;
    }

    .dog-img {
        width: 60px;
        height: 60px;
        border-radius: 6px;
        object-fit: cover;
        background: #e0e0e0;
    }

    .pagination {
        margin-top: 20px;
        display: flex;
        gap: 5px;
    }

    .pagination a, .pagination span {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        text-decoration: none;
        color: var(--color-primary);
    }

    .pagination .active {
        background: var(--color-primary);
        color: white;
    }
</style>

<div class="card">
    <div class="card-header">All Dogs</div>
    <div class="card-body table-container">
    <table class="datatable">
        <thead>
            <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Breed</th>
                <th>Status</th>
                <th>Location</th>
                <th>Reported</th>
            </tr>
        </thead>
        <tbody>
            @foreach($dogs as $dog)
            <tr>
                <td>
                    @if($dog->images && is_array($dog->images) && count($dog->images) > 0)
                        <img src="{{ asset($dog->images[0]) }}" alt="{{ $dog->name }}" class="dog-img">
                    @else
                        <div class="dog-img" style="display: flex; align-items: center; justify-content: center; font-size: 1.5em;">🐕</div>
                    @endif
                </td>
                <td><strong>{{ $dog->name }}</strong></td>
                <td>{{ $dog->breed }}</td>
                <td>{{ ucfirst($dog->status) }}</td>
                <td>{{ $dog->last_location ?? 'N/A' }}</td>
                <td>{{ $dog->created_at->format('M d, Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="pagination">
        {{ $dogs->links() }}
    </div>
    </div> <!-- /.card-body -->
</div> <!-- /.card -->
@endsection
