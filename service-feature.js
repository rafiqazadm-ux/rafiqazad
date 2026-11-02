(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const dialog = document.querySelector('.work-dialog');
  const media = dialog.querySelector('.work-dialog-media');
  const title = dialog.querySelector('#work-dialog-title');
  let opener = null, activeVideo = null;
  const strips = [...document.querySelectorAll('[data-marquee]')];

  function duration(strip) {
    const group = strip.querySelector('.marquee-group');
    strip.querySelector('.marquee-track').style.setProperty('--marquee-duration', `${Math.max(18, group.getBoundingClientRect().width / 20)}s`);
  }
  strips.forEach(strip => {
    const pause = strip.querySelector('.marquee-pause');
    let manuallyPaused = false;
    duration(strip);
    if ('ResizeObserver' in window) new ResizeObserver(() => duration(strip)).observe(strip.querySelector('.marquee-group'));
    pause.addEventListener('click', () => {
      manuallyPaused = !manuallyPaused;
      strip.classList.toggle('is-paused', manuallyPaused);
      pause.textContent = manuallyPaused ? 'Resume movement' : 'Pause movement';
      pause.setAttribute('aria-pressed', String(manuallyPaused));
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => strip.classList.toggle('is-offscreen', !e.isIntersecting), {threshold:0}).observe(strip);
    strip.addEventListener('click', e => {
      const card = e.target.closest('.marquee-card');
      if (!card) return;
      opener = card;
      title.textContent = card.dataset.caption;
      dialog.querySelector(".work-dialog-description").textContent = card.closest(".service-feature").querySelector(".service-feature-copy > p:not(.eyebrow)")?.textContent || "";
      media.replaceChildren();
      const element = document.createElement(card.dataset.kind === 'video' ? 'video' : 'img');
      if (card.dataset.kind === 'video') {
        element.controls = true; element.playsInline = true; element.preload = 'metadata';
        element.poster = card.dataset.poster || '';
      } else element.alt = card.dataset.caption;
      element.src = card.dataset.media;
      media.appendChild(element);
      dialog.showModal();
      if (element.tagName === 'VIDEO') element.play().catch(() => {});
    });
  });
  dialog.querySelector('.work-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { const v = media.querySelector('video'); if (v) v.pause(); media.replaceChildren(); opener?.focus(); });

  function stopVideo() {
    if (!activeVideo) return;
    activeVideo.pause();
    activeVideo.removeAttribute('src');
    activeVideo.load();
    activeVideo = null;
  }
  function updateVideo() {
    if (document.hidden || dialog.open || motion.matches || navigator.connection?.saveData) { stopVideo(); return; }
    let best = null, bestScore = Infinity;
    strips.forEach(strip => {
      if (strip.classList.contains('is-offscreen') || strip.classList.contains('is-paused')) return;
      const bounds = strip.querySelector('.marquee-viewport').getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= innerHeight) return;
      strip.querySelectorAll('.marquee-video').forEach(card => {
        const r = card.getBoundingClientRect();
        const overlap = Math.min(r.right,bounds.right) - Math.max(r.left,bounds.left);
        if (overlap < r.width * .7) return;
        const score = Math.abs((r.left+r.right)/2 - (bounds.left+bounds.right)/2) + Math.abs((r.top+r.bottom)/2 - innerHeight/2);
        if (score < bestScore) { bestScore=score; best=card; }
      });
    });
    const video = best?.querySelector('video');
    if (video === activeVideo) return;
    stopVideo();
    if (video) { activeVideo=video; video.src=best.dataset.media; video.play().catch(() => {}); }
  }
  document.addEventListener('visibilitychange', updateVideo);
  dialog.addEventListener('close', updateVideo);
  motion.addEventListener?.('change', updateVideo);
  setInterval(updateVideo, 1200);
  updateVideo();
})();
(() => {
  const cards = [...document.querySelectorAll('.tool-card')];
  function closeAll(except) { cards.forEach(card => { if (card !== except) { card.classList.remove('is-open'); card.querySelector('.tool-button')?.setAttribute('aria-expanded','false'); } }); }
  cards.forEach(card => {
    const button = card.querySelector('.tool-button');
    if (!button) return;
    button.addEventListener('click', () => { const open = !card.classList.contains('is-open'); closeAll(card); card.classList.toggle('is-open', open); button.setAttribute('aria-expanded', String(open)); });
  });
  document.addEventListener('click', event => { if (!event.target.closest('.tool-card')) closeAll(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeAll(); });
})();
