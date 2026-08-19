const ALL_REVIEWS = [
  {
    name: "Sarah K.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDVLFB2eOCy9LSyIpRiuJcRqy1EdEclIKJP_Su-67Qg6fKeEFWrc0O9-z1gzezMAUaXF92f8dSMzKbikF-STFfNCFgeM_Ca4ZsBIWC0OZXx1Bzj9ndD9G5N9YUGPZDPe_DPqH-1iZeU1IOzEB2u7fTIemF4qZuIF0Uo0vEDZfC2V7azehbXcPM9wOk6XutbeQ4qqYvKwPxnxzj2RZR5DjpxQ1-FySVhFu54kMPDyzfTY_wfDEEjNn1xUbA0nXaPcKvwKPkFd1SJzom",
    text: "Sangat membantu menjelaskan konsep Redux yang tadinya susah banget. Orangnya sabar dan on-time!",
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
    text: "Alya partner diskusi yang sangat komunikatif. Setiap sesi bareng dia selalu ada insight baru.",
    time: "2 minggu yang lalu",
    rating: 5,
  },
  {
    name: "Liam Neeson",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAyJXWMbkBK0IZDBrs2rOd6HFFLPcJ6S66Cb1EDStsAErxWOypRyEimO2bDpVWagBl0-i_8cWd9W4Y9s9aM2ywUnGmB7eX3n59hi42z2w0YNceOIBAKf6iLcgsIB9gJomUCYiAeA6BEOckDHBQhBs1K2QS-YWDEF2ZuMDT-wkMAS1ADISjMzRuV6LSJpeMScsyJEomDMqiPZHUSP1HGzVZgWmDMAJz0UOplce0xuRmCPYgJik2Dh7a8n0lDo39wt_R5Q3bzXsYYqg",
    text: "Great study partner! Always prepared and explains complex topics clearly.",
    time: "3 minggu yang lalu",
    rating: 5,
  },
  {
    name: "Dr. Elena",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtqWGVfOlyxx6i-aS6HsNy1Yilmi-6IgPJTQ7_OmwXe-Jmj8bl2RSRCv2jSlCE3o9ByLR6eTspEROtQ_AxKVjazAAn9_OEtteTyJT0mMgfexEl2Cn5QM5Bq3vaGYcjhcCz1i8Ayc6S0Fvm_83r0LDjcgtnY5rMLOTlFgKv9jePoxgWKEbGsIMlYel_V6FZNcqqysqITefhvUEWroq9_MGhsMRhmjMS0-qKcnVsZs10Wv9H8JGbHBEI7JsNkmmwL21jMoUyJVqrM3M",
    text: "Mahasiswa berbakat dengan dedikasi tinggi. Selalu membawa pertanyaan-pertanyaan kritis yang memperkaya diskusi kelompok.",
    time: "1 bulan yang lalu",
    rating: 5,
  },
];

function openAllReviews() {
  const overlay = document.getElementById("reviewOverlay");
  const panel = document.getElementById("reviewPanel");
  const list = document.getElementById("reviewList");

  list.innerHTML = ALL_REVIEWS
    .map(
      (r) => `
    <div class="review-item" style="margin-bottom:1.25rem">
      <img class="review-avatar" alt="${r.name}" src="${r.avatar}" />
      <div class="review-bubble">
        <div class="review-meta">
          <p class="reviewer-name">${r.name}</p>
          <p class="review-time">${r.time}</p>
        </div>
        ${renderStars(r.rating)}
        <p class="review-text" style="margin-top:0.375rem">"${r.text}"</p>
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
  document.getElementById("reviewOverlay").classList.remove("show");
  document.getElementById("reviewPanel").classList.remove("show");
}

window.openAllReviews = openAllReviews;
window.closeAllReviews = closeAllReviews;

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

  const btnEditProfile = document.getElementById("btnEditProfile");
  if (btnEditProfile) {
    btnEditProfile.addEventListener("click", () => {
      window.location.href = "/settings#account";
    });
  }

  const btnAllReviews = document.getElementById("btnAllReviews");
  if (btnAllReviews) {
    btnAllReviews.addEventListener("click", openAllReviews);
  }
});
