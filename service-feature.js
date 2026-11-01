(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-service-slider]').forEach(slider => {
    const slides = [...slider.querySelectorAll('[data-service-slide]')];
    const count = slider.querySelector('[data-service-count]');
    const pauseButton = slider.querySelector('[data-service-pause]');
    const name = slider.getAttribute('aria-label').replace(/ examples$/, '');
    let active = 0, visible = false, paused = motion.matches, timer;
    function sync() {
      slides.forEach((slide, i) => {
        const selected = i === active;
        slide.classList.toggle('is-active', selected);
        slide.setAttribute('aria-hidden', String(!selected));
        const video = slide.querySelector('video');
        if (!video) return;
        if (!selected || !visible || paused || document.hidden) { video.pause(); return; }
        if (!video.getAttribute('src')) video.src = video.dataset.src;
        video.play().catch(() => {});
      });
      count.textContent = `${String(active + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      pauseButton.textContent = paused ? 'Play' : 'Pause';
      pauseButton.setAttribute('aria-label', `${paused ? 'Play' : 'Pause'} ${name} slideshow`);
    }
    function schedule() { window.clearInterval(timer); if (visible && !paused && !document.hidden) timer = window.setInterval(() => { active = (active + 1) % slides.length; sync(); }, 8000); }
    function move(delta) { active = (active + delta + slides.length) % slides.length; sync(); schedule(); }
    slider.querySelector('[data-service-prev]').addEventListener('click', () => move(-1));
    slider.querySelector('[data-service-next]').addEventListener('click', () => move(1));
    pauseButton.addEventListener('click', () => { paused = !paused; sync(); schedule(); });
    document.addEventListener('visibilitychange', () => { sync(); schedule(); });
    motion.addEventListener?.('change', e => { if (e.matches) paused = true; sync(); schedule(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); schedule(); }, {threshold:.15}).observe(slider);
    else { visible = true; sync(); schedule(); }
    sync();
  });
})();
