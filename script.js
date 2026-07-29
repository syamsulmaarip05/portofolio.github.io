// ================= Mobile Navbar =================
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

// ================= Experience: Expandable Timeline =================
const timeline = document.getElementById("experienceTimeline");
const button = document.getElementById("toggleExperience"); // id ini harus sama dengan di HTML

if (timeline && button) {
  button.addEventListener("click", () => {
    timeline.classList.toggle("expanded");

    if (timeline.classList.contains("expanded")) {
      button.innerHTML =
        "Tampilkan Lebih Sedikit <i class='fa-solid fa-chevron-up'></i>";

      // Scroll halus ke atas section experience biar tidak "hilang" posisi
      // setelah timeline mengecil lagi saat tombol ditutup
      button.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      button.innerHTML =
        "Lihat Semua Pengalaman <i class='fa-solid fa-chevron-down'></i>";

      // Saat ditutup, scroll ke awal section experience biar user tidak
      // tiba-tiba berada jauh di bawah halaman yang sudah mengecil
      document
        .getElementById("experience")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}
