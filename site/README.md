# Gallery site

The gallery at https://ari20089.github.io/agents-in-practice/ is generated from the item folders. Nothing in it is written by hand: each card and detail page comes from `skills/<slug>/` (`metadata.json`, `README.md`, `SKILL.md`), `prompts/<slug>/` (`metadata.json`, `README.md`, `PROMPT.md`) or `agent-instructions/<slug>/` (`metadata.json`, `README.md`, `INSTRUCTIONS.md`).

```
site/
├── build.mjs    # reads skills/, writes site/dist (index, one page per skill, catalog.json)
├── serve.mjs    # tiny static server for local preview
└── src/         # style.css, app.js (search/filter/sort), favicon.svg, deco-*.svg — copied to dist/assets
```

## Build and preview locally

```bash
npm ci
npm run site:build     # → site/dist
npm run site:serve     # http://localhost:4321/
```

`site/dist` is ignored by git. The only dependency is `marked`, for rendering the Markdown.

## How it deploys

`.github/workflows/deploy-site.yml` builds on every push to `main` that touches `skills/`, `prompts/`, `agent-instructions/`, `site/` or the package files, and publishes `site/dist` to GitHub Pages. Pull requests run the build too (the **Build site** check) so a broken page never reaches `main`.

## What each page shows

- **Index:** a typographic intro (title, subtitle, description) on a deep navy band, shared with the skill page header; a toolbar that overlaps the band's bottom edge (search, category, sub-category, platform and sort, each option with its count), a "Showing N" line with Clear filters, decorative glass-tile artwork beside the grid on wide screens (`src/deco-left.svg`, `src/deco-right.svg`, original SVG), cards with a cover image, a type pill in its top-right corner (one colour per type: pink for skills, orange for prompts, violet for agent instructions; the item page kicker uses the same colour), a sub-category tile (each sub-category has its own colour, assigned in the order it first appeared so existing colours never change), date, title, description, author and a Details link, a Getting started section with three numbered steps, and a `<noscript>` list. Filter state is kept in the URL so views can be shared. Headings use Plus Jakarta Sans from Google Fonts; everything else uses system fonts.
- **Skill page:** a deep navy header band holding the breadcrumb, category and sub-category pills, the skill's name, `assets/preview.png` on the right if the skill ships one, description, an author byline, tags (each opens the gallery searched for that tag), View on GitHub / Open SKILL.md / Report an issue buttons, then three tabs: **Overview** (the README), **Skill instructions** (the agent-facing `description` and the full `SKILL.md`) and **Files** (what the agent loads, with sizes). An agent instructions page has the same layout, with Open INSTRUCTIONS.md and an **Instructions** tab instead: the character count against the 8,000 limit, a **Copy instructions** button, and the text exactly as it is pasted. A prompt page works the same way, with Open PROMPT.md, a **Prompt** tab and a **Copy prompt** button. The sidebar shows the platforms it works with, an **Add this skill** box whose download (`<slug>.zip`, the files the agent loads inside a `<slug>/` folder, built by `build.mjs`) unlocks once the reader ticks "Add only what you trust", the version and dates, and an as-is note linking to SUPPORT.md. Without JavaScript the tabs render stacked and the download works without the tick.
- **catalog.json:** everything the index knows, for anyone who wants to consume the catalog programmatically.
- **Page views:** every page loads GoatCounter's `count.js`, which reports views to https://ari20089.goatcounter.com. The script tag is in `layout()` in `build.mjs`.

## Category and sub-category

The **category** is not a metadata field. It is the top-level folder an item lives in, mapped by the `TYPES` table at the top of `build.mjs`: `skills/` → **Skills**. `prompts/` → **Prompts** and `agent-instructions/` → **Agent instructions** follow the same way. Folders listed there but absent from the repository are skipped, so a new type can be added by creating the folder and, if its items need different handling, extending the table.

The **sub-category** comes from `subcategory` in each item's `metadata.json` (for example `Governance & compliance`) and is free text; the sub-category dropdown lists whatever values exist.

## Adding a preview image

Drop `assets/preview.png` into the skill folder (16:9, at least 640×360), for example a screenshot of the skill in use. The build uses it as the card cover and shows it on the skill page. Without one, the cover is generated: an editor window showing the skill's `SKILL.md` frontmatter, or the opening of an agent instructions item's `INSTRUCTIONS.md` or a prompt's `PROMPT.md`.
