# Luis Moreno, portfolio site

**https://luismorenorz.github.io/portfolio/**

A static production-design portfolio built from the Figma file
*Oct-2025-Luis-Moreno-Resume* plus a folder of motion work. 70 projects, 219
pieces, 10 disciplines. No build step, no dependencies. Anyone with the link
can see the work.

Production first, case studies second: the work is two scrolls from the top.

## The seven parts

1. **Living cover** — 100svh, composed from four real pieces at four scales
   (advertising, email, retail, motion), cropped by the edges, with a little
   parallax. No placeholder, and no single channel dominating.
2. **Quick production menu** — a full-bleed matrix of routes with live counts:
   All work first, then Advertising, Motion, Email, then the rest. Once it
   scrolls away it returns as a compact sticky bar (Work / Advertising /
   Motion / Email / More), which steps aside while the archive's own filter
   bar owns the sticky band.
3. **Work archive** — the whole 70 in three views: **Grid** (the default),
   Curated and Index. Every card is a cover: the artwork full bleed at 4:5, a
   discipline-coloured scrim over it, and the four things a reviewer needs in
   three seconds — discipline, client and year, project name, and how many
   pieces in how many formats. Unfiltered, the grid deals the results
   round-robin across the disciplines, so the first screen shows the range
   rather than whichever discipline happens to come first in the file.
4. **Selected production systems** — Greenhouse, Rove and Café Café, each a
   compact horizontal band with counted pieces, formats and channels, and a
   long-form case study behind it.
5. **Production capabilities** — eleven lines from brief to shippable file,
   with a preview panel. AI sits lower in the hierarchy: a way of working,
   not a headline craft.
6. **About** — the statement and the body copy.
7. **Contact** — near-black, the email at full scale.

Every number on the page is measured from the files, never estimated: piece
counts are the images and clips themselves, and "formats" is the count of
distinct aspect ratios actually present in a project.

## The card colour system

One small palette of dark, muted colours, keyed by discipline in
`site/styles.css`. Related disciplines share a family on purpose, so the
archive reads as seven signals rather than ten:

    Email                  terracotta   147 70 51
    Advertising, Social    cobalt        40 71 154
    Motion, AI             violet        85 59 120
    Retail, Packaging      forest        64 90 69
    Web & UI               deep teal     24 92 104
    Branding               oxblood      104 57 75
    Presentations          slate         63 70 86

Each card gets `data-category`, a `cat-<slug>` class and a `--cat-rgb` custom
property; nothing is styled per project. To recolour a discipline, change one
line under "the category colour system". Two layers sit over the artwork: a
constant scrim that owns the text contrast, and a flat tint that thins from
30% to 14% on hover so more of the artwork shows without the words ever
getting harder to read. Every family clears WCAG AA against a pure-white
photograph, the worst case.

## URLs worth knowing

    ?view=grid | ?view=curated | ?view=index      how the archive is shown
    (grid is the default, so it is the one view the URL leaves out)
    ?category=email                                one discipline
    ?category=email&view=index#archive             both together
    #project-id                                    opens that project's panel
    case.html?story=greenhouse                     a long-form case study

Back, Forward and reload all restore the view and the category. Tags and the
search box are deliberately not in the URL, so a history move clears them.

## Update the live site

The repo mirrors this folder, with the contents of `site/` at the root. To
publish a change:

```bash
cd /path/to/your/clone-of-portfolio
# copy in whatever you changed, e.g. the data file:
#   cp "…/Portfolio/site/data/projects.js" data/projects.js
git add -A
git commit -m "Update projects"
git push
```

GitHub Pages rebuilds in about a minute.

Don't have the clone yet? `gh repo clone luismorenorz/portfolio`

## Edit the content

Everything you'd want to change lives in **`site/data/projects.js`**. Open it
in any text editor.

**Your details** are at the top, in `SITE`: name, role, the headline sentence,
the supporting line, the three proof points, email, links, the About
paragraphs and the capability list.

### The cover

The hero is a composition of four real pieces, not a portrait. Which four, and
how they sit, is the `COVER` array near the top of `site/app.js`:

```js
var COVER = [
  { cls: "p1", key: "156-113", kind: "image" },   // advertising, dominant
  { cls: "p2", key: "2-10",    kind: "image" },   // tall email, bottom left
  { cls: "p3", key: "171-31",  kind: "image" },   // retail, bottom centre
  { cls: "p4", key: "…",       kind: "poster" }   // a motion frame, top
];
```

`kind: "image"` reads from `assets/thumb`, `kind: "poster"` from
`assets/poster` (any clip name works). Their positions are the `.cover-piece`
rules in `styles.css`; they are placed around a clear channel so nothing sits
behind the type.

The words come from `SITE` in `site/data/projects.js`: `headline`, `support`,
`proofs` (the three lines under the supporting copy), `issue`, `location`, and
`statement` for the About section. `capabilities` drives the capability
matrix: `[name, what it is, preview key, "image" | "poster"]`.

### Each project

```js
{
  id:       "rove-campaigns",              // used in the URL, keep it unique
  title:    "Cannabis lifestyle email campaigns",
  client:   "Rove",
  category: "Email",                        // one of the CATEGORIES list
  tags:     ["Email", "Campaign", "Cannabis"],   // as many as you like
  year:     "2025",                         // delete the line if unknown
  summary:  "One or two sentences.",
  images:   ["2-10", "2-5", "2-6"]          // file names, no extension
}
```

- **Which image shows on the tile**: the first one in `images`. Move a
  different file name to the front to change that tile's cover. Tiles crop to
  4:5 from the top, so put the strongest part of the piece up there.
- **Add a tag**: type it into the `tags` array. A tag becomes a filter once
  three projects share it; below that it still shows on the project and stays
  clickable from the preview panel.
- **Add motion**: `videos: ["slug"]`, alongside or instead of `images`. Run
  `python3 build/motion.py <folder>` first to encode the clips.
- **Reorder projects**: move the block up or down. The page follows file order.
- **Hide a project**: delete its block. The image files can stay.
- **Change a category**: keep to the ten in the `CATEGORIES` list at the top,
  or edit that list. The quick menu's routes are `ROUTES_LEAD` and
  `ROUTES_REST` in `site/app.js`; their counts are read from the data.
- **Change the line above the headline**: `issue: "Selected work"`.

## Add new work later

1. Export the artwork as PNG or JPG.
2. Drop it in `build/raw/<any-folder>/my-piece.png`.
3. Run `python3 build/optimize.py`. It writes the web versions into
   `site/assets/full/` and `site/assets/thumb/`, and refreshes the size index.
4. Copy the new dimensions line into `site/data/images.js` (the script
   regenerates `build/images.json`; the one-liner that turns it into
   `images.js` is in the project history, or re-run it here:
   `python3 -c "import json;d=json.load(open('build/images.json'));open('site/data/images.js','w').write('const IMAGES = '+json.dumps({k:[v['tw'],v['th'],v['w'],v['h']] for k,v in sorted(d.items())},separators=(',',':'))+';')"`)
5. Add a project block in `site/data/projects.js` pointing at the new file name.

## What's in each folder

```
site/            the website, the only folder you need to publish
  index.html         the seven parts
  case.html          the case-study template, driven by ?story=
  styles.css         the shell
  case.css           the long-form layer
  app.js             cover, menu, archive, systems, capabilities, panel
  case.js            renders one story
  data/projects.js   ← all 70 projects and your details
  data/stories.js    ← the three production systems / case studies
  data/images.js     ← auto-generated image sizes
  data/videos.js     ← auto-generated clip sizes and durations
  assets/full/       166 full-size WebP images
  assets/thumb/      166 grid thumbnails
  assets/video/      54 clips, assets/preview/ hover loops, assets/poster/ stills

build/           the extraction pipeline, kept for re-runs. Not published.
  manifest.tsv       every artboard pulled out of Figma
  sheets/            the raw Figma exports (large, safe to delete)
  raw/               the sliced PNGs at full quality (346 MB, your archive)
  contact/           labelled contact sheets of everything
  slice.py           cuts the Figma sheets into single artboards
  optimize.py        makes the WebP versions
  motion.py          encodes video and GIF into web assets
  serve.js           tiny local web server
```

`build/raw/` is your full-resolution archive. Worth keeping, but do not upload
it with the site.

## A note on the source Figma file

The extraction grouped artboards temporarily to export them in batches, then
ungrouped everything. The file ended exactly as it started, with 165 top-level
nodes and no leftover groups.

## The three production systems

They live in `site/data/stories.js`. Each one lists the project ids it draws
from, so the archive and the case study can never drift apart — the piece,
format and channel counts on the homepage are computed from those projects —
and a list of sections. A section is one of `text`, `full`, `duo`, `trio`, `aside`, `quote`
or `reel`, which is how the layout changes as you read.

Everything in them is written from what is visible in the work. No invented
results, metrics or testimonials.
