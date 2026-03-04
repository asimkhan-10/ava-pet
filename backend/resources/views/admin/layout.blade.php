<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title') - AVA PET Admin</title>

    <!-- fonts & icons -->
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <!-- bootstrap & datatables (CDN for prototyping) -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" integrity="sha384-..." crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.5/css/dataTables.bootstrap5.min.css" />
    <link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.bootstrap5.min.css" />

    <style>
        :root {
            --color-primary: #0c7ce6;
            --color-success: #04BE5B;
            --color-danger: #ee2558;
            --bg-light: #f5f5f5;
            --sidebar-width: 250px;
            --sidebar-collapsed: 50px;
            --card-radius: 10px;
            --transition-fast: 0.5s;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Comfortaa', cursive;
            font-size: 15px;
            background: var(--bg-light);
            overflow-x: hidden;
        }

        /* loader overlay */
        #page-loader {
            position: fixed;
            top:0; left:0; width:100%; height:100%;
            background: rgba(255,255,255,0.9);
            display:flex; align-items:center; justify-content:center;
            z-index:2000;
            visibility:hidden;
            opacity:0;
            transition:opacity var(--transition-fast) ease;
        }
        #page-loader.active {
            visibility:visible;
            opacity:1;
        }

        /* utilities (spacing, text, colors) */
        .m-0 { margin:0!important; }
        .m-5 { margin:5px!important; }
        .m-10 { margin:10px!important; }
        .m-15 { margin:15px!important; }
        .p-5 { padding:5px!important; }
        .p-10 { padding:10px!important; }
        .p-15 { padding:15px!important; }
        .text-center { text-align:center!important; }
        .text-right { text-align:right!important; }
        .text-primary { color: var(--color-primary) !important; }
        .text-success { color: var(--color-success) !important; }
        .text-danger { color: var(--color-danger) !important; }
        
        .btn-primary { background: var(--color-primary) !important; border-color: var(--color-primary) !important; color: white !important; }
        .btn-success { background: var(--color-success) !important; border-color: var(--color-success) !important; color: white !important; }
        .btn-danger { background: var(--color-danger) !important; border-color: var(--color-danger) !important; color: white !important; }
        .btn { box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-radius: 6px; transition: var(--transition-fast); }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.15); }

        /* sidebar */
        .sidebar {
            position: fixed;
            left:0; top:0; height:100vh;
            width: var(--sidebar-width);
            background: #ffffff;
            border-right:1px solid #ddd;
            transition: width var(--transition-fast);
            z-index:1000;
            overflow:hidden;
        }
        .sidebar.collapsed {
            width: var(--sidebar-collapsed);
        }
        .sidebar.collapsed .label { display:none; }
        .sidebar.collapsed .profile div { display:none; }
        .sidebar.collapsed .profile img { margin:0 auto; }
        .sidebar .profile {
            padding:20px;
            text-align:center;
            border-bottom:1px solid #eee;
        }
        .sidebar .profile img {
            width:60px; height:60px;
            border-radius:50%;
        }
        .sidebar .nav {
            list-style:none;
            padding:0;
            margin:0;
        }
        .sidebar .nav li a {
            display:flex; align-items:center;
            padding:15px 20px;
            color:#333; text-decoration:none;
            transition:background var(--transition-fast);
        }
        .sidebar .nav li a i.material-icons { font-size:24px; }
        .sidebar .nav li a span.label {
            margin-left:10px;
            white-space:nowrap;
        }
        .sidebar .nav li a.active, .sidebar .nav li a:hover {
            background: var(--color-primary);
            color:white;
        }
        .sidebar .nav li.has-submenu > .sub-menu {
            display: none;
            list-style: none;
            padding-left: 20px;
        }
        .sidebar .nav li.has-submenu.open > .sub-menu {
            display: block;
        }
        .sidebar .nav li .submenu-toggle {
            font-size: 16px;
            transition: transform var(--transition-fast);
        }
        .sidebar .nav li.has-submenu.open .submenu-toggle {
            transform: rotate(-180deg);
        }
        .sidebar .nav li a:hover i.material-icons {
            transform: rotate(20deg);
            transition:transform var(--transition-fast);
        }

        /* main content */
        .main-content {
            margin-left: var(--sidebar-width);
            padding:30px;
            transition:margin-left var(--transition-fast);
        }
        .sidebar.collapsed ~ .main-content {
            margin-left: var(--sidebar-collapsed);
        }

        /* cards */
        .card {
            border-radius: var(--card-radius);
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            transition:box-shadow var(--transition-fast);
        }
        .card:hover { box-shadow:0 4px 20px rgba(0,0,0,0.1); }

        .card-header { background:#fff; border-bottom:1px solid #eee; font-weight:600; }

        /* page title */
        h1.page-title { font-size:22px; margin-bottom:20px; }

        /* responsive */
        @media (max-width: 768px) {
            .sidebar { left:-100%; }
            .sidebar.mobile-open { left:0; }
            .main-content { margin-left:0; }
        }
    </style>
</head>
<body>
    <!-- page loader -->
    <div id="page-loader"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>

    <!-- sidebar -->
    <div class="sidebar" id="sidebar">
        <div class="profile">
            <img src="{{ asset('uploads/default-profile.png') }}" alt="Admin">
            <div class="mt-2">Admin Name</div>
        </div>
        <ul class="nav">
            <li><a href="{{ route('admin.dashboard') }}" class="{{ request()->routeIs('admin.dashboard') ? 'active' : '' }}"><i class="material-icons">dashboard</i><span class="label">Dashboard</span></a></li>
            <li><a href="{{ route('admin.users') }}" class="{{ request()->routeIs('admin.users') ? 'active' : '' }}"><i class="material-icons">people</i><span class="label">Users</span></a></li>
            <li><a href="{{ route('admin.dogs') }}" class="{{ request()->routeIs('admin.dogs') ? 'active' : '' }}"><i class="material-icons">pets</i><span class="label">All Dogs</span></a></li>
            <li><a href="{{ route('admin.missing-dogs') }}" class="{{ request()->routeIs('admin.missing-dogs') ? 'active' : '' }}"><i class="material-icons">search</i><span class="label">Missing Dogs</span></a></li>
            <li class="has-submenu">
                <a href="#" class="{{ request()->routeIs('admin.events*') ? 'active' : '' }}"><i class="material-icons">event</i><span class="label">Events</span><i class="material-icons ms-auto submenu-toggle">expand_more</i></a>
                <ul class="sub-menu">
                    <li><a href="{{ route('admin.events') }}">All Events</a></li>
                    <li><a href="{{ route('admin.events.create') }}">Create Event</a></li>
                </ul>
            </li>
        </ul>
        <button id="toggle-sidebar" class="btn btn-sm btn-primary" style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);">Toggle</button>
    </div>

    <div class="main-content">
        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif
        
        @yield('content')
    </div>

    <!-- scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-..." crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.7.0.min.js" integrity="sha384-..." crossorigin="anonymous"></script>
    <script src="https://cdn.datatables.net/1.13.5/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.5/js/dataTables.bootstrap5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.bootstrap5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const sidebar = document.getElementById('sidebar');
            document.getElementById('toggle-sidebar').addEventListener('click', function () {
                sidebar.classList.toggle('collapsed');
            });

            // mobile hamburger
            const burger = document.createElement('button');
            burger.innerHTML = '<i class="material-icons">menu</i>';
            burger.className = 'btn btn-sm btn-primary d-md-none';
            burger.style.position = 'fixed';
            burger.style.top = '15px';
            burger.style.left = '15px';
            document.body.appendChild(burger);
            burger.addEventListener('click', function () {
                sidebar.classList.toggle('mobile-open');
            });

            // hide loader
            window.addEventListener('load', function () {
                document.getElementById('page-loader').classList.remove('active');
            });

            // initialize datatables if present
            if (window.jQuery && $.fn.dataTable) {
                $('.datatable').DataTable({
                    responsive: true,
                    dom: 'Bfrtip',
                    buttons: ['copy','csv','excel','pdf','print'],
                    pageLength: 10,
                    stripeClasses: ['stripe1','stripe2'],
                });
            }

            // submenu toggle
            document.querySelectorAll('.sidebar .has-submenu > a').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    this.parentElement.classList.toggle('open');
                });
            });
        });
    </script>
</body>
</html>
