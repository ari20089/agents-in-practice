#!/usr/bin/env node
// Validates every folder under agent-instructions/ against the rules in
// AGENT-INSTRUCTIONS-SCHEMA.md. Zero dependencies; Node 18+.
//
//   node scripts/validate-agent-instructions.mjs            # all items
//   node scripts/validate-agent-instructions.mjs my-agent   # one item

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";

const ITEMS_DIR = "agent-instructions";
const ROOT_README = "README.md";
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// Limits from the declarative agent schema: instructions and embedded knowledge files.
const MAX_INSTRUCTION_CHARS = 8000;
const MAX_KNOWLEDGE_BYTES = 1024 * 1024;
const MAX_KNOWLEDGE_FILES = 10;
const KNOWLEDGE_TYPES = new Set([".txt", ".pdf", ".docx", ".doc", ".pptx", ".ppt", ".xlsx", ".xls"]);
const ALLOWED_TOP_LEVEL_FILES = new Set(["INSTRUCTIONS.md", "README.md", "metadata.json"]);
const ALLOWED_TOP_LEVEL_DIRS = new Set(["knowledge", "assets"]);
// "category" is not a metadata field: the gallery derives it from the top-level folder.
const REQUIRED_METADATA = ["name", "description", "platforms", "tags", "subcategory", "author"];
const KNOWN_PLATFORMS = new Set(["GitHub Copilot", "Copilot Studio", "Microsoft 365 Copilot", "Any coding agent", "Other"]);

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

function validateItem(slug) {
  const dir = join(ITEMS_DIR, slug);
  const fail = (msg) => errors.push(`${slug}: ${msg}`);

  if (!SLUG_RE.test(slug)) fail("folder name must be lowercase kebab-case (letters, digits, single hyphens)");

  // Layout
  for (const entry of readdirSync(dir)) {
    const isDir = statSync(join(dir, entry)).isDirectory();
    if (isDir && !ALLOWED_TOP_LEVEL_DIRS.has(entry)) fail(`unexpected folder "${entry}" (allowed: knowledge, assets)`);
    if (!isDir && !ALLOWED_TOP_LEVEL_FILES.has(entry)) fail(`unexpected file "${entry}" (allowed: INSTRUCTIONS.md, README.md, metadata.json)`);
  }

  // INSTRUCTIONS.md
  const instructionsPath = join(dir, "INSTRUCTIONS.md");
  if (!existsSync(instructionsPath)) {
    fail("missing INSTRUCTIONS.md");
  } else {
    const text = readFileSync(instructionsPath, "utf8");
    const chars = [...text.trim()].length;
    if (!chars) fail("INSTRUCTIONS.md is empty");
    if (chars > MAX_INSTRUCTION_CHARS) fail(`INSTRUCTIONS.md is ${chars} characters; max ${MAX_INSTRUCTION_CHARS} (move reference data to knowledge/, not behaviour)`);
    if (/^---\r?\n/.test(text)) fail("INSTRUCTIONS.md must not start with frontmatter; it is pasted into the agent as is");
  }

  // knowledge/
  const knowledgeDir = join(dir, "knowledge");
  if (existsSync(knowledgeDir)) {
    const files = readdirSync(knowledgeDir).filter((f) => !f.startsWith("."));
    if (files.length > MAX_KNOWLEDGE_FILES) fail(`knowledge/ has ${files.length} files; max ${MAX_KNOWLEDGE_FILES}`);
    for (const f of files) {
      const path = join(knowledgeDir, f);
      if (statSync(path).isDirectory()) { fail(`knowledge/${f} is a folder; knowledge files must sit directly in knowledge/`); continue; }
      const ext = extname(f).toLowerCase();
      if (!KNOWLEDGE_TYPES.has(ext)) fail(`knowledge/${f} has type "${ext || "none"}"; use one of ${[...KNOWLEDGE_TYPES].join(", ")} (Markdown text goes in a .txt file)`);
      const size = statSync(path).size;
      if (size > MAX_KNOWLEDGE_BYTES) fail(`knowledge/${f} is ${size} bytes; max ${MAX_KNOWLEDGE_BYTES}`);
    }
  }

  // README.md
  const readmePath = join(dir, "README.md");
  if (!existsSync(readmePath)) {
    fail("missing README.md");
  } else {
    for (const link of brokenLinks(readmePath, readFileSync(readmePath, "utf8"))) fail(`README.md links to "${link}" but that file does not exist`);
  }

  // metadata.json
  const metaPath = join(dir, "metadata.json");
  if (!existsSync(metaPath)) {
    fail("missing metadata.json");
  } else {
    let meta;
    try {
      meta = JSON.parse(readFileSync(metaPath, "utf8"));
    } catch (e) {
      fail(`metadata.json is not valid JSON: ${e.message}`);
    }
    if (meta) {
      for (const key of REQUIRED_METADATA) {
        if (meta[key] === undefined || meta[key] === "" || (Array.isArray(meta[key]) && meta[key].length === 0)) fail(`metadata.json is missing "${key}"`);
      }
      if (meta.category !== undefined) fail('metadata.json has "category"; the category comes from the folder (agent-instructions/ → Agent instructions). Use "subcategory" instead');
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

// No agent-instructions/ folder yet is fine: there is nothing to validate.
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
  console.error(`\n${errors.length} problem(s) in ${checked} agent instruction(s):\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error();
  process.exit(1);
}

console.log(`✓ ${checked} agent instruction(s) validated, no problems found.`);
