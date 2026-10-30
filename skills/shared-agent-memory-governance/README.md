# Shared Agent Memory Governance

## Summary

Copilot Studio agents that have their own account (Frontier preview) keep **one memory shared by every user who talks to them**. Microsoft documents that this memory has no privacy boundary between users, that any user can view or delete it, that users cannot opt out, and that admins cannot switch it off without switching off agent accounts. Microsoft Purview's documented coverage for Copilot Studio is built on prompts and responses stored in mailboxes; **no Microsoft page says where shared memory is stored or whether retention policies, holds, eDiscovery or audit reach it.**

This skill gives an agent an accurate, dated picture of that gap and turns it into the artifacts admins, compliance, records, privacy and legal teams need.

## Skill

The full skill definition is in [`SKILL.md`](./SKILL.md), which points the agent at [`references/governance-guide.md`](./references/governance-guide.md) for the verbatim facts, the Purview reach matrix, the open questions, runbooks and test plan. Copy the **whole folder** into your host's skills directory (see [skills/README.md](../README.md)).

### Trigger phrases

- *"Does Purview retention or eDiscovery cover Copilot Studio agent memory?"*
- *"We have a legal hold on a process this agent runs. What about its memory?"*
- *"Write a DSR runbook for what the agent remembers about a person."*
- *"Should we approve an agent account for this process?"*
- *"Give me a test plan to prove how holds treat agent memory in our tenant."*
- *"What happens to memory when we retire the agent?"*
- *"What's the difference between Copilot memory and Copilot Studio shared memory?"*

## Description

The skill works through six steps:

1. **Identify which "memory" the user means.** Four features are called memory (Microsoft 365 Copilot memory, Copilot Studio per-user memory on two harnesses, and shared memory for agents with an account) and they behave differently. The skill refuses to let the answer slide between them.
2. **State what is documented, with dates.** Shared across all users with no privacy boundary; surfaces content to users without permission to the source "regardless of sensitivity label"; viewable and deletable by any user; auto-deleted after 28 days with no interaction; no opt-out; no independent admin switch; exclusion list is model guidance, not a filter; agent deletion removes the Entra Agent ID and says nothing about memory.
3. **Map Purview coverage honestly** across three data types: prompts and responses (documented), the agent account's own mail and Teams traffic (documented, treat the agent as a user), and shared memory (not documented for any capability). "Not documented" is kept distinct from "not supported".
4. **Surface the open questions** (Q1 to Q10: storage location, retention, holds, eDiscovery search, audit, deletion on agent removal, the 28-day clock for always-on agents, admin export, residency, and what happens when the maker leaves) that apply to the user's scenario. If the user has run any of the tenant tests, their results are reported as a separate class, "observed in tenant", never blended with what Microsoft documents.
5. **Produce the artifact requested:** governance assessment, instruction-level memory rules, legal-hold checklist, DSR access/erasure runbook, decommission plan, retention schedule entry, or the seven-test tenant plan.
6. **Recommend, then stop.** It never changes settings, policies or agents.

## Prerequisites

- None to run; the skill is self-contained.
- If the host has web access, the skill re-checks the cited Microsoft Learn pages and reports what changed since the documentation date it relies on.
- To act on the output you need the normal Purview, Power Platform admin center and Microsoft 365 admin center roles.

## Limitations

- Written against **Frontier preview** documentation dated 14 to 22 October 2026. Agent accounts and shared memory are prerelease and Microsoft's pages carry the "subject to change" banner.
- The Purview pages for Copilot Studio and Agent 365 are dated May 2026 and predate agent accounts; a revision there would change the coverage matrix.
- One source (Message Center notice MC1478965) was read from a public archive because the Message Center requires tenant sign-in.
- The statement that deleting an agent deletes its Entra Agent ID comes from a Microsoft page scoped to the standard harness; agents with accounts run on the GitHub Copilot harness. The skill reports it as inferred, not documented.
- Purview terminology moves: the skill uses the current names (Data Security Posture Management, unified eDiscovery with cases and data sources, Agent Registry) and says so when an older name is still common.
- This is not legal advice. Verify against the cited pages before relying on the output for a compliance, legal or regulatory decision.

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
