# Copilot instructions for agents-in-practice

This repo is a catalog of skills, prompts, agent instructions and Adaptive Cards. Contributors add one folder under `skills/<slug>/`, `prompts/<slug>/`, `agent-instructions/<slug>/` or `adaptive-cards/<slug>/`. Each has a `metadata.json` sidecar and a human-facing `README.md`, plus the agent-facing files for its type: `SKILL.md` with optional `references/`, `scripts/`, `assets/`; `PROMPT.md`; `INSTRUCTIONS.md` with optional `knowledge/`; or `card.json` and `data.json`. CI runs the four validators in `scripts/` (`npm test`). See [`CONTRIBUTING.md`](../CONTRIBUTING.md), [`AGENTS.md`](../AGENTS.md) and the schema for the item's type: [`SKILL-SCHEMA.md`](../SKILL-SCHEMA.md), [`PROMPT-SCHEMA.md`](../PROMPT-SCHEMA.md), [`AGENT-INSTRUCTIONS-SCHEMA.md`](../AGENT-INSTRUCTIONS-SCHEMA.md), [`ADAPTIVE-CARD-SCHEMA.md`](../ADAPTIVE-CARD-SCHEMA.md).

## Code review rules

When reviewing a pull request, check the following in addition to CI.

### The bar: block real problems, not style

Items are human-authored prose. Treat the author's wording, tone and formatting as theirs. **Only post a comment you could defend as "must fix before merge."** Prefer zero comments over a nit.

**Block-worthy, do raise:**

- A claim about Microsoft 365, Copilot Studio, Purview or GitHub Copilot behaviour with no Microsoft Learn citation, or one that contradicts the cited page.
- A preview feature described without its release state and the documentation date relied on.
- Human-facing prose (setup narrative, attribution, disclaimers) inside the agent-facing files (`SKILL.md`, `references/`, `PROMPT.md`, `INSTRUCTIONS.md`, `knowledge/`, `card.json`), or agent-only instructions inside `README.md`.
- Behaviour moved into `knowledge/` files of an agent instructions item to get around the 8,000-character limit on `INSTRUCTIONS.md`.
- Layout breaks: slug/`name` mismatch, missing required file, stray files in the item folder, `SKILL.md` over 500 lines, a skill description over 1024 characters or not on one line, `PROMPT.md` or `INSTRUCTIONS.md` over 8,000 characters, `card.json` above version 1.5 or using templating beyond plain `${...}` bindings.
- Scripts that download and execute remote code, write outside the working directory, or need elevated privileges without saying so in `README.md`.
- Secrets, tenant identifiers, personal or customer data, even in examples.
- A pull request that touches more than one item or mixes an item change with unrelated repo changes.
- Catalog table in the root `README.md` not updated for a new or renamed item, or its description not matching `metadata.json`.

**Not block-worthy, do not raise:**

- Writing style in the item's own text: wording, tone, grammar, heading style, punctuation.
- Suggestions to add sections the schema marks as recommended rather than required.
- Alternative ways to structure the same instructions.

### When the item cites Microsoft documentation

Open the cited page. If the page's date is newer than the date the item quotes, ask the author to re-verify rather than approving on trust. If you cannot open it, say so rather than guessing.
