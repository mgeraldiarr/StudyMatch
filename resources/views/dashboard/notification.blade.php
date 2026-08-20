@extends('layouts.dashboard', ['activePage' => 'notification'])

@section('title', 'Pusat Notifikasi | StudyMatch')

@push('page-css')
    @vite(['resources/css/pages/notification.css', 'resources/js/pages/notification.js'])
@endpush

@section('content')
    <div class="main-inner">
      <!-- Page Header -->
      <header class="page-header">
        <div>
          <h1>Pusat Notifikasi</h1>
          <p>Pantau permintaan belajar, pembaruan forum, dan aktivitas lainnya.</p>
        </div>
        <div class="filter-controls">
          <div class="filter-tabs" role="tablist">
            <button class="filter-tab active" data-filter="all" role="tab">
              <span>Semua</span>
            </button>
            <button class="filter-tab" data-filter="request" role="tab">
              <span>Permintaan ({{ $incomingRequests->where('status', 'pending')->count() }})</span>
            </button>
            <button class="filter-tab" data-filter="update" role="tab">
              <span>Pembaruan</span>
            </button>
            <button class="filter-tab" data-filter="mention" role="tab">
              <span>Mention</span>
            </button>
          </div>
          <div class="action-controls">
            <button class="btn btn-ghost btn-sm" id="btnMarkAll" title="Tandai semua telah dibaca">
              <span class="material-symbols-outlined">done_all</span>
              <span>Tandai Semua Dibaca</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Notifications List -->
      <div class="notifs-list" id="notifsList">
        @forelse($incomingRequests as $req)
          <div class="notif-card reveal reveal-delay-1" data-type="request" data-id="{{ $req->id }}" data-read="{{ $req->status !== 'pending' ? 'true' : 'false' }}">
            <div class="notif-avatar-wrap">
              <div class="notif-avatar">
                <img alt="{{ $req->sender->name ?? 'Mahasiswa' }}"
                  src="{{ $req->sender->avatar ?: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28' }}" />
              </div>
              @if($req->status === 'pending')
                <div class="notif-badge"></div>
              @endif
            </div>
            <div class="notif-body">
              <div class="notif-top">
                <h3 class="notif-title">Permintaan Belajar</h3>
                <span class="notif-time">{{ $req->created_at->diffForHumans() }}</span>
              </div>
              <p class="notif-text">
                <span class="highlight">{{ $req->sender->name ?? 'Mahasiswa' }}</span> ({{ $req->sender->university ?? 'Universitas' }}) mengajak kamu belajar bersama:
                <em>"{{ $req->message ?: 'Hai! Mau belajar bareng di StudyMatch?' }}"</em>
              </p>
              @if($req->sender && $req->sender->courses->isNotEmpty())
                <div style="margin-top: 6px; margin-bottom: 8px;">
                  @foreach($req->sender->courses->take(3) as $c)
                    <span class="tag" style="font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; background: rgba(99, 102, 241, 0.1); color: var(--primary);">{{ $c->name }}</span>
                  @endforeach
                </div>
              @endif

              <div class="notif-actions" id="actions-{{ $req->id }}">
                @if($req->status === 'pending')
                  <button class="btn btn-sm btn-primary notif-accept" data-id="{{ $req->id }}" data-action="accept">Terima</button>
                  <button class="btn btn-sm btn-ghost notif-decline" data-id="{{ $req->id }}" data-action="decline">Tolak</button>
                @elseif($req->status === 'accepted')
                  <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #059669; font-weight: 600; padding: 4px 10px; border-radius: 6px; font-size: 0.8125rem;">
                    ✓ Permintaan Diterima
                  </span>
                  <a href="{{ route('dashboard.chat') }}" class="btn btn-sm btn-ghost" style="margin-left: 8px;">
                    <span class="material-symbols-outlined" style="font-size: 16px;">chat</span> Buka Chat
                  </a>
                @else
                  <span class="badge" style="background: rgba(239, 68, 68, 0.15); color: #dc2626; font-weight: 600; padding: 4px 10px; border-radius: 6px; font-size: 0.8125rem;">
                    ✕ Permintaan Ditolak
                  </span>
                @endif
              </div>
            </div>
            <div class="notif-more" title="Opsi lainnya">
              <button class="btn btn-icon-only btn-ghost notif-more-btn">
                <span class="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>
        @empty
        @endforelse

        <!-- System Reminders & Community Updates -->
        <div class="notif-card reveal reveal-delay-2" data-type="update" data-id="sys-1" data-read="false">
          <div class="notif-avatar-wrap">
            <div class="notif-avatar-icon secondary">
              <span class="material-symbols-outlined fill-1">schedule</span>
            </div>
          </div>
          <div class="notif-body">
            <div class="notif-top">
              <h3 class="notif-title">Pengingat Sistem</h3>
              <span class="notif-time">30 menit lalu</span>
            </div>
            <p class="notif-text">
              Sesi belajar kelompok minggu ini telah dijadwalkan. Cek kalender belajarmu untuk melihat agenda terbaru.
            </p>
            <a href="{{ route('dashboard.schedule') }}" class="btn btn-sm btn-primary notif-join">
              Lihat Jadwal <span class="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
          <div class="notif-more" title="Opsi lainnya">
            <button class="btn btn-icon-only btn-ghost notif-more-btn">
              <span class="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>

        <div class="notif-card reveal reveal-delay-3" data-type="mention" data-id="sys-2" data-read="false">
          <div class="notif-avatar-wrap">
            <div class="notif-avatar-icon tertiary">
              <span class="material-symbols-outlined">forum</span>
            </div>
          </div>
          <div class="notif-body">
            <div class="notif-top">
              <h3 class="notif-title">Pembaruan Forum</h3>
              <span class="notif-time">1 jam lalu</span>
            </div>
            <p class="notif-text notif-quote">
              "Ada rekomendasi buku referensi terbaik untuk Algoritma dan Pemrograman?"
            </p>
            <p class="notif-sub">
              Diskusi hangat di saluran <span class="channel"># Ilmu Komputer</span>
            </p>
            <a href="{{ route('dashboard.community') }}" class="btn btn-sm btn-ghost">
              <span class="material-symbols-outlined" style="font-size: 16px;">forum</span> Buka Forum
            </a>
          </div>
          <div class="notif-more" title="Opsi lainnya">
            <button class="btn btn-icon-only btn-ghost notif-more-btn">
              <span class="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" id="emptyState" style="display: none;">
        <div class="empty-state-icon">
          <span class="material-symbols-outlined">check_circle</span>
        </div>
        <h4 class="empty-state-title">Semua notifikasi telah dibaca</h4>
        <p class="empty-state-desc">Periksa kembali nanti untuk pembaruan akademis baru.</p>
      </div>
    </div>

    <!-- Modals -->
    <div class="modal-overlay" id="moreMenuModal">
      <div class="modal-content modal-menu" onclick="event.stopPropagation()">
        <button class="modal-item" data-action="mark-read">
          <span class="material-symbols-outlined">done</span>
          <span>Tandai telah Dibaca</span>
        </button>
        <button class="modal-item" data-action="archive">
          <span class="material-symbols-outlined">archive</span>
          <span>Arsipkan</span>
        </button>
        <button class="modal-item" data-action="snooze">
          <span class="material-symbols-outlined">schedule</span>
          <span>Tunda</span>
        </button>
        <hr class="modal-divider">
        <button class="modal-item danger" data-action="delete">
          <span class="material-symbols-outlined">delete</span>
          <span>Hapus</span>
        </button>
      </div>
    </div>
@endsection
