@extends('layouts.dashboard', ['activePage' => 'chat'])

@section('title', 'Pesan | StudyMatch')

@push('page-css')
    @vite(['resources/css/pages/chat.css', 'resources/js/pages/chat.js'])
@endpush

@section('content')
<script id="conversations-data" type="application/json">
    {!! json_encode($conversations ?? []) !!}
</script>
<script id="auth-user-data" type="application/json">
    {!! json_encode(auth()->id()) !!}
</script>
<script>
    window.__INITIAL_CONVERSATIONS__ = JSON.parse(document.getElementById('conversations-data').textContent);
    window.__AUTH_USER_ID__ = JSON.parse(document.getElementById('auth-user-data').textContent);
</script>

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
            <img id="chatHdrAvatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28" alt="" />
          </div>
          <div>
            <div class="chat-hdr-name" id="chatHdrName">Pilih percakapan</div>
            <div class="chat-hdr-status" id="chatHdrStatus"><span class="status-dot"></span>Online</div>
          </div>
        </div>
        <div class="chat-hdr-actions">
          <button class="btn btn-icon-only btn-ghost" title="Hapus Riwayat Pesan" onclick="clearCurrentChat()">
            <span class="material-symbols-outlined">delete_sweep</span>
          </button>
          <button class="btn btn-icon-only btn-ghost" title="Hapus Teman Belajar" onclick="removeCurrentPartner()">
            <span class="material-symbols-outlined">person_remove</span>
          </button>
          <button class="btn btn-icon-only btn-ghost" title="Video call" onclick="toast('Fitur Video Call akan segera hadir!')">
            <span class="material-symbols-outlined">videocam</span>
          </button>
        </div>
      </header>

      <div class="msgs-area" id="msgsArea">
        <div class="empty-state" style="padding: 40px 20px; text-align: center; color: var(--text-muted);">
          <span class="material-symbols-outlined" style="font-size: 48px; margin-bottom: 8px;">chat</span>
          <p>Pilih salah satu teman belajar atau grup mata kuliah di panel kiri untuk memulai obrolan.</p>
        </div>
      </div>

      <div class="input-area">
        <div class="input-box">
          <div class="input-icons">
            <button class="btn btn-icon-only btn-ghost input-btn" title="Lampiran" onclick="toast('Pilih file lampiran…')"><span class="material-symbols-outlined">attach_file</span></button>
            <button class="btn btn-icon-only btn-ghost input-btn" title="Emoji" onclick="toast('Pilih emoji')"><span class="material-symbols-outlined">emoji_emotions</span></button>
          </div>
          <textarea class="input-ta" id="inputMsg" placeholder="Ketik pesan…" rows="1"></textarea>
          <button class="btn btn-primary btn-icon-only send-btn" id="sendBtn" title="Kirim" onclick="sendMessage()"><span class="material-symbols-outlined">send</span></button>
        </div>
      </div>
    </section>
@endsection
