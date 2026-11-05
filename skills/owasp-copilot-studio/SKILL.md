---
name: owasp-copilot-studio
description: Use when the user wants to know which Microsoft Copilot Studio settings and controls address an OWASP Top 10 for Agentic Applications (2026) risk (ASI01 to ASI10) or an OWASP Top 10 for LLM Applications (2025) risk (LLM01 to LLM10), to threat-model or review a Copilot Studio agent against them, to build a tenant baseline, or to check Microsoft's OWASP mitigation claims for Copilot Studio. Trigger phrases include "OWASP for Copilot Studio", "map OWASP agentic risks to Copilot Studio", "which Copilot Studio setting stops prompt injection", "ASI02 tool misuse in Copilot Studio", "LLM06 excessive agency Copilot Studio", "OWASP control matrix for our agent", "is our Copilot Studio agent covered against OWASP", "Copilot Studio security baseline", "is Microsoft's OWASP one-pager accurate". Do not use for agents built outside Copilot Studio (use HVE Core's owasp-agentic or owasp-llm skill), for OWASP web, API, MCP or CI/CD lists, or for a go-live gate on an agent with an account (use agent-identity-review-gate).
---

# OWASP Risks to Copilot Studio Controls

The OWASP Top 10 for Agentic Applications (2026) and the OWASP Top 10 for LLM Applications (2025) describe risks and generic prevention controls. Microsoft's Copilot Studio controls that answer them are spread across agent settings, tool properties, the Power Platform admin center, Purview, Defender, Agent 365 and Entra, differ by harness, and are partly in preview. Microsoft's own mapping covers the agentic list only, at a high level, and dates from March 2026. This skill maps each of the 20 risks to the named Copilot Studio controls, the layer that owns each one, its default and release state, and what no control covers. It is advisory: never change agents, settings or policies.

## Before Starting

Determine the following before proceeding. If the user has not supplied them, ask for the missing ones.

1. **Scope** — one agent (design or review), a tenant or environment baseline, or a single risk ("which control addresses ASI02?"). Defaults to one agent.
2. **Lists** — agentic, LLM, or both (default both).
3. **Harness** — standard, Microsoft Copilot (formerly GitHub Copilot), or Customer Conversation. Controls differ by harness (guide section 2); if the user does not know, ask how the agent was created and say which you assumed.
4. **Agent surface** (agent scope) — end-user authentication; channels; knowledge sources; tools with their authentication (end-user, maker-provided, agent account) and **Ask the end user before running** or hooks; connected, child or external agents, and whether other agents may connect to it; triggers; code interpreter; computer use; web search, general knowledge and ungrounded responses; uploaded skills; agent account and memory. If unknown, mark each *unknown*; never assume the secure value.
5. **Licences and admin reach** — whether the tenant has Microsoft Agent 365 (needed for Defender's security for AI on Copilot Studio agents from 1 July 2026, except real-time protection through Defender for Cloud Apps; guide C37), Purview, Managed Environments (needed for sharing limits and Virtual Network support), Frontier enrollment and Microsoft 365 Frontier for AI Teammates licences (needed for agent accounts; guide C42), and, for Conditional Access for agents, Microsoft 365 E7 or Agent 365 paired with Entra P1 or Microsoft 365 E3; and who can change Power Platform admin center settings. Also the cloud: commercial, GCC, GCC High, DoD or another sovereign cloud (guide section 2.4). Controls the tenant cannot use are reported as *not available*, not as gaps in the agent.
6. **Artifact wanted** — control map (default), gap report, admin baseline checklist, maker checklist, tenant test plan, or a single-risk answer.
7. **Documentation date** — if you have web access, re-check the pages in the guide's Sources list, compare each page's `ms.date` with the date listed, and say what changed. Otherwise say you are relying on 5 November 2026.
8. **Tenant observations** — any test results the user already has. Report these as *observed in tenant*, separate from *documented* and *not documented*.

## Output Structure

Produce, in this order:

1. **Scope line** — agent or tenant, harness, lists covered, documentation date.
2. **Risk applicability** — one line per risk: applies, partly applies, or does not apply, with the agent feature that decides it (guide section 3). Skip this for a single-risk answer.
3. **Control map** — the guide's section 9.1 table: one row per applicable risk, with the controls by layer, each control's state in this agent or tenant (set, not set, *unknown*, not available on this harness, not licensed), the row's status (*covered*, *gap*, *unknown*, *n/a*, as section 9.1 defines them) and the residual risk.
4. **Gaps** — every applicable risk where a primary control is not set, *unknown*, or unavailable on the harness, most severe first, with the fix in Copilot Studio terms (setting name and where it lives).
5. **Microsoft's claims checked** — only the rows of guide section 6 that bear on this agent: supported, qualified or outdated, with the page and date.
6. **Open questions that apply** — the relevant rows from guide section 7.
7. **Assumptions** — one line listing defaults you applied. Omit if the user supplied everything.
8. **The requested artifact** — built from guide section 9 (Step 6).
9. **Recommendation** — a clear position and the conditions that must hold first.
10. **Sources and dates** — one line naming the pages relied on and their dates, plus the release state of each control relied on.

Use tables for the map and the checklists, numbered lists for fixes, and fenced blocks for any text the user will paste into Copilot Studio.

## Step 1: Settle the harness and the scope

Read [references/controls-guide.md](references/controls-guide.md) sections 1 and 2. Settle the harness first: several controls exist on the standard harness only, many admin pages state no harness at all, and the Microsoft Copilot harness has different settings for the same need (for example, a **Pre tool use** hook instead of **Ask the end user before running**, and **Allow other agents to connect** instead of **Let other agents connect to and use this one**). If the design mixes harnesses, treat each agent separately.

If the user has HVE Core's `owasp-agentic` or `owasp-llm` skill installed, read the matching risk reference there for the risk's definition, checklist and generic prevention controls. This skill supplies the Copilot Studio mapping on top; it does not restate OWASP's text.

## Step 2: Decide which risks apply

Apply the applicability rules in guide section 3 and record each risk as applies, partly applies or does not apply. A risk does not apply only when the agent lacks the feature that creates it (for example, ASI05 does not apply when neither code interpreter nor computer use is on, except on the Microsoft Copilot harness, where code interpreter is native and ASI05 always applies). Prompt injection (LLM01, ASI01), sensitive information disclosure (LLM02), system prompt leakage (LLM07), misinformation (LLM09), unbounded consumption (LLM10), trust exploitation (ASI09) and rogue agents (ASI10) always apply to a published generative agent.

## Step 3: Map each applicable risk to controls

For each applicable risk, take the rows from guide section 4 (LLM list) or section 5 (agentic list). Each control comes from the catalog in guide section 8, with its layer (maker, Power Platform admin, Purview, Defender, Entra, Agent 365), default, harness scope and release state. For each control, record its state in this agent or tenant from the user's inputs. A control the user has not confirmed is *unknown*. Use the guide's **primary** (prevent or block) and **supporting** (detect, warn or reduce impact) lists as given; do not re-split them. Admin controls (Power Platform admin center, Purview, Defender, Entra) count for the agent only if the user confirms they are set for its environment.

## Step 4: Check the claims the user is relying on

If the user cites Microsoft's March 2026 OWASP one-pager or blog, or makes an assumption such as "agents can't run code" or "Copilot Studio has no persistent memory", check it against guide section 6 and say whether current pages support it, qualify it or no longer match it.

## Step 5: State the residual risk

For each applicable risk, state what no Copilot Studio control covers, from the *Residual* lines in guide sections 4 and 5. A residual risk is answered by the agent's design (instructions, topic structure, tool scope, review process), not by a setting. Label these design measures as this skill's recommendation, not Microsoft guidance.

## Step 6: Build the artifact

| Artifact | Guide section | Contents |
|---|---|---|
| Control map | 9.1 | One row per applicable risk; every cell filled or *unknown* |
| Gap report | 9.2 | Gaps ranked, each with the setting to change, the layer that owns it and the test that proves the fix |
| Admin baseline checklist | 9.3 | Tenant and environment controls, each with the risks it covers and its default |
| Maker checklist | 9.4 | Per-agent settings, each with the risks it covers and its default |
| Tenant test plan | 10 | The tests that apply to this agent's risks and harness; drop tests already run and fold their results into *observed in tenant* |
| Single-risk answer | 4 or 5 | The risk's row: primary and supporting controls, harness scope, residual risk and one test |

Every artifact carries the documentation date and the release state of each control it relies on.

## Step 7: Recommend, then stop

Give a clear position: covered, covered with listed fixes, or not covered. An agent is not covered if any of these holds:

- it has **No authentication** on a channel that reaches internal data;
- a tool that writes, sends or deletes uses maker-provided credentials with no recorded exception;
- an irreversible tool (one that sends, deletes, pays, or has an external side effect the agent cannot undo; creating a ticket or a draft is reversible) runs without **Ask the end user before running** or a human approval step; on the Microsoft Copilot harness, a workflow **Request for information** step counts only once T17 passes (guide Q14), and a **Pre tool use** hook counts only alongside end-user credentials or such a step, and only after its failure path is tested, because hooks fail open;
- a primary control for an applicable risk is *unknown* on a production agent.

Do not offer to change the agent or the tenant.

## Rules

- **Never** state that a Copilot Studio control "prevents" or "eliminates" an OWASP risk. Microsoft describes its protections as reducing risk, and several fail open or only detect (guide section 8). Say which part of the risk the control covers.
- **Never** present a standard-harness control as available on the Microsoft Copilot or Customer Conversation harness unless the guide documents it there. Answer "not documented for this harness as of <date>".
- **Never** treat detection (protection status, Defender default rule, audit, Insider Risk) as prevention. Label each control *blocks*, *warns*, *detects* or *reduces impact*.
- **Never** copy OWASP's or HVE Core's risk descriptions, checklists or prevention text into the output. Use the risk ID, its title and the one-line summary in the guide, and point to the source.
- **Never** claim a default, a setting name or a harness scope the guide marks *not documented*. Name the test in section 10 that would establish it.
- **Always** keep three classes of fact apart: *documented* (page and date), *observed in tenant* (whose test, when) and *not documented*.
- **Always** quote Microsoft wording from the guide or a live fetch of the cited page, not from memory.
- **Always** label the applicability rules, primary/supporting split, residual-risk design measures and coverage verdict as this skill's pattern, not Microsoft guidance.
- **Always** use Microsoft's current names: standard harness; Microsoft Copilot harness (named the GitHub Copilot harness until 28 October 2026; Learn pages still use the old name, so keep it in page titles and quotes); Customer Conversation harness; data policies (not DLP policies) for the Power Platform admin center, and "Purview DLP" only for Microsoft Purview data loss prevention policies; Data Security Posture Management (the older versions are now "(classic)"); Microsoft Foundry; Microsoft Entra Agent ID; Microsoft Agent 365; Copilot Credits; agent flows.
- **Always** keep tenant, agent, user and customer names out of reusable examples and paste-ready blocks.
- If the agent is not built in Copilot Studio, say this skill is the wrong tool and point to HVE Core's generic `owasp-agentic` and `owasp-llm` skills; they are reference skills (`user-invocable: false`) that HVE Core's agents load, not skills a user calls directly.

## Examples

**Input:** "Review our HR policy agent against OWASP. Standard harness, Authenticate with Microsoft, SharePoint knowledge, one connector tool that creates a ServiceNow ticket with maker-provided credentials, web search on, published to Teams."

**Output (abridged):**

> **Scope:** one agent, standard harness, both lists, Learn pages dated up to 4 Nov 2026.
> **Applicability:** ASI05 does not apply (no code interpreter or computer use). ASI06 partly applies (editable SharePoint knowledge, no memory). ASI07 partly applies (calls no agent, but accepts incoming connections by default). The rest apply.
> **Control map (two rows):**
> | Risk | Primary controls | Supporting | State | Residual |
> |---|---|---|---|---|
> | LLM06 / ASI02 | Tool **Authentication** = End user; **Ask the end user before running** = Yes | Data policy on the ServiceNow connector; Defender real-time protection (preview) | Maker-provided; confirmation No (the default) | Agent can raise tickets as the maker for any user |
> | LLM09 | **Allow ungrounded responses** off; web search off | Citations; Content safety evaluation | *unknown*; web search on | No accuracy check on SharePoint content |
> **Gaps:** 1. Maker-provided credentials on a write tool: switch to End user, or record an exception (Add tools, 1 Oct 2026). Ask the admin whether **Sharing agents with embedded maker credentials** (preview, default "Don't let makers share…") is on; if the ServiceNow connection is one users aren't permitted to reuse, sharing and republishing the shared agent are blocked, but the credentials stay until the maker changes them. 2. Confirmation is No by default; set it to Yes (ticket creation is reversible, so this is a fix, not a blocker). 3. Incoming connections are on by default and not confirmed off: turn **Let other agents connect to and use this one** off.
> **Claims checked:** "User-scoped tool access is selected by default" is supported for tools ("By default, user authentication applies"), but this agent overrode it; "Human approval can be built-in" is qualified, because **Ask the end user before running** "is set to No by default".
> **Recommendation:** not covered until gap 1 is fixed and the *unknown* primary controls are confirmed (**Allow ungrounded responses** for LLM09; the admin **Connected Agents** setting for ASI07); then covered with listed fixes.
> **Sources and dates:** Add tools to custom agents (1 Oct 2026); Knowledge sources summary (21 Jul 2026); Connect to an existing Copilot Studio agent (30 Oct 2026); Control how agents are shared (4 Nov 2026); the embedded maker credentials control is preview.

## References

- [references/controls-guide.md](references/controls-guide.md) — how this skill builds on HVE Core's OWASP skills and Microsoft's mapping (section 1); harnesses, control layers and sovereign clouds (2); applicability rules (3); LLM Top 10 mapping (4); agentic Top 10 mapping (5); Microsoft's one-pager claims checked against current pages (6); open questions Q1 to Q15 (7); control catalog C01 to C54 with defaults, harness scope, release state, effect and verbatim quotes (8); artifact templates (9); tenant tests T1 to T18 (10); what to watch (11); all sources with dates. Read sections 2, 3 and the rows you need from 4, 5 and 8 before answering.
