@extends('admin.layout')

@section('title', 'Users')

@section('content')
<div class="top-bar">
    <h1 class="page-title">Users Management</h1>
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
    }

    tr:hover {
        background: #f8f9fa;
    }

    .user-img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
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
    <div class="card-header">Users</div>
    <div class="card-body table-container">
    <table class="datatable">
        <thead>
            <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Location</th>
                <th>Joined</th>
            </tr>
        </thead>
        <tbody>
            @foreach($users as $user)
            <tr>
                <td>
                    @if($user->profile_image)
                        <img src="{{ asset($user->profile_image) }}" alt="{{ $user->first_name }}" class="user-img">
                    @else
                        <div class="user-img" style="background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                            {{ strtoupper(substr($user->first_name, 0, 1)) }}
                        </div>
                    @endif
                </td>
                <td><strong>{{ $user->first_name }} {{ $user->last_name }}</strong></td>
                <td>{{ $user->email }}</td>
                <td>{{ $user->location ?? 'N/A' }}</td>
                <td>{{ $user->created_at->format('M d, Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    
    <div class="pagination">
        {{ $users->links() }}
    </div>
    </div> <!-- /.card-body -->
</div> <!-- /.card -->
@endsection
