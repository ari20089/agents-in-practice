# Agents in Practice

[![Validate skills](https://img.shields.io/github/actions/workflow/status/ari20089/agents-in-practice/validate-skills.yml?branch=main&label=Validate%20skills)](https://github.com/ari20089/agents-in-practice/actions/workflows/validate-skills.yml)
[![Deploy site](https://img.shields.io/github/actions/workflow/status/ari20089/agents-in-practice/deploy-site.yml?branch=main&label=Gallery)](https://ari20089.github.io/agents-in-practice/)

**[Browse the gallery → ari20089.github.io/agents-in-practice](https://ari20089.github.io/agents-in-practice/)**

Hands-on **skills**, **prompts** and **agent instructions** for AI agents working with Microsoft 365, Copilot Studio and GitHub Copilot. Skills are reusable instruction packages (a `SKILL.md` plus optional `references/`, `scripts/` and `assets/`) that give an agent a focused, repeatable capability; they follow the [Agent Skills specification](https://agentskills.io/specification) and install into any host that reads it. Agent instructions are the instructions and knowledge files that define an agent's role, ready to paste into Agent Builder, Copilot Studio or the Microsoft 365 Agents Toolkit. Prompts are coming.

> [!IMPORTANT]
> Everything here is provided as-is, are not Microsoft products, and include no official Microsoft support or service-level agreement. Several describe **preview** features that change without notice. Validate every item against the Microsoft Learn pages it cites and against your own security, privacy, compliance and governance requirements before relying on it. See [SUPPORT.md](./SUPPORT.md).

## Quick start

```bash
git clone https://github.com/ari20089/agents-in-practice.git
# GitHub Copilot (VS Code, CLI)
cp -r agents-in-practice/skills/<slug> your-project/.github/skills/
```

Each skill folder is self-contained: copy the whole folder, not just `SKILL.md`, so the agent gets the `references/` it points to. For Copilot Studio, Microsoft 365 Copilot and other hosts see [skills/README.md](./skills/README.md).

For agent instructions, paste the item's `INSTRUCTIONS.md` into your agent's instructions and upload its `knowledge/` files. Each item's README gives the settings and steps for each tool; see [agent-instructions/README.md](./agent-instructions/README.md).

> [!TIP]
> Use skills selectively. Loading many skills at once dilutes the agent's attention and wastes context. Copy only the ones a project needs.

## What's inside

| Resource | Description |
| --- | --- |
| **[Gallery](https://ari20089.github.io/agents-in-practice/)** | Searchable site generated from the item folders ([how it works](./site/README.md)) |
| **[Skill catalog](#skill-catalog)** | Every published skill, by sub-category |
| **[Agent instructions catalog](#agent-instructions-catalog)** | Every published agent instructions item, by sub-category |
| **[skills/](./skills/)** | Source folders, one per skill, with a `_template/` to copy |
| **[agent-instructions/](./agent-instructions/)** | Source folders, one per agent instructions item, with a `_template/` to copy |
| **[SKILL-SCHEMA.md](./SKILL-SCHEMA.md)** | Skill authoring spec: frontmatter, required sections, limits |
| **[AGENT-INSTRUCTIONS-SCHEMA.md](./AGENT-INSTRUCTIONS-SCHEMA.md)** | Agent instructions spec: folder shape, the 8,000-character limit, knowledge files |
| **[AGENTS.md](./AGENTS.md)** | Guidance for coding agents working inside this repo |
| **[CONTRIBUTING.md](./CONTRIBUTING.md)** | How to submit an item, how review works, what CI checks |
| **[docs/maintaining.md](./docs/maintaining.md)** | Maintainer notes: branch protection, review bar, merging |

## Skill catalog

> 2 skills

### Architecture & design

| Skill | Platforms | Description |
| --- | --- | --- |
| [connected-agent-handoff-boundaries](./skills/connected-agent-handoff-boundaries/) | GitHub Copilot, Microsoft 365 Copilot, Copilot Studio | Decision boundaries for Copilot Studio multi-agent designs: who may delegate which actions to child, connected, external and live agents, what context crosses each handoff and what comes back, with instruction blocks, a handoff contract, open questions and a tenant test plan. |

### Governance & compliance

| Skill | Platforms | Description |
| --- | --- | --- |
| [shared-agent-memory-governance](./skills/shared-agent-memory-governance/) | GitHub Copilot, Microsoft 365 Copilot, Copilot Studio | Governance for the shared memory of Copilot Studio agents with an account (Frontier preview): what Microsoft documents, where Purview retention, eDiscovery and holds reach and where they don't, the open questions, and runbooks for holds, data subject requests, decommissioning and a tenant test plan. |

## Agent instructions catalog

> 1 agent instructions item

### Governance & compliance

| Agent | Platforms | Description |
| --- | --- | --- |
| [copilot-agent-governance-reviewer](./agent-instructions/copilot-agent-governance-reviewer/) | Microsoft 365 Copilot, Copilot Studio | A reviewer agent: paste in another Copilot agent's instructions, knowledge sources and actions and it reviews them the way a tenant admin or risk team would (scope, data exposure, write actions without confirmation, licensing fit and Responsible AI gaps) with findings tied to Microsoft documentation and a ship or fix verdict. |

## Contribute

New skills, agent instructions, corrections and documentation fixes are welcome.

1. Search the [skill](#skill-catalog) and [agent instructions](#agent-instructions-catalog) catalogs and [open issues](https://github.com/ari20089/agents-in-practice/issues) to avoid duplicates.
2. Read [CONTRIBUTING.md](./CONTRIBUTING.md) and [SKILL-SCHEMA.md](./SKILL-SCHEMA.md).
3. Copy [`skills/_template/`](./skills/_template/) to `skills/<your-slug>/`, or [`agent-instructions/_template/`](./agent-instructions/_template/) to `agent-instructions/<your-slug>/` (see [AGENT-INSTRUCTIONS-SCHEMA.md](./AGENT-INSTRUCTIONS-SCHEMA.md)), fill it in, run `npm test`, and open a pull request. CI validates the folder and a code owner reviews it.

Keep one item or one logical change per pull request. Never include credentials or real tenant, customer or personal data.

## Support and issues

- Problem with a specific item: review its `README.md`, then search or open an [issue](https://github.com/ari20089/agents-in-practice/issues/new/choose).
- Microsoft product, licensing or tenant questions: use official Microsoft documentation or your Microsoft support channel. This repository cannot provide product support.
- Suspected security vulnerability: follow [SECURITY.md](./SECURITY.md); do not post details in a public issue.

Assistance is voluntary and best-effort. See [SUPPORT.md](./SUPPORT.md).

## Maintainer

Arindam Choudhury · [GitHub](https://github.com/ari20089) · [LinkedIn](https://www.linkedin.com/in/arindam-choudhury/)
