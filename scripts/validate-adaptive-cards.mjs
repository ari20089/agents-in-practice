#!/usr/bin/env node
// Validates every folder under adaptive-cards/ against the rules in ADAPTIVE-CARD-SCHEMA.md.
// Zero dependencies; Node 18+.
//
//   node scripts/validate-adaptive-cards.mjs              # all cards
//   node scripts/validate-adaptive-cards.mjs my-card      # one card

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const ITEMS_DIR = "adaptive-cards";
const ROOT_README = "README.md";
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// Copilot Studio: Teams and the live chat widget are "limited to version 1.5" (see ADAPTIVE-CARD-SCHEMA.md).
const MAX_VERSION = [1, 5];
// Power Automate's Teams actions fail above "approximately 28 KB"; measured on the card with the sample data filled in.
const MAX_CARD_BYTES = 28000;
// Plain property paths only, so a maker can replace each one by hand in Power Automate or Copilot Studio.
const BINDING_RE = /\$\{([^}]*)\}/g;
const PATH_RE = /^[A-Za-z_]\w*(\.[A-Za-z_]\w*)*$/;
const ALLOWED_TOP_LEVEL_FILES = new Set(["card.json", "data.json", "README.md", "metadata.json"]);
const ALLOWED_TOP_LEVEL_DIRS = new Set(["assets"]);
// "category" is not a metadata field: the gallery derives it from the top-level folder.
const REQUIRED_METADATA = ["name", "description", "platforms", "tags", "subcategory", "author"];
const KNOWN_PLATFORMS = new Set(["GitHub Copilot", "Copilot Studio", "Microsoft 365 Copilot", "Microsoft Teams", "Power Automate", "Any coding agent", "Other"]);

const errors = [];
let checked = 0;

// Relative markdown links in a file, resolved against the file's folder.
function brokenLinks(filePath, text) {
  const broken = [];
  const re = /\]\(([^)\s]+)\)/g;
  let m;
  while ((m = re.exec(text))) {
    const target = m[1];
    if (/^(https?:|mailto:|#)/i.test(target)) continue;
    const clean = target.split("#")[0];
    if (!clean) continue;
    if (!existsSync(resolve(dirname(filePath), clean))) broken.push(target);
  }
  return broken;
}

function readJson(path, fail) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    fail(`${path.split("/").pop()} is not valid JSON: ${e.message}`);
    return undefined;
  }
}

// Every object in the card, depth first, with its JSON path for error messages.
function* objects(node, path = "") {
  if (Array.isArray(node)) {
    for (const [i, x] of node.entries()) yield* objects(x, `${path}[${i}]`);
  } else if (node && typeof node === "object") {
    yield [node, path || "card"];
    for (const [k, v] of Object.entries(node)) yield* objects(v, path ? `${path}.${k}` : k);
  }
}

// Every string in the card, so bindings can be found and filled in.
function mapStrings(node, fn) {
  if (typeof node === "string") return fn(node);
  if (Array.isArray(node)) return node.map((x) => mapStrings(x, fn));
  if (node && typeof node === "object") return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, mapStrings(v, fn)]));
  return node;
}

// Leaf paths in the sample data ("requester.name"), the values a binding can point at.
function leaves(node, path = "", out = new Map()) {
  if (node && typeof node === "object" && !Array.isArray(node)) {
    for (const [k, v] of Object.entries(node)) leaves(v, path ? `${path}.${k}` : k, out);
  } else out.set(path, node);
  return out;
}

function validateCard(card, data, fail) {
  if (!card || typeof card !== "object" || Array.isArray(card)) return fail("card.json must be a JSON object");
  if (card.type !== "AdaptiveCard") fail('card.json root "type" must be "AdaptiveCard"');
  if (typeof card.$schema !== "string" || !card.$schema) fail('card.json has no "$schema"');
  const v = /^(\d+)\.(\d+)$/.exec(card.version ?? "");
  if (!v) fail('card.json "version" must be a string such as "1.5"');
  else if (Number(v[1]) > MAX_VERSION[0] || (Number(v[1]) === MAX_VERSION[0] && Number(v[2]) > MAX_VERSION[1])) fail(`card.json version ${card.version} is above ${MAX_VERSION.join(".")}, the highest Teams and Copilot Studio's live chat render`);

  // Bindings
  const bindings = new Set();
  mapStrings(card, (s) => {
    for (const m of s.matchAll(BINDING_RE)) {
      if (PATH_RE.test(m[1].trim())) bindings.add(m[1].trim());
      else fail(`card.json binding "${m[0]}" is not a plain property path; functions and expressions can't be replaced by hand in Power Automate or Copilot Studio`);
    }
    return s;
  });
  const ids = new Map();
  for (const [obj, path] of objects(card)) {
    for (const key of Object.keys(obj)) {
      if (key.startsWith("$") && !(obj === card && key === "$schema")) fail(`card.json uses "${key}" at ${path}; only plain \${...} bindings are allowed, so the card works in hosts that don't expand templates`);
    }
    if (typeof obj.id === "string") {
      if (ids.has(obj.id)) fail(`card.json id "${obj.id}" is used at ${ids.get(obj.id)} and ${path}; ids must be unique`);
      else ids.set(obj.id, path);
    }
    if (typeof obj.type === "string" && obj.type.startsWith("Input.")) {
      if (!obj.id) fail(`card.json ${obj.type} at ${path} has no "id"; the response comes back under it`);
      if (!obj.label) fail(`card.json ${obj.type} at ${path} has no "label"; labels are the recommended way to tag inputs and screen readers use them`);
    }
    if (obj.type === "Action.Submit") {
      if (!obj.data || typeof obj.data !== "object" || Array.isArray(obj.data) || typeof obj.data.actionSubmitId !== "string" || !obj.data.actionSubmitId) fail(`card.json Action.Submit at ${path} needs a "data" object with an "actionSubmitId", so the host can tell which card and button a response came from`);
      if (obj.isEnabled !== undefined) fail(`card.json Action.Submit at ${path} sets "isEnabled", which Teams doesn't support`);
    }
  }

  // Sample data
  if (bindings.size && data === undefined) return fail("card.json has bindings but there is no data.json with sample values");
  const sample = data === undefined ? new Map() : leaves(data);
  for (const b of bindings) {
    if (!sample.has(b)) fail(`card.json binding \${${b}} has no sample value in data.json`);
    else if (!["string", "number", "boolean"].includes(typeof sample.get(b))) fail(`data.json "${b}" must be a single string, number or true/false value`);
  }
  for (const key of sample.keys()) if (key && !bindings.has(key)) fail(`data.json "${key}" isn't used by any binding in card.json`);

  // Size, with the sample data filled in
  const filled = mapStrings(card, (s) => s.replace(BINDING_RE, (m, p) => (sample.has(p.trim()) ? String(sample.get(p.trim())) : m)));
  const bytes = Buffer.byteLength(JSON.stringify(filled, null, 2));
  if (bytes > MAX_CARD_BYTES) fail(`card.json is ${bytes} bytes with the sample data filled in; max ${MAX_CARD_BYTES}`);
}

function validateItem(slug) {
  const dir = join(ITEMS_DIR, slug);
  const fail = (msg) => errors.push(`${slug}: ${msg}`);

  if (!SLUG_RE.test(slug)) fail("folder name must be lowercase kebab-case (letters, digits, single hyphens)");

  // Layout
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".")) continue;
    const isDir = statSync(join(dir, entry)).isDirectory();
    if (isDir && !ALLOWED_TOP_LEVEL_DIRS.has(entry)) fail(`unexpected folder "${entry}" (allowed: assets)`);
    if (!isDir && !ALLOWED_TOP_LEVEL_FILES.has(entry)) fail(`unexpected file "${entry}" (allowed: card.json, data.json, README.md, metadata.json)`);
  }

  // card.json and data.json
  const cardPath = join(dir, "card.json");
  const dataPath = join(dir, "data.json");
  const data = existsSync(dataPath) ? readJson(dataPath, fail) : undefined;
  if (data !== undefined && (typeof data !== "object" || data === null || Array.isArray(data))) fail("data.json must be a JSON object");
  else if (!existsSync(cardPath)) fail("missing card.json");
  else {
    const card = readJson(cardPath, fail);
    if (card !== undefined) validateCard(card, data, fail);
  }

  // README.md
  const readmePath = join(dir, "README.md");
  if (!existsSync(readmePath)) {
    fail("missing README.md");
  } else {
    const readme = readFileSync(readmePath, "utf8");
    for (const link of brokenLinks(readmePath, readme)) fail(`README.md links to "${link}" but that file does not exist`);
    // Readers need the pages behind the item's claims about each host.
    const sources = readme.split(/^## Sources[ \t]*$/m)[1]?.split(/^## /m)[0] ?? "";
    if (!sources) fail('README.md has no "## Sources" section');
    else if (!/\]\(https?:\/\//.test(sources)) fail('README.md "## Sources" section links to no pages');
  }

  // metadata.json
  const metaPath = join(dir, "metadata.json");
  if (!existsSync(metaPath)) {
    fail("missing metadata.json");
  } else {
    const meta = readJson(metaPath, fail);
    if (meta) {
      for (const key of REQUIRED_METADATA) {
        if (meta[key] === undefined || meta[key] === "" || (Array.isArray(meta[key]) && meta[key].length === 0)) fail(`metadata.json is missing "${key}"`);
      }
      if (meta.category !== undefined) fail('metadata.json has "category"; the category comes from the folder (adaptive-cards/ → Adaptive Cards). Use "subcategory" instead');
      if (Array.isArray(meta.platforms)) {
        for (const p of meta.platforms) if (!KNOWN_PLATFORMS.has(p)) fail(`metadata.json platform "${p}" is not one of ${[...KNOWN_PLATFORMS].join(", ")}`);
      } else if (meta.platforms !== undefined) fail("metadata.json platforms must be an array");
      if (meta.tags !== undefined && !Array.isArray(meta.tags)) fail("metadata.json tags must be an array");
      for (const key of ["createdAt", "updatedAt"]) {
        if (meta[key] !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(meta[key])) fail(`metadata.json ${key} must be YYYY-MM-DD`);
      }
    }
  }

  // Catalog row in the root README
  if (existsSync(ROOT_README)) {
    const readme = readFileSync(ROOT_README, "utf8");
    if (!readme.includes(`${ITEMS_DIR}/${slug}/`)) fail(`no row in the root README.md catalog links to ${ITEMS_DIR}/${slug}/`);
  }

  checked += 1;
}

// No adaptive-cards/ folder yet is fine: there is nothing to validate.
if (!existsSync(ITEMS_DIR)) {
  console.log(`✓ No ${ITEMS_DIR}/ folder; nothing to validate.`);
  process.exit(0);
}

const only = process.argv[2];
for (const entry of readdirSync(ITEMS_DIR)) {
  const full = join(ITEMS_DIR, entry);
  if (!statSync(full).isDirectory() || entry.startsWith("_")) continue;
  if (only && entry !== only) continue;
  validateItem(entry);
}

if (only && checked === 0) {
  console.error(`No folder named "${only}" under ${ITEMS_DIR}/.`);
  process.exit(1);
}

if (errors.length) {
  console.error(`\n${errors.length} problem(s) in ${checked} Adaptive Card(s):\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error();
  process.exit(1);
}

console.log(`✓ ${checked} Adaptive Card(s) validated, no problems found.`);
