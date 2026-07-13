# DESIGN — Circus System (source of truth for agents)

Self-contained D&D 5e-based setting. Every class is a circus act. Defense is an active
gamble via a rebuilt reaction economy. Agents build against THIS document.

## Locked decisions (2026-07-10)

- **Setting:** self-contained. Only the circus classes exist; balance is against each
  other, free to diverge from standard 5e where it serves the theme.
- **Scope:** prove on **levels 1-5 first**. Build the parry engine + all classes to level
  5, validate feel, then extend to 20. Do not author levels 6+ yet.
- **Meta-resource:** per-class only — each class has ONE resource, its own engine. The
  shared **Spectacle** layer was DROPPED (2026-07-10): a shared party pool caused resource
  contention (one player could drain it) and table bookkeeping. Showstopper-tier flourishes
  now fold into each class's own engine cost.
- **Parry fail penalty:** **+50% damage** (x1.5, round down).

## Core engine: Parry / Reaction rebuild (Oghma owns)

Replaces passive defense with an active choice. Universal to all classes.

- **Trigger:** you are hit by an attack you can see (attack roll beats your AC), before
  damage is rolled.
- **Cost:** your reaction (native "once per round").
- **Check (per-class DC, situational):** roll `d20` vs your effective **Parry DC**.
  - Roll **above** the DC -> **negate all damage** (full dodge).
  - Roll **exactly** the DC -> **half damage**.
  - Roll **below** the DC -> **+50% damage** (x1.5, round down).
- **Parry DC by class** (lower = easier to parry): martial/melee classes have a low base
  DC (The Sandow ~8), ranged-casters a high one (Puppeteer ~15), mixed in between. Acrobat
  is the best parrier (lowest DC). Oghma places all 8 classes on the scale.
- **Situational modifiers raise the DC (harder):** no weapon in hand (unarmed), defending
  while wielding a ranged weapon, a tougher/higher-bonus attacker. The Parry DC is FIXED per
  class (MECHANICS.md v4) — it does NOT scale down with level or ability; only the weapon's
  own dcMod and situational modifiers adjust it.
- **Cannot parry at all when:** stunned, incapacitated, paralyzed, unconscious, can't see
  the attacker, or no reaction available.
- Per-class features may lower the DC or grant advantage on the parry roll.
- **Parryable = attack rolls only.** AoE / saving-throw effects (e.g. Fireball) are NOT
  parryable. Dodging those is the **Acrobat's** special evasion feature.
- **Riposte hook:** a full dodge may let some classes counterattack (per-class feature).
- These are all-new classes, so we own the entire reaction economy — no clashes with
  Shield, Uncanny Dodge, etc.
- Per-class parry flavor reskins the outcome (clone eats the hit, afterimage, beast
  intercept, etc.) but resolves on the same math.

## Per-class resources (no shared layer)

Each class has exactly ONE resource: its own engine (Momentum, Grit, clone tokens, deck,
Juggle set, etc.). The shared "Spectacle" pool was DROPPED (2026-07-10) — contention plus
cross-table bookkeeping outweighed the flavor. "Showstopper"-tier flourishes now fold into
each class's own engine cost (pattern: the Acrobat's Trapeze Swing / Strike-and-Vanish
flourishes spend extra Momentum for the bigger version).

## Class roster (8) — self-contained, locked

Each: fantasy / affinity / engine / signature / parry reskin / subclass sketches.
Subclasses to be authored later (choose one per class for the Phase-1 proof).
Deferred class ideas live in `IDEAS.md`.

Roles covered: tank (The Sandow), two distinct controllers (Puppeteer, Illusionist),
chaos (Joker), duplicator (Doppelganger), evasion/mobility (Acrobat), support (Jester),
ranged (Juggler).

1. **Acrobat** — aerial rogue. Affinity: melee/mixed. Engine: Momentum from movement.
   Signature: wall-run, trapeze, strike-and-vanish; owns AoE evasion. Parry: pure
   dodge/tumble (best full-dodge band). Subclasses: Trapeze / Contortionist / Tightrope.
2. **Doppelganger** — duplicator. Mixed affinity. HitDie d8. **Dexterity** primary
   (defenseAbility Dex); parryBaseDC 9. No spell slots. Engine: **Clones** (tokens — semi-real
   mirror-image duplicates; create/maintain a small number; cap scales). Signature: swap-place
   with a clone, decoy detonation (Dex save), mirror-miss defense (attacks may strike a clone),
   guess-the-real-one. Parry: swap with a clone that eats the hit. Riposte: on a Full Dodge,
   spawn a clone free. Weapons (3): Mirror Blades (signature), Dagger, Shortsword. Subclasses:
   Impersonator (steal forms) / Swarm (many weak clones) / Mirror (reflect/counter).
3. **Illusionist** — phantasms, mind games. Affinity: ranged-caster. Engine: illusion
   pool, save-or-believe. Signature: fake mind-flay, illusory terrain, phantasmal psychic
   damage. Parry: afterimage/blur. Subclasses: Phantasm / Trickster / Hypnotist.
4. **Joker** — chaos menace. Mixed affinity. HitDie d8. **Charisma** primary (defenseAbility
   Dex); parryBaseDC 11. No spell slots. Engine: **Mayhem** (points) + **Wild Cards** — spend
   Mayhem to draw from a BOUNDED Wild table (roll a die on a fixed list of ~6-8 effects, some
   chaotic/minor-backfire; nothing catastrophic — keep it swingy but not broken). Signature:
   rule-bending gambits. Parry: chaotic — may reroll the Parry d20 once, keep the new result.
   Riposte: on a Full Dodge, the attacker suffers a minor mishap (or you draw a Wild Card).
   Needs the TIGHTEST Savras guardrails (bounded variance). Weapons (3): Razor Cards (signature,
   thrown), Harlequin's Cane, Dagger. Subclasses: Anarchist (AoE chaos) / Gambler (luck/reroll
   manipulation) / Harlequin (mad self-buff melee).
5. **Jester** — support fool, fate-bender. Affinity: ranged-caster. Engine: taunts/jokes
   (weaponized inspiration). Signature: give ally your good roll, force enemies to waste
   turns, scaled Vicious Mockery. Parry: mock attacker -> disadvantage. Subclasses: Fool /
   Mime / Prankster.
6. **Juggler** — throwing tempo. Affinity: ranged. Engine: **Juggle set** — always juggling
   N implements (3 at L1, grows with level), which SELF-REFILL to full at the start of each
   turn (he "catches" them; no buying, no gathering, no ammo tracking). On his action he
   chooses how many to throw (0..N); each thrown implement is an attack (barrage). His PARRY
   scales with how many he's still holding: full hands = can parry but at a poor DC (defense
   isn't his focus); fewer held = harder; empty hands = cannot parry until he refills next
   turn. Core loop = all-in damage (defenseless) vs hold some back (can parry). Throwing all
   = biggest payoff (TBD). Signature weapons: throwing knives, flaming orbs (fire
   skin), clubs. Subclasses: Blades / Firebrand / Chainmaster.
7. **The Sandow** (strongman archetype) — feats of strength, tank. HitDie d12. **Strength**
   primary; parry via BRACE (parryBaseDC 8, 2nd-best; defenseAbility Strength). Heavy armor.
   No spell slots. Extra Attack at L5 (pure martial). Engine: **Grit** — baseline generation
   from being in the fray (the first time each turn you hit OR are hit); each SUBCLASS defines
   its primary Grit stream (tank = take hits, offense = deal hits, Human Cannonball =
   impacts/movement). Signature: **Heave** (throw enemies, objects, AND willing allies —
   fastball special), grapples, **Brace** (spend Grit to shrug damage). Tanking = **Punish
   (Sentinel-style)**: enemies that leave his reach or ignore him get stopped (no mind
   control). Weapons (3): Strongman's Barbell (2d6, heavy/two-handed), Cannonball (1d10,
   thrown), Iron Chain (1d8, reach). Subclasses: Bulwark (tank) / Juggernaut (offense) /
   Human Cannonball (mobility/burst). (Named after Eugen Sandow.)
8. **Puppeteer** — marionettist, hard control. Affinity: ranged-caster (parryBaseDC 15,
   worst; defenseAbility Dex). HitDie d6. **Primary/control ability: Charisma** (single stat —
   Control Wires attacks use Cha; control save DC = 8+prof+Cha). Engine: **Strings** (token
   attachments; cap scales; 60 ft leash; snap if incapacitated). Control is **MEASURED** at
   1-5 (forced movement, restrain/tangle, deny reactions, disadvantage; full "puppet an
   action" gated to L5 = Grand Marionette). Strings work on **enemies AND allies** (dominate
   foes / protect + assist allies). No spell slots. Weapons (3): Control Wires (signature,
   finesse+reach, the only weapon that parries RANGED), Dagger, Whip. Riposte: on a Full
   Dodge, hook a free String onto the attacker. Subclasses: Puppet Master (turn enemies on
   each other) / Warden (ally protection) / Tangleweaver (zones/restraints).

## Weapons (in design — not yet built)

Bespoke, thematic circus weapons built on 5e's weapon-property chassis (damage die +
properties: Finesse, Light, Heavy, Reach, Thrown, Two-Handed, Versatile, Ammunition,
Loading, Special). We invent the skin/feel, reuse the math.

- **Damage types (locked):** physical (slashing / piercing / bludgeoning) + fire + psychic.
  Nothing more exotic. Elemental/psychic only via specific weapons or class features.
- **Per-weapon parry profile (locked, first-class stat):** every weapon states whether it
  can parry, at what range, and any DC modifier/advantage. Some parry well (staff, whip,
  twin blades), some at range (wires deflect projectiles — rare), some not at all (a knife
  once thrown; a loaded crossbow). This axis is unique to this system and ties weapons to
  the core parry mechanic (each weapon carries its own parryProfile.dcMod; the old flat
  "ranged weapon +3 DC" row was removed in MECHANICS v3 — unarmed +2 DC still applies).
- **Weapon access is proficiency-gated, NOT hard-locked (locked):** anyone can pick up any
  weapon (e.g. another class using Puppeteer wires), but WITHOUT proficiency you don't add
  your proficiency bonus — including in the parry math, so you parry clumsily with an
  unfamiliar weapon. `proficientClasses` on a weapon is informational, not a lock. Theme
  still means the Sandow won't juggle in practice.
- **~3 proficient weapons per class (locked):** keep each class proficient with a small,
  signature set of about 3 weapons — much easier to balance than broad category grants, and
  it sharpens each class's identity. Proficiency is granted via each weapon's
  `proficientClasses`; the class sheet lists the same weapon names for readability. Acrobat's
  set: Aerial Ribbons, Rapier, Whip (all finesse, all can parry). (Shortsword + Hand Crossbow
  remain in the data as generic weapons, no class proficient yet.)
- **Parry scales class + weapon (locked):** effective Parry DC = class base DC + weapon
  `dcMod` + situational − proficiency (if proficient) − ½ defense mod, floored at 3.
- **Reaction economy (locked):** one reaction per creature per round (PCs AND monsters),
  refreshing at start of turn. Parry, opportunity attack, and any other reaction share that
  one reaction — you parry OR make an OA, never both, and at most one parry per round. A
  parry may answer ANY seen attack, including an opportunity attack provoked on your own turn:
  when an OA hits, either tank it (keep your reaction for a bigger threat) or spend the
  reaction to parry. Monsters use the same economy (full monster sheets = later system). More
  reaction points per round = a future upgrade.
- **Special-behavior location (locked):** the WEAPON carries stats + parry profile + flavor;
  the ENGINE-RIDER lives in the CLASS FEATURE (Monk-style). A weapon is never broken in
  another class's hands. Juggler is the clean example: knives are plain thrown weapons; the
  class turns "how many I'm holding" into offense + defense.
- Mundane baseline weapons (knives, clubs, shortswords) still exist in the world alongside
  the signature circus weapons.
- Signature-weapon sketches per class: see the conversation / to be authored. Puppeteer =
  control wires (Finesse, Reach, Light, d4, can parry incl. ranged). Juggler = knives /
  flaming orbs / clubs (Thrown, Light). The Sandow = cannonballs / barbells / benches /
  people (Heavy, Thrown STR-gated). Acrobat = rapier / whip / hand crossbow.
- **Order:** weapons first, then armour, then general items (per Kayki). A weapon schema +
  `data/weapons/` category (Oghma) + renderer (Ioun) come before authoring the arsenal.

## Build order

- **Phase 0 (sequential, foundation):** Oghma designs the parry engine + a
  class-resource schema field; updates `data/schema/*`. Ioun adds renderer support for new
  fields. Nothing else starts until this lands.
- **Phase 1 (proof):** build ONE class end-to-end — **Acrobat**, levels 1-5, one subclass
  — as a vertical slice. Deneir validates, Savras balances. De-risks the schema.
- **Phase 2 (parallel burst):** Corellon (remaining classes 1-5), Moradin (subclasses),
  Mystra (circus spells), Gond (parry/showmanship feats), Helm (skills). Deneir + Savras
  gate each.
