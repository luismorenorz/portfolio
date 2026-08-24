#!/usr/bin/env python3
"""Generate the hero portrait placeholder.

The cover crops to 4:5 on desktop and 3:2 on narrow screens, so everything
that has to stay readable lives inside a centred square — whichever way the
image gets cropped, the message survives.
"""
import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 1500
SITE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "site"))
OUT = os.path.join(SITE, "assets", "full", "portrait-placeholder.webp")

BG = (20, 20, 23)
FIG = (42, 42, 47)
FIG2 = (52, 52, 58)
LINE = (66, 64, 60)
TEXT = (158, 154, 146)
DIM = (110, 107, 101)
ACCENT = (224, 113, 74)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

cx, cy = W // 2, H // 2
# The narrow crop is only 800px tall out of 1500, taken from the centre, so
# everything must fit inside y 350..1150.
half = 390

# dashed frame around the safe area
dash, gap = 24, 18
x = cx - half
while x < cx + half:
    x2 = min(x + dash, cx + half)
    d.line([(x, cy - half), (x2, cy - half)], fill=LINE, width=3)
    d.line([(x, cy + half), (x2, cy + half)], fill=LINE, width=3)
    x += dash + gap
y = cy - half
while y < cy + half:
    y2 = min(y + dash, cy + half)
    d.line([(cx - half, y), (cx - half, y2)], fill=LINE, width=3)
    d.line([(cx + half, y), (cx + half, y2)], fill=LINE, width=3)
    y += dash + gap

# figure in the upper part of the safe area, message below it
d.ellipse([cx - 88, 430, cx + 88, 606], fill=FIG2)
d.rounded_rectangle([cx - 158, 640, cx + 158, 900], radius=158, fill=FIG)


def font(path, size, fallback=None):
    for p in [path] + (fallback or []):
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    return ImageFont.load_default()


f_big = font("/System/Library/Fonts/Supplemental/Georgia.ttf", 54,
             ["/System/Library/Fonts/Supplemental/Times New Roman.ttf"])
f_small = font("/System/Library/Fonts/Supplemental/Arial.ttf", 25)


def centered(text, y, fnt, fill, spacing=0):
    if spacing:
        widths = [d.textlength(ch, font=fnt) for ch in text]
        total = sum(widths) + spacing * (len(text) - 1)
        x = (W - total) / 2
        for ch, w in zip(text, widths):
            d.text((x, y), ch, font=fnt, fill=fill)
            x += w + spacing
    else:
        d.text(((W - d.textlength(text, font=fnt)) / 2, y), text, font=fnt, fill=fill)


# clear a band under the figure, then set the message inside the safe area
d.rectangle([cx - half + 2, 905, cx + half - 2, cy + half - 2], fill=BG)
centered("YOUR PHOTO HERE", 930, f_small, ACCENT, spacing=7)
centered("Replace this placeholder", 978, f_big, TEXT)
centered("SITE.cover  ·  site/data/projects.js", 1058, f_small, DIM, spacing=2)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
img.save(OUT, "WEBP", quality=88, method=5)
print("wrote", OUT, img.size, round(os.path.getsize(OUT) / 1024), "KB")
