# Agents in Practice

A catalog of skills for AI agents working with Microsoft 365, Copilot Studio and GitHub Copilot. This file is for coding agents operating inside this repository.

## Fresh information first

**Microsoft 365, Copilot Studio and Purview behaviour changes constantly, and much of what the skills here describe is in preview.** Before editing a skill that makes a claim about Microsoft behaviour:

1. Open the Microsoft Learn page the skill cites and check its `ms.date`.
2. If the page changed, update the skill's facts, the date it quotes, and its `metadata.json` `updatedAt`.
3. Never add a claim about Microsoft behaviour from memory. Cite a page or mark it "not documented as of <date>".

## Repository shape

```
skills/<slug>/
├── metadata.json   # catalog sidecar, human-facing
├── README.md       # human-facing overview
├── SKILL.md        # agent-facing instructions (frontmatter name == slug)
├── references/     # optional, agent-facing
├── scripts/        # optional, agent-facing
└── assets/         # optional, agent-facing
```

- `SKILL-SCHEMA.md` defines the required `SKILL.md` sections.
- `CONTRIBUTING.md` defines the submission shape and CI checks.
- `scripts/validate-skills.mjs` is the validator; run it after any change under `skills/`.

## Working rules

- **One skill per change.** Do not touch other skills' folders while editing one.
- **Agent-facing vs human-facing.** Nothing that only a person needs (setup narrative, attribution, disclaimers) goes into `SKILL.md` or `references/`; it goes in the skill's `README.md`. Nothing that only the agent needs goes into `README.md`.
- **Keep `SKILL.md` under 500 lines.** Move long material to `references/` and link it.
- **Match existing style.** Tables for matrices, numbered steps for procedures, fenced blocks for paste-ready text. Do not reformat text you were not asked to change.
- **No secrets or real identifiers.** No tenant names, user names, keys, customer data, even in examples.
- **Catalog table.** When adding or renaming a skill, update the table in `README.md` and the count above it.
- **Commits.** Plain commit messages describing the change. No attribution trailers.

## Validate before finishing

```bash
node scripts/validate-skills.mjs
```

The build must pass with no errors before a pull request is opened.
