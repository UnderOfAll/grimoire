/*
 * Circus of Chaos (CoC) — 5e Compendium (base app)
 * Data-driven: every category is a list of JSON files declared in data/manifest.json.
 * Agents add content by dropping a JSON file in data/<category>/ and regenerating the
 * manifest (scripts/build_manifest.py). The UI never needs to change to show new content.
 */

const CATEGORIES = [
  { key: "rules",      label: "Rules",       render: renderRule },
  { key: "classes",    label: "Classes",    render: renderClass },
  { key: "subclasses", label: "Subclasses", render: renderSubclass },
  { key: "spells",     label: "Spells",     render: renderSpell },
  { key: "skills",     label: "Skills",     render: renderSkill },
  { key: "passives",   label: "Passives",   render: renderPassive },
  { key: "weapons",    label: "Weapons",    render: renderWeapon },
  { key: "armor",      label: "Armor",      render: renderArmor },
];

const store = {};        // key -> array of entries
let current = "classes"; // active category
let manifest = {};

// Canonical 5e ability order — used to group/sort skills by the stat they scale with.
const ABILITY_ORDER = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];

const $ = (sel) => document.querySelector(sel);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};

async function boot() {
  // Fast path: one request pulls every entry from the pre-built bundle.
  let bundle = null;
  try {
    bundle = await fetchJSON("data/bundle.json");
  } catch (e) {
    bundle = null; // fall back to per-file loading below
  }

  if (bundle) {
    for (const cat of CATEGORIES) store[cat.key] = prepareEntries(bundle[cat.key] || []);
  } else {
    // Fallback: read the manifest and load each file (in parallel per category).
    try {
      manifest = await fetchJSON("data/manifest.json");
    } catch (e) {
      setStatus("Could not load data — run scripts/build_manifest.py and serve over http.");
      manifest = {};
    }
    await Promise.all(CATEGORIES.map(async (cat) => {
      store[cat.key] = await loadCategory(manifest[cat.key] || []);
    }));
  }

  buildSidebar();
  wireEvents();
  $("#legend-panel").innerHTML = legendHTML();
  const total = Object.values(store).reduce((n, a) => n + a.length, 0);
  setStatus(total ? `${total} entries loaded across ${CATEGORIES.length} categories.` : "No content yet.");
  routeFromHash();
}

// Attach the searchable text blob and sort a category's entries by name.
function prepareEntries(items) {
  for (const it of items) it._search = collectText(it, []).join(" · ").toLowerCase();
  items.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  return items;
}

async function loadCategory(files) {
  const out = [];
  for (const file of files) {
    try {
      const data = await fetchJSON("data/" + file);
      const items = Array.isArray(data) ? data : [data];
      for (const it of items) { it._file = file; out.push(it); }
    } catch (e) {
      console.warn("Failed to load", file, e);
    }
  }
  return prepareEntries(out);
}

async function fetchJSON(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(res.status + " " + url);
  return res.json();
}

function buildSidebar() {
  const nav = $("#sidebar");
  nav.innerHTML = "";
  for (const cat of CATEGORIES) {
    const btn = el("button", "nav-btn");
    btn.dataset.key = cat.key;
    btn.innerHTML = `<span>${cat.label}</span><span class="count">${store[cat.key].length}</span>`;
    btn.addEventListener("click", () => { $("#search").value = ""; selectCategory(cat.key); });
    nav.appendChild(btn);
  }
}

function wireEvents() {
  $("#back").addEventListener("click", () => { location.hash = "#/" + current; });
  $("#search").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (q) renderSearch(q); else selectCategory(current);
  });
  window.addEventListener("hashchange", routeFromHash);
  $("#legend-btn").addEventListener("click", () => $("#legend-panel").classList.toggle("hidden"));
  $("#legend-panel").addEventListener("click", (e) => {
    if (e.target.id === "legend-close") $("#legend-panel").classList.add("hidden");
  });
  // Tap-to-toggle tooltips: touchscreens can't hover, so a tap opens the formula /
  // scaling-die box; tapping the same term again or anywhere else closes it.
  document.addEventListener("click", (e) => {
    const term = e.target.closest(".tip-term, .scaling-die");
    document.querySelectorAll(".tip-open").forEach((n) => { if (n !== term) n.classList.remove("tip-open"); });
    if (term) { term.classList.toggle("tip-open"); e.stopPropagation(); }
  });
}

/* Short, always-available rules reference — summarizes the shared Parry
   engine from data/schema/MECHANICS.md so a player has it on hand without duplicating
   any per-class numbers (those render from each class's own JSON fields). */
function legendHTML() {
  return `
    <button id="legend-close" class="legend-close" aria-label="Close">&times;</button>
    <h2>Parry</h2>
    <p><strong>Parry</strong> replaces passive defense with an active save-like roll. When an attack
      roll would hit you, spend your reaction to roll a flat d20 (no modifier — your bonuses already
      live in the DC) against your effective Parry DC.</p>
    <ul>
      <li>Roll above your DC &mdash; <strong>Full Dodge</strong>, no damage.</li>
      <li>Roll equal to your DC &mdash; <strong>Grazing Parry</strong>, half damage.</li>
      <li>Roll below your DC &mdash; <strong>Overcommitted</strong>, +50% damage.</li>
    </ul>
    <p>Each class lists its own <strong>Parry Base DC</strong> (lower is better) and
      <strong>Defense Ability</strong>, which combine with proficiency and situational modifiers to
      set the effective DC for a given attack. A Full Dodge may trigger a class's Riposte, if it has
      one.</p>`;
}

function routeFromHash() {
  const hash = location.hash.replace(/^#\/?/, "");
  const [cat, ...rest] = hash.split("/");
  const key = CATEGORIES.some((c) => c.key === cat) ? cat : "classes";
  const id = rest.join("/");
  if (id) showDetail(key, decodeURIComponent(id));
  else selectCategory(key);
}

function selectCategory(key) {
  current = key;
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.key === key));
  $("#detail-view").classList.add("hidden");
  $("#list-view").classList.remove("hidden");
  $("#list-title").textContent = CATEGORIES.find((c) => c.key === key).label;
  renderList(key);
  if (location.hash !== "#/" + key) history.replaceState(null, "", "#/" + key);
}

function renderList(key) {
  const list = $("#list");
  list.innerHTML = "";
  list.className = "cards";
  const items = store[key];
  if (!items.length) {
    list.appendChild(el("p", "muted", "Nothing here yet — drop a JSON file in data/" + key + "/."));
    return;
  }
  // Classes: one full-width field each (name, description, open arrow).
  if (key === "classes")    return renderClassList(list, items);
  // Grouped views: skills by the ability they scale with, subclasses by parent class.
  if (key === "skills")     return renderGroupedList(list, key, items, groupBySkillAbility);
  if (key === "subclasses") return renderGroupedList(list, key, items, groupBySubclassParent);
  // Armor: split into Starter (owned at creation) vs Bought (premium upgrades).
  if (key === "armor")      return renderGroupedList(list, key, items, groupByAvailability);
  for (const it of items) list.appendChild(makeCard(key, it));
}

/* Classes tab: a vertical stack of fields, alphabetical, each with the class name on top, a
   brief description below, and an arrow button that opens the class sheet. */
function renderClassList(list, items) {
  list.className = "class-list";
  for (const it of items) {
    const field = el("article", "class-field");
    field.innerHTML = `
      <div class="class-field-main">
        <h3>${esc(it.name)}</h3>
        <div class="class-field-meta">
          <span class="tag">${esc(it.source || "5e")}</span>
          <span class="meta">${esc(cardMeta("classes", it))}</span>
          ${it.parryBaseDC != null ? `<span class="badge badge-sm badge-dc">Parry DC ${esc(it.parryBaseDC)}</span>` : ""}
        </div>
        ${it.flavor ? `<p class="class-field-desc">${esc(it.flavor)}</p>` : ""}
      </div>
      <button class="open-arrow" type="button" aria-label="Open ${esc(it.name)} sheet">&rarr;</button>`;
    field.addEventListener("click", () => { location.hash = "#/classes/" + encodeURIComponent(slug(it)); });
    list.appendChild(field);
  }
}

/* One list card (used by the grid + grouped views; classes have their own field layout). */
function makeCard(key, it) {
  const card = el("div", "card");
  card.innerHTML = `<h3>${esc(it.name)}</h3>
    <div class="meta">${esc(cardMeta(key, it))}</div>
    <div class="card-tags">
      <span class="tag">${esc(it.source || "5e")}</span>
    </div>`;
  card.addEventListener("click", () => { location.hash = "#/" + key + "/" + encodeURIComponent(slug(it)); });
  return card;
}

/* Render a list split into labelled sections. `grouper` returns [label, items][]. */
function renderGroupedList(list, key, items, grouper) {
  list.className = "grouped";
  for (const [label, arr] of grouper(items)) {
    const section = el("section", "group");
    section.appendChild(el("h2", "group-title", esc(label)));
    const grid = el("div", "cards");
    for (const it of arr) grid.appendChild(makeCard(key, it));
    section.appendChild(grid);
    list.appendChild(section);
  }
}

/* ---- Global search: every category, every field ---- */

/* Recursively gather all string values in an entry into one searchable blob. */
function collectText(obj, acc) {
  if (obj == null) return acc;
  if (typeof obj === "string") { acc.push(obj); return acc; }
  if (Array.isArray(obj)) { for (const v of obj) collectText(v, acc); return acc; }
  if (typeof obj === "object") {
    for (const k in obj) { if (k === "_file" || k === "_search") continue; collectText(obj[k], acc); }
  }
  return acc;
}

/* Search results across ALL categories, grouped by category, matching any field. */
function renderSearch(q) {
  $("#detail-view").classList.add("hidden");
  $("#list-view").classList.remove("hidden");
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
  $("#list-title").textContent = `Search: “${q}”`;
  const list = $("#list");
  list.innerHTML = "";
  list.className = "grouped";
  let total = 0;
  for (const cat of CATEGORIES) {
    const hits = store[cat.key].filter((it) => (it._search || "").includes(q));
    if (!hits.length) continue;
    total += hits.length;
    const section = el("section", "group");
    section.appendChild(el("h2", "group-title", `${esc(cat.label)} (${hits.length})`));
    const grid = el("div", "cards");
    for (const it of hits) grid.appendChild(makeSearchCard(cat.key, it, q));
    section.appendChild(grid);
    list.appendChild(section);
  }
  if (!total) list.appendChild(el("p", "muted", `No matches for “${esc(q)}”.`));
  setStatus(total ? `${total} match${total === 1 ? "" : "es"} for “${q}”.` : `No matches for “${q}”.`);
}

/* A result card: name, category meta, and a snippet showing where the term matched. */
function makeSearchCard(key, it, q) {
  const card = el("div", "card");
  const nameHit = (it.name || "").toLowerCase().includes(q);
  const subHTML = nameHit ? esc(it.flavor || it.summary || "") : snippet(it._search || "", q);
  card.innerHTML = `<h3>${esc(it.name)}</h3>
    <div class="meta">${esc(cardMeta(key, it))}</div>
    ${subHTML ? `<p class="card-summary">${subHTML}</p>` : ""}`;
  card.addEventListener("click", () => { location.hash = "#/" + key + "/" + encodeURIComponent(slug(it)); });
  return card;
}

/* A short, escaped, highlighted window of text around the first match of q. */
function snippet(text, q) {
  const i = text.indexOf(q);
  if (i < 0) return "";
  const start = Math.max(0, i - 40), end = Math.min(text.length, i + q.length + 60);
  const pre = (start > 0 ? "… " : "") + text.slice(start, i);
  const post = text.slice(i + q.length, end) + (end < text.length ? " …" : "");
  return esc(pre) + "<mark>" + esc(text.slice(i, i + q.length)) + "</mark>" + esc(post);
}

function groupBySkillAbility(items) {
  const groups = new Map();
  for (const it of items) {
    const k = it.ability || "Other";
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(it);
  }
  const ordered = [];
  for (const a of ABILITY_ORDER) if (groups.has(a)) ordered.push([a, groups.get(a)]);
  for (const [k, v] of groups) if (!ABILITY_ORDER.includes(k)) ordered.push([k, v]);
  return ordered;
}

function groupBySubclassParent(items) {
  const groups = new Map();
  for (const it of items) {
    const k = it.parentClass || "Other";
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(it);
  }
  return [...groups.entries()]
    .map(([id, arr]) => [className(id), arr])
    .sort((a, b) => a[0].localeCompare(b[0]));
}

// Armor list split by availability: Starter gear first, then Bought upgrades.
const AVAILABILITY_LABELS = { starter: "Starter armor", bought: "Bought — premium upgrades" };
function groupByAvailability(items) {
  const order = ["starter", "bought"];
  const groups = new Map(order.map((k) => [k, []]));
  for (const it of items) {
    const k = it.availability === "bought" ? "bought" : "starter";
    groups.get(k).push(it);
  }
  return order.filter((k) => groups.get(k).length)
    .map((k) => [AVAILABILITY_LABELS[k], groups.get(k)]);
}

// Display name for a class id (e.g. "the-sandow" -> "The Sandow").
function className(id) {
  const c = (store.classes || []).find((x) => (x.id || slug(x)) === id);
  return c ? c.name : cap(String(id).replace(/-/g, " "));
}

function cardMeta(key, it) {
  switch (key) {
    case "rules":      return it.summary || "";
    case "classes":    return `HP ${it.hitDie || "?"} · ${it.primaryAbility || ""}`;
    case "subclasses": return `${className(it.parentClass) || "?"} subclass`;
    case "spells":     return `${it.level ? "Level " + it.level : "Cantrip"} · ${it.school || ""}`;
    case "skills":     return `${it.ability || ""}`;
    case "passives":   return `${it.type || "Feature"}`;
    case "weapons":    return `${it.category ? cap(it.category) : ""} · ${it.damage && it.damage.type ? it.damage.type : ""}`;
    case "armor":      return `${it.category ? cap(it.category) : ""}${it.category === "shield" ? " · +" + (it.acBonus ?? 0) + " AC" : " · AC " + (it.baseAC ?? "?")}${it.availability === "bought" ? " · Bought" : ""}`;
    default:           return "";
  }
}

function showDetail(key, id) {
  const it = store[key].find((x) => slug(x) === id);
  if (!it) { selectCategory(key); return; }
  current = key;
  $("#list-view").classList.add("hidden");
  $("#detail-view").classList.remove("hidden");
  const renderer = CATEGORIES.find((c) => c.key === key).render;
  $("#detail").innerHTML = renderer(it);
}

/* ---------- renderers (one per category) ---------- */

function head(name, sub) {
  return `<h1>${esc(name)}</h1>${sub ? `<p class="detail-sub">${esc(sub)}</p>` : ""}`;
}
function stat(label, value) {
  return `<div class="stat"><div class="label">${esc(label)}</div><div class="value">${esc(value)}</div></div>`;
}
/* Like stat(), but the value is trusted HTML (already escaped where needed) — for values that
   contain markup such as hover-term tooltips. */
function statHTML(label, html) {
  return `<div class="stat"><div class="label">${esc(label)}</div><div class="value">${html}</div></div>`;
}
function features(list) {
  if (!Array.isArray(list) || !list.length) return "";
  return `<h2>Features</h2>` + list.map((f) => {
    const body = Array.isArray(f.options) && f.options.length
      ? `<br>${fmtDesc(f.description || "")}${optionTable(f.options)}`
      : renderFeatureDesc(f.description);
    const roleBadge = f.role === "roleplay" ? `<span class="role-badge">Roleplay</span>` : "";
    return `<div class="feature"><span class="lvl">Level ${esc(f.level ?? "—")}:</span>
     <strong>${esc(f.name || "")}</strong>${roleBadge}${metaRow(f.meta)}${body}</div>`;
  }).join("");
}

/* D&D-Beyond-style at-a-glance chips (Action / Cost / Uses / Range / Save) below a feature's
   name, from its structured `meta`. Only present fields render. */
function metaRow(m) {
  if (!m || typeof m !== "object") return "";
  // "Cost" = the action economy plus any resource spent, in one chip.
  const cost = [m.action, m.cost].filter(Boolean).join(" · ");
  const fields = [["Cost", cost], ["Uses", m.uses], ["Range", m.range], ["Save", m.save]];
  const chips = fields.filter(([, v]) => v).map(([k, v]) =>
    `<span class="fmeta"><span class="fk">${esc(k)}</span><span class="fv">${esc(v)}</span></span>`).join("");
  return chips ? `<div class="feature-meta">${chips}</div>` : "";
}

/* A feature's structured `options` (a pick-one menu or a random table) as a table. A `roll`
   on any option makes it a random table (numbered column); otherwise it's a choice menu. */
function optionTable(opts) {
  const hasRoll = opts.some((o) => o.roll != null);
  const nameHdr = hasRoll ? "Result" : "Option";
  const headCells = (hasRoll ? "<th>Roll</th>" : "") + `<th>${nameHdr}</th><th>Effect</th>`;
  const rows = opts.map((o) => {
    const rollCell = hasRoll ? `<td class="col-num">${esc(o.roll ?? "")}</td>` : "";
    return `<tr>${rollCell}<td>${fmtDesc(o.name || "")}</td><td>${fmtDesc(o.effect || "")}</td></tr>`;
  }).join("");
  return `<table class="data-table option-table">
      <thead><tr>${headCells}</tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

/* A feature whose text embeds a numbered option list — "(1) Name: effect. (2) …" — renders
   that list as a table (e.g. the Joker's Wild Card d8 table). Any feature without the pattern
   renders as plain text, exactly as before. */
function renderFeatureDesc(desc) {
  const t = extractNumberedTable(desc);
  if (!t) return `<br>${fmtDesc(desc || "")}`;
  const body = t.rows.map((r) =>
    `<tr><td class="col-num">${esc(r.n)}</td><td>${fmtDesc(r.name)}</td><td>${fmtDesc(r.effect)}</td></tr>`).join("");
  return (t.lead ? `<br>${fmtDesc(t.lead)}` : "") +
    `<table class="data-table option-table">
       <thead><tr><th>#</th><th>Result</th><th>Effect</th></tr></thead>
       <tbody>${body}</tbody>
     </table>`;
}

/* Escape description text, expanding any [[XdY]] Scaling Die token (MECHANICS.md §3) into
   its base die plus a marker whose tooltip lists the level 1/5/11/17 progression. */
const DIE_CHAIN = [4, 6, 8, 10, 12];
function fmtDesc(s) {
  if (s == null) return "";
  const str = String(s);
  // Two inline tokens: [[XdY]] or [[XdY+Abil]] scaling die (Abil = Str/Dex/Con/Int/Wis/Cha,
  // folds "+ your <Ability> modifier" into the die's tooltip), and {{Label|formula}} a hover/tap
  // tooltip (use it for any derived number — a save DC, an attack roll, a uses-count — instead
  // of spelling the math inline; on a real character sheet the token becomes the computed value).
  const re = /\[\[\s*(\d+)d(\d+)\s*(?:\+\s*([A-Za-z]{3}))?\s*\]\]|\{\{\s*([^|{}]+?)\s*\|\s*([^{}]+?)\s*\}\}/g;
  let out = "", last = 0, m;
  while ((m = re.exec(str)) !== null) {
    out += esc(str.slice(last, m.index));
    if (m[1]) out += scalingDieHTML(parseInt(m[1], 10), parseInt(m[2], 10), m[3]);
    else out += tipTermHTML(m[4], m[5]);
    last = re.lastIndex;
  }
  return out + esc(str.slice(last));
}

// Full names for the [[XdY+Abil]] damage token's ability abbreviation.
const ABILITY_NAMES = {
  str: "Strength", dex: "Dexterity", con: "Constitution",
  int: "Intelligence", wis: "Wisdom", cha: "Charisma",
};

// A hover/tap tooltip term for an inline derived number (e.g. a save DC): shows the label + ⓘ,
// reveals the formula on hover/tap. Mirrors the keyStats formula tooltip so descriptions stay clean.
function tipTermHTML(label, formula) {
  return `<span class="tip-term" title="${esc(formula)}">${esc(label)}<sup class="tip-mark">&#9432;</sup>` +
    `<span class="term-tip">${esc(formula)}</span></span>`;
}

/* Weapon Mastery (data/rules/weapon-mastery.json): the default maneuver any proficient wielder
   gets from a weapon. Short effect text here drives the hover tooltip + weapon page. */
const MASTERIES = {
  Cleave: "On a melee hit, make one attack against a second creature within 5 ft (no ability modifier to that damage). Once per turn.",
  Graze:  "On a miss, still deal damage equal to the ability modifier you attacked with.",
  Nick:   "When holding a Light weapon in each hand (two-weapon fighting), make the off-hand attack as part of your Attack action instead of using your bonus action (once per turn).",
  Push:   "On a hit, push a Large-or-smaller target up to 10 ft straight away from you.",
  Sap:    "On a hit, the target has disadvantage on its next attack roll before your next turn.",
  Slow:   "On a hit that deals damage, reduce the target's speed by 10 ft until the start of your next turn.",
  Topple: "On a hit, the target makes a Constitution save (DC 8 + proficiency bonus + your attacking ability modifier) or is knocked prone.",
  Vex:    "On a hit that deals damage, you have advantage on your next attack against that same target.",
};
function masteryHTML(name) {
  if (!name) return `<span class="muted">—</span>`;
  const def = MASTERIES[name];
  if (!def) return esc(name);
  return `<span class="tip-term">${esc(name)}<span class="term-tip">${esc(def)}</span></span>`;
}

/* Weapon property glossary (data/rules/weapon-properties.json). Drives the hover tooltip so
   "Light", "Finesse", etc. explain themselves in the Attacks / weapon tables. */
const PROPERTIES = {
  finesse: "Use Strength or Dexterity (your choice) for attack and damage rolls with it. A class feature may further change which ability you use (e.g. the Joker uses Charisma).",
  light: "Small and easy to handle. Holding a Light weapon in each hand lets you use a bonus action to make one extra attack with the second (two-weapon fighting).",
  heavy: "Large and unwieldy; Small creatures have disadvantage on attack rolls with it.",
  reach: "Adds 5 ft to your reach when you attack with it, and for opportunity attacks.",
  thrown: "You can throw it for a ranged attack, using the same ability modifier as a melee attack with it.",
  "two-handed": "You need both hands to attack with it.",
  versatile: "Usable one- or two-handed; two-handed it deals the larger 'versatile' damage die shown.",
  ammunition: "Needs ammunition to make a ranged attack; you draw a piece as part of the attack.",
  loading: "You can fire only one piece of ammunition when you attack with it, no matter how many attacks you could make.",
  special: "Has unusual rules described in the weapon's own text.",
};
function propsHTML(list) {
  if (!Array.isArray(list) || !list.length) return `<span class="muted">—</span>`;
  return list.map((p) => {
    const def = PROPERTIES[String(p).toLowerCase()];
    return def ? `<span class="tip-term">${esc(p)}<span class="term-tip">${esc(def)}</span></span>` : esc(p);
  }).join(", ");
}

function scalingDieHTML(count, size, abil) {
  const i = DIE_CHAIN.indexOf(size);
  const base = `${count}d${size}`;
  // Optional "+ ability modifier" folded into the tooltip (kept out of the visible prose).
  const ab = abil && ABILITY_NAMES[String(abil).toLowerCase()];
  const modLine = ab ? ` + your ${ab} modifier` : "";
  if (i < 0) return esc(base + (ab ? ` + ${ab} mod` : "")); // non-standard die: no scaling tooltip
  const seq = [0, 1, 2, 3].map((k) => count + "d" + DIE_CHAIN[Math.min(i + k, DIE_CHAIN.length - 1)]);
  const title = `Damage: ${seq.join(" · ")} (die steps up at levels 5 · 11 · 17)${modLine}`;
  return `<span class="scaling-die" title="${esc(title)}">${esc(base)}<sup class="scale-mark">▲</sup>` +
    `<span class="scale-tip" role="tooltip">
       <span class="scale-tip-title">${ab ? "Damage" : "Scaling die"}</span>
       <span class="scale-tip-row">${esc(seq.join(" · "))}</span>
       <span class="scale-tip-lv">die steps up at levels 5 · 11 · 17</span>
       ${ab ? `<span class="scale-tip-lv">+ your ${esc(ab)} modifier</span>` : ""}
     </span></span>`;
}

/* Pull "(1) Name: effect (2) Name: effect …" out of a description. Returns
   { lead, rows:[{n,name,effect}] } or null if there is no such list (needs 2+ items). */
function extractNumberedTable(desc) {
  if (typeof desc !== "string") return null;
  const first = desc.search(/\(1\)\s*[^:)]+?:/);
  if (first < 0) return null;
  const lead = desc.slice(0, first).trim();
  const body = desc.slice(first);
  const re = /\((\d+)\)\s*([^:]+?):\s*([\s\S]*?)(?=\s*\(\d+\)\s*[^:]+?:|$)/g;
  const rows = [];
  let m;
  while ((m = re.exec(body)) !== null) {
    rows.push({ n: m[1], name: m[2].trim(), effect: m[3].trim() });
  }
  return rows.length >= 2 ? { lead, rows } : null;
}

function renderClass(c) {
  return head(c.name, c.flavor) +
    `<div class="detail-grid">
      ${stat("HP", (c.hitDie || "?") + " at level 1")}
      ${stat("Primary Ability", c.primaryAbility || "—")}
      ${stat("Saving Throws", (c.savingThrows || []).join(", ") || "—")}
      ${stat("Subclass At", c.subclassLevel ? "Level " + c.subclassLevel : "—")}
    </div>
    ${keyStatsSection(c.keyStats)}
    <div class="detail-body">
      ${c.proficiencies ? `<h2>Proficiencies</h2><p>${esc(profText(c.proficiencies))}</p>` : ""}
      ${skillChoiceSection(c)}
      ${attacksSection(c)}
      ${parrySection(c)}
      ${engineSection(c.engine)}
      ${features(c.features)}
    </div>`;
}

/* The class's headline mechanic numbers (save/effect DC, resource cap, base Parry DC…) shown
   in a prominent stat block up top, like a Monk's Ki save DC. Data-driven via keyStats so every
   class — current and future — surfaces its own mechanic without touching the renderer. */
function keyStatsSection(list) {
  if (!Array.isArray(list) || !list.length) return "";
  return `<h2 class="key-stats-title">Key Numbers</h2>
    <div class="key-stats">` + list.map((s) => {
      // A `formula` turns the value into a hover term: the at-a-glance progression stays
      // visible, the exact calculation lives in the tooltip (like the [[XdY]] scaling die).
      const val = s.formula
        ? `<span class="tip-term" title="${esc(s.formula)}">${esc(s.value || "")}<sup class="tip-mark">&#9432;</sup><span class="term-tip">${esc(s.formula)}</span></span>`
        : esc(s.value || "");
      return `<div class="key-stat">
         <div class="label">${esc(s.label || "")}</div>
         <div class="value">${val}</div>
         ${s.note ? `<div class="note">${esc(s.note)}</div>` : ""}
       </div>`;
    }).join("") + `</div>`;
}

/* A class's weapon attacks, with damage pulled from the loaded weapons data so the
   class page connects "proficient weapons" to the actual attack + damage. */
function attacksSection(c) {
  const names = c.proficiencies && Array.isArray(c.proficiencies.weapons) ? c.proficiencies.weapons : [];
  if (!names.length) return "";
  const rows = names.map((n) => {
    const w = (store.weapons || []).find((x) => x.name === n);
    if (!w || !w.damage) return `<tr><td><strong>${esc(n)}</strong></td><td class="muted" colspan="4">—</td></tr>`;
    const hasVers = Array.isArray(w.properties) && w.properties.includes("versatile");
    const dmg = esc(w.damage.die) +
      (hasVers && w.versatileDamage ? ` <span class="muted">(${esc(w.versatileDamage)} two-handed)</span>` : "");
    const type = esc(w.damage.type || "—");
    const props = propsHTML(w.properties);
    const rng = w.range ? ` <span class="muted">${esc((w.range.normal ?? "?") + "/" + (w.range.long ?? "?") + " ft")}</span>` : "";
    return `<tr><td><strong>${esc(w.name)}</strong>${rng}</td><td>${dmg}</td><td>${type}</td><td>${props}</td><td>${masteryHTML(w.mastery)}</td></tr>`;
  }).join("");
  return `<h2>Attacks</h2>
    <p class="muted">Weapons this class is proficient with, and what each hits for. To attack, take the Attack action: roll d20 + ability modifier + proficiency bonus vs the target's AC. On a hit, damage = the die below <strong>+ your ability modifier</strong>. Any feature that says “weapon attack” or deals “weapon damage” (an extra attack, an area strike, a rider) uses one of these weapons and this damage — class features then add their own bonuses on top. <strong>Mastery</strong> is the default maneuver any proficient wielder gets from that weapon (hover it); see the Rules tab (Weapon Mastery).</p>
    <table class="data-table attack-table">
      <thead><tr><th>Weapon</th><th>Damage</th><th>Type</th><th>Properties</th><th>Mastery</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

/* Skill proficiencies as a table: one row per option, sorted by (and showing) the
   ability it scales with, so the plain "Choose two from …" sentence becomes scannable. */
function skillChoiceSection(c) {
  const raw = c.proficiencies && c.proficiencies.skills;
  const parsed = parseSkillChoice(raw);
  if (!parsed || !parsed.skills.length) {
    return raw ? `<h2>Skill Proficiencies</h2><p>${esc(typeof raw === "string" ? raw : "")}</p>` : "";
  }
  const rows = parsed.skills.map((name) => {
    const s = (store.skills || []).find((x) => (x.name || "").toLowerCase() === name.toLowerCase());
    return { name, ability: s ? s.ability : "—" };
  });
  rows.sort((a, b) =>
    (ABILITY_ORDER.indexOf(a.ability) - ABILITY_ORDER.indexOf(b.ability)) || a.name.localeCompare(b.name));
  const body = rows.map((r) =>
    `<tr><td>${esc(r.name)}</td><td class="col-ability">${esc(r.ability)}</td></tr>`).join("");
  const caption = parsed.count
    ? `Choose <strong>${esc(parsed.count)}</strong> of the following:`
    : "Available skills:";
  return `<h2>Skill Proficiencies</h2>
    <p class="muted">${caption}</p>
    <table class="data-table">
      <thead><tr><th>Skill</th><th>Scales with</th></tr></thead>
      <tbody>${body}</tbody>
    </table>`;
}

/* Parse "Choose two from A, B, and C" -> { count: 2, skills: [A, B, C] }.
   Accepts a plain array too. Falls back to { count: null, skills: [] } if unparseable. */
function parseSkillChoice(raw) {
  if (Array.isArray(raw)) return { count: null, skills: raw };
  if (typeof raw !== "string" || !raw.trim()) return null;
  const m = /choose\s+(\w+)\s+from\s+(.+)/i.exec(raw);
  if (!m) return { count: null, skills: [] };
  const words = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
  const count = words[m[1].toLowerCase()] || parseInt(m[1], 10) || null;
  const skills = m[2].replace(/\.\s*$/, "")
    .split(/\s*,\s*(?:and\s+)?|\s+and\s+/i)
    .map((s) => s.trim())
    .filter(Boolean);
  return { count, skills };
}

/* Circus-system fields (all optional; only render when present — see
   data/schema/class.schema.json and data/schema/MECHANICS.md). */

function parrySection(c) {
  if (c.parryBaseDC == null && !c.defenseAbility && !c.parryReskin && !c.riposte) return "";
  return `<h2>Parry</h2>
    <div class="parry-block">
      ${c.parryBaseDC != null ? `<span class="badge badge-dc">Parry Base DC ${esc(c.parryBaseDC)}</span>` : ""}
      ${c.defenseAbility ? `<p class="muted">Defense Ability: <strong>${esc(c.defenseAbility)}</strong></p>` : ""}
      ${parryFormula(c)}
      ${c.parryReskin ? `<p class="parry-reskin">${fmtDesc(c.parryReskin)}</p>` : ""}
      ${c.riposte ? `<p><strong>Riposte</strong> <span class="muted">(on Full Dodge)</span>: ${fmtDesc(c.riposte)}</p>` : ""}
      <p class="muted">Roll a d20 vs your effective DC: <strong>above</strong> = no damage, <strong>equal</strong> = half, <strong>below</strong> = +50%. See the Rules tab (Parry &amp; Dodging) for the full rule.</p>
    </div>`;
}

/* Spells out that the Parry DC on the sheet is a BASE, and the value you actually roll against
   is modified (proficiency, your defense stat, weapon, situation). See MECHANICS.md §1.5. */
function parryFormula(c) {
  if (c.parryBaseDC == null) return "";
  return `<p class="parry-formula">This Parry DC is <strong>fixed</strong> — it does not scale with your level,
    ability scores, or weapon. The value you roll against is
    <span class="formula">base ${esc(c.parryBaseDC)} &plusmn; situational modifiers</span>,
    never below 3. <strong>Lower is better.</strong></p>`;
}

function engineSection(e) {
  if (!e || typeof e !== "object" || Array.isArray(e)) return "";
  return `<h2>Engine${e.name ? " — " + esc(e.name) : ""}</h2>
    <div class="engine-block">
      ${e.resourceType ? `<span class="badge badge-engine">${esc(cap(e.resourceType))}</span>` : ""}
      ${e.description ? `<p>${fmtDesc(e.description)}</p>` : ""}
      <div class="detail-grid">
        ${e.generation ? stat("Generation", e.generation) : ""}
        ${e.spend ? stat("Spend", e.spend) : ""}
        ${e.cap != null
          ? (e.capFormula
              ? statHTML("Cap", `<span class="tip-term" title="${esc(e.capFormula)}">${esc(e.cap)}<sup class="tip-mark">&#9432;</sup><span class="term-tip">${esc(e.capFormula)}</span></span>`)
              : stat("Cap", e.cap))
          : ""}
      </div>
    </div>`;
}

function renderSubclass(s) {
  return head(s.name, (s.parentClass ? s.parentClass + " subclass" : "")) +
    `<div class="detail-body">${s.flavor ? `<p>${esc(s.flavor)}</p>` : ""}${features(s.features)}</div>`;
}

function renderSpell(s) {
  return head(s.name, `${s.level ? "Level " + s.level : "Cantrip"} ${s.school || ""}`) +
    `<div class="detail-grid">
      ${stat("Casting Time", s.castingTime || "—")}
      ${stat("Range", s.range || "—")}
      ${stat("Components", (s.components || []).join(", ") || "—")}
      ${stat("Duration", s.duration || "—")}
    </div>
    <div class="detail-body">
      <p>${esc(s.description || "")}</p>
      ${s.higherLevels ? `<h2>At Higher Levels</h2><p>${esc(s.higherLevels)}</p>` : ""}
      ${Array.isArray(s.classes) ? `<p class="muted">Classes: ${esc(s.classes.join(", "))}</p>` : ""}
    </div>`;
}

function renderSkill(s) {
  return head(s.name, s.ability ? s.ability + " skill" : "") +
    `<div class="detail-body"><p>${esc(s.description || "")}</p></div>`;
}

function renderPassive(p) {
  return head(p.name, p.type || "Feature") +
    `<div class="detail-body">
      ${p.prerequisite ? `<p class="muted">Prerequisite: ${esc(p.prerequisite)}</p>` : ""}
      <p>${esc(p.description || "")}</p>
    </div>`;
}

function renderWeapon(w) {
  const dmg = w.damage ? `${w.damage.die || "?"} ${w.damage.type || ""}`.trim() : "—";
  const hasVersatile = Array.isArray(w.properties) && w.properties.includes("versatile");
  return head(w.name, w.flavor) +
    `<div class="detail-grid">
      ${stat("Damage", dmg)}
      ${stat("Category", w.category ? cap(w.category) : "—")}
      ${statHTML("Properties", propsHTML(w.properties))}
      ${w.range ? stat("Range", `${w.range.normal ?? "?"}/${w.range.long ?? "?"} ft`) : ""}
      ${hasVersatile && w.versatileDamage ? stat("Versatile", w.versatileDamage) : ""}
      ${w.mastery ? stat("Mastery", w.mastery) : ""}
    </div>
    <div class="detail-body">
      ${w.mastery ? `<h2>Weapon Mastery — ${esc(w.mastery)}</h2><p>${esc(MASTERIES[w.mastery] || "")}</p><p class="muted">Any character proficient with this weapon can use its Mastery on their weapon attacks — no class feature needed. See the Rules tab (Weapon Mastery).</p>` : ""}
      ${parryProfileSection(w.parryProfile)}
      ${proficientClassesSection(w.proficientClasses)}
    </div>`;
}

function parryProfileSection(pp) {
  if (!pp || typeof pp !== "object" || Array.isArray(pp)) return "";
  const can = pp.canParry === true;
  return `<h2>Parry Profile</h2>
    <div class="parry-block">
      <span class="badge ${can ? "badge-dc" : "badge-engine"}">Can Parry: ${can ? "Yes" : "No"}</span>
      ${can && pp.parryRange ? `<p class="muted">Parry Range: <strong>${esc(cap(pp.parryRange))}</strong></p>` : ""}
      ${pp.note ? `<p class="parry-reskin">${esc(pp.note)}</p>` : ""}
      <p class="muted">A weapon no longer changes the Parry DC — it only determines whether you can parry, and against what.</p>
    </div>`;
}

function proficientClassesSection(list) {
  const txt = Array.isArray(list) && list.length ? list.join(", ") : "—";
  return `<h2>Proficient Classes</h2>
    <p>${esc(txt)}</p>
    <p class="muted">Informational only — anyone may wield this weapon; proficiency just governs the proficiency bonus (to attacks and to parrying).</p>`;
}

function armorAC(a) {
  if (a.category === "shield") return `+${a.acBonus ?? 0} AC`;
  const base = a.baseAC ?? "?";
  if (a.maxDexBonus == null) return `${base} + Dex`;
  if (a.maxDexBonus === 0) return `${base}`;
  return `${base} + Dex (max ${a.maxDexBonus})`;
}

function renderArmor(a) {
  return head(a.name, a.flavor) +
    `<div class="detail-grid">
      ${stat("Armor Class", armorAC(a))}
      ${stat("Category", a.category ? cap(a.category) : "—")}
      ${stat("Availability", a.availability === "bought" ? "Bought" : "Starter")}
      ${a.strengthRequirement != null ? stat("Strength Req.", "Str " + a.strengthRequirement) : ""}
      ${stat("Stealth", a.stealthDisadvantage ? "Disadvantage" : "Normal")}
    </div>
    <div class="detail-body">
      <p class="muted">Armor grants AC only — an attack must beat your AC to hit, and only a hit can then be Parried. ${a.category === "clothing"
        ? "Clothing needs <strong>no proficiency</strong> — anyone can wear it, including casters with no armor training. It is the unarmored baseline (10 + full Dex) in wearable form."
        : "Proficiency with an armor's category (Light / Medium / Heavy) comes from your class; wearing armor you aren't proficient with gives disadvantage on Strength- and Dexterity-based checks, attacks, and saves."}</p>
      <p class="muted">${a.availability === "bought"
        ? "<strong>Bought</strong> — a premium upgrade acquired by purchase or loot during play, not owned at character creation."
        : "<strong>Starter</strong> — basic gear available at character creation."} Pricing is left to the DM / campaign.</p>
    </div>`;
}

function renderRule(r) {
  const sections = Array.isArray(r.sections) ? r.sections.map((s) => {
    const h = s.heading ? `<h2>${esc(s.heading)}</h2>` : "";
    const paras = Array.isArray(s.paragraphs) ? s.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("") : "";
    const list = Array.isArray(s.list) && s.list.length
      ? `<ul>${s.list.map((li) => `<li>${esc(li)}</li>`).join("")}</ul>` : "";
    return h + paras + list;
  }).join("") : "";
  return head(r.name, r.summary) + `<div class="detail-body">${sections}</div>`;
}

/* ---------- helpers ---------- */

function profText(p) {
  // Skills are rendered separately as a table (skillChoiceSection).
  const parts = [];
  for (const k of ["armor", "weapons", "tools"]) {
    if (p[k]) parts.push(`${cap(k)}: ${Array.isArray(p[k]) ? p[k].join(", ") : p[k]}`);
  }
  return parts.join(" · ");
}
function slug(it) {
  return (it.id || it.name || "").toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function esc(s) {
  return (s == null ? "" : String(s)).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function setStatus(msg) { $("#status").textContent = msg; }

boot();
