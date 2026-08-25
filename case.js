/* =========================================================================
   Case study renderer. Reads ?story=<id> and builds the long-form page from
   data/stories.js, using assets that already exist in the portfolio.
   ========================================================================= */

(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };

  function fullSrc(k) { return "assets/full/" + k + ".webp"; }
  function posterSrc(k) { return "assets/poster/" + k + ".webp"; }
  function videoSrc(k) { return "assets/video/" + k + ".mp4"; }
  function dims(k) { return IMAGES[k] || null; }
  function vmeta(k) { return (typeof VIDEOS !== "undefined" && VIDEOS[k]) || null; }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function figure(key, alt, eager) {
    var fig = el("figure", "case-figure");
    var img = el("img");
    img.src = fullSrc(key);
    var d = dims(key);
    if (d) { img.width = d[2]; img.height = d[3]; }
    img.alt = alt || "";
    img.loading = eager ? "eager" : "lazy";
    img.decoding = "async";
    fig.appendChild(img);
    return fig;
  }

  function videoFig(key, alt) {
    var fig = el("figure", "case-figure");
    var v = el("video");
    v.src = videoSrc(key);
    v.poster = posterSrc(key);
    v.controls = true; v.playsInline = true; v.preload = "none";
    var m = vmeta(key);
    if (m) { v.width = m.w; v.height = m.h; }
    v.setAttribute("aria-label", alt || "");
    // never let two clips play at once
    v.addEventListener("play", function () {
      Array.prototype.forEach.call(document.querySelectorAll("video"), function (o) {
        if (o !== v) o.pause();
      });
    });
    fig.appendChild(v);
    return fig;
  }

  function caption(text, parent) {
    if (!text) return;
    parent.appendChild(el("p", "case-cap", text));
  }

  function render(story) {
    var root = $(".case");
    document.title = story.client + " — " + story.title + " — " + SITE.name;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", story.line);

    /* 1. hero */
    var hero = el("header", "case-hero");
    var bg = el("div", "case-hero-bg");
    var bgImg = el("img");
    bgImg.src = fullSrc(story.cover.image);
    bgImg.alt = ""; bgImg.decoding = "async"; bgImg.fetchPriority = "high";
    bg.appendChild(bgImg);
    hero.appendChild(bg);

    var hi = el("div", "case-hero-inner");
    var eyebrow = el("p", "case-eyebrow");
    eyebrow.appendChild(el("span", "num", "System " + story.number));
    eyebrow.appendChild(el("span", null, story.disciplines.join(", ")));
    eyebrow.appendChild(el("span", null, story.year));
    hi.appendChild(eyebrow);

    var h1 = el("h1", "case-title");
    h1.appendChild(document.createTextNode(story.client));
    h1.appendChild(el("span", "name", story.title));
    hi.appendChild(h1);
    hi.appendChild(el("p", "case-line", story.line));
    hero.appendChild(hi);
    root.appendChild(hero);

    /* 2. client, year, role, deliverables */
    var facts = el("dl", "case-facts");
    [["Client", story.client], ["Year", story.year], ["Role", story.role]].forEach(function (pair) {
      var d = el("div");
      d.appendChild(el("dt", null, pair[0]));
      d.appendChild(el("dd", null, pair[1]));
      facts.appendChild(d);
    });
    var dv = el("div");
    dv.appendChild(el("dt", null, "Deliverables"));
    var dd = el("dd");
    var ul = el("ul");
    story.deliverables.forEach(function (x) { ul.appendChild(el("li", null, x)); });
    dd.appendChild(ul); dv.appendChild(dd); facts.appendChild(dv);
    root.appendChild(facts);

    /* 3+. the sections, in order */
    story.sections.forEach(function (sec) {
      var alt = story.client + ", " + story.title;

      if (sec.kind === "text") {
        var s = el("section", "case-sec is-text");
        s.appendChild(el("h2", null, sec.title));
        s.appendChild(el("p", "body", sec.body));
        root.appendChild(s);

      } else if (sec.kind === "quote") {
        root.appendChild(el("blockquote", "case-quote", sec.text));

      } else if (sec.kind === "full") {
        var f = el("section", "case-sec case-full");
        f.appendChild(figure(sec.image, alt));
        caption(sec.caption, f);
        root.appendChild(f);

      } else if (sec.kind === "duo" || sec.kind === "trio") {
        var g = el("section", "case-sec " + (sec.kind === "duo" ? "case-duo" : "case-trio"));
        var row = el("div", "row");
        sec.images.forEach(function (k) { row.appendChild(figure(k, alt)); });
        g.appendChild(row);
        caption(sec.caption, g);
        root.appendChild(g);

      } else if (sec.kind === "aside") {
        var a = el("section", "case-sec case-aside");
        a.appendChild(figure(sec.image, alt));
        var box = el("div");
        box.appendChild(el("h3", null, sec.title));
        box.appendChild(el("p", null, sec.body));
        a.appendChild(box);
        root.appendChild(a);

      } else if (sec.kind === "reel") {
        var r = el("section", "case-sec case-reel");
        var inner = el("div", "inner");
        var rrow = el("div", "row");
        sec.videos.forEach(function (k) { rrow.appendChild(videoFig(k, alt)); });
        inner.appendChild(rrow);
        caption(sec.caption, inner);
        r.appendChild(inner);
        root.appendChild(r);
      }
    });

    /* next project */
    var nextStory = STORIES.filter(function (s) { return s.id === story.next; })[0];
    var next = el("section", "case-next");
    var ni = el("div", "case-next-inner");
    if (nextStory) {
      var a2 = el("a");
      a2.href = "case.html?story=" + nextStory.id;
      a2.appendChild(el("p", "lbl", "Next production system"));
      var nm = el("div", "nm");
      nm.appendChild(document.createTextNode(nextStory.client));
      nm.appendChild(el("span", null, nextStory.title));
      a2.appendChild(nm);
      ni.appendChild(a2);
    }
    var back = el("a", "case-back", "← All work");
    back.href = "index.html#archive";
    ni.appendChild(back);
    next.appendChild(ni);
    root.appendChild(next);
  }

  /* boot */
  $(".wordmark-name").textContent = SITE.name;
  $(".wordmark-role").textContent = SITE.role;
  $(".foot-name").textContent = "© " + new Date().getFullYear() + " " + SITE.name;

  var id = new URLSearchParams(location.search).get("story");
  var story = STORIES.filter(function (s) { return s.id === id; })[0];
  if (story) render(story);
  else $(".case-missing").hidden = false;
})();
