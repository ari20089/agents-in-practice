# Power Platform ADR

## Overview

Write one MADR v4.0.0 Architecture Decision Record (ADR) for a Power Platform or Microsoft 365 Copilot delivery choice. Build nothing.

## Inputs

Decision: <the question, such as "How do we deliver the expense policy assistant?">
Context: <who uses it (employees or customers) and where (Microsoft 365 Copilot, Teams chat or channel, web app, website, phone); outside users' sign-in; what it reads and changes; data sources; volume; team skills; licences; cloud (commercial, GCC, GCC High, DoD); key, residency or production rules; deadline>

Defaults unless I change them:
- Options: Agent Builder; Copilot Studio (one option per fitting harness); a Power Apps code app; a code app calling a Copilot Studio agent. Options named in the Decision are added
- Format: MADR v4 (Y-statement for a small, reversible choice: for…, given…, choose… over…, to gain…, accepting…)
- Number: next free in `docs/planning/adrs/`, else 0001

If Decision or Context still has angle brackets, ask and stop.

## What Microsoft documents (as of 1 November 2026)

You MUST use only these facts for Microsoft behaviour. Anything else is "not documented as of 1 November 2026" and an open question. You MUST NOT quote prices.

- **Host vs tool:** the host fixes orchestration, models and cost; authoring is secondary. Microsoft Copilot hosts declarative agents: licence-included for licensed users, consumption-billed for others, little loop control. Copilot Studio: configurable orchestration; licence- or consumption-based.
- **Agent Builder:** low-code, guided natural-language configuration of declarative agents, no source-code project, in Microsoft 365 Copilot or Teams. They also run in apps like Word, Excel and Outlook, for individuals: "You can't use agents built in Agent Builder in Teams group or 1:1 chats". Knowledge: SharePoint, Copilot connectors, web, files (skills: preview). No external-service actions. Audience: your organization (sharing or org catalog), even across departments. No customer-managed keys, versioning or CI/CD; limited telemetry. Available in GCC and GCC High, not DoD. Promote it to the Microsoft 365 Agents Toolkit for versioning and CI/CD, same host.
- **Declarative agent licensing:** Copilot Chat users without a Microsoft 365 Copilot licence or usage-based billing get instructions, web, code interpreter and image generation; SharePoint, Copilot connectors, embedded files and Dataverse need either; email, people, Teams messages and meetings need the licence. Usage-based billing isn't in GCC or GCC High; agents grounded in shared tenant work data aren't yet in GCC, GCC High or DoD.
- **Copy to Copilot Studio:** one-way snapshot. Copies instructions, prompts, icon, SharePoint and website knowledge; connectors and files are re-added; scoped connectors and image generation unsupported. Needs a Copilot Studio or Microsoft 365 Copilot licence and Dataverse.
- **Copilot Studio:** low-code; knowledge (SharePoint and more), connectors, tools, workflows; internal or external users on its harness's channels; dev, test and prod environments, solutions, versioning, analytics; customer-managed keys (per harness undocumented); Power Platform data and connector policies plus Microsoft 365 controls. Native Git integration; Power Platform pipelines for deployment (non-developer targets must be Managed Environments, needing premium licences). In GCC and GCC High (Teams and Microsoft Copilot channel: not GCC High; autonomous triggers: neither); no harness named per cloud. The harness is fixed at creation; Microsoft 365 Copilot licences can cover only standard:
  - Microsoft Copilot harness (formerly GitHub Copilot): multistep reasoning, Word, Excel, PowerPoint and PDF files, skills, memory (preview; off in group chats and Teams channels); Microsoft Copilot, Teams and web app channels; Entra ID or no sign-in only; credits from first build.
  - Customer Conversation (preview): customers on web chat, Teams Phone or a contact center (voice can't use knowledge needing user sign-in); connectors, MCP; building and testing may consume credits.
  - Standard: topics and agent flows; Teams and Microsoft Copilot (also Teams channels and group chats, without sign-in knowledge like SharePoint), SharePoint, WhatsApp, custom website, mobile app, Slack, email, more; Entra ID, no or manual authentication; billed after publish, except answers and Graph grounding under a Microsoft 365 Copilot-licensed user's identity in Copilot Chat, Teams or SharePoint; computer use is billed, as are agent flows unless such a user's chat calls them via "When an agent calls the flow".
  Agents can't move between standard and Microsoft Copilot harnesses; Customer Conversation moves are undocumented.
- **Power Apps code app:** custom web app from a code-first IDE, hosted in Power Platform: full UI control, Entra ID sign-in, Power Platform data sources and 1,500+ connectors from JavaScript. Admin-enabled per environment. Each user needs Power Apps Premium or pay-as-you-go, an App Pass or auto-claim. Canvas-app governance (sharing limits, data policy, per-app Conditional Access, quarantine, B2B guests). Solutions need Dataverse; pipelines deploy Dev → Test → Prod (managed targets); no Power Platform Git integration. Built files sit on a public endpoint, no IP restriction (use location-based Conditional Access; keep sensitive data out). No Secure Implicit Connections. Can call a published Copilot Studio agent in its environment via connector (harnesses undocumented).

## Workflow Steps

1. **Frame.** Restate the problem as a question. List drivers from the Decision and Context, marking must-haves. Record architecturally significant requirements (ASRs): kind (cost, performance, security, compliance, availability, scalability, maintainability, evolvability), evidence, note; or say none apply. If audience, channel or what it changes can't be inferred, you MUST ask only about those, in one message, and stop.
2. **Decide.** Score every option against every driver: meets, conditional (needs a licence or setting enabled), unconfirmed (not documented above; ranks below conditional), knock-out (can't meet a must-have) or fails (can't meet another driver). A preview feature can't meet a production must-have unless I allow it. Choose the option clearing all knock-outs that serves most drivers; on a tie, fewer products, licences and code. If none does, take the fewest knock-outs, then most drivers; each knock-out becomes an open question.
3. **Govern.** Each conditional or unconfirmed cell of the chosen option becomes a Confirmation item. Name each option's meter (licence or Copilot Credits) and when billing starts. Say how to reverse it and its cost.

## Output

Return the record in one fenced `markdown` block, then file name `NNNN-kebab-case-title.md`, then up to 5 open questions. Keep all headings:

```markdown
---
status: proposed
date: {YYYY-MM-DD}
decision-makers: {roles}
consulted: {roles}
informed: {roles}
supersedes: {accepted ADRs replaced, or omit}
asrTriggers:
  - kind: {kind}
    evidence: {source}
    note: {≤280 characters}
---

# {title: problem and solution}

## Context and Problem Statement
## Decision Drivers
## Considered Options
{table: driver by option; each cell a score and its fact}
## Decision Outcome
Chosen option: "{option}", because {reason}.
### Consequences
{Good, Bad, Neutral; meter and billing start; how to reverse}
### Confirmation
## Pros and Cons of the Options
## More Information
{Other facts relied on, "as of 1 November 2026"; when to revisit.}
```

## Success Criteria

- Every knock-out and conditional names its fact; no personal name, tenant name or identifying URL.

## Examples

- Onboarding agent over SharePoint, no writes: Agent Builder.
- IT agent filing tickets via a connector: Copilot Studio.

## Error Handling

- An option I name that isn't covered above: include it, marking its facts "not covered by this prompt".
- Say in Consequences when a fact is preview.
