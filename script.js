/* Anand Tiwari — Portfolio interactions. Content lives in data.js */
(() => {
  'use strict';

  const D = window.PORTFOLIO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DEVICON = (p) => `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${p}.svg`;
  const famName = (id) => (D.families.find((f) => f.id === id) || {}).name || '';

  /* ───────── Light / dark theme (initial theme is set by the inline script in <head>) ───────── */
  const root = document.documentElement;
  const themeBtn = $('#themeToggle');
  const themeMeta = $('meta[name="theme-color"]');
  const savedTheme = () => { try { return localStorage.getItem('theme'); } catch { return null; } };
  function applyTheme(theme, save) {
    root.dataset.theme = theme;
    if (themeMeta) themeMeta.content = theme === 'dark' ? '#0A1322' : '#F2F0E9';
    const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    themeBtn.setAttribute('aria-label', label);
    themeBtn.title = label;
    if (save) { try { localStorage.setItem('theme', theme); } catch { /* private window: still switches */ } }
  }
  applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
  // follow the system setting until the visitor picks a theme themselves
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => { if (!savedTheme()) applyTheme(e.matches ? 'dark' : 'light'); });
  themeBtn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (!document.startViewTransition || reduceMotion) { applyTheme(next, true); return; }
    const r = themeBtn.getBoundingClientRect(); // the new theme grows as a circle from the button
    root.style.setProperty('--vt-x', `${r.left + r.width / 2}px`);
    root.style.setProperty('--vt-y', `${r.top + r.height / 2}px`);
    document.startViewTransition(() => applyTheme(next, true));
  });

  /* ───────── Cursor trail: the mouse arrow leaves a fading line behind it ───────── */
  // Mouse only (not touch), skipped for "reduce motion". Colour = the theme accent (--navy).
  if (!reduceMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cv = document.createElement('canvas');
    cv.className = 'cursor-trail';
    cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');
    const LIFE = 420;  // ms each point of the line stays on screen
    const WIDTH = 4;   // px at the cursor, tapering to nothing at the tail
    const pts = [];
    let dpr = 1, raf = 0;
    const fit = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(innerWidth * dpr);
      cv.height = Math.round(innerHeight * dpr);
    };
    const rgba = (hex, a) => {
      let h = hex.replace('#', '');
      if (h.length === 3) h = [...h].map((c) => c + c).join('');
      const v = parseInt(h, 16) || 0;
      return `rgba(${(v >> 16) & 255}, ${(v >> 8) & 255}, ${v & 255}, ${a})`;
    };
    const draw = (now) => {
      while (pts.length && now - pts[0].t > LIFE) pts.shift();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      const n = pts.length;
      if (n > 2) {
        // a ribbon around the path: thin + transparent at the tail, full width + colour at the cursor
        const dark = root.dataset.theme === 'dark';
        const color = getComputedStyle(root).getPropertyValue('--navy').trim() || '#22263A';
        const left = [], right = [];
        for (let i = 0; i < n; i++) {
          const p = pts[i], a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
          const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
          const nx = -(b.y - a.y) / len, ny = (b.x - a.x) / len;
          const w = (WIDTH / 2) * (i / (n - 1)) * Math.max(0, 1 - (now - p.t) / LIFE);
          left.push([p.x + nx * w, p.y + ny * w]);
          right.push([p.x - nx * w, p.y - ny * w]);
        }
        ctx.beginPath();
        left.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        for (let i = n - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
        ctx.closePath();
        const tail = pts[0], head = pts[n - 1];
        const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
        grad.addColorStop(0, rgba(color, 0));
        grad.addColorStop(1, rgba(color, dark ? 0.95 : 0.72));
        ctx.fillStyle = grad;
        ctx.shadowColor = dark ? rgba(color, 0.9) : 'transparent'; // a soft glow in the dark theme
        ctx.shadowBlur = dark ? 12 : 0;
        ctx.fill();
      }
      raf = n ? requestAnimationFrame(draw) : 0;
    };
    fit();
    addEventListener('resize', fit);
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
      (evs.length ? evs : [e]).forEach((ev) => pts.push({ x: ev.clientX, y: ev.clientY, t: performance.now() }));
      if (!raf) raf = requestAnimationFrame(draw);
    }, { passive: true });
  }

  /* ───────── Bindings ───────── */
  $$('[data-bind]').forEach((el) => { const v = D[el.dataset.bind]; if (v) el.textContent = v; });
  $$('.js-first').forEach((el) => { el.textContent = `${D.firstName}.`; });
  $('#year').textContent = new Date().getFullYear();

  // Hero: big background name + title split onto two lines
  $('.hero-name').innerHTML = [...D.firstName.toUpperCase()].map((ch, i) => `<span style="--i:${i}">${esc(ch)}</span>`).join('');
  // Pack the role into lines of ~10 characters ("Full Stack / Developer", "Cloud / Computing / Developer")
  const titleLines = D.role.trim().split(/\s+/).reduce((lines, w) => {
    const last = lines[lines.length - 1];
    if (last && `${last} ${w}`.length <= 10) lines[lines.length - 1] = `${last} ${w}`;
    else lines.push(w);
    return lines;
  }, []);
  const heroTitle = $('.hero-title');
  heroTitle.className = `hero-title lines-${titleLines.length}`;
  heroTitle.innerHTML = titleLines.map((l, i) =>
    `<span>${esc(l)}${i === titleLines.length - 1 ? '<i class="dot">.</i>' : ''}</span>`).join('');

  // Resume / GitHub links
  $$('.js-resume').forEach((a) => { if (D.resume) { a.href = D.resume; a.hidden = false; } });
  $$('.js-github').forEach((a) => { if (D.github) a.href = D.github; else a.hidden = true; });

  /* ───────── Hero character: optional video, pause, parallax ───────── */
  const hero = $('.hero');
  const vid = $('.hero-video');
  const heroSvg = $('.hero-svg');
  let usingVideo = false;
  if (D.heroVideo) {
    vid.addEventListener('loadeddata', () => {
      usingVideo = true;
      vid.hidden = false;
      heroSvg.classList.add('is-hidden');
      hero.classList.remove('has-photo');
      $$('.hero-photo', hero).forEach((el) => el.remove());
      if (!hero.classList.contains('paused')) vid.play().catch(() => {});
    }, { once: true });
    vid.src = D.heroVideo;
  }
  const pauseBtn = $('.pause');
  pauseBtn.addEventListener('click', () => {
    const paused = hero.classList.toggle('paused');
    pauseBtn.setAttribute('aria-pressed', String(paused));
    pauseBtn.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
    if (usingVideo) paused ? vid.pause() : vid.play().catch(() => {});
  });
  if (reduceMotion) hero.classList.add('paused');

  const heroName = $('.hero-name');
  const heroFig = $('.hero-figure');

  // Real photo (background removed) replaces the illustrated character when available
  if (D.heroImage) {
    const img = new Image();
    img.className = 'hero-photo';
    img.alt = D.name;
    img.decoding = 'async';
    img.draggable = false;
    img.onload = () => {
      if (usingVideo) return;
      heroFig.appendChild(img);
      hero.classList.add('has-photo');
      heroSvg.classList.add('is-hidden');
    };
    img.src = D.heroImage;
  }
  let mx = 0, my = 0;
  if (!reduceMotion && matchMedia('(hover: hover)').matches) {
    hero.addEventListener('pointermove', (e) => {
      mx = (e.clientX / innerWidth - 0.5);
      my = (e.clientY / innerHeight - 0.5);
      requestFrame();
    });
  }

  /* ───────── About ───────── */
  $('#aboutLead').textContent = D.about.lead;
  $('#aboutMore').textContent = D.about.more;
  const linkBtn = (href, label, dark, dl) =>
    `<a class="btn ${dark ? 'btn-dark' : 'btn-ghost'}" href="${esc(href)}"${dl ? ' download' : ' target="_blank" rel="noopener"'}>${label}</a>`;
  const aboutBtns = [];
  if (D.resume) aboutBtns.push(linkBtn(D.resume, 'Résumé <span class="arr">↓</span>', true, true));
  if (D.github) aboutBtns.push(linkBtn(D.github, 'GitHub <span class="arr">↗</span>', !D.resume));
  if (D.linkedin) aboutBtns.push(linkBtn(D.linkedin, 'LinkedIn <span class="arr">↗</span>'));
  aboutBtns.push(`<a class="btn btn-ghost" href="#contact">Say hello <span class="arr">→</span></a>`);
  $('#aboutBtns').innerHTML = aboutBtns.join('');

  $('#facts').innerHTML = D.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
  $('#quote').textContent = `“${D.quote}”`;
  $('#idNo').textContent = D.idCard.id;
  $('#idDept').textContent = D.idCard.dept;
  $('#idValid').textContent = D.idCard.valid;
  $('#idIssued').textContent = D.idCard.issued;
  if (D.photo) $('#idPhoto').innerHTML = `<img src="${esc(D.photo)}" alt="Photo of ${esc(D.name)}">`;

  // Barcode (deterministic from the name)
  (() => {
    let seed = [...D.name].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    $('#barcode').innerHTML = Array.from({ length: 38 }, () => `<i style="width:${(rnd() * 2.4 + 0.8).toFixed(1)}px"></i>`).join('');
  })();

  // Lanyard pendulum — swings on scroll, can be dragged
  const swing = $('#swing');
  const lanyard = $('#lanyard');
  const card = $('#idcard');
  const tiltEl = $('#idTilt');
  const pend ={ ang: 0, vel: 0, dragging: false, visible: false, lastAng: 0 };
  let lastScrollY = scrollY;
  function pendStep() {
    if (!pend.visible) { pend.raf = 0; return; }
    if (!pend.dragging) {
      pend.vel += -pend.ang * 0.016;
      pend.vel *= 0.962;
      pend.ang += pend.vel;
    }
    pend.ang = clamp(pend.ang, pend.dragging ? -40 : -22, pend.dragging ? 40 : 22);
    swing.style.transform = `rotate(${pend.ang.toFixed(3)}deg)`;
    card.style.setProperty('--shine', `${50 + pend.ang * 2.2}%`);
    pend.raf = requestAnimationFrame(pendStep);
  }
  if (!reduceMotion) {
    new IntersectionObserver(([en]) => {
      pend.visible = en.isIntersecting;
      if (pend.visible && !pend.raf) pend.raf = requestAnimationFrame(pendStep);
    }).observe(lanyard);
    const pivot = () => {
      const r = lanyard.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + swing.offsetTop };
    };
    const pointerAng = (e, p) => -Math.atan2(e.clientX - p.x, e.clientY - p.y) * 180 / Math.PI;
    let down = null;
    card.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('a')) return;
      down = { x: e.clientX, y: e.clientY, moved: false, off: pointerAng(e, pivot()) - pend.ang };
      card.setPointerCapture(e.pointerId);
    });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const tx = ((e.clientX - r.left) / r.width - 0.5) * 16;
      const ty = ((e.clientY - r.top) / r.height - 0.5) * -12;
      tiltEl.style.transform = `rotateY(${tx}deg) rotateX(${ty}deg)`;
      if (!down) return;
      if (!down.moved && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) {
        down.moved = true;
        pend.dragging = true;
        pend.lastAng = pend.ang;
      }
      if (!pend.dragging) return;
      const a = clamp(pointerAng(e, pivot()) - down.off, -40, 40);
      pend.vel = a - pend.lastAng;
      pend.lastAng = pend.ang = a;
    });
    const release = () => {
      if (down && down.moved) suppressClick = true;
      down = null;
      pend.dragging = false;
    };
    card.addEventListener('pointerup', release);
    card.addEventListener('pointercancel', release);
    card.addEventListener('pointerleave', () => { if (!down) tiltEl.style.transform = ''; });
  }

  // ID card flip (click / tap / Enter / Space) + one spin when it first comes into view
  const flipEl = $('#idFlip');
  const backFace = $('.id-back', card);
  const frontFace = $('.id-front', card);
  const idUrl = $('#idUrl');
  let suppressClick = false;
  let spinning = false;
  function toggleFlip() {
    if (spinning) return;
    const on = card.classList.toggle('flipped');
    card.setAttribute('aria-pressed', String(on));
    backFace.setAttribute('aria-hidden', String(!on));
    frontFace.setAttribute('aria-hidden', String(on));
    idUrl.tabIndex = on ? 0 : -1;
    if (!reduceMotion) pend.vel += on ? 0.7 : -0.7;
  }
  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    if (suppressClick) { suppressClick = false; return; }
    toggleFlip();
  });
  card.addEventListener('keydown', (e) => {
    if (e.target !== card) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFlip(); }
  });
  if (!reduceMotion) {
    const spinIO = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      spinIO.disconnect();
      spinning = true;
      flipEl.classList.add('spin');
      flipEl.addEventListener('animationend', () => { flipEl.classList.remove('spin'); spinning = false; }, { once: true });
    }, { threshold: 0.5 });
    spinIO.observe(card);
  }

  // Back of the card: QR code to GitHub (qrcode-generator from jsDelivr; falls back to text)
  (() => {
    const box = $('#idQr');
    if (!D.github) { box.textContent = D.initials; idUrl.hidden = true; return; }
    idUrl.href = D.github;
    idUrl.textContent = `${D.github.replace(/^https?:\/\/(www\.)?/, '')} ↗`;
    try {
      if (typeof window.qrcode !== 'function') throw new Error('qr lib missing');
      const qr = window.qrcode(0, 'M');
      qr.addData(D.github);
      qr.make();
      const n = qr.getModuleCount();
      let d = '';
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
      box.innerHTML = `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" role="img" aria-label="QR code for ${esc(D.github)}"><path d="${d}" fill="#1D2032"/></svg>`;
    } catch {
      box.textContent = 'GitHub';
    }
  })();

  /* ───────── Skills: periodic table ───────── */
  const table = $('#ptable');
  const els = D.elements;
  $('#skillsNote').textContent = `${els.length} elements in ${D.families.length} families. Hover a tile to see its logo, or pick a family to light it up.`;
  // colour ramp follows family order: first family = darkest tiles
  const famIx = (id) => { const i = D.families.findIndex((f) => f.id === id); return i < 0 ? 5 : Math.min(i, 5); };
  $('#famChips').innerHTML = D.families.map((f, i) => `<button class="chip fi-${Math.min(i, 5)}" type="button" data-f="${f.id}" aria-pressed="false"><i></i>${esc(f.name)}</button>`).join('');
  // 8 columns, or 7 when that leaves fewer empty cells in the last row (phones always use 4).
  // Not 9: tiles get too narrow for names like "Software Testing" on laptop screens.
  const emptyCells = (c) => (c - (els.length % c)) % c;
  table.style.setProperty('--cols', emptyCells(7) < emptyCells(8) ? 7 : 8);
  const cols = getComputedStyle(table).gridTemplateColumns.split(' ').length || 8; // what is actually on screen
  table.innerHTML = els.map((e, i) =>
    `<button class="tile fi-${famIx(e.f)}" type="button" data-i="${i}" data-f="${e.f}" style="--d:${(i % cols) * 45 + Math.floor(i / cols) * 90}ms" aria-label="${esc(e.n)} — ${esc(famName(e.f))}">
      <span class="n">${pad(i + 1)}</span><span class="sym">${esc(e.s)}</span><span class="nm">${esc(e.n)}</span>
    </button>`).join('');

  const preview = $('#preview'), pvLogo = $('#pvLogo'), pvName = $('#pvName'), pvFam = $('#pvFam');
  const glyph = (e) => `<span class="glyph fi-${famIx(e.f)}">${esc(e.s)}</span>`;
  let preloaded = false;
  const preload = () => { if (preloaded) return; preloaded = true; els.forEach((e) => { if (e.icon) { const im = new Image(); im.src = DEVICON(e.icon); } }); };
  function showEl(i) {
    const e = els[i];
    $$('.tile.hot', table).forEach((t) => t.classList.remove('hot'));
    table.children[i].classList.add('hot');
    pvName.textContent = e.n;
    pvFam.textContent = famName(e.f);
    if (e.icon) {
      pvLogo.innerHTML = `<img src="${DEVICON(e.icon)}" alt="" width="96" height="96">`;
      pvLogo.firstChild.onerror = () => { pvLogo.innerHTML = glyph(e); };
    } else {
      pvLogo.innerHTML = glyph(e);
    }
    preview.classList.add('has');
  }
  function clearEl() {
    preview.classList.remove('has');
    $$('.tile.hot', table).forEach((t) => t.classList.remove('hot'));
  }
  table.addEventListener('pointerenter', preload);
  table.addEventListener('pointerover', (e) => { const t = e.target.closest('.tile'); if (t) showEl(+t.dataset.i); });
  table.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') clearEl(); });
  table.addEventListener('focusin', (e) => { const t = e.target.closest('.tile'); if (t) { preload(); showEl(+t.dataset.i); } });
  table.addEventListener('click', (e) => { const t = e.target.closest('.tile'); if (t) showEl(+t.dataset.i); });

  let activeFam = null;
  $('#famChips').addEventListener('click', (e) => {
    const c = e.target.closest('.chip');
    if (!c) return;
    activeFam = activeFam === c.dataset.f ? null : c.dataset.f;
    $$('.chip', $('#famChips')).forEach((x) => { const on = x.dataset.f === activeFam; x.classList.toggle('on', on); x.setAttribute('aria-pressed', String(on)); });
    table.classList.toggle('filtering', !!activeFam);
    $$('.tile', table).forEach((t) => t.classList.toggle('on', t.dataset.f === activeFam));
  });

  /* ───────── Work: accordion panels ───────── */
  const DOT = { 'Node.js': '#6DA55F', Express: '#3A3D52', 'Socket.IO': '#1D2032', Docker: '#2496ED', Jenkins: '#D24939', Nginx: '#009639', JavaScript: '#E8C64A', 'Bootstrap 5': '#7952B3', Bootstrap: '#7952B3', MongoDB: '#47A248', Postman: '#FF6C37', HTML: '#E34F26', CSS: '#1572B6', Python: '#3776AB', JSON: '#86847B', Axios: '#5A29E4' };
  const ARROW_UR = '<span class="arr">↗</span>';
  const VISUALS = {
    arcade: () => `
      <div class="v-arcade">
        <div class="v-win">
          <div class="v-bar"><i></i><i></i><i></i><span>jenkins › mini-arcade › #42</span></div>
          <ol class="v-stages">
            <li class="ok"><b>Checkout</b><em>2s</em></li>
            <li class="ok"><b>npm ci</b><em>14s</em></li>
            <li class="ok"><b>Syntax check</b><em>3s</em></li>
            <li class="ok"><b>Run tests</b><em>6s</em></li>
            <li class="ok"><b>Docker build</b><em>21s</em></li>
            <li class="run"><b>Candidate check</b><em>…</em></li>
            <li><b>Release :8083</b><em>—</em></li>
          </ol>
        </div>
        <div class="v-side">
          <div class="v-win v-board">
            <span class="win">X</span><span class="o">O</span><span class="o">O</span>
            <span></span><span class="win">X</span><span></span>
            <span class="o"></span><span></span><span class="win">X</span>
          </div>
          <div class="v-win v-stat"><b>4 games</b><small>Socket.IO rooms</small></div>
          <span class="v-pill"><i class="live-dot"></i>LIVE · DOCKER</span>
        </div>
      </div>`,
    food: () => `
      <div class="v-food">
        <div class="v-win">
          <div class="v-bar"><i></i><i></i><i></i><span>menu · filters</span></div>
          <div class="v-chips"><span class="on">All</span><span>Veg</span><span>Non-veg</span><span>Italian</span><span>₹ ↑</span></div>
          <ul class="v-menu">
            <li><span class="th" style="--c:#E9C9A4;--v:#4F9A62"></span><b>Paneer Pizza</b><em>₹249</em><i class="added">✓</i></li>
            <li><span class="th" style="--c:#D9B08C"></span><b>Classic Burger</b><em>₹179</em><i class="added">✓</i></li>
            <li><span class="th" style="--c:#EFD9A8;--v:#4F9A62"></span><b>Hakka Noodles</b><em>₹159</em><i>+</i></li>
            <li><span class="th" style="--c:#E0A27C"></span><b>Butter Chicken</b><em>₹289</em><i>+</i></li>
          </ul>
        </div>
        <div class="v-side">
          <div class="v-win v-cart">
            <small>Cart · 2 items</small>
            <b>₹428</b>
            <div class="row"><span>Delivery</span><span>Free</span></div>
            <div class="row"><span>ETA</span><span>30 min</span></div>
            <span class="go">Checkout →</span>
          </div>
          <div class="v-api">POST /api/orders<br><b>201 Created</b></div>
        </div>
      </div>`,
    quickcart: () => `
      <div class="v-qc">
        <div class="v-win">
          <div class="v-bar"><i></i><i></i><i></i><span>order #QC-1024</span></div>
          <div class="v-eta"><div><small>Arriving in</small><br><b>12 min</b></div><span class="v-pill"><i class="live-dot"></i>LIVE</span></div>
          <div class="v-bar-prog"><i></i></div>
          <ol class="v-track">
            <li class="ok">Order placed<small>10:02</small></li>
            <li class="ok">Packed<small>10:06</small></li>
            <li class="run">Out for delivery<small>10:09</small></li>
            <li>Delivered<small>—</small></li>
          </ol>
        </div>
        <div class="v-side">
          <div class="v-win">
            <div class="v-bar"><i></i><i></i><i></i><span>cart</span></div>
            <div class="v-items">
              <div><i style="--c:#F1E7CF"></i>Milk 1L<em>₹64</em></div>
              <div><i style="--c:#E7C79C"></i>Brown bread<em>₹45</em></div>
              <div><i style="--c:#F3DDB8"></i>Eggs × 6<em>₹72</em></div>
              <div><i style="--c:#CFE0B4"></i>Spinach<em>₹30</em></div>
            </div>
            <div class="v-coupon"><span>SAVE20 applied</span><span>−₹42</span></div>
          </div>
        </div>
      </div>`,
    path: () => {
      const N = { Cantt: [46, 46], Sarnath: [244, 34], Godowlia: [154, 112], Assi: [104, 190], BHU: [58, 258], Lanka: [178, 222], Ramnagar: [262, 262] };
      const E = [['Cantt', 'Sarnath', 8.5], ['Cantt', 'Godowlia', 4.8], ['Sarnath', 'Godowlia', 9.1], ['Cantt', 'Assi', 7.9], ['Godowlia', 'Assi', 2.6], ['Godowlia', 'Lanka', 4.2], ['Assi', 'Lanka', 1.6], ['Assi', 'BHU', 1.9], ['Lanka', 'BHU', 1.2], ['Lanka', 'Ramnagar', 5.6], ['Sarnath', 'Ramnagar', 12.4]];
      const route = ['Cantt', 'Godowlia', 'Assi', 'BHU'];
      const edges = E.map(([a, b, w]) => {
        const [x1, y1] = N[a], [x2, y2] = N[b];
        return `<line class="edge" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><text class="w" x="${(x1 + x2) / 2 + 4}" y="${(y1 + y2) / 2 - 4}">${w}</text>`;
      }).join('');
      const d = route.map((n, i) => `${i ? 'L' : 'M'}${N[n][0]} ${N[n][1]}`).join(' ');
      const nodes = Object.entries(N).map(([k, [x, y]]) => {
        const on = route.includes(k);
        const anchor = x > 200 ? 'end' : 'start';
        const lx = x > 200 ? x - 11 : x + 11;
        return `<circle class="node${on ? ' on' : ''}" cx="${x}" cy="${y}" r="${on ? 7 : 6}"/><text class="lbl" x="${lx}" y="${y + 18}" text-anchor="${anchor}">${k}</text>`;
      }).join('');
      return `
      <div class="v-path">
        <div class="top"><span class="v-pill light">dijkstra(Cantt → BHU)</span><span class="v-pill">9.3 km · 3 hops</span></div>
        <svg viewBox="0 0 300 290" aria-hidden="true">${edges}<path class="route" d="${d}"/>${nodes}</svg>
      </div>`;
    },
    tests: () => `
      <div class="v-tests">
        <div class="v-win v-donut-wrap">
          <div class="v-donut" style="--pass:86%"><span>86%<small>PASSING</small></span></div>
          <div class="v-legend"><span><i></i>42 pass</span><span><i class="f"></i>7 fail</span></div>
        </div>
        <div class="v-side">
          <div class="v-win">
            <div class="v-bar"><i></i><i></i><i></i><span>suites</span></div>
            <div class="v-suites">
              <div>Auth<span class="bar"><i style="--w:100%"></i></span><em>12/12</em></div>
              <div>Cart<span class="bar"><i style="--w:82%"></i></span><em>9/11</em></div>
              <div>Checkout<span class="bar"><i style="--w:80%"></i></span><em>8/10</em></div>
              <div>API<span class="bar"><i style="--w:81%"></i></span><em>13/16</em></div>
            </div>
            <div class="v-run">GET /api/results<br><b>42 passed</b> · <s>7 failed</s></div>
          </div>
        </div>
      </div>`,
  };

  $('#projectsNote').textContent = D.projectsNote;
  const panels = $('#panels');
  panels.innerHTML = D.projects.map((p, i) => {
    const shown = p.tech.slice(0, 5);
    const extra = p.tech.length - shown.length;
    return `
    <article class="panel${i === 0 ? ' open' : ''}" data-i="${i}">
      <button class="strip" type="button" aria-expanded="${i === 0}" aria-controls="pc-${i}">
        <span class="strip-n">${pad(i + 1)}</span>
        <span class="strip-t">${esc(p.short || p.title)}</span>
        <span class="strip-plus" aria-hidden="true">+</span>
      </button>
      <div class="content" id="pc-${i}">
        <div class="c-text">
          <p class="c-meta"><b>${pad(i + 1)}</b><span>${esc(p.meta)}</span></p>
          <h3>${esc(p.title)}</h3>
          <p class="c-desc">${esc(p.desc)}</p>
          <ul class="c-points">${p.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
          <div class="c-tech">${shown.map((t) => `<span style="--dot:${DOT[t] || 'var(--f-back)'}">${esc(t)}</span>`).join('')}${extra > 0 ? `<span class="more">+${extra}</span>` : ''}</div>
          <a class="btn btn-dark" href="${esc(p.repo)}" target="_blank" rel="noopener">View on GitHub ${ARROW_UR}</a>
        </div>
        <div class="visual" aria-hidden="true">${(VISUALS[p.visual] || (() => ''))()}<span class="v-cap">Illustrative UI</span></div>
      </div>
    </article>`;
  }).join('');

  function openPanel(i) {
    $$('.panel', panels).forEach((el, j) => {
      const on = j === i;
      el.classList.toggle('open', on);
      $('.strip', el).setAttribute('aria-expanded', String(on));
    });
  }
  panels.addEventListener('click', (e) => {
    const s = e.target.closest('.strip');
    if (s) openPanel(+s.parentElement.dataset.i);
  });
  const wideHover = matchMedia('(hover: hover) and (min-width: 1081px)');
  let hoverT;
  panels.addEventListener('pointerover', (e) => {
    if (!wideHover.matches) return;
    const p = e.target.closest('.panel');
    if (!p || p.classList.contains('open')) return;
    clearTimeout(hoverT);
    hoverT = setTimeout(() => openPanel(+p.dataset.i), 160);
  });
  panels.addEventListener('pointerout', (e) => {
    const p = e.target.closest('.panel');
    if (p && !p.contains(e.relatedTarget)) clearTimeout(hoverT);
  });

  /* ───────── Learning list ───────── */
  $('#learningLabel').textContent = D.learningLabel;
  $('#learningNote').textContent = D.learningNote;
  $('#learnList').innerHTML = D.learning.map((x, i) =>
    `<li><a href="${esc(x.href)}" target="_blank" rel="noopener"><span class="n">${pad(i + 1)}</span><span><b>${esc(x.t)}</b><small>${esc(x.s)}</small></span><span class="arr">↗</span></a></li>`).join('');

  /* ───────── Journey timeline ───────── */
  $('#journeyNote').textContent = D.journeyNote;
  const tlItems = $('#tlItems');
  tlItems.innerHTML = D.timeline.map((t) => `
    <article class="tl-item" data-year="${esc(t.year)}" data-reveal>
      <div class="tl-card">
        <div class="yr">${esc(t.year)}</div>
        <div class="tl-top"><span class="tag">${esc(t.tag)}</span><span class="dates">${esc(t.dates)}</span></div>
        <h3>${esc(t.title)}</h3>
        <p class="org">${esc(t.org)}</p>
        ${t.points && t.points.length ? `<ul>${t.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
        ${t.chips && t.chips.length ? `<div class="chips">${t.chips.map((c) => `<span>${esc(c)}</span>`).join('')}</div>` : ''}
      </div>
    </article>`).join('');
  const tlYear = $('#tlYear');
  if (D.timeline[0]) tlYear.textContent = D.timeline[0].year;
  const yearIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const y = en.target.dataset.year;
      if (tlYear.textContent === y) return;
      tlYear.textContent = y;
      tlYear.classList.remove('flip');
      void tlYear.offsetWidth;
      tlYear.classList.add('flip');
    });
  }, { rootMargin: '-38% 0px -52% 0px' });
  $$('.tl-item', tlItems).forEach((el) => yearIO.observe(el));

  /* ───────── Achievements ───────── */
  const ICONS = {
    github: `<img src="${DEVICON('github/github-original')}" alt="">`,
    jenkins: `<img src="${DEVICON('jenkins/jenkins-original')}" alt="">`,
    game: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12a4 4 0 0 1 4 4v1.5a3.5 3.5 0 0 1-6.3 2.1L14.5 14h-5l-1.2 1.6A3.5 3.5 0 0 1 2 13.5V12a4 4 0 0 1 4-4Z"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="16" cy="11.5" r=".6" fill="currentColor"/><circle cx="18" cy="13" r=".6" fill="currentColor"/></svg>',
    code: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4.5l-3 15"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/></svg>',
  };
  const track = $('#achvTrack');
  const nA = D.achievements.length;
  track.innerHTML = D.achievements.map((a, i) => `
    <article class="acard">
      <span class="idx">${pad(i + 1)} / ${pad(nA)}</span>
      <div class="ico">${ICONS[a.icon] || ICONS.code}</div>
      <div class="bottom">
        <div>
          <h3>${esc(a.title)}</h3>
          <div class="lbl">${esc(a.label)}</div>
          <p>${esc(a.desc)}</p>
        </div>
        <div class="num">${a.prefix ? `<span class="pre">${esc(a.prefix)}</span>` : ''}<span class="val" data-to="${a.value}"${a.live ? ` data-live="${a.live}"` : ''}>0</span>${a.suffix ? `<span class="suf">${esc(a.suffix)}</span>` : ''}</div>
      </div>
    </article>`).join('');

  const countUp = (el) => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const to = +el.dataset.to;
    if (reduceMotion) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1400;
    const step = (t) => {
      const k = clamp((t - t0) / dur, 0, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step); else el.textContent = el.dataset.to;
    };
    requestAnimationFrame(step);
  };
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { countUp(en.target); countIO.unobserve(en.target); } });
  }, { threshold: 0.6 });
  $$('.val', track).forEach((el) => countIO.observe(el));

  // Live repository count from GitHub (falls back to data.js value)
  if (D.githubUser) {
    fetch(`https://api.github.com/users/${encodeURIComponent(D.githubUser)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (!u || !u.public_repos) return;
        $$('.val[data-live="repos"]', track).forEach((el) => {
          el.dataset.to = u.public_repos;
          if (el.dataset.done) el.textContent = u.public_repos;
        });
      })
      .catch(() => {});
  }

  /* ───────── Contact ───────── */
  $('#contactNote').textContent = D.contactNote;
  const cBtns = [];
  if (D.email) cBtns.push(`<a class="btn btn-dark" href="mailto:${esc(D.email)}">${esc(D.email)} <span class="arr">→</span></a>`);
  if (D.github) cBtns.push(linkBtn(D.github, 'GitHub <span class="arr">↗</span>', !D.email));
  if (D.linkedin) cBtns.push(linkBtn(D.linkedin, 'LinkedIn <span class="arr">↗</span>'));
  if (D.resume) cBtns.push(linkBtn(D.resume, 'Résumé <span class="arr">↓</span>', false, true));
  $('#contactBtns').innerHTML = cBtns.join('');

  const form = $('#contactForm');
  const status = $('#formStatus');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = true;
    $$('.field', form).forEach((f) => {
      const inp = $('input, textarea', f);
      const bad = !inp.value.trim() || (inp.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim()));
      f.classList.toggle('bad', bad);
      if (bad) ok = false;
    });
    status.className = 'form-status';
    if (!ok) { status.textContent = 'Please fill in your name, a valid email and a message.'; status.classList.add('err'); return; }
    if (!D.formEndpoint) {
      if (D.email) location.href = `mailto:${D.email}?subject=${encodeURIComponent('Hello from your portfolio')}&body=${encodeURIComponent(form.message.value)}`;
      return;
    }
    const btn = $('button[type="submit"]', form);
    btn.disabled = true;
    status.textContent = 'Sending…';
    try {
      const res = await fetch(D.formEndpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      status.textContent = 'Thanks — message sent. I’ll get back to you soon.';
      status.classList.add('ok');
    } catch {
      status.textContent = 'Couldn’t send right now — please reach out on GitHub instead.';
      status.classList.add('err');
    } finally {
      btn.disabled = false;
    }
  });

  /* ───────── Reveal + split headings ───────── */
  $$('[data-split]').forEach((h) => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((ch) => {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const s = document.createElement('span');
            s.className = 'w';
            s.style.setProperty('--i', i++);
            s.textContent = part;
            frag.appendChild(s);
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1) {
          walk(ch);
        }
      });
    };
    walk(h);
  });
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal], [data-split], #ptable').forEach((el) => revealIO.observe(el));

  /* ───────── Scroll-driven: header, nav, parallax, timeline, pinned achievements ───────── */
  const topbar = $('#topbar');
  const navLinks = $$('.nav a');
  const sections = $$('main > section[id]');
  const tl = $('#tl');
  const tlFill = $('#tlFill');
  const achv = $('#achievements');
  const achvBar = $('#achvBar');
  const pinMQ = matchMedia('(min-width: 761px)');
  let achvOverflow = 0;

  function layoutAchv() {
    if (!pinMQ.matches || reduceMotion) {
      achv.style.height = '';
      track.style.transform = '';
      achvOverflow = 0;
      return;
    }
    track.style.transform = '';
    achvOverflow = Math.max(0, track.scrollWidth - innerWidth);
    achv.style.height = `${innerHeight + achvOverflow + innerHeight * 0.15}px`;
  }

  let ticking = false;
  function requestFrame() {
    if (!ticking) { ticking = true; requestAnimationFrame(onFrame); }
  }
  function onFrame() {
    ticking = false;
    const y = scrollY;
    topbar.classList.toggle('scrolled', y > 40);

    // pendulum impulse from scroll velocity
    const dy = y - lastScrollY;
    lastScrollY = y;
    if (pend.visible && !pend.dragging && Math.abs(dy) < innerHeight * 0.5) {
      pend.vel = clamp(pend.vel + dy * 0.006, -1.4, 1.4);
    }

    // hero parallax
    if (!reduceMotion && y < innerHeight * 1.2) {
      heroName.style.transform = `translate3d(${(-mx * 24).toFixed(1)}px, ${(y * 0.32 - my * 12).toFixed(1)}px, 0)`;
      // whole device pixels only: a fractional shift blurs the photo layer
      const snap = (v) => Math.round(v * devicePixelRatio) / devicePixelRatio;
      heroFig.style.transform = `translate3d(${snap(mx * 10)}px, ${snap(y * 0.1)}px, 0)`;
    }

    // active nav
    let current = '';
    const probe = y + innerHeight * 0.4;
    sections.forEach((s) => { if (s.offsetTop <= probe) current = s.id; });
    navLinks.forEach((a) => a.classList.toggle('active', a.dataset.nav === current));

    // timeline progress line
    const r = tl.getBoundingClientRect();
    tlFill.style.setProperty('--p', clamp((innerHeight * 0.5 - r.top) / r.height, 0, 1).toFixed(4));

    // pinned horizontal achievements
    if (achvOverflow > 0) {
      const ar = achv.getBoundingClientRect();
      const total = achv.offsetHeight - innerHeight;
      const p = clamp(-ar.top / total, 0, 1);
      const moveP = clamp(p / 0.88, 0, 1);
      track.style.transform = `translate3d(${(-moveP * achvOverflow).toFixed(1)}px, 0, 0)`;
      achvBar.style.setProperty('--p', moveP.toFixed(4));
    }
  }

  // button arrows: tell the CSS which way each one runs (→ e, ↗ ne, ↓ s) so its trail line follows it
  $$('.btn .arr').forEach((a) => { const g = a.textContent.trim(); a.dataset.dir = g === '↗' ? 'ne' : g === '↓' ? 's' : 'e'; });

  addEventListener('scroll', requestFrame, { passive: true });
  addEventListener('resize', () => { layoutAchv(); requestFrame(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { layoutAchv(); requestFrame(); });
  layoutAchv();
  onFrame();
})();
