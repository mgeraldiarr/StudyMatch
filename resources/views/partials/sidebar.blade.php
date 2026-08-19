<aside class="sidebar" id="sidebar">
    <div class="sb-head">
        <a href="{{ route('dashboard.discovery') }}">
            <span class="sb-logo">StudyMatch</span>
        </a>
        <span class="sb-tag">The Intellectual Atelier</span>
    </div>

    <div class="sb-user" data-url="{{ route('dashboard.user-profile') }}" onclick="window.location.href=this.dataset.url">
        <div class="sb-avatar">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ_EKuVYe8DVz3xhNB1IDos9wyTPWBDFIz02_iHUF6jG9iAIhHpoTlStYIrxGaO7JJvxVdoqDvvgsnNDGdewZsm7P0aJpDbJdPhAeE70zUgqPekprvuVN3LRvsQZKdf_2qQ325NNi_EyAD4WxkKrLTYGHUzDhIQX9hpukdXn_hHh5YMCeZ2vJ303g49r7erhOHGRyCc3zArc8OI8kdOrtj7DpPqByRV-5mhVZZjJoC6A-w0B80CqPOq5bmN9RzH_CUf8Uhd-2DqEA" alt="User" />
        </div>
        <div>
            <div class="sb-uname">Alya Ramadhani</div>
            <div class="sb-usub">Teknik Informatika, UI</div>
        </div>
        <div class="online-dot"></div>
    </div>

    <nav class="sb-nav">
        <span class="sb-sec-label">Menu Utama</span>
        <a class="nav-item {{ $activePage === 'discovery' ? 'active' : '' }}" href="{{ route('dashboard.discovery') }}">
            <span class="material-symbols-outlined">explore</span>
            <span>Discovery</span>
        </a>
        <a class="nav-item {{ $activePage === 'schedule' ? 'active' : '' }}" href="{{ route('dashboard.schedule') }}">
            <span class="material-symbols-outlined">calendar_month</span>
            <span>Jadwal</span>
        </a>
        <a class="nav-item {{ $activePage === 'chat' ? 'active' : '' }}" href="{{ route('dashboard.chat') }}">
            <span class="material-symbols-outlined">chat_bubble</span>
            <span>Pesan</span>
        </a>
        <a class="nav-item {{ $activePage === 'community' ? 'active' : '' }}" href="{{ route('dashboard.community') }}">
            <span class="material-symbols-outlined">forum</span>
            <span>Komunitas</span>
        </a>

        <span class="sb-sec-label">Akun</span>
        <a class="nav-item {{ $activePage === 'user-profile' ? 'active' : '' }}" href="{{ route('dashboard.user-profile') }}">
            <span class="material-symbols-outlined">account_circle</span>
            <span>Profil Saya</span>
        </a>
        <a class="nav-item {{ $activePage === 'notification' ? 'active' : '' }}" href="{{ route('dashboard.notification') }}">
            <span class="material-symbols-outlined">notifications</span>
            <span>Notifikasi</span>
        </a>
        <a class="nav-item {{ $activePage === 'settings' ? 'active' : '' }}" href="{{ route('dashboard.settings') }}">
            <span class="material-symbols-outlined">settings</span>
            <span>Pengaturan</span>
        </a>
        <div class="sb-divider"></div>
        <a class="nav-item" href="{{ route('auth.login') }}">
            <span class="material-symbols-outlined">logout</span>
            <span>Keluar</span>
        </a>
    </nav>

    <div class="sb-cta">
        <button class="sb-cta-btn" onclick="toast('Mencari partner terbaikmu…', 'info')">
            <span class="material-symbols-outlined" style="font-size: 16px">person_add</span>
            Cari Partner Belajar
        </button>
    </div>
    <div class="sb-foot">
        <a href="{{ route('dashboard.help') }}">
            <span class="material-symbols-outlined">help</span>
            Bantuan
        </a>
    </div>
</aside>