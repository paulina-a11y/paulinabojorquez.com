// Desktop behaviour: one window open at a time, hash = open window, photo "loads" from pixels.
(function () {
  document.documentElement.classList.add('js');
  const windows = Array.from(document.querySelectorAll('.window'));
  const icons = Array.from(document.querySelectorAll('[data-open]'));
  const hint = document.querySelector('.hint');
  const ids = windows.map((w) => w.id);

  function show(id, focus) {
    windows.forEach((w) => { w.hidden = w.id !== id; });
    icons.forEach((i) => i.setAttribute('aria-current', String(i.dataset.open === id)));
    if (hint) hint.hidden = Boolean(id);
    if (id === 'about') loadPhoto();
    // the booking calendar only loads when its window is opened
    const cal = id === 'book' && document.querySelector('.calendar:not([src])');
    if (cal) cal.src = cal.dataset.src;
    if (focus && id) document.getElementById(id).querySelector('h2').focus();
  }

  icons.forEach((icon) => icon.addEventListener('click', (e) => {
    e.preventDefault();
    history.replaceState(null, '', '#' + icon.dataset.open);
    show(icon.dataset.open, true);
  }));
  document.querySelectorAll('.close').forEach((b) => b.addEventListener('click', () => {
    history.replaceState(null, '', location.pathname);
    show(null);
  }));

  // photo loading animation
  const img = document.getElementById('photo');
  const bar = document.querySelector('.progress div');
  const cap = document.getElementById('photo-caption');
  const frames = [0, 1, 2, 3, 4, 5].map((n) => '/img/load' + n + '.png');
  const final = '/img/paulina.jpg';
  frames.concat(final).forEach((src) => { new Image().src = src; });
  let timer;
  function loadPhoto() {
    if (!img || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    clearInterval(timer);
    let step = 0;
    const tick = () => {
      const pct = Math.round(step / 6 * 100);
      img.src = step < 6 ? frames[step] : final;
      bar.style.width = pct + '%';
      cap.textContent = step < 6 ? cap.dataset.loading + ' ' + pct + '%' : 'paulina.jpg';
      if (step >= 6) clearInterval(timer);
      step += 1;
    };
    tick();
    timer = setInterval(tick, 280);
  }
  const replay = document.getElementById('replay');
  if (replay) replay.addEventListener('click', loadPhoto);

  const fromHash = () => {
    const id = location.hash.slice(1);
    show(ids.includes(id) ? id : 'about');
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
