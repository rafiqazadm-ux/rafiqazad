(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const header = document.querySelector('.site-header');
  if (!toggle || !header) return;
  const overlay = document.createElement('div');
  overlay.className = 'theme-interlude';
  overlay.setAttribute('aria-hidden','true');
  overlay.innerHTML = '<span></span>';
  document.body.appendChild(overlay);
  const glyph = overlay.querySelector('span');
  const frame = document.querySelector('.project-dialog-frame');
  function syncFrame() {
    try {
      const doc = frame && frame.contentDocument;
      if (!doc || !doc.head || doc.URL === 'about:blank') return;
      if (root.dataset.theme === 'light') doc.documentElement.dataset.theme = 'light';
      else delete doc.documentElement.dataset.theme;
      if (!doc.querySelector('link[data-parent-theme]')) {
        const sheet = doc.createElement('link');
        sheet.rel = 'stylesheet'; sheet.href = new URL('theme-navigation.css?v=20261105', location.href).href;
        sheet.dataset.parentTheme = 'true'; doc.head.appendChild(sheet);
      }
    } catch (_) { /* External pages retain their own appearance. */ }
  }
  frame?.addEventListener('load', syncFrame);
  function apply(theme) {
    if (theme === 'light') root.dataset.theme = 'light';
    else delete root.dataset.theme;
    const next = theme === 'light' ? 'dark' : 'light';
    toggle.setAttribute('aria-label', 'Switch to ' + next + ' mode');
    toggle.setAttribute('title', 'Switch to ' + next + ' mode');
    toggle.querySelector('span').textContent = theme === 'light' ? '☾' : '☀';
    try { localStorage.setItem('rafiq-theme', theme); } catch (_) {}
    syncFrame();
  }
  apply(root.dataset.theme === 'light' ? 'light' : 'dark');
  let switching = false;
  toggle.addEventListener('click', () => {
    if (switching) return;
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { apply(next); return; }
    switching = true;
    overlay.classList.toggle('is-night', next === 'dark');
    glyph.textContent = next === 'dark' ? '☾' : '☀';
    overlay.classList.add('is-visible');
    setTimeout(() => apply(next), 350);
    setTimeout(() => overlay.classList.remove('is-visible'), 800);
    setTimeout(() => { switching = false; }, 1100);
  });
  const links = [...header.querySelectorAll('nav a[href^="#"]')];
  const anchors = links.map(link => ({link, el: document.getElementById(link.getAttribute('href').slice(1))})).filter(x => x.el);
  let scheduled = false;
  function updateActive() {
    scheduled = false;
    const marker = scrollY + Math.max(header.offsetHeight + 35, innerHeight * .3);
    let active = anchors[0];
    for (const item of anchors) {
      const top = item.el.getBoundingClientRect().top + scrollY;
      if (top <= marker && (!active || top >= active.el.getBoundingClientRect().top + scrollY)) active = item;
    }
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 5) active = anchors.find(x => x.el.id === 'contact') || active;
    links.forEach(link => {
      const selected = active && active.link === link;
      link.classList.toggle('is-current', !!selected);
      if (selected) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
    });
  }
  const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateActive); } };
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule);
  updateActive();
})();