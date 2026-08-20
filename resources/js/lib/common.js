/* ─── StudyMatch Common Utilities & Layout Logic ─── */

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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

/**
 * Modern, accessible Custom Confirmation Dialog (Replaces native window.confirm)
 * 
 * @param {Object} options
 * @param {string} options.title - Dialog title
 * @param {string} options.message - Dialog message
 * @param {string} [options.confirmText='Lanjutkan'] - Confirmation button label
 * @param {string} [options.cancelText='Batal'] - Cancel button label
 * @param {string} [options.type='primary'] - 'primary' | 'danger' | 'warning' | 'info'
 * @param {string} [options.icon='help_outline'] - Material icon name
 * @returns {Promise<boolean>}
 */
function showConfirmModal({
  title = "Konfirmasi",
  message = "",
  confirmText = "Lanjutkan",
  cancelText = "Batal",
  type = "primary",
  icon = "help_outline"
} = {}) {
  return new Promise((resolve) => {
    const existing = document.getElementById("customConfirmModal");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "customConfirmModal";
    overlay.className = "custom-confirm-overlay";

    const typeColors = {
      primary: { bg: "rgba(74, 64, 224, 0.12)", color: "#4a40e0", btnBg: "var(--gradient, #4a40e0)" },
      danger: { bg: "rgba(229, 62, 62, 0.12)", color: "#e53e3e", btnBg: "#e53e3e" },
      warning: { bg: "rgba(245, 158, 11, 0.12)", color: "#f59e0b", btnBg: "#f59e0b" },
      info: { bg: "rgba(6, 182, 212, 0.12)", color: "#06b6d4", btnBg: "#06b6d4" },
    };
    const conf = typeColors[type] || typeColors.primary;

    overlay.innerHTML = `
      <div class="custom-confirm-card" role="dialog" aria-modal="true" aria-labelledby="confirmTitle">
        <div class="custom-confirm-header">
          <div class="custom-confirm-icon" style="background:${conf.bg}; color:${conf.color};">
            <span class="material-symbols-outlined">${icon}</span>
          </div>
          <div>
            <h3 id="confirmTitle" class="custom-confirm-title">${escapeHtml(title)}</h3>
            <p class="custom-confirm-desc">${escapeHtml(message)}</p>
          </div>
        </div>
        <div class="custom-confirm-actions">
          <button type="button" class="btn btn-ghost custom-confirm-cancel" id="btnConfirmCancel">${escapeHtml(cancelText)}</button>
          <button type="button" class="btn custom-confirm-ok" id="btnConfirmOk" style="background:${conf.btnBg}; color:#fff;">${escapeHtml(confirmText)}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.classList.add("show");
      overlay.querySelector("#btnConfirmOk")?.focus();
    });

    const cleanup = (result) => {
      overlay.classList.remove("show");
      document.removeEventListener("keydown", handleKeydown);
      setTimeout(() => overlay.remove(), 200);
      resolve(result);
    };

    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        cleanup(false);
      }
    };
    document.addEventListener("keydown", handleKeydown);

    overlay.querySelector("#btnConfirmOk").addEventListener("click", () => cleanup(true));
    overlay.querySelector("#btnConfirmCancel").addEventListener("click", () => cleanup(false));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cleanup(false);
    });
  });
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
    const modals = document.querySelectorAll(".modal-overlay.show, .modal-backdrop.show, .custom-confirm-overlay.show");
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

/* ── Expose to global for onclick/oninput/onsubmit handlers ── */
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.toast = toast;
window.showConfirmModal = showConfirmModal;
window.clearSearchInput = clearSearchInput;
