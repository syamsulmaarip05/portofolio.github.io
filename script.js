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
const toggleBtn = document.getElementById("toggleExperience"); // id ini harus sama dengan di HTML

if (timeline && toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    timeline.classList.toggle("expanded");

    if (timeline.classList.contains("expanded")) {
      toggleBtn.innerHTML =
        "Tampilkan Lebih Sedikit <i class='fa-solid fa-chevron-up'></i>";

      // Scroll halus ke atas section experience biar tidak "hilang" posisi
      toggleBtn.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      toggleBtn.innerHTML =
        "Lihat Semua Pengalaman <i class='fa-solid fa-chevron-down'></i>";

      // Saat ditutup, scroll ke awal section experience
      document
        .getElementById("experience")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

// ================= Projects: Carousel Geser ke Samping =================
const projectsTrack = document.getElementById("projectsTrack");
const projectsPrev = document.getElementById("projectsPrev");
const projectsNext = document.getElementById("projectsNext");

function updateProjectButtons() {
  if (!projectsTrack || !projectsPrev || !projectsNext) return;

  const maxScroll = projectsTrack.scrollWidth - projectsTrack.clientWidth - 1;

  // Di awal (belum discroll sama sekali): tombol kiri nonaktif dulu,
  // baru aktif setelah tombol kanan/geser kanan pernah dipakai.
  projectsPrev.disabled = projectsTrack.scrollLeft <= 0;
  projectsNext.disabled = projectsTrack.scrollLeft >= maxScroll;
}

function scrollProjects(direction) {
  if (!projectsTrack) return;

  const firstCard = projectsTrack.querySelector(".project-card");
  if (!firstCard) return;

  const trackStyle = window.getComputedStyle(projectsTrack);
  const gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;
  const distance = firstCard.getBoundingClientRect().width + gap;

  projectsTrack.scrollBy({ left: direction * distance, behavior: "smooth" });
}

if (projectsTrack && projectsPrev && projectsNext) {
  // Saat halaman baru dibuka, tombol kiri belum bisa dipakai (belum ada yang digeser)
  updateProjectButtons();

  projectsNext.addEventListener("click", () => scrollProjects(1));
  projectsPrev.addEventListener("click", () => scrollProjects(-1));

  projectsTrack.addEventListener("scroll", updateProjectButtons);
  window.addEventListener("resize", updateProjectButtons);
}

// ================= Certifications: Popup / Lightbox =================
const certCards = document.querySelectorAll(".cert-card");
const lightbox = document.getElementById("certLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDesc = document.getElementById("lightboxDesc");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(card) {
  if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxDesc) return;

  const imageSrc = card.dataset.image || "";
  const title = card.dataset.title || "";
  const desc = card.dataset.desc || "";

  lightboxImage.src = imageSrc;
  lightboxImage.alt = title;
  lightboxTitle.textContent = title;
  lightboxDesc.textContent = desc;

  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // kunci scroll halaman belakang popup
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (lightbox && certCards.length) {
  certCards.forEach((card) => {
    card.addEventListener("click", () => openLightbox(card));
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  // Klik di luar konten popup (area gelap) menutup popup
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Tombol Escape menutup popup
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
}
