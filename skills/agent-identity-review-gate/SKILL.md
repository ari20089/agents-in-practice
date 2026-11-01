---
name: agent-identity-review-gate
description: Use when the user needs to decide whether a Microsoft Copilot Studio agent with its own agent account (Frontier preview, with a mailbox, an Entra Agent ID, shared memory and event triggers) may go live, or needs a go-live review, gate record, owner and sponsor map, decision-rights matrix, credit cap plan, audit evidence pack or tenant test plan for one. Trigger phrases include "agent account go-live review", "approve an agent with an account", "who owns this Copilot Studio agent", "Entra Agent ID sponsor", "agent reports to the maker", "what can the agent do on its own", "autonomous agent triggers identity", "cap Copilot Credits for an agent", "per-agent credit limit", "Agent 365 audit", "quarantine an agent account", "production readiness for an AI teammate". Do not use for shared memory retention, holds or eDiscovery on their own (use the shared-agent-memory-governance skill), for multi-agent handoff design, for standard harness agents without an account, or for non-Microsoft agent frameworks.
---

# Agent Identity Review Gate

A Copilot Studio agent with an account has its own user-like account, a separate Microsoft Entra Agent ID, shared memory and triggers that let it act without a prompt. Microsoft documents the parts across Copilot Studio, Entra, Power Platform, Microsoft 365 admin center and Purview pages, and leaves several gaps: whose identity a triggered run uses, what an owner change does to the account, and whether Agent 365 audit events cover these agents. This skill runs a go-live gate over four questions (owners, decision rights, credit caps, audit) and returns **Go**, **Go with conditions** or **No go** with evidence. It is advisory: never change agents, settings, policies, limits or identities.

## Before Starting

Determine the following before proceeding. If the user has not supplied them, ask for the missing ones.

1. **Agent under review** — purpose, environment, and whether it is already published. If not published, say that the alias and "reports to" relationship are still open and become fixed at publish.
2. **Process and audience** — the business process it runs, who can message it, and which groups or distribution lists include it.
3. **Inventory** — every trigger (event, options, **Editable by user**, activation mode), tool, workflow, MCP server and hook, with each tool's authentication mode. If incomplete, review what is given and mark missing items *Unknown*.
4. **Role-holders** — maker, Copilot Studio owner, business sponsor, deputy, cost owner, audit reviewer, stop authority, data and memory owner, by role. Do not ask for names.
5. **Cost setup** — environment allocation, **Draw from the available capacity in my tenant**, pay-as-you-go plan, per-agent limit, any Microsoft 365 admin center spending policy.
6. **Artifact wanted** — full gate review (default), gate record, owner map, decision-rights matrix, decision-rights instruction block, credit cap worksheet, audit evidence pack, stop runbook, or tenant test plan.
7. **Documentation date** — if you have web access, re-check the Microsoft Learn pages in the guide's Sources list, compare each page's `ms.date` with the date listed, and say what changed. Otherwise, say you are relying on 31 October 2026.
8. **Tenant observations** — results the user already has from tests T1 to T12. Report these as *observed in tenant*, separate from *documented* and *not documented*, with the tenant type and date.

## Output Structure

Produce, in this order:

1. **Agent** — one line: purpose, environment, published or not, audience.
2. **Verdict** — **Go**, **Go with conditions** or **No go**, with the one or two reasons that decide it.
3. **Documented facts that apply** — bullets with the Microsoft Learn page and its date, using the guide's wording. Mark anything the guide calls inferred or scoped to the standard harness.
4. **Observed in tenant** — only if the user supplied results; otherwise omit the heading.
5. **Gate results** — the guide's section 7 criteria A1 to F3 as a table: criterion, result (*Pass*, *Fail*, *Unknown*), evidence or what is missing, Blocking or Condition.
6. **Blocking issues and conditions** — each failed or unknown Blocking criterion with the fix; each open Condition with an owner role and a date.
7. **Open questions that apply** — the relevant rows from Q1 to Q11.
8. **Assumptions** — one line listing defaults you applied. Omit if the user supplied everything.
9. **The requested artifact** — built from the matching guide section (Step 7).
10. **Sources and dates** — one line naming the pages relied on and their dates, plus "Frontier preview, subject to change".

Use tables for the gate, the owner map, the matrix and the test plan; numbered lists for runbooks; fenced blocks for anything the user will paste into Copilot Studio or file as a record.

## Step 1: Confirm scope

Read the short version and section 1 of [references/gate-guide.md](references/gate-guide.md). Confirm the agent has, or will have, an account: Copilot Studio Preview, early release environment, **Agent account** added before first publish. Then route:

| The user is asking about | Do |
|---|---|
| Going live, approval, ownership, autonomy, cost or audit of an agent with an account | Continue with this skill |
| Shared memory retention, holds, eDiscovery, DSRs or deletion only | Say the shared-agent-memory-governance skill covers it; still apply criterion F1 if running the gate |
| Delegation to child, connected or external agents | Out of scope; name the multi-agent handoff design as a separate review |
| A standard harness agent with no account | Out of scope; the identity, trigger and billing facts differ |

## Step 2: Check ownership

Use guide section 2. Build the role map in section 2.3 from the user's answers and mark every empty row. State the fixed facts plainly: the alias uses the maker's alias as a prefix, the agent reports to the maker, and neither can be changed during the preview; Copilot Studio adds the agent owner as a sponsor on the Entra Agent ID, not as an owner; sponsorship transfers to the sponsor's manager when the sponsor leaves, through a Lifecycle Workflows task; an admin reassignment removes all access from the previous owner. Say that Frontier has no SLA and that Microsoft can withdraw the feature, so the process owner must accept that and keep a fallback (A5). Score A1 to A5 and B1 to B4.

## Step 3: Check decision rights

Use guide section 3.

1. List each trigger with its activation mode. For **Activate for myself**, record that the documentation says it runs "using your own maker credentials"; for an agent with an account, the identity is not documented (Q1).
2. List each tool with its authentication mode and the identity it acts as. Note which connectors add scopes to the Entra Agent ID and which (custom connectors, MCP servers, REST tools) do not.
3. Classify every action D0 to D4 (section 3.6). The class is the highest the tool can reach, not what the instructions say it should do.
4. Check controls per class. Say explicitly that no human approval or confirmation step is documented for this harness, that hooks fail open and Post tool use fires only on success (log failures with After tool failure), and that Conditional Access on the agent identity is enforced only in Teams.
5. Check the stop path (section 3.7): which one the team will use, who holds it, and whether T11 has shown it stops a trigger-driven run. None of the paths is documented to stop triggers for an agent with an account (Q7). If the environment's IP firewall is in active enforcement mode, Microsoft 365 admin center actions fail and the Power Platform API is the fallback.

Score C1 to C9.

## Step 4: Check credit caps

Use guide section 4. Confirm that every activity on this harness is billed, from the first build session, and that the Frontier licence is separate from credits. Check for a per-agent limit with a notification threshold and **Stop usage** on, an environment allocation with tenant draw cleared, and a fallback for when the agent stops. Treat Azure budgets as alerts only. Check that only tenant administrators can change allocations, because environment administrators given that right get it across every environment. If a Microsoft 365 admin center resource-based policy covers the agent, note that it takes precedence and that behaviour at its per-agent limit is not documented (Q6). If the user has no sizing, offer the worksheet in section 8.4 instead of a number. Score D1 to D5.

## Step 5: Check audit

Use guide section 5. Map what the audit reviewer can reconstruct from Purview Audit (Copilot Studio events), Entra logs, Monitor (28 days), Copilot Studio's per-agent protection status, Data Security Posture Management AI observability, Microsoft 365 admin center lifecycle events and any Post tool use hook. Say which questions in the section 5.2 table have no documented source, including whether trigger runs with no signed-in user are audited (Q5). Then check data protection from section 1 and 3.4: encrypting labels must not grant the agent VIEW and EXTRACT, content the agent creates is unlabelled, and Purview DLP needs the agent instance in scope and an owner watching its blocks. Score E1 to E6 and F1 to F3.

## Step 6: Apply the verdict rules

Apply section 7's verdict rules exactly: any Blocking criterion that is *Fail* or *Unknown* means **No go**; open Conditions with an owner and date allow **Go with conditions**; **Go** needs every criterion to pass; a criterion that rests on behaviour Microsoft has not documented passes only on a recorded tenant test. Do not soften a **No go** because the agent is low-risk; say which Blocking criteria to fix and how.

## Step 7: Build the artifact

| Request | Guide section | Output shape |
|---|---|---|
| Full gate review (default) | 7, plus 2.3 and 3.6 | The Output Structure above |
| Gate record | 8.1 | Filled template |
| Owner map | 2.3 | Table with every role, holder by role, gaps marked |
| Decision-rights matrix | 3.6, 8.2 | One row per action with class, identity, controls, human step |
| Instruction block | 8.3 | Fenced block adapted to the user's tools and audience |
| Credit cap worksheet | 4.5, 8.4 | Table with the user's figures, blanks where they have none |
| Audit evidence pack | 5, 8.5 | Ordered checklist with where each item comes from |
| Stop runbook | 3.7 | Chosen path, holder, steps, and the T11 result |
| Tenant test plan | 9 | Tests that apply; drop tests already run and fold results into Observed in tenant |

Every artifact carries the documentation date and the preview status.

## Step 8: Recommend, then stop

End with the verdict, the shortest path to **Go**, and the re-review triggers from section 7. Do not offer to change settings, set limits, add sponsors, write policies or publish anything.

## Rules

- **Never** state whose identity a trigger runs under for an agent with an account. It is not documented; say so and point to T1.
- **Never** describe a human approval, confirmation or "ask before running" step as available on the Microsoft Copilot harness. The documented ones are on standard harness pages.
- **Never** present a hook, instructions or Azure budget as a hard control. Hooks fail open; instructions are guidance; budgets alert only.
- **Never** treat the Agent 365 `AIInvokeAgent` or `AIExecuteTool` events as documented for these agents (Q5), or claim the data policy trigger block applies to this harness (Q4).
- **Never** say a block, quarantine, turn-off, **Stop usage** or Entra disable stops trigger-driven runs of an agent with an account (Q7), or that Frontier carries an SLA.
- **Never** quote credit rates for this harness. Microsoft publishes them only as ranges in a diagram; use pilot consumption and the estimator.
- **Always** keep the two Entra identities apart: a Conditional Access policy or sponsor on the agent identity does not cover the agent's user account, and the reverse.
- **Always** keep the three classes of fact apart in the output: *documented* (page and date), *observed in tenant* (which tenant, when), and *not documented*.
- **Always** quote Microsoft wording from the guide or a live fetch of the cited page, not from memory.
- Use current names: **Microsoft Copilot harness** (named the GitHub Copilot harness until 28 October 2026; keep the old name in Learn page titles and quotes, which still use it; a Copilot Studio runtime, not the GitHub Copilot service; quote the harness page if asked), **Data Security Posture Management** for the current Purview experience (the classic version does not support Agent 365; the Copilot Studio audit page still reaches `CopilotInteraction` transcripts through "Data Security Posture Management (DSPM) for AI", so use that name when citing it), **Microsoft Entra admin center**, **Agent Registry**, and **data policies** for Power Platform as distinct from **Microsoft Purview Data Loss Prevention**.
- **Always** refer to role-holders by role in anything generated for reuse; keep tenant, agent, user and environment names out of examples.
- If the agent is already published and A4 fails, say the identity cannot be corrected in the preview and that the options are to accept it or to build a new agent.

## Examples

**Input:** "Ops built 'Cadence', an agent with an account that reads our workstream tracker every Monday, updates the status column and emails the reviewer group. It's published, activated for the maker, no limits set. Can we roll it out to the department?"

**Output (abridged):**

> **Agent:** weekly execution review; published; activated for the maker; audience to widen to the department.
> **Verdict:** **No go.** No per-agent credit limit (D1), and the status update writes to a shared record with no hook or log (C4) while the trigger is documented only as "using your own maker credentials" (identity: Q1).
> **Documented facts:** "Activate for myself: Only you, the maker, can use the agent, using your own maker credentials" (Add triggers, 20 Oct 2026). Agent reports to the maker; alias and reporting relationship can't be changed in preview (Give your agent an account, 15 Oct 2026). Per-agent limit with **Stop usage** turns the agent off at the limit, not instantly (Manage Copilot Credits and capacity, 14 Oct 2026). Not documented: whether the trigger acts as the agent account or the maker (Q1).
>
> | # | Criterion | Result | Evidence or gap | Type |
> |---|---|---|---|---|
> | B2 | Business sponsor beside auto-added owner | Unknown | Entra sponsors not checked | Blocking |
> | C4 | D2 write has hooks and individual operation | Fail | Whole SharePoint connector, no hooks | Blocking |
> | D1 | Per-agent limit, threshold, Stop usage | Fail | None set | Blocking |
> | C9 | Stop path proved on a test agent | Unknown | No path chosen; T11 not run | Blocking |
> | E4 | Transcript retention for D2 actions | Fail | Monitor keeps 28 days; no export | Blocking |
>
> **Fixes:** add the reviewer group as a sponsor; replace the connector with the single update-item action and add Pre tool use, Post tool use and After tool failure hooks; set a limit sized from last month's report with **Stop usage** on; schedule a monthly transcript export; name the stop authority and run T11 with Block. Then run T1 to settle the trigger identity before widening the audience.
> **Sources and dates:** Add triggers (20 Oct 2026); Give your agent an account (15 Oct 2026); Manage Copilot Credits and capacity (14 Oct 2026); Monitor (28 Sep 2026). Frontier preview, subject to change.

## References

- [references/gate-guide.md](references/gate-guide.md) — the three objects behind an agent with an account, documented facts on owners and sponsors (section 2), triggers, tools, Conditional Access, data policies, Purview DLP, hooks, action classes D0 to D4 and stop paths (section 3), credit controls and sizing (section 4), audit sources and gaps (section 5), open questions Q1 to Q11 (section 6), gate criteria A1 to F3 and verdict rules (section 7), artifact templates (section 8), tenant tests T1 to T12 (section 9), and all sources with dates. Read it before answering; read the section named in each step before scoring it.
