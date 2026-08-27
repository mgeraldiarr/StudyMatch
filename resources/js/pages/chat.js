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

// Safe for embedding as a single-quoted JS string literal inside an HTML
// event-handler attribute (e.g. onclick="fn('${value}')"). HTML attribute
// entities are decoded by the browser BEFORE the JS is executed, so
// escapeHtml() alone does not stop a raw quote from breaking out here -
// quotes/backslashes must be JS-escaped instead of HTML-entity-escaped.
function escapeForInlineHandler(str) {
  if (typeof str !== "string") str = String(str ?? "");
  return str
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ─── State Management ─── */
let CONVERSATIONS = [];
let MESSAGES = [];
let activeConvId = null;
let currentFilter = "all";
let filterQ = "";
let pendingActionCallback = null;
let callTimerInterval = null;
let callSeconds = 0;

function readInitialData() {
  const convEl = document.getElementById("initialConversationsData");
  const userEl = document.getElementById("authUserData");

  if (convEl) {
    try {
      const parsed = JSON.parse(convEl.textContent || "[]");
      if (Array.isArray(parsed)) CONVERSATIONS = parsed;
    } catch (e) {
      console.warn("Could not parse initial conversations:", e);
    }
  } else if (window.__INITIAL_CONVERSATIONS__) {
    CONVERSATIONS = window.__INITIAL_CONVERSATIONS__;
  }

  if (userEl) {
    try {
      window.__AUTH_USER__ = JSON.parse(userEl.textContent || "null");
      window.__AUTH_USER_ID__ = window.__AUTH_USER__ ? window.__AUTH_USER__.id : null;
    } catch (e) {
      console.warn("Could not parse auth user:", e);
    }
  }

  if (!activeConvId && CONVERSATIONS.length > 0) {
    activeConvId = CONVERSATIONS[0].id;
  }
}

// Initial read attempt
readInitialData();

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

    let mediaHtml = "";
    if (m.media && m.media.url) {
      if (m.media.type === "image") {
        mediaHtml = `<div class="msg-media-wrap"><img src="${escapeHtml(m.media.url)}" alt="${escapeHtml(m.media.name || "Foto")}" onclick="window.open('${escapeHtml(m.media.url)}', '_blank')" /></div>`;
      } else if (m.media.type === "video") {
        mediaHtml = `<div class="msg-media-wrap"><video src="${escapeHtml(m.media.url)}" controls></video></div>`;
      } else if (m.media.type === "document") {
        mediaHtml = `
          <a href="${escapeHtml(m.media.url)}" target="_blank" download="${escapeHtml(m.media.name || 'Dokumen')}" class="msg-media-doc">
            <div class="msg-media-doc-icon"><span class="material-symbols-outlined">description</span></div>
            <div class="msg-media-doc-info">
              <div class="msg-media-doc-name">${escapeHtml(m.media.name || "Dokumen")}</div>
              <div class="msg-media-doc-sub">Klik untuk mengunduh</div>
            </div>
          </a>`;
      }
    }

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
            ${mediaHtml}
            ${escapedText && escapedText !== "Berkas Dilampirkan" ? `<div class="msg-text">${escapedText}</div>` : (mediaHtml ? "" : escapedText)}
            <div class="msg-meta-row">
              ${isStarred ? '<span class="material-symbols-outlined msg-star-icon">star</span>' : ""}
              <span>${escapedTime}</span>
              ${isSent ? '<span class="material-symbols-outlined msg-check-icon">done_all</span>' : ""}
            </div>
          </div>
          <div class="msg-actions-dropdown">
            <button class="msg-drop-btn" onclick="toggleStarMessage(${m.id || idx}, '${escapeForInlineHandler(m.text || m.message || "")}', '${escapeForInlineHandler(m.sender_name || (m.sender ? m.sender.name : "") || (isSent ? "Saya" : conv.name))}', '${escapeForInlineHandler(m.time || "12:00")}')" title="${isStarred ? "Hapus Bintang" : "Beri Bintang"}">
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
function toggleConvPanel() {
  const container = document.querySelector(".chat-app-container");
  if (container) container.classList.remove("chat-open");
}

async function selectConv(id) {
  activeConvId = id;
  renderConvs();

  const conv = CONVERSATIONS.find((c) => String(c.id) === String(id));
  if (!conv) return;

  const container = document.querySelector(".chat-app-container");
  if (container) container.classList.add("chat-open");

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

async function renderInfoContent(conv) {
  const body = document.getElementById("infoDrawerBody");
  const title = document.getElementById("infoDrawerTitle");
  if (!body) return;

  body.innerHTML = `
    <div style="text-align:center; padding:3rem 1rem; color:#64748b;">
      <span class="material-symbols-outlined" style="font-size:2rem; animation: spin 1s linear infinite;">progress_activity</span>
      <p style="margin-top:0.5rem; font-size:0.85rem;">Memuat informasi...</p>
    </div>`;

  if (conv.type === "group") {
    if (title) title.textContent = "Info Grup Belajar";
    try {
      const res = await fetch(`/chat/groups/${conv.target_id}/info`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        body.innerHTML = buildGroupInfoHTML(conv, data);
      } else {
        body.innerHTML = buildGroupInfoHTML(conv, null);
      }
    } catch (e) {
      body.innerHTML = buildGroupInfoHTML(conv, null);
    }
  } else {
    if (title) title.textContent = "Info Kontak Mahasiswa";
    try {
      const res = await fetch(`/chat/contacts/${conv.target_id}/info`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        body.innerHTML = buildContactInfoHTML(conv, data);
      } else {
        body.innerHTML = buildContactInfoHTML(conv, null);
      }
    } catch (e) {
      body.innerHTML = buildContactInfoHTML(conv, null);
    }
  }
}

/* ─── HTML Builder for 1-on-1 Contact Info ─── */
function buildContactInfoHTML(conv, data) {
  const isMuted = MUTED_CONVS.includes(String(conv.id));
  const isFav = FAVORITES.includes(String(conv.id));

  const contact = (data && data.contact) || conv;
  const mutualCourses = (data && data.mutual_courses) || [];
  const sharedMedia = (data && data.shared_media) || [];

  return `
    <!-- 1. Profile Hero Section -->
    <div class="info-card-section info-profile-hero">
      <div class="info-avatar-large">
        <img src="${escapeHtml(contact.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28")}" alt="${escapeHtml(contact.name)}" />
      </div>
      <h3 class="info-user-name">${escapeHtml(contact.name)}</h3>
      <p class="info-user-sub">${escapeHtml(contact.university || "Universitas")} • ${escapeHtml(contact.major || "Mahasiswa")}</p>
      <span style="font-size:0.75rem;color:${contact.is_online ? '#059669' : '#64748b'};margin-top:2px;font-weight:600;">
        ${contact.is_online ? "● Sedang Aktif" : "● Terakhir aktif hari ini"}
      </span>

      <!-- Action Buttons (Clean & Direct) -->
      <div class="info-action-grid" style="grid-template-columns: repeat(2, 1fr); margin-top: 1rem;">
        <button class="info-action-btn" onclick="toggleInChatSearch()">
          <span class="material-symbols-outlined">search</span>
          <span>Cari Pesan</span>
        </button>
        <button class="info-action-btn" onclick="toggleFavorite('${conv.id}')">
          <span class="material-symbols-outlined" style="color:${isFav ? "#f59e0b" : "inherit"}">${isFav ? "star" : "star_border"}</span>
          <span>${isFav ? "Favorit ★" : "Beri Bintang"}</span>
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
            <span class="info-row-sub">${escapeHtml(contact.learning_style || "Visual &amp; Problem Solving")}</span>
          </div>
        </div>
      </div>
      <div class="info-row-item" style="cursor:default;">
        <div class="info-row-left">
          <span class="material-symbols-outlined info-row-icon">description</span>
          <div class="info-row-text">
            <span class="info-row-title">Tentang Teman Belajar</span>
            <span class="info-row-sub">${escapeHtml(contact.bio || "Siap diskusi materi tugas dan kelompok.")}</span>
          </div>
        </div>
      </div>
      <div class="info-row-item" style="cursor:default;">
        <div class="info-row-left">
          <span class="material-symbols-outlined info-row-icon">mail</span>
          <div class="info-row-text">
            <span class="info-row-title">Email Kampus</span>
            <span class="info-row-sub">${escapeHtml(contact.email || "mahasiswa@kampus.ac.id")}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Shared Media Preview (Direct click to open) -->
    <div class="info-card-section">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
        <span style="font-size:0.75rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Berkas Bersama (${sharedMedia.length})</span>
      </div>
      ${
        sharedMedia.length > 0
          ? `<div class="media-preview-grid">
              ${sharedMedia.slice(0, 3).map(m => `
                <div class="media-thumb" onclick="window.open('${escapeHtml(m.url)}', '_blank')" title="${escapeHtml(m.name)}">
                  ${m.type === 'image' 
                    ? `<img src="${escapeHtml(m.url)}" alt="${escapeHtml(m.name)}" />`
                    : `<div style="width:100%;height:100%;background:#e0e7ff;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#4338ca;font-size:0.65rem;font-weight:700;padding:4px;text-align:center;overflow:hidden;">
                        <span class="material-symbols-outlined" style="font-size:20px;">${m.type === 'video' ? 'videocam' : 'description'}</span>
                        <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;">${escapeHtml(m.name)}</span>
                      </div>`
                  }
                </div>
              `).join('')}
            </div>`
          : `<div style="font-size:0.75rem; color:#94a3b8; padding:0.25rem 0;">Belum ada foto atau dokumen bersama.</div>`
      }
    </div>

    <!-- 4. Notifications Setting -->
    <div class="info-card-section">
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
    </div>

    <!-- 5. Common Shared Groups -->
    <div class="info-card-section">
      <span style="font-size:0.75rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;display:block;margin-bottom:0.5rem;">Grup yang Sama (${mutualCourses.length})</span>
      ${
        mutualCourses.length > 0
          ? mutualCourses.map(mc => `
            <div class="info-row-item" onclick="selectConv('group_${mc.id}'); closeInfoDrawer();">
              <div class="info-row-left">
                <div class="conv-av-icon purple" style="width:2.2rem;height:2.2rem;"><span class="material-symbols-outlined" style="font-size:16px;">school</span></div>
                <div class="info-row-text">
                  <span class="info-row-title">${escapeHtml(mc.name)}</span>
                  <span class="info-row-sub">${mc.members_count} Mahasiswa terdaftar</span>
                </div>
              </div>
            </div>
          `).join('')
          : `<div style="font-size:0.75rem; color:#94a3b8; padding:0.25rem 0;">Belum ada grup belajar yang sama.</div>`
      }
    </div>

    <!-- 6. Danger Actions (Subtle & Clean) -->
    <div class="info-card-section">
      <button class="danger-btn-row" onclick="confirmAction('clear_chat')">
        <span class="material-symbols-outlined">delete_sweep</span>
        <span>Bersihkan Riwayat Obrolan</span>
      </button>
      <button class="danger-btn-row" onclick="confirmAction('delete_contact')">
        <span class="material-symbols-outlined">person_remove</span>
        <span>Hapus dari Teman Belajar</span>
      </button>
    </div>`;
}

/* ─── HTML Builder for Group / Course Info ─── */
function buildGroupInfoHTML(conv, data) {
  const isMuted = MUTED_CONVS.includes(String(conv.id));

  const group = (data && data.group) || conv;
  const members = (data && data.members) || [];
  const sharedMedia = (data && data.shared_media) || [];

  return `
    <!-- 1. Group Profile Hero -->
    <div class="info-card-section info-profile-hero">
      <div class="info-avatar-large">
        <div style="width:100%;height:100%;background:#e0e7ff;color:#4338ca;display:flex;align-items:center;justify-content:center;font-size:2.5rem;border-radius:50%;">
          <span class="material-symbols-outlined" style="font-size:3.5rem;">groups</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;justify-content:center;gap:6px;">
        <h3 class="info-user-name">${escapeHtml(group.name)}</h3>
        <button class="btn btn-icon-only btn-ghost" style="width:28px;height:28px;" onclick="editGroupName()" title="Edit Nama Grup">
          <span class="material-symbols-outlined" style="font-size:16px;">edit</span>
        </button>
      </div>
      <p class="info-user-sub">${escapeHtml(group.category || "Grup Belajar")} • ${members.length || group.online || 1} Anggota Mahasiswa</p>

      <!-- Action Buttons (Clean & Direct) -->
      <div class="info-action-grid" style="grid-template-columns: repeat(2, 1fr); margin-top: 1rem;">
        <button class="info-action-btn" onclick="copyGroupInviteLink()">
          <span class="material-symbols-outlined">link</span>
          <span>Salin Link</span>
        </button>
        <button class="info-action-btn" onclick="toggleInChatSearch()">
          <span class="material-symbols-outlined">search</span>
          <span>Cari Pesan</span>
        </button>
      </div>
    </div>

    <!-- 2. Group Description -->
    <div class="info-card-section">
      <div class="info-row-item" onclick="editGroupDescription()">
        <div class="info-row-left">
          <span class="material-symbols-outlined info-row-icon">info</span>
          <div class="info-row-text">
            <span class="info-row-title">Deskripsi Grup <span class="material-symbols-outlined" style="font-size:12px;margin-left:4px;">edit</span></span>
            <span class="info-row-sub">${escapeHtml(group.description || "Forum diskusi materi kuliah dan belajar bersama.")}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Shared Media Preview (Direct click to open) -->
    <div class="info-card-section">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
        <span style="font-size:0.75rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Berkas Bersama (${sharedMedia.length})</span>
      </div>
      ${
        sharedMedia.length > 0
          ? `<div class="media-preview-grid">
              ${sharedMedia.slice(0, 3).map(m => `
                <div class="media-thumb" onclick="window.open('${escapeHtml(m.url)}', '_blank')" title="${escapeHtml(m.name)}">
                  ${m.type === 'image' 
                    ? `<img src="${escapeHtml(m.url)}" alt="${escapeHtml(m.name)}" />`
                    : `<div style="width:100%;height:100%;background:#e0e7ff;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#4338ca;font-size:0.65rem;font-weight:700;padding:4px;text-align:center;overflow:hidden;">
                        <span class="material-symbols-outlined" style="font-size:20px;">${m.type === 'video' ? 'videocam' : 'description'}</span>
                        <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;">${escapeHtml(m.name)}</span>
                      </div>`
                  }
                </div>
              `).join('')}
            </div>`
          : `<div style="font-size:0.75rem; color:#94a3b8; padding:0.25rem 0;">Belum ada berkas materi yang dikirim.</div>`
      }
    </div>

    <!-- 4. Group Notifications -->
    <div class="info-card-section">
      <div class="info-row-item">
        <div class="info-row-left">
          <span class="material-symbols-outlined info-row-icon">notifications</span>
          <div class="info-row-text">
            <span class="info-row-title">Bisukan Notifikasi Grup</span>
            <span class="info-row-sub">Senyapkan notifikasi diskusi</span>
          </div>
        </div>
        <div class="info-row-right">
          <label class="switch">
            <input type="checkbox" ${isMuted ? "checked" : ""} onchange="toggleMute('${conv.id}')">
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>

    <!-- 5. Group Members Section (Real Database Enrolled Members) -->
    <div class="info-card-section">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
        <span style="font-size:0.75rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Daftar Anggota (${members.length || 1})</span>
        <button class="btn btn-ghost btn-sm" onclick="copyGroupInviteLink()" style="color:#00a884;padding:2px 8px;font-size:0.75rem;">
          <span class="material-symbols-outlined" style="font-size:14px;">link</span> Salin Tautan
        </button>
      </div>

      ${
        members.length > 0
          ? members.map(u => `
            <div class="info-row-item" style="cursor:default;">
              <div class="info-row-left">
                <div class="conv-av" style="width:2.4rem;height:2.4rem;">
                  <img src="${escapeHtml(u.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28")}" alt="${escapeHtml(u.name)}" />
                </div>
                <div class="info-row-text">
                  <span class="info-row-title">${escapeHtml(u.name)} ${u.is_me ? '<span style="background:#e0e7ff;color:#4338ca;font-size:0.65rem;padding:2px 6px;border-radius:4px;font-weight:700;margin-left:4px;">Anda</span>' : ''}</span>
                  <span class="info-row-sub">${escapeHtml(u.university || "Mahasiswa")} • ${escapeHtml(u.major || "Ilmu Komputer")}</span>
                </div>
              </div>
            </div>
          `).join('')
          : `
            <div class="info-row-item" style="cursor:default;">
              <div class="info-row-left">
                <div class="conv-av" style="width:2.4rem;height:2.4rem;">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28" alt="Anda" />
                </div>
                <div class="info-row-text">
                  <span class="info-row-title">Anda <span style="background:#e0e7ff;color:#4338ca;font-size:0.65rem;padding:2px 6px;border-radius:4px;font-weight:700;margin-left:4px;">Pembuat Grup</span></span>
                  <span class="info-row-sub">Belum ada anggota lain yang bergabung</span>
                </div>
              </div>
            </div>
          `
      }
    </div>

    <!-- 6. Group Danger Zone (Clean & Direct) -->
    <div class="info-card-section">
      <button class="danger-btn-row" onclick="confirmAction('clear_group_chat')">
        <span class="material-symbols-outlined">delete_sweep</span>
        <span>Bersihkan Riwayat Obrolan</span>
      </button>
      <button class="danger-btn-row" onclick="confirmAction('leave_group')">
        <span class="material-symbols-outlined">logout</span>
        <span>Keluar dari Grup Belajar</span>
      </button>
    </div>

    <!-- 7. Footer Group Metadata -->
    <div style="padding:1rem;text-align:center;color:#94a3b8;font-size:0.72rem;">
      Grup dibuat pada ${escapeHtml(group.created_at || "Baru saja")}
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
      try {
        const res = await fetch(`/chat/conversations/${conv.target_id}`, {
          method: "DELETE",
          headers: { Accept: "application/json", "X-CSRF-TOKEN": getCsrfToken() },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          MESSAGES = [];
          conv.lastMsg = "Belum ada pesan.";
          renderMsgs();
          renderConvs();
          showToast(data.message || "Riwayat percakapan dibersihkan.", "success");
        } else {
          showToast(data.message || "Gagal membersihkan riwayat percakapan.", "error");
        }
      } catch (err) {
        showToast("Gagal membersihkan riwayat percakapan.", "error");
      }
    };
  } else if (actionType === "delete_contact") {
    if (titleEl) titleEl.textContent = "Hapus Teman Belajar?";
    if (subEl) subEl.textContent = "Kontak akan dihapus dari daftar teman";
    if (msgEl) msgEl.textContent = `Apakah Anda yakin ingin menghapus ${conv.name} dari daftar teman belajar? Anda harus mengirim permintaan pertemanan lagi untuk terhubung.`;
    if (execBtn) execBtn.textContent = "Hapus Kontak";
    pendingActionCallback = async () => {
      try {
        const res = await fetch(`/chat/partners/${conv.target_id}`, {
          method: "DELETE",
          headers: { Accept: "application/json", "X-CSRF-TOKEN": getCsrfToken() },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          CONVERSATIONS = CONVERSATIONS.filter((c) => String(c.id) !== String(activeConvId));
          activeConvId = CONVERSATIONS.length > 0 ? CONVERSATIONS[0].id : null;
          closeInfoDrawer();
          renderConvs();
          if (activeConvId) selectConv(activeConvId);
          else renderMsgs();
          showToast(data.message || "Kontak berhasil dihapus.", "success");
        } else {
          showToast(data.message || "Gagal menghapus kontak.", "error");
        }
      } catch (err) {
        showToast("Gagal menghapus kontak.", "error");
      }
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
      try {
        const res = await fetch(`/chat/group-messages/${conv.target_id}/leave`, {
          method: "DELETE",
          headers: { Accept: "application/json", "X-CSRF-TOKEN": getCsrfToken() },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          CONVERSATIONS = CONVERSATIONS.filter((c) => String(c.id) !== String(activeConvId));
          activeConvId = CONVERSATIONS.length > 0 ? CONVERSATIONS[0].id : null;
          closeInfoDrawer();
          renderConvs();
          if (activeConvId) selectConv(activeConvId);
          else renderMsgs();
          showToast(data.message || "Anda telah keluar dari grup.", "info");
        } else {
          showToast(data.message || "Gagal keluar dari grup.", "error");
        }
      } catch (err) {
        showToast("Gagal keluar dari grup.", "error");
      }
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

  showToast(`Mengunggah ${file.name}...`, "info");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  
  if (conv.type === "group") {
    const courseId = conv.id.replace('group_', '');
    formData.append("course_id", courseId);
  } else {
    formData.append("receiver_id", conv.id);
  }

  fetch('/chat/upload-media', {
    method: 'POST',
    headers: {
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      'Accept': 'application/json'
    },
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      MESSAGES.push(data.data);
      conv.lastMsg = data.data.text;
      conv.lastMsgByMe = true;
      conv.time = "Baru saja";
      renderMsgs();
      renderConvs();
      showToast(`Berkas ${file.name} berhasil dilampirkan!`, "success");
    } else {
      showToast(data.message || "Gagal mengunggah berkas.", "error");
    }
  })
  .catch(err => {
    console.error(err);
    showToast("Terjadi kesalahan saat mengunggah berkas.", "error");
  })
  .finally(() => {
    e.target.value = "";
  });
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

/* ─── Group Name & Description Edit Modals ─── */
function editGroupName() {
  const conv = CONVERSATIONS.find((c) => String(c.id) === String(activeConvId));
  if (!conv || conv.type !== "group") return;

  const input = document.getElementById("inputEditGroupName");
  if (input) input.value = conv.name || "";
  openModal("modalEditGroupName");
  setTimeout(() => input && input.focus(), 100);
}

async function submitEditGroupName() {
  const conv = CONVERSATIONS.find((c) => String(c.id) === String(activeConvId));
  if (!conv || conv.type !== "group") return;

  const input = document.getElementById("inputEditGroupName");
  const newName = input ? input.value.trim() : "";
  if (!newName) {
    showToast("Nama grup tidak boleh kosong.", "info");
    return;
  }

  const btn = document.getElementById("btnSaveGroupName");
  if (btn) btn.disabled = true;

  const courseId = conv.target_id;
  try {
    const res = await fetch(`/chat/group-messages/${courseId}/update-info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
        Accept: "application/json",
      },
      body: JSON.stringify({ name: newName }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      conv.name = data.data.name;
      const nameEl = document.getElementById("chatHdrName");
      if (nameEl) nameEl.textContent = conv.name;
      renderConvs();
      renderInfoContent(conv);
      closeModal("modalEditGroupName");
      showToast("Nama grup berhasil diperbarui!", "success");
    } else {
      showToast(data.message || "Gagal memperbarui nama grup.", "error");
    }
  } catch (err) {
    showToast("Terjadi kesalahan saat menyimpan nama grup.", "error");
  } finally {
    if (btn) btn.disabled = false;
  }
}

function editGroupDescription() {
  const conv = CONVERSATIONS.find((c) => String(c.id) === String(activeConvId));
  if (!conv || conv.type !== "group") return;

  const textarea = document.getElementById("inputEditGroupDesc");
  if (textarea) textarea.value = conv.description || "";
  openModal("modalEditGroupDesc");
  setTimeout(() => textarea && textarea.focus(), 100);
}

async function submitEditGroupDesc() {
  const conv = CONVERSATIONS.find((c) => String(c.id) === String(activeConvId));
  if (!conv || conv.type !== "group") return;

  const textarea = document.getElementById("inputEditGroupDesc");
  const newDesc = textarea ? textarea.value.trim() : "";

  const btn = document.getElementById("btnSaveGroupDesc");
  if (btn) btn.disabled = true;

  const courseId = conv.target_id;
  try {
    const res = await fetch(`/chat/group-messages/${courseId}/update-info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
        Accept: "application/json",
      },
      body: JSON.stringify({ description: newDesc || "Tidak ada deskripsi." }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      conv.description = data.data.description;
      renderInfoContent(conv);
      closeModal("modalEditGroupDesc");
      showToast("Deskripsi grup berhasil diperbarui!", "success");
    } else {
      showToast(data.message || "Gagal memperbarui deskripsi grup.", "error");
    }
  } catch (err) {
    showToast("Terjadi kesalahan saat menyimpan deskripsi grup.", "error");
  } finally {
    if (btn) btn.disabled = false;
  }
}

let ACTIVE_GALLERY_DATA = { media: [], docs: [], links: [] };

async function openMediaGalleryModal() {
  const conv = CONVERSATIONS.find((c) => String(c.id) === String(activeConvId));
  if (!conv) return;

  openModal("modalMediaGallery");
  const content = document.getElementById("galleryTabContent");
  if (content) {
    content.innerHTML = `
      <div style="text-align:center; padding:2.5rem 1rem; color:#64748b;">
        <span class="material-symbols-outlined" style="font-size:2rem; animation:spin 1s linear infinite;">progress_activity</span>
        <p style="margin-top:0.5rem; font-size:0.85rem;">Memuat galeri berkas...</p>
      </div>`;
  }

  try {
    const res = await fetch(`/chat/media?target_id=${conv.target_id}&type=${conv.type}`, {
      headers: { Accept: "application/json" },
    });
    const data = await res.json();
    if (res.ok && data.success) {
      ACTIVE_GALLERY_DATA = {
        media: data.media || [],
        docs: data.docs || [],
        links: data.links || [],
      };
    } else {
      ACTIVE_GALLERY_DATA = { media: [], docs: [], links: [] };
    }
  } catch (err) {
    ACTIVE_GALLERY_DATA = { media: [], docs: [], links: [] };
  }

  switchGalleryTab("media");
}

function switchGalleryTab(tabId) {
  const btnMedia = document.getElementById("tabBtnMedia");
  const btnDocs = document.getElementById("tabBtnDocs");
  const btnLinks = document.getElementById("tabBtnLinks");
  if (btnMedia) btnMedia.classList.remove("active");
  if (btnDocs) btnDocs.classList.remove("active");
  if (btnLinks) btnLinks.classList.remove("active");

  if (tabId === "media" && btnMedia) btnMedia.classList.add("active");
  else if (tabId === "docs" && btnDocs) btnDocs.classList.add("active");
  else if (tabId === "links" && btnLinks) btnLinks.classList.add("active");

  const content = document.getElementById("galleryTabContent");
  if (!content) return;

  if (tabId === "media") {
    if (ACTIVE_GALLERY_DATA.media.length === 0) {
      content.innerHTML = `
        <div style="text-align:center; padding:2.5rem 1rem; color:#64748b;">
          <span class="material-symbols-outlined" style="font-size:2.5rem; opacity:0.4; margin-bottom:0.5rem;">photo_library</span>
          <p style="font-weight:600; font-size:0.875rem;">Belum ada foto atau video</p>
          <span style="font-size:0.75rem; opacity:0.8;">Kirim foto atau video dalam obrolan untuk melihatnya di sini.</span>
        </div>`;
      return;
    }

    content.innerHTML = `
      <div class="gallery-grid-full">
        ${ACTIVE_GALLERY_DATA.media.map(m => `
          <div class="gallery-item-card" onclick="window.open('${escapeHtml(m.url)}', '_blank')" title="${escapeHtml(m.name)}">
            ${m.type === 'video' 
              ? `<video src="${escapeHtml(m.url)}" style="width:100%;height:100%;object-fit:cover;"></video>`
              : `<img src="${escapeHtml(m.url)}" alt="${escapeHtml(m.name)}" />`
            }
          </div>
        `).join('')}
      </div>`;
  } else if (tabId === "docs") {
    if (ACTIVE_GALLERY_DATA.docs.length === 0) {
      content.innerHTML = `
        <div style="text-align:center; padding:2.5rem 1rem; color:#64748b;">
          <span class="material-symbols-outlined" style="font-size:2.5rem; opacity:0.4; margin-bottom:0.5rem;">description</span>
          <p style="font-weight:600; font-size:0.875rem;">Belum ada dokumen yang dibagikan</p>
          <span style="font-size:0.75rem; opacity:0.8;">Dokumen PDF, Word, atau presentasi akan muncul di sini.</span>
        </div>`;
      return;
    }

    content.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${ACTIVE_GALLERY_DATA.docs.map(d => `
          <a href="${escapeHtml(d.url)}" target="_blank" download="${escapeHtml(d.name)}" style="display:flex; align-items:center; gap:12px; padding:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; text-decoration:none; color:inherit; transition:background 0.15s ease;">
            <span class="material-symbols-outlined" style="color:#ef4444; font-size:28px;">picture_as_pdf</span>
            <div style="flex:1; min-width:0;">
              <div style="font-weight:700; color:#0f172a; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(d.name)}</div>
              <div style="font-size:11px; color:#64748b;">Dibagikan oleh ${escapeHtml(d.sender || 'Teman')} • ${escapeHtml(d.time || 'Baru saja')}</div>
            </div>
            <span class="material-symbols-outlined" style="color:#6366f1; font-size:20px;">download</span>
          </a>
        `).join('')}
      </div>`;
  } else if (tabId === "links") {
    if (ACTIVE_GALLERY_DATA.links.length === 0) {
      content.innerHTML = `
        <div style="text-align:center; padding:2.5rem 1rem; color:#64748b;">
          <span class="material-symbols-outlined" style="font-size:2.5rem; opacity:0.4; margin-bottom:0.5rem;">link</span>
          <p style="font-weight:600; font-size:0.875rem;">Belum ada tautan link</p>
          <span style="font-size:0.75rem; opacity:0.8;">Tautan web atau materi yang dikirim dalam obrolan akan muncul di sini.</span>
        </div>`;
      return;
    }

    content.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${ACTIVE_GALLERY_DATA.links.map(l => `
          <div style="display:flex; align-items:center; gap:10px; padding:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; cursor:pointer;" onclick="window.open('${escapeHtml(l.url)}', '_blank')">
            <span class="material-symbols-outlined" style="color:#10b981; font-size:28px;">link</span>
            <div style="flex:1; min-width:0;">
              <div style="font-weight:700; color:#2563eb; font-size:13px; text-decoration:underline; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(l.url)}</div>
              <div style="font-size:11px; color:#64748b;">Dikirim oleh ${escapeHtml(l.sender || 'Teman')} • ${escapeHtml(l.time || 'Baru saja')}</div>
            </div>
          </div>
        `).join('')}
      </div>`;
  }
}

/* ─── Create Group Modal ─── */
function openCreateGroupModal() {
  const picker = document.getElementById("createGroupMembersPicker");
  if (picker) {
    const dms = CONVERSATIONS.filter(c => c.type === "dm");
    if (dms.length === 0) {
      picker.innerHTML = `<div style="color:#64748b; font-size:0.85rem; padding:0.5rem 0;">Belum ada teman belajar yang terhubung. Cari teman di menu Discovery terlebih dahulu!</div>`;
    } else {
      picker.innerHTML = dms.map(c => `
        <label style="display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer;border-bottom:1px solid #f1f5f9;">
          <input type="checkbox" value="${c.target_id}" class="create-group-member-cb" />
          <div class="conv-av" style="width:28px;height:28px;">
            <img src="${escapeHtml(c.avatar || '')}" alt="${escapeHtml(c.name)}" />
          </div>
          <span style="font-size:0.875rem;color:#1e293b;font-weight:600;">${escapeHtml(c.name)}</span>
        </label>
      `).join("");
    }
  }
  openModal("modalCreateGroup");
}

async function submitCreateGroup() {
  const nameInput = document.getElementById("newGroupName");
  const descInput = document.getElementById("newGroupDesc");
  const name = nameInput ? nameInput.value.trim() : "";
  const desc = descInput ? descInput.value.trim() : "";

  if (!name) {
    showToast("Nama grup belajar tidak boleh kosong.", "info");
    return;
  }

  const selectedCbs = document.querySelectorAll(".create-group-member-cb:checked");
  const memberIds = Array.from(selectedCbs).map(cb => parseInt(cb.value));

  const btn = document.getElementById("btnSubmitCreateGroup");
  if (btn) btn.disabled = true;

  try {
    const res = await fetch("/chat/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
      body: JSON.stringify({
        name: name,
        description: desc,
        member_ids: memberIds,
      }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      CONVERSATIONS.unshift(data.group);
      closeModal("modalCreateGroup");
      if (nameInput) nameInput.value = "";
      if (descInput) descInput.value = "";
      renderConvs();
      selectConv(data.group.id);
      showToast(data.message || "Grup berhasil dibuat!", "success");
    } else {
      showToast(data.message || "Gagal membuat grup.", "error");
    }
  } catch (err) {
    showToast("Terjadi kesalahan saat membuat grup.", "error");
  } finally {
    if (btn) btn.disabled = false;
  }
}

/* ─── Submit Report ─── */
async function submitReport() {
  const conv = CONVERSATIONS.find((c) => String(c.id) === String(activeConvId));
  if (!conv) return;

  const reasonEl = document.getElementById("reportReason");
  const detailsEl = document.getElementById("reportDetails");
  const reason = reasonEl ? reasonEl.value : "";
  const details = detailsEl ? detailsEl.value : "";

  if (!reason) {
    showToast("Silakan pilih alasan laporan terlebih dahulu.", "info");
    return;
  }

  try {
    const res = await fetch("/chat/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
      body: JSON.stringify({
        type: conv.type === "group" ? "group" : "user",
        target_id: conv.target_id,
        reason: reason,
        details: details,
      }),
    });

    const data = await res.json();
    closeModal("modalReport");
    if (reasonEl) reasonEl.value = "";
    if (detailsEl) detailsEl.value = "";
    showToast(data.message || "Laporan Anda telah dikirim.", "success");
  } catch (err) {
    closeModal("modalReport");
    showToast("Laporan Anda telah dicatat oleh sistem moderasi.", "success");
  }
}

/* ─── Expose Global Functions ─── */
window.setChatFilter = setChatFilter;
window.filterConvs = filterConvs;
window.clearSearch = clearSearch;
window.selectConv = selectConv;
window.toggleConvPanel = toggleConvPanel;
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
window.submitEditGroupName = submitEditGroupName;
window.editGroupDescription = editGroupDescription;
window.submitEditGroupDesc = submitEditGroupDesc;
window.openMediaGalleryModal = openMediaGalleryModal;
window.switchGalleryTab = switchGalleryTab;
window.openCreateGroupModal = openCreateGroupModal;
window.submitCreateGroup = submitCreateGroup;

/* ─── Horizontal Filter Chips Mouse Scroll & Drag ─── */
function initChipsDragScroll() {
  const container = document.getElementById("filterChips");
  if (!container) return;

  // 1. Mouse wheel horizontal scrolling
  container.addEventListener("wheel", (e) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      container.scrollLeft += e.deltaY * 0.8;
    }
  }, { passive: false });

  // 2. Mouse Drag-to-Scroll
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener("mousedown", (e) => {
    isDown = true;
    container.classList.add("dragging");
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  window.addEventListener("mouseup", () => {
    if (isDown) {
      isDown = false;
      container.classList.remove("dragging");
    }
  });

  container.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeft - walk;
  });
}

/* ─── Initialization ─── */
document.addEventListener("DOMContentLoaded", () => {
  readInitialData();
  renderCustomListChips();
  initChipsDragScroll();
  renderConvs();
  if (activeConvId) {
    selectConv(activeConvId);
  }
});
