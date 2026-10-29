const contentRoot = document.querySelector("[data-content-root]");
const currentPage = document.body.dataset.page || "home";

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function icon(className, hidden = true) {
  return `<i class="${escapeHtml(className)}"${hidden ? ' aria-hidden="true"' : ""}></i>`;
}

function folderToolbar(folder) {
  return `
    <div class="folder-toolbar">
      <a href="index.html" class="back-to-folders" aria-label="Kembali ke semua folder" title="Kembali ke semua folder">
        ${icon("fa-solid fa-arrow-left")}
      </a>
      <span>${icon("fa-regular fa-folder-open")} ${escapeHtml(folder.folderLabel)}</span>
    </div>`;
}

function renderHome(data) {
  const folders = data.folders
    .map(
      (folder) => `
        <a class="folder-card ${escapeHtml(folder.color)}" href="${escapeHtml(folder.id)}.html">
          ${icon(`fa-solid ${folder.icon} folder-content-icon`)}
          <span>${escapeHtml(folder.label)}</span>
        </a>`,
    )
    .join("");

  return `
    <section class="folder-section container" aria-label="Folder portofolio">
      <div class="folder-grid">${folders}</div>
    </section>`;
}

function renderAbout(page) {
  const hero = page.hero;
  const bio = page.biography;
  return `
    <div class="folder-view" data-folder-view="about">
      ${folderToolbar(page)}
      <div class="about-presentation" aria-label="Presentasi tentang saya">
        <button class="about-slide-button" id="aboutPrevious" aria-label="Halaman sebelumnya" disabled>${icon("fa-solid fa-chevron-left")}</button>
        <div class="about-slides" id="aboutSlides" tabindex="0" aria-label="Geser horizontal untuk melihat halaman berikutnya">
          <div class="about-slide">
            <section class="hero container" aria-label="Perkenalan">
              <div class="hero-text">
                <p class="hello">${escapeHtml(hero.intro)}</p>
                <h1>${escapeHtml(hero.name)}</h1>
                <p>${escapeHtml(hero.subtitle)}</p>
                <a href="contact.html" class="btn">${icon("fa-solid fa-paper-plane")} ${escapeHtml(hero.contactLabel)}</a>
              </div>
              <div class="photo-box"><img src="${escapeHtml(hero.image)}" alt="${escapeHtml(hero.imageAlt)}"></div>
            </section>
          </div>
          <div class="about-slide">
            <section class="about container" id="about" aria-label="Profil diri">
              <div class="photo-box"><img src="${escapeHtml(bio.image)}" alt="${escapeHtml(bio.imageAlt)}"></div>
              <div class="about-content">
                <p class="eyebrow">${escapeHtml(bio.eyebrow)}</p>
                <h2 class="section-title">${escapeHtml(bio.title)}</h2>
                <p>${escapeHtml(bio.description)}</p>
                <a href="${escapeHtml(bio.publicationUrl)}" class="btn" target="_blank" rel="noopener">${escapeHtml(bio.publicationLabel)}</a>
              </div>
            </section>
          </div>
        </div>
        <button class="about-slide-button" id="aboutNext" aria-label="Halaman berikutnya">${icon("fa-solid fa-chevron-right")}</button>
        <div class="about-slide-count" aria-live="polite"><span id="aboutCurrentSlide">01</span><span aria-hidden="true"> / 02</span></div>
      </div>
    </div>`;
}

function renderEducation(page) {
  const folders = page.items
    .map(
      (item, index) => `
        <button class="education-folder" type="button" data-education-index="${index}" aria-haspopup="dialog" aria-controls="educationDialog">
          <span class="education-folder-icon">${icon("fa-solid fa-folder")}</span>
          <span class="education-folder-label">${escapeHtml(item.folderLabel)}</span>
          <span class="education-folder-meta">${escapeHtml(item.period)}</span>
        </button>`,
    )
    .join("");

  const panels = page.items
    .map((item, index) => {
      const details = item.details
        .map(
          (detail) =>
            `<li>${icon("fa-solid fa-star")}<span>${escapeHtml(detail.replace(/^\s*[-–—]\s*/, ""))}</span></li>`,
        )
        .join("");
      const slides = (item.gallery || [])
        .map(
          (image) => `
            <figure class="education-photo-slide">
              <img src="${escapeHtml(image.image)}" alt="${escapeHtml(image.alt)}">
              <figcaption>${escapeHtml(image.caption || image.alt)}</figcaption>
            </figure>`,
        )
        .join("");
      const gallery = slides
        ? `
          <div class="education-gallery" data-education-gallery>
            <div class="education-gallery-viewport">
              <div class="education-gallery-track">${slides}</div>
            </div>
            <div class="education-gallery-controls">
              <button type="button" class="education-gallery-button" data-education-prev aria-label="Foto sebelumnya">${icon("fa-solid fa-chevron-left")}</button>
              <span class="education-gallery-count" aria-live="polite"></span>
              <button type="button" class="education-gallery-button" data-education-next aria-label="Foto berikutnya">${icon("fa-solid fa-chevron-right")}</button>
            </div>
          </div>`
        : `
          <div class="education-gallery-empty">
            ${icon("fa-regular fa-images")}
            <p>Dokumentasi foto untuk folder ini belum ditambahkan.</p>
          </div>`;

      return `
        <section class="education-dialog-panel" data-education-panel="${index}" hidden>
          <div class="education-dialog-info">
            <span class="education-period">${icon("fa-regular fa-calendar")} ${escapeHtml(item.period)}</span>
            <h2 id="educationDialogTitle-${index}">${escapeHtml(item.title)}</h2>
            <p class="education-place">${icon("fa-solid fa-location-dot")} ${escapeHtml(item.place)}</p>
            <ul class="education-highlights">${details}</ul>
          </div>
          ${gallery}
        </section>`;
    })
    .join("");

  return `
    <div class="folder-view" data-folder-view="education">
      ${folderToolbar(page)}
      <section class="education-home" aria-label="Folder pendidikan">
        <div class="education-folders">${folders}</div>
      </section>
    </div>
    <dialog class="education-dialog" id="educationDialog" aria-labelledby="educationDialogTitle-0">
      <button class="education-dialog-close" type="button" data-education-close aria-label="Tutup informasi">${icon("fa-solid fa-xmark")}</button>
      ${panels}
    </dialog>`;
}

function renderSkills(page) {
  const items = page.items
    .map(
      (item) => `
        <div class="skill-badge">${icon(item.icon)} ${escapeHtml(item.label)}</div>`,
    )
    .join("");

  return `
    <div class="folder-view" data-folder-view="skills">
      ${folderToolbar(page)}
      <section id="skills"><div class="container">
        <h2 class="section-title">${escapeHtml(page.title)}</h2>
        <div class="skills-row">${items}</div>
      </div></section>
    </div>`;
}

function renderProjects(page) {
  const folders = page.items
    .map(
      (item, index) => `
        <button class="project-folder" type="button" data-project-index="${index}" aria-haspopup="dialog" aria-controls="projectDialog">
          <span class="project-folder-icon">${icon("fa-solid fa-folder")}</span>
          <span class="project-folder-label">${escapeHtml(item.title)}</span>
        </button>`,
    )
    .join("");
  const panels = page.items
    .map((item, index) => {
      const links = item.links
        .map(
            (link) => `
              <a href="${escapeHtml(link.url)}" class="project-dialog-link"${link.external ? ' target="_blank" rel="noopener"' : ""}>
                ${escapeHtml(link.label)} ${link.icon ? icon(link.icon) : icon("fa-solid fa-arrow-up-right-from-square")}
              </a>`,
        )
        .join("");
      const presentation = item.presentation
        ? Array.from({ length: item.presentation.slideCount }, (_, slideIndex) => {
            const pageImage = item.presentation.slideFilePattern
              .replace("{n}", String(slideIndex + 1));
            return `
              <article class="project-presentation-slide project-file-slide" data-project-slide="${slideIndex + 1}" aria-label="Halaman ${slideIndex + 1}" hidden>
                <img class="project-presentation-page" src="${escapeHtml(pageImage)}" alt="" loading="lazy">
              </article>`;
          }).join("")
        : "";

      return `
        <section class="project-dialog-panel" data-project-panel="${index}" data-project-title="${escapeHtml(item.title)}" hidden>
            <article class="project-presentation-slide" data-project-slide="0" aria-labelledby="project-title-${index}">
              <div class="project-presentation-image"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt)}"></div>
              <div class="project-presentation-copy">
                <span class="project-slide-kicker">${icon("fa-solid fa-folder-open")} Detail Proyek</span>
                <h2 id="project-title-${index}">${escapeHtml(item.title)}</h2>
                <p>${escapeHtml(item.description)}</p>
                <div class="project-goal">
                  <h3>Tujuan</h3>
                  <p>${escapeHtml(item.goal)}</p>
                </div>
                <div class="project-dialog-links">${links}</div>
              </div>
            </article>
            ${presentation}
        </section>`;
    })
    .join("");

  return `
    <div class="folder-view" data-folder-view="projects">
      ${folderToolbar(page)}
      <section class="projects-home" aria-label="Folder proyek">
        <div class="projects-folders">${folders}</div>
      </section>
    </div>
    <dialog class="project-dialog" id="projectDialog" aria-label="Presentasi proyek" tabindex="-1">
      <button class="project-dialog-close" type="button" data-project-close aria-label="Tutup presentasi">${icon("fa-solid fa-xmark")}</button>
      <div class="project-dialog-slides">${panels}</div>
      <div class="project-dialog-footer" data-project-footer hidden>
        <button class="project-slide-button" type="button" data-project-prev aria-label="Slide sebelumnya">${icon("fa-solid fa-chevron-left")}</button>
        <span class="project-slide-count" aria-live="polite"><span data-project-current>01</span> / <span data-project-total>02</span></span>
        <button class="project-slide-button" type="button" data-project-next aria-label="Slide berikutnya">${icon("fa-solid fa-chevron-right")}</button>
        <button class="project-slide-button project-fullscreen-button" type="button" data-project-fullscreen aria-label="Perbesar pop-up" aria-pressed="false" title="Perbesar pop-up">${icon("fa-solid fa-expand")}</button>
      </div>
    </dialog>`;
}

function initProjectsPresentation() {
  const dialog = document.getElementById("projectDialog");
  if (!dialog) return;

  const folders = document.querySelectorAll(".project-folder");
  const panels = [...dialog.querySelectorAll(".project-dialog-panel")];
  const previous = dialog.querySelector("[data-project-prev]");
  const next = dialog.querySelector("[data-project-next]");
  const current = dialog.querySelector("[data-project-current]");
  const total = dialog.querySelector("[data-project-total]");
  const footer = dialog.querySelector("[data-project-footer]");
  const closeButton = dialog.querySelector("[data-project-close]");
  const fullscreenButton = dialog.querySelector("[data-project-fullscreen]");
  let activePanel = null;
  let activeFolder = null;
  let activeSlide = 0;

  function showSlide(slideIndex) {
    if (!activePanel || !previous || !next || !current || !total || !footer) return;
    const slides = [...activePanel.querySelectorAll(".project-presentation-slide")];
    const lastSlide = slides.length - 1;
    if (slideIndex < 0 || slideIndex > lastSlide) return;

    activeSlide = slideIndex;
    const isDocumentSlide = slides[activeSlide].classList.contains("project-file-slide");
    dialog.classList.toggle("project-dialog-presentation", isDocumentSlide);
    if (closeButton) closeButton.hidden = false;
    slides.forEach((slide) => {
      slide.hidden = Number(slide.dataset.projectSlide) !== activeSlide;
    });
    current.textContent = String(activeSlide + 1).padStart(2, "0");
    total.textContent = String(slides.length).padStart(2, "0");
    footer.hidden = slides.length === 1;
    previous.disabled = activeSlide === 0;
    next.disabled = activeSlide === lastSlide;
    if (slides.length === 1) setExpanded(false);
    if (isDocumentSlide && dialog.contains(document.activeElement)) dialog.focus();
  }

  function setExpanded(expanded) {
    dialog.classList.toggle("project-dialog-expanded", expanded);
    fullscreenButton?.setAttribute("aria-pressed", String(expanded));
    fullscreenButton?.setAttribute(
      "aria-label",
      expanded ? "Kembalikan ukuran pop-up" : "Perbesar pop-up",
    );
    if (fullscreenButton) {
      fullscreenButton.title = expanded
        ? "Kembalikan ukuran pop-up"
        : "Perbesar pop-up";
      fullscreenButton.innerHTML = icon(
        expanded ? "fa-solid fa-compress" : "fa-solid fa-expand",
      );
    }
  }

  folders.forEach((folder) => {
    folder.addEventListener("click", () => {
      activeFolder = folder;
      activePanel = panels.find(
        (panel) => panel.dataset.projectPanel === folder.dataset.projectIndex,
      );
      if (!activePanel) {
        throw new Error(`Presentasi proyek tidak ditemukan untuk folder "${folder.dataset.projectIndex}"`);
      }

      panels.forEach((panel) => {
        panel.hidden = panel !== activePanel;
      });
      dialog.setAttribute(
        "aria-label",
        `Presentasi proyek ${activePanel.dataset.projectTitle}`,
      );
      showSlide(0);
      dialog.showModal();
      closeButton?.focus();
    });
  });

  previous?.addEventListener("click", () => {
    if (activeSlide > 0) showSlide(activeSlide - 1);
  });
  next?.addEventListener("click", () => {
    if (activePanel && activeSlide < activePanel.querySelectorAll(".project-presentation-slide").length - 1) {
      showSlide(activeSlide + 1);
    }
  });
  fullscreenButton?.addEventListener("click", () => {
    setExpanded(fullscreenButton.getAttribute("aria-pressed") !== "true");
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
      return;
    }

    const lastSlide = activePanel
      ? activePanel.querySelectorAll(".project-presentation-slide").length - 1
      : 0;
    if (event.key === "ArrowLeft" && activeSlide > 0) {
      event.preventDefault();
      showSlide(activeSlide - 1);
    } else if (event.key === "ArrowRight" && activeSlide < lastSlide) {
      event.preventDefault();
      showSlide(activeSlide + 1);
    }
  });

  closeButton?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    setExpanded(false);
    dialog.classList.remove("project-dialog-presentation");
    if (closeButton) closeButton.hidden = false;
    panels.forEach((panel) => {
      panel.hidden = true;
    });
    activePanel = null;
    activeFolder?.focus();
    activeFolder = null;
  });
}

function renderExperience(page) {
  const items = page.items
    .map(
      (item) => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <span class="timeline-year">${escapeHtml(item.period)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="timeline-place">${escapeHtml(item.place)}</p>
          <p>${escapeHtml(item.description)}</p>
        </div>`,
    )
    .join("");

  return `
    <div class="folder-view" data-folder-view="experience">
      ${folderToolbar(page)}
      <section id="experience"><div class="container">
        <h2 class="section-title">${escapeHtml(page.title)}</h2>
        <div class="timeline-wrapper">
          <div class="timeline" id="experienceTimeline">${items}</div>
          <div class="timeline-fade"></div>
        </div>
        <button id="toggleExperience" class="show-more-btn">Lihat Semua Pengalaman ${icon("fa-solid fa-chevron-down")}</button>
      </div></section>
    </div>`;
}

function renderCertifications(page) {
  const cards = page.items
    .map(
      (item) => `
        <div class="cert-card" data-title="${escapeHtml(item.title)}" data-desc="${escapeHtml(item.description)}" data-image="${escapeHtml(item.image)}">
          <div class="cert-thumb"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt)}" class="cert-photo"></div>
          <div class="cert-info">
            <h3>${escapeHtml(item.title)}</h3>
            <p class="timeline-place">${escapeHtml(item.issuer)}</p>
            <span class="cert-view">${icon("fa-solid fa-magnifying-glass")} Lihat Sertifikat</span>
          </div>
        </div>`,
    )
    .join("");
  const gallery = page.documentation.items
    .map(
      (item) => `
        <div class="gallery-item"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt)}"></div>`,
    )
    .join("");

  return `
    <div class="folder-view" data-folder-view="certifications">
      ${folderToolbar(page)}
      <section id="certifications"><div class="container">
        <div class="section-head-row">
          <div><h2 class="section-title">${escapeHtml(page.title)}</h2></div>
          <div class="carousel-controls">
            <button class="carousel-btn" id="certPrev" aria-label="Sertifikat sebelumnya">${icon("fa-solid fa-chevron-left")}</button>
            <button class="carousel-btn" id="certNext" aria-label="Sertifikat berikutnya">${icon("fa-solid fa-chevron-right")}</button>
          </div>
        </div>
        <div class="cert-track" id="certTrack">${cards}</div>
      </div></section>
      <section id="documentation"><div class="container">
        <h2 class="section-title">${escapeHtml(page.documentation.title)}</h2>
        <div class="gallery-grid">${gallery}</div>
      </div></section>
    </div>
    <div class="lightbox" id="certLightbox" aria-hidden="true">
      <div class="lightbox-content">
        <button class="lightbox-close" id="lightboxClose" aria-label="Tutup">${icon("fa-solid fa-xmark")}</button>
        <img id="lightboxImage" src="" alt="">
        <div class="lightbox-caption"><h3 id="lightboxTitle"></h3><p id="lightboxDesc"></p></div>
      </div>
    </div>`;
}

function renderContact(page) {
  const socials = page.socials
    .map(
      (social) => `
        <a href="${escapeHtml(social.url)}" aria-label="${escapeHtml(social.label)}"${social.external ? ' target="_blank" rel="noopener"' : ""}>
          ${icon(social.icon)}
        </a>`,
    )
    .join("");

  return `
    <div class="folder-view" data-folder-view="contact">
      ${folderToolbar(page)}
      <section id="contact"><div class="container">
        <div class="cta">
          <div><h2>${escapeHtml(page.title)}</h2><div class="socials">${socials}</div></div>
          <a href="${escapeHtml(page.emailUrl)}" target="_blank" rel="noopener" class="btn">${icon("fa-solid fa-paper-plane")} ${escapeHtml(page.emailLabel)}</a>
        </div>
      </div></section>
      <footer class="container"><p>&copy; ${escapeHtml(page.footer)}</p></footer>
    </div>`;
}

const pageRenderers = {
  about: renderAbout,
  education: renderEducation,
  skills: renderSkills,
  projects: renderProjects,
  experience: renderExperience,
  certifications: renderCertifications,
  contact: renderContact,
};

function markActivePage() {
  const navLinks = document.getElementById("navLinks");
  if (!navLinks) return;

  navLinks.querySelectorAll("a").forEach((link) => {
    const targetPage = new URL(link.href, window.location.href).pathname
      .split("/")
      .pop()
      .replace(/\.html$/, "");
    const isActive =
      currentPage === "home"
        ? targetPage === "index"
        : targetPage === currentPage;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function updateStatusTime() {
  const statusTime = document.getElementById("statusTime");
  if (!statusTime) return;
  statusTime.textContent = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

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
    if (direction > 0 && track.scrollLeft >= maxScroll) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    if (direction < 0 && track.scrollLeft <= 0) {
      track.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  function stopAuto() {
    if (!autoTimer) return;
    clearInterval(autoTimer);
    autoTimer = null;
  }

  function startAuto() {
    if (!autoScroll) return;
    stopAuto();
    autoTimer = window.setInterval(() => scrollByDirection(1), intervalMs);
  }

  function pauseThenResume() {
    if (!autoScroll) return;
    stopAuto();
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(startAuto, 4000);
  }

  updateButtons();
  nextBtn?.addEventListener("click", () => {
    scrollByDirection(1);
    pauseThenResume();
  });
  prevBtn?.addEventListener("click", () => {
    scrollByDirection(-1);
    pauseThenResume();
  });
  track.addEventListener("scroll", updateButtons);
  window.addEventListener("resize", updateButtons);

  if (autoScroll) {
    startAuto();
    track.addEventListener("mouseenter", stopAuto);
    track.addEventListener("mouseleave", startAuto);
    track.addEventListener("touchstart", stopAuto, { passive: true });
    track.addEventListener("touchend", pauseThenResume, { passive: true });
    track.addEventListener("wheel", pauseThenResume, { passive: true });
  }
}

function initExperienceToggle() {
  const timeline = document.getElementById("experienceTimeline");
  const toggleButton = document.getElementById("toggleExperience");
  if (!timeline || !toggleButton) return;

  toggleButton.addEventListener("click", () => {
    timeline.classList.toggle("expanded");
    const expanded = timeline.classList.contains("expanded");
    toggleButton.innerHTML = expanded
      ? `Tampilkan Lebih Sedikit ${icon("fa-solid fa-chevron-up")}`
      : `Lihat Semua Pengalaman ${icon("fa-solid fa-chevron-down")}`;

    if (expanded) {
      toggleButton.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      document
        .getElementById("experience")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

function initAboutPresentation() {
  const slides = document.getElementById("aboutSlides");
  const previous = document.getElementById("aboutPrevious");
  const next = document.getElementById("aboutNext");
  const currentLabel = document.getElementById("aboutCurrentSlide");
  if (!slides || !previous || !next || !currentLabel) return;

  const panels = [...slides.querySelectorAll(".about-slide")];
  if (panels.length < 2) return;

  function updateControls() {
    const activeIndex = Math.min(
      panels.length - 1,
      Math.round(slides.scrollLeft / slides.clientWidth),
    );
    previous.disabled = activeIndex === 0;
    next.disabled = activeIndex === panels.length - 1;
    currentLabel.textContent = String(activeIndex + 1).padStart(2, "0");
  }

  function goToSlide(direction) {
    const activeIndex = Math.round(slides.scrollLeft / slides.clientWidth);
    const nextIndex = Math.max(0, Math.min(panels.length - 1, activeIndex + direction));
    slides.scrollTo({
      left: nextIndex * slides.clientWidth,
      behavior: "smooth",
    });
  }

  previous.addEventListener("click", () => goToSlide(-1));
  next.addEventListener("click", () => goToSlide(1));
  slides.addEventListener("scroll", updateControls, { passive: true });
  slides.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToSlide(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToSlide(-1);
    }
  });
  window.addEventListener("resize", updateControls);
  updateControls();
}

function initEducationFolders() {
  const dialog = document.getElementById("educationDialog");
  if (!dialog) return;

  const folders = document.querySelectorAll(".education-folder");
  const panels = [...dialog.querySelectorAll(".education-dialog-panel")];
  const closeButton = dialog.querySelector("[data-education-close]");
  let activePanel = null;
  let activeFolder = null;

  function updateGallery(gallery, slideIndex) {
    const slides = gallery.querySelectorAll(".education-photo-slide");
    const track = gallery.querySelector(".education-gallery-track");
    const counter = gallery.querySelector(".education-gallery-count");
    const previous = gallery.querySelector("[data-education-prev]");
    const next = gallery.querySelector("[data-education-next]");
    if (!track || !counter || !previous || !next) return;

    gallery.dataset.slideIndex = String(slideIndex);
    track.style.transform = `translateX(-${slideIndex * 100}%)`;
    counter.textContent = `${String(slideIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    previous.disabled = slideIndex === 0;
    next.disabled = slideIndex === slides.length - 1;
  }

  folders.forEach((folder) => {
    folder.addEventListener("click", () => {
      activeFolder = folder;
      activePanel = panels.find(
        (panel) => panel.dataset.educationPanel === folder.dataset.educationIndex,
      );
      if (!activePanel) {
        throw new Error(`Informasi pendidikan tidak ditemukan untuk folder "${folder.dataset.educationIndex}"`);
      }

      panels.forEach((panel) => {
        panel.hidden = panel !== activePanel;
      });
      dialog.setAttribute(
        "aria-labelledby",
        activePanel.querySelector("h2").id,
      );

      const gallery = activePanel.querySelector("[data-education-gallery]");
      if (gallery) updateGallery(gallery, 0);
      dialog.showModal();
      closeButton?.focus();
    });
  });

  dialog.querySelectorAll("[data-education-prev], [data-education-next]").forEach((button) => {
    button.addEventListener("click", () => {
      const gallery = activePanel?.querySelector("[data-education-gallery]");
      if (!gallery) return;
      const currentIndex = Number(gallery.dataset.slideIndex || 0);
      const direction = button.hasAttribute("data-education-next") ? 1 : -1;
      const nextIndex = currentIndex + direction;
      const slideCount = gallery.querySelectorAll(".education-photo-slide").length;
      if (nextIndex >= 0 && nextIndex < slideCount) updateGallery(gallery, nextIndex);
    });
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
      return;
    }

    const gallery = activePanel?.querySelector("[data-education-gallery]");
    if (!gallery || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
    event.preventDefault();
    const currentIndex = Number(gallery.dataset.slideIndex || 0);
    const nextIndex = currentIndex + (event.key === "ArrowRight" ? 1 : -1);
    const slideCount = gallery.querySelectorAll(".education-photo-slide").length;
    if (nextIndex >= 0 && nextIndex < slideCount) updateGallery(gallery, nextIndex);
  });

  closeButton?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    panels.forEach((panel) => {
      panel.hidden = true;
    });
    activePanel = null;
    activeFolder?.focus();
    activeFolder = null;
  });
}

function initLightbox() {
  const lightbox = document.getElementById("certLightbox");
  const image = document.getElementById("lightboxImage");
  const title = document.getElementById("lightboxTitle");
  const description = document.getElementById("lightboxDesc");
  const closeButton = document.getElementById("lightboxClose");
  if (!lightbox || !image || !title || !description) return;

  let previousFocus = null;
  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    previousFocus?.focus();
  }

  document.querySelectorAll(".cert-card").forEach((card) => {
    card.addEventListener("click", () => {
      previousFocus = card;
      image.src = card.dataset.image || "";
      image.alt = card.dataset.title || "";
      title.textContent = card.dataset.title || "";
      description.textContent = card.dataset.desc || "";
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeButton?.focus();
    });
  });

  closeButton?.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
}

async function loadPortfolioPage() {
  if (!contentRoot) return;

  try {
    const response = await fetch("portfolio-data.json");
    if (!response.ok) {
      throw new Error(`Gagal memuat portfolio-data.json (${response.status})`);
    }

    const data = await response.json();
    if (currentPage === "home") {
      contentRoot.innerHTML = renderHome(data);
    } else {
      const page = data.pages[currentPage];
      const render = pageRenderers[currentPage];
      if (!page || !render) {
        throw new Error(`Data halaman "${currentPage}" tidak ditemukan`);
      }
      contentRoot.innerHTML = render(page);
    }

    initCarousel({
      trackId: "projectsTrack",
      prevId: "projectsPrev",
      nextId: "projectsNext",
      cardSelector: ".project-card",
    });
    initCarousel({
      trackId: "certTrack",
      prevId: "certPrev",
      nextId: "certNext",
      cardSelector: ".cert-card",
      autoScroll: true,
    });
    initExperienceToggle();
    initEducationFolders();
    initProjectsPresentation();
    initAboutPresentation();
    initLightbox();
  } catch (error) {
    console.error("Portofolio gagal dimuat:", error);
    contentRoot.innerHTML = `
      <section class="container data-load-error" role="alert">
        <h1>Konten portofolio tidak dapat dimuat</h1>
        <p>Jalankan situs melalui server web lokal agar berkas JSON dapat dibaca.</p>
      </section>`;
  }
}

document.body.classList.toggle("folder-open", currentPage !== "home");
markActivePage();
updateStatusTime();
window.setInterval(updateStatusTime, 30000);
loadPortfolioPage();
