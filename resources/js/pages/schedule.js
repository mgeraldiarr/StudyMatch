/* ─── Data ─── */
const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const state = {
  year: 2024,
  month: 4,
  view: "monthly",
  selected: null,
  sessions: [
    {
      id: 1,
      name: "Kalkulus Lanjut III",
      date: "2024-05-06",
      time: "10:00",
      duration: 90,
      participants: ["Sarah", "Liam"],
      avatars: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAh5E0pLcmDhjvQpbxyhoC_CdvbrXvjIfYRLOhzJLN7lM18K-g7pjd5C0RetKxIfMZoBbBDZcegxtH8JnCZQCMz2jaWJvNpOEHvmu1Pq1g_-mFIe8poONAKBfZPDtYNlhXyz5Lgav9H2O9mm0Rvh8FVA8Gz2QWTfbkxq9oP7H5SI1pCses_Da1JBbNiRlrT527sUbN68CMNh80e3b7Q9OWwW5toxjbYTCG7QCOPD8n-CQOTYX9xHh_6Vu9rwjrdH7xuxCY6J36YVXM",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBAyJXWMbkBK0IZDBrs2rOd6HFFLPcJ6S66Cb1EDStsAErxWOypRyEimO2bDpVWagBl0-i_8cWd9W4Y9s9aM2ywUnGmB7eX3n59hi42z2w0YNceOIBAKf6iLcgsIB9gJomUCYiAeA6BEOckDHBQhBs1K2QS-YWDEF2ZuMDT-wkMAS1ADISjMzRuV6LSJpeMScsyJEomDMqiPZHUSP1HGzVZgWmDMAJz0UOplce0xuRmCPYgJik2Dh7a8n0lDo39wt_R5Q3bzXsYYqg",
      ],
      meet: true,
      meetLink: "https://meet.google.com/abc-123",
    },
    {
      id: 2,
      name: "Sejarah Seni Modern",
      date: "2024-05-07",
      time: "14:00",
      duration: 60,
      participants: ["Dr. Elena"],
      avatars: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCtqWGVfOlyxx6i-aS6HsNy1Yilmi-6IgPJTQ7_OmwXe-Jmj8bl2RSRCv2jSlCE3o9ByLR6eTspEROtQ_AxKVjazAAn9_OEtteTyJT0mMgfexEl2Cn5QM5Bq3vaGYcjhcCz1i8Ayc6S0Fvm_83r0LDjcgtnY5rMLOTlFgKv9jePoxgWKEbGsIMlYel_V6FZNcqqysqITefhvUEWroq9_MGhsMRhmjMS0-qKcnVsZs10Wv9H8JGbHBEI7JsNkmmwL21jMoUyJVqrM3M",
      ],
      meet: false,
      location: "Perpus Pusat R.204",
    },
    {
      id: 3,
      name: "Fisika Dasar I",
      date: "2024-05-10",
      time: "09:00",
      duration: 120,
      participants: ["Rina", "Budi"],
      avatars: [],
      meet: true,
      meetLink: "https://meet.google.com/def-456",
    },
  ],
  recaps: [
    {
      id: 1,
      tag: "Fisika Dasar 1",
      tagColor: "secondary",
      date: "May 04, 2024",
      title: "Dasar Mekanika Kuantum",
      desc: "Membahas eksperimen celah ganda dan dualisme gelombang-partikel. Semua merasa paham kecuali pada derivasi akhir...",
      file: "Catatan_Rekap.pdf",
    },
    {
      id: 2,
      tag: "Arsitektur",
      tagColor: "tertiary",
      date: "May 02, 2024",
      title: "Pengaruh Gerakan Bauhaus",
      desc: "Mengulas prinsip arsitektur Walter Gropius dan pendekatan fungsionalis dalam desain modern...",
      file: "Transkrip_Seminar.docx",
    },
    {
      id: 3,
      tag: "Kalkulus",
      tagColor: "secondary",
      date: "Apr 28, 2024",
      title: "Integral Lipat & Aplikasi",
      desc: "Menyelesaikan soal-soal integral lipat dua dan tiga dengan berbagai batas integrasi...",
      file: "Latihan_Integral.pdf",
    },
    {
      id: 4,
      tag: "Kimia Organik",
      tagColor: "tertiary",
      date: "Apr 25, 2024",
      title: "Reaksi Substitusi Nukleofilik",
      desc: "Pembahasan mekanisme SN1 dan SN2 beserta faktor-faktor yang mempengaruhi laju reaksi...",
      file: "Rangkuman_Reaksi.pdf",
    },
    {
      id: 5,
      tag: "Pemrograman",
      tagColor: "secondary",
      date: "Apr 22, 2024",
      title: "Struktur Data Dasar",
      desc: "Diskusi tentang array, linked list, stack, dan queue dengan implementasi Python...",
      file: "Kode_Contoh.py",
    },
    {
      id: 6,
      tag: "Biologi",
      tagColor: "tertiary",
      date: "Apr 20, 2024",
      title: "Mekanisme Transpor Membran",
      desc: "Mempelajari difusi, osmosis, transpor aktif, dan endositosis pada membran sel...",
      file: "Diagram_Transpor.png",
    },
  ],
  resources: [
    { id: 1, title: "Catatan Kalkulus — Integral Lipat", type: "PDF", size: "2.4 MB", uploader: "Budi Santoso", date: "3 hari lalu" },
    { id: 2, title: "Video Pembelajaran — Mekanika Kuantum", type: "Video", size: "45 MB", uploader: "Dr. Elena", date: "5 hari lalu" },
    { id: 3, title: "Template LaTeX — Makalah Ilmiah", type: "ZIP", size: "1.1 MB", uploader: "Sarah Connor", date: "1 minggu lalu" },
    { id: 4, title: "Flashcard — Anatomi Jantung", type: "Anki", size: "856 KB", uploader: "Rina Wijaya", date: "1 minggu lalu" },
    { id: 5, title: "Soal-Soal — Struktur Data", type: "PDF", size: "3.7 MB", uploader: "Liam Neeson", date: "2 minggu lalu" },
  ],
  performance: {
    totalSessions: 12,
    completedSessions: 9,
    totalHours: 18,
    avgRating: 4.6,
    topSubject: "Kalkulus",
    partnerCount: 5,
    weeklyHours: [4, 6, 3, 5, 7, 4, 2],
    weeklyLabels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    subjectBreakdown: [
      { name: "Kalkulus", hours: 8, color: "var(--primary)" },
      { name: "Fisika", hours: 5, color: "var(--secondary)" },
      { name: "Kimia", hours: 3, color: "var(--accent)" },
      { name: "Lainnya", hours: 2, color: "var(--tertiary)" },
    ],
  },
};

let sessionIdCounter = 4;

/* ─── Helpers ─── */
function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function firstDayOfMonth(y, m) { return new Date(y, m, 1).getDay(); }
function pad(n) { return n < 10 ? "0" + n : "" + n; }
function dateStr(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }
function daySessions(y, m, d) { const ds = dateStr(y, m, d); return state.sessions.filter(s => s.date === ds); }
function todayStr() { const t = new Date(); return dateStr(t.getFullYear(), t.getMonth(), t.getDate()); }
function isToday(y, m, d) { return dateStr(y, m, d) === todayStr(); }

/* ─── Toast Notifikasi Sederhana ─── */
function toast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 2rem; right: 2rem; background: var(--surface-card);
    color: var(--text-primary); padding: 0.75rem 1.5rem; border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg); z-index: 300; font-weight: 500;
    border-left: 4px solid var(--primary); animation: slideIn 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/* ─── Render Calendar ─── */
function renderCalendar() {
  const { year, month } = state;
  const grid = document.getElementById("calGrid");
  grid.classList.remove("weekly");
  const title = document.getElementById("calTitle");
  title.innerHTML = `<span class="material-symbols-outlined">calendar_today</span> ${MONTHS[month]} ${year}`;

  const days = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);
  const prevDays = daysInMonth(year, month - 1 < 0 ? 11 : month - 1);

  let html = "";
  DAYS.forEach(d => { html += `<div class="cal-day-label">${d}</div>`; });

  for (let i = startDay - 1; i >= 0; i--) {
    const pDay = prevDays - i;
    html += `<div class="cal-cell dimmed">${pDay}</div>`;
  }

  for (let d = 1; d <= days; d++) {
    const today = isToday(year, month, d);
    const sess = daySessions(year, month, d);
    const ds = dateStr(year, month, d);
    const isSelected = state.selected === ds;
    const dots = sess.map(s => s.meet ? 'primary' : (s.location ? 'secondary' : 'tertiary')).slice(0, 3);
    html += `<div class="cal-cell${today ? " today" : ""}${isSelected ? " selected" : ""}" data-date="${ds}" tabindex="0">
      <span>${d}</span>
      ${dots.map(c => `<div class="cal-dot ${c}"></div>`).join("")}
    </div>`;
  }

  const totalCells = startDay + days;
  const remaining = 7 - (totalCells % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      html += `<div class="cal-cell dimmed">${i}</div>`;
    }
  }

  grid.innerHTML = html;

  grid.querySelectorAll(".cal-cell:not(.dimmed)").forEach(cell => {
    cell.addEventListener("click", () => {
      grid.querySelectorAll(".cal-cell.selected").forEach(c => c.classList.remove("selected"));
      cell.classList.add("selected");
      state.selected = cell.dataset.date;
      openAgenda(state.selected);
    });
  });
}

/* ─── Render Week View ─── */
function renderWeek() {
  const title = document.getElementById("calTitle");
  document.getElementById("calGrid").classList.add("weekly");

  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + mondayOffset);
  const endOfWeek = new Date(monday);
  endOfWeek.setDate(monday.getDate() + 6);
  const monthStart = MONTHS[monday.getMonth()];
  const monthEnd = MONTHS[endOfWeek.getMonth()];

  title.innerHTML = `<span class="material-symbols-outlined">view_week</span> ${monthStart} ${monday.getDate()} — ${monthEnd} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;

  const grid = document.getElementById("calGrid");
  let html = "";

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const y = d.getFullYear();
    const m = d.getMonth();
    const day = d.getDate();
    const ds = dateStr(y, m, day);
    const isTodayFlag = isToday(y, m, day);
    const sess = state.sessions.filter(s => s.date === ds);
    const dayName = DAYS[i];
    const dateObj = new Date(y, m, day);
    const dateStrLocal = dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short" });

    html += `<div class="week-day${isTodayFlag ? " today" : ""}">
      <div class="week-day-header" onclick="openAgenda('${ds}')">
        <div class="week-day-name">${dayName}</div>
        <div class="week-day-date">${dateStrLocal}</div>
        <div class="week-day-sess-count">${sess.length} sesi</div>
      </div>
      <div class="week-day-body">
        ${sess.length === 0 ? '<div class="week-empty">Tidak ada sesi</div>' : ""}
        ${sess.map(s => `
          <div class="week-session" onclick="openAgenda('${ds}')">
            <div class="week-sess-top">
              <span class="week-sess-time">${s.time}</span>
              <span class="week-sess-name">${s.name}</span>
              ${s.meet ? '<span class="week-sess-badge">Meet</span>' : ""}
            </div>
            <div class="week-sess-meta">
              <span class="material-symbols-outlined">schedule</span> ${s.duration}m
              <span class="week-sess-with">${s.participants.join(", ")}</span>
            </div>
            ${s.location ? `<div class="week-sess-loc"><span class="material-symbols-outlined">location_on</span> ${s.location}</div>` : ""}
          </div>
        `).join("")}
      </div>
    </div>`;
  }

  grid.innerHTML = html;
}

/* ─── Agenda Modal ─── */
function openAgenda(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const sessions = daySessions(y, m - 1, d);
  const recaps = state.recaps;

  const overlay = document.getElementById("agendaOverlay");
  const panel = document.getElementById("agendaPanel");
  const content = document.getElementById("agendaContent");

  const dateObj = new Date(y, m - 1, d);
  const dayName = DAYS[dateObj.getDay()];
  const monthName = MONTHS[m - 1];

  let sessionHtml = sessions.length === 0
    ? `<p class="agenda-empty">Tidak ada sesi pada hari ini.</p>`
    : sessions.map(s => `
      <div class="agenda-session">
        <div class="agenda-sess-left">
          <span class="material-symbols-outlined" style="color:var(--primary);font-size:18px">radio_button_checked</span>
          <div>
            <div class="agenda-sess-name">${s.name}</div>
            <div class="agenda-sess-time">${s.time} · ${s.duration}m</div>
          </div>
        </div>
        <div class="agenda-sess-right">
          ${s.meet ? '<span class="agenda-badge meet">Meet</span>' : ""}
          ${s.location ? `<span class="agenda-sess-loc"><span class="material-symbols-outlined" style="font-size:14px">location_on</span> ${s.location}</span>` : ""}
        </div>
      </div>`).join("");

  content.innerHTML = `
    <div class="agenda-date">${dayName}, ${d} ${monthName} ${y}</div>
    <div class="agenda-section-title">Sesi Belajar</div>
    ${sessionHtml}
    <div class="agenda-section-title" style="margin-top:1.25rem">Rekap Tersedia</div>
    <p class="agenda-empty">${recaps.length > 0 ? recaps.length + " rekap tersedia. Buka tab Riwayat untuk melihat." : "Belum ada rekap."}</p>
  `;

  overlay.classList.add("show");
  panel.classList.add("show");
}

function closeAgenda() {
  document.getElementById("agendaOverlay").classList.remove("show");
  document.getElementById("agendaPanel").classList.remove("show");
}

/* ─── Navigation ─── */
function prevMonth() {
  state.month--;
  if (state.month < 0) { state.month = 11; state.year--; }
  renderView();
}
function nextMonth() {
  state.month++;
  if (state.month > 11) { state.month = 0; state.year++; }
  renderView();
}
function renderView() {
  if (state.view === "monthly") renderCalendar();
  else renderWeek();
  updateUpcoming();
}

/* ─── View Toggle ─── */
function setView(mode) {
  state.view = mode;
  document.querySelectorAll(".view-toggle-btn").forEach(b => b.classList.remove("active"));
  if (mode === "monthly") {
    document.querySelector(".view-toggle-btn:first-child").classList.add("active");
  } else {
    document.querySelector(".view-toggle-btn:last-child").classList.add("active");
  }
  renderView();
}

/* ─── Upcoming Sessions (diperbaiki) ─── */
function updateUpcoming() {
  const list = document.getElementById("sessionsList");
  const badge = document.getElementById("upcomingBadge");
  const todayStr = todayStr();
  const todaySessions = state.sessions.filter(s => s.date === todayStr);
  badge.textContent = todaySessions.length + " Hari Ini";

  // Tampilkan sesi yang akan datang (tanggal >= hari ini), urutkan, maks 3
  const upcoming = state.sessions
    .filter(s => s.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 3);

  list.innerHTML = upcoming.map(s => `
    <div class="session-card ${s.meet ? 'primary' : 'secondary'}" role="button" tabindex="0">
      <div class="session-top">
        <span class="session-name">${s.name}</span>
        ${s.meet ? '<span class="session-live">LIVE</span>' : ""}
      </div>
      <div class="session-participants">
        <div class="avatar-stack">
          ${s.avatars.map(a => `<img alt="" src="${a}" />`).join("")}
        </div>
        <span class="session-with">bersama ${s.participants.join(" & ")}</span>
      </div>
      <div class="session-footer">
        <div class="session-meta">
          <span class="material-symbols-outlined">schedule</span> ${s.duration}m
        </div>
        ${s.location
          ? `<div class="session-meta"><span class="material-symbols-outlined">location_on</span> ${s.location}</div>`
          : `<a class="session-join" href="${s.meetLink || '#'}" target="_blank" rel="noopener">Gabung Meet <span class="material-symbols-outlined">open_in_new</span></a>`}
      </div>
    </div>
  `).join("");

  // Tambahkan event listener untuk session-join yang tidak memiliki link
  list.querySelectorAll('.session-join[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      toast("Fitur Meet akan segera hadir.", "info");
    });
  });
}

/* ─── Create Session Modal ─── */
function openCreateSession() {
  document.getElementById("sessionOverlay").classList.add("show");
  document.getElementById("sessionPanel").classList.add("show");
  if (state.selected) {
    document.getElementById("sessDate").value = state.selected;
  }
}
function closeCreateSession() {
  document.getElementById("sessionOverlay").classList.remove("show");
  document.getElementById("sessionPanel").classList.remove("show");
}
function createSession(e) {
  e.preventDefault();
  const name = document.getElementById("sessName").value.trim();
  const date = document.getElementById("sessDate").value;
  const time = document.getElementById("sessTime").value;
  const duration = parseInt(document.getElementById("sessDuration").value);
  const participants = document.getElementById("sessParticipants").value.trim();
  const hasMeet = document.getElementById("sessMeet").checked;

  if (!name || !date || !time) {
    toast("Lengkapi nama, tanggal, dan waktu sesi!", "error");
    return;
  }

  state.sessions.push({
    id: sessionIdCounter++,
    name,
    date,
    time,
    duration: duration || 60,
    participants: participants ? participants.split(",").map(p => p.trim()) : [],
    avatars: [],
    meet: hasMeet,
    meetLink: hasMeet ? `https://meet.google.com/${Math.random().toString(36).substring(2,8)}` : null,
  });

  closeCreateSession();
  document.getElementById("sessionForm").reset();
  renderView();
  toast("Sesi berhasil dibuat! ✓", "success");
}

/* ─── Tabs ─── */
function switchTab(idx) {
  document.querySelectorAll(".tab-btn").forEach((b, i) => b.classList.toggle("active", i === idx));
  const container = document.getElementById("tabContent");
  if (idx === 0) renderRecapTab(container);
  else if (idx === 1) renderResourcesTab(container);
  else renderPerformanceTab(container);
}

function renderRecapTab(container) {
  container.innerHTML = `<div class="recap-grid" id="recapGrid">
    ${state.recaps.map(r => `
      <div class="recap-card" role="button" tabindex="0">
        <div class="recap-meta">
          <span class="recap-tag ${r.tagColor}">${r.tag}</span>
          <span class="recap-date">${r.date}</span>
        </div>
        <h6 class="recap-title">${r.title}</h6>
        <p class="recap-desc">${r.desc}</p>
        <div class="recap-footer">
          <div class="recap-file">
            <span class="material-symbols-outlined">description</span>
            <span class="recap-file-name">${r.file}</span>
          </div>
          <button class="recap-dl" data-file="${r.file}">
            <span class="material-symbols-outlined">download</span>
          </button>
        </div>
      </div>
    `).join("")}
  </div>`;

  container.querySelectorAll(".recap-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".recap-dl")) {
        const file = e.target.closest(".recap-dl").dataset.file;
        toast(`Mengunduh: ${file}`, "success");
        return;
      }
      toast(`Membuka ringkasan...`, "info");
    });
  });
}

function renderResourcesTab(container) {
  const icons = { PDF: "picture_as_pdf", Video: "play_circle", ZIP: "folder_zip", Anki: "memory" };
  container.innerHTML = `<div class="resources-grid">
    ${state.resources.map(r => `
      <div class="resource-card">
        <div class="resource-card-icon ${r.type.toLowerCase()}">
          <span class="material-symbols-outlined">${icons[r.type] || "description"}</span>
        </div>
        <div class="resource-card-body">
          <div class="resource-card-title">${r.title}</div>
          <div class="resource-card-meta">
            <span class="resource-card-type">${r.type}</span>
            <span class="resource-card-sep">·</span>
            <span>${r.size}</span>
            <span class="resource-card-sep">·</span>
            <span>${r.uploader}</span>
          </div>
          <div class="resource-card-date">${r.date}</div>
        </div>
        <button class="resource-card-dl" onclick="toast('Mengunduh ${r.title}...','success')">
          <span class="material-symbols-outlined">download</span>
        </button>
      </div>
    `).join("")}
  </div>`;
}

function renderPerformanceTab(container) {
  const p = state.performance;
  const maxW = Math.max(...p.weeklyHours);
  const totalSubjectHours = p.subjectBreakdown.reduce((a, b) => a + b.hours, 0);

  container.innerHTML = `
    <div class="perf-grid">
      <div class="perf-stat-card">
        <span class="material-symbols-outlined perf-stat-icon">check_circle</span>
        <div class="perf-stat-val">${p.completedSessions}/${p.totalSessions}</div>
        <div class="perf-stat-label">Sesi Selesai</div>
      </div>
      <div class="perf-stat-card">
        <span class="material-symbols-outlined perf-stat-icon">schedule</span>
        <div class="perf-stat-val">${p.totalHours} jam</div>
        <div class="perf-stat-label">Total Belajar</div>
      </div>
      <div class="perf-stat-card">
        <span class="material-symbols-outlined perf-stat-icon">star</span>
        <div class="perf-stat-val">${p.avgRating}</div>
        <div class="perf-stat-label">Rating Rata-rata</div>
      </div>
      <div class="perf-stat-card">
        <span class="material-symbols-outlined perf-stat-icon">groups</span>
        <div class="perf-stat-val">${p.partnerCount}</div>
        <div class="perf-stat-label">Partner Aktif</div>
      </div>
    </div>

    <div class="perf-chart-section">
      <h4 class="perf-chart-title">Jam Belajar per Hari (Pekan Ini)</h4>
      <div class="perf-bars">
        ${p.weeklyLabels.map((label, i) => `
          <div class="perf-bar-col">
            <div class="perf-bar-label-top">${p.weeklyHours[i]}j</div>
            <div class="perf-bar-track">
              <div class="perf-bar-fill" style="height:${(p.weeklyHours[i] / maxW) * 100}%"></div>
            </div>
            <div class="perf-bar-label">${label}</div>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="perf-subject-section">
      <h4 class="perf-chart-title">Breakdown per Mata Kuliah</h4>
      <div class="perf-subject-list">
        ${p.subjectBreakdown.map(s => `
          <div class="perf-subject-row">
            <span class="perf-subject-name">${s.name}</span>
            <div class="perf-subject-track">
              <div class="perf-subject-fill" style="width:${(s.hours / totalSubjectHours) * 100}%;background:${s.color}"></div>
            </div>
            <span class="perf-subject-hours">${s.hours} jam</span>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="perf-top-subject">
      <span class="material-symbols-outlined" style="color:var(--accent)">military_tech</span>
      Mata Kuliah Teraktif: <strong>${p.topSubject}</strong>
    </div>
  `;
}

/* ─── Integration Buttons ─── */
document.querySelectorAll(".integration-icon-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const service = btn.dataset.service || "Layanan";
    toast(`Menghubungkan ke ${service}...`, "info");
  });
});

/* ─── Expose to Global ─── */
window.renderView = renderView;
window.setView = setView;
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;
window.openAgenda = openAgenda;
window.closeAgenda = closeAgenda;
window.openCreateSession = openCreateSession;
window.closeCreateSession = closeCreateSession;
window.createSession = createSession;
window.switchTab = switchTab;
window.toast = toast;

/* ─── Init ─── */
document.addEventListener("DOMContentLoaded", () => {
  renderCalendar();
  updateUpcoming();
  switchTab(0);
});