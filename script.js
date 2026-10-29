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
      <section class="hero container">
        <div class="hero-text">
          <p class="hello">${escapeHtml(hero.intro)}</p>
          <h1>${escapeHtml(hero.name)}</h1>
          <p>${escapeHtml(hero.subtitle)}</p>
          <a href="contact.html" class="btn">${icon("fa-solid fa-paper-plane")} ${escapeHtml(hero.contactLabel)}</a>
        </div>
        <div class="photo-box"><img src="${escapeHtml(hero.image)}" alt="${escapeHtml(hero.imageAlt)}"></div>
      </section>
      <section class="about container" id="about">
        <div class="photo-box"><img src="${escapeHtml(bio.image)}" alt="${escapeHtml(bio.imageAlt)}"></div>
        <div class="about-content">
          <p class="eyebrow">${escapeHtml(bio.eyebrow)}</p>
          <h2 class="section-title">${escapeHtml(bio.title)}</h2>
          <p>${escapeHtml(bio.description)}</p>
          <a href="${escapeHtml(bio.publicationUrl)}" class="btn" target="_blank" rel="noopener">${escapeHtml(bio.publicationLabel)}</a>
        </div>
      </section>
    </div>`;
}

function renderEducation(page) {
  const items = page.items
    .map(
      (item) => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <span class="timeline-year">${escapeHtml(item.period)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="timeline-place">${escapeHtml(item.place)}</p>
          ${item.details.map((detail) => `<p>${escapeHtml(detail)}</p>`).join("")}
        </div>`,
    )
    .join("");

  return `
    <div class="folder-view" data-folder-view="education">
      ${folderToolbar(page)}
      <section id="education"><div class="container">
        <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
        <h2 class="section-title">${escapeHtml(page.title)}</h2>
        <div class="timeline">${items}</div>
      </div></section>
    </div>`;
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
        <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
        <h2 class="section-title">${escapeHtml(page.title)}</h2>
        <div class="skills-row">${items}</div>
      </div></section>
    </div>`;
}

function renderProjects(page) {
  const cards = page.items
    .map((item) => {
      const tags = item.tags
        .map((tag) => `<span>${escapeHtml(tag)}</span>`)
        .join("");
      const links = item.links
        .map(
          (link) => `
            <a href="${escapeHtml(link.url)}" class="btn-link"${link.external ? ' target="_blank" rel="noopener"' : ""}>
              ${escapeHtml(link.label)} ${link.icon ? icon(link.icon) : ""}
            </a>`,
        )
        .join("");
      return `
        <div class="project-card">
          <div class="project-thumb"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt)}"></div>
          <div class="project-body">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
            <div class="project-tags">${tags}</div>
            <div class="project-links">${links}</div>
          </div>
        </div>`;
    })
    .join("");

  return `
    <div class="folder-view" data-folder-view="projects">
      ${folderToolbar(page)}
      <section id="projects"><div class="container">
        <div class="section-head-row">
          <div><p class="eyebrow">${escapeHtml(page.eyebrow)}</p><h2 class="section-title">${escapeHtml(page.title)}</h2></div>
          <div class="carousel-controls">
            <button class="carousel-btn" id="projectsPrev" aria-label="Proyek sebelumnya">${icon("fa-solid fa-chevron-left")}</button>
            <button class="carousel-btn" id="projectsNext" aria-label="Proyek berikutnya">${icon("fa-solid fa-chevron-right")}</button>
          </div>
        </div>
        <div class="projects-track" id="projectsTrack">${cards}</div>
      </div></section>
    </div>`;
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
        <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
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
          <div><p class="eyebrow">${escapeHtml(page.eyebrow)}</p><h2 class="section-title">${escapeHtml(page.title)}</h2></div>
          <div class="carousel-controls">
            <button class="carousel-btn" id="certPrev" aria-label="Sertifikat sebelumnya">${icon("fa-solid fa-chevron-left")}</button>
            <button class="carousel-btn" id="certNext" aria-label="Sertifikat berikutnya">${icon("fa-solid fa-chevron-right")}</button>
          </div>
        </div>
        <div class="cert-track" id="certTrack">${cards}</div>
      </div></section>
      <section id="documentation"><div class="container">
        <p class="eyebrow">${escapeHtml(page.documentation.eyebrow)}</p>
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
