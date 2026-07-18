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

const recommendationRotator = document.querySelector("[data-testimonial-rotator]");

if (recommendationRotator) {
  const recommendations = [
    {
      quote: "Rafiq helped me with various things connected to SEO and writing content for my blog. I am grateful for his help.",
      name: "Vova Even",
      role: "Client",
    },
    {
      quote: "The best thing about Rafiq; he is a super humble person. He is one of the best writers I have ever worked with, but his humility and attitude are amazing.",
      name: "Sahar Arshad",
      role: "Business Development",
    },
    {
      quote: "Rafiq was one of the very dependable and intelligent content writers I have worked with. He took the most challenging technical projects and worked his way beautifully through them.",
      name: "Iffa Anwar",
      role: "Chief Accountability Manager",
    },
    {
      quote: "Rafiq is one of the most disciplined and dedicated people that I have worked with. Always there to help and available for guidance.",
      name: "Afrah Farrukh",
      role: "Creative Team Member",
    },
    {
      quote: "Rafiq is, hands down, one of the best writers I have worked with so far. He is full of creativity and innovative ideas, always thinking outside the box to give his all to his work.",
      name: "Arsh Khan",
      role: "Writer | Editor | Digital Marketer",
    },
    {
      quote: "Rafiq is an incredible content writer with a knack for writing creative content. His willingness to go above and beyond has always made him stand out.",
      name: "Fatima Ejaz",
      role: "Talent Acquisition Specialist",
    },
    {
      quote: "I have known Mr. Rafiq Azad Mangi for the past 07 years and have found him one of the most dynamic professionals in my network.",
      name: "Sanjay Mathrani",
      role: "Assistant Director",
    },
    {
      quote: "Rafiq has the knack for converting even the most mundane piece of writing into a masterpiece. His ingenuity, meticulousness, and communication skills are commendable.",
      name: "Shefa Idrees",
      role: "Creative Director, Copywriter",
    },
  ];

  const quoteElement = recommendationRotator.querySelector("[data-testimonial-quote]");
  const nameElement = recommendationRotator.querySelector("[data-testimonial-name]");
  const roleElement = recommendationRotator.querySelector("[data-testimonial-role]");
  let recommendationIndex = 0;
  let recommendationTimer = 0;

  const showRecommendation = (index) => {
    const safeIndex = (index + recommendations.length) % recommendations.length;
    const recommendation = recommendations[safeIndex];
    recommendationIndex = safeIndex;
    recommendationRotator.classList.add("is-changing");

    window.setTimeout(() => {
      quoteElement.textContent = recommendation.quote;
      nameElement.textContent = recommendation.name;
      roleElement.textContent = recommendation.role;
      recommendationRotator.classList.remove("is-changing");
    }, 520);
  };

  const restartRecommendationTimer = () => {
    window.clearInterval(recommendationTimer);
    recommendationTimer = window.setInterval(() => {
      showRecommendation(recommendationIndex + 1);
    }, 7000);
  };

  restartRecommendationTimer();
}

const heroTestimonials = [
  "Rafiq helped me with SEO and writing content for my blog. I am grateful for his help.",
  "He is one of the best writers I have ever worked with, but his humility and attitude are amazing.",
  "He took the most challenging technical projects and worked his way beautifully through them.",
  "His willingness to go above and beyond has always made him stand out.",
  "He can turn even mundane writing into a masterpiece.",
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
      "media/084-artboard-1.webp",
      "media/085-artboard-2.webp",
      "media/086-artboard-3.webp",
      "media/087-artboard-4.webp",
      "media/088-artboard-4-copy.webp",
      "media/089-artboard-4-copy-2.webp",
      "media/090-artboard-5.webp",
      "media/091-artboard-6.webp",
    ],
  },
  {
    id: "colonial-filings",
    company: "Colonial Filings",
    title: "Colonial Filings Deck",
    logo: "media/007-colonial-stock-logo-new.webp",
    glow: "rgba(24, 89, 164, 0.26)",
    type: "Compliance services",
    description:
      "A polished service deck built around investor clarity, filing support, market confidence, and simple explanations for complex compliance work.",
    slides: [
      "media/092-cover.webp",
      "media/093-about.webp",
      "media/094-challenges.webp",
      "media/095-capabilities.webp",
      "media/096-why-choose-colonial-filings.webp",
      "media/097-testimonials.webp",
      "media/098-artboard-1.webp",
      "media/099-artboard-2.webp",
      "media/100-conclusion.webp",
      "media/101-conclusion-copy-2.webp",
    ],
  },
  {
    id: "mixeal",
    company: "Mixeal Studios",
    title: "VR Game Marketing Deck",
    logo: "media/003-mixeal-logo.webp",
    glow: "rgba(124, 86, 255, 0.28)",
    type: "Game marketing",
    description:
      "A service pitch for VR game studios, designed with clear pain points, creator-friendly positioning, and playful visual storytelling.",
    slides: [
      "media/016-vr-game-marketing-service-pitch-deck-pages.webp",
      "media/102-vr-game-marketing-service-pitch-deck-pages.webp",
      "media/103-vr-game-marketing-service-pitch-deck-pages.webp",
      "media/104-vr-game-marketing-service-pitch-deck-pages.webp",
      "media/105-vr-game-marketing-service-pitch-deck-pages.webp",
      "media/106-vr-game-marketing-service-pitch-deck-pages.webp",
      "media/107-vr-game-marketing-service-pitch-deck-pages.webp",
      "media/108-vr-game-marketing-service-pitch-deck-pages.webp",
      "media/109-vr-game-marketing-service-pitch-deck-pages.webp",
      "media/110-vr-game-marketing-service-pitch-deck-pages.webp",
      "media/111-vr-game-marketing-service-pitch-deck-pages.webp",
      "media/112-vr-game-marketing-service-pitch-deck-pages.webp",
      "media/113-vr-game-marketing-service-pitch-deck-pages.webp",
      "media/114-vr-game-marketing-service-pitch-deck-pages.webp",
      "media/115-vr-game-marketing-service-pitch-deck-pages.webp",
    ],
  },
  {
    id: "grasp-xr",
    company: "GraspXR",
    title: "GraspXR Schools Deck",
    logo: "media/116-grasp-xr-logo.webp",
    glow: "rgba(77, 212, 255, 0.25)",
    type: "EdTech VR",
    description:
      "A compact institutional deck presenting immersive learning, classroom value, and VR adoption for schools in a direct visual format.",
    slides: [
      "media/117-graspxr-schools-pitch-deck-page-0001.webp",
      "media/118-graspxr-schools-pitch-deck-page-0002.webp",
      "media/119-graspxr-schools-pitch-deck-page-0003.webp",
      "media/120-graspxr-schools-pitch-deck-page-0004.webp",
      "media/121-graspxr-schools-pitch-deck-page-0005.webp",
      "media/122-graspxr-schools-pitch-deck-page-0006.webp",
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
      "media/123-medic-vr-pitch-deck-page-0001.webp",
      "media/124-medic-vr-pitch-deck-page-0002.webp",
      "media/125-medic-vr-pitch-deck-page-0003.webp",
      "media/126-medic-vr-pitch-deck-page-0004.webp",
      "media/127-medic-vr-pitch-deck-page-0005.webp",
      "media/128-medic-vr-pitch-deck-page-0006.webp",
      "media/129-medic-vr-pitch-deck-page-0007.webp",
      "media/130-medic-vr-pitch-deck-page-0008.webp",
      "media/131-medic-vr-pitch-deck-page-0009.webp",
    ],
  },
  {
    id: "form345",
    company: "Form345",
    title: "Form345 Pitch Deck",
    logo: "media/132-form345-logo-large.webp",
    glow: "rgba(255, 114, 35, 0.24)",
    type: "SEC reporting",
    description:
      "A direct B2B deck for simplifying insider filing workflows, using practical messaging and structured visuals for compliance-heavy audiences.",
    slides: [
      "media/133-artboard-1.webp",
      "media/134-artboard-2.webp",
      "media/135-artboard-2-copy.webp",
      "media/136-artboard-2-copy-2.webp",
      "media/137-artboard-2-copy-3.webp",
      "media/138-artboard-2-copy-4.webp",
      "media/139-artboard-2-copy-5.webp",
      "media/140-artboard-2-copy-6.webp",
      "media/141-artboard-2-copy-7.webp",
      "media/142-artboard-2-copy-8.webp",
      "media/143-artboard-3.webp",
    ],
  },
  {
    id: "southridge",
    company: "Southridge",
    title: "Southridge Services Deck",
    logo: "media/144-southridge-services-logo-3.webp",
    glow: "rgba(58, 158, 112, 0.25)",
    type: "Financial services",
    description:
      "A service-led financial deck with a familiar narrative system: challenge, capability, trust signals, and a clean closing argument.",
    slides: [
      "media/145-cover.webp",
      "media/146-about.webp",
      "media/147-challenges.webp",
      "media/148-capabilities.webp",
      "media/149-why-choose-colonial-filings.webp",
      "media/150-testimonials.webp",
      "media/151-artboard-1.webp",
      "media/152-artboard-2.webp",
      "media/153-conclusion.webp",
      "media/154-conclusion-copy-2.webp",
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
  let deckSwipeStartX = 0;
  let deckSwipeStartY = 0;
  let deckSwipeTracking = false;

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

  const startDeckSwipe = (event) => {
    if (event.target.closest("button, a")) {
      return;
    }
    deckSwipeTracking = true;
    deckSwipeStartX = event.clientX;
    deckSwipeStartY = event.clientY;
    window.clearInterval(deckTimer);
  };

  const finishDeckSwipe = (event) => {
    if (!deckSwipeTracking) {
      return;
    }
    deckSwipeTracking = false;
    const deltaX = event.clientX - deckSwipeStartX;
    const deltaY = event.clientY - deckSwipeStartY;
    if (Math.abs(deltaX) > 70 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      deckExpanded = false;
      showDeck(deltaX < 0 ? activeDeckIndex + 1 : activeDeckIndex - 1);
    }
    restartDeckTimer();
  };

  [pitchDeckSection, deckRail].forEach((swipeArea) => {
    swipeArea.addEventListener("pointerdown", startDeckSwipe);
    swipeArea.addEventListener("pointerup", finishDeckSwipe);
    swipeArea.addEventListener("pointercancel", () => {
      deckSwipeTracking = false;
      restartDeckTimer();
    });
  });

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
      "media/155-main-menu.webp",
      "media/156-select-teams.webp",
      "media/157-leaderboard.webp",
      "media/158-match-settings-qm.webp",
      "media/159-select-stadium.webp",
      "media/160-batting-scorecard.webp",
      "media/161-over-completed.webp",
      "media/162-scorecard-10.webp",
      "media/163-match-won-2.webp",
      "media/164-match-lost.webp",
    ],
  },
  {
    id: "visual-ui",
    label: "Visual UI",
    title: "Product screen studies",
    glow: "rgba(87, 137, 255, 0.25)",
    screens: [
      "media/165-home-page-1.webp",
      "media/166-quick-match.webp",
      "media/167-vv-ui-1.webp",
      "media/168-vv-ui-2.webp",
      "media/169-vv-ui-3.webp",
      "media/170-vv-ui-4.webp",
      "media/171-vv-ui-5.webp",
    ],
  },
  {
    id: "wireframes",
    label: "Wireframes",
    title: "Flow and structure",
    glow: "rgba(92, 194, 154, 0.23)",
    screens: [
      "media/172-home-page.webp",
      "media/173-game-mode.webp",
      "media/174-quick-match.webp",
      "media/175-match-starting-screen.webp",
      "media/176-batting-scorecard.webp",
      "media/177-leaderboards.webp",
      "media/178-profile.webp",
      "media/179-profiles.webp",
      "media/180-practice.webp",
      "media/181-join-beta.webp",
      "media/182-match-completed-screen.webp",
      "media/183-next-over-screen.webp",
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




const colonialCarousel = document.querySelector("[data-colonial-carousel]");

if (colonialCarousel) {
  const slides = Array.from(colonialCarousel.querySelectorAll("[data-colonial-slide]"));
  const title = colonialCarousel.querySelector("[data-colonial-title]");
  const dots = Array.from(colonialCarousel.querySelectorAll("[data-colonial-index]"));
  const toggle = colonialCarousel.querySelector("[data-colonial-toggle]");
  const toggleLabel = colonialCarousel.querySelector("[data-colonial-toggle-label]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeSlide = 0;
  let rotationTimer = 0;
  let carouselIsVisible = false;
  let isPausedByVisitor = false;
  let isHovered = false;
  let pointerStartX = null;
  let cleanupTimer = 0;

  const syncColonialToggle = () => {
    toggleLabel.textContent = isPausedByVisitor ? "Play" : "Pause";
    toggle.setAttribute("aria-label", isPausedByVisitor ? "Resume Colonial visual rotation" : "Pause Colonial visual rotation");
  };

  const stopColonialRotation = () => {
    window.clearInterval(rotationTimer);
    rotationTimer = 0;
  };

  const startColonialRotation = () => {
    stopColonialRotation();
    if (!carouselIsVisible || isPausedByVisitor || isHovered || document.hidden || prefersReducedMotion.matches) return;
    rotationTimer = window.setInterval(() => showColonialSlide(activeSlide + 1, 1), 3000);
  };

  const showColonialSlide = (index, direction = 1) => {
    const safeIndex = (index + slides.length) % slides.length;
    if (safeIndex === activeSlide) return;

    const previous = slides[activeSlide];
    const selected = slides[safeIndex];

    window.clearTimeout(cleanupTimer);
    previous.classList.remove("is-active", "is-entering-back");
    previous.classList.add(direction < 0 ? "is-leaving-back" : "is-leaving");
    previous.setAttribute("aria-hidden", "true");

    selected.classList.remove("is-active", "is-leaving", "is-leaving-back");
    if (direction < 0) selected.classList.add("is-entering-back");

    void selected.offsetWidth;
    selected.classList.add("is-active");
    selected.classList.remove("is-entering-back");
    selected.setAttribute("aria-hidden", "false");

    activeSlide = safeIndex;
    title.textContent = selected.dataset.title;

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === safeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });

    cleanupTimer = window.setTimeout(() => {
      previous.classList.remove("is-leaving", "is-leaving-back");
    }, 780);
  };

  colonialCarousel.querySelector("[data-colonial-prev]").addEventListener("click", () => {
    showColonialSlide(activeSlide - 1, -1);
    startColonialRotation();
  });

  colonialCarousel.querySelector("[data-colonial-next]").addEventListener("click", () => {
    showColonialSlide(activeSlide + 1, 1);
    startColonialRotation();
  });

  dots.forEach((dot) => dot.addEventListener("click", () => {
    const targetIndex = Number(dot.dataset.colonialIndex);
    showColonialSlide(targetIndex, targetIndex < activeSlide ? -1 : 1);
    startColonialRotation();
  }));

  toggle.addEventListener("click", () => {
    isPausedByVisitor = !isPausedByVisitor;
    syncColonialToggle();
    startColonialRotation();
  });

  colonialCarousel.addEventListener("mouseenter", () => {
    isHovered = true;
    stopColonialRotation();
  });

  colonialCarousel.addEventListener("mouseleave", () => {
    isHovered = false;
    startColonialRotation();
  });

  colonialCarousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showColonialSlide(activeSlide - 1, -1);
      startColonialRotation();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showColonialSlide(activeSlide + 1, 1);
      startColonialRotation();
    }
  });

  colonialCarousel.addEventListener("pointerdown", (event) => {
    pointerStartX = event.clientX;
  });

  colonialCarousel.addEventListener("pointerup", (event) => {
    if (pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(distance) >= 42) {
      const direction = distance < 0 ? 1 : -1;
      showColonialSlide(activeSlide + direction, direction);
      startColonialRotation();
    }
  });

  const colonialObserver = new IntersectionObserver(
    ([entry]) => {
      carouselIsVisible = entry.isIntersecting && entry.intersectionRatio >= 0.3;
      startColonialRotation();
    },
    { threshold: [0, 0.3, 0.65] }
  );

  colonialObserver.observe(colonialCarousel);

  document.addEventListener("visibilitychange", startColonialRotation);
  prefersReducedMotion.addEventListener?.("change", startColonialRotation);

  syncColonialToggle();
}

const mixealCarousel = document.querySelector("[data-mixeal-carousel]");

if (mixealCarousel) {
  const reels = [
    { src: "media/201-mixeal-reel-meta-quest-2.mp4", title: "Meta Quest 2 Is Now the Cheapest VR Headset", shortTitle: "Meta Quest 2", subtitle: "VR news made quick, timely, and audience-friendly." },
    { src: "media/202-mixeal-reel-meta-quest-3.mp4", title: "Inside Mixeal Through the Lens of Meta Quest 3", shortTitle: "Meta Quest 3 Tour", subtitle: "An immersive studio tour built for social discovery." },
    { src: "media/203-mixeal-reel-cornfield-chase.mp4", title: "The Cornfield Chase Through Mixeal Studios", shortTitle: "Cornfield Chase", subtitle: "Studio culture translated into a cinematic social moment." },
    { src: "media/204-mixeal-reel-vr-development-skills.mp4", title: "Five Skills Every VR Developer Needs", shortTitle: "VR Development Skills", subtitle: "Technical expertise simplified into a fast educational format." },
    { src: "media/205-mixeal-reel-final-overs-development.mp4", title: "How We Develop VR Games Like The Final Overs", shortTitle: "Building VR Games", subtitle: "A behind-the-scenes process story from ideation to execution." },
    { src: "media/206-mixeal-reel-vr-programming.mp4", title: "Our Team Takes On the VR Programming Challenge", shortTitle: "VR Programming", subtitle: "Complex development work presented with personality and confidence." },
  ];

  const video = mixealCarousel.querySelector("[data-reel-video]");
  const title = mixealCarousel.querySelector("[data-reel-title]");
  const subtitle = mixealCarousel.querySelector("[data-reel-subtitle]");
  const count = mixealCarousel.querySelector("[data-reel-count]");
  const previousTitle = mixealCarousel.querySelector("[data-reel-prev-title]");
  const nextTitle = mixealCarousel.querySelector("[data-reel-next-title]");
  const toggle = mixealCarousel.querySelector("[data-reel-toggle]");
  const toggleLabel = mixealCarousel.querySelector("[data-reel-toggle-label]");
  const dots = Array.from(mixealCarousel.querySelectorAll("[data-reel-index]"));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeReel = 0;
  let carouselIsVisible = false;
  let pointerStartX = null;
  let changeTimer = 0;

  const syncToggle = () => {
    const paused = video.paused;
    toggleLabel.textContent = paused ? "Play" : "Pause";
    toggle.setAttribute("aria-label", paused ? "Play active Mixeal reel" : "Pause active Mixeal reel");
  };

  const playActiveReel = () => {
    if (!carouselIsVisible || prefersReducedMotion.matches || document.hidden) return;
    video.play().then(syncToggle).catch(syncToggle);
  };

  const showReel = (index, animate = true) => {
    const safeIndex = (index + reels.length) % reels.length;
    const previousIndex = (safeIndex - 1 + reels.length) % reels.length;
    const nextIndex = (safeIndex + 1) % reels.length;
    const selected = reels[safeIndex];

    window.clearTimeout(changeTimer);

    const render = () => {
      activeReel = safeIndex;
      video.pause();
      video.src = selected.src;
      video.setAttribute("aria-label", selected.title);
      video.load();
      title.textContent = selected.title;
      subtitle.textContent = selected.subtitle;
      count.textContent = `${String(safeIndex + 1).padStart(2, "0")} / ${String(reels.length).padStart(2, "0")}`;
      previousTitle.textContent = reels[previousIndex].shortTitle;
      nextTitle.textContent = reels[nextIndex].shortTitle;

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === safeIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-selected", String(isActive));
      });

      video.addEventListener("canplay", playActiveReel, { once: true });
      window.requestAnimationFrame(() => mixealCarousel.classList.remove("is-changing"));
    };

    if (animate) {
      mixealCarousel.classList.add("is-changing");
      changeTimer = window.setTimeout(render, 220);
    } else {
      render();
    }
  };

  mixealCarousel.querySelectorAll("[data-reel-prev]").forEach((button) => button.addEventListener("click", () => showReel(activeReel - 1)));
  mixealCarousel.querySelectorAll("[data-reel-next]").forEach((button) => button.addEventListener("click", () => showReel(activeReel + 1)));
  dots.forEach((dot) => dot.addEventListener("click", () => showReel(Number(dot.dataset.reelIndex))));

  toggle.addEventListener("click", () => {
    if (video.paused) video.play().then(syncToggle).catch(syncToggle);
    else { video.pause(); syncToggle(); }
  });

  video.addEventListener("play", syncToggle);
  video.addEventListener("pause", syncToggle);

  mixealCarousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); showReel(activeReel - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); showReel(activeReel + 1); }
  });

  mixealCarousel.addEventListener("pointerdown", (event) => { pointerStartX = event.clientX; });
  mixealCarousel.addEventListener("pointerup", (event) => {
    if (pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(distance) >= 42) showReel(activeReel + (distance < 0 ? 1 : -1));
  });

  const reelObserver = new IntersectionObserver(
    ([entry]) => {
      carouselIsVisible = entry.isIntersecting && entry.intersectionRatio >= 0.32;
      if (carouselIsVisible) playActiveReel();
      else video.pause();
      syncToggle();
    },
    { threshold: [0, 0.32, 0.65] }
  );

  reelObserver.observe(mixealCarousel);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) video.pause();
    else playActiveReel();
    syncToggle();
  });

  prefersReducedMotion.addEventListener?.("change", () => {
    if (prefersReducedMotion.matches) video.pause();
    else playActiveReel();
    syncToggle();
  });

  showReel(0, false);
  syncToggle();
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
