/* ── Scroll progress ── */
window.addEventListener(
  "scroll",
  () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById("scroll-progress").style.width =
      h > 0 ? (window.scrollY / h) * 100 + "%" : "0%";
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
  // Remove previously injected rows (keep first 9 header cells)
  while (grid.children.length > 9) grid.lastChild.remove();

  TIMES.forEach((time, ti) => {
    const label = document.createElement("div");
    label.className = "avail-time-label";
    label.textContent = time;
    grid.appendChild(label);

    for (let di = 0; di < 7; di++) {
      const cell = document.createElement("button");
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
      cell.addEventListener("click", () => {});
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
  const cells = grid.querySelectorAll(".avail-cell");
  const idx = ti * 7 + di;
  cells[idx].className = "avail-cell " + (availState[ti][di] ? "on" : "off");
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
document.getElementById("f-bio").addEventListener("input", function () {
  const len = this.value.length;
  const el = document.getElementById("bio-chars");
  el.textContent = len + " / 160";
  if (len > 160) {
    this.value = this.value.slice(0, 160);
    el.textContent = "160 / 160";
  }
  el.style.color = len > 140 ? "var(--error)" : "var(--text-muted)";
});

/* ── Mark filled ── */
function markFilled(input) {
  input.classList.toggle("is-filled", input.value.trim().length > 0);
}

/* ── Completion meter ── */
function updateCompletion() {
  let score = 0,
    total = 5;

  if (document.getElementById("f-name").value.trim()) score++;
  if (document.getElementById("f-univ").value.trim()) score++;
  if (document.getElementById("f-major").value.trim()) score++;
  if (document.querySelector('input[name="learning_style"]:checked')) score++;

  const chips = document
    .getElementById("course-chips")
    .querySelectorAll(".chip").length;
  if (chips > 0) score++;

  const pct = Math.round((score / total) * 100);
  document.getElementById("completion-fill").style.width = pct + "%";
  document.getElementById("pct-label").textContent = pct + "%";

  // Enable finish btn only if >60%
  document.getElementById("finish-btn").disabled = pct < 60;
}
updateCompletion();

/* ── Course chips ── */
function removeChip(btn) {
  // find the parent .chip
  const chip = btn.closest(".chip") || btn;
  chip.style.transform = "scale(0)";
  chip.style.opacity = "0";
  chip.style.transition = "transform 0.2s, opacity 0.2s";
  setTimeout(() => {
    chip.remove();
    updateCompletion();
  }, 200);
}

function showCourseInput() {
  document.getElementById("add-course-btn").style.display = "none";
  const wrap = document.getElementById("course-input-wrap");
  wrap.classList.add("show");
  setTimeout(() => document.getElementById("course-input").focus(), 50);
}
function hideCourseInput() {
  document.getElementById("course-input-wrap").classList.remove("show");
  document.getElementById("add-course-btn").style.display = "";
  document.getElementById("course-input").value = "";
}
function addCourse() {
  const input = document.getElementById("course-input");
  const val = input.value.trim();
  if (!val) return;

  const chip = document.createElement("button");
  chip.className = "chip";
  chip.innerHTML = `${val}<button class="chip-remove" tabindex="-1"><span class="material-symbols-outlined">close</span></button>`;
  chip.addEventListener("click", function () {
    removeChip(this);
  });

  document.getElementById("course-chips").appendChild(chip);
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
  document.getElementById("toast-msg").textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

/* ── Auto save ── */
function autoSave() {
  showToast("Draft tersimpan ✓");
}

/* ── Auto-save on input (debounced) ── */
let saveDebounce;
document.querySelectorAll("input, textarea").forEach((el) => {
  el.addEventListener("input", () => {
    clearTimeout(saveDebounce);
    saveDebounce = setTimeout(() => {
      // silently save
    }, 2000);
  });
});

/* ── Finish handler ── */
function handleFinish() {
  const name = document.getElementById("f-name").value.trim();
  const univ = document.getElementById("f-univ").value.trim();
  if (!name) {
    showToast("Nama tampilan wajib diisi!");
    document.getElementById("f-name").focus();
    return;
  }
  if (!univ) {
    showToast("Universitas wajib diisi!");
    document.getElementById("f-univ").focus();
    return;
  }

  const btn = document.getElementById("finish-btn");
  btn.classList.add("loading");
  btn.disabled = true;

  setTimeout(() => {
    btn.classList.remove("loading");
    showToast("Profil tersimpan! Menuju halaman discovery…");
    setTimeout(() => {
      window.location.href = "/discovery";
    }, 1200);
  }, 2000);
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
