/* =========================================================================
   Luis Moreno — production portfolio

   Production first, case studies second. The page runs: a photographic
   cover, a quick production menu, the work archive in three views, the
   selected production systems, the capability matrix, the experience map,
   about and contact.

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
  /* Tags that cut across every discipline and are worth a chip of their own in
     the filter bar, so they never hide behind "Filter by tag". They stay tags:
     a project keeps its category, its colour and its place in the file. */
  var QUICK_TAGS = ["Beauty"];
  var DEFAULT_VIEW = "grid";
  var CURATED_COUNT = 12;
  var GRID_PAGE = 24;

  var state = { cat: null, tags: [], q: "", view: DEFAULT_VIEW, shown: GRID_PAGE };

  /* The curated twelve: one pass across every discipline, balanced between
     wide renders, tall email, square social and motion. Order matters — the
     grid gives positions 1, 2, 8 and 12 the most room. */
  var CURATED = [
    "spartan-watch-bands", "greenhouse-dtd-displays", "rove-campaigns", "sky18-rebrand",
    "gh-campaign-video", "cosmedica-social", "carevio", "pkg-vibrance",
    "greenhouse-smoothies", "deck-trace-ai", "greenhouse-fridge", "zillow-rentals-motion"
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

  /* How many shapes a project was delivered in. Measured from the files
     themselves — the aspect ratios actually present — never estimated. */
  function formatCount(p) {
    var seen = {};
    (p.images || []).forEach(function (k) {
      var d = dims(k);
      if (d) seen[(Math.round((d[2] / d[3]) * 20) / 20).toFixed(2)] = 1;
    });
    (p.videos || []).forEach(function (k) {
      var m = vmeta(k);
      if (m) seen[(Math.round((m.w / m.h) * 20) / 20).toFixed(2)] = 1;
    });
    return Object.keys(seen).length;
  }

  function piecesLabel(p) {
    var n = pieceCount(p);
    return n + (n === 1 ? " piece" : " pieces");
  }
  function formatsLabel(p) {
    var f = formatCount(p);
    return f + (f === 1 ? " format" : " formats");
  }
  function deliverableLine(p) { return piecesLabel(p) + " · " + formatsLabel(p); }

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
  /* Tags travel in the URL as slugs, so ?tag=beauty has to find "Beauty"
     again. Read back from the data, never from a hardcoded list. */
  function tagFromSlug(slug) {
    var found = null;
    PROJECTS.forEach(function (p) {
      p.tags.forEach(function (t) { if (!found && slugify(t) === slug) found = t; });
    });
    return found;
  }
  function tagsFromParam(v) {
    if (!v) return [];
    var out = [];
    v.split(",").forEach(function (s) {
      var t = tagFromSlug(s.trim().toLowerCase());
      if (t && out.indexOf(t) === -1) out.push(t);
    });
    return out;
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
    // AI counts every project marked AI, whatever discipline it belongs to
    c["AI"] = PROJECTS.filter(isAI).length;
    return c;
  }
  function storyFor(id) {
    for (var i = 0; i < STORIES.length; i++) {
      if (STORIES[i].projects.indexOf(id) !== -1) return STORIES[i];
    }
    return null;
  }

  /* AI is the one discipline that overlaps: a project keeps its own category
     and still answers to the AI filter when it is marked `isAI: true`. The
     flag is deliberate and never inferred from a tag, because "AI" also
     appears as a sector tag on work made FOR an AI company, which is not
     AI-assisted production and must not be counted as such. */
  function isAI(p) {
    return p.category === "AI" || p.isAI === true;
  }

  function matches(p) {
    if (state.cat === "AI") { if (!isAI(p)) return false; }
    else if (state.cat && p.category !== state.cat) return false;
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
  /* The file groups projects by discipline, which would open the archive on
     a wall of one colour and read as a specialist's portfolio. Deal the
     results round-robin across the disciplines instead: same 70 projects,
     same ids, same order inside each discipline — the first screen just
     shows the range. With one category selected it collapses to file order. */
  function spread(list) {
    var bucket = {}, order = [];
    list.forEach(function (p) {
      if (!bucket[p.category]) { bucket[p.category] = []; order.push(p.category); }
      bucket[p.category].push(p);
    });
    order.sort(function (a, b) { return CATEGORIES.indexOf(a) - CATEGORIES.indexOf(b); });
    var out = [], round = 0, moved = true;
    while (moved) {
      moved = false;
      for (var i = 0; i < order.length; i++) {
        var q = bucket[order[i]];
        if (round < q.length) { out.push(q[round]); moved = true; }
      }
      round++;
    }
    return out;
  }

  function visibleProjects() { return spread(PROJECTS.filter(matches)); }

  /* ----------------------- reveal on scroll ------------------------------
     Elements start visible; JS arms the hidden state and an observer disarms
     it. A timed sweep clears anything the observer missed, so a stalled
     animation clock can never leave content hidden. Runs once per element.
     ----------------------------------------------------------------------- */

  function armReveals() {
    var items = $$(".reveal").map(function (el) { return el.parentNode; })
      .concat($$("[data-reveal]"));
    if (prefersReduced() || !window.IntersectionObserver) return;
    items.forEach(function (el) { el.classList.add("is-armed"); });
    var io = new IntersectionObserver(function (rows) {
      rows.forEach(function (r) {
        if (r.isIntersecting) { r.target.classList.remove("is-armed"); io.unobserve(r.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    items.forEach(function (el) { io.observe(el); });
    setTimeout(function () { items.forEach(function (el) { el.classList.remove("is-armed"); }); }, 2600);
  }

  /* --------------- 2. the category system: one configuration -------------
     Every selector on the page is built from CATS. Labels, order, colour and
     counts live here and nowhere else; the counts come from the projects.
     ----------------------------------------------------------------------- */

  var CAT_COLOR = {
    "all":           "#171714",
    "advertising":   "#7c2837",
    "social":        "#7c2837",
    "email":         "#a24b32",
    "motion":        "#2a2927",
    "ai":            "#2a2927",
    "retail":        "#455148",
    "packaging":     "#455148",
    "web-ui":        "#28575a",
    "branding":      "#68313a",
    "presentations": "#444b52"
  };
  // reading order of the tiles, loudest disciplines first
  var CAT_ORDER = ["Advertising", "Motion", "Email", "Web & UI", "Branding",
                   "Social", "Retail", "Packaging", "Presentations", "AI"];

  var CATS = [];

  function buildCatConfig() {
    var counts = categoryCounts();
    var seen = {};
    CATS = [{ slug: "all", label: "All work", cat: null, color: CAT_COLOR.all, order: 0, count: PROJECTS.length }];
    CAT_ORDER.concat(CATEGORIES).forEach(function (name) {
      if (seen[name] || !counts[name]) return;
      seen[name] = true;
      var slug = slugify(name);
      CATS.push({
        slug: slug, label: name, cat: name,
        color: CAT_COLOR[slug] || "#2a2927",
        order: CATS.length, count: counts[name]
      });
    });
  }

  function catBySlug(slug) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].slug === slug) return CATS[i];
    return null;
  }
  function catFor(name) {
    return catBySlug(name ? slugify(name) : "all") || CATS[0];
  }
  function catHref(c) {
    var qs = [];
    if (c.cat) qs.push("category=" + c.slug);
    if (state.view !== DEFAULT_VIEW) qs.push("view=" + state.view);
    return location.pathname + (qs.length ? "?" + qs.join("&") : "") + "#archive";
  }

  /* the big selector */
  function buildBrowse() {
    var wrap = $(".browse-grid");
    wrap.innerHTML = "";
    CATS.forEach(function (c, i) {
      var a = document.createElement("a");
      a.className = "route" + (c.slug === "all" ? " is-all" : "");
      a.href = catHref(c);
      a.dataset.slug = c.slug;
      a.style.setProperty("--cat", c.color);
      a.style.setProperty("--i", Math.min(i, 11));

      var name = document.createElement("span");
      name.className = "route-name";
      name.appendChild(document.createTextNode(c.label));
      var arrow = document.createElement("span");
      arrow.className = "arrow"; arrow.setAttribute("aria-hidden", "true"); arrow.textContent = "→";
      name.appendChild(arrow);

      var n = document.createElement("span");
      n.className = "route-count";
      n.textContent = c.count + (c.count === 1 ? " project" : " projects");

      a.appendChild(name); a.appendChild(n);
      a.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        applyCategory(c.slug, { scroll: true, push: true });
      });
      wrap.appendChild(a);
    });
  }

  /* ------------------- 4. selected production systems -------------------- */

  function buildSystems() {
    var wrap = $(".systems-list");

    STORIES.forEach(function (s) {
      var projects = PROJECTS.filter(function (p) { return s.projects.indexOf(p.id) !== -1; });
      var pieces = projects.reduce(function (n, p) { return n + pieceCount(p); }, 0);
      var formats = {};
      projects.forEach(function (p) {
        (p.images || []).forEach(function (k) {
          var d = dims(k);
          if (d) formats[(Math.round((d[2] / d[3]) * 20) / 20).toFixed(2)] = 1;
        });
        (p.videos || []).forEach(function (k) {
          var m = vmeta(k);
          if (m) formats[(Math.round((m.w / m.h) * 20) / 20).toFixed(2)] = 1;
        });
      });

      var art = document.createElement("article");
      art.className = "system";
      var inner = document.createElement("div");
      inner.className = "system-inner";

      var text = document.createElement("div");
      text.className = "system-text";

      var meta = document.createElement("p");
      meta.className = "system-meta";
      [["num", "System " + s.number], ["", s.disciplines.join(", ")], ["", s.year]]
        .forEach(function (pair) {
          var sp = document.createElement("span");
          if (pair[0]) sp.className = pair[0];
          sp.textContent = pair[1];
          meta.appendChild(sp);
        });

      var h3 = document.createElement("h3");
      h3.className = "system-title";
      h3.appendChild(document.createTextNode(s.client));
      var nm = document.createElement("span");
      nm.className = "name"; nm.textContent = s.title;
      h3.appendChild(nm);

      var line = document.createElement("p");
      line.className = "system-line";
      line.textContent = s.line;

      var facts = document.createElement("dl");
      facts.className = "system-facts";
      [["Pieces", String(pieces)],
       ["Formats", String(Object.keys(formats).length)],
       ["Channels", String(s.disciplines.length)]].forEach(function (pair) {
        var row = document.createElement("div");
        var dt = document.createElement("dt"); dt.textContent = pair[0];
        var dd = document.createElement("dd"); dd.textContent = pair[1];
        row.appendChild(dt); row.appendChild(dd); facts.appendChild(row);
      });

      var cta = document.createElement("a");
      cta.className = "system-cta";
      cta.href = "case.html?story=" + s.id;
      cta.textContent = "View production system →";

      text.appendChild(meta); text.appendChild(h3); text.appendChild(line);
      text.appendChild(facts); text.appendChild(cta);

      var strip = document.createElement("div");
      strip.className = "system-strip";
      stripKeys(s, projects).forEach(function (k) {
        strip.appendChild(shot(k, s.client + ", " + s.title, false));
      });

      inner.appendChild(text); inner.appendChild(strip);
      art.appendChild(inner);
      wrap.appendChild(art);
    });
  }

  // four pieces from the system itself, spread across its projects
  function stripKeys(s, projects) {
    var keys = [];
    if (s.cover && s.cover.image) keys.push(s.cover.image);
    projects.forEach(function (p) {
      var imgs = p.images || [];
      [imgs[1] || imgs[0], imgs[4] || imgs[2]].forEach(function (k) {
        if (k && keys.indexOf(k) === -1) keys.push(k);
      });
    });
    var flat = [];
    projects.forEach(function (p) { (p.images || []).forEach(function (k) { flat.push(k); }); });
    flat.forEach(function (k) { if (keys.length < 4 && keys.indexOf(k) === -1) keys.push(k); });
    return keys.slice(0, 4);
  }

  function shot(key, alt, big) {
    var fig = document.createElement("figure");
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

  /* -------------------- 5. production capabilities ----------------------- */

  function buildCapabilities() {
    var list = $(".caps-list");
    var preview = $(".caps-preview img");
    var caps = SITE.capabilities || [];
    if (!caps.length) return;

    caps.forEach(function (cap, i) {
      var li = document.createElement("li");
      // the AI line sits lower in the hierarchy: a way of working, not a craft
      if (/^AI/.test(cap[0])) li.className = "is-aside";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cap-btn";
      btn.tabIndex = -1;
      var name = document.createElement("span");
      name.className = "cap-name"; name.textContent = cap[0];
      var what = document.createElement("span");
      what.className = "cap-what"; what.textContent = cap[1];
      btn.appendChild(name); btn.appendChild(what);
      li.appendChild(btn);

      function show() {
        $$(".caps-list li").forEach(function (o) { o.classList.remove("is-on"); });
        li.classList.add("is-on");
        preview.src = cap[3] === "poster" ? posterSrc(cap[2]) : fullSrc(cap[2]);
      }
      li.addEventListener("mouseenter", show);
      btn.addEventListener("focus", show);
      if (i === 0) show();

      list.appendChild(li);
    });
  }


  /* ---------------------- 6. the experience map --------------------------
     Grouped by environment, never by date: several of these ran at the same
     time, and a timeline would read concurrent contract work as an error.
     Every card is a real <button> driving a real panel, so the whole thing
     works from the keyboard and more than one can stay open.
     ----------------------------------------------------------------------- */

  function buildExperience() {
    if (typeof EXPERIENCE === "undefined") return;
    var X = EXPERIENCE;

    $(".exp-eyebrow").textContent = X.eyebrow;
    $(".exp-note").textContent = X.note;
    $(".exp-title").textContent = X.heading;
    $(".exp-intro").textContent = X.intro;

    var mwrap = $(".exp-metrics");
    X.metrics.forEach(function (m, i) {
      var li = document.createElement("li");
      li.className = "metric";
      li.style.setProperty("--i", i);
      var v = document.createElement("p");
      v.className = "metric-value"; v.textContent = m.value;
      var l = document.createElement("p");
      l.className = "metric-label"; l.textContent = m.label;
      li.appendChild(v); li.appendChild(l);
      mwrap.appendChild(li);
    });

    var gwrap = $(".exp-groups");
    X.groups.forEach(function (g) {
      var sec = document.createElement("section");
      sec.className = "exp-group";
      sec.setAttribute("aria-labelledby", "grp-" + g.id);
      sec.style.setProperty("--exp", g.color);

      var head = document.createElement("header");
      head.className = "group-head";
      head.setAttribute("data-reveal", "");
      var num = document.createElement("p");
      num.className = "group-num"; num.textContent = g.number;
      var h3 = document.createElement("h3");
      h3.className = "group-title"; h3.id = "grp-" + g.id; h3.textContent = g.title;
      var blurb = document.createElement("p");
      blurb.className = "group-blurb"; blurb.textContent = g.blurb;
      head.appendChild(num); head.appendChild(h3); head.appendChild(blurb);
      sec.appendChild(head);

      var list = document.createElement("div");
      list.className = "role-list";
      g.roles.forEach(function (r, i) {
        list.appendChild(roleCard(r, i));
      });
      sec.appendChild(list);
      gwrap.appendChild(sec);
    });

    var ach = $(".ach-list");
    X.achievements.forEach(function (a, i) {
      var li = document.createElement("li");
      li.className = "ach";
      li.setAttribute("data-reveal", "");
      li.style.setProperty("--i", i);
      var n = document.createElement("p");
      n.className = "ach-num"; n.textContent = "0" + (i + 1);
      var h4 = document.createElement("h4");
      h4.className = "ach-title"; h4.textContent = a.title;
      var c = document.createElement("p");
      c.className = "ach-copy"; c.textContent = a.copy;
      li.appendChild(n); li.appendChild(h4); li.appendChild(c);
      ach.appendChild(li);
    });

    buildProfile(X.profile);

    var link = $(".resume-link");
    link.textContent = X.resume.label;
    link.href = X.resume.href;
    link.setAttribute("aria-label", X.resume.label + ", opens in a new tab");

    var toggle = $(".profile-toggle"), body = $(".profile-body");
    toggle.addEventListener("click", function () {
      var open = body.hidden;
      body.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  function roleCard(r, i) {
    var art = document.createElement("article");
    art.className = "role";
    art.style.setProperty("--i", i);

    var h4 = document.createElement("h4");
    h4.className = "role-heading";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "role-btn";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "role-" + r.id);

    var top = document.createElement("span");
    top.className = "role-top";
    var co = document.createElement("span");
    co.className = "role-co"; co.textContent = r.company;
    var env = document.createElement("span");
    env.className = "role-env"; env.textContent = r.env;
    top.appendChild(co); top.appendChild(env);

    var title = document.createElement("span");
    title.className = "role-title"; title.textContent = r.role;

    var meta = document.createElement("span");
    meta.className = "role-meta";
    var d = document.createElement("span"); d.textContent = r.dates;
    var loc = document.createElement("span"); loc.textContent = r.location;
    meta.appendChild(d); meta.appendChild(loc);

    var sum = document.createElement("span");
    sum.className = "role-sum"; sum.textContent = r.summary;

    btn.appendChild(top); btn.appendChild(title); btn.appendChild(meta); btn.appendChild(sum);

    if (r.facts && r.facts.length) {
      var facts = document.createElement("span");
      facts.className = "role-facts";
      r.facts.forEach(function (f) {
        var s2 = document.createElement("span");
        s2.className = "fact"; s2.textContent = f;
        facts.appendChild(s2);
      });
      btn.appendChild(facts);
    }

    var mark = document.createElement("span");
    mark.className = "role-mark"; mark.setAttribute("aria-hidden", "true");
    btn.appendChild(mark);
    h4.appendChild(btn);

    var panel = document.createElement("div");
    panel.className = "role-panel";
    panel.id = "role-" + r.id;
    panel.hidden = true;
    var ul = document.createElement("ul");
    r.details.forEach(function (line) {
      var li = document.createElement("li");
      li.textContent = line;
      ul.appendChild(li);
    });
    panel.appendChild(ul);

    btn.addEventListener("click", function () {
      var open = panel.hidden;
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      art.classList.toggle("is-open", open);
    });

    art.appendChild(h4); art.appendChild(panel);
    return art;
  }

  function buildProfile(pr) {
    var body = $(".profile-body");
    var lead = document.createElement("p");
    lead.className = "profile-lead"; lead.textContent = pr.summary;
    body.appendChild(lead);

    var cols = document.createElement("div");
    cols.className = "profile-cols";
    pr.columns.forEach(function (c) {
      var d = document.createElement("div");
      d.className = "profile-col";
      var h = document.createElement("h4");
      h.className = "profile-col-title"; h.textContent = c.title;
      var ul = document.createElement("ul");
      c.items.forEach(function (it) {
        var li = document.createElement("li"); li.textContent = it; ul.appendChild(li);
      });
      d.appendChild(h); d.appendChild(ul);
      cols.appendChild(d);
    });
    body.appendChild(cols);

    var foot = document.createElement("div");
    foot.className = "profile-foot";

    var ed = document.createElement("div");
    ed.className = "profile-col";
    var eh = document.createElement("h4");
    eh.className = "profile-col-title"; eh.textContent = "Education";
    var edl = document.createElement("dl");
    edl.className = "profile-dl";
    [["Institution", pr.education.institution], ["Location", pr.education.location],
     ["Degree", pr.education.degree], ["Dates", pr.education.dates]].forEach(function (pair) {
      var row = document.createElement("div");
      var dt = document.createElement("dt"); dt.textContent = pair[0];
      var dd = document.createElement("dd"); dd.textContent = pair[1];
      row.appendChild(dt); row.appendChild(dd); edl.appendChild(row);
    });
    ed.appendChild(eh); ed.appendChild(edl);

    var la = document.createElement("div");
    la.className = "profile-col";
    var lh = document.createElement("h4");
    lh.className = "profile-col-title"; lh.textContent = "Languages";
    var ldl = document.createElement("dl");
    ldl.className = "profile-dl";
    pr.languages.forEach(function (l) {
      var row = document.createElement("div");
      var dt = document.createElement("dt"); dt.textContent = l.name;
      var dd = document.createElement("dd"); dd.textContent = l.level;
      row.appendChild(dt); row.appendChild(dd); ldl.appendChild(row);
    });
    la.appendChild(lh); la.appendChild(ldl);

    foot.appendChild(ed); foot.appendChild(la);
    body.appendChild(foot);
  }

  /* ------------------------------ 3. archive ----------------------------- */

  function tagCounts() {
    var c = {};
    PROJECTS.forEach(function (p) { p.tags.forEach(function (t) { c[t] = (c[t] || 0) + 1; }); });
    return c;
  }

  function buildFilters() {
    var catWrap = $(".cats");
    catWrap.innerHTML = "";
    CATS.forEach(function (c) { catWrap.appendChild(catTab(c)); });

    var counts = tagCounts();
    var filterable = Object.keys(counts)
      .filter(function (t) { return counts[t] >= TAG_FILTER_MIN; })
      .sort(function (a, b) { return a.localeCompare(b); });

    /* The cross-discipline chips. They sit in the filter line itself, outside
       the tools that collapse behind "Refine", so they stay reachable at every
       width without hover and without opening a panel. */
    var quick = $(".quick-tags");
    if (quick) {
      quick.innerHTML = "";
      QUICK_TAGS.forEach(function (t) {
        if (!counts[t]) return;
        var b = document.createElement("button");
        b.type = "button"; b.className = "quick-tag"; b.dataset.value = t;
        b.setAttribute("aria-pressed", "false");
        var mark = document.createElement("span");
        mark.className = "qt-mark"; mark.setAttribute("aria-hidden", "true");
        mark.textContent = "\u2713";
        var n = document.createElement("span");
        n.className = "qt-n"; n.textContent = counts[t];
        b.appendChild(mark);
        b.appendChild(document.createTextNode(t + " "));
        b.appendChild(n);
        b.addEventListener("click", function () { toggleTag(t); });
        quick.appendChild(b);
      });
    }

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

    /* A filter is only shareable if the reader can get hold of the link. The
       address bar already carries it; this hands it over in one click. */
    var share = $(".share-link"), said = $(".share-said"),
        field = $(".share-url"), sayTimer;
    if (share) {
      share.addEventListener("click", function () {
        var url = shareHref();
        clearTimeout(sayTimer);
        copyText(url).then(function () {
          field.hidden = true;
          share.textContent = "Link copied";
          said.textContent = state.q
            ? "Link copied. Search terms are not part of the link."
            : "Link copied.";
        }, function () {
          /* Some browsers refuse the clipboard off https, and a file:// page
             always does. Put the link on screen instead, selected, so it can
             still be copied by hand rather than silently going nowhere. */
          share.textContent = "Copy link";
          field.hidden = false;
          field.value = url;
          field.focus(); field.select();
          said.textContent = "Copy this link: " + url;
        });
        sayTimer = setTimeout(function () {
          share.textContent = "Copy link"; said.textContent = "";
        }, 6000);
      });
      field.addEventListener("focus", function () { field.select(); });
    }

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

    // "Refine" only exists on narrow screens; on desktop the tools are always
    // out, so the button is hidden by CSS and its state is irrelevant there
    var refine = $(".refine-toggle"), filters = $(".filters");
    refine.addEventListener("click", function () {
      var open = !filters.classList.contains("refine-open");
      filters.classList.toggle("refine-open", open);
      refine.setAttribute("aria-expanded", String(open));
    });

    $$(".clear-filters").forEach(function (b) {
      b.addEventListener("click", function () {
        state.tags = []; state.q = "";
        $(".search input").value = "";
        applyCategory("all", { scroll: false, push: true });
      });
    });

    var search = $(".search input"), t;
    search.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        state.q = search.value.trim(); state.shown = GRID_PAGE; render({ soft: true });
      }, 140);
    });

    $$(".view").forEach(function (b) {
      b.addEventListener("click", function () { setView(b.dataset.view); });
    });

    // the category row is the only thing on the page allowed to scroll
    // sideways, and it says so only when it has somewhere to scroll
    function measureCats() {
      catWrap.classList.toggle("is-scrollable", catWrap.scrollWidth > catWrap.clientWidth + 2);
    }
    window.addEventListener("resize", measureCats);
    catWrap.addEventListener("scroll", measureCats, { passive: true });
    // the first measurement lands before the webfont swaps, which changes the
    // row's width, so take it again once the page has finished settling
    window.addEventListener("load", measureCats);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureCats);
    setTimeout(measureCats, 400);
    measureCats();

    // on a phone the row is scrolled, and the selected tab has to be the one
    // you can see. The first attempt lands before the webfont settles, so
    // take it again once the widths are final.
    var placeTab = function () { scrollTabIntoView(true); };
    window.addEventListener("load", placeTab);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeTab);
    setTimeout(placeTab, 450);
  }

  /* One compact tab per configured category. A button, not a link: it filters
     the list in place rather than going anywhere. */
  function catTab(c) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "cat";
    b.dataset.slug = c.slug;
    b.style.setProperty("--cat", c.color);
    b.setAttribute("aria-pressed", "false");
    b.textContent = c.label;
    b.addEventListener("click", function () {
      applyCategory(c.slug, { scroll: false, push: true });
    });
    return b;
  }

  function toggleTag(t) {
    var i = state.tags.indexOf(t);
    if (i === -1) state.tags.push(t); else state.tags.splice(i, 1);
    state.shown = GRID_PAGE;
    writeURL(true, "#archive");
    writeTitle();
    render();
  }

  /* Every surface that shows the current selection is written here, so the
     tiles, the tabs, the heading, the counts and the URL can never disagree. */
  function syncFilters() {
    var active = catFor(state.cat);

    $$(".browse-grid .route").forEach(function (a) {
      var on = a.dataset.slug === active.slug;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
      a.href = catHref(catBySlug(a.dataset.slug));
    });

    $$(".cats .cat").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.slug === active.slug));
    });

    $$(".tag-list .tag, .quick-tags .quick-tag").forEach(function (b) {
      b.setAttribute("aria-pressed", String(state.tags.indexOf(b.dataset.value) !== -1));
    });
    $$(".view").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.view === state.view));
    });

    /* Tags that already have a chip in the filter line are not repeated here:
       the chip is the control, and two pills for one tag read as two filters. */
    var bar = $(".active-tags");
    bar.innerHTML = "";
    state.tags.forEach(function (t) {
      if (QUICK_TAGS.indexOf(t) !== -1) return;
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
    var narrowed = !!state.cat || state.tags.length > 0 || !!state.q;
    $$(".clear-filters").forEach(function (b) { b.hidden = !narrowed; });

    /* Only offered when the URL actually carries the selection. A search-only
       view has nothing to put in a link, so the button stays away. */
    var share = $(".share-link");
    if (share) {
      var shareable = !!state.cat || state.tags.length > 0;
      share.hidden = !shareable;
      if (shareable) {
        share.title = "Copy a link to this selection: " + shareHref();
      } else {
        share.textContent = "Copy link";
        $(".share-said").textContent = "";
        $(".share-url").hidden = true;
      }
    }
  }

  // keep the selected tab in view when the row scrolls sideways on a phone
  function scrollTabIntoView(instant) {
    var row = $(".cats");
    var on = $('.cats .cat[aria-pressed="true"]');
    if (!row || !on || row.scrollWidth <= row.clientWidth + 2) return;
    var want = Math.max(0, on.offsetLeft - (row.clientWidth - on.offsetWidth) / 2);
    // placing it on load should not animate; only a category the reader just
    // picked is worth sliding to
    if (instant === true || prefersReduced()) row.scrollLeft = want;
    else row.scrollTo({ left: want, behavior: "smooth" });
  }

  /* ------------------------------- rendering ------------------------------
     `render` swaps the list. `opts.soft` skips the leave step for changes the
     user is typing through; otherwise the old grid steps out, the new one
     steps in. Both states are cleared by a timer as well as by the animation,
     so a stalled clock can never leave the archive blank.
     ----------------------------------------------------------------------- */

  var swapTimer = null, enterTimer = null;

  function render(opts) {
    opts = opts || {};
    var grid = $("#grid");
    if (opts.soft || prefersReduced() || grid.hidden) { paint(); return; }

    // hold the height so the page does not jump while the grid is out
    var h = grid.getBoundingClientRect().height;
    if (h > 40) grid.style.minHeight = h + "px";
    grid.classList.add("is-out");
    clearTimeout(swapTimer);
    swapTimer = setTimeout(function () {
      grid.classList.remove("is-out");
      paint();
      grid.classList.add("is-in");
      clearTimeout(enterTimer);
      enterTimer = setTimeout(function () {
        grid.classList.remove("is-in");
        grid.style.minHeight = "";
      }, 900);
    }, 150);
  }

  function paint() {
    var all = visibleProjects();
    var filtered = !!state.cat || state.tags.length > 0 || !!state.q;
    var grid = $("#grid"), indexWrap = $(".index-wrap");
    var curated = state.view === "curated" && !filtered;

    var list, more = 0;
    if (curated) {
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
    grid.className = "grid " + (curated ? "is-curated" : "is-uniform") +
      (grid.classList.contains("is-in") ? " is-in" : "");

    if (state.view === "index") {
      renderIndex(all);
    } else {
      $(".index-table tbody").innerHTML = "";
      $(".index-peek").classList.remove("is-on");
      list.forEach(function (p, i) {
        var el = entry(p, i + 1, curated);
        el.style.setProperty("--i", Math.min(i, 7));   // stagger the first eight only
        grid.appendChild(el);
      });
    }

    var count = filtered
      ? all.length + (all.length === 1 ? " project" : " projects")
      : (curated ? "12 selected of " + PROJECTS.length
                 : all.length + " projects");
    var heading = state.cat || "All work";
    if (state.tags.length) {
      heading = (state.cat ? state.cat + " \u00b7 " : "") + state.tags.join(" + ");
    }
    $(".work-title").textContent = heading;
    $(".work-count").textContent = count;
    $(".filter-count").textContent = count;

    var btn = $(".more-btn");
    if (curated) {
      btn.hidden = false;
      btn.textContent = "View all " + all.length + " projects";
      btn.onclick = function () { setView("grid"); };
    } else if (more > 0) {
      btn.hidden = false;
      btn.textContent = "View more projects (" + more + " left)";
      btn.onclick = function () { state.shown += GRID_PAGE; render({ soft: true }); };
    } else {
      btn.hidden = true;
    }

    $(".empty").hidden = all.length !== 0;
    syncFilters();
  }

  /* One cover. The artwork is shown as shot, with no tint or gradient over
     it; a solid panel in the category colour carries the words. */
  function entry(p, number, curated) {
    var cover = coverKey(p);
    var conf = catFor(p.category);

    var art = document.createElement("article");
    art.className = "entry cat-" + conf.slug + (curated ? " is-curated-card" : "");
    art.setAttribute("data-category", p.category);
    art.style.setProperty("--cat", conf.color);

    var link = document.createElement("a");
    link.className = "entry-link";
    link.href = "#" + p.id;
    link.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault(); openProject(p.id, true);
    });

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
    img.loading = number <= 8 ? "eager" : "lazy";
    img.decoding = "async";
    img.alt = altFor(p, 0);
    fig.appendChild(img);

    if (hasMotion(p)) {
      var badge = document.createElement("span");
      badge.className = "entry-play";
      var m0 = vmeta(p.videos[0]);
      badge.textContent = "▶ " + (m0 ? clock(m0.dur) : "Play");
      fig.appendChild(badge);
      attachLoop(link, fig, p.videos[0]);
    }

    // solid panel, no transparency, no gradient
    var panel = document.createElement("div");
    panel.className = "entry-panel";
    var title = document.createElement("h3");
    title.className = "entry-title"; title.textContent = p.title;
    var meta = document.createElement("p");
    meta.className = "entry-meta";
    meta.textContent = p.client + (p.year ? " · " + p.year : "");
    var arrow = document.createElement("span");
    arrow.className = "arrow"; arrow.setAttribute("aria-hidden", "true"); arrow.textContent = "↗";
    panel.appendChild(title); panel.appendChild(meta); panel.appendChild(arrow);
    fig.appendChild(panel);

    link.appendChild(fig);
    art.appendChild(link);
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

      [["c-client", p.client], ["c-project", p.title], ["c-disc", p.category],
       ["c-pieces", piecesLabel(p)], ["c-formats", formatsLabel(p)], ["c-year", p.year || ""]]
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
      mtd.colSpan = 6;
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

  /* ------------------------------ routing --------------------------------
     One door in and out of a category change, used by the tiles, the tabs,
     the tag links and the history. Nothing else may set state.cat.
     ----------------------------------------------------------------------- */

  var BASE_TITLE = "";

  // filters people share get their own document title
  function writeTitle() {
    if (!BASE_TITLE) BASE_TITLE = document.title;
    var quick = state.tags.length === 1 && QUICK_TAGS.indexOf(state.tags[0]) !== -1;
    if (state.cat === "AI") document.title = "AI Work | " + SITE.name;
    else if (quick && !state.cat) document.title = state.tags[0] + " Work | " + SITE.name;
    else document.title = BASE_TITLE;
  }

  function filterQuery() {
    var qs = [];
    if (state.cat) qs.push("category=" + slugify(state.cat));
    if (state.tags.length) qs.push("tag=" + state.tags.map(slugify).join(","));
    if (state.view !== DEFAULT_VIEW) qs.push("view=" + state.view);
    return qs.length ? "?" + qs.join("&") : "";
  }

  /* The link a reader can hand to someone else. Absolute, and always pointed
     at the archive, so it opens on the work and not on the cover. */
  function shareHref() {
    return location.origin + location.pathname + filterQuery() + "#archive";
  }

  function copyText(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(t);
    }
    return new Promise(function (res, rej) {
      var ta = document.createElement("textarea");
      ta.value = t; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select(); ta.setSelectionRange(0, t.length);
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? res() : rej(new Error("copy blocked"));
    });
  }

  function writeURL(push, hash) {
    var url = location.pathname + filterQuery() + (hash || "");
    if (push) history.pushState(null, "", url);
    else history.replaceState(null, "", url);
  }

  function applyCategory(slug, opts) {
    opts = opts || {};
    var c = catBySlug(String(slug || "all").toLowerCase()) || CATS[0];
    state.cat = c.cat;
    state.shown = GRID_PAGE;
    // curated is a hand-picked twelve; narrowing to one discipline leaves it
    if (c.cat && state.view === "curated") state.view = "grid";
    if (opts.push !== false) writeURL(true, "#archive");
    writeTitle();
    render(opts);
    scrollTabIntoView();
    if (opts.scroll) {
      var head = $(".work-head");
      var top = head.getBoundingClientRect().top + window.pageYOffset -
                ($(".masthead").getBoundingClientRect().height + 16);
      window.scrollTo({ top: Math.max(0, top), behavior: prefersReduced() ? "auto" : "smooth" });
    }
  }

  function setView(v) {
    if (state.view === v) return;
    state.view = v;
    state.shown = GRID_PAGE;
    writeURL(true, "#archive");
    render({ light: true });
  }

  // The URL carries category, tag and view. The search box is not in it, so a
  // history move has to clear it or a stale query keeps filtering.
  function applyURL(fromPop) {
    var q = new URLSearchParams(location.search);
    var view = q.get("view");
    state.view = (view === "grid" || view === "index" || view === "curated") ? view : DEFAULT_VIEW;
    state.tags = tagsFromParam(q.get("tag"));
    state.q = "";
    var box = $(".search input");
    if (box) box.value = "";
    applyCategory(q.get("category") || "all", { push: false, soft: !fromPop });

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
      caseLink.textContent = "View the " + story.client + " production system →";
    } else {
      caseLink.hidden = true;
    }

    // some projects ship as a running prototype rather than a flat export
    var live = $(".viewer-live");
    /* Most links point at a published prototype; a few point at the live
       site the client actually runs. `linkLabel` names which. */
    if (p.link) {
      live.hidden = false; live.href = p.link;
      live.textContent = (p.linkLabel || "Open the live prototype") + " \u2197";
    }
    else { live.hidden = true; live.removeAttribute("href"); }

    var facts = $(".viewer-facts");
    facts.innerHTML = "";
    addFact(facts, "Client", p.client);
    if (p.year) addFact(facts, "Year", p.year);
    addFact(facts, "Discipline", p.category);
    addFact(facts, "Pieces", String(pieceCount(p)));
    var f = formatCount(p);
    if (f > 1) addFact(facts, "Formats", String(f));

    var tags = $(".viewer-tags");
    tags.innerHTML = "";
    p.tags.forEach(function (t) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button"; b.textContent = t;
      b.addEventListener("click", function () {
        // a tag jump is a category change too: same door, so nothing drifts
        closeViewer(true);
        state.tags = [t]; state.q = "";
        if (state.view === "curated") state.view = "grid";
        $(".search input").value = "";
        applyCategory("all", { scroll: true, push: true });
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
      watchOffscreen(v);
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

  /* A clip that scrolls out of the panel stops playing: no audio or decoding
     work continues behind the reader's back. */
  var offscreen = null;
  function watchOffscreen(v) {
    if (!window.IntersectionObserver) return;
    if (!offscreen) {
      offscreen = new IntersectionObserver(function (rows) {
        rows.forEach(function (r) { if (!r.isIntersecting && !r.target.paused) r.target.pause(); });
      }, { root: $(".viewer-body"), threshold: 0.05 });
    }
    offscreen.observe(v);
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
    if (offscreen) { offscreen.disconnect(); offscreen = null; }
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

    $(".cover-eyebrow").textContent = [SITE.name, SITE.role, SITE.location].join(" · ");
    $(".cover-headline .reveal").textContent = SITE.headline;
    $(".cover-support").textContent = SITE.support;
    $(".cover-issue").textContent = SITE.issue;
    $(".about-statement .reveal").textContent = SITE.statement;
    $(".contact-role").textContent = SITE.role;
    $(".contact-place").textContent = SITE.location;

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
    var darks = [$(".caps"), $(".contact")].filter(Boolean);
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

  buildCatConfig();
  fillChrome();
  buildBrowse();
  buildFilters();
  buildSystems();
  buildCapabilities();
  buildExperience();

  var start = applyURL(false);
  measureHeader();

  /* A cold load of /index.html#experience lands nowhere: the browser scrolls
     to the fragment before JS has built the archive, and the target then moves
     down the page. Re-apply it once the sections have their real height. */
  (function landOnHash() {
    var id = location.hash.replace("#", "");
    if (!id || PROJECTS.some(function (p) { return p.id === id; })) return;
    var el = document.getElementById(id);
    if (!el) return;
    // "instant", not "auto": html has scroll-behavior smooth, and nobody wants
    // to watch the page glide six thousand pixels on arrival
    var place = function () {
      var top = el.getBoundingClientRect().top + window.pageYOffset -
                parseFloat(getComputedStyle(el).scrollMarginTop || 0);
      window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
    };
    place();
    // once more after the webfont and the lazy images have settled the layout
    setTimeout(place, 320);
    window.addEventListener("load", function () { setTimeout(place, 60); });
  })();

  watchHeader();
  armReveals();
  if (start) openProject(start, false);
})();
