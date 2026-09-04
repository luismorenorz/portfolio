# Luis Moreno, portfolio site

**https://luismorenorz.github.io/portfolio/**

A static production-design portfolio built from the Figma file
*Oct-2025-Luis-Moreno-Resume* plus a folder of motion work. 76 projects, 232
pieces, 10 disciplines. No build step, no dependencies. Anyone with the link
can see the work.

Production first, case studies second: the work is two scrolls from the top.

## The eight parts

1. **Cover** — one full-bleed photograph with the copy in the negative space
   the frame already leaves on the left. The hero height tracks the picture's
   own 2.21:1 proportion, and the phone gets its own 4:5 crop of the same
   file rather than a squeezed version of the desktop one.
2. **Browse by discipline** — a six-column matrix of all eleven selectors
   with live counts. Selecting one fills that tile in its category colour,
   updates the archive in place and writes the URL; nothing reloads.
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
6. **Experience map** — a decade of roles grouped by the kind of environment
   they happened in, never plotted on a time axis: several ran at the same
   time and a timeline would read concurrent contract work as a mistake. Each
   card opens in place into the full résumé detail; Full Profile folds skills,
   tools, education and languages away until asked for.
7. **About** — the statement and the body copy set on a second full-bleed
   photograph, heading and body on deliberately different left offsets.
8. **Contact** — near-black, the email at full scale.

Every number on the page is measured from the files, never estimated: piece
counts are the images and clips themselves, and "formats" is the count of
distinct aspect ratios actually present in a project.

## One category configuration

`CAT_COLOR` and `CAT_ORDER` near the top of **`site/app.js`** are the only
place categories are described. `buildCatConfig()` turns them into `CATS`,
a list of `{slug, label, cat, color, order, count}` with the counts read from
the projects. The big tiles, the sticky tabs, the card panels and the URLs
are all built from that one list, so they cannot drift apart.

    All work        #171714
    Advertising     #7c2837      Social          #7c2837
    Email           #a24b32
    Motion          #2a2927      AI              #2a2927
    Retail          #455148      Packaging       #455148
    Web & UI        #28575a
    Branding        #68313a
    Presentations   #444b52

Every one of them clears WCAG AA behind white text (5.85:1 at worst). Cards
carry the colour as `--cat` on a solid panel over the bottom third of the
artwork; the image itself is never tinted.

Every entry point runs through `applyCategory(slug, opts)`, which sets the
state, syncs both selectors, rewrites the heading, the counts and the URL,
and animates the swap. Nothing else may set the active category.

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
  index.html         the eight parts
  case.html          the case-study template, driven by ?story=
  styles.css         the shell
  case.css           the long-form layer
  app.js             menu, archive, systems, capabilities, experience, panel
  case.js            renders one story
  data/projects.js   ← all 74 projects and your details
  data/stories.js    ← the three production systems / case studies
  data/experience.js ← the roles, metrics, achievements and full profile
  assets/documents/  the résumé PDF the Experience section links to
  data/images.js     ← auto-generated image sizes
  data/videos.js     ← auto-generated clip sizes and durations
  assets/full/       166 full-size WebP images
  assets/thumb/      166 grid thumbnails
  assets/video/      54 clips, assets/preview/ hover loops, assets/poster/ stills
                     keys are <project-id>-NN; provenance in MOTION-MANIFEST.md

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

## Where the motion came from

`MOTION-MANIFEST.md` maps every clip back to its original Google Drive file:
Drive filename, original size, local key, optimized size, dimensions, project,
category and AI flag. The 1.28 GB of originals stay in Drive; the repository
carries 46 MB of optimized MP4 plus 3 MB of hover loops and 2 MB of posters.
Nothing over 8 MB is committed.

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
