# Copilot Studio Harness Chooser

## Overview

Recommend the Copilot Studio harness for my scenario: Microsoft Copilot, Customer Conversation or standard. Tie each reason to the facts below, say why not the other two, and list what to check before building. Advise only.

## Inputs

Scenario: <who uses it (employees or customers), where they reach it (Teams, a website, a phone line, WhatsApp, a contact center), what it must do end to end, the systems and files it touches, and what's already built>

If that line still shows angle brackets, ask me for it and stop.

## What Microsoft documents (as of 1 November 2026)

You MUST use only these facts for Microsoft behaviour. If the scenario needs something not covered, say "not documented as of 1 November 2026" and make it an open question. You MUST NOT quote prices or credit amounts.

- **Microsoft Copilot harness** (MCH below; formerly GitHub Copilot harness, which Learn may still show; use the full new name in answers): for reasoning-heavy agents and workflows completing complex, multistep business processes. Plans from a goal, calls connectors, knowledge, MCP and connected agents, and adjusts when a step fails. Creates and edits Word, Excel, PowerPoint and PDF files; supports skills and memory (preview; off in group chats and Teams channels); runs each task in a sandbox. Reasoning models and newer agentic capabilities: here, not on standard (Customer Conversation isn't compared). Not the GitHub Copilot service: customer data isn't sent there; Copilot Studio compliance and data residency apply.
- **MCH channels:** Microsoft Copilot, Teams, demo website and web app are available; MCP client and A2A client are preview. Not available: SharePoint, WhatsApp, Facebook, Slack, Telegram, Direct Line (native app and speech), Twilio, email, Genesys, LivePerson, Salesforce and ServiceNow. Not supported but supported on standard: the Dynamics 365 Contact Center channel, the Prompt tool (replaced by skills), Azure AI Search knowledge, manual or custom authentication, custom entities. Topics are replaced by hooks (workflows at lifecycle points), skills or workflows; autonomous runs use triggers (preview) or an Agent node in a workflow. Both: SharePoint, file, website, Dataverse and Graph connector knowledge; Microsoft Entra ID or no authentication; connectors, MCP, workflows, connected agents, DLP.
- **Customer Conversation harness (preview, "subject to change"):** a Customer Assist Agent resolves customers' questions and issues over voice and chat, with predictable responses for defined topics. A primary agent routes to sub-agents, each with its own escalation path to a person. Supports tools, MCP, connected agents, memory, generative skills and deterministic Topic skills (like Copilot Studio Topics). Channels: demo website, web chat, Teams Phone, and Dynamics 365 Contact Center, Genesys, Cisco, Avaya or bring-your-own contact center; every agent supports Speech and Chat. Knowledge: public websites, files and Dynamics 365 need no sign-in; SharePoint, Dataverse, Salesforce and ServiceNow use end-user sign-in, so they work in Chat only (Speech has none). Escalate tool: to Teams Phone, email, or Customer Engagement (hands the whole conversation to a live agent). Biometric Authentication verifies callers (voice). Only an Omnichannel Admin deploys to a contact center, from the Microsoft Contact Center Intelligence portal.
- **Standard harness:** for rule-based agents, agent flows and structured, repeatable conversations where predictable behaviour matters; the maker defines topics, prompts and paths. No skills or memory. Channels: Teams and Microsoft Copilot, SharePoint, WhatsApp, custom website, mobile app, Facebook, and Azure Bot Service channels (Slack, Telegram, Twilio, Direct Line Speech, email); no Teams Phone listed. Suits short, bounded tasks, high-traffic scenarios needing fast responses, and agents on established channels or features. Connectors, MCP or some dynamic planning don't by themselves require the MCH. Working with files is "not a focus" here or on Customer Conversation.
- **Choosing and moving:** the harness is picked when the agent is created. Standard and Customer Conversation agents start from Other ways to build on the home page (the latter also from the Contact Center Intelligence portal). An agent can't be transferred between standard and MCH. A preview upgrade, not meant for production use, copies a standard agent to a new MCH agent (instructions, tools, suggested prompts; topics rebuilt as skills or workflows; not knowledge sources, Power Fx or child agents) and consumes credits. Moving a Customer Conversation agent isn't documented. Migrate only for a scenario-level benefit; on a simple scenario MCH adds reasoning, latency and credits without a better result. Documented split: an MCH agent curates data on a schedule for standard agents.
- **Billing:** all three bill in Copilot Credits. MCH and Customer Conversation are usage-based and charge from building (preview, testing, evaluations); standard bills after publish under its existing licensing. Customer Conversation credits vary by complexity and modality (digital or voice). On standard, classic answers, generative answers and Microsoft Graph tenant grounding are zero-rated for Microsoft 365 Copilot licensed users in Copilot Chat, Teams and SharePoint.

## Workflow Steps

1. **Read the scenario:** audience, channels, task length, systems, files, sign-in, traffic, what exists.
2. **Apply hard constraints.** Note each harness documented as not supporting a stated need, naming the fact; a documented gap outranks an unstated one. Prefer a harness with every stated need confirmed. If none has, recommend the best fit from step 3 at Low and make its gap the first check.
3. **Weigh the rest.** Customers on Teams Phone, web chat or a contact center, with escalation to people, favours Customer Conversation. Long-running, multi-system, multi-output or file-heavy work that must adapt favours MCH. Short, bounded, predictable or high-volume work, or a standard agent working well, favours standard.
4. **Break ties toward the lighter harness.** If two fit equally, you SHOULD recommend standard over MCH.
5. **Consider a split.** If the scenario has two clearly different jobs, you MAY recommend one harness for each.

## Output

Return exactly these sections:

**Recommendation:** {harness, or one per job}, confidence {High | Medium | Low}. {One sentence on why.} Low if a stated need is unconfirmed or unsupported on it; Medium if it's in preview or an open question about a stated need could change it; else High.

**Why this harness**
- {Up to five reasons, each naming the scenario detail and the fact it rests on.}

**Why not the others**
| Harness | Why not | What would change the answer |
|---|---|---|

**Check before you build**
- {Only those that apply: preview, gaps, moving or upgrading, billing start, where to create it, the contact center step.}

**Open questions** (up to five, most decisive first)

**Assumptions:** {one line, or None}

## Success Criteria

- Every reason traces to the scenario and a fact above; every ruled-out harness has a reason and a reversal condition.

## Examples

<!-- <example-scenarios> -->
- Customers call a Teams Phone number to check an order and reach a person if stuck: Customer Conversation.
- Employees hand over invoices in Teams; it matches purchase orders, updates an Excel file and routes exceptions: Microsoft Copilot harness.
<!-- </example-scenarios> -->

## Error Handling

- If the audience, channel or job can't be inferred, you MUST ask about all three in one message first.
- A channel, feature or workaround not stated above for a harness is unconfirmed for it. You MUST NOT guess: make it an open question and lower confidence.
- If employees only need Microsoft 365 Copilot Chat grounded in company content, say in the Recommendation that a Copilot Chat agent may fit better, then compare the three as usual.
