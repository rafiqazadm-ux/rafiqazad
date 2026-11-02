(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const dialog = document.querySelector('.work-dialog');
  const media = dialog.querySelector('.work-dialog-media');
  const title = dialog.querySelector('#work-dialog-title');
  // Each company choice replaces the slides in this same work slider.
  const deckSection = document.querySelector('#decks');
  const deckChoices = deckSection?.querySelector('.deck-choices');
  if (deckChoices && typeof pitchDecks !== 'undefined') {
    const groups = [...deckSection.querySelectorAll('.marquee-group')];
    function selectDeck(index) {
      const deck = pitchDecks[index];
      deckChoices.querySelectorAll('button').forEach((button, i) => {
        button.classList.toggle('is-active', i === index);
        button.setAttribute('aria-pressed', String(i === index));
      });
      groups.forEach((group, groupIndex) => {
        group.replaceChildren(...deck.slides.map((src, i) => {
          const button = document.createElement('button');
          button.type = 'button'; button.className = 'marquee-card'; button.dataset.kind = 'image'; button.dataset.media = src;
          button.dataset.caption = `${deck.company} · Slide ${i + 1}`;
          button.setAttribute('aria-label', `Open ${button.dataset.caption}`);
          if (groupIndex) button.tabIndex = -1;
          const wrap = document.createElement('span'); wrap.className = 'marquee-media';
          const img = document.createElement('img'); img.src = src; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async'; img.draggable = false;
          wrap.appendChild(img);
          const caption = document.createElement('span'); caption.className = 'marquee-caption'; caption.textContent = button.dataset.caption;
          button.append(wrap, caption); return button;
        }));
      });
      deckSection.querySelector('[data-marquee]').dispatchEvent(new Event('deckchange'));
    }
    pitchDecks.forEach((deck, i) => { const button = document.createElement('button'); button.type = 'button'; button.textContent = deck.company; button.addEventListener('click', () => selectDeck(i)); deckChoices.appendChild(button); });
    selectDeck(0);
  }
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
    viewport.addEventListener('dragstart', e => e.preventDefault());
    viewport.addEventListener('wheel', e => {
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
      if (!horizontal) return; e.preventDefault(); state.offset += horizontal; draw(state);
    }, { passive: false });
    strip.addEventListener('deckchange', () => { state.offset = 0; draw(state); });
    viewport.addEventListener('pointerover', e => { if (e.pointerType === 'mouse') updateVideos(); });
    viewport.addEventListener('pointerout', () => setTimeout(updateVideos, 0));
    viewport.addEventListener('focusin', () => { state.focus = true; updateVideos(); });
    viewport.addEventListener('focusout', e => { if (!viewport.contains(e.relatedTarget)) state.focus = false; setTimeout(updateVideos, 0); });
    viewport.addEventListener('keydown', e => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault(); state.offset += e.key === 'ArrowRight' ? 200 : -200; draw(state);
    });
    let startX = 0, startY = 0, lastX = 0, pointer = null;
    viewport.addEventListener('pointerdown', e => {
      if (e.button !== 0 || pointer !== null) return;
      if (e.pointerType === 'mouse') e.preventDefault();
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
      if (card.dataset.kind === 'external') {
        opener = card; title.textContent = card.dataset.caption;
        dialog.querySelector('.work-dialog-description').textContent = 'If the player does not load, use the link below to watch on Instagram.';
        media.replaceChildren();
        const frame = document.createElement('iframe'); frame.src = 'https://www.instagram.com/reel/DcVdwLmAIKW/embed/'; frame.title = 'Tower Market heritage walk on Instagram'; frame.loading = 'lazy'; frame.allow = 'autoplay; encrypted-media; picture-in-picture'; frame.setAttribute('allowfullscreen', '');
        const link = document.createElement('a'); link.href = card.dataset.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.className = 'reel-external-link'; link.textContent = 'Watch on Instagram ↗';
        media.append(frame, link); dialog.showModal(); return;
      }
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
  function viewportHasKeyboardFocus(viewport) { return !!viewport.querySelector(':focus-visible') || viewport.matches(':focus-visible'); }
  let previous = 0;
  function animate(now) {
    const dt = previous ? Math.min((now - previous) / 1000, .05) : 0; previous = now;
    if (!document.hidden && !motion.matches && !dialog.open) states.forEach(state => {
      if (state.visible && !state.dragging && !(state.focus && viewportHasKeyboardFocus(state.viewport))) { state.offset += 32 * dt; draw(state); }
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
        const selected = card.matches(':hover') || card.matches(':focus-visible');
        const onscreen = selected && visible && !document.hidden && !dialog.open && !motion.matches && !navigator.connection?.saveData && rect.right > bounds.left + 20 && rect.left < bounds.right - 20 && rect.bottom > 0 && rect.top < innerHeight;
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
