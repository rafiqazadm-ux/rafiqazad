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
  // Keep descriptions tied to the work already documented in the portfolio.
  function workDescription(card) {
    const section = card.closest('.service-feature')?.id;
    const file = (card.dataset.media || '').split('/').pop();
    const label = card.dataset.caption || 'Selected work';
    if (section === 'social-media') return `A social post for ${label.split(' · ').pop()}, shown as part of the content I worked on.`;
    if (section === 'marketing') return file.includes('analytics')
      ? 'An email campaign performance view from my outreach work.'
      : 'An example of the email copy and outreach sequences I worked on.';
    if (section === 'content-creation') {
      if (/^21[1-3]-/.test(file)) return 'A short-form video for the Final Overs teams feature. The work included split-screen concepts, filming, editing, and publishing.';
      if (/^21[0789]-/.test(file)) return 'Video content for Newton’s Playground, focused on explaining the game’s mechanics and creative possibilities.';
      return 'A short-form video from Mixeal’s social content, using quick edits and relatable ideas about VR and studio life.';
    }
    if (section === 'social') return `${label}. A graphic created for social media or a campaign.`;
    if (section === 'uiux') return `${label}. Part of the Final Overs game interface work.`;
    if (section === 'decks') return `${label}. One of the presentation slides I worked on for this project.`;
    return 'A selected example of my work.';
  }
  const strips = [...document.querySelectorAll('[data-marquee]')];
  let opener = null;
  const states = [];
  strips.forEach(strip => {
    const viewport = strip.querySelector('.marquee-viewport');
    const track = strip.querySelector('.marquee-track');
    const group = strip.querySelector('.marquee-group');
    const state = { strip, viewport, track, group, offset: 0, visible: true, dragging: false, hover: false, focus: false, suppress: false, width: 0 };
    states.push(state);
    const measure = () => { state.width = group.getBoundingClientRect().width; };
    if (window.ResizeObserver) new ResizeObserver(measure).observe(group);
    else window.addEventListener("resize", measure);
    measure();
    viewport.tabIndex = 0;
    viewport.setAttribute('aria-label', `${strip.getAttribute('aria-label')}. Drag or swipe to browse; use arrow keys to move.`);
    viewport.addEventListener('dragstart', e => e.preventDefault());
    viewport.addEventListener('wheel', e => {
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
      if (!horizontal) return; e.preventDefault(); state.offset += horizontal; draw(state);
    }, { passive: false });
    strip.addEventListener('deckchange', () => { state.offset = 0; state.width = group.getBoundingClientRect().width; draw(state); });
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
      if (card.dataset.kind === 'project') return;
      if (card.dataset.kind === 'external-link') { window.open(card.dataset.url, '_blank', 'noopener,noreferrer'); return; }
      if (card.dataset.kind === 'external') {
        opener = card; title.textContent = card.dataset.caption;
        dialog.querySelector('.work-dialog-description').textContent = 'If the player does not load, use the link below to watch on Instagram.';
        media.replaceChildren();
        const frame = document.createElement('iframe'); frame.src = 'https://www.instagram.com/reel/DcVdwLmAIKW/embed/'; frame.title = 'Tower Market heritage walk on Instagram'; frame.loading = 'lazy'; frame.allow = 'autoplay; encrypted-media; picture-in-picture'; frame.setAttribute('allowfullscreen', '');
        const link = document.createElement('a'); link.href = card.dataset.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.className = 'reel-external-link'; link.textContent = 'Watch on Instagram ↗';
        media.append(frame, link); dialog.showModal(); return;
      }
      opener = card; title.textContent = card.dataset.caption;
      dialog.querySelector('.work-dialog-description').textContent = workDescription(card);
      media.replaceChildren(); const element = document.createElement(card.dataset.kind === 'video' ? 'video' : 'img');
      if (element.tagName === 'VIDEO') { element.controls = true; element.playsInline = true; element.preload = 'metadata'; element.poster = card.dataset.poster || ''; }
      else element.alt = card.dataset.caption;
      element.src = card.dataset.media; media.appendChild(element); dialog.showModal();
      if (element.tagName === 'VIDEO') element.play().catch(() => {});
    }, true);
    if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => { state.visible = entry.isIntersecting; }, {threshold: 0}).observe(strip);
  });
  function draw(state) {
    const width = state.width;
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
  const touchPreview = matchMedia('(hover: none), (pointer: coarse)');
  function updateVideos() {
    states.forEach(({strip, viewport, visible}) => {
      const bounds = viewport.getBoundingClientRect();
      const cards = [...strip.querySelectorAll('.marquee-video[data-kind="video"]')];
      const candidates = cards.map(card => {
        const r = card.getBoundingClientRect();
        const overlap = Math.max(0, Math.min(r.right, bounds.right, innerWidth) - Math.max(r.left, bounds.left, 0));
        const vertical = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
        return {card, overlap, vertical, distance: Math.abs((r.left + r.right) / 2 - (Math.max(bounds.left, 0) + Math.min(bounds.right, innerWidth)) / 2)};
      }).filter(item => item.overlap > 30 && item.vertical > 50).sort((a, b) => a.distance - b.distance);
      const eligible = visible && !document.hidden && !dialog.open && !motion.matches && !navigator.connection?.saveData;
      // On touch screens there is no hover. Animate the two most visible clips only.
      const mobileCards = new Set(touchPreview.matches && eligible ? candidates.slice(0, 2).map(item => item.card) : []);
      cards.forEach(card => {
        const video = card.querySelector('video');
        const inView = candidates.some(item => item.card === card);
        const selected = touchPreview.matches ? mobileCards.has(card) : (card.matches(':hover') || card.matches(':focus-visible'));
        let animated = card.querySelector('.mobile-animated-preview');
        if (touchPreview.matches) {
          if (video.getAttribute('src')) { video.pause(); video.removeAttribute('src'); video.load(); }
          if (eligible && inView && selected && card.dataset.animated) {
            if (!animated) { animated = document.createElement('img'); animated.className = 'mobile-animated-preview'; animated.alt = ''; animated.setAttribute('aria-hidden', 'true'); card.querySelector('.marquee-media').appendChild(animated); }
            if (!animated.getAttribute('src')) animated.src = card.dataset.animated;
          } else if (animated) animated.remove();
        } else {
          if (animated) animated.remove();
          if (eligible && inView && selected) {
            if (!video.getAttribute('src')) { video.muted = true; video.playsInline = true; video.src = card.dataset.preview || card.dataset.media; }
            if (video.paused) video.play().catch(() => {});
          } else if (video.getAttribute('src')) { video.pause(); video.removeAttribute('src'); video.load(); }
        }
      });
    });
  }
  document.addEventListener('visibilitychange', updateVideos);
  motion.addEventListener?.('change', updateVideos);
  touchPreview.addEventListener?.('change', updateVideos);
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
