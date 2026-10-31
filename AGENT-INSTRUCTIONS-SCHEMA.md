# Agent Instructions Schema Specification

This document defines the shape of an **agent instructions** item: the instructions that define an agent's role, plus any knowledge files the agent needs. A maker pastes the instructions into an agent built with Agent Builder in Microsoft 365 Copilot, Copilot Studio or the Microsoft 365 Agents Toolkit, and uploads the knowledge files.

| Concept | What it is | Where it runs |
| --- | --- | --- |
| **Prompt** | A single instruction the user types | Any Copilot chat |
| **Agent instructions** | The instructions and knowledge files that define an agent's role | Agent Builder, Copilot Studio, Microsoft 365 Agents Toolkit |
| **Skill** | A reusable instruction package that teaches an agent a multi-step task | Any Agent Skills host ([SKILL-SCHEMA.md](./SKILL-SCHEMA.md)) |

## File layout

```
agent-instructions/<slug>/
├── metadata.json     # catalog sidecar, human-facing
├── README.md         # human-facing overview and setup for each tool
├── INSTRUCTIONS.md   # required: the text pasted into the agent's Instructions field
├── knowledge/        # optional: files uploaded as the agent's knowledge
└── assets/           # optional: preview image and human-facing extras
```

## `INSTRUCTIONS.md` (required)

The file holds exactly what goes into the agent's **Instructions** field, with nothing added. No frontmatter and no human-facing notes, so a maker can copy the whole file.

| Rule | Limit | Source |
| --- | --- | --- |
| Length | 8,000 characters or less | Declarative agent schema: the instructions "must contain at least one nonwhitespace character and be 8,000 characters or less" |
| No frontmatter | The file must not start with `---` | This repository |
| All behaviour lives here | Steps, rules, output format and refusal behaviour | Microsoft: don't "offload declarative agent instructions in SharePoint documents (or any other knowledge source) to work around the 8,000-character instruction limit" |

Write it for the agent: second person, directive language, and Markdown headings and lists. Name each knowledge file the instructions depend on, and say what the agent should use it for.

## `knowledge/` (optional)

Files the maker uploads as knowledge sources. They hold **reference data the agent looks up**, not instructions: Microsoft says knowledge content "is subject to cross-prompt injection attacks (XPIA) classifiers", so directive-like text in it can be blocked or truncated.

| Rule | Limit | Source |
| --- | --- | --- |
| File types | `.txt`, `.pdf`, `.docx`, `.doc`, `.pptx`, `.ppt`, `.xlsx`, `.xls` | Accepted by Agent Builder and as declarative agent embedded knowledge. Copilot Studio also accepts `.md`, but Agent Builder doesn't, so use `.txt` for Markdown text. |
| Size | 1 MB or less per file | Declarative agent embedded knowledge limit. Agent Builder allows up to 512 MB for these types, so the manifest limit is the binding one |
| Count | 10 files or fewer | Declarative agent embedded knowledge limit |
| Content | No secrets, personal data, customer data or tenant identifiers | Everyone who can use an agent can get the content of its uploaded files |

## `README.md` (required)

The human-facing page. It must say what goes where:
- a table of the folder's files and where each one goes;
- the recommended agent settings (name, description, web search, actions, audience) and conversation starters;
- setup steps for each tool the instructions support.

Use the same sections as a skill README: Summary, Prerequisites, Limitations, Contributors, Version history, Help and Disclaimer.

## `metadata.json` (required)

The same fields as a skill's `metadata.json` (see [CONTRIBUTING.md](./CONTRIBUTING.md)). The category comes from the folder (`agent-instructions/` → **Agent instructions**).

## Validation

`node scripts/validate-agent-instructions.mjs` enforces the layout, the 8,000-character limit, the knowledge file types, sizes and count, the `metadata.json` schema and the catalog row. `npm test` runs it with the skill validator, and CI runs both on every pull request.

## Sources

- [Declarative agent schema 1.9 for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-manifest-1.9), 30 Sep 2026
- [Write effective instructions for declarative agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-instructions), 11 Aug 2026
- [Add knowledge sources to an agent in Agent Builder](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder-add-knowledge), 30 Sep 2026
- [Upload files as a knowledge source (Copilot Studio)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-add-file-upload), 29 Sep 2026
