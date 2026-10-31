# Skill Schema Specification

This document defines the schema and authoring guidelines for skills in this repository. A skill is a structured instruction file (`SKILL.md`) that teaches an AI agent how to perform a specific, repeatable task. The format follows the [Agent Skills specification](https://agentskills.io/specification); the section structure below is this repository's house style.

## What a skill is

A skill is a Markdown file with YAML frontmatter that an agent host reads at runtime. When a user's request matches the skill's `description`, the agent follows the instructions in the body: gathering inputs, working through steps, producing a defined output, and checking it against rules, without the user having to spell out every step.

| Concept | What it is | Where it runs |
| --- | --- | --- |
| **Prompt** | A single instruction the user types | Any Copilot chat |
| **Agent instructions** | A system prompt that defines an agent's role | Copilot Studio |
| **Skill** | A reusable instruction package that teaches an agent a multi-step task | GitHub Copilot, Copilot Studio, Microsoft 365 Copilot, any Agent Skills host |

## File layout

```
skills/<slug>/
├── SKILL.md          # required
├── references/       # optional, documents the body points the agent to
├── scripts/          # optional, executable helpers
└── assets/           # optional, templates and data files
```

Keep `SKILL.md` under **500 lines**. Long reference material belongs in `references/` with a link from the body, so the agent loads it only when needed.

## Frontmatter (required)

```
---
name: <slug>
description: <trigger-description>
---
```

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `name` | string | yes | Kebab-case slug, 1–64 characters, must equal the folder name |
| `description` | string | yes | One line, max 1024 characters. States **when** to invoke the skill and **when not to**. Include the phrases a user is likely to say. |

Write `description` on a single line; the validator does not parse folded YAML.

## Body structure

Sections marked **required** must be present; the rest are recommended.

### 1. Title (required)

`# <Skill Title>` in plain language.

### 2. Before Starting (required)

What the agent needs to know before it acts, and what to ask for if missing. Number each input, bold its name, state defaults.

```markdown
## Before Starting

Determine the following before proceeding. If the user has not supplied them, ask.

1. **Scope** — the site, process or file the task applies to
2. **Output** — report, checklist or runbook (defaults to report)
```

### 3. Output Structure (required)

The shape of what the skill produces: a section list, a template, a directory tree, or a table layout.

### 4. Steps (required)

Numbered `## Step N: <Action>` headings. Each step is discrete and verifiable. Reference other sections rather than repeating them.

### 5. Rules (required)

Non-negotiable constraints. Prefer **never** / **always** phrasing. Include what the skill must not invent or assume.

### 6. Examples (recommended)

At least one input → output pair showing expected quality and format.

### 7. References (recommended when `references/` exists)

Relative links to the documents the agent should read, with one line each on what they contain.

## Authoring guidance

- Write for the agent, not the reader of the catalog. Human-facing setup and marketing text belongs in the skill folder's `README.md`.
- Be specific about trigger phrases in `description`; vague descriptions cause the skill to fire on the wrong requests or not at all.
- State the release status (preview, GA) and the documentation date for any product behaviour the skill relies on, and tell the agent to re-verify if it has web access.
- Prefer tables for matrices and comparisons, numbered lists for procedures, fenced blocks for text the user will paste somewhere.
- Do not embed secrets, tenant names, user names or customer data, even as examples.

## Validation

`node scripts/validate-skills.mjs` enforces the frontmatter rules, the line limit, the `metadata.json` schema, the folder layout and the README `## Sources` section (present, with links, and the same links as any Sources list in `references/`). CI runs it on every pull request.
