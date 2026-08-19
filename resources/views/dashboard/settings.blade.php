@extends('layouts.dashboard', ['activePage' => 'settings'])
@php $hideFooter = true; @endphp

@section('title', 'Pengaturan | StudyMatch')

@push('page-css')
    @vite(['resources/css/pages/settings.css', 'resources/js/pages/settings.js'])
@endpush

@section('content')
    <div class="main-inner">
      <header class="page-header">
        <h1>Pengaturan &amp; Privasi</h1>
        <p>
          Kelola ruang belajar intelektual, visibilitas, dan jangkauan notifikasimu.
        </p>
      </header>

      <div class="settings-stack">
        <!-- Account & Profile -->
        <section class="settings-section reveal reveal-delay-1" id="account">
          <div class="section-heading">
            <span class="material-symbols-outlined">person_outline</span>
            <h2>Akun &amp; Profil</h2>
          </div>
          <div class="card">
            <div class="form-grid">
              <div class="form-field">
                <label class="form-label">Alamat Email</label>
                <input class="form-input" type="email" value="geraldiarisyi27@gmail.com" />
              </div>
              <div class="form-field">
                <label class="form-label">Status Akademik</label>
                <select class="form-select">
                  <option>Mahasiswa Sarjana (S1)</option>
                  <option>Mahasiswa Pascasarjana (S2/S3)</option>
                  <option>Dosen / Peneliti</option>
                  <option>Alumni</option>
                </select>
              </div>
            </div>
            <button class="btn btn-secondary" onclick="toast('Tautan pengaturan ulang sandi telah dikirim ke email!', 'success')">Atur Ulang Sandi</button>
          </div>
        </section>

        <!-- Privacy & Visibility -->
        <section class="settings-section reveal reveal-delay-2" id="privacy">
          <div class="section-heading">
            <span class="material-symbols-outlined">verified_user</span>
            <h2>Privasi &amp; Visibilitas</h2>
          </div>
          <div class="card toggle-list">
            <div class="toggle-row">
              <div class="toggle-info">
                <p>Buat Profil Publik</p>
                <p>
                  Izinkan orang lain di luar platform menemukan profil kamu di mesin pencari.
                </p>
              </div>
              <label class="toggle-wrap">
                <input type="checkbox" checked />
                <div class="toggle-track">
                  <div class="toggle-thumb"></div>
                </div>
              </label>
            </div>

            <div class="toggle-row">
              <div class="toggle-info">
                <p>Tunjukkan Status Aktif</p>
                <p>Biarkan teman belajar melihat ketika kamu sedang online.</p>
              </div>
              <label class="toggle-wrap">
                <input type="checkbox" checked />
                <div class="toggle-track">
                  <div class="toggle-thumb"></div>
                </div>
              </label>
            </div>

            <div class="toggle-row">
              <div class="toggle-info">
                <p>Izinkan Pesan Langsung dari Siapa Saja</p>
                <p>
                  Aktifkan perpesanan dari mahasiswa di luar universitas atau kelompok belajarmu.
                </p>
              </div>
              <label class="toggle-wrap">
                <input type="checkbox" />
                <div class="toggle-track">
                  <div class="toggle-thumb"></div>
                </div>
              </label>
            </div>
          </div>
        </section>

        <!-- Notification Preferences -->
        <section class="settings-section reveal reveal-delay-3" id="notifications">
          <div class="section-heading">
            <span class="material-symbols-outlined">notifications_active</span>
            <h2>Preferensi Notifikasi</h2>
          </div>
          <div class="card" style="overflow-x: auto">
            <table class="notif-table">
              <thead>
                <tr>
                  <th>Fitur</th>
                  <th>Email</th>
                  <th>Push</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <p class="notif-title">Permintaan Belajar</p>
                    <p class="notif-desc">
                      Ketika partner belajar baru mengirimkan undangan.
                    </p>
                  </td>
                  <td><input class="cb" type="checkbox" checked /></td>
                  <td><input class="cb" type="checkbox" checked /></td>
                </tr>
                <tr>
                  <td>
                    <p class="notif-title">Pengingat Sesi</p>
                    <p class="notif-desc">
                      Pemberitahuan sebelum sesi belajar dimulai.
                    </p>
                  </td>
                  <td><input class="cb" type="checkbox" checked /></td>
                  <td><input class="cb" type="checkbox" checked /></td>
                </tr>
                <tr>
                  <td>
                    <p class="notif-title">Pembaruan Forum</p>
                    <p class="notif-desc">
                      Aktivitas baru pada thread yang kamu ikuti.
                    </p>
                  </td>
                  <td><input class="cb" type="checkbox" /></td>
                  <td><input class="cb" type="checkbox" checked /></td>
                </tr>
                <tr>
                  <td>
                    <p class="notif-title">Pesan Langsung</p>
                    <p class="notif-desc">
                      Pesan chat pribadi dari partner belajar.
                    </p>
                  </td>
                  <td><input class="cb" type="checkbox" checked /></td>
                  <td><input class="cb" type="checkbox" checked /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- App Preferences -->
        <section class="settings-section reveal reveal-delay-4" id="app-prefs">
          <div class="section-heading">
            <span class="material-symbols-outlined">tune</span>
            <h2>Preferensi Aplikasi</h2>
          </div>
          <div class="prefs-grid">
            <div class="pref-card">
              <p class="pref-card-title">Bahasa</p>
              <select class="form-select">
                <option>Bahasa Indonesia</option>
                <option>English</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Exam Season Mode -->
        <section class="settings-section reveal reveal-delay-5" id="dnd">
          <div class="exam-card">
            <div class="exam-card-header">
              <div class="exam-card-title-wrap">
                <div class="exam-icon-circle">
                  <span class="material-symbols-outlined">auto_stories</span>
                </div>
                <div>
                  <h3>Mode Musim Ujian</h3>
                  <p>
                    Aktivasi fokus mendalam. Bisukan semua notifikasi yang kurang penting.
                  </p>
                </div>
              </div>
              <label class="toggle-wrap exam-toggle">
                <input type="checkbox" />
                <div class="toggle-track">
                  <div class="toggle-thumb"></div>
                </div>
              </label>
            </div>
            <div class="exam-note">
              Ketika diaktifkan, hanya pengingat akademis darurat dan pesan dari kelompok belajar utama yang akan dikirimkan. Notifikasi lainnya akan dikumpulkan dan dikirimkan pada jam 21.00 setiap harinya.
            </div>
          </div>
        </section>

        <!-- Exam Mode Banner (hidden by default) -->
        <div id="examBanner" class="exam-banner" style="display:none">
          <span class="material-symbols-outlined">auto_stories</span>
          <div>
            <p class="exam-banner-title">Mode Musim Ujian Aktif</p>
            <p class="exam-banner-desc">Notifikasi non-esensial dibatasi. Hanya pengingat darurat yang dikirim.</p>
          </div>
          <button class="btn btn-sm btn-ghost" onclick="document.querySelector('.exam-toggle input').click()">Nonaktifkan</button>
        </div>
      </div>

      <!-- Page Footer -->
      <div class="settings-footer reveal reveal-delay-5">
        <div class="footer-links">
          <a href="#">Kebijakan Privasi</a>
          <a href="#">Ketentuan Layanan</a>
          <a href="#">Ekspor Data</a>
        </div>
        <button class="btn btn-danger" onclick="toast('Akun dinonaktifkan sementara', 'info')">Nonaktifkan Akun</button>
      </div>
    </div>
@endsection


