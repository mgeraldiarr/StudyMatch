/* ─── StudyMatch Schedule Logic (Dynamic, Connected & Responsive) ─── */

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

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const curDate = new Date();
const state = {
  year: curDate.getFullYear(),
  month: curDate.getMonth(),
  weekOffset: 0,
  view: "monthly",
  selected: null,
  sessions: window.__INITIAL_SESSIONS__ || [],
  recaps: window.__INITIAL_RECAPS__ || [],
  resources: [], // Starts clean for fresh accounts
};

/* ─── Helpers ─── */
function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function firstDayOfMonth(y, m) { return new Date(y, m, 1).getDay(); }
function pad(n) { return n < 10 ? "0" + n : "" + n; }
function dateStr(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }
function daySessions(y, m, d) { const ds = dateStr(y, m, d); return state.sessions.filter(s => s.date === ds); }
function todayStr() { const t = new Date(); return dateStr(t.getFullYear(), t.getMonth(), t.getDate()); }
function isToday(y, m, d) { return dateStr(y, m, d) === todayStr(); }

/**
 * Generate a valid Google Meet link with 3-4-3 format (e.g. abc-defg-hij)
 */
function generateMeetLink() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const part = (len) => Array.from({length: len}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `https://meet.google.com/${part(3)}-${part(4)}-${part(3)}`;
}

/* ─── Toast ─── */
function toast(message, type = 'info') {
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = message;
  t.style.cssText = `
    position: fixed; bottom: 2rem; right: 2rem; background: var(--surface-card, #1e1b4b);
    color: var(--text-primary, #fff); padding: 0.75rem 1.5rem; border-radius: var(--radius-md, 8px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.2); z-index: 300; font-weight: 500;
    border-left: 4px solid var(--primary, #6366f1); animation: slideIn 0.3s ease;
  `;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transition = 'opacity 0.3s';
    setTimeout(() => t.remove(), 300);
  }, 2500);
}

/* ─── Render View (Monthly vs Weekly) ─── */
function renderView() {
  const grid = document.getElementById("calGrid");
  if (!grid) return;

  if (state.view === "weekly") {
    renderWeekly(grid);
  } else {
    renderMonthly(grid);
  }

  updateUpcoming();
}

/* ─── Render Monthly Calendar ─── */
function renderMonthly(grid) {
  grid.classList.remove("weekly");
  const { year, month } = state;

  const title = document.getElementById("calTitle");
  if (title) {
    title.innerHTML = `<span class="material-symbols-outlined">calendar_today</span> ${MONTHS[month]} ${year}`;
  }

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
    const dots = sess.map(s => s.meet ? 'primary' : 'secondary').slice(0, 3);
    html += `<div class="cal-cell${today ? " today" : ""}${isSelected ? " selected" : ""}" data-date="${ds}" tabindex="0" onclick="selectDate('${ds}')">
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
}

/* ─── Render Weekly Calendar ─── */
function renderWeekly(grid) {
  grid.classList.add("weekly");

  // Calculate start of week (Monday) based on curDate + weekOffset
  const now = new Date();
  const baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + state.weekOffset * 7);
  const dayOfWeek = baseDate.getDay(); // 0 is Sunday, 1 is Monday, ...
  const distanceToMonday = (dayOfWeek + 6) % 7; // Monday = 0, Sunday = 6

  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - distanceToMonday);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(d);
  }

  const startDate = weekDates[0];
  const endDate = weekDates[6];

  const title = document.getElementById("calTitle");
  if (title) {
    title.innerHTML = `<span class="material-symbols-outlined">view_week</span> Pekan: ${startDate.getDate()} ${MONTHS[startDate.getMonth()]} – ${endDate.getDate()} ${MONTHS[endDate.getMonth()]} ${endDate.getFullYear()}`;
  }

  const dayNames = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  let html = "";

  weekDates.forEach((dateObj, idx) => {
    const y = dateObj.getFullYear();
    const m = dateObj.getMonth();
    const d = dateObj.getDate();
    const ds = dateStr(y, m, d);
    const today = isToday(y, m, d);
    const daySess = state.sessions.filter(s => s.date === ds);

    let sessHtml = "";
    if (daySess.length === 0) {
      sessHtml = `<div class="week-empty">Tidak ada sesi</div>`;
    } else {
      sessHtml = daySess.map(s => `
        <div class="week-session" onclick="openAgenda(${JSON.stringify(s).replace(/"/g, '&quot;')})">
          <div class="week-sess-top">
            <span class="week-sess-time">${escapeHtml(s.time)}</span>
            <span class="week-sess-name">${escapeHtml(s.name)}</span>
            ${s.meet ? '<span class="material-symbols-outlined" style="font-size:14px;color:var(--primary);">videocam</span>' : ''}
          </div>
          <div style="font-size:0.7rem;color:var(--text-muted);">${s.duration} mnt · ${escapeHtml(Array.isArray(s.participants) ? s.participants.join(', ') : s.participants)}</div>
        </div>
      `).join("");
    }

    html += `
      <div class="week-day${today ? ' today' : ''}">
        <div class="week-day-header" onclick="selectDate('${ds}')">
          <span class="week-day-name">${dayNames[idx]}</span>
          <span class="week-day-date">${d} ${MONTHS[m].substring(0, 3)}</span>
          <span class="week-day-sess-count">${daySess.length} sesi</span>
        </div>
        <div class="week-day-body">${sessHtml}</div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

async function selectDate(ds) {
  state.selected = ds;
  const sess = state.sessions.filter(s => s.date === ds);
  if (sess.length > 0) {
    openAgenda(sess[0]);
  } else {
    const shouldCreate = await (window.showConfirmModal ? window.showConfirmModal({
      title: "Jadwalkan Sesi Belajar",
      message: `Tidak ada sesi belajar pada tanggal ${ds}. Ingin buat sesi belajar baru untuk tanggal ini?`,
      confirmText: "Buat Sesi",
      cancelText: "Nanti Saja",
      type: "primary",
      icon: "calendar_add_on"
    }) : Promise.resolve(confirm(`Tidak ada sesi belajar pada tanggal ${ds}. Ingin buat sesi baru?`)));

    if (shouldCreate) {
      openCreateSession();
      const dInput = document.getElementById("sessDate");
      if (dInput) dInput.value = ds;
    }
  }
}

function prevMonth() {
  if (state.view === "weekly") {
    state.weekOffset--;
  } else {
    state.month--;
    if (state.month < 0) { state.month = 11; state.year--; }
  }
  renderView();
}

function nextMonth() {
  if (state.view === "weekly") {
    state.weekOffset++;
  } else {
    state.month++;
    if (state.month > 11) { state.month = 0; state.year++; }
  }
  renderView();
}

function setView(v) {
  state.view = v;
  document.querySelectorAll(".view-toggle-btn").forEach((b, i) => {
    b.classList.toggle("active", (i === 0 && v === "monthly") || (i === 1 && v === "weekly"));
  });
  renderView();
}

/* ─── Upcoming Sessions ─── */
function updateUpcoming() {
  const list = document.getElementById("sessionsList");
  if (!list) return;

  const today = todayStr();
  const upcoming = state.sessions.filter(s => s.date >= today).slice(0, 4);

  if (upcoming.length === 0) {
    list.innerHTML = `
      <div style="text-align:center;padding:24px 8px;color:var(--text-muted);font-size:0.875rem;">
        <span class="material-symbols-outlined" style="font-size:32px;margin-bottom:4px;color:var(--primary);">event_available</span>
        <p style="margin:0;">Belum ada sesi mendatang.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = upcoming.map(s => `
    <div class="session-item" style="padding:10px 12px;border-radius:8px;background:rgba(0,0,0,0.03);margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="font-weight:600;font-size:0.875rem;">${escapeHtml(s.name)}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);">${escapeHtml(s.date)} · ${escapeHtml(s.time)} (${s.duration} mnt)</div>
      </div>
      <button class="btn btn-sm btn-ghost" onclick="openAgenda(${JSON.stringify(s).replace(/"/g, '&quot;')})">
        <span class="material-symbols-outlined" style="font-size:16px;">visibility</span>
      </button>
    </div>
  `).join("");
}

/* ─── Agenda Modal ─── */
function openAgenda(s) {
  const overlay = document.getElementById("agendaOverlay");
  const panel = document.getElementById("agendaPanel");
  const content = document.getElementById("agendaContent");
  if (!overlay || !panel || !content) return;

  const participants = Array.isArray(s.participants) ? s.participants.join(", ") : "Partner Belajar";
  const meetButton = s.meetLink ? `
    <a href="${escapeHtml(s.meetLink)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="display:inline-flex;align-items:center;gap:6px;margin-top:12px;">
      <span class="material-symbols-outlined" style="font-size:16px;">videocam</span> Gabung Google Meet
    </a>
  ` : '';

  content.innerHTML = `
    <div style="font-size:1.125rem;font-weight:700;margin-bottom:8px;">${escapeHtml(s.name)}</div>
    <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:6px;">
      <span class="material-symbols-outlined" style="font-size:16px;vertical-align:middle;">calendar_month</span> ${escapeHtml(s.date)} pukul ${escapeHtml(s.time)} (${s.duration} menit)
    </p>
    <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:12px;">
      <span class="material-symbols-outlined" style="font-size:16px;vertical-align:middle;">people</span> Peserta: ${escapeHtml(participants)}
    </p>
    ${meetButton}
    <div style="margin-top:20px;border-top:1px solid rgba(0,0,0,0.08);padding-top:12px;display:flex;justify-content:space-between;">
      <button class="btn btn-sm btn-ghost" style="color:#ef4444;" onclick="deleteSession(${s.id})">
        <span class="material-symbols-outlined" style="font-size:16px;">delete</span> Hapus Sesi
      </button>
      <button class="btn btn-sm btn-ghost" onclick="closeAgenda()">Tutup</button>
    </div>
  `;

  overlay.classList.add("show");
  panel.classList.add("show");
}

function closeAgenda() {
  document.getElementById("agendaOverlay")?.classList.remove("show");
  document.getElementById("agendaPanel")?.classList.remove("show");
}

/* ─── Delete Session ─── */
async function deleteSession(id) {
  const confirmed = await (window.showConfirmModal ? window.showConfirmModal({
    title: "Hapus Sesi Belajar",
    message: "Apakah kamu yakin ingin menghapus sesi belajar ini dari jadwal?",
    confirmText: "Hapus Sesi",
    cancelText: "Batal",
    type: "danger",
    icon: "delete_forever"
  }) : Promise.resolve(confirm("Hapus sesi belajar ini?")));

  if (!confirmed) return;

  try {
    const res = await fetch(`/schedule/sessions/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
    });

    const data = await res.json();
    if (res.ok && data.success) {
      state.sessions = state.sessions.filter(s => s.id !== id);
      closeAgenda();
      renderView();
      switchTab(document.querySelector(".tab-btn.active") ? Array.from(document.querySelectorAll(".tab-btn")).indexOf(document.querySelector(".tab-btn.active")) : 0);
      toast(data.message || "Sesi belajar dihapus.", "success");
    } else {
      toast(data.message || "Gagal menghapus sesi.", "error");
    }
  } catch (err) {
    toast("Terjadi kesalahan jaringan.", "error");
  }
}

/* ─── Create Session Modal ─── */
function openCreateSession() {
  document.getElementById("sessionOverlay")?.classList.add("show");
  document.getElementById("sessionPanel")?.classList.add("show");
  if (state.selected) {
    const dInput = document.getElementById("sessDate");
    if (dInput) dInput.value = state.selected;
  }
}

function closeCreateSession() {
  document.getElementById("sessionOverlay")?.classList.remove("show");
  document.getElementById("sessionPanel")?.classList.remove("show");
}

async function createSession(e) {
  e.preventDefault();
  const name = document.getElementById("sessName")?.value.trim();
  const date = document.getElementById("sessDate")?.value;
  const time = document.getElementById("sessTime")?.value;
  const duration = parseInt(document.getElementById("sessDuration")?.value || 60);
  const participants = document.getElementById("sessParticipants")?.value.trim();
  const hasMeet = document.getElementById("sessMeet")?.checked;
  const btn = document.getElementById("btnSubmitSession");

  if (!name || !date || !time) {
    toast("Lengkapi nama, tanggal, dan waktu sesi!", "error");
    return;
  }

  if (btn) btn.disabled = true;

  // Generate valid Google Meet link
  const meetingLink = hasMeet ? generateMeetLink() : null;
  const participantsList = participants ? participants.split(",").map(p => p.trim()) : ["Partner Belajar"];

  try {
    const res = await fetch("/schedule/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
      body: JSON.stringify({
        title: name,
        date,
        time,
        duration,
        meeting_link: meetingLink,
        participants: participantsList,
      }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      state.sessions.push(data.session);
      closeCreateSession();
      document.getElementById("sessionForm")?.reset();
      renderView();
      switchTab(document.querySelector(".tab-btn.active") ? Array.from(document.querySelectorAll(".tab-btn")).indexOf(document.querySelector(".tab-btn.active")) : 0);
      toast("Sesi berhasil dijadwalkan! 📅", "success");
    } else {
      toast(data.message || "Gagal membuat sesi.", "error");
    }
  } catch (err) {
    toast("Terjadi kesalahan jaringan.", "error");
  } finally {
    if (btn) btn.disabled = false;
  }
}

/* ─── Tabs ─── */
function switchTab(idx) {
  document.querySelectorAll(".tab-btn").forEach((b, i) => b.classList.toggle("active", i === idx));
  const container = document.getElementById("tabContent");
  if (!container) return;
  if (idx === 0) renderRecapTab(container);
  else if (idx === 1) renderResourcesTab(container);
  else renderPerformanceTab(container);
}

function renderRecapTab(container) {
  if (state.recaps.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 48px 16px; background: var(--surface-card, #fff); border-radius: var(--radius-lg, 12px); border: 1px dashed var(--border-light, #e2e8f0); margin-top: 12px;">
        <span class="material-symbols-outlined" style="font-size: 48px; color: var(--primary, #6366f1); margin-bottom: 8px;">history_edu</span>
        <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 6px;">Belum Ada Riwayat Rekap</h4>
        <p style="font-size: 0.875rem; color: var(--text-muted, #64748b); max-width: 400px; margin: 0 auto 16px;">Sesi belajar yang telah selesai akan otomatis dirangkum dan ditampilkan di sini sebagai catatan evaluasimu.</p>
        <button class="btn btn-primary btn-sm" onclick="openCreateSession()">Buat Sesi Belajar Pertama</button>
      </div>
    `;
    return;
  }

  container.innerHTML = `<div class="recap-grid" id="recapGrid">
    ${state.recaps.map(r => `
      <div class="recap-card" role="button" tabindex="0" style="padding:16px;border-radius:8px;background:var(--surface-card, #fff);box-shadow:0 1px 3px rgba(0,0,0,0.05);margin-bottom:12px;">
        <div class="recap-meta" style="margin-bottom:6px;">
          <span class="recap-tag ${r.tagColor}" style="padding:2px 8px;border-radius:4px;font-size:0.75rem;background:rgba(99,102,241,0.1);color:var(--primary,#6366f1);">${escapeHtml(r.tag)}</span>
          <span class="recap-date" style="font-size:0.75rem;color:var(--text-muted);margin-left:6px;">${escapeHtml(r.date)}</span>
        </div>
        <h6 class="recap-title" style="font-weight:600;font-size:0.9375rem;margin:4px 0;">${escapeHtml(r.title)}</h6>
        <p class="recap-desc" style="font-size:0.875rem;color:var(--text-muted);margin-bottom:8px;">${escapeHtml(r.desc)}</p>
      </div>
    `).join("")}
  </div>`;
}

function renderResourcesTab(container) {
  if (state.resources.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 48px 16px; background: var(--surface-card, #fff); border-radius: var(--radius-lg, 12px); border: 1px dashed var(--border-light, #e2e8f0); margin-top: 12px;">
        <span class="material-symbols-outlined" style="font-size: 48px; color: var(--secondary, #06b6d4); margin-bottom: 8px;">folder_shared</span>
        <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 6px;">Belum Ada Sumber Daya Bersama</h4>
        <p style="font-size: 0.875rem; color: var(--text-muted, #64748b); max-width: 400px; margin: 0 auto 16px;">Catatan, file PDF, slide materi, dan link belajar yang dibagikan dengan partner akan tersimpan rapi di sini.</p>
        <button class="btn btn-secondary btn-sm" onclick="toast('Fitur unggah berkas kelompok segera aktif!', 'info')">Unggah Materi</button>
      </div>
    `;
    return;
  }

  container.innerHTML = `<div class="resources-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;">
    ${state.resources.map(r => `
      <div class="resource-card" style="padding:14px;border-radius:8px;background:var(--surface-card, #fff);box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <div class="resource-card-title" style="font-weight:600;font-size:0.875rem;margin-bottom:4px;">${escapeHtml(r.title)}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);">${escapeHtml(r.type)} · ${escapeHtml(r.size)} · ${escapeHtml(r.uploader)}</div>
      </div>
    `).join("")}
  </div>`;
}

function renderPerformanceTab(container) {
  const totalSessions = state.sessions.length;
  const today = todayStr();
  const completedSessions = state.sessions.filter(s => s.date < today).length;
  const totalMinutes = state.sessions.reduce((acc, s) => acc + (s.duration || 60), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  container.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-top:12px;">
      <div style="padding:16px;border-radius:8px;background:var(--surface-card, #fff);text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <div style="font-size:1.5rem;font-weight:700;color:var(--primary,#6366f1);">${completedSessions}/${totalSessions}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);">Sesi Selesai</div>
      </div>
      <div style="padding:16px;border-radius:8px;background:var(--surface-card, #fff);text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <div style="font-size:1.5rem;font-weight:700;color:#10b981;">${totalHours} jam</div>
        <div style="font-size:0.75rem;color:var(--text-muted);">Total Belajar</div>
      </div>
      <div style="padding:16px;border-radius:8px;background:var(--surface-card, #fff);text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <div style="font-size:1.5rem;font-weight:700;color:#f59e0b;">${totalSessions > 0 ? '★ 5.0' : '★ Baru'}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);">Rating Rata-rata</div>
      </div>
    </div>
    ${totalSessions === 0 ? `
      <div style="text-align:center;padding:24px 16px;color:var(--text-muted);font-size:0.875rem;">
        Statistik performa dan jam belajar kelompokmu akan terakumulasi otomatis seiring berjalannya sesi belajar.
      </div>
    ` : ''}
  `;
}

// Global exposure
window.renderView = renderView;
window.setView = setView;
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;
window.selectDate = selectDate;
window.openAgenda = openAgenda;
window.closeAgenda = closeAgenda;
window.openCreateSession = openCreateSession;
window.closeCreateSession = closeCreateSession;
window.createSession = createSession;
window.deleteSession = deleteSession;
window.switchTab = switchTab;
window.toast = toast;

// Init
document.addEventListener("DOMContentLoaded", () => {
  renderView();
  switchTab(0);
});