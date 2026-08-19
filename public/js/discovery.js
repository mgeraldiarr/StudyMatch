/* ─── Data ─────────────────────────────────── */
const AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCKcbPLFItN4SS7U-4BDCucakx73AWp-tucJqKrRd9vEuCX5yLXlCktjciJScuZHyP-emTCoBNUo7FjAfOMbDa1JCGcXMEYiwS09IRbhhtpW0IGJygf9Oou1rX953pIfMPu85Vin_HjMLsQwQQSja04NklK22lylJjf_iyNlN_w587boVf_VcttYg4e34xELfP0FGg2S2TJHq5fGjWtBvPK-sYrQn2GbtUTfQYTXTnXAvr5Rs7e9cCa5LdaLIYMOIcZfV2XeoXyK28",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB8m8h3Kebj96j9Xv-qiL6jydArdiojEWCr7KonLA03vEpzrAwjxQVQw1ypWEfzDb59BBv0yC4jnZ-lSDs2aGS0rFUKTUuW1FOEfCSGzEDqqnMLupAvr2cwH3z96OuRo3hfEZdOKBEy6DLiWFOwEaU5v8sCbkcy_PvKhmYcWFxtMEsmueKmU-SYEIhDbCr1TH067UBxDnMn7I-1KHa16mRWrfdYk-msaeYWbTGWAi6bNqGYNKvT3-Z61SN8R2jUW9-ECTKy0W2CxAM",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDWhr2UB_6eTLnGupEodi-ZX6N4jeN72NOQxPcrlI5vc3Z4i-FB-axDU1mCgg5wIVt7qoSGC9K-0xHJ33B561NUhkCWB2ZFa8mEnWWLnEb1DuK32XHsfxdh_zR1hlLDLtAFUwmsx-LfaytVgzMyj_Rxchke3tPctsoJQs9xMC-bF4Hcw4LbK0zqY-YJpz3y7Uy4xcKirryI6wbGL3vZp-vuRapnqbg3Vf_ksU2MfyHVnshOESD9ccgkseZH9Wf4TwdWnT7MygCcL-U",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ_EKuVYe8DVz3xhNB1IDos9wyTPWBDFIz02_iHUF6jG9iAIhHpoTlStYIrxGaO7JJvxVdoqDvvgsnNDGdewZsm7P0aJpDbJdPhAeE70zUgqPekprvuVN3LRvsQZKdf_2qQ325NNi_EyAD4WxkKrLTYGHUzDhIQX9hpukdXn_hHh5YMCeZ2vJ303g49r7erhOHGRyCc3zArc8OI8kdOrtj7DpPqByRV-5mhVZZjJoC6A-w0B80CqPOq5bmN9RzH_CUf8Uhd-2DqEA",
];

const STUDENTS = [
  {
    id: 1,
    name: "Anisa Rahmawati",
    uni: "Universitas Indonesia · Tahun 3",
    compat: 94,
    style: "Visual",
    online: true,
    fav: false,
    courses: ["Discrete Math", "Algo I", "Kalkulus"],
    avatar: AVATARS[0],
  },
  {
    id: 2,
    name: "Budi Santoso",
    uni: "ITB · Tahun 2",
    compat: 88,
    style: "Praktik",
    online: false,
    fav: false,
    courses: ["Kalkulus III", "Termodinamika"],
    avatar: AVATARS[1],
  },
  {
    id: 3,
    name: "Siti Fatimah",
    uni: "Binus University · Tahun 4",
    compat: 91,
    style: "Diskusi",
    online: true,
    fav: false,
    courses: ["UX Design", "Psikologi", "HCI"],
    avatar: AVATARS[2],
  },
  {
    id: 4,
    name: "Reza Firmansyah",
    uni: "Universitas Gadjah Mada · Tahun 3",
    compat: 85,
    style: "Visual",
    online: true,
    fav: false,
    courses: ["Machine Learning", "Statistika", "Python"],
    avatar: AVATARS[3],
  },
  {
    id: 5,
    name: "Dewi Kusuma",
    uni: "Universitas Airlangga · Tahun 2",
    compat: 79,
    style: "Diskusi",
    online: false,
    fav: false,
    courses: ["Manajemen", "Akuntansi", "Ekonomi Mikro"],
    avatar: AVATARS[0],
  },
  {
    id: 6,
    name: "Ahmad Fauzi",
    uni: "Universitas Brawijaya · Tahun 1",
    compat: 76,
    style: "Praktik",
    online: true,
    fav: false,
    courses: ["Pemrograman Dasar", "Logika Matematika"],
    avatar: AVATARS[1],
  },
];

const STYLE_ICON = {
  Visual: "visibility",
  Diskusi: "forum",
  Praktik: "terminal",
};

let activeFilter = "semua";
let activeSort = "compat";
let searchQ = "";
let activeView = "grid";
let activeModal = null;

/* ─── Build card ─────────────────────────── */
function buildCard(s) {
  const el = document.createElement("div");
  el.className = "profile-card" + (s.fav ? " favorited" : "");
  el.dataset.id = s.id;
  el.setAttribute("role", "group");
  el.setAttribute("aria-label", `${s.name}, ${s.uni}, kompatibilitas ${s.compat}%`);

  const tags = s.courses.map((c) => `<span class="tag">${c}</span>`).join("");
  const si = STYLE_ICON[s.style] || "psychology";

  el.innerHTML = `
    <div class="card-accent"></div>
    <div class="card-left">
      <div class="card-header">
        <div class="card-av-area">
          <div class="card-av-wrap">
            <img class="card-av" src="${s.avatar}" alt="${s.name}" />
            <div class="status-dot${s.online ? "" : " off"}"></div>
          </div>
          <div>
            <div class="card-name">${s.name}</div>
            <div class="card-uni">${s.uni}</div>
          </div>
        </div>
        <div class="card-actions">
          <button class="c-btn fav${s.fav ? " on" : ""}" title="Simpan" onclick="toggleFav(${s.id},this)">
            <span class="material-symbols-outlined">favorite</span>
          </button>
          <button class="c-btn" title="Bagikan" onclick="toast('Tautan profil disalin!','success')">
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

      <div><span class="style-badge"><span class="material-symbols-outlined">${si}</span>${s.style}</span></div>
    </div>
    <button class="card-cta" onclick="openModal(${s.id})">
      <span>Ajak Belajar</span>
      <span class="material-symbols-outlined">arrow_forward</span>
    </button>`;
  return el;
}

/* ─── Render ─────────────────────────────── */
function render() {
  const grid = document.getElementById("cardsGrid");
  grid.querySelectorAll(".profile-card").forEach((c) => c.remove());

  let list = STUDENTS.filter((s) => {
    const q = searchQ.toLowerCase();
    const matchQ =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.uni.toLowerCase().includes(q) ||
      s.courses.some((c) => c.toLowerCase().includes(q));
    const matchF =
      activeFilter === "semua"
        ? true
        : activeFilter === "online"
          ? s.online
          : activeFilter === "favorit"
            ? s.fav
            : s.style.toLowerCase() === activeFilter;
    return matchQ && matchF;
  });

  if (activeSort === "compat") list.sort((a, b) => b.compat - a.compat);
  else if (activeSort === "name")
    list.sort((a, b) => a.name.localeCompare(b.name));
  else list.sort((a, b) => (b.online ? 1 : 0) - (a.online ? 1 : 0));

  const empty = document.getElementById("emptyState");
  empty.classList.toggle("show", list.length === 0);

  list.forEach((s, i) => {
    const card = buildCard(s);
    card.style.cssText = "opacity:0;transform:translateY(16px)";
    grid.appendChild(card);
    setTimeout(() => {
      card.style.cssText =
        "opacity:1;transform:translateY(0);transition:opacity .4s ease,transform .4s ease";
    }, i * 55);
  });

  // Animate compat bars
  setTimeout(() => {
    grid.querySelectorAll(".compat-fill").forEach((b) => {
      b.style.width = b.dataset.w + "%";
    });
  }, 200);

  document.getElementById("countLbl").textContent = list.length;
  document.getElementById("pill-match").textContent = list.length;
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
  c.innerHTML = "";
  const add = (label, onRemove) => {
    const t = document.createElement("div");
    t.className = "af-tag";
    t.innerHTML = `${label} <button onclick="${onRemove}"><span class="material-symbols-outlined">close</span></button>`;
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
  inp.value = "";
  document.getElementById("clearSearch").classList.remove("show");
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
  document.getElementById("clearSearch").classList.toggle("show", v.length > 0);
  hideSugg();
  sDebounce = setTimeout(() => {
    searchQ = v.trim();
    render();
    updateActiveTags();
  }, 260);
}
function showSugg() {
  if (!document.getElementById("searchInput").value)
    document.getElementById("suggestions").classList.add("show");
}
function hideSugg() {
  document.getElementById("suggestions").classList.remove("show");
}
function applyQ(t) {
  document.getElementById("searchInput").value = t;
  document.getElementById("clearSearch").classList.add("show");
  searchQ = t;
  render();
  updateActiveTags();
  hideSugg();
}

/* ─── View ───────────────────────────────── */
function setView(v) {
  activeView = v;
  document
    .getElementById("cardsGrid")
    .classList.toggle("list-view", v === "list");
  document.getElementById("vGrid").classList.toggle("active", v === "grid");
  document.getElementById("vList").classList.toggle("active", v === "list");
}

/* ─── Favourite ──────────────────────────── */
function toggleFav(id, btn) {
  const s = STUDENTS.find((x) => x.id === id);
  s.fav = !s.fav;
  btn.classList.toggle("on", s.fav);
  const card = document.querySelector(`.profile-card[data-id="${id}"]`);
  card.classList.toggle("favorited", s.fav);
  const favTotal = STUDENTS.filter((x) => x.fav).length;
  document.getElementById("pill-fav").textContent = favTotal;
  toast(
    s.fav
      ? `${s.name} disimpan ke favorit ❤️`
      : `${s.name} dihapus dari favorit`,
    s.fav ? "success" : "info",
  );
  if (activeFilter === "favorit") render();
}

/* ─── Refresh ────────────────────────────── */
function refreshMatches() {
  const btn = document.getElementById("refreshBtn");
  btn.classList.add("spinning");
  toast("Memperbarui rekomendasi…", "info");
  setTimeout(() => {
    btn.classList.remove("spinning");
    toast("Rekomendasi diperbarui!", "success");
  }, 1600);
}

/* ─── Load more ──────────────────────────── */
function loadMore() {
  const btn = document.getElementById("loadBtn");
  btn.classList.add("loading");
  btn.lastElementChild.textContent = "Memuat…";
  setTimeout(() => {
    btn.classList.remove("loading");
    btn.lastElementChild.textContent = "Muat lebih banyak";
    toast("Semua rekomendasi sudah ditampilkan", "info");
  }, 1400);
}

/* ─── Modal ──────────────────────────────── */
function openModal(id) {
  activeModal = id;
  const s = STUDENTS.find((x) => x.id === id);
  document.getElementById("mAvatar").src = s.avatar;
  document.getElementById("mAvatar").alt = s.name;
  document.getElementById("mName").textContent = s.name;
  document.getElementById("mUni").textContent = s.uni;
  document.getElementById("mMsg").value = "";
  document.getElementById("modalOverlay").classList.add("show");
  setTimeout(() => document.getElementById("mMsg").focus(), 300);
}
function closeModal() {
  document.getElementById("modalOverlay").classList.remove("show");
}
function closeModalOut(e) {
  if (e.target === document.getElementById("modalOverlay")) closeModal();
}
function sendInvite() {
  const s = STUDENTS.find((x) => x.id === activeModal);
  closeModal();
  toast(`Undangan dikirim ke ${s.name}! 🎉`, "success");
}

/* ─── Scroll progress ────────────────────── */
window.addEventListener(
  "scroll",
  () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById("prog").style.width =
      h > 0 ? (window.scrollY / h) * 100 + "%" : "0%";
  },
  { passive: true },
);

/* ─── Keyboard shortcuts ─────────────────── */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    document.getElementById("searchInput").focus();
  }
});

/* ─── Init ───────────────────────────────── */
render();
