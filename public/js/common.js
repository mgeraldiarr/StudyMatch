/* ─── StudyMatch Common Utilities & Layout Logic ─── */

// Mobile Sidebar Toggle
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sbOverlay");
  if (sidebar && overlay) {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
  }
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sbOverlay");
  if (sidebar && overlay) {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  }
}

// Global Dynamic Toast Notifications
let toastTimer;
function toast(msg, type = "success") {
  let el = document.getElementById("toastEl");
  if (!el) {
    el = document.createElement("div");
    el.id = "toastEl";
    el.className = "toast";
    el.innerHTML = `
      <span class="material-symbols-outlined t-icon" id="tIcon">check_circle</span>
      <span id="tMsg"></span>
    `;
    document.body.appendChild(el);
  }
  
  const icon = document.getElementById("tIcon");
  const msgEl = document.getElementById("tMsg");
  
  const iconMap = {
    success: "check_circle",
    info: "info",
    error: "error"
  };
  
  msgEl.textContent = msg;
  icon.textContent = iconMap[type] || "check_circle";
  
  // Update class lists for coloring
  icon.className = `material-symbols-outlined t-icon ${type}`;
  
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove("show");
  }, 3200);
}

// Keyboard Shortcuts and Input Handling
document.addEventListener("keydown", (e) => {
  // Ctrl + K to focus topbar search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  }
  
  // Escape to close overlays and active modal
  if (e.key === "Escape") {
    closeSidebar();
    
    // Close connect modal if exists (discovery.js)
    if (typeof closeModal === "function") {
      closeModal();
    }
    
    // Close other modals if they exist
    const modals = document.querySelectorAll(".modal-overlay.show, .modal-backdrop.show");
    modals.forEach(m => m.classList.remove("show"));
  }
});

// Clear Search Input helper
function clearSearchInput() {
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearch");
  if (searchInput) {
    searchInput.value = "";
    if (clearBtn) clearBtn.classList.remove("show");
    searchInput.focus();
    
    // Trigger oninput event manually if functions are defined
    if (typeof onSearch === "function") onSearch("");
    if (typeof filterConvs === "function") filterConvs("");
    if (typeof searchThreads === "function") searchThreads("");
  }
}
