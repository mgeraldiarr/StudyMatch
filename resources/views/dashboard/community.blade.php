@extends('layouts.dashboard', ['activePage' => 'community'])

@section('title', 'Komunitas | StudyMatch')

@push('page-css')
    @vite(['resources/css/pages/community.css', 'resources/js/pages/community.js'])
@endpush

@section('content')
<script>
    window.__INITIAL_CHANNELS__ = @json($channels ?? []);
    window.__INITIAL_THREADS__ = @json($threads ?? []);
</script>

<div class="main-inner">
  <div class="page-hero">
    <h2 class="hero-title">Komunitas <span>Intelektual</span></h2>
    <p class="hero-sub">Bergabunglah dengan diskusi akademik, bagikan catatan, dan belajar bersama teman-teman dari berbagai universitas.</p>
    <div class="hero-btns">
      <button class="btn btn-primary" onclick="createNewThread()">
        <span class="material-symbols-outlined" style="font-size: 16px">add_circle</span>
        Buat Thread Baru
      </button>
    </div>
  </div>

  <div class="channels-bar" id="channelsBar" style="display:none">
    <button class="btn btn-sm btn-ghost" onclick="clearChannel()">
      <span class="material-symbols-outlined">close</span> Semua Saluran
    </button>
    <span class="channels-bar-label" id="channelsBarLabel"></span>
  </div>

  <h3 class="section-title">Saluran Populer</h3>
  <div class="channels-grid" id="channelsGrid"></div>

  <h3 class="section-title">Thread Terbaru</h3>
  <div class="thread-list" id="threadsList"></div>
</div>

{{-- Create Thread Modal --}}
<div class="modal-overlay" id="createOverlay" onclick="closeCreateThread()"></div>
<div class="modal-panel" id="createPanel">
  <div class="modal-panel-header">
    <h3>Buat Thread Baru</h3>
    <button class="modal-close-btn" onclick="closeCreateThread()">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
  <div class="modal-panel-body">
    <form id="createForm" onsubmit="submitNewThread(event)">
      <div class="sess-form-group">
        <label class="sess-label">Judul Thread</label>
        <input class="sess-input" id="threadTitle" type="text" placeholder="cth. Best practices async/await di JavaScript" required>
      </div>
      <div class="sess-form-group">
        <label class="sess-label">Saluran</label>
        <select class="sess-input" id="threadChannel" required>
          <option value="">Pilih saluran…</option>
          <option value="Pemrograman">Pemrograman</option>
          <option value="Matematika">Matematika</option>
          <option value="Sains">Sains</option>
          <option value="Desain">Desain</option>
          <option value="Bahasa">Bahasa</option>
          <option value="Humaniora">Humaniora</option>
        </select>
      </div>
      <div class="sess-form-group">
        <label class="sess-label">Isi Thread</label>
        <textarea class="sess-input" id="threadBody" rows="4" placeholder="Tulis pertanyaan atau diskusi…" required></textarea>
      </div>
      <div class="sess-form-actions">
        <button type="button" class="btn btn-ghost" onclick="closeCreateThread()">Batal</button>
        <button type="submit" class="btn btn-primary" id="btnSubmitThread">Publikasikan</button>
      </div>
    </form>
  </div>
</div>

{{-- Thread Detail Modal --}}
<div class="modal-overlay" id="detailOverlay" onclick="closeThreadDetail()"></div>
<div class="modal-panel" id="detailPanel">
  <div class="modal-panel-header">
    <h3 id="detailTitle">Thread</h3>
    <button class="modal-close-btn" onclick="closeThreadDetail()">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
  <div class="modal-panel-body" id="detailBody"></div>
</div>
@endsection
