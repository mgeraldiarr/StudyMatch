@extends('layouts.dashboard', ['activePage' => 'user-profile'])

@section('title', 'Profil Saya | StudyMatch')

@push('page-css')
@vite(['resources/css/pages/user_profile.css', 'resources/js/pages/user_profile.js'])
@endpush

@section('content')
<div class="main-inner">
  <!-- Profile Header -->
  <header class="profile-header">
    <div class="profile-header-blob-1"></div>
    <div class="profile-header-inner">
      <!-- Avatar -->
      <div class="avatar-wrapper">
        <div class="avatar-img">
          <img id="profileHeaderAvatar" alt="{{ $user->name }}"
            src="{{ $user->avatar ?: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ_EKuVYe8DVz3xhNB1IDos9wyTPWBDFIz02_iHUF6jG9iAIhHpoTlStYIrxGaO7JJvxVdoqDvvgsnNDGdewZsm7P0aJpDbJdPhAeE70zUgqPekprvuVN3LRvsQZKdf_2qQ325NNi_EyAD4WxkKrLTYGHUzDhIQX9hpukdXn_hHh5YMCeZ2vJ303g49r7erhOHGRyCc3zArc8OI8kdOrtj7DpPqByRV-5mhVZZjJoC6A-w0B80CqPOq5bmN9RzH_CUf8Uhd-2DqEA' }}" />
        </div>
        <div class="verified-badge">
          <span class="material-symbols-outlined fill-1">verified</span>
        </div>
      </div>

      <!-- Info -->
      <div class="profile-info">
        <div class="online-badge">
          <span class="online-dot-badge"></span> {{ $user->is_online ? 'Siap Belajar (Online)' : 'Offline' }}
        </div>
        <h2 class="profile-name" id="profileHeaderName">{{ $user->name }}</h2>
        <div class="profile-meta">
          <span class="profile-meta-item">
            <span class="material-symbols-outlined">school</span>
            <span id="profileHeaderUniv">{{ $user->university ?: 'Belum diisi' }}</span>
          </span>
          <span class="profile-meta-sep"></span>
          <span class="profile-meta-item">
            <span class="material-symbols-outlined">menu_book</span>
            <span id="profileHeaderMajor">{{ $user->major ?: 'Belum diisi' }}</span>
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="profile-actions">
        <button class="btn btn-primary btn-lg" onclick="openEditProfileModal()">Edit Profil</button>
        <button class="btn btn-icon-only btn-ghost" id="btnShareProfile">
          <span class="material-symbols-outlined">share</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Bento Grid -->
  <section class="bento-section">
    <div class="bento-grid">
      <!-- Academic Stats -->
      <div class="card col-4">
        <h3 class="card-title">
          <span class="material-symbols-outlined">analytics</span>
          Rekapitulasi Akademik
        </h3>
        <div class="stats-grid">
          <div class="stat-box">
            <p class="stat-label">Mata Kuliah</p>
            <p class="stat-value">{{ $user->courses->count() }}</p>
          </div>
          <div class="stat-box">
            <p class="stat-label">Gaya Belajar</p>
            <p class="stat-value" style="font-size: 1rem; text-transform: capitalize;">{{ $user->learning_style ?: 'Visual' }}</p>
          </div>
        </div>
      </div>

      <!-- Learning Style & Bio -->
      <div class="card col-8">
        <h3 class="card-title">Tentang &amp; Gaya Belajar</h3>
        <div class="learning-inner">
          @php
            $learningStyles = [
              [
                'label' => 'Visual',
                'percent' => $user->learning_style === 'visual' ? '95%' : '60%',
                'class' => 'progress-primary',
              ],
              [
                'label' => 'Diskusi (Auditori)',
                'percent' => $user->learning_style === 'auditory' ? '95%' : '50%',
                'class' => 'progress-secondary',
              ],
              [
                'label' => 'Praktik (Kinestetik)',
                'percent' => $user->learning_style === 'kinesthetic' ? '95%' : '45%',
                'class' => 'progress-tertiary',
              ],
            ];
          @endphp

          <div class="progress-list">
            @foreach ($learningStyles as $style)
              <div>
                <div class="progress-row">
                  <span>{{ $style['label'] }}</span><span>{{ $style['percent'] }}</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill {{ $style['class'] }}" @style(['width: ' . $style['percent']])></div>
                </div>
              </div>
            @endforeach
          </div>
          <div class="learning-quote">
            <p id="profileBioText">
              "{{ $user->bio ?: 'Mahasiswa antusias yang siap belajar dan berdiskusi bersama teman belajar baru!' }}"
            </p>
          </div>
        </div>
      </div>

      <!-- Subject Expertise -->
      <div class="card col-5">
        <h3 class="card-title">Mata Kuliah yang Diambil</h3>
        <div class="subject-list" id="profileCoursesList">
          @forelse($user->courses as $course)
          <div class="subject-item" style="padding: 10px; border-radius: 8px; background: rgba(0,0,0,0.02); margin-bottom: 8px;">
            <div class="subject-left">
              <div class="subject-badge" style="background: rgba(99,102,241,0.1); color: var(--primary); padding: 4px 8px; border-radius: 4px; font-weight: 700; font-size: 0.75rem;">MK</div>
              <div>
                <p class="subject-name" style="font-weight: 600; font-size: 0.875rem; margin: 0;">{{ $course->name }}</p>
                <p class="subject-level" style="font-size: 0.75rem; color: var(--text-muted); margin: 0;">Aktif</p>
              </div>
            </div>
            <span class="material-symbols-outlined subject-check" style="color: #10b981;">check_circle</span>
          </div>
          @empty
          <p style="color: var(--text-muted); font-size: 0.875rem;">Belum ada mata kuliah yang ditambahkan.</p>
          @endforelse
        </div>
      </div>

      <!-- Reviews -->
      <div class="card col-7">
        <div class="review-header">
          <h3 class="card-title" style="margin-bottom: 0">
            Review Teman Belajar
          </h3>
          <div style="display: flex; align-items: center">
            <div class="stars">
              <span class="material-symbols-outlined fill-1">star</span>
              <span class="material-symbols-outlined fill-1">star</span>
              <span class="material-symbols-outlined fill-1">star</span>
              <span class="material-symbols-outlined fill-1">star</span>
              <span class="material-symbols-outlined fill-1">star</span>
            </div>
            <span class="stars-score">5.0</span>
          </div>
        </div>
        <div class="review-list">
          <div class="review-item">
            <img class="review-avatar" alt="Sarah"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDVLFB2eOCy9LSyIpRiuJcRqy1EdEclIKJP_Su-67Qg6fKeEFWrc0O9-z1gzezMAUaXF92f8dSMzKbikF-STFfNCFgeM_Ca4ZsBIWC0OZXx1Bzj9ndD9G5N9YUGPZDPe_DPqH-1iZeU1IOzEB2u7fTIemF4qZuIF0Uo0vEDZfC2V7azehbXcPM9wOk6XutbeQ4qqYvKwPxnxzj2RZR5DjpxQ1-FySVhFu54kMPDyzfTY_wfDEEjNn1xUbA0nXaPcKvwKPkFd1SJzom" />
            <div class="review-bubble">
              <div class="review-meta">
                <p class="reviewer-name">Sarah K.</p>
                <p class="review-time">2 hari yang lalu</p>
              </div>
              <p class="review-text">
                "Sangat membantu menjelaskan konsep perkuliahan. Orangnya sabar dan on-time!"
              </p>
            </div>
          </div>
        </div>
        <button class="btn btn-ghost" id="btnAllReviews">Lihat Semua Review</button>
      </div>
    </div>
  </section>
</div>

{{-- Edit Profile Modal --}}
<div class="modal-overlay" id="editProfileOverlay" onclick="closeEditProfileModal()"></div>
<div class="modal-panel" id="editProfilePanel">
  <div class="modal-panel-header">
    <h3>Edit Profil Akademik</h3>
    <button class="modal-close-btn" onclick="closeEditProfileModal()">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
  <div class="modal-panel-body">
    <form id="editProfileForm" onsubmit="submitEditProfile(event)">
      <div class="sess-form-group">
        <label class="sess-label">Nama Lengkap</label>
        <input class="sess-input" id="editName" type="text" value="{{ $user->name }}" required>
      </div>
      <div class="sess-form-group">
        <label class="sess-label">Universitas</label>
        <input class="sess-input" id="editUniversity" type="text" value="{{ $user->university }}" required>
      </div>
      <div class="sess-form-group">
        <label class="sess-label">Jurusan / Program Studi</label>
        <input class="sess-input" id="editMajor" type="text" value="{{ $user->major }}" required>
      </div>
      <div class="sess-form-group">
        <label class="sess-label">Gaya Belajar Utama</label>
        <select class="sess-input" id="editLearningStyle" required>
          <option value="visual" {{ $user->learning_style === 'visual' ? 'selected' : '' }}>Visual (Diagram, Gambar, Mindmap)</option>
          <option value="auditory" {{ $user->learning_style === 'auditory' ? 'selected' : '' }}>Auditori (Diskusi, Penjelasan Suara)</option>
          <option value="kinesthetic" {{ $user->learning_style === 'kinesthetic' ? 'selected' : '' }}>Kinestetik (Praktik, Koding, Soal)</option>
          <option value="reading" {{ $user->learning_style === 'reading' ? 'selected' : '' }}>Membaca / Menulis (Catatan, Artikel)</option>
        </select>
      </div>
      <div class="sess-form-group">
        <label class="sess-label">Mata Kuliah (pisahkan dengan koma)</label>
        <input class="sess-input" id="editCourses" type="text" value="{{ $user->courses->pluck('name')->implode(', ') }}" placeholder="cth. Kalkulus III, Algoritma, Basis Data">
      </div>
      <div class="sess-form-group">
        <label class="sess-label">Bio Singkat</label>
        <textarea class="sess-input" id="editBio" rows="3" placeholder="Ceritakan tujuan dan preferensi belajarmu...">{{ $user->bio }}</textarea>
      </div>
      <div class="sess-form-actions">
        <button type="button" class="btn btn-ghost" onclick="closeEditProfileModal()">Batal</button>
        <button type="submit" class="btn btn-primary" id="btnSaveProfile">Simpan Perubahan</button>
      </div>
    </form>
  </div>
</div>

{{-- All Reviews Modal --}}
<div class="modal-overlay" id="reviewOverlay" onclick="closeAllReviews()"></div>
<div class="modal-panel" id="reviewPanel">
  <div class="modal-panel-header">
    <h3>Semua Review</h3>
    <button class="modal-close-btn" onclick="closeAllReviews()">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
  <div class="modal-panel-body" id="reviewList"></div>
</div>
@endsection