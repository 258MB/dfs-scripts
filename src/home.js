/* =========================================================
   Digital Feng Shui — homepage GSAP script (v7)
   ---------------------------------------------------------
   [data-logo-spin]: ONE full turn, then pause, repeating
   every ~5s (not a continuous spin).
   Two knobs:
     duration    = how fast the single turn is
     repeatDelay = how long it waits between turns
   (duration 1 + repeatDelay 4 = one turn every 5s)

   No float/bounce on any logo. Course Overview: single toArray.
   Requires: gsap + ScrollTrigger registered before this runs.
   ========================================================= */

// // --- logo spin (one turn every ~5s) -------------------------------
// gsap.utils.toArray('[data-logo-spin]').forEach(logo => {
//   gsap.to(logo, {
//     rotation: 360,
//     transformOrigin: "50% 50%",
//     duration: 1,
//     ease: "power1.inOut",
//     repeat: -1,
//     repeatDelay: 4
//   });
// });

// DFS — Get Started popup
(function () {
  var popup = document.querySelector('[get-started], .get_started_container');
  if (!popup || typeof gsap === 'undefined') return;

  gsap.set(popup, { clearProps: 'transform' });
  gsap.set(popup, { y: 0, yPercent: 100 });

  var isOpen = false;

  function open() {
    if (isOpen) return;
    isOpen = true;
    gsap.to(popup, { y: 0, yPercent: 0, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    gsap.to(popup, { y: 0, yPercent: 100, duration: 0.6, ease: 'power2.in', overwrite: 'auto' });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[start-popup]')) {
      e.preventDefault();
      open();
      return;
    }
    if (e.target.closest('[close_btn], .close_btn')) {
      e.preventDefault();
      close();
    }
  }, true);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  window.dfsPopup = { open: open, close: close };
})();

// DFS — submit to Webflow, then go to Stripe with the email prefilled
(function () {
  var form = document.querySelector('.is-signup_xp');
  if (!form) return;

  // Stripe link per price-test group (set by the price test script in localStorage 'dfs_pg'),
  // so the checkout shows the same price the page showed: a = $67, b = $47, c = $97
  var STRIPE_URLS = {
    a: 'https://buy.stripe.com/5kQbIUaGJ6JdcZE2BddjO01',
    b: 'https://buy.stripe.com/14A7sE1694B50cSejVdjO02',
    c: 'https://buy.stripe.com/bJe6oA5mpffJ4t8fnZdjO03'
  };
  // Abandoned-checkout reminders (Cloudflare worker dfs-cart)
  var CART_URL = 'https://dfs-cart.thomas-aukema.workers.dev/start';

  form.addEventListener('submit', function () {
    var input = form.querySelector('input[type="email"]');
    var email = input ? input.value.trim() : '';
    if (!email) return;

    var group = 'a';
    try { group = localStorage.getItem('dfs_pg') || 'a'; } catch (e) {}
    var stripeUrl = STRIPE_URLS[group] || STRIPE_URLS.a;

    // Unique reference so the payment can be matched to this checkout
    var ref = 'dfs-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,
      10);
    try {
      navigator.sendBeacon(CART_URL, JSON.stringify({
        ref: ref,
        email: email,
        link: stripeUrl
      }));
    } catch (e) {}

    // The success state appears after Webflow handles the submit,
    // so look for the icon once it exists
    setTimeout(function () {
      var spinIcon = document.getElementById('spin_this');
      if (spinIcon) {
        gsap.to(spinIcon, {
          rotation: -360,
          duration: 1,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%'
        });
      }
    }, 100);

    setTimeout(function () {
      window.location.href = stripeUrl +
        '?client_reference_id=' + encodeURIComponent(ref) +
        '&prefilled_email=' + encodeURIComponent(email);
    }, 1200);
  }, true);
})();

// --- tiny helpers -------------------------------------------------
const q = (sel, root = document) => root.querySelector(sel);
const qa = (sel, root = document) => root.querySelectorAll(sel);

// Loop/float a single element by selector, only if it exists.
function floatEl(sel, vars) {
  const el = q(sel);
  if (el) gsap.to(el, vars);
}

// --- Meet rimbo ---------------------------------------------------
floatEl("#rimbo_img", {
  y: -12,
  duration: 3,
  ease: "sine.inOut",
  yoyo: true,
  repeat: -1
});

// --- POWER BAR 1 --------------------------------------------------
const powerBar1 = q('[power_bar="1"]');
if (powerBar1) {
  const pb1_bars1to4 = powerBar1.querySelectorAll(
    '.e_bar[e_number="1"], .e_bar[e_number="2"], .e_bar[e_number="3"], .e_bar[e_number="4"]'
  );
  const pb1_bar5 = powerBar1.querySelector('.e_bar[e_number="5"]');

  const tl_pb1 = gsap.timeline({
    scrollTrigger: { trigger: powerBar1, start: "top 80%", end: "top 40%" }
  });

  tl_pb1.to(pb1_bars1to4, {
    backgroundColor: "#0297DB",
    stagger: 0.2,
    ease: "power2.out"
  });

  if (pb1_bar5) {
    const pb1_pulse = gsap.to(pb1_bar5, {
      opacity: 1,
      backgroundColor: "#0297DB",
      repeat: -1,
      yoyo: true,
      duration: 0.8,
      ease: "power1.inOut",
      paused: true
    });
    tl_pb1.add(() => pb1_pulse.play());
  }
}

// --- POWER BAR 2 --------------------------------------------------
const powerBar2 = q('[power_bar="2"]');
if (powerBar2) {
  const pb2_bars1to15 = powerBar2.querySelectorAll(`
    .e_bar[e_number="1"],
    .e_bar[e_number="2"],
    .e_bar[e_number="3"],
    .e_bar[e_number="4"],
    .e_bar[e_number="5"],
    .e_bar[e_number="6"],
    .e_bar[e_number="7"],
    .e_bar[e_number="8"],
    .e_bar[e_number="9"],
    .e_bar[e_number="10"],
    .e_bar[e_number="12"],
    .e_bar[e_number="13"],
    .e_bar[e_number="14"],
    .e_bar[e_number="15"]
  `);
  const pb2_bars16to17 = powerBar2.querySelectorAll(
    '.e_bar[e_number="16"], .e_bar[e_number="17"]'
  );

  const tl_pb2 = gsap.timeline({
    scrollTrigger: { trigger: powerBar2, start: "top 80%", end: "top 40%" }
  });

  tl_pb2.to(pb2_bars1to15, {
    backgroundColor: "#0297DB",
    stagger: 0.15,
    ease: "power2.out"
  });

  if (pb2_bars16to17.length) {
    const pb2_pulse = gsap.to(pb2_bars16to17, {
      opacity: 1,
      backgroundColor: "#0297DB",
      repeat: -1,
      yoyo: true,
      duration: 0.8,
      stagger: 0.1,
      ease: "power1.inOut",
      paused: true
    });
    tl_pb2.add(() => pb2_pulse.play());
  }
}

// --- COURSE OVERVIEW ----------------------------------------------
const courseOverview = q("#Course_Overview");
if (courseOverview) {
  // Query the items once, derive the inner wraps from that.
  const items = gsap.utils.toArray("#Course_Overview .course_item");

  const ciWraps = items
    .map(item => item.querySelector(".ci_wrap"))
    .filter(Boolean);

  if (ciWraps.length) {
    gsap.from(ciWraps, {
      y: 60,
      x: 33,
      rotation: -10,
      opacity: 0,
      ease: "power2.out",
      stagger: 0.1,
      duration: 1,
      scrollTrigger: {
        trigger: "#Course_Overview",
        start: "top 60%"
      }
    });
  }

  // Hover animation (on each course_item)
  items.forEach((item) => {
    let subtleJiggle = gsap.timeline({ paused: true, repeat: -1, yoyo: true })
      .to(item, { rotation: 0.2, x: 1, y: -1, duration: 0.2, ease: "sine.inOut" })
      .to(item, { rotation: -0.2, x: -1, y: 1, duration: 0.2, ease: "sine.inOut" });

    item.addEventListener("mouseenter", () => {
      gsap.to(item, { scale: 1.1, duration: 0.3, ease: "power2.out" });
      subtleJiggle.play();
    });
    item.addEventListener("mouseleave", () => {
      gsap.to(item, {
        scale: 1,
        rotation: 0,
        x: 0,
        y: 0,
        duration: 0.4,
        ease: "power2.inOut"
      });
      subtleJiggle.pause(0);
    });
  });
}

// --- TESTIMONIAL --------------------------------------------------
qa('[data-testimonial]').forEach((section, idx) => {
  let currentTState = null;
  const T1 = section.querySelector('[data-t="1"]');
  const T2 = section.querySelector('[data-t="2"]');
  const T3 = section.querySelector('[data-t="3"]');
  const btnT1 = section.querySelector('[data-btn-t="1"]');
  const btnT2 = section.querySelector('[data-btn-t="2"]');
  const btnT3 = section.querySelector('[data-btn-t="3"]');
  const wrapT1 = section.querySelector('[data-wrap-t="1"]');
  const wrapT2 = section.querySelector('[data-wrap-t="2"]');
  const wrapT3 = section.querySelector('[data-wrap-t="3"]');
  const progressBar =
    section.querySelector('[data-progress]') ||
    section.querySelector('[progress_bar_t]') ||
    section.querySelector('#Progress_bar_T');

  if (!T1 || !T2 || !T3 || !btnT1 || !btnT2 || !btnT3 ||
    !wrapT1 || !wrapT2 || !wrapT3 || !progressBar) {
    console.warn('Missing testimonial parts in section', idx);
    return;
  }

  const slides = [T1, T2, T3];
  const btns = [btnT1, btnT2, btnT3];

  // --- initial state: hard set, geen fade/flits bij load ---
  gsap.set([T2, T3], { autoAlpha: 0, pointerEvents: "none" });
  gsap.set(T1, { autoAlpha: 1, pointerEvents: "auto" });
  section.querySelectorAll(".t-btn").forEach((b) => b.classList.remove("is-active"));
  btnT1.classList.add("is-active");
  currentTState = 1;

  // --- één generieke state-switcher i.p.v. 3x dezelfde functie ---
  function goToState(n) {
    if (currentTState === n) return;
    slides.forEach((slide, i) => {
      const active = i === n - 1;
      gsap.to(slide, {
        autoAlpha: active ? 1 : 0,
        duration: 0.5,
        pointerEvents: active ? "auto" : "none"
      });
    });
    section.querySelectorAll(".t-btn").forEach((b) => b.classList.remove("is-active"));
    btns[n - 1].classList.add("is-active");
    currentTState = n;
    resetProgress();
  }

  wrapT1.addEventListener("click", () => goToState(1));
  wrapT2.addEventListener("click", () => goToState(2));
  wrapT3.addEventListener("click", () => goToState(3));

  function startProgressLoop() {
    gsap.set(progressBar, { x: "-100%" });
    gsap.to(progressBar, {
      x: "0%",
      duration: 12,
      ease: "none",
      onComplete: () => goToState(currentTState === 3 ? 1 : currentTState + 1)
    });
  }

  function resetProgress() {
    gsap.killTweensOf(progressBar);
    startProgressLoop();
  }

  // één keer starten — niet dubbel
  startProgressLoop();
});

// --- nice blue line animation -------------------------------------
qa('[data-line-container]').forEach((container) => {
  const line = container.querySelector('[data-bleu-line]');
  if (!line) return;
  const containerWidth = container.offsetWidth;

  gsap.set(line, { x: "-2rem", scaleX: 0.2, transformOrigin: "left center" });
  gsap.timeline({ repeat: -1, repeatDelay: 0.2 })
    .to(line, { duration: 0.3, ease: "power1.in" })
    .to(line, { x: containerWidth + 160, scaleX: 1.4, duration: 4.4, ease: "power2.inOut" })
    .to(line, { duration: 0.3, ease: "power1.out" })
    .add(() => { gsap.set(line, { x: "-2rem", scaleX: 0.2 }); });
});

// --- dino stuff ---------------------------------------------------
floatEl("#dino", {
  xPercent: -2,
  rotation: -6,
  duration: 1,
  yoyo: true,
  repeat: -1,
  ease: "sine.inOut",
  transformOrigin: "center"
});
floatEl("#hourglass", {
  rotation: 360,
  transformOrigin: "50% 50%",
  repeat: -1,
  ease: "linear",
  duration: 3
});
floatEl("#hourglass", {
  xPercent: -4,
  duration: 1,
  yoyo: true,
  repeat: -1,
  ease: "sine.inOut",
  transformOrigin: "center"
});
floatEl("#ERROR", {
  opacity: 1,
  xPercent: -4,
  rotation: -2,
  scale: 1.2,
  duration: 1,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true
});
floatEl("#ERROR2", {
  opacity: 1,
  xPercent: 2,
  rotation: 2,
  scale: 1.4,
  duration: 2,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true
});
floatEl("#ERROR3", {
  opacity: 1,
  xPercent: 6,
  rotation: -2,
  scale: 1.8,
  duration: 2.2,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true
});

function initCSSMarquee() {
  const defaultSpeed = 60; // fallback when no attribute is set
  const marquees = qa('[data-css-marquee]');
  if (!marquees.length) return;

  // Duplicate each list inside its container
  marquees.forEach(marquee => {
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      const duplicate = list.cloneNode(true);
      marquee.appendChild(duplicate);
    });
  });

  // Pause/run based on whether the marquee is in view
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.querySelectorAll('[data-css-marquee-list]').forEach(list =>
        list.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused'
      );
    });
  }, { threshold: 0 });

  // Set duration from width + per-marquee speed, then observe
  marquees.forEach(marquee => {
    const pixelsPerSecond =
      parseFloat(marquee.getAttribute('data-css-marquee-speed')) || defaultSpeed;

    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      list.style.animationDuration = (list.offsetWidth / pixelsPerSecond) + 's';
      list.style.animationPlayState = 'paused';
    });
    observer.observe(marquee);
  });
}
initCSSMarquee();

// --- globe --------------------------------------------------------
function initAcceleratingGlobe() {
  qa('[data-accelerating-globe]').forEach(function (globe) {
    const circles = globe.querySelectorAll('[data-accelerating-globe-circle]');
    if (circles.length < 8) return; // needs at least 8

    const tl = gsap.timeline({
      repeat: -1,
      defaults: { duration: 1, ease: "none" }
    });

    const widths = [
      ["50%", "37.5%"],
      ["37.5%", "25%"],
      ["25%", "12.5%"],
      ["calc(12.5% + 1px)", "calc(0% + 1px)"],
      ["calc(0% + 1px)", "calc(12.5% + 1px)"],
      ["12.5%", "25%"],
      ["25%", "37.5%"],
      ["37.5%", "50%"]
    ];

    circles.forEach((el, i) => {
      const [fromW, toW] = widths[i];
      tl.fromTo(el, { width: fromW }, { width: toW }, i === 0 ? 0 : "<");
    });

    let lastY = window.scrollY;
    let lastT = performance.now();
    let stopTimeout;

    function onScroll() {
      const now = performance.now();
      const dy = window.scrollY - lastY;
      const dt = now - lastT;
      lastY = window.scrollY;
      lastT = now;

      const velocity = dt > 0 ? (dy / dt) * 1000 : 0; // px/s
      const boost = Math.abs(velocity * 0.005);
      const targetScale = boost + 1;
      tl.timeScale(targetScale);

      clearTimeout(stopTimeout);
      stopTimeout = setTimeout(() => {
        gsap.to(tl, {
          timeScale: 1,
          duration: 0.6,
          ease: "power2.out",
          overwrite: true
        });
      }, 100);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
  });
}
initAcceleratingGlobe();

// DFS block assembly
// Host: any element with the custom attribute  data-dfs-blocks
// Look is controlled by CSS on the host div:
//   --blk-tone, --blk-radius, --blk-gap, --blk-shadow
// Optional attributes on the host:
//   data-merge="#4696E2"   colour the pieces settle to (default: same as --blk-tone)
//   data-bleed="1.15"      how far the scatter spills past the panel (1 = stays inside)
(function () {
  'use strict';
  // 5 rows x 8 cols, tiled by 10 tetrominoes
  var PIECES = [
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2]
    ],
    [
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5]
    ],
    [
      [0, 6],
      [0, 7],
      [1, 6],
      [1, 7]
    ],
    [
      [1, 3],
      [1, 4],
      [1, 5],
      [2, 5]
    ],
    [
      [1, 0],
      [2, 0],
      [3, 0],
      [3, 1]
    ],
    [
      [2, 1],
      [2, 2],
      [3, 2],
      [3, 3]
    ],
    [
      [2, 3],
      [2, 4],
      [3, 4],
      [3, 5]
    ],
    [
      [2, 6],
      [2, 7],
      [3, 7],
      [4, 7]
    ],
    [
      [3, 6],
      [4, 6],
      [4, 5],
      [4, 4]
    ],
    [
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3]
    ]
  ];
  // Per-piece lightness, so they start mismatched and resolve to one tone
  var TONE_STEPS = [1.16, 0.84, 1.06, 0.75, 0.95, 1.11, 0.88, 1.00, 0.80, 1.08];
  var COLS = 8,
    ROWS = 5,
    MAX_CELL = 46,
    MIN_CELL = 14;
  // Glow once the pieces come together. 0 = off.
  var GLOW_HOLD = 0.55; // steady glow while assembled
  var GLOW_FLASH = 0.45; // extra burst at the moment they merge
  var GLOW_SIZE = 0.55; // blur radius as a fraction of one block
  // Colour the pieces settle to once assembled. Set to null to keep the base tone.
  var MERGE_TONE = '#4696E2';
  // Pixel-stepped corners instead of a CSS radius.
  var CORNER_STEPS = 2; // steps cut from each corner (0 = plain square)
  var CORNER_UNIT = 0.06; // size of one step, as a fraction of the block
  // Builds a clip-path with staircase corners for a square of side s
  function pixelCorners(s, steps, u) {
    if (!steps || u < 1) return 'none';
    var p = [],
      i;
    p.push([steps * u, 0]);
    p.push([s - steps * u, 0]);
    for (i = 1; i <= steps; i++) {
      p.push([s - (steps - i + 1) * u, i * u]);
      p.push([s - (steps - i) * u, i * u]);
    }
    p.push([s, s - steps * u]);
    for (i = 1; i <= steps; i++) {
      p.push([s - i * u, s - (steps - i + 1) * u]);
      p.push([s - i * u, s - (steps - i) * u]);
    }
    p.push([steps * u, s]);
    for (i = 1; i <= steps; i++) {
      p.push([(steps - i + 1) * u, s - i * u]);
      p.push([(steps - i) * u, s - i * u]);
    }
    p.push([0, steps * u]);
    for (i = steps; i >= 1; i--) {
      p.push([(steps - i) * u, i * u]);
      p.push([(steps - i + 1) * u, i * u]);
    }
    return 'polygon(' + p.map(function (q) {
      return q[0].toFixed(1) + 'px ' + q[1].toFixed(1) + 'px';
    }).join(',') + ')';
  }
  var T = { drift: 3000, gather: 2100, merge: 1100, hold: 3200, out: 900, back: 900 };
  var CYCLE = T.drift + T.gather + T.merge + T.hold + T.out + T.back;

  function easeInOut(x) { return 0.5 - 0.5 * Math.cos(Math.PI * x); }

  function toRGB(str) {
    var m = String(str).trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (m) {
      var h = m[1];
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6),
        16)];
    }
    m = String(str).match(/rgba?\(([^)]+)\)/i);
    if (m) { var p = m[1].split(',').map(parseFloat); return [p[0] | 0, p[1] | 0, p[2] | 0]; }
    return [185, 175, 155];
  }

  function shade(rgb, f) {
    return rgb.map(function (v) { return Math.max(0, Math.min(255, Math.round(v * f))); });
  }

  function seeded(n) {
    var s = n;
    return function () { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  }
  // Keeps a rotation in the -180..180 range. Safe to call only while the piece
  // is drawn at full angle (loose = 1), where a 360 shift looks identical.
  function wrapAngle(a) {
    a = (a + 180) % 360;
    if (a < 0) a += 360;
    return a - 180;
  }

  function mount(host) {
    if (host.dataset.dfsBlocksReady) return;
    host.dataset.dfsBlocksReady = '1';
    var cs = getComputedStyle(host);
    if (cs.position === 'static') host.style.position = 'relative';
    var baseRGB = toRGB(cs.getPropertyValue('--blk-tone') || '#B9AF9B');
    var mergeSrc = host.getAttribute('data-merge') || MERGE_TONE;
    var mergeRGB = mergeSrc ? toRGB(mergeSrc) : baseRGB;
    var gap = parseFloat(cs.getPropertyValue('--blk-gap')) || 3;
    var shadow = (cs.getPropertyValue('--blk-shadow') || '').trim() ||
      '0 3px 5px rgba(0,0,0,.16)';
    var bleed = parseFloat(host.getAttribute('data-bleed')) || 1.15;
    var layer = document.createElement('div');
    layer.className = 'dfs-blk-layer';
    host.appendChild(layer);
    var rnd = seeded(1277);
    var pieces = PIECES.map(function (cells, i) {
      var minR = 99,
        minC = 99,
        maxR = -1,
        maxC = -1;
      cells.forEach(function (q) {
        minR = Math.min(minR, q[0]);
        minC = Math.min(minC, q[1]);
        maxR = Math.max(maxR, q[0]);
        maxC = Math.max(maxC, q[1]);
      });
      var el = document.createElement('div');
      el.className = 'dfs-blk-piece';
      var squares = cells.map(function () {
        var s = document.createElement('div');
        s.className = 'dfs-blk-cell';
        el.appendChild(s);
        return s;
      });
      layer.appendChild(el);
      var theta = (i / PIECES.length) * Math.PI * 2 + rnd() * 0.5;
      return {
        el: el,
        squares: squares,
        cells: cells,
        minR: minR,
        minC: minC,
        maxR: maxR,
        maxC: maxC,
        from: shade(baseRGB, TONE_STEPS[i % TONE_STEPS.length]),
        theta: theta,
        radius: 0.82 + rnd() * 0.28,
        wobbleAmp: 0.05 + rnd() * 0.03,
        wobbleX: 0.05 + rnd() * 0.03,
        wobbleY: 0.065 + rnd() * 0.03,
        phaseX: rnd() * 6.28,
        phaseY: rnd() * 6.28,
        spin: (rnd() < 0.5 ? -1 : 1) * (8 + rnd() * 46),
        angle: rnd() * 360,
        driftX: rnd() * 6.28,
        driftY: rnd() * 6.28,
        homeX: 0,
        homeY: 0
      };
    });
    var W = 0,
      H = 0,
      cellPx = 0;

    function layout() {
      W = host.clientWidth;
      H = host.clientHeight;
      if (!W || !H) return false;
      var cell = Math.max(MIN_CELL, Math.min(W * 0.92 / COLS, H * 0.72 / ROWS, MAX_CELL));
      cellPx = cell;
      var ox = (W - cell * COLS) / 2,
        oy = (H - cell * ROWS) / 2;
      var side = cell - gap * 2;
      var clip = pixelCorners(side, CORNER_STEPS, Math.max(1, Math.round(side * CORNER_UNIT)));
      pieces.forEach(function (p) {
        p.el.style.left = (ox + p.minC * cell) + 'px';
        p.el.style.top = (oy + p.minR * cell) + 'px';
        p.el.style.width = ((p.maxC - p.minC + 1) * cell) + 'px';
        p.el.style.height = ((p.maxR - p.minR + 1) * cell) + 'px';
        p.cells.forEach(function (q, j) {
          var s = p.squares[j];
          s.style.left = ((q[1] - p.minC) * cell + gap) + 'px';
          s.style.top = ((q[0] - p.minR) * cell + gap) + 'px';
          s.style.width = side + 'px';
          s.style.height = side + 'px';
          s.style.borderRadius = '0';
          s.style.clipPath = clip;
        });
        // Scatter ring. X = how far sideways, Y = how far up/down, as a fraction of the panel.
        p.homeX = Math.cos(p.theta) * W * 0.24 * p.radius * bleed;
        p.homeY = Math.sin(p.theta) * H * 0.52 * p.radius * bleed;
      });
      return true;
    }

    function paint(gather, merge) {
      var loose = 1 - gather;
      pieces.forEach(function (p) {
        var dx = p.homeX + Math.sin(p.driftX + p.phaseX) * W * p.wobbleAmp * 0.5;
        var dy = p.homeY + Math.cos(p.driftY + p.phaseY) * H * p.wobbleAmp * 0.5;
        p.el.style.transform =
          'translate(' + (dx * loose).toFixed(2) + 'px,' + (dy * loose).toFixed(2) + 'px)' +
          ' rotate(' + (p.angle * loose).toFixed(2) + 'deg)';
        p.el.style.filter = gather > 0.85 ? 'drop-shadow(' + shadow + ')' : 'none';
        var c = 'rgb(' +
          Math.round(p.from[0] + (mergeRGB[0] - p.from[0]) * merge) + ',' +
          Math.round(p.from[1] + (mergeRGB[1] - p.from[1]) * merge) + ',' +
          Math.round(p.from[2] + (mergeRGB[2] - p.from[2]) * merge) + ')';
        p.squares.forEach(function (s) { s.style.background = c; });
      });
    }

    function renderStatic() {
      if (layout()) {
        layer.style.opacity = '1';
        paint(1, 1);
      }
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      renderStatic();
      if (window.ResizeObserver) new ResizeObserver(renderStatic).observe(host);
      return;
    }
    var clock = 0,
      last = 0,
      raf = null,
      visible = false;

    function frame(now) {
      var dt = last ? Math.min(64, now - last) : 16;
      last = now;
      clock += dt;
      var m = clock % CYCLE,
        gather, merge, opacity;
      var a = T.drift,
        b = a + T.gather,
        c = b + T.merge,
        d = c + T.hold,
        e = d + T.out;
      if (m < a) {
        gather = 0;
        merge = 0;
        opacity = 1;
      }
      else if (m < b) {
        gather = easeInOut((m - a) / T.gather);
        merge = 0;
        opacity = 1;
      }
      else if (m < c) {
        gather = 1;
        merge = easeInOut((m - b) / T.merge);
        opacity = 1;
      }
      else if (m < d) {
        gather = 1;
        merge = 1;
        opacity = 1;
      }
      else if (m < e) {
        gather = 1;
        merge = 1;
        opacity = 1 - easeInOut((m - d) / T.out);
      }
      else {
        gather = 0;
        merge = 0;
        opacity = easeInOut((m - e) / T.back);
      }
      var sec = dt / 1000,
        loose = 1 - gather;
      pieces.forEach(function (p) {
        p.angle += p.spin * sec * loose;
        // Only wrap while fully loose: rotation is drawn as angle * loose, so an
        // unwrapped angle would force the piece to unwind everything it has ever
        // spun during the gather, and that unwind gets faster the longer the page
        // stays open.
        if (loose > 0.999) p.angle = wrapAngle(p.angle);
        p.driftX += p.wobbleX * sec * 6.28 * loose;
        p.driftY += p.wobbleY * sec * 6.28 * loose;
      });
      layer.style.opacity = opacity.toFixed(3);
      paint(gather, merge);
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    }

    function stop() {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    }
    if (!layout()) requestAnimationFrame(layout);
    if (window.ResizeObserver) new ResizeObserver(layout).observe(host);
    else window.addEventListener('resize', layout);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) { start(); } else { stop(); }
      }, { threshold: 0.05 }).observe(host);
    } else {
      start();
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); } else if (visible) { start(); }
    });
  }
  document.querySelectorAll('[data-dfs-blocks]').forEach(mount);
})();
