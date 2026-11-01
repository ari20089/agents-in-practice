#!/usr/bin/env node
// Validates every skill folder under skills/ against the rules in
// CONTRIBUTING.md and SKILL-SCHEMA.md. Zero dependencies; Node 18+.
//
//   node scripts/validate-skills.mjs            # all skills
//   node scripts/validate-skills.mjs my-skill   # one skill

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const SKILLS_DIR = "skills";
const ROOT_README = "README.md";
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_NAME = 64;
const MAX_DESCRIPTION = 1024;
const MAX_LINES = 500;
const ALLOWED_TOP_LEVEL_FILES = new Set(["SKILL.md", "README.md", "metadata.json"]);
const ALLOWED_TOP_LEVEL_DIRS = new Set(["references", "scripts", "assets"]);
const REQUIRED_SECTIONS = ["## Before Starting", "## Output Structure", "## Step 1", "## Rules"];
// "category" is not a metadata field: the gallery derives it from the top-level folder (skills/ → Skills).
const REQUIRED_METADATA = ["name", "description", "platforms", "tags", "subcategory", "author"];
const KNOWN_PLATFORMS = new Set(["GitHub Copilot", "Copilot Studio", "Microsoft 365 Copilot", "Microsoft Teams", "Power Automate", "Any coding agent", "Other"]);

const errors = [];
let checked = 0;

// The "## Sources" section of a markdown or text file ("" when there is none), and the URLs it links.
function sourcesSection(text) {
  return text.split(/^## (?:\d+\. )?Sources[ \t]*$/m)[1]?.split(/^## /m)[0] ?? "";
}
function sourceUrls(section) {
  return new Set([...section.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => m[1]));
}

function frontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (m) fields[m[1]] = m[2].trim();
  }
  return fields;
}

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

function validateSkill(slug) {
  const dir = join(SKILLS_DIR, slug);
  const fail = (msg) => errors.push(`${slug}: ${msg}`);

  if (!SLUG_RE.test(slug)) fail("folder name must be lowercase kebab-case (letters, digits, single hyphens)");

  // Layout
  for (const entry of readdirSync(dir)) {
    const isDir = statSync(join(dir, entry)).isDirectory();
    if (isDir && !ALLOWED_TOP_LEVEL_DIRS.has(entry)) fail(`unexpected folder "${entry}" (allowed: references, scripts, assets)`);
    if (!isDir && !ALLOWED_TOP_LEVEL_FILES.has(entry)) fail(`unexpected file "${entry}" (allowed: SKILL.md, README.md, metadata.json)`);
  }

  // SKILL.md
  const skillPath = join(dir, "SKILL.md");
  if (!existsSync(skillPath)) {
    fail("missing SKILL.md");
  } else {
    const text = readFileSync(skillPath, "utf8");
    const fm = frontmatter(text);
    if (!fm) {
      fail("SKILL.md must start with a YAML frontmatter block (--- name / description ---)");
    } else {
      if (!fm.name) fail("frontmatter is missing name");
      else {
        if (fm.name !== slug) fail(`frontmatter name "${fm.name}" must equal the folder name "${slug}"; rename one of them`);
        if (fm.name.length > MAX_NAME) fail(`name is ${fm.name.length} chars; max ${MAX_NAME}`);
      }
      if (!fm.description) fail("frontmatter is missing description (it must be on a single line)");
      else if (fm.description.length > MAX_DESCRIPTION) fail(`description is ${fm.description.length} chars; max ${MAX_DESCRIPTION}`);
    }
    const lines = text.split(/\r?\n/).length;
    if (lines > MAX_LINES) fail(`SKILL.md is ${lines} lines; max ${MAX_LINES} (move material to references/)`);
    for (const section of REQUIRED_SECTIONS) {
      if (!text.includes(section)) fail(`SKILL.md is missing required section "${section}" (see SKILL-SCHEMA.md)`);
    }
    for (const link of brokenLinks(skillPath, text)) fail(`SKILL.md links to "${link}" but that file does not exist`);
  }

  // README.md
  const readmePath = join(dir, "README.md");
  if (!existsSync(readmePath)) {
    fail("missing README.md");
  } else {
    const readme = readFileSync(readmePath, "utf8");
    for (const link of brokenLinks(readmePath, readme)) fail(`README.md links to "${link}" but that file does not exist`);
    // Readers need the pages behind the item's claims, not only the agent-facing copy.
    const sources = sourcesSection(readme);
    const urls = sourceUrls(sources);
    if (!sources) fail('README.md has no "## Sources" section');
    else if (!urls.size) fail('README.md "## Sources" section links to no pages');
    // The agent-facing copy of the list must not drift from the one people read.
    const refDir = join(dir, "references");
    if (urls.size && existsSync(refDir)) {
      for (const f of readdirSync(refDir).filter((f) => /\.(md|txt)$/i.test(f))) {
        const refUrls = sourceUrls(sourcesSection(readFileSync(join(refDir, f), "utf8")));
        for (const u of refUrls) if (!urls.has(u)) fail(`README.md Sources is missing ${u}, listed in references/${f}`);
        for (const u of urls) if (refUrls.size && !refUrls.has(u)) fail(`references/${f} Sources is missing ${u}, listed in README.md`);
      }
    }
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
      if (meta.category !== undefined) fail('metadata.json has "category"; the category comes from the folder (skills/ → Skills). Use "subcategory" instead');
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
    if (!readme.includes(`skills/${slug}/`)) fail(`no row in the root README.md catalog links to skills/${slug}/`);
  }

  checked += 1;
}

if (!existsSync(SKILLS_DIR)) {
  console.error(`No ${SKILLS_DIR}/ directory found. Run this from the repository root.`);
  process.exit(1);
}

const only = process.argv[2];
for (const entry of readdirSync(SKILLS_DIR)) {
  const full = join(SKILLS_DIR, entry);
  if (!statSync(full).isDirectory() || entry.startsWith("_")) continue;
  if (only && entry !== only) continue;
  validateSkill(entry);
}

if (only && checked === 0) {
  console.error(`No skill folder named "${only}" under ${SKILLS_DIR}/.`);
  process.exit(1);
}

if (errors.length) {
  console.error(`\n${errors.length} problem(s) in ${checked} skill(s):\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error();
  process.exit(1);
}

console.log(`✓ ${checked} skill(s) validated, no problems found.`);
