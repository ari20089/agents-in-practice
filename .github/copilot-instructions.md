# Copilot instructions for agents-in-practice

This repo is a catalog of reusable **Agent Skills**. Contributors add one folder under `skills/<slug>/` (a `metadata.json` sidecar, a human-facing `README.md`, and an unpacked skill: `SKILL.md` plus optional `references/`, `scripts/`, `assets/`). CI runs `scripts/validate-skills.mjs`. See [`CONTRIBUTING.md`](../CONTRIBUTING.md), [`SKILL-SCHEMA.md`](../SKILL-SCHEMA.md) and [`AGENTS.md`](../AGENTS.md).

## Code review rules

When reviewing a pull request, check the following in addition to CI.

### The bar: block real problems, not style

Skills are human-authored prose. Treat the author's wording, tone and formatting as theirs. **Only post a comment you could defend as "must fix before merge."** Prefer zero comments over a nit.

**Block-worthy, do raise:**

- A claim about Microsoft 365, Copilot Studio, Purview or GitHub Copilot behaviour with no Microsoft Learn citation, or one that contradicts the cited page.
- A preview feature described without its release state and the documentation date relied on.
- Human-facing prose (setup narrative, attribution, disclaimers) inside `SKILL.md` or `references/`, or agent-only instructions inside `README.md`.
- Layout breaks: slug/`name` mismatch, missing required file, stray files in the skill folder, `SKILL.md` over 500 lines, description over 1024 characters or not on one line.
- Scripts that download and execute remote code, write outside the working directory, or need elevated privileges without saying so in `README.md`.
- Secrets, tenant identifiers, personal or customer data, even in examples.
- A pull request that touches more than one skill or mixes a skill change with unrelated repo changes.
- Catalog table in the root `README.md` not updated for a new or renamed skill.

**Not block-worthy, do not raise:**

- Writing style in the skill's own text: wording, tone, grammar, heading style, punctuation.
- Suggestions to add sections the schema marks as recommended rather than required.
- Alternative ways to structure the same instructions.

### When the skill cites Microsoft documentation

Open the cited page. If the page's date is newer than the date the skill quotes, ask the author to re-verify rather than approving on trust. If you cannot open it, say so rather than guessing.
