// Schedule page logic
document.addEventListener("DOMContentLoaded", () => {
  // Calendar View Toggles
  const viewToggleBtns = document.querySelectorAll(".view-toggle-btn");
  viewToggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      viewToggleBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      toast(`Mengubah tampilan ke ${btn.textContent.trim()}`, "info");
    });
  });

  // Calendar cells interaction
  const calCells = document.querySelectorAll(".cal-cell:not(.dimmed)");
  calCells.forEach(cell => {
    cell.addEventListener("click", () => {
      const day = cell.querySelector("span").textContent.trim();
      toast(`Membuka agenda untuk tanggal ${day} Mei 2024`, "info");
    });
  });

  // Integration buttons
  const integrationBtns = document.querySelectorAll(".integration-icon-btn");
  integrationBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.querySelector("img").alt;
      toast(`Menghubungkan ke ${name}...`, "info");
    });
  });

  // Recap cards
  const recapCards = document.querySelectorAll(".recap-card");
  recapCards.forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".recap-dl")) {
        e.stopPropagation();
        const fileName = card.querySelector(".recap-file-name").textContent;
        toast(`Mengunduh berkas: ${fileName}`, "success");
        return;
      }
      const title = card.querySelector(".recap-title").textContent;
      toast(`Membuka ringkasan: ${title}`, "info");
    });
  });

  // Tabs navigation
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      toast(`Menampilkan tab: ${btn.textContent.trim()}`, "info");
    });
  });

  // Create Session Button
  const btnCreate = document.querySelector(".btn-create");
  if (btnCreate) {
    btnCreate.addEventListener("click", () => {
      toast("Fitur membuat sesi belajar baru sedang disiapkan!", "info");
    });
  }
});
