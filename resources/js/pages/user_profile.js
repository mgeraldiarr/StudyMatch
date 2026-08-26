function getCsrfToken() {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
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

const ALL_REVIEWS = [
  {
    name: "Sarah K.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDVLFB2eOCy9LSyIpRiuJcRqy1EdEclIKJP_Su-67Qg6fKeEFWrc0O9-z1gzezMAUaXF92f8dSMzKbikF-STFfNCFgeM_Ca4ZsBIWC0OZXx1Bzj9ndD9G5N9YUGPZDPe_DPqH-1iZeU1IOzEB2u7fTIemF4qZuIF0Uo0vEDZfC2V7azehbXcPM9wOk6XutbeQ4qqYvKwPxnxzj2RZR5DjpxQ1-FySVhFu54kMPDyzfTY_wfDEEjNn1xUbA0nXaPcKvwKPkFd1SJzom",
    text: "Sangat membantu menjelaskan konsep perkuliahan yang tadinya susah banget. Orangnya sabar dan on-time!",
    time: "2 hari yang lalu",
    rating: 5,
  },
  {
    name: "Budi Utomo",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcWSNAehS8dmkQfi57_5dEnx9x6doPpT7WfVA8rMaQpbggx516WMbCn3nTB7k35O8wx21ASHVf2Fhs0_gwZZjIXNiHLEyUKUYfVF_R8aaArqcM_BqnAP5aBJ_A_s4_BhdGkSc_k9nc2LdGe-ilvEFYLZNilWFXbl8MC0OsHYoAUbbt3uQp4YFxl-UrXnNTb9ew1lvXcsyYl4R9WSS7e0sxw0DIlCyo30R9sjR6SVXKqL0rHucjVtoi0cQLOe0G61mhm8Fr0YIs8TLt",
    text: "Partner belajar paling oke. Catatannya rapi dan logikanya kuat banget pas ngerjain project bareng.",
    time: "1 minggu yang lalu",
    rating: 5,
  },
  {
    name: "Rina Wijaya",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAh5E0pLcmDhjvQpbxyhoC_CdvbrXvjIfYRLOhzJLN7lM18K-g7pjd5C0RetKxIfMZoBbBDZcegxtH8JnCZQCMz2jaWJvNpOEHvmu1Pq1g_-mFIe8poONAKBfZPDtYNlhXyz5Lgav9H2O9mm0Rvh8FVA8Gz2QWTfbkxq9oP7H5SI1pCses_Da1JBbNiRlrT527sUbN68CMNh80e3b7Q9OWWw5toxjbYTCG7QCOPD8n-CQOTYX9xHh_6Vu9rwjrdH7xuxCY6J36YVXM",
    text: "Partner diskusi yang sangat komunikatif. Setiap sesi bareng dia selalu ada insight baru.",
    time: "2 minggu yang lalu",
    rating: 5,
  },
];

function openAllReviews() {
  const overlay = document.getElementById("reviewOverlay");
  const panel = document.getElementById("reviewPanel");
  const list = document.getElementById("reviewList");

  if (!list || !overlay || !panel) return;

  list.innerHTML = ALL_REVIEWS
    .map(
      (r) => `
    <div class="review-item" style="margin-bottom:1.25rem">
      <img class="review-avatar" alt="${r.name}" src="${r.avatar}" />
      <div class="review-bubble">
        <div class="review-meta">
          <p class="reviewer-name">${escapeHtml(r.name)}</p>
          <p class="review-time">${escapeHtml(r.time)}</p>
        </div>
        ${renderStars(r.rating)}
        <p class="review-text" style="margin-top:0.375rem">"${escapeHtml(r.text)}"</p>
      </div>
    </div>
  `,
    )
    .join("");

  overlay.classList.add("show");
  panel.classList.add("show");
}

function renderStars(n) {
  let html = `<div class="stars" style="margin-top:0.25rem">`;
  for (let i = 0; i < n; i++)
    html += `<span class="material-symbols-outlined fill-1" style="font-size:14px">star</span>`;
  html += `</div>`;
  return html;
}

function closeAllReviews() {
  document.getElementById("reviewOverlay")?.classList.remove("show");
  document.getElementById("reviewPanel")?.classList.remove("show");
}

/* ─── Edit Profile Modal ─── */
function openEditProfileModal() {
  document.getElementById("editProfileOverlay")?.classList.add("show");
  document.getElementById("editProfilePanel")?.classList.add("show");
}

function closeEditProfileModal() {
  document.getElementById("editProfileOverlay")?.classList.remove("show");
  document.getElementById("editProfilePanel")?.classList.remove("show");
}

async function submitEditProfile(e) {
  e.preventDefault();
  const name = document.getElementById("editName")?.value.trim();
  const university = document.getElementById("editUniversity")?.value.trim();
  const major = document.getElementById("editMajor")?.value.trim();
  const learningStyle = document.getElementById("editLearningStyle")?.value;
  const coursesStr = document.getElementById("editCourses")?.value.trim();
  const bio = document.getElementById("editBio")?.value.trim();
  const btn = document.getElementById("btnSaveProfile");

  if (!name || !university || !major || !learningStyle) {
    toast("Nama, Universitas, Jurusan, dan Gaya Belajar wajib diisi!", "error");
    return;
  }

  if (btn) btn.disabled = true;

  const courses = coursesStr ? coursesStr.split(",").map(c => c.trim()).filter(c => c.length > 0) : [];

  try {
    const res = await fetch("/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
      body: JSON.stringify({
        name,
        university,
        major,
        learning_style: learningStyle,
        courses,
        bio,
      }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      toast("Profil berhasil diperbarui! 🎉", "success");
      // Update UI elements
      const nameEl = document.getElementById("profileHeaderName");
      const univEl = document.getElementById("profileHeaderUniv");
      const majorEl = document.getElementById("profileHeaderMajor");
      const bioEl = document.getElementById("profileBioText");

      if (nameEl) nameEl.textContent = data.user.name;
      if (univEl) univEl.textContent = data.user.university;
      if (majorEl) majorEl.textContent = data.user.major;
      if (bioEl) bioEl.textContent = `"${data.user.bio || 'Mahasiswa yang siap belajar dan berdiskusi bersama!'}"`;

      closeEditProfileModal();
      setTimeout(() => window.location.reload(), 800);
    } else {
      toast(data.message || "Gagal memperbarui profil.", "error");
    }
  } catch (err) {
    toast("Terjadi kesalahan jaringan.", "error");
  } finally {
    if (btn) btn.disabled = false;
  }
}

window.openAllReviews = openAllReviews;
window.closeAllReviews = closeAllReviews;
window.openEditProfileModal = openEditProfileModal;
window.closeEditProfileModal = closeEditProfileModal;
window.submitEditProfile = submitEditProfile;

document.addEventListener("DOMContentLoaded", () => {
  const btnShareProfile = document.getElementById("btnShareProfile");
  if (btnShareProfile) {
    btnShareProfile.addEventListener("click", () => {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          toast("Tautan profil berhasil disalin ke papan klip!", "success");
        })
        .catch(() => {
          toast("Gagal menyalin tautan", "error");
        });
    });
  }

  const btnAllReviews = document.getElementById("btnAllReviews");
  if (btnAllReviews) {
    btnAllReviews.addEventListener("click", openAllReviews);
  }
});
