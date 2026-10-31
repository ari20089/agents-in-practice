# Connected-Agent Handoff Boundaries

## Summary

Copilot Studio agents can hand work to child agents, connected agents, external agents (A2A, Microsoft Foundry, Microsoft 365 Agents SDK), people through an engagement hub, and, through the Employee Self-Service agent in Microsoft Copilot, other agents. Microsoft's guidance for this is **spread across three pages** (multi-agent patterns, live-agent handoff, Employee Self-Service handoff). The decision tiers (no confirmation, confirmation in the conversation, offline approval) are on a fourth page, scoped to one agent. **No page defines who may delegate which kind of action to whom, or what survives the handoff.**

This skill gathers the documented mechanics into one dated reference and adds a decision-boundary pattern per action type. Makers, architects and reviewers can then approve a multi-agent design with the gaps in view.

## Skill

The full skill definition is in [`SKILL.md`](./SKILL.md), which points the agent at [`references/handoff-guide.md`](./references/handoff-guide.md) for the verbatim facts, the boundary pattern, paste-ready instruction blocks, the handoff contract, the open questions and the test plan. Copy the **whole folder** into your host's skills directory (see [skills/README.md](../README.md)).

### Trigger phrases

- *"What does a connected agent see of the conversation?"*
- *"Can our subagent delete records the parent isn't allowed to?"*
- *"Review the boundaries in our helpdesk agent's multi-agent design."*
- *"Write instructions so the child agent stops replying twice."*
- *"What gets sent to the live agent when we hand off?"*
- *"Is it safe to connect a vendor's A2A agent?"*
- *"Give me a test plan for our connected agents before go-live."*

## Description

The skill works through six steps:

1. **Identify the harness and the mechanisms.** "Child agent", "sub-agent" and "connected agent" behave differently on the standard, GitHub Copilot and Customer Conversation harnesses, and in the Employee Self-Service agent. The skill settles which one applies before answering.
2. **Establish what crosses each handoff**, in Microsoft's words:
   - Child agents always get the parent's context.
   - Standard-harness connected agents get history unless a default-on box is cleared.
   - The A2A sample sends full chat history.
   - Live-agent transfers send all user-defined topic variables.
   - Requests are rephrased, citations can be lost, and access to the parent doesn't grant access to its connected agents.
3. **Classify actions and set the tier where they execute.** Six action types (answer, read scoped data, prepare, commit, irreversible, hand over the conversation) map onto Microsoft's three tiers. Confirmation and credentials are set per tool, in the agent that owns it, and do not travel with a delegation.
4. **Check who may delegate what to whom** against a delegation table and seven rules: tier travels with the action, privilege ceiling, least context, return contract, no description routing for irreversible actions, flat and explicit, same audience.
5. **Produce the artifact requested:** boundary matrix, instruction blocks, handoff contract, review checklist, ten-test tenant plan, or a full design review.
6. **Recommend, then stop.** It never changes agents, settings or credentials.

The action types, delegation table, seven rules and `actionsTaken` output are this skill's pattern. They are labelled as such and are kept separate from what Microsoft documents.

## Prerequisites

- None to run; the skill is self-contained.
- If the host has web access, the skill re-checks the cited Microsoft Learn pages and reports what changed since the documentation date it relies on.
- To act on the output you need maker access to the agents, and Power Platform admin access for credential and sharing settings.

## Limitations

- Written against Microsoft Learn pages dated between September 2025 and 28 October 2026, all re-read on 30 October 2026. Several mechanisms are preview or prerelease: standard-harness "Add other agents", the Foundry, Fabric and Agents SDK connections, the GitHub Copilot harness, and the Customer Conversation harness.
- Ten questions are not answered by the documentation, including:
  - whose identity a connected agent's tools use at runtime;
  - whether a delegate's confirmation prompt reaches the user on the GitHub Copilot harness;
  - whether admins can block connections between agents.
  
  The skill reports these as *not documented* and gives a test for each.
- Two Microsoft pages conflict on whether telling the parent "only you talk to the user" works. The skill follows the newer page and says so.
- The boundary pattern is a design recommendation, not a Microsoft control. Test it in your tenant before relying on it.
- This is not security or legal advice. Verify against the cited pages before relying on the output for an approval decision.

## Sources

Microsoft documentation, with each page's `ms.date` when it was retrieved on 30 October 2026:

**Handoff guidance (the three pages)**

- [Multi-agent orchestration patterns and best practices](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/multi-agent-patterns), 21 May 2026
- [Hand off to a live agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-hand-off), 30 Apr 2026
- [Agent handoff for Employee Self-Service agent](https://learn.microsoft.com/en-us/microsoft-365/copilot/employee-self-service/agent-handoff), 15 May 2026

**Decision tiers**

- [Apply generative orchestration capabilities](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/generative-orchestration), 18 Sep 2026
- [FAQ for generative orchestration](https://learn.microsoft.com/en-us/microsoft-copilot-studio/faqs-generative-orchestration), 14 Oct 2026

**Mechanics: standard harness**

- [Add other agents overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-add-other-agents) (preview), 15 May 2026
- [Add a child agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-child-agent), 25 Aug 2026
- [Connect to an existing Copilot Studio agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-copilot-studio-agent), 30 Mar 2026
- [Connect to an agent over the Agent2Agent (A2A) protocol](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-agent-to-agent), 26 Aug 2026
- [Context distribution in the standard harness](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/generative-orchestration-context-design), 27 Aug 2026
- [Design subagents that avoid duplicate messages](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/generative-orchestration-subagents), 27 Aug 2026
- [Configure handoff to any generic engagement hub](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-generic-handoff), 16 Sep 2026

**Mechanics: GitHub Copilot harness**

- [Connected agents overview (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/authoring-add-other-agents), 6 Oct 2026
- [Add a Copilot Studio agent as a connected agent (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/add-agent-connected), 14 Oct 2026
- [Manage connected agents in an agent (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/manage-connected-agents), 14 Oct 2026
- [Add an Agent2Agent (A2A) agent as a connected agent (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/add-agent-to-agent), 14 Oct 2026
- [Add a Foundry agent as a connected agent (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/add-agent-foundry), 14 Oct 2026

**Mechanics: Customer Conversation harness (prerelease)**

- [Sub-agents overview (Customer Conversation)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/sub-agents-overview-customer-conversation), 8 Oct 2026
- [Add a connected agent (Customer Conversation)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/add-agent-connected-customer-conversation), 23 Oct 2026

**Harnesses**

- [Harnesses in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/harnesses-overview), 19 Oct 2026
- [Compare Copilot Studio agent harnesses](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/choose-harness), 30 Sep 2026

**Employee Self-Service agent (Microsoft Copilot)**

- [Connecting agents overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/employee-self-service/connecting-agents-overview), 10 Jun 2026
- [Set up the Employee Self-Service hub for custom engine agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/employee-self-service/multi-agent-hub), 2 Oct 2026

**Credentials, confirmation and admin controls**

- [Add tools to custom agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent), 1 Oct 2026
- [Control maker-provided credentials for authentication](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-no-maker-authentication), 1 Sep 2025
- [Configure data policies for agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-data-loss-prevention), 1 Oct 2026
- [Resolve agent error codes in Microsoft Copilot Studio](https://learn.microsoft.com/en-us/troubleshoot/power-platform/copilot-studio/authoring/error-codes), 28 Oct 2026

Every Learn page above still showed the same date on 31 October 2026. The agent reads the same list at the end of [`references/handoff-guide.md`](./references/handoff-guide.md).

## Contributors

| Name | Links |
| --- | --- |
| Arindam Choudhury | [GitHub](https://github.com/ari20089) · [LinkedIn](https://www.linkedin.com/in/arindam-choudhury/) |

## Version history

| Version | Date | Comments |
| --- | --- | --- |
| 1.0 | October 2026 | Initial release |

## Help

Skills are community samples without support. Search [existing issues](https://github.com/ari20089/agents-in-practice/issues) or [open a new one](https://github.com/ari20089/agents-in-practice/issues/new/choose). For Microsoft product questions use Microsoft Learn or your Microsoft support channel.

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
