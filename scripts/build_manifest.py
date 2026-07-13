#!/usr/bin/env python3
"""Scan data/<category>/ and (re)generate data/manifest.json.

Run this whenever an agent adds, renames, or removes a content JSON file:

    python3 scripts/build_manifest.py

It also validates that every file is parseable JSON and reports duplicates by id,
so a malformed drop is caught before it silently disappears from the UI.
"""

import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
CATEGORIES = ["rules", "classes", "subclasses", "spells", "skills", "passives", "weapons", "armor"]
# Assets that get a content-hash cache-buster stamped into index.html (see stamp_assets).
VERSIONED_ASSETS = ["assets/css/style.css", "assets/js/app.js"]


def entries(path):
    """Yield each content object from a file (files may hold one object or a list)."""
    doc = json.loads(path.read_text(encoding="utf-8"))
    yield from (doc if isinstance(doc, list) else [doc])


def stamp_assets():
    """Stamp a short content hash onto each versioned asset's link in index.html.

    Browsers cache assets/js/app.js and assets/css/style.css aggressively (GitHub Pages
    serves them with a long max-age), so a deploy can look unchanged until a hard refresh.
    Appending '?v=<hash of the file>' makes the URL change whenever — and only when — the
    file's contents change, so browsers fetch the new version automatically. Run as part of
    the normal build, so it's always in sync before a push.
    """
    index = ROOT / "index.html"
    html = index.read_text(encoding="utf-8")
    stamped = []
    for asset in VERSIONED_ASSETS:
        path = ROOT / asset
        if not path.exists():
            continue
        digest = hashlib.md5(path.read_bytes()).hexdigest()[:8]
        # Match "asset" or "asset?v=..." inside the src/href attribute, keeping the quote char.
        pattern = re.compile(r'(["\'])' + re.escape(asset) + r'(?:\?v=[0-9a-f]+)?\1')
        html, n = pattern.subn(r'\g<1>' + asset + '?v=' + digest + r'\g<1>', html)
        if n:
            stamped.append(f"{asset}?v={digest}")
    index.write_text(html, encoding="utf-8")
    return stamped


def main():
    manifest = {}
    bundle = {}
    errors = []
    seen_ids = {}

    for cat in CATEGORIES:
        folder = DATA / cat
        folder.mkdir(exist_ok=True)
        files = []
        objs = []
        for f in sorted(folder.glob("*.json")):
            rel = f"{cat}/{f.name}"
            try:
                for obj in entries(f):
                    key = (cat, obj.get("id") or obj.get("name", ""))
                    if key in seen_ids:
                        errors.append(f"duplicate {cat} id {key[1]!r}: {rel} and {seen_ids[key]}")
                    seen_ids[key] = rel
                    obj["_file"] = rel
                    objs.append(obj)
                files.append(rel)
            except json.JSONDecodeError as e:
                errors.append(f"invalid JSON in {rel}: {e}")
        manifest[cat] = files
        bundle[cat] = objs

    (DATA / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    # bundle.json inlines every entry so the app loads in ONE request instead of ~60.
    (DATA / "bundle.json").write_text(
        json.dumps(bundle, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    stamped = stamp_assets()

    total = sum(len(v) for v in manifest.values())
    print(f"manifest.json + bundle.json written — {total} files across {len(CATEGORIES)} categories")
    for cat in CATEGORIES:
        print(f"  {cat:11} {len(manifest[cat])}")
    for s in stamped:
        print(f"  stamped {s}")

    if errors:
        print("\nWARNINGS:", file=sys.stderr)
        for e in errors:
            print("  -", e, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
