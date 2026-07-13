# The Pantheon — DnD-System Agent Team

A team of specialist agents that build the D&D 5e system on top of the **Grimoire**
base app. You (the user) only ever talk to **Ao**, the orchestrator — the role the main
Claude Code session plays. Ao briefs the design *with you*, then decomposes the work into
self-contained packets and dispatches the specialists to run **in parallel**. Specialists
report back to Ao, never to you; Ao integrates and reports one result.

Parallelism is safe by construction: each specialist owns its own `data/<category>/`
folder and writes one file per concept, so concurrent agents never touch the same file.

## Roster

| Agent | Domain | Writes to |
|-------|--------|-----------|
| **Ao** | Orchestrator / DM. Receives goals, plans, delegates, integrates, ships. | everything (coordinates) |
| **Oghma** | Systems & rules engineer. Core mechanics, math, schema design. | `data/schema/`, engine logic |
| **Corellon** | Classes designer. | `data/classes/` |
| **Moradin** | Subclasses designer (must match a parent class). | `data/subclasses/` |
| **Mystra** | Spells designer. | `data/spells/` |
| **Helm** | Skills & proficiencies. | `data/skills/` |
| **Gond** | Passives, feats, class/racial features. | `data/passives/` |
| **Deneir** | Data-integrity keeper. Validates JSON, rebuilds manifest, catches dupes. | `data/manifest.json`, fixes |
| **Savras** | QA & balance reviewer. Read-only; finds flaws, never fixes them. | (reports only) |
| **Ioun** | Frontend/UI integration. Renders new content types in the app. | `assets/`, `index.html` |

## Orchestration protocol

Ao runs every job as four phases:

```
① BRIEF        You ↔ Ao. Ao proposes design (features, level progression, subclass hook,
   (with you)  balance intent), you refine, and Ao writes a short Design Brief.
                        │  ← nothing is dispatched until you approve the brief
② DECOMPOSE    Ao turns the brief into dependency-ordered Work Packets, one per agent.
   (Ao alone)

③ DISPATCH     Sequential prefix first (only if needed):
   (parallel)     Oghma  → new schema field/mechanic
                  Ioun   → UI renderer for any new field/category
                then the PARALLEL BURST (safe — separate folders):
                  Corellon · Moradin · Mystra · Helm · Gond  author content at once

④ GATE +       Deneir → validate JSON + rebuild manifest (must be warning-free)
   CONSOLIDATE  Savras → balance/rules review (must pass)
   (Ao alone)   Ao integrates, then reports ONE summary back to you.
```

## Work packet format

Every dispatch to a specialist is a self-contained packet so the agent needs nothing else:

```
TO:            <agent>
GOAL:          <one sentence — what to produce>
TARGET PATH:   data/<category>/<id>.json
SCHEMA:        data/schema/<type>.schema.json
TEMPLATE:      <seed file to copy, e.g. data/classes/fighter.json>
SPEC:          <the design details from the brief that this agent needs — verbatim>
DEPENDS ON:    <ids/fields that must exist first, or "none">
ACCEPTANCE:    <what "done" means — fields filled, levels covered, balance target>
```

## Rules of the house

1. **Single source of truth:** all content is JSON under `data/<category>/`, one concept
   per file (skills may be batched). Shape is defined by `data/schema/*.schema.json`.
2. **Always follow the schema.** New fields require Oghma to update the schema first and
   Ioun to render them.
3. **After any data change**, Deneir runs `python3 scripts/build_manifest.py` — a change
   isn't "done" until the manifest is regenerated and clean (no warnings).
4. **Balance before ship:** Savras reviews new content against 5e norms before Ao closes a task.
5. **Stay in your lane.** Cross-domain needs go through Ao, who re-delegates.
6. **Match existing style** — copy the seed files (`fighter.json`, `fireball.json`, …) as templates.

## Running the app

```
cd DnD-System
python3 -m http.server 8000   # then open http://localhost:8000
```
