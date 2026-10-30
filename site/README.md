# Gallery site

The gallery at https://ari20089.github.io/agents-in-practice/ is generated from the skill folders. Nothing in it is written by hand: each card and detail page comes from `skills/<slug>/metadata.json`, `README.md` and `SKILL.md`.

```
site/
├── build.mjs    # reads skills/, writes site/dist (index, one page per skill, catalog.json)
├── serve.mjs    # tiny static server for local preview
└── src/         # style.css, app.js (search/filter/sort), favicon.svg — copied to dist/assets
```

## Build and preview locally

```bash
npm ci
npm run site:build     # → site/dist
npm run site:serve     # http://localhost:4321/
```

`site/dist` is ignored by git. The only dependency is `marked`, for rendering the Markdown.

## How it deploys

`.github/workflows/deploy-site.yml` builds on every push to `main` that touches `skills/`, `site/` or the package files, and publishes `site/dist` to GitHub Pages. Pull requests run the build too (the **Build site** check) so a broken page never reaches `main`.

## What each page shows

- **Index:** a hero with a skill-folder illustration and a works-with line, then a catalog header with per-category count pills, a toolbar (search, category, sub-category, platform, contributor and sort dropdowns, each option with its count), a "Showing N" line with Clear filters, the card grid, an empty state, a getting-started section and a `<noscript>` list. Filter state is kept in the URL so views can be shared.
- **Skill page:** preview image or generated monogram, description, platform chips, View on GitHub / Open SKILL.md / Report an issue buttons, then three tabs: **Overview** (the README), **Skill instructions** (the agent-facing `description` and the full `SKILL.md`) and **Files** (what the agent loads, with sizes). The sidebar shows author, category, sub-category, platforms, version, dates, install path and tags. Without JavaScript the tabs render stacked.
- **catalog.json:** everything the index knows, for anyone who wants to consume the catalog programmatically.

## Category and sub-category

The **category** is not a metadata field. It is the top-level folder an item lives in, mapped by the `TYPES` table at the top of `build.mjs`: `skills/` → **Skills**. Folders listed there but absent from the repository are skipped, so `prompts/` or `agent-instructions/` can be added later by creating the folder and, if its items need different handling, extending the table.

The **sub-category** comes from `subcategory` in each item's `metadata.json` (for example `Governance & compliance`) and is free text; the sub-category dropdown lists whatever values exist.

## Adding a preview image

Drop `assets/preview.png` into the skill folder (16:9, at least 640×360). The build picks it up for the card and the skill page. Without one, a monogram is generated from the skill name.
