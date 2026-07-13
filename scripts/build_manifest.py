#!/usr/bin/env python3
"""Scan data/<category>/ and (re)generate data/manifest.json.

Run this whenever an agent adds, renames, or removes a content JSON file:

    python3 scripts/build_manifest.py

It also validates that every file is parseable JSON and reports duplicates by id,
so a malformed drop is caught before it silently disappears from the UI.
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
CATEGORIES = ["rules", "classes", "subclasses", "spells", "skills", "passives", "weapons", "armor"]


def entries(path):
    """Yield each content object from a file (files may hold one object or a list)."""
    doc = json.loads(path.read_text(encoding="utf-8"))
    yield from (doc if isinstance(doc, list) else [doc])


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

    total = sum(len(v) for v in manifest.values())
    print(f"manifest.json + bundle.json written — {total} files across {len(CATEGORIES)} categories")
    for cat in CATEGORIES:
        print(f"  {cat:11} {len(manifest[cat])}")

    if errors:
        print("\nWARNINGS:", file=sys.stderr)
        for e in errors:
            print("  -", e, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
