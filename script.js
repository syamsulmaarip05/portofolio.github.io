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
const toggleBtn = document.getElementById("toggleExperience");

if (timeline && toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    timeline.classList.toggle("expanded");

    if (timeline.classList.contains("expanded")) {
      toggleBtn.innerHTML =
        "Tampilkan Lebih Sedikit <i class='fa-solid fa-chevron-up'></i>";
      toggleBtn.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      toggleBtn.innerHTML =
        "Lihat Semua Pengalaman <i class='fa-solid fa-chevron-down'></i>";
      document
        .getElementById("experience")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

// ================= Helper umum: buat carousel geser (dipakai Projects & Certifications) =================
function initCarousel({
  trackId,
  prevId,
  nextId,
  cardSelector,
  autoScroll = false,
  intervalMs = 3200,
}) {
  const track = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);

  if (!track) return;

  let autoTimer = null;
  let resumeTimer = null;

  function getStep() {
    const card = track.querySelector(cardSelector);
    if (!card) return 0;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function updateButtons() {
    if (!prevBtn || !nextBtn) return;
    const maxScroll = track.scrollWidth - track.clientWidth - 1;
    prevBtn.disabled = track.scrollLeft <= 0;
    nextBtn.disabled = track.scrollLeft >= maxScroll;
  }

  function scrollByDirection(direction) {
    const step = getStep();
    if (!step) return;
    const maxScroll = track.scrollWidth - track.clientWidth - 1;

    // Kalau geser ke kanan tapi sudah mentok, putar balik ke awal (biar bisa "gerak sendiri" terus-menerus)
    if (direction > 0 && track.scrollLeft >= maxScroll) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    // Kalau geser ke kiri tapi sudah di awal, lompat ke akhir
    if (direction < 0 && track.scrollLeft <= 0) {
      track.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  function startAuto() {
    if (!autoScroll) return;
    stopAuto();
    autoTimer = setInterval(() => scrollByDirection(1), intervalMs);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function pauseThenResume() {
    if (!autoScroll) return;
    stopAuto();
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAuto, 4000);
  }

  updateButtons();

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      scrollByDirection(1);
      pauseThenResume();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      scrollByDirection(-1);
      pauseThenResume();
    });
  }

  track.addEventListener("scroll", updateButtons);
  window.addEventListener("resize", updateButtons);

  if (autoScroll) {
    startAuto();

    // Berhenti sebentar saat disentuh/di-hover, jalan lagi otomatis setelahnya
    track.addEventListener("mouseenter", stopAuto);
    track.addEventListener("mouseleave", startAuto);
    track.addEventListener("touchstart", stopAuto, { passive: true });
    track.addEventListener("touchend", pauseThenResume, { passive: true });
    track.addEventListener("wheel", pauseThenResume, { passive: true });
  }
}

// ================= Projects: Carousel Geser ke Samping =================
initCarousel({
  trackId: "projectsTrack",
  prevId: "projectsPrev",
  nextId: "projectsNext",
  cardSelector: ".project-card",
  autoScroll: false,
});

// ================= Certifications: Carousel Geser + Gerak Otomatis =================
initCarousel({
  trackId: "certTrack",
  prevId: "certPrev",
  nextId: "certNext",
  cardSelector: ".cert-card",
  autoScroll: true,
  intervalMs: 3200,
});

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
  document.body.style.overflow = "hidden";
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

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
}
