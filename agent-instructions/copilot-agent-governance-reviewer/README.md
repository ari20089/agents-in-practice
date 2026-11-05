# Copilot Agent Governance Reviewer

## Summary

Before an agent goes to a whole team or the whole organization, someone has to ask the admin's questions:

- What is it for, and what will it refuse?
- Who can see what it knows?
- What can it change, and does it ask first?
- Will it work for users without a Microsoft 365 Copilot licence, and who pays?
- Where are the Responsible AI gaps?

These agent instructions turn a Copilot agent into a reviewer that asks those questions. Paste in another agent's **instructions, knowledge sources and actions**, and it returns findings tied to Microsoft documentation, with a **SHIP** or **FIX** verdict.

It reviews declarative agents (Agent Builder, Microsoft 365 Agents Toolkit, SharePoint), Copilot Studio agents on any of the three harnesses, and custom engine agents used in Microsoft 365 Copilot, Copilot Chat, Teams and SharePoint.

## What's in the folder

| File | What it's for | Where it goes |
|---|---|---|
| [`INSTRUCTIONS.md`](./INSTRUCTIONS.md) | The reviewer's behaviour: gates, review steps, severity, verdict rule, output format and rules. 6,029 of the 8,000 characters allowed. | The agent's **Instructions** field, pasted as is |
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
2. On the **Configure** tab, upload `review-checks.txt` as knowledge, turn off **Search all websites** and **Reference people in organization** (People data is on by default when the creator has a Microsoft 365 Copilot licence), and turn on **Only use specified sources**.
3. Add the conversation starters, test with the intake form, and share it with the reviewers.

**Copilot Studio**

Build the reviewer on the standard harness. Agents on the Microsoft Copilot harness (formerly GitHub Copilot harness) are "Billed for all usage. Creation and runtime activities consume Copilot Credits regardless of the user's license." A standard harness agent is covered by a Microsoft 365 Copilot licence "in Microsoft 365 channels" (Manage costs for agents powered by the GitHub Copilot harness, 28 Oct 2026).

1. Create a standard harness agent: on the Copilot Studio home page select **Other ways to build**, or turn off **New experience** as the quickstart does. On the agent's **Overview** page, in the **Instructions** section, select **Edit** and paste `INSTRUCTIONS.md`.
2. Select **Add knowledge** and upload `review-checks.txt` (Copilot Studio accepts `.txt` and `.md`).
3. Turn off **Web Search** in the Knowledge section; it's the same setting as **Use information from the web** in the Generative AI settings. Optionally turn off **Allow ungrounded responses** so answers come from the knowledge file; with it off, a turn that uses no knowledge source or tool is blocked and the fallback topic runs.
4. Keep authentication on **Authenticate with Microsoft**, which the Teams and Microsoft 365 channel needs, and share the agent with the reviewers' security group (**…** > **Share**). The sharing page (30 Jul 2026) lists **Authenticate manually** with Microsoft Entra ID and **Require users to sign in** as prerequisites, but the authentication page (21 Oct 2026) says that with Authenticate with Microsoft "You can use agent sharing to control who in your organization can chat with the agent." If **Share** says anyone can chat with your agent, sharing isn't controlling access: fix authentication before you go on.
5. Select **Publish**. Users can't chat with the agent in Teams or Microsoft 365 until it's published at least once.
6. Open the **Teams and Microsoft Copilot** channel configuration panel, keep **Make agent available in Microsoft Copilot** selected, and select **Add channel**. Use only Microsoft 365 channels: outside them, a licensed user's usage is billed. Your organization must allow Power Platform apps to be added to Teams.
7. In the same panel, select **Availability options** and either **Copy link** and send it to the reviewers, or select **Show to my teammates and shared users** and **Share** to list the agent under **Shared with you** in the Microsoft 365 Agent Store. Don't select **Show to everyone in my org**; that submits it for admin approval for the whole organization. Installation links don't work in the Teams mobile app.

**Microsoft 365 Agents Toolkit**

1. Put the contents of `INSTRUCTIONS.md` in the manifest's `instructions` property. It must be 8,000 characters or less.
2. Add `review-checks.txt` to an `EmbeddedKnowledge` capability, then test that the agent cites it. Microsoft's pages conflict here: *Declarative agent schema 1.9* (30 Sep 2026) defines `EmbeddedKnowledge` (files of 1 MB or smaller, up to 10 files; this one is about 45 KB), but *Add knowledge sources to your declarative agent* (30 Sep 2026) marks embedded file content as not available in Agents Toolkit (❌). If the agent doesn't use the file, put it in a SharePoint library that every reviewer can read and point a `OneDriveAndSharePoint` capability at it with `items_by_url` instead. The knowledge sources page says SharePoint and OneDrive knowledge "require the signed-in user to have an active Microsoft 365 Copilot license."
3. Don't add the `WebSearch` capability.

## Prerequisites

- An agent-building tool: Agent Builder in Microsoft 365 Copilot, Copilot Studio or Microsoft 365 Agents Toolkit.
- Licences for the people who will use the reviewer. Run its own licensing checks on it: in Copilot Studio, each generative answer on the standard harness costs 2 Copilot Credits for users without a Microsoft 365 Copilot licence, and a licensed user's usage is billed outside Microsoft 365 channels. In Agent Builder and Agents Toolkit, the uploaded file needs a Microsoft 365 Copilot licence or metered usage: "The file upload feature is available to users with usage billing enabled or with a Microsoft 365 Copilot license" (Add knowledge sources to your declarative agent, 30 Sep 2026).
- Not a GCC tenant, for the uploaded file in Agent Builder or Agents Toolkit: "Embedded file content isn't supported in Microsoft 365 Government Community Cloud (GCC) environments." Microsoft Purview Information Barriers "isn't supported on embedded files" either, so every user of the agent can see answers grounded in the file.
- The review is only as good as what's pasted in. Ask makers to send the full instructions, every knowledge source and every action, or to fill in [`assets/review-intake.md`](./assets/review-intake.md).

## Limitations

- Written against 54 Microsoft Learn pages dated September 2025 to 4 November 2026, re-read on 30 October and 1 November 2026; the pages behind version 1.2 were read on 5 November 2026. Agent settings, admin controls and billing rates change often. Re-check the sources at the end of `review-checks.txt` and update the file when they change.
- Microsoft renamed the GitHub Copilot harness to the Microsoft Copilot harness on 28 October 2026. Learn pages still use the old name, so the reviewer uses the new one and keeps the old one in quotes. Copilot Studio's billing-rate table covers only the standard harness; the reviewer doesn't apply it to Microsoft Copilot or Customer Conversation harness agents. A Microsoft 365 Copilot licence doesn't cover Microsoft Copilot harness agents.
- Five questions aren't answered by the documentation, including how far Purview DLP for Microsoft 365 Copilot applies inside agents beyond the documented SharePoint sensitivity-label case. The reviewer names these instead of assuming.
- Severity levels, check IDs and the verdict rule are this reviewer's rubric, not Microsoft's.
- Licensing statements describe the documented rules, not your contract. Confirm with the Microsoft Copilot Studio Licensing Guide and your agreement.
- This is not legal, privacy or security advice. Verify against the cited pages before relying on the output for an approval decision.

## Sources

Microsoft documentation, with each page's `ms.date`, first retrieved on 30 October 2026 and re-checked on 5 November 2026:

**Declarative agents and Microsoft 365 Copilot**

- [Declarative agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-declarative-agent), 30 Sep 2026
- [Compare declarative and custom engine agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agents-overview), 30 Sep 2026
- [Best practices for building declarative agents in Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-best-practices), 23 Oct 2026
- [Write effective instructions for declarative agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-instructions), 11 Aug 2026
- [Transparency FAQ for declarative agents in Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/transparency-faq-declarative-agent), 23 Oct 2026
- [Responsible AI validation](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/rai-validation), 5 Aug 2026
- [Confirmation prompts for MCP and API plugins for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/plugin-confirmation-prompts), 14 Jul 2026
- [Add knowledge sources to an agent in Agent Builder](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder-add-knowledge), 30 Sep 2026, re-read on 5 November 2026
- [Add skills to your declarative agent in Agent Builder](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder-add-skills), 26 Oct 2026, read on 5 November 2026
- [Share and manage agents built in Agent Builder](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder-share-manage-agents), 30 Sep 2026
- [Plan licensing and cost for Microsoft 365 Copilot extensibility](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/cost-considerations), 26 Oct 2026, re-read on 5 November 2026
- [Guidelines to validate agents (Teams)](https://learn.microsoft.com/en-us/microsoftteams/platform/concepts/deploy-and-publish/appsource/prepare/review-copilot-validation-guidelines), 13 Aug 2026
- [Data, privacy, and security for web search in Microsoft Copilot and Microsoft Copilot Chat](https://learn.microsoft.com/en-us/copilot/plan/manage-public-web-access), 29 Oct 2026, re-read on 5 November 2026
- [Add knowledge sources to your declarative agent](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/knowledge-sources), 30 Sep 2026, read on 5 November 2026
- [Declarative agent schema 1.9 for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-manifest-1.9), 30 Sep 2026, read on 5 November 2026

**Microsoft 365 admin**

- [Agents admin guide for Microsoft 365](https://learn.microsoft.com/en-us/microsoft-365/copilot/agent-essentials/m365-agents-admin-guide), 7 Apr 2026, re-read on 5 November 2026
- [Manage agents in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-agent-365/admin/manage-copilot-agents-integrated-apps), 9 Jul 2026, re-read on 5 November 2026
- [Governance and lifecycle actions for agents in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-actions), 23 Sep 2026, re-read on 5 November 2026
- [Copilot controls security and governance](https://learn.microsoft.com/en-us/copilot/implement/copilot-controls-security-governance), 25 Feb 2026, re-read on 5 November 2026
- [Microsoft Agent 365 overview](https://learn.microsoft.com/en-us/microsoft-agent-365/overview), 19 Aug 2026, read on 5 November 2026
- [Restrict discovery of SharePoint sites and content](https://learn.microsoft.com/en-us/sharepoint/restricted-content-discovery), 11 Oct 2026
- [Restricted SharePoint Search](https://learn.microsoft.com/en-us/sharepoint/restricted-sharepoint-search), 6 Jul 2026
- [Microsoft Purview DLP for Microsoft 365 Copilot and Cowork](https://learn.microsoft.com/en-us/purview/dlp-microsoft365-copilot-location-learn-about), 16 Oct 2026, re-read on 5 November 2026
- [Use Microsoft Purview to manage data security & compliance for AI agents](https://learn.microsoft.com/en-us/purview/ai-agents), 27 May 2026, read on 5 November 2026
- [Use Microsoft Purview to manage data security & compliance for Microsoft Copilot Studio](https://learn.microsoft.com/en-us/purview/ai-copilot-studio), 1 May 2026, read on 5 November 2026
- [Audit logs for Copilot and AI applications](https://learn.microsoft.com/en-us/purview/audit-copilot), 26 Aug 2026, read on 5 November 2026
- [Learn about auditing solutions in Microsoft Purview](https://learn.microsoft.com/en-us/purview/audit-solutions-overview), 18 May 2026, read on 5 November 2026
- [Learn about Microsoft Purview Data Security Posture Management (DSPM)](https://learn.microsoft.com/en-us/purview/data-security-posture-management-learn-about), 1 May 2026, read on 1 November 2026

**Copilot Studio**

- [Harnesses in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/harnesses-overview), 19 Oct 2026, read on 5 November 2026
- [Agents overview (Copilot Studio)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-overview), 9 Sep 2026, read on 5 November 2026
- [Agents powered by the Customer Conversation harness overview (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/overview-customer-conversation), 8 Oct 2026, read on 5 November 2026
- [Memory (GitHub Copilot) (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/memory-overview), 27 Jul 2026, read on 5 November 2026
- [Quickstart: Create and deploy an agent with the standard harness](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-get-started), 22 Sep 2026, read on 5 November 2026
- [Access standard harness agents and agent flows](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/switch-experiences), 21 Sep 2026, read on 5 November 2026
- [Configure user authentication in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication), 21 Oct 2026, re-read on 5 November 2026
- [Share agents with other users](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-share-bots), 30 Jul 2026, re-read on 5 November 2026
- [Connect and configure an agent for Teams and Microsoft 365](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-add-bot-to-microsoft-teams), 29 Oct 2026, read on 5 November 2026
- [Control how agents are shared](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-sharing-controls-limits), 4 Nov 2026, read on 5 November 2026
- [Configure data policies for agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-data-loss-prevention), 1 Oct 2026, re-read on 5 November 2026
- [Control maker-provided credentials for authentication](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-no-maker-authentication), 1 Sep 2025
- [Add tools to custom agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent), 1 Oct 2026
- [Knowledge sources summary](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio), 21 Jul 2026, re-read on 5 November 2026
- [Add SharePoint as a knowledge source](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-add-sharepoint), 4 Aug 2026
- [Data, privacy, and security for web search](https://learn.microsoft.com/en-us/microsoft-copilot-studio/data-privacy-security-web-search), 30 Jan 2026
- [Add a generative answers node](https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-boost-node), 21 Jul 2026
- [FAQ for generative answers](https://learn.microsoft.com/en-us/microsoft-copilot-studio/faqs-generative-answers), 29 May 2026
- [FAQ for generative orchestration](https://learn.microsoft.com/en-us/microsoft-copilot-studio/faqs-generative-orchestration), 14 Oct 2026
- [Apply generative orchestration capabilities](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/generative-orchestration), 4 Nov 2026, read on 5 November 2026
- [Agent runtime protection status](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-agent-runtime-view), 1 May 2026
- [App registration, agent identities, and authentication](https://learn.microsoft.com/en-us/microsoft-copilot-studio/govern-agents-identities-overview), 21 Aug 2026, re-read on 5 November 2026
- [Security and governance (Copilot Studio)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-and-governance), 24 Sep 2026, read on 5 November 2026
- [Licensing for agents powered by the standard harness](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing), 4 Nov 2026, read on 5 November 2026
- [Billing rates and management](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management), 30 Oct 2026, re-read on 5 November 2026
- [Manage costs for agents powered by the GitHub Copilot harness](https://learn.microsoft.com/en-us/power-platform/admin/manage-usage-github-copilot-harness), 28 Oct 2026, re-read on 5 November 2026

On 5 November 2026, four pages showed a newer date than on 30 October: Plan licensing and cost (26 Oct 2026), and Control how agents are shared, Licensing for agents powered by the standard harness, and Apply generative orchestration capabilities (all 4 Nov 2026); the dates above are current. Later that day Microsoft withdrew View Copilot Studio audit logs in Purview (its URL redirects to Configure data policies for agents), so the audit row now cites the Purview audit pages and Security and governance. The agent reads the same list at the end of [`knowledge/review-checks.txt`](./knowledge/review-checks.txt).

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
| 1.2 | November 2026 | Copilot Studio setup now uses the standard harness and publishes to the Teams and Microsoft 365 channel, and behaviour rules moved from the knowledge file into the instructions. The knowledge file adds Customer Conversation harness, SharePoint agent, skills, memory, embedded file licensing, reasoning-model billing, audit, cost and sharing controls, narrows Q1 with Purview's agent pages, and updates page links and dates. The Restricted Content Discovery row now states what the page documents (search and Copilot responses, AI entry points) |

## Help

Agent instructions here are community samples without support. Search [existing issues](https://github.com/ari20089/agents-in-practice/issues) or [open a new one](https://github.com/ari20089/agents-in-practice/issues/new/choose). For Microsoft product questions use Microsoft Learn or your Microsoft support channel.

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
