<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title>Setup Profil | StudyMatch</title>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    @vite(['resources/css/app.css', 'resources/css/pages/setupprofile.css', 'resources/js/app.js', 'resources/js/pages/setupprofile.js'])
  </head>

  <body>
    <div id="scroll-progress"></div>

    <nav>
      <a href="{{ route('login') }}" class="nav-logo">StudyMatch</a>

      <button type="button" class="nav-save-btn" onclick="autoSave()">
        <span class="material-symbols-outlined nav-save-icon">save</span>
        Simpan draft
      </button>
    </nav>

    <main class="page-main">
      <div class="page-header reveal">
        <div class="step-breadcrumb">
          <span class="step-breadcrumb-dot"></span>
          Langkah 2 dari 3 — Setup Profil
        </div>
        <h1>Buat <span>Identitas Akademikmu</span></h1>
        <p>Profil yang lengkap meningkatkan peluangmu menemukan partner belajar yang benar-benar cocok.</p>

        <div class="progress-steps">
          <div class="ps-item done">
            <div class="ps-circle">
              <span class="material-symbols-outlined ps-check-icon">check</span>
            </div>
            <div class="ps-label">Masuk</div>
          </div>
          <div class="ps-line done"></div>
          <div class="ps-item active">
            <div class="ps-circle">2</div>
            <div class="ps-label">Profil</div>
          </div>
          <div class="ps-line"></div>
          <div class="ps-item">
            <div class="ps-circle">3</div>
            <div class="ps-label">Discovery</div>
          </div>
        </div>
      </div>

      <!-- Completion banner -->
      <div class="completion-banner reveal delay-1">
        <div class="completion-text">
          <h4>Kelengkapan profil</h4>
          <p>Isi semua bagian untuk hasil pencocokan terbaik</p>
        </div>
        <div class="completion-pct" id="pct-label">0%</div>
        <div class="completion-bar-outer">
          <div class="completion-bar-wrap">
            <div class="completion-bar-fill" id="completion-fill"></div>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <!-- LEFT COLUMN -->
        <div class="col-left">
          <div class="card reveal delay-1">
            <div class="card-title">
              <span class="material-symbols-outlined">person</span>
              Identitas Akademik
            </div>
            <div class="card-desc">Informasi dasar yang ditampilkan ke calon partner belajarmu.</div>

            <!-- Avatar Input & Preview -->
            <input type="file" id="avatar-file-input" accept="image/jpeg,image/png,image/jpg,image/webp" style="display:none" onchange="previewAvatar(event)" />

            <div class="profile-top">
              <div class="avatar-wrap" onclick="triggerAvatarUpload()" title="Klik untuk ganti foto">
                <div class="avatar-ring">
                  <img id="avatar-img-preview" src="{{ $user?->avatar ?: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuUYhvXKIjbA76n-ND0sQKgFqul-AiYnO3VwBVbEFTfS_Gu3pH15f6trG2F7_82z8iALMrchhwNHdtzE24UxgNLrV-L3gXoxRpTZa7bFHrTTIIlnRJBPcRwTUtOWmJl7YmVBmQ7_egOMkwflOHDQlPRQ5h7EADOVkJuX8rp30Qr6VgcNset_BHpuNToqWdHWxpkX2F30G3o4owsZXuzEVYPwLOAsa9PaGcY0qBL-kZS9OCd1lDwmYyAfNr0OSg9LZF4yQnhYHfScM' }}" alt="Foto profil" />
                </div>
                <div class="avatar-overlay">
                  <span class="material-symbols-outlined avatar-overlay-icon">photo_camera</span>
                </div>
                <div class="avatar-badge">
                  <span class="material-symbols-outlined">edit</span>
                </div>
              </div>
              <div class="avatar-info">
                <h4>Foto Profil</h4>
                <button type="button" class="chip-add chip-add-sm" onclick="triggerAvatarUpload()">
                  <span class="material-symbols-outlined">upload</span>
                  Upload foto
                </button>
                <p class="avatar-upload-hint">JPG, PNG, WEBP · Maks 2MB</p>
              </div>
            </div>

            <div class="form-fields">
              <div class="field-group">
                <label class="field-label">Nama tampilan</label>
                <div class="input-wrap">
                  <span class="material-symbols-outlined input-icon">badge</span>
                  <input class="field-input has-icon" id="f-name" type="text" placeholder="Nama lengkapmu" value="{{ old('name', $user?->name ?? '') }}" oninput="updateCompletion(); markFilled(this);" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">Universitas / Institusi</label>
                <div class="input-wrap">
                  <span class="material-symbols-outlined input-icon">account_balance</span>
                  <input class="field-input has-icon" id="f-univ" type="text" placeholder="cth. Universitas Indonesia" value="{{ old('university', $user?->university ?? '') }}" oninput="updateCompletion(); markFilled(this);" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">Jurusan / Program Studi</label>
                <div class="input-wrap">
                  <span class="material-symbols-outlined input-icon">school</span>
                  <input class="field-input has-icon" id="f-major" type="text" placeholder="cth. Teknik Informatika" value="{{ old('major', $user?->major ?? '') }}" oninput="updateCompletion(); markFilled(this);" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">Bio singkat</label>
                <textarea class="field-input field-input-bio" id="f-bio" rows="3" placeholder="Ceritakan sedikit tentang tujuan belajarmu…" oninput="updateCompletion(); this.classList.toggle('is-filled', this.value.length > 0);">{{ old('bio', $user?->bio ?? '') }}</textarea>
                <div class="char-hint" id="bio-chars">0 / 160</div>
              </div>
            </div>
          </div>

          <div class="card-tinted reveal delay-2">
            <div class="card-title">
              <span class="material-symbols-outlined">psychology</span>
              Gaya Belajar
            </div>
            <div class="card-desc">Bagaimana kamu paling baik menyerap informasi baru?</div>
            <div class="radio-list">
              <label class="radio-option">
                <input type="radio" name="learning_style" value="visual" {{ old('learning_style', $user?->learning_style ?? 'visual') === 'visual' ? 'checked' : '' }} onchange="updateCompletion()" />
                <div class="radio-card">
                  <div class="radio-icon"><span class="material-symbols-outlined">visibility</span></div>
                  <div class="radio-text"><p>Visual</p><p>Diagram, grafik, peta konsep, dan visualisasi data.</p></div>
                  <div class="radio-check"><div class="radio-check-dot"></div></div>
                </div>
              </label>
              <label class="radio-option">
                <input type="radio" name="learning_style" value="auditory" {{ old('learning_style', $user?->learning_style) === 'auditory' ? 'checked' : '' }} onchange="updateCompletion()" />
                <div class="radio-card">
                  <div class="radio-icon"><span class="material-symbols-outlined">forum</span></div>
                  <div class="radio-text"><p>Diskusi</p><p>Debat Sokratik, tanya-jawab, dan tukar pikiran.</p></div>
                  <div class="radio-check"><div class="radio-check-dot"></div></div>
                </div>
              </label>
              <label class="radio-option">
                <input type="radio" name="learning_style" value="kinesthetic" {{ old('learning_style', $user?->learning_style) === 'kinesthetic' ? 'checked' : '' }} onchange="updateCompletion()" />
                <div class="radio-card">
                  <div class="radio-icon"><span class="material-symbols-outlined">terminal</span></div>
                  <div class="radio-text"><p>Praktik</p><p>Active recall, latihan soal, dan problem solving.</p></div>
                  <div class="radio-check"><div class="radio-check-dot"></div></div>
                </div>
              </label>
              <label class="radio-option">
                <input type="radio" name="learning_style" value="reading" {{ old('learning_style', $user?->learning_style) === 'reading' ? 'checked' : '' }} onchange="updateCompletion()" />
                <div class="radio-card">
                  <div class="radio-icon"><span class="material-symbols-outlined">menu_book</span></div>
                  <div class="radio-text"><p>Membaca / Menulis</p><p>Catatan, ringkasan, jurnal, dan riset mandiri.</p></div>
                  <div class="radio-check"><div class="radio-check-dot"></div></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="col-right">
          <div class="card reveal delay-1">
            <div class="card-title">
              <span class="material-symbols-outlined">library_books</span>
              Mata Kuliah Semester Ini
            </div>
            <div class="card-desc">Tambahkan mata kuliah yang sedang kamu ambil untuk menemukan partner dengan kebutuhan serupa.</div>

            <div class="course-chips" id="course-chips">
              @if(isset($user) && $user->courses && $user->courses->count() > 0)
                @foreach($user->courses as $course)
                  <div class="chip">
                    <span class="chip-text">{{ $course->name }}</span>
                    <button type="button" class="chip-remove" onclick="removeChip(this)" title="Hapus mata kuliah"><span class="material-symbols-outlined">close</span></button>
                  </div>
                @endforeach
              @else
                <div class="chip">
                  <span class="chip-text">Struktur Data &amp; Algoritma</span>
                  <button type="button" class="chip-remove" onclick="removeChip(this)" title="Hapus mata kuliah"><span class="material-symbols-outlined">close</span></button>
                </div>
                <div class="chip">
                  <span class="chip-text">Kalkulus III</span>
                  <button type="button" class="chip-remove" onclick="removeChip(this)" title="Hapus mata kuliah"><span class="material-symbols-outlined">close</span></button>
                </div>
              @endif
            </div>

            <button type="button" class="chip-add" id="add-course-btn" onclick="showCourseInput()">
              <span class="material-symbols-outlined">add</span>
              Tambah mata kuliah
            </button>

            <div class="course-input-wrap" id="course-input-wrap">
              <input class="course-input" id="course-input" type="text" placeholder="Nama mata kuliah…" onkeydown="handleCourseKey(event)" />
              <button type="button" class="course-input-confirm" onclick="addCourse()">Tambah</button>
              <button type="button" class="course-input-cancel" onclick="hideCourseInput()"><span class="material-symbols-outlined">close</span></button>
            </div>

            <div class="info-banner">
              <span class="material-symbols-outlined">info</span>
              <p>Semakin banyak mata kuliah yang kamu tambahkan, semakin akurat rekomendasi partner belajarmu.</p>
            </div>
          </div>

          <div class="card reveal delay-2">
            <div class="avail-header">
              <div class="card-title card-title-no-mb">
                <span class="material-symbols-outlined">calendar_month</span>
                Ketersediaan Mingguan
              </div>
              <div class="avail-legend">
                <div class="legend-item"><span class="legend-dot on"></span> Tersedia</div>
                <div class="legend-item"><span class="legend-dot off"></span> Sibuk</div>
              </div>
            </div>
            <div class="card-desc card-desc-avail">Klik sel untuk toggle ketersediaanmu. Drag untuk memilih beberapa sekaligus.</div>

            <div class="avail-scroll">
              <div class="avail-inner">
                <div class="avail-grid" id="avail-grid">
                  <div></div>
                  <div class="avail-day-label">Sen</div>
                  <div class="avail-day-label">Sel</div>
                  <div class="avail-day-label">Rab</div>
                  <div class="avail-day-label">Kam</div>
                  <div class="avail-day-label">Jum</div>
                  <div class="avail-day-label">Sab</div>
                  <div class="avail-day-label">Min</div>
                </div>
              </div>
            </div>

            <div class="avail-actions">
              <button type="button" class="avail-action-btn" onclick="setAllAvail(true)">Pilih semua</button>
              <button type="button" class="avail-action-btn" onclick="setAllAvail(false)">Hapus semua</button>
              <button type="button" class="avail-action-btn" onclick="setWeekdays()">Hari kerja saja</button>
            </div>
          </div>

          <div class="card reveal delay-3">
            <div class="card-title">
              <span class="material-symbols-outlined">flag</span>
              Tujuan Belajarmu
            </div>
            <div class="card-desc">Pilih satu atau lebih tujuan utamamu bergabung di StudyMatch.</div>
            <div class="goal-chips" id="goal-chips">
              <button type="button" class="goal-chip" onclick="toggleGoal(this)"><span class="material-symbols-outlined">emoji_events</span> Persiapan ujian</button>
              <button type="button" class="goal-chip" onclick="toggleGoal(this)"><span class="material-symbols-outlined">science</span> Riset bersama</button>
              <button type="button" class="goal-chip" onclick="toggleGoal(this)"><span class="material-symbols-outlined">code</span> Project coding</button>
              <button type="button" class="goal-chip" onclick="toggleGoal(this)"><span class="material-symbols-outlined">menu_book</span> Diskusi materi</button>
              <button type="button" class="goal-chip" onclick="toggleGoal(this)"><span class="material-symbols-outlined">groups</span> Kelompok belajar rutin</button>
              <button type="button" class="goal-chip" onclick="toggleGoal(this)"><span class="material-symbols-outlined">translate</span> Bahasa & writing</button>
              <button type="button" class="goal-chip" onclick="toggleGoal(this)"><span class="material-symbols-outlined">presentation</span> Presentasi & debat</button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-footer reveal">
        <a href="{{ route('login') }}" class="btn btn-ghost">
          <span class="material-symbols-outlined">arrow_back</span>
          Kembali
        </a>
        <button type="button" class="btn btn-primary btn-lg" id="finish-btn" onclick="handleFinish()">
          <div class="spinner"></div>
          <span class="btn-label">Selesaikan Setup</span>
          <span class="material-symbols-outlined btn-arrow-icon">arrow_forward</span>
        </button>
      </div>
    </main>

    <footer>
      <div class="footer-inner">
        <span class="footer-logo">StudyMatch</span>
        <ul class="footer-links">
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Campus Partners</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <p class="footer-copy">&copy; {{ date('Y') }} StudyMatch. The Intellectual Atelier.</p>
      </div>
    </footer>

    <div class="toast" id="toast">
      <span class="material-symbols-outlined">check_circle</span>
      <span id="toast-msg">Berhasil disimpan!</span>
    </div>
  </body>
</html>
