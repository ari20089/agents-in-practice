# Power Platform ADR

## Summary

"Should this be an Agent Builder agent, a Copilot Studio agent or a Power Apps code app?" comes up on almost every Microsoft 365 and Power Platform project, and the answer usually lives in a meeting nobody wrote down. Six months later someone asks why the team can't add a connector to the agent, or why every user suddenly needs a Premium licence.

This prompt writes that decision down as an Architecture Decision Record (ADR). Paste it into a Copilot chat with the decision and its context, and it works through three phases:

- **Frame**: restates the problem as a question, lists the decision drivers, and records architecturally significant requirements (ASRs) by kind: cost, performance, security, compliance, availability, scalability, maintainability or evolvability. If it can't tell who the users are, where they reach the solution, or what it must change, it asks about only those before going further;
- **Decide**: scores every option against every driver as meets, conditional (meets only if a licence or setting is enabled), unconfirmed (the prompt's facts don't cover it; ranks below conditional), knock-out (can't meet a must-have) or fails (can't meet a driver that isn't a must-have), and shows the scores as a table in the record. A preview feature can't meet a production must-have unless you allow it. It picks the option that clears every knock-out and serves the most drivers; on a tie, the one with fewer products, licences and code;
- **Govern**: sets the status to `proposed`, names people by role rather than by name, turns each conditional or unconfirmed score of the chosen option into a confirmation step, names each option's billing model and when billing starts, says how the decision could be reversed and at what cost, and links any accepted ADR it supersedes.

It returns one record in [MADR v4.0.0](https://github.com/adr/madr) form, ready to save as `docs/planning/adrs/NNNN-kebab-case-title.md`, followed by the file name and up to five open questions. For a small, reversible choice you can ask for a one-sentence Y-statement instead.

The Microsoft facts the scoring relies on are written into the prompt, dated 1 November 2026, so it works in a chat that can't browse. It only writes the record: it doesn't build anything or change files.

This is the [HVE Core](https://github.com/microsoft/hve-core) ADR Creator's approach, scoped to Power Platform. HVE Core's agent is general-purpose: it keeps state across turns, can research, and hands off to planners. This prompt trades those for a single paste that already knows the three Power Platform options. It follows HVE Core's prompt standards: Overview, Inputs, Workflow Steps, Success Criteria, Examples and Error Handling sections, and RFC 2119 keywords (MUST, MUST NOT) on the rules that bind.

## What's in the folder

| File | What it's for | Where it goes |
|---|---|---|
| [`PROMPT.md`](./PROMPT.md) | The prompt: inputs and defaults, the Microsoft facts for each option, the three phases, the MADR output shape, examples and error handling. 7,999 of the 8,000 characters allowed, so trim before adding to it. | Pasted into chat, as is, with the two placeholders filled in |
| [`assets/preview.png`](./assets/preview.png) | The gallery image: the HR policy scenario and the record the published prompt wrote for it in its final test run | For people only |

## Run it

**Microsoft 365 Copilot Chat, or any other Copilot chat**

1. Paste the contents of `PROMPT.md`.
2. Fill in the **Decision** and **Context** lines. Change the defaults (options, format, number) if you need to.
3. Answer its questions if it asks about the audience, the channel, or whether the solution changes data elsewhere.
4. Copy the record into `docs/planning/adrs/` under the file name it gives, and review it like any other pull request.

**GitHub Copilot Chat in VS Code**

1. Open the repository that holds your ADRs. In the Chat view, start a **Local** session with the **Agent** control on Agent, so Copilot can read `docs/planning/adrs/` to pick the next number and spot an accepted ADR this one supersedes.
2. Paste the contents of `PROMPT.md`, fill in the two placeholders, and send it.
3. Ask Copilot to save the record under the file name it gives, or copy it yourself.

To run it again with `/power-platform-adr`, save it as `.github/prompts/power-platform-adr.prompt.md` with this header above the prompt. Prompt files run only in Local harness sessions; in any other session, paste the prompt. Leave the placeholders in the saved file and fill them in each time: the prompt asks for them if you don't.

```markdown
---
description: Write an ADR choosing between Agent Builder, Copilot Studio and a Power Apps code app.
agent: agent
---
```

### Run it with HVE Core

With the HVE Core extension or Copilot CLI plugin installed, save the prompt as a prompt file in HVE Core's format:

1. Save `PROMPT.md` as `power-platform-adr.prompt.md`: in your own repository under `.github/prompts/`, or, to contribute it to HVE Core, under `.github/prompts/<package-id>/` as HVE Core's prompt guide requires.
2. Put this header above the prompt. HVE Core requires `description` (one sentence, 10 to 200 characters); the rest are its optional fields. Leave out `agent:`: in HVE Core it hands the prompt to a named custom agent, and this prompt runs on its own. If you'd rather use HVE Core's own ADR Creator with its state and handoffs, run that agent and paste the "What Microsoft documents" section in as context.

   ```markdown
   ---
   description: 'Write a MADR v4 decision record choosing between Agent Builder, Copilot Studio and a Power Apps code app'
   argument-hint: "decision=... context=..."
   version: '1.0.0'
   author: 'ari20089/agents-in-practice'
   lastUpdated: '2026-11-01'
   ---
   ```

3. Replace the two placeholder lines with `Decision: ${input:decision}` and `Context: ${input:context}`. Leave the line after the defaults: if either input is missing, the prompt still asks for it.
4. Run `/power-platform-adr decision=... context=...` in chat.

**Placeholders**

- `<the question…>`: the decision in one line, such as "How do we deliver the expense policy assistant?"
- `<who uses it…>`: the facts the decision turns on. Who uses it (employees or customers), where (Microsoft 365 Copilot, Teams chats or channels, a web app, a website, a phone line) and how outside users sign in; what it reads and what it changes; data sources; volume; the team's skills; licences held; the cloud (commercial, GCC, GCC High or DoD); encryption-key, residency or production rules; the deadline. The more of these you give, the fewer questions it asks and the sharper the knock-outs.

## What it checks

The prompt states each fact below so the agent doesn't need current documentation. Each rests on these pages:

| What the prompt says | Basis |
|---|---|
| Host vs tool | "Keep this decision separate from the agent authoring method. Where an agent runs or is hosted determines its orchestration capabilities, model access, and operational features." Microsoft Copilot "provides a managed orchestrator. You get predictable, license-included cost and consistent behavior, with limited control over the loop itself"; Work IQ grounding is "included with the Microsoft 365 Copilot license; unlicensed users are billed consumptively". Copilot Studio "provides configurable orchestration… Cost ranges from license-based to consumption-based". "Don't pay model inference for work that's deterministic" (Choice of agent host) |
| Agent Builder: what and where | "Guided natural-language configuration without a source-code project" (Choose between Agent Builder and Copilot Studio); declarative agents "Can be developed with low-code tools (Agent Builder) and pro-code tools", "Run in Microsoft 365 Copilot and Microsoft 365 apps like Teams, Word, Excel, and Outlook" and are "Designed to be used by individuals" (Compare declarative and custom engine agents). Built from "microsoft365.com/chat", "office.com/chat" and "Microsoft Teams desktop and web client"; knowledge "on SharePoint and information provided by Copilot connectors", a "**Web content** toggle in the **Knowledge** pane" (Agent Builder overview); "Embedded files" (Copy an agent). "Custom skills are in preview" (Choose between Agent Builder and Copilot Studio). Government clouds: "GCC: Full declarative agent support is available"; "Agent Builder is also now available in GCCH"; "Agent Builder isn't available for declarative agents in DoD" (Declarative agents for Microsoft 365 Copilot) |
| Agent Builder: no external actions | "Agent Builder doesn't support authoring actions that integrate external services. To add low-code actions, connectors, or workflows, copy the agent to Microsoft Copilot Studio" (Agent Builder overview) |
| Agent Builder: audience, limits, lifecycle | "Users in your organization, through supported sharing and org-catalog publishing"; "Needing users across several departments doesn't by itself require Copilot Studio" (Choose between Agent Builder and Copilot Studio). An admin "publishes it to the Agent Store under **Built by your org**", and "Changes apply to the Agent Store listing only after an admin approves a resubmission" (Submit agents to your org catalog). "You can't use agents built in Agent Builder in Teams group or 1:1 chats"; "Customer Managed Keys aren't supported" (Agent Builder overview). "No versioning", CI/CD "None", telemetry "Limited"; "Promote Microsoft Copilot declarative agents built in Agent Builder to a declarative agent authored with the Microsoft 365 Agents Toolkit. This strategy maintains Microsoft Copilot as the orchestrator"; the same table's "Pro Code" column lists "Versioning with concurrent editing" and CI/CD "Yes" (Choice of agent host). "Admins manage Agent Builder through the Microsoft 365 admin center" (Copy an agent) |
| Declarative agent licensing | Copilot Chat without usage-based billing: custom instructions, code interpreter, image generator and web search ✅; Copilot connectors, SharePoint data, embedded file content and Dataverse ❌ without usage-based billing or a licence; email, people, Teams messages and Teams meetings ✅ only for licensed users. "Usage-based billing isn't supported in Microsoft 365 Government Community Cloud High (GCCH) and Government Community Cloud (GCC) environments"; "Agents grounded in shared tenant work data aren't currently available in Microsoft 365 Government Community Cloud (GCC), Government Community Cloud High (GCCH), or Department of Defense (DoD) environments" (Set up your development environment, Agent capabilities and licensing models) |
| Copy to Copilot Studio | Copies "Name", "Description", "Instructions", "Suggested prompts", "Agent icon", "SharePoint files, folders, and sites added as knowledge" and "Websites added as knowledge". Copilot connectors: "Set up connectors after you copy"; embedded files: "Upload the files again"; "Scoped Copilot connectors" and "Create images from prompts": "Not currently supported in Copilot Studio". "Updates to the original agent don't affect the copied version"; requires "a Copilot Studio license or a Microsoft 365 Copilot license" and an environment with "applicable Dataverse data store" (Copy an agent) |
| Copilot Studio | "A graphical, low-code studio for building and managing AI-powered agents and workflows"; "Because it's low-code, you can build capable solutions without an extensive technical background, while still giving professional makers the depth they need" (Copilot Studio overview). SharePoint, file, website, Dataverse and Graph connector knowledge are Supported on both the standard and Microsoft Copilot (formerly GitHub Copilot) harnesses (GitHub Copilot harness overview). "Internal or external users, through channels supported by the selected harness"; "Power Platform environment and connector controls, plus applicable Microsoft 365 agent and channel controls" (Choose between Agent Builder and Copilot Studio). "Versioning, staged deployments, rollback options"; "multiple environments (development, test, production)"; "managed via a Power Platform solution" (Copy an agent). "Admins can enable customer-managed encryption keys (CMK) for their Copilot Studio environments" (Security and governance). "Enable source control with native Git integration"; "Pipelines in Power Platform for Copilot Studio: Simplifies deployments for citizen developers" (Establish an ALM strategy). "Copilot Studio is available in the US Government Community Cloud (GCC) plan" (Standard harness licensing); "Teams & Microsoft Copilot Channel": "Available in GCC" Yes, "Available in GCC High" No (US Government customers). The prompt keeps source control and deployment apart: Choice of agent host says "promote the agent to a managed pipeline in Power Platform" but links that phrase to Git integration |
| Copilot Studio harnesses | The GitHub Copilot harness is now the Microsoft Copilot harness: Microsoft is "updating the name to the **Microsoft Copilot harness**" and existing agents "continue working as they do today, with no changes to capabilities or billing"; "over the coming weeks, you'll begin seeing the updated terminology throughout the product" (The GitHub Copilot harness is now the Microsoft Copilot harness, 28 Oct 2026). Learn pages still use the old name, so the quotes below keep it. Its channels available: Microsoft Copilot, Microsoft Teams, Demo website, Web app (Available channels, GitHub Copilot). Manual or custom authentication "Not supported" on the GitHub Copilot harness, Supported on standard (GitHub Copilot harness overview). It "natively creates and edits Word, Excel, PowerPoint, and PDF files, supports skills and memory" (Harnesses in Copilot Studio); memory is "prerelease documentation" and "User memory is disabled in group chats and Microsoft Teams channels" (Memory (GitHub Copilot) (preview)). Its usage "isn't included with a user's Microsoft 365 Copilot license": GitHub Copilot harness agents are "Billed for all usage... regardless of the user's license", while standard harness agents are covered "Yes, in Microsoft 365 channels" (Manage costs for agents powered by the GitHub Copilot harness). Customer Conversation: Web chat, Teams Phone, Dynamics 365 Contact Center, Genesys, Bring your own (Available channels, Customer Conversation); it "can call tools across connectors, knowledge, MCP, and connected agents" (Harnesses in Copilot Studio); "Using, building, testing, and evaluating agents might consume Copilot Credits"; "Speech channels don't support end-user sign-in, so knowledge sources that require end-user credentials only work for Chat conversations" (Customer Conversation overview). Standard channels: "Teams and Microsoft Copilot", SharePoint, WhatsApp, Custom Website, Mobile App, Facebook and Azure Bot Service channels including Slack and Email; the demo website "isn't intended for production use", so the prompt leaves it out (Key concepts: Publish and deploy). Standard agents can be added "to a team channel" and to "group and meeting chats", but "In Teams group chats and channels, Copilot Studio agents can't use knowledge sources that require end‑user authentication, such as SharePoint" (Connect and configure an agent for Teams and Microsoft Copilot). "The GitHub Copilot harness charges credits from the moment you start building", unlike the standard harness, "which starts billing after publish" (Usage-based billing); the prompt says only that Customer Conversation building and testing "may" consume credits, because that is all its pages say. "Agents created with the GitHub Copilot harness can't be transferred to the standard harness, and vice versa" (GitHub Copilot harness overview). For the standard harness, "If you have a Microsoft 365 Copilot license, using agents in Copilot Chat, Microsoft Teams, or SharePoint for *classic answers*, *generative answers*, or *Microsoft Graph tenant grounding* doesn't count against the Copilot Studio message pack or meter" (Standard harness licensing) |
| Power Apps code app | Built "from code-first IDEs such as Visual Studio Code", with "full control over your UI and logic"; "Microsoft Entra authentication"; "1,500+ connectors, callable directly from JavaScript"; enabled per environment by an admin; end users need "Power Apps Premium license", "Pay-as-you-go enabled", "An App Pass" or "Auto-claim enabled". Managed platform: sharing limits, data policy enforcement at launch, Conditional Access on an individual app, quarantine, Azure B2B. Limits: "served from a publicly accessible endpoint that doesn't support IP-based restrictions today. To restrict access by IP, use Conditional Access – block access by location"; "don't yet support Secure Implicit Connections"; "Code apps don't support Power Platform Git integration" (Code apps overview). "Don't store sensitive user or organizational data in the app" (Code apps system configuration). "To add the app to a solution, a Power Platform environment with Dataverse"; "use Power Platform Pipelines to deploy across stages (Dev → Test → Prod)"; code apps "Don't support source code integration" (ALM for code apps) |
| Code app calling a Copilot Studio agent | Add the "Microsoft Copilot Studio connector" (`shared_microsoftcopilotstudio`) and invoke a published agent with `ExecuteCopilotAsyncV2`, which "returns agent responses synchronously". Prerequisite: "A published Microsoft Copilot Studio agent in your environment". The page doesn't say which harnesses the connector can call (Connect to Copilot Studio) |

The record format comes from these:

| What the prompt asks for | Basis |
|---|---|
| MADR v4.0.0 sections and frontmatter (`status`, `date`, `decision-makers`, `consulted`, `informed`) | The MADR v4.0.0 template, released under CC0-1.0, as embedded in HVE Core's ADR standards |
| `asrTriggers` with `kind`, `evidence` and a `note` of 280 characters or fewer, from eight kinds | HVE Core's ASR trigger schema (GP-07) |
| Frame, Decide and Govern phases; status `proposed` for new records; roles, not names; `NNNN-kebab-case-title.md` | HVE Core's ADR Creator agent and ADR standards ("Personas, Not People"; file-naming rule GP-16; status taxonomy) |
| Y-statement option | The Y-statement concept by Olaf Zimmermann and Uwe Zdun, in HVE Core's six-slot rendering |

## Prerequisites

- Any Copilot chat: Microsoft 365 Copilot Chat, GitHub Copilot Chat in VS Code, the GitHub Copilot CLI or another chat assistant. To number the record and find what it supersedes, the agent needs to read your repository; otherwise it uses 0001 and you renumber it.
- For the HVE Core prompt file: VS Code with GitHub Copilot Chat and the HVE Core extension, or the GitHub Copilot CLI with the HVE Core plugin.
- A place to keep ADRs, such as `docs/planning/adrs/` in the repository the decision governs, reviewed through pull requests.

## Limitations

- Written against 27 Microsoft Learn pages dated 16 January to 29 October 2026, all read on 1 November 2026. Agent Builder, Copilot Studio harnesses and code apps all change often, and several features named here are in preview; check the Sources before relying on a record, and update the facts in the prompt when a page changes.
- The prompt covers three options and their combination. Of the Microsoft 365 Agents Toolkit it knows only Microsoft's advice to promote an Agent Builder agent there for versioning and CI/CD. Canvas or model-driven apps, Azure AI Foundry and custom engine agents it knows only by name; if you list one, the record marks its facts "not covered by this prompt" rather than inventing them.
- Choice of agent host (23 June 2026) says Copilot Studio can also author declarative agents hosted by Microsoft Copilot, but the page it links to now redirects to the harness overview, so the prompt doesn't offer that route as an option.
- Microsoft renamed the GitHub Copilot harness to the Microsoft Copilot harness on 28 October 2026. As of 1 November 2026 every Learn page cited here still uses the old name, and the product is changing "over the coming weeks". The prompt uses the new name and gives the former one once; a Decision that names the GitHub Copilot harness is read as the same option, not an extra one.
- Copilot Studio runs in GCC and GCC High. Its feature table lists "Teams & Microsoft Copilot Channel" as available in GCC but not in GCC High, and "client applications are limited to the web-user client and aren't available in Microsoft Teams" (US Government customers). No harness is named per cloud and DoD isn't mentioned, so which harness runs in which government cloud isn't documented as of 1 November 2026.
- The Copilot Studio facts are a summary. Knowledge, connectors, tools and workflows are stated once for the product, not per harness, so a record may ask which harness has what. For a decision that turns on which harness to use, run the [Copilot Studio Harness Chooser](../copilot-studio-harness-chooser/) first and paste its answer into the Context line.
- No prices or credit amounts: licensing and consumption depend on your agreements. The record says which licence or billing model each option needs, not what it costs.
- Maker licensing isn't covered: the prerequisites page says Microsoft 365 subscribers without a Copilot add-on licence "do not have access to agent authoring or advanced agent experiences", yet also that Copilot Studio is available to all Microsoft 365 users. Confirm who may build with your administrator.
- Memory on the Microsoft Copilot harness is a preview feature and is off in group chats and Teams channels, so a production must-have that needs it is caught by the preview rule unless you allow it.
- Whether a code app can be reached from inside Microsoft 365 Copilot or Teams chat isn't documented on the code apps pages as of 1 November 2026, so the prompt doesn't assume either.
- The record is a proposal. It reflects the context you give it and the facts above; deciders still have to accept it, and the confirmation step is only as good as the reviewer who runs it.
- Tested over nine rounds on nine scenarios, run by a coding agent given only the prompt and no repository, not inside Copilot Chat itself.
  - The first rounds found two omissions that changed answers. The prompt listed only some standard harness channels, so a website assistant went to a preview harness, and it missed the documented Conditional Access mitigation for code apps. Both were fixed.
  - A Microsoft Learn review on 1 November 2026 then corrected five facts: an unsupported inference about Secure Implicit Connections, Git integration confused with pipelines, scoped connectors, licence-included cost for unlicensed users, and Customer Conversation billing. It also added code app solutions and pipelines, government-cloud limits, customer-managed keys, Teams group-chat behaviour, Microsoft Copilot harness sign-in and the Agents Toolkit route.
  - The next rounds added the driver table, conditional and unconfirmed scores, billing models, reversal cost and the preview rule.
  - A last round on 1 November 2026, after the rename, re-ran the HR policy and trading-desk scenarios and added one that names the old harness. All three kept their earlier answers and used the new name. All three runs were unsure whether Confirmation covers every option, and two invented a score for a driver an option can't meet that isn't a must-have; the prompt now limits Confirmation to the chosen option and adds a "fails" score. Those records also scored Copilot Studio "unconfirmed" on a build without developers, because the facts didn't say what skill it needs; the prompt now carries Microsoft's "low-code" description from the Copilot Studio overview.
  - A second Microsoft Learn review on 1 November 2026, by two reviewers working from the pages alone, corrected five more facts: Agent Builder is "low-code" with "guided natural-language configuration without a source-code project", not no-code; memory on the Microsoft Copilot harness is preview and off in group chats and Teams channels; "credits from the moment you start building" is said of that harness only, so Customer Conversation now reads "may consume credits"; a Microsoft 365 Copilot licence covers standard-harness agents in Microsoft 365 channels but not Microsoft Copilot harness agents; and "shared" tenant work data. It added where declarative agents run, government-cloud availability for Agent Builder and Copilot Studio, voice-channel sign-in on Customer Conversation and the connector's same-environment rule. The HR policy, GCC High and field-service scenarios were then re-run on the final prompt; the HR record is the one in the gallery image.
- Results, from the last round each scenario ran in:
  - An HR policy assistant for 4,000 employees in Microsoft 365 Copilot, read-only over SharePoint, no developers: Agent Builder, conditional on usage-based billing for the 1,600 Copilot Chat users, with the Agents Toolkit or Copilot Studio as the documented way out. On the final prompt, Agent Builder and the standard harness both served every driver (the standard harness is zero-rated for licensed users), and the tie-break (fewer products, licences and code) chose Agent Builder. The Microsoft Copilot harness "fails" on cost because credits start at first build and licences don't cover it; both code-app options were knocked out on the channel and on needing developers; the only "unconfirmed" cells were the two code-app documentation gaps.
  - The same assistant described as "in Teams 1:1 chat": Copilot Studio's standard harness, because Microsoft says Agent Builder agents can't be used "in Teams group or 1:1 chats". The wording of the Context decides this, so say whether you mean Copilot in Teams or Teams chats.
  - A policy assistant in a GCC High tenant, 2,000 licensed employees in Microsoft 365 Copilot and Teams, two makers: no option cleared every must-have. Agent Builder is documented as available in GCC High but agents grounded in shared tenant work data aren't there yet; Copilot Studio is there but its Teams and Microsoft Copilot channel isn't; code apps aren't documented for it. The record chose Agent Builder on fewest knock-outs and most drivers served, gated on the grounding gap, with the standard harness on the SharePoint channel as the named fallback. Before the review added Agent Builder's GCC High availability, the same scenario chose the standard harness.
  - A trading-desk assistant @mentioned in a Teams channel, answering from SharePoint, filing ServiceNow tickets, needing customer-managed keys and dev, test and prod: Agent Builder and the standard harness knocked out (no actions or keys; SharePoint knowledge doesn't work in Teams channels). The Microsoft Copilot harness was chosen, with its Teams channel behaviour to prove in dev.
  - "The GitHub Copilot harness or the standard harness?" for a field-service assistant in Microsoft 365 Copilot and Teams that reads Word and Excel manuals, remembers open jobs and updates Dataverse, production in eight weeks: Copilot Studio's standard harness. The Microsoft Copilot harness, listed once with its former name, was knocked out because its memory is preview and the prompt doesn't let a preview feature carry a production must-have; the record's first open question asks whether to allow it, and reading open jobs back from Dataverse became a confirmation step. Before the review added the preview flag, the same scenario chose the Microsoft Copilot harness.
  - An inspection web app with a custom UI over Dataverse, a React team, dev, test and prod, source in Git: a code app, with "no Power Platform Git integration" left as the open knock-out to settle with the team.
  - A customer returns assistant on a public website writing to Dynamics 365: Copilot Studio's standard harness on the custom website channel, over the preview Customer Conversation harness.
  - A supplier portal with a security rule against outside IP access: a code app calling a Copilot Studio agent, kept `proposed`. The record cites location-based Conditional Access and notes that it restricts sign-in, not who can reach the built files.
  - "Copilot Studio or a code app?" for "the procurement team": it stops and asks for the audience, the channel and what the solution must change.
- Scoring still takes judgment where Microsoft's documentation is silent. The prompt scores those cells "unconfirmed" and turns them into confirmation steps. Two runs of the same scenario can still break a tie between the standard and Microsoft Copilot harnesses differently; the record says which reason it used.

## Sources

Microsoft Learn, with each page's `ms.date` when it was read on 1 November 2026:

- [Agent Builder overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder), 26 Oct 2026
- [Compare declarative and custom engine agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agents-overview), 30 Sep 2026
- [Declarative agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-declarative-agent), 30 Sep 2026
- [Choose between Agent Builder and Copilot Studio to build your agent](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/copilot-studio-experience), 23 Oct 2026
- [Copy an agent from Agent Builder to Copilot Studio](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/copy-agent-to-copilot-studio), 30 Sep 2026
- [Set up your development environment for a Microsoft 365 Copilot plugin: Agent capabilities and licensing models](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/prerequisites#agent-capabilities-and-licensing-models), 30 Sep 2026
- [Submit agents from Agent Builder to your org catalog](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder-submit-to-org-catalog), 30 Sep 2026
- [Choice of agent host](https://learn.microsoft.com/en-us/agents/architecture/host-platform), 23 Jun 2026
- [Overview - Microsoft Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio), 27 Oct 2026
- [Harnesses in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/harnesses-overview), 19 Oct 2026
- [Agents powered by the GitHub Copilot Harness overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/overview), 19 Oct 2026
- [Memory (GitHub Copilot) (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/memory-overview), 27 Jul 2026
- [Available channels for agents (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/publication-channels-overview), 23 Jun 2026
- [Available channels (Customer Conversation) (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/publication-channels-overview-customer-conversation), 8 Oct 2026
- [Agents powered by the Customer Conversation harness overview (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/overview-customer-conversation), 8 Oct 2026
- [Connect and configure an agent for Teams and Microsoft Copilot](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-add-bot-to-microsoft-teams), 29 Oct 2026
- [Security and governance (Copilot Studio)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-and-governance), 24 Sep 2026
- [Establish an ALM strategy (Copilot Studio guidance)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/alm), 16 Jan 2026
- [Key concepts: Publish and deploy your agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-fundamentals-publish-channels), 16 Sep 2026
- [Overview of usage-based billing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/billing-credit-overview), 6 Oct 2026
- [Standard harness licensing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing), 3 Aug 2026
- [US Government customers (Copilot Studio)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-licensing-gcc), 20 Jul 2026
- [Manage costs for agents powered by the GitHub Copilot harness](https://learn.microsoft.com/en-us/power-platform/admin/manage-usage-github-copilot-harness), 28 Oct 2026
- [Power Apps code apps: features and requirements](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/overview), 23 Sep 2026
- [How to: Connect to Copilot Studio (code apps)](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/connect-to-copilot-studio), 13 Aug 2026
- [How to: ALM for code apps](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/alm), 27 Aug 2026
- [Code apps system configuration](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/system-limits-configuration), 15 Sep 2026

Other sources, read on 1 November 2026:

- [The GitHub Copilot harness is now the Microsoft Copilot harness](https://www.microsoft.com/en-us/copilot/blog/copilot-studio/the-github-copilot-harness-in-copilot-studio-is-now-the-microsoft-copilot-harness/), Microsoft Copilot Studio blog, 28 Oct 2026
- [microsoft/hve-core](https://github.com/microsoft/hve-core) (MIT licence), last changed 31 Oct 2026: the [ADR Creator agent](https://github.com/microsoft/hve-core/blob/main/.github/agents/project-planning/adr-creation.agent.md), [ADR standards](https://github.com/microsoft/hve-core/blob/main/.github/instructions/project-planning/adr-standards.instructions.md), and [Contributing Prompts to HVE Core](https://github.com/microsoft/hve-core/blob/main/docs/contributing/prompts.md), dated 7 Oct 2026
- [MADR v4.0.0](https://github.com/adr/madr), CC0-1.0
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
