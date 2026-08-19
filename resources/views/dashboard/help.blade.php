@extends('layouts.dashboard', ['activePage' => 'help'])

@section('title', 'Pusat Bantuan | StudyMatch')

@push('page-css')
    @vite(['resources/css/pages/help.css'])
@endpush

@section('content')
    <div class="main-inner">
      <div class="help-header reveal">
        <div class="help-header-blob"></div>
        <div class="help-header-content">
          <h2>Ada yang bisa kami bantu?</h2>
          <p>Temukan jawaban untuk pertanyaan umum mengenai gaya belajar, pencocokan partner, pembuatan jadwal, dan interaksi akademik di platform kami.</p>
        </div>
      </div>

      <div class="help-grid">
        <!-- FAQ Section -->
        <div>
          <div class="help-section-title">
            <span class="material-symbols-outlined">quiz</span> FAQ — Pertanyaan Umum
          </div>

          <div class="help-search">
            <span class="material-symbols-outlined">search</span>
            <input type="text" placeholder="Cari pertanyaan…" oninput="searchFaq(this.value)" />
          </div>

          <div class="faq-list reveal reveal-delay-1" id="faqList">
            <div class="faq-card">
              <button class="faq-btn" onclick="toggleFaq(this)">
                <span>Bagaimana cara kerja pencocokan partner Smart Match?</span>
                <span class="material-symbols-outlined">expand_more</span>
              </button>
              <div class="faq-answer">
                <div class="faq-answer-inner">
                  Algoritma kami menganalisis Profil Akademik yang kamu isi (termasuk universitas, jurusan, mata kuliah yang sedang diambil, dan gaya belajar dominanmu). Kami merekomendasikan partner yang memiliki minat akademis selaras sehingga kolaborasi belajar bisa berjalan lebih efektif dan menyenangkan.
                </div>
              </div>
            </div>

            <div class="faq-card">
              <button class="faq-btn" onclick="toggleFaq(this)">
                <span>Apa itu Gaya Belajar dan bagaimana menentukannya?</span>
                <span class="material-symbols-outlined">expand_more</span>
              </button>
              <div class="faq-answer">
                <div class="faq-answer-inner">
                  <p>Gaya belajar di platform kami terbagi menjadi tiga kategori utama:</p>
                  <ul>
                    <li><strong>Visual</strong>: Belajar lewat diagram, catatan terstruktur, atau video.</li>
                    <li><strong>Diskusi</strong>: Belajar dengan menjelaskan materi secara aktif kepada orang lain.</li>
                    <li><strong>Praktik</strong>: Belajar secara langsung dengan memecahkan problem set atau menulis kode program.</li>
                  </ul>
                  <p>Kamu bisa menentukan preferensimu saat pertama kali melakukan Setup Profil atau mengaturnya kapan saja melalui halaman Profil Saya.</p>
                </div>
              </div>
            </div>

            <div class="faq-card">
              <button class="faq-btn" onclick="toggleFaq(this)">
                <span>Bagaimana cara menyinkronkan Jadwal dengan partner?</span>
                <span class="material-symbols-outlined">expand_more</span>
              </button>
              <div class="faq-answer">
                <div class="faq-answer-inner">
                  Pada menu <strong>Jadwal</strong>, kamu bisa melihat kalender studimu. Kamu dapat membuat sesi belajar (Create Session) dan mengundang partner yang telah terhubung dengannmu. Sistem secara otomatis akan menampilkan ketersediaan waktu bersama berdasarkan ketersediaan jadwal yang telah kalian tentukan pada profil masing-masing.
                </div>
              </div>
            </div>

            <div class="faq-card">
              <button class="faq-btn" onclick="toggleFaq(this)">
                <span>Apakah data pesan dan dokumen saya terenkripsi?</span>
                <span class="material-symbols-outlined">expand_more</span>
              </button>
              <div class="faq-answer">
                <div class="faq-answer-inner">
                  Ya, betul. Seluruh pesan, catatan kuliah, referensi, dan media yang dibagikan melalui fitur Pesan (Intellectual Exchange) dikirimkan melalui jalur terenkripsi yang aman. Ruang diskusi dan filemu terproteksi agar fokus belajarmu tetap terjaga secara akademis.
                </div>
              </div>
            </div>

            <div class="faq-card">
              <button class="faq-btn" onclick="toggleFaq(this)">
                <span>Bagaimana cara mengaktifkan Mode Musim Ujian?</span>
                <span class="material-symbols-outlined">expand_more</span>
              </button>
              <div class="faq-answer">
                <div class="faq-answer-inner">
                  Kamu bisa mengaktifkan <strong>Exam Season Mode</strong> di menu Pengaturan. Ketika aktif, platform akan menyaring notifikasi non-esensial dan hanya membiarkan pesan darurat akademik dari kelompok belajar utamamu masuk. Pilihan yang sangat cocok untuk fase belajar mendalam (deep focus).
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Support Form -->
        <div>
          <div class="help-section-title">
            <span class="material-symbols-outlined">mail</span> Hubungi Kami
          </div>

          <div class="contact-card reveal reveal-delay-2">
            <h3>Kirim Tiket Bantuan</h3>
            <p>Punya pertanyaan spesifik atau kendala teknis? Kirim pesan ke tim dukungan kami.</p>

            <form id="contactForm" onsubmit="handleContactSubmit(event)">
              <div class="form-group">
                <label for="c-email">Email Terdaftar</label>
                <input class="form-control" type="email" id="c-email" value="alya.ramadhani@ui.ac.id" readonly />
              </div>

              <div class="form-group">
                <label for="c-subject">Subjek</label>
                <select class="form-control" id="c-subject">
                  <option value="matchmaking">Masalah Pencocokan Partner</option>
                  <option value="schedule">Sinkronisasi Kalender/Jadwal</option>
                  <option value="chat">Pesan & Forum Diskusi</option>
                  <option value="account">Masalah Akun & Pengaturan</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div class="form-group">
                <label for="c-message">Detail Pertanyaan / Kendala</label>
                <textarea class="form-control" id="c-message" placeholder="Tuliskan kendala Anda secara detail..." required></textarea>
              </div>

              <button class="btn btn-primary" type="submit">
                <span class="material-symbols-outlined">send</span> Kirim Tiket
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
@endsection

@push('scripts')
    <script>
      function toggleFaq(btn) {
        const card = btn.closest(".faq-card");
        const answer = card.querySelector(".faq-answer");
        const isOpen = card.classList.contains("open");

        document.querySelectorAll(".faq-card.open").forEach(c => {
          if (c !== card) {
            c.classList.remove("open");
            c.querySelector(".faq-answer").style.maxHeight = null;
          }
        });

        if (isOpen) {
          card.classList.remove("open");
          answer.style.maxHeight = null;
        } else {
          card.classList.add("open");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      }

      function searchFaq(query) {
        const q = query.toLowerCase().trim();
        const cards = document.querySelectorAll(".faq-card");

        cards.forEach(card => {
          const text = card.textContent.toLowerCase();
          if (text.includes(q)) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      }

      function handleContactSubmit(e) {
        e.preventDefault();
        const message = document.getElementById("c-message").value;
        if (!message.trim()) {
          toast("Silakan tulis pesan detail kendala Anda!", "error");
          return;
        }

        const submitBtn = e.target.querySelector("button[type='submit']");
        const originalHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="material-symbols-outlined" style="animation: spin 1s linear infinite">refresh</span> Mengirim…`;

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHtml;
          document.getElementById("c-message").value = "";
          toast("Tiket terkirim! Tim Support akan merespons via email dalam 24 jam.", "success");
        }, 1500);
      }

      /* ── Scroll reveal ── */
      const helpRevealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              helpRevealObserver.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 },
      );
      document.querySelectorAll(".main-inner .reveal").forEach((el) => helpRevealObserver.observe(el));
    </script>
@endpush
