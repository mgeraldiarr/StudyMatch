// Notification page logic
document.addEventListener("DOMContentLoaded", () => {
  const notifCards = document.querySelectorAll(".notif-card");
  const filterTabs = document.querySelectorAll(".filter-tab");
  const btnMarkAll = document.getElementById("btnMarkAll");
  const emptyState = document.getElementById("emptyState");
  const notifsList = document.getElementById("notifsList");
  const moreMenuModal = document.getElementById("moreMenuModal");
  let activeCardForMenu = null;

  // Search input filter
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      let visibleCount = 0;
      notifCards.forEach(card => {
        const text = card.querySelector(".notif-text").textContent.toLowerCase();
        const title = card.querySelector(".notif-title").textContent.toLowerCase();
        if (text.includes(q) || title.includes(q)) {
          card.style.display = "flex";
          visibleCount++;
        } else {
          card.style.display = "none";
        }
      });
      toggleEmptyState(visibleCount === 0);
    });
  }

  // Filter Tabs
  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filterValue = tab.getAttribute("data-filter");
      let visibleCount = 0;

      notifCards.forEach(card => {
        const type = card.getAttribute("data-type");
        if (filterValue === "all" || type === filterValue) {
          card.style.display = "flex";
          visibleCount++;
        } else {
          card.style.display = "none";
        }
      });
      toggleEmptyState(visibleCount === 0);
    });
  });

  // Action Buttons inside notification cards
  notifsList.addEventListener("click", (e) => {
    const btnAccept = e.target.closest(".btn-accept");
    const btnDecline = e.target.closest(".btn-decline");
    const btnJoin = e.target.closest(".btn-join");
    const btnQuickReply = e.target.closest(".btn-quick-reply");
    const btnMore = e.target.closest(".btn-more-menu");

    if (btnAccept) {
      const card = btnAccept.closest(".notif-card");
      card.remove();
      toast("Permintaan belajar berhasil diterima!", "success");
      checkEmptyList();
    }
    if (btnDecline) {
      const card = btnDecline.closest(".notif-card");
      card.remove();
      toast("Permintaan belajar ditolak", "info");
      checkEmptyList();
    }
    if (btnJoin) {
      toast("Menghubungkan ke ruang belajar...", "info");
    }
    if (btnQuickReply) {
      toast("Membuka jendela balas cepat...", "info");
    }
    if (btnMore) {
      activeCardForMenu = btnMore.closest(".notif-card");
      moreMenuModal.classList.add("show");
    }
  });

  // Modal actions
  moreMenuModal.addEventListener("click", (e) => {
    const item = e.target.closest(".modal-item");
    if (!item) {
      moreMenuModal.classList.remove("show");
      return;
    }
    const action = item.getAttribute("data-action");
    if (activeCardForMenu) {
      if (action === "mark-read") {
        activeCardForMenu.setAttribute("data-read", "true");
        activeCardForMenu.classList.add("read");
        const badge = activeCardForMenu.querySelector(".notif-badge");
        if (badge) badge.remove();
        toast("Notifikasi ditandai telah dibaca", "success");
      } else if (action === "archive") {
        activeCardForMenu.remove();
        toast("Notifikasi diarsipkan", "success");
      } else if (action === "snooze") {
        activeCardForMenu.remove();
        toast("Notifikasi ditunda selama 1 jam", "info");
      } else if (action === "delete") {
        activeCardForMenu.remove();
        toast("Notifikasi dihapus", "info");
      }
      checkEmptyList();
    }
    moreMenuModal.classList.remove("show");
  });

  // Mark all as read
  if (btnMarkAll) {
    btnMarkAll.addEventListener("click", () => {
      const unreadCards = document.querySelectorAll(".notif-card[data-read='false']");
      unreadCards.forEach(card => {
        card.setAttribute("data-read", "true");
        card.classList.add("read");
        const badge = card.querySelector(".notif-badge");
        if (badge) badge.remove();
      });
      toast("Semua notifikasi ditandai telah dibaca", "success");
    });
  }

  function toggleEmptyState(show) {
    if (show) {
      emptyState.style.display = "flex";
      notifsList.style.display = "none";
    } else {
      emptyState.style.display = "none";
      notifsList.style.display = "flex";
    }
  }

  function checkEmptyList() {
    const remaining = document.querySelectorAll(".notif-card");
    if (remaining.length === 0) {
      toggleEmptyState(true);
    }
  }
});
