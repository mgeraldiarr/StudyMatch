@extends('layouts.dashboard', ['activePage' => 'discovery'])

@section('title', 'Discovery | StudyMatch')

@push('page-css')
    @vite(['resources/css/pages/discovery.css', 'resources/js/pages/discovery.js'])
@endpush

@section('content')
    <div class="main-inner">
        <div class="page-hero">
          <div class="hero-text">
            <h2>Temukan <span>Partner Belajarmu</span></h2>
            <p>Algoritma kami mencocokkan kandidat berdasarkan gaya belajar, jadwal, dan mata kuliah yang kamu ambil saat ini.</p>
          </div>
          <button class="btn btn-ghost" id="refreshBtn" onclick="refreshMatches()">
            <span class="material-symbols-outlined">refresh</span>Refresh Match
          </button>
        </div>

        <div class="stat-pills">
          <div class="stat-pill">
            <div class="sp-icon purple"><span class="material-symbols-outlined">groups</span></div>
            <span class="sp-num" id="pill-match">6</span>
            <span class="sp-lbl">kandidat ditemukan</span>
          </div>
          <div class="stat-pill">
            <div class="sp-icon teal"><span class="material-symbols-outlined">favorite</span></div>
            <span class="sp-num" id="pill-fav">0</span>
            <span class="sp-lbl">tersimpan</span>
          </div>
          <div class="stat-pill">
            <div class="sp-icon amber"><span class="material-symbols-outlined">bolt</span></div>
            <span class="sp-num">94%</span>
            <span class="sp-lbl">akurasi match tertinggi</span>
          </div>
        </div>

        <div class="filter-bar">
          <span class="filter-label">Filter</span>
          <div class="filter-pills" id="filterPills">
            <button class="fp active" data-f="semua" onclick="setFilter(this)"><span class="material-symbols-outlined">grid_view</span>Semua</button>
            <button class="fp" data-f="online" onclick="setFilter(this)"><span class="material-symbols-outlined">circle</span>Online</button>
            <button class="fp" data-f="visual" onclick="setFilter(this)"><span class="material-symbols-outlined">visibility</span>Visual</button>
            <button class="fp" data-f="diskusi" onclick="setFilter(this)"><span class="material-symbols-outlined">forum</span>Diskusi</button>
            <button class="fp" data-f="praktik" onclick="setFilter(this)"><span class="material-symbols-outlined">terminal</span>Praktik</button>
            <button class="fp" data-f="favorit" onclick="setFilter(this)"><span class="material-symbols-outlined">favorite</span>Favorit</button>
          </div>
          <div class="filter-sep"></div>
          <select class="sort-sel" onchange="setSort(this.value)">
            <option value="compat">Kompatibilitas ↓</option>
            <option value="name">Nama A–Z</option>
            <option value="online">Online dulu</option>
          </select>
        </div>

        <div class="active-filters" id="activeFilters"></div>

        <div class="results-hdr">
          <span class="result-count"><strong id="countLbl">6</strong> kandidat ditemukan</span>
          <div class="view-toggle">
            <button class="vbtn active" id="vGrid" onclick="setView('grid')" title="Grid"><span class="material-symbols-outlined">grid_view</span></button>
            <button class="vbtn" id="vList" onclick="setView('list')" title="List"><span class="material-symbols-outlined">view_list</span></button>
          </div>
        </div>

        <div class="cards-grid" id="cardsGrid">
          <div class="empty-state" id="emptyState">
            <div class="empty-icon"><span class="material-symbols-outlined">search_off</span></div>
            <h3>Tidak ada hasil</h3>
            <p>Coba ubah filter atau kata kunci pencarianmu.</p>
          </div>
        </div>

        <div class="load-wrap">
          <button class="btn btn-ghost" id="loadBtn" onclick="loadMore()">
            <span class="lbl-expand"><span class="material-symbols-outlined">expand_more</span></span>
            <span>Muat lebih banyak</span>
          </button>
        </div>
      </div>

      <button class="fab" onclick="toast('Smart Match sedang mencari kandidat terbaikmu…', 'info')" title="Smart Match" aria-label="Smart Match">
        <span class="material-symbols-outlined" style="font-size: 1.375rem">bolt</span>
      </button>

      <div class="modal-overlay" id="modalOverlay" onclick="closeModalOut(event)">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="mName">
          <button class="modal-close" onclick="closeModal()"><span class="material-symbols-outlined">close</span></button>
          <img class="modal-av" id="mAvatar" src="" alt="" />
          <div class="modal-name" id="mName"></div>
          <div class="modal-uni" id="mUni"></div>
          <textarea class="modal-ta" id="mMsg" placeholder="Hei! Aku lihat kita punya mata kuliah yang sama. Mau belajar bareng?"></textarea>
          <div class="modal-actions">
            <button class="btn btn-ghost modal-cancel" onclick="closeModal()">Batal</button>
            <button class="btn btn-primary modal-send" onclick="sendInvite()">
              <span class="material-symbols-outlined" style="font-size: 16px">send</span>Kirim Undangan
            </button>
          </div>
        </div>
      </div>
@endsection


