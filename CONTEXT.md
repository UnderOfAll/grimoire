# Context Log — DnD-System

Append-only record of goals, decisions, and work done. Newest entries at the bottom of each session block. Ao updates this after every meaningful step.

Format per entry:
- **[YYYY-MM-DD] Goal:** one line
- **Decisions:** bullet list
- **Dispatched:** agent -> what
- **Result:** files changed, status

---

## 2026-07-10

- **Goal:** Set up session infrastructure.
- **Decisions:**
  - All work and content in English only.
  - No emojis anywhere (chat or project).
  - Direct communication, token-optimized.
  - This file is the single in-repo context log; Ao keeps it current.
- **Dispatched:** none (infra only).
- **Result:** Created CONTEXT.md. Recorded prefs to cross-session memory.

- **Goal:** Design brief for the Circus System.
- **Decisions (locked):**
  - Self-contained circus setting (only these classes exist).
  - Scope: prove on levels 1-5 first, extend to 20 later.
  - Meta-resource: BOTH (per-class engines + shared Spectacle layer).
  - Parry fail penalty: +50% damage (x1.5, round down).
  - Roster = 8 classes (locked): Acrobat, Doppelganger, Illusionist, Joker, Jester,
    Juggler, Strongman, Puppeteer. Deferred to IDEAS.md: Beast Tamer, Apothecary,
    Sharpshooter.
  - Core rebuild = active Parry reaction (contested d20 vs attack total; 5+ negate, meet-to-+4
    half, fail +50%). Attack rolls only; Acrobat owns AoE evasion.
  - Build order: Phase 0 Oghma+Ioun (engine+schema+renderer) -> Phase 1 Acrobat proof
    (Deneir+Savras) -> Phase 2 parallel burst.
- **Dispatched:** none yet (awaiting go-ahead for Phase 0).
- **Result:** Wrote DESIGN.md (source of truth for agents).

- **Goal:** Phase 0 — engine + schema + renderer foundation.
- **Decisions:** Pantheon dispatches directly, no Socrates/God gate. Acrobat chosen as the
  Phase-1 proof class; Trapeze as its proof subclass.
- **Dispatched:** Oghma (engine+schema, sequential) -> Ioun (renderer, sequential).
- **Result:**
  - Oghma: created `data/schema/MECHANICS.md` (parry + Spectacle spec); added optional
    class fields `parryAffinity` (enum melee/mixed/ranged-caster), `defenseAbility`,
    `parryReskin`, `riposte`, `engine` (obj), `spectacle` (obj). Affinity mods locked:
    melee +3 / mixed +1 / ranged-caster -1. Spectacle: shared pool cap 5, resets per combat.
    fighter.json still validates; manifest clean.
  - Ioun: renders all new fields in `assets/js/app.js` + `assets/css/style.css` +
    `index.html`; added a "Parry & Spectacle" reference panel. Backward compatible.
    CAVEAT: no JS engine in env — verified by static trace + schema validation, not a live
    browser paint. Confirm visually after Phase 1.

- **Goal:** Phase 1 — Acrobat proof (class + Trapeze subclass) + gate.
- **Dispatched:** Corellon (acrobat.json) -> Moradin (trapeze.json) -> Deneir + Savras (gate).
- **Result:**
  - Corellon: `data/classes/acrobat.json` (id acrobat), levels 1-5, Momentum engine (pool
    cap 5/6), best-tier melee parry +riposte, Aerial Evasion (AoE) at L5, subclass slot
    "Acrobatic Discipline" L3, 2 Showstoppers.
  - Moradin: `data/subclasses/trapeze.json` (parent acrobat), two L3 features (Aerial
    Anchor, Featherweight Landing).
  - Deneir: valid + manifest clean (7 files/5 cats). Flagged PRE-EXISTING bug:
    great-weapon-master.json `prerequisite: null` vs passive schema string-only.
  - Savras: FAILS gate. Blockers: (1) Trapeze Swing net-neutral, no once-per-turn cap ->
    ~6 free attacks/turn loop; (2) Aerial Anchor removes rigging limiter -> loop
    unconditional. Concerns: save-less shove/prone (Momentum Strike), Featherweight no-sell
    of forced movement, L5 3-attack stack DPR, Aerial Evasion early on best defense. Also
    system finding: +50% fail penalty makes parry EV only ~0.875x (weak-but-safe; keeps
    riposte well-gated).
- **Status:** revision round pending. Clear bugs to be fixed regardless; two design forks
  sent to Kayki (parry payoff, Acrobat power profile).

- **Goal:** Parry engine REDESIGN (v2) + Acrobat/Trapeze revision.
- **Decisions (Kayki):**
  - PARRY V2 = per-class DC model (replaces contested-vs-attack-roll). Roll d20 vs Parry DC:
    above=negate, exactly=half, below=+50%. DC per class (Strongman ~8, Puppeteer ~15,
    Acrobat lowest/best). DC raised by: unarmed, ranged weapon equipped, tougher enemy;
    lowered by level/proficiency. Can't parry when stunned/incapacitated/can't see/no
    reaction.
  - Acrobat = defense-first: keep best defense, rein offense to rogue/monk band.
- **Revision cycle:** Oghma (re-spec MECHANICS.md + schema for DC model; also fix
  great-weapon-master prerequisite nullable) -> Ioun (render DC model) -> Corellon (Acrobat:
  new parry + fix Trapeze Swing once-per-turn cap, save-on-shove, rein L5 DPR) -> Moradin
  (Trapeze: Aerial Anchor no loop, Featherweight limiter) -> re-gate Deneir + Savras.
- **Status:** in progress.

- **Goal:** Phase 1 re-gate after v2 + balance revision.
- **Dispatched:** Oghma (parry v2 spec + parryBaseDC schema + GWM null fix) -> Ioun (render
  v2, drop parryAffinity badge, add Parry DC badge) + Corellon (Acrobat v2 + balance) [par]
  -> Moradin (Featherweight narrowed, option c) -> Deneir + Savras (re-gate).
- **Result: PHASE 1 PASSED.**
  - Parry v2 live: `parryBaseDC` (Acrobat 6..Puppeteer 15), eff DC = base - prof -
    floor(defMod/2) + situational, floor 3. Bands: Full Dodge / Grazing Parry / Overcommitted.
  - Acrobat rebalanced: Trapeze Swing once/turn (loop closed), L5 = 2 attacks/turn (Flow
    State XOR Trapeze Swing), Momentum Strike shove/prone now STR save + size cap.
  - Trapeze Featherweight Landing narrowed to falls/own mishaps only.
  - Deneir clean (7 files/5 cats); Savras PASS, no new issues.
- **OPEN ITEMS (not blockers):**
  - CALIBRATION: Acrobat parryBaseDC 6 floor-locks at ~85% Full Dodge from L1 — Savras
    suggests Acrobat DC 7 or engine floor 4. Awaiting Kayki.
  - HOUSEKEEPING: skills.json (list) vs skill.schema.json (single object) mismatch — fix
    via schema list-wrap or split per-skill. To schedule (Helm/Oghma).
  - Ioun render still not verified in a live browser (no JS engine in agent env).
- **Decisions (Kayki):** Acrobat parryBaseDC -> 7 (localized). Run app before Phase 2.
- **Done:** acrobat.json parryBaseDC 6->7 + Tumbler's Reflex text updated; manifest rebuilt
  clean. Server running on :8000, all endpoints 200. Awaiting Kayki's visual check before
  Phase 2. (No node in env, so JS syntax not auto-checked; user eyeballs in browser.)

- **Goal:** UI/naming tweaks from Kayki's browser review.
- **Decisions/changes:**
  - Renderer: "Hit Die" label -> "HP" (list card "HP d8/lvl", detail "HP: d8 per level").
    Data field stays `hitDie`; label-only change in app.js.
  - Removed leftover base-app seeds `data/classes/fighter.json` +
    `data/subclasses/champion.json` (non-circus SRD templates). Acrobat + Trapeze are now
    the templates for Phase 2 packets. Remaining seeds kept for now: fireball, skills, GWM
    (decide later). Manifest rebuilt: 5 files/5 cats.
  - Class rename: Strongman -> **The Sandow** (strongman archetype, after Eugen Sandow).
    Doc-only (class not yet authored). Updated DESIGN.md + IDEAS.md.
  - Clarified for Kayki: spell "level 3" = spell slot level, not character level; hitDie =
    HP not AC; no equipment/AC system exists yet (future track).

- **Goal:** Weapons brainstorm (Phase 2 class-building paused by Kayki's choice).
- **Decisions (locked):**
  - Weapons are bespoke/thematic but built on 5e's weapon-property chassis (reuse the math).
  - Damage types: physical + fire + psychic only.
  - Per-weapon parry profile = first-class stat (can it parry? range? DC mod?). Unique axis,
    ties into core parry mechanic.
  - Class proficiency restricts weapons (Sandow no juggling, etc.).
  - Special behavior split: weapon = stats + parry profile + flavor; engine-rider = class
    feature (Monk-style), so no weapon breaks in another class's hands.
  - Mundane baseline weapons still exist alongside signature circus weapons.
  - JUGGLER ENGINE finalized: "Juggle set" of N implements (3 at L1, grows), self-refills to
    full at start of each turn (no buying/gathering). Action = throw 0..N (each = an attack).
    Parry ability scales with how many still held; empty hands = can't parry. See DESIGN.md.
  - Build order for gear: weapons -> armour -> items.
  - Explained the Acrobat (Momentum combo meter + dodge/riposte parry) to Kayki in plain terms.
- **Next:** continue weapons brainstorm, then Oghma weapon schema + data/weapons/ + Ioun
  renderer, then author arsenal. Phase 2 classes still queued (paused, not cancelled).

- **Goal:** Acrobat risk pass (Kayki wants real risk/cost).
- **Changes (direct edits to acrobat.json):**
  - Riposte de-fanged: was a free weapon attack; now spend 1 Momentum on a Full Dodge for
    just 1d4 weapon-type damage. Minor reward, not a power spike.
  - Risk added: Trapeze Swing now PROVOKES opportunity attacks (removed the OA immunity);
    flashy-not-safe. Strike-and-Vanish keeps its OA-safe escape (costs 2 Momentum) as the
    deliberate contrast.
  - Trapeze flavor: Acrobat now CONJURES his own rigging from nowhere (his power) — no
    environmental rope dependency. Same for Juggler self-refill = teleports weapons to hand.
  - One-reaction squeeze made explicit in Tumbler's Reflex: parry costs your reaction, so no
    OA/other reaction that round; only one attack fully dodged per round. (More reaction
    points = future.)
  - Manifest rebuilt, acrobat.json valid.
- **FLAG (subclass rework, later):** Trapeze subclass "Aerial Anchor" removed Trapeze Swing's
  rigging requirement — now REDUNDANT since the base class self-conjures rigging. Rework
  Aerial Anchor when we revisit subclasses.
- **Next per Kayki:** build the WEAPONS system now (schema + data/weapons/ + renderer +
  Acrobat's arsenal), then armour, THEN the other classes. Still Acrobat-only otherwise.

- **Goal:** Weapons system foundation.
- **Rulings (locked):**
  - Parry usable vs ANY seen attack incl. opportunity attacks provoked on your own turn.
    When an OA hits: tank it (keep reaction) or parry (spend reaction). One reaction/round,
    refreshes at start of turn; parry XOR OA XOR other reaction; max one parry/round.
  - Monsters share the same 1-reaction economy (monster sheets = later, in IDEAS.md).
  - Weapons NOT hard-locked: anyone wields, but non-proficient = no proficiency bonus
    (attacks AND parry math). `proficientClasses` is informational.
  - Parry scales class + weapon: eff DC = classBase + weapon dcMod + situational − prof(if
    proficient) − ½ defMod, floor 3.
  - Weapon schema fields: id/name/source/flavor, category(simple|martial|signature),
    damage{die,type: slashing|piercing|bludgeoning|fire|psychic}, properties[5e grammar],
    range{normal,long}?, parryProfile{canParry,parryRange,dcMod,note}, proficientClasses[].
    No cost/weight (items layer later).
  - App is fully data-driven: new category = 1 line in build_manifest.py CATEGORIES + schema
    + a renderWeapon + CATEGORIES entry in app.js.
- **Dispatching:** Oghma (weapon.schema.json + MECHANICS reaction/parry rules + build_manifest
  category + seed weapons) -> Ioun (renderWeapon + nav) -> author Acrobat arsenal -> gate.
- **Done (weapons foundation):**
  - Oghma: `data/schema/weapon.schema.json` (fields per rulings; required name/category/
    damage/parryProfile). MECHANICS.md: added reaction-economy + parry-timing + non-proficiency
    rules; new eff-DC formula includes weapon dcMod; reconciled situational table (removed
    generic "ranged +3", kept unarmed +2; a weapon's parry behavior now lives in its
    parryProfile). Added "weapons" to build_manifest CATEGORIES. Seeds: `rapier.json`
    (martial/finesse/1d8 pierce, canParry -1) + `throwing-knives.json` (simple/thrown/1d4,
    canParry false). manifest.json hand-updated to include weapons (2 files).
  - Ioun work done BY AO (Agent dispatch blocked by classifier outage): added weapons to
    CATEGORIES + subtitle case + renderWeapon/parryProfileSection/proficientClassesSection
    in app.js, reusing existing CSS classes. Backward compatible.
- **INFRA OUTAGE (mid-task):** safety classifier temporarily unavailable -> Bash + Agent
  dispatch blocked; file read/edit still work. PENDING when it recovers: (1) live re-run of
  `python3 scripts/build_manifest.py` to confirm no warnings; (2) browser eyeball of Weapons
  tab; (3) Deneir+Savras gate on the weapons foundation; (4) author Acrobat's full arsenal.
- **Fix (Kayki caught it):** throwing-knives seed had canParry:false — wrong. A HELD knife
  can parry; only a THROWN one is gone. Changed to canParry:true, melee, dcMod +1 (mediocre:
  worse than rapier -1, better than unarmed +2). General rule for the arsenal: held
  melee-capable weapons incl. thrown ones (knives/handaxes/javelins) = canParry true; pure
  ranged (bow/crossbow) + any weapon after being thrown = false. Juggler engine governs how
  many knives are still held. MECHANICS unchanged (knives are melee+thrown, not "ranged").

- **Goal:** Acrobat arsenal authored + gated (tooling recovered).
- **Tooling:** classifier outage cleared; build_manifest runs; weapons validate via jsonschema.
- **Authored (data/weapons/):** shortsword (1d6 pierce, finesse+light, parry 0), whip (1d4
  slash, finesse+reach, parry 0), hand-crossbow (1d6 pierce, ammo+light+loading, 30/120,
  canParry false), aerial-ribbons (SIGNATURE, finesse+reach, parry -1). Plus seeds rapier
  (1d8, -1) + throwing-knives (1d4, +1). Manifest: 11 files / 6 cats (weapons=6).
- **Savras gate + fixes applied:**
  - Aerial Ribbons was 1d6 (strictly dominated whip + under-taxed reach vs rapier) -> cut to
    1d4, kept -1 parry. Now a DEFENSIVE signature (low dmg, best deflection, reach), matches
    whip's reach-tax; only edge over whip is the signature -1 (intended).
  - MECHANICS §1.6 stale Acrobat parryBaseDC 6 -> fixed to 7 (matches acrobat.json since the
    DC6->7 decision); recomputed odds row (L1 15/5/80, L5 10/5/85) + narrative.
  - Proficiency source-of-truth rule added to MECHANICS §1.5a: proficient if class grants the
    weapon's CATEGORY (Simple/Martial) OR weapon.proficientClasses lists you. Resolves the
    class-sheet-vs-proficientClasses ambiguity (Acrobat proficient w/ throwing-knives via
    "Simple weapons"; w/ aerial-ribbons via proficientClasses).
  - Clean per Savras: rapier/shortsword/whip/hand-crossbow match SRD lines.
- **OPEN:** throwing-knives held-vs-thrown parry depends on the Juggler engine (not built) —
  re-verify when Juggler is authored.

- **Goal:** Armor system (light/medium/heavy/shield), thematic but SRD-faithful.
- **Built (all by Ao directly, token-efficient):**
  - `data/schema/armor.schema.json`: category(light|medium|heavy|shield), baseAC, maxDexBonus
    (null=full/2/0), acBonus (shields), strengthRequirement, stealthDisadvantage. No
    proficientClasses (armor proficiency is category-based via class sheet). No cost/weight.
  - Added "armor" to build_manifest CATEGORIES + app.js (CATEGORIES entry, subtitle case,
    renderArmor + armorAC helper). Reused existing CSS.
  - MECHANICS new §1C: AC = to-hit threshold; attack must beat AC before a parry is possible;
    armor = AC ONLY, no parry modifier (heavy-armor classes brace, not dodge — parryBaseDC
    already encodes nimble-vs-braced). AC-by-category, Str req, stealth, proficiency rules.
  - 9 seeds (SRD-faithful reskins): Padded Motley/Tumbler's Leathers/Studded Showleather
    (light), Beasthide Wrap/Serpent-Scale Mail/Strongman's Breastplate (medium), Ironmonger's
    Chain Mail/Colossus Plate (heavy), Parade Shield (+2).
  - Manifest: 20 files / 7 categories (armor=9). All validate vs schema; app serves.
- **Savras gate: PASS**, no blockers/concerns. Nitpick: redundant stealthDisadvantage:false
  on shield (ignored). Naming: MECHANICS §1.6 still says "Strongman" vs DESIGN "The Sandow" —
  reconcile when the class is authored.
- **Gear roadmap status:** weapons DONE, armour DONE. Next per Kayki's order = build the other
  classes (each one at a time). Magic items w/ effects (BG3-style) = much-later phase, for the
  oneshot test builds. In IDEAS.md.

- **Goal:** Acrobat polish (Kayki review).
- **Clarified for Kayki:** Showstoppers cost SPECTACLE (shared pool), not Momentum. Momentum =
  personal engine (Momentum Strike / Trapeze Swing / Strike-and-Vanish / Flow State / riposte).
  Showstoppers/features show no flat damage when they're weapon-attack modifiers (Showstopper
  Swing = Trapeze attack vs all passed targets = weapon damage each; Vanishing Act = no damage).
  Flat-damage riders already list dice (Momentum Strike +1d6, Riposte 1d4).
- **Change:** Vanishing Act showstopper reworked — dropped full-invisibility; now = move full
  speed on Strike-and-Vanish without provoking OA and without the line-of-sight condition (clean
  disengage). acrobat.json valid + served.
- **OPEN (asked Kayki):** should Showstopper Swing ALSO add bonus damage (e.g. +1d6/target), or
  stay a pure target-multiplier? (SUPERSEDED — Spectacle dropped, see below.)

- **Goal:** DROP shared Spectacle resource (Kayki: shared pool = contention + complexity).
- **Decision (Kayki):** remove Spectacle entirely. Each class = ONE resource (its own engine).
  Showstoppers fold into the class's own engine cost.
- **Executed (system-wide):**
  - acrobat.json (Ao): removed spectacle block; engine desc no longer refs Spectacle; Wall-Run
    no longer "triggers Spectacle". Showstoppers folded into Momentum: Showstopper Swing -> +3
    Momentum flourish on Trapeze Swing (multi-target); Vanishing Act -> +2 Momentum flourish on
    Strike-and-Vanish (full-speed disengage, no invisibility).
  - trapeze.json (Ao): removed "can trigger Spectacle".
  - class.schema.json + MECHANICS.md (Oghma): deleted spectacle field + entire §2 Spectacle;
    renumbered; title now "Core Engine Spec — Parry". Validates.
  - app.js + index.html + style.css (Ioun): removed spectacleSection + call; legend panel &
    topbar button renamed "Parry & Spectacle" -> "Parry", Spectacle paragraph removed; dead CSS
    removed.
  - DESIGN.md (Ao): meta-resource decision -> per-class only; "Shared layer: Spectacle" section
    -> "Per-class resources (no shared layer)"; Juggler + Phase-0 refs cleaned. (Remaining
    "Spectacle" mentions are intentional DROPPED changelog notes.)
  - Manifest clean (20 files/7 cats); acrobat validates; grep confirms no live Spectacle deps.
- **Savras re-gate: PASS.** Clean removal, flourishes sanely costed (can't double-flourish pre-L4).
  Applied Savras's polish fixes: Trapeze Swing = bonus action; Strike-and-Vanish base decoupled
  from terrain (no-OA move always works, Hide per normal rules; flourish = full speed); Riposte
  1d4 auto-hits (no attack roll).
- **OPEN (pre-existing, not a bug):** Acrobat L3 lists subclasses Trapeze/Contortionist/Tightrope
  but only Trapeze is authored — Contortionist + Tightrope are planned, not yet built.

- **Goal:** Build Acrobat subclasses Contortionist + Tightrope (completes his 3 disciplines).
- **Authored (Moradin), parent=acrobat, L3 features:**
  - Contortionist (escape/evasion): Boneless (tight-space move + advantage to escape/avoid
    grapple/restrain/bind) + Slip the Knot (bonus action, 1 Momentum, end grapple/restrain/prone
    + 10ft no-OA move).
  - Tightrope (precision/balance): Perfect Balance (surface immunity + anti-prone/forced-move) +
    Improved Critical (crit 19-20, regain 1 Momentum on crit).
- **Savras gate: found 1 blocker + 2 concerns, ALL FIXED (Ao):**
  - BLOCKER Perfect Balance: blanket prone/forced-move immunity (gated on trivial >=1 Momentum,
    undercut L5 pacing) -> now ADVANTAGE on saves/checks vs prone/forced-move (not immunity).
  - CONCERN Slip the Knot: strictly better than Trapeze's Featherweight (same 1 Momentum, but
    hostile-imposed + free move) -> now ONCE per short/long rest (clutch escape); Boneless stays
    the repeatable in-combat tool (resolves overlap too).
  - CONCERN Improved Critical Momentum regen: uncapped vs engine's "once per turn" idiom -> now
    capped once per turn.
  - Manifest 22 files/7 cats; both validate; served. Fixes are conservative nerfs matching
    Savras's suggested directions (not re-gated).
- **ACROBAT COMPLETE:** class (L1-5) + all 3 subclasses (Trapeze, Contortionist, Tightrope) +
  arsenal + armour available. First class fully done.

- **Goal:** Kayki couldn't find the parry rules in the app (they were hidden behind the topbar
  "Parry" legend button).
- **Fix — added a browsable RULES section:**
  - New `data/schema/rule.schema.json` (name, summary, sections[{heading,paragraphs,list}]).
  - "rules" added to build_manifest CATEGORIES + app.js (now FIRST in sidebar) + subtitle case +
    renderRule.
  - 3 rule pages: `parry.json` (roll d20 vs DC: above=none, equal=half, below=+50%; DC formula;
    cost/timing; riposte), `reaction-economy.json`, `armor-and-ac.json`. Sourced from MECHANICS.md.
  - Also added the parry resolution inline to each class's Parry section (renderClass) so it's
    visible on the class page, with a pointer to the Rules tab.
  - Manifest 25 files/8 cats; rules validate; served.
- Reminder surfaced: below-DC penalty is +50% (Kayki misremembered as double; +50% was their
  earlier choice).

- **Goal/decision (Kayki):** ~3 proficient weapons per class (easier to balance). LOCKED in
  DESIGN.md weapons section.
- **Applied:** acrobat.json proficiencies.weapons -> ["Aerial Ribbons","Rapier","Whip"] (all
  finesse, all parry). Removed acrobat from shortsword.json + hand-crossbow.json
  proficientClasses (now []); they stay as generic weapons, no class proficient yet. Validated.
- **Rule for future classes:** give each ~3 signature weapons via weapon.proficientClasses;
  class sheet lists the same names for readability.

- **Goal:** Build class #2 — PUPPETEER (control/support). Design briefed with Kayki.
- **Locked (Kayki):** Charisma single-stat (attacks + control DC); MEASURED enemy control at
  1-5 (no early turn-hijack; full puppet gated to L5); strings work on enemies AND allies.
- **Design (Ao): ** d6, Cha primary, parryBaseDC 15 (worst), Dex defense, Light armor, no
  spell slots. Engine = Strings (tokens: attach within 60 ft, cap scales, leash/snap). Cha via
  "Strings of Will" (Control Wires use Cha; control DC 8+prof+Cha). Riposte: Full Dodge -> free
  String on attacker. Subclasses: Puppet Master / Warden / Tangleweaver.
- **Weapons authored:** control-wires.json (signature, finesse+reach, canParry RANGED, dcMod
  -1), dagger.json (simple, finesse+light+thrown, dcMod +1). Added puppeteer to whip
  proficientClasses. Puppeteer's 3: Control Wires, Dagger, Whip.
- **Dispatching:** Corellon (class L1-5) -> Moradin (3 subclasses) -> Deneir + Savras gate.
- **Built:** puppeteer.json (Corellon) — Strings engine (cap=prof bonus, 60ft leash), Strings of
  Will (Cha for Control Wires + control DC 8+prof+Cha), Manipulate/Tangle/Disrupting Pull/Guiding
  Pull, L5 Grand Marionette (gated 1-attack puppet). 3 subclasses (Moradin): Puppet Master
  (Turncoat Strings + Puppet's Spite), Warden (Warding Pull + Steadfast Line), Tangleweaver
  (Snare Weave + Binding Knots). Weapons: control-wires + dagger authored, whip shared.
- **Savras gate: revision (chassis sound). 4 concerns FIXED (Ao):**
  - Binding Knots: uncapped double-restrain + escape-disadv -> capped Cha-mod/long-rest, dropped
    escape-disadv.
  - Turncoat Strings: auto-hit + could hit allies -> re-check new target's AC; hostile-only.
  - Disrupting Pull disadv branch: no save -> Cha-save-gated.
  - Puppet's Spite: unconditional bonus dmg -> once/turn cap.
  - Nitpick: class.schema stale "Acrobat 6" -> 7. Fixes are conservative (matching Savras's
    directions); not re-gated.
- **Decisions:** Manipulate at-will (multi-target forced move, save-gated, no dmg) = INTENDED
  flagship. All valid, manifest 31 files/8 cats.
- **PUPPETEER COMPLETE** (class #2). 
- **OPEN (Helm task):** skills.json only has 5 skills; classes reference standard 5e skills
  (Deception, Performance, Insight, Intimidation, Sleight of Hand, Stealth, etc.) that don't
  exist as entries. Author the full 5e skill list. Affects Acrobat + Puppeteer.

- **Goal:** Kayki couldn't see "attacks" — app never connected weapons to a class's attacks/damage.
- **Fix (Ao, app.js + rules):**
  - Added `attacksSection(c)` to renderClass: lists the class's proficient weapons WITH damage
    (die + type + "+ ability modifier" + properties), pulled live from store.weapons by name;
    plus a note on how the Attack action / to-hit / damage works. Renders under Proficiencies.
  - New rules page `attacks-and-damage.json` (how to attack, which ability, damage = weapon die +
    modifier, class features add more; worked example: Puppet's Spite -> 1d4 + Cha + Cha).
  - Clarified to Kayki: attacks ARE the weapons; Puppet's Spite adds to the Control Wires hit.
  - Manifest 32 files/8 cats (rules=4); validated; served.

- **Goal:** Build class #3 — THE SANDOW (strongman tank). Briefed with Kayki.
- **Locked (Kayki):** Grit generation is SUBCLASS-relative (tank builds by taking hits, offense
  by dealing); throws include willing ALLIES (fastball special); tanking = Punish (Sentinel-
  style, no mind control).
- **Design (Ao):** id the-sandow, d12, STR primary, heavy armor, parryBaseDC 8 (brace, 2nd-best),
  defenseAbility STR, no spell slots, Extra Attack at L5. Engine Grit: baseline gen (first time
  each turn you hit OR are hit) + subclass primary stream. Heave (throw enemies/objects/willing
  allies), Hold the Line (Sentinel punish), Brace (spend Grit to reduce damage). Subclasses:
  Bulwark (tank) / Juggernaut (offense) / Human Cannonball (mobility).
- **Weapons authored:** strongmans-barbell (2d6 bludgeon, heavy+two-handed, dcMod 0), cannonball
  (1d10 bludgeon, heavy+thrown 15/30, canParry false), iron-chain (1d8 bludgeon, reach+two-
  handed, dcMod -1). All proficientClasses ["the-sandow"].
- **Dispatching:** Corellon (class L1-5) -> Moradin (3 subclasses) -> Deneir + Savras gate.
- **Built + gated:** the-sandow.json (Grit engine baseline + subclass streams, cap Con+prof;
  Mighty Build; Heave throw enemies/objects/willing allies; Hold the Line Sentinel-punish;
  Brace; Extra Attack + Earthshaker L5). Subclasses: Bulwark (Iron Resolve + Guardian's Wall),
  Juggernaut (Unstoppable Force + Bulldozer Charge), Human Cannonball (Kinetic Buildup + Cannon
  Launch). Weapons: strongmans-barbell, cannonball, iron-chain.
- **Savras: 2 blockers + concerns FIXED (Ao):** Brace -18/hit -> capped -6 (2 Grit/instance);
  Guardian's Wall free unlimited -> reaction-gated once/round; Iron Resolve self-double-dip ->
  allies only; Unstoppable Force bad prone ref removed; Heave collision bystander gets a save +
  fastball needs clear path. Accepted as-is: Bulldozer position-gated, Cannon Launch single-target.
  All valid; manifest 39/8 (classes=3, subclasses=9). Conservative fixes, not re-gated.
- **THE SANDOW COMPLETE (class #3).** 3 classes done: Acrobat (dodge) / Puppeteer (control) /
  The Sandow (tank) — full defensive-profile spread now exists for cross-class balancing.

- **Goal (AUTONOMOUS, Kayki asleep):** build Doppelganger + Joker end-to-end, Ao makes design
  calls, brief Kayki after. Ao-chosen designs:
  - DOPPELGANGER: id doppelganger, d8, Dex primary, parryBaseDC 9, Dex defense, engine=Clones
    (tokens: semi-real mirror duplicates; swap/decoy/mirror-miss). Weapons: Mirror Blades
    (signature), Dagger, Shortsword. Subclasses: Impersonator/Swarm/Mirror.
  - JOKER: id joker, d8, Cha primary, parryBaseDC 11, Dex defense, engine=Mayhem points + Wild
    Cards (BOUNDED random table, no catastrophic results — tightest guardrails). Weapons: Razor
    Cards (signature), Harlequin's Cane, Dagger. Subclasses: Anarchist/Gambler/Harlequin.
  - Weapons authored: mirror-blades, razor-cards, harlequins-cane; dagger + shortsword
    proficientClasses updated.
  - FLAG for Kayki brief: Doppelganger primary Dex (overlaps Acrobat) — could revisit to Cha/Int;
    Joker Wild Cards variance needs Kayki's taste check; both L5 capstones + whether they get
    Extra Attack are Ao calls to confirm.
- **DOPPELGANGER built + gated (Savras: 2 blockers FIXED):** engine Clones (cap prof, Swap, Mirror
  Image bounded redirect, Decoy Detonation, Mirror Assault L5). Subclasses Impersonator/Swarm/
  Mirror. FIX: Mirror Guard's "spend a Clone for advantage on Parry" rider REMOVED (it stacked
  with Mirror Image + Riposte clone-refund into a ~92-97% no-damage loop exceeding Acrobat's
  locked best-parrier ceiling); Shattering Reflection (Mirror) capped once/turn. Now: bounded
  layered defense (Mirror Image <=50% + one normal DC-9 Parry/round). DONE.
- **JOKER built + gated (Savras: PASS, no blockers):** engine Mayhem + d8 Wild Card table
  (bounded, 5 boons/2 minor backfires/1 redraw). Subclasses Anarchist/Gambler/Harlequin. Applied
  2 clarity fixes: Loaded Deck nat-20 die doubles on crit; Double Down excludes Parry rolls.
  OPEN (numeric, for later w/ monster stats): Harlequin nova-turn DPR ~35% over rogue band
  (Reckless Grin + Loaded Deck + Ace-in-the-Hole guaranteed crit) — paid for by Mayhem + reciprocal
  advantage, flagged not nerfed. DONE.
- **5 CLASSES COMPLETE:** Acrobat, Puppeteer, The Sandow, Doppelganger, Joker (+ all 15 subclasses).
  Manifest 50 files/8 cats. Remaining unbuilt: Illusionist, Jester, Juggler.
- **Bonus autonomous task:** dispatching Helm to author the full 5e skill list (close skills.json
  dangling-ref gap across all classes).
- **SKILLS DONE:** Helm authored all 18 standard 5e skills in skills.json (grouped by ability).
  Reconciled skill.schema.json to accept a single object OR a list (oneOf) — closes the old
  schema/data mismatch. skills.json validates (18). Dangling skill refs across all classes RESOLVED.
- **FULL PROJECT VALIDATION SWEEP: 50 files, 0 errors, all subclass parents resolve.** Clean state.
- **Cross-class Savras parity review DONE (all 5 classes). TOP 5 for Kayki to decide (NOT changed
  by Ao — design calls):**
  1. **Joker Chaotic Parry is an unsanctioned parry lever** (peek-then-reroll) — mathematically
     makes the "dead center" Joker parry >= the Acrobat (the locked best parrier) at all L1-5.
     Fix needs a design call: reframe it (note: plain "advantage" would ALSO overshoot Acrobat, so
     not a simple swap). HIGHEST leverage.
  2. **The Sandow durability stack** — only class with medium/heavy/shield + biggest die (d12) +
     2nd-best parry (DC8) + Brace flat mitigation + hardest-hitting signature (2d6). ~8x "hits to
     down" vs Puppeteer (5e norm ~2.5-3x). Trim 1-2 levers (which = Kayki's call).
  3. **Joker has no L5 attack-count lever** (others all get one) -> lowest sustained DPR. Add one
     or document as intentional "bigger hits, not more."
  4. **Joker SAD vs MAD** — primary Cha but defenseAbility Dex (3-stat burden like Puppeteer, but
     without Puppeteer's justification). Consider defenseAbility Cha.
  5. Minor: Acrobat/Doppelganger/Joker share the SAME save pair (Dex+Cha) -> party-wide same-save
     weakness; and Grit cap barely constrains post-subclass Sandow (Brace near always-on). Easy tweaks.
  (Also noted: Puppeteer has zero SELF-mitigation/escape — fragile by design but no disengage tool.)
- **END OF AUTONOMOUS SESSION.** Built Doppelganger + Joker (fully gated, blockers fixed), closed
  skills gap (18 skills + schema reconcile), full validation clean (50 files/0 err), cross-class
  review captured above. Nothing in the Top-5 was changed — awaiting Kayki's decisions.

## 2026-07-11

- **Goal:** Session start — launcher + doc sync (yesterday's build confirmed complete).
- **Verified:** disk matches log — 5 classes / 15 subclasses on disk; `build_manifest.py`
  rebuilt clean (50 files, 0 JSON/dup errors). Nothing was mechanically half-done.
- **Done:**
  - Added `Grimoire.bat` (Windows launcher): starts `python -m http.server 8777`, opens the
    app in the browser. Verified index.html + manifest serve 200 over HTTP.
  - Synced stale `README.md`: "Run it" now points to Grimoire.bat; "Seeded examples" fixed
    (Fighter/Champion seeds removed long ago, skills now 18 not 5 — only Fireball + GWM remain
    as generic seeds).
- **Flagged (not changed):** Corellon/Moradin agent charters still cite `fighter.json` /
  `champion.json` templates that no longer exist (cosmetic dangling ref).
- **Still open (awaiting Kayki):** Top-5 cross-class balance decisions; 3 unbuilt classes
  (Illusionist, Jester, Juggler).

- **Goal:** Readability pass on the UI (Kayki request) — make list/detail views scannable.
- **Done (app.js + style.css, no data changes):**
  - Classes tab: each card now shows a 2-line flavor summary (`.card-class`/`.card-summary`,
    clamped to 2 lines); still alphabetical.
  - Skills tab: grouped into sections by the ability they scale with (Str→Cha order).
  - Subclasses tab: grouped into sections per parent class (alphabetical by class name);
    card meta uses the class display name, not the raw id.
  - Class detail: "Choose two from …" skill sentence replaced by a bordered "Skill
    Proficiencies" table (Skill | Scales with), rows sorted by ability. Parser handles the
    ", and" Oxford-comma case (verified against all 5 classes). Skills dropped from the plain
    Proficiencies line.
  - New shared `.data-table` (Excel-style bordered/zebra), `.grouped`/`.group`/`.group-title`.
  - Helpers added: makeCard, renderGroupedList, groupBySkillAbility, groupBySubclassParent,
    className, parseSkillChoice, skillChoiceSection.
  - No JS engine on the box (node/deno absent) — parser logic validated via Python-equiv
    regex; all assets serve 200. Manifest unchanged (50 files).

- **Goal:** Run the app without a persistent cmd window (Kayki request).
- **Done:** Added `Grimoire.vbs` (WScript launcher, window style 0 → server runs hidden;
  detects py/python/python3 via `where`, MsgBox if none; opens browser) and `Stop Grimoire.bat`
  (kills the PID LISTENING on 8777 via netstat+taskkill). Kept `Grimoire.bat` as the visible/
  debug launcher. README "Run it" documents all three. Not testable from WSL (Windows-only).

- **Goal:** Kayki's UI changes "not showing" — diagnosed as browser cache (served app.js/css
  DID contain the edits; curl confirmed). Fix: hard-refresh once + permanent no-cache server.
- **Done:** Added `scripts/serve.py` (SimpleHTTPRequestHandler + `Cache-Control: no-store`,
  verified header emitted). Pointed Grimoire.bat + Grimoire.vbs at `scripts\serve.py` instead
  of `-m http.server`, so future edits show on a normal refresh. No code/data logic changed.

- **Goal:** Correct my earlier misread — the "confusing options" was the Joker's WILD CARD d8
  table (8 outcomes in one text blob), not the skill-proficiency line; plus rework the Classes
  tab into fields.
- **Done (app.js + style.css):**
  - Feature descriptions containing a "(1) Name: effect (2) …" list now render as a table
    (# | Result | Effect) via `renderFeatureDesc`/`extractNumberedTable`; lead-in text stays a
    paragraph. Generic — scanned all classes/subclasses; only Joker Wild Card matches today, so
    only it changes, and any future numbered-table feature auto-formats. Parser verified against
    the real Wild Card text (8 rows + lead split correctly).
  - Classes tab: replaced grid cards with a vertical stack of full-width fields
    (`renderClassList` + `.class-field`): class name on top, meta+Parry DC, 2-line description
    below, and a round open-arrow (→) button; whole field navigates to the sheet. Alphabetical.
  - Cleaned dead code: makeCard's class branch + unused `.card-class/.card-summary` CSS removed.
  - Kept the class-detail "Skill Proficiencies" table from before (harmless improvement).
  - All served fresh (no-cache server confirmed). No data/manifest changes.

- **Goal:** System-wide Scaling Die convention (Kayki: die-size stepping, breakpoints 5/11/17).
- **Decision (locked):** die SIZE steps up one at L5/L11/L17 along d4→d6→d8→d10→d12 (never past
  d12); count + flat/ability mods unchanged (Bardic-Inspiration model = bounded variance, fits
  Joker). Opt-in per value via `[[XdY]]` notation so caps/DCs are never auto-inflated.
- **Done:**
  - Oghma-layer: added MECHANICS.md §3 (Scaling Die rule + `[[XdY]]` notation + scope).
  - Ioun-layer: app.js `fmtDesc`/`scalingDieHTML`/`DIE_CHAIN` — expands `[[XdY]]` to base die +
    "▲" marker whose tooltip lists the 1/5/11/17 progression; wired into feature + engine
    descriptions. CSS `.scaling-die`.
  - Applied to Wild Card (2/5/7) + 7 single-die riders (Acrobat Momentum Strike, Joker Loaded
    Deck, Sandow Heave, Gambler Double Down, Impersonator Borrowed Trick, Juggernaut Bulldozer
    Charge, Mirror Shattering Reflection). 10 tokens total, validated, served fresh.
- **HELD for a design/Savras call (not tagged):** Anarchist Powder Burst 2d6 + Human Cannonball
  Cannon Launch 2d6 (bigger AoE dice), and Doppelganger Decoy Detonation (1d6→2d6) + Swarm
  Overwhelming Numbers (1d4→1d6) which already scale MANUALLY by adding a die — converting those
  to die-stepping is a behavior change.
- **Balance flag:** scaling Joker's Loaded Deck + Wild Card dice worsens the already-flagged
  nova-DPR at L11+; negligible in the current L1-5 scope (only the L5 step reachable). Wants a
  Savras pass before extending past L5.

- **Goal:** Kayki: class pages show skills but weapon "attacks"/damage aren't clear — features
  say "weapon attack"/"weapon damage" with no number (depends on weapon).
- **Done (app.js):** rebuilt `attacksSection` from a bullet list into a per-weapon damage TABLE
  (Weapon [+range] | Damage [+versatile] | Type | Properties), pulled live from store.weapons.
  Intro note now explicitly says any feature referencing a "weapon attack"/"weapon damage" (extra
  attack, area strike, rider) uses these weapons + this damage. Uses shared `.data-table`; no new
  CSS, no leftover `.attack-list`. No data/manifest changes.
- **Note:** the AoE "hit everyone within 30 ft" attack Kayki recalled isn't in the Acrobat as
  described — closest are Trapeze Swing / Flow State (grant weapon attacks). The new table makes
  their damage legible.

- **Goal:** Kayki: surface each class's derived mechanic numbers (gambit DC etc.) up top like a
  Monk sheet, generically for all + future classes; + restyle the scaling-die tooltip.
- **Done:**
  - Schema: added optional `keyStats` array to class.schema.json (items {label, value, note?}).
    Documented as the at-a-glance mechanic block every class should fill.
  - Data: authored keyStats for all 5 classes — save/effect DC (Gambit/Control/generic Save DC),
    resource cap, and Parry Base DC each. Validated with jsonschema (all pass).
  - Renderer: `keyStatsSection` renders a "Key Numbers" stat grid (gold-accented cards, label/
    value/note) right under the class header, before the standard grid. Future classes that fill
    keyStats get it automatically — no renderer change needed.
  - Scaling-die tooltip: replaced native `title=` (which showed a `?` cursor + plain text) with a
    custom on-brand box (`.scale-tip`: panel-2 bg, gold border, arrow, title/row/levels lines),
    no help cursor, fades in on hover. Bigger, matches site design.
  - Manifest 50 files, clean; all served fresh.

- **Goal:** (Kayki) ALL multi-option features -> tables (not just numbered ones), every class; and
  fix orphan kit weapons (Joker Dagger unsupported).
- **Done:**
  - Structured `options` field added to class + subclass feature schema (items {roll?, name, effect}).
    Renderer `optionTable` shows any feature's options as a table (Roll|Result|Effect for random
    tables, Option|Effect for pick-one menus); `description` = intro. Scaling dice work in effects.
  - Migrated Joker Wild Card (8-roll table) and Gambit (3-option menu) from prose to `options`.
    These were the only two multi-option features in the game; others are generic ("weapon attack").
  - Orphan-weapon audit: real orphans only on the Cha classes. Fixed by keying weapon features off
    "a finesse weapon you're proficient with" (whole kit is finesse): Joker Wild Talent/Loaded Deck/
    Ace in the Hole now cover Dagger; Puppeteer Strings of Will now covers Dagger + Whip. Acrobat/
    Doppelganger/Sandow already generic — no change needed.
  - Schema-valid (jsonschema, all classes+subclasses), manifest 50 clean, served fresh.

- **Goal:** (Kayki) no shared combat maneuvers (topple/cleave) — only class features. He asked how
  Joker even makes a basic attack. Chose: add Weapon Mastery system.
- **Answered:** Joker's basic attack = the Attacks-table weapon (Cha via Wild Talent); hitting/being
  hit generates Mayhem, then spend it. That loop already existed.
- **Done — Weapon Mastery (2024-D&D style, baseline for every class):**
  - weapon.schema.json: new `mastery` enum (Cleave/Graze/Nick/Push/Sap/Slow/Topple/Vex).
  - All 14 weapons tagged: barbell=Cleave; cannonball/... Push; dagger/throwing-knives=Nick;
    ribbons/control-wires=Slow; whip=Sap; cane/iron-chain=Topple; rapier/shortsword/mirror-blades/
    razor-cards/hand-crossbow=Vex. (Graze defined but unused.)
  - New rules page data/rules/weapon-mastery.json (what it is + all 8 definitions + save DC rule).
  - Renderer: MASTERIES map + `masteryHTML` tooltip; Attacks table gained a **Mastery** column
    (hover = effect); weapon detail page shows a Mastery section. Reusable `.tip-term/.term-tip`
    tooltip CSS (on-brand box, matches scaling-die).
  - Rule chosen: any character proficient with a weapon may use its Mastery, no feature/limit
    (baseline for all classes). Save-based masteries use 8 + prof + attacking-ability mod.
  - jsonschema-valid (all weapons), manifest 51 files (rules=5), served fresh.

- **Goal:** (Kayki) didn't understand "Light" / Nick — app never explains weapon properties.
- **Done:**
  - New rules page data/rules/weapon-properties.json (defines Finesse, Light, Heavy, Reach, Thrown,
    Two-handed, Versatile, Ammunition, Loading, Special).
  - app.js: PROPERTIES glossary map + `propsHTML` — property names in the Attacks table AND weapon
    detail page are now hover-terms (reuse `.tip-term`/`.term-tip`). Added `statHTML` (stat with
    trusted-HTML value) for the weapon Properties cell.
  - Rewrote MASTERIES.Nick to be self-contained (explains two-weapon fighting inline, no jargon).
  - Manifest 52 files (rules=6), served fresh.

- **Goal:** (Kayki) Parry defense shouldn't be Dex-only — use each class's main stat; make the DC
  visibly modifiable (not a lone number); diversify saves.
- **Done:**
  - `defenseAbility` = primaryAbility for all (CONVENTION added to schema). Only Joker + Puppeteer
    changed (Dex->Cha; fixes their MAD tax); Acrobat/Doppelganger already Dex, Sandow already Str.
    Joker Chaotic Parry text updated Dex->Cha.
  - parrySection now renders the effective-DC formula (base − prof − half [defense] mod ± weapon ±
    situational, min 3, lower=better) so the sheet shows the DC is dynamic, not a lone stat.
  - Saves rebuilt for full six-ability coverage, distinct pairs, each = one strong + one weak:
    Acrobat Dex+Str, Doppelganger Dex+Int, Joker Cha+Dex, Puppeteer Cha+Wis, Sandow Str+Con.
    (Int gap closed; Dex+Cha cluster broken — only the two Dex-primary classes moved off Cha.)
  - jsonschema-valid, manifest 52, served fresh.
- **Balance flag (Savras):** Joker/Puppeteer now subtract half their PRIMARY (high) stat on Parry —
  a small defensive buff vs the old secondary-Dex. Puppeteer still worst parrier (base 15); check
  Joker interaction with nova. parryBaseDC values were calibrated assuming Dex defense.

- **Goal:** (Kayki) Parry DC must be FIXED — the v3 prof + half-ability reductions scaled to the
  floor (L5 Acrobat ~DC 3 = unhittable = broken). Keep tactical mods. Compensate Joker+Puppeteer.
- **Decisions (locked):** Fixed base + tactical mods; compensate Joker + Puppeteer.
- **Done:**
  - MECHANICS.md §1.5 -> v4: removed `- proficiency bonus` and `- floor(defense mod/2)`. Effective
    DC = base + weapon dcMod + situational (min 3), NO level/ability scaling. defenseAbility now
    feeds ONLY the Riposte attack roll (§1.9-1.10), not the DC. class.schema defenseAbility desc
    updated to match.
  - Fixed the DC-formula sentence in all 4 parry features (Acrobat/Doppelganger/Joker/Sandow):
    now "This DC is fixed... never drops below 3." (Puppeteer's parry was reskin-only, no edit.)
  - Renderer parryFormula rewritten: "fixed... base ± weapon ± situational, never below 3."
  - Compensation passives (L1): Joker **Trickster's Luck** (Cha-mod/long-rest, turn an
    Overcommitted Parry into a Graze); Puppeteer **Bodyguard Strings** (Cha-mod/long-rest, redirect
    a hit's damage onto a stringed creature within 10 ft).
  - jsonschema-valid, manifest 52, served fresh.
- **Savras flags (need review):** (1) parry success is now a FLAT per-class probability at all
  levels (Acrobat base 7 = ~65% dodge forever; Puppeteer 15 = ~25%) — confirm the base spread feels
  right with no scaling. (2) Bodyguard Strings redirects FULL damage onto an unwilling stringed
  enemy with no save — bounded by uses+setup but punchy; verify not abusable. (3) Trickster's Luck
  is pure defense, low risk.

- **Goal:** (Kayki "deploy them all") clear the open queue — approve compensation passives + apply
  all remaining flagged items.
- **Done:**
  - Compensation passives (Joker Trickster's Luck, Puppeteer Bodyguard Strings) APPROVED, live.
  - Scaling Die applied to the held AoE dice: Powder Burst 2d6 -> [[2d6]], Cannon Launch 2d6 ->
    [[2d6]] (scale 2d6/2d8/2d10/2d12).
  - Manual-scaling features converted to unified Scaling Die: Overwhelming Numbers 1d4 -> [[1d4]]
    (lossless — [[1d4]] hits 1d6 at L5, matching the old manual), Decoy Detonation 1d6 -> [[1d6]]
    and dropped the "increasing to 2d6 at 5th" clause. **NOTE: Decoy's L5 value changes 2d6 -> 1d8
    (a nerf at L5, but now scales on to 1d10/1d12 at 11/17). Flag if you want it stronger.**
  - Reckless Grin (Harlequin) broadened "Razor Cards or Harlequin's Cane" -> "a finesse weapon
    you're proficient with" (Dagger now supported in the Harlequin build too).
  - jsonschema-valid (classes+subclasses), no stale manual-scaling clauses, manifest 52, served.
- Open queue now clear except: Savras balance pass (fixed-DC spread, Bodyguard Strings, Joker nova)
  and Kayki's trimming pass.

- **Goal:** Savras balance pass (dispatched) + apply fixes.
- **Savras findings (full report in session):** 2 Blockers, 3 Concerns, 4 Nitpicks. Clean: base DC
  ordering, Trickster's Luck, saves, defense=primary, mastery assignments, no riposte loops.
- **FIXED (Ao):**
  - Blocker 1 — Joker Chaotic Parry reroll broke Acrobat's best-parrier ceiling (~72.5% > 70%).
    Fix: reroll now costs **1 Mayhem** (bounded, not free/at-will) → sustained rate back under Acrobat.
  - Blocker 2 — `defenseAbility` was a dead field (no riposte rolls to hit). Fix: MECHANICS §1.5 +
    schema note it as vestigial/reserved for future roll-to-hit content (not a live mechanic now).
  - Concern 3 — Doppelganger Mirror Image + Parry hit 77.5% at L5 (>70%). Fix: capped Mirror Image
    redirect at **2-in-6** (Hall of Mirrors no longer raises it) → ~70%, at/under Acrobat.
  - Concern 5 — Bodyguard Strings sequencing ambiguous. Fix: redirect resolves the attack (full
    damage, no save for unwilling), you can't ALSO Parry the same hit, costs no action/reaction.
  - Nitpick 7 — DESIGN.md doc-synced (removed stale "proficiency lowers DC" + "ranged +3 DC" lines).
  - Validated, manifest 52, served.
- **SURFACED to Kayki (design calls, NOT auto-fixed):**
  - Concern 4 + Nitpick 9 — Joker RANGED nova (Razor Cards + Loaded Deck + Ace in the Hole, no melee
    risk / no Reckless Grin tax) is base-chassis, ~= the tracked Harlequin nova but with no downside;
    scaling die adds a hair at L5. Pre-existing, needs a nova design decision.
  - Nitpick 6 — Juggernaut Iron Chain (Topple) + Bulldozer Charge = two independent prone saves from
    one hit; monster-stat dependent, minor.

- **Goal:** (Kayki) balance ONLY Joker/Acrobat/Puppeteer for now; he hasn't reviewed Doppelganger
  or Sandow yet.
- **Done:**
  - REVERTED the Doppelganger Mirror Image 2-in-6 nerf back to original 3-in-6 (out of scope). The
    L5 anchor breach (Mirror Image + Parry ~77.5% > Acrobat 70%) is PARKED for Kayki's Doppelganger
    review, not fixed.
  - Joker nova (Savras Concern 4) FIXED: Ace in the Hole now carries a reciprocal risk — "until the
    start of your next turn, attack rolls against you have advantage" — so the no-risk ranged
    guaranteed-crit nova is no longer strictly better than the melee Harlequin version (which pays
    the same via Reckless Grin). Note: range-dependent downside; offered alternatives to Kayki.
  - Acrobat: Savras-clean, nothing to change. Puppeteer: Bodyguard Strings already clarified.
  - Sandow/Juggernaut double-prone: left untouched (out of scope).
  - Validated, manifest 52, served.
- **PARKED for Kayki's own review (Doppelganger + Sandow):** Doppelganger Mirror Image L5 breach;
  Juggernaut Iron-Chain-Topple + Bulldozer-Charge double-prone.

- **Goal:** (Kayki) D&D-Beyond-style structured fields under every feature (Action/Cost/Uses/Range/
  Save); explicit clone-summon skill; ranges shown explicitly, not buried in prose.
- **Done:**
  - Schema: added optional `meta` {action, cost, uses, range, save} to class + subclass feature items.
  - Authored `meta` for ALL 84 features across 5 classes + 15 subclasses (action economy, resource
    cost, use limits, range/area, save DC).
  - Rewrote the "Clones" (Doppelganger) and "Strings" (Puppeteer) L1 features to state the
    create/attach action explicitly (bonus action, range, cap) — was previously only in the engine.
  - Renderer `metaRow` shows the fields as labelled chips below each feature name (action chip
    gold-accented); CSS `.feature-meta/.fmeta`.
  - jsonschema-valid (all), manifest 52, served fresh.
- **Next:** Kayki to "twist" Doppelganger (balance/design tweaks) — Mirror Image L5 breach still parked.

- **Goal:** (Kayki) chip label "Action" -> "Cost"; and Parry DC = base ± situational ONLY (drop the
  weapon parry modifier too).
- **Done:**
  - metaRow: merged action-economy + resource into a single **Cost** chip (e.g. "Bonus Action · 1
    Mayhem"). Chips now: Cost / Uses / Range / Save.
  - Parry DC v5: removed the per-weapon `dcMod` term entirely. Effective DC = **base + situational,
    min 3** — no level, ability, OR weapon scaling. Removed dcMod from all 11 weapons + weapon
    schema; MECHANICS §1.5 -> v5 note (flags the stale §1.6 math table as obsolete/history).
    Renderer parry-formula line + weapon Parry Profile updated (weapon no longer changes the DC).
  - jsonschema-valid, manifest 52, served fresh.
- **Doc debt (noted, not fixed):** MECHANICS §1.6 worked-math table still shows the old
  proficiency/ability scaling — marked OBSOLETE in the v5 note but not rewritten.

## 2026-07-12

- **Goal:** Continue DOPPELGANGER review with Kayki. He flagged 3 dead/broken things.
- **Decisions (Kayki):**
  - Clones are STATIONARY once placed (reposition only via Swap/re-spawn) — removed the
    "move each Clone up to your speed" clause. Matches 5e Mirror Image.
  - Clones are SNAPSHOTS: copy every buff affecting you at the instant of spawn (advantage,
    damage riders, weapon enchant) and keep them for life even after yours end; never gain
    later buffs. AC = yours, no HP (one hit kills).
  - New L1 **Mirror Barrage** (replaces the dead Mirror Guard slot): bonus action, every Clone
    in reach makes one weapon attack for HALF your damage (round down); all in-range Clones
    swing at once; clones SURVIVE; once/turn. (Kayki's answer: survive, not shatter.)
  - New L3 **Splintered Reflexes**: +1 reaction/round. Second reaction = OA or a clone reaction
    only (e.g. fire Decoy Detonation on an enemy's turn) — NEVER a 2nd Parry, so Acrobat stays
    the best defender (Kayki's answer: no 2nd parry, protects the locked pillar). This is the
    real L3 kit feature Doppelganger was missing (other classes get gateway + a real L3 ability).
  - **Decoy Detonation reworked** (old reaction-on-enemy-move trigger never fired in real
    combat): now an ACTION — detonate a Clone you placed; Dex save, [[1d6]] psychic, on fail
    shoved 5 ft straight away from the blast. Dropped the old "disadvantage on next attack"
    rider (bloat). Still usable as a reaction from L3 via Splintered Reflexes.
- **Also fixed:** Mirror Guard was a DEAD slot — just re-explained Parry, contained a STALE line
  ("weapon parry modifier adjusts the DC" — false since v5), and both engine.spend + parryReskin
  pointed to a removed "destroy Clone -> advantage on Parry" rider. All removed. Doppelganger's
  Guise kept as-is (standard subclass gateway, every class has one — not filler).
- **Result:** doppelganger.json schema-valid; L1 = Clones/Mirror Barrage/Mirror Image/Swap;
  L3 = Doppelganger's Guise/Splintered Reflexes. keyStats gained a Reactions row. No stale
  "Mirror Guard" refs anywhere. Manifest clean (52 files/8 cats).
- **FLAG for Savras (deferred, not blocking):** at L5, Mirror Barrage (half-dmg from up to 3-4
  clones) + Mirror Assault (extra attack) + main attack could stack a lot of hits — wants a DPR
  balance pass. Also: snapshot buffs + Mirror Barrage could multiply a strong rider across clones.
- **Subclasses NOT yet reviewed** (Kayki hasn't looked): Impersonator, Swarm, Mirror. Mirror
  Image L5 anchor breach still PARKED (3-in-6 + Parry ~77.5%).

- **Goal:** ACROBAT review (Kayki) + cross-class parry-explainer audit.
- **Doppelganger:** Kayki OK'd Mirror Assault as-is (1 clone, consumed). No change.
- **Acrobat changes (acrobat.json):**
  - Removed dead **Tumbler's Reflex** (pure parry re-explainer + stale v5 weapon-DC line) ->
    new L1 **Counterflow**: on a successful Parry (Full Dodge OR Grazing Parry), your next
    attack before end of next turn has advantage; once/round (reaction-gated).
  - Replaced **ASI at L4** with new **Flowing Reflexes**: once/turn, on a successful Parry
    regain your reaction (can't re-Parry with it); on a natural 20 Parry regain 2. Never a
    surer dodger (1 Parry/round cap holds). **FLAG: this removes Acrobat's L4 ASI — every other
    class still has ASI at L4. Kayki asked for it explicitly; easy to revert (keep ASI, move
    Flowing Reflexes elsewhere) if he changes his mind.**
  - **Momentum economy clarified (the "fucked up" chips):** generation now movement-only —
    removed Trapeze Swing + Strike-and-Vanish from the generator list (they were BOTH generating
    and spending Momentum = the confusion). Now: move 10ft near a hostile / Dash / Disengage /
    Wall-Run GENERATE; all techniques only SPEND. Engine text states "no technique that spends
    Momentum also grants it." Minor economy shift (slightly less gen) -> Savras flag.
  - Meta chip fix: rider "action" field "Part of Attack" -> "On a hit" (Momentum Strike) /
    "After you hit" (Strike-and-Vanish) so the Cost chip reads clearly (was "Cost: Part of
    Attack · 1 Momentum" = confusing).
  - **Wall-Run:** now once/turn + capped at HALF your speed (was full speed, unlimited).
  - **Riposte lash-back now scales** on a BESPOKE curve (Kayki-specified): 1d4 L1 / 1d6 L3 /
    1d8 L5 / 1d10 L7 / 1d12 L9 / **1d20 L12**. Written as EXPLICIT text, NOT [[XdY]] notation,
    because it deliberately breaks the standard Scaling Die convention (which steps at 5/11/17
    and caps at d12) — do NOT convert it to [[1d4]] or it'll render the wrong (standard) curve.
- **Cross-class parry-explainer audit (Kayki asked):**
  - **The Sandow "Plant Your Feet" = same dead re-explainer + stale weapon-DC line.** LEFT on
    purpose (Sandow not reviewed yet) — REMIND Kayki to fix it when we reach the Sandow sheet.
  - **Joker "Chaotic Parry"** = NOT dead (real lever: 1 Mayhem to reroll parry); only fixed its
    stale v5 weapon-DC line now (correctness, no redesign).
  - Puppeteer + Doppelganger clean.
- **Result:** acrobat + joker schema-valid; manifest 52/8. Only the-sandow.json still carries the
  stale "weapon's own parry modifier" line (intentional, pending Sandow review).
- **Savras flags (deferred):** Counterflow advantage + Flowing Reflexes reaction-regen action
  economy; Momentum generation nerf; all with the Doppelganger Mirror Barrage DPR flag.

- **Goal:** Savras Acrobat review dispatched; Kayki decided on the findings + a batch of changes.
- **Savras Acrobat review (read-only):** 1 Blocker (Flowing Reflexes breaks locked 1-reaction rule,
  undocumented), 6 Concerns (Counterflow near-free/stacks, crowd nova, riposte off-convention,
  Strike-and-Vanish no cap, no ASI L1-5, Tightrope crit+advantage), nitpicks. Full report in session.
- **Kayki decisions + applied:**
  - **Flowing Reflexes = sanctioned exception** — documented in MECHANICS §1.2a (like Aerial
    Evasion is for AoE). Added window: regained reaction(s) expire at start of next turn.
  - **Counterflow** kept (Kayki OK). **Crowd nova** kept (allowed — pay in OAs + setup).
    **Tightrope** kept (situational). All per Kayki, not changed.
  - **Strike-and-Vanish** cap added: 1/turn L3, 2 L5, 3 L9, 4 L12; trigger clarified (melee hit).
  - **ASI -> universal RULE.** Removed the "Ability Score Improvement" feature from ALL classes
    (was per-class L4 filler); new rules page `data/rules/ability-score-improvement.json` states
    every class gets it at 4/8/12/16/19, +2 one or +1/+1 (max 20) or a feat. Acrobat keeps Flowing
    Reflexes at L4 (no ASI feature anywhere now). Class detail still shows "Subclass At: L3".
  - **Subclass-gateway passive DELETED** on the two REVIEWED classes: Acrobat ("Acrobatic
    Discipline") + Doppelganger ("Doppelganger's Guise"). App already shows subclass timing via
    the `subclassLevel` stat, so the card was pure filler. Joker/Puppeteer/Sandow keep their
    gateway until reviewed (NOTE: the-sandow L3 is now ONLY its gateway "Strongman's Act" — needs
    a real L3 feature when reviewed, same gap Doppelganger had).
  - **Contortionist remade** (was too situational): feature 1 **Contortion** — 4 Contortion Dice
    (d6), long-rest; on being hit, spend 1 die (NO reaction, NO action), roll 4+ = negate +
    reflect half to attacker (reaction stays free), 1-3 = die spent, hit NOT folded but you may
    still Parry it if you still have your reaction (else take it full). A die-gated layer IN FRONT
    of Parry (not a Parry, so no Counterflow/Flowing Reflexes/Riposte off it). Feature 2
    **Reversal** (replaces weak Slip the Knot): on a successful Contortion, move 10 ft no-OA +
    advantage on next attack.
- **Site QOL:** sidebar no longer scrolls with the page — body is now height:100vh/overflow:hidden,
  only `.content` scrolls; sidebar has its own overflow-y (scrolls on hover only if it grows).
  Hard-refresh once.
- **Result:** all valid (0 errors), manifest 53 files/8 cats (rules=7). Contortion numbers +
  Reversal flagged for a later Savras pass.

- **Goal:** Remove the subclass-selection gateway from EVERY class + audit all for parry
  re-explainers (Kayki: flag them, rebuild into real skills when we reach each character).
- **Done:** removed the gateway "feature" from the remaining 3 classes (joker "Wild Persona",
  puppeteer "Marionette Style", the-sandow "Strongman's Act"). NO class now has the filler
  "pick a subclass" card; app shows subclass timing via the `subclassLevel` stat. Valid,
  manifest 53 files/8 cats.
- **Parry re-explainer audit (Kayki's rule: a feature that just re-explains the parry gets
  rebuilt into a real skill):**
  - **the-sandow "Plant Your Feet" (L1)** = PURE re-explainer + stale v5 weapon-DC line -> REBUILD.
  - **joker "Chaotic Parry" (L1)** = re-explains parry BUT has a real lever (spend 1 Mayhem to
    reroll the parry d20). Partial -> repackage (keep reroll, cut redundant preamble) or rebuild.
  - Acrobat + Doppelganger already fixed. Puppeteer clean (parry is reskin-only, no feature).

---

## >>> PENDING PER-CHARACTER SKILL WORK (remind Kayki when we open each sheet) <<<

- **The Sandow (NOT yet reviewed):**
  1. `Plant Your Feet` (L1) = dead parry re-explainer (+ stale weapon-DC line) -> REBUILD a new L1 skill.
  2. L3 is now EMPTY (gateway removed) -> author a real L3 feature.
- (Joker `Chaotic Parry` DONE: stripped to just "spend 1 Mayhem to reroll a Parry" + flavor.)
- (Acrobat, Doppelganger, Puppeteer: no pending parry/gateway skill debt.)

**ABILITY-SPREAD PASS (2026-07-13):** roster was all Dex/Cha; now Str/Dex/Con/Wis/Cha.
- **Puppeteer Cha -> Wis** (physical strings = anticipation/feel, not force-of-personality;
  and frees Cha for Joker). Swapped primary+defense+control-DC+Strings-of-Will attacks+all
  Cha-mod use-counts -> Wis. savingThrows unchanged (was already Cha+Wis; Wis now the invested one).
  **OPEN:** enemy save TYPES against Puppeteer control are still "Charisma saving throw" (Manipulate/
  Tangle/Disrupting Pull/Grand Marionette/Snare Weave/Turncoat) — left as-is; ASK Kayki whether to
  switch them to Strength/Dex to match the now-physical/Wis framing (balance-relevant, not done).
- **Doppelganger Dex -> Con** (clones = real bodies split from his vitality). Kayki's choice:
  **Con engine + Dex ATTACKS**, clones still 1-hit-kill. So: primary+defense = Con; save DC
  (Decoy, Mirror's Shattering Reflection) = 8+prof+Con; savingThrows Dex->Con (now Con+Int).
  Attacks + AC stay Dex (finesse weapons default to Dex; Borrowed Trick attack roll stays Dex);
  enemy "Dexterity saving throw" TYPES unchanged. Engine desc clarifies the Dex/Con split.
  **NOTE:** Clone cap left at proficiency bonus (NOT tied to Con) on purpose — Mirror Barrage DPR
  is already Savras-flagged; tying cap to Con would inflate it. Offer to revisit with a Savras pass.
  - **CLONE DAMAGE now scales with Con** (Kayki): any damage a CLONE deals adds Con mod where the
    player's own strikes add Dex. Applied: Mirror Barrage (half of die+Con), Mirror Assault (die+Con),
    Decoy Detonation (1d6+Con), Impersonator Borrowed Trick (1d6+Con), Mirror Shattering Reflection
    (1d6+Con). Player's own weapon attacks + Swarm Overwhelming Numbers (+1d4 on YOUR hit) stay Dex.
    Engine states the rule once. Flag for Savras (Con now doubles as clone-DPR + save-DC stat).

---

## >>> RESUME POINT (read this first next session) <<<

- **Goal:** Doppelganger SUBCLASS review with Kayki (2026-07-13).
- **Impersonator:** Borrowed Trick — memorized trick now lasts UNTIL END OF COMBAT (or until
  replaced), fades when fight ends; clone delivers 1d6+Con. Perfect Mimicry unchanged.
- **Mirror:** Vanishing Trick — kept once/turn disadvantage-on-Swap; ADDED once/combat DEFENSIVE
  Swap: when hit, use reaction to Swap with a clone, the hit lands on the clone in your old space
  (destroyed), you take no damage. FLAG: bounded (1/combat + reaction + needs clone) but adds to
  Mirror's defense stack.
- **Swarm:** Overflowing Reflections double-summon now ONCE PER COMBAT (was per rest). Overwhelming
  Numbers now does BOTH once/turn (clone within 5ft of the target you hit): +[[1d4]] weapon dmg
  (scaling die) AND a clone TOPPLE (Con save vs 8+prof+Con or prone). +1d4 rides your hit = Dex.
- All 3 subclasses valid, manifest clean.
- **RESOLVED:** Mirror Image L5 breach LEFT AS-IS by Kayki's call (WAI) — it's gated on keeping a
  Clone adjacent, so the ~77.5% avoid-a-hit is earned. Doppelganger no longer parked; fully DONE.
- **Swarm fix:** Overwhelming Numbers keeps BOTH — +[[1d4]] (scaling) AND the Con-save-or-prone topple.

- **Goal:** Fix the broken search (Kayki: placeholder said "Search everything" but it only filtered
  the CURRENT tab by NAME).
- **Done (app.js + style.css):** real GLOBAL full-text search. Each entry gets a `_search` blob
  (collectText recursively concatenates every string field). Typing shows a grouped results view
  across ALL categories, matching any field (flavor, feature text, engine, etc.), each result card
  showing a highlighted <mark> snippet of where it matched; clears back to the category when emptied
  or when a sidebar category is clicked. New fns: collectText/renderSearch/makeSearchCard/snippet;
  renderList lost its per-category name filter. CSS: .card-summary + mark highlight. No JS runtime in
  env — verified by static read + HTTP smoke (all assets 200, new fns present). Kayki eyeballs in browser.

**DOPPELGANGER FULLY DONE** (base class + Impersonator/Swarm/Mirror all reviewed & reworked with
Kayki). Con-primary (Dex attacks/AC, clones 1-hit-kill), clone damage scales with Con. Mirror Image
L5 "breach" left as-is by his call (earned — needs an adjacent Clone).

**Classes reviewed WITH Kayki:** Joker (deep), Acrobat (deep), Puppeteer (Wis pivot), Doppelganger
(deep, DONE). **NOT reviewed:** The Sandow. **Unbuilt:** Illusionist, Jester, Juggler.

**Ability spread now Str/Dex/Con/Wis/Cha** (Sandow/Acrobat/Doppelganger/Puppeteer/Joker). Only Int
open (future Illusionist/Artificer).

**OPEN / PARKED (awaiting Kayki):**
- **Puppeteer enemy save TYPES** still "Charisma saving throw" (Manipulate/Tangle/Disrupting Pull/
  Grand Marionette/Snare Weave/Turncoat). Now that Puppeteer is Wis + physical strings, ASK whether
  to switch those to Strength/Dex. Balance-relevant, NOT done.
- **The Sandow** pending skill work (see PENDING tracker above): `Plant Your Feet` L1 dead
  parry-re-explainer -> rebuild; L3 now EMPTY (gateway removed) -> author a real L3 feature.
- **Joker nova** fix (Ace in the Hole -> enemies get advantage vs you next turn) — Kayki may want a
  different lever; offered, not confirmed. **Sandow/Juggernaut** double-prone — minor. General
  **trimming pass** — not started.
- **SAVRAS PASS DUE before extending past L5:** accumulated flags — Doppelganger Con clone-DPR
  (Con now = DPR + save DC), Mirror once/combat defensive Swap, Swarm topple+1d4, Acrobat
  Counterflow/Flowing-Reflexes/movement-only-Momentum, Contortion 4d6/reflect-half numbers,
  Mirror Barrage DPR.

**System state:** 53 files, all schema-valid, manifest clean. Parry DC FIXED = base + situational
(v5). ASI is now a universal RULE (removed from all classes). No class has the subclass-gateway
filler feature. Every feature has Cost/Uses/Range/Save chips. Scaling Die + Weapon Mastery + Weapon
Properties glossary live. **Search is now GLOBAL full-text** (all categories, all fields, snippet
highlight). **Sidebar is sticky** (only content scrolls). Launchers: Grimoire.vbs (no window) /
Grimoire.bat, no-cache server scripts/serve.py, stop with "Stop Grimoire.bat".

---

## 2026-07-13 — LIVE DEPLOYMENT (GitHub Pages) + fast single-request load

**The app is now hosted publicly. Live URL: https://underofall.github.io/grimoire/**
- Permanent link, opens on any device anywhere, exposes nothing on Kayki's PC (GitHub
  hosts a copy). Bookmark it — no more needing to remember localhost:8777 or reopening
  the .vbs just to get the link.
- Repo: https://github.com/UnderOfAll/grimoire (PUBLIC — required for free Pages, so all
  files here are publicly visible). Pages source = branch `main` / `(root)`.
- Repo was first named `Grimoire` (capital G) → Pages paths are case-SENSITIVE so
  `/grimoire/` 404'd. Renamed to lowercase via the two-step trick (case-only renames
  no-op on GitHub: rename to a different name, then to `grimoire`). Local remote updated
  to the lowercase URL.
- Verified live: index.html 200, data/bundle.json 200 + valid JSON with all categories.

**PERFORMANCE FIX — the 5–10s "top bar only" startup delay is GONE.**
- Cause: boot() fetched ~60 JSON files ONE AT A TIME (serial await waterfall) against the
  single-threaded Python server; nothing rendered until all finished.
- Fix: `scripts/build_manifest.py` now ALSO writes `data/bundle.json` (every entry inlined,
  each tagged with `_file`). `app.js` boot() fetches that ONE file and renders. Falls back
  to per-file loading (now parallel via Promise.all) if the bundle is missing. New helper
  `prepareEntries()` attaches `_search` + sorts; `loadCategory()` reuses it.

**THE UPDATE-AND-PUBLISH WORKFLOW (do this whenever content changes, NOT every session):**
```
python3 scripts/build_manifest.py     # MUST run first — rebuilds manifest + bundle
git add -A && git commit -m "..."
git push                              # Pages redeploys in ~1 min
```
- Forgetting build_manifest.py before pushing = live site stays stale (bundle won't hold
  the new content). No content change = nothing to push.
- Browsers cache Pages hard: hard-refresh (Ctrl+Shift+R) after an update to see changes.

**.vbs / .bat launchers — STILL NEEDED, but only for LOCAL work.** Daily reading = the live
link. Building/testing new content = still run Grimoire.vbs to preview locally BEFORE
pushing (editing needs the local http server — the app fetches JSON, blocked on file://).

---

## 2026-07-13 — THE SANDOW full rework + Key-Numbers tooltip system + mobile + Savras pass

**Parry DC ladder changed:** Sandow 8→**9**, Doppelganger 9→**10**. New ladder = Acrobat 7 ·
Sandow 9 · Doppelganger 10 · Joker 11 · Puppeteer 15. Sandow still "second-best." Synced in
the class JSONs + keyStats + DESIGN.md (also fixed DESIGN's stale Doppelganger "Dex primary"
→ Constitution). MECHANICS.md §1.6 8-class ladder re-anchor ROUTED TO OGHMA (bumping two
classes collided the reserved unbuilt-class slots Juggler/Jester/Illusionist + needs the
probability table recomputed; docs conform to code, not vice-versa).

**Sandow base class — final L1–L5 ladder:**
- **L1:** Grit (engine) · Mighty Build · **Iron Grip** (NEW) · **Heave** (rewritten).
- **L2:** Hold the Line · Brace. **L3:** **Crushing Grip** (NEW). **L4:** ASI only (universal
  rule — deliberate quiet level; Acrobat's L4 pair is the sanctioned exception). **L5:** Extra
  Attack · Earthshaker.
- **Plant Your Feet DELETED** — it just re-explained Parry. Its fixed-DC rule already lives in
  the universal parry rule; its temp-HP payoff moved to the Riposte.
- **Riposte** now a real choice: Full Dodge = free 5-ft shove, AND optional **Brace Up** =
  spend 1 Grit for temp HP = **proficiency bonus + Con modifier** until start of next turn
  (doesn't stack). Intended tank outlier (richer than other classes' ripostes) — WAI.
- **Iron Grip (L1):** on a melee hit, target Str-save-vs-DC or grabbed — speed 0 + **disadvantage
  on attacks _against the Sandow only_** (not all its attacks — nerfed per Savras). Maintained
  hold (no timer, NO maintain-cost per Kayki), ends on Crush/Heave/release/incapacitate or the
  target's escape (its action, Athletics/Acrobatics vs DC). A creature that ESCAPES can't be
  re-grabbed until end of its next turn (anti-chain-grab); Crush/Heave release grants no reprieve.
  One creature at a time. Your own forced movement (e.g. Bulldozer Charge) doesn't break the grip.
- **Crushing Grip (L3):** while holding a creature — drag it when you move + it has disadvantage
  on escape checks; and in place of one attack, spend 1 Grit to deal [[1d6]]+Str auto-damage (no
  roll). Crushing ENDS the grab (must re-catch). L5 Extra Attack = crush + re-grab same turn.
- **Heave** simplified to a structured `options` list (Unwilling creature/object vs Willing ally
  fastball); dropped the collision-into-another-creature save and the unwilling-resist save; meta
  reads "In place of 1 attack."

**Subclasses (the three Strongman's Acts):**
- **Bulwark** (tank) reworked: kept Iron Resolve (Grit stream); rebuilt **Guardian's Wall** as an
  `options` list → **Challenge** (≥1 Grit → enemies within 10 ft have disadvantage attacking
  anyone but him — kept as-is, Kayki's positioning argument), **Intercept** (FREE, 1/turn, does
  NOT cost a reaction — take an adjacent ally's hit onto yourself + Brace it; can't Parry it),
  **Braced Footing** (advantage vs prone/forced-move while ≥1 Grit). Intercept is now a SANCTIONED
  exception in MECHANICS.md §1.2a alongside Acrobat Flowing Reflexes.
- **Juggernaut** (offense): unchanged except **Unstoppable Force** nerfed — a Heave feeds only ONE
  Grit source now (was netting +2 from one throw).
- **Human Cannonball** (mobility): Cannon Launch = bonus action, 2 Grit, 30-ft straight launch, no
  OA/no fall dmg, stop at first creature OR end within 5 ft → Str save or [[2d6]]+prone, 1/turn.
  **Kinetic Buildup** dead "Heave collision damage" source re-pointed to Cannon-Launch impact
  (collision was removed when Heave was simplified).

**KEY-NUMBERS TOOLTIP SYSTEM (new, all 5 classes):** keyStats now show a clean typical
progression up front with the exact formula on hover (ⓘ), mirroring the [[XdY]] scaling-die
tooltip. New optional `formula` field on keyStats (schema updated). Renderer: `keyStatsSection`
wraps the value in `.tip-term` when `formula` is present; CSS added `.tip-mark`. Flat values
(Parry DC, Momentum/Reactions) stay plain. Applied to every DC + resource-cap across the roster.

**MOBILE responsive fix (style.css @media ≤640px):** replaced the old cramped 64-px icon rail.
Now: topbar wraps (brand+Parry row 1, search full-width row 2); sidebar becomes a horizontal
scrollable category strip above the content; content full-width; tables shrink + word-break;
Parry panel becomes a bottom sheet.

**Savras balance pass done** (subagent). Fixed: Intercept doc-contradiction, Iron Grip lockdown
(disadvantage vs-Sandow-only + grapple-break rule), Kinetic Buildup dead ref, Unstoppable Force
double-dip. Kept by Kayki's call: Guardian's Wall aura, Sandow riposte richness. Still on the
Savras watch-list (not blocking): overall Bulwark EHP/durability stack; Iron Grip escape-DC math.

**The Sandow is now feature-complete L1–L5 with all three Acts reviewed.** Remaining unbuilt
Sandow-adjacent: nothing. Roster classes still unbuilt: Illusionist, Jester, Juggler.
