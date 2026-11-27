// Desktop behaviour: one window open at a time, hash = open window, photo "loads" from pixels.
(function () {
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
    const cal = id === 'book' && document.querySelector('.calendar[data-src]:not([src])');
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

  // photo loading animation: only runs once every frame has downloaded, otherwise the final photo stays
  const img = document.getElementById('photo');
  const bar = document.querySelector('.progress div');
  const cap = document.getElementById('photo-caption');
  const final = '/img/paulina.jpg';
  const frames = [0, 1, 2, 3, 4, 5].map((n) => '/img/load' + n + '.png');
  const framesReady = Promise.race([
    Promise.all(frames.map((src) => new Promise((resolve, reject) => {
      const pre = new Image();
      pre.onload = resolve;
      pre.onerror = reject;
      pre.src = src;
    }))).then(() => true, () => false),
    new Promise((resolve) => setTimeout(() => resolve(false), 2500))
  ]);
  let timer;
  function loadPhoto() {
    if (!img || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    framesReady.then((ready) => {
      if (!ready) return;
      clearInterval(timer);
      let step = 0;
      const tick = () => {
        const pct = Math.round(step / 6 * 100);
        img.src = step < 6 ? frames[step] : final;
        img.classList.toggle('pixel', step < 6);
        bar.style.width = pct + '%';
        cap.textContent = step < 6 ? cap.dataset.loading + ' ' + pct + '%' : 'paulina.jpg';
        if (step >= 6) clearInterval(timer);
        step += 1;
      };
      tick();
      timer = setInterval(tick, 280);
    });
  }
  const replay = document.getElementById('replay');
  if (replay) replay.addEventListener('click', loadPhoto);

  const fromHash = () => {
    const id = location.hash.slice(1);
    show(ids.includes(id) ? id : 'about');
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();
  document.documentElement.classList.add('ready');
})();
