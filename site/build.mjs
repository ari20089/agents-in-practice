#!/usr/bin/env node
// Builds the static gallery into site/dist.
//
// The category of every item is the top-level folder it lives in (skills/ → "Skills").
// Only folders listed in TYPES are read, and only when they exist, so new content types
// can be added later without touching this file beyond the table below.
//
// One dependency (marked) for Markdown. Run from the repo root: npm run site:build

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "site", "src");
const OUT = join(ROOT, "site", "dist");

const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const REPO = pkg.repository.url.replace(/\.git$/, "");
const [OWNER, REPO_NAME] = REPO.split("/").slice(-2);
const RAW = `https://raw.githubusercontent.com/${OWNER}/${REPO_NAME}/main`;

const SITE = {
  title: "Agents in Practice",
  tagline: "Hands-on skills for AI agents working with Microsoft 365, Copilot Studio and GitHub Copilot.",
  author: { name: "Arindam Choudhury", github: "https://github.com/ari20089", linkedin: "https://www.linkedin.com/in/arindam-choudhury/" },
};

// Top-level folder → gallery category. Order here is the order in the filter rail.
const TYPES = [
  { dir: "skills", label: "Skills", singular: "skill", install: ".github/skills/<slug>/", blurb: "Reusable instruction packages: a SKILL.md plus the references it needs, for any Agent Skills host." },
  { dir: "prompts", label: "Prompts", singular: "prompt", install: "", blurb: "Single instructions for a focused task or outcome." },
  { dir: "agent-instructions", label: "Agent instructions", singular: "agent instruction set", install: "", blurb: "System prompts that define an agent's role." },
];

marked.setOptions({ gfm: true });

// Sub-category colours come from a fixed set of distinct hues so each one is easy to tell
// apart from the blue accent: violet, teal, coral, amber, rose, green. Each keeps the same one.
const SUB_HUES = [280, 175, 20, 38, 340, 140];

// ---------- helpers ----------

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { fields: {}, body: text };
  const fields = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2].trim();
  }
  return { fields, body: m[2] };
}

function listFiles(dir, base = "") {
  const out = [];
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    const rel = base ? `${base}/${entry}` : entry;
    if (statSync(full).isDirectory()) out.push(...listFiles(full, rel));
    else out.push({ path: rel, size: statSync(full).size });
  }
  return out;
}

function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

function fmtSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
}

// Deterministic colour from the slug, for the placeholder card art.
function hue(slug) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

// Generated cover for skills without assets/preview.png: an editor window showing the
// skill's own SKILL.md frontmatter, the closest thing to a screenshot of a skill.
function wrap(text, first, rest, maxLines) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  let limit = first;
  for (const w of words) {
    if ((line + " " + w).trim().length > limit) {
      lines.push(line.trim());
      line = w;
      limit = rest;
      if (lines.length === maxLines) break;
    } else line = `${line} ${w}`;
  }
  if (lines.length < maxLines && line.trim()) lines.push(line.trim());
  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, "") + " …";
  return lines;
}

function cover(slug, name, description) {
  const mono = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";
  const desc = wrap(description || "", 40, 52, 5);
  const rows = [
    `<tspan fill="#64748b">---</tspan>`,
    `<tspan fill="#93c5fd">name:</tspan><tspan fill="#e2e8f0"> ${esc(slug.length > 46 ? slug.slice(0, 45) + "…" : slug)}</tspan>`,
    `<tspan fill="#93c5fd">description:</tspan><tspan fill="#cbd5e1"> ${esc(desc[0] ?? "")}</tspan>`,
    ...desc.slice(1).map((l) => `<tspan fill="#cbd5e1">  ${esc(l)}</tspan>`),
    `<tspan fill="#64748b">---</tspan>`,
  ];
  const text = rows.map((r, i) => `<text x="62" y="${106 + i * 23}" font-family="${mono}" font-size="15" xml:space="preserve">${r}</text>`).join("");
  const heading = `<text x="62" y="${106 + rows.length * 23 + 12}" font-family="${mono}" font-size="16.5" font-weight="700" fill="#ffffff" xml:space="preserve"><tspan fill="#fbbf24"># </tspan>${esc(name)}</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a1428"/><stop offset="1" stop-color="#132a5c"/></linearGradient><radialGradient id="glow" cx=".85" cy=".1" r=".7"><stop offset="0" stop-color="#2563eb" stop-opacity=".55"/><stop offset="1" stop-color="#2563eb" stop-opacity="0"/></radialGradient></defs><rect width="640" height="360" fill="url(#bg)"/><rect width="640" height="360" fill="url(#glow)"/><rect x="36" y="34" width="568" height="300" rx="12" fill="#0b1222" stroke="#ffffff" stroke-opacity=".1"/><path d="M36 46a12 12 0 0 1 12-12h544a12 12 0 0 1 12 12v24H36z" fill="#111b31"/><circle cx="58" cy="52" r="5" fill="#ff5f57"/><circle cx="76" cy="52" r="5" fill="#febc2e"/><circle cx="94" cy="52" r="5" fill="#28c840"/><rect x="116" y="40" width="104" height="30" rx="6" fill="#0b1222"/><text x="130" y="60" font-family="${mono}" font-size="13.5" fill="#cbd5e1">SKILL.md</text><rect x="36" y="70" width="568" height="1" fill="#ffffff" fill-opacity=".08"/>${text}${heading}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Square variant used as the skill's icon on cards and the skill page.
function iconMark(slug, name) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  const h = 205 + (hue(slug) % 16);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h},70%,47%)"/><stop offset="1" stop-color="hsl(${(h + 15) % 360},75%,30%)"/></linearGradient></defs><rect width="96" height="96" rx="22" fill="url(#g)"/><text x="48" y="62" font-family="system-ui,Segoe UI,sans-serif" font-size="40" font-weight="700" fill="#fff" text-anchor="middle" letter-spacing="-1">${esc(initials)}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Rewrite links in rendered Markdown so relative paths point at GitHub, and keep
// images relative (the item's assets/ folder is copied next to the page).
function rewriteLinks(html, item) {
  const base = `${item.type}/${item.slug}`;
  const resolve = (href) => posix.normalize(posix.join(base, href));
  html = html.replace(/href="([^"]+)"/g, (m, href) => {
    if (/^(https?:|mailto:|#|\/)/i.test(href)) return m;
    return `href="${REPO}/blob/main/${resolve(href.replace(/^\.\//, ""))}"`;
  });
  html = html.replace(/src="([^"]+)"/g, (m, src) => {
    if (/^(https?:|data:|\/)/i.test(src)) return m;
    const clean = src.replace(/^\.\//, "");
    if (clean.startsWith("assets/")) return `src="${clean}"`;
    return `src="${RAW}/${resolve(clean)}"`;
  });
  return html;
}

const stripFirstH1 = (md) => md.replace(/^\s*#\s+[^\n]+\n/, "");

// The page owns <h1> and the section <h2>s; push rendered Markdown headings down one level.
const demote = (html) => html.replace(/<(\/?)h([1-5])\b/g, (m, slash, n) => `<${slash}h${Number(n) + 1}`);

// ---------- read content ----------

function readItems() {
  const items = [];
  for (const type of TYPES) {
    const typeDir = join(ROOT, type.dir);
    if (!existsSync(typeDir)) continue;
    for (const slug of readdirSync(typeDir).sort()) {
      const dir = join(typeDir, slug);
      if (slug.startsWith("_") || !statSync(dir).isDirectory() || !existsSync(join(dir, "metadata.json"))) continue;
      const meta = JSON.parse(readFileSync(join(dir, "metadata.json"), "utf8"));
      const readme = existsSync(join(dir, "README.md")) ? readFileSync(join(dir, "README.md"), "utf8") : "";
      const skill = existsSync(join(dir, "SKILL.md")) ? frontmatter(readFileSync(join(dir, "SKILL.md"), "utf8")) : null;
      const hasPreview = existsSync(join(dir, "assets", "preview.png"));
      items.push({
        slug,
        type: type.dir,
        category: type.label,
        typeLabel: type.singular,
        subcategory: meta.subcategory ?? "",
        hue: SUB_HUES[hue(meta.subcategory ?? slug) % SUB_HUES.length],
        name: meta.name,
        description: meta.description,
        platforms: meta.platforms ?? [],
        tags: meta.tags ?? [],
        author: meta.author,
        authorGithub: meta.authorGithub ?? "",
        authorUrl: meta.authorUrl ?? "",
        avatar: meta.authorGithub ? `https://github.com/${meta.authorGithub}.png?size=80` : "",
        version: meta.version ?? "1.0",
        createdAt: meta.createdAt ?? "",
        updatedAt: meta.updatedAt ?? "",
        agentDescription: skill?.fields.description ?? "",
        skillBody: skill?.body ?? "",
        readme,
        // metadata.json, README.md and the gallery preview are for people, not the agent.
        files: listFiles(dir).filter((f) => !["metadata.json", "README.md", "assets/preview.png"].includes(f.path)),
        hasPreview,
        image: hasPreview ? `${type.dir}/${slug}/assets/preview.png` : cover(slug, meta.name, skill?.fields.description ?? meta.description),
        icon: iconMark(slug, meta.name),
        url: `${type.dir}/${slug}/`,
        sourceUrl: `${REPO}/tree/main/${type.dir}/${slug}`,
        skillFileUrl: skill ? `${RAW}/${type.dir}/${slug}/SKILL.md` : "",
        issueUrl: `${REPO}/issues/new/choose`,
        install: type.install.replace("<slug>", slug),
      });
    }
  }
  return items.sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "") || a.name.localeCompare(b.name));
}

// ---------- page shell ----------

function layout({ title, description, rel, body, bodyClass = "" }) {
  const r = rel; // relative path prefix to site root: "" or "../../"
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="color-scheme" content="light dark">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<link rel="icon" href="${r}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap">
<link rel="stylesheet" href="${r}assets/style.css">
<script>document.documentElement.classList.add("js")</script>
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container header-row">
    <a class="brand" href="${r}index.html"><img class="brand-mark" src="${r}assets/favicon.svg" alt="" width="26" height="26">${esc(SITE.title)}</a>
    <nav class="nav" aria-label="Site">
      <a href="${r}index.html#gallery"${bodyClass === "page-index" ? ' aria-current="page"' : ""}>Gallery</a>
      <a href="${r}index.html#getting-started">Getting started</a>
      <a href="${REPO}/blob/main/CONTRIBUTING.md">Contribute</a>
      <a class="nav-gh" href="${REPO}"><svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>GitHub</a>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="container">
    <p class="footer-title">${esc(SITE.title)}</p>
    <p class="footer-tag">Community work, not a Microsoft product. Provided as-is. Check the Microsoft Learn pages each skill cites before relying on it.</p>
    <nav class="footer-links" aria-label="Footer">
      <a href="${REPO}">GitHub</a>
      <a href="${REPO}/blob/main/CONTRIBUTING.md">Contribute</a>
      <a href="${r}catalog.json">Catalog JSON</a>
      <a href="${REPO}/issues/new/choose">Report an issue</a>
      <a href="${REPO}/blob/main/SECURITY.md">Security</a>
      <a href="${REPO}/blob/main/CODE_OF_CONDUCT.md">Code of conduct</a>
    </nav>
    <p class="footer-meta">Maintained by <a href="${SITE.author.github}">${esc(SITE.author.name)}</a> · <a href="${SITE.author.linkedin}">LinkedIn</a></p>
  </div>
</footer>
<script src="${r}assets/app.js" defer></script>
</body>
</html>
`;
}

// ---------- shared fragments ----------

const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const chips = (xs, cls = "") => xs.map((x) => `<li class="chip ${cls}" data-value="${slugify(x)}">${esc(x)}</li>`).join("");

function authorLine(item, rel = "") {
  const img = item.avatar ? `<img class="avatar" src="${item.avatar}" alt="" width="24" height="24" loading="lazy">` : `<span class="avatar avatar-text" aria-hidden="true">${esc(item.author[0] ?? "?")}</span>`;
  return `<span class="author">${img}<span>${esc(item.author)}</span></span>`;
}

function select(id, label, allLabel, values, counts) {
  const opts = values.map((v) => `<option value="${esc(v)}">${esc(v)} (${counts.get(v) ?? 0})</option>`).join("");
  return `<label class="control"><span class="visually-hidden">${esc(label)}</span><select id="${id}"><option value="">${esc(allLabel)}</option>${opts}</select></label>`;
}

// ---------- index ----------

function indexPage(items, catalog) {
  const count = (fn) => {
    const m = new Map();
    for (const it of items) for (const v of [].concat(fn(it))) if (v) m.set(v, (m.get(v) ?? 0) + 1);
    return m;
  };
  const byCategory = count((i) => i.category);
  const bySub = count((i) => i.subcategory);
  const byPlatform = count((i) => i.platforms);
  const sortedKeys = (m) => [...m.keys()].sort((a, b) => a.localeCompare(b));
  const categoryOrder = TYPES.map((t) => t.label).filter((l) => byCategory.has(l));

  const n = items.length;
  const typesPresent = TYPES.filter((t) => byCategory.has(t.label));

  const stats = [
    ...typesPresent.map((t) => plural(byCategory.get(t.label), t.singular)),
    plural(bySub.size, "sub-category").replace("sub-categorys", "sub-categories"),
    plural(byPlatform.size, "platform"),
  ];

  const pills = [
    ...typesPresent.map((t) => plural(byCategory.get(t.label), t.singular)),
    plural(bySub.size, "sub-category").replace("sub-categorys", "sub-categories"),
    plural(byPlatform.size, "platform"),
  ];

  const body = `
<section class="intro">
  <div class="container">
    <div class="intro-text">
      <p class="eyebrow">Open skills catalog</p>
      <h1>${esc(SITE.title)}</h1>
      <p class="subtitle">Agent skills you can copy into your own agent</p>
      <p class="lead">${esc(SITE.tagline)} Each one is a folder in the open <a href="${REPO}/blob/main/SKILL-SCHEMA.md">Agent Skills</a> format, so it runs in any host that supports&nbsp;it.</p>
      <ul class="count-pills intro-counts" aria-label="Catalog counts">${pills.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      <p class="intro-note"><svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/></svg><span>Skills that cover preview features state the documentation date they rely on. <a href="#getting-started">How to install a skill <span aria-hidden="true">→</span></a></span></p>
    </div>
  </div>
</section>


<section id="gallery" class="gallery">
  <div class="container">
    <h2 class="visually-hidden">Browse the skills</h2>

    <form class="toolbar" id="filters" role="search" aria-label="Filter skills" onsubmit="return false">
      <label class="search">
        <span class="visually-hidden">Search</span>
        <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/></svg>
        <input id="q" type="search" placeholder="Search skills" autocomplete="off">
      </label>
      ${select("category", "Category", "All categories", categoryOrder, byCategory)}
      ${select("subcategory", "Sub-category", "All sub-categories", sortedKeys(bySub), bySub)}
      ${select("platform", "Platform", "All platforms", sortedKeys(byPlatform), byPlatform)}
      <label class="control"><span class="visually-hidden">Sort</span><select id="sort"><option value="updated">Recently updated</option><option value="newest">Newest</option><option value="title">Title A–Z</option></select></label>
    </form>

    <div class="results-bar">
      <p class="count" id="count" aria-live="polite">Showing ${plural(n, "skill")}</p>
      <button type="button" id="clear" class="link">Clear filters</button>
    </div>

    <div id="grid" class="grid"></div>
    <div id="empty" class="empty" hidden>
      <p><strong>Nothing matches.</strong> Try a broader search or <button type="button" class="link" data-clear>clear the filters</button>.</p>
    </div>
    <noscript>
      <ul class="plain-list">${items.map((s) => `<li><a href="${s.url}">${esc(s.name)}</a> <span class="muted">· ${esc(s.category)} / ${esc(s.subcategory)}</span><br>${esc(s.description)}</li>`).join("")}</ul>
    </noscript>
  </div>
</section>

<section id="getting-started" class="getting-started">
  <div class="container gs-grid">
    <div class="gs-intro">
      <p class="eyebrow">Getting started</p>
      <h2>Install a skill</h2>
      <p>A skill is a folder: a <code>SKILL.md</code> with the instructions, plus any reference files it points to. Your agent host reads the folder; nothing needs building.</p>
      <p><a class="text-link" href="${REPO}/blob/main/CONTRIBUTING.md">Contribute a skill <span aria-hidden="true">→</span></a></p>
    </div>
    <ol class="gs-steps">
      <li><span class="gs-num">01</span><div><h3>Find a skill</h3><p>Search or filter the catalog above, then open its page to read what it does and what it relies on.</p></div></li>
      <li><span class="gs-num">02</span><div><h3>Copy the whole folder</h3><p>Not just <code>SKILL.md</code>; the agent needs the references too. <a href="${REPO}/blob/main/skills/README.md">Where each host expects it</a>.</p></div></li>
      <li><span class="gs-num">03</span><div><h3>Ask your agent</h3><p>Once installed, the host loads the skill when your request matches its description.</p></div></li>
    </ol>
  </div>
</section>

<script id="catalog" type="application/json">${JSON.stringify(catalog).replace(/</g, "\\u003c")}</script>
`;
  return layout({ title: `${SITE.title} · skills gallery`, description: SITE.tagline, rel: "", body, bodyClass: "page-index" });
}

// ---------- detail page ----------

function detailPage(s) {
  const rel = "../../";
  const readmeHtml = demote(rewriteLinks(marked.parse(stripFirstH1(s.readme)), s));
  const skillHtml = s.skillBody ? demote(rewriteLinks(marked.parse(stripFirstH1(s.skillBody)), s)) : "";
  const fileRows = s.files
    .map((f) => `<tr><td><a href="${REPO}/blob/main/${s.type}/${s.slug}/${f.path}">${esc(f.path)}</a></td><td class="num">${fmtSize(f.size)}</td></tr>`)
    .join("");

  const body = `
<div class="container">
<nav class="breadcrumb" aria-label="Breadcrumb"><a href="${rel}index.html">Gallery</a> <span aria-hidden="true">›</span> <a href="${rel}index.html?category=${encodeURIComponent(s.category)}#gallery">${esc(s.category)}</a> <span aria-hidden="true">›</span> <span aria-current="page">${esc(s.name)}</span></nav>

<article class="detail" style="--h:${s.hue}">
  <header class="detail-hero${s.hasPreview ? " has-preview" : ""}">
    <div class="detail-hero-text">
      <p class="eyebrow kicker"><a class="kicker-cat" href="${rel}index.html?category=${encodeURIComponent(s.category)}#gallery">${esc(s.category)}</a>${s.subcategory ? `<a class="kicker-sub" href="${rel}index.html?subcategory=${encodeURIComponent(s.subcategory)}#gallery">${esc(s.subcategory)}</a>` : ""}</p>
      <div class="detail-title"><img class="skill-icon skill-icon-lg" src="${s.icon}" alt="" width="56" height="56"><h1>${esc(s.name)}</h1></div>
      <p class="lead">${esc(s.description)}</p>
      <ul class="chips">${chips(s.platforms, "chip-platform")}</ul>
      <div class="actions">
        <a class="btn btn-primary" href="${s.sourceUrl}">View on GitHub</a>
        ${s.skillFileUrl ? `<a class="btn" href="${s.skillFileUrl}">Open SKILL.md</a>` : ""}
        <a class="btn btn-ghost" href="${s.issueUrl}">Report an issue</a>
      </div>
    </div>
    ${s.hasPreview ? `<a class="detail-art" href="assets/preview.png" title="Open the full-size image"><img src="assets/preview.png" alt="Example: ${esc(s.name)} answering a question in an agent chat" width="640" height="360"></a>` : ""}
  </header>

  <div class="detail-grid">
    <div class="detail-main">
      <div class="tabs" role="tablist" aria-label="Sections">
        <button role="tab" id="tab-overview" aria-controls="overview" aria-selected="true">Overview</button>
        ${skillHtml ? `<button role="tab" id="tab-instructions" aria-controls="instructions" aria-selected="false">Skill instructions</button>` : ""}
        <button role="tab" id="tab-files" aria-controls="files" aria-selected="false">Files <span class="tab-count">${s.files.length}</span></button>
      </div>

      <section id="overview" class="tab-panel prose" role="tabpanel" aria-labelledby="tab-overview">
        <h2 class="panel-title">Overview</h2>
        ${readmeHtml}
      </section>

      ${skillHtml ? `<section id="instructions" class="tab-panel prose" role="tabpanel" aria-labelledby="tab-instructions">
        <h2 class="panel-title">Skill instructions</h2>
        <div class="callout">
          <p class="callout-label">What triggers it</p>
          <p>${esc(s.agentDescription)}</p>
          <p class="muted small">This is the <code>description</code> in the <code>SKILL.md</code> frontmatter. An agent host matches it against the user's request to decide when to load the skill.</p>
        </div>
        <p class="muted small">Rendered from <a href="${REPO}/blob/main/${s.type}/${s.slug}/SKILL.md"><code>${esc(s.type)}/${esc(s.slug)}/SKILL.md</code></a>. The agent reads this file, not this page.</p>
        ${skillHtml}
      </section>` : ""}

      <section id="files" class="tab-panel" role="tabpanel" aria-labelledby="tab-files">
        <h2 class="panel-title">Files</h2>
        <p class="muted">Everything the agent loads. Copy the whole folder; <code>metadata.json</code>, <code>README.md</code> and the gallery preview image are for people and are not listed.</p>
        <table class="files"><thead><tr><th>Path</th><th class="num">Size</th></tr></thead><tbody>${fileRows}</tbody></table>
      </section>
    </div>

    <aside class="meta">
      <dl>
        <dt>Author</dt><dd>${authorLine(s)}<div class="meta-links">${s.authorGithub ? `<a href="https://github.com/${esc(s.authorGithub)}">@${esc(s.authorGithub)}</a>` : ""}${s.authorUrl && !/github\.com/i.test(s.authorUrl) ? ` · <a href="${esc(s.authorUrl)}">${/linkedin/i.test(s.authorUrl) ? "LinkedIn" : "Profile"}</a>` : ""}</div></dd>
        <dt>Category</dt><dd><span class="kicker"><a class="kicker-cat" href="${rel}index.html?category=${encodeURIComponent(s.category)}#gallery">${esc(s.category)}</a></span></dd>
        ${s.subcategory ? `<dt>Sub-category</dt><dd><span class="kicker"><a class="kicker-sub" href="${rel}index.html?subcategory=${encodeURIComponent(s.subcategory)}#gallery">${esc(s.subcategory)}</a></span></dd>` : ""}
        <dt>Platforms</dt><dd><ul class="chips">${chips(s.platforms, "chip-platform")}</ul></dd>
        <dt>Version</dt><dd>${esc(s.version)}</dd>
        <dt>Created</dt><dd><time datetime="${esc(s.createdAt)}">${esc(fmtDate(s.createdAt))}</time></dd>
        <dt>Updated</dt><dd><time datetime="${esc(s.updatedAt)}">${esc(fmtDate(s.updatedAt))}</time></dd>
        ${s.install ? `<dt>Install path</dt><dd><code>${esc(s.install)}</code></dd>` : ""}
        <dt>Tags</dt><dd><ul class="chips">${chips(s.tags, "chip-tag")}</ul></dd>
      </dl>
    </aside>
  </div>
</article>
</div>
`;
  return layout({ title: `${s.name} · ${SITE.title}`, description: s.description, rel, body, bodyClass: "page-detail" });
}

// ---------- build ----------

const items = readItems();
const catalog = items.map(({ readme, skillBody, files, ...rest }) => rest);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "assets"), { recursive: true });
cpSync(SRC, join(OUT, "assets"), { recursive: true });
writeFileSync(join(OUT, ".nojekyll"), "");
writeFileSync(join(OUT, "catalog.json"), JSON.stringify({ generatedAt: new Date().toISOString(), repository: REPO, categories: TYPES.filter((t) => items.some((i) => i.type === t.dir)).map((t) => ({ folder: t.dir, label: t.label })), items: catalog }, null, 2));
writeFileSync(join(OUT, "index.html"), indexPage(items, catalog));

for (const s of items) {
  const dir = join(OUT, s.type, s.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), detailPage(s));
  const assets = join(ROOT, s.type, s.slug, "assets");
  if (existsSync(assets)) cpSync(assets, join(dir, "assets"), { recursive: true });
}

const summary = TYPES.map((t) => [t, items.filter((i) => i.type === t.dir).length]).filter(([, n]) => n > 0).map(([t, n]) => plural(n, t.singular)).join(", ");
console.log(`Built ${summary || "0 items"} into site/dist`);
