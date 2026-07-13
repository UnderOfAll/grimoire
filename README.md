# Grimoire — D&D 5e System

A D&D Beyond–style compendium and (eventually) full 5e system. This is the **base**: a
zero-dependency, data-driven web app plus a team of specialist agents that build the
system on top of it.

## Run it

On Windows, double-click one of:

- **`Grimoire.vbs`** — starts the server with **no visible window** and opens the app. To stop
  it, double-click **`Stop Grimoire.bat`**.
- **`Grimoire.bat`** — starts the server in a visible command window (handy for troubleshooting).
  Close that window to stop it.

Or run it manually from any OS:

```bash
cd DnD-System
python3 -m http.server 8000
# open http://localhost:8000
```

> Serve it over HTTP (not `file://`) — the app fetches JSON, which browsers block on the
> file protocol.

## How it works

Everything the app shows is **data**. Each category is a folder of JSON files:

```
data/
  classes/      one file per class      (schema: class.schema.json)
  subclasses/   one file per subclass   (subclass.schema.json)
  spells/       one file per spell       (spell.schema.json)
  skills/       skills.json (batched)    (skill.schema.json)
  passives/     feats / traits / features (passive.schema.json)
  schema/       JSON Schemas — the shape of every content type
  manifest.json generated index the app reads
```

To add content:

1. Drop a JSON file in the right `data/<category>/` folder (copy a seed file as a template).
2. Regenerate the index: `python3 scripts/build_manifest.py`
3. Refresh the browser. No code changes needed.

The frontend (`assets/js/app.js`) reads the manifest, loads every file, and renders it —
so adding content never means touching the UI, *unless* you introduce a new field or a
whole new category (then `Ioun` updates the renderer).

## The agent team

A pantheon of specialist agents lives in `.claude/agents/`. Run Claude Code **from this
folder** so they're picked up, then give the orchestrator a goal:

```
@ao add the Wizard class with the Evocation subclass and five iconic spells
```

**Ao** plans it and delegates: **Oghma** (systems/schema), **Corellon** (classes),
**Moradin** (subclasses), **Mystra** (spells), **Helm** (skills), **Gond**
(feats/passives), **Deneir** (validation + manifest), **Savras** (balance review),
**Ioun** (UI). See `AGENTS.md` for the full charter and workflow.

## Stack

Vanilla HTML/CSS/JS + JSON, Python only for the manifest script. No build step, no
dependencies — deliberately, so it's easy to extend and swap later (a React/Vite frontend
or a backend can be layered on without changing the data model).

## Seeded examples

Fireball (spell) and Great Weapon Master (feat) are kept as living templates for the
agents. The class/subclass seeds (Fighter/Champion) have been replaced by the project's own
content — see `DESIGN.md` for the current roster.
