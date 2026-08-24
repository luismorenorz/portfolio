/* =========================================================================
   Luis Moreno — portfolio behaviour
   Plain JS, no dependencies, works from file:// as well as a web server.

   Every project is an equal tile in a three-across grid. Clicking one slides
   up a preview sheet over the page, with the grid still visible behind it and
   all of that project's pieces stacked so they can be scrolled. Arrow keys
   step between projects, Esc or a click on the backdrop closes it, and every
   tile is a real link, so cmd-click (or "Open in new tab") opens it alone.
   ========================================================================= */

(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var state = { cat: null, tags: [], q: "" };

  /* ------------------------------ helpers ------------------------------- */

  function thumbSrc(key) { return "assets/thumb/" + key + ".webp"; }
  function fullSrc(key) { return "assets/full/" + key + ".webp"; }

  // An image name may carry its own extension (e.g. a portrait photo you added).
  function assetSrc(name, dir) {
    return /\.[a-z0-9]+$/i.test(name) ? "assets/" + dir + "/" + name : "assets/" + dir + "/" + name + ".webp";
  }

  function dims(key) { return IMAGES[key] || null; }

  function altFor(p, i) {
    return p.client + ", " + p.title + (p.images.length > 1 ? " (" + (i + 1) + " of " + p.images.length + ")" : "");
  }

  function matches(p) {
    if (state.cat && p.category !== state.cat) return false;
    for (var i = 0; i < state.tags.length; i++) {
      if (p.tags.indexOf(state.tags[i]) === -1) return false;
    }
    if (state.q) {
      var hay = (p.title + " " + p.client + " " + p.category + " " + p.tags.join(" ") + " " + p.summary).toLowerCase();
      var words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      for (var j = 0; j < words.length; j++) {
        if (hay.indexOf(words[j]) === -1) return false;
      }
    }
    return true;
  }

  function visibleProjects() { return PROJECTS.filter(matches); }

  /* ------------------------------- chrome ------------------------------- */

  function fillChrome() {
    document.title = SITE.name + " — " + SITE.role;
    $(".wordmark-name").textContent = SITE.name;
    $(".wordmark-role").textContent = SITE.role;
    $(".foot-name").textContent = "© " + new Date().getFullYear() + " " + SITE.name;

    $(".cover-issue").textContent = (SITE.issue || "Selected work") + " · " + SITE.role;

    // The headline is two sentences; the second one drops to grey.
    var h1 = $(".cover-headline");
    var split = SITE.tagline.indexOf(". ");
    if (split === -1) {
      h1.textContent = SITE.tagline;
    } else {
      h1.appendChild(document.createTextNode(SITE.tagline.slice(0, split + 1) + " "));
      var em = document.createElement("em");
      em.textContent = SITE.tagline.slice(split + 2);
      h1.appendChild(em);
    }

    var pieces = PROJECTS.reduce(function (n, p) { return n + p.images.length; }, 0);
    var stats = $(".cover-stats");
    [["Projects", PROJECTS.length], ["Pieces", pieces], ["Disciplines", CATEGORIES.length]]
      .forEach(function (pair) {
        var row = document.createElement("div");
        var dt = document.createElement("dt");
        dt.textContent = pair[0];
        var dd = document.createElement("dd");
        dd.textContent = pair[1];
        row.appendChild(dt);
        row.appendChild(dd);
        stats.appendChild(row);
      });

    setFigure($(".cover-shot"), SITE.cover, "eager");
    setFigure($(".about-shot"), SITE.portrait, "lazy");

    var about = $(".about-body");
    SITE.about.forEach(function (para) {
      var el = document.createElement("p");
      el.textContent = para;
      about.appendChild(el);
    });

    var services = $(".services");
    SITE.services.forEach(function (s) {
      var li = document.createElement("li");
      li.textContent = s;
      services.appendChild(li);
    });

    var seen = {};
    PROJECTS.forEach(function (p) { seen[p.client] = true; });
    var clientList = $(".clients");
    Object.keys(seen).sort().forEach(function (c) {
      var li = document.createElement("li");
      li.textContent = c;
      clientList.appendChild(li);
    });

    var mail = $(".contact-email");
    mail.textContent = SITE.email;
    mail.href = "mailto:" + SITE.email;

    var links = $(".contact-links");
    SITE.links.forEach(function (l) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = l.url;
      a.textContent = l.label;
      if (l.url.indexOf("http") === 0) { a.target = "_blank"; a.rel = "noopener"; }
      li.appendChild(a);
      links.appendChild(li);
    });
  }

  function setFigure(fig, spec, loading) {
    if (!fig) return;
    if (!spec || !spec.image) { fig.hidden = true; return; }
    var img = $("img", fig);
    var d = dims(spec.image);
    img.src = assetSrc(spec.image, "full");
    img.loading = loading;
    if (d) { img.width = d[2]; img.height = d[3]; }
    img.alt = spec.caption || "";
    var cap = $("figcaption", fig);
    if (spec.caption) cap.textContent = spec.caption; else cap.remove();
  }

  /* ------------------------------- filters ------------------------------ */

  // A tag is only offered as a filter when it actually narrows anything.
  // Of 64 tags, 25 sit on a single project. As filter targets those are dead
  // ends, so they live on the project itself instead.
  var TAG_FILTER_MIN = 3;

  function tagCounts() {
    var counts = {};
    PROJECTS.forEach(function (p) {
      p.tags.forEach(function (t) { counts[t] = (counts[t] || 0) + 1; });
    });
    return counts;
  }

  function buildFilters() {
    var catWrap = $(".cats");
    catWrap.appendChild(catButton("All work", null));
    var present = {};
    PROJECTS.forEach(function (p) { present[p.category] = true; });
    CATEGORIES.forEach(function (c) {
      if (present[c]) catWrap.appendChild(catButton(c, c));
    });

    var counts = tagCounts();
    var filterable = Object.keys(counts)
      .filter(function (t) { return counts[t] >= TAG_FILTER_MIN; })
      .sort(function (a, b) { return a.localeCompare(b); });

    var list = $(".tag-list");
    filterable.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tag";
      b.dataset.value = t;
      b.setAttribute("aria-pressed", "false");
      b.textContent = t;
      b.addEventListener("click", function () { toggleTag(t); });
      list.appendChild(b);
    });

    var hidden = Object.keys(counts).length - filterable.length;
    $(".tag-note").textContent =
      hidden + " narrower tags live on the projects. Open one and click a tag to find its relatives.";

    var toggle = $(".tag-toggle");
    var panel = $(".tag-panel");
    toggle.addEventListener("click", function () {
      var open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", function (e) {
      if (panel.hidden) return;
      if (panel.contains(e.target) || toggle.contains(e.target)) return;
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden && viewer.hidden) {
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });

    $$(".clear-filters").forEach(function (b) {
      b.addEventListener("click", function () {
        state = { cat: null, tags: [], q: "" };
        $(".search input").value = "";
        render();
      });
    });

    var search = $(".search input");
    var t;
    search.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { state.q = search.value.trim(); render(); }, 120);
    });
  }

  function catButton(label, value) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "cat";
    if (value !== null) b.dataset.value = value;
    b.setAttribute("aria-pressed", "false");
    b.textContent = label;
    b.addEventListener("click", function () {
      state.cat = (value === null || state.cat === value) ? null : value;
      render();
    });
    return b;
  }

  function toggleTag(t) {
    var i = state.tags.indexOf(t);
    if (i === -1) state.tags.push(t); else state.tags.splice(i, 1);
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

    // selected tags stay visible on the bar even when the panel is shut
    var bar = $(".active-tags");
    bar.innerHTML = "";
    state.tags.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "active-tag";
      b.setAttribute("aria-label", "Remove tag " + t);
      b.appendChild(document.createTextNode(t));
      var x = document.createElement("span");
      x.textContent = "\u2715";
      b.appendChild(x);
      b.addEventListener("click", function () { toggleTag(t); });
      bar.appendChild(b);
    });

    $(".tag-toggle").firstChild.nodeValue =
      state.tags.length ? "Filter by tag (" + state.tags.length + ")" : "Filter by tag";

    var active = !!state.cat || state.tags.length > 0 || !!state.q;
    $$(".clear-filters").forEach(function (b) { b.hidden = !active; });
  }

  /* -------------------------------- grid --------------------------------- */

  function render() {
    var list = visibleProjects();
    var grid = $("#grid");
    grid.innerHTML = "";
    list.forEach(function (p, i) {
      var el = entry(p, i + 1);
      // stagger the entrance animation across the first couple of rows only.
      // Later tiles should not sit waiting for a delay to elapse.
      el.style.setProperty("--i", Math.min(i, 8));
      grid.appendChild(el);
    });

    $(".result-count").textContent =
      list.length === PROJECTS.length
        ? PROJECTS.length + " projects"
        : list.length + " of " + PROJECTS.length + " projects";

    $(".empty").hidden = list.length !== 0;
    syncFilters();
  }

  // One tile. Every project gets the same shape; the full piece is in the
  // preview sheet, which scrolls.
  function entry(p, number) {
    var key = p.images[0];
    var d = dims(key);

    var link = document.createElement("a");
    link.className = "entry-link";
    link.href = "#" + p.id;
    link.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      openProject(p.id, true);
    });

    var shotWrap = document.createElement("div");
    shotWrap.className = "entry-shot-wrap";
    var fig = document.createElement("figure");
    fig.className = "entry-shot";
    var img = document.createElement("img");
    img.src = thumbSrc(key);
    if (d) { img.width = d[0]; img.height = d[1]; }
    img.loading = number <= 6 ? "eager" : "lazy";
    img.decoding = "async";
    img.alt = altFor(p, 0);
    fig.appendChild(img);
    shotWrap.appendChild(fig);

    var text = document.createElement("div");
    text.className = "entry-text";

    var meta = document.createElement("p");
    meta.className = "entry-client";
    meta.appendChild(document.createTextNode(p.client + (p.year ? " · " + p.year : "")));
    if (p.images.length > 1) {
      var n = document.createElement("span");
      n.className = "count";
      n.textContent = " · " + p.images.length + " pieces";
      meta.appendChild(n);
    }

    var title = document.createElement("h3");
    title.className = "entry-title";
    title.textContent = p.title;

    var tags = document.createElement("ul");
    tags.className = "entry-tags";
    p.tags.slice(0, 3).forEach(function (t) {
      var li = document.createElement("li");
      li.textContent = t;
      tags.appendChild(li);
    });

    text.appendChild(meta);
    text.appendChild(title);
    text.appendChild(tags);

    link.appendChild(shotWrap);
    link.appendChild(text);

    var art = document.createElement("article");
    art.className = "entry";
    art.appendChild(link);
    return art;
  }

  /* ------------------------------- viewer ------------------------------- */

  var viewer = $("#viewer");
  var lastFocus = null;

  function openProject(id, pushHash) {
    var p = PROJECTS.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    lastFocus = document.activeElement;

    $(".viewer-client").textContent = p.client;
    $(".viewer-name").textContent = p.title;
    $(".viewer-tab").href = location.pathname.replace(/[^/]*$/, "") + "index.html#" + p.id;
    $(".viewer-eyebrow").textContent = p.category;
    $(".viewer-title").textContent = p.title;
    $(".viewer-summary").textContent = p.summary;

    var facts = $(".viewer-facts");
    facts.innerHTML = "";
    addFact(facts, "Client", p.client);
    if (p.year) addFact(facts, "Year", p.year);
    addFact(facts, "Discipline", p.category);
    addFact(facts, "Pieces", String(p.images.length));

    var tags = $(".viewer-tags");
    tags.innerHTML = "";
    p.tags.forEach(function (t) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = t;
      b.addEventListener("click", function () {
        closeViewer();
        state.cat = null;
        state.tags = [t];
        state.q = "";
        $(".search input").value = "";
        render();
        document.getElementById("work").scrollIntoView({ block: "start" });
      });
      li.appendChild(b);
      tags.appendChild(li);
    });

    var box = $(".viewer-images");
    box.innerHTML = "";
    p.images.forEach(function (key, i) {
      var d = dims(key);
      var fig = document.createElement("figure");
      var img = document.createElement("img");
      img.src = fullSrc(key);
      if (d) { img.width = d[2]; img.height = d[3]; }
      img.loading = i < 2 ? "eager" : "lazy";
      img.decoding = "async";
      img.alt = altFor(p, i);
      fig.appendChild(img);
      if (p.images.length > 1) {
        var cap = document.createElement("figcaption");
        cap.textContent = (i + 1) + " / " + p.images.length;
        fig.appendChild(cap);
      }
      box.appendChild(fig);
    });

    var list = visibleProjects();
    var idx = list.map(function (x) { return x.id; }).indexOf(id);
    if (idx === -1) { list = PROJECTS; idx = PROJECTS.map(function (x) { return x.id; }).indexOf(id); }
    $(".viewer-prev").disabled = idx <= 0;
    $(".viewer-next").disabled = idx === -1 || idx >= list.length - 1;
    viewer._list = list;
    viewer._idx = idx;

    viewer.hidden = false;
    document.body.classList.add("is-locked");
    $(".viewer-body").scrollTop = 0;
    $(".viewer-close").focus();

    if (pushHash) history.replaceState(null, "", "#" + id);
  }

  function addFact(dl, term, value) {
    var row = document.createElement("div");
    var dt = document.createElement("dt");
    dt.textContent = term;
    var dd = document.createElement("dd");
    dd.textContent = value;
    row.appendChild(dt);
    row.appendChild(dd);
    dl.appendChild(row);
  }

  function step(delta) {
    var list = viewer._list || PROJECTS;
    var i = (viewer._idx || 0) + delta;
    if (i < 0 || i >= list.length) return;
    openProject(list[i].id, true);
  }

  function closeViewer() {
    if (viewer.hidden) return;
    viewer.hidden = true;
    document.body.classList.remove("is-locked");
    $(".viewer-images").innerHTML = "";
    history.replaceState(null, "", location.pathname + location.search);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // the close button and the backdrop both carry data-close
  $$("[data-close]", viewer).forEach(function (el) {
    el.addEventListener("click", closeViewer);
  });
  $(".viewer-prev").addEventListener("click", function () { step(-1); });
  $(".viewer-next").addEventListener("click", function () { step(1); });

  document.addEventListener("keydown", function (e) {
    if (viewer.hidden) return;
    if (e.key === "Escape") { closeViewer(); return; }
    if (e.key === "ArrowLeft") { step(-1); return; }
    if (e.key === "ArrowRight") { step(1); return; }
    if (e.key === "Tab") {
      var focusables = $$("button, a[href], input", viewer).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* -------------------------------- boot -------------------------------- */

  // Keep the sticky filter bar parked exactly under the masthead at any width.
  function measureHeader() {
    var h = $(".masthead").getBoundingClientRect().height;
    document.documentElement.style.setProperty("--head-h", Math.round(h) + "px");
  }
  window.addEventListener("resize", measureHeader);

  fillChrome();
  buildFilters();
  render();
  measureHeader();

  var hash = location.hash.replace("#", "");
  if (hash && PROJECTS.some(function (p) { return p.id === hash; })) openProject(hash, false);
})();
