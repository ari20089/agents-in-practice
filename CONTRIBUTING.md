# Contributing a skill

Thanks for helping grow **Agents in Practice**. A *skill* is a reusable instruction set for an AI agent, published here as an unpacked folder with optional `references/`, `scripts/` and `assets/`.

You contribute by adding **one folder under [`skills/`](./skills/)** and opening a pull request. CI validates the folder; nothing else is generated or edited by hand.

> [!NOTE]
> This is a volunteer-maintained community project, not a Microsoft product. Reviews and assistance are best-effort. See [SUPPORT.md](./SUPPORT.md).

## Before you start

- Search the catalog in [README.md](./README.md), open issues and pull requests to avoid duplicating a skill.
- For a significant new direction, open a skill request issue before investing in the full contribution.
- Contribute only content you have the right to publish. Remove secrets, personal data, customer data, tenant identifiers and confidential content.
- Keep one skill or one logical change per pull request. CI rejects pull requests that touch more than one skill folder.
- Follow the [Code of Conduct](./CODE_OF_CONDUCT.md).
- By opening a pull request you confirm that you wrote the content or have the right to contribute it, and that it may be published in this repository and modified by its maintainers.

## How a contribution flows

1. Fork the repository and create a branch (`skill/<slug>` for a new skill, `fix/<slug>-<what>` for a change).
2. Make the change, run `npm test` (or `node scripts/validate-skills.mjs`), and commit.
3. Open a pull request against `main`. The template asks what changed, how you verified it, and whether the catalog table was updated.
4. CI runs the validator and checks that the PR touches one skill at most. Fix anything it reports; pushes to the branch re-run it.
5. A code owner is requested for review automatically. Reviews check the things CI cannot: whether claims about Microsoft behaviour are cited and current, whether agent-facing and human-facing text are in the right files, and whether the skill does what its description says. Style is not reviewed.
6. Once CI is green and a code owner approves, the maintainer squash-merges. The PR title becomes the commit message, so write it as a one-line summary.

Direct pushes to `main` are disabled for everyone, including the maintainer; every change goes through a pull request. The maintainer's own PRs still run CI but merge without a second reviewer, since GitHub does not allow self-approval. See [docs/maintaining.md](./docs/maintaining.md) for the repository settings behind this.

## The submission shape

```
skills/<slug>/
├── metadata.json     # catalog sidecar for people and tooling — never read by the agent
├── README.md         # human-facing overview, setup, usage, limitations — never read by the agent
└── the skill itself (agent-facing, shipped verbatim):
    ├── SKILL.md      # frontmatter (name + agent description) + instructions
    ├── references/   # optional docs the agent reads on demand
    ├── scripts/      # optional executable helpers
    └── assets/       # optional templates, data files, preview image
```

The gallery at https://ari20089.github.io/agents-in-practice/ is generated from these files. `metadata.json` feeds the card, `README.md` becomes the overview on the skill's page, and `assets/preview.png` (16:9, at least 640×360) becomes the card image; without one, a monogram is generated. Run `npm run site:dev` to preview your skill's page locally.

Copy [`skills/_template/`](./skills/_template/) to get started. The `<slug>` is the folder name: lowercase, hyphen-separated, no spaces or periods, matching the `name` in `SKILL.md`.

**Two kinds of files live side by side.** Everything agent-facing (`SKILL.md`, `references/`, `scripts/`, `assets/`) is what an agent host loads, so keep it free of human-only prose. The two human-facing files (`metadata.json`, `README.md`) are for people browsing the catalog and are never loaded by the agent. Do not leave other files (CHANGELOG, personal notes) in the folder; put that in the pull request description.

## Two descriptions, on purpose

| | Lives in | Who reads it |
| --- | --- | --- |
| **Agent description** | `SKILL.md` frontmatter `description` | the agent, to decide *when to invoke* the skill |
| **Catalog description** | `metadata.json` `description` | people browsing the catalog |

Write the agent description as a precise trigger ("Use when the user asks … Do not use for …"). Write the catalog description as a friendly one-liner.

## `SKILL.md`

Frontmatter `name` (slug, matching the folder) and agent-facing `description` on a single line, then the body. See [SKILL-SCHEMA.md](./SKILL-SCHEMA.md) for the required sections and limits.

```markdown
---
name: meeting-summarizer
description: Use when the user asks to summarize a meeting transcript, before drafting any reply. Do not use for live meetings.
---

# Meeting Summarizer
...
```

## `metadata.json`

| Field | Required | Notes |
| --- | --- | --- |
| `name` | yes | Display name shown in the catalog |
| `description` | yes | Catalog one-liner |
| `platforms` | yes | One or more of `GitHub Copilot`, `Copilot Studio`, `Microsoft 365 Copilot`, `Other` |
| `tags` | yes | Lowercase tags for search |
| `subcategory` | yes | Catalog section inside the category, for example `Governance & compliance`. The category itself is not a field: the gallery derives it from the top-level folder (`skills/` → **Skills**) |
| `author` | yes | Person or team who wrote the skill |
| `authorGithub` | no | GitHub login |
| `authorUrl` | no | Profile link (LinkedIn, blog, GitHub) |
| `version` | no | Semantic or simple version string |
| `createdAt` / `updatedAt` | no | `YYYY-MM-DD` |

## `README.md` (human-facing)

Every skill `README.md` must:

- explain the scenario, expected outcome, prerequisites, setup and usage;
- list trigger phrases;
- identify known limitations and product, licence or preview-status assumptions;
- link to the primary source (`SKILL.md`);
- include contributor attribution and version history;
- include the standard as-is disclaimer.

Use the exact uppercase filename `README.md`.

## What CI checks

Two jobs run on every pull request.

**Validate skills** (`scripts/validate-skills.mjs`) fails when:

- the folder name is not lowercase kebab-case;
- `SKILL.md`, `README.md` or `metadata.json` is missing;
- `SKILL.md` has no frontmatter, `name` does not match the folder, or `description` is missing or over 1024 characters;
- `SKILL.md` is missing one of the required sections `## Before Starting`, `## Output Structure`, `## Step 1`, `## Rules` (see [SKILL-SCHEMA.md](./SKILL-SCHEMA.md));
- `SKILL.md` exceeds 500 lines (move material to `references/`);
- `SKILL.md` or `README.md` links to a file that does not exist;
- `metadata.json` is invalid JSON, lacks a required field, names an unknown platform, or sets `category` (use `subcategory`);
- the folder contains stray top-level files beyond the allowed set;
- the root `README.md` catalog has no row linking to `skills/<slug>/`.

**One skill per PR** fails when the changed files span more than one `skills/<slug>/` folder.

Run the validator locally with `npm test`, or `node scripts/validate-skills.mjs <slug>` for a single skill.

## Pre-submission checklist

- [ ] Folder name and `SKILL.md` `name` match and are kebab-case
- [ ] `description` is one line, trigger-focused, with an out-of-scope clause
- [ ] `SKILL.md` follows [SKILL-SCHEMA.md](./SKILL-SCHEMA.md) and is under 500 lines
- [ ] `metadata.json` is complete and valid
- [ ] `README.md` has trigger phrases, prerequisites, limitations, attribution, version history and disclaimer
- [ ] Any Microsoft feature described is labelled with its release state (preview, GA) and the documentation date relied on
- [ ] Claims about Microsoft behaviour cite a Microsoft Learn page
- [ ] No tenant names, user names, keys or other secrets
- [ ] Root `README.md` catalog table updated
- [ ] `npm test` passes
