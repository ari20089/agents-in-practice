# Adaptive Card Schema Specification

This document defines the shape of an **Adaptive Card** item: a card template in JSON that a maker pastes into Copilot Studio, a Power Automate flow or a bot, with sample data that shows every value the card expects. The host renders the card in its own interface; the item carries no instructions for an agent.

| Concept | What it is | Where it runs |
| --- | --- | --- |
| **Adaptive Card** | A card template and its sample data | Copilot Studio, Microsoft Teams through Power Automate or a bot, Bot Framework Web Chat |
| **Prompt** | A single instruction the user pastes or runs | Any Copilot chat ([PROMPT-SCHEMA.md](./PROMPT-SCHEMA.md)) |
| **Agent instructions** | The instructions and knowledge files that define an agent's role | Agent Builder, Copilot Studio, Microsoft 365 Agents Toolkit ([AGENT-INSTRUCTIONS-SCHEMA.md](./AGENT-INSTRUCTIONS-SCHEMA.md)) |
| **Skill** | A reusable instruction package that teaches an agent a multi-step task | Any Agent Skills host ([SKILL-SCHEMA.md](./SKILL-SCHEMA.md)) |

## File layout

```
adaptive-cards/<slug>/
├── metadata.json   # catalog sidecar, human-facing
├── README.md       # human-facing overview, how to use it in each host, the bindings, what comes back
├── card.json       # required: the card template
├── data.json       # required when card.json has bindings: sample data for every one
└── assets/         # optional: preview image and human-facing extras
```

## `card.json` (required)

The file holds the card exactly as it is pasted, so the whole file can be copied.

| Rule | Limit | Why |
| --- | --- | --- |
| Root | `"type": "AdaptiveCard"`, with `$schema` and `version` set | Every host reads `version` to decide what it can render |
| Version | `1.5` or earlier | Copilot Studio supports 1.6 and earlier, but "Teams is also limited to version 1.5", and so is the live chat widget (Ask questions with Adaptive Cards). A card that has to work everywhere stays at 1.5 |
| Size | 28,000 bytes or less after the sample data is filled in | Power Automate's Teams actions fail with "Request Entity too large" above "approximately 28 KB" (Microsoft Teams connector reference) |
| Bindings | Plain property paths only: `${title}`, `${requester.name}`. No functions, `$data`, `$when` or `$root` | Bindings use the Adaptive Cards template language, which only bots and the Designer expand. In Power Automate and Copilot Studio the maker replaces each binding by hand with dynamic content or a variable, which only works when each one is a single value |
| Inputs | Every input has a unique `id` and a `label` | The `id` is the name the response comes back under. `label` (schema 1.3) is "the recommended way of tagging inputs", and screen readers rely on it (Input Validation) |
| Submit actions | Each `Action.Submit` has a `data` object with an `actionSubmitId` | Copilot Studio: "include an identifier in each submit action's data payload and validate it when processing the response" |
| No `isEnabled` on `Action.Submit` | | "The `isEnabled` property for `Action.Submit` type in an Adaptive Card isn't supported in Teams" (Cards reference) |

Prefer `Action.Submit` when the card must work in Copilot Studio and Power Automate. Teams recommends `Action.Execute` for new bots, but "the Bot Framework Web Chat component … doesn't support `Action.Execute`", nor does a Copilot Studio agent in Microsoft Copilot, and Power Automate's wait-for-response actions collect submissions. The README says how to switch when a card is only for a Teams bot.

A card can't check who answered or whether the request is still open. Its README must say what the host has to check before acting on a response.

## `data.json`

A JSON object with a sample value for every binding in `card.json`, and nothing else. It is what the Adaptive Cards Designer shows in preview mode, and the README lists each field. Use made-up values: no real names, tenants, email addresses or links.

## `README.md` (required)

The human-facing page. It must say:
- what the card shows and collects, and what it doesn't;
- how to use it in each host it supports, including how to replace the bindings where the host doesn't expand them;
- each binding and what goes in it;
- what the host gets back when the user submits, field by field;
- the Microsoft Learn pages behind every claim about a host, with their dates.

Use the same sections as a prompt README: Summary, Prerequisites, Limitations, Sources, Contributors, Version history, Help and Disclaimer.

## `metadata.json` (required)

The same fields as a skill's `metadata.json` (see [CONTRIBUTING.md](./CONTRIBUTING.md)). The category comes from the folder (`adaptive-cards/` → **Adaptive Cards**).

## Validation

`node scripts/validate-adaptive-cards.mjs` enforces the layout, the root and version rules, the binding rules, that every binding has sample data and every sample value is used, the size limit after the sample data is filled in, input ids and labels, the `actionSubmitId` rule, the `metadata.json` schema, README links, the README `## Sources` section and the catalog row. `npm test` runs it with the other validators, and CI runs all of them on every pull request.

## Sources

Microsoft Learn, with each page's `ms.date` when it was read on 31 October 2026:

- [Ask questions with Adaptive Cards (Copilot Studio)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-ask-with-adaptive-card), 21 Oct 2026
- [Connect and configure an agent for Teams and Microsoft Copilot](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-add-bot-to-microsoft-teams), 29 Oct 2026
- [Microsoft Teams connector reference](https://learn.microsoft.com/en-us/connectors/teams/), updated 2 Oct 2026
- [Create and explore card types in Teams (Cards reference)](https://learn.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/cards/cards-reference), 13 Oct 2026
- [Adaptive Card actions in Teams SDK](https://learn.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/cards/cards-actions), 10 Jun 2026
- [Adaptive Cards Template Language](https://learn.microsoft.com/en-us/adaptive-cards/templating/language), 18 May 2020
- [Input Validation (Adaptive Cards)](https://learn.microsoft.com/en-us/adaptive-cards/authoring-cards/input-validation), 24 Jul 2020
