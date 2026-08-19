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
              <img alt="Alya Ramadhani"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ_EKuVYe8DVz3xhNB1IDos9wyTPWBDFIz02_iHUF6jG9iAIhHpoTlStYIrxGaO7JJvxVdoqDvvgsnNDGdewZsm7P0aJpDbJdPhAeE70zUgqPekprvuVN3LRvsQZKdf_2qQ325NNi_EyAD4WxkKrLTYGHUzDhIQX9hpukdXn_hHh5YMCeZ2vJ303g49r7erhOHGRyCc3zArc8OI8kdOrtj7DpPqByRV-5mhVZZjJoC6A-w0B80CqPOq5bmN9RzH_CUf8Uhd-2DqEA" />
            </div>
            <div class="verified-badge">
              <span class="material-symbols-outlined fill-1">verified</span>
            </div>
          </div>

          <!-- Info -->
          <div class="profile-info">
            <div class="online-badge">
              <span class="online-dot-badge"></span> Siap Belajar
            </div>
            <h2 class="profile-name">Alya Ramadhani</h2>
            <div class="profile-meta">
              <span class="profile-meta-item">
                <span class="material-symbols-outlined">school</span>
                Universitas Indonesia
              </span>
              <span class="profile-meta-sep"></span>
              <span class="profile-meta-item">
                <span class="material-symbols-outlined">menu_book</span> Teknik Informatika
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="profile-actions">
            <button class="btn btn-primary btn-lg" id="btnEditProfile">Edit Profil</button>
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
                <p class="stat-label">Sesi Selesai</p>
                <p class="stat-value">142</p>
              </div>
              <div class="stat-box">
                <p class="stat-label">Kontribusi</p>
                <p class="stat-value">89</p>
              </div>
            </div>
          </div>

          <!-- Learning Style -->
          <div class="card col-8">
            <h3 class="card-title">Gaya Belajar</h3>
            <div class="learning-inner">
              <div class="progress-list">
                <div>
                  <div class="progress-row">
                    <span>Visual</span><span>70%</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill progress-primary" style="width: 70%"></div>
                  </div>
                </div>
                <div>
                  <div class="progress-row">
                    <span>Discussion</span><span>90%</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill progress-secondary" style="width: 90%"></div>
                  </div>
                </div>
                <div>
                  <div class="progress-row">
                    <span>Practice</span><span>45%</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill progress-tertiary" style="width: 45%"></div>
                  </div>
                </div>
              </div>
              <div class="learning-quote">
                <p>
                  "Alya lebih suka berdiskusi interaktif dan menggunakan peta konsep visual untuk memahami algoritma kompleks."
                </p>
              </div>
            </div>
          </div>

          <!-- Achievements -->
          <div class="card col-12">
            <h3 class="card-title">
              <span class="material-symbols-outlined">military_tech</span>
              Reputasi &amp; Pencapaian
            </h3>
            <div class="badges-row">
              <div class="badge-item">
                <div class="badge-icon primary">
                  <span class="material-symbols-outlined fill-1">workspace_premium</span>
                </div>
                <p class="badge-label">Top Contributor</p>
              </div>
              <div class="badge-item">
                <div class="badge-icon secondary">
                  <span class="material-symbols-outlined fill-1">handshake</span>
                </div>
                <p class="badge-label">Reliable Partner</p>
              </div>
              <div class="badge-item">
                <div class="badge-icon tertiary">
                  <span class="material-symbols-outlined fill-1">lightbulb</span>
                </div>
                <p class="badge-label">Quick Learner</p>
              </div>
              <div class="badge-item">
                <div class="badge-icon disabled">
                  <span class="material-symbols-outlined">emoji_events</span>
                </div>
                <p class="badge-label muted">Scholar Elite</p>
              </div>
            </div>
          </div>

          <!-- Subject Expertise -->
          <div class="card col-5">
            <h3 class="card-title">Mata Kuliah yang Dikuasai</h3>
            <div class="subject-list">
              <div class="subject-item">
                <div class="subject-left">
                  <div class="subject-badge">JS</div>
                  <div>
                    <p class="subject-name">Struktur Data &amp; Algoritma</p>
                    <p class="subject-level">Advanced</p>
                  </div>
                </div>
                <span class="material-symbols-outlined subject-check">check_circle</span>
              </div>
              <div class="subject-item">
                <div class="subject-left">
                  <div class="subject-badge">DB</div>
                  <div>
                    <p class="subject-name">Basis Data Non-Relasional</p>
                    <p class="subject-level">Expert</p>
                  </div>
                </div>
                <span class="material-symbols-outlined subject-check">check_circle</span>
              </div>
              <div class="subject-item">
                <div class="subject-left">
                  <div class="subject-badge">AI</div>
                  <div>
                    <p class="subject-name">Kecerdasan Buatan</p>
                    <p class="subject-level">Intermediate</p>
                  </div>
                </div>
              </div>
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
                    "Sangat membantu menjelaskan konsep Redux yang tadinya susah banget. Orangnya sabar dan on-time!"
                  </p>
                </div>
              </div>
              <div class="review-item">
                <img class="review-avatar" alt="Budi"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcWSNAehS8dmkQfi57_5dEnx9x6doPpT7WfVA8rMaQpbggx516WMbCn3nTB7k35O8wx21ASHVf2Fhs0_gwZZjIXNiHLEyUKUYfVF_R8aaArqcM_BqnAP5aBJ_A_s4_BhdGkSc_k9nc2LdGe-ilvEFYLZNilWFXbl8MC0OsHYoAUbbt3uQp4YFxl-UrXnNTb9ew1lvXcsyYl4R9WSS7e0sxw0DIlCyo30R9sjR6SVXKqL0rHucjVtoi0cQLOe0G61mhm8Fr0YIs8TLt" />
                <div class="review-bubble">
                  <div class="review-meta">
                    <p class="reviewer-name">Budi Utomo</p>
                    <p class="review-time">1 minggu yang lalu</p>
                  </div>
                  <p class="review-text">
                    "Partner belajar paling oke. Catatannya rapi dan logikanya kuat banget pas ngerjain project bareng."
                  </p>
                </div>
              </div>
            </div>
            <button class="btn btn-ghost" id="btnAllReviews">Lihat Semua Review</button>
          </div>
        </div>
      </section>
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


