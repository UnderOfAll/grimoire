# Core Engine Spec — Parry

Owned by Oghma. This is the implementable rules spec for the universal circus-system
Parry mechanic referenced by `data/schema/class.schema.json`. Content authors (Corellon,
Moradin, Gond, Mystra) reference this file when filling a class's `parryBaseDC`,
`defenseAbility`, `parryReskin`, `riposte`, and `engine` fields. Ioun references it when
rendering those fields and when implementing any live roll helper.

Scope: calibrated for **levels 1-5**. The rules read off proficiency bonus and ability
modifier, both of which already scale by level in 5e, so no separate ruleset is needed to
extend later — only the worked examples below assume levels 1-5.

**v2 (2026-07-10): the Parry model below is a full replacement.** The old *contested
roll* model (defender rolls `d20 + Parry bonus` vs. the attacker's already-rolled attack
total, `parryAffinity` tier modifier, "beat by 5+" full-dodge threshold) is **removed** and
superseded in its entirety by the **static-DC model** in §1. Do not resurrect
`parryAffinity`, the old §1.5 "Parry bonus formula," or the "beat attack total by 5" band
math — none of it applies anymore. `parryBaseDC` replaces `parryAffinity` in the schema.

**v3 (2026-07-10): weapon-carried parry + explicit reaction economy.** Introduces
`data/schema/weapon.schema.json` and its `parryProfile` field as the sole source of a
weapon's parry behavior (§1.5a, §1.7), reconciling the old generic "ranged weapon +3 DC"
situational line (now **removed** — that behavior lives on the weapon instead, via
`parryProfile.dcMod`/`canParry`/`parryRange`) with the new per-weapon `dcMod`. Also makes
explicit the single shared reaction pool that Parry, opportunity attacks, and any other
reaction all draw from (§1.2a), and states how non-proficiency with a weapon affects both
attack rolls and the Parry formula (§1.5a). The base formula structure and the DC-by-class
table (§1.5, §1.6) are otherwise unchanged from v2; "unarmed +2 DC" from the old §1.7
table is **kept** (it has no weapon to live on) but is now the *only* survivor of that
table's flat weapon-category rows.

---

## 1. Parry (active reaction defense)

Parry **replaces** passive AC-only defense with an active save-like roll against a
**Parry DC**. It does not replace AC — AC still determines whether an attack *can*
trigger a Parry (see §1.1).

### 1.1 Trigger

- You are hit by an attack roll that beats your AC (i.e., a normal 5e "hit" would occur).
- The attack must be visible to you and must be an **attack roll**. See §1.8 for what
  does *not* qualify.
- Resolves **before damage is rolled** — the Parry outcome determines the damage
  multiplier applied to whatever damage is subsequently rolled.

### 1.2 Cost

- One reaction. Standard 5e reaction economy: one per round, resets at the start of
  your turn. No class in this system gets a second reaction from this feature; a class
  wanting more Parries per round needs an explicit, separately-costed feature that says
  so.

### 1.2a Reaction economy (shared pool)

- Every creature — PC **and monster** — has exactly **one reaction per round**, refreshing
  at the start of that creature's own turn. This is the single pool every reaction-costed
  thing in this system draws from: Parry, opportunity attacks, and any future
  reaction-costed feature all spend from the same one slot.
- Consequence: **you Parry OR make an opportunity attack, never both**, and **at most one
  Parry per round** — spending your reaction on an OA earlier in the round means you
  cannot also Parry an attack that hits you later that same round, and vice versa.
- **Timing — a Parry may answer any attack you can see that hits you**, with no
  exceptions for whose turn it is:
  - This includes an **opportunity attack**, whether it is one *made against* you or —
    less obviously — one **you provoke on your own turn** (e.g. you move out of a
    threatened square and get hit by the resulting OA; that OA is still a visible attack
    roll against you and is Parry-eligible the instant it resolves).
  - This includes attacks that happen entirely outside your own turn (the normal case)
    as well as the on-your-own-turn OA case above.
- **The tank-or-parry decision:** when an OA hits you (on your turn or anyone else's),
  you choose in the moment: **take the hit** (bank your reaction for a bigger threat you
  expect later this round — e.g. the boss's turn hasn't happened yet) or **spend your
  reaction to Parry it now** (guaranteed to reduce/negate this hit, at the cost of having
  nothing left if something worse comes later). Neither choice is free — this is the
  intended tension, not an edge case to resolve away.
- Monsters use this exact same one-reaction-per-round rule (so a monster that used its
  reaction on an OA earlier in the round cannot then "Parry" — if monsters are ever given
  a Parry-equivalent — later that round). Full monster action-economy sheets (multiple
  reactions, legendary actions, etc.) are an explicitly deferred future upgrade, not part
  of the levels 1-5 baseline this document covers.
- **Authorized exception — Acrobat "Flowing Reflexes" (L4).** This is the one feature in
  the roster that intentionally grants a second usable reaction, and it is a sanctioned
  exception to the "one reaction, Parry-or-OA" rule above (the same way Aerial Evasion in
  §1.8 is the sanctioned exception to the "attack-rolls-only" rule). Once per turn, when
  the Acrobat *successfully Parries* (Full Dodge or Grazing Parry) he regains his spent
  reaction — two reactions on a natural-20 Parry. The regained reaction(s) **can never be
  spent on another Parry** (so this never raises his one-Parry-per-round ceiling and never
  makes him a surer dodger; it only lets a clean parry buy back an OA or another
  reaction-costed feature) and **expire at the start of his next turn**.
- **Authorized exception — Bulwark "Intercept" (L3, subclass).** Once per turn, when an
  attack hits an ally within 5 feet of the Bulwark, he may redirect that hit onto himself.
  This is a **free** intervention that does **not** spend a reaction (so it never competes
  with Parry or Hold the Line), capped at once per turn. It cannot negate the hit — the
  attack has already landed, so the Bulwark simply takes the damage in the ally's place (and
  may Brace it); it never grants or counts as a Parry. Together with Flowing Reflexes, this
  is one of only two sanctioned exceptions to the one-reaction rule; no other class or
  subclass gets extra reaction-timed actions from any source.

### 1.3 Cannot Parry at all

You may not spend your reaction to Parry — the trigger simply doesn't offer the choice —
if any of the following is true:

- You are **stunned**.
- You are **incapacitated** (which also covers being unable to take actions/reactions
  for any other reason not separately listed here).
- You are **paralyzed**.
- You are **unconscious**.
- You **cannot see the attacker** (invisible/hidden source you haven't detected, attacks
  from outside a table's tracked visible arc, etc.).
- You have **no reaction available** (already spent this round, or an effect denies you
  your reaction).

In every one of these cases the attack simply resolves as a normal hit — full damage,
no roll.

### 1.4 Resolution

When triggered, the defender rolls `d20` (flat — no modifier is added to this die; all
your bonuses live in the DC you're rolling against, see §1.5) and compares the result to
your **effective Parry DC** for this attack.

| Band | Condition | Effect |
|---|---|---|
| **Full Dodge** | roll is **strictly above** the effective Parry DC | Negate all damage from this attack (x0). |
| **Grazing Parry** | roll is **exactly equal to** the effective Parry DC | Half damage, rounded down (x0.5). |
| **Overcommitted** | roll is **strictly below** the effective Parry DC | +50% damage, rounded down (x1.5). |

Formally, let `dc = effective Parry DC` and `roll` = the d20 result:

```
roll > dc   -> Full Dodge      (x0)
roll == dc  -> Grazing Parry   (x0.5, round down)
roll < dc   -> Overcommitted   (x1.5, round down)
```

- A natural 20 is not special beyond being the highest possible roll (still just
  "20 vs dc" — no auto-negate rule beyond that comparison; if `dc` happens to be 20, a
  natural 20 is a Grazing Parry, not an automatic Full Dodge). No crit-parry rule — keep
  the math clean.
- A natural 1 is not special beyond being the lowest possible roll, same reasoning.

### 1.5 Effective Parry DC formula

**v5 (2026-07-11): the Parry DC is FIXED and weapon-independent — base + situational only.**
Building on v4 (which removed the level/ability scaling terms — see history below), the
per-weapon `dcMod` term is now **also removed**: a weapon no longer changes the Parry DC. The
effective DC is simply the class's `parryBaseDC` plus situational modifiers (§1.7), floored at
3. Nothing about level, ability score, or weapon choice moves it — it cannot run away, which is
the whole point. `defenseAbility` does not feed the DC (reserved for a future Riposte/feature
that makes an attack roll; currently vestigial — no shipped Riposte rolls to hit).
`parryProfile.dcMod` is **deprecated and ignored**; a weapon's `parryProfile` now only states
whether it can parry (`canParry`) and against what (`parryRange`).

**Supersedes the v2/v3/v4 formulas in their entirety.** NOTE: the worked-math table in §1.6
below and the proficiency / defense-ability bullets in the rest of this section are **left for
history and are OBSOLETE** — they describe the removed scaling model. Do not author against
them; the two-line formula here is the whole rule.

```
effective Parry DC = parryBaseDC (class, §1.6)
                      + situational modifiers (§1.7)
                      [+ per-class feature adjustments, authored separately]
                      (floor of 3 — never computes lower)
```

- **`parryBaseDC`:** the class's base value, §1.6. Lower = easier to parry (better at
  it). This is the schema field `parryBaseDC` (integer).
- **`weapon.parryProfile.dcMod`:** the weapon actually in hand's own modifier — see
  §1.5a. This is new in v3 and replaces the old flat "ranged weapon +3" situational row
  (§1.7).
- **Proficiency bonus:** standard 5e-by-level. At levels 1-5: **+2** at levels 1-4, **+3**
  at level 5. **v3 change: only subtracted if the defender is proficient with the weapon
  currently in hand** (§1.5a) — this is the concrete mechanism behind "level/proficiency
  lowers the effective DC," now correctly gated on weapon familiarity instead of applying
  unconditionally.
- **Defense-ability modifier:** the ability modifier of the class's `defenseAbility`
  field (§1.10), halved and rounded down (mathematical floor, so a modifier of -1
  contributes -1, which *raises* the DC by 1 — a poor defense stat makes you worse at
  this, same as everywhere else in 5e). Halved (rather than full value) so that ability
  investment matters without swamping the per-class `parryBaseDC` spread that carries
  most of the differentiation between classes. A class's Riposte attack roll (§1.9), by
  contrast, still uses the *full* defense-ability modifier, same as any weapon attack.
  Always subtracted regardless of weapon proficiency — this term is about the
  character's own reflexes, not weapon familiarity.
- **Situational modifiers:** §1.7 — always add (raise DC, never lower it, except the
  enemy term which is floored at 0 so a weak attacker never gives you a *bonus*).
- **The floor of 3** exists so the "Overcommitted" band never mathematically disappears
  for a heavily-invested defender — at DC 3 you still fail on a 1-2 (10%) and Graze on a
  3 (5%). Without a floor, a maxed-out Acrobat's math trends toward DC 1-2, which removes
  the fail band entirely; that's too strong even for the best-tier class within the
  levels 1-5 scope this document covers. A per-class feature that *explicitly* claims to
  bypass this floor (e.g. a capstone far beyond level 5) is a deliberate design choice for
  whoever authors it, not something Oghma's baseline formula grants for free.

### 1.5a Weapons, proficiency, and Parry

- **Anyone may wield any weapon** (per DESIGN.md "Weapon access is proficiency-gated, NOT
  hard-locked") — a character is never mechanically barred from picking up an unfamiliar
  weapon. `weapon.proficientClasses` is informational flavor, not an enforced lock.
- **What counts as "proficient" (two valid sources):** you are proficient with a weapon if
  your class grants its *category* — the class sheet's Simple/Martial weapon proficiencies —
  OR the weapon's `proficientClasses` lists your class. Either source suffices. Category
  grants cover ordinary simple/martial weapons; `proficientClasses` is how a `signature`-
  category weapon (which no Simple/Martial grant covers) confers proficiency. This reconciles
  the two representations: e.g. a class with "Simple weapons" is proficient with the Simple
  `throwing-knives` via its category grant even though that weapon's `proficientClasses` names
  only the Juggler.
- **Without proficiency in the weapon in hand, you do not add your proficiency bonus** —
  neither to attack rolls made with it (standard 5e) **nor to the Parry formula's
  proficiency-bonus subtraction above**. Concretely: an unproficient defender's effective
  Parry DC simply omits the `- proficiency bonus` term entirely (it is not subtracted, it
  is not halved, it is not replaced by anything — the term is just absent), which reads
  as "you parry clumsily with an unfamiliar weapon," matching DESIGN.md.
- **A weapon's `parryProfile.dcMod` still applies even without proficiency** — the modifier
  describes the *weapon's own shape* (a rapier's crossguard is still there whether or not
  you were trained on it), only the proficiency-bonus term is proficiency-gated.
- **Signature-weapon special parry bonuses require proficiency.** If a signature weapon's
  `parryProfile` (or a class feature riding on it) grants something beyond the flat
  `dcMod` — e.g. a class-specific advantage-on-parry-roll bonus tied to that weapon — that
  extra benefit is only available to a character proficient with the weapon. The baseline
  `dcMod` itself is not gated this way (see previous bullet); only bonuses explicitly
  described as proficiency-requiring are.
- **Which weapon is "in hand" for this formula:** the weapon the defender is actually
  wielding (and has a free hand/action-economy standing to use) at the moment the Parry
  triggers. A character wielding no weapon (or only a weapon whose `parryProfile.canParry`
  is `false` and who has no other usable weapon) falls to the **unarmed** case, §1.7 —
  `dcMod` from §1.5a does not apply in that case, the flat unarmed penalty does instead.

### 1.6 Base Parry DC by class

All 8 classes, base DC only (before proficiency/ability/situational adjustments — see
§1.5 for the full formula and §1.9 for how per-class features may adjust this further):

**v6 (2026-07-13): re-spaced for shipped data.** Acrobat, The Sandow, Doppelganger, Joker,
and Puppeteer are now shipped classes (`data/classes/*.json`) with fixed `parryBaseDC`
values that this table must match exactly — those five values are no longer Oghma's to
tune, only to document. The three still-unbuilt classes (Juggler, Jester, Illusionist)
were pushed off their old slots by two of the shipped values moving (The Sandow 8->9,
Doppelganger 9->10) and are re-seated below at the nearest open integers that preserve the
melee/brace-low -> mixed-middle -> ranged-caster-high ordering; DC 8 is intentionally left
open between Acrobat and The Sandow (no unbuilt class needs a slot there).

| Class | `parryBaseDC` | Why here on the scale |
|---|---:|---|
| **Acrobat** | **7** | Best parrier in the roster (locked by design; set to 7 rather than 6 so he isn't literally untouchable from level 1 — see the math note below). Parrying *is* its class fantasy — dedicated dodge/tumble, and it owns the AoE-evasion exception (§1.8) on top. |
| **The Sandow** | **9** | Shipped value. Brace-and-shrug tank; strong but not the best — physically eating a hit is a step down from never being touched at all. |
| **Doppelganger** | **10** | Shipped value; defense ability is **Constitution**, not Dexterity — it parries by swapping in a resilient clone that eats the hit rather than by pure personal reflex, so durability fits its fantasy better than agility does. Sits one point worse than The Sandow: a clone body-double is a step down from actually bracing the hit yourself. |
| **Joker** | **11** | Shipped value. Mixed affinity, high-variance chaos engine — parry itself isn't the chaos hook (the *deck* is), so it lands centrally, a shade worse than Doppelganger's clone-swap. |
| **Juggler** | **12** | Unbuilt; re-seated here (was 10) because Doppelganger now occupies that slot. Tagged "ranged" in DESIGN.md's roster prose but functionally combat-adjacent (thrown weapons, often at melee range) — closer to a mixed martial class than a true backline caster, so it sits at the front edge of the ranged-caster block, just past Joker, rather than deep in caster territory. |
| **Jester** | **13** | Unbuilt; re-seated here (was 12), one slot later than before since Juggler now leads the ranged-caster block. Ranged-caster, but its Parry reskin ("mock attacker -> disadvantage") is an active reactive trick rather than passive casting distance, so it's the best of the three true ranged-casters. |
| **Illusionist** | **14** | Unbuilt; re-seated here (was 13), for the same reason as Jester above. Ranged-caster; parries via afterimage/blur, a purely defensive trick with no offensive follow-up, one step worse than Jester's disadvantage-imposing mock. |
| **Puppeteer** | **15** | Shipped value. Worst physical parrier by design — a hard-control ranged-caster whose whole fantasy is not being anywhere near the fight; string-deflect is a last resort, not a specialty. |

**Why this spread (levels 1-5 math check).** Effective DC (§1.5) applies proficiency and
half the defense-ability modifier as reductions. Worked baseline: assume a **+2**
defense-ability modifier at level 1 (a 14-15 score in a secondary/tertiary stat — a
conservative, non-maxed assumption) rising to **+3** by level 5 (a single ASI/level-4
bump into that stat, still not maxed). Reduction = proficiency + floor(mod/2):

- Level 1-4: `+2 (prof) + floor(2/2)=1 = 3` total reduction.
- Level 5: `+3 (prof) + floor(3/2)=1 = 4` total reduction.

No situational modifiers, no per-class features — this is the floor-adjusted baseline
every class starts from:

Arithmetic per row: Effective DC = Base − reduction (floored at 3). Fail = (DC−1)/20,
Graze = 1/20 = 5% (constant), Full Dodge = (20−DC)/20.

| Class | Base DC | Effective DC L1-4 (−3, floor 3) | Odds: Fail / Graze / Full Dodge | Effective DC L5 (−4, floor 3) | Odds: Fail / Graze / Full Dodge |
|---|---:|---:|---|---:|---|
| Acrobat | 7 | 7−3=4 | (4−1)/20=15% / 5% / (20−4)/20=**80%** | 7−4=3 (floored) | (3−1)/20=10% / 5% / (20−3)/20=**85%** |
| The Sandow | 9 | 9−3=6 | (6−1)/20=25% / 5% / (20−6)/20=70% | 9−4=5 | (5−1)/20=20% / 5% / (20−5)/20=75% |
| Doppelganger | 10 | 10−3=7 | (7−1)/20=30% / 5% / (20−7)/20=65% | 10−4=6 | (6−1)/20=25% / 5% / (20−6)/20=70% |
| Joker | 11 | 11−3=8 | (8−1)/20=35% / 5% / (20−8)/20=60% | 11−4=7 | (7−1)/20=30% / 5% / (20−7)/20=65% |
| Juggler | 12 | 12−3=9 | (9−1)/20=40% / 5% / (20−9)/20=55% | 12−4=8 | (8−1)/20=35% / 5% / (20−8)/20=60% |
| Jester | 13 | 13−3=10 | (10−1)/20=45% / 5% / (20−10)/20=50% | 13−4=9 | (9−1)/20=40% / 5% / (20−9)/20=55% |
| Illusionist | 14 | 14−3=11 | (11−1)/20=50% / 5% / (20−11)/20=45% | 14−4=10 | (10−1)/20=45% / 5% / (20−10)/20=50% |
| Puppeteer | 15 | 15−3=12 | (12−1)/20=55% / 5% / (20−12)/20=**40%** | 15−4=11 | (11−1)/20=50% / 5% / (20−11)/20=45% |

Reading the table: Acrobat starts near 80% Full Dodge at level 1 and reaches the DC-3 floor (85%) by level 5
(its class fantasy *is* being nearly untouchable — the floor is what stops it from becoming
literally unfailable, see §1.5), Puppeteer sits at the bottom taking the Overcommitted penalty more often than
not resolving Full Dodge at level 1, and every class gains roughly 5 percentage points of
Full-Dodge odds by level 5 as proficiency ticks up — matching "level/proficiency lowers
the effective DC so parrying improves as the character grows." A defender who invests
*more* than this conservative +2->+3 baseline into their defense ability does better than
shown; one who dumps the stat entirely does worse. Savras should sanity-check this table
against actual authored monster/attack math once classes exist — these are Oghma's
starting numbers, not gospel, same caveat as the old model carried.

### 1.7 Situational modifiers (raise the effective DC)

Applied as flat additions inside the §1.5 formula, after the base/proficiency/ability
terms, before the floor.

**v3 reconciliation note:** the v2 version of this table had two flat weapon-category
rows, "Unarmed +2" and "Defending while wielding a ranged weapon +3." The ranged-weapon
row is **removed as of v3** — that behavior now comes from the actual weapon's
`parryProfile` (§1.5a): most ranged weapons (bows, loaded crossbows) simply have
`canParry: false`, meaning there is nothing to parry *with* while holding one, and the
defender falls through to the Unarmed row below rather than getting a flat +3. A rare
ranged-capable parry weapon (e.g. a wire or blade weapon explicitly built to deflect
projectiles) instead sets `parryProfile.parryRange: "ranged"` with its own `dcMod`, which
is usually still a penalty but is authored per-weapon instead of a flat universal +3. This
removes the double-count risk: a weapon's ranged/melee parry behavior is now entirely
`parryProfile`'s job, never both a generic table row and a per-weapon `dcMod` at once.
**Unarmed is kept** as the one surviving flat row, because "no weapon" has no weapon
record to carry a `dcMod` on:

| Situation | DC modifier | Notes |
|---|---:|---|
| **Unarmed / no weapon in hand** (also applies if the only weapon in hand has `parryProfile.canParry: false` and you have no other usable weapon) | **+2** | You have nothing to parry with but your own body. `canParry` is still treated as `true` for unarmed — bare hands/limbs can still attempt a Parry, just at this flat penalty. Applies even if you have an unarmed-strike feature that lets you attack unarmed — this is about defense, not offense. |
| **Attacker's attack bonus exceeds your threshold** (a tougher/higher-bonus enemy) | **+1 per point of excess, capped at +5 total** | Self-scaling enemy term, see below. Stacks with the Unarmed row and with any weapon `dcMod` if applicable. |

**Enemy self-scaling term (the "tougher enemy" modifier), spelled out:**

```
enemy term = clamp(attacker's attack bonus - (5 + your proficiency bonus), 0, 5)
```

- `5 + proficiency bonus` is your **threshold**: +7 at levels 1-4, +8 at level 5.
- A typical CR-appropriate monster at these levels has an attack bonus of roughly +2 to
  +6 — comfortably under the threshold, so **ordinary fights add +0** from this term.
  Parry doesn't get harder just because you're in a normal fight.
- Only monsters built to hit noticeably harder than "level-appropriate" (attack bonus
  above your threshold — bosses, higher-CR outliers, a martial NPC built to hit) add a
  penalty, scaling **1:1** with how far over the threshold they are.
- **Capped at +5.** Even an extreme outlier attacker (attack bonus +13+ against a
  threshold-7 defender) never pushes the enemy term past +5, so Parry never becomes
  mathematically impossible (an effective DC of "unreachable" would defeat the point of
  the mechanic) — it becomes *hard*, not *off*. Combined with the §1.5 floor of 3 on the
  low end, this keeps the whole system bounded and playable across the full attacker
  spread the scope (levels 1-5) is expected to face.
- Worked examples at a level 1-4 threshold of +7: a CR-2 brute with attack bonus +5 adds
  +0. A boss-tier attacker with attack bonus +10 adds +3. An extreme attack bonus of +14
  or higher adds the capped +5, no more.

### 1.8 What is parryable

- **Parryable:** any attack roll (melee weapon, ranged weapon, melee spell attack,
  ranged spell attack) that you can see coming.
- **Not parryable:** anything resolved by a saving throw (Fireball, Poison Spray, etc.)
  or an area effect with no attack roll, and anything you cannot see (see §1.3's
  "cannot see the attacker" — that condition and this exclusion describe the same
  underlying rule from two angles: no Parry trigger at all without a visible attack
  roll).
- The **Acrobat** class gets a distinct, separately-authored AoE evasion feature that
  covers the save-or-half-damage case Parry deliberately excludes. That feature lives in
  Acrobat's own `features`/`passives` entries, not in this shared engine.

### 1.9 Riposte and other per-class Parry features

- Per-class features may **lower `parryBaseDC`** (a flat, always-on reduction — author it
  directly against the base value, or as a conditional reduction applying under stated
  circumstances) or **grant advantage on the Parry d20 roll** (roll twice, take the
  higher — this does not change the DC, it changes which of the two rolls you compare to
  it). Both are valid, separate levers; a class/subclass feature should say clearly which
  one it does.
- **Riposte** triggers only on a **Full Dodge** result (roll strictly above the effective
  DC) — never on Grazing Parry or Overcommitted. Riposte effects are per-class
  (`riposte` field) and are authored as their own feature entry with its own
  action-economy cost note (e.g., "no action required" or "uses your reaction's normal
  follow-up") — Oghma does not pre-spend the riposte's cost here, that's a per-feature
  design choice for Corellon/Moradin/Gond to make explicit. When a Riposte feature
  includes a follow-up attack roll, that attack roll uses the **full** (not halved)
  defense-ability modifier, same as any standard weapon attack — only the Parry DC
  formula itself halves the ability modifier (§1.5).

### 1.10 Defense ability

- Field: `defenseAbility` on the class (see schema, §2).
- **Default: Dexterity.** Use for any class whose defense fantasy is reflexes/agility
  (Acrobat, Illusionist, Joker, Jester, Juggler, Puppeteer, unless a subclass overrides
  it).
- **Strength** for Strongman-type classes whose defense fantasy is brute physicality
  (brace and shrug, per DESIGN.md) — e.g. The Sandow.
- **Constitution** for the **Doppelganger** (shipped override, not the Dex default) — it
  parries by swapping in a resilient clone/body-double that eats the hit rather than by
  personal reflex, so raw durability fits the fantasy better than agility does.
- The field is a free enum across all six abilities (not restricted to STR/DEX/CON) so a
  future subclass or reskin (e.g. an Illusionist variant that "parries" by predicting
  outcomes) could plausibly use INT or WIS. STR, DEX, and CON are the abilities used by
  the current 8-class roster (CON via the Doppelganger override above).
- **Role in v2:** its modifier is halved (floor) and subtracted in the effective-DC
  formula (§1.5), and its *full* modifier feeds a class's Riposte attack roll when it has
  one (§1.9). It is intentionally a smaller lever than `parryBaseDC` in the DC math —
  base DC carries most of the differentiation between classes, ability score rewards
  build investment on top of that.

---

## 1C. Armor, AC, and the attack -> parry sequence

Armor determines **AC (Armor Class)** — the number an attacker must meet or beat on its
attack roll to land a hit. Armor does NOT modify Parry.

- **Sequence:** attack roll vs AC first. Miss -> nothing happens. Hit -> the defender may
  then spend a reaction to Parry (§1). Armor helps by reducing how many attacks even reach
  the Parry step; Parry handles the ones that do.
- **Why armor carries no Parry modifier:** heavy-armor classes (e.g. The Sandow) Parry by
  bracing/absorbing, not dodging, so a "heavy armor = worse dodge" rule would wrongly punish
  them. A class's `parryBaseDC` already encodes how nimble-vs-braced its defense is.
- **AC by category** (see `armor.schema.json`): light = `baseAC` + full Dex mod; medium =
  `baseAC` + Dex (capped by `maxDexBonus`, usually 2); heavy = `baseAC` only, no Dex; shield
  = `+acBonus` on top of worn armor.
- **Strength requirement:** wearing heavy armor below its `strengthRequirement` costs 10 ft
  of speed (standard 5e).
- **Stealth:** armor with `stealthDisadvantage` imposes disadvantage on Dexterity (Stealth)
  checks.
- **Proficiency:** granted by class, per category (Light / Medium / Heavy). Wearing armor
  you lack proficiency with carries the standard 5e penalty (disadvantage on any ability
  check, save, or attack that uses Strength or Dexterity, and you cannot cast spells).

## 2. Schema summary (see class.schema.json for authoritative field defs)

Quick reference; §2 of this file is descriptive, the schema file is normative if they
ever disagree (fix the disagreement, don't trust this copy).

- `parryBaseDC`: integer — the class's base Parry DC (§1.6), lower = easier to parry.
  **Replaces the removed `parryAffinity` field.** See §1.5 for the full effective-DC
  formula it feeds into.
- `defenseAbility`: one of the six ability score names — selects the §1.10 modifier
  source. Defaults to `"Dexterity"` if omitted.
- `parryReskin`: free text, the flavor description of how this class's Parry outcome
  narrates (e.g. "a clone phases in to eat the hit").
- `riposte`: free text or omitted/null, describing a Full-Dodge-only counterattack if
  the class has one (see §1.9).
- `engine`: object describing the class's own resource/engine (Momentum, Grit, Chaos
  deck, clone tokens, etc.) — this class's sole resource: name, resource shape, how it's
  generated, how it's spent, and its cap.

See `data/schema/weapon.schema.json` for the weapon fields referenced throughout §1.5a
and §1.7 (`category`, `damage`, `properties`, `versatileDamage`, `range`,
`parryProfile.{canParry,parryRange,dcMod,note}`, `proficientClasses`). That schema file
is normative for weapon fields the same way class.schema.json is normative for class
fields.

---

## 3. Scaling Die convention (fixed-die values that grow with level)

**v4 (2026-07-11): shared scaling rule for fixed dice.** A feature that deals a fixed
amount of damage or healing (the Joker's Wild Card table, damage/heal riders, etc.) goes
stale at higher levels — `1d4` that stings at level 1 is trivial by level 8. To fix this
uniformly instead of per-class, any such die may be authored as a **Scaling Die**.

### 3.1 The rule
A Scaling Die steps up **one die size at character levels 5, 11, and 17** (the standard 5e
cantrip breakpoints), walking this chain and stopping at `d12`:

```
d4 → d6 → d8 → d10 → d12
```

Level 1-4 = the authored base; level 5-10 = one step up; level 11-16 = two steps; level
17-20 = three steps (never past `d12`). Only the die **size** grows — the die **count** and
any flat/ability modifier are unchanged. This is the Bardic-Inspiration model: it keeps a
single die (bounded variance) rather than adding dice (which widens the swing), which is why
it suits bounded-variance classes like the Joker.

### 3.2 Authoring notation
Mark a scaling die in any feature/engine description text by wrapping it in double square
brackets: `[[1d6]]`. Plain dice written without brackets (`1d6`) do **not** scale — scaling
is opt-in per value, so caps and flat mitigation (e.g. The Sandow's Brace `-6`) are never
silently inflated. Ioun's renderer expands `[[XdY]]` to the base die plus a "scales" marker
whose tooltip shows the full `X d(chain)` progression at levels 1 / 5 / 11 / 17. The
compendium shows the progression rather than a single value because no character level is
selected yet (that arrives with the deferred character-sheet system).

### 3.3 Scope
Applies wherever a fixed magnitude die appears in a description. Which dice are marked
scaling is a per-value design decision (Corellon/Moradin/Gond author it, Savras balance-
reviews it) — damage, healing, and self-damage dice are the usual candidates; static caps
and DCs are not.
