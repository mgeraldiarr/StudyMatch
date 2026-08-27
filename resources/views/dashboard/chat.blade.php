@extends('layouts.dashboard', ['activePage' => 'chat', 'hideFooter' => true])

@section('title', 'Pesan | StudyMatch')

@push('page-css')
@vite(['resources/css/pages/chat.css', 'resources/js/pages/chat.js'])
@endpush

@section('content')
<script id="initialConversationsData" type="application/json">
  {!! json_encode($conversations ?? []) !!}
</script>
<script id="authUserData" type="application/json">
  {!! json_encode($currentUser ?? null) !!}
</script>

<div class="chat-app-container">
  <!-- Left Conversation Sidebar -->
  <aside class="conv-panel" id="convPanel">
    <div class="conv-header">
      <div class="conv-header-top">
        <h2 class="conv-title">Pesan</h2>
        <div class="conv-header-actions">
          <button class="btn btn-icon-only btn-ghost" title="Buat Grup Belajar Baru" onclick="openCreateGroupModal()">
            <span class="material-symbols-outlined">group_add</span>
          </button>
          <button class="btn btn-icon-only btn-ghost" title="Daftar Berbintang" onclick="openStarredMessagesModal()">
            <span class="material-symbols-outlined">star</span>
          </button>
          <button class="btn btn-icon-only btn-ghost" title="Buat Filter Daftar Baru" onclick="openCustomListModal()">
            <span class="material-symbols-outlined">playlist_add</span>
          </button>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="conv-search">
        <span class="material-symbols-outlined">search</span>
        <input type="text" id="convSearchInput" placeholder="Cari atau mulai chat baru…" oninput="filterConvs(this.value)" />
        <button class="clear-search-btn" id="clearSearchBtn" onclick="clearSearch()" style="display:none">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- WhatsApp-Style Quick Filter Chips -->
      <div class="conv-filter-chips" id="filterChips">
        <button class="filter-chip active" data-filter="all" onclick="setChatFilter('all')">Semua</button>
        <button class="filter-chip" data-filter="unread" onclick="setChatFilter('unread')">Belum Dibaca</button>
        <button class="filter-chip" data-filter="favorite" onclick="setChatFilter('favorite')">Favorit</button>
        <button class="filter-chip" data-filter="group" onclick="setChatFilter('group')">Grup</button>
        <button class="filter-chip chip-add" onclick="openCustomListModal()" title="Tambah Filter Daftar Baru">
          <span class="material-symbols-outlined">add</span> Daftar
        </button>
      </div>
    </div>

    <!-- Conversations List -->
    <div class="conv-list" id="convList"></div>
  </aside>

  <!-- Center Chat Window -->
  <main class="chat-window">
    <!-- WhatsApp Header -->
    <header class="chat-hdr">
      <button class="btn btn-icon-only btn-ghost chat-back-btn" id="chatBackBtn" title="Kembali ke daftar percakapan" onclick="toggleConvPanel()">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <div class="chat-hdr-left" onclick="openInfoDrawer()" title="Klik untuk melihat info kontak / grup">
        <div class="chat-hdr-av-wrap">
          <div class="chat-hdr-av" id="chatHdrAvatarContainer">
            <img id="chatHdrAvatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28" alt="" />
          </div>
          <span class="online-indicator-dot" id="chatHdrOnlineDot"></span>
        </div>
        <div class="chat-hdr-meta">
          <div class="chat-hdr-name" id="chatHdrName">Pilih percakapan</div>
          <div class="chat-hdr-status" id="chatHdrStatus">
            <span class="status-subtitle">klik di sini untuk info kontak</span>
          </div>
        </div>
      </div>

      <!-- Header Quick Action Buttons -->
      <div class="chat-hdr-actions">
        <button class="btn btn-icon-only btn-ghost" title="Panggilan Suara" onclick="startVoiceCall()">
          <span class="material-symbols-outlined">call</span>
        </button>
        <button class="btn btn-icon-only btn-ghost" title="Panggilan Video" onclick="startVideoCall()">
          <span class="material-symbols-outlined">videocam</span>
        </button>
        <button class="btn btn-icon-only btn-ghost" title="Cari Pesan" onclick="toggleInChatSearch()">
          <span class="material-symbols-outlined">search</span>
        </button>
        <button class="btn btn-icon-only btn-ghost" title="Info Kontak / Grup" onclick="openInfoDrawer()">
          <span class="material-symbols-outlined">more_vert</span>
        </button>
      </div>
    </header>

    <!-- In-Chat Search Bar (Hidden by default) -->
    <div class="inchat-search-bar" id="inChatSearchBar" style="display:none">
      <span class="material-symbols-outlined">search</span>
      <input type="text" id="inChatSearchInput" placeholder="Cari kata kunci dalam chat ini…" oninput="handleInChatSearch(this.value)" />
      <button class="btn btn-icon-only btn-ghost" onclick="toggleInChatSearch()">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>

    <!-- Messages Area with WhatsApp Wallpaper -->
    <div class="msgs-area" id="msgsArea">
      <div class="empty-state">
        <span class="material-symbols-outlined empty-icon">chat</span>
        <h3 class="empty-title">StudyMatch Messenger</h3>
        <p class="empty-desc">Pilih salah satu teman belajar atau grup mata kuliah untuk mulai berdiskusi dan bertukar catatan materi.</p>
        <div class="encryption-badge">
          <span class="material-symbols-outlined">lock</span>
          Pesan terenkripsi dan aman dalam lingkup akademik StudyMatch
        </div>
      </div>
    </div>

    <!-- WhatsApp-Style Bottom Input Bar -->
    <footer class="input-area">
      <div class="input-box">
        <div class="input-actions-left">
          <button class="btn btn-icon-only btn-ghost input-btn" id="emojiBtn" title="Emoji" onclick="toggleEmojiPicker()">
            <span class="material-symbols-outlined">sentiment_satisfied</span>
          </button>
          <button class="btn btn-icon-only btn-ghost input-btn" id="attachBtn" title="Lampiran" onclick="toggleAttachmentMenu()">
            <span class="material-symbols-outlined">attach_file</span>
          </button>
        </div>

        <!-- Attachment Popup Menu -->
        <div class="attachment-popup" id="attachmentPopup" style="display:none">
          <button class="attach-opt" onclick="triggerFileUpload('document')">
            <span class="attach-icon bg-purple"><span class="material-symbols-outlined">description</span></span>
            <span>Dokumen / PDF</span>
          </button>
          <button class="attach-opt" onclick="triggerFileUpload('image')">
            <span class="attach-icon bg-blue"><span class="material-symbols-outlined">image</span></span>
            <span>Foto &amp; Gambar</span>
          </button>
          <button class="attach-opt" onclick="triggerFileUpload('video')">
            <span class="attach-icon bg-red"><span class="material-symbols-outlined">movie</span></span>
            <span>Video Materi</span>
          </button>
          <button class="attach-opt" onclick="triggerFileUpload('notes')">
            <span class="attach-icon bg-amber"><span class="material-symbols-outlined">menu_book</span></span>
            <span>Catatan Materi</span>
          </button>
        </div>

        <!-- Hidden Real File Inputs -->
        <input type="file" id="chatDocInput" style="display:none" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" onchange="handleFileSelected(event, 'document')">
        <input type="file" id="chatImgInput" style="display:none" accept="image/*" onchange="handleFileSelected(event, 'image')">
        <input type="file" id="chatVideoInput" style="display:none" accept="video/*" onchange="handleFileSelected(event, 'video')">

        <textarea class="input-ta" id="inputMsg" placeholder="Ketik pesan…" rows="1" onkeydown="handleInputKeyDown(event)" oninput="autoResizeTextarea(this)"></textarea>

        <div class="input-actions-right">
          <button class="btn btn-primary btn-icon-only send-btn" id="sendBtn" title="Kirim Pesan" onclick="sendMessage()">
            <span class="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </footer>
  </main>

  <!-- WhatsApp-Style Right Info Drawer (Slide-In) -->
  <aside class="info-drawer" id="infoDrawer">
    <div class="info-drawer-header">
      <button class="btn btn-icon-only btn-ghost" onclick="closeInfoDrawer()" title="Tutup Info">
        <span class="material-symbols-outlined">close</span>
      </button>
      <h3 id="infoDrawerTitle">Info Kontak</h3>
    </div>
    <div class="info-drawer-body" id="infoDrawerBody">
      <!-- Content will be rendered dynamically by JavaScript -->
    </div>
  </aside>
  <div class="drawer-overlay" id="drawerOverlay" onclick="closeInfoDrawer()"></div>
</div>

<!-- ========================================================================= -->
<!-- MODALS SECTION                                                            -->
<!-- ========================================================================= -->

<!-- 1. Modal Pesan Sementara (Disappearing Messages) -->
<div class="modal-overlay" id="modalDisappearingOverlay" onclick="closeModal('modalDisappearing')"></div>
<div class="modal-panel wa-modal" id="modalDisappearing">
  <div class="modal-panel-header">
    <div class="modal-header-icon bg-teal">
      <span class="material-symbols-outlined">timer</span>
    </div>
    <div class="modal-header-text">
      <h3>Pesan Sementara</h3>
      <p class="modal-sub">Tingkatkan privasi &amp; hemat penyimpanan perangkat</p>
    </div>
    <button class="modal-close-btn" onclick="closeModal('modalDisappearing')">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
  <div class="modal-panel-body">
    <div class="disappearing-explainer">
      <p>Ketika diaktifkan, semua pesan baru dalam obrolan ini akan otomatis menghilang setelah durasi yang Anda pilih:</p>
      <ul>
        <li>Pesan menghilang untuk pengirim dan penerima.</li>
        <li>Siapapun dapat menyimpan pesan penting sebagai <strong>Pesan Berbintang</strong>.</li>
      </ul>
    </div>

    <div class="radio-group-modern">
      <label class="radio-card">
        <input type="radio" name="disappearingTimer" value="24h" onchange="selectDisappearingTimer('24h')">
        <div class="radio-card-content">
          <span class="radio-card-title">24 Jam</span>
          <span class="radio-card-sub">Pesan hilang setelah 1 hari</span>
        </div>
        <span class="radio-indicator"></span>
      </label>

      <label class="radio-card">
        <input type="radio" name="disappearingTimer" value="7d" onchange="selectDisappearingTimer('7d')">
        <div class="radio-card-content">
          <span class="radio-card-title">7 Hari</span>
          <span class="radio-card-sub">Pesan hilang setelah 1 minggu</span>
        </div>
        <span class="radio-indicator"></span>
      </label>

      <label class="radio-card">
        <input type="radio" name="disappearingTimer" value="90d" onchange="selectDisappearingTimer('90d')">
        <div class="radio-card-content">
          <span class="radio-card-title">90 Hari</span>
          <span class="radio-card-sub">Pesan hilang setelah 3 bulan</span>
        </div>
        <span class="radio-indicator"></span>
      </label>

      <label class="radio-card">
        <input type="radio" name="disappearingTimer" value="off" checked onchange="selectDisappearingTimer('off')">
        <div class="radio-card-content">
          <span class="radio-card-title">Mati (Nonaktif)</span>
          <span class="radio-card-sub">Pesan tersimpan selamanya</span>
        </div>
        <span class="radio-indicator"></span>
      </label>
    </div>
  </div>
  <div class="modal-panel-footer">
    <button type="button" class="btn btn-ghost" onclick="closeModal('modalDisappearing')">Batal</button>
    <button type="button" class="btn btn-primary" onclick="saveDisappearingSetting()">Simpan Pengaturan</button>
  </div>
</div>

<!-- 2. Modal Buat Daftar Kustom (Custom Lists Filter) -->
<div class="modal-overlay" id="modalCustomListOverlay" onclick="closeModal('modalCustomList')"></div>
<div class="modal-panel wa-modal" id="modalCustomList">
  <div class="modal-panel-header">
    <div class="modal-header-icon bg-purple">
      <span class="material-symbols-outlined">playlist_add</span>
    </div>
    <div class="modal-header-text">
      <h3>Buat Daftar Obrolan Baru</h3>
      <p class="modal-sub">Kelola dan kelompokkan obrolan sesuai kebutuhanmu</p>
    </div>
    <button class="modal-close-btn" onclick="closeModal('modalCustomList')">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
  <div class="modal-panel-body">
    <div class="sess-form-group">
      <label class="sess-label" for="customListName">Nama Daftar / Filter</label>
      <input class="sess-input" id="customListName" type="text" placeholder="cth. Kelompok Tugas Akhir, Teman Kampus" required>
    </div>
    <div class="sess-form-group">
      <label class="sess-label">Pilih Obrolan untuk Dimasukkan:</label>
      <div class="select-contacts-list" id="customListContactsPicker"></div>
    </div>
  </div>
  <div class="modal-panel-footer">
    <button type="button" class="btn btn-ghost" onclick="closeModal('modalCustomList')">Batal</button>
    <button type="button" class="btn btn-primary" onclick="saveCustomList()">Buat Daftar</button>
  </div>
</div>

<!-- 3. Modal Undang ke Grup via Tautan Link -->
<div class="modal-overlay" id="modalGroupInviteOverlay" onclick="closeModal('modalGroupInvite')"></div>
<div class="modal-panel wa-modal" id="modalGroupInvite">
  <div class="modal-panel-header">
    <div class="modal-header-icon bg-blue">
      <span class="material-symbols-outlined">link</span>
    </div>
    <div class="modal-header-text">
      <h3>Undang via Tautan Grup</h3>
      <p class="modal-sub">Bagikan tautan ini kepada teman sekelasmu</p>
    </div>
    <button class="modal-close-btn" onclick="closeModal('modalGroupInvite')">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
  <div class="modal-panel-body">
    <div class="invite-link-box">
      <span class="material-symbols-outlined">public</span>
      <input type="text" id="groupInviteLinkInput" readonly value="https://studymatch.test/join-group/calc3-indonesia" />
      <button class="btn btn-primary btn-sm" onclick="copyGroupInviteLink()">
        <span class="material-symbols-outlined" style="font-size:16px">content_copy</span> Salin
      </button>
    </div>
    <div class="invite-actions-list">
      <button class="invite-action-item" onclick="copyGroupInviteLink()">
        <span class="material-symbols-outlined">copy_all</span>
        <span>Salin Tautan Undangan</span>
      </button>
      <button class="invite-action-item" onclick="shareGroupLinkWhatsApp()">
        <span class="material-symbols-outlined">share</span>
        <span>Bagikan Tautan ke Aplikasi Lain</span>
      </button>
      <button class="invite-action-item text-danger" onclick="resetGroupInviteLink()">
        <span class="material-symbols-outlined">refresh</span>
        <span>Setel Ulang Tautan (Cabut Akses Lama)</span>
      </button>
    </div>
  </div>
</div>

<!-- 4. Modal Konfirmasi Tindakan Berbahaya (Confirm Action) -->
<div class="modal-overlay" id="modalConfirmOverlay" onclick="closeModal('modalConfirm')"></div>
<div class="modal-panel wa-modal modal-confirm" id="modalConfirm">
  <div class="modal-panel-header">
    <div class="modal-header-icon bg-red" id="confirmIcon">
      <span class="material-symbols-outlined">warning</span>
    </div>
    <div class="modal-header-text">
      <h3 id="confirmTitle">Konfirmasi Tindakan</h3>
      <p class="modal-sub" id="confirmSubtitle">Tindakan ini tidak dapat dibatalkan</p>
    </div>
    <button class="modal-close-btn" onclick="closeModal('modalConfirm')">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
  <div class="modal-panel-body">
    <p id="confirmMessageText">Apakah Anda yakin ingin melanjutkan tindakan ini?</p>
  </div>
  <div class="modal-panel-footer">
    <button type="button" class="btn btn-ghost" onclick="closeModal('modalConfirm')">Batal</button>
    <button type="button" class="btn btn-danger" id="btnConfirmExecute" onclick="executeConfirmedAction()">Lanjutkan</button>
  </div>
</div>

<!-- 5. Modal Laporkan Pengguna / Grup -->
<div class="modal-overlay" id="modalReportOverlay" onclick="closeModal('modalReport')"></div>
<div class="modal-panel wa-modal" id="modalReport">
  <div class="modal-panel-header">
    <div class="modal-header-icon bg-amber">
      <span class="material-symbols-outlined">flag</span>
    </div>
    <div class="modal-header-text">
      <h3>Laporkan ke StudyMatch</h3>
      <p class="modal-sub">Bantu kami menjaga lingkungan belajar yang aman</p>
    </div>
    <button class="modal-close-btn" onclick="closeModal('modalReport')">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
  <div class="modal-panel-body">
    <div class="sess-form-group">
      <label class="sess-label" for="reportReason">Alasan Laporan</label>
      <select class="sess-input" id="reportReason" required>
        <option value="">Pilih alasan pelanggaran…</option>
        <option value="spam">Spam atau Iklan Tidak Pantas</option>
        <option value="harassment">Pelecehan / Perilaku Tidak Menyenangkan</option>
        <option value="academic">Kecurangan Akademik / Joki</option>
        <option value="impersonation">Peniruan Identitas Mahasiswa</option>
        <option value="other">Alasan Lainnya</option>
      </select>
    </div>
    <div class="sess-form-group">
      <label class="sess-label" for="reportDetails">Detail Tambahan (Opsional)</label>
      <textarea class="sess-input" id="reportDetails" rows="3" placeholder="Jelaskan kronologi singkat atau bukti…"></textarea>
    </div>
  </div>
  <div class="modal-panel-footer">
    <button type="button" class="btn btn-ghost" onclick="closeModal('modalReport')">Batal</button>
    <button type="button" class="btn btn-danger" onclick="submitReport()">Kirim Laporan</button>
  </div>
</div>

<!-- 6. Modal Pesan Berbintang (Starred Messages Viewer) -->
<div class="modal-overlay" id="modalStarredOverlay" onclick="closeModal('modalStarred')"></div>
<div class="modal-panel wa-modal modal-lg" id="modalStarred">
  <div class="modal-panel-header">
    <div class="modal-header-icon bg-amber">
      <span class="material-symbols-outlined">star</span>
    </div>
    <div class="modal-header-text">
      <h3>Pesan Berbintang</h3>
      <p class="modal-sub">Koleksi catatan dan pesan penting yang Anda tandai</p>
    </div>
    <button class="modal-close-btn" onclick="closeModal('modalStarred')">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
  <div class="modal-panel-body">
    <div class="conv-search" style="margin-bottom: 1rem">
      <span class="material-symbols-outlined">search</span>
      <input type="text" id="starredSearchInput" placeholder="Cari dalam pesan berbintang…" oninput="filterStarredMessages(this.value)" />
    </div>
    <div class="starred-messages-list" id="starredMessagesContainer"></div>
  </div>
</div>

<!-- 7. Modal Galeri Media, Tautan & Dokumen -->
<div class="modal-overlay" id="modalMediaGalleryOverlay" onclick="closeModal('modalMediaGallery')"></div>
<div class="modal-panel wa-modal modal-lg" id="modalMediaGallery">
  <div class="modal-panel-header">
    <div class="modal-header-icon bg-blue">
      <span class="material-symbols-outlined">perm_media</span>
    </div>
    <div class="modal-header-text">
      <h3 style="font-size:1.1rem;font-weight:800;color:#0f172a;">Media, Tautan &amp; Dokumen</h3>
      <p class="modal-sub">Semua berkas materi dan tautan yang dibagikan dalam obrolan ini</p>
    </div>
    <button class="modal-close-btn" onclick="closeModal('modalMediaGallery')">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
  <div class="gallery-tabs-bar">
    <button class="gallery-tab-btn active" onclick="switchGalleryTab('media')" id="tabBtnMedia">Media (Foto/Video)</button>
    <button class="gallery-tab-btn" onclick="switchGalleryTab('docs')" id="tabBtnDocs">Dokumen</button>
    <button class="gallery-tab-btn" onclick="switchGalleryTab('links')" id="tabBtnLinks">Tautan Link</button>
  </div>
  <div class="modal-panel-body" style="padding:1.25rem; min-height: 240px; max-height: 420px; overflow-y: auto;">
    <div id="galleryTabContent"></div>
  </div>
</div>

<!-- 8. Modal Buat Grup Belajar Baru -->
<div class="modal-overlay" id="modalCreateGroupOverlay" onclick="closeModal('modalCreateGroup')"></div>
<div class="modal-panel wa-modal" id="modalCreateGroup">
  <div class="modal-panel-header">
    <div class="modal-header-icon bg-teal">
      <span class="material-symbols-outlined">group_add</span>
    </div>
    <div class="modal-header-text">
      <h3>Buat Grup Belajar Baru</h3>
      <p class="modal-sub">Mulai ruang belajar &amp; diskusi bersama teman</p>
    </div>
    <button class="modal-close-btn" onclick="closeModal('modalCreateGroup')">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
  <div class="modal-panel-body">
    <div class="sess-form-group">
      <label class="sess-label" for="newGroupName">Nama Grup Mata Kuliah / Belajar</label>
      <input class="sess-input" id="newGroupName" type="text" placeholder="cth. Kelompok Kalkulus III, Belajar Python" required>
    </div>
    <div class="sess-form-group">
      <label class="sess-label" for="newGroupDesc">Deskripsi Grup (Opsional)</label>
      <textarea class="sess-input" id="newGroupDesc" rows="2" placeholder="Jelaskan topik materi atau tujuan diskusi grup ini…"></textarea>
    </div>
    <div class="sess-form-group">
      <label class="sess-label">Pilih Teman Belajar untuk Ditambahkan:</label>
      <div class="select-contacts-list" id="createGroupMembersPicker"></div>
    </div>
  </div>
  <div class="modal-panel-footer">
    <button type="button" class="btn btn-ghost" onclick="closeModal('modalCreateGroup')">Batal</button>
    <button type="button" class="btn btn-primary" id="btnSubmitCreateGroup" onclick="submitCreateGroup()">Buat Grup</button>
  </div>
</div>

<!-- 9. Modal Simulasi Panggilan Suara / Video -->
<div class="modal-overlay" id="modalCallOverlay" onclick="closeModal('modalCall')"></div>
<div class="modal-panel wa-modal modal-call" id="modalCall" style="max-width:360px; text-align:center; padding:2rem 1.5rem;">
  <div class="call-modal-body">
    <div class="call-avatar-wrap" style="width:96px; height:96px; margin:0 auto 1.25rem; border-radius:50%; overflow:hidden; border:3px solid #6366f1; box-shadow:0 10px 25px rgba(99,102,241,0.25);">
      <img id="callAvatar" src="" alt="" style="width:100%; height:100%; object-fit:cover;" />
    </div>
    <h3 id="callName" style="font-size:1.25rem; font-weight:800; color:#0f172a; margin-bottom:0.35rem;">Nama Kontak</h3>
    <p id="callStatus" style="font-size:0.875rem; color:#64748b; margin-bottom:2rem;">Menghubungkan…</p>
    
    <div class="call-action-btns" style="display:flex; justify-content:center; gap:1rem;">
      <button class="btn btn-icon-only" id="btnCallMute" onclick="toggleCallMute()" title="Bisukan Mikrofon" style="width:48px; height:48px; border-radius:50%; background:#334155; color:#fff;">
        <span class="material-symbols-outlined">mic_off</span>
      </button>
      <button class="btn btn-icon-only" id="btnCallSpeaker" onclick="toggleCallSpeaker()" title="Speaker" style="width:48px; height:48px; border-radius:50%; background:#334155; color:#fff;">
        <span class="material-symbols-outlined">volume_up</span>
      </button>
      <button class="btn btn-icon-only" onclick="endCall()" title="Akhiri Panggilan" style="width:48px; height:48px; border-radius:50%; background:#ef4444; color:#fff; box-shadow:0 4px 12px rgba(239,68,68,0.4);">
        <span class="material-symbols-outlined">call_end</span>
      </button>
    </div>
  </div>
</div>

<!-- 10. Modal Ubah Nama Grup -->
<div class="modal-overlay" id="modalEditGroupNameOverlay" onclick="closeModal('modalEditGroupName')"></div>
<div class="modal-panel wa-modal modal-confirm" id="modalEditGroupName">
  <div class="modal-panel-header">
    <div class="modal-header-icon bg-teal">
      <span class="material-symbols-outlined">edit</span>
    </div>
    <div class="modal-header-text">
      <h3>Ubah Nama Grup</h3>
      <p class="modal-sub">Gunakan nama yang mudah dikenali oleh anggota</p>
    </div>
    <button class="modal-close-btn" onclick="closeModal('modalEditGroupName')">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
  <div class="modal-panel-body">
    <div class="sess-form-group" style="margin-bottom:0;">
      <label class="sess-label" for="inputEditGroupName">Nama Grup Belajar</label>
      <input class="sess-input" id="inputEditGroupName" type="text" placeholder="Masukkan nama grup baru…" maxlength="100" required />
    </div>
  </div>
  <div class="modal-panel-footer">
    <button type="button" class="btn btn-ghost" onclick="closeModal('modalEditGroupName')">Batal</button>
    <button type="button" class="btn btn-primary" id="btnSaveGroupName" onclick="submitEditGroupName()">Simpan Perubahan</button>
  </div>
</div>

<!-- 11. Modal Ubah Deskripsi Grup -->
<div class="modal-overlay" id="modalEditGroupDescOverlay" onclick="closeModal('modalEditGroupDesc')"></div>
<div class="modal-panel wa-modal" id="modalEditGroupDesc">
  <div class="modal-panel-header">
    <div class="modal-header-icon bg-blue">
      <span class="material-symbols-outlined">description</span>
    </div>
    <div class="modal-header-text">
      <h3>Ubah Deskripsi Grup</h3>
      <p class="modal-sub">Jelaskan topik materi atau jadwal belajar bersama</p>
    </div>
    <button class="modal-close-btn" onclick="closeModal('modalEditGroupDesc')">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
  <div class="modal-panel-body">
    <div class="sess-form-group" style="margin-bottom:0;">
      <label class="sess-label" for="inputEditGroupDesc">Deskripsi / Catatan Diskusi</label>
      <textarea class="sess-input" id="inputEditGroupDesc" rows="4" placeholder="Tuliskan deskripsi grup belajar di sini…" maxlength="500"></textarea>
    </div>
  </div>
  <div class="modal-panel-footer">
    <button type="button" class="btn btn-ghost" onclick="closeModal('modalEditGroupDesc')">Batal</button>
    <button type="button" class="btn btn-primary" id="btnSaveGroupDesc" onclick="submitEditGroupDesc()">Simpan Deskripsi</button>
  </div>
</div>

@endsection