<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@yield('title', 'StudyMatch')</title>
    <link rel="icon" type="image/png" href="{{ asset('images/logo.png') }}?v=2" />
    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}?v=2" />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    @vite(['resources/css/app.css', 'resources/css/pages/landing.css', 'resources/js/app.js', 'resources/js/pages/landing.js'])
    @stack('styles')
</head>
<body>
    <nav id="navbar">
        <span class="nav-logo" onclick="scrollToTop()"> <a href="{{ route('landing') }}">StudyMatch</a></span>

        <div class="nav-links">
            <a href="#fitur">Fitur</a>
            <a href="#cara-kerja">Cara Kerja</a>
            <a href="#tentang-kami">Tentang Kami</a>
            <a href="#faq">FAQ</a>
        </div>

        <div class="nav-right">
            <a href="{{ route('login') }}" class="btn-nav btn-nav-outline">Masuk</a>
            <a href="{{ route('login') }}" class="btn-nav btn-nav-fill">Daftar Gratis</a>
            <div class="nav-hamburger" id="hamburger" onclick="toggleMenu()">
                <span></span><span></span><span></span>
            </div>
        </div>
    </nav>

    <div class="mobile-menu" id="mobileMenu">
        <a href="#fitur" onclick="closeMenu()">Fitur</a>
        <a href="#cara-kerja" onclick="closeMenu()">Cara Kerja</a>
        <a href="#tentang-kami" onclick="closeMenu()">Tentang Kami</a>
        <a href="#faq" onclick="closeMenu()">FAQ</a>
        <div class="mobile-menu-divider"></div>
        <div class="mobile-menu-actions">
            <a href="{{ route('login') }}" class="btn-nav btn-nav-outline">Masuk</a>
            <a href="{{ route('login') }}" class="btn-nav btn-nav-fill">Daftar Gratis</a>
        </div>
    </div>

    <main>
        @yield('content')
    </main>

    @include('partials.footer-landing')

    <button class="back-to-top" id="backToTop" onclick="scrollToTop()" title="Kembali ke atas">
        <span class="material-symbols-outlined">arrow_upward</span>
    </button>

    <div class="toast" id="toast">
        <span class="material-symbols-outlined toast-icon">check_circle</span>
        <span id="toastMsg">Berhasil!</span>
    </div>

    @stack('scripts')
</body>
</html>
