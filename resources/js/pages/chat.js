/* ─── StudyMatch Chat Logic (Full Interactive & Secure) ─── */

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

let CONVERSATIONS = window.__INITIAL_CONVERSATIONS__ || [];
let MESSAGES = [];
let filterQ = "";
let activeConvId = CONVERSATIONS.length > 0 ? CONVERSATIONS[0].id : null;

/* ─── Render Conversations ─── */
function renderConvs() {
  const list = document.getElementById("convList");
  if (!list) return;

  const q = filterQ.toLowerCase();
  let filtered = CONVERSATIONS.filter((c) => {
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.lastMsg && c.lastMsg.toLowerCase().includes(q))
    );
  });

  if (filtered.length === 0) {
    list.innerHTML = `<div class="conv-empty" style="padding: 24px 16px; text-align: center; color: var(--text-muted);">
      <span class="material-symbols-outlined" style="font-size: 32px; margin-bottom: 4px;">search_off</span>
      <p style="font-size: 0.875rem;">Belum ada percakapan aktif. Temukan teman belajar di Discovery!</p>
    </div>`;
    return;
  }

  let hasGroups = filtered.some((c) => c.type === "group");
  let hasDms = filtered.some((c) => c.type === "dm");

  list.innerHTML = filtered
    .map((c) => {
      let label = "";
      if (c.type === "group" && hasGroups) {
        hasGroups = false;
        label = `<div class="conv-section-label">Grup Mata Kuliah</div>`;
      } else if (c.type === "dm" && hasDms) {
        hasDms = false;
        label = `<div class="conv-section-label">Pesan Langsung</div>`;
      }
      return label + buildConvItem(c);
    })
    .join("");
}

function buildConvItem(c) {
  const escapedName = escapeHtml(c.name);
  const escapedLastMsg = escapeHtml(c.lastMsg);
  const escapedTime = escapeHtml(c.time);
  const isActive = String(c.id) === String(activeConvId);

  return `<div class="conv-item${isActive ? " active" : ""}" onclick="selectConv('${c.id}')">
    ${
      c.type === "group"
        ? `<div class="conv-av-icon ${c.color || "purple"}"><span class="material-symbols-outlined">${c.icon || "school"}</span></div>`
        : `<div class="conv-av"><img src="${escapeHtml(c.avatar)}" alt="${escapedName}" /></div>`
    }
    <div class="conv-info">
      <div class="conv-name">${escapedName}</div>
      <div class="conv-msg">${escapedLastMsg}</div>
    </div>
    <div class="conv-time">${escapedTime}</div>
  </div>`;
}

/* ─── Render Messages ─── */
function renderMsgs() {
  const area = document.getElementById("msgsArea");
  if (!area) return;

  if (MESSAGES.length === 0) {
    area.innerHTML = `
      <div class="date-sep"><div class="date-sep-line"></div><span class="date-sep-text">Hari ini</span><div class="date-sep-line"></div></div>
      <div style="text-align:center; padding: 40px 16px; color: var(--text-muted); font-size: 0.875rem;">
        Belum ada pesan. Mulai obrolan untuk berdiskusi! 👋
      </div>
    `;
    return;
  }

  let html = `<div class="date-sep"><div class="date-sep-line"></div><span class="date-sep-text">Riwayat Pesan</span><div class="date-sep-line"></div></div>`;
  
  MESSAGES.forEach((m) => {
    const isSent = m.type === "sent";
    const escapedText = escapeHtml(m.text);
    const escapedTime = escapeHtml(m.time);
    const escapedAvatar = escapeHtml(m.avatar);

    html += `
      <div class="msg-group ${m.type}">
        ${!isSent ? `<div class="msg-av"><img src="${escapedAvatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28'}" alt="" /></div>` : ""}
        <div style="flex:1;${isSent ? "display:flex;flex-direction:column;align-items:flex-end" : ""}">
          <div class="msg-bubble">${escapedText}</div>
          <div class="msg-info">${escapedTime} ${isSent ? '<span class="material-symbols-outlined" style="font-size:14px">done_all</span>' : ""}</div>
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

  if (nameEl) nameEl.textContent = conv.name;

  if (conv.type === "group") {
    if (statusEl) statusEl.innerHTML = `<span class="status-dot"></span>${conv.online || 0} mahasiswa terdaftar`;
    if (avImg) avImg.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ-VR5XHbtoZrw07_xJp2dOibXlKV1ph4v9h0Ep25o519mGHSP3fYqdoizVuDhH1jDnG0V8QU1BxK_MY1FPunfb7_8DxkYiVzJKe5EyzCLekGkXYCghAQmKjovo71T9ofCZ7Q-P3k2wp1zMtJIvVPWXKM5xG2_Nonug38Ihs4xm_Xh_lG8GY0s8NlEnZDYV_g7zEw0kMX8j0WI_dB6DpyF0hSp26wJXD4LDoTy6z-NL_Ha689QKQM_H5ZD4LwdHFq-rv3Kk7qTzZ0";

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
    if (statusEl) statusEl.innerHTML = `<span class="status-dot${conv.online ? "" : " offline"}"></span>${conv.online ? "Online" : "Offline"}`;
    if (avImg) avImg.src = conv.avatar;

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

  if (window.innerWidth < 900) {
    const panel = document.querySelector(".conv-panel");
    if (panel) panel.classList.remove("show");
  }
}

function filterConvs(q) {
  filterQ = q;
  renderConvs();
}

/* ─── Send Message ─── */
async function sendMessage() {
  const ta = document.getElementById("inputMsg");
  if (!ta) return;
  const msg = ta.value.trim();
  if (!msg) return;

  const conv = CONVERSATIONS.find((c) => String(c.id) === String(activeConvId));
  if (!conv) {
    toast("Pilih percakapan terlebih dahulu.", "info");
    return;
  }

  const sendBtn = document.getElementById("sendBtn");
  if (sendBtn) sendBtn.disabled = true;

  const endpoint = conv.type === "group" 
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
      conv.lastMsg = (conv.type === "group" ? "Me: " : "") + msg;
      conv.time = "Baru saja";
      renderMsgs();
      renderConvs();
      ta.value = "";
      ta.style.height = "auto";
    } else {
      toast(data.message || "Gagal mengirim pesan.", "error");
    }
  } catch (err) {
    toast("Terjadi kesalahan jaringan saat mengirim pesan.", "error");
  } finally {
    if (sendBtn) sendBtn.disabled = false;
  }
}

/* ─── Clear Chat History ─── */
async function clearCurrentChat() {
  const conv = CONVERSATIONS.find((c) => String(c.id) === String(activeConvId));
  if (!conv) return;

  if (conv.type === "group") {
    toast("Pesan grup tidak dapat dihapus sepihak.", "info");
    return;
  }

  const confirmed = await (window.showConfirmModal ? window.showConfirmModal({
    title: "Bersihkan Riwayat Chat",
    message: `Apakah kamu yakin ingin menghapus seluruh riwayat pesan dengan ${conv.name}?`,
    confirmText: "Bersihkan Chat",
    cancelText: "Batal",
    type: "danger",
    icon: "delete_sweep"
  }) : Promise.resolve(confirm(`Yakin ingin menghapus seluruh riwayat pesan dengan ${conv.name}?`)));

  if (!confirmed) {
    return;
  }

  try {
    const res = await fetch(`/chat/conversations/${conv.target_id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
    });
    const data = await res.json();
    if (res.ok && data.success) {
      MESSAGES = [];
      conv.lastMsg = "Belum ada pesan.";
      renderMsgs();
      renderConvs();
      toast(data.message || "Riwayat percakapan dibersihkan.", "success");
    }
  } catch (err) {
    toast("Gagal membersihkan riwayat percakapan.", "error");
  }
}

/* ─── Remove Partner Contact ─── */
async function removeCurrentPartner() {
  const conv = CONVERSATIONS.find((c) => String(c.id) === String(activeConvId));
  if (!conv) return;

  if (conv.type === "group") {
    toast("Tidak dapat menghapus grup mata kuliah dari sini.", "info");
    return;
  }

  const confirmed = await (window.showConfirmModal ? window.showConfirmModal({
    title: "Hapus Teman Belajar",
    message: `Apakah kamu yakin ingin menghapus ${conv.name} dari daftar teman belajarmu?`,
    confirmText: "Hapus Kontak",
    cancelText: "Batal",
    type: "danger",
    icon: "person_remove"
  }) : Promise.resolve(confirm(`Hapus ${conv.name} dari daftar teman belajar?`)));

  if (!confirmed) {
    return;
  }

  try {
    const res = await fetch(`/chat/partners/${conv.target_id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
    });
    const data = await res.json();
    if (res.ok && data.success) {
      CONVERSATIONS = CONVERSATIONS.filter((c) => String(c.id) !== String(activeConvId));
      activeConvId = CONVERSATIONS.length > 0 ? CONVERSATIONS[0].id : null;
      MESSAGES = [];
      renderConvs();
      if (activeConvId) {
        selectConv(activeConvId);
      } else {
        renderMsgs();
      }
      toast(data.message || "Kontak berhasil dihapus.", "success");
    }
  } catch (err) {
    toast("Gagal menghapus kontak.", "error");
  }
}

/* ─── Auto resize textarea & Enter key to send ─── */
const inputMsg = document.getElementById("inputMsg");
if (inputMsg) {
  inputMsg.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 144) + "px";
  });

  inputMsg.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

function toggleConvPanel() {
  const panel = document.querySelector(".conv-panel");
  if (panel) panel.classList.toggle("show");
}

/* ── Expose to global for onclick/oninput handlers ── */
window.toggleConvPanel = toggleConvPanel;
window.renderConvs = renderConvs;
window.buildConvItem = buildConvItem;
window.renderMsgs = renderMsgs;
window.selectConv = selectConv;
window.filterConvs = filterConvs;
window.sendMessage = sendMessage;
window.clearCurrentChat = clearCurrentChat;
window.removeCurrentPartner = removeCurrentPartner;

/* ─── Init ─── */
renderConvs();
if (activeConvId) {
  selectConv(activeConvId);
}
