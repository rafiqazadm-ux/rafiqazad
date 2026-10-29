/* Creative Motion V2. Small enhancements that fail safely. */
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  document.documentElement.classList.add("motion-ready");

  // A non-interactive reading progress rail.
  const progress = document.createElement("div");
  progress.className = "page-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  const navLinks = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
  const targets = navLinks.map(link => ({link, section: document.querySelector(link.getAttribute("href"))}))
    .filter(item => item.section);
  let scheduled = false;
  const update = () => {
    scheduled = false;
    const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const amount = Math.min(1, Math.max(0, window.scrollY / scrollable));
    progress.style.transform = "scaleX(" + amount + ")";
    if (targets.length) {
      const marker = window.innerHeight * .33;
      let current = targets[0];
      targets.forEach(item => {
        if (item.section.getBoundingClientRect().top <= marker) current = item;
      });
      targets.forEach(item => {
        if (item === current) item.link.setAttribute("aria-current", "location");
        else item.link.removeAttribute("aria-current");
      });
    }
  };
  const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
  window.addEventListener("scroll", schedule, {passive:true});
  window.addEventListener("resize", schedule);
  update();

  // Pause the subtle cursor glow entirely on touch devices and on reduced motion.
  const glow = document.querySelector(".cursor-glow");
  if (glow && (reduce.matches || !window.matchMedia("(hover: hover) and (pointer: fine)").matches)) {
    glow.hidden = true;
  }

  // Keyboard access to image-trigger tiles which otherwise depend on click handlers.
  document.querySelectorAll('[data-full]:not(a):not(button)').forEach(tile => {
    if (!tile.hasAttribute("tabindex")) tile.tabIndex = 0;
    if (!tile.hasAttribute("role")) tile.setAttribute("role", "button");
    if (!tile.hasAttribute("aria-label")) tile.setAttribute("aria-label", "Open portfolio image");
    tile.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault(); tile.click();
      }
    });
  });
})();
