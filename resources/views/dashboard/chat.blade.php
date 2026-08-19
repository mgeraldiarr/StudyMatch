@extends('layouts.dashboard', ['activePage' => 'chat'])

@section('title', 'Pesan | StudyMatch')

@push('page-css')
    @vite(['resources/css/pages/chat.css', 'resources/js/pages/chat.js'])
@endpush

@section('content')
    <!-- Conversations panel -->
      <section class="conv-panel" id="convPanel">
        <div class="conv-header">
          <h2 class="conv-title">Pesan</h2>
          <div class="conv-search">
            <span class="material-symbols-outlined">search</span>
            <input type="text" placeholder="Cari chat…" oninput="filterConvs(this.value)" />
          </div>
        </div>
        <div class="conv-list" id="convList"></div>
      </section>

      <!-- Chat window -->
      <section class="chat-window">
        <header class="chat-hdr">
          <div class="chat-hdr-left">
            <button class="chat-back-btn btn btn-icon-only btn-ghost" onclick="toggleConvPanel()" title="Kembali" aria-label="Kembali ke daftar percakapan">
              <span class="material-symbols-outlined">arrow_back</span>
            </button>
            <div class="chat-hdr-av">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ-VR5XHbtoZrw07_xJp2dOibXlKV1ph4v9h0Ep25o519mGHSP3fYqdoizVuDhH1jDnG0V8QU1BxK_MY1FPunfb7_8DxkYiVzJKe5EyzCLekGkXYCghAQmKjovo71T9ofCZ7Q-P3k2wp1zMtJIvVPWXKM5xG2_Nonug38Ihs4xm_Xh_lG8GY0s8NlEnZDYV_g7zEw0kMX8j0WI_dB6DpyF0hSp26wJXD4LDoTy6z-NL_Ha689QKQM_H5ZD4LwdHFq-rv3Kk7qTzZ0" alt="" />
            </div>
            <div>
              <div class="chat-hdr-name" id="chatHdrName">Calculus Study Group</div>
              <div class="chat-hdr-status" id="chatHdrStatus"><span class="status-dot"></span>4 anggota aktif</div>
            </div>
          </div>
          <div class="chat-hdr-actions">
            <button class="btn btn-icon-only btn-ghost" title="Video call" onclick="toast('Memulai video call…')"><span class="material-symbols-outlined">videocam</span></button>
            <button class="btn btn-icon-only btn-ghost" title="Info" onclick="toast('Info grup dibuka')"><span class="material-symbols-outlined">info</span></button>
          </div>
        </header>

        <div class="msgs-area" id="msgsArea"></div>

        <div class="input-area">
          <div class="input-box">
            <div class="input-icons">
              <button class="btn btn-icon-only btn-ghost input-btn" title="Lampiran" onclick="toast('Pilih file…')"><span class="material-symbols-outlined">attach_file</span></button>
              <button class="btn btn-icon-only btn-ghost input-btn" title="Emoji" onclick="toast('Emoji picker')"><span class="material-symbols-outlined">emoji_emotions</span></button>
            </div>
            <textarea class="input-ta" id="inputMsg" placeholder="Ketik pesan…" rows="1"></textarea>
            <button class="btn btn-primary btn-icon-only send-btn" title="Kirim" onclick="sendMessage()"><span class="material-symbols-outlined">send</span></button>
          </div>
        </div>
      </section>
@endsection


