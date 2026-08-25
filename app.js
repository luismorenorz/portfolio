/* =========================================================================
   Luis Moreno — The Living Portfolio

   Six chapters: a living cover built from real work, three selected stories,
   a sticky discipline reel, the archive in three views, an about manifesto
   and a contact stage.

   No dependencies. Works from file:// and from a GitHub Pages subpath.
   Motion rule throughout: animate transform and clip-path, never opacity on
   anything that carries content, so a throttled or frozen animation clock can
   never hide the work.
   ========================================================================= */

(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var TAG_FILTER_MIN = 3;
  var CURATED_COUNT = 12;
  var GRID_PAGE = 24;

  var state = { cat: null, tags: [], q: "", view: "curated", shown: GRID_PAGE };

  /* The curated twelve: one pass across every discipline, balanced between
     wide renders, tall email, square social and motion. Order matters — the
     grid gives positions 1, 2, 8 and 12 the most room. */
  var CURATED = [
    "greenhouse-dtd-displays", "cafe-cafe", "rove-campaigns", "spartan-watch-bands",
    "gh-campaign-video", "cosmedica-social", "carevio", "pkg-vibrance",
    "generac-ai-film", "deck-trace-ai", "greenhouse-fridge", "zillow-rentals-motion"
  ];

  function curatedList() {
    var out = [];
    CURATED.forEach(function (id) {
      var p = PROJECTS.filter(function (x) { return x.id === id; })[0];
      if (p) out.push(p);
    });
    // if an id ever goes missing, top the selection back up in file order
    PROJECTS.forEach(function (p) {
      if (out.length < CURATED_COUNT && out.indexOf(p) === -1) out.push(p);
    });
    return out.slice(0, CURATED_COUNT);
  }

  /* the cover composition: four real pieces at four scales */
  var COVER = [
    { cls: "p1", key: "171-31",  kind: "image" },                                        // Greenhouse retail
    { cls: "p2", key: "2-10",    kind: "image" },                                        // Rove email, tall
    { cls: "p3", key: "3-17-10", kind: "image" },                                        // Café Café shopfront
    { cls: "p4", key: "20251112-gh-dtd-hdvideobanner-b-1080x1920-v2", kind: "poster" }   // motion frame
  ];

  /* one background per discipline, always from a project in that discipline */
  var REEL_IMAGE = {
    "Email":         { key: "2-10",    kind: "image" },
    "Advertising":   { key: "156-100", kind: "image" },
    "Motion":        { key: "hero-1",  kind: "poster" },
    "Social":        { key: "18-10",   kind: "image" },
    "Retail":        { key: "171-31",  kind: "image" },
    "Packaging":     { key: "156-40",  kind: "image" },
    "Web & UI":      { key: "3-41",    kind: "image" },
    "Branding":      { key: "3-17-03", kind: "image" },
    "Presentations": { key: "213-33",  kind: "image" }
  };
  /* AI stays a filter and a capability, without a stage of its own */
  var REEL_ORDER = ["Email", "Advertising", "Motion", "Social", "Retail", "Packaging", "Web & UI", "Branding", "Presentations"];

  /* ------------------------------ helpers ------------------------------- */

  function thumbSrc(k) { return "assets/thumb/" + k + ".webp"; }
  function fullSrc(k) { return "assets/full/" + k + ".webp"; }
  function posterSrc(k) { return "assets/poster/" + k + ".webp"; }
  function videoSrc(k) { return "assets/video/" + k + ".mp4"; }
  function previewSrc(k) { return "assets/preview/" + k + ".mp4"; }
  function vmeta(k) { return (typeof VIDEOS !== "undefined" && VIDEOS[k]) || null; }
  function dims(k) { return IMAGES[k] || null; }

  function srcOf(spec, big) {
    if (spec.kind === "poster") return posterSrc(spec.key);
    return big ? fullSrc(spec.key) : thumbSrc(spec.key);
  }

  function clock(s) {
    var n = Math.round(s || 0);
    return Math.floor(n / 60) + ":" + (n % 60 < 10 ? "0" : "") + (n % 60);
  }

  function prefersReduced() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function hasMotion(p) { return !!(p.videos && p.videos.length); }
  function pieceCount(p) { return (p.images ? p.images.length : 0) + (p.videos ? p.videos.length : 0); }

  function coverKey(p) {
    if (p.images && p.images.length) return { key: p.images[0], kind: "image" };
    if (hasMotion(p)) return { key: p.videos[0], kind: "poster" };
    return null;
  }

  function altFor(p, i) {
    var n = pieceCount(p);
    return p.client + ", " + p.title + (n > 1 ? " (" + (i + 1) + " of " + n + ")" : "");
  }

  function slugify(s) {
    return s.toLowerCase().replace(/&/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function catFromSlug(slug) {
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (slugify(CATEGORIES[i]) === slug) return CATEGORIES[i];
    }
    return null;
  }
  function categoryCounts() {
    var c = {};
    PROJECTS.forEach(function (p) { c[p.category] = (c[p.category] || 0) + 1; });
    return c;
  }
  function storyFor(id) {
    for (var i = 0; i < STORIES.length; i++) {
      if (STORIES[i].projects.indexOf(id) !== -1) return STORIES[i];
    }
    return null;
  }

  function matches(p) {
    if (state.cat && p.category !== state.cat) return false;
    for (var i = 0; i < state.tags.length; i++) {
      if (p.tags.indexOf(state.tags[i]) === -1) return false;
    }
    if (state.q) {
      var hay = (p.title + " " + p.client + " " + p.category + " " + p.tags.join(" ") + " " + p.summary).toLowerCase();
      var words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      for (var j = 0; j < words.length; j++) if (hay.indexOf(words[j]) === -1) return false;
    }
    return true;
  }
  function visibleProjects() { return PROJECTS.filter(matches); }

  /* --------------------------- reveal on scroll -------------------------- */

  // Elements start visible; JS arms the hidden state and an observer disarms
  // it. A sweep clears anything the observer missed, so nothing can stay down.
  function armReveals() {
    var items = $$(".reveal").map(function (el) { return el.parentNode; });
    if (prefersReduced() || !window.IntersectionObserver) return;
    items.forEach(function (el) { el.classList.add("is-armed"); });
    var io = new IntersectionObserver(function (rows) {
      rows.forEach(function (r) {
        if (r.isIntersecting) { r.target.classList.remove("is-armed"); io.unobserve(r.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    items.forEach(function (el) { io.observe(el); });
    setTimeout(function () { items.forEach(function (el) { el.classList.remove("is-armed"); }); }, 2400);
  }

  /* --------------------------- 1. living cover --------------------------- */

  function buildCover() {
    var stack = $(".cover-stack");
    COVER.forEach(function (spec) {
      var d = document.createElement("div");
      d.className = "cover-piece " + spec.cls;
      var img = document.createElement("img");
      img.src = srcOf(spec, false);
      img.alt = "";
      img.decoding = "async";
      img.fetchPriority = spec.cls === "p1" ? "high" : "auto";
      d.appendChild(img);
      stack.appendChild(d);
    });
    parallax();
  }

  // 10–20px of drift, read on a throttled timer rather than on every event
  function parallax() {
    if (prefersReduced()) return;
    var pieces = $$(".cover-piece");
    if (!pieces.length) return;
    var depth = [16, -12, 20, -18];
    var cover = $(".cover");
    var ticking = false;

    function update() {
      ticking = false;
      var r = cover.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      var t = Math.max(-1, Math.min(1, -r.top / window.innerHeight));
      pieces.forEach(function (el, i) {
        el.style.transform = "translate3d(0," + (t * (depth[i] || 12)).toFixed(1) + "px,0)";
      });
    }
    function onScroll() { if (ticking) return; ticking = true; setTimeout(update, 16); }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ------------------------- 2. selected stories ------------------------- */

  var STORY_SHAPE = ["story-full", "story-split", "story-stack"];

  function buildStories() {
    var wrap = $(".stories-list");

    STORIES.forEach(function (s, i) {
      var shape = STORY_SHAPE[i % STORY_SHAPE.length];
      var sec = document.createElement("article");
      sec.className = "story " + shape;

      var inner = document.createElement("div");
      inner.className = "story-inner";

      var meta = document.createElement("p");
      meta.className = "story-meta";
      [["num", "Story " + s.number], ["", s.disciplines.join(", ")], ["", s.year]]
        .forEach(function (pair) {
          var sp = document.createElement("span");
          if (pair[0]) sp.className = pair[0];
          sp.textContent = pair[1];
          meta.appendChild(sp);
        });

      var h3 = document.createElement("h3");
      h3.className = "story-title";
      var c = document.createElement("span"); c.className = "client"; c.textContent = s.client;
      var n = document.createElement("span"); n.className = "name"; n.textContent = s.title;
      h3.appendChild(c); h3.appendChild(n);

      var line = document.createElement("p");
      line.className = "story-line";
      line.textContent = s.line;

      var cta = document.createElement("a");
      cta.className = "story-cta";
      cta.href = "case.html?story=" + s.id;
      cta.textContent = "View case study →";

      var text = document.createElement("div");
      text.className = "story-text";
      text.appendChild(meta); text.appendChild(h3); text.appendChild(line); text.appendChild(cta);

      if (shape === "story-full") {
        var bg = document.createElement("div");
        bg.className = "story-bg";
        bg.appendChild(shot(s.cover.image, s.client + ", " + s.title, true).firstChild);
        sec.appendChild(bg);
        inner.appendChild(text);
      } else if (shape === "story-split") {
        inner.appendChild(text);
        inner.appendChild(shot(s.cover.image, s.client + ", " + s.title, true));
      } else {
        inner.appendChild(text);
        var apps = document.createElement("div");
        apps.className = "story-apps";
        pickApps(s).forEach(function (k) { apps.appendChild(shot(k, s.client + ", " + s.title, false)); });
        inner.appendChild(apps);
      }

      sec.appendChild(inner);
      wrap.appendChild(sec);
    });
  }

  function shot(key, alt, big) {
    var fig = document.createElement("figure");
    fig.className = "story-shot";
    var img = document.createElement("img");
    img.src = big ? fullSrc(key) : thumbSrc(key);
    var d = dims(key);
    if (d) { img.width = big ? d[2] : d[0]; img.height = big ? d[3] : d[1]; }
    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";
    fig.appendChild(img);
    return fig;
  }

  function pickApps(s) {
    var p = PROJECTS.filter(function (x) { return s.projects.indexOf(x.id) !== -1; })[0];
    var imgs = (p && p.images) || [];
    return [imgs[2] || imgs[0], imgs[6] || imgs[1] || imgs[0], imgs[9] || imgs[imgs.length - 1]].filter(Boolean);
  }

  /* -------------------------- 3. discipline reel ------------------------- */

  var reel = { list: [], i: -1, timer: null };

  function buildReel() {
    var counts = categoryCounts();
    reel.list = REEL_ORDER.filter(function (c) { return counts[c]; }).map(function (c, i) {
      return { cat: c, n: counts[c], index: i };
    });
    if (!reel.list.length) return;

    $(".reel-total").textContent = "/ " + (reel.list.length < 10 ? "0" : "") + reel.list.length;

    // every background is in the DOM from the start and preloaded well before
    // its slot, so the stage is never a blank rectangle
    var media = $(".reel-media");
    reel.list.forEach(function (d) {
      var spec = REEL_IMAGE[d.cat] || { key: firstKeyIn(d.cat), kind: "image" };
      var img = document.createElement("img");
      img.src = srcOf(spec, true);
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      media.appendChild(img);
      d.img = img;
    });

    var chapters = $(".reel-chapters");
    reel.list.forEach(function (d) {
      var a = document.createElement("a");
      a.className = "reel-chapter";
      a.href = "?category=" + slugify(d.cat) + "&view=grid#archive";
      a.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault(); setCategory(d.cat);
      });
      var img = d.img.cloneNode();
      img.removeAttribute("loading");
      img.loading = "lazy";
      a.appendChild(img);
      var box = document.createElement("div");
      box.className = "chapter-inner";
      var h = document.createElement("h3"); h.textContent = d.cat;
      var p = document.createElement("p");
      p.textContent = (d.index + 1 < 10 ? "0" : "") + (d.index + 1) + " · " + d.n + " projects · View the work →";
      box.appendChild(h); box.appendChild(p);
      a.appendChild(box);
      chapters.appendChild(a);
    });

    $(".reel-cta").addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      var d = reel.list[Math.max(0, reel.i)];
      if (d) setCategory(d.cat);
    });

    showReel(0);
    trackReel();
  }

  function firstKeyIn(cat) {
    var p = PROJECTS.filter(function (x) { return x.category === cat; })[0];
    var c = p && coverKey(p);
    return c ? c.key : null;
  }

  function showReel(i) {
    if (i === reel.i || !reel.list[i]) return;
    var d = reel.list[i];
    var word = $(".reel-word");

    reel.list.forEach(function (x) { x.img.classList.toggle("is-on", x === d); });

    // Scrolling fast queues several of these. Keep one timer and read the
    // current discipline when it fires, or the word lags behind the number.
    word.classList.add("is-out");
    clearTimeout(reel.timer);
    reel.timer = setTimeout(function () {
      var cur = reel.list[reel.i];
      if (cur) word.textContent = cur.cat;
      word.classList.remove("is-out");
    }, prefersReduced() ? 0 : 180);

    reel.i = i;
    $(".reel-now").textContent = (i + 1 < 10 ? "0" : "") + (i + 1);
    $(".reel-count").textContent = d.n + " projects";
    $(".reel-bar i").style.width = ((i + 1) / reel.list.length * 100) + "%";
    $(".reel-cta").setAttribute("href", "?category=" + slugify(d.cat) + "&view=grid#archive");
  }

  function trackReel() {
    var track = $(".reel-track");
    var ticking = false;
    function update() {
      ticking = false;
      var r = track.getBoundingClientRect();
      var span = r.height - window.innerHeight;
      if (span <= 0) return;
      var t = Math.max(0, Math.min(0.9999, -r.top / span));
      showReel(Math.floor(t * reel.list.length));
    }
    function onScroll() { if (ticking) return; ticking = true; setTimeout(update, 16); }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ------------------------------ 4. archive ----------------------------- */

  function tagCounts() {
    var c = {};
    PROJECTS.forEach(function (p) { p.tags.forEach(function (t) { c[t] = (c[t] || 0) + 1; }); });
    return c;
  }

  function buildFilters() {
    var catWrap = $(".cats");
    catWrap.appendChild(catButton("All work", null));
    var present = {};
    PROJECTS.forEach(function (p) { present[p.category] = true; });
    CATEGORIES.forEach(function (c) { if (present[c]) catWrap.appendChild(catButton(c, c)); });

    var counts = tagCounts();
    var filterable = Object.keys(counts)
      .filter(function (t) { return counts[t] >= TAG_FILTER_MIN; })
      .sort(function (a, b) { return a.localeCompare(b); });

    var list = $(".tag-list");
    filterable.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "tag"; b.dataset.value = t;
      b.setAttribute("aria-pressed", "false"); b.textContent = t;
      b.addEventListener("click", function () { toggleTag(t); });
      list.appendChild(b);
    });
    $(".tag-note").textContent = (Object.keys(counts).length - filterable.length) +
      " narrower tags live on the projects. Open one and click a tag to find its relatives.";

    var toggle = $(".tag-toggle"), panel = $(".tag-panel");
    toggle.addEventListener("click", function () {
      var open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", function (e) {
      if (panel.hidden || panel.contains(e.target) || toggle.contains(e.target)) return;
      panel.hidden = true; toggle.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden && viewer.hidden) {
        panel.hidden = true; toggle.setAttribute("aria-expanded", "false"); toggle.focus();
      }
    });

    $$(".clear-filters").forEach(function (b) {
      b.addEventListener("click", function () {
        state.cat = null; state.tags = []; state.q = ""; state.shown = GRID_PAGE;
        $(".search input").value = "";
        writeURL(true); render();
      });
    });

    var search = $(".search input"), t;
    search.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        state.q = search.value.trim(); state.shown = GRID_PAGE; render();
      }, 120);
    });

    $$(".view").forEach(function (b) {
      b.addEventListener("click", function () { setView(b.dataset.view); });
    });
    $(".work-back").addEventListener("click", function () { setCategory(null); });
    $(".more-btn").addEventListener("click", function () {
      state.shown += GRID_PAGE; render();
    });
  }

  function catButton(label, value) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "cat";
    if (value !== null) b.dataset.value = value;
    b.setAttribute("aria-pressed", "false");
    b.textContent = label;
    b.addEventListener("click", function () {
      setCategory((value === null || state.cat === value) ? null : value, { scroll: false });
    });
    return b;
  }

  function toggleTag(t) {
    var i = state.tags.indexOf(t);
    if (i === -1) state.tags.push(t); else state.tags.splice(i, 1);
    state.shown = GRID_PAGE;
    render();
  }

  function syncFilters() {
    $$(".cats .cat").forEach(function (b) {
      var v = "value" in b.dataset ? b.dataset.value : null;
      b.setAttribute("aria-pressed", String(state.cat === v));
    });
    $$(".tag-list .tag").forEach(function (b) {
      b.setAttribute("aria-pressed", String(state.tags.indexOf(b.dataset.value) !== -1));
    });
    $$(".view").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.view === state.view));
    });

    var bar = $(".active-tags");
    bar.innerHTML = "";
    state.tags.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "active-tag";
      b.setAttribute("aria-label", "Remove tag " + t);
      b.appendChild(document.createTextNode(t));
      var x = document.createElement("span"); x.textContent = "✕";
      b.appendChild(x);
      b.addEventListener("click", function () { toggleTag(t); });
      bar.appendChild(b);
    });

    $(".tag-toggle").firstChild.nodeValue =
      state.tags.length ? "Filter by tag (" + state.tags.length + ")" : "Filter by tag";
    var active = !!state.cat || state.tags.length > 0 || !!state.q;
    $$(".clear-filters").forEach(function (b) { b.hidden = !active; });
  }

  function render() {
    var all = visibleProjects();
    var filtered = !!state.cat || state.tags.length > 0 || !!state.q;
    var grid = $("#grid"), indexWrap = $(".index-wrap");

    var list, more = 0;
    if (state.view === "curated" && !filtered) {
      list = curatedList();
    } else if (state.view === "index") {
      list = all;
    } else {
      list = all.slice(0, state.shown);
      more = all.length - list.length;
    }

    grid.innerHTML = "";
    indexWrap.hidden = state.view !== "index";
    grid.hidden = state.view === "index";
    grid.className = "grid " + (state.view === "curated" && !filtered ? "is-curated" : "is-uniform");

    if (state.view === "index") {
      renderIndex(all);
    } else {
      $(".index-table tbody").innerHTML = "";
      $(".index-peek").classList.remove("is-on");
      list.forEach(function (p, i) {
        var el = entry(p, i + 1);
        el.style.setProperty("--i", Math.min(i, 8));
        grid.appendChild(el);
      });
    }

    $(".work-title").textContent = state.cat || "Work archive";
    $(".work-count").textContent = filtered
      ? all.length + " of " + PROJECTS.length + " projects"
      : (state.view === "curated" ? "Twelve selected · " + PROJECTS.length + " in the archive"
                                  : all.length + " projects");
    $(".work-back").hidden = !state.cat;

    var btn = $(".more-btn");
    if (state.view === "curated" && !filtered) {
      btn.hidden = false;
      btn.textContent = "View all " + all.length + " projects";
      btn.onclick = function () { setView("grid"); };
    } else if (more > 0) {
      btn.hidden = false;
      btn.textContent = "Load " + Math.min(GRID_PAGE, more) + " more";
      btn.onclick = function () { state.shown += GRID_PAGE; render(); };
    } else {
      btn.hidden = true;
    }

    $(".empty").hidden = all.length !== 0;
    syncFilters();
  }

  function entry(p, number) {
    var cover = coverKey(p);
    var link = document.createElement("a");
    link.className = "entry-link";
    link.href = "#" + p.id;
    link.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault(); openProject(p.id, true);
    });

    var wrap = document.createElement("div");
    wrap.className = "entry-shot-wrap";
    var fig = document.createElement("figure");
    fig.className = "entry-shot";
    var img = document.createElement("img");
    if (cover && cover.kind === "poster") {
      img.src = posterSrc(cover.key);
      var vm = vmeta(cover.key);
      if (vm) { img.width = vm.w; img.height = vm.h; }
    } else if (cover) {
      var d = dims(cover.key);
      img.src = thumbSrc(cover.key);
      if (d) { img.width = d[0]; img.height = d[1]; }
    }
    img.loading = number <= 6 ? "eager" : "lazy";
    img.decoding = "async";
    img.alt = altFor(p, 0);
    fig.appendChild(img);
    wrap.appendChild(fig);

    if (hasMotion(p)) {
      var badge = document.createElement("span");
      badge.className = "entry-play";
      var m0 = vmeta(p.videos[0]);
      badge.textContent = "▶ " + (m0 ? clock(m0.dur) : "Play");
      wrap.appendChild(badge);
      attachLoop(link, fig, p.videos[0]);
    }

    var text = document.createElement("div");
    text.className = "entry-text";
    var meta = document.createElement("p");
    meta.className = "entry-client";
    meta.appendChild(document.createTextNode(p.client + (p.year ? " · " + p.year : "")));
    var n = pieceCount(p);
    if (n > 1) {
      var c = document.createElement("span");
      c.className = "count"; c.textContent = " · " + n + " pieces";
      meta.appendChild(c);
    }
    var title = document.createElement("h3");
    title.className = "entry-title"; title.textContent = p.title;
    var tags = document.createElement("ul");
    tags.className = "entry-tags";
    p.tags.slice(0, 3).forEach(function (t) {
      var li = document.createElement("li"); li.textContent = t; tags.appendChild(li);
    });
    text.appendChild(meta); text.appendChild(title); text.appendChild(tags);

    link.appendChild(wrap); link.appendChild(text);
    var art = document.createElement("article");
    art.className = "entry"; art.appendChild(link);
    return art;
  }

  // hover loops only exist on pointer devices, and only after the first hover
  function attachLoop(link, fig, name) {
    if (!window.matchMedia || !window.matchMedia("(hover: hover)").matches) return;
    if (prefersReduced()) return;
    var vid = null;
    function enter() {
      // never leave two loops running at once
      $$("video.entry-loop").forEach(function (v) { if (v !== vid) v.pause(); });
      if (!vid) {
        vid = document.createElement("video");
        vid.className = "entry-loop";
        vid.src = previewSrc(name);
        vid.muted = true; vid.loop = true; vid.playsInline = true;
        vid.preload = "none"; vid.setAttribute("aria-hidden", "true");
        fig.appendChild(vid);
      }
      vid.currentTime = 0;
      var pl = vid.play(); if (pl && pl.catch) pl.catch(function () {});
      fig.classList.add("is-playing");
    }
    function leave() { fig.classList.remove("is-playing"); if (vid) vid.pause(); }
    link.addEventListener("mouseenter", enter);
    link.addEventListener("mouseleave", leave);
    link.addEventListener("focus", enter);
    link.addEventListener("blur", leave);
  }

  /* --- index view: a typographic list with a preview in the margin --- */

  function renderIndex(list) {
    var body = $(".index-table tbody");
    body.innerHTML = "";
    var peek = $(".index-peek");

    list.forEach(function (p) {
      var cover = coverKey(p);
      var tr = document.createElement("tr");
      tr.className = "index-row";
      tr.tabIndex = -1;

      [["c-client", p.client], ["c-project", p.title], ["c-disc", p.category], ["c-year", p.year || ""]]
        .forEach(function (pair, i) {
          var td = document.createElement("td");
          td.className = pair[0];
          if (i === 1) {
            var a = document.createElement("a");
            a.href = "#" + p.id;
            a.textContent = pair[1];
            a.addEventListener("click", function (e) {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
              e.preventDefault(); openProject(p.id, true);
            });
            td.appendChild(a);
          } else {
            td.textContent = pair[1];
          }
          tr.appendChild(td);
        });

      // on touch the preview drops into the row rather than following a cursor
      var mob = document.createElement("tr");
      mob.className = "index-mobile-peek";
      var mtd = document.createElement("td");
      mtd.colSpan = 4;
      if (cover) {
        var mi = document.createElement("img");
        mi.src = cover.kind === "poster" ? posterSrc(cover.key) : thumbSrc(cover.key);
        mi.alt = altFor(p, 0); mi.loading = "lazy"; mi.decoding = "async";
        mtd.appendChild(mi);
      }
      mob.appendChild(mtd);

      function show() {
        if (!cover) return;
        $$(".index-row").forEach(function (r) { r.classList.remove("is-active"); });
        tr.classList.add("is-active");
        var img = $("img", peek);
        img.src = cover.kind === "poster" ? posterSrc(cover.key) : thumbSrc(cover.key);
        img.alt = "";
        var r = tr.getBoundingClientRect();
        var w = peek.offsetWidth || 230;
        var top = Math.max(70, Math.min(window.innerHeight - 320, r.top - 40));
        peek.style.top = top + "px";
        peek.style.left = (window.innerWidth - w - 28) + "px";
        peek.classList.add("is-on");
      }
      function hide() { peek.classList.remove("is-on"); tr.classList.remove("is-active"); }

      tr.addEventListener("mouseenter", show);
      tr.addEventListener("mouseleave", hide);
      $("a", tr).addEventListener("focus", show);
      $("a", tr).addEventListener("blur", hide);

      body.appendChild(tr);
      body.appendChild(mob);
    });
  }

  /* ------------------------------ routing -------------------------------- */

  function writeURL(push, hash) {
    var qs = [];
    if (state.cat) qs.push("category=" + slugify(state.cat));
    if (state.view !== "curated") qs.push("view=" + state.view);
    var url = location.pathname + (qs.length ? "?" + qs.join("&") : "") + (hash || "");
    if (push) history.pushState(null, "", url);
    else history.replaceState(null, "", url);
  }

  function setCategory(cat, opts) {
    opts = opts || {};
    state.cat = cat;
    state.shown = GRID_PAGE;
    if (cat && state.view === "curated") state.view = "grid";
    writeURL(true, "#archive");
    render();
    if (opts.scroll !== false) {
      document.getElementById("archive").scrollIntoView({
        block: "start", behavior: prefersReduced() ? "auto" : "smooth"
      });
    }
  }

  function setView(v) {
    if (state.view === v) return;
    state.view = v;
    state.shown = GRID_PAGE;
    writeURL(true, "#archive");
    render();
  }

  // The URL carries category and view. Tags and the search box are not in it,
  // so a history move has to clear them or a stale query keeps filtering.
  function applyURL(fromPop) {
    var q = new URLSearchParams(location.search);
    var cat = q.get("category") ? catFromSlug(q.get("category")) : null;
    var view = q.get("view");
    state.cat = cat;
    state.view = (view === "grid" || view === "index" || view === "curated") ? view : "curated";
    state.shown = GRID_PAGE;
    state.tags = [];
    state.q = "";
    var box = $(".search input");
    if (box) box.value = "";
    render();

    var hash = location.hash.replace("#", "");
    var isProject = hash && PROJECTS.some(function (p) { return p.id === hash; });
    if (fromPop) {
      if (isProject) openProject(hash, false);
      else if (!viewer.hidden) closeViewer(true);
    }
    return isProject ? hash : null;
  }

  window.addEventListener("popstate", function () { applyURL(true); });

  /* ------------------------------- viewer -------------------------------- */

  var viewer = $("#viewer");
  var lastFocus = null;

  function openProject(id, pushHash) {
    var p = PROJECTS.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    lastFocus = document.activeElement;

    $(".viewer-client").textContent = p.client;
    $(".viewer-name").textContent = p.title;
    $(".viewer-eyebrow").textContent = p.category;
    $(".viewer-title").textContent = p.title;
    $(".viewer-summary").textContent = p.summary;
    $(".viewer-tab").href = location.pathname.replace(/[^/]*$/, "") + "index.html" + location.search + "#" + p.id;

    var story = storyFor(p.id);
    var caseLink = $(".viewer-case");
    if (story) {
      caseLink.hidden = false;
      caseLink.href = "case.html?story=" + story.id;
      caseLink.textContent = "Read the " + story.client + " case study →";
    } else {
      caseLink.hidden = true;
    }

    var facts = $(".viewer-facts");
    facts.innerHTML = "";
    addFact(facts, "Client", p.client);
    if (p.year) addFact(facts, "Year", p.year);
    addFact(facts, "Discipline", p.category);
    addFact(facts, "Pieces", String(pieceCount(p)));

    var tags = $(".viewer-tags");
    tags.innerHTML = "";
    p.tags.forEach(function (t) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button"; b.textContent = t;
      b.addEventListener("click", function () {
        closeViewer(true);
        state.cat = null; state.tags = [t]; state.q = ""; state.shown = GRID_PAGE;
        if (state.view === "curated") state.view = "grid";
        $(".search input").value = "";
        writeURL(true, "#archive"); render();
        document.getElementById("archive").scrollIntoView({ block: "start" });
      });
      li.appendChild(b); tags.appendChild(li);
    });

    var box = $(".viewer-images");
    box.innerHTML = "";
    var idx = 0, total = pieceCount(p);

    (p.videos || []).forEach(function (name) {
      var vm = vmeta(name);
      var fig = document.createElement("figure");
      var v = document.createElement("video");
      v.src = videoSrc(name); v.poster = posterSrc(name);
      v.controls = true; v.playsInline = true;
      v.preload = idx === 0 ? "metadata" : "none";
      if (vm) { v.width = vm.w; v.height = vm.h; }
      v.setAttribute("aria-label", altFor(p, idx));
      // one video at a time
      v.addEventListener("play", function () {
        $$("video", box).forEach(function (o) { if (o !== v) o.pause(); });
      });
      fig.appendChild(v);
      if (total > 1) {
        var cap = document.createElement("figcaption");
        cap.textContent = (idx + 1) + " / " + total + (vm ? " · " + clock(vm.dur) : "");
        fig.appendChild(cap);
      }
      box.appendChild(fig); idx++;
    });

    (p.images || []).forEach(function (key) {
      var d = dims(key);
      var fig = document.createElement("figure");
      var img = document.createElement("img");
      img.src = fullSrc(key);
      if (d) { img.width = d[2]; img.height = d[3]; }
      img.loading = idx < 2 ? "eager" : "lazy";
      img.decoding = "async";
      img.alt = altFor(p, idx);
      fig.appendChild(img);
      if (total > 1) {
        var cap2 = document.createElement("figcaption");
        cap2.textContent = (idx + 1) + " / " + total;
        fig.appendChild(cap2);
      }
      box.appendChild(fig); idx++;
    });

    var list = visibleProjects();
    var at = list.map(function (x) { return x.id; }).indexOf(id);
    if (at === -1) { list = PROJECTS; at = PROJECTS.map(function (x) { return x.id; }).indexOf(id); }
    $(".viewer-prev").disabled = at <= 0;
    $(".viewer-next").disabled = at === -1 || at >= list.length - 1;
    viewer._list = list; viewer._idx = at;

    viewer.hidden = false;
    document.body.classList.add("is-locked");
    $(".viewer-body").scrollTop = 0;
    $(".viewer-close").focus();
    if (pushHash) writeURL(false, "#" + p.id);
  }

  function addFact(dl, term, value) {
    var row = document.createElement("div");
    var dt = document.createElement("dt"); dt.textContent = term;
    var dd = document.createElement("dd"); dd.textContent = value;
    row.appendChild(dt); row.appendChild(dd); dl.appendChild(row);
  }

  function step(delta) {
    var list = viewer._list || PROJECTS;
    var i = (viewer._idx || 0) + delta;
    if (i < 0 || i >= list.length) return;
    openProject(list[i].id, true);
  }

  function closeViewer(skipURL) {
    if (viewer.hidden) return;
    viewer.hidden = true;
    document.body.classList.remove("is-locked");
    $$("video", viewer).forEach(function (v) { v.pause(); });
    $(".viewer-images").innerHTML = "";
    if (skipURL !== true) writeURL(false, "");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  $$("[data-close]", viewer).forEach(function (el) {
    el.addEventListener("click", function () { closeViewer(); });
  });
  $(".viewer-prev").addEventListener("click", function () { step(-1); });
  $(".viewer-next").addEventListener("click", function () { step(1); });

  document.addEventListener("keydown", function (e) {
    if (viewer.hidden) return;
    if (e.key === "Escape") { closeViewer(); return; }
    if (e.key === "ArrowLeft") { step(-1); return; }
    if (e.key === "ArrowRight") { step(1); return; }
    if (e.key === "Tab") {
      var f = $$("button, a[href], input, video", viewer).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ------------------------------- chrome -------------------------------- */

  function fillChrome() {
    document.title = SITE.name + " — " + SITE.role;
    $(".wordmark-name").textContent = SITE.name;
    $(".wordmark-role").textContent = SITE.role;
    $(".foot-name").textContent = "© " + new Date().getFullYear() + " " + SITE.name;

    var about = $(".about-body");
    SITE.about.forEach(function (para) {
      var el = document.createElement("p");
      el.textContent = para;
      about.appendChild(el);
    });

    $(".cover-eyebrow").innerHTML = "";
    [SITE.name, SITE.role, SITE.location].forEach(function (t) {
      $(".cover-eyebrow").appendChild(document.createElement("span")).textContent = t;
    });
    $(".cover-headline .reveal").textContent = SITE.headline;
    $(".cover-support").textContent = SITE.support;
    $(".cover-issue").textContent = SITE.issue;
    $(".about-statement .reveal").textContent = SITE.statement;
    $(".contact-place").textContent = SITE.location;

    var caps = $(".capabilities");
    (SITE.capabilities || []).forEach(function (pair) {
      var row = document.createElement("div");
      var dt = document.createElement("dt"); dt.className = "cap-term"; dt.textContent = pair[0];
      var dd = document.createElement("dd"); dd.textContent = pair[1];
      row.appendChild(dt); row.appendChild(dd); caps.appendChild(row);
    });

    var seen = {};
    PROJECTS.forEach(function (p) { seen[p.client] = true; });
    var wall = $(".clients");
    Object.keys(seen).sort().forEach(function (c) {
      var li = document.createElement("li"); li.textContent = c; wall.appendChild(li);
    });

    var mail = $(".contact-email");
    mail.textContent = SITE.email;
    mail.href = "mailto:" + SITE.email;

    var links = $(".contact-links");
    SITE.links.forEach(function (l) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = l.url; a.textContent = l.label;
      if (l.url.indexOf("http") === 0) { a.target = "_blank"; a.rel = "noopener"; }
      li.appendChild(a); links.appendChild(li);
    });
  }

  function measureHeader() {
    var h = $(".masthead").getBoundingClientRect().height;
    document.documentElement.style.setProperty("--head-h", Math.round(h) + "px");
  }

  // the masthead flips to light type over the dark stages
  function watchHeader() {
    var mast = $(".masthead");
    var darks = [$(".reel"), $(".contact")].filter(Boolean);
    var ticking = false;
    function update() {
      ticking = false;
      var h = mast.getBoundingClientRect().height;
      var on = darks.some(function (d) {
        var r = d.getBoundingClientRect();
        return r.top <= h * 0.6 && r.bottom > h * 0.6;
      });
      mast.classList.toggle("on-dark", on);
    }
    function onScroll() { if (ticking) return; ticking = true; setTimeout(update, 16); }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* -------------------------------- boot --------------------------------- */

  window.addEventListener("resize", measureHeader);

  fillChrome();
  buildCover();
  buildStories();
  buildReel();
  buildFilters();

  var start = applyURL(false);
  measureHeader();
  watchHeader();
  armReveals();
  if (start) openProject(start, false);
})();
