# Agents in Practice

[![Validate skills](https://img.shields.io/github/actions/workflow/status/ari20089/agents-in-practice/validate-skills.yml?branch=main&label=Validate%20skills)](https://github.com/ari20089/agents-in-practice/actions/workflows/validate-skills.yml)
[![Deploy site](https://img.shields.io/github/actions/workflow/status/ari20089/agents-in-practice/deploy-site.yml?branch=main&label=Gallery)](https://ari20089.github.io/agents-in-practice/)

**[Browse the gallery → ari20089.github.io/agents-in-practice](https://ari20089.github.io/agents-in-practice/)**

Hands-on **skills** for AI agents working in the Microsoft 365, Copilot Studio and GitHub Copilot ecosystem: reusable instruction packages (a `SKILL.md` plus optional `references/`, `scripts/` and `assets/`) that give an agent a focused, repeatable capability. Skills follow the [Agent Skills specification](https://agentskills.io/specification) and install into any host that reads it.

> [!IMPORTANT]
> Skills here are provided as-is, are not Microsoft products, and include no official Microsoft support or service-level agreement. Several describe **preview** features that change without notice. Validate every skill against the Microsoft Learn pages it cites and against your own security, privacy, compliance and governance requirements before relying on it. See [SUPPORT.md](./SUPPORT.md).

## Quick start

```bash
git clone https://github.com/ari20089/agents-in-practice.git
# GitHub Copilot (VS Code, CLI)
cp -r agents-in-practice/skills/<slug> your-project/.github/skills/
```

Each skill folder is self-contained: copy the whole folder, not just `SKILL.md`, so the agent gets the `references/` it points to. For Copilot Studio, Microsoft 365 Copilot and other hosts see [skills/README.md](./skills/README.md).

> [!TIP]
> Use skills selectively. Loading many skills at once dilutes the agent's attention and wastes context. Copy only the ones a project needs.

## What's inside

| Resource | Description |
| --- | --- |
| **[Gallery](https://ari20089.github.io/agents-in-practice/)** | Searchable site generated from the skill folders ([how it works](./site/README.md)) |
| **[Skill catalog](#skill-catalog)** | Every published skill, by category |
| **[skills/](./skills/)** | Source folders, one per skill, with a `_template/` to copy |
| **[SKILL-SCHEMA.md](./SKILL-SCHEMA.md)** | Authoring spec: frontmatter, required sections, limits |
| **[AGENTS.md](./AGENTS.md)** | Guidance for coding agents working inside this repo |
| **[CONTRIBUTING.md](./CONTRIBUTING.md)** | How to submit a skill, how review works, what CI checks |
| **[docs/maintaining.md](./docs/maintaining.md)** | Maintainer notes: branch protection, review bar, merging |

## Skill catalog

> 1 skill

### Governance & compliance

| Skill | Platforms | Description |
| --- | --- | --- |
| [shared-agent-memory-governance](./skills/shared-agent-memory-governance/) | GitHub Copilot, Microsoft 365 Copilot, Copilot Studio | Governance for the shared memory of Copilot Studio agents with an account (Frontier preview): what Microsoft documents, where Purview retention, eDiscovery and holds reach and where they don't, the open questions, and runbooks for holds, data subject requests, decommissioning and a tenant test plan. |

## Contribute

New skills, corrections and documentation fixes are welcome.

1. Search the [catalog](#skill-catalog) and [open issues](https://github.com/ari20089/agents-in-practice/issues) to avoid duplicates.
2. Read [CONTRIBUTING.md](./CONTRIBUTING.md) and [SKILL-SCHEMA.md](./SKILL-SCHEMA.md).
3. Copy [`skills/_template/`](./skills/_template/) to `skills/<your-slug>/`, fill it in, run `npm test`, and open a pull request. CI validates the folder and a code owner reviews it.

Keep one skill or one logical change per pull request. Never include credentials or real tenant, customer or personal data.

## Support and issues

- Problem with a specific skill: review its `README.md`, then search or open an [issue](https://github.com/ari20089/agents-in-practice/issues/new/choose).
- Microsoft product, licensing or tenant questions: use official Microsoft documentation or your Microsoft support channel. This repository cannot provide product support.
- Suspected security vulnerability: follow [SECURITY.md](./SECURITY.md); do not post details in a public issue.

Assistance is voluntary and best-effort. See [SUPPORT.md](./SUPPORT.md).

## Maintainer

Arindam Choudhury · [GitHub](https://github.com/ari20089) · [LinkedIn](https://www.linkedin.com/in/arindam-choudhury/)
