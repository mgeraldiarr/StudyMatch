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
              <span>Permintaan</span>
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
        <!-- 1: Study Request -->
        <div class="notif-card reveal reveal-delay-1" data-type="request" data-id="1" data-read="false">
          <div class="notif-avatar-wrap">
            <div class="notif-avatar">
              <img alt="Anisa Rahmawati"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2qWvjE3KfeMOWurbQda7IVvSWmE6ri3x1PqqsSdR1SsjJM44bWnYXJuRTz_ec0VmBGBnYPUWIdE6z2bgvllgTiQy5ThI-OUYd89pJIL2ruIz9NChaiT2rO0ZIGZZX1vnOEr_jD7XqqxUJO6lXzn63wM0BJELs-qnDmzvA45VkqYFCA0VNmkui4qOdpk7GK_6gg870JgvD1FREl0pX_OuptXLLYRRcSLJArlRGMqDScXLpxtCYyQEdxHmhsFgfgQNyUmiHsgoNmJ4" />
            </div>
            <div class="notif-badge"></div>
          </div>
          <div class="notif-body">
            <div class="notif-top">
              <h3 class="notif-title">Permintaan Belajar</h3>
              <span class="notif-time">2 menit lalu</span>
            </div>
            <p class="notif-text">
              <span class="highlight">Anisa Rahmawati</span> mengajak kamu belajar bersama untuk mata kuliah <span class="tag">Kalkulus III</span>.
            </p>
            <div class="notif-actions">
              <button class="btn btn-sm btn-primary notif-accept" data-action="accept">Terima</button>
              <button class="btn btn-sm btn-ghost notif-decline" data-action="decline">Tolak</button>
            </div>
          </div>
          <div class="notif-more" title="Opsi lainnya">
            <button class="btn btn-icon-only btn-ghost notif-more-btn">
              <span class="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>

        <!-- 2: System Reminder -->
        <div class="notif-card reveal reveal-delay-2" data-type="update" data-id="2" data-read="false">
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
              Sesi belajarmu dengan <span class="bold">Julian</span> akan dimulai dalam 30 menit. Siapkan bahan belajarmu.
            </p>
            <button class="btn btn-sm btn-primary notif-join">
              Gabung Sesi <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          <div class="notif-more" title="Opsi lainnya">
            <button class="btn btn-icon-only btn-ghost notif-more-btn">
              <span class="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>

        <!-- 3: Forum Update -->
        <div class="notif-card reveal reveal-delay-3" data-type="mention" data-id="3" data-read="false">
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
              "Menurut saya matriks transformasi di sini seharusnya ortogonal..."
            </p>
            <p class="notif-sub">
              Balasan baru di saluran <span class="channel"># Aljabar Linear</span>
            </p>
          </div>
          <div class="notif-more" title="Opsi lainnya">
            <button class="btn btn-icon-only btn-ghost notif-more-btn">
              <span class="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>

        <!-- 4: New Message -->
        <div class="notif-card reveal reveal-delay-4" data-type="mention" data-id="4" data-read="false">
          <div class="notif-avatar-wrap">
            <div class="notif-avatar">
              <img alt="Marcus Wright"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxfU5VMhPHX8e0MgMzB5sZE7NS_0yrVMGw95YqhR7tvIlsMDFPXxTdtO3PxLqgLBNTpIHwgXG-vFEhpI5lOLNAB8RKvQD4W7LxjlR6er8o6SRKdRl5PXdp2ywAWHCrPJUpQsoei_YYr5Wof8L0nJIoWK0ZSuS5sLZihVdQ1tSymrrRhsO8N68-YVS7R91Jgln7rw_XbDkS7Kk3r3Xd5n0FliFMDUSSihvuc_Of_FDku-0BOak3HRm2J8q57MV5p_dnJl_qkij6w0c" />
            </div>
          </div>
          <div class="notif-body">
            <div class="notif-top">
              <h3 class="notif-title">Pesan Baru</h3>
              <span class="notif-time">4 jam lalu</span>
            </div>
            <p class="notif-text">
              <span class="bold">Marcus Wright</span>: "Hei, apakah kamu sudah menyelesaikan catatan silabusnya? Aku ingin meninjaunya sebelum kuliah besok."
            </p>
            <button class="btn btn-sm btn-ghost notif-quick-reply">
              <span class="material-symbols-outlined">reply</span> Balas Cepat
            </button>
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
