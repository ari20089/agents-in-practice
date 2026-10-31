# Copilot Agent Governance Reviewer

## Summary

Before an agent goes to a whole team or the whole organization, someone has to ask the admin's questions:

- What is it for, and what will it refuse?
- Who can see what it knows?
- What can it change, and does it ask first?
- Will it work for users without a Microsoft 365 Copilot licence, and who pays?
- Where are the Responsible AI gaps?

These agent instructions turn a Copilot agent into a reviewer that asks those questions. Paste in another agent's **instructions, knowledge sources and actions**, and it returns findings tied to Microsoft documentation, with a **SHIP** or **FIX** verdict.

It reviews declarative agents (Agent Builder, Microsoft 365 Agents Toolkit), Copilot Studio agents and custom engine agents used in Microsoft 365 Copilot, Copilot Chat, Teams and SharePoint.

## What's in the folder

| File | What it's for | Where it goes |
|---|---|---|
| [`INSTRUCTIONS.md`](./INSTRUCTIONS.md) | The reviewer's behaviour: gates, review steps, severity, verdict rule, output format and rules. 5,401 of the 8,000 characters allowed. | The agent's **Instructions** field, pasted as is |
| [`knowledge/review-checks.txt`](./knowledge/review-checks.txt) | Reference data: the 39 checks with their documented basis and default severity, licensing tables, tenant controls, open questions and sources | Uploaded as the agent's only knowledge source |
| [`assets/review-intake.md`](./assets/review-intake.md) | A form makers fill in before asking for a review | Share it with makers; it isn't part of the agent |

All behaviour is in the instructions, not the knowledge file. Microsoft says not to "offload declarative agent instructions in SharePoint documents (or any other knowledge source) to work around the 8,000-character instruction limit", because knowledge content "is subject to cross-prompt injection attacks (XPIA) classifiers". The knowledge file only holds facts the reviewer looks up.

## Set up

**Agent settings for any tool**

| Setting | Value | Why |
|---|---|---|
| Name | Copilot Agent Governance Reviewer | Agent Builder allows 30 characters; use "Agent Governance Reviewer" there |
| Description | Reviews a Copilot agent's instructions, knowledge and actions and returns a SHIP or FIX verdict. | |
| Knowledge | `review-checks.txt` only | The reviewer cites it for every finding |
| Web search | Off | People paste agent configurations; generated web queries fall outside the Microsoft DPA and the EU Data Boundary |
| Actions | None | The reviewer never changes anything |
| Audience | Admins, risk reviewers and makers who request reviews | |

**Conversation starters**

- *Review this agent before I share it org-wide.*
- *What do you need from me to review an agent?*
- *Check this API plugin's confirmation settings.*
- *Will this agent work for people with only Copilot Chat?*

**Agent Builder in Microsoft 365 Copilot**

1. Create an agent and paste `INSTRUCTIONS.md` into its instructions.
2. On the **Configure** tab, upload `review-checks.txt` as knowledge, turn off **Search all websites**, and turn on **Only use specified sources**.
3. Add the conversation starters, test with the intake form, and share it with the reviewers.

**Copilot Studio**

1. Create an agent. On its **Overview** page, in the **Instructions** section, select **Edit** and paste `INSTRUCTIONS.md`.
2. Select **Add knowledge** and upload `review-checks.txt` (Copilot Studio accepts `.txt` and `.md`).
3. Turn off **Web Search** in the Knowledge section and **Use information from the web** in the Generative AI settings.
4. Keep authentication on (Authenticate with Microsoft) and share it with the reviewers' security group.

**Microsoft 365 Agents Toolkit**

1. Put the contents of `INSTRUCTIONS.md` in the manifest's `instructions` property. It must be 8,000 characters or less.
2. Add `review-checks.txt` to an `EmbeddedKnowledge` capability. Embedded files must be 1 MB or smaller; this one is about 29 KB.
3. Don't add the `WebSearch` capability.

## Prerequisites

- An agent-building tool: Agent Builder in Microsoft 365 Copilot, Copilot Studio or Microsoft 365 Agents Toolkit.
- Licences for the people who will use the reviewer. Run its own licensing checks on it: in Copilot Studio, each generative answer costs 2 Copilot Credits for users without a Microsoft 365 Copilot licence. The pages don't say whether an uploaded file counts as shared tenant data in Agent Builder.
- The review is only as good as what's pasted in. Ask makers to send the full instructions, every knowledge source and every action, or to fill in [`assets/review-intake.md`](./assets/review-intake.md).

## Limitations

- Written against 36 Microsoft Learn pages dated September 2025 to 30 October 2026, all re-read on 30 October 2026. Agent settings, admin controls and billing rates change often. Re-check the sources at the end of `review-checks.txt` and update the file when they change.
- Five questions aren't answered by the documentation, including whether Purview DLP for Microsoft 365 Copilot applies inside agents. The reviewer names these instead of assuming.
- Severity levels, check IDs and the verdict rule are this reviewer's rubric, not Microsoft's.
- Licensing statements describe the documented rules, not your contract. Confirm with the Microsoft Copilot Studio Licensing Guide and your agreement.
- This is not legal, privacy or security advice. Verify against the cited pages before relying on the output for an approval decision.

## Contributors

| Name | Links |
| --- | --- |
| Arindam Choudhury | [GitHub](https://github.com/ari20089) · [LinkedIn](https://www.linkedin.com/in/arindam-choudhury/) |

## Version history

| Version | Date | Comments |
| --- | --- | --- |
| 1.0 | October 2026 | Initial release |

## Help

Agent instructions here are community samples without support. Search [existing issues](https://github.com/ari20089/agents-in-practice/issues) or [open a new one](https://github.com/ari20089/agents-in-practice/issues/new/choose). For Microsoft product questions use Microsoft Learn or your Microsoft support channel.

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
