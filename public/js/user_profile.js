// User Profile page logic
document.addEventListener("DOMContentLoaded", () => {
  // Share profile
  const btnShareProfile = document.getElementById("btnShareProfile");
  if (btnShareProfile) {
    btnShareProfile.addEventListener("click", () => {
      // Simulate copy link
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast("Tautan profil berhasil disalin ke papan klip!", "success");
        })
        .catch(() => {
          toast("Gagal menyalin tautan", "error");
        });
    });
  }

  // Edit profile button action
  const btnEditProfile = document.getElementById("btnEditProfile");
  if (btnEditProfile) {
    btnEditProfile.addEventListener("click", () => {
      toast("Fitur edit profil akan segera hadir!", "info");
    });
  }

  // View all reviews action
  const btnAllReviews = document.querySelector(".btn-all-reviews");
  if (btnAllReviews) {
    btnAllReviews.addEventListener("click", () => {
      toast("Memuat ulasan lebih banyak...", "info");
    });
  }
});
