# Agent Identity Review Gate

## Summary

Copilot Studio agents with their own account (Frontier preview) get a mailbox, a place in Teams and the directory, a separate **Microsoft Entra Agent ID**, one **shared memory** for everyone who works with them, and **triggers** that let them act without anyone asking. Each of those parts is documented on a different Microsoft page, under a different admin center, and some of what matters before go-live is not documented at all: whose identity a triggered run uses, what an owner change does to the agent's account, and whether Agent 365 audit events cover these agents.

This skill runs a go-live gate over four questions (**who owns it, what it may decide on its own, how its Copilot Credits are capped, and what is audited**) and returns **Go**, **Go with conditions** or **No go**, with the evidence for each criterion and the fixes for each failure.

## Skill

The full skill definition is in [`SKILL.md`](./SKILL.md), which points the agent at [`references/gate-guide.md`](./references/gate-guide.md) for the dated facts, the owner and sponsor model, the decision-rights classes, the credit controls, the audit sources, the gate criteria, the templates and the tenant test plan. Copy the **whole folder** into your host's skills directory (see [skills/README.md](../README.md)).

### Trigger phrases

- *"Can we roll this agent with an account out to the department?"*
- *"Who actually owns a Copilot Studio agent that reports to its maker?"*
- *"Is the maker added as owner or sponsor on the Entra Agent ID?"*
- *"What can this agent do on its own once the trigger fires, and as whom?"*
- *"How do we cap Copilot Credits for one agent?"*
- *"What will audit be able to see about what this agent did last month?"*
- *"Write the gate record for this AI teammate."*
- *"How do we stop this agent fast if it misbehaves?"*
- *"Give me a test plan for the things Microsoft doesn't document yet."*

## Description

The skill works through eight steps:

1. **Confirm scope.** It must be an agent with an account. Shared memory retention and holds go to the [shared-agent-memory-governance](../shared-agent-memory-governance/) skill, and the gate keeps one memory criterion that points there.
2. **Ownership.** It builds a role map: maker and "reports to" (fixed at publish in the preview), Copilot Studio owner, Entra Agent ID sponsor (Copilot Studio adds the agent owner as a sponsor, not an owner), deputy, cost owner, audit reviewer, stop authority and data owner. It also covers the leaver and reassignment mechanics Microsoft documents.
3. **Decision rights.** It lists triggers and their activation mode, and tools with their authentication mode and identity. It classifies every action from D0 (read) to D4 (prohibited). It is explicit that no human approval step is documented for this harness, that hooks fail open, and that Conditional Access on the agent identity is enforced only in Teams. It also asks how the agent is stopped in an incident (block, quarantine, turn off, Stop usage or Entra disable) and requires that path to be proved on a test agent, because none is documented to stop trigger-driven runs.
4. **Credit caps.** Every activity on this harness is billed from the first build session. Of the credit controls, only a per-agent limit with **Stop usage** stops an agent, and not instantly. Azure budgets only alert. A Microsoft 365 admin center spending policy takes precedence over Power Platform admin center controls.
5. **Audit and data protection.** It maps what can be reconstructed from Purview Audit, Entra logs, the Monitor tab (28 days), Copilot Studio's protection status, Data Security Posture Management AI observability and the Microsoft 365 admin center, and names the gaps. It checks that encrypting labels don't grant the agent VIEW and EXTRACT, notes that content the agent creates isn't labelled, and puts the agent instance in a Purview DLP policy.
6. **Verdict.** Fixed rules: a failed or unknown Blocking criterion means **No go**.
7. **Artifact.** Gate record, owner map, decision-rights matrix, instruction block, credit cap worksheet, audit evidence pack, stop runbook, or the twelve-test tenant plan.
8. **Recommend, then stop.** It never changes settings, limits, sponsors or agents.

## Prerequisites

- None to run; the skill is self-contained.
- If the host has web access, the skill re-checks the cited Microsoft Learn pages and reports what changed since the date it relies on.
- To act on the output you need the usual Microsoft 365 admin center (AI Administrator), Power Platform admin center, Microsoft Entra (Conditional Access Administrator, Lifecycle Workflows Administrator) and Purview Audit roles.

## Limitations

- Agent accounts are a **Frontier** feature. Microsoft states there is no SLA for Agent 365 Frontier and that support can be removed at any time; the gate makes the process owner accept that before go-live.
- Written against **Frontier preview** documentation. Every source was re-read on 31 October 2026. Agent accounts, triggers and hooks on the GitHub Copilot harness, agent user targeting in Conditional Access and agent risk are all prerelease.
- Several Entra Agent ID and Purview pages predate agent accounts (April to June 2026, and Purview for Agent 365 from May 2026). The skill applies them to agents with accounts only where a Copilot Studio page links them, and otherwise marks the link as an open question.
- Three standard-harness pages are cited only to show what is *not* documented for this harness (maker-credential triggers, **Ask the end user before running**, **Request for information**); the skill never applies them to agents with accounts.
- Microsoft publishes credit consumption for this harness only as ranges in a diagram, so the skill sizes caps from your pilot consumption, not from rates.
- This is not legal, financial or audit advice. Verify against the cited pages before relying on the output for an approval decision.

## Sources

Microsoft documentation, with the date shown on the page when retrieved on 31 October 2026:

- [Give your agent an account (Frontier)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/authoring-agent-account), 15 Oct 2026
- [FAQ for agent accounts (Frontier)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/faq-agent-accounts), 14 Oct 2026
- [Preview Agent 365 features through the Frontier program](https://learn.microsoft.com/en-us/microsoft-agent-365/frontier), 15 Oct 2026
- [Harnesses in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/harnesses-overview), 19 Oct 2026
- [App registration, agent identities, and authentication](https://learn.microsoft.com/en-us/microsoft-copilot-studio/govern-agents-identities-overview), 21 Aug 2026
- [Add triggers to an agent (GitHub Copilot) (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/authoring-add-event-trigger), 20 Oct 2026
- [Set up a shared autonomous agent (GitHub Copilot) (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/end-user-manage-shared-agent), 20 Oct 2026
- [Share agents with other users and makers (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/authoring-share-agent), 20 Oct 2026
- [Set up your connections when an agent asks](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/end-user-connections), 16 Oct 2026
- [Hooks (GitHub Copilot) (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/hooks-overview), 29 Sep 2026
- [Event triggers overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-triggers-about), 9 Sep 2026 (scoped to the standard harness)
- [Add tools to custom agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent), 1 Oct 2026 (scoped to the standard harness)
- [Request information from human review in agent flows](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-request-for-information), 18 Jun 2026 (scoped to the standard harness)
- [Configure data policies for agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-data-loss-prevention), 1 Oct 2026
- [Overview of usage-based billing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/billing-credit-overview), 6 Oct 2026
- [Enforcement policy for agents consuming Copilot Credits](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/enforcement-policy-credits), 3 Aug 2026
- [Manage costs for agents powered by the GitHub Copilot harness](https://learn.microsoft.com/en-us/power-platform/admin/manage-usage-github-copilot-harness), 28 Oct 2026
- [Manage Copilot Credits and capacity for Copilot Studio](https://learn.microsoft.com/en-us/power-platform/admin/manage-copilot-studio-copilot-credits-capacity), 14 Oct 2026
- [Govern Copilot Credit consumption for agents powered by the GitHub Copilot harness](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/govern-credit-consumption), 6 Oct 2026
- [Manage Copilot Studio costs in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-365/copilot/usage-based-billing-manage-copilot-studio-costs), 30 Oct 2026
- [Resolve Copilot Studio usage limit and agent unavailable errors](https://learn.microsoft.com/en-us/troubleshoot/power-platform/copilot-studio/licensing/throttling-errors-agents), 14 Oct 2026
- [Monitor agent performance overview (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/analytics-overview), 28 Sep 2026
- [View Copilot Studio audit logs in Purview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-logging-copilot-studio), 18 Aug 2026
- [Agent runtime protection status](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-agent-runtime-view), 1 May 2026
- [Audit log activities](https://learn.microsoft.com/en-us/purview/audit-log-activities), 15 Oct 2026
- [Use Microsoft Purview to manage data security and compliance for Microsoft Agent 365](https://learn.microsoft.com/en-us/purview/ai-agent-365), 1 May 2026
- [Administrative relationships in Microsoft Entra Agent ID (owners, sponsors, and managers)](https://learn.microsoft.com/en-us/entra/agent-id/agent-owners-sponsors-managers), 16 Apr 2026
- [Governing agent identities](https://learn.microsoft.com/en-us/entra/id-governance/agent-id-governance-overview), 5 Jun 2026
- [Agent identity sponsor tasks in Lifecycle Workflows](https://learn.microsoft.com/en-us/entra/id-governance/agent-sponsor-tasks), 25 Oct 2025
- [Manage agents in end user experience](https://learn.microsoft.com/en-us/entra/agent-id/manage-agent-identities-end-user), 1 May 2026
- [Conditional Access for agents](https://learn.microsoft.com/en-us/entra/identity/conditional-access/agent-id), 31 Jul 2026
- [Secure agent users with Microsoft Entra Conditional Access](https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-agent-user), 31 Jul 2026
- [Microsoft Entra Agent ID logs](https://learn.microsoft.com/en-us/entra/agent-id/sign-in-audit-logs-agents), 28 Apr 2026
- [Governance and lifecycle actions for agents in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-actions), 23 Sep 2026
- [Agent Registry in Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-registry-overview), 21 Sep 2026
- [Discover, create, and onboard agents with their own identity (preview)](https://learn.microsoft.com/en-us/microsoft-agent-365/onboard), 25 May 2026
- [Use the Power Platform API to quarantine agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-api-quarantine), 14 Jul 2026

The agent reads the same list at the end of [`references/gate-guide.md`](./references/gate-guide.md).

## Contributors

| Name | Links |
| --- | --- |
| Arindam Choudhury | [GitHub](https://github.com/ari20089) · [LinkedIn](https://www.linkedin.com/in/arindam-choudhury/) |

## Version history

| Version | Date | Comments |
| --- | --- | --- |
| 1.0 | November 2026 | Initial release |

## Help

Skills are community samples without support. Search [existing issues](https://github.com/ari20089/agents-in-practice/issues) or [open a new one](https://github.com/ari20089/agents-in-practice/issues/new/choose). For Microsoft product questions use Microsoft Learn or your Microsoft support channel.

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
