#!/usr/bin/env node
// Builds the static gallery into site/dist from skills/*/{metadata.json,README.md,SKILL.md}.
// One dependency (marked) for Markdown. Run from the repo root: npm run site:build

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = join(ROOT, "skills");
const SRC = join(ROOT, "site", "src");
const OUT = join(ROOT, "site", "dist");

const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const REPO = pkg.repository.url.replace(/\.git$/, "");
const [OWNER, REPO_NAME] = REPO.split("/").slice(-2);
const RAW = `https://raw.githubusercontent.com/${OWNER}/${REPO_NAME}/main`;
const SITE = {
  title: "Agents in Practice",
  tagline: "Skills for AI agents in Microsoft 365, Copilot Studio and GitHub Copilot",
  author: { name: "Arindam Choudhury", github: "https://github.com/ari20089", linkedin: "https://www.linkedin.com/in/arindam-choudhury/" },
};

marked.setOptions({ gfm: true });

// ---------- helpers ----------

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

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
    else out.push(rel);
  }
  return out;
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

// Deterministic colour from the slug, for the placeholder card art.
function hue(slug) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

function monogram(slug, name) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  const h = hue(slug);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h},55%,45%)"/><stop offset="1" stop-color="hsl(${(h + 40) % 360},60%,30%)"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><text x="320" y="200" font-family="system-ui,Segoe UI,sans-serif" font-size="120" font-weight="700" fill="rgba(255,255,255,.92)" text-anchor="middle">${esc(initials)}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Rewrite links in rendered Markdown so relative paths point at GitHub, and keep
// images relative (the skill's assets/ folder is copied next to the page).
function rewriteLinks(html, slug) {
  const base = `skills/${slug}`;
  const resolve = (href) => posix.normalize(posix.join(base, href));
  html = html.replace(/href="([^"]+)"/g, (m, href) => {
    if (/^(https?:|mailto:|#|\/)/i.test(href)) return m;
    const target = resolve(href.replace(/^\.\//, ""));
    return `href="${REPO}/blob/main/${target}"`;
  });
  html = html.replace(/src="([^"]+)"/g, (m, src) => {
    if (/^(https?:|data:|\/)/i.test(src)) return m;
    const clean = src.replace(/^\.\//, "");
    if (clean.startsWith("assets/")) return `src="${clean}"`;
    return `src="${RAW}/${resolve(clean)}"`;
  });
  return html;
}

function stripFirstH1(md) {
  return md.replace(/^\s*#\s+[^\n]+\n/, "");
}

// The page owns <h1> and the section <h2>s; push rendered Markdown headings down one level.
function demote(html) {
  return html.replace(/<(\/?)h([1-5])\b/g, (m, slash, n) => `<${slash}h${Number(n) + 1}`);
}

// ---------- read skills ----------

function readSkills() {
  return readdirSync(SKILLS_DIR)
    .filter((n) => !n.startsWith("_") && statSync(join(SKILLS_DIR, n)).isDirectory())
    .map((slug) => {
      const dir = join(SKILLS_DIR, slug);
      const meta = JSON.parse(readFileSync(join(dir, "metadata.json"), "utf8"));
      const readme = readFileSync(join(dir, "README.md"), "utf8");
      const skill = frontmatter(readFileSync(join(dir, "SKILL.md"), "utf8"));
      const files = listFiles(dir).filter((f) => f !== "metadata.json" && f !== "README.md");
      const hasPreview = existsSync(join(dir, "assets", "preview.png"));
      return {
        slug,
        ...meta,
        platforms: meta.platforms ?? [],
        tags: meta.tags ?? [],
        agentDescription: skill.fields.description ?? "",
        skillBody: skill.body,
        readme,
        files,
        image: hasPreview ? `skills/${slug}/assets/preview.png` : monogram(slug, meta.name),
        hasPreview,
        url: `skills/${slug}/`,
        sourceUrl: `${REPO}/tree/main/skills/${slug}`,
        skillFileUrl: `${RAW}/skills/${slug}/SKILL.md`,
        issueUrl: `${REPO}/issues/new/choose`,
      };
    })
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "") || a.name.localeCompare(b.name));
}

// ---------- page shell ----------

function layout({ title, description, rel, body, extraHead = "" }) {
  const r = rel; // relative path prefix to site root, "" or "../../"
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="${r}assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${r}assets/style.css">
${extraHead}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container header-row">
    <a class="brand" href="${r}index.html"><span class="brand-mark" aria-hidden="true"></span>${esc(SITE.title)}</a>
    <nav class="nav" aria-label="Site">
      <a href="${r}index.html#gallery">Gallery</a>
      <a href="${r}index.html#getting-started">Getting started</a>
      <a href="${REPO}/blob/main/CONTRIBUTING.md">Contributing</a>
      <a href="${REPO}">GitHub</a>
    </nav>
  </div>
</header>
<main id="main" class="container">
${body}
</main>
<footer class="site-footer">
  <div class="container footer-row">
    <div>
      <strong>${esc(SITE.title)}</strong> · built by <a href="${SITE.author.github}">${esc(SITE.author.name)}</a> (<a href="${SITE.author.linkedin}">LinkedIn</a>)
      <div class="muted">Community work, not a Microsoft product. Provided as-is. Check the Microsoft Learn pages each skill cites before relying on it.</div>
    </div>
    <nav aria-label="Footer">
      <a href="${r}catalog.json">Catalog JSON</a>
      <a href="${REPO}/issues/new/choose">Report an issue</a>
      <a href="${REPO}/blob/main/SECURITY.md">Security</a>
      <a href="${REPO}/blob/main/CODE_OF_CONDUCT.md">Code of conduct</a>
    </nav>
  </div>
</footer>
</body>
</html>
`;
}

// ---------- index ----------

function indexPage(skills, catalog) {
  const categories = [...new Set(skills.map((s) => s.category))].sort();
  const platforms = [...new Set(skills.flatMap((s) => s.platforms))].sort();
  const authors = [...new Set(skills.map((s) => s.author))].sort();
  const opts = (xs) => xs.map((x) => `<option value="${esc(x)}">${esc(x)}</option>`).join("");
  const n = skills.length;

  const body = `
<section class="hero">
  <h1>${esc(SITE.title)}</h1>
  <p class="lead">${esc(SITE.tagline)}. Each skill is a folder with a <code>SKILL.md</code> and the reference material it needs, following the <a href="https://agentskills.io/specification">Agent Skills</a> layout.</p>
  <p class="muted"><strong>${n} skill${n === 1 ? "" : "s"}</strong> · community work, not a Microsoft product · several cover preview features that change without notice</p>
</section>

<section id="gallery" class="gallery">
  <h2>Explore skills</h2>
  <form class="toolbar" role="search" aria-label="Filter skills" onsubmit="return false">
    <label class="search"><span class="visually-hidden">Search skills</span><input id="q" type="search" placeholder="Search skills…" autocomplete="off"></label>
    <label>Category <select id="category"><option value="">All</option>${opts(categories)}</select></label>
    <label>Platform <select id="platform"><option value="">All</option>${opts(platforms)}</select></label>
    <label>Author <select id="author"><option value="">All</option>${opts(authors)}</select></label>
    <label>Sort <select id="sort"><option value="updated">Recently updated</option><option value="newest">Newest</option><option value="title">Title</option></select></label>
    <button type="button" id="clear" class="btn btn-ghost">Clear filters</button>
  </form>
  <p class="muted" id="count" aria-live="polite">Showing ${n} skill${n === 1 ? "" : "s"}</p>
  <div id="grid" class="grid"></div>
  <div id="empty" class="empty" hidden>
    <p>No skills match. Try a broader search or <button type="button" class="link" data-clear>clear the filters</button>.</p>
  </div>
  <noscript>
    <ul>${skills.map((s) => `<li><a href="${s.url}">${esc(s.name)}</a> — ${esc(s.description)}</li>`).join("")}</ul>
  </noscript>
</section>

<section id="getting-started" class="getting-started">
  <h2>Getting started</h2>
  <p>Copy the whole skill folder, not just <code>SKILL.md</code>; the agent needs the <code>references/</code> folder the instructions point to. The host discovers the skill by the <code>name</code> field in its frontmatter.</p>
  <table>
    <thead><tr><th>Host</th><th>Where to put it</th></tr></thead>
    <tbody>
      <tr><td>GitHub Copilot (VS Code, CLI)</td><td><code>.github/skills/&lt;slug&gt;/</code> in your repository</td></tr>
      <tr><td>Copilot Studio (GitHub Copilot harness)</td><td>Add as a skill to the agent, per the Copilot Studio documentation</td></tr>
      <tr><td>Microsoft 365 Copilot / Copilot in SharePoint</td><td>Upload the folder to the site's <strong>Agent Assets</strong> library, <strong>Skills</strong> folder</td></tr>
      <tr><td>Any other Agent Skills host</td><td>Per the host's documentation; the layout is the standard one</td></tr>
    </tbody>
  </table>
  <p>Use skills selectively. Loading many at once dilutes the agent's attention. Want to add one? Read the <a href="${REPO}/blob/main/CONTRIBUTING.md">contribution guide</a>; CI validates the folder and a code owner reviews it.</p>
</section>

<script id="catalog" type="application/json">${JSON.stringify(catalog).replace(/</g, "\\u003c")}</script>
<script src="assets/app.js" defer></script>
`;
  return layout({ title: `${SITE.title} · skills gallery`, description: SITE.tagline, rel: "", body });
}

// ---------- detail page ----------

function detailPage(s) {
  const rel = "../../";
  const readmeHtml = demote(rewriteLinks(marked.parse(stripFirstH1(s.readme)), s.slug));
  const skillHtml = demote(rewriteLinks(marked.parse(stripFirstH1(s.skillBody)), s.slug));
  const fileList = s.files
    .map((f) => `<li><a href="${REPO}/blob/main/skills/${s.slug}/${f}">${esc(f)}</a></li>`)
    .join("");
  const chips = (xs, cls) => xs.map((x) => `<span class="chip ${cls}">${esc(x)}</span>`).join("");

  const body = `
<nav class="breadcrumb" aria-label="Breadcrumb"><a href="${rel}index.html">Gallery</a> <span aria-hidden="true">/</span> <span>${esc(s.name)}</span></nav>

<article class="detail">
  <header class="detail-header">
    <div class="detail-art"><img src="${s.hasPreview ? "assets/preview.png" : s.image}" alt="" width="640" height="360"></div>
    <div>
      <p class="eyebrow">${esc(s.category)} · v${esc(s.version ?? "1.0")} · updated ${esc(fmtDate(s.updatedAt))}</p>
      <h1>${esc(s.name)}</h1>
      <p class="lead">${esc(s.description)}</p>
      <p class="chips">${chips(s.platforms, "chip-platform")}</p>
      <p class="actions">
        <a class="btn btn-primary" href="${s.sourceUrl}">View on GitHub</a>
        <a class="btn" href="${s.skillFileUrl}">Open SKILL.md</a>
        <a class="btn btn-ghost" href="${s.issueUrl}">Report an issue</a>
      </p>
    </div>
  </header>

  <div class="detail-grid">
    <div class="prose">
      <h2 id="overview">Overview</h2>
      ${readmeHtml}

      <h2 id="agent-description">What triggers it</h2>
      <p class="muted">The <code>description</code> an agent host matches against the user's request:</p>
      <blockquote>${esc(s.agentDescription)}</blockquote>

      <details class="skill-source">
        <summary><h2 id="instructions">Skill instructions (SKILL.md)</h2></summary>
        <div class="prose-inner">${skillHtml}</div>
      </details>
    </div>

    <aside class="meta">
      <dl>
        <dt>Author</dt><dd>${s.authorUrl ? `<a href="${esc(s.authorUrl)}">${esc(s.author)}</a>` : esc(s.author)}${s.authorGithub ? ` · <a href="https://github.com/${esc(s.authorGithub)}">@${esc(s.authorGithub)}</a>` : ""}</dd>
        <dt>Category</dt><dd>${esc(s.category)}</dd>
        <dt>Platforms</dt><dd>${esc(s.platforms.join(", "))}</dd>
        <dt>Version</dt><dd>${esc(s.version ?? "1.0")}</dd>
        <dt>Created</dt><dd>${esc(fmtDate(s.createdAt))}</dd>
        <dt>Updated</dt><dd>${esc(fmtDate(s.updatedAt))}</dd>
        <dt>Tags</dt><dd class="chips">${chips(s.tags, "chip-tag")}</dd>
        <dt>Install</dt><dd><code>skills/${esc(s.slug)}/</code> → your host's skills folder</dd>
        <dt>Files</dt><dd><ul class="files">${fileList}</ul></dd>
      </dl>
    </aside>
  </div>
</article>
`;
  return layout({ title: `${s.name} · ${SITE.title}`, description: s.description, rel, body });
}

// ---------- build ----------

const skills = readSkills();
const catalog = skills.map(({ readme, skillBody, files, ...rest }) => rest);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "assets"), { recursive: true });
cpSync(SRC, join(OUT, "assets"), { recursive: true });
writeFileSync(join(OUT, ".nojekyll"), "");
writeFileSync(join(OUT, "catalog.json"), JSON.stringify({ generatedAt: new Date().toISOString(), repository: REPO, skills: catalog }, null, 2));
writeFileSync(join(OUT, "index.html"), indexPage(skills, catalog));

for (const s of skills) {
  const dir = join(OUT, "skills", s.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), detailPage(s));
  const assets = join(SKILLS_DIR, s.slug, "assets");
  if (existsSync(assets)) cpSync(assets, join(dir, "assets"), { recursive: true });
}

console.log(`Built ${skills.length} skill page(s) into site/dist`);
