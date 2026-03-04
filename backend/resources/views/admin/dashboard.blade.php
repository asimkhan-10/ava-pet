@extends('admin.layout')

@section('title', 'Dashboard')

@section('content')
<div class="top-bar">
    <h1 class="page-title">Dashboard Overview</h1>
</div>

<style>
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }

    .stat-card {
        background: white;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        transition: transform 0.3s;
    }

    .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    }

    .stat-icon {
        font-size: 2.5em;
        margin-bottom: 10px;
    }

    .stat-value {
        font-size: 2.2em;
        font-weight: bold;
        color: var(--color-primary);
        margin-bottom: 5px;
    }

    .stat-label {
        color: #666;
        font-size: 0.95em;
    }

    .content-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
        gap: 20px;
        margin-top: 30px;
    }

    .section-card {
        background: white;
        border-radius: 10px;
        padding: 25px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    }

    .section-card h2 {
        color: var(--color-primary);
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #f0f0f0;
    }

    .dogs-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
    }

    .dog-mini-card {
        background: #f8f9fa;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.3s;
    }

    .dog-mini-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .dog-mini-img {
        width: 100%;
        height: 120px;
        object-fit: cover;
        background: #e0e0e0;
    }

    .dog-mini-info {
        padding: 10px;
    }

    .dog-mini-name {
        font-weight: bold;
        color: var(--color-primary);
        font-size: 0.9em;
        margin-bottom: 5px;
    }

    .dog-mini-breed {
        font-size: 0.8em;
        color: #666;
    }

    .dog-mini-location {
        font-size: 0.75em;
        color: #888;
        margin-bottom: 4px;
    }

    .mini-badge {
        display: inline-block;
        padding: 3px 8px;
        border-radius: 12px;
        font-size: 0.75em;
        font-weight: bold;
        margin-top: 5px;
    }

    .badge-lost {
        background: #ffebee;
        color: #c62828;
    }

    .badge-found {
        background: #e8f5e9;
        color: #2e7d32;
    }

    .view-all {
        text-align: center;
        margin-top: 15px;
    }

    .view-all a {
        color: var(--color-primary);
        text-decoration: none;
        font-weight: 600;
    }
</style>

<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-value">{{ $stats['total_users'] }}</div>
        <div class="stat-label">Total Users</div>
    </div>

    <div class="stat-card">
        <div class="stat-icon">🐕</div>
        <div class="stat-value">{{ $stats['total_dogs'] }}</div>
        <div class="stat-label">Total Dogs</div>
    </div>

    <div class="stat-card">
        <div class="stat-icon">🔍</div>
        <div class="stat-value">{{ $stats['lost_dogs'] }}</div>
        <div class="stat-label">Missing Dogs</div>
    </div>

    <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-value">{{ $stats['found_dogs'] }}</div>
        <div class="stat-label">Found Dogs</div>
    </div>

    <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-value">{{ $stats['total_events'] }}</div>
        <div class="stat-label">Total Events</div>
    </div>
</div>

<div class="content-grid">
    <div class="section-card">
        <h2>🐕 Recently Added Dogs</h2>
        <div class="dogs-grid">
            @forelse($recent_dogs as $dog)
            <div class="dog-mini-card">
                @if($dog->images && is_array($dog->images) && count($dog->images) > 0)
                    <img src="{{ asset($dog->images[0]) }}" alt="{{ $dog->name }}" class="dog-mini-img">
                @else
                    <div class="dog-mini-img" style="display: flex; align-items: center; justify-content: center; font-size: 2em;">🐕</div>
                @endif
                <div class="dog-mini-info">
                    <div class="dog-mini-name">{{ $dog->name }}</div>
                    <div class="dog-mini-breed">{{ $dog->breed }}</div>
                    <div class="dog-mini-location">{{ $dog->last_location ?? 'N/A' }}</div>
                    <span class="mini-badge badge-{{ $dog->status }}">{{ strtoupper($dog->status) }}</span>
                </div>
            </div>
            @empty
            <div style="grid-column: 1/-1; text-align: center; color: #999; padding: 20px;">No dogs yet</div>
            @endforelse
        </div>
        <div class="view-all">
            <a href="{{ route('admin.dogs') }}">View All Dogs →</a>
        </div>
    </div>

    <div class="section-card">
        <h2>🔍 Missing Dogs</h2>
        <div class="dogs-grid">
            @forelse($missing_dogs as $dog)
            <div class="dog-mini-card" style="border: 2px solid #ffebee;">
                @if($dog->images && is_array($dog->images) && count($dog->images) > 0)
                    <img src="{{ asset($dog->images[0]) }}" alt="{{ $dog->name }}" class="dog-mini-img">
                @else
                    <div class="dog-mini-img" style="display: flex; align-items: center; justify-content: center; font-size: 2em;">🐕</div>
                @endif
                <div class="dog-mini-info">
                    <div class="dog-mini-name" style="color: var(--color-danger);">{{ $dog->name }}</div>
                    <div class="dog-mini-breed">{{ $dog->breed }}</div>
                    <div class="dog-mini-location">{{ $dog->last_location ?? 'N/A' }}</div>
                    <span class="mini-badge badge-lost">⚠️ MISSING</span>
                </div>
            </div>
            @empty
            <div style="grid-column: 1/-1; text-align: center; color: #999; padding: 20px;">No missing dogs</div>
            @endforelse
        </div>
        <div class="view-all">
            <a href="{{ route('admin.missing-dogs') }}">View All Missing Dogs →</a>
        </div>
    </div>
</div>
@endsection
