# Luis Moreno, portfolio site

A static portfolio built from the Figma file *Oct-2025-Luis-Moreno-Resume*.
54 projects, 165 pieces, filterable by category and tag. No build step and no
dependencies. Anyone with the link can see the work.

A cover at the top, then every project as an equal tile, three across. Click
a tile and a preview sheet slides up over the page, with the grid still
visible behind it and all of that project's pieces stacked so you can scroll
through them. Arrow keys move between projects; Esc or a click outside closes
it.

Every tile is also a real link, so cmd-click (or the **Open in new tab ↗**
button in the preview) opens that project on its own page. Useful for sending
someone a single project instead of the whole site.

## Look at it locally

Double-click `site/index.html`. It works straight off the disk.

If you'd rather run it on a local server (closer to how it behaves once
published):

```bash
node build/serve.js
```

Then open http://localhost:8788

## Live site

**https://luismorenorz.github.io/portfolio/**

Hosted on GitHub Pages from the repo `luismorenorz/portfolio`. The link is
public. Put it on your CV, on LinkedIn, in emails.

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

### The hero photo, replace this first

```js
cover:    { image: "portrait-placeholder.webp", caption: "" },
portrait: { image: "3-17-09", caption: "Café Café brand identity" },
```

`cover` is the big photo at the top, and right now it holds **a placeholder**:
a grey figure that says "your photo here". Swap it for a photo of yourself:

1. Drop the file into `site/assets/full/`, say `luis.jpg`.
2. Write the file name here, extension and all:
   `cover: { image: "luis.jpg", caption: "" }`

It crops to a tall 4:5 on desktop and a wide 3:2 on phones, both from the
centre, so a portrait-orientation shot with your face near the middle works
best. The caption is optional. Leave it `""` and nothing shows.

`portrait` is the smaller picture beside the About text, same rules. Set
either to `null` to hide it.

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
  clickable from the preview sheet. This is how you mark the emails that are
  also `Motion` or `Print`. I could not tell which emails were animated from
  the static exports, so nothing carries `Motion` yet.
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
  index.html
  styles.css
  app.js
  data/projects.js   ← all the content and your details
  data/images.js     ← auto-generated image sizes
  assets/full/       165 full-size WebP images (21 MB)
  assets/thumb/      165 grid thumbnails (6 MB)

build/           the extraction pipeline, kept for re-runs. Not published.
  manifest.tsv       every artboard pulled out of Figma
  sheets/            the raw Figma exports (large, safe to delete)
  raw/               the sliced PNGs at full quality (346 MB, your archive)
  contact/           labelled contact sheets of everything
  slice.py           cuts the Figma sheets into single artboards
  optimize.py        makes the WebP versions
  placeholder.py     draws the hero placeholder image
  serve.js           tiny local web server
```

`build/raw/` is your full-resolution archive. Worth keeping, but do not upload
it with the site.

## A note on the source Figma file

The extraction grouped artboards temporarily to export them in batches, then
ungrouped everything. The file ended exactly as it started, with 165 top-level
nodes and no leftover groups.
