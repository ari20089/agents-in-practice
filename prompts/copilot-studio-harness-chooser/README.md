# Copilot Studio Harness Chooser

## Summary

Every new agent in Copilot Studio runs on a harness, and you choose it when you create the agent: the **GitHub Copilot harness** for reasoning-heavy, multistep work, the **Customer Conversation harness** (preview) for customers over voice and chat, or the **standard harness** for rule-based agents and agent flows. The choice is hard to undo. An agent can't be transferred between the standard and GitHub Copilot harnesses; the only documented path is a preview upgrade that copies a standard agent to a new GitHub Copilot agent and leaves its knowledge sources, Power Fx and child agents behind. The harness also decides the features, the channels and when billing starts: the GitHub Copilot and Customer Conversation harnesses meter Copilot Credits from the moment you start building, the standard harness after publish. Microsoft updated its harness overview on 19 October 2026, and it now compares these three side by side.

Paste this prompt into a Copilot chat, describe the agent you want, and it returns:

- **Recommendation**: one harness (or one per job, when the scenario is really two jobs), with a confidence level;
- **Why this harness**: up to five reasons, each tying a detail of your scenario to a documented fact;
- **Why not the others**: a row per harness ruled out, with what would change the answer;
- **Check before you build**: the preview features, unsupported channels or auth methods, moving or upgrading, the billing start, where to create the agent and the contact center step, whichever apply to your scenario;
- **Open questions** and the **assumptions** it made.

The Microsoft facts it relies on are written into the prompt, dated 1 November 2026, so it works in a chat that can't browse. It only advises: it doesn't build the agent or change files.

The prompt follows the prompt standards of [HVE Core](https://github.com/microsoft/hve-core) (Microsoft's HyperVelocity Engineering framework for GitHub Copilot): an action title, Overview, Inputs, Workflow Steps, Success Criteria, Examples and Error Handling sections, and RFC 2119 keywords (MUST, SHOULD, MAY) on the rules that bind. [Run it with HVE Core](#run-it-with-hve-core) gives the prompt file header in HVE Core's format.

## What's in the folder

| File | What it's for | Where it goes |
|---|---|---|
| [`PROMPT.md`](./PROMPT.md) | The prompt: the facts about each harness, the steps to choose, the output shape, examples and error handling. 7,997 of the 8,000 characters allowed, so trim before adding to it. | Pasted into chat, as is, with the scenario filled in |
| [`assets/preview.png`](./assets/preview.png) | The gallery image: a Teams Phone scenario and the answer the published prompt gave for it in testing | For people only |

## Run it

**Microsoft 365 Copilot Chat, or any other Copilot chat**

1. Paste the contents of `PROMPT.md`.
2. Replace the text in angle brackets after `Scenario:` with your scenario, and send it.
3. Answer its questions if it asks who uses the agent, where they reach it or what it must do.

**GitHub Copilot Chat in VS Code**

1. In the Chat view, start a **Local** session. The prompt reads nothing from the repository, so **Ask** is enough.
2. Paste the contents of `PROMPT.md`, fill in the scenario, and send it.

To run it again with `/copilot-studio-harness-chooser`, save it as `.github/prompts/copilot-studio-harness-chooser.prompt.md` with this header above the prompt. Prompt files run only in Local harness sessions; in any other session, paste the prompt.

```markdown
---
description: Recommend the Copilot Studio harness for a scenario: GitHub Copilot, Customer Conversation or standard, with reasons.
agent: ask
---
```

### Run it with HVE Core

With the HVE Core extension or Copilot CLI plugin installed, save the prompt as a prompt file using HVE Core's frontmatter instead, and swap the placeholder for an input variable so VS Code asks for the scenario when you run it:

1. Save `PROMPT.md` as `copilot-studio-harness-chooser.prompt.md`: in your own repository under `.github/prompts/`, or, to contribute it to HVE Core, under `.github/prompts/<package-id>/` as HVE Core's prompt guide requires.
2. Put this header above the prompt. HVE Core requires `description` (one sentence, 10 to 200 characters); the rest are its optional fields. There is no `agent:` line, because in HVE Core that field hands the prompt to a named custom agent and this prompt needs none.

   ```markdown
   ---
   description: 'Recommend the GitHub Copilot, Customer Conversation or standard Copilot Studio harness for a scenario, with reasons'
   argument-hint: "scenario=..."
   version: '1.0.0'
   author: 'ari20089/agents-in-practice'
   lastUpdated: '2026-11-01'
   ---
   ```

3. Replace the line that starts `Scenario: <describe the agent` with `Scenario: ${input:scenario}`. Leave the line after it: if no scenario comes through, the prompt still asks for one.
4. Run `/copilot-studio-harness-chooser scenario=...` in chat, or run it and describe the scenario when asked.

**Placeholders**

- `<describe the agent…>`: who uses it (employees or customers), where they reach it (Teams, Microsoft 365 Copilot, a website, a phone number, WhatsApp, SharePoint, a contact center), what it must do end to end, the systems, files and data it touches, and anything already built. The more of these you give, the fewer questions it asks. If it can't work out the audience, the channel or what the agent must do, it asks for all three in one message before answering.

## What it checks

The prompt states each fact below so the agent doesn't need current documentation. Each rests on these pages:

| What the prompt says | Basis |
|---|---|
| What each harness is for | GitHub Copilot: "agents and workflows built for reasoning-heavy, multi-step work"; Customer Conversation: "agents that answer questions and resolve issues for customers over voice and chat"; standard: "rule-based agents and agent flows" (Harnesses in Copilot Studio) |
| GitHub Copilot harness capabilities | It "can take a goal, break it into steps, call the right tools across connectors, knowledge, MCP, and connected agents, and adjust when a step fails", "natively creates and edits Word, Excel, PowerPoint, and PDF files, supports skills and memory, and runs each task in a secure sandbox" (Harnesses in Copilot Studio). "Reasoning models and some emerging agentic capabilities are available only through the GitHub Copilot harness", on a page that "Compare[s] the standard and GitHub Copilot harnesses" only, so the prompt says Customer Conversation isn't compared (Compare Copilot Studio agent harnesses). "User memory is disabled in group chats and Microsoft Teams channels" (Memory, GitHub Copilot) |
| GitHub Copilot channels | "Currently available? Yes" for Microsoft Copilot, Microsoft Teams, Demo website and Web app; "Preview" for MCP client and A2A client, "available only in early release cycle environments"; "No" for SharePoint, Facebook, WhatsApp, Slack, Telegram, Native app (Direct Line), Genesys, LivePerson, Salesforce, ServiceNow, Twilio, Line, GroupMe, Direct Line Speech and Email (Available channels, GitHub Copilot) |
| It isn't the GitHub Copilot service | "customer data isn't sent to or processed by the GitHub Copilot service when agents run in Copilot Studio. Existing Microsoft Copilot Studio privacy, security, compliance, and data residency commitments continue to apply" (Harnesses in Copilot Studio; GitHub Copilot harness overview) |
| GitHub Copilot harness gaps, each supported on standard | The feature comparison table marks each of these Supported on the standard harness and not supported on the GitHub Copilot harness: Prompt ("Replaced by Skills"), Azure AI Search knowledge, the SharePoint, WhatsApp and Dynamics 365 Contact Center channels, manual or custom authentication, and custom entities. Computer use is "Planned". Topics are "Replaced by **Hooks**", which "run workflows automatically at specific points in an agent's lifecycle", and the upgrade page rebuilds custom topics as skills or workflows. The same table marks as Supported on both: the Teams and Microsoft 365 Copilot and website channels; public website, file upload, SharePoint, Graph connector and Dataverse table knowledge; Microsoft (Entra ID) and no authentication; connectors, MCP, workflows, connected agents and DLP. Autonomous triggering uses "triggers (preview) or an Agent Node in Workflows" (GitHub Copilot harness overview). "customers should validate required features and channels as the experience matures" (Compare Copilot Studio agent harnesses) |
| Customer Conversation harness | Preview: each page is "prerelease documentation and is subject to change". "An agent built on this harness is called a **Customer Assist Agent**"; "multi-agent architecture with specialized sub-agents, each with its own escalation path"; "Speech channels don't support end-user sign-in, so knowledge sources that require end-user credentials only work for Chat conversations" (Customer Conversation overview). Channels: standalone "Demo website", "Web chat" and "Teams Phone"; contact center "Dynamics 365 Contact Center", "Genesys" and "Bring your own" (Available channels). Escalate offers "Escalate to Teams Phone", "Escalate to Email" and "Escalate to Customer Engagement", which "sends the entire conversation to the engagement hub, which finds the best available live agent"; "The **Biometric Authentication** capability lets your agent authenticate callers over voice calls", enabled "from the **Voice capabilities** section" (Prebuilt contact center tools). Knowledge: public websites, files and Dynamics 365 need "No authentication"; SharePoint, Dataverse, Salesforce and ServiceNow "Requires authentication", and "Knowledge sources that use the end user's credentials work only in chat conversations, because voice channels don't support end-user sign-in" (Available knowledge sources, Customer Conversation). Skills: "**Generative** skills" and "**Topic** skills, which are deterministic, authored flows of steps and conditions (matching the existing Copilot Studio Topics concept)" (Skills overview). Contact centers named on the creation page: "Dynamics 365 Contact Center, Genesys, Cisco, or Avaya"; the agent can be created "from either Copilot Studio or the Microsoft Contact Center Intelligence portal", from the **Customer Conversation** tile under **Other ways to build** or from the **Agents** page. Every agent "supports both Speech and Chat conversations by default"; "Deploying an agent to a contact center can only be done from the portal, by an Omnichannel Admin" (Create a new agent, Customer Conversation) |
| Standard harness | "A dependable option for rule-based agents and structured, repeatable workflows or conversations" (Harnesses in Copilot Studio). "Well suited to high-traffic, user-facing scenarios where responsive interaction is important"; "The presence of connectors, MCP servers, or some dynamic planning doesn't by itself require the GitHub Copilot harness" (Compare Copilot Studio agent harnesses). In the "Works with files" row, standard and Customer Conversation are both "Not a focus" (Harnesses in Copilot Studio). Skills and Memory are "Not supported" on standard, "GH agents only" (GitHub Copilot harness overview). Standard channels: "Teams and Microsoft Copilot", SharePoint, WhatsApp, Demo Website, Custom Website, Mobile App, Facebook and "Azure Bot Service channels, including" Cortana, Slack, Telegram, Twilio, Line, Kik, GroupMe, Direct Line Speech and Email; no Teams Phone is listed, and the GitHub Copilot harness's own channels page lists 15 channels as not available, so the prompt ranks a documented gap above an unstated one (Key concepts: Publish and deploy your agent) |
| Chosen at creation; no transfer; the upgrade copy | "You choose which harness to use when you create a new agent. Agents created with the GitHub Copilot harness can't be transferred to the standard harness, and vice versa" (GitHub Copilot harness overview). Standard agents are created from "Other ways to build" on the home page, and The Copilot chat and Customer Conversation harnesses "use separate creation paths" (Access standard harness agents). The preview upgrade "creates a copy of the agent onto the GitHub Copilot harness" and "carries over instructions, tools, and suggested prompts"; "custom topics can be rebuilt as skills of workflows" [sic]; "Knowledge sources", "Power Fx expressions" and "Child agents" aren't migrated; "The upgrade consumes credits"; "Preview features aren't meant for production use", a statement the prompt applies to the upgrade only (Upgrade agents to the GitHub Copilot harness) |
| Migrate only for a benefit; don't over-engineer | Migration "should be driven by a clear benefit" and treated "as re-architecture rather than component conversion"; on a simple scenario the GitHub Copilot harness "may introduce unnecessary reasoning, latency, and Copilot Credit consumption"; the combined data curation design (Compare Copilot Studio agent harnesses) |
| Billing | "Copilot Credits are the common currency across Copilot Studio capabilities" (Standard harness licensing). "Unlike the standard harness, which starts billing after publish, the GitHub Copilot harness charges credits from the moment you start building", for "LLM tokens, tools (including knowledge and MCPs), and the harness itself"; for "the Self-Service/Customer Assist Agent in Microsoft Contact Center Intelligence", "credit consumption varies by conversation complexity and modality" (Usage-based billing). Every Customer Conversation page adds "Using, building, testing, and evaluating agents might consume Copilot Credits" (Customer Conversation overview). "A Microsoft 365 Copilot license lets you use Copilot Studio to build agents for the GitHub Copilot harness"; "*classic answers*, *generative answers*, or *Microsoft Graph tenant grounding* have zero-rated usage" for Microsoft 365 Copilot licensed users (Standard harness licensing) |
| A Copilot Chat agent may fit better | A Microsoft training module (20 Aug 2026) describes a "Copilot Chat harness" that "connects enterprise knowledge to Microsoft Copilot Chat" for internal users, and the page on accessing standard harness agents still mentions "The Copilot chat and Customer Conversation harnesses". The 19 October overview and the agents overview (9 Sep 2026) list only the three harnesses this prompt compares, so the prompt flags this case instead of choosing |

How it decides, in order: note each harness documented as not supporting a stated channel, auth method or feature, and prefer one on which every stated need is confirmed (a channel, feature or workaround the facts don't state for a harness counts as unconfirmed, not as supported or unsupported); if no harness clears every need, recommend the best fit at Low confidence and make its gap the first check; weigh the harnesses (customers on Teams Phone, web chat or a contact center with escalation to people → Customer Conversation; long, multi-system, multi-output or file-heavy work that must adapt → GitHub Copilot; short, bounded, predictable or high-volume work, or a working standard agent → standard); break a tie toward standard, because Microsoft says the heavier harness costs latency and credits on simple work; and split the scenario across two harnesses only when it is clearly two jobs. Confidence is Low when a stated need is unconfirmed or unsupported on the recommended harness; Medium when the harness is in preview or an open question about a stated need could change the answer; High otherwise. An employee-only Copilot Chat scenario gets the note in the Recommendation line and the usual comparison.

## Prerequisites

- Any Copilot chat: Microsoft 365 Copilot Chat, GitHub Copilot Chat in VS Code, the GitHub Copilot CLI or another chat assistant. No tools, files or connections are needed.
- For the HVE Core prompt file: VS Code with GitHub Copilot Chat and the HVE Core extension, or the GitHub Copilot CLI with the HVE Core plugin.
- To act on the recommendation: access to Copilot Studio, and for the GitHub Copilot or Customer Conversation harness, Copilot Credits allocated to the environment by an administrator.

## Limitations

- Written against 17 Microsoft Learn pages dated 23 June to 22 October 2026 and one Learn training module, all read on 1 November 2026. The harnesses are new, and the Customer Conversation harness and the upgrade are in preview; check the Sources before relying on a recommendation, and update the facts in the prompt when a page changes.
- The pages don't agree on how many harnesses there are. The harness overview (19 October 2026) and the agents overview (9 September 2026) describe three. The page on accessing standard harness agents (21 September 2026) mentions "all four harnesses", and a training module (20 August 2026) describes a Copilot Chat harness for extending Microsoft 365 Copilot Chat in place of Customer Conversation. The prompt compares the three the overview describes and flags Copilot Chat scenarios rather than judging them.
- The GitHub Copilot harness isn't labelled preview on its overview page, but several of its features are: natural-language creation and triggers are preview, and memory is "a production-ready preview feature" under supplemental terms. The prompt doesn't call the harness itself preview, and it applies Microsoft's "not meant for production use" wording only to the upgrade, where it appears.
- The feature comparison on the GitHub Copilot harness overview compares it with the standard harness only. There is no feature table for the Customer Conversation harness, so the prompt states what its overview, channels, knowledge, skills, tools and creation pages say. Its channels page lists no Teams chat, Microsoft 365 Copilot or WhatsApp channel, and the prompt treats those as unconfirmed rather than unsupported. The GitHub Copilot harness has its own channels page, which lists 15 channels as not available; the prompt states that list, so a voice, email, Slack or contact center scenario is ruled out there rather than left open.
- Whether a Customer Conversation agent can be moved to or from another harness isn't documented as of 1 November 2026, and no upgrade from the GitHub Copilot harness back to standard is documented.
- Copilot Studio is documented as available in the US Government Community Cloud (GCC) on the standard licensing page, but availability by harness, region or government cloud isn't documented as of 1 November 2026. If that matters, the prompt makes it an open question.
- The upgrade page says custom topics "can be rebuilt as skills of workflows", which reads as a typo for "skills or workflows"; the prompt uses "skills or workflows".
- The prompt gives no prices or credit amounts. Billing pages show estimated credit ranges only as images, and consumption depends on design and volume; use Microsoft's Copilot Credits estimator for numbers.
- HVE Core describes itself as "rapidly evolving" and "best treated as a source of patterns and learning rather than a stable platform". The header and section names follow its prompt guide dated 7 October 2026. This prompt hasn't been run through HVE Core's own validation (`npm run plugin:validate`).
- When no harness clears every need, the prompt recommends the best fit at Low even if its gap is documented as not supported and another harness's gap is only unconfirmed. In the board pack test below, that put the GitHub Copilot harness (no Azure AI Search knowledge) ahead of standard (files "not a focus"). Picking standard or a split is also defensible, and the answer says what would move it. Read the first check before acting on a Low recommendation.
- Tested over six rounds on nine scenarios, run by a coding agent given only the prompt, not inside Copilot Chat itself. The first rounds found that a channel missing from one harness's list could be read as "not supported" or "unknown", that a vague scenario took two rounds of questions, that confidence levels weren't defined, and that a strict hard-constraint step pushed a file-heavy job onto standard. A Microsoft Learn review on 1 November 2026 then corrected two facts: the preview upgrade path, and the Customer Conversation channel list. A later round found that SharePoint knowledge wasn't stated for any harness, so a simple HR policy agent came out at Low. It also found that preview status didn't affect confidence, that High was nearly unreachable, and that the Copilot Chat note had no place in the output. Each was fixed. Results, from the last round each scenario ran in:
  - "An agent that helps with expense reports" gets one message asking for audience, channel and scope.
  - Customers on WhatsApp and a website, handing off to Dynamics 365 Contact Center, get standard at Medium: WhatsApp isn't on Customer Conversation's channel list.
  - A working standard help desk for 40,000 employees that leadership wants moved gets "stay on standard" at High. The answer notes that the upgrade copy would leave its SharePoint knowledge behind.
  - A monthly board pack builder needing Azure AI Search gets GitHub Copilot at Low, with that gap as the first check.
  - Employees asking Microsoft 365 Copilot Chat about HR policies in SharePoint get standard at High, with the note that a Copilot Chat agent may fit better.
  - Customers on Teams Phone, handing off to a live agent in Genesys, get Customer Conversation, at Low in one run and Medium in another, because that handoff is only partly documented.
  - Customers on Teams Phone, transferred to a person in a Teams Phone queue, get Customer Conversation at Medium, held below High by preview status. This is the answer in the gallery image.
  - Employees in Slack asking for a Dataverse-versus-SharePoint-Excel comparison get standard at Medium: Slack is listed for standard and listed as not available on the GitHub Copilot harness, which outranks that harness's better fit for the comparison. Before the standard channel list was added, the same scenario came out at Low with Slack unconfirmed. The first check is whether a standard agent can compare the Excel figures reliably, since files are "not a focus" there; one run read that caveat as grounds for Low instead.
  - A customer voice agent answering from an internal SharePoint knowledge base gets Customer Conversation at Low, with the first check that SharePoint knowledge works in Chat only on that harness because Speech has no end-user sign-in.

## Sources

Microsoft Learn, with each page's `ms.date` when it was read on 1 November 2026:

- [Harnesses in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/harnesses-overview), 19 Oct 2026
- [Compare Copilot Studio agent harnesses](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/choose-harness), 30 Sep 2026
- [Agents powered by the GitHub Copilot Harness overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/overview), 19 Oct 2026
- [Available channels for agents (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/publication-channels-overview), 23 Jun 2026
- [Memory (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/memory-overview), 27 Jul 2026
- [Skills overview for agents (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/skills-overview), 19 Oct 2026
- [Agents powered by the Customer Conversation harness overview (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/overview-customer-conversation), 8 Oct 2026
- [Create a new agent (Customer Conversation)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/build-new-agent-customer-conversation), 22 Oct 2026
- [Available channels (Customer Conversation)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/publication-channels-overview-customer-conversation), 8 Oct 2026
- [Prebuilt contact center tools (Customer Conversation)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/tools-prebuilt-customer-conversation), 8 Oct 2026
- [Available knowledge sources for agents (Customer Conversation)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/knowledge-sources-overview-customer-conversation), 8 Oct 2026
- [Access standard harness agents and agent flows](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/switch-experiences), 21 Sep 2026
- [Upgrade agents to the GitHub Copilot harness (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/upgrade-to-github-copilot-from-standard-harness), 5 Oct 2026
- [Agents overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-overview), 9 Sep 2026
- [Overview of usage-based billing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/billing-credit-overview), 6 Oct 2026
- [Standard harness licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing), 3 Aug 2026
- [Key concepts: Publish and deploy your agent (standard harness channels)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-fundamentals-publish-channels), 16 Sep 2026
- [Compare Copilot Studio agent harnesses (training module unit)](https://learn.microsoft.com/en-us/training/modules/explore-copilot-studio-agent-harnesses/3-compare-agent-harnesses), 20 Aug 2026

Other sources, read on 1 November 2026:

- [microsoft/hve-core](https://github.com/microsoft/hve-core), last changed 31 Oct 2026: the README, and [Contributing Prompts to HVE Core](https://github.com/microsoft/hve-core/blob/main/docs/contributing/prompts.md) and [AI Artifacts Common Standards](https://github.com/microsoft/hve-core/blob/main/docs/contributing/ai-artifacts-common.md), both dated 7 Oct 2026
- [Use prompt files in VS Code](https://code.visualstudio.com/docs/copilot/customization/prompt-files), updated 28 Oct 2026

## Contributors

| Name | Links |
| --- | --- |
| Arindam Choudhury | [GitHub](https://github.com/ari20089) · [LinkedIn](https://www.linkedin.com/in/arindam-choudhury/) |

## Version history

| Version | Date | Comments |
| --- | --- | --- |
| 1.0 | November 2026 | Initial release |

## Help

Prompts here are community samples without support. Search [existing issues](https://github.com/ari20089/agents-in-practice/issues) or [open a new one](https://github.com/ari20089/agents-in-practice/issues/new/choose). For Microsoft product questions use Microsoft Learn or your Microsoft support channel.

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
