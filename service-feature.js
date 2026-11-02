(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const dialog = document.querySelector('.work-dialog');
  const media = dialog.querySelector('.work-dialog-media');
  const title = dialog.querySelector('#work-dialog-title');
  const strips = [...document.querySelectorAll('[data-marquee]')];
  let opener = null;
  const states = [];
  strips.forEach(strip => {
    const viewport = strip.querySelector('.marquee-viewport');
    const track = strip.querySelector('.marquee-track');
    const group = strip.querySelector('.marquee-group');
    const state = { strip, viewport, track, group, offset: 0, visible: true, dragging: false, hover: false, focus: false, suppress: false };
    states.push(state);
    viewport.tabIndex = 0;
    viewport.setAttribute('aria-label', `${strip.getAttribute('aria-label')}. Drag or swipe to browse; use arrow keys to move.`);
    viewport.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') state.hover = true; });
    viewport.addEventListener('pointerleave', () => { state.hover = false; });
    viewport.addEventListener('focusin', () => { state.focus = true; });
    viewport.addEventListener('focusout', e => { if (!viewport.contains(e.relatedTarget)) state.focus = false; });
    viewport.addEventListener('keydown', e => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault(); state.offset += e.key === 'ArrowRight' ? 200 : -200; draw(state);
    });
    let startX = 0, startY = 0, lastX = 0, pointer = null;
    viewport.addEventListener('pointerdown', e => {
      if (e.button !== 0 || pointer !== null) return;
      pointer = e.pointerId; startX = lastX = e.clientX; startY = e.clientY; state.dragging = false; state.suppress = false;
    });
    viewport.addEventListener('pointermove', e => {
      if (e.pointerId !== pointer) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (!state.dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        state.dragging = true; state.suppress = true; viewport.classList.add('is-dragging'); viewport.setPointerCapture(e.pointerId);
      }
      if (state.dragging) { state.offset -= e.clientX - lastX; draw(state); e.preventDefault(); }
      lastX = e.clientX;
    });
    function end(e) { if (e.pointerId !== pointer) return; pointer = null; state.dragging = false; viewport.classList.remove('is-dragging'); }
    viewport.addEventListener('pointerup', end); viewport.addEventListener('pointercancel', end);
    viewport.addEventListener('click', e => {
      if (state.suppress) { e.preventDefault(); e.stopPropagation(); state.suppress = false; return; }
      const card = e.target.closest('.marquee-card'); if (!card) return;
      if (card.dataset.kind === 'external') { window.open(card.dataset.url, '_blank', 'noopener,noreferrer'); return; }
      opener = card; title.textContent = card.dataset.caption;
      dialog.querySelector('.work-dialog-description').textContent = strip.closest('.service-feature').querySelector('.service-feature-copy > p:not(.eyebrow)')?.textContent || '';
      media.replaceChildren(); const element = document.createElement(card.dataset.kind === 'video' ? 'video' : 'img');
      if (element.tagName === 'VIDEO') { element.controls = true; element.playsInline = true; element.preload = 'metadata'; element.poster = card.dataset.poster || ''; }
      else element.alt = card.dataset.caption;
      element.src = card.dataset.media; media.appendChild(element); dialog.showModal();
      if (element.tagName === 'VIDEO') element.play().catch(() => {});
    }, true);
    if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => { state.visible = entry.isIntersecting; }, {threshold: 0}).observe(strip);
  });
  function draw(state) {
    const width = state.group.getBoundingClientRect().width;
    if (!width) return;
    state.offset = ((state.offset % width) + width) % width;
    state.track.style.transform = `translate3d(${-state.offset}px,0,0)`;
  }
  let previous = 0;
  function animate(now) {
    const dt = previous ? Math.min((now - previous) / 1000, .05) : 0; previous = now;
    if (!document.hidden && !motion.matches && !dialog.open) states.forEach(state => {
      if (state.visible && !state.dragging && !state.hover && !state.focus) { state.offset += 32 * dt; draw(state); }
    });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
  dialog.querySelector('.work-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { media.querySelector('video')?.pause(); media.replaceChildren(); opener?.focus(); updateVideos(); });
  function updateVideos() {
    states.forEach(({strip, viewport, visible}) => {
      const bounds = viewport.getBoundingClientRect();
      strip.querySelectorAll('.marquee-video[data-kind="video"]').forEach(card => {
        const video = card.querySelector('video'), rect = card.getBoundingClientRect();
        const onscreen = visible && !document.hidden && !dialog.open && !motion.matches && !navigator.connection?.saveData && rect.right > bounds.left + 20 && rect.left < bounds.right - 20 && rect.bottom > 0 && rect.top < innerHeight;
        if (onscreen) {
          if (!video.getAttribute('src')) video.src = card.dataset.preview || card.dataset.media;
          if (video.paused) video.play().catch(() => {});
        } else if (video.getAttribute('src')) { video.pause(); video.removeAttribute('src'); video.load(); }
      });
    });
  }
  document.addEventListener('visibilitychange', updateVideos);
  motion.addEventListener?.('change', updateVideos);
  setInterval(updateVideos, 800); updateVideos();
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
