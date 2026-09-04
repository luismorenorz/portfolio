#!/usr/bin/env python3
"""Stamp every local script and stylesheet with a version.

GitHub Pages serves these with `cache-control: max-age=600` and no fingerprint
in the filename, so a browser that has the page open keeps running yesterday's
app.js against today's data. That looks exactly like "nothing deployed".

Run this after any edit to a .js or .css file, before committing:

    python3 build/bump.py

It rewrites `?v=...` on every local asset reference in the HTML files to the
current UTC timestamp, which is enough to force a fresh fetch.
"""
import os, re, sys, time

SITE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "site"))
PAGES = ["index.html", "case.html"]
LOCAL = re.compile(r'''((?:src|href)=")((?!https?:|//|data:)[^"?#]+\.(?:js|css))(\?v=[^"]*)?(")''')

stamp = sys.argv[1] if len(sys.argv) > 1 else time.strftime("%Y%m%d%H%M", time.gmtime())
touched = 0
for page in PAGES:
    path = os.path.join(SITE, page)
    src = open(path).read()
    out, n = LOCAL.subn(lambda m: m.group(1) + m.group(2) + "?v=" + stamp + m.group(4), src)
    if out != src:
        open(path, "w").write(out)
    touched += n
    print(f"{page}: {n} references -> ?v={stamp}")
print("stamped", touched, "references")
