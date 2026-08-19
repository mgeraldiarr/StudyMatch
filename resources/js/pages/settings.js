function saveSetting(key, value) {
  const s = JSON.parse(localStorage.getItem("sm-settings") || "{}");
  s[key] = value;
  localStorage.setItem("sm-settings", JSON.stringify(s));
}

function loadSetting(key, fallback) {
  const s = JSON.parse(localStorage.getItem("sm-settings") || "{}");
  return s[key] !== undefined ? s[key] : fallback;
}

function applyExamMode(enabled) {
  document.body.classList.toggle("exam-mode", enabled);
  const banner = document.getElementById("examBanner");
  if (banner) {
    banner.style.display = enabled ? "flex" : "none";
  }
}

function restoreCheckboxes() {
  document.querySelectorAll(".toggle-wrap input[type=checkbox]").forEach((cb) => {
    const row = cb.closest(".toggle-row");
    if (!row) return;
    const label = row.querySelector(".toggle-info p:first-child");
    if (!label) return;
    const key = "toggle-" + label.textContent.trim().toLowerCase().replace(/\s+/g, "-");
    const val = loadSetting(key, cb.defaultChecked !== undefined ? cb.defaultChecked : cb.checked);
    cb.checked = val;
  });
}

function restoreNotifCheckboxes() {
  document.querySelectorAll(".notif-table .cb").forEach((cb) => {
    const row = cb.closest("tr");
    if (!row) return;
    const title = row.querySelector(".notif-title");
    if (!title) return;
    const channel = cb.closest("td").cellIndex === 1 ? "email" : "push";
    const key = "notif-" + title.textContent.trim().toLowerCase().replace(/\s+/g, "-") + "-" + channel;
    const val = loadSetting(key, cb.defaultChecked !== undefined ? cb.defaultChecked : cb.checked);
    cb.checked = val;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  /* ─── 1. Privacy toggles: restore + save ─── */
  restoreCheckboxes();

  document.querySelectorAll(".toggle-wrap:not(.exam-toggle) input").forEach((toggle) => {
    toggle.addEventListener("change", (e) => {
      const row = toggle.closest(".toggle-row");
      const label = row.querySelector(".toggle-info p:first-child").textContent;
      const state = e.target.checked ? "diaktifkan" : "dinonaktifkan";
      const key = "toggle-" + label.trim().toLowerCase().replace(/\s+/g, "-");
      saveSetting(key, e.target.checked);
      toast(`${label} telah ${state}`, "success");
    });
  });

  /* ─── 2. Notification checkboxes: restore + save ─── */
  restoreNotifCheckboxes();

  document.querySelectorAll(".notif-table .cb").forEach((cb) => {
    cb.addEventListener("change", (e) => {
      const row = e.target.closest("tr");
      const title = row.querySelector(".notif-title").textContent;
      const channel = e.target.closest("td").cellIndex === 1 ? "email" : "push";
      const key = "notif-" + title.trim().toLowerCase().replace(/\s+/g, "-") + "-" + channel;
      saveSetting(key, e.target.checked);
      const state = e.target.checked ? "diaktifkan" : "dinonaktifkan";
      toast(`Notifikasi ${title} — ${channel === "email" ? "Email" : "Push"} ${state}`, "success");
    });
  });

  /* ─── 3. Language selector: restore + save ─── */
  const langSelect = document.querySelector(".pref-card select");
  if (langSelect) {
    const savedLang = loadSetting("language", "id");
    langSelect.value = savedLang === "en" ? "English" : "Bahasa Indonesia";
    langSelect.addEventListener("change", (e) => {
      const val = e.target.value === "English" ? "en" : "id";
      saveSetting("language", val);
      toast(`Bahasa diganti ke ${e.target.value}`, "info");
    });
  }

  /* ─── 4. Exam mode: restore + save ─── */
  const examToggle = document.querySelector(".exam-toggle input");
  if (examToggle) {
    const savedExam = loadSetting("exam-mode", false);
    examToggle.checked = savedExam;
    applyExamMode(savedExam);

    examToggle.addEventListener("change", (e) => {
      saveSetting("exam-mode", e.target.checked);
      applyExamMode(e.target.checked);
      if (e.target.checked) {
        toast("Mode Musim Ujian diaktifkan! Notifikasi dibatasi.", "success");
      } else {
        toast("Mode Musim Ujian dinonaktifkan.", "info");
      }
    });
  }

  /* ─── 5. Scroll reveal ─── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
});
