@extends('layouts.dashboard', ['activePage' => 'schedule'])

@section('title', 'Jadwal Belajar | StudyMatch')

@push('page-css')
    @vite(['resources/css/pages/schedule.css'])
@endpush

@push('page-js')
    @vite(['resources/js/pages/schedule.js'])
@endpush

@section('content')
<script id="sessions-data" type="application/json">
    {!! json_encode($sessions ?? []) !!}
</script>
<script id="recaps-data" type="application/json">
    {!! json_encode($recaps ?? []) !!}
</script>
<script>
    window.__INITIAL_SESSIONS__ = JSON.parse(document.getElementById('sessions-data').textContent);
    window.__INITIAL_RECAPS__ = JSON.parse(document.getElementById('recaps-data').textContent);
</script>

<div class="main-inner">
    <!-- Page Header -->
    <div class="page-header">
        <div class="page-header-left">
            <h2>Jadwal Belajar</h2>
            <p>Atur perjalanan akademismu. Sinkronisasi dengan partner belajar dan pantau pencapaian belajarmu.</p>
        </div>
        <div class="page-header-right">
            <div class="view-toggle">
                <button class="view-toggle-btn active" onclick="setView('monthly')">Bulanan</button>
                <button class="view-toggle-btn" onclick="setView('weekly')">Mingguan</button>
            </div>
          <button class="btn btn-primary" onclick="openCreateSession()">
            <span class="material-symbols-outlined">add_circle</span> Buat Sesi
          </button>
        </div>
    </div>

    <!-- Bento Grid -->
    <div class="bento-grid">
        <div class="card col-8">
            <div class="calendar-header">
                <h3 class="calendar-title" id="calTitle">
                    <span class="material-symbols-outlined">calendar_today</span> Juli 2026
                </h3>
                <div class="calendar-nav">
                    <button class="cal-nav-btn" onclick="prevMonth()">
                        <span class="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button class="cal-nav-btn" onclick="nextMonth()">
                        <span class="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>
            <div class="cal-grid" id="calGrid"></div>
        </div>

        <div class="col-4 right-col">
            <div class="integration-card">
                <div class="integration-card-content">
                    <h4>Hubungkan Layanan</h4>
                    <p>Sinkronisasikan sesi belajarmu langsung dengan platform video conference.</p>
                    <div class="integration-icons">
                        <div class="integration-icon-btn" onclick="window.open('https://meet.google.com', '_blank')" title="Google Meet">
                            <span class="material-symbols-outlined">videocam</span>
                        </div>
                        <div class="integration-icon-btn" onclick="window.open('https://zoom.us', '_blank')" title="Zoom">
                            <span class="material-symbols-outlined">group</span>
                        </div>
                    </div>
                </div>
                <div class="integration-bg-icon">
                    <span class="material-symbols-outlined">videocam</span>
                </div>
            </div>

            <div class="upcoming-card">
                <div class="upcoming-header">
                    <h3>Sesi Terdekat</h3>
                    <span class="upcoming-badge" id="upcomingBadge">Sesi Aktif</span>
                </div>
                <div class="sessions-list" id="sessionsList"></div>
            </div>
        </div>
    </div>
    
    <!-- Tabs Section -->
    <div class="tabs-section">
        <div class="tabs">
            <button class="tab-btn active" onclick="switchTab(0)">Riwayat &amp; Rekap</button>
            <button class="tab-btn" onclick="switchTab(1)">Sumber Daya Bersama</button>
            <button class="tab-btn" onclick="switchTab(2)">Performa Kelompok</button>
        </div>
        <div id="tabContent"></div>
    </div>
</div>

<!-- Agenda Modal -->
<div class="modal-overlay" id="agendaOverlay" onclick="closeAgenda()"></div>
<div class="modal-panel agenda-panel" id="agendaPanel">
    <div class="modal-panel-header">
        <h3>Detail Agenda</h3>
        <button class="modal-close-btn" onclick="closeAgenda()">
            <span class="material-symbols-outlined">close</span>
        </button>
    </div>
    <div class="modal-panel-body" id="agendaContent"></div>
</div>

<!-- Create Session Modal -->
<div class="modal-overlay" id="sessionOverlay" onclick="closeCreateSession()"></div>
<div class="modal-panel session-panel" id="sessionPanel">
    <div class="modal-panel-header">
        <h3>Buat Sesi Belajar</h3>
        <button class="modal-close-btn" onclick="closeCreateSession()">
            <span class="material-symbols-outlined">close</span>
        </button>
    </div>
    <div class="modal-panel-body">
        <form id="sessionForm" onsubmit="createSession(event)">
            <div class="sess-form-group">
                <label class="sess-label">Nama Sesi</label>
                <input class="sess-input" id="sessName" type="text" placeholder="cth. Kalkulus Lanjut III" required>
            </div>
            <div class="sess-form-row">
                <div class="sess-form-group" style="flex:1">
                    <label class="sess-label">Tanggal</label>
                    <input class="sess-input" id="sessDate" type="date" required>
                </div>
                <div class="sess-form-group" style="flex:1">
                    <label class="sess-label">Waktu</label>
                    <input class="sess-input" id="sessTime" type="time" required>
                </div>
                <div class="sess-form-group" style="flex:0.6">
                    <label class="sess-label">Durasi (mnt)</label>
                    <select class="sess-input" id="sessDuration">
                        <option value="30">30</option>
                        <option value="60" selected>60</option>
                        <option value="90">90</option>
                        <option value="120">120</option>
                    </select>
                </div>
            </div>
            <div class="sess-form-group">
                <label class="sess-label">Partner (pisahkan dengan koma)</label>
                <input class="sess-input" id="sessParticipants" type="text" placeholder="cth. Sarah, Liam">
            </div>
            <div class="sess-form-check">
                <input type="checkbox" id="sessMeet" checked>
                <label for="sessMeet">Buat link Google Meet</label>
            </div>
          <div class="sess-form-actions">
            <button type="button" class="btn btn-ghost" onclick="closeCreateSession()">Batal</button>
            <button type="submit" class="btn btn-primary" id="btnSubmitSession">Buat Sesi</button>
          </div>
        </form>
    </div>
</div>
@endsection