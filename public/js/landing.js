/* ── Navbar scroll effect ── */
const navbar = document.getElementById("navbar");
const backToTop = document.getElementById("backToTop");

window.addEventListener(
  "scroll",
  () => {
    const scrollY = window.scrollY;

    // Navbar
    navbar.classList.toggle("scrolled", scrollY > 20);

    // Back to top
    backToTop.classList.toggle("visible", scrollY > 400);

    // Active nav link
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");
    let current = "";
    sections.forEach((s) => {
      if (scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  },
  { passive: true },
);

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        // Animate counters if inside stats
        if (
          e.target.classList.contains("stat-item") ||
          e.target.closest(".stats")
        ) {
          e.target.querySelectorAll("[data-target]").forEach(animateCounter);
        }
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);

document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

// Also observe stat items directly
document.querySelectorAll(".stat-item").forEach((el) => {
  const obs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        entries[0].target
          .querySelectorAll("[data-target]")
          .forEach(animateCounter);
        obs.unobserve(entries[0].target);
      }
    },
    { threshold: 0.5 },
  );
  obs.observe(el);
});

/* ── Counter animation ── */
function animateCounter(el) {
  const display = el.dataset.display;
  if (display) {
    el.textContent = display;
    return;
  }

  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || "";
  const duration = 1800;
  const start = performance.now();

  function format(n) {
    if (target >= 1000) return Math.round(n / 1000) + suffix;
    return Math.round(n) + suffix;
  }

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    el.textContent = format(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ── Mobile menu ── */
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  const btn = document.getElementById("hamburger");
  const isOpen = menu.classList.toggle("open");
  btn.classList.toggle("open", isOpen);
}

function closeMenu() {
  document.getElementById("mobileMenu").classList.remove("open");
  document.getElementById("hamburger").classList.remove("open");
}

// Close menu on outside click
document.addEventListener("click", (e) => {
  const menu = document.getElementById("mobileMenu");
  const btn = document.getElementById("hamburger");
  if (
    menu.classList.contains("open") &&
    !menu.contains(e.target) &&
    !btn.contains(e.target)
  ) {
    closeMenu();
  }
});

/* ── Smooth scroll helpers ── */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/* ── FAQ accordion ── */
function toggleFaq(questionEl) {
  const item = questionEl.closest(".faq-item");
  const isOpen = item.classList.contains("open");

  // Close all
  document.querySelectorAll(".faq-item.open").forEach((el) => {
    if (el !== item) el.classList.remove("open");
  });

  item.classList.toggle("open", !isOpen);
}

/* ── Toast ── */
function showToast(msg, duration = 3000) {
  const toast = document.getElementById("toast");
  document.getElementById("toastMsg").textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}

/* ── CTA / Nav buttons interaction ── */
document
  .querySelectorAll(".btn-primary, .btn-white, .btn-nav-fill")
  .forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (!btn.getAttribute("href") || btn.getAttribute("href") === "#") {
        e.preventDefault();
        showToast("Mengarahkan ke halaman pendaftaran…");
      }
    });
  });

/* ── Feature card click hint ── */
document.querySelectorAll(".fitur-card").forEach((card) => {
  card.addEventListener("click", () => {
    const name = card.querySelector("h3")?.textContent;
    showToast(`${name} — Segera hadir!`);
  });
});

/* ── Social buttons ── */
document.querySelectorAll(".social-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    showToast("Hubungi kami di media sosial!");
  });
});

/* ── Scroll progress indicator ── */
const progressBar = document.createElement("div");
progressBar.style.cssText = `
      position: fixed; top: 0; left: 0; height: 2px; z-index: 200;
      background: linear-gradient(90deg, #4a40e0, #a855f7);
      width: 0%; transition: width 0.1s linear; pointer-events: none;
    `;
document.body.appendChild(progressBar);

window.addEventListener(
  "scroll",
  () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (window.scrollY / docH) * 100;
    progressBar.style.width = pct + "%";
  },
  { passive: true },
);

/* ── Hero blob parallax ── */
window.addEventListener(
  "mousemove",
  (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    const blobs = document.querySelectorAll(".blob");
    blobs.forEach((blob, i) => {
      const factor = (i + 1) * 10;
      blob.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  },
  { passive: true },
);
