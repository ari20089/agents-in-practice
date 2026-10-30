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

- **Index:** count, search box, category / platform / author filters, sort (recently updated, newest, title), card grid, a getting-started table, and a `<noscript>` list. Filter state is kept in the URL so views can be shared.
- **Skill page:** preview image or generated monogram, description, platform chips, View on GitHub / Open SKILL.md / Report an issue buttons, the README rendered as the overview, the agent-facing `description` quoted, the full `SKILL.md` in a collapsible section, and a sidebar with author, dates, version, tags, install path and file list.
- **catalog.json:** everything the index knows, for anyone who wants to consume the catalog programmatically.

## Adding a preview image

Drop `assets/preview.png` into the skill folder (16:9, at least 640×360). The build picks it up for the card and the skill page. Without one, a monogram is generated from the skill name.
