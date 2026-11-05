# OWASP Risks to Copilot Studio Controls

## Summary

OWASP's **Top 10 for Agentic Applications (2026)** and **Top 10 for LLM Applications (2025)** tell you what can go wrong with an agent and what to do about it in general terms: add human approval, enforce least privilege, check retrieved content. In Copilot Studio, each of those is a specific setting: a tool property, an agent setting, a Power Platform admin center control, a Purview, Defender or Agent 365 policy, or an Entra setting. Each has its own owner and default, exists on some harnesses and not others, and is often in preview. Some only detect, and some fail open.

This skill maps all 20 risks (ASI01 to ASI10, LLM01 to LLM10) to the named Copilot Studio controls that address them, including the environment-level guardrails admins can now set over makers (preview), and states what no control covers. It also checks 28 of the 34 claims in Microsoft's own March 2026 OWASP mapping against the current documentation, where several no longer hold.

## Skill

The full skill definition is in [`SKILL.md`](./SKILL.md), which points the agent at [`references/controls-guide.md`](./references/controls-guide.md) for the harness differences, applicability rules, the two risk mappings, the checked one-pager claims, the open questions, a 54-control catalog with verbatim evidence, the artifact templates and the tenant tests. Copy the **whole folder** into your host's skills directory (see [skills/README.md](../README.md)).

### Trigger phrases

- *"Map the OWASP agentic Top 10 to Copilot Studio controls."*
- *"Which Copilot Studio setting stops prompt injection?"*
- *"Review our HR agent against OWASP."*
- *"What covers LLM06 excessive agency in Copilot Studio?"*
- *"Give me an admin baseline for Copilot Studio mapped to OWASP."*
- *"Is Microsoft's OWASP one-pager for Copilot Studio still accurate?"*
- *"Which of these controls work on the Microsoft Copilot harness?"*

## How it builds on HVE Core

[HVE Core](https://github.com/microsoft/hve-core) ships `owasp-agentic` and `owasp-llm` skills: generic knowledge bases that encode each OWASP risk's description, checklist, prevention controls, attack scenarios, detection and remediation for any agent platform. They tell an agent *what* to prevent. This skill adds *how, in Copilot Studio*: the setting, where it lives, who sets it, its default, its harness and release state, and whether it blocks, warns, detects or only reduces impact.

The two work together. With HVE Core installed, the agent reads the risk definition there and the Copilot Studio mapping here. Without it, this skill still works from the risk ID, the title and a one-line summary. It doesn't copy OWASP's or HVE Core's text: that content is © OWASP Foundation under CC BY-SA 4.0. This skill uses only the risk IDs and titles, and its 20 one-line summaries are original, so no OWASP or HVE Core text is reproduced and the share-alike terms don't attach to it.

## Description

The skill works through seven steps:

1. **Settle the harness and scope.** Some controls exist on the standard harness only, and most admin pages state no harness at all. The Microsoft Copilot harness (formerly GitHub Copilot) has hooks instead of **Ask the end user before running**, its own moderation and agent-connection settings, per-user memory and uploaded skills. It doesn't support manual authentication.
2. **Decide which risks apply** from the agent's features, as *applies*, *partly applies* or *does not apply*: no code interpreter or computer use means no ASI05, except on the Microsoft Copilot harness, where code interpreter is native; an agent that calls no other agent but still accepts incoming connections (the default) partly carries ASI07.
3. **Map each risk to controls**, split into *primary* (prevent or block) and *supporting* (warn, detect, reduce impact), with each control's state in this agent or tenant: set, not set, *unknown*, not on this harness, or not licensed. Admin controls include the preview **Authentication for agents**, **Agent access channels** and **Connected Agents** settings, the data policy that blocks event triggers, inventory **Block**, transcript controls, the **Preview and experimental AI models** environment setting and Global Secure Access for agent traffic.
4. **Check the claims the user relies on** against current pages. Microsoft's one-pager says "Session memory does not persist", "Single agent operation by default" and that communication stays "within environments that are isolated by default". Per-user memory, shared memory for agents with accounts, connected agents that receive history by default, A2A connections with no authentication and tenant isolation off by default are all documented now.
5. **State the residual risk**: what no setting covers, and the design measure that answers it.
6. **Produce the artifact:** control map, gap report, admin baseline checklist, maker checklist, tenant test plan, or a single-risk answer.
7. **Recommend, then stop.** It never changes settings, policies or agents.

The applicability rules, the primary/supporting split, residual-risk design measures and the coverage verdict are this skill's pattern. They are labelled as such and kept apart from what Microsoft documents.

## Prerequisites

- None to run; the skill is self-contained.
- If the host has web access, the skill re-checks the cited Microsoft Learn pages and reports what changed since 5 November 2026.
- Optional: HVE Core's `owasp-agentic` and `owasp-llm` skills, for the full risk definitions.
- To act on the output, you need maker access to the agent, and the admin roles for the layers involved: Power Platform admin center, Purview, Defender, the Microsoft 365 admin center and Entra. Defender's security for AI on Copilot Studio agents needs a Microsoft Agent 365 licence from 1 July 2026, although real-time protection through Defender for Cloud Apps "remains unchanged" for tenants that keep using it. Agent 365 rules set to block stopped blocking on 1 July 2026 until they are redefined under **Real-time protection**, and all Security for AI capabilities now sit under one **Security for AI Agents** toggle.

## Limitations

- Written against Microsoft Learn pages dated between November 2024 and 4 November 2026, fetched on 4 November 2026 and re-checked on 5 November 2026. Several controls the mapping relies on are preview:
  - the admin controls **Authentication for agents**, **Agent access channels** and **Connected Agents**;
  - the **Pre tool use** hook, which fails open and which Microsoft says not to rely on alone;
  - **Sharing agents with embedded maker credentials**, which isn't retroactive and doesn't stop a running agent;
  - external threat detection;
  - Defender real-time protection for Copilot Studio;
  - memory;
  - connector endpoint filtering.
- Two Copilot Studio pages the skill first cited, on sensitivity labels in responses and on Purview audit, redirect to *Configure data policies for agents* as of 5 November 2026. The skill now cites Purview pages for both, and reports the labels' release state and harness scope as not documented.
- Learn still calls the Microsoft Copilot harness the "GitHub Copilot harness" on every page. Most admin pages state no harness scope. Where a control's harness isn't stated, the skill says so rather than assume it covers every harness.
- Fifteen questions aren't answered by the documentation, including:
  - whether users can extract an agent's instructions;
  - whether data policies govern MCP servers added by URL on the Microsoft Copilot harness (they do govern its tools);
  - whether any admin control covers skills uploaded to Microsoft Copilot harness agents;
  - whether a **Request for information** step in a workflow can gate a tool call on the Microsoft Copilot harness;
  - whether Copilot Studio's Prompt Shields block events reach Defender (two Defender pages disagree).
  
  The skill reports these as *not documented* and gives a test for each.
- Sovereign clouds: Learn documents differences only for code interpreter (not available), Claude models, Defender's AI agent posture and Power Platform inventory (which lists no Microsoft Copilot harness agents in GCC, GCC High or DoD). For other controls, GCC, GCC High and DoD availability isn't documented, and the skill reports it as *unknown*.
- The automatic security scan page is dated November 2024 and describes three checks only. The Power Platform admin center label of the code interpreter environment setting isn't documented.
- The mapping is a design aid, not a certification. Covering a risk with a control reduces it; it doesn't remove it.
- This is not security or legal advice. Verify against the cited pages before relying on the output for an approval decision.

## Sources

Microsoft Learn, with each page's `ms.date` when fetched on 4 November 2026 and re-checked on 5 November 2026:

**Harnesses and overview**

- [Harnesses in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/harnesses-overview), 19 Oct 2026
- [Agents powered by the GitHub Copilot Harness overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/overview), 19 Oct 2026
- [FAQ for agents powered by the GitHub Copilot harness](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/faqs-copilot-harness), 2 Nov 2026
- [Configure settings for GitHub Copilot agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/settings-overview), 10 Sep 2026
- [Skills overview for agents (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/skills-overview), 19 Oct 2026
- [Agents powered by the Customer Conversation harness overview (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/overview-customer-conversation), 8 Oct 2026
- [Configure agent details and security (Customer Conversation) (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/settings-details-security-customer-conversation), 8 Oct 2026
- [Security and governance](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-and-governance), 24 Sep 2026

**Built-in protection, moderation and runtime protection**

- [Enable external threat detection and protection for Copilot Studio custom agents (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/external-security-provider), 1 Jun 2026
- [FAQ for generative answers](https://learn.microsoft.com/en-us/microsoft-copilot-studio/faqs-generative-answers), 29 May 2026
- [FAQ for generative orchestration](https://learn.microsoft.com/en-us/microsoft-copilot-studio/faqs-generative-orchestration), 14 Oct 2026
- [Agent runtime protection status](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-agent-runtime-view), 1 May 2026
- [Automatic security scan in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-scan), 11 Nov 2024
- [Review agent readiness and issue status in Microsoft Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-agent-status), 31 Jul 2026
- [Control image rendering and embedded URLs](https://learn.microsoft.com/en-us/microsoft-copilot-studio/image-render-embedded-url), 29 Jul 2026
- [Change the model version and settings](https://learn.microsoft.com/en-us/microsoft-copilot-studio/prompt-model-settings), 4 Aug 2026

**Knowledge, grounding, transcripts and evaluation**

- [Knowledge sources summary](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio), 21 Jul 2026
- [Add SharePoint as a knowledge source](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-add-sharepoint), 4 Aug 2026
- [Add Dataverse tables as a knowledge source](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-add-dataverse), 26 Jun 2026
- [Choose knowledge sources for agents built in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/choose-knowledge-sources), 19 Oct 2026
- [Data, privacy, and security for web search](https://learn.microsoft.com/en-us/microsoft-copilot-studio/data-privacy-security-web-search), 30 Jan 2026
- [Control how transcripts are retained and accessed](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-transcript-controls), 27 Aug 2026
- [Choose evaluation methods](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-overview), 16 Sep 2026
- [Evaluate an agent (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/analytics-agent-evaluation-intro), 5 Oct 2026

**Authentication, tools and approvals**

- [Configure user authentication in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication), 21 Oct 2026
- [Add tools to custom agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent), 1 Oct 2026
- [Add a tool to an agent (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/add-tools-custom-agent), 16 Oct 2026
- [Share agents with other users and makers (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/authoring-share-agent), 20 Oct 2026
- [Hooks (GitHub Copilot) (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/hooks-overview), 29 Sep 2026
- [Request information from human review in agent flows](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-request-for-information), 18 Jun 2026
- [Multistage and AI approvals in agent flows (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-advanced-approvals), 4 Sep 2025
- [Request information from human review in workflows (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flows-request-for-information), 22 Jun 2026
- [Add a workflow as a tool to an agent (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/workflows-experience/flow-agent), 22 Jun 2026
- [Use environment variables for Azure Key Vault secrets](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables-azure-key-vault-secrets), 9 Jan 2026

**Code interpreter and computer use**

- [FAQ for code interpreter](https://learn.microsoft.com/en-us/microsoft-copilot-studio/faq-code-interpreter), 3 Feb 2026
- [Use code interpreter in a prompt to generate and execute Python code](https://learn.microsoft.com/en-us/microsoft-copilot-studio/code-interpreter-for-prompts), 30 Sep 2026
- [Use code interpreter to analyze structured data (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-code-interpreter-structured-data), 4 Aug 2026
- [Use Code Interpreter Prompts with the Dataverse Predict Message](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/code-interpreter), 28 Oct 2026
- [Automate web and desktop apps with computer use](https://learn.microsoft.com/en-us/microsoft-copilot-studio/computer-use), 20 Oct 2026
- [Administer computer use](https://learn.microsoft.com/en-us/microsoft-copilot-studio/administer-computer-use), 7 May 2026
- [Configure where computer use runs](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-where-computer-use-runs), 7 May 2026
- [Human supervision of computer use](https://learn.microsoft.com/en-us/microsoft-copilot-studio/human-supervision-computer-use), 20 Oct 2026
- [FAQ for the computer use tool](https://learn.microsoft.com/en-us/microsoft-copilot-studio/faqs-computer-use), 23 Sep 2026

**Supply chain, models and publishing**

- [Extend your agent with Model Context Protocol](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp), 26 Aug 2026
- [Add a Model Context Protocol (MCP) server to your agent as a tool (GitHub Copilot) (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/tools-add-mcp-server), 16 Oct 2026
- [Connect to Microsoft Copilot Studio with MCP](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/copilot-studio-mcp), 16 Oct 2026
- [Allow external language models for generative responses](https://learn.microsoft.com/en-us/power-platform/admin/allow-llm-generative-responses), 12 Oct 2026
- [Choose an external model as the primary AI model](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-select-external-response-model), 28 May 2026
- [Model availability and controls (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/authoring-agent-model-availability), 2 Nov 2026
- [Claude models from Anthropic in Microsoft Online Services](https://learn.microsoft.com/en-us/copilot/implement/connect-to-ai-subprocessor), 4 Nov 2026
- [Move data across regions for Copilots, AI agents, and generative AI features](https://learn.microsoft.com/en-us/power-platform/admin/geographical-availability-copilot), 14 Oct 2026
- [Publish an agent (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/publication-publish-agent), 8 Sep 2026
- [Create and manage custom solutions](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-solutions-overview), 29 Apr 2026

**Memory and multi-agent**

- [Memory (GitHub Copilot) (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/memory-overview), 27 Jul 2026
- [Memory (Customer Conversation) (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/memory-overview-customer-conversation), 8 Oct 2026
- [FAQ for agent accounts (Frontier)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/faq-agent-accounts), 14 Oct 2026
- [Give your agent an account (Frontier)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/authoring-agent-account), 15 Oct 2026
- [Add other agents overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-add-other-agents), 30 Oct 2026
- [Connect to an existing Copilot Studio agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-copilot-studio-agent), 30 Oct 2026
- [Connected agents overview (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/authoring-add-other-agents), 6 Oct 2026
- [Connect to an agent over the Agent2Agent (A2A) protocol](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-agent-to-agent), 26 Aug 2026
- [Add an Agent2Agent (A2A) agent as a connected agent (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/add-agent-to-agent), 14 Oct 2026

**Power Platform admin**

- [Configure data policies for agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-data-loss-prevention), 1 Oct 2026
- [Advanced connector policies](https://learn.microsoft.com/en-us/power-platform/admin/advanced-connector-policies), 9 Sep 2026
- [Connector endpoint filtering (preview)](https://learn.microsoft.com/en-us/power-platform/admin/connector-endpoint-filtering), 15 Jun 2026
- [Configure authentication for agents (preview)](https://learn.microsoft.com/en-us/power-platform/admin/security/configure-authentication-controls-for-agents), 11 Jun 2026
- [Configure channel publishing and connected agent access (preview)](https://learn.microsoft.com/en-us/power-platform/admin/security/configure-channel-connected-agent-publishing), 16 Jun 2026
- [Control maker-provided credentials for authentication](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-no-maker-authentication), 1 Sep 2025
- [Control sharing agents with embedded maker credentials (preview)](https://learn.microsoft.com/en-us/power-platform/admin/security/control-sharing-agents-with-embedded-maker-credentials), 4 Nov 2026
- [Configure sharing agents with embedded maker credentials](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-sharing-agents-embedded-maker-credentials), 3 Nov 2026
- [Manage feature settings](https://learn.microsoft.com/en-us/power-platform/admin/settings-features), 3 Nov 2026
- [Control how agents are shared](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-sharing-controls-limits), 4 Nov 2026
- [Share agents with other users](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-share-bots), 30 Jul 2026
- [Tenant settings](https://learn.microsoft.com/en-us/power-platform/admin/tenant-settings), 30 Oct 2026
- [Copilot Studio Access Outside the Authors Security Group](https://learn.microsoft.com/en-us/troubleshoot/power-platform/copilot-studio/licensing/authors-access), 29 Oct 2026
- [Environment routing](https://learn.microsoft.com/en-us/power-platform/admin/default-environment-routing), 6 Oct 2026
- [Power Platform inventory](https://learn.microsoft.com/en-us/power-platform/admin/power-platform-inventory), 2 Nov 2026
- [Understand agent counts across admin surfaces](https://learn.microsoft.com/en-us/power-platform/admin/inventory-agent-counts), 30 Oct 2026
- [Use Virtual Network support for agent calls to private endpoints](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-network-isolation-vnet), 29 Apr 2026
- [Global Secure Access for Copilot Studio agents](https://learn.microsoft.com/en-us/power-platform/admin/security/secure-web-ai-gateway-agents), 4 Apr 2026
- [Block connections from unapproved IP addresses (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-network-isolation-firewall), 6 Apr 2026
- [Restrict cross-tenant inbound and outbound access](https://learn.microsoft.com/en-us/power-platform/admin/cross-tenant-restrictions), 23 Apr 2025
- [Manage Copilot Credits and capacity for Copilot Studio](https://learn.microsoft.com/en-us/power-platform/admin/manage-copilot-studio-copilot-credits-capacity), 14 Oct 2026
- [Manage costs for agents powered by the GitHub Copilot harness](https://learn.microsoft.com/en-us/power-platform/admin/manage-usage-github-copilot-harness), 28 Oct 2026
- [Govern Copilot Credit consumption for agents powered by the GitHub Copilot harness](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/govern-credit-consumption), 6 Oct 2026
- [Manage Copilot Studio costs in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/copilot/implement/usage-based-billing-manage-copilot-studio-costs), 30 Oct 2026
- [Use the Power Platform API to quarantine agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-api-quarantine), 14 Jul 2026

**Purview, Defender, Agent 365 and Entra**

- [Turn auditing on or off](https://learn.microsoft.com/en-us/purview/audit-log-enable-disable), 19 Jun 2026
- [Use Microsoft Purview to manage data security & compliance for Microsoft Copilot Studio](https://learn.microsoft.com/en-us/purview/ai-copilot-studio), 1 May 2026
- [Microsoft Purview DLP for Microsoft 365 Copilot and Cowork](https://learn.microsoft.com/en-us/purview/dlp-microsoft365-copilot-location-learn-about), 16 Oct 2026
- [Learn about Microsoft Purview Data Security Posture Management (DSPM)](https://learn.microsoft.com/en-us/purview/data-security-posture-management-learn-about), 1 May 2026
- [Protect AI agents in real time using Microsoft Defender](https://learn.microsoft.com/en-us/defender-xdr/security-for-ai/ai-agent-real-time-protection), 1 Jul 2026
- [Detect and investigate threats to AI agents using Microsoft Defender (Preview)](https://learn.microsoft.com/en-us/defender-xdr/security-for-ai/ai-agent-detection-protection), 7 Aug 2026
- [Discover AI agents and assess security posture using Microsoft Defender](https://learn.microsoft.com/en-us/defender-xdr/security-for-ai/ai-agent-inventory), 3 Nov 2026
- [Transition Microsoft Copilot Studio and Microsoft Foundry agent security capabilities to Microsoft Agent 365](https://learn.microsoft.com/en-us/defender-xdr/security-for-ai/transition-agent-security-to-agent-365), 2 Jun 2026
- [Governance and Lifecycle actions for agents available in Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-actions), 23 Sep 2026
- [App registration, agent identities, and authentication](https://learn.microsoft.com/en-us/microsoft-copilot-studio/govern-agents-identities-overview), 21 Aug 2026
- [Conditional Access for Agents in Microsoft Entra](https://learn.microsoft.com/en-us/entra/identity/conditional-access/agent-id), 31 Jul 2026

Other sources:

- [Addressing the OWASP Top 10 Risks in Agentic AI with Microsoft Copilot Studio](https://www.microsoft.com/en-us/security/blog/2026/03/30/addressing-the-owasp-top-10-risks-in-agentic-ai-with-microsoft-copilot-studio/), Microsoft Security blog, 30 Mar 2026
- [OWASP Top 10 for Agentic Applications: How Copilot Studio Helps Reduce Risk](https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/bade/documents/products-and-services/en-us/security/one-pager-microsoft-copilot-studio-owasp-top-10-mitigations.pdf), Microsoft one-pager linked from that post as "Copilot Studio: OWASP Top 10 Mitigations", read 4 Nov 2026
- [The GitHub Copilot harness is now the Microsoft Copilot harness](https://www.microsoft.com/en-us/copilot/blog/copilot-studio/the-github-copilot-harness-in-copilot-studio-is-now-the-microsoft-copilot-harness/), Microsoft Copilot Studio blog, 28 Oct 2026
- [OWASP Top 10 for Agentic Applications for 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/), OWASP Gen AI Security Project, published 9 Dec 2025 (CC BY-SA 4.0)
- [OWASP Top 10 for LLM Applications 2025](https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/), OWASP Gen AI Security Project, page updated 28 Apr 2025 (CC BY-SA 4.0)
- [HVE Core owasp-agentic skill](https://github.com/microsoft/hve-core/tree/main/.github/skills/security/owasp-agentic) and [owasp-llm skill](https://github.com/microsoft/hve-core/tree/main/.github/skills/security/owasp-llm), microsoft/hve-core, last changed 12 Jun 2026 (commit 1bf0c2b), read at main 8931ffb on 4 Nov 2026

The agent reads the same list at the end of [`references/controls-guide.md`](./references/controls-guide.md).

## Contributors

| Name | Links |
| --- | --- |
| Arindam Choudhury | [GitHub](https://github.com/ari20089) · [LinkedIn](https://www.linkedin.com/in/arindam-choudhury/) |

## Version history

| Version | Date | Comments |
| --- | --- | --- |
| 1.0 | November 2026 | Initial release |
| 1.1 | November 2026 | Re-checked every source on 5 November 2026: corrected the external and experimental model defaults, the Copilot Studio authors default, the Defender move to Agent 365, the Microsoft Copilot harness approval step and the evidence for two withdrawn pages (sensitivity labels, audit). Added Customer Conversation harness and sovereign cloud differences, two open questions and tests (Q14, Q15, T17, T18) and six more one-pager claims (28 of 34 checked). |

## Help

Skills are community samples without support. Search [existing issues](https://github.com/ari20089/agents-in-practice/issues) or [open a new one](https://github.com/ari20089/agents-in-practice/issues/new/choose). For Microsoft product questions use Microsoft Learn or your Microsoft support channel.

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
