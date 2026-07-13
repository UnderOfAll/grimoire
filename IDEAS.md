# IDEAS — deferred content for later waves

Parked ideas, not in the active build. The system is data-driven and additive, so any of
these can drop in later as JSON with zero rework. Revisit when we open a new wave.

## Deferred classes

- **Beast Tamer** — circus menagerie (WoW Hunter). Affinity: mixed. Engine: bonded beast
  companion(s) with own turn/parry. Signature: swap beasts per situation, combo strikes,
  whip crowd-control. Parry: beast intercepts/counter-pounce. Subclass sketches: Lion
  (aggressive melee pet) / Aviary (flying ranged pet) / Menagerie (multiple small beasts)
  / Snake Charmer. NOTE: most build-heavy — needs beast statblocks + companion action
  economy. Do a wave on its own.
- **Apothecary** — snake-oil healer. Affinity: mixed. Engine: elixirs (buffs with side
  effects), thrown vials. Signature: dubious cures, tonics, hazard flasks. Parry: reflex
  tonic. Fills a true-healer role (Jester currently covers support/buff instead). Bring in
  if the party wants dedicated healing.
- **Sharpshooter** — precision ranged single-target (knife thrower). Affinity: ranged.
  Engine: aim/mark stacks, called shots. Signature: sniping, guaranteed-crit setups. Parry:
  weakest band (ranged-caster penalty). Cut as the redundant half of the ranged pair
  (Juggler kept). Bring in if we want a dedicated single-target sniper alongside Juggler's
  barrage.

## Class ideas floated but folded into subclasses

- Contortionist, Tightrope, Escape Artist -> under Acrobat.
- Snake Charmer -> under Beast Tamer.
- Human Cannonball -> under The Sandow / strongman (or Acrobat).

## Future systems (beyond the compendium)

The app is currently a compendium (rulebook view of classes/spells/etc). These are bigger
tracks to scope later:

- **Character-sheet system** — build a specific character: pick class + level + ability
  scores (incl. CON), then compute and track live HP as current/total (D&D Beyond style),
  not just the class's starting HP. This is what makes a real HP bar possible.
- **Equipment / AC system** — items in `data/items/`, worn armor + Dex producing AC, weapon
  damage, magic gear. Needed before anything "scales with gear." Owner: Oghma designs the
  schema + math; Ioun renders. NOTE: weapons + armour are being built BEFORE the general
  items/economy layer (no cost/weight yet).
- **Monster / statblock system** — monsters get their own sheets (HP, attacks, AC, and the
  same 1-reaction economy so they can OR parry OR make an opportunity attack, not both).
  Much later. Needed for real encounters and to test parry from the attacker side.

## Other floated ideas (not yet decided)

- **Ringmaster** — whip-and-command tactical leader; grants ally actions, manipulates turn
  order. A leader pillar distinct from Jester's chaos-support. Considered, not selected.
- **Fortune Teller / Seer** — fate/precognition, deliberate foil to the Joker (controlled
  foreknowledge vs random chaos), strong parry synergy. Considered, not selected.
