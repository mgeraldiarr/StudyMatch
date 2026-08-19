@extends('layouts.auth')

@section('title', 'Masuk | StudyMatch')

@section('content')
<main>
    <!-- Left brand panel (desktop) -->
    <div class="brand-panel">
      <div class="panel-dots"></div>
      <div class="panel-blob panel-blob-1"></div>
      <div class="panel-blob panel-blob-2"></div>

      <div class="panel-content">
        <div class="panel-logo">StudyMatch</div>

        <div class="panel-stats">
          <div>
            <div class="panel-stat-num" data-target="15000" data-suffix="k+">0</div>
            <div class="panel-stat-label">Mahasiswa Aktif</div>
          </div>
          <div>
            <div class="panel-stat-num" data-target="92" data-suffix="%">0</div>
            <div class="panel-stat-label">Success Match</div>
          </div>
          <div>
            <div class="panel-stat-num" data-target="450" data-suffix="+">0</div>
            <div class="panel-stat-label">Grup Belajar</div>
          </div>
        </div>

        <h2 class="panel-headline">Satu platform untuk semua kebutuhan belajarmu</h2>
        <p class="panel-sub">Temukan partner intelektual yang benar-benar cocok, koordinasikan jadwal, dan raih pemahaman yang lebih dalam bersama-sama.</p>

        <div class="panel-testimonial">
          <p class="panel-testimonial-quote">"Sejak pakai StudyMatch, nilai UAS saya naik signifikan. Partner belajar yang direkomendasikan benar-benar cocok dengan gaya belajar saya."</p>
          <div class="panel-testimonial-author">
            <div class="author-avatar">AR</div>
            <div>
              <div class="author-name">Alya Ramadhani</div>
              <div class="author-meta">Teknik Informatika, UI · Pengguna 8 bulan</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right form panel -->
    <div class="form-panel">
      <div class="form-container">

        <!-- Mobile-only brand -->
        <div class="mobile-brand">
          <div class="mobile-brand-logo">StudyMatch</div>
          <p>Selamat datang kembali 👋</p>
        </div>

        <!-- Tab switcher -->
        <div class="auth-tabs" role="tablist">
          <button class="auth-tab active" id="tab-login" onclick="switchTab('login')" role="tab">Masuk</button>
          <button class="auth-tab" id="tab-register" onclick="switchTab('register')" role="tab">Daftar</button>
        </div>

        <!-- LOGIN FORM -->
        <div id="form-login">
          <div class="form-heading">
            <h2>Selamat datang kembali</h2>
            <p>Masuk untuk melanjutkan sesi belajarmu</p>
          </div>

          <button class="btn-google" type="button" onclick="handleGoogle()">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Lanjutkan dengan Google</span>
          </button>

          <div class="divider">
            <div class="divider-line"></div>
            <span class="divider-text">atau dengan email</span>
            <div class="divider-line"></div>
          </div>

          <form class="form" id="loginForm" novalidate onsubmit="handleLogin(event)">
            <div class="field-group">
              <label for="login-email">Email</label>
              <div class="input-wrap">
                <span class="material-symbols-outlined input-icon">mail</span>
                <input id="login-email" name="email" type="email" placeholder="nama@universitas.ac.id" autocomplete="email" />
              </div>
              <div class="field-message" id="login-email-msg"></div>
            </div>

            <div class="field-group">
              <div class="field-label-row">
                <label for="login-password">Password</label>
                <button type="button" class="forgot-link" onclick="showForgot()">Lupa password?</button>
              </div>
              <div class="input-wrap">
                <span class="material-symbols-outlined input-icon">lock</span>
                <input id="login-password" name="password" type="password" placeholder="••••••••" autocomplete="current-password" />
                <button type="button" class="input-suffix" id="toggle-login-pw" onclick="togglePassword('login-password','toggle-login-pw')" aria-label="Tampilkan password">
                  <span class="material-symbols-outlined pw-toggle-icon">visibility</span>
                </button>
              </div>
              <div class="field-message" id="login-pw-msg"></div>
            </div>

            <label class="checkbox-row">
              <input type="checkbox" id="remember-me" />
              <div class="checkbox-custom">
                <span class="material-symbols-outlined checkmark">check</span>
              </div>
              <span class="checkbox-label">Ingat saya selama 30 hari</span>
            </label>

            <button type="submit" class="btn-primary" id="login-submit">
              <div class="spinner"></div>
              <span class="btn-label">Masuk</span>
            </button>
          </form>

          <div class="auth-switch">
            Belum punya akun?
            <button class="auth-switch-link" onclick="switchTab('register')">Daftar gratis</button>
          </div>
        </div>

        <!-- REGISTER FORM -->
        <div id="form-register" style="display:none">
          <div class="form-heading">
            <h2>Buat akunmu</h2>
            <p>Bergabunglah dengan 15.000+ mahasiswa Indonesia</p>
          </div>

          <form class="form" id="registerForm" novalidate onsubmit="handleRegister(event)">
            <div class="field-group">
              <label for="reg-name">Nama lengkap</label>
              <div class="input-wrap">
                <span class="material-symbols-outlined input-icon">person</span>
                <input id="reg-name" name="name" type="text" placeholder="Nama lengkapmu" autocomplete="name" />
              </div>
              <div class="field-message" id="reg-name-msg"></div>
            </div>

            <div class="field-group">
              <label for="reg-email">Email universitas</label>
              <div class="input-wrap">
                <span class="material-symbols-outlined input-icon">mail</span>
                <input id="reg-email" name="email" type="email" placeholder="nama@universitas.ac.id" autocomplete="email" />
              </div>
              <div class="field-message" id="reg-email-msg"></div>
            </div>

            <div class="field-group">
              <label for="reg-password">Password</label>
              <div class="input-wrap">
                <span class="material-symbols-outlined input-icon">lock</span>
                <input id="reg-password" name="password" type="password" placeholder="Min. 8 karakter" autocomplete="new-password" oninput="checkStrength(this)" />
                <button type="button" class="input-suffix" id="toggle-reg-pw" onclick="togglePassword('reg-password','toggle-reg-pw')" aria-label="Tampilkan password">
                  <span class="material-symbols-outlined pw-toggle-icon">visibility</span>
                </button>
              </div>
              <div class="strength-bar" id="strength-bar"><div class="strength-fill" id="strength-fill"></div></div>
              <div class="field-message" id="reg-pw-msg"></div>
            </div>

            <button type="submit" class="btn-primary" id="register-submit">
              <div class="spinner"></div>
              <span class="btn-label">Buat Akun</span>
            </button>
          </form>

          <p class="terms-text">
            Dengan mendaftar, kamu menyetujui <a href="#">Syarat & Ketentuan</a> dan <a href="#">Kebijakan Privasi</a> kami.
          </p>

          <div class="auth-switch">
            Sudah punya akun?
            <button class="auth-switch-link" onclick="switchTab('login')">Masuk di sini</button>
          </div>
        </div>

        <!-- FORGOT PASSWORD -->
        <div id="form-forgot" style="display:none" class="forgot-panel">
          <button class="back-btn" onclick="hideForgot()">
            <span class="material-symbols-outlined back-btn-icon">arrow_back</span>
            Kembali ke masuk
          </button>
          <div class="form-heading">
            <h2>Lupa password?</h2>
            <p>Masukkan email-mu dan kami akan kirim tautan reset.</p>
          </div>
          <form class="form" id="forgotForm" novalidate onsubmit="handleForgot(event)">
            <div class="field-group">
              <label for="forgot-email">Email</label>
              <div class="input-wrap">
                <span class="material-symbols-outlined input-icon">mail</span>
                <input id="forgot-email" name="email" type="email" placeholder="nama@universitas.ac.id" />
              </div>
              <div class="field-message" id="forgot-email-msg"></div>
            </div>
            <button type="submit" class="btn-primary" id="forgot-submit">
              <div class="spinner"></div>
              <span class="btn-label">Kirim Tautan Reset</span>
            </button>
          </form>
        </div>

        <!-- SUCCESS -->
        <div class="success-screen" id="success-screen">
          <div class="success-icon-ring">
            <span class="material-symbols-outlined">check_circle</span>
          </div>
          <h3 id="success-title">Berhasil masuk!</h3>
          <p id="success-sub">Mengarahkan ke dashboard…</p>
        </div>

      </div>
    </div>
  </main>
@endsection
