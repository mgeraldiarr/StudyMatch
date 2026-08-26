<!doctype html>
<html lang="id">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title>@yield('title', 'StudyMatch')</title>
    <link rel="icon" type="image/png" href="{{ asset('images/logo.png') }}?v=2" />
    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}?v=2" />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    @vite(['resources/css/app.css', 'resources/js/app.js', 'resources/js/lib/common.js'])
    @stack('page-css')
    @stack('styles')
</head>

<body>
    <div id="prog"></div>

    <div class="sb-overlay" id="sbOverlay" onclick="closeSidebar()"></div>

    @include('partials.sidebar', ['activePage' => $activePage ?? ''])

    @include('partials.topbar')

    <div class="main">
        @yield('content')
    </div>

    @if (!isset($hideFooter) || !$hideFooter)
    @include('partials.footer-dashboard')
    @endif

    @stack('page-js')
    @stack('scripts')
</body>

</html>