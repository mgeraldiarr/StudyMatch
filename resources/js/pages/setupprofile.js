/* ── Scroll progress ── */
window.addEventListener(
  "scroll",
  () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const prog = document.getElementById("scroll-progress");
    if (prog) {
      prog.style.width = h > 0 ? (window.scrollY / h) * 100 + "%" : "0%";
    }
  },
  { passive: true },
);

/* ── Reveal on scroll ── */
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        revealObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

/* ── Availability grid builder ── */
const TIMES = ["Pagi", "Siang", "Malam"];
// Default state: [time][day] — 0=off,1=on
const availState = [
  [0, 1, 1, 0, 1, 0, 0],
  [1, 0, 1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 0, 0],
];

let isDragging = false;
let dragValue = null;

function buildGrid() {
  const grid = document.getElementById("avail-grid");
  if (!grid) return;
  // Remove previously injected rows (keep first 8 header cells)
  while (grid.children.length > 8) grid.lastChild.remove();

  TIMES.forEach((time, ti) => {
    const label = document.createElement("div");
    label.className = "avail-time-label";
    label.textContent = time;
    grid.appendChild(label);

    for (let di = 0; di < 7; di++) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "avail-cell " + (availState[ti][di] ? "on" : "off");
      cell.dataset.ti = ti;
      cell.dataset.di = di;
      cell.addEventListener("mousedown", (e) => {
        e.preventDefault();
        isDragging = true;
        dragValue = !availState[ti][di];
        toggleCell(ti, di);
      });
      cell.addEventListener("mouseover", () => {
        if (isDragging) toggleCellTo(ti, di, dragValue);
      });
      cell.addEventListener("click", (e) => {
        e.preventDefault();
      });
      grid.appendChild(cell);
    }
  });
}

document.addEventListener("mouseup", () => (isDragging = false));

function toggleCell(ti, di) {
  availState[ti][di] = availState[ti][di] ? 0 : 1;
  refreshCell(ti, di);
  updateCompletion();
}
function toggleCellTo(ti, di, val) {
  availState[ti][di] = val ? 1 : 0;
  refreshCell(ti, di);
  updateCompletion();
}
function refreshCell(ti, di) {
  const grid = document.getElementById("avail-grid");
  if (!grid) return;
  const cells = grid.querySelectorAll(".avail-cell");
  const idx = ti * 7 + di;
  if (cells[idx]) {
    cells[idx].className = "avail-cell " + (availState[ti][di] ? "on" : "off");
  }
}
function setAllAvail(val) {
  for (let t = 0; t < 3; t++)
    for (let d = 0; d < 7; d++) availState[t][d] = val ? 1 : 0;
  buildGrid();
  updateCompletion();
}
function setWeekdays() {
  for (let t = 0; t < 3; t++)
    for (let d = 0; d < 7; d++) availState[t][d] = d < 5 ? 1 : 0;
  buildGrid();
  updateCompletion();
}
buildGrid();

/* ── Bio char counter ── */
const bioEl = document.getElementById("f-bio");
if (bioEl) {
  bioEl.addEventListener("input", function () {
    const len = this.value.length;
    const el = document.getElementById("bio-chars");
    if (el) {
      el.textContent = len + " / 160";
      if (len > 160) {
        this.value = this.value.slice(0, 160);
        el.textContent = "160 / 160";
      }
      el.style.color = len > 140 ? "var(--error)" : "var(--text-muted)";
    }
  });
}

/* ── Mark filled ── */
function markFilled(input) {
  if (input) {
    input.classList.toggle("is-filled", input.value.trim().length > 0);
  }
}

/* ── Completion meter ── */
function updateCompletion() {
  let score = 0,
    total = 5;

  const fName = document.getElementById("f-name");
  const fUniv = document.getElementById("f-univ");
  const fMajor = document.getElementById("f-major");
  const finishBtn = document.getElementById("finish-btn");
  const compFill = document.getElementById("completion-fill");
  const pctLabel = document.getElementById("pct-label");

  if (fName && fName.value.trim()) score++;
  if (fUniv && fUniv.value.trim()) score++;
  if (fMajor && fMajor.value.trim()) score++;
  if (document.querySelector('input[name="learning_style"]:checked')) score++;

  const chips = document.querySelectorAll("#course-chips .chip").length;
  if (chips > 0) score++;

  const pct = Math.round((score / total) * 100);
  if (compFill) compFill.style.width = pct + "%";
  if (pctLabel) pctLabel.textContent = pct + "%";

  if (finishBtn) {
    finishBtn.disabled = pct < 40; // Allow finishing when core details are set
  }
}
updateCompletion();

/* ── Photo Upload & Preview ── */
let selectedAvatarFile = null;

function triggerAvatarUpload() {
  const fileInput = document.getElementById("avatar-file-input");
  if (fileInput) {
    fileInput.click();
  }
}

function previewAvatar(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  // Validate format
  const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!validTypes.includes(file.type)) {
    showToast("Format gambar harus JPG, PNG, atau WEBP!");
    return;
  }

  // Validate size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    showToast("Ukuran foto maksimal 2MB!");
    return;
  }

  selectedAvatarFile = file;

  const preview = document.getElementById("avatar-img-preview");
  if (preview) {
    preview.src = URL.createObjectURL(file);
  }

  showToast("Foto profil dipilih ✓");
}

/* ── Course chips ── */
function removeChip(btn) {
  const chip = btn.closest(".chip");
  if (!chip) return;
  chip.style.transform = "scale(0)";
  chip.style.opacity = "0";
  chip.style.transition = "transform 0.2s, opacity 0.2s";
  setTimeout(() => {
    chip.remove();
    updateCompletion();
  }, 200);
}

function showCourseInput() {
  const btn = document.getElementById("add-course-btn");
  const wrap = document.getElementById("course-input-wrap");
  if (btn) btn.style.display = "none";
  if (wrap) {
    wrap.classList.add("show");
    setTimeout(() => document.getElementById("course-input")?.focus(), 50);
  }
}

function hideCourseInput() {
  const btn = document.getElementById("add-course-btn");
  const wrap = document.getElementById("course-input-wrap");
  const input = document.getElementById("course-input");
  if (wrap) wrap.classList.remove("show");
  if (btn) btn.style.display = "";
  if (input) input.value = "";
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

function addCourse() {
  const input = document.getElementById("course-input");
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;

  // Check duplicate
  const existing = Array.from(document.querySelectorAll("#course-chips .chip"))
    .map((c) => {
      const txt = c.querySelector(".chip-text")?.textContent || c.childNodes[0]?.textContent || "";
      return txt.trim().toLowerCase();
    });

  if (existing.includes(val.toLowerCase())) {
    showToast("Mata kuliah sudah ada dalam daftar.");
    return;
  }

  const chip = document.createElement("div");
  chip.className = "chip";
  chip.innerHTML = `
    <span class="chip-text">${escapeHtml(val)}</span>
    <button type="button" class="chip-remove" onclick="removeChip(this)" title="Hapus mata kuliah">
      <span class="material-symbols-outlined">close</span>
    </button>
  `;

  document.getElementById("course-chips")?.appendChild(chip);
  hideCourseInput();
  updateCompletion();
}

function handleCourseKey(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    addCourse();
  }
  if (e.key === "Escape") hideCourseInput();
}

/* ── Goal chips ── */
function toggleGoal(btn) {
  btn.classList.toggle("selected");
}

/* ── Toast ── */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  const msgEl = document.getElementById("toast-msg");
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

/* ── Auto save ── */
function autoSave() {
  showToast("Draft tersimpan ✓");
}

function getCsrfToken() {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
}

/* ── Finish handler ── */
async function handleFinish() {
  const name = document.getElementById("f-name")?.value.trim();
  const univ = document.getElementById("f-univ")?.value.trim();
  const major = document.getElementById("f-major")?.value.trim() || "";
  const bio = document.getElementById("f-bio")?.value.trim() || "";
  const learningStyle = document.querySelector('input[name="learning_style"]:checked')?.value || null;

  if (!name) {
    showToast("Nama tampilan wajib diisi!");
    document.getElementById("f-name")?.focus();
    return;
  }
  if (!univ) {
    showToast("Universitas wajib diisi!");
    document.getElementById("f-univ")?.focus();
    return;
  }

  // Collect courses
  const courseChips = document.querySelectorAll("#course-chips .chip");
  const courses = Array.from(courseChips)
    .map((c) => {
      const textSpan = c.querySelector(".chip-text");
      if (textSpan) return textSpan.textContent.trim();
      return (c.childNodes[0]?.textContent || "").trim();
    })
    .filter((c) => c.length > 0);

  // Collect goals
  const goalChips = document.querySelectorAll("#goal-chips .goal-chip.selected");
  const goals = Array.from(goalChips).map((g) => g.textContent.trim());

  const btn = document.getElementById("finish-btn");
  if (btn) {
    btn.classList.add("loading");
    btn.disabled = true;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("university", univ);
  formData.append("major", major);
  formData.append("bio", bio);
  if (learningStyle) {
    formData.append("learning_style", learningStyle);
  }
  if (selectedAvatarFile) {
    formData.append("avatar", selectedAvatarFile);
  }
  courses.forEach((c, idx) => {
    formData.append(`courses[${idx}]`, c);
  });
  goals.forEach((g, idx) => {
    formData.append(`goals[${idx}]`, g);
  });
  formData.append("weekly_availability", JSON.stringify(availState));

  try {
    const res = await fetch("/setup-profile", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
      body: formData,
    });

    const data = await res.json();
    if (btn) {
      btn.classList.remove("loading");
      btn.disabled = false;
    }

    if (res.ok && data.success) {
      showToast("Profil tersimpan! Menuju halaman discovery…");
      setTimeout(() => {
        window.location.href = data.redirect || "/dashboard/discovery";
      }, 1000);
    } else {
      showToast(data.message || "Gagal menyimpan profil.");
    }
  } catch (err) {
    if (btn) {
      btn.classList.remove("loading");
      btn.disabled = false;
    }
    showToast("Terjadi kesalahan koneksi server. Coba lagi.");
  }
}

/* ── Keyboard shortcut: Ctrl+S to save ── */
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    autoSave();
  }
});

/* ── Expose to global for onclick/oninput handlers ── */
window.buildGrid = buildGrid;
window.toggleCell = toggleCell;
window.toggleCellTo = toggleCellTo;
window.refreshCell = refreshCell;
window.setAllAvail = setAllAvail;
window.setWeekdays = setWeekdays;
window.markFilled = markFilled;
window.updateCompletion = updateCompletion;
window.removeChip = removeChip;
window.showCourseInput = showCourseInput;
window.hideCourseInput = hideCourseInput;
window.addCourse = addCourse;
window.handleCourseKey = handleCourseKey;
window.toggleGoal = toggleGoal;
window.showToast = showToast;
window.autoSave = autoSave;
window.handleFinish = handleFinish;
window.triggerAvatarUpload = triggerAvatarUpload;
window.previewAvatar = previewAvatar;
