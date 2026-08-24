#!/usr/bin/env python3
"""Turn the sliced PNGs into web-ready WebP: a capped-ratio thumbnail and a full view."""
import os, json
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
BUILD = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(BUILD, "raw")
SITE = os.path.abspath(os.path.join(BUILD, "..", "site"))
FULL_DIR = os.path.join(SITE, "assets", "full")
THUMB_DIR = os.path.join(SITE, "assets", "thumb")

FULL_W = 1200          # max width of the full view
FULL_H = 12000         # max height (WebP hard limit is 16383)
THUMB_W = 720          # thumbnail width
THUMB_MAX_RATIO = 4 / 3  # tall pieces are cropped from the top to this ratio

for d in (FULL_DIR, THUMB_DIR):
    os.makedirs(d, exist_ok=True)

index = {}
for zone in sorted(os.listdir(RAW)):
    zdir = os.path.join(RAW, zone)
    if not os.path.isdir(zdir):
        continue
    for f in sorted(os.listdir(zdir)):
        if not f.endswith(".png"):
            continue
        key = f[:-4]
        im = Image.open(os.path.join(zdir, f)).convert("RGB")
        ow, oh = im.size

        # full view
        full = im
        if full.width > FULL_W:
            full = full.resize((FULL_W, round(full.height * FULL_W / full.width)), Image.LANCZOS)
        if full.height > FULL_H:
            full = full.resize((round(full.width * FULL_H / full.height), FULL_H), Image.LANCZOS)
        full.save(os.path.join(FULL_DIR, key + ".webp"), "WEBP", quality=80, method=5)

        # thumbnail: cap the aspect ratio so very tall pieces stay legible in a grid
        th = im
        max_h = round(th.width * THUMB_MAX_RATIO)
        if th.height > max_h:
            th = th.crop((0, 0, th.width, max_h))
        if th.width > THUMB_W:
            th = th.resize((THUMB_W, round(th.height * THUMB_W / th.width)), Image.LANCZOS)
        th.save(os.path.join(THUMB_DIR, key + ".webp"), "WEBP", quality=76, method=5)

        index[key] = {"zone": zone, "w": ow, "h": oh,
                      "tw": th.width, "th": th.height}
        im.close()

json.dump(index, open(os.path.join(BUILD, "images.json"), "w"), indent=0)
print("processed", len(index), "images")
print("full  :", round(sum(os.path.getsize(os.path.join(FULL_DIR, x)) for x in os.listdir(FULL_DIR)) / 1e6, 1), "MB")
print("thumbs:", round(sum(os.path.getsize(os.path.join(THUMB_DIR, x)) for x in os.listdir(THUMB_DIR)) / 1e6, 1), "MB")
