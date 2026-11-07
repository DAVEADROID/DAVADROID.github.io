/* =========================================================
   Deandray Coates portfolio, behavior
   No libraries. Everything degrades gracefully without JS.
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.querySelector('.theme-toggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var next = theme === 'dark' ? 'light' : 'dark';
    if (themeBtn) themeBtn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#0a0e14' : '#f6f8fb');
  }

  applyTheme(root.getAttribute('data-theme') || 'dark');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
    });
  }

  // Follow system changes unless the visitor picked a theme
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
    var saved = null;
    try { saved = localStorage.getItem('theme'); } catch (err) {}
    if (!saved) applyTheme(e.matches ? 'light' : 'dark');
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector('.menu-toggle');
  var navLinks = document.getElementById('nav-links');

  function setMenu(open) {
    if (!menuBtn || !navLinks) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navLinks.classList.toggle('is-open', open);
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuBtn.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav')) setMenu(false);
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function () { setMenu(false); });
  }

  /* ---------- Active section highlighting ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var current = null;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) current = entry.target.id;
      });
      links.forEach(function (a) {
        var active = a.getAttribute('href') === '#' + current;
        a.classList.toggle('is-active', active);
        if (active) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion.matches) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { revealer.observe(el); });
  }

  /* ---------- Terminal line typing ---------- */
  var terminal = document.querySelector('.terminal');
  var cmd = document.querySelector('.terminal-cmd');
  if (terminal && cmd && !reduceMotion.matches) {
    var text = cmd.getAttribute('data-type') || cmd.textContent;
    var i = 0;
    cmd.textContent = '';
    terminal.classList.add('is-typing');
    (function type() {
      if (i < text.length) {
        cmd.textContent += text.charAt(i++);
        setTimeout(type, 90);
      } else {
        setTimeout(function () { terminal.classList.remove('is-typing'); }, 250);
      }
    })();
  }

  /* ---------- PKI diagram: trust vs. rogue CA ---------- */
  var diagram = document.querySelector('.pki-diagram');
  var modeBtns = document.querySelectorAll('.seg-btn[data-mode]');
  var statusPill = document.querySelector('.pki-status .status');
  var statusText = document.querySelector('.pki-status-text');

  var modes = {
    trust: {
      ok: true,
      pill: 'Chain valid',
      text: 'Client follows the chain from the intranet certificate to ACME-LAB-ISSUING to ACME-LAB-ROOT, which it trusts.'
    },
    mitm: {
      ok: false,
      pill: 'Validation fails',
      text: 'The attacker VM intercepts traffic and presents a certificate from ATTACKER-LAB-CA. It does not chain to ACME-LAB-ROOT, so the client cannot validate it.'
    }
  };

  function setMode(mode) {
    var m = modes[mode];
    if (!diagram || !m) return;
    diagram.setAttribute('data-mode', mode);
    modeBtns.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-mode') === mode));
    });
    if (statusPill) {
      statusPill.className = 'status ' + (m.ok ? 'status-ok' : 'status-bad');
      statusPill.innerHTML = '<span class="dot" aria-hidden="true"></span>' + m.pill;
    }
    if (statusText) statusText.textContent = m.text;
  }

  modeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { setMode(btn.getAttribute('data-mode')); });
  });
})();
