#!/usr/bin/env python3
"""Turn a folder of MP4s and GIFs into web-ready motion assets.

Usage:  python3 build/motion.py /path/to/downloaded/folder

For every source file it writes three things:

    site/assets/video/<slug>.mp4      the piece: <=720p, CRF 30, faststart
    site/assets/preview/<slug>.mp4    4s silent loop, 480px wide, for tile hover
    site/assets/poster/<slug>.webp    a still frame, 720px wide

and prints a `VIDEOS` map to site/data/videos.js with each clip's dimensions
and duration, which the site reads for tile badges and layout.

GIFs go through the same path: as MP4 they land at a fraction of the size and
the browser can pause them.
"""
import json
import os
import re
import subprocess
import sys
import tempfile

from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SITE = os.path.join(ROOT, "site")
OUT = {
    "video": os.path.join(SITE, "assets", "video"),
    "preview": os.path.join(SITE, "assets", "preview"),
    "poster": os.path.join(SITE, "assets", "poster"),
}

MAX_H = 720          # tallest edge of the full piece
PREVIEW_W = 480      # hover loop width
PREVIEW_SECS = 4
POSTER_W = 720


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def probe(path):
    r = run(["ffprobe", "-v", "error", "-select_streams", "v:0",
             "-show_entries", "stream=width,height,duration",
             "-show_entries", "format=duration",
             "-of", "json", path])
    if r.returncode != 0:
        return None
    data = json.loads(r.stdout or "{}")
    st = (data.get("streams") or [{}])[0]
    dur = st.get("duration") or (data.get("format") or {}).get("duration") or 0
    try:
        dur = float(dur)
    except (TypeError, ValueError):
        dur = 0.0
    if not st.get("width"):
        return None
    return {"w": int(st["width"]), "h": int(st["height"]), "dur": round(dur, 1)}


def slugify(name, taken):
    base = os.path.splitext(os.path.basename(name))[0].lower()
    base = re.sub(r"[^a-z0-9]+", "-", base).strip("-") or "clip"
    base = re.sub(r"-{2,}", "-", base)[:44].strip("-")
    slug, n = base, 2
    while slug in taken:
        slug = base + "-" + str(n)
        n += 1
    taken.add(slug)
    return slug


def encode(src, slug, meta):
    # scale so the tall edge is at most MAX_H, keeping even dimensions
    scale = "scale='min(iw,trunc(iw*{0}/ih/2)*2)':'min(ih,{0})'".format(MAX_H)
    if meta["h"] <= meta["w"]:
        scale = "scale='min(iw,trunc({0}*iw/ih/2)*2)':'min(ih,{0})'".format(MAX_H)

    full = os.path.join(OUT["video"], slug + ".mp4")
    r = run(["ffmpeg", "-y", "-i", src,
             "-vf", scale + ",format=yuv420p",
             "-c:v", "libx264", "-crf", "30", "-preset", "slow",
             "-movflags", "+faststart",
             "-c:a", "aac", "-b:a", "96k", "-ac", "2",
             full])
    if r.returncode != 0:
        return None, r.stderr[-400:]

    prev = os.path.join(OUT["preview"], slug + ".mp4")
    r = run(["ffmpeg", "-y", "-i", src, "-t", str(PREVIEW_SECS),
             "-vf", "scale={0}:-2,format=yuv420p".format(PREVIEW_W),
             "-c:v", "libx264", "-crf", "33", "-preset", "slow",
             "-movflags", "+faststart", "-an", prev])
    if r.returncode != 0:
        return None, "preview: " + r.stderr[-300:]

    # Poster from ~1s in, or the first frame for very short clips. ffmpeg here
    # has no WebP encoder, so pull a PNG frame and convert it with PIL.
    at = "1" if meta["dur"] > 1.5 else "0"
    poster = os.path.join(OUT["poster"], slug + ".webp")
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        frame = tmp.name
    try:
        r = run(["ffmpeg", "-y", "-ss", at, "-i", src, "-frames:v", "1",
                 "-vf", "scale={0}:-2".format(POSTER_W), frame])
        if r.returncode != 0 or not os.path.getsize(frame):
            return None, "poster: " + r.stderr[-300:]
        Image.open(frame).convert("RGB").save(poster, "WEBP", quality=80, method=5)
    finally:
        if os.path.exists(frame):
            os.unlink(frame)

    if not os.path.exists(poster):
        return None, "poster missing after conversion"
    return full, None


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: python3 build/motion.py /path/to/folder")
    src_dir = os.path.abspath(sys.argv[1])
    if not os.path.isdir(src_dir):
        sys.exit("not a folder: " + src_dir)

    for d in OUT.values():
        os.makedirs(d, exist_ok=True)

    sources = []
    for dirpath, _, files in os.walk(src_dir):
        for f in sorted(files):
            if f.lower().endswith((".mp4", ".mov", ".m4v", ".gif", ".webm")):
                sources.append(os.path.join(dirpath, f))
    sources.sort()
    if not sources:
        sys.exit("no video or gif files under " + src_dir)

    print("found", len(sources), "source files\n")
    videos, taken, failed = {}, set(), []

    for i, src in enumerate(sources, 1):
        meta = probe(src)
        rel = os.path.relpath(src, src_dir)
        if not meta:
            failed.append((rel, "unreadable"))
            print("  %2d/%d  SKIP  %s" % (i, len(sources), rel))
            continue
        slug = slugify(src, taken)
        full, err = encode(src, slug, meta)
        if not full:
            failed.append((rel, err))
            print("  %2d/%d  FAIL  %s" % (i, len(sources), rel))
            continue
        out_meta = probe(full) or meta
        videos[slug] = {"w": out_meta["w"], "h": out_meta["h"],
                        "dur": meta["dur"], "src": rel}
        print("  %2d/%d  %-42s -> %-34s %5.1fs  %sx%s  %.1f MB"
              % (i, len(sources), rel[:42], slug, meta["dur"],
                 out_meta["w"], out_meta["h"], os.path.getsize(full) / 1e6))

    with open(os.path.join(SITE, "data", "videos.js"), "w") as f:
        f.write("/* Auto-generated by build/motion.py. */\n")
        f.write("const VIDEOS = ")
        json.dump({k: {"w": v["w"], "h": v["h"], "dur": v["dur"]}
                   for k, v in sorted(videos.items())}, f, separators=(",", ":"))
        f.write(";\n")

    total = sum(os.path.getsize(os.path.join(d, x))
                for d in OUT.values() for x in os.listdir(d))
    print("\nencoded %d clips, %.1f MB of web assets" % (len(videos), total / 1e6))
    if failed:
        print("failed:", len(failed))
        for rel, why in failed:
            print("   ", rel, "-", (why or "")[:120])
    print("\nnext: add the slugs to site/data/projects.js as `videos: [...]`")


if __name__ == "__main__":
    main()
