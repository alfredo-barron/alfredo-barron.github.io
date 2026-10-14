/* Sitio personal — Dr. Alfredo Barrón Rodríguez */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Año ---------- */
  var y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Tema ---------- */
  var themeBtn = document.getElementById('themeBtn');
  function currentTheme() {
    var t = doc.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyIcons() { doc.setAttribute('data-theme', currentTheme()); }
  applyIcons();
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    doc.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ---------- Menú móvil ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function closeMenu() { document.body.classList.remove('menu-open'); if (burger) burger.setAttribute('aria-expanded', 'false'); }
  if (burger) burger.addEventListener('click', function () {
    var open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  if (menu) menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Barra superior + progreso ---------- */
  var topbar = document.getElementById('topbar');
  var bar = document.getElementById('progress');
  var ticking = false;
  function onScroll() {
    var st = window.scrollY || doc.scrollTop;
    var max = doc.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? st / max : 0) + ')';
    if (topbar) topbar.classList.toggle('scrolled', st > 40);
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  /* ---------- Navegación activa ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('#menu a'));
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) { var s = document.querySelector(l.getAttribute('href')); if (s) spy.observe(s); });
  }

  /* ---------- Contadores ---------- */
  function countUp(el) {
    var to = parseInt(el.getAttribute('data-to'), 10) || 0;
    if (reduce) { el.textContent = to; return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  }

  /* ---------- Aparición al hacer scroll ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var counters = Array.prototype.slice.call(document.querySelectorAll('.count'));
  if ('IntersectionObserver' in window && !reduce) {
    // escalonar elementos hermanos
    reveals.forEach(function (el) {
      var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.classList.contains('reveal'); });
      var i = sibs.indexOf(el);
      if (i > 0) el.style.setProperty('--d', Math.min(i, 6) * 0.07 + 's');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });

    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Rotador de roles ---------- */
  var rot = document.getElementById('rotator');
  var words = ['sistemas distribuidos', 'cómputo Edge–Fog–Cloud', 'Internet de las Cosas', 'ingeniería de datos', 'agricultura digital'];
  if (rot && !reduce) {
    var wi = 0, ci = words[0].length, deleting = true, wait = 1800;
    (function type() {
      var w = words[wi];
      if (deleting) {
        ci--;
        if (ci <= 0) { deleting = false; wi = (wi + 1) % words.length; w = words[wi]; }
      } else {
        ci++;
      }
      rot.textContent = words[wi].slice(0, Math.max(ci, 0));
      var delay = deleting ? 35 : 70;
      if (!deleting && ci >= words[wi].length) { deleting = true; delay = wait; }
      setTimeout(type, delay);
    })();
  }

  /* ---------- Retrato con inclinación ---------- */
  var portrait = document.getElementById('portrait');
  if (portrait && !reduce && window.matchMedia('(hover: hover)').matches) {
    portrait.addEventListener('mousemove', function (e) {
      var r = portrait.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, yv = (e.clientY - r.top) / r.height - 0.5;
      portrait.style.transform = 'perspective(900px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-yv * 8) + 'deg)';
    });
    portrait.addEventListener('mouseleave', function () { portrait.style.transform = ''; });
  }

  /* ---------- Filtros de divulgación ---------- */
  var filters = Array.prototype.slice.call(document.querySelectorAll('.filter'));
  var events = Array.prototype.slice.call(document.querySelectorAll('.event'));
  filters.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-f');
      filters.forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      events.forEach(function (ev) {
        var show = f === 'all' || ev.getAttribute('data-k') === f;
        ev.classList.toggle('hide', !show);
        if (show) ev.classList.add('in');
      });
    });
  });

  /* ---------- Barras de competencias ---------- */
  var skills = document.querySelector('.skills');
  if (skills && reduce) skills.classList.add('in');

  /* ---------- Red Edge–Fog–Cloud animada ---------- */
  var cv = document.getElementById('net');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var nodes = [], edges = [], packets = [], running = true;
  var COLORS = { edge: '#5fd39a', fog: '#f2b93b', cloud: '#8ab8ff' };

  function build() {
    var r = cv.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    nodes = []; edges = []; packets = [];
    var small = W < 700;
    var nEdge = small ? 9 : 18, nFog = small ? 4 : 7, nCloud = small ? 2 : 4;
    function layer(n, yFrac, type, jitter) {
      var arr = [];
      for (var i = 0; i < n; i++) {
        var x = (i + 0.5) / n * W + (Math.random() - 0.5) * (W / n) * 0.6;
        var yy = H * yFrac + (Math.random() - 0.5) * H * jitter;
        var node = { x: x, y: yy, bx: x, by: yy, t: type, r: type === 'cloud' ? 4.5 : type === 'fog' ? 3.5 : 2.2, ph: Math.random() * 6.28 };
        nodes.push(node); arr.push(node);
      }
      return arr;
    }
    var cloud = layer(nCloud, 0.16, 'cloud', 0.08);
    var fog = layer(nFog, 0.48, 'fog', 0.1);
    var edge = layer(nEdge, 0.84, 'edge', 0.1);
    function nearest(a, list, k) {
      return list.slice().sort(function (p, q) { return Math.abs(p.x - a.x) - Math.abs(q.x - a.x); }).slice(0, k);
    }
    edge.forEach(function (e) { nearest(e, fog, 1).forEach(function (f) { edges.push([e, f]); }); });
    fog.forEach(function (f) { nearest(f, cloud, 2).forEach(function (c) { edges.push([f, c]); }); });
    for (var i = 0; i < fog.length - 1; i++) edges.push([fog[i], fog[i + 1]]);
  }

  function spawn() {
    if (!edges.length) return;
    var e = edges[(Math.random() * edges.length) | 0];
    var up = e[0].y > e[1].y;
    packets.push({ a: up ? e[0] : e[1], b: up ? e[1] : e[0], p: 0, s: 0.006 + Math.random() * 0.008 });
  }

  var last = 0, tAcc = 0;
  function frame(ts) {
    if (!running) return;
    var dt = Math.min(ts - last, 50); last = ts; tAcc += dt;
    ctx.clearRect(0, 0, W, H);
    nodes.forEach(function (n) {
      n.ph += dt * 0.0008;
      n.x = n.bx + Math.sin(n.ph) * 4; n.y = n.by + Math.cos(n.ph * 1.3) * 3;
    });
    ctx.lineWidth = 1;
    edges.forEach(function (e) {
      ctx.strokeStyle = 'rgba(160,185,220,0.16)';
      ctx.beginPath(); ctx.moveTo(e[0].x, e[0].y); ctx.lineTo(e[1].x, e[1].y); ctx.stroke();
    });
    nodes.forEach(function (n) {
      ctx.fillStyle = COLORS[n.t];
      ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.283); ctx.fill();
      ctx.globalAlpha = 0.12;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 3.2, 0, 6.283); ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (tAcc > 140) { spawn(); tAcc = 0; }
    for (var i = packets.length - 1; i >= 0; i--) {
      var k = packets[i]; k.p += k.s * dt / 16;
      if (k.p >= 1) { packets.splice(i, 1); continue; }
      var x = k.a.x + (k.b.x - k.a.x) * k.p, yy = k.a.y + (k.b.y - k.a.y) * k.p;
      ctx.fillStyle = COLORS[k.b.t];
      ctx.beginPath(); ctx.arc(x, yy, 1.8, 0, 6.283); ctx.fill();
    }
    requestAnimationFrame(frame);
  }

  function staticDraw() {
    ctx.clearRect(0, 0, W, H);
    edges.forEach(function (e) { ctx.strokeStyle = 'rgba(160,185,220,0.16)'; ctx.beginPath(); ctx.moveTo(e[0].x, e[0].y); ctx.lineTo(e[1].x, e[1].y); ctx.stroke(); });
    nodes.forEach(function (n) { ctx.fillStyle = COLORS[n.t]; ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.283); ctx.fill(); });
  }

  build();
  if (reduce) { staticDraw(); }
  else {
    requestAnimationFrame(function (t) { last = t; frame(t); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        var vis = en[0].isIntersecting;
        if (vis && !running) { running = true; requestAnimationFrame(function (t) { last = t; frame(t); }); }
        else if (!vis) running = false;
      }).observe(cv);
    }
  }
  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { build(); if (reduce) staticDraw(); }, 200);
  });
})();
