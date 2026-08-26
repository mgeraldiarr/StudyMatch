/* ─── StudyMatch WhatsApp Web Interactive Chat Engine ─── */

function getCsrfToken() {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
}

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ─── State Management ─── */
let CONVERSATIONS = window.__INITIAL_CONVERSATIONS__ || [];
let MESSAGES = [];
let activeConvId = CONVERSATIONS.length > 0 ? CONVERSATIONS[0].id : null;
let currentFilter = "all";
let filterQ = "";
let pendingActionCallback = null;
let callTimerInterval = null;
let callSeconds = 0;

// Persistent or in-memory settings
let STARRED_MESSAGES = JSON.parse(localStorage.getItem("sm_starred_msgs") || "[]");
let FAVORITES = JSON.parse(localStorage.getItem("sm_fav_convs") || "[]");
let MUTED_CONVS = JSON.parse(localStorage.getItem("sm_muted_convs") || "[]");
let DISAPPEARING_SETTINGS = JSON.parse(localStorage.getItem("sm_disappearing") || "{}");
let CUSTOM_LISTS = JSON.parse(localStorage.getItem("sm_custom_lists") || "[]");

/* ─── Helper Toast Notification ─── */
function showToast(msg, type = "info") {
  if (window.toast) {
    window.toast(msg, type);
  } else {
    alert(msg);
  }
}

/* ─── Render Conversations (Left Sidebar) ─── */
function renderConvs() {
  const list = document.getElementById("convList");
  if (!list) return;

  const q = filterQ.toLowerCase();

  let filtered = CONVERSATIONS.filter((c) => {
    // Search query filter
    const matchSearch =
      !q ||
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.lastMsg && c.lastMsg.toLowerCase().includes(q));

    if (!matchSearch) return false;

    // Quick filter chips
    if (currentFilter === "unread") {
      return c.unread && c.unread > 0;
    }
    if (currentFilter === "favorite") {
      return FAVORITES.includes(String(c.id));
    }
    if (currentFilter === "group") {
      return c.type === "group";
    }
    if (currentFilter.startsWith("custom_")) {
      const listId = currentFilter.replace("custom_", "");
      const customList = CUSTOM_LISTS.find((l) => l.id === listId);
      return customList ? customList.contactIds.includes(String(c.id)) : true;
    }

    return true;
  });

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="conv-empty" style="padding: 2.5rem 1rem; text-align: center; color: var(--text-muted);">
        <span class="material-symbols-outlined" style="font-size: 2.5rem; opacity: 0.4; margin-bottom: 0.5rem;">search_off</span>
        <p style="font-size: 0.875rem; font-weight: 600;">Tidak ada percakapan ditemukan</p>
        <span style="font-size: 0.75rem; opacity: 0.7;">Coba ubah kata kunci atau filter pencarian</span>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map((c) => buildConvItem(c)).join("");
}

function buildConvItem(c) {
  const escapedName = escapeHtml(c.name);
  const escapedLastMsg = escapeHtml(c.lastMsg || "Belum ada pesan");
  const escapedTime = escapeHtml(c.time || "Baru saja");
  const isActive = String(c.id) === String(activeConvId);
  const isMuted = MUTED_CONVS.includes(String(c.id));
  const isFav = FAVORITES.includes(String(c.id));

  const isSentByMe = c.lastMsg && !c.lastMsg.startsWith("Belum") && (c.lastMsg.startsWith("Me:") || c.lastMsgByMe);

  return `
    <div class="conv-item${isActive ? " active" : ""}" onclick="selectConv('${c.id}')">
      ${
        c.type === "group"
          ? `<div class="conv-av-icon ${c.color || "purple"}"><span class="material-symbols-outlined">${c.icon || "groups"}</span></div>`
          : `<div class="conv-av"><img src="${escapeHtml(c.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28")}" alt="${escapedName}" /></div>`
      }
      <div class="conv-info">
        <div class="conv-top-row">
          <span class="conv-name">${escapedName}</span>
          <span class="conv-time">${escapedTime}</span>
        </div>
        <div class="conv-bottom-row">
          <span class="conv-msg">
            ${isSentByMe ? '<span class="material-symbols-outlined conv-check-icon">done_all</span>' : ""}
            ${escapedLastMsg}
          </span>
          <div style="display:flex;align-items:center;gap:4px;">
            ${isMuted ? '<span class="material-symbols-outlined" style="font-size:14px;color:#94a3b8">volume_off</span>' : ""}
            ${isFav ? '<span class="material-symbols-outlined" style="font-size:14px;color:#f59e0b">star</span>' : ""}
            ${c.unread ? `<span class="unread-badge">${c.unread}</span>` : ""}
          </div>
        </div>
      </div>
    </div>`;
}

/* ─── Filter Tabs Logic ─── */
function setChatFilter(filterName) {
  currentFilter = filterName;

  document.querySelectorAll(".conv-filter-chips .filter-chip").forEach((chip) => {
    // Also remove active from more dropdown if needed, though they don't have .filter-chip on items
    if (chip.getAttribute("data-filter") === filterName || (chip.innerHTML.includes('Lainnya') && filterName.startsWith('custom_') && !document.querySelector(`.filter-chip[data-filter="${filterName}"]`))) {
      chip.classList.add("active");
    } else {
      chip.classList.remove("active");
    }
  });

  renderConvs();
}

function renderCustomListChips() {
  const container = document.getElementById("filterChips");
  if (!container) return;

  // Hapus chip kustom sebelumnya jika ada
  const existingCustom = container.querySelectorAll('.filter-chip.custom-list-chip');
  existingCustom.forEach(el => el.remove());
  
  // Hapus tombol 'Lainnya' jika ada
  const existingMore = container.querySelector('.filter-chip-more');
  if (existingMore) existingMore.remove();

  const addBtn = container.querySelector('.chip-add');

  let chipsToShow = CUSTOM_LISTS;
  let hasMore = false;
  
  if (CUSTOM_LISTS.length > 3) {
    chipsToShow = CUSTOM_LISTS.slice(0, 3);
    hasMore = true;
  }

  // Tambahkan maksimal 3 daftar
  chipsToShow.forEach(list => {
    const btn = document.createElement("button");
    btn.className = "filter-chip custom-list-chip";
    btn.dataset.filter = "custom_" + list.id;
    btn.textContent = list.name;
    btn.onclick = () => setChatFilter("custom_" + list.id);
    if (addBtn) {
      container.insertBefore(btn, addBtn);
    } else {
      container.appendChild(btn);
    }
  });

  // Jika lebih dari 3, tambahkan tombol "Lainnya"
  if (hasMore) {
    const moreWrap = document.createElement("div");
    moreWrap.className = "filter-chip-more";
    moreWrap.style.position = "relative";
    moreWrap.style.display = "inline-block";

    const moreBtn = document.createElement("button");
    moreBtn.className = "filter-chip";
    moreBtn.innerHTML = `Lainnya <span class="material-symbols-outlined" style="font-size:14px; margin-left:4px;">expand_more</span>`;
    moreBtn.onclick = () => toggleFilterDropdown();
    moreWrap.appendChild(moreBtn);

    const dropdown = document.createElement("div");
    dropdown.className = "filter-dropdown-menu";
    dropdown.style.display = "none";
    dropdown.style.position = "absolute";
    dropdown.style.top = "100%";
    dropdown.style.left = "0";
    dropdown.style.background = "#fff";
    dropdown.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)";
    dropdown.style.borderRadius = "8px";
    dropdown.style.padding = "0.5rem";
    dropdown.style.zIndex = "100";
    dropdown.style.minWidth = "120px";
    dropdown.style.marginTop = "0.5rem";
    dropdown.id = "filterDropdownMenu";

    const remainingLists = CUSTOM_LISTS.slice(3);
    remainingLists.forEach(list => {
      const dropBtn = document.createElement("button");
      dropBtn.style.display = "block";
      dropBtn.style.width = "100%";
      dropBtn.style.textAlign = "left";
      dropBtn.style.padding = "0.5rem";
      dropBtn.style.border = "none";
      dropBtn.style.background = "none";
      dropBtn.style.borderRadius = "4px";
      dropBtn.style.cursor = "pointer";
      dropBtn.style.fontSize = "0.85rem";
      dropBtn.textContent = list.name;
      dropBtn.onmouseover = () => dropBtn.style.background = "#f1f5f9";
      dropBtn.onmouseout = () => dropBtn.style.background = "none";
      dropBtn.onclick = () => {
        setChatFilter("custom_" + list.id);
        toggleFilterDropdown();
      };
      dropdown.appendChild(dropBtn);
    });

    moreWrap.appendChild(dropdown);

    if (addBtn) {
      container.insertBefore(moreWrap, addBtn);
    } else {
      container.appendChild(moreWrap);
    }
  }
}

function toggleFilterDropdown() {
  const menu = document.getElementById("filterDropdownMenu");
  if (menu) {
    menu.style.display = menu.style.display === "none" ? "block" : "none";
  }
}

function closeFilterDropdown(e) {
  const menu = document.getElementById("filterDropdownMenu");
  if (menu && !e.target.closest('.filter-chip-more')) {
    menu.style.display = "none";
  }
}
document.addEventListener("click", closeFilterDropdown);

function filterConvs(q) {
  filterQ = q;
  const clearBtn = document.getElementById("clearSearchBtn");
  if (clearBtn) {
    clearBtn.style.display = q ? "flex" : "none";
  }
  renderConvs();
}

function clearSearch() {
  const input = document.getElementById("convSearchInput");
  if (input) input.value = "";
  filterConvs("");
}

/* ─── Render Messages (WhatsApp Style Speech Bubbles) ─── */
function renderMsgs() {
  const area = document.getElementById("msgsArea");
  if (!area) return;

  const conv = CONVERSATIONS.find((c) => String(c.id) === String(activeConvId));

  if (!conv) {
    area.innerHTML = `
      <div class="empty-state">
        <span class="material-symbols-outlined empty-icon">chat</span>
        <h3 class="empty-title">StudyMatch Messenger</h3>
        <p class="empty-desc">Pilih salah satu teman belajar atau grup mata kuliah di sebelah kiri untuk memulai obrolan.</p>
        <div class="encryption-badge">
          <span class="material-symbols-outlined">lock</span>
          Pesan terenkripsi dan aman dalam lingkungan akademik StudyMatch
        </div>
      </div>`;
    return;
  }

  if (MESSAGES.length === 0) {
    area.innerHTML = `
      <div class="date-sep"><span class="date-sep-pill">Hari ini</span></div>
      <div class="empty-state" style="padding: 2.5rem 1rem;">
        <span class="material-symbols-outlined" style="font-size: 3rem; color: #00a884; margin-bottom: 0.75rem;">waving_hand</span>
        <h4 style="font-weight: 700; color: #0f172a; margin-bottom: 0.25rem;">Mulai Percakapan</h4>
        <p style="font-size: 0.85rem; color: #64748b; max-width: 320px;">Kirim pesan pertama untuk mendiskusikan tugas, jadwal belajar, atau bertukar materi kuliah.</p>
      </div>`;
    return;
  }

  let html = `<div class="date-sep"><span class="date-sep-pill">Riwayat Pesan</span></div>`;

  // Disappearing messages notice if active
  const disappearingTimer = DISAPPEARING_SETTINGS[String(conv.id)];
  if (disappearingTimer && disappearingTimer !== "off") {
    html += `
      <div style="display:flex;justify-content:center;margin-bottom:0.75rem;">
        <div style="background:rgba(254,243,199,0.9);color:#92400e;font-size:0.75rem;padding:0.35rem 0.85rem;border-radius:9999px;display:flex;align-items:center;gap:4px;box-shadow:0 1px 2px rgba(0,0,0,0.05);">
          <span class="material-symbols-outlined" style="font-size:14px">timer</span>
          Pesan sementara aktif (${disappearingTimer}). Pesan baru akan otomatis menghilang.
        </div>
      </div>`;
  }

  MESSAGES.forEach((m, idx) => {
    const isSent = m.type === "sent" || String(m.sender_id) === String(window.__AUTH_USER_ID__);
    const escapedText = escapeHtml(m.text || m.message || "");
    const escapedTime = escapeHtml(m.time || "12:00");
    const escapedSenderName = escapeHtml(m.sender_name || (m.sender ? m.sender.name : ""));
    const isStarred = STARRED_MESSAGES.some((s) => s.id === (m.id || idx));

    html += `
      <div class="msg-group ${isSent ? "sent" : "recv"}">
        ${
          !isSent && conv.type === "group"
            ? `<div class="msg-av"><img src="${escapeHtml(m.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28")}" alt="" /></div>`
            : ""
        }
        <div class="msg-bubble-wrap">
          <div class="msg-bubble">
            ${!isSent && conv.type === "group" && escapedSenderName ? `<span class="sender-tag">${escapedSenderName}</span>` : ""}
            ${escapedText}
            <div class="msg-meta-row">
              ${isStarred ? '<span class="material-symbols-outlined msg-star-icon">star</span>' : ""}
              <span>${escapedTime}</span>
              ${isSent ? '<span class="material-symbols-outlined msg-check-icon">done_all</span>' : ""}
            </div>
          </div>
          <div class="msg-actions-dropdown">
            <button class="msg-drop-btn" onclick="toggleStarMessage(${m.id || idx}, '${escapedText.replace(/'/g, "\\'")}', '${escapedSenderName || (isSent ? "Saya" : conv.name)}', '${escapedTime}')" title="${isStarred ? "Hapus Bintang" : "Beri Bintang"}">
              <span class="material-symbols-outlined">${isStarred ? "star_half" : "star"}</span>
            </button>
          </div>
        </div>
      </div>`;
  });

  area.innerHTML = html;
  area.scrollTop = area.scrollHeight;
}

/* ─── Select Conversation ─── */
async function selectConv(id) {
  activeConvId = id;
  renderConvs();

  const conv = CONVERSATIONS.find((c) => String(c.id) === String(id));
  if (!conv) return;

  const nameEl = document.getElementById("chatHdrName");
  const statusEl = document.getElementById("chatHdrStatus");
  const avImg = document.getElementById("chatHdrAvatar");
  const onlineDot = document.getElementById("chatHdrOnlineDot");

  if (nameEl) nameEl.textContent = conv.name;

  if (conv.type === "group") {
    if (statusEl) statusEl.innerHTML = `<span class="status-subtitle">${conv.online || 0} anggota • klik untuk info grup</span>`;
    if (avImg) avImg.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ-VR5XHbtoZrw07_xJp2dOibXlKV1ph4v9h0Ep25o519mGHSP3fYqdoizVuDhH1jDnG0V8QU1BxK_MY1FPunfb7_8DxkYiVzJKe5EyzCLekGkXYCghAQmKjovo71T9ofCZ7Q-P3k2wp1zMtJIvVPWXKM5xG2_Nonug38Ihs4xm_Xh_lG8GY0s8NlEnZDYV_g7zEw0kMX8j0WI_dB6DpyF0hSp26wJXD4LDoTy6z-NL_Ha689QKQM_H5ZD4LwdHFq-rv3Kk7qTzZ0";
    if (onlineDot) onlineDot.classList.remove("active");

    try {
      const res = await fetch(`/chat/group-messages/${conv.target_id}`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        MESSAGES = data.messages || [];
        renderMsgs();
      }
    } catch (err) {
      console.error("Gagal memuat pesan grup:", err);
    }
  } else {
    const isOnline = conv.online;
    if (statusEl) {
      statusEl.innerHTML = isOnline
        ? `<span class="status-dot"></span>Online • klik untuk info kontak`
        : `<span class="status-subtitle">Terakhir dilihat hari ini • klik info kontak</span>`;
    }
    if (avImg) avImg.src = conv.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28";
    if (onlineDot) {
      if (isOnline) onlineDot.classList.add("active");
      else onlineDot.classList.remove("active");
    }

    try {
      const res = await fetch(`/chat/messages/${conv.target_id}`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        MESSAGES = data.messages || [];
        renderMsgs();
      }
    } catch (err) {
      console.error("Gagal memuat pesan DM:", err);
    }
  }

  // Auto update info drawer if already open
  const drawer = document.getElementById("infoDrawer");
  if (drawer && drawer.classList.contains("open")) {
    renderInfoContent(conv);
  }
}

/* ─── Send Message ─── */
async function sendMessage() {
  const ta = document.getElementById("inputMsg");
  if (!ta) return;
  const msg = ta.value.trim();
  if (!msg) return;

  const conv = CONVERSATIONS.find((c) => String(c.id) === String(activeConvId));
  if (!conv) {
    showToast("Pilih percakapan terlebih dahulu.", "info");
    return;
  }

  const sendBtn = document.getElementById("sendBtn");
  if (sendBtn) sendBtn.disabled = true;

  const endpoint =
    conv.type === "group"
      ? `/chat/group-messages/${conv.target_id}`
      : `/chat/messages/${conv.target_id}`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
      body: JSON.stringify({ message: msg }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      MESSAGES.push(data.data);
      conv.lastMsg = msg;
      conv.lastMsgByMe = true;
      conv.time = "Baru saja";
      renderMsgs();
      renderConvs();
      ta.value = "";
      ta.style.height = "auto";
    } else {
      showToast(data.message || "Gagal mengirim pesan.", "error");
    }
  } catch (err) {
    showToast("Terjadi kesalahan jaringan saat mengirim pesan.", "error");
  } finally {
    if (sendBtn) sendBtn.disabled = false;
  }
}

/* ─── Starred Messages ─── */
function toggleStarMessage(id, text, sender, time) {
  const existingIdx = STARRED_MESSAGES.findIndex((s) => s.id === id);
  if (existingIdx >= 0) {
    STARRED_MESSAGES.splice(existingIdx, 1);
    showToast("Bintang dihapus dari pesan.", "info");
  } else {
    STARRED_MESSAGES.push({
      id,
      text,
      sender,
      time,
      convId: activeConvId,
    });
    showToast("Pesan ditandai sebagai berbintang! ⭐", "success");
  }
  localStorage.setItem("sm_starred_msgs", JSON.stringify(STARRED_MESSAGES));
  renderMsgs();
}

function openStarredMessagesModal() {
  const container = document.getElementById("starredMessagesContainer");
  if (!container) return;

  filterStarredMessages("");
  openModal("modalStarred");
}

function filterStarredMessages(q) {
  const container = document.getElementById("starredMessagesContainer");
  if (!container) return;

  const query = (q || "").toLowerCase();
  const filtered = STARRED_MESSAGES.filter(
    (s) =>
      s.text.toLowerCase().includes(query) ||
      s.sender.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:2.5rem 1rem;color:#64748b;">
        <span class="material-symbols-outlined" style="font-size:2.5rem;color:#f59e0b;margin-bottom:0.5rem;">star_border</span>
        <p style="font-weight:600;">Belum ada pesan berbintang</p>
        <span style="font-size:0.75rem;">Arahkan kursor ke pesan dalam chat dan klik ikon bintang untuk menyimpan catatan penting.</span>
      </div>`;
    return;
  }

  container.innerHTML = filtered
    .map(
      (s) => `
      <div class="starred-msg-card">
        <div>
          <div class="starred-msg-sender">${escapeHtml(s.sender)}</div>
          <div class="starred-msg-body">${escapeHtml(s.text)}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
          <span class="starred-msg-time">${escapeHtml(s.time)}</span>
          <button class="btn btn-icon-only btn-ghost" style="width:24px;height:24px;" onclick="toggleStarMessage(${s.id}); filterStarredMessages('${query}');" title="Hapus Bintang">
            <span class="material-symbols-outlined" style="font-size:16px;color:#f59e0b;">star</span>
          </button>
        </div>
      </div>`
    )
    .join("");
}

/* ─── WhatsApp Right Info Drawer (Slide-In) ─── */
function openInfoDrawer() {
  const conv = CONVERSATIONS.find((c) => String(c.id) === String(activeConvId));
  if (!conv) return;

  renderInfoContent(conv);

  const drawer = document.getElementById("infoDrawer");
  const overlay = document.getElementById("drawerOverlay");
  if (drawer) drawer.classList.add("open");
  if (overlay) overlay.classList.add("show");
}

function closeInfoDrawer() {
  const drawer = document.getElementById("infoDrawer");
  const overlay = document.getElementById("drawerOverlay");
  if (drawer) drawer.classList.remove("open");
  if (overlay) overlay.classList.remove("show");
}

function renderInfoContent(conv) {
  const body = document.getElementById("infoDrawerBody");
  const title = document.getElementById("infoDrawerTitle");
  if (!body) return;

  if (conv.type === "group") {
    if (title) title.textContent = "Info Grup Mata Kuliah";
    body.innerHTML = buildGroupInfoHTML(conv);
  } else {
    if (title) title.textContent = "Info Kontak Mahasiswa";
    body.innerHTML = buildContactInfoHTML(conv);
  }
}

/* ─── HTML Builder for 1-on-1 Contact Info ─── */
function buildContactInfoHTML(conv) {
  const isMuted = MUTED_CONVS.includes(String(conv.id));
  const isFav = FAVORITES.includes(String(conv.id));
  const disappearingTimer = DISAPPEARING_SETTINGS[String(conv.id)] || "off";
  const timerLabel =
    disappearingTimer === "24h"
      ? "24 Jam"
      : disappearingTimer === "7d"
      ? "7 Hari"
      : disappearingTimer === "90d"
      ? "90 Hari"
      : "Mati";

  return `
    <!-- 1. Profile Hero Section -->
    <div class="info-card-section info-profile-hero">
      <div class="info-avatar-large">
        <img src="${escapeHtml(conv.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28")}" alt="${escapeHtml(conv.name)}" />
      </div>
      <h3 class="info-user-name">${escapeHtml(conv.name)}</h3>
      <p class="info-user-sub">${escapeHtml(conv.university || "Universitas Indonesia • Ilmu Komputer")}</p>
      <span style="font-size:0.75rem;color:#059669;margin-top:2px;font-weight:600;">${conv.online ? "● Sedang Aktif" : "Terakhir aktif hari ini"}</span>

      <!-- Action Grid -->
      <div class="info-action-grid">
        <button class="info-action-btn" onclick="startVoiceCall()">
          <span class="material-symbols-outlined">call</span>
          <span>Audio</span>
        </button>
        <button class="info-action-btn" onclick="startVideoCall()">
          <span class="material-symbols-outlined">videocam</span>
          <span>Video</span>
        </button>
        <button class="info-action-btn" onclick="toggleInChatSearch()">
          <span class="material-symbols-outlined">search</span>
          <span>Cari</span>
        </button>
        <button class="info-action-btn" onclick="toggleFavorite('${conv.id}')">
          <span class="material-symbols-outlined" style="color:${isFav ? "#f59e0b" : "inherit"}">${isFav ? "star" : "star_border"}</span>
          <span>Favorit</span>
        </button>
      </div>
    </div>

    <!-- 2. Academic Bio & Campus Details -->
    <div class="info-card-section">
      <div class="info-row-item" style="cursor:default;">
        <div class="info-row-left">
          <span class="material-symbols-outlined info-row-icon">school</span>
          <div class="info-row-text">
            <span class="info-row-title">Gaya &amp; Minat Belajar</span>
            <span class="info-row-sub">${escapeHtml(conv.learning_style || "Visual &amp; Problem Solving • Siap diskusi tugas")}</span>
          </div>
        </div>
      </div>
      <div class="info-row-item" style="cursor:default;">
        <div class="info-row-left">
          <span class="material-symbols-outlined info-row-icon">mail</span>
          <div class="info-row-text">
            <span class="info-row-title">Email Kampus Terverifikasi</span>
            <span class="info-row-sub">${escapeHtml(conv.email || "mahasiswa@ui.ac.id")}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Shared Media, Links & Docs -->
    <div class="info-card-section">
      <div class="info-row-item" onclick="showToast('Menampilkan seluruh galeri media & dokumen...')">
        <div class="info-row-left">
          <span class="material-symbols-outlined info-row-icon">perm_media</span>
          <div class="info-row-text">
            <span class="info-row-title">Media, Tautan &amp; Dokumen</span>
            <span class="info-row-sub">12 File Materi Bersama</span>
          </div>
        </div>
        <div class="info-row-right">
          <span class="material-symbols-outlined">chevron_right</span>
        </div>
      </div>
      <div class="media-preview-grid">
        <div class="media-thumb" onclick="showToast('Membuka PDF Catatan Kalkulus.pdf')">
          <div style="width:100%;height:100%;background:#e0e7ff;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#4338ca;font-size:0.7rem;font-weight:700;">
            <span class="material-symbols-outlined">description</span>PDF
          </div>
        </div>
        <div class="media-thumb" onclick="showToast('Membuka Gambar Slide 4.png')">
          <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&auto=format&fit=crop&q=60" alt="slide" />
        </div>
        <div class="media-thumb" onclick="showToast('Membuka Ringkasan Pertemuan.docx')">
          <div style="width:100%;height:100%;background:#ccfbf1;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#0f766e;font-size:0.7rem;font-weight:700;">
            <span class="material-symbols-outlined">article</span>DOCX
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Privacy & Notifications Settings -->
    <div class="info-card-section">
      <div class="info-row-item" onclick="openStarredMessagesModal()">
        <div class="info-row-left">
          <span class="material-symbols-outlined info-row-icon" style="color:#f59e0b;">star</span>
          <div class="info-row-text">
            <span class="info-row-title">Pesan Berbintang</span>
            <span class="info-row-sub">${STARRED_MESSAGES.filter((s) => s.convId === activeConvId).length} Catatan tersimpan</span>
          </div>
        </div>
        <div class="info-row-right">
          <span class="material-symbols-outlined">chevron_right</span>
        </div>
      </div>

      <div class="info-row-item">
        <div class="info-row-left">
          <span class="material-symbols-outlined info-row-icon">notifications</span>
          <div class="info-row-text">
            <span class="info-row-title">Bisukan Notifikasi</span>
            <span class="info-row-sub">Senyapkan getar &amp; suara pesan</span>
          </div>
        </div>
        <div class="info-row-right">
          <label class="switch">
            <input type="checkbox" ${isMuted ? "checked" : ""} onchange="toggleMute('${conv.id}')">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <div class="info-row-item" onclick="openDisappearingModal()">
        <div class="info-row-left">
          <span class="material-symbols-outlined info-row-icon" style="color:#0d9488;">timer</span>
          <div class="info-row-text">
            <span class="info-row-title">Pesan Sementara</span>
            <span class="info-row-sub">${timerLabel}</span>
          </div>
        </div>
        <div class="info-row-right">
          <span class="material-symbols-outlined">chevron_right</span>
        </div>
      </div>
    </div>

    <!-- 5. Common Shared Groups -->
    <div class="info-card-section">
      <span style="font-size:0.75rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;display:block;margin-bottom:0.5rem;">Grup yang Sama (2)</span>
      <div class="info-row-item" onclick="showToast('Beralih ke grup Kalkulus III...')">
        <div class="info-row-left">
          <div class="conv-av-icon purple" style="width:2.2rem;height:2.2rem;"><span class="material-symbols-outlined" style="font-size:16px;">calculate</span></div>
          <div class="info-row-text">
            <span class="info-row-title">Kalkulus III</span>
            <span class="info-row-sub">42 Mahasiswa terdaftar</span>
          </div>
        </div>
      </div>
      <div class="info-row-item" onclick="showToast('Beralih ke grup Algoritma & Pemrograman...')">
        <div class="info-row-left">
          <div class="conv-av-icon teal" style="width:2.2rem;height:2.2rem;"><span class="material-symbols-outlined" style="font-size:16px;">code</span></div>
          <div class="info-row-text">
            <span class="info-row-title">Algoritma &amp; Pemrograman</span>
            <span class="info-row-sub">38 Mahasiswa terdaftar</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. Danger & Privacy Action Zone -->
    <div class="info-card-section">
      <button class="danger-btn-row" onclick="confirmAction('clear_chat')">
        <span class="material-symbols-outlined">delete_sweep</span>
        <span>Bersihkan Riwayat Obrolan</span>
      </button>
      <button class="danger-btn-row" onclick="confirmAction('block_user')">
        <span class="material-symbols-outlined">block</span>
        <span>Blokir ${escapeHtml(conv.name)}</span>
      </button>
      <button class="danger-btn-row" onclick="openReportModal('user')">
        <span class="material-symbols-outlined">flag</span>
        <span>Laporkan Mahasiswa ke StudyMatch</span>
      </button>
      <button class="danger-btn-row" onclick="confirmAction('delete_contact')">
        <span class="material-symbols-outlined">person_remove</span>
        <span>Hapus dari Teman Belajar</span>
      </button>
    </div>`;
}

/* ─── HTML Builder for Group / Course Info ─── */
function buildGroupInfoHTML(conv) {
  const isMuted = MUTED_CONVS.includes(String(conv.id));
  const isFav = FAVORITES.includes(String(conv.id));
  const disappearingTimer = DISAPPEARING_SETTINGS[String(conv.id)] || "off";
  const timerLabel =
    disappearingTimer === "24h"
      ? "24 Jam"
      : disappearingTimer === "7d"
      ? "7 Hari"
      : disappearingTimer === "90d"
      ? "90 Hari"
      : "Mati";

  return `
    <!-- 1. Group Profile Hero -->
    <div class="info-card-section info-profile-hero">
      <div class="info-avatar-large">
        <div style="width:100%;height:100%;background:#e0e7ff;color:#4338ca;display:flex;align-items:center;justify-content:center;font-size:2.5rem;">
          <span class="material-symbols-outlined" style="font-size:3.5rem;">groups</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <h3 class="info-user-name">${escapeHtml(conv.name)}</h3>
        <button class="btn btn-icon-only btn-ghost" style="width:28px;height:28px;" onclick="editGroupName()" title="Edit Nama Grup">
          <span class="material-symbols-outlined" style="font-size:16px;">edit</span>
        </button>
      </div>
      <p class="info-user-sub">Grup Resmi Mata Kuliah • ${conv.online || 28} Mahasiswa</p>

      <!-- Action Grid -->
      <div class="info-action-grid">
        <button class="info-action-btn" onclick="startVoiceCall()">
          <span class="material-symbols-outlined">call</span>
          <span>Audio</span>
        </button>
        <button class="info-action-btn" onclick="startVideoCall()">
          <span class="material-symbols-outlined">videocam</span>
          <span>Video</span>
        </button>
        <button class="info-action-btn" onclick="openModal('modalGroupInvite')">
          <span class="material-symbols-outlined">person_add</span>
          <span>Undang</span>
        </button>
        <button class="info-action-btn" onclick="toggleInChatSearch()">
          <span class="material-symbols-outlined">search</span>
          <span>Cari</span>
        </button>
      </div>
    </div>

    <!-- 2. Group Description & Syllabus Link -->
    <div class="info-card-section">
      <div class="info-row-item" onclick="editGroupDescription()">
        <div class="info-row-left">
          <span class="material-symbols-outlined info-row-icon">info</span>
          <div class="info-row-text">
            <span class="info-row-title">Deskripsi Mata Kuliah <span class="material-symbols-outlined" style="font-size:12px;margin-left:4px;">edit</span></span>
            <span class="info-row-sub">${escapeHtml(conv.description || "Forum diskusi materi kuliah, koordinasi tugas kelompok, dan sesi belajar bersama.")}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Shared Media, Links & Docs -->
    <div class="info-card-section">
      <div class="info-row-item" onclick="openMediaGalleryModal()">
        <div class="info-row-left">
          <span class="material-symbols-outlined info-row-icon">perm_media</span>
          <div class="info-row-text">
            <span class="info-row-title">Media, Tautan &amp; Dokumen</span>
            <span class="info-row-sub">Lihat Berkas Kelas</span>
          </div>
        </div>
        <div class="info-row-right">
          <span class="material-symbols-outlined">chevron_right</span>
        </div>
      </div>
    </div>

    <!-- 4. Group Settings -->
    <div class="info-card-section">
      <div class="info-row-item" onclick="openStarredMessagesModal()">
        <div class="info-row-left">
          <span class="material-symbols-outlined info-row-icon" style="color:#f59e0b;">star</span>
          <div class="info-row-text">
            <span class="info-row-title">Pesan Berbintang</span>
            <span class="info-row-sub">${STARRED_MESSAGES.filter((s) => s.convId === activeConvId).length} Catatan tersimpan</span>
          </div>
        </div>
        <div class="info-row-right">
          <span class="material-symbols-outlined">chevron_right</span>
        </div>
      </div>

      <div class="info-row-item">
        <div class="info-row-left">
          <span class="material-symbols-outlined info-row-icon">notifications</span>
          <div class="info-row-text">
            <span class="info-row-title">Bisukan Notifikasi Grup</span>
            <span class="info-row-sub">Senyapkan notifikasi diskusi kelas</span>
          </div>
        </div>
        <div class="info-row-right">
          <label class="switch">
            <input type="checkbox" ${isMuted ? "checked" : ""} onchange="toggleMute('${conv.id}')">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <div class="info-row-item" onclick="openDisappearingModal()">
        <div class="info-row-left">
          <span class="material-symbols-outlined info-row-icon" style="color:#0d9488;">timer</span>
          <div class="info-row-text">
            <span class="info-row-title">Pesan Sementara</span>
            <span class="info-row-sub">${timerLabel}</span>
          </div>
        </div>
        <div class="info-row-right">
          <span class="material-symbols-outlined">chevron_right</span>
        </div>
      </div>
    </div>

    <!-- 5. Group Members Section -->
    <div class="info-card-section">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
        <span style="font-size:0.75rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Daftar Anggota (${conv.online || 28})</span>
        <button class="btn btn-ghost btn-sm" onclick="openModal('modalGroupInvite')" style="color:#00a884;padding:2px 8px;font-size:0.75rem;">
          <span class="material-symbols-outlined" style="font-size:14px;">link</span> Undang Tautan
        </button>
      </div>

      <!-- Member Items -->
      <div class="info-row-item" style="cursor:default;">
        <div class="info-row-left">
          <div class="conv-av" style="width:2.4rem;height:2.4rem;">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Admin" />
          </div>
          <div class="info-row-text">
            <span class="info-row-title">Dr. Ir. Hendra Gunawan <span style="background:#d9fdd3;color:#006045;font-size:0.65rem;padding:2px 6px;border-radius:4px;font-weight:700;margin-left:4px;">Dosen Pengampu</span></span>
            <span class="info-row-sub">Koordinator Akademik</span>
          </div>
        </div>
      </div>

      <div class="info-row-item" style="cursor:default;">
        <div class="info-row-left">
          <div class="conv-av" style="width:2.4rem;height:2.4rem;">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28" alt="Saya" />
          </div>
          <div class="info-row-text">
            <span class="info-row-title">Anda <span style="background:#e0e7ff;color:#4338ca;font-size:0.65rem;padding:2px 6px;border-radius:4px;font-weight:700;margin-left:4px;">Mahasiswa</span></span>
            <span class="info-row-sub">Peserta Mata Kuliah</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. Group Danger Zone -->
    <div class="info-card-section">
      <button class="danger-btn-row" onclick="confirmAction('clear_group_chat')">
        <span class="material-symbols-outlined">delete_sweep</span>
        <span>Bersihkan Riwayat Obrolan</span>
      </button>
      <button class="danger-btn-row" onclick="confirmAction('leave_group')">
        <span class="material-symbols-outlined">logout</span>
        <span>Keluar dari Grup Mata Kuliah</span>
      </button>
      <button class="danger-btn-row" onclick="openReportModal('group')">
        <span class="material-symbols-outlined">flag</span>
        <span>Laporkan Grup ke StudyMatch</span>
      </button>
    </div>

    <!-- 7. Footer Group Metadata -->
    <div style="padding:1rem;text-align:center;color:#94a3b8;font-size:0.72rem;">
      Grup dibuat oleh Koordinator Kelas pada 12 Agustus 2026 pukul 09:00 WIB
    </div>`;
}

/* ─── Disappearing Messages Settings ─── */
function openDisappearingModal() {
  const current = DISAPPEARING_SETTINGS[String(activeConvId)] || "off";
  const radios = document.querySelectorAll('input[name="disappearingTimer"]');
  radios.forEach((r) => {
    r.checked = r.value === current;
  });
  openModal("modalDisappearing");
}

function selectDisappearingTimer(val) {
  // Radio change handled
}

function saveDisappearingSetting() {
  const selected = document.querySelector('input[name="disappearingTimer"]:checked');
  const val = selected ? selected.value : "off";

  DISAPPEARING_SETTINGS[String(activeConvId)] = val;
  localStorage.setItem("sm_disappearing", JSON.stringify(DISAPPEARING_SETTINGS));

  closeModal("modalDisappearing");
  showToast(`Pengaturan pesan sementara diperbarui (${val}).`, "success");

  renderMsgs();
  const conv = CONVERSATIONS.find((c) => String(c.id) === String(activeConvId));
  if (conv) renderInfoContent(conv);
}

/* ─── Custom Lists Creation ─── */
function openCustomListModal() {
  const picker = document.getElementById("customListContactsPicker");
  if (picker) {
    picker.innerHTML = CONVERSATIONS.map(
      (c) => `
      <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer;border-bottom:1px solid #f1f5f9;">
        <input type="checkbox" value="${c.id}" class="custom-list-cb" />
        <span style="font-size:0.875rem;color:#1e293b;font-weight:600;">${escapeHtml(c.name)}</span>
        <span style="font-size:0.75rem;color:#64748b;">(${c.type === "group" ? "Grup" : "Teman"})</span>
      </label>`
    ).join("");
  }
  openModal("modalCustomList");
}

function saveCustomList() {
  const nameInput = document.getElementById("customListName");
  const listName = nameInput ? nameInput.value.trim() : "";
  if (!listName) {
    showToast("Harap masukkan nama daftar.", "info");
    return;
  }

  const selectedCbs = document.querySelectorAll(".custom-list-cb:checked");
  const selectedIds = Array.from(selectedCbs).map((cb) => cb.value);

  const newList = {
    id: "list_" + Date.now(),
    name: listName,
    contactIds: selectedIds,
  };

  CUSTOM_LISTS.push(newList);
  localStorage.setItem("sm_custom_lists", JSON.stringify(CUSTOM_LISTS));

  // Add chip to filter chips bar
  renderCustomListChips();

  closeModal("modalCustomList");
  if (nameInput) nameInput.value = "";
  setChatFilter(`custom_${newList.id}`);
  showToast(`Daftar "${listName}" berhasil dibuat!`, "success");
}



/* ─── Toggles (Favorite & Mute) ─── */
function toggleFavorite(id) {
  const strId = String(id);
  const idx = FAVORITES.indexOf(strId);
  if (idx >= 0) {
    FAVORITES.splice(idx, 1);
    showToast("Dihapus dari favorit.", "info");
  } else {
    FAVORITES.push(strId);
    showToast("Ditambahkan ke favorit! ⭐", "success");
  }
  localStorage.setItem("sm_fav_convs", JSON.stringify(FAVORITES));
  renderConvs();
  const conv = CONVERSATIONS.find((c) => String(c.id) === String(id));
  if (conv) renderInfoContent(conv);
}

function toggleMute(id) {
  const strId = String(id);
  const idx = MUTED_CONVS.indexOf(strId);
  if (idx >= 0) {
    MUTED_CONVS.splice(idx, 1);
    showToast("Notifikasi diaktifkan kembali.", "info");
  } else {
    MUTED_CONVS.push(strId);
    showToast("Notifikasi dibisukan.", "info");
  }
  localStorage.setItem("sm_muted_convs", JSON.stringify(MUTED_CONVS));
  renderConvs();
}

/* ─── Group Invite Link Actions ─── */
function copyGroupInviteLink() {
  const input = document.getElementById("groupInviteLinkInput");
  if (input) {
    input.select();
    navigator.clipboard.writeText(input.value);
    showToast("Tautan undangan disalin ke clipboard! 📋", "success");
  }
}

function shareGroupLinkWhatsApp() {
  const input = document.getElementById("groupInviteLinkInput");
  const link = input ? input.value : "";
  window.open(`https://api.whatsapp.com/send?text=Gabung%20ke%20grup%20belajar%20StudyMatch:%20${encodeURIComponent(link)}`, "_blank");
}

function resetGroupInviteLink() {
  confirmAction("reset_link");
}

/* ─── Confirmation Modal (Danger Actions) ─── */
function confirmAction(actionType) {
  const conv = CONVERSATIONS.find((c) => String(c.id) === String(activeConvId));
  if (!conv) return;

  const titleEl = document.getElementById("confirmTitle");
  const subEl = document.getElementById("confirmSubtitle");
  const msgEl = document.getElementById("confirmMessageText");
  const execBtn = document.getElementById("btnConfirmExecute");

  if (actionType === "clear_chat" || actionType === "clear_group_chat") {
    if (titleEl) titleEl.textContent = "Bersihkan Riwayat Obrolan?";
    if (subEl) subEl.textContent = "Semua pesan akan dihapus dari tampilan Anda";
    if (msgEl) msgEl.textContent = `Apakah Anda yakin ingin menghapus seluruh riwayat percakapan dengan ${conv.name}? Tindakan ini tidak dapat dibatalkan.`;
    if (execBtn) execBtn.textContent = "Bersihkan Chat";
    pendingActionCallback = async () => {
      MESSAGES = [];
      conv.lastMsg = "Belum ada pesan.";
      renderMsgs();
      renderConvs();
      showToast("Riwayat percakapan dibersihkan.", "success");
    };
  } else if (actionType === "delete_contact") {
    if (titleEl) titleEl.textContent = "Hapus Teman Belajar?";
    if (subEl) subEl.textContent = "Kontak akan dihapus dari daftar teman";
    if (msgEl) msgEl.textContent = `Apakah Anda yakin ingin menghapus ${conv.name} dari daftar teman belajar? Anda harus mengirim permintaan pertemanan lagi untuk terhubung.`;
    if (execBtn) execBtn.textContent = "Hapus Kontak";
    pendingActionCallback = async () => {
      CONVERSATIONS = CONVERSATIONS.filter((c) => String(c.id) !== String(activeConvId));
      activeConvId = CONVERSATIONS.length > 0 ? CONVERSATIONS[0].id : null;
      closeInfoDrawer();
      renderConvs();
      if (activeConvId) selectConv(activeConvId);
      else renderMsgs();
      showToast("Kontak berhasil dihapus.", "success");
    };
  } else if (actionType === "block_user") {
    if (titleEl) titleEl.textContent = `Blokir ${conv.name}?`;
    if (subEl) subEl.textContent = "Pengguna tidak akan bisa mengirim pesan kepada Anda";
    if (msgEl) msgEl.textContent = `Apakah Anda yakin ingin memblokir ${conv.name}? Kontak yang diblokir tidak dapat melihat status online atau mengirim pesan baru kepada Anda.`;
    if (execBtn) execBtn.textContent = "Blokir Pengguna";
    pendingActionCallback = async () => {
      closeInfoDrawer();
      showToast(`${conv.name} telah diblokir.`, "info");
    };
  } else if (actionType === "leave_group") {
    if (titleEl) titleEl.textContent = `Keluar dari ${conv.name}?`;
    if (subEl) subEl.textContent = "Anda tidak akan menerima pesan dari grup ini lagi";
    if (msgEl) msgEl.textContent = `Apakah Anda yakin ingin keluar dari grup mata kuliah ${conv.name}?`;
    if (execBtn) execBtn.textContent = "Keluar Grup";
    pendingActionCallback = async () => {
      CONVERSATIONS = CONVERSATIONS.filter((c) => String(c.id) !== String(activeConvId));
      activeConvId = CONVERSATIONS.length > 0 ? CONVERSATIONS[0].id : null;
      closeInfoDrawer();
      renderConvs();
      if (activeConvId) selectConv(activeConvId);
      else renderMsgs();
      showToast("Anda telah keluar dari grup.", "info");
    };
  } else if (actionType === "reset_link") {
    if (titleEl) titleEl.textContent = "Setel Ulang Tautan Undangan?";
    if (subEl) subEl.textContent = "Tautan undangan lama tidak akan berlaku lagi";
    if (msgEl) msgEl.textContent = "Siapapun yang memiliki tautan lama tidak akan dapat bergabung ke grup ini lagi. Buat tautan baru?";
    if (execBtn) execBtn.textContent = "Setel Ulang";
    pendingActionCallback = async () => {
      const input = document.getElementById("groupInviteLinkInput");
      if (input) input.value = `https://studymatch.test/join-group/calc3-${Date.now().toString(36)}`;
      showToast("Tautan grup berhasil disetel ulang.", "success");
    };
  }

  openModal("modalConfirm");
}

function executeConfirmedAction() {
  if (pendingActionCallback) {
    pendingActionCallback();
    pendingActionCallback = null;
  }
  closeModal("modalConfirm");
}

/* ─── Report Modal ─── */
function openReportModal(type) {
  openModal("modalReport");
}

function submitReport() {
  const reason = document.getElementById("reportReason")?.value;
  if (!reason) {
    showToast("Silakan pilih alasan laporan terlebih dahulu.", "info");
    return;
  }
  closeModal("modalReport");
  showToast("Laporan Anda telah dikirimkan ke tim moderasi StudyMatch. Terima kasih.", "success");
}

/* ─── In-Chat Search ─── */
function toggleInChatSearch() {
  const bar = document.getElementById("inChatSearchBar");
  if (!bar) return;

  if (bar.style.display === "none" || !bar.style.display) {
    bar.style.display = "flex";
    const input = document.getElementById("inChatSearchInput");
    if (input) {
      input.value = "";
      input.focus();
    }
  } else {
    bar.style.display = "none";
    renderMsgs();
  }
}

function handleInChatSearch(q) {
  const query = (q || "").toLowerCase().trim();
  if (!query) {
    renderMsgs();
    return;
  }

  const area = document.getElementById("msgsArea");
  if (!area) return;

  const bubbles = area.querySelectorAll(".msg-bubble");
  bubbles.forEach((b) => {
    const text = b.textContent.toLowerCase();
    const group = b.closest(".msg-group");
    if (group) {
      if (text.includes(query)) {
        group.style.opacity = "1";
        b.style.outline = "2px solid #f59e0b";
      } else {
        group.style.opacity = "0.2";
        b.style.outline = "none";
      }
    }
  });
}

/* ─── Attachment & Emoji Interactions ─── */
function toggleAttachmentMenu() {
  const popup = document.getElementById("attachmentPopup");
  if (!popup) return;
  const isHidden = popup.style.display === "none" || !popup.style.display;
  popup.style.display = isHidden ? "flex" : "none";
  const emojiPopup = document.getElementById("emojiPickerPopup");
  if (emojiPopup && isHidden) emojiPopup.style.display = "none";
}

function toggleEmojiPicker() {
  const popup = document.getElementById("emojiPickerPopup");
  if (!popup) return;
  const isHidden = popup.style.display === "none" || !popup.style.display;
  popup.style.display = isHidden ? "grid" : "none";
  const attachPopup = document.getElementById("attachmentPopup");
  if (attachPopup && isHidden) attachPopup.style.display = "none";
}

function insertEmoji(emoji) {
  const ta = document.getElementById("inputMsg");
  if (!ta) return;
  ta.value += emoji;
  ta.focus();
  const popup = document.getElementById("emojiPickerPopup");
  if (popup) popup.style.display = "none";
}

function triggerFileUpload(type) {
  const popup = document.getElementById("attachmentPopup");
  if (popup) popup.style.display = "none";

  if (type === "document") {
    const docInput = document.getElementById("chatDocInput");
    if (docInput) docInput.click();
  } else if (type === "image") {
    const imgInput = document.getElementById("chatImgInput");
    if (imgInput) imgInput.click();
  } else if (type === "video") {
    const videoInput = document.getElementById("chatVideoInput");
    if (videoInput) videoInput.click();
  } else {
    showToast("Membuka template catatan materi…", "info");
    const ta = document.getElementById("inputMsg");
    if (ta) {
      ta.value = "📝 [Catatan Materi]: ";
      ta.focus();
    }
  }
}

function handleFileSelected(e, type) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const conv = CONVERSATIONS.find((c) => String(c.id) === String(activeConvId));
  if (!conv) return;

  let msgText = `Berkas Dikirim: ${file.name}`;
  if (type === "document") msgText = `📄 Dokumen: ${file.name}`;
  else if (type === "image") msgText = `🖼️ Foto: ${file.name}`;
  else if (type === "video") msgText = `🎥 Video: ${file.name}`;

  const newMsg = {
    id: Date.now(),
    type: "sent",
    message: msgText,
    media_type: type, // document, image, video
    time: "Baru saja",
    sender_id: window.__AUTH_USER_ID__,
  };

  MESSAGES.push(newMsg);
  conv.lastMsg = newMsg.message;
  conv.lastMsgByMe = true;
  conv.time = "Baru saja";
  renderMsgs();
  renderConvs();
  showToast(`Berkas ${file.name} berhasil dilampirkan!`, "success");
  e.target.value = "";
}

/* ─── Call Simulations ─── */
function startVoiceCall() {
  const conv = CONVERSATIONS.find((c) => String(c.id) === String(activeConvId));
  const modal = document.getElementById("modalCall");
  const avatar = document.getElementById("callAvatar");
  const nameEl = document.getElementById("callName");
  const statusEl = document.getElementById("callStatus");

  if (avatar && conv) {
    avatar.src = conv.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28";
  }
  if (nameEl && conv) nameEl.textContent = conv.name;
  if (statusEl) statusEl.textContent = "Memanggil…";

  openModal("modalCall");

  callSeconds = 0;
  clearInterval(callTimerInterval);
  setTimeout(() => {
    if (statusEl) statusEl.textContent = "Terhubung • 00:00";
    callTimerInterval = setInterval(() => {
      callSeconds++;
      const mins = String(Math.floor(callSeconds / 60)).padStart(2, "0");
      const secs = String(callSeconds % 60).padStart(2, "0");
      if (statusEl) statusEl.textContent = `Terhubung • ${mins}:${secs}`;
    }, 1000);
  }, 2000);
}

function startVideoCall() {
  startVoiceCall();
  const statusEl = document.getElementById("callStatus");
  if (statusEl) statusEl.textContent = "Panggilan Video • Menghubungkan kamera…";
}

function endCall() {
  clearInterval(callTimerInterval);
  closeModal("modalCall");
  showToast("Panggilan telah berakhir.", "info");
}

function toggleCallMute() {
  const btn = document.getElementById("btnCallMute");
  if (!btn) return;
  const isMuted = btn.style.background === "rgb(239, 68, 68)";
  btn.style.background = isMuted ? "#334155" : "#ef4444";
  showToast(isMuted ? "Mikrofon aktif" : "Mikrofon dibisukan", "info");
}

function toggleCallSpeaker() {
  showToast("Mode speaker diubah.", "info");
}

/* ─── Input Area Handlers ─── */
function autoResizeTextarea(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 120) + "px";
}

function handleInputKeyDown(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

/* ─── Modal Helpers ─── */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById(`${modalId}Overlay`);
  if (modal) modal.classList.add("show");
  if (overlay) overlay.classList.add("show");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById(`${modalId}Overlay`);
  if (modal) modal.classList.remove("show");
  if (overlay) overlay.classList.remove("show");
}

/* ─── Gallery & Edit Features ─── */
function editGroupName() {
  const conv = CONVERSATIONS.find((c) => String(c.id) === String(activeConvId));
  if (!conv || conv.type !== "group") return;

  const newName = prompt("Ubah Nama Grup:", conv.name);
  if (newName && newName.trim() !== "") {
    conv.name = newName.trim();
    
    // Perbarui UI secara langsung (Real-time di sisi pengguna)
    const nameEl = document.getElementById("chatHdrName");
    if (nameEl) nameEl.textContent = conv.name;
    
    renderConvs();
    renderInfoContent(conv);
    showToast("Nama grup diperbarui! (Perlu Backend API untuk simpan permanen)", "success");
  }
}

function editGroupDescription() {
  const conv = CONVERSATIONS.find((c) => String(c.id) === String(activeConvId));
  if (!conv || conv.type !== "group") return;

  const newDesc = prompt("Ubah Deskripsi Grup:", conv.description || "");
  if (newDesc !== null) {
    conv.description = newDesc.trim() || "Tidak ada deskripsi.";
    renderInfoContent(conv);
    showToast("Deskripsi grup diperbarui! (Perlu Backend API untuk simpan permanen)", "success");
  }
}

function openMediaGalleryModal() {
  openModal("modalMediaGallery");
  switchGalleryTab("media");
}

function switchGalleryTab(tabId) {
  // Update Buttons
  document.getElementById("tabBtnMedia").classList.remove("active");
  document.getElementById("tabBtnDocs").classList.remove("active");
  document.getElementById("tabBtnLinks").classList.remove("active");
  
  if (tabId === "media") document.getElementById("tabBtnMedia").classList.add("active");
  else if (tabId === "docs") document.getElementById("tabBtnDocs").classList.add("active");
  else if (tabId === "links") document.getElementById("tabBtnLinks").classList.add("active");

  const content = document.getElementById("galleryTabContent");
  if (!content) return;

  // Filter messages based on tab
  // (In real app, you would fetch from DB, here we simulate from MESSAGES array)
  // For UI simulation:
  
  if (tabId === "media") {
    content.innerHTML = `
      <div class="gallery-grid-full">
        <div class="gallery-item-card" onclick="showToast('Membuka Gambar')"><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&w=200&h=200&fit=crop" alt="img"/></div>
        <div class="gallery-item-card" onclick="showToast('Membuka Gambar')"><img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&w=200&h=200&fit=crop" alt="img"/></div>
        <div class="gallery-item-card" onclick="showToast('Membuka Gambar')"><img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&w=200&h=200&fit=crop" alt="img"/></div>
      </div>
    `;
  } else if (tabId === "docs") {
    content.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="display:flex; align-items:center; gap:10px; padding:10px; background:#f1f5f9; border-radius:8px; cursor:pointer;" onclick="showToast('Membuka PDF')">
          <span class="material-symbols-outlined" style="color:#ef4444; font-size:32px;">picture_as_pdf</span>
          <div style="flex:1;">
            <div style="font-weight:600; color:#0f172a; font-size:14px;">Materi Bab 1 - Pengantar.pdf</div>
            <div style="font-size:12px; color:#64748b;">1.2 MB • Kemarin</div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:10px; padding:10px; background:#f1f5f9; border-radius:8px; cursor:pointer;" onclick="showToast('Membuka DOCX')">
          <span class="material-symbols-outlined" style="color:#2563eb; font-size:32px;">article</span>
          <div style="flex:1;">
            <div style="font-weight:600; color:#0f172a; font-size:14px;">Tugas Kelompok 3.docx</div>
            <div style="font-size:12px; color:#64748b;">800 KB • 12 Ags</div>
          </div>
        </div>
      </div>
    `;
  } else if (tabId === "links") {
    content.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="display:flex; align-items:center; gap:10px; padding:10px; background:#f1f5f9; border-radius:8px; cursor:pointer;" onclick="window.open('https://github.com', '_blank')">
          <span class="material-symbols-outlined" style="color:#10b981; font-size:32px;">link</span>
          <div style="flex:1;">
            <div style="font-weight:600; color:#0f172a; font-size:14px; text-decoration:underline;">https://github.com/studymatch/repo</div>
            <div style="font-size:12px; color:#64748b;">Dibagikan oleh Budi • 3 Hari lalu</div>
          </div>
        </div>
      </div>
    `;
  }
}

/* ─── Expose Global Functions ─── */
window.setChatFilter = setChatFilter;
window.filterConvs = filterConvs;
window.clearSearch = clearSearch;
window.selectConv = selectConv;
window.sendMessage = sendMessage;
window.toggleStarMessage = toggleStarMessage;
window.openStarredMessagesModal = openStarredMessagesModal;
window.filterStarredMessages = filterStarredMessages;
window.openInfoDrawer = openInfoDrawer;
window.closeInfoDrawer = closeInfoDrawer;
window.openDisappearingModal = openDisappearingModal;
window.selectDisappearingTimer = selectDisappearingTimer;
window.saveDisappearingSetting = saveDisappearingSetting;
window.openCustomListModal = openCustomListModal;
window.saveCustomList = saveCustomList;
window.toggleFavorite = toggleFavorite;
window.toggleMute = toggleMute;
window.copyGroupInviteLink = copyGroupInviteLink;
window.shareGroupLinkWhatsApp = shareGroupLinkWhatsApp;
window.resetGroupInviteLink = resetGroupInviteLink;
window.confirmAction = confirmAction;
window.executeConfirmedAction = executeConfirmedAction;
window.openReportModal = openReportModal;
window.submitReport = submitReport;
window.toggleInChatSearch = toggleInChatSearch;
window.handleInChatSearch = handleInChatSearch;
window.toggleAttachmentMenu = toggleAttachmentMenu;
window.toggleEmojiPicker = toggleEmojiPicker;
window.insertEmoji = insertEmoji;
window.triggerFileUpload = triggerFileUpload;
window.handleFileSelected = handleFileSelected;
window.startVoiceCall = startVoiceCall;
window.startVideoCall = startVideoCall;
window.endCall = endCall;
window.toggleCallMute = toggleCallMute;
window.toggleCallSpeaker = toggleCallSpeaker;
window.autoResizeTextarea = autoResizeTextarea;
window.handleInputKeyDown = handleInputKeyDown;
window.openModal = openModal;
window.closeModal = closeModal;

// New functions
window.toggleFilterDropdown = toggleFilterDropdown;
window.closeFilterDropdown = closeFilterDropdown;
window.editGroupName = editGroupName;
window.editGroupDescription = editGroupDescription;
window.openMediaGalleryModal = openMediaGalleryModal;
window.switchGalleryTab = switchGalleryTab;

/* ─── Initialization ─── */
document.addEventListener("DOMContentLoaded", () => {
  renderCustomListChips();
  renderConvs();
  if (activeConvId) {
    selectConv(activeConvId);
  }
});
