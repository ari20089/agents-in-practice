---
name: shared-agent-memory-governance
description: Use when the user asks how the shared memory of Microsoft Copilot Studio agents with an account (Frontier preview) is governed, whether Microsoft Purview retention, eDiscovery, legal holds, search-and-purge or audit reach it, or needs a governance assessment, legal-hold checklist, data subject request runbook, decommission plan or tenant test plan for it. Trigger phrases include "Copilot Studio agent memory governance", "shared memory retention", "agent account memory eDiscovery", "does Purview cover agent memory", "legal hold on a Copilot Studio agent", "delete what the agent remembers", "DSR for Copilot Studio agent", "business process memory compliance", "decommission an agent with an account", "memory in Agent 365". Do not use for Microsoft 365 Copilot personal memory on its own, GitHub Copilot memory, or memory in non-Microsoft agent frameworks.
---

# Shared Agent Memory Governance

Copilot Studio agents with their own account keep one memory shared by every user who works with them. Microsoft documents that this memory has no privacy boundary between users, that any user can view or delete it, that users cannot opt out, and that admins cannot switch it off without switching off agent accounts. Purview's documented coverage for Copilot Studio rests on prompts and responses stored in Exchange mailboxes; no Microsoft page says where shared memory is stored or whether retention, holds, eDiscovery or audit reach it. This skill helps you reason about that gap accurately and produce what the user needs. It is read-only: never change tenant settings, policies or agents.

## Before Starting

Determine the following before proceeding. If the user has not supplied them, ask for the missing ones.

1. **Which memory** — which of the four features called "memory" the user means (see Step 1). Defaults to shared memory for agents with an account if they mention agent accounts, Frontier, "AI teammate" or "business process memory".
2. **Scenario** — approval of a new agent, a pilot, a legal hold, a data subject request, a retention schedule review, or decommissioning.
3. **Artifact wanted** — governance assessment, memory rules for the agent's instructions, legal-hold checklist, DSR runbook, decommission plan, retention schedule entry, or tenant test plan. Defaults to a short structured assessment if not stated.
4. **Documentation date** — if you have web access, re-check the cited Microsoft Learn pages (see References), compare each page's `ms.date` with the date in the guide's Sources list, and note what changed. If you do not have web access, say you are relying on 30 October 2026.
5. **Tenant observations** — whether the user has already run any of the guide's tests (T1 to T7) or has other first-hand results. If so, treat those as a third class of fact, *observed in tenant*, distinct from *documented* and *not documented*, and say which tenant and date they came from.

## Output Structure

Produce, in this order:

1. **Memory type** — one line naming which feature applies and, if the user conflated two, saying so.
2. **Documented facts** — bullet list, each with the Microsoft Learn page and its date, using the wording from the reference guide. Mark anything the guide flags as inferred (for example the Entra Agent ID deletion statement, which sits on a standard-harness page) as inferred, not documented.
3. **Observed in tenant** — only if the user supplied test results; otherwise omit the heading.
4. **Purview coverage** — a table with rows for prompts and responses, the agent account's own mail and Teams traffic, and shared memory; columns for retention, eDiscovery search, hold, search-and-purge, audit, classification/DLP. Cells say *documented*, *documented (treat agent as a user)*, *observed in tenant*, or *not documented*.
5. **Open questions that apply** — the relevant rows from Q1 to Q10 in the reference guide.
6. **Assumptions** — one line listing any default you applied from Before Starting (memory type, artifact, date). Omit if the user supplied everything.
7. **The requested artifact** — built from the matching section of the reference guide (see Step 5).
8. **Recommendation** — a clear position, plus the conditions under which the user should decline agent accounts for the process.
9. **Sources and dates** — one line listing the pages relied on and their dates, plus "Frontier preview, subject to change".

Use tables for the matrix and test plan, numbered lists for runbooks, and a fenced block for any instruction text the user will paste into an agent.

## Step 1: Identify which memory the user means

Read [references/governance-guide.md](references/governance-guide.md) section 1. Four features are called memory:

| User is talking about | Treatment |
| --- | --- |
| A Copilot Studio agent **with an account** (Frontier), "business process memory", shared across a team | This skill. Memory is per-agent, shared, undocumented in Purview. |
| A Copilot Studio agent **without an account** on the GitHub Copilot harness | Per-user memory in Microsoft-managed storage, off in group chats and Teams channels, 28-day inactivity expiry, maker cannot see it. Also undocumented in Purview. Answer from the guide's section 1 and say shared-memory specifics do not apply. If the user hears "GitHub Copilot" and worries about data going to GitHub, give them the harness statement in section 1: it is a Copilot Studio runtime, not the GitHub Copilot service. |
| Customer Conversation harness memory | Structured schema, 30-day window, per customer. Out of scope; point to its own documentation. |
| **Microsoft 365 Copilot** memory (saved memories, custom instructions, `CopilotMemory` mailbox folder) | Different product with different coverage (eDiscovery via `IPM.Contact`, retention added by MC1478965). Explain the difference; do not let the user assume parity. |

If the user conflates two of these, say so explicitly before continuing.

## Step 2: State what is documented, with dates

Take the facts from the guide's section 2 verbatim or near-verbatim, each with its page and date. The facts that matter most:

- one memory per agent, shared by all users, even in one-to-one chats;
- "shared memory has no privacy boundary between users";
- content can surface to users without permission to the source "regardless of sensitivity label"; the agent "can't read protected documents" (Microsoft's word is *protected*; read it as labels that encrypt, and say so);
- anyone who interacts with the agent can view or delete its memories, by asking it in chat; the FAQ names no other surface;
- auto-deletion after 28 days with no interaction;
- no user opt-out; no admin switch except disabling agent accounts (Microsoft 365 admin center template activation, Power Platform admin center environment setting);
- Microsoft lists what shared memory "excludes" but does not say how that is enforced; the page's only enforcement word is "guided";
- deleting the agent deletes the Entra Agent ID, per a page scoped to the standard harness, so inferred for agents with accounts; memory is not mentioned anywhere.

Label the material as Frontier preview and give the date you rely on.

## Step 3: Map Purview coverage honestly

Use the guide's section 3 matrix. Distinguish the three data types every time:

1. **Prompts and responses** with the agent: retention (Microsoft Copilot experiences location), eDiscovery (`IPM.SkypeTeams.Message.Copilot.Studio.*`), holds, Graph `purgeData`, audit. All documented.
2. **The agent account's own mail and Teams traffic**: treat the agent instance like a user in retention, eDiscovery, DLP and audit policies. Documented for Agent 365.
3. **Shared memory**: not documented for any Purview capability. Say "not documented", not "not supported"; they are different claims, and the test plan exists to find out which is true in the user's tenant.

## Step 4: Surface the open questions that apply

Pull the relevant rows from the guide's section 4 (Q1 to Q10):

- Hold or litigation: Q1, Q3, Q4, Q5
- DSR or erasure: Q1, Q5, Q8
- Retention schedule: Q2, Q7
- Decommissioning or the maker leaving: Q6, Q10
- Data residency: Q9

## Step 5: Produce the artifact

Build it from the guide, adapted to the user's situation:

| Request | Guide section | Output shape |
| --- | --- | --- |
| Governance assessment / should we approve this agent | 5.1, 5.2, 5.3, 7 | Decision with reasons, required controls, blocking conditions |
| Memory rules for the agent's instructions | 5.2 | Instruction block naming authoritative records and exclusions, tailored to the user's data |
| Legal-hold checklist | 5.6 | Ordered steps: the agent's and users' mailboxes added to the case as data sources and held, immediate memory export, user instructions, mailbox search, case-file note |
| DSR runbook (access or erasure) | 5.7 | Access path, erasure path, evidence capture, caveat that purging interactions does not purge memory |
| Decommission plan | 5.8 | Six-step order with what to record at step 6, plus the deputy-owner and leaver-checklist items |
| Retention schedule entry | 5.5 | Entry text stating what is covered, what is not, and the 28-day caveat |
| Tenant test plan | 6 | Tests T1 to T7 with steps, what to record, and which question each answers; drop tests the user has already run and fold their results into Observed in tenant |

Every artifact carries the documentation date and a line saying the feature is in preview.

## Step 6: Recommend, then stop

End with a clear recommendation and the conditions in the guide's section 7 under which the user should decline agent accounts for the process. Do not offer to change settings, create policies or delete anything.

## Rules

- **Never** invent a storage location, item class, audit event or retention behaviour for shared memory. If asked directly, answer "not documented as of <date>" and point to the test that would establish it.
- **Never** present Microsoft 365 Copilot memory behaviour (mailbox folder, `IPM.Contact`, MC1478965 retention) as applying to Copilot Studio shared memory.
- **Never** describe the exclusion list as enforcement or as a filter. Microsoft states what shared memory excludes and does not document how; say so.
- **Never** tell the user a hold preserves shared memory, a retention policy deletes it, or an eDiscovery search returns it. Nothing in the documentation supports those claims.
- **Always** quote Microsoft wording from the reference guide or a live fetch of the cited page, not from memory.
- **Always** keep the three classes of fact apart in the output: *documented* (cited page and date), *observed in tenant* (the user's own test, which tenant, when), and *not documented*. Never let a tenant observation be restated as if Microsoft documented it.
- Use current names: **Data Security Posture Management** (not "DSPM for AI", which is the classic version and, per Microsoft, does not support Agent 365); **eDiscovery** organised around cases and data sources, with "premium eDiscovery features" for what needs E5 (not "eDiscovery (Premium)" or "(Standard)" as product names, and "custodian" only as the legal term); and the **Agent Registry** (Microsoft 365 admin center > Agents > All agents > Registry; Microsoft's overview also calls it the Agent 365 registry).
- **Always** keep tenant names, agent names, user names and case details the user shares out of any example you generate for reuse.
- If the question is really about Microsoft 365 Copilot memory alone, say this skill is the wrong tool and summarise the relevant difference instead.

## Examples

**Input:** "Legal just put a hold on the quarterly forecasting process. Our Forecast Bot has an agent account and has been running it since August. What do we need to do about its memory?"

**Output (abridged):**

> **Memory type:** Shared memory for an agent with an account (Frontier preview).
> **Documented facts:** anyone who interacts with the agent can view or delete its memories (FAQ for agent accounts, 14 Oct 2026). Not documented: any hold protection for memory, any audit of memory actions.
> **Coverage:** prompts/responses and the bot's own mailbox traffic can be preserved by adding the bot's and the users' mailboxes to the case as data sources and placing them on hold (documented). Shared memory: not documented for hold, search or audit.
> **Open questions:** Q1, Q3, Q4, Q5.
> **Legal-hold checklist:** (1) in the eDiscovery case, add Forecast Bot's mailbox and the human users' mailboxes as data sources and place them on hold; (2) today, export what the bot currently remembers by asking it in chat and file it under the case; (3) instruct users in the hold notice not to ask the bot to forget anything and not to use any "delete memories" option it offers; (4) search the bot's mailbox in the case for `IPM.Contact` and the Copilot Studio item classes and record whether memory items surface; (5) note in the case file that shared memory has no documented hold protection or audit trail.
> **Recommendation:** proceed with the checklist today; treat the memory export as the only reliable preservation until Microsoft documents otherwise.
> **Sources and dates:** FAQ for agent accounts (14 Oct 2026); Purview for Copilot Studio (1 May 2026); eDiscovery AI data (19 Jun 2026). Frontier preview, subject to change.

## References

- [references/governance-guide.md](references/governance-guide.md) — the verbatim documented facts, the four-way memory comparison, the Purview reach matrix, open questions Q1 to Q10, the governance model (sections 5.1 to 5.8), the tenant test plan (T1 to T7), the decline conditions (section 7), what to watch (section 8), and all Microsoft Learn sources with dates. Read it before answering; read the specific section named in Step 5 before building an artifact.
