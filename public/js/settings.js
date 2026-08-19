// Settings page logic
document.addEventListener("DOMContentLoaded", () => {
  // Theme toggles
  const lightBtn = document.getElementById("themeLightBtn");
  const darkBtn = document.getElementById("themeDarkBtn");

  if (lightBtn && darkBtn) {
    lightBtn.addEventListener("click", () => {
      lightBtn.classList.add("active");
      lightBtn.classList.remove("inactive");
      darkBtn.classList.remove("active");
      darkBtn.classList.add("inactive");
      document.body.classList.remove("dark-mode");
      toast("Tema terang diaktifkan", "info");
    });

    darkBtn.addEventListener("click", () => {
      darkBtn.classList.add("active");
      darkBtn.classList.remove("inactive");
      lightBtn.classList.remove("active");
      lightBtn.classList.add("inactive");
      document.body.classList.add("dark-mode");
      toast("Tema gelap diaktifkan", "info");
    });
  }

  // Handle DND / Exam mode toggle
  const examToggle = document.querySelector(".exam-toggle input");
  if (examToggle) {
    examToggle.addEventListener("change", (e) => {
      if (e.target.checked) {
        toast("Mode Musim Ujian diaktifkan! Notifikasi dibatasi.", "success");
      } else {
        toast("Mode Musim Ujian dinonaktifkan.", "info");
      }
    });
  }

  // Handle other switches
  const toggles = document.querySelectorAll(".toggle-wrap:not(.exam-toggle) input");
  toggles.forEach(toggle => {
    toggle.addEventListener("change", (e) => {
      const row = toggle.closest(".toggle-row");
      const label = row.querySelector(".toggle-info p:first-child").textContent;
      const state = e.target.checked ? "diaktifkan" : "dinonaktifkan";
      toast(`${label} telah ${state}`, "success");
    });
  });
});
