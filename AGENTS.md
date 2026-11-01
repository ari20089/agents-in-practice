# Agents in Practice

A catalog of skills, prompts, agent instructions and Adaptive Cards for AI agents working with Microsoft 365, Copilot Studio and GitHub Copilot. This file is for coding agents operating inside this repository.

## Fresh information first

**Microsoft 365, Copilot Studio and Purview behaviour changes constantly, and much of what the items here describe is in preview.** Before editing a skill or agent instructions item that makes a claim about Microsoft behaviour:

1. Open the Microsoft Learn page the item cites and check its `ms.date`.
2. If the page changed, update the item's facts, the date it quotes, and its `metadata.json` `updatedAt`.
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

prompts/<slug>/
├── metadata.json   # catalog sidecar, human-facing
├── README.md       # human-facing overview, how to run it, sources
├── PROMPT.md       # pasted into chat as is (8,000 characters max, no frontmatter, self-contained)
└── assets/         # optional, human-facing

agent-instructions/<slug>/
├── metadata.json   # catalog sidecar, human-facing
├── README.md       # human-facing overview and setup per tool
├── INSTRUCTIONS.md # pasted into the agent's Instructions field (8,000 characters max, no frontmatter)
├── knowledge/      # optional, uploaded as knowledge (reference data, not instructions)
└── assets/         # optional, human-facing

adaptive-cards/<slug>/
├── metadata.json   # catalog sidecar, human-facing
├── README.md       # human-facing overview, steps per host, bindings, what comes back, sources
├── card.json       # the card template, pasted as is (version 1.5 or earlier, plain ${...} bindings)
├── data.json       # sample values for every binding (made up)
└── assets/         # optional, human-facing
```

- `SKILL-SCHEMA.md` defines the required `SKILL.md` sections; `PROMPT-SCHEMA.md` defines the prompt shape and limits; `AGENT-INSTRUCTIONS-SCHEMA.md` defines the agent instructions shape and limits; `ADAPTIVE-CARD-SCHEMA.md` defines the Adaptive Card shape and limits.
- `CONTRIBUTING.md` defines the submission shape and CI checks.
- `scripts/validate-skills.mjs`, `scripts/validate-prompts.mjs`, `scripts/validate-agent-instructions.mjs` and `scripts/validate-adaptive-cards.mjs` are the validators; `npm test` runs all four.

## Working rules

- **One item per change.** Do not touch other items' folders while editing one.
- **Agent-facing vs human-facing.** Nothing that only a person needs (setup narrative, attribution, disclaimers) goes into `SKILL.md` or `references/`; it goes in the skill's `README.md`. Nothing that only the agent needs goes into `README.md`.
- **Keep `SKILL.md` under 500 lines.** Move long material to `references/` and link it.
- **Keep all behaviour in `INSTRUCTIONS.md`.** Knowledge files hold reference data only; Microsoft warns against moving instructions into knowledge to get around the 8,000-character limit.
- **Keep a card portable.** `card.json` stays at schema version 1.5 with plain `${...}` bindings, so it works in Teams, Copilot Studio and Power Automate; the card's `README.md` cites a page and date for every host difference it relies on.
- **Keep a prompt self-contained.** `PROMPT.md` states the Microsoft facts its checks rely on; the prompt's `README.md` cites a page and date for each one.
- **Match existing style.** Tables for matrices, numbered steps for procedures, fenced blocks for paste-ready text. Do not reformat text you were not asked to change.
- **No secrets or real identifiers.** No tenant names, user names, keys, customer data, even in examples.
- **Catalog table.** When adding or renaming an item, update its catalog table in `README.md` and the count above it.
- **Commits.** Plain commit messages describing the change. No attribution trailers.

## Validate before finishing

```bash
npm test
```

The build must pass with no errors before a pull request is opened.
