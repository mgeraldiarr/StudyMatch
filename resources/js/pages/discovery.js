/* ─── StudyMatch Discovery Page Logic (Connected & Smart) ─── */

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

let STUDENTS = window.__INITIAL_CANDIDATES__ || [];

// Load saved favorites from localStorage
function getSavedFavorites() {
  try {
    return JSON.parse(localStorage.getItem("sm_fav_candidates") || "[]");
  } catch (e) {
    return [];
  }
}

function saveFavorites(favIds) {
  try {
    localStorage.setItem("sm_fav_candidates", JSON.stringify(favIds));
  } catch (e) {}
}

const savedFavs = getSavedFavorites();
STUDENTS.forEach((s) => {
  if (savedFavs.includes(s.id)) {
    s.fav = true;
  }
});

const STYLE_ICON = {
  Visual: "visibility",
  Diskusi: "forum",
  Praktik: "terminal",
  Membaca: "menu_book",
};

let activeFilter = "semua";
let activeSort = "compat";
let searchQ = "";
let activeView = "grid";
let activeModal = null;

/* ─── Build Card ─────────────────────────── */
function buildCard(s) {
  const el = document.createElement("div");
  el.className = "profile-card" + (s.fav ? " favorited" : "");
  el.dataset.id = s.id;
  el.setAttribute("role", "group");
  el.setAttribute("aria-label", `${escapeHtml(s.name)}, ${escapeHtml(s.uni)}, kompatibilitas ${s.compat}%`);

  const coursesList = Array.isArray(s.courses) ? s.courses : [];
  const tags = coursesList
    .map((c) => `<span class="tag">${escapeHtml(c)}</span>`)
    .join("");
  const si = STYLE_ICON[s.style] || "psychology";

  // Build CTA button based on match status
  let ctaHtml = "";
  if (s.match_status === "accepted") {
    ctaHtml = `
      <button class="btn card-cta" style="background: #10b981; color: white;" onclick="window.location.href='/dashboard/chat'">
        <span class="material-symbols-outlined">chat</span>
        <span>Chat Sekarang</span>
      </button>
    `;
  } else if (s.match_status === "pending_sent") {
    ctaHtml = `
      <button class="btn card-cta" style="background: rgba(99,102,241,0.1); color: var(--primary); cursor: default;" disabled>
        <span class="material-symbols-outlined">hourglass_top</span>
        <span>Menunggu Respon</span>
      </button>
    `;
  } else if (s.match_status === "pending_received") {
    ctaHtml = `
      <button class="btn card-cta" style="background: #f59e0b; color: white;" onclick="window.location.href='/dashboard/notification'">
        <span class="material-symbols-outlined">mark_email_unread</span>
        <span>Lihat Ajakan</span>
      </button>
    `;
  } else {
    ctaHtml = `
      <button class="btn card-cta" onclick="openModal(${s.id})">
        <span>Ajak Belajar</span>
        <span class="material-symbols-outlined">arrow_forward</span>
      </button>
    `;
  }

  el.innerHTML = `
    <div class="card-accent"></div>
    <div class="card-left">
      <div class="card-header">
        <div class="card-av-area">
          <div class="card-av-wrap">
            <img class="card-av" src="${escapeHtml(s.avatar)}" alt="${escapeHtml(s.name)}" />
            <div class="status-dot${s.online ? "" : " off"}"></div>
          </div>
          <div>
            <div class="card-name">${escapeHtml(s.name)}</div>
            <div class="card-uni">${escapeHtml(s.uni)}</div>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn btn-icon-only btn-ghost fav${s.fav ? " on" : ""}" title="Simpan ke Favorit" onclick="toggleFav(${s.id},this)">
            <span class="material-symbols-outlined">favorite</span>
          </button>
          <button class="btn btn-icon-only btn-ghost" title="Bagikan Profil" onclick="shareCandidate(${s.id})">
            <span class="material-symbols-outlined">share</span>
          </button>
        </div>
      </div>

      <div class="compat-wrap">
        <div class="compat-top">
          <span class="compat-lbl"><span class="material-symbols-outlined">psychology</span>Kompatibilitas</span>
          <span class="compat-score">${s.compat}%</span>
        </div>
        <div class="compat-bar"><div class="compat-fill" data-w="${s.compat}"></div></div>
      </div>

      <div>
        <span class="course-lbl">Mata kuliah bersama</span>
        <div class="tags">${tags}</div>
      </div>

      <div><span class="style-badge"><span class="material-symbols-outlined">${si}</span>${escapeHtml(s.style)}</span></div>
    </div>
    ${ctaHtml}`;
  return el;
}

/* ─── Share Candidate ────────────────────── */
function shareCandidate(id) {
  const s = STUDENTS.find((x) => x.id === id);
  if (!s) return;

  const shareText = `Temukan partner belajar ${s.name} (${s.uni}) di StudyMatch!`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareText).then(() => {
      toast(`Tautan profil ${s.name} berhasil disalin!`, "success");
    }).catch(() => {
      toast(`Profil ${s.name} dipilih`, "info");
    });
  } else {
    toast(`Profil ${s.name} dipilih`, "info");
  }
}

/* ─── Render ─────────────────────────────── */
function render() {
  const grid = document.getElementById("cardsGrid");
  if (!grid) return;
  
  grid.querySelectorAll(".profile-card").forEach((c) => c.remove());

  let list = STUDENTS.filter((s) => {
    const q = searchQ.toLowerCase();
    const matchQ =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.uni.toLowerCase().includes(q) ||
      (Array.isArray(s.courses) && s.courses.some((c) => c.toLowerCase().includes(q)));
    const matchF =
      activeFilter === "semua"
        ? true
        : activeFilter === "online"
          ? s.online
          : activeFilter === "favorit"
            ? s.fav
            : s.style.toLowerCase() === activeFilter || s.style_raw === activeFilter;
    return matchQ && matchF;
  });

  if (activeSort === "compat") list.sort((a, b) => b.compat - a.compat);
  else if (activeSort === "name")
    list.sort((a, b) => a.name.localeCompare(b.name));
  else list.sort((a, b) => (b.online ? 1 : 0) - (a.online ? 1 : 0));

  const empty = document.getElementById("emptyState");
  if (empty) empty.classList.toggle("show", list.length === 0);

  list.forEach((s, i) => {
    const card = buildCard(s);
    card.style.cssText = "opacity:0;transform:translateY(16px)";
    grid.appendChild(card);
    setTimeout(() => {
      card.style.cssText =
        "opacity:1;transform:translateY(0);transition:opacity .4s ease,transform .4s ease";
    }, i * 45);
  });

  // Animate compat bars
  setTimeout(() => {
    grid.querySelectorAll(".compat-fill").forEach((b) => {
      b.style.width = b.dataset.w + "%";
    });
  }, 150);

  const countLbl = document.getElementById("countLbl");
  if (countLbl) countLbl.textContent = list.length;
  const pillMatch = document.getElementById("pill-match");
  if (pillMatch) pillMatch.textContent = list.length;
  const pillFav = document.getElementById("pill-fav");
  if (pillFav) pillFav.textContent = STUDENTS.filter((x) => x.fav).length;
}

/* ─── Filter ─────────────────────────────── */
function setFilter(btn) {
  document.querySelectorAll(".fp").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  activeFilter = btn.dataset.f;
  render();
  updateActiveTags();
}

/* ─── Sort ───────────────────────────────── */
function setSort(v) {
  activeSort = v;
  render();
}

/* ─── Active tags ────────────────────────── */
function updateActiveTags() {
  const c = document.getElementById("activeFilters");
  if (!c) return;
  c.innerHTML = "";
  const add = (label, onRemove) => {
    const t = document.createElement("div");
    t.className = "af-tag";
    t.innerHTML = `${escapeHtml(label)} <button onclick="${onRemove}"><span class="material-symbols-outlined">close</span></button>`;
    c.appendChild(t);
  };
  if (activeFilter !== "semua") add(activeFilter, "clearFilter()");
  if (searchQ) add(`"${searchQ}"`, "clearQ()");
  if (c.children.length) {
    const ca = document.createElement("button");
    ca.className = "clear-all";
    ca.textContent = "Hapus semua";
    ca.onclick = clearAll;
    c.appendChild(ca);
  }
  c.classList.toggle("show", c.children.length > 0);
}

function clearFilter() {
  activeFilter = "semua";
  document
    .querySelectorAll(".fp")
    .forEach((b) => b.classList.toggle("active", b.dataset.f === "semua"));
  render();
  updateActiveTags();
}

function clearQ() {
  searchQ = "";
  const inp = document.getElementById("searchInput");
  if (inp) inp.value = "";
  const clearBtn = document.getElementById("clearSearch");
  if (clearBtn) clearBtn.classList.remove("show");
  render();
  updateActiveTags();
}

function clearAll() {
  clearFilter();
  clearQ();
}

/* ─── Search ─────────────────────────────── */
let sDebounce;
function onSearch(v) {
  clearTimeout(sDebounce);
  const clearBtn = document.getElementById("clearSearch");
  if (clearBtn) clearBtn.classList.toggle("show", v.length > 0);
  sDebounce = setTimeout(() => {
    searchQ = v.trim();
    render();
    updateActiveTags();
  }, 200);
}

/* ─── View ───────────────────────────────── */
function setView(v) {
  activeView = v;
  document
    .getElementById("cardsGrid")
    ?.classList.toggle("list-view", v === "list");
  document.getElementById("vGrid")?.classList.toggle("active", v === "grid");
  document.getElementById("vList")?.classList.toggle("active", v === "list");
}

/* ─── Favourite ──────────────────────────── */
function toggleFav(id, btn) {
  const s = STUDENTS.find((x) => x.id === id);
  if (!s) return;
  s.fav = !s.fav;
  btn.classList.toggle("on", s.fav);
  const card = document.querySelector(`.profile-card[data-id="${id}"]`);
  if (card) card.classList.toggle("favorited", s.fav);

  const favList = STUDENTS.filter((x) => x.fav).map((x) => x.id);
  saveFavorites(favList);

  const pillFav = document.getElementById("pill-fav");
  if (pillFav) pillFav.textContent = favList.length;

  toast(
    s.fav
      ? `${s.name} disimpan ke favorit ❤️`
      : `${s.name} dihapus dari favorit`,
    s.fav ? "success" : "info",
  );
  if (activeFilter === "favorit") render();
}

/* ─── Refresh Matches ────────────────────── */
async function refreshMatches() {
  const btn = document.getElementById("refreshBtn");
  if (btn) btn.classList.add("spinning");
  toast("Memperbarui rekomendasi…", "info");

  try {
    const res = await fetch("/discovery/candidates", {
      headers: {
        Accept: "application/json",
      },
    });
    const data = await res.json();
    if (res.ok && data.success) {
      STUDENTS = data.candidates || [];
      // Reapply favorites
      const favs = getSavedFavorites();
      STUDENTS.forEach((s) => {
        if (favs.includes(s.id)) s.fav = true;
      });
      render();
      toast("Rekomendasi diperbarui dari database! 🎯", "success");
    }
  } catch (err) {
    toast("Gagal memuat rekomendasi baru.", "error");
  } finally {
    if (btn) btn.classList.remove("spinning");
  }
}

/* ─── Load more ──────────────────────────── */
function loadMore() {
  const btn = document.getElementById("loadBtn");
  if (!btn) return;
  btn.classList.add("loading");
  btn.lastElementChild.textContent = "Memuat…";
  setTimeout(() => {
    btn.classList.remove("loading");
    btn.lastElementChild.textContent = "Muat lebih banyak";
    toast("Semua rekomendasi terbaik sudah ditampilkan", "info");
  }, 600);
}

/* ─── Smart Match (FAB) ──────────────────── */
function triggerSmartMatch() {
  // Find top candidate not yet connected
  const bestCandidate = STUDENTS.find((s) => s.match_status === "none") || STUDENTS[0];
  if (!bestCandidate) {
    toast("Semua kandidat sudah diajak atau terhubung!", "info");
    return;
  }

  toast(`Smart Match menemukan ${bestCandidate.name} (${bestCandidate.compat}% kompatibel)! ⚡`, "success");
  openModal(bestCandidate.id);
}

/* ─── Modal ──────────────────────────────── */
function openModal(id) {
  activeModal = id;
  const s = STUDENTS.find((x) => x.id === id);
  if (!s) return;

  const av = document.getElementById("mAvatar");
  if (av) {
    av.src = s.avatar;
    av.alt = s.name;
  }
  const nm = document.getElementById("mName");
  if (nm) nm.textContent = s.name;
  const un = document.getElementById("mUni");
  if (un) un.textContent = s.uni;
  const bio = document.getElementById("mBio");
  if (bio) bio.textContent = `"${s.bio || 'Siap belajar dan berbagi pemahaman materi perkuliahan.'}"`;

  const msg = document.getElementById("mMsg");
  if (msg) {
    const firstName = s.name.split(" ")[0];
    msg.value = `Hai ${firstName}! Aku lihat kita punya mata kuliah dan minat belajar yang cocok (${s.compat}% match). Mau belajar dan diskusi bareng?`;
  }

  document.getElementById("modalOverlay")?.classList.add("show");
  setTimeout(() => document.getElementById("mMsg")?.focus(), 250);
}

function closeModal() {
  document.getElementById("modalOverlay")?.classList.remove("show");
}

function closeModalOut(e) {
  if (e.target === document.getElementById("modalOverlay")) closeModal();
}

async function sendInvite() {
  const s = STUDENTS.find((x) => x.id === activeModal);
  if (!s) return;

  const msgInput = document.getElementById("mMsg");
  const message = msgInput ? msgInput.value.trim() : "";
  const sendBtn = document.getElementById("btnSendInviteModal");

  if (sendBtn) sendBtn.disabled = true;

  try {
    const res = await fetch(`/match-requests/${s.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    closeModal();

    if (res.ok && data.success) {
      s.match_status = "pending_sent";
      render();
      toast(data.message || `Undangan belajar dikirim ke ${s.name}! 🎉`, "success");
    } else {
      toast(data.message || "Gagal mengirim undangan.", "error");
    }
  } catch (err) {
    closeModal();
    toast("Terjadi kesalahan koneksi saat mengirim undangan.", "error");
  } finally {
    if (sendBtn) sendBtn.disabled = false;
  }
}

/* ─── Scroll Progress ────────────────────── */
window.addEventListener(
  "scroll",
  () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const prog = document.getElementById("prog");
    if (prog) {
      prog.style.width = h > 0 ? (window.scrollY / h) * 100 + "%" : "0%";
    }
  },
  { passive: true },
);

/* ─── Keyboard Shortcuts ─────────────────── */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    document.getElementById("searchInput")?.focus();
  }
});

/* ── Expose to global for onclick/oninput handlers ── */
window.buildCard = buildCard;
window.render = render;
window.setFilter = setFilter;
window.setSort = setSort;
window.updateActiveTags = updateActiveTags;
window.clearFilter = clearFilter;
window.clearQ = clearQ;
window.clearAll = clearAll;
window.onSearch = onSearch;
window.setView = setView;
window.toggleFav = toggleFav;
window.shareCandidate = shareCandidate;
window.refreshMatches = refreshMatches;
window.loadMore = loadMore;
window.triggerSmartMatch = triggerSmartMatch;
window.openModal = openModal;
window.closeModal = closeModal;
window.closeModalOut = closeModalOut;
window.sendInvite = sendInvite;

/* ─── Init ───────────────────────────────── */
render();
