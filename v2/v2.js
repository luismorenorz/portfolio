/* Luis Moreno — v2 prototype motion.
   No framework. Sticky sections give the pinning; one rAF loop reads each
   track's scroll position and drives the intro, the burn and the story.
   Lenis only smooths the wheel; everything still works without it. */
(function () {
  "use strict";

  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var root = document.documentElement;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function range(v, a, b) { return clamp((v - a) / (b - a), 0, 1); }
  // with reduced motion, big scroll-scrubbed moves become a cut halfway through
  function R(t) { return reduce ? (t >= .5 ? 1 : 0) : t; }
  var ease = {
    outCubic: function (t) { return 1 - Math.pow(1 - t, 3); },
    inOutCubic: function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    inOutQuart: function (t) { return t < .5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2; }
  };
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ------------------------------------------------------------ pointer
     One pointer for everything that leans toward the cursor. sx/sy are
     smoothed and run -1..1 across the screen. Only for a real mouse. */
  var fine = !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  var ptr = { x: -9999, y: -9999, sx: 0, sy: 0, seen: false };
  if (fine) window.addEventListener("pointermove", function (ev) {
    ptr.x = ev.clientX; ptr.y = ev.clientY; ptr.seen = true;
  }, { passive: true });

  /* ----------------------------------------------------------- scramble
     Mono labels decode into place: random glyphs settle left to right.
     Works on text nodes, so line breaks and links inside survive. */
  var GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789/-+";
  function scramble(el, text) {
    if (!el) return;
    if (text != null) { el.textContent = text; el._fin = null; }
    if (!el._fin) {
      el._fin = [];
      var tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (tw.nextNode()) el._fin.push({ n: tw.currentNode, t: tw.currentNode.nodeValue });
    }
    if (reduce) return;
    var fin = el._fin, total = 0;
    fin.forEach(function (f) { total += f.t.length; });
    total = total || 1;
    var t0 = performance.now(), D = 420 + Math.min(total, 60) * 9;
    cancelAnimationFrame(el._scr);
    (function step(now) {
      var k = clamp((now - t0) / D, 0, 1), idx = 0;
      fin.forEach(function (f) {
        var out = "";
        for (var i = 0; i < f.t.length; i++, idx++) {
          var c = f.t.charAt(i);
          out += (c === " " || k >= 1 || k > .2 + .8 * idx / total) ? c : GLYPHS.charAt((Math.random() * GLYPHS.length) | 0);
        }
        f.n.nodeValue = out;
      });
      if (k < 1) el._scr = requestAnimationFrame(step);
    })(t0);
  }

  /* ----------------------------------------------------------- odometer
     Each digit is a column of 0–9 that rolls to its number. */
  function makeOdo(host, digits) {
    host.textContent = "";
    var strips = [];
    for (var d = 0; d < digits; d++) {
      var cell = document.createElement("span");
      cell.className = "odo-d";
      var strip = document.createElement("span");
      strip.className = "odo-s";
      strip.style.transitionDelay = (d * .06) + "s";
      for (var n = 0; n < 10; n++) {
        var s = document.createElement("span");
        s.textContent = n;
        strip.appendChild(s);
      }
      cell.appendChild(strip);
      host.appendChild(cell);
      strips.push(strip);
    }
    return function (value) {
      var str = String(value);
      while (str.length < digits) str = "0" + str;
      for (var i = 0; i < digits; i++) strips[i].style.transform = "translate3d(0," + (-(+str.charAt(i))) + "em,0)";
      host.setAttribute("aria-label", String(value));
    };
  }

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  /* ----------------------------------------------------------- elements */
  var curtain = $("#curtain");
  var countEl = $("#count");
  var pills = $(".pills");

  var heroTrack = $(".hero-track");
  var hero = $(".hero", heroTrack);
  var heroImgs = $$(".hero-bg, .hero-cut", hero);
  var heroName = $(".hero-name", hero);
  var heroUi = $(".hero-ui", hero);
  var fallback = $(".burn-fallback", hero);

  var manTrack = $(".man-track");
  var man = $(".man", manTrack);
  var manText = $(".man-text", man);
  var slot = $(".man-slot", man);
  var media = $(".man-media", man);
  var stage = $(".stage", man);
  var wordL = $(".stage-word-l", stage);
  var wordR = $(".stage-word-r", stage);
  var cards = $$(".card", stage);
  var doors = $(".doors", man);
  var doorL = $(".door-l", doors);
  var doorR = $(".door-r", doors);
  var doorBis = [$$(".bi", doorL), $$(".bi", doorR)];
  var shades = $$(".about-shade", doors);
  var dims = $$(".door-dim", doors);
  var sys = $(".sys", man);
  var sysBgWrap = $(".sys-bgs", sys);
  var sysBgs = $$(".sys-bg", sys);
  var sysScrim = $(".sys-scrim", sys);
  var sysHead = $(".sys-head", sys);
  var glass = $(".glass", sys);
  var glassTabs = $(".glass-tabs", glass);
  var glassBody = $(".glass-body", glass);
  var tabs = $$("[role=tab]", glass);

  /* ------------------------------------------------ the manifesto words
     Split text into word spans, keep the windows in place, and carry the
     red .hot phrases through as red words. */
  function splitWords(el, hot) {
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
          var s = document.createElement("span");
          s.className = hot ? "w hot" : "w";
          s.textContent = part;
          frag.appendChild(s);
        });
        el.replaceChild(frag, n);
      } else if (n.nodeType === 1 && n.classList.contains("hot")) {
        splitWords(n, true);
        while (n.firstChild) el.insertBefore(n.firstChild, n);
        el.removeChild(n);
      } else if (n.nodeType === 1 && n.classList.contains("brand")) {
        splitWords(n, hot);   // keep the brand wrapper, split inside it
      }
    });
  }

  // letters, for the names that rise one character at a time
  function splitChars(el) {
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 1) { if (!n.classList.contains("dot")) splitChars(n); else n.classList.add("ch"); return; }
      if (n.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      Array.prototype.forEach.call(n.textContent, function (c) {
        if (c === " ") { frag.appendChild(document.createTextNode(" ")); return; }
        var s = document.createElement("span");
        s.className = "ch";
        s.textContent = c;
        frag.appendChild(s);
      });
      el.replaceChild(frag, n);
    });
    return $$(".ch", el);
  }
  splitWords(manText, false);
  // punctuation rides on the word before it, so it never wraps onto a line of
  // its own (and stays white after a red word)
  $$(".w", manText).forEach(function (w) {
    var prev = w.previousSibling;
    if (!/^[.,:;!?]+$/.test(w.textContent) || !prev || prev.nodeType !== 1 || !prev.classList.contains("w")) return;
    var pn = document.createElement("span");
    pn.className = "pn";
    pn.textContent = w.textContent;
    prev.appendChild(pn);
    manText.removeChild(w);
  });
  var items = $$(".w, .tick", manText);   // words and windows, in reading order

  /* ------------------------------------------------------------ windows
     Each window rolls its strip up one frame at a time. The last image in a
     strip repeats the first, so the loop snaps back without a visible jump. */
  function ticker(strip, delay) {
    var n = strip.children.length - 1, i = 0, next = 0;
    function set() { strip.style.transform = "translate3d(0," + (-i * 100) + "%,0)"; }
    function snap() {
      strip.style.transition = "none";
      i = 0; set();
      void strip.offsetHeight;
      strip.style.transition = "";
    }
    strip.addEventListener("transitionend", function () { if (i >= n) snap(); });
    return {
      run: function (now, on) {
        if (!on) { next = 0; return; }
        if (!next) { next = now + delay; return; }
        if (now >= next) { i++; set(); next = now + 2600; }
      }
    };
  }
  // (the opening window is not a ticker: it always shows the About photo)
  var tickers = $$(".tick .tick-strip", manText).map(function (s, k) { return ticker(s, 1350 + k * 650); });

  /* -------------------------------------------------------------- burn */
  var burn = window.createBurn
    ? window.createBurn($(".burn-tint", hero), $(".burn-core", hero))
    : null;
  if (!burn) root.classList.add("no-webgl");

  /* ------------------------------------------------------------ footer */
  var mainEl = $("main");
  var foot = $("#contact");
  var glow = window.createGlow ? window.createGlow($(".foot-glow", foot)) : null;
  var footChars = splitChars($(".wordmark", foot));
  var footTop = $(".slab-top", foot);
  var heroChars = splitChars(heroName);
  var lastIntro = -1;

  /* ------------------------------------------------------------- lenis */
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    lenis.stop();
  }

  /* ------------------------------------------------------------ layout */
  var W = window.innerWidth, H = window.innerHeight, mobile = W < 761;

  /* Put the name's baseline at Luis's eye line in the photograph, wherever
     object-fit has placed it, so his head always cuts into the letters. */
  var IMG_W = 1920, IMG_H = 1117, EYE = .345;
  function placeName() {
    var img = heroImgs[0];
    var bw = img.clientWidth, bh = img.clientHeight;
    var sc = Math.max(bw / IMG_W, bh / IMG_H);
    var pos = getComputedStyle(img).objectPosition.split(" ");
    var py = (parseFloat(pos[1]) || 50) / 100;
    var eyeY = img.offsetTop + (bh - IMG_H * sc) * py + EYE * IMG_H * sc;
    var fs = parseFloat(getComputedStyle(heroName).fontSize);
    var lh = fs * .8;
    var lines = Math.max(1, Math.round(heroName.offsetHeight / lh));
    heroName.style.top = (eyeY - (lines - 1) * lh - .73 * fs).toFixed(1) + "px";
  }

  /* The glass card is a folder: a raised tab at the top left holding the
     tabs, then the body. Drawn as a clip-path so the blur follows it. */
  function shapeGlass() {
    var w = glass.offsetWidth, h = glass.offsetHeight;
    var tw = Math.min(glassTabs.offsetWidth + 6, w), th = glassTabs.offsetHeight;
    var r = 18, f = 14;
    var d;
    if (tw > w - r * 2 - f) {
      d = "M" + r + " 0H" + (w - r) + "Q" + w + " 0 " + w + " " + r + "V" + (h - r) +
          "Q" + w + " " + h + " " + (w - r) + " " + h + "H" + r + "Q0 " + h + " 0 " + (h - r) + "V" + r + "Q0 0 " + r + " 0Z";
    } else {
      d = "M" + r + " 0H" + (tw - r) + "Q" + tw + " 0 " + tw + " " + r +
          "V" + (th - f) + "Q" + tw + " " + th + " " + (tw + f) + " " + th +
          "H" + (w - r) + "Q" + w + " " + th + " " + w + " " + (th + r) +
          "V" + (h - r) + "Q" + w + " " + h + " " + (w - r) + " " + h +
          "H" + r + "Q0 " + h + " 0 " + (h - r) + "V" + r + "Q0 0 " + r + " 0Z";
    }
    glass.style.clipPath = 'path("' + d + '")';
  }

  // the deck's resting card size
  var CW = 0, CH = 0;
  function measure() {
    W = window.innerWidth;
    H = window.innerHeight;
    mobile = W < 761;
    var r = man.getBoundingClientRect();
    root.style.setProperty("--va", (r.width / Math.max(1, r.height)).toFixed(4));
    CW = mobile ? W * .66 : Math.min(W * .32, H * .62 * 1.5);
    CH = mobile ? CW * 1.25 : CW / 1.5;
    placeName();
    shapeGlass();
    if (burn) burn.resize();
    if (glow) glow.resize();
  }
  measure();
  window.addEventListener("resize", measure);
  if (document.fonts) document.fonts.ready.then(measure);

  /* ======================================================= 0. the intro
     The black slab is cut by a notch around the nav pills, then the notch
     drops: centre column first, sides after, until the hero is clear. */
  var heroIntro = reduce ? 1 : 0;

  function holePath(a, b, hw, r) {
    var cx = W / 2, L = cx - hw, Rr = cx + hw;
    if (a < .5 && b < .5) return "";
    b = Math.max(b, a);
    var d = "M0 0H" + W + "V" + a;
    if (b - a < 1) return d + "H0Z";
    var rr = Math.max(0, Math.min(r, (b - a) / 2, hw / 2));     // tab corners
    var rf = Math.max(0, Math.min(r, (b - a) / 2, W - Rr));     // fillets into the band
    d += "H" + (Rr + rf) + "Q" + Rr + " " + a + " " + Rr + " " + (a + rf);
    d += "V" + (b - rr) + "Q" + Rr + " " + b + " " + (Rr - rr) + " " + b;
    d += "H" + (L + rr) + "Q" + L + " " + b + " " + L + " " + (b - rr);
    d += "V" + (a + rf) + "Q" + L + " " + a + " " + (L - rf) + " " + a;
    return d + "H0Z";
  }

  function notch(t, nav) {
    var a1 = nav.top + nav.height * .5;
    var b1 = nav.bottom + 30;
    var hw1 = nav.width / 2 + 42;
    var a, b, hw, r;
    if (t < .3) {
      var k = ease.outCubic(t / .3);
      a = a1 * k; b = b1 * k; hw = lerp(hw1 * .55, hw1, k); r = 22;
    } else if (t < .42) {
      a = a1; b = b1; hw = hw1; r = 22;
    } else {
      var u = (t - .42) / .58;
      b  = lerp(b1, H + 90, ease.inOutCubic(range(u, 0, .7)));
      hw = lerp(hw1, W / 2 + 90, ease.inOutCubic(range(u, .06, .86)));
      a  = lerp(a1, H + 90, ease.inOutCubic(range(u, .2, 1)));
      r  = lerp(22, 64, u);
    }
    return 'path(evenodd, "M0 0H' + W + "V" + H + "H0Z" + holePath(a, b, hw, r) + '")';
  }

  function finishIntro() {
    heroIntro = 1;
    curtain.style.display = "none";
    document.body.classList.remove("is-loading");
    if (lenis) lenis.start();
  }

  function openCurtain() {
    var nav = pills.getBoundingClientRect();
    // ?slow plays the reveal at a fifth of the speed, for tuning the notch
    var D = 2100 * (/[?&]slow\b/.test(location.search) ? 5 : 1), t0 = performance.now();
    var decoded = false;
    (function step(now) {
      var t = clamp((now - t0) / D, 0, 1);
      curtain.style.clipPath = notch(t, nav);
      heroIntro = ease.outCubic(range(t, .45, 1));
      // the hero's small labels decode as they fade in
      if (!decoded && t > .6) { decoded = true; $$("p", heroUi).forEach(function (p) { scramble(p); }); }
      if (t < 1) requestAnimationFrame(step); else finishIntro();
    })(t0);
  }

  (function intro() {
    var decoded = Promise.all(heroImgs.map(function (im) {
      return im.decode ? im.decode().catch(function () {}) : Promise.resolve();
    }));
    var fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    var ready = false;
    Promise.all([decoded, fonts]).then(function () { ready = true; });
    setTimeout(function () { ready = true; }, 4000);

    if (reduce) { decoded.then(finishIntro); return; }
    var start = performance.now(), minT = 1150;
    (function tick(now) {
      var k = clamp((now - start) / minT, 0, 1);
      var shown = ready ? k : Math.min(k, .86);
      countEl.textContent = ("00" + Math.round(ease.outCubic(shown) * 100)).slice(-3);
      if (ready && k >= 1) { setTimeout(openCurtain, 180); return; }
      requestAnimationFrame(tick);
    })(start);
  })();

  /* ================================================== the glass card tabs */
  var SYSTEMS = [   // from data/stories.js; pieces and formats counted from the files
    { title: "Ads, retail and video", year: "2025-2026", pieces: 38, formats: 9,
      line: "An immunity campaign for a Canadian juice brand, from paid social to the grocery store cooler.",
      href: "../case.html?story=greenhouse",
      list: ["Paid social and display", "Shoppable and banner video", "Free-standing retail displays", "Cooler wraps and shelf blades", "Print dielines"] },
    { title: "AI product photos", year: "2026", pieces: 15, formats: 4,
      line: "Fifteen AI-made images for a gut-health powder that had no photo library yet.",
      href: "../case.html?story=gut1",
      list: ["Studio product imagery", "Texture and ingredient shots", "Packaging-format concepts", "Lifestyle scenes", "Atmospheric brand imagery", "One-palette art direction"] },
    { title: "Rebrand and website", year: "2026", pieces: 10, formats: 8,
      line: "A new logo, colors, website, emails and brand film for a private lender in North Miami.",
      href: "../case.html?story=sky18",
      list: ["Logotype and mark", "Colour and type system", "Website design", "Email newsletter and signature", "LinkedIn graphics", "Brand film"] }
  ];
  var active = 0, swapTimer = 0;
  function field(name) { return $('[data-f="' + name + '"]', glass); }
  var setPieces = makeOdo(field("pieces"), 2);
  var glassKicker = $(".glass-kicker", glass);
  var glassSub = $(".glass-sub", glass);
  function selectSystem(i, instant) {
    if (i === active && !instant) return;
    active = i;
    tabs.forEach(function (t, k) {
      t.setAttribute("aria-selected", k === i ? "true" : "false");
      t.tabIndex = k === i ? 0 : -1;
    });
    sysBgs.forEach(function (b, k) { b.classList.toggle("is-on", k === i); });
    var s = SYSTEMS[i];
    setPieces(s.pieces);   // the number rolls straight away, digit by digit
    function fill() {
      field("title").textContent = s.title;
      field("year").textContent = s.year;
      field("formats").textContent = s.formats;
      field("line").textContent = s.line;
      field("href").setAttribute("href", s.href);
      // the list is re-dealt, one line after another
      var list = field("list");
      list.innerHTML = s.list.map(function (x, k) { return '<li style="--i:' + k + '">' + x + "</li>"; }).join("");
      list.classList.remove("is-in");
      void list.offsetWidth;
      list.classList.add("is-in");
      // and the small labels decode
      glassKicker._fin = null;
      glassSub._fin = null;
      if (!instant) { scramble(glassKicker); scramble(glassSub); }
      glassBody.classList.remove("is-swapping");
      shapeGlass();   // the list length changes the card's height
    }
    clearTimeout(swapTimer);
    if (instant || reduce) { fill(); return; }
    glassBody.classList.add("is-swapping");
    swapTimer = setTimeout(fill, 220);
  }
  tabs.forEach(function (t, k) {
    t.addEventListener("click", function () { selectSystem(k); });
    t.addEventListener("keydown", function (ev) {
      var d = ev.key === "ArrowRight" ? 1 : ev.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      ev.preventDefault();
      var k2 = (active + d + tabs.length) % tabs.length;
      selectSystem(k2);
      tabs[k2].focus();
    });
  });
  selectSystem(0, true);

  /* =============================================================== loop */
  // The story, in vh of scroll after the pin starts. The track is 1100vh,
  // so the pin runs 1000vh; the last 100 are the Brands sheet sliding over.
  var T = {
    cover:  [900, 1000],   // Brands & results slides up over the story
    expand: [30, 150],     // opening window grows into the About photo
    about:  [158, 250],    // About copy rises out of a blur
    doors:  [275, 385],    // About splits and swings open
    deckIn: [300, 400],    // the deck rises onto the white stage
    words:  [365, 425],    // PRODUCTION / SYSTEMS slide in
    flips:  [440, 660],    // the deck is flipped through
    final:  [670, 780],    // the last card fills the screen
    sys:    [790, 850]     // title and glass card
  };

  function trackProgress(rect) {
    return clamp(-rect.top / Math.max(1, rect.height - H), 0, 1);
  }

  function frame(now) {
    if (lenis) lenis.raf(now);
    var time = reduce ? 0 : now / 1000;

    // the shared pointer, eased so everything that follows it glides
    if (fine && ptr.seen && !reduce) {
      ptr.sx += ((ptr.x / W) * 2 - 1 - ptr.sx) * .06;
      ptr.sy += ((ptr.y / H) * 2 - 1 - ptr.sy) * .06;
    }
    pillsFrame();

    /* ---- 1. hero + burn */
    var hr = heroTrack.getBoundingClientRect();
    if (hr.bottom > 0 && hr.top < H) {
      var p = trackProgress(hr);
      var bp = clamp(p * 1.06, 0, 1);
      var s = lerp(1.07, 1, heroIntro) * (1 + p * .05);
      // depth with the mouse: the photo (and Luis in it) one way, the name
      // behind him the other — so the letters slide behind his head
      var hx = ptr.sx, hy = ptr.sy;
      for (var i = 0; i < heroImgs.length; i++) {
        heroImgs[i].style.transform = "translate3d(" + (-hx * 10).toFixed(2) + "px," + (-hy * 6).toFixed(2) + "px,0) scale(" + s.toFixed(4) + ")";
      }
      heroName.style.transform = "translate3d(" + (hx * 18).toFixed(2) + "px,calc(" + ((1 - heroIntro) * 3 - p * 5).toFixed(3) + "vh + " + (hy * 8).toFixed(2) + "px),0)";
      // the letters rise one after another as the curtain opens
      if (heroIntro !== lastIntro) {
        lastIntro = heroIntro;
        for (var c = 0; c < heroChars.length; c++) {
          var f = c / heroChars.length;
          var kc = ease.outCubic(range(heroIntro, f * .55, .45 + f * .55));
          heroChars[c].style.opacity = kc.toFixed(3);
          heroChars[c].style.transform = "translate3d(0," + ((1 - kc) * 60).toFixed(1) + "%,0)";
        }
      }
      heroUi.style.opacity = (heroIntro * (1 - range(p, .02, .14))).toFixed(3);
      if (burn) burn.render(bp, time, hx);   // the idle fire leans toward the cursor
      else fallback.style.setProperty("--r", (30 + bp * 260).toFixed(1));
    }

    /* ---- 2. the story */
    var mr = manTrack.getBoundingClientRect();
    if (mr.bottom > 0 && mr.top < H) story(mr, now);

    /* ---- 3. brands & results */
    var br = brands.getBoundingClientRect();
    if (br.top < H && br.bottom > 0) brandsFrame(now);
    peekFrame();

    /* ---- 4. experience */
    var er = exp.getBoundingClientRect();
    if (er.top < H && er.bottom > 0) expFrame();

    /* ---- 5. the footer, uncovered as the page slides off it */
    var rp = clamp((H - mainEl.getBoundingClientRect().bottom) / H, 0, 1);
    if (rp > 0) footFrame(rp, time);

    requestAnimationFrame(frame);
  }

  /* the nav pills are magnetic: near the cursor they drift toward it, and
     their label drifts a little further, then settle back when it leaves */
  var pillEls = $$(".pill");
  var pillPos = pillEls.map(function () { return { x: 0, y: 0 }; });
  function pillsFrame() {
    if (!fine || reduce) return;
    for (var i = 0; i < pillEls.length; i++) {
      var el = pillEls[i], st = pillPos[i];
      var r = el.getBoundingClientRect();
      var cx = r.left + r.width / 2 - st.x, cy = r.top + r.height / 2 - st.y;
      var dx = ptr.x - cx, dy = ptr.y - cy;
      var near = Math.abs(dx) < r.width / 2 + 34 && Math.abs(dy) < r.height / 2 + 30;
      var tx = near ? clamp(dx * .28, -12, 12) : 0, ty = near ? clamp(dy * .38, -8, 8) : 0;
      st.x += (tx - st.x) * .16;
      st.y += (ty - st.y) * .16;
      if (Math.abs(st.x) < .01 && Math.abs(st.y) < .01 && !near) { el.style.transform = ""; continue; }
      el.style.transform = "translate3d(" + st.x.toFixed(2) + "px," + st.y.toFixed(2) + "px,0)";
    }
  }

  function footFrame(rp, time) {
    if (glow) glow.render(.02 + rp * .1, time, ptr.sx);   // the embers lean toward the cursor too
    footTop.style.opacity = range(rp, .2, .6).toFixed(3);
    for (var i = 0; i < footChars.length; i++) {
      var k = reduce ? (rp > .3 ? 1 : 0) : ease.outCubic(range(rp, .3 + i * .035, .72 + i * .035));
      footChars[i].style.transform = "translate3d(0," + ((1 - k) * 105).toFixed(1) + "%,0)";
    }
  }

  /* ========================================================= experience
     The role nearest the middle of the screen is the one in focus; the
     year beside the list rolls to its start, digit by digit. */
  var exp = $(".exp");
  var roles = $$(".role", exp);
  var rolesList = $(".roles", exp);
  var odo = $(".odo", exp);
  var expRange = $(".exp-range", exp);
  var expEnv = $(".exp-env", exp);
  var setYear = makeOdo(odo, 4);
  roles.forEach(function (r) { r.classList.add("rv"); });
  if (reduce || !window.IntersectionObserver) roles.forEach(function (r) { r.classList.add("is-in"); });
  else {
    var roleIo = new IntersectionObserver(function (rows) {
      rows.forEach(function (r) {
        if (r.isIntersecting) { r.target.classList.add("is-in"); roleIo.unobserve(r.target); }
      });
    }, { threshold: .2 });
    roles.forEach(function (r) { roleIo.observe(r); });
  }

  var activeRole = -1;
  function expFrame() {
    var best = -1, bestD = Infinity, mid = H * .45;
    for (var i = 0; i < roles.length; i++) {
      var r = roles[i].getBoundingClientRect();
      var dd = Math.abs((r.top + r.bottom) / 2 - mid);
      if (dd < bestD) { bestD = dd; best = i; }
    }
    if (best === activeRole) return;
    if (activeRole >= 0) roles[activeRole].classList.remove("is-active");
    activeRole = best;
    var el = roles[best];
    el.classList.add("is-active");
    rolesList.classList.add("has-active");
    setYear(el.getAttribute("data-start"));
    scramble(expRange, el.getAttribute("data-range"));
    scramble(expEnv, el.getAttribute("data-env"));
  }

  /* ============================================================== peek
     Hovering a brand shows a window of its work that trails the cursor and
     leans into the movement. Only where there is a real pointer. */
  var peek = $(".peek");
  var canPeek = !reduce && window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var mx = 0, my = 0, px = 0, py = 0, pOn = false, pScale = .6, pSrc = "";
  function peekImg(src) {
    if (src === pSrc) return;
    var first = !pSrc || !pOn;
    pSrc = src;
    var img = new Image();
    img.alt = "";
    img.src = src;
    var olds = $$("img", peek);
    if (first) {
      olds.forEach(function (o) { o.remove(); });
      peek.appendChild(img);
      return;
    }
    img.style.transform = "translate3d(0,100%,0)";
    peek.appendChild(img);
    void img.offsetHeight;
    img.style.transform = "translate3d(0,0,0)";
    olds.forEach(function (o) {
      o.style.transform = "translate3d(0,-100%,0)";
      setTimeout(function () { o.remove(); }, 800);
    });
  }
  function initPeek() {   // called at the end, once the brand list exists
    if (!canPeek) return;
    brandList.addEventListener("pointermove", function (ev) {
      mx = ev.clientX; my = ev.clientY;
      var b = ev.target.closest(".brand");
      if (b) {
        if (!pOn) { px = mx; py = my; }
        peekImg(b.getAttribute("data-img"));
        pOn = true;
      } else {
        pOn = false;
      }
      peek.classList.toggle("is-on", pOn);
    });
    brandList.addEventListener("pointerleave", function () { pOn = false; peek.classList.remove("is-on"); });
    window.addEventListener("scroll", function () { if (pOn) { pOn = false; peek.classList.remove("is-on"); } }, { passive: true });
  }
  function peekFrame() {
    if (!canPeek) return;
    var vx = mx - px;
    px += vx * .14;
    py += (my - py) * .14;
    pScale += ((pOn ? 1 : .6) - pScale) * .14;
    var rot = clamp(vx * .08, -12, 12);
    peek.style.transform = "translate3d(" + (px - 120).toFixed(1) + "px," + (py - 176 - 26).toFixed(1) + "px,0) rotate(" +
      rot.toFixed(2) + "deg) scale(" + pScale.toFixed(3) + ")";
  }

  /* ================================================== brands & results */
  var brands = $(".brands");
  var nums = $$(".num", brands);
  var statsEl = $(".tally", brands);
  // reserve each number's final width so the sentence never reflows while counting
  nums.forEach(function (n) { n.style.minWidth = n.getAttribute("data-to").length + "ch"; });
  var brandList = $(".brand-list", brands);
  splitWords(brandList, false);
  var brandWords = $$(".w", brandList);
  brandWords.forEach(function (w) { if (w.textContent === "/") w.classList.add("slash"); });
  var countStart = 0, lit = -1;

  // headings and the stats row rise out of a blur when they arrive
  var rvs = $$(".rv");
  if (reduce || !window.IntersectionObserver) {
    rvs.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (rows) {
      rows.forEach(function (r) {
        if (!r.isIntersecting) return;
        r.target.classList.add("is-in");
        io.unobserve(r.target);
        // mono labels decode as they arrive
        if (r.target.classList.contains("scr")) scramble(r.target);
        $$(".scr", r.target).forEach(function (el) { scramble(el); });
      });
    }, { threshold: .25 });
    rvs.forEach(function (el) { io.observe(el); });
  }

  function brandsFrame(now) {
    // the numbers count up once, the first time the row is in view
    var sr = statsEl.getBoundingClientRect();
    if (!countStart && sr.top < H * .85) countStart = now;
    if (countStart) {
      var k = reduce ? 1 : clamp((now - countStart) / 1900, 0, 1);
      var ek = k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
      for (var i = 0; i < nums.length; i++) {
        nums[i].textContent = Math.round(+nums[i].getAttribute("data-to") * ek);
      }
    }
    // the brand names fill in from grey to ink as the list scrolls past
    var lr = brandList.getBoundingClientRect();
    var p = clamp((H * .85 - lr.top) / (lr.height + H * .2), 0, 1);
    var on = reduce ? brandWords.length : Math.round(p * brandWords.length);
    if (on !== lit) {
      for (var j = 0; j < brandWords.length; j++) brandWords[j].classList.toggle("on", j < on);
      lit = on;
    }
  }

  /* ============================================================== menu
     The menu pours out of the notch around the pills: the same T-shaped
     path the intro opens with, filled instead of cut. */
  var menu = $("#menu");
  var menuBtn = $(".pill-menu");
  var menuLinks = $$(".menu-links a", menu);
  var menuSide = $(".menu-side", menu);
  var menuT = 0, menuOpen = false, menuRaf = 0, afterClose = null;

  function menuShape(t) {
    var nav = pills.getBoundingClientRect();
    var hw0 = nav.width / 2 + 42;
    var b  = lerp(0, H + 90, ease.inOutCubic(range(t, 0, .7)));
    var hw = lerp(hw0 * .6, W / 2 + 90, ease.inOutCubic(range(t, .06, .86)));
    var a  = lerp(0, H + 90, ease.inOutCubic(range(t, .2, 1)));
    var d = holePath(a, b, hw, lerp(22, 64, t));
    return 'path("' + (d || "M0 0Z") + '")';
  }

  function paintMenu() {
    menu.style.clipPath = menuShape(menuT);
    for (var i = 0; i < menuLinks.length; i++) {
      var k = reduce ? (menuT > .5 ? 1 : 0) : ease.outCubic(range(menuT, .45 + i * .07, .8 + i * .07));
      var st = menuLinks[i].style;
      st.opacity = k.toFixed(3);
      st.filter = reduce ? "" : "blur(" + ((1 - k) * 10).toFixed(2) + "px)";
      st.transform = reduce ? "" : "translate3d(0," + ((1 - k) * 40).toFixed(1) + "%,0)";
    }
    menuSide.style.opacity = range(menuT, .7, 1).toFixed(3);
  }

  function animateMenu(to) {
    cancelAnimationFrame(menuRaf);
    var from = menuT, D = (to ? 950 : 750) * Math.abs(to - from), t0 = performance.now();
    if (reduce) D = 1;
    (function step(now) {
      var k = clamp((now - t0) / Math.max(1, D), 0, 1);
      menuT = lerp(from, to, k);
      paintMenu();
      if (k < 1) { menuRaf = requestAnimationFrame(step); return; }
      if (to === 1) { menuLinks[0].focus({ preventScroll: true }); }
      else {
        menu.classList.remove("is-open");
        if (lenis) lenis.start();
        if (afterClose) { var f = afterClose; afterClose = null; f(); }
      }
    })(t0);
  }

  function openMenu() {
    if (document.body.classList.contains("is-loading")) return;
    menuOpen = true;
    menuBtn.setAttribute("aria-expanded", "true");
    menu.classList.add("is-open");
    if (lenis) lenis.stop();
    animateMenu(1);
    setTimeout(function () { if (menuOpen) $$("p", menuSide).forEach(function (p) { scramble(p); }); }, reduce ? 0 : 520);
  }
  function closeMenu(then) {
    if (!menuOpen) { if (then) then(); return; }
    menuOpen = false;
    afterClose = then || null;
    menuBtn.setAttribute("aria-expanded", "false");
    animateMenu(0);
    if (!then) menuBtn.focus({ preventScroll: true });
  }
  menuBtn.addEventListener("click", function () { menuOpen ? closeMenu() : openMenu(); });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && menuOpen) closeMenu(); });

  /* ======================================================== navigation
     Links that name a place in the story scroll there smoothly, through
     the animations, instead of jumping. */
  var footer = $("#contact");
  function targetY(name) {
    var top = manTrack.offsetTop;
    if (name === "top") return 0;
    if (name === "about") return top + 2.55 * H;
    if (name === "work") return top + 4.36 * H;   // the deck at rest, words in
    if (name === "brands") return brands.offsetTop;
    if (name === "experience") return exp.offsetTop;
    if (name === "contact") return document.documentElement.scrollHeight - H;   // the very end: footer uncovered
    return 0;
  }
  function go(name) {
    var y = targetY(name);
    if (lenis) lenis.scrollTo(y, { duration: 2.4 });
    else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest("[data-go]");
    if (!a || document.body.classList.contains("is-loading")) return;
    ev.preventDefault();
    var name = a.getAttribute("data-go");
    closeMenu(function () { go(name); });
  });

  function story(mr, now) {
    var v = Math.max(0, -mr.top) / H * 100;
    var enter = clamp(1 - mr.top / H, 0, 1);

    /* manifesto: words and windows rise out of a blur as the section
       arrives, then slide away as the opening window grows */
    var e = range(v, T.expand[0], T.expand[1]);
    var ee = R(ease.inOutQuart(e));
    var n = items.length;
    if (e < 1) {
      for (var j = 0; j < n; j++) {
        var k = reduce ? 1 : ease.outCubic(range(enter, .35 + (j / n) * .45, .55 + (j / n) * .45));
        var w = items[j].style;
        w.opacity = (k * (1 - ee * 1.3)).toFixed(3);
        w.filter = reduce ? "" : "blur(" + ((1 - k) * 8 + ee * 6).toFixed(2) + "px)";
        w.transform = reduce ? "" : "translate3d(" + (ee * 22).toFixed(2) + "vw," + ((1 - k) * .35).toFixed(3) + "em,0)";
      }
    }

    // windows roll while the manifesto is being read
    var rolling = !reduce && enter > .7 && e === 0;
    for (var t = 0; t < tickers.length; t++) tickers[t].run(now, rolling);

    // the opening window is the full-screen photo scaled down onto its slot
    if (e < 1) {
      var cr = man.getBoundingClientRect(), sr = slot.getBoundingClientRect();
      var s0 = sr.width / Math.max(1, cr.width);
      var sc = lerp(s0, 1, ee);
      media.style.transform = "translate3d(" + lerp(sr.left - cr.left, 0, ee).toFixed(2) + "px," +
        lerp(sr.top - cr.top, 0, ee).toFixed(2) + "px,0) scale(" + sc.toFixed(5) + ")";
      media.style.borderRadius = (lerp(6, 0, ee) / sc).toFixed(2) + "px";
      media.style.opacity = (reduce ? 1 : ease.outCubic(range(enter, .3, .55))).toFixed(3);
      media.style.visibility = "visible";
    } else {
      media.style.visibility = "hidden";
    }

    /* About: once the window is full screen the doors take over, showing
       exactly the same picture, and the copy rises out of a blur */
    var a = range(v, T.about[0], T.about[1]);
    man.style.setProperty("--iz", (1.1 - .1 * ee + .05 * a).toFixed(4));
    var dp = R(ease.inOutCubic(range(v, T.doors[0], T.doors[1])));
    doors.classList.toggle("is-on", e >= 1 && dp < 1);
    if (e >= 1 && dp < 1) {
      var sh = range(a, 0, .45).toFixed(3);
      shades[0].style.opacity = sh;
      shades[1].style.opacity = sh;
      for (var d = 0; d < 2; d++) {
        var list = doorBis[d];
        for (var b = 0; b < list.length; b++) {
          var kb = ease.outCubic(range(a, b * .1, b * .1 + .42));
          var st = list[b].style;
          st.opacity = kb.toFixed(3);
          st.filter = reduce ? "" : "blur(" + ((1 - kb) * 12).toFixed(2) + "px)";
          st.transform = reduce ? "" : "translate3d(0," + ((1 - kb) * 22).toFixed(2) + "px,0)";
        }
      }
      // the two halves swing away from the middle
      var sw = dp * 64, push = dp * 34;
      doorL.style.transform = "perspective(1600px) translate3d(" + (-push).toFixed(2) + "vw,0,0) rotateY(" + sw.toFixed(2) + "deg)";
      doorR.style.transform = "perspective(1600px) translate3d(" + push.toFixed(2) + "vw,0,0) rotateY(" + (-sw).toFixed(2) + "deg)";
      dims[0].style.opacity = dims[1].style.opacity = (dp * .6).toFixed(3);
    }

    /* the white stage and its deck */
    var fin = R(ease.inOutCubic(range(v, T.final[0], T.final[1])));
    var stageOn = v >= T.doors[0] && fin < 1;
    stage.classList.toggle("is-on", stageOn);
    if (stageOn) deck(v, fin);

    /* the systems: the last card has become this full-screen image */
    var sysOn = fin >= 1;
    sys.classList.toggle("is-on", sysOn);
    if (!sysOn && active !== 0) selectSystem(0, true);   // so the hand-off always matches
    if (sysOn) {
      var sp = R(ease.outCubic(range(v, T.sys[0], T.sys[1])));
      sysScrim.style.opacity = sp.toFixed(3);
      sysBgWrap.style.filter = sp > 0 ? "brightness(" + (1 - .28 * sp).toFixed(3) + ")" : "";
      sysHead.style.opacity = sp.toFixed(3);
      sysHead.style.filter = reduce ? "" : "blur(" + ((1 - sp) * 10).toFixed(2) + "px)";
      sysHead.style.transform = "translate3d(0," + ((1 - sp) * 30).toFixed(2) + "px,0)";
      var gp = R(ease.outCubic(range(v, T.sys[0] + 12, T.sys[1] + 12)));
      glass.style.opacity = gp.toFixed(3);
      glass.style.transform = "translate3d(-50%," + ((1 - gp) * 80).toFixed(2) + "px,0)";
      glass.classList.toggle("is-live", gp > .9);
    }

    // the next sheet slides over: the story sinks back and dims under it
    var cov = range(v, T.cover[0], T.cover[1]);
    man.style.transform = cov > 0 ? "scale(" + (1 - .06 * cov).toFixed(4) + ")" : "";
    man.style.filter = cov > 0 ? "brightness(" + (1 - .5 * cov).toFixed(3) + ")" : "";
  }

  /* The deck: cards sit in a tilted stack between the two words. Scrolling
     throws the top card up and away, the next one settles, and the last
     card straightens and grows until it is the whole screen. */
  function deck(v, fin) {
    var N = cards.length;
    var din = range(v, T.deckIn[0], T.deckIn[1]);
    var cl = range(v, T.flips[0], T.flips[1]) * (N - 1);
    var base = Math.floor(cl), frac = cl - base;
    var c = reduce ? Math.round(cl) : base + ease.inOutCubic(frac);
    var cy = mobile ? -H * .02 : H * .03;

    for (var i = 0; i < N; i++) {
      var dd = i - c;
      var x = 0, y = cy, z = 0, rx = 7, ry = -16, rz = 0, op = 1;
      if (dd >= 0) {                       // waiting in the stack
        var dep = Math.min(dd, 3);
        y += dep * H * .022;
        z = -dep * 60;
        rz = (i % 2 ? 1 : -1) * dep * 2.4;
        op = dd > 3 ? 0 : 1;
      } else {                             // thrown up and away
        var f = clamp(-dd, 0, 1);
        y -= f * H * .9;
        x -= f * W * .14;
        rz = -f * 18;
        ry = -16 + f * 46;
        rx = 7 + f * 26;
        op = 1 - range(f, .55, 1);
      }
      // the stack rises in, deepest card first
      var rise = ease.outCubic(range(din, (N - 1 - i) * .07, .62 + (N - 1 - i) * .07));
      y += (1 - rise) * H * .95;
      ry -= (1 - rise) * 18;
      if (rise <= 0) op = 0;

      // the card on top leans toward the cursor while it rests
      var lean = (fine && !reduce) ? clamp(1 - Math.abs(dd) / .6, 0, 1) * (1 - fin) : 0;
      ry += ptr.sx * 14 * lean;
      rx -= ptr.sy * 10 * lean;

      var cw = CW, ch = CH;
      if (i === N - 1) {                   // the last card becomes the screen
        x = lerp(x, 0, fin); y = lerp(y, 0, fin); z = lerp(z, 0, fin);
        rx = lerp(rx, 0, fin); ry = lerp(ry, 0, fin); rz = lerp(rz, 0, fin);
        cw = lerp(CW, W, fin); ch = lerp(CH, H, fin);
      }
      var st = cards[i].style;
      st.width = cw.toFixed(1) + "px";
      st.height = ch.toFixed(1) + "px";
      st.transform = "translate(-50%,-50%) perspective(1300px) translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px," +
        z.toFixed(1) + "px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) rotateZ(" + rz.toFixed(2) + "deg)";
      st.borderRadius = (i === N - 1 ? lerp(10, 0, fin) : 10).toFixed(1) + "px";
      st.opacity = op.toFixed(3);
      st.zIndex = String(N - i);
    }

    // THE WORK [card] I'M CREATING, pushed off as the card takes the screen
    var wi = R(ease.outCubic(range(v, T.words[0], T.words[1])));
    var gap = mobile ? 18 : W * .022;
    var off = (1 - wi) * (mobile ? 30 : 60), out = fin * W * .55, wop = (wi * (1 - fin * 1.6)).toFixed(3);
    if (mobile) {
      wordL.style.left = wordR.style.left = "50%";
      wordL.style.right = wordR.style.right = "auto";
      wordL.style.top = (H / 2 + cy - CH / 2 - gap) + "px";
      wordR.style.top = (H / 2 + cy + CH / 2 + gap + H * .07) + "px";   // clear the stack's lower edges
      wordL.style.transform = "translate3d(-50%," + (-100 - off).toFixed(1) + "%,0) translateY(" + (-out * .3).toFixed(1) + "px)";
      wordR.style.transform = "translate3d(-50%," + off.toFixed(1) + "%,0) translateY(" + (out * .3).toFixed(1) + "px)";
    } else {
      wordL.style.left = "auto";
      wordL.style.right = (W / 2 + CW / 2 + gap).toFixed(1) + "px";
      wordR.style.right = "auto";
      wordR.style.left = (W / 2 + CW / 2 + gap).toFixed(1) + "px";
      wordL.style.top = wordR.style.top = (H / 2 + cy) + "px";
      wordL.style.transform = "translate3d(" + (-off - out).toFixed(1) + "px,-50%,0)";
      wordR.style.transform = "translate3d(" + (off + out).toFixed(1) + "px,-50%,0)";
    }
    wordL.style.opacity = wordR.style.opacity = wop;
  }

  initPeek();
  requestAnimationFrame(frame);
})();
