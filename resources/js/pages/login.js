/* ── Animated counters (left panel) ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || "";
  const duration = 1600;
  const start = performance.now();

  function format(n) {
    if (target >= 1000) return Math.round(n / 1000) + suffix;
    return Math.round(n) + suffix;
  }
  function update(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = format(eased * target);
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Run after brief delay for visual effect
setTimeout(() => {
  document.querySelectorAll("[data-target]").forEach(animateCounter);
}, 400);

/* ── Tab switching ── */
function switchTab(tab) {
  const isLogin = tab === "login";
  document.getElementById("tab-login").classList.toggle("active", isLogin);
  document.getElementById("tab-register").classList.toggle("active", !isLogin);


  const showEl = isLogin ? "form-login" : "form-register";
  const hideEl = isLogin ? "form-register" : "form-login";

  document.getElementById("form-forgot").style.display = "none";
  document.getElementById("form-forgot").classList.remove("show");
  document.getElementById(hideEl).style.display = "none";

  const el = document.getElementById(showEl);
  el.style.display = "block";
  el.classList.remove("fade-up");
  void el.offsetWidth; // reflow
  el.classList.add("fade-up");

  clearAllMessages();
}

/* ── Forgot password ── */
function showForgot() {
  document.getElementById("form-login").style.display = "none";
  const fp = document.getElementById("form-forgot");
  fp.style.display = "flex";
  fp.classList.add("show", "fade-up");
}
function hideForgot() {
  document.getElementById("form-forgot").style.display = "none";
  document.getElementById("form-forgot").classList.remove("show");
  const el = document.getElementById("form-login");
  el.style.display = "block";
  el.classList.remove("fade-up");
  void el.offsetWidth;
  el.classList.add("fade-up");
}

/* ── Password toggle ── */
function togglePassword(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  const icon = btn.querySelector(".material-symbols-outlined");
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  icon.textContent = isHidden ? "visibility_off" : "visibility";
}

/* ── Password strength ── */
function checkStrength(input) {
  const val = input.value;
  const bar = document.getElementById("strength-bar");
  const fill = document.getElementById("strength-fill");
  const msg = document.getElementById("reg-pw-msg");

  if (!val) {
    bar.classList.remove("show");
    return;
  }
  bar.classList.add("show");

  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { w: "25%", color: "#e53e3e", label: "Terlalu lemah" },
    { w: "50%", color: "#ed8936", label: "Cukup lemah" },
    { w: "75%", color: "#ecc94b", label: "Cukup kuat" },
    { w: "100%", color: "#38a169", label: "Sangat kuat" },
  ];
  const level = levels[Math.max(0, score - 1)];
  fill.style.width = level.w;
  fill.style.background = level.color;

  msg.textContent = level.label;
  msg.className = "field-message show";
  msg.style.color = level.color;
}

/* ── Validation ── */
function showMsg(id, text, type) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = `field-message show ${type}`;
}
function clearMsg(id) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = "";
    el.className = "field-message";
  }
}
function clearAllMessages() {
  document.querySelectorAll(".field-message").forEach((el) => {
    el.textContent = "";
    el.className = "field-message";
  });
  document.querySelectorAll("input").forEach((i) => {
    i.classList.remove("is-error", "is-success");
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── Real-time validation ── */
document.getElementById("login-email").addEventListener("input", function () {
  if (!this.value) return clearMsg("login-email-msg");
  if (!validateEmail(this.value)) {
    showMsg("login-email-msg", "Format email tidak valid", "error");
    this.classList.add("is-error");
    this.classList.remove("is-success");
  } else {
    showMsg("login-email-msg", "Email valid", "success");
    this.classList.remove("is-error");
    this.classList.add("is-success");
  }
});

document.getElementById("reg-email").addEventListener("input", function () {
  if (!this.value) return clearMsg("reg-email-msg");
  if (!validateEmail(this.value)) {
    showMsg("reg-email-msg", "Format email tidak valid", "error");
    this.classList.add("is-error");
    this.classList.remove("is-success");
  } else {
    showMsg("reg-email-msg", "Email valid ✓", "success");
    this.classList.remove("is-error");
    this.classList.add("is-success");
  }
});

/* ── Loading state ── */
function setLoading(btnId, on) {
  const btn = document.getElementById(btnId);
  btn.classList.toggle("loading", on);
  btn.disabled = on;
}

/* ── Show success ── */
function showSuccess(title, sub, redirectUrl = null) {
  ["form-login", "form-register", "form-forgot"].forEach((id) => {
    document.getElementById(id).style.display = "none";
  });
  const sc = document.getElementById("success-screen");
  document.getElementById("success-title").textContent = title;
  document.getElementById("success-sub").textContent = sub;
  sc.classList.add("show");
  document.querySelectorAll(".auth-tabs")[0].style.display = "none";

  // 🔧 PERBAIKAN: Tambahkan redirect setelah 2 detik
  if (redirectUrl) {
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 2000);
  }
}

/* ── Toast ── */
function showToast(msg, type = "success") {
  const toast = document.getElementById("toast");
  const icon = document.getElementById("toast-icon");
  document.getElementById("toast-msg").textContent = msg;
  icon.textContent = type === "success" ? "check_circle" : "error";
  icon.className =
    type === "success"
      ? "material-symbols-outlined toast-icon-success"
      : "material-symbols-outlined toast-icon-error";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}

/* ── Handlers ── */
function getCsrfToken() {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
}

function handleGoogle() {
  showToast("Menghubungkan ke Google…");
  setTimeout(() => {
    showToast("Fitur login Google akan segera hadir via Socialite!", "info");
  }, 1200);
}

async function handleLogin(e) {
  e.preventDefault();
  clearAllMessages();
  const email = document.getElementById("login-email").value.trim();
  const pw = document.getElementById("login-password").value;
  const remember = document.getElementById("remember-me")?.checked || false;
  let valid = true;

  if (!email) {
    showMsg("login-email-msg", "Email tidak boleh kosong", "error");
    document.getElementById("login-email").classList.add("is-error");
    valid = false;
  } else if (!validateEmail(email)) {
    showMsg("login-email-msg", "Format email tidak valid", "error");
    document.getElementById("login-email").classList.add("is-error");
    valid = false;
  }
  if (!pw) {
    showMsg("login-pw-msg", "Password tidak boleh kosong", "error");
    document.getElementById("login-password").classList.add("is-error");
    valid = false;
  } else if (pw.length < 6) {
    showMsg("login-pw-msg", "Password minimal 6 karakter", "error");
    document.getElementById("login-password").classList.add("is-error");
    valid = false;
  }
  if (!valid) return;

  setLoading("login-submit", true);

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
      body: JSON.stringify({ email, password: pw, remember }),
    });

    const data = await res.json();
    setLoading("login-submit", false);

    if (res.ok && data.success) {
      showSuccess(
        "Selamat datang kembali! 👋",
        "Mengarahkan ke dashboard…",
        data.redirect || "/discovery"
      );
      showToast(data.message || "Berhasil masuk ke StudyMatch", "success");
    } else {
      const errMsg = data.message || "Email atau password salah.";
      if (data.errors?.email) {
        showMsg("login-email-msg", data.errors.email[0], "error");
        document.getElementById("login-email").classList.add("is-error");
      }
      if (data.errors?.password) {
        showMsg("login-pw-msg", data.errors.password[0], "error");
        document.getElementById("login-password").classList.add("is-error");
      }
      showToast(errMsg, "error");
    }
  } catch (err) {
    setLoading("login-submit", false);
    showToast("Terjadi kesalahan koneksi server. Coba lagi.", "error");
  }
}

async function handleRegister(e) {
  e.preventDefault();
  clearAllMessages();
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pw = document.getElementById("reg-password").value;
  let valid = true;

  if (!name || name.length < 3) {
    showMsg("reg-name-msg", "Nama minimal 3 karakter", "error");
    document.getElementById("reg-name").classList.add("is-error");
    valid = false;
  }
  if (!email || !validateEmail(email)) {
    showMsg("reg-email-msg", "Masukkan email yang valid", "error");
    document.getElementById("reg-email").classList.add("is-error");
    valid = false;
  }
  if (!pw || pw.length < 8) {
    showMsg("reg-pw-msg", "Password minimal 8 karakter", "error");
    document.getElementById("reg-password").classList.add("is-error");
    valid = false;
  }
  if (!valid) return;

  setLoading("register-submit", true);

  try {
    const res = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
      body: JSON.stringify({ name, email, password: pw }),
    });

    const data = await res.json();
    setLoading("register-submit", false);

    if (res.ok && data.success) {
      showSuccess(
        "Akun berhasil dibuat! 🎉",
        "Mengarahkan ke setup profil…",
        data.redirect || "/setup-profile"
      );
      showToast(data.message || "Selamat bergabung di StudyMatch!", "success");
    } else {
      if (data.errors?.name) {
        showMsg("reg-name-msg", data.errors.name[0], "error");
        document.getElementById("reg-name").classList.add("is-error");
      }
      if (data.errors?.email) {
        showMsg("reg-email-msg", data.errors.email[0], "error");
        document.getElementById("reg-email").classList.add("is-error");
      }
      if (data.errors?.password) {
        showMsg("reg-pw-msg", data.errors.password[0], "error");
        document.getElementById("reg-password").classList.add("is-error");
      }
      showToast(data.message || "Gagal membuat akun.", "error");
    }
  } catch (err) {
    setLoading("register-submit", false);
    showToast("Terjadi kesalahan koneksi server. Coba lagi.", "error");
  }
}

function handleForgot(e) {
  e.preventDefault();
  const email = document.getElementById("forgot-email").value.trim();
  if (!email || !validateEmail(email)) {
    showMsg("forgot-email-msg", "Masukkan email yang valid", "error");
    document.getElementById("forgot-email").classList.add("is-error");
    return;
  }
  setLoading("forgot-submit", true);
  setTimeout(() => {
    setLoading("forgot-submit", false);
    showToast("Tautan reset telah dikirim ke " + email);
    hideForgot();
  }, 1600);
}

/* ── Checkbox custom ── */
document.getElementById("remember-me").addEventListener("change", function () {
  // Visual handled by CSS :checked selector — nothing extra needed
});

/* ── Keyboard: Enter to submit ── */
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const active = document.querySelector(".auth-tab.active");
    if (active?.id === "tab-login") {
      document.getElementById("loginForm")?.requestSubmit();
    }
  }
});

/* ── Scroll progress (for long mobile scroll) ── */
window.addEventListener(
  "scroll",
  () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH > 0) {
      document.getElementById("progress-bar").style.width =
        (window.scrollY / docH) * 100 + "%";
    }
  },
  { passive: true },
);

/* ── Expose to global for onclick/onsubmit handlers ── */
window.switchTab = switchTab;
window.handleGoogle = handleGoogle;
window.togglePassword = togglePassword;
window.showForgot = showForgot;
window.hideForgot = hideForgot;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleForgot = handleForgot;
window.checkStrength = checkStrength;
window.clearAllMessages = clearAllMessages;
