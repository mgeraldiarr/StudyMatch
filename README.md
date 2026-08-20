<div align="center">

# 🎓 StudyMatch
### *Smart Matchmaking Platform for University Students*

Platform cerdas yang menghubungkan mahasiswa untuk menemukan teman belajar (*study partner*), berdiskusi dalam forum komunitas, menjadwalkan sesi belajar virtual, dan berkolaborasi mencapai target akademis.

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Tests](https://img.shields.io/badge/Tests-36%20Passed%20(100%25)-success?style=for-the-badge&logo=phpunit&logoColor=white)](https://phpunit.de)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Daftar Isi
- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Arsitektur & Keamanan](#-arsitektur--keamanan)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Folder](#-struktur-folder)
- [Panduan Instalasi Lokal](#-panduan-instalasi-lokal)
- [Pengujian Otomatis (Automated Testing)](#-pengujian-otomatis-automated-testing)
- [Akun Demo](#-akun-demo)
- [Lisensi](#-lisensi)

---

## 📖 Tentang Proyek

**StudyMatch** dirancang untuk mengatasi permasalahan mahasiswa yang kesulitan menemukan partner belajar yang cocok sesuai gaya belajar, jadwal ketersediaan, dan mata kuliah yang sedang diambil.

Aplikasi ini mengombinasikan algoritma pencocokan kompatibilitas cerdas, ruang obrolan langsung (*direct message* dan *group course*), manajemen agenda belajar terintegrasi Google Meet, forum diskusi komunitas, dan kustomisasi profil yang mendalam.

---

## ✨ Fitur Utama

### 1. ⚡ Algoritma Smart Matchmaking (`/discovery`)
- **Skor Kompatibilitas Otomatis:** Menghitung persentase kecocokan (65%–98%) berdasarkan:
  - Irisan mata kuliah semester ini (*Course Overlap*).
  - Keselarasan gaya belajar (*Visual, Diskusi/Auditory, Praktik/Kinesthetic, Reading*).
  - Kesamaan universitas dan program studi.
  - Kesesuaian jadwal mingguan (*Weekly Availability*).
- **Status Ajakan Dinamis:** Kartu kandidat menampilkan status relasi secara real-time (*Ajak Belajar, Menunggu Respon, Lihat Ajakan, atau Chat Sekarang*).
- **Favorit Persisten:** Simpan calon partner belajar ke daftar favorit dengan integrasi penyimpanan lokal.
- **Smart Match (FAB):** Fitur rekomendasi instan untuk menemukan partner terbaik yang belum terhubung dengan satu klik.

### 2. 💬 Komunikasi & Kolaborasi (*Chat*) (`/chat`)
- **Direct Message (DM):** Obrolan langsung antar partner belajar yang telah terhubung.
- **Course Group Chat:** Ruang diskusi grup interaktif untuk setiap mata kuliah yang diambil.
- **Manajemen Kontak & Riwayat:** Bersihkan riwayat chat dan hapus teman belajar dengan dialog konfirmasi yang aman.

### 3. 📅 Manajemen Jadwal Belajar (`/schedule`)
- **Kalender Bulanan & Mingguan:** Tampilan fleksibel untuk memantau agenda belajar per bulan maupun per pekan.
- **Integrasi Google Meet Otomatis:** Pembuatan tautan video conference dengan format resmi yang valid.
- **Pencatatan Rekap & Performa:** Menghitung total jam belajar, sesi selesai, dan rekapitulasi riwayat belajar.

### 4. 🌐 Forum Komunitas Akademis (`/community`)
- **Diskusi Interaktif:** Buat utas (*thread*) baru berdasarkan mata kuliah atau topik umum.
- **Voting & Balasan:** Fitur upvote/downvote dan tanggapan bertingkat pada setiap utas.

### 5. 👤 Profil Mahasiswa & Pengaturan (`/user-profile` & `/settings`)
- **Setup Profil Lengkap:** Pengaturan nama, universitas, jurusan, bio, target belajar, dan upload foto profil nyata.
- **Pengelolaan Mata Kuliah Interaktif:** Tambah dan hapus mata kuliah semester berjalan secara dinamis.
- **Keamanan Akun:** Ubah kata sandi dengan validasi keamanan dan pengaturan privasi profil.

### 6. 🎨 Custom Confirmation Modal
- Menggantikan dialog bawaan browser yang kaku (`window.confirm()`) dengan modal kustom modern berbasis *Glassmorphism* dan animasi halus.

---

## 🛡️ Arsitektur & Keamanan

Proyek ini dibangun dengan standar **Clean Architecture** dan **Security Best Practices**:

- **Form Request Validation:** Seluruh input pengguna divalidasi ketat di lapisan Request (`app/Http/Requests/`) untuk mencegah bypass validasi.
- **Proteksi Mass-Assignment:** Model Eloquent mengamankan atribut melalui `$fillable` eksplisit.
- **Pencegahan DOM XSS:** Sanitasi data dinamis di sisi JavaScript menggunakan `escapeHtml()`.
- **Proteksi CSRF:** Setiap permintaan AJAX/Fetch dilindungi dengan token CSRF Laravel (`X-CSRF-TOKEN`).
- **Pemisahan Logika Bisnis:** Logika matchmaking kompleks diisolasi ke dalam Service Layer (`app/Services/MatchmakingService.php`).
- **Autentikasi & Autorisasi:** Middleware `auth` dan pengecekan kepemilikan resource untuk operasi hapus data.

---

## 🛠️ Teknologi yang Digunakan

### Backend
- **Framework:** Laravel 12.x
- **Bahasa:** PHP 8.2+
- **Database:** SQLite / MySQL
- **ORM:** Eloquent ORM
- **Testing:** PHPUnit

### Frontend
- **Templating:** Blade Template Engine
- **Styling:** Tailwind CSS 4.x + Custom CSS Design System
- **Build Tool:** Vite 6.x
- **Scripting:** Modern Vanilla JavaScript (ES6+)
- **Icons & Fonts:** Google Material Symbols & Manrope Typography

---

## 📁 Struktur Folder

```text
StudyMatch/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php              # Autentikasi & setup profil
│   │   │   ├── DashboardController.php         # Entry point dashboard
│   │   │   └── Dashboard/                      # Controller modular per fitur
│   │   │       ├── ChatController.php
│   │   │       ├── CommunityController.php
│   │   │       ├── DiscoveryController.php
│   │   │       ├── NotificationController.php
│   │   │       ├── ProfileController.php
│   │   │       ├── ScheduleController.php
│   │   │       └── SettingsController.php
│   │   └── Requests/                           # Validasi Form Request terpusat
│   │       ├── Auth/
│   │       ├── Chat/
│   │       ├── Community/
│   │       ├── Profile/
│   │       └── Schedule/
│   ├── Models/                                 # User, Course, Message, Thread, dll.
│   └── Services/                               # MatchmakingService
├── database/
│   ├── migrations/                             # Skema database terstruktur
│   └── seeders/                                # Data awal untuk pengujian
├── resources/
│   ├── css/                                    # Stylesheet modular & variabel tema
│   ├── js/                                     # Modul logika JavaScript per halaman
│   └── views/                                  # Blade templates & layouts
├── routes/
│   └── web.php                                 # Definisi rute aplikasi
└── tests/
    └── Feature/                                # 36 Automated Feature Tests
```

---

## 🚀 Panduan Instalasi Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek di komputer lokal:

### 1. Prasyarat
- PHP >= 8.2 (dengan ekstensi `pdo`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `fileinfo`)
- Composer >= 2.x
- Node.js >= 18.x & NPM
- Git

### 2. Kloning Repositori
```bash
git clone https://github.com/mgeraldiarr/StudyMatch.git
cd StudyMatch
```

### 3. Instal Dependensi Backend & Frontend
```bash
composer install
npm install
```

### 4. Konfigurasi Lingkungan (`.env`)
Salin file konfigurasi dan buat application key:
```bash
cp .env.example .env
php artisan key:generate
```

### 5. Jalankan Migrasi & Seeder Database
```bash
php artisan migrate --seed
```

### 6. Buat Symlink Storage Publik
```bash
php artisan storage:link
```

### 7. Kompilasi Aset Frontend & Jalankan Server
Buka dua tab terminal terpisah:

**Terminal 1 (Vite Dev Server):**
```bash
npm run dev
# atau untuk build produksi:
npm run build
```

**Terminal 2 (Laravel Server):**
```bash
php artisan serve
```

Aplikasi siap diakses melalui browser di: **`http://127.0.0.1:8000`**

---

## 🧪 Pengujian Otomatis (Automated Testing)

Proyek ini dilengkapi dengan unit & feature testing menyeluruh untuk menjamin kualitas dan stabilitas fitur:

```bash
php artisan test
```

### Hasil Pengujian:
```text
PASS  Tests\Feature\AuthTest
PASS  Tests\Feature\ChatTest
PASS  Tests\Feature\CommunityTest
PASS  Tests\Feature\DiscoveryTest
PASS  Tests\Feature\NotificationTest
PASS  Tests\Feature\ProfileAndSettingsTest
PASS  Tests\Feature\ScheduleTest

Tests:    36 passed (118 assertions)
Duration: 1.45s
```

---

## 🔑 Akun Demo untuk Pengujian

Gunakan kredensial berikut untuk login dan mencoba aplikasi:

| Role / Akun | Email | Password |
| :--- | :--- | :--- |
| **Akun Demo Utama** | `student@ui.ac.id` | `secret123` |
| **Registrasi Baru** | Akses `/register` untuk membuat akun dari awal | *Bebas* |

---

## 📄 Lisensi

Proyek ini bersifat open-source dan dilisensikan di bawah [MIT License](LICENSE).
