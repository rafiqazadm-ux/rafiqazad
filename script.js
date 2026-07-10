const glow = document.querySelector(".cursor-glow");

if (glow) {
  window.addEventListener("pointermove", (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  });
}

const siteHeader = document.querySelector(".site-header");
const heroSection = document.querySelector(".hero");

if (siteHeader && heroSection) {
  let headerFrame = 0;

  const updateHeaderState = () => {
    headerFrame = 0;
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    siteHeader.classList.toggle("is-glass", heroBottom < 120);
  };

  const requestHeaderUpdate = () => {
    if (!headerFrame) {
      headerFrame = window.requestAnimationFrame(updateHeaderState);
    }
  };

  window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
  window.addEventListener("resize", requestHeaderUpdate);
  updateHeaderState();
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
  observer.observe(element);
});

const scrollScenes = Array.from(
  document.querySelectorAll("#projects, #decks, #social, #uiux, .writing-thumbs, #vertical, #testimonials, #contact")
);

if (scrollScenes.length) {
  const setActiveScene = (activeScene) => {
    scrollScenes.forEach((scene) => {
      scene.classList.toggle("is-active", scene === activeScene);
    });
  };

  scrollScenes.forEach((scene) => scene.classList.add("scroll-scene"));

  let sceneFrame = 0;

  const updateActiveScene = () => {
    sceneFrame = 0;
    const viewportCenter = window.innerHeight * 0.52;
    const visibleScenes = scrollScenes
      .map((scene) => {
        const rect = scene.getBoundingClientRect();
        const intersects = rect.top < window.innerHeight * 0.84 && rect.bottom > window.innerHeight * 0.16;
        const distance = rect.top <= viewportCenter && rect.bottom >= viewportCenter
          ? 0
          : Math.min(Math.abs(rect.top - viewportCenter), Math.abs(rect.bottom - viewportCenter));

        return { scene, intersects, distance };
      })
      .filter((entry) => entry.intersects)
      .sort((a, b) => a.distance - b.distance);

    if (visibleScenes[0]) {
      setActiveScene(visibleScenes[0].scene);
    }
  };

  const requestSceneUpdate = () => {
    if (!sceneFrame) {
      sceneFrame = window.requestAnimationFrame(updateActiveScene);
    }
  };

  window.addEventListener("scroll", requestSceneUpdate, { passive: true });
  window.addEventListener("resize", requestSceneUpdate);
  updateActiveScene();
}

const campaignPanels = Array.from(document.querySelectorAll(".campaign-panel"));

if (campaignPanels.length) {
  const setActiveCampaign = (activePanel) => {
    campaignPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel === activePanel);
    });
  };

  const campaignObserver = new IntersectionObserver(
    (entries) => {
      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (activeEntry) {
        setActiveCampaign(activeEntry.target);
      }
    },
    {
      threshold: [0.2, 0.4, 0.6, 0.8],
      rootMargin: "-18% 0px -34% 0px",
    }
  );

  campaignPanels.forEach((panel) => campaignObserver.observe(panel));
}

const heroTestimonials = [
  "Rafiq turns creative direction into clear campaigns that feel sharp, strategic, and easy to execute.",
  "His work brings together design taste, marketing thinking, and a strong sense of what the audience needs.",
  "Rafiq can take a rough idea and shape it into content, visuals, and messaging that actually performs.",
  "A rare creative who understands both the story and the numbers behind a campaign.",
];

const testimonialText = document.querySelector("#hero-testimonial-text");
let testimonialIndex = 0;

if (testimonialText) {
  window.setInterval(() => {
    testimonialText.classList.add("is-changing");
    window.setTimeout(() => {
      testimonialIndex = (testimonialIndex + 1) % heroTestimonials.length;
      testimonialText.textContent = heroTestimonials[testimonialIndex];
      testimonialText.classList.remove("is-changing");
    }, 450);
  }, 3800);
}

const pitchDecks = [
  {
    id: "cloudraise",
    company: "CloudRaise",
    title: "Cloudraise Pitch Deck",
    mark: "CR",
    glow: "rgba(255, 114, 35, 0.24)",
    type: "B2B fintech",
    description:
      "A clean, high-contrast deck system using bold messaging, structured visual hierarchy, and slide-by-slide narrative flow.",
    slides: [
      "media/054-artboard-1.webp",
      "media/055-artboard-2.webp",
      "media/056-artboard-3.webp",
      "media/057-artboard-4.webp",
      "media/054-artboard-1.webp",
      "media/054-artboard-1.webp",
      "media/054-artboard-1.webp",
      "media/054-artboard-1.webp",
    ],
  },
  {
    id: "colonial-filings",
    company: "Colonial Filings",
    title: "Colonial Filings Deck",
    logo: "media/007-colonial-stock-logo-new.png",
    glow: "rgba(24, 89, 164, 0.26)",
    type: "Compliance services",
    description:
      "A polished service deck built around investor clarity, filing support, market confidence, and simple explanations for complex compliance work.",
    slides: [
      "media/058-cover.webp",
      "media/059-about.webp",
      "media/060-challenges.webp",
      "media/061-capabilities.webp",
      "media/058-cover.webp",
      "media/058-cover.webp",
      "media/058-cover.webp",
      "media/058-cover.webp",
      "media/058-cover.webp",
      "media/058-cover.webp",
    ],
  },
  {
    id: "mixeal",
    company: "Mixeal Studios",
    title: "VR Game Marketing Deck",
    logo: "media/003-mixeal-logo.png",
    glow: "rgba(124, 86, 255, 0.28)",
    type: "Game marketing",
    description:
      "A service pitch for VR game studios, designed with clear pain points, creator-friendly positioning, and playful visual storytelling.",
    slides: [
      "media/062-vr-game-marketing-service-pitch-deck-pages-to-jpg-0001.webp",
      "media/063-vr-game-marketing-service-pitch-deck-pages-to-jpg-0002.webp",
      "media/064-vr-game-marketing-service-pitch-deck-pages-to-jpg-0003.webp",
      "media/065-vr-game-marketing-service-pitch-deck-pages-to-jpg-0004.webp",
      "media/062-vr-game-marketing-service-pitch-deck-pages-to-jpg-0001.webp",
      "media/062-vr-game-marketing-service-pitch-deck-pages-to-jpg-0001.webp",
      "media/062-vr-game-marketing-service-pitch-deck-pages-to-jpg-0001.webp",
      "media/062-vr-game-marketing-service-pitch-deck-pages-to-jpg-0001.webp",
      "media/062-vr-game-marketing-service-pitch-deck-pages-to-jpg-0001.webp",
      "media/062-vr-game-marketing-service-pitch-deck-pages-to-jpg-0001.webp",
      "media/062-vr-game-marketing-service-pitch-deck-pages-to-jpg-0001.webp",
      "media/062-vr-game-marketing-service-pitch-deck-pages-to-jpg-0001.webp",
      "media/062-vr-game-marketing-service-pitch-deck-pages-to-jpg-0001.webp",
      "media/062-vr-game-marketing-service-pitch-deck-pages-to-jpg-0001.webp",
      "media/062-vr-game-marketing-service-pitch-deck-pages-to-jpg-0001.webp",
    ],
  },
  {
    id: "grasp-xr",
    company: "GraspXR",
    title: "GraspXR Schools Deck",
    logo: "media/066-grasp-xr-logo.webp",
    glow: "rgba(77, 212, 255, 0.25)",
    type: "EdTech VR",
    description:
      "A compact institutional deck presenting immersive learning, classroom value, and VR adoption for schools in a direct visual format.",
    slides: [
      "media/067-graspxr-schools-pitch-deck-page-0001.webp",
      "media/068-graspxr-schools-pitch-deck-page-0002.webp",
      "media/069-graspxr-schools-pitch-deck-page-0003.webp",
      "media/070-graspxr-schools-pitch-deck-page-0004.webp",
      "media/067-graspxr-schools-pitch-deck-page-0001.webp",
      "media/067-graspxr-schools-pitch-deck-page-0001.webp",
    ],
  },
  {
    id: "medic-vr",
    company: "MedicVR",
    title: "MedicVR Pitch Deck",
    mark: "MVR",
    glow: "rgba(104, 88, 255, 0.26)",
    type: "Healthcare VR",
    description:
      "A healthcare-focused VR deck with clinical clarity, product storytelling, and an accessible structure for explaining immersive medical training.",
    slides: [
      "media/071-medic-vr-pitch-deck-page-0001.webp",
      "media/072-medic-vr-pitch-deck-page-0002.webp",
      "media/073-medic-vr-pitch-deck-page-0003.webp",
      "media/074-medic-vr-pitch-deck-page-0004.webp",
      "media/071-medic-vr-pitch-deck-page-0001.webp",
      "media/071-medic-vr-pitch-deck-page-0001.webp",
      "media/071-medic-vr-pitch-deck-page-0001.webp",
      "media/071-medic-vr-pitch-deck-page-0001.webp",
      "media/071-medic-vr-pitch-deck-page-0001.webp",
    ],
  },
  {
    id: "form345",
    company: "Form345",
    title: "Form345 Pitch Deck",
    logo: "media/075-form345-logo-large.png",
    glow: "rgba(255, 114, 35, 0.24)",
    type: "SEC reporting",
    description:
      "A direct B2B deck for simplifying insider filing workflows, using practical messaging and structured visuals for compliance-heavy audiences.",
    slides: [
      "media/076-artboard-1.webp",
      "media/077-artboard-2.webp",
      "media/078-artboard-2-copy.webp",
      "media/079-artboard-2-copy-2.webp",
      "media/076-artboard-1.webp",
      "media/076-artboard-1.webp",
      "media/076-artboard-1.webp",
      "media/076-artboard-1.webp",
      "media/076-artboard-1.webp",
      "media/076-artboard-1.webp",
      "media/076-artboard-1.webp",
    ],
  },
  {
    id: "southridge",
    company: "Southridge",
    title: "Southridge Services Deck",
    logo: "media/080-southridge-services-logo-3.png",
    glow: "rgba(58, 158, 112, 0.25)",
    type: "Financial services",
    description:
      "A service-led financial deck with a familiar narrative system: challenge, capability, trust signals, and a clean closing argument.",
    slides: [
      "media/081-cover.webp",
      "media/082-about.webp",
      "media/083-challenges.webp",
      "media/084-capabilities.webp",
      "media/081-cover.webp",
      "media/081-cover.webp",
      "media/081-cover.webp",
      "media/081-cover.webp",
      "media/081-cover.webp",
      "media/081-cover.webp",
    ],
  },
];

const pitchDeckSection = document.querySelector("[data-pitch-deck]");

if (pitchDeckSection) {
  const deckTitle = pitchDeckSection.querySelector("#deck-title");
  const deckCompany = pitchDeckSection.querySelector("#deck-company");
  const deckLogo = pitchDeckSection.querySelector("[data-deck-logo]");
  const deckTabs = pitchDeckSection.querySelector("[data-deck-tabs]");
  const deckRail = pitchDeckSection.querySelector("[data-deck-rail]");
  const deckStrip = pitchDeckSection.querySelector("[data-deck-strip]");
  const deckToggle = pitchDeckSection.querySelector("[data-deck-toggle]");
  const deckPrev = pitchDeckSection.querySelector("[data-deck-prev]");
  const deckNext = pitchDeckSection.querySelector("[data-deck-next]");
  let activeDeckIndex = 0;
  let deckExpanded = false;
  let deckTimer;

  const slideButton = (src, label, className) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.dataset.full = src;

    const image = document.createElement("img");
    image.src = src;
    image.alt = label;
    button.appendChild(image);

    return button;
  };

  const renderDeck = (index) => {
    const deck = pitchDecks[index];
    activeDeckIndex = index;
    deckTitle.textContent = deck.title;
    deckCompany.textContent = deck.company;
    pitchDeckSection.style.setProperty("--deck-glow", deck.glow);

    deckLogo.innerHTML = "";
    if (deck.logo) {
      const logoImage = document.createElement("img");
      logoImage.src = deck.logo;
      logoImage.alt = `${deck.company} logo`;
      deckLogo.appendChild(logoImage);
    } else {
      deckLogo.textContent = deck.mark || deck.company.slice(0, 2);
    }

    deckTabs.querySelectorAll("button").forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === index);
    });

    deckRail.innerHTML = "";
    deck.slides.slice(0, 3).forEach((slide, slideIndex) => {
      deckRail.appendChild(slideButton(slide, `${deck.title} slide ${slideIndex + 1}`, "deck-slide"));
    });

    deckStrip.innerHTML = "";
    const visibleSlides = deckExpanded ? deck.slides : deck.slides.slice(0, Math.min(6, deck.slides.length));
    visibleSlides.forEach((slide, slideIndex) => {
      deckStrip.appendChild(slideButton(slide, `${deck.title} preview ${slideIndex + 1}`, "deck-thumb"));
    });

    deckToggle.hidden = deck.slides.length <= 6;
    deckToggle.textContent = deckExpanded ? "Show fewer slides" : "Explore more slides";
  };

  const showDeck = (index, animate = true) => {
    const safeIndex = (index + pitchDecks.length) % pitchDecks.length;

    if (!animate) {
      renderDeck(safeIndex);
      return;
    }

    pitchDeckSection.classList.add("is-changing");
    window.setTimeout(() => {
      renderDeck(safeIndex);
      window.requestAnimationFrame(() => {
        pitchDeckSection.classList.remove("is-changing");
      });
    }, 240);
  };

  const restartDeckTimer = () => {
    window.clearInterval(deckTimer);
    deckTimer = window.setInterval(() => {
      deckExpanded = false;
      showDeck(activeDeckIndex + 1);
    }, 7200);
  };

  pitchDecks.forEach((deck, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = deck.company;
    button.addEventListener("click", () => {
      deckExpanded = false;
      showDeck(index);
      restartDeckTimer();
    });
    deckTabs.appendChild(button);
  });

  deckPrev.addEventListener("click", () => {
    deckExpanded = false;
    showDeck(activeDeckIndex - 1);
    restartDeckTimer();
  });

  deckNext.addEventListener("click", () => {
    deckExpanded = false;
    showDeck(activeDeckIndex + 1);
    restartDeckTimer();
  });

  deckToggle.addEventListener("click", () => {
    deckExpanded = !deckExpanded;
    renderDeck(activeDeckIndex);
    restartDeckTimer();
  });

  pitchDeckSection.addEventListener("pointerenter", () => window.clearInterval(deckTimer));
  pitchDeckSection.addEventListener("pointerleave", restartDeckTimer);

  showDeck(0, false);
  restartDeckTimer();
}

const uiProjects = [
  {
    id: "final-overs-ui",
    label: "Final Overs",
    title: "VR game interface system",
    glow: "rgba(255, 114, 35, 0.24)",
    screens: [
      "media/085-main-menu.webp",
      "media/086-select-teams.webp",
      "media/087-leaderboard.webp",
      "media/088-match-settings-qm.webp",
      "media/085-main-menu.webp",
      "media/085-main-menu.webp",
      "media/085-main-menu.webp",
      "media/085-main-menu.webp",
      "media/085-main-menu.webp",
      "media/085-main-menu.webp",
    ],
  },
  {
    id: "visual-ui",
    label: "Visual UI",
    title: "Product screen studies",
    glow: "rgba(87, 137, 255, 0.25)",
    screens: [
      "media/089-home-page-1.webp",
      "media/090-quick-match.png",
      "media/091-vv-ui-1.webp",
      "media/092-vv-ui-2.webp",
      "media/093-vv-ui-3.webp",
      "media/094-vv-ui-4.webp",
      "media/089-home-page-1.webp",
    ],
  },
  {
    id: "wireframes",
    label: "Wireframes",
    title: "Flow and structure",
    glow: "rgba(92, 194, 154, 0.23)",
    screens: [
      "media/089-home-page-1.webp",
      "media/089-home-page-1.webp",
      "media/089-home-page-1.webp",
      "media/089-home-page-1.webp",
      "media/089-home-page-1.webp",
      "media/089-home-page-1.webp",
      "media/089-home-page-1.webp",
      "media/089-home-page-1.webp",
      "media/089-home-page-1.webp",
      "media/089-home-page-1.webp",
      "media/089-home-page-1.webp",
      "media/089-home-page-1.webp",
    ],
  },
];

const uiShowcase = document.querySelector("[data-ui-showcase]");

if (uiShowcase) {
  const uiKicker = uiShowcase.querySelector("#ui-kicker");
  const uiTitle = uiShowcase.querySelector("#ui-title");
  const uiStage = uiShowcase.querySelector("[data-ui-stage]");
  const uiStrip = uiShowcase.querySelector("[data-ui-strip]");
  const uiTabs = uiShowcase.querySelector("[data-ui-tabs]");
  const uiPrev = uiShowcase.querySelector("[data-ui-prev]");
  const uiNext = uiShowcase.querySelector("[data-ui-next]");
  let activeUiIndex = 0;

  const uiButton = (src, label, className) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.dataset.full = src;

    const image = document.createElement("img");
    image.src = src;
    image.alt = label;
    button.appendChild(image);

    return button;
  };

  const renderUiProject = (index) => {
    const project = uiProjects[index];
    activeUiIndex = index;
    uiKicker.textContent = project.label;
    uiTitle.textContent = project.title;
    uiShowcase.style.setProperty("--ui-glow", project.glow);

    uiTabs.querySelectorAll("button").forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === index);
    });

    uiStage.innerHTML = "";
    project.screens.slice(0, 3).forEach((screen, screenIndex) => {
      const classes = ["ui-screen primary", "ui-screen left", "ui-screen right"];
      uiStage.appendChild(uiButton(screen, `${project.title} screen ${screenIndex + 1}`, classes[screenIndex] || "ui-screen"));
    });

    uiStrip.innerHTML = "";
    project.screens.forEach((screen, screenIndex) => {
      uiStrip.appendChild(uiButton(screen, `${project.title} preview ${screenIndex + 1}`, "ui-thumb"));
    });
  };

  const showUiProject = (index, animate = true) => {
    const safeIndex = (index + uiProjects.length) % uiProjects.length;

    if (!animate) {
      renderUiProject(safeIndex);
      return;
    }

    uiShowcase.classList.add("is-changing");
    window.setTimeout(() => {
      renderUiProject(safeIndex);
      window.requestAnimationFrame(() => {
        uiShowcase.classList.remove("is-changing");
      });
    }, 240);
  };

  uiProjects.forEach((project, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = project.label;
    button.addEventListener("click", () => showUiProject(index));
    uiTabs.appendChild(button);
  });

  uiPrev.addEventListener("click", () => showUiProject(activeUiIndex - 1));
  uiNext.addEventListener("click", () => showUiProject(activeUiIndex + 1));

  showUiProject(0, false);
}

const lightbox = document.querySelector("#image-lightbox");

if (lightbox) {
  const lightboxImage = lightbox.querySelector("img");
  const closeButton = lightbox.querySelector(".lightbox-close");

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-full]");

    if (!trigger) {
      return;
    }

    if (trigger.dataset.reelUrl) {
      window.open(trigger.dataset.reelUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const image = trigger.querySelector("img");
    lightboxImage.src = trigger.dataset.full;
    lightboxImage.alt = image?.alt || "Portfolio design preview";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  });

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
  };

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}
