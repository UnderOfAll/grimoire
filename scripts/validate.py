#!/usr/bin/env python3
"""Validate every content JSON against its category schema.

    python3 scripts/validate.py

Complements build_manifest.py (which checks parseability, duplicate ids, and the
inline-formula lint). This one enforces the JSON Schemas in data/schema/ and checks
that every subclass points at a real parent class. Exit 1 on any failure.
"""
import json
import sys
from pathlib import Path

try:
    import jsonschema
except ImportError:
    print("jsonschema not installed — run: pip install jsonschema", file=sys.stderr)
    sys.exit(2)

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
# category folder -> schema file stem
SCHEMA = {
    "classes": "class", "subclasses": "subclass", "spells": "spell",
    "skills": "skill", "passives": "passive", "weapons": "weapon",
    "armor": "armor", "rules": "rule",
}


def load(p):
    doc = json.loads(p.read_text(encoding="utf-8"))
    return doc if isinstance(doc, list) else [doc]


def main():
    errors = []
    class_ids = set()
    subclass_parents = []

    for cat, stem in SCHEMA.items():
        schema_path = DATA / "schema" / f"{stem}.schema.json"
        if not schema_path.exists():
            continue
        schema = json.loads(schema_path.read_text(encoding="utf-8"))
        for f in sorted((DATA / cat).glob("*.json")):
            try:
                for obj in load(f):
                    jsonschema.validate(obj, schema)
                    if cat == "classes":
                        class_ids.add(obj.get("id") or obj.get("name"))
                    if cat == "subclasses":
                        subclass_parents.append((f.name, obj.get("parentClass")))
            except jsonschema.ValidationError as e:
                errors.append(f"{cat}/{f.name}: {e.message} (at {list(e.path)})")
            except json.JSONDecodeError as e:
                errors.append(f"{cat}/{f.name}: invalid JSON — {e}")

    # every subclass must reference a real parent class
    for fname, parent in subclass_parents:
        if parent not in class_ids:
            errors.append(f"subclasses/{fname}: parentClass {parent!r} is not an existing class")

    if errors:
        print("SCHEMA VALIDATION FAILED:", file=sys.stderr)
        for e in errors:
            print("  -", e, file=sys.stderr)
        sys.exit(1)
    print(f"schema-valid: all files pass; {len(class_ids)} classes, "
          f"{len(subclass_parents)} subclasses, all parents resolve")


if __name__ == "__main__":
    main()
