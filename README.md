# Agents in Practice

[![Validate skills](https://img.shields.io/github/actions/workflow/status/ari20089/agents-in-practice/validate-skills.yml?branch=main&label=Validate%20skills)](https://github.com/ari20089/agents-in-practice/actions/workflows/validate-skills.yml)
[![Deploy site](https://img.shields.io/github/actions/workflow/status/ari20089/agents-in-practice/deploy-site.yml?branch=main&label=Gallery)](https://ari20089.github.io/agents-in-practice/)

**[Browse the gallery → ari20089.github.io/agents-in-practice](https://ari20089.github.io/agents-in-practice/)**

Hands-on **skills**, **prompts**, **agent instructions** and **Adaptive Cards** for AI agents working with Microsoft 365, Copilot Studio and GitHub Copilot. Skills are reusable instruction packages (a `SKILL.md` plus optional `references/`, `scripts/` and `assets/`) that give an agent a focused, repeatable capability; they follow the [Agent Skills specification](https://agentskills.io/specification) and install into any host that reads it. Agent instructions are the instructions and knowledge files that define an agent's role, ready to paste into Agent Builder, Copilot Studio or the Microsoft 365 Agents Toolkit. Prompts are single, self-contained instructions you paste into a Copilot chat for a focused result, such as a readiness check of the repository you have open. Adaptive Cards are card templates with sample data, ready to paste into a Copilot Studio topic, a Power Automate flow or a bot.

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

For a prompt, paste its `PROMPT.md` into Copilot Chat. Its README says what it needs and how to save it as a prompt file; see [prompts/README.md](./prompts/README.md).

For an Adaptive Card, paste its `card.json` into your host and replace each `${...}` binding with your own value. Its README gives the steps for each host; see [adaptive-cards/README.md](./adaptive-cards/README.md).

> [!TIP]
> Use skills selectively. Loading many skills at once dilutes the agent's attention and wastes context. Copy only the ones a project needs.

## What's inside

| Resource | Description |
| --- | --- |
| **[Gallery](https://ari20089.github.io/agents-in-practice/)** | Searchable site generated from the item folders ([how it works](./site/README.md)) |
| **[Skill catalog](#skill-catalog)** | Every published skill, by sub-category |
| **[Prompt catalog](#prompt-catalog)** | Every published prompt, by sub-category |
| **[Agent instructions catalog](#agent-instructions-catalog)** | Every published agent instructions item, by sub-category |
| **[Adaptive Card catalog](#adaptive-card-catalog)** | Every published Adaptive Card, by sub-category |
| **[skills/](./skills/)** | Source folders, one per skill, with a `_template/` to copy |
| **[prompts/](./prompts/)** | Source folders, one per prompt, with a `_template/` to copy |
| **[agent-instructions/](./agent-instructions/)** | Source folders, one per agent instructions item, with a `_template/` to copy |
| **[adaptive-cards/](./adaptive-cards/)** | Source folders, one per Adaptive Card, with a `_template/` to copy |
| **[SKILL-SCHEMA.md](./SKILL-SCHEMA.md)** | Skill authoring spec: frontmatter, required sections, limits |
| **[PROMPT-SCHEMA.md](./PROMPT-SCHEMA.md)** | Prompt spec: folder shape, the 8,000-character limit, running it as a prompt file |
| **[AGENT-INSTRUCTIONS-SCHEMA.md](./AGENT-INSTRUCTIONS-SCHEMA.md)** | Agent instructions spec: folder shape, the 8,000-character limit, knowledge files |
| **[ADAPTIVE-CARD-SCHEMA.md](./ADAPTIVE-CARD-SCHEMA.md)** | Adaptive Card spec: folder shape, schema version, bindings, the 28 KB limit |
| **[AGENTS.md](./AGENTS.md)** | Guidance for coding agents working inside this repo |
| **[CONTRIBUTING.md](./CONTRIBUTING.md)** | How to submit an item, how review works, what CI checks |
| **[docs/maintaining.md](./docs/maintaining.md)** | Maintainer notes: branch protection, review bar, merging |

## Skill catalog

> 3 skills

### Architecture & design

| Skill | Platforms | Description |
| --- | --- | --- |
| [connected-agent-handoff-boundaries](./skills/connected-agent-handoff-boundaries/) | GitHub Copilot, Microsoft 365 Copilot, Copilot Studio, Any coding agent | Decision boundaries for Copilot Studio multi-agent designs: who may delegate which actions to child, connected, external and live agents, what context crosses each handoff and what comes back, with instruction blocks, a handoff contract, open questions and a tenant test plan. |

### Governance & compliance

| Skill | Platforms | Description |
| --- | --- | --- |
| [computer-use-autonomous-agents-fs](./skills/computer-use-autonomous-agents-fs/) | GitHub Copilot, Microsoft 365 Copilot, Copilot Studio, Any coding agent | Where the line sits for agents that drive a user interface or act without a prompt in regulated financial services in the UK, EU and US: what Microsoft excludes from intended use (financial transactions, scoring in finance), what regulators have and have not published, the obligations that apply by jurisdiction, the controls on either side of the line, and a tenant test plan. |
| [shared-agent-memory-governance](./skills/shared-agent-memory-governance/) | GitHub Copilot, Microsoft 365 Copilot, Copilot Studio, Any coding agent | Governance for the shared memory of Copilot Studio agents with an account (Frontier preview): what Microsoft documents, where Purview retention, eDiscovery and holds reach and where they don't, the open questions, and runbooks for holds, data subject requests, decommissioning and a tenant test plan. |

## Prompt catalog

> 1 prompt

### Developer productivity

| Prompt | Platforms | Description |
| --- | --- | --- |
| [code-app-readiness-check](./prompts/code-app-readiness-check/) | GitHub Copilot, Any coding agent | Paste it into GitHub Copilot Chat on an existing React or Vue repository and it reports whether the app can become a Power Apps code app: its own sign-in, direct API calls that should go through connectors, offline and worker assumptions, and build output and routing problems, with a verdict and an ordered fix list. |

## Agent instructions catalog

> 2 agent instructions items

### Governance & compliance

| Agent | Platforms | Description |
| --- | --- | --- |
| [copilot-agent-governance-reviewer](./agent-instructions/copilot-agent-governance-reviewer/) | Microsoft 365 Copilot, Copilot Studio | A reviewer agent: paste in another Copilot agent's instructions, knowledge sources and actions and it reviews them the way a tenant admin or risk team would (scope, data exposure, write actions without confirmation, licensing fit and Responsible AI gaps) with findings tied to Microsoft documentation and a ship or fix verdict. |

### Developer productivity

| Agent | Platforms | Description |
| --- | --- | --- |
| [connector-call-wrapper-generator](./agent-instructions/connector-call-wrapper-generator/) | GitHub Copilot, Copilot Studio, Microsoft 365 Copilot, Any coding agent | Name a Dataverse table or connector operation in a Power Apps code app and it writes the typed data access layer over the generated services, with loading, error and empty states, instead of raw generated calls scattered through components. |

## Adaptive Card catalog

> 1 Adaptive Card

### Approvals & workflows

| Card | Platforms | Description |
| --- | --- | --- |
| [approval-request](./adaptive-cards/approval-request/) | Copilot Studio, Microsoft Teams, Power Automate | A card that asks one person to approve or reject a request: what's being requested and why, who asked, when it's needed and a link to the full request, with an optional comment and Approve and Reject buttons. It returns the decision, the request reference and the comment in one response, from a Power Automate flow in Teams, a Copilot Studio topic or a Teams bot, with the checks to run before acting on it. |

## Contribute

New skills, prompts, agent instructions, Adaptive Cards, corrections and documentation fixes are welcome.

1. Search the [skill](#skill-catalog), [prompt](#prompt-catalog), [agent instructions](#agent-instructions-catalog) and [Adaptive Card](#adaptive-card-catalog) catalogs and [open issues](https://github.com/ari20089/agents-in-practice/issues) to avoid duplicates.
2. Read [CONTRIBUTING.md](./CONTRIBUTING.md) and [SKILL-SCHEMA.md](./SKILL-SCHEMA.md).
3. Copy [`skills/_template/`](./skills/_template/) to `skills/<your-slug>/`, [`prompts/_template/`](./prompts/_template/) to `prompts/<your-slug>/` (see [PROMPT-SCHEMA.md](./PROMPT-SCHEMA.md)), [`agent-instructions/_template/`](./agent-instructions/_template/) to `agent-instructions/<your-slug>/` (see [AGENT-INSTRUCTIONS-SCHEMA.md](./AGENT-INSTRUCTIONS-SCHEMA.md)), or [`adaptive-cards/_template/`](./adaptive-cards/_template/) to `adaptive-cards/<your-slug>/` (see [ADAPTIVE-CARD-SCHEMA.md](./ADAPTIVE-CARD-SCHEMA.md)), fill it in, run `npm test`, and open a pull request. CI validates the folder and a code owner reviews it.

Keep one item or one logical change per pull request. Never include credentials or real tenant, customer or personal data.

## Support and issues

- Problem with a specific item: review its `README.md`, then search or open an [issue](https://github.com/ari20089/agents-in-practice/issues/new/choose).
- Microsoft product, licensing or tenant questions: use official Microsoft documentation or your Microsoft support channel. This repository cannot provide product support.
- Suspected security vulnerability: follow [SECURITY.md](./SECURITY.md); do not post details in a public issue.

Assistance is voluntary and best-effort. See [SUPPORT.md](./SUPPORT.md).

## Maintainer

Arindam Choudhury · [GitHub](https://github.com/ari20089) · [LinkedIn](https://www.linkedin.com/in/arindam-choudhury/)
