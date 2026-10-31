---
name: connected-agent-handoff-boundaries
description: Use when the user is designing, reviewing or troubleshooting a Microsoft Copilot Studio agent that delegates to child agents, connected agents, external agents (A2A, Microsoft Foundry, Microsoft 365 Agents SDK), a live agent, or other agents through the Employee Self-Service agent, and needs to decide who may delegate which actions to whom, what context crosses the handoff, what comes back, and where confirmation, approval and credentials must sit. Trigger phrases include "connected agent permissions", "what does a connected agent see", "pass conversation history to this agent", "child agent context", "multi-agent handoff security", "can the subagent delete records", "A2A agent data sharing", "handoff to live agent variables", "Employee Self-Service handoff", "subagent replies twice", "decision boundaries for multi-agent". Do not use for single-agent tool design with no delegation, for non-Microsoft agent frameworks, or for shared agent memory governance.
---

# Connected-Agent Handoff Boundaries

Microsoft's handoff guidance for Microsoft Copilot Studio is spread across three pages: agent-to-agent delegation, handoff to a live agent, and Employee Self-Service agent handoff. A fourth page defines the decision tiers for one agent's actions. No page says who may delegate which kind of action to which kind of agent, or states in one place what survives the handoff. This skill turns the documented mechanics into a decision-boundary pattern per action type. It is advisory: never change agents, settings, policies or credentials.

## Before Starting

Determine the following before proceeding. If the user has not supplied them, ask for the missing ones.

1. **Harness or product** — standard, GitHub Copilot, or Customer Conversation harness in Copilot Studio, or the Employee Self-Service agent in Microsoft Copilot. Behaviour differs by harness (see Step 1); if the user does not know, ask how the agent was created and say which you assumed.
2. **Delegates** — every agent or person the design hands off to, and how: child agent, connected Copilot Studio agent, external agent (A2A, Foundry, Agents SDK, Fabric Data agent, third-party store agent), live agent through an engagement hub, or topic redirect.
3. **Action inventory** — the tools, flows and topics each agent can reach, with each tool's authentication (end-user or maker-provided) and whether **Ask the end user before running** is on. If unknown, classify from tool names and mark the classification provisional.
4. **Delegators** — whether the parent is reached by users in chat, by an event or scheduled trigger, or both.
5. **Artifact wanted** — boundary matrix (default), instruction blocks, handoff contract, review checklist, tenant test plan, or a design review of the whole set.
6. **Documentation date** — if you have web access, re-check the Microsoft Learn pages in the guide's Sources list, compare each page's `ms.date` with the date listed, and say what changed. Otherwise, say you are relying on 30 October 2026.
7. **Tenant observations** — any results the user already has from tests T1 to T10. Report these as *observed in tenant*, separate from *documented* and *not documented*, with the tenant type and date.

## Output Structure

Produce, in this order:

1. **Handoff map** — one line per delegate: delegator, mechanism, harness, delegate.
2. **Documented facts that apply** — bullets with the Microsoft Learn page and its date, using the guide's wording, covering what each mechanism passes, what it returns, and the settings that change either.
3. **Observed in tenant** — only if the user supplied results; otherwise omit the heading.
4. **Boundary matrix** — the guide's section 6.4 table, one row per delegate, with the highest action type (A1 to A6) and every cell filled or marked *unknown*.
5. **Boundary violations** — each place the design breaks one of the seven rules in section 6.3, with the rule number and the fix.
6. **Open questions that apply** — the relevant rows from Q1 to Q10.
7. **Assumptions** — one line listing defaults you applied (harness, classification, artifact, date). Omit if the user supplied everything.
8. **The requested artifact** — built from the matching section of the guide (Step 5).
9. **Recommendation** — a clear position on whether the design is ready, and the conditions that must hold first.
10. **Sources and dates** — one line naming the pages relied on and their dates, plus the preview status of the mechanisms in use.

Use tables for the map, matrix and test plan, numbered lists for checklists, and fenced blocks for any instruction or description text the user will paste into Copilot Studio.

## Step 1: Identify the harness and the mechanisms

Read [references/handoff-guide.md](references/handoff-guide.md) sections 1 and 2. Settle the harness first: the same word means different things.

| User says | Means on | Watch for |
|---|---|---|
| "Child agent" | Standard harness | Always receives parent context; no setting to exclude it |
| "Sub-agent" | Customer Conversation harness (or loosely, any subagent) | Shares configuration, deployment and ALM with the primary agent |
| "Connected agent" | Any harness | Standard: history toggle, same environment, one level. GitHub Copilot: parent is the only communicator; no history setting documented. Customer Conversation: Microsoft Foundry agents only. |
| "A2A agent", "Foundry agent" | Standard or GitHub Copilot harness | External: Microsoft puts responsibility for data flows and approvals on the maker |
| "Hand off to a human", "escalate" | Standard harness, or Customer Conversation escalation paths | Full history and all user-defined topic variables go to the hub |
| "Agent handoff", "hub agent" | Employee Self-Service agent in Microsoft Copilot | Handoff passes history and the original prompt, can cross environments, and can target third-party agents |

If the user mixes harnesses in one design, treat each delegation edge separately.

## Step 2: Establish what crosses each handoff

For each delegate, state from guide section 3 what it receives, what it returns, and what is lost: rephrased requests, citations, a subagent's own messages, Adaptive Card actions, and access. Use Microsoft's wording. Where the guide says *not documented*, say so; do not fill the gap from how another harness behaves.

## Step 3: Classify actions and set the tier where they execute

Classify each delegate by the highest action type among the tools it can reach (guide section 6.1, A1 to A6). Map each type to Microsoft's three tiers (guide section 5): no confirmation, confirmation in the conversation, offline approval. The tier belongs to the agent that owns the tool. Read guide section 4 for where confirmation and credentials are set, and flag every delegate tool at A2 to A5 that uses maker-provided credentials.

## Step 4: Check who may delegate what to whom

Apply guide section 6.2 (the delegation table and the autonomous-delegator rule) and the seven rules in section 6.3. List each violation with its rule number and a concrete fix in Copilot Studio terms, naming the setting, node or input.

## Step 5: Build the artifact

| Artifact | Guide section | Contents |
|---|---|---|
| Boundary matrix | 6.4 | One row per delegate, every column filled or *unknown* |
| Instruction blocks | 7 | Parent, subagent and description blocks, names adapted, Microsoft's lines kept verbatim, boundary lines marked |
| Handoff contract | 8 | Inputs and outputs per delegate, with descriptions written for the orchestrator |
| Review checklist | 11 | The ten checks, each marked pass, fail or unknown for this design |
| Tenant test plan | 10 | The tests that apply to the user's harnesses and delegates; drop tests already run and fold their results into Observed in tenant |
| Design review | 6.4, 6.3, 11 | Matrix, violations, checklist and recommendation together |

Every artifact carries the documentation date and the preview status of the mechanisms it covers.

## Step 6: Recommend, then stop

Give a clear position: ready, ready with listed fixes, or not ready. A design is not ready if any A5 action is reachable by generative routing, if any A2 to A5 delegate tool uses maker-provided credentials without a recorded exception, or if an external delegate receives chat history with no recorded data-sharing decision. Do not offer to change the agents.

## Rules

- **Never** state that a parent's confirmation, credentials or data policy applies to a delegate's tools. Microsoft documents these per tool, in the agent that owns the tool.
- **Never** state that a connected agent receives only the task, unless the user has confirmed that **Pass conversation history to this agent** is cleared on a standard-harness agent. Defaults pass history.
- **Never** claim a history setting, a delegation depth, an admin block for agent connections, or a user-token pass-through exists where the guide says *not documented*. Answer "not documented as of <date>" and name the test that would establish it.
- **Never** present the action types, delegation table, seven rules, `actionsTaken` output or *boundary* instruction lines as Microsoft guidance. They are this skill's pattern on top of Microsoft's facts; label them.
- **Always** keep three classes of fact apart: *documented* (page and date), *observed in tenant* (whose test, when), and *not documented*.
- **Always** quote Microsoft wording from the guide or a live fetch of the cited page, not from memory.
- **Always** resolve the "only agent that talks to the user" conflict (Q6) in favour of the newer subagent page: instruct the subagent to stay silent; do not rely on a parent-only instruction.
- **Always** use Microsoft's current names: standard harness; GitHub Copilot harness ("a Microsoft Copilot Studio authoring and orchestration framework, not the GitHub Copilot service"); Customer Conversation harness, whose specialists are sub-agents; Microsoft Foundry (not Azure AI Foundry); Agent2Agent (A2A); Microsoft 365 Agents SDK; engagement hub; and, for the Employee Self-Service agent, Microsoft Copilot and Copilot Chat as its pages say.
- **Always** keep tenant, agent, user and customer names the user shares out of reusable examples and paste-ready blocks.
- If the design has no delegation, say this skill is the wrong tool and point to the guide's section 5 tiers for a single agent.

## Examples

**Input:** "Our IT helpdesk agent (standard harness) routes to a Facilities connected agent in the same environment and to a vendor's A2A agent that can cancel hardware orders. Users chat with it in Microsoft Teams. What boundaries do we need?"

**Output (abridged):**

> **Handoff map:** Helpdesk → Facilities (connected Copilot Studio agent, standard); Helpdesk → Vendor orders (A2A, standard).
> **Documented facts:** Facilities receives conversation history unless **Pass conversation history to this agent** is cleared; it "is enabled by default" (Design subagents, 27 Aug 2026). The A2A sample payload carries "Full chat history, not just the latest user utterance" (A2A, 26 Aug 2026). For external agents, "you're responsible for the use of such agents" (same page). Confirmation is per tool: **Ask the end user before running** "is set to No by default" (Add tools, 1 Oct 2026).
> **Boundary matrix:** Facilities, A3 (drafts work orders), generative routing, history on (unknown why), end-user credentials, no confirmation, no outputs: *fails rule 4*. Vendor orders, A5 (cancels orders), generative routing, full chat history, OAuth 2.0 connection, no confirmation: *fails rules 1, 3 and 5*.
> **Violations and fixes:**
> - Rule 5: remove the vendor agent from generative routing. Reach it only through a "Cancel order" topic with a confirmation node and a redirect, passing a `scopedRequest` that holds the order number alone.
> - Rule 3: record a data-sharing decision with the vendor that covers chat history, or don't connect the agent.
> - Rule 4: add `answered`, `findings`, `openQuestions` and `actionsTaken` outputs to Facilities, and clear the history toggle.
> **Open questions:** Q1, Q4, Q5.
> **Recommendation:** not ready. Ship Facilities after the rule 4 fix; hold the vendor connection until the redirect topic exists and the data-sharing decision is signed.
> **Sources and dates:** Multi-agent patterns (21 May 2026); Connect to an existing Copilot Studio agent (30 Mar 2026); A2A (26 Aug 2026); Design subagents (27 Aug 2026); Add tools (1 Oct 2026). Standard-harness "Add other agents" is preview documentation.

## References

- [references/handoff-guide.md](references/handoff-guide.md) — where Microsoft's guidance lives (section 1); mechanisms by harness (2); what crosses each handoff, verbatim (3); where credentials and confirmation are set (4); Microsoft's decision tiers (5); this skill's boundary pattern: action types, delegation table, seven rules, matrix template (6); paste-ready instruction blocks (7); handoff contract (8); open questions Q1 to Q10 (9); tenant tests T1 to T10 (10); review checklist (11); what to watch (12); all sources with dates. Read it before answering; read the section named in Step 5 before building an artifact.
