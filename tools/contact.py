#!/usr/bin/env python3
"""Build labelled contact sheets so each artboard can be identified visually."""
import os, sys, math
from PIL import Image, ImageDraw, ImageFont

Image.MAX_IMAGE_PIXELS = None
BUILD = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(BUILD, "raw")
OUT = os.path.join(BUILD, "contact")
os.makedirs(OUT, exist_ok=True)

try:
    FONT = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 26)
except Exception:
    FONT = ImageFont.load_default()

def sheet(zone, cell_w=340, cell_h=520, cols=None, maxcrop=3.0, page=None, per_page=None):
    d = os.path.join(RAW, zone)
    files = sorted(os.listdir(d))
    if per_page:
        files = files[page * per_page:(page + 1) * per_page]
    if not files:
        return None
    if cols is None:
        cols = min(8, max(4, math.ceil(math.sqrt(len(files)))))
    rows = math.ceil(len(files) / cols)
    lab = 34
    W, H = cols * (cell_w + 12) + 12, rows * (cell_h + lab + 12) + 12
    canvas = Image.new("RGB", (W, H), (24, 24, 27))
    dr = ImageDraw.Draw(canvas)
    for i, f in enumerate(files):
        im = Image.open(os.path.join(d, f))
        # cap extreme aspect ratios so tall pieces stay readable (top portion)
        if im.height / im.width > maxcrop:
            im = im.crop((0, 0, im.width, int(im.width * maxcrop)))
        im.thumbnail((cell_w, cell_h), Image.LANCZOS)
        cx = 12 + (i % cols) * (cell_w + 12)
        cy = 12 + (i // cols) * (cell_h + lab + 12)
        canvas.paste(im, (cx + (cell_w - im.width) // 2, cy))
        dr.text((cx + 4, cy + cell_h + 4), f[:-4], fill=(255, 220, 120), font=FONT)
        im.close()
    name = zone if page is None else "%s-%d" % (zone, page)
    p = os.path.join(OUT, name + ".png")
    canvas.save(p, "PNG")
    print(p, canvas.size, len(files), "items")
    return p

if __name__ == "__main__":
    args = sys.argv[1:]
    if args:
        zone = args[0]
        pg = int(args[1]) if len(args) > 1 else None
        pp = int(args[2]) if len(args) > 2 else None
        sheet(zone, page=pg, per_page=pp)
    else:
        for z in sorted(os.listdir(RAW)):
            if os.path.isdir(os.path.join(RAW, z)):
                sheet(z)
