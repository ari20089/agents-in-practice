# Prompt Schema Specification

This document defines the shape of a **prompt** item: one self-contained instruction a person pastes into a Copilot chat to get a focused result, such as a review of the open repository. No setup in the agent is needed; the prompt carries everything it relies on.

| Concept | What it is | Where it runs |
| --- | --- | --- |
| **Prompt** | A single instruction the user pastes or runs | Any Copilot chat; in VS Code, also as a prompt file |
| **Agent instructions** | The instructions and knowledge files that define an agent's role | Agent Builder, Copilot Studio, Microsoft 365 Agents Toolkit ([AGENT-INSTRUCTIONS-SCHEMA.md](./AGENT-INSTRUCTIONS-SCHEMA.md)) |
| **Skill** | A reusable instruction package that teaches an agent a multi-step task | Any Agent Skills host ([SKILL-SCHEMA.md](./SKILL-SCHEMA.md)) |

## File layout

```
prompts/<slug>/
├── metadata.json   # catalog sidecar, human-facing
├── README.md       # human-facing overview and how to run it in each tool
├── PROMPT.md       # required: the text pasted into chat
└── assets/         # optional: preview image and human-facing extras
```

## `PROMPT.md` (required)

The file holds exactly what the user pastes, with nothing added, so the whole file can be copied.

| Rule | Limit | Why |
| --- | --- | --- |
| Length | 8,000 characters or less | This repository's limit, the same as agent instructions, so a prompt can later become an agent's instructions without a rewrite |
| No frontmatter | The file must not start with `---` | It is pasted into chat as is. The README gives the header for saving it as a VS Code prompt file |
| Self-contained | No knowledge files, no links the agent must open | The person running it has added nothing to the agent |
| Inputs | Mark anything the user fills in as `<placeholder>`, and list each one in the README | A prompt sent with an unfilled value should fail visibly |

Write it in the voice of the person asking: what to look at, the checks to run, the output format, and the rules for evidence. State any Microsoft behaviour the checks depend on in the prompt itself, because the agent may not have current documentation, and cite each fact in the README.

## Running a prompt as a VS Code prompt file

In VS Code, a prompt can also be saved as `.github/prompts/<slug>.prompt.md` and run by typing `/<slug>` in chat. A prompt file's YAML header is optional and can set `description`, `agent` (`ask`, `agent`, `plan` or a custom agent), `model` and `tools`. Prompt files run only in Local harness sessions in the Chat view, so pasting stays the way that works everywhere.

The item's README gives the header to add; `PROMPT.md` itself stays header-free. Set `description` and `agent` only. Leave out `tools`, so the prompt gets the selected agent's tools: user-defined tool sets are deprecated, and Local tool IDs don't carry over to the Copilot harness.

## `README.md` (required)

The human-facing page. It must say:
- what the prompt checks or produces, and what it doesn't;
- how to run it in each tool it supports, including the prompt file header for VS Code;
- each `<placeholder>`, if there are any;
- the Microsoft Learn pages behind every claim the prompt makes, with their dates.

Use the same sections as a skill README: Summary, Prerequisites, Limitations, Sources, Contributors, Version history, Help and Disclaimer.

## `metadata.json` (required)

The same fields as a skill's `metadata.json` (see [CONTRIBUTING.md](./CONTRIBUTING.md)). The category comes from the folder (`prompts/` → **Prompts**).

## Validation

`node scripts/validate-prompts.mjs` enforces the layout, the 8,000-character limit, the frontmatter rule, the `metadata.json` schema, README links, the README `## Sources` section and the catalog row. `npm test` runs it with the other validators, and CI runs all of them on every pull request.

## Sources

- [Use prompt files in VS Code](https://code.visualstudio.com/docs/copilot/customization/prompt-files), updated 28 Oct 2026
- [Migrate customizations: replace tool sets](https://code.visualstudio.com/docs/agent-customization/migrate-customizations#_replace-tool-sets), updated 28 Oct 2026
