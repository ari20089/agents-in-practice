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
| [`INSTRUCTIONS.md`](./INSTRUCTIONS.md) | The reviewer's behaviour: gates, review steps, severity, verdict rule, output format and rules. 5,487 of the 8,000 characters allowed. | The agent's **Instructions** field, pasted as is |
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

- Written against 38 Microsoft Learn pages dated September 2025 to 30 October 2026, re-read on 30 October and 1 November 2026. Agent settings, admin controls and billing rates change often. Re-check the sources at the end of `review-checks.txt` and update the file when they change.
- Microsoft renamed the GitHub Copilot harness to the Microsoft Copilot harness on 28 October 2026. Learn pages still use the old name, so the reviewer uses the new one and keeps the old one in quotes. Copilot Studio's billing-rate table covers only the standard harness; the reviewer doesn't apply it to Microsoft Copilot harness agents, which a Microsoft 365 Copilot licence doesn't cover.
- Five questions aren't answered by the documentation, including whether Purview DLP for Microsoft 365 Copilot applies inside agents. The reviewer names these instead of assuming.
- Severity levels, check IDs and the verdict rule are this reviewer's rubric, not Microsoft's.
- Licensing statements describe the documented rules, not your contract. Confirm with the Microsoft Copilot Studio Licensing Guide and your agreement.
- This is not legal, privacy or security advice. Verify against the cited pages before relying on the output for an approval decision.

## Sources

Microsoft documentation, with each page's `ms.date` when it was retrieved on 30 October 2026:

**Declarative agents and Microsoft 365 Copilot**

- [Declarative agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-declarative-agent), 30 Sep 2026
- [Compare declarative and custom engine agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agents-overview), 30 Sep 2026
- [Best practices for building declarative agents in Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-best-practices), 23 Oct 2026
- [Write effective instructions for declarative agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-instructions), 11 Aug 2026
- [Transparency FAQ for declarative agents in Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/transparency-faq-declarative-agent), 23 Oct 2026
- [Responsible AI validation](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/rai-validation), 5 Aug 2026
- [Confirmation prompts for MCP and API plugins for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/plugin-confirmation-prompts), 14 Jul 2026
- [Add knowledge sources to an agent in Agent Builder](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder-add-knowledge), 30 Sep 2026
- [Share and manage agents built in Agent Builder](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder-share-manage-agents), 30 Sep 2026
- [Plan licensing and cost for Microsoft 365 Copilot extensibility](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/cost-considerations), 30 Sep 2026
- [Guidelines to validate agents (Teams)](https://learn.microsoft.com/en-us/microsoftteams/platform/concepts/deploy-and-publish/appsource/prepare/review-copilot-validation-guidelines), 13 Aug 2026
- [Data, privacy, and security for web search in Microsoft Copilot and Microsoft Copilot Chat](https://learn.microsoft.com/en-us/microsoft-365/copilot/manage-public-web-access), 29 Oct 2026

**Microsoft 365 admin**

- [Agents admin guide for Microsoft 365](https://learn.microsoft.com/en-us/microsoft-365/copilot/agent-essentials/m365-agents-admin-guide), 7 Apr 2026
- [Manage agents in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-365/admin/manage/manage-copilot-agents-integrated-apps), 9 Jul 2026
- [Governance and lifecycle actions for agents in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-365/admin/manage/agent-actions), 23 Sep 2026
- [Copilot controls security and governance](https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-controls/security-governance), 25 Feb 2026
- [Restrict discovery of SharePoint sites and content](https://learn.microsoft.com/en-us/sharepoint/restricted-content-discovery), 11 Oct 2026
- [Restricted SharePoint Search](https://learn.microsoft.com/en-us/sharepoint/restricted-sharepoint-search), 6 Jul 2026
- [Microsoft Purview DLP for Microsoft 365 Copilot and Cowork](https://learn.microsoft.com/en-us/purview/dlp-microsoft365-copilot-location-learn-about), 16 Oct 2026
- [Learn about Microsoft Purview Data Security Posture Management (DSPM)](https://learn.microsoft.com/en-us/purview/data-security-posture-management-learn-about), 1 May 2026, read on 1 November 2026

**Copilot Studio**

- [Configure user authentication in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication), 21 Oct 2026
- [Share agents with other users](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-share-bots), 30 Jul 2026
- [Control how agents are shared](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-sharing-controls-limits), 20 Jul 2026
- [Configure data policies for agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-data-loss-prevention), 1 Oct 2026
- [Control maker-provided credentials for authentication](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-no-maker-authentication), 1 Sep 2025
- [Add tools to custom agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent), 1 Oct 2026
- [Knowledge sources summary](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio), 21 Jul 2026
- [Add SharePoint as a knowledge source](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-add-sharepoint), 4 Aug 2026
- [Data, privacy, and security for web search](https://learn.microsoft.com/en-us/microsoft-copilot-studio/data-privacy-security-web-search), 30 Jan 2026
- [Add a generative answers node](https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-boost-node), 21 Jul 2026
- [FAQ for generative answers](https://learn.microsoft.com/en-us/microsoft-copilot-studio/faqs-generative-answers), 29 May 2026
- [FAQ for generative orchestration](https://learn.microsoft.com/en-us/microsoft-copilot-studio/faqs-generative-orchestration), 14 Oct 2026
- [Apply generative orchestration capabilities](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/generative-orchestration), 18 Sep 2026
- [Agent runtime protection status](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-agent-runtime-view), 1 May 2026
- [App registration, agent identities, and authentication](https://learn.microsoft.com/en-us/microsoft-copilot-studio/govern-agents-identities-overview), 21 Aug 2026
- [Standard harness licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing), 3 Aug 2026
- [Billing rates and management](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management), 30 Oct 2026
- [Manage costs for agents powered by the GitHub Copilot harness](https://learn.microsoft.com/en-us/power-platform/admin/manage-usage-github-copilot-harness), 28 Oct 2026, read on 1 November 2026

Every Learn page above still showed the same date on 31 October 2026. The agent reads the same list at the end of [`knowledge/review-checks.txt`](./knowledge/review-checks.txt).

Other sources, read on 1 November 2026:

- [The GitHub Copilot harness is now the Microsoft Copilot harness](https://www.microsoft.com/en-us/copilot/blog/copilot-studio/the-github-copilot-harness-in-copilot-studio-is-now-the-microsoft-copilot-harness/), Microsoft Copilot Studio blog, 28 Oct 2026

## Contributors

| Name | Links |
| --- | --- |
| Arindam Choudhury | [GitHub](https://github.com/ari20089) · [LinkedIn](https://www.linkedin.com/in/arindam-choudhury/) |

## Version history

| Version | Date | Comments |
| --- | --- | --- |
| 1.0 | October 2026 | Initial release |
| 1.1 | November 2026 | Microsoft Copilot harness and DSPM names; the Copilot Studio billing rates are scoped to the standard harness, and LI2 covers Microsoft Copilot harness agents |

## Help

Agent instructions here are community samples without support. Search [existing issues](https://github.com/ari20089/agents-in-practice/issues) or [open a new one](https://github.com/ari20089/agents-in-practice/issues/new/choose). For Microsoft product questions use Microsoft Learn or your Microsoft support channel.

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
