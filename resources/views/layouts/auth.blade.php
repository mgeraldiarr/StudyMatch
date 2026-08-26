<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title>@yield('title', 'StudyMatch')</title>
    <link rel="icon" type="image/png" href="{{ asset('images/logo.png') }}?v=2" />
    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}?v=2" />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    @vite(['resources/css/app.css', 'resources/css/pages/login.css', 'resources/js/app.js', 'resources/js/pages/login.js'])
    @stack('styles')
</head>
<body>
    <div id="progress-bar"></div>

    <nav>
        <a href="{{ route('landing') }}" class="nav-back">
            <span class="material-symbols-outlined nav-back-icon">arrow_back</span>
            Kembali
        </a>
        <span class="nav-logo">StudyMatch</span>
        <div class="nav-spacer"></div>
    </nav>

    @yield('content')

    <footer>
        <div class="footer-inner">
            <span class="footer-logo">StudyMatch</span>
            <ul class="footer-links">
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Campus Partners</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
            <p class="footer-copy">&copy; {{ date('Y') }} StudyMatch</p>
        </div>
    </footer>

    <div class="toast" id="toast">
        <span class="material-symbols-outlined toast-icon-success toast-icon" id="toast-icon">check_circle</span>
        <span id="toast-msg">Berhasil!</span>
    </div>

    @stack('scripts')
</body>
</html>
