# Luis Moreno, portfolio site

**https://luismorenorz.github.io/portfolio/**

A static portfolio built from the Figma file *Oct-2025-Luis-Moreno-Resume* plus
a folder of motion work. 70 projects, 219 pieces, 10 disciplines. No build
step, no dependencies. Anyone with the link can see the work.

## The six chapters

1. **Living cover** — 100svh, composed from four real pieces at four scales,
   cropped by the edges, with a little parallax. No placeholder.
2. **Selected stories** — Greenhouse, Rove and Café Café, each with its own
   composition and its own long-form case study.
3. **Discipline reel** — one sticky stage over a tall track. The word, the
   background and the count change as you scroll. Touch gets chapters instead.
4. **Work archive** — the whole 70 in three views: Curated, Grid, Index.
5. **About manifesto** — a statement, the body copy, and the capability list.
6. **Contact stage** — near-black, the email at full scale.

## URLs worth knowing

    ?view=curated | ?view=grid | ?view=index      how the archive is shown
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
email, links, the About paragraphs and the "What I do" list.

### The cover

The hero is a composition of four real pieces, not a portrait. Which four, and
how they sit, is the `COVER` array near the top of `site/app.js`:

```js
var COVER = [
  { cls: "p1", key: "171-31",  kind: "image" },   // dominant, right
  { cls: "p2", key: "2-10",    kind: "image" },   // tall email, bottom left
  { cls: "p3", key: "3-17-10", kind: "image" },   // branding, bottom centre
  { cls: "p4", key: "…",       kind: "poster" }   // a motion frame, top
];
```

`kind: "image"` reads from `assets/thumb`, `kind: "poster"` from
`assets/poster` (any clip name works). Their positions are the `.cover-piece`
rules in `styles.css`; they are placed around a clear channel so nothing sits
behind the type.

The words come from `SITE` in `site/data/projects.js`: `headline`, `support`,
`issue`, `location`, and `statement` for the About section.

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
- **Change a category**: keep to the eight in the `CATEGORIES` list at the top,
  or edit that list.
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
  index.html         the six chapters
  case.html          the case-study template, driven by ?story=
  styles.css         the shell
  case.css           the long-form layer
  app.js             cover, stories, reel, archive, panel
  case.js            renders one story
  data/projects.js   ← all 70 projects and your details
  data/stories.js    ← the three case studies
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

## The three case studies

They live in `site/data/stories.js`. Each one lists the project ids it draws
from, so the archive and the case study can never drift apart, and a list of
sections. A section is one of `text`, `full`, `duo`, `trio`, `aside`, `quote`
or `reel`, which is how the layout changes as you read.

Everything in them is written from what is visible in the work. No invented
results, metrics or testimonials.
