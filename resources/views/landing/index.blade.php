@extends('layouts.landing')

@section('title', 'StudyMatch — Temukan Teman Belajarmu')

@section('content')
<!-- Hero -->
<section class="hero">
  <div class="hero-bg">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
  </div>

  <div class="hero-inner">
    <span class="badge reveal">
      <span class="badge-dot"></span>
      The Intellectual Atelier
    </span>

    <h1 class="reveal reveal-delay-1">
      Temukan Teman Belajar<br>
      <span class="highlight">Sesuai Gaya Belajarmu</span>
    </h1>

    <p class="hero-sub reveal reveal-delay-2">
      Platform eksklusif untuk mempertemukan para intelektual. Ciptakan sinergi belajar yang mendalam melalui algoritma pencocokan berbasis kepribadian akademik.
    </p>

    <div class="hero-cta reveal reveal-delay-3">
      <a href="{{ route('auth.login') }}" class="btn-primary">
        Daftar Sekarang
        <span class="material-symbols-outlined icon-lg">arrow_forward</span>
      </a>
      <a href="#cara-kerja" class="btn-ghost">
        <span class="material-symbols-outlined icon-lg">play_circle</span>
        Cara Kerjanya
      </a>
    </div>

    <div class="hero-trust reveal reveal-delay-4">
      <div class="trust-avatars">
        <div class="trust-avatar">AD</div>
        <div class="trust-avatar">RS</div>
        <div class="trust-avatar">BK</div>
        <div class="trust-avatar">+</div>
      </div>
      <span class="trust-text"><strong>15.000+</strong> mahasiswa aktif</span>
      <div class="trust-sep"></div>
      <div class="trust-rating">
        <span class="stars">★★★★★</span>
        <span class="trust-rating-text">4.9/5 rating</span>
      </div>
    </div>
  </div>
</section>

<!-- Fitur -->
<section id="fitur" class="fitur">
  <div class="section-inner">
    <div class="section-header reveal">
      <span class="badge">Fitur Unggulan</span>
      <h2>Semua yang Kamu Butuhkan<br>untuk Belajar Lebih Efektif</h2>
      <p>Dirancang khusus agar setiap sesi belajar terasa bermakna, fokus, dan menyenangkan.</p>
    </div>

    <div class="fitur-grid">
      <div class="fitur-card reveal reveal-delay-1">
        <div class="fitur-icon-wrap purple">
          <span class="material-symbols-outlined">explore</span>
        </div>
        <h3>Smart Match</h3>
        <p>Algoritma kami menganalisis gaya belajarmu—visual, auditori, atau kinestetik—untuk menemukan partner yang benar-benar cocok dan saling melengkapi.</p>
        <a href="#cara-kerja" class="fitur-card-link">Pelajari lebih lanjut <span class="material-symbols-outlined icon-sm">arrow_forward</span></a>
      </div>

      <div class="fitur-card reveal reveal-delay-2">
        <div class="fitur-icon-wrap teal">
          <span class="material-symbols-outlined">calendar_month</span>
        </div>
        <h3>Sync Schedule</h3>
        <p>Sinkronisasi kalender otomatis antara semua anggota kelompok. Temukan slot waktu bersama tanpa perlu bolak-balik konfirmasi manual.</p>
        <a href="#cara-kerja" class="fitur-card-link">Pelajari lebih lanjut <span class="material-symbols-outlined icon-sm">arrow_forward</span></a>
      </div>

      <div class="fitur-card reveal reveal-delay-3">
        <div class="fitur-icon-wrap violet">
          <span class="material-symbols-outlined">forum</span>
        </div>
        <h3>Academic Forum</h3>
        <p>Ruang diskusi tematik yang bersih dari distraksi. Tulis pertanyaan, bagikan pemahaman, dan selesaikan masalah akademik bersama komunitas.</p>
        <a href="#cara-kerja" class="fitur-card-link">Pelajari lebih lanjut <span class="material-symbols-outlined icon-sm">arrow_forward</span></a>
      </div>

      <div class="fitur-card reveal reveal-delay-1">
        <div class="fitur-icon-wrap purple">
          <span class="material-symbols-outlined">chat_bubble</span>
        </div>
        <h3>Intellectual Exchange</h3>
        <p>Sistem pesan terenkripsi untuk berbagi catatan, referensi, dan insight secara instan. Semua percakapan tersimpan rapi dan mudah dicari kembali.</p>
        <a href="#cara-kerja" class="fitur-card-link">Pelajari lebih lanjut <span class="material-symbols-outlined icon-sm">arrow_forward</span></a>
      </div>

      <div class="fitur-card reveal reveal-delay-2">
        <div class="fitur-icon-wrap teal">
          <span class="material-symbols-outlined">track_changes</span>
        </div>
        <h3>Progress Tracker</h3>
        <p>Pantau perkembangan belajarmu dan kelompok secara visual. Lihat topik yang sudah dikuasai dan area yang masih perlu diperkuat.</p>
        <a href="#cara-kerja" class="fitur-card-link">Pelajari lebih lanjut <span class="material-symbols-outlined icon-sm">arrow_forward</span></a>
      </div>

      <div class="fitur-card reveal reveal-delay-3">
        <div class="fitur-icon-wrap violet">
          <span class="material-symbols-outlined">shield_lock</span>
        </div>
        <h3>Safe Environment</h3>
        <p>Moderasi komunitas aktif memastikan lingkungan belajar tetap positif, akademis, dan bebas dari perilaku yang tidak kondusif.</p>
        <a href="#cara-kerja" class="fitur-card-link">Pelajari lebih lanjut <span class="material-symbols-outlined icon-sm">arrow_forward</span></a>
      </div>
    </div>
  </div>
</section>

<!-- Stats -->
<section class="stats">
  <div class="stats-inner">
    <div class="stat-item reveal">
      <span class="stat-number" data-target="15000" data-suffix="k+">0</span>
      <span class="stat-label">Active Students</span>
    </div>
    <div class="stat-item reveal reveal-delay-1">
      <span class="stat-number" data-target="92" data-suffix="%">0</span>
      <span class="stat-label">Success Match</span>
    </div>
    <div class="stat-item reveal reveal-delay-2">
      <span class="stat-number" data-target="450" data-suffix="+">0</span>
      <span class="stat-label">Study Groups</span>
    </div>
    <div class="stat-item reveal reveal-delay-3">
      <span class="stat-number" data-target="0" data-display="24/7">0</span>
      <span class="stat-label">Peer Support</span>
    </div>
  </div>
</section>

<!-- Cara Kerja -->
<section id="cara-kerja" class="cara-kerja">
  <div class="section-inner">
    <div class="section-header reveal">
      <span class="badge">Cara Kerja</span>
      <h2>Mulai dalam 3 Langkah Sederhana</h2>
      <p>Tidak perlu konfigurasi rumit. StudyMatch dirancang agar kamu bisa langsung fokus belajar.</p>
    </div>

    <div class="steps">
      <div class="step reveal">
        <div class="step-text">
          <div class="step-number">01</div>
          <h3>Buat Profil Akademikmu</h3>
          <p>Ceritakan tentang dirimu: jurusan, universitas, mata kuliah yang sedang diambil, serta gaya belajar yang paling nyaman—visual, auditori, atau kinestetik. Profil ini menjadi dasar algoritma pencocokan kami.</p>
        </div>
        <div class="step-visual">
          <div class="step-visual-content">
            <div class="step-icon-bg">
              <span class="material-symbols-outlined">account_circle</span>
            </div>
            <div class="step-visual-label">Profil Akademik</div>
          </div>
        </div>
      </div>

      <div class="step reveal">
        <div class="step-text">
          <div class="step-number">02</div>
          <h3>Temukan Partner yang Cocok</h3>
          <p>Algoritma Smart Match kami akan menganalisis profil dan preferensimu, lalu menampilkan daftar calon partner atau kelompok belajar yang paling kompatibel. Kamu bisa melihat profil mereka sebelum memutuskan untuk terhubung.</p>
        </div>
        <div class="step-visual">
          <div class="step-visual-content">
            <div class="step-icon-bg">
              <span class="material-symbols-outlined">group_search</span>
            </div>
            <div class="step-visual-label">Pencocokan Cerdas</div>
          </div>
        </div>
      </div>

      <div class="step reveal">
        <div class="step-text">
          <div class="step-number">03</div>
          <h3>Mulai Sesi Belajar Bersama</h3>
          <p>Setelah terhubung, koordinasikan jadwal melalui fitur Sync Schedule, berdiskusi di forum, dan saling berbagi materi lewat pesan terenkripsi. Semua alat yang kamu butuhkan sudah tersedia dalam satu platform.</p>
        </div>
        <div class="step-visual">
          <div class="step-visual-content">
            <div class="step-icon-bg">
              <span class="material-symbols-outlined">groups</span>
            </div>
            <div class="step-visual-label">Sesi Kolaboratif</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Tentang Kami -->
<section id="tentang-kami" class="tentang">
  <div class="section-inner">
    <div class="section-header reveal">
      <span class="badge">Tentang Kami</span>
      <h2>Dibangun oleh Mahasiswa, untuk Mahasiswa</h2>
      <p>Kami memahami tantangan belajar di era modern karena kami pernah mengalaminya sendiri.</p>
    </div>
    <div class="tentang-grid">
      <div class="tentang-text reveal">
        <h3>Mengapa StudyMatch Lahir?</h3>
        <p>StudyMatch lahir dari frustrasi yang nyata: mencari teman belajar yang serius dan kompatibel itu sulit. Grup chat penuh distraksi, forum umum terlalu ramai, dan tidak ada platform yang benar-benar memahami kebutuhan akademik mahasiswa Indonesia.</p>
        <p>Tim kami—yang terdiri dari mahasiswa dan alumni berbagai universitas terkemuka—membangun StudyMatch dengan satu misi: menciptakan ruang intelektual yang bermakna, di mana setiap sesi belajar bisa menghasilkan pemahaman yang nyata.</p>
        <p>Hari ini, lebih dari 15.000 mahasiswa aktif di seluruh Indonesia telah merasakan manfaatnya. Dan kami baru saja memulai.</p>
      </div>

      <div class="tentang-values reveal reveal-delay-2">
        <div class="value-item">
          <div class="value-icon purple">
            <span class="material-symbols-outlined">psychology</span>
          </div>
          <div class="value-body">
            <h4>Berbasis Riset</h4>
            <p>Fitur dan algoritma dikembangkan berdasarkan penelitian psikologi belajar dan kolaborasi akademik yang efektif.</p>
          </div>
        </div>
        <div class="value-item">
          <div class="value-icon teal">
            <span class="material-symbols-outlined">diversity_3</span>
          </div>
          <div class="value-body">
            <h4>Inklusif & Beragam</h4>
            <p>Kami merangkul mahasiswa dari semua jurusan, universitas, dan latar belakang. Keberagaman perspektif memperkaya proses belajar.</p>
          </div>
        </div>
        <div class="value-item">
          <div class="value-icon violet">
            <span class="material-symbols-outlined">verified_user</span>
          </div>
          <div class="value-body">
            <h4>Privasi Terjamin</h4>
            <p>Data dan percakapanmu dilindungi enkripsi end-to-end. Kami tidak pernah menjual data pengguna kepada pihak ketiga.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section id="faq" class="faq">
  <div class="section-inner">
    <div class="section-header reveal">
      <span class="badge">FAQ</span>
      <h2>Pertanyaan yang Sering Ditanyakan</h2>
      <p>Tidak menemukan jawaban yang kamu cari? Hubungi tim kami kapan saja.</p>
    </div>

    <div class="faq-list reveal">
      <div class="faq-item">
        <div class="faq-question" onclick="toggleFaq(this)">
          <h4>Apakah StudyMatch gratis untuk digunakan?</h4>
          <span class="material-symbols-outlined faq-chevron">expand_more</span>
        </div>
        <div class="faq-answer">
          <p>Ya! StudyMatch sepenuhnya gratis untuk digunakan. Kamu bisa membuat profil, menemukan partner belajar, dan menggunakan fitur dasar tanpa biaya apapun. Kami juga memiliki paket Premium dengan fitur tambahan untuk pengalaman belajar yang lebih mendalam.</p>
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question" onclick="toggleFaq(this)">
          <h4>Bagaimana algoritma Smart Match bekerja?</h4>
          <span class="material-symbols-outlined faq-chevron">expand_more</span>
        </div>
        <div class="faq-answer">
          <p>Algoritma kami menganalisis gaya belajarmu (visual, auditori, kinestetik), bidang studi, jadwal ketersediaan, dan preferensi belajar. Kemudian kami mencocokkanmu dengan kandidat yang paling kompatibel berdasarkan kombinasi faktor-faktor tersebut menggunakan machine learning.</p>
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question" onclick="toggleFaq(this)">
          <h4>Apakah data pribadi saya aman?</h4>
          <span class="material-symbols-outlined faq-chevron">expand_more</span>
        </div>
        <div class="faq-answer">
          <p>Keamanan data adalah prioritas utama kami. Semua percakapan dienkripsi end-to-end, kami tidak pernah menjual data pengguna ke pihak ketiga, dan kamu memiliki kendali penuh atas informasi apa yang ingin ditampilkan di profilmu.</p>
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question" onclick="toggleFaq(this)">
          <h4>Apakah tersedia untuk semua universitas di Indonesia?</h4>
          <span class="material-symbols-outlined faq-chevron">expand_more</span>
        </div>
        <div class="faq-answer">
          <p>StudyMatch terbuka untuk mahasiswa dari universitas manapun di Indonesia. Saat ini kami sudah memiliki komunitas aktif dari lebih dari 200 universitas di seluruh nusantara, dan terus berkembang setiap harinya.</p>
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question" onclick="toggleFaq(this)">
          <h4>Bagaimana jika saya tidak cocok dengan partner yang direkomendasikan?</h4>
          <span class="material-symbols-outlined faq-chevron">expand_more</span>
        </div>
        <div class="faq-answer">
          <p>Tidak masalah! Kamu selalu bisa mengeksplorasi lebih banyak rekomendasi, mengubah preferensi belajarmu, atau bergabung dengan kelompok studi yang sudah ada. Feedback-mu juga membantu algoritma kami menjadi lebih akurat dari waktu ke waktu.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-section">
  <div class="cta-inner reveal">
    <div class="cta-blob-1"></div>
    <div class="cta-blob-2"></div>
    <div class="cta-content">
      <h2>Siap Untuk Belajar<br>Lebih Cerdas?</h2>
      <p>Bergabunglah dengan ribuan mahasiswa lainnya dan temukan partner intelektualmu hari ini. Gratis selamanya.</p>
      <a href="{{ route('auth.login') }}" class="btn-white">
        Mulai Gratis Sekarang
        <span class="material-symbols-outlined icon-lg">arrow_forward</span>
      </a>
    </div>
  </div>
</section>
@endsection