# Review gate for Copilot Studio agents with an account

**Owners, decision rights, credit caps and audit before an agent with its own identity goes live**

> **Status:** Written 31 October 2026 against Microsoft Learn pages re-read that day. Agent accounts are a Frontier preview; triggers, hooks and sharing on the Microsoft Copilot harness are in preview; several Entra Agent ID controls are in preview. Treat every statement below as "true of the docs on that date" and re-check the sources in the last section before you rely on it.

## Who this is for

- Microsoft 365, Entra and Power Platform admins asked to let a Copilot Studio agent with its own account go live
- Risk, security, finance and audit reviewers who sign off on it
- Makers who want to know what the review will ask for before they publish, because some answers cannot be changed afterwards

## The short version

1. An agent with an account is three things: a **user-like account** with a mailbox, Teams presence and directory entry (provisioned and governed by Microsoft Agent 365), a separate **Microsoft Entra Agent ID**, and the Copilot Studio agent itself with its instructions, triggers, tools and **shared memory**. Each has its own owners, controls and logs.
2. **Ownership is partly fixed at publish.** The agent's email address uses the maker's alias as a fixed prefix and the agent "reports to" the maker; neither can be changed during the preview. Decide who the maker is before anyone selects **Publish**.
3. **Decision rights are mostly soft.** No Microsoft page documents a per-tool human approval step for this harness. The hard limits are the tools the agent has, the permissions behind them, data policies, and encryption labels. Instructions guide; a **Pre tool use** hook can block a call but "the agent continues as though the hook returned nothing" if the hook fails.
4. **Credits are billed for everything** on this harness, from the first build session, and a Microsoft 365 Copilot licence covers none of it. A per-agent monthly limit with **Stop usage** is the only documented per-agent hard stop, and it is not instant.
5. **Audit is spread across Purview Audit, Data Security Posture Management, Entra logs, the Copilot Studio Monitor tab and protection status, the Microsoft 365 admin center and your own hook logs**, and has documented gaps: no audit event for triggers or hooks, no transcript text in Purview Audit, sessions kept 28 days in Monitor, and no audit of shared memory.
6. **Frontier has no SLA.** Microsoft states there is no service level agreement for Agent 365 Frontier and "reserves the right to remove Frontier feature support at any time." A process that goes live on an agent with an account needs a manual fallback and a business owner who accepts that.
7. **Stopping it is spread across admin centers too.** Block, quarantine, turn off, a hard stop on credits, and disabling the Entra Agent ID each exist; none is documented to halt trigger-driven runs of an agent with an account. Test the one you will use before go-live.
8. The gate in section 7 turns these into pass/fail criteria with evidence, so the answer is **Go**, **Go with conditions** or **No go**, not a feeling.

## 1. What an agent with an account is

| Object | Created when | Managed in | Documented accountability |
|---|---|---|---|
| **Agent account** (Entra user-like account with mailbox, Teams presence, directory entry, one **Microsoft 365 Frontier for AI Teammates** licence) | First publish | Microsoft 365 admin center (Agent Registry), Microsoft Entra admin center | "reports to" the maker; alias prefix is the maker's; neither changeable in preview |
| **Entra Agent ID** (service principal with "Agent" subtype) | First publish on the Microsoft Copilot harness ("Copilot Studio doesn't provision the Entra Agent ID when you save the agent as a draft") | Microsoft Entra admin center | Copilot Studio adds "the agent owner ... as a sponsor with limited permissions compared to full owners" |
| **Copilot Studio agent** (instructions, triggers, tools, hooks, knowledge, shared memory) | Creation | Copilot Studio, Power Platform admin center | Agent owner in Copilot Studio; reassignable by an admin in the Microsoft 365 admin center |

Facts that frame the review (agent-account page, 15 Oct 2026, unless noted):

- **Prerequisites.** Tenant enrolled in Frontier with the Agent 365 terms accepted; environment on the **Early** release cycle; maker on Microsoft 365 E5 with the Agent 365 add-on, or Microsoft 365 E7; a free Frontier for AI Teammates licence at publish ("If no ... license is available in your tenant when you publish, publishing fails"). After enrolment, the Agent 365 Frontier page tells admins to "confirm you see 25 active licenses for Microsoft 365 Frontier for AI Teammates"; every agent with an account in the tenant draws from that pool. Enrolment itself needs "at least one license of Microsoft E7" and "Only a global admin for the tenant can enable Agent 365 Frontier" (*Preview Agent 365 features through the Frontier program*, 15 Oct 2026).
- **Terms and support.** Frontier previews "are subject to the existing preview terms of your customer agreements." The Frontier FAQ adds: "There is no specific Service Level Agreement associated with Microsoft Agent 365 Frontier. Frontier should not be used for product evaluations ... Microsoft reserves the right to remove Frontier feature support at any time."
- **The harness name.** Agents with accounts run on the **Microsoft Copilot harness**, called the GitHub Copilot harness until Microsoft renamed it on 28 October 2026 (*The GitHub Copilot harness is now the Microsoft Copilot harness*); Learn pages still use the old name. No page says agents with accounts run on it in those words: the agent-account page's billing note links the harness's billing page, and the identities page times Entra Agent ID provisioning for this harness at first publish, matching "When you publish it, the agent is provisioned with ... Microsoft Entra Agent IDs". Treat it as inferred. The harness "is a Microsoft Copilot Studio authoring and orchestration framework, not the GitHub Copilot service ... customer data isn't sent to or processed by the GitHub Copilot service" (*Harnesses in Copilot Studio*, 19 Oct 2026). Reviewers often stop on the name; quote this line.
- **Two admin switches.** The Copilot Studio (Frontier) agent template activation in the Microsoft 365 admin center, where "Only the users you select at this step and members of the selected groups can create agents with accounts", and the **Agent accounts** environment setting in the Power Platform admin center. Activation of an agent template in general "requires AI admin approval", and the wizard includes **Apply a template** (the default template "automatically assigns the license during activation") and **Review permissions and grant admin consent** (*Governance and Lifecycle actions*, 23 Sep 2026); which of these the Copilot Studio (Frontier) template uses is Q11.
- **Identity cannot be reshaped after publish.** "During this preview, you can't change the maker-based alias prefix or reporting relationship. You also can't change the email address for your agent after you publish the agent. Plan your agent's identity before publishing."
- **Two identities in Entra.** "Microsoft Agent 365 provisions and governs agent accounts ... Copilot Studio also creates a Microsoft Entra Agent ID that admins manage separately."
- **What it can reach.** "Supported operations can use the agent's own scoped access rights. Tools configured for end-user authentication use the agent's identity and consent." And: "The agent account does not automatically grant every tool permission. Check which identity a tool uses and grant only the access needed for the job."
- **Hard stops.** "Agents with an account can't read protected documents." The agent "doesn't respond to anyone outside its tenant", responds only in email conversations "with up to 250 people", and cannot co-author or make targeted edits to existing documents.
- **Labels, precisely.** Purview's Agent 365 page (1 May 2026) explains "protected": for an agent instance to read an encrypted file, the label's encryption "must explicitly grant the agent instance VIEW and EXTRACT usage rights. For example, a sensitivity label that's configured for **Add all users and groups in your organization** or **Add any authenticated users** wouldn't be sufficient." Files must also be explicitly shared with the agent. And: "Newly created content from Agent 365 doesn't inherit sensitivity labels from the source items. As a result, that content isn't automatically labeled or encrypted." A summary the agent writes from a Confidential source is unlabelled unless something else labels it.
- **Shared memory.** One memory per agent, shared by every user, "no privacy boundary between users", no opt-out; "If no one interacts with the agent for 28 days, the system automatically deletes its shared memories"; "Everyone who interacts with the agent can view or delete its saved shared memories" (*FAQ for agent accounts*, 14 Oct 2026). Memory governance (retention, holds, eDiscovery, deletion) is a separate review; see section 7, criterion F1.
- **Two pages disagree on timing.** *App registration, agent identities, and authentication* (21 Aug 2026) says the Microsoft Copilot harness provisions the Entra Agent ID "when you publish the agent for the first time", and later, in its quota section, that "The agent identity is provisioned when the agent is **created**." Treat first publish as the documented answer for this harness and note the conflict (Q10).

## 2. Owners and accountability

### 2.1 What Microsoft documents

**Copilot Studio sets a sponsor, not an owner.** "For Entra Agent IDs: The agent owner is added as a sponsor with limited permissions compared to full owners ... Some preexisting agents might not have sponsors yet." (*App registration, agent identities, and authentication*, 21 Aug 2026.) The Entra Agent ID is created by "A Microsoft-owned blueprint principal ... No one in your tenant - including tenant administrators - can generate tokens by using the agent identity."

**What each Entra relationship means** (*Administrative relationships in Microsoft Entra Agent ID*, 16 Apr 2026):

| Relationship | Microsoft's definition | Can | Cannot |
|---|---|---|---|
| **Owner** | "Technical administrators responsible for operational management ... including setup, configuration, and credential management." Optional. Users or service principals; "Groups aren't supported as owners." | Modify authentication properties, add owners and sponsors, disable, re-enable, restore, hard-delete | n/a |
| **Sponsor** | "Business representatives accountable for the agent's purpose and lifecycle decisions, including access reviews and agent retention, without technical administrative access. At least one sponsor is required for each agent identity." Users or some groups (dynamic membership groups, assigned Microsoft 365 groups; not role-assignable or assigned security groups). Up to 100, "with no more than 5 groups". | "disabling agent identities, modifying the identity's sponsors, or soft-deleting" | "Sponsors can't re-enable or restore" |
| **Manager** | "User responsible for the agent within the organization's hierarchy" | Request access packages for the agent's user account | "Managers don't have authorization to modify or delete agents" |
| **Sponsor on the agent's user account** | Same relationship as a B2B guest sponsor; up to 5; not required | Request access, take part in approvals | "No direct authorization to modify sponsored users" |

Microsoft recommends "maintaining the agent identity sponsor as the primary user or group responsible for the agent" and, if you set a sponsor on the agent's user account, using "the same user or group ... on both objects".

**When people leave.** "If the sponsor is leaving the organization, sponsorship of the agent identities is automatically transferred to their manager." The documented mechanism for that transfer is a Lifecycle Workflows task, so do not assume it happens in a tenant that has not configured one. Lifecycle Workflows have three tasks, "Send email to manager about sponsorship changes", "Send email to cosponsors about sponsor changes" and "Transfer agent identity sponsorships to manager", which "are classified as **mover and leaver** tasks" (*Governing Agent Identities*, 5 Jun 2026; *Agent identity sponsor tasks in Lifecycle Workflows*, 25 Oct 2025). Entra ID Governance for agents needs Microsoft 365 E7, or Agent 365 with at least Microsoft Entra ID P1 or Microsoft 365 E3.

**Where owners and sponsors act.** Owners and sponsors see their agents in the My Account portal under **Manage agents** (**Agents you sponsor**, **Agents you own**). **Disable agent** "blocks users from being able to access it and prevents it from being issued tokens. This has the same effect as disabling the agent from the admin center." Sponsors cannot re-enable (*Manage agents in end user experience*, 1 May 2026). What disabling the Entra Agent ID does to a Copilot Studio agent with an account, whose tokens come from a Microsoft-owned blueprint, is not documented (Q7).

**Ownerless and reassigned agents.** The Agent Registry lists **Agents without owners**; admins can block or delete them (*Agent Registry*, 21 Sep 2026). An admin can **Assign new owner** to "shared agents for Agent Builder and Copilot Studio agents"; after reassignment "The new owner gets full edit and delete permissions" and "The previous owner loses all access, including read rights" (*Governance and Lifecycle actions*, 23 Sep 2026).

**Cost ownership.** Microsoft's cost guidance asks you to decide "Who is responsible for reviewing usage and responding to alerts" and to "Keep an accountable business owner for each pay-as-you-go billing plan and environment" (*Manage costs for agents powered by the GitHub Copilot harness*, 28 Oct 2026).

### 2.2 What is not documented

- Whether "reports to" sets the Entra **manager** attribute on the agent's user account.
- Who, if anyone, is set as sponsor, owner or manager on the **agent's user account** (as distinct from the Entra Agent ID).
- Whether reassigning the owner in the Microsoft 365 admin center changes the alias, the "reports to" relationship or the Entra Agent ID sponsor (Q2).
- Whether a sponsor you add in Entra survives a republish from Copilot Studio (Q3).

### 2.3 The role map the gate requires

Name a person or group for each row before go-live. One person can hold several rows except where noted.

| Role | What they are accountable for | Where it shows | Note |
|---|---|---|---|
| **Maker / "reports to"** | The agent's identity for its whole life | Agent's email alias, org chart | Fixed at publish. Must not be a contractor, a leaver, or a shared service account. |
| **Copilot Studio owner** | Instructions, triggers, tools, republishing | Copilot Studio, Agent Registry | Starts as the maker; admin can reassign |
| **Business sponsor** | Purpose, continued need, access, retirement | Entra Agent ID sponsors | Add a group or second person alongside the auto-added owner |
| **Deputy** | Continuity when the owner is away or leaves | Leaver checklist, Lifecycle Workflows | Different person from the owner |
| **Cost owner** | Allocation, per-agent limit, alerts | Power Platform admin center or Microsoft 365 admin center spending policy | Built-in limit alerts go to "Admins, both at the environment and tenant level"; a cost owner who is not an admin needs one to relay them |
| **Audit reviewer** | Reviews audit, sign-in and run evidence on a cadence | Purview, Entra, Monitor | Not the owner of the agent they review |
| **Stop authority** | Stops the agent in an incident, using the path tested in section 3.7 | Microsoft 365 admin center, Power Platform admin center, Power Platform API | Quarantine needs Global Administrator, AI Administrator or Power Platform Administrator; block is in the Microsoft 365 admin center |
| **Data and memory owner** | Shared memory rules, holds, DSRs | Instructions, records schedule | See F1 |

## 3. Decision rights: what the agent may do on its own

### 3.1 Triggers

- Triggers create autonomous agents: "an agent can respond when an item is created in SharePoint, an email arrives, or a scheduled time occurs." "Some triggers, such as Recurrence and Copilot and Teams triggers, don't require a connection verification." (*Add triggers to an agent (GitHub Copilot) (preview)*, 20 Oct 2026.)
- "The agent doesn't run autonomously until you publish it." After publish the maker chooses:
  - **Activate for myself**: "Only you, the maker, can use the agent, using your own maker credentials." "After you turn on the agent, your agent starts running on your behalf."
  - **Share with others**: "Allow other users use the agent, with their own credentials." Users "can edit only the trigger options that you allow" (**Editable by user**).
- Users of a shared autonomous agent "can't change the agent's instructions, tools, or other authoring settings", can turn triggers on or off, and "An autonomous agent can't run until you connect every trigger, tool, and workflow that requires your credentials." (*Set up a shared autonomous agent*, 20 Oct 2026.)
- On sharing, workflows called as tools "can only accept end user credentials ... Workflows that use any maker-only credentials aren't supported for autonomous agents" (*Share agents with other users and makers (GitHub Copilot)*, 20 Oct 2026). The same page: "Users of a shared autonomous agent can't specify or modify tool parameters. Tool calls are invoked and executed fully with AI, based on the maker's specifications." The maker's tool configuration is the only place parameters are constrained.
- The agent-account page's own example says: "Configure supported tools and a recurrence trigger; instructions alone don't create a schedule or grant access."

**Not documented:** under which identity a trigger's connection and the resulting run act when the agent has an account (the agent account, the maker, or each user). The trigger page describes maker and user credentials only and never mentions agent accounts (Q1). Until T1 settles it, record **Activate for myself** as "acts with the maker's credentials" and review it as such.

The statement that "Event triggers can only use the agent maker's credentials for authentication" is on *Event triggers overview* (9 Sep 2026), a page scoped to the standard harness; do not apply it to this harness without saying so.

### 3.2 Tools and the identity behind them

- When an account is added, "**Agent account** becomes the default authentication mode for tools that support agents with an account." Tools set to end-user authentication need each person to "complete the required authentication for tools that act under their identity." (Agent-account page.)
- "Connections are saved for each agent and each channel." A user can **Deny** a connection request, which "Cancels the action." (*Set up your connections when an agent asks*, 16 Oct 2026.)
- **Connector scopes on the Entra Agent ID.** At publish, Copilot Studio attaches permissions that represent the Power Platform connectors the agent uses: `Operations.Execute.All` "when the agent is configured to use the connector at the agent (tool) level", **individual operation scopes** "when the maker added specific connector actions instead of the whole connector", and a generic fallback. "custom connectors, MCP servers, and REST API tools added to agents don't add API permissions to the Entra Agent ID." (*App registration, agent identities, and authentication*, 21 Aug 2026.) Entra therefore shows only part of what the agent can call; the rest needs a manual inventory.
- **Conditional Access** on the agent identity "currently applies only when the agent runs in **Microsoft Teams**"; other channels "still call connectors using the existing Power Platform connector authentication flow".

### 3.3 Conditional Access for the two identities

From *Conditional Access for Agents* and *Secure agent users with Conditional Access* (both 31 Jul 2026):

- "A policy that targets an agent identity doesn't apply to the agent's user account, and a policy that targets the agent's user account doesn't apply to the agent identity." Write one policy per identity.
- "Policies scoped through the 'Users' assignment don't apply to agent user accounts." Group-based inclusion or exclusion of agent users is not supported. Target **All agent users (Preview)**, specific agent users, or custom security attributes.
- For agent users, "the only available option is blocking access" (plus compliant device or network for agents on Windows 365 Cloud PCs). Agent user targeting and agent risk are in preview.
- Licensing: Microsoft 365 E7, or Agent 365 with at least Microsoft Entra ID P1 or Microsoft 365 E3.
- AI Administrators "aren't authorized to configure Conditional Access policies or Microsoft Entra access package policies" (*Governance and Lifecycle actions*).

**Not documented:** which of the agent's channels obtain tokens for its user account, so where a Conditional Access policy on that account takes effect (Q9). The Teams-only statement in section 3.2 is about connector scopes on the Entra Agent ID, a different identity.

### 3.4 Data policies and Purview DLP

Two different controls share the "DLP" label. Power Platform **data policies** decide which connectors and features an agent may use. **Microsoft Purview Data Loss Prevention** inspects content the agent sends and receives.

From *Configure data policies for agents* (1 Oct 2026), which has no "applies to" harness scope note (its one harness remark separates Azure Bot Service skills on the standard harness from agentic skills on the Microsoft Copilot harness):

- Blocking a connector removes it as a tool; "Blocking Power Platform connectors also blocks access to tools in connected MCP servers."
- Block the **HTTP** connector, or use endpoint filtering, to stop HTTP calls. The page's HTTP section is about the **HTTP request** node in topics; whether the block also stops REST API tools on this harness is not stated.
- "To prevent agent makers from adding event triggers ... configure a data policy that blocks the **Microsoft Copilot Studio** connector." The page links to the standard-harness trigger article; whether the block applies to Microsoft Copilot harness triggers is not stated (Q4).
- The identities page says the connector runtime "revalidates that the agent can call the connector under your tenant's advanced connector policies and data policies" at run time.

From *Use Microsoft Purview to manage data security & compliance for Microsoft Agent 365* (1 May 2026):

- Purview DLP is "Supported by explicitly specifying agent instances in the DLP policy as you would a user, or by specifying a security group that includes agent instances", and can "Block or audit agent-to-human and human-to-agent for Microsoft Teams, OneDrive or SharePoint, and emails."
- "Because an agent instance is unaware of the block action, the agent owner must actively monitor a DLP policy that uses this configuration and understand the impact to subsequent workflows." A blocked message does not make the agent stop or retry; someone has to watch.

### 3.5 Hooks, confirmation and approval

- **Hooks (GitHub Copilot) (preview)** (29 Sep 2026): a hook runs a workflow at a lifecycle event. "**Pre tool use** is the only event that can block an action", by returning `permissionDecision` = `deny`. **Post tool use** "Runs after a tool finishes successfully" and can "write an audit record after a tool runs"; a failed call fires **After tool failure** instead, so logging D2 actions needs both. The user fields in hook metadata "are empty when the person chatting with the agent isn't signed in", so a record from a trigger run may carry no user. Hooks can be scoped to specific tools.
- The caveat that decides how much to rely on them: "**Hooks don't stop the agent when they fail.** If a workflow fails, times out, or returns something the agent can't read, the agent continues as though the hook returned nothing. Don't rely on a hook as your only safeguard for a business-critical rule."
- **Not documented for this harness:** a per-tool "ask before running" confirmation or a human approval step. **Ask the end user before running** ("set to **No** by default"; *Add tools to custom agents*, 1 Oct 2026) and the **Request for information** action ("Pause execution. Collect input from designated human reviewers"; *Request information from human review in agent flows*, 18 Jun 2026) are documented on pages scoped to the standard harness. A third-party roadmap mirror lists human approval for tool calls as in development; it is not on Learn and must not be cited as available.

### 3.6 Action classes and the control each needs

Classify every tool, workflow and trigger action by the highest class it can reach.

| Class | Examples | Autonomous? | Minimum documented controls |
|---|---|---|---|
| **D0 Read** | Read a tracker, summarise status, look up a policy | Yes | Least-privilege connection; encrypted labels on anything it must never read |
| **D1 Communicate internally** | Email or Teams message to a fixed internal group; create a new document in an approved folder | Yes, to a fixed audience | Audience fixed in trigger options (not **Editable by user**) and in instructions; recipient lists of 250 or fewer; documents it creates are unlabelled, so write them only where that is acceptable |
| **D2 Write to a record** | Create or update a list item, ticket or file; set a status | Only if reversible and logged | Individual connector operations (not whole connector); **Pre tool use** hook to validate; **Post tool use** and **After tool failure** hooks to log; owner reviews the log |
| **D3 Consequential** | Delete, send outside the tenant through another system, change access or permissions, pay or commit money, decide about a person | **No** | Agent prepares, a named person executes or approves outside the agent. No platform approval step is documented for this harness, so the human step must sit in the target system or a separate workflow the agent cannot complete itself. |
| **D4 Prohibited** | Anything the business says the agent must never do | Never | Do not add the tool; block the connector in a data policy. Instructions and hooks alone do not satisfy D4. |

Rule of thumb for reviewers: **the only controls that hold when the model misbehaves are the tool not being there, the identity lacking the permission, and encryption.** Everything else reduces likelihood.

### 3.7 Stopping the agent

Every documented way to stop or restrict the agent, and what Microsoft says it does:

| Path | Who | Documented effect | Not documented |
|---|---|---|---|
| **Block** in the Microsoft 365 admin center (Agents > All agents) | Microsoft 365 admin center admin who manages agents | For Copilot Studio agents, "affects its availability and functionality in Microsoft Copilot ... Outlook, Teams" (*Governance and Lifecycle actions*, 23 Sep 2026). For agents onboarded from Agent 365 templates, "Blocking pauses the agent and stops any active tasks" (*Discover, create, and onboard agents with their own identity*, 25 May 2026). | Whether triggers stop for an agent with an account |
| **Quarantine** through the Power Platform API (`SetAsQuarantined`) | Global Administrator, AI Administrator or Power Platform Administrator, through an app registration with the `CopilotStudio.AdminActions.Invoke` scope | "Makers can interact with the agents during testing, but they can't interact with quarantined agents in any other channel." (*Use the Power Platform API to quarantine agents*, 14 Jul 2026.) | Effect on triggers and runs in progress |
| **Turn off an agent** on **Manage Agents** | Power Platform Administrator or Global Administrator | Listed as an action on the page | What "off" means for triggers |
| **Turn off Agent accounts** for the environment (Power Platform admin center > **Copilot** > **Settings** > **Copilot Studio**) | Power Platform Administrator | "If you turn it off, the **Agent account** button isn't available for agents in the environment." The FAQ: "To turn off shared memory, an admin must turn off agent accounts altogether." | What happens to already-published agents with accounts and their triggers |
| **Stop usage** at the per-agent limit | Automatic | "The agent is automatically turned off once it hits the defined limit"; not instant; agent flows continue | Effect on queued events |
| **Disable agent** on the Entra Agent ID | Owner, sponsor or admin | "prevents it from being issued tokens" | Effect on a Copilot Studio agent with an account (Q7) |
| **Conditional Access** block on the agent's user account | Conditional Access Administrator | Blocks token issuance for the agent user; agent user targeting is in preview | Which of the agent's channels it covers (Q9) |
| **Turn a trigger off** on the agent management page | Maker, or each user of a shared autonomous agent | "To pause a trigger without removing its configuration, turn the **Enabled** toggle off." | n/a |

Pick one primary stop path, name who holds it, and prove it on a test agent (T11) before go-live. Our reading, not Microsoft's: Block in the Microsoft 365 admin center has the widest documented effect, and quarantine is the one you can script.

**One trap.** If the agent's environment runs the Power Platform IP firewall in active enforcement mode, "Admin actions that you initiate from the Microsoft 365 admin center fail and aren't applied to the agent"; in audit-only mode they "succeed and only generate an alert in Microsoft Purview". Microsoft's remedy is to run the action against the Power Platform API (*Governance and Lifecycle actions*, 23 Sep 2026). Check the firewall mode before choosing Block as the primary path.

## 4. Credit caps

### 4.1 How usage is billed

- "For experiences powered by the GitHub Copilot harness, Copilot Credits are charged for large language model (LLM) tokens, tools (including knowledge and MCPs), and the harness itself." "Unlike the standard harness, which starts billing after publish, the GitHub Copilot harness charges credits from the moment you start building", including previewing, testing and evaluations. (*Overview of usage-based billing*, 6 Oct 2026.)
- Microsoft Copilot harness agents (the page's "GitHub Copilot harness agents" row): covered by a Microsoft 365 Copilot licence? "No". "Billed for all usage. Creation and runtime activities consume Copilot Credits regardless of the user's license." (*Manage costs for agents powered by the GitHub Copilot harness*, 28 Oct 2026.)
- "Copilot Credits are charged to the environment where the agent runs ... and not to the individual makers or users who run agents." For shared autonomous agents, "Each end user's autonomous agent usage is totaled and billed through the underlying environment".
- "Account licensing and usage-based service charges are separate." No page says the Frontier for AI Teammates licence includes credits.
- Rates for this harness are published only as a diagram of ranges by task complexity; use the Copilot Credit Estimator and pilot consumption, not a rate quoted from memory.

### 4.2 The controls and what each one actually stops

| Control | Where | Stops usage? | Documented caveats |
|---|---|---|---|
| **Per-agent monthly limit** with notification threshold and **Stop usage** | Power Platform admin center > Licensing > Copilot Studio > **Manage Agents** > **Set limit** | Yes, if **Stop usage** is on: "The agent is automatically turned off once it hits the defined limit." | "Limits aren't applied instantly. An agent can continue to respond for some time after it reaches its limit." "An agent's monthly limit doesn't stop the agent flows that the agent calls." Alerts go to "Admins, both at the environment and tenant level" (all *Manage Copilot Credits and capacity*, 14 Oct 2026). "Power Platform admin center doesn't provide a tenant-wide default agent limit" and "Agent limits don't cap aggregate environment consumption" (*Govern Copilot Credit consumption*, 6 Oct 2026). Where a Microsoft 365 admin center resource-based policy covers the agent, Power Platform allocations and billing plans "don't apply"; whether this limit still functions then is not stated (Q6). |
| **Environment allocation** with **Draw from the available capacity in my tenant** cleared | Power Platform admin center > Licensing > Copilot Studio > **Manage Copilot Credits** | Caps prepaid use at the allocation | "An allocation isn't a boundary if the environment can continue drawing from tenant capacity or pay-as-you-go billing." Draw from tenant is on by default when no allocation exists. Can be locked by the **Cost controls - Draw from tenant credit pool** environment group rule. |
| **Pay-as-you-go** with Azure budgets | Azure Cost Management | **No** | "Azure budgets and alerts send notifications but don't stop Copilot Studio consumption." |
| **Resource-based spending policy** with per-agent limit | Microsoft 365 admin center > Copilot > Cost Management | Not stated for the per-agent limit | Opt-in. "its controls take precedence over the Power Platform admin center controls"; existing allocations and billing plans "don't apply" while covered. "allow up to 12 minutes for the new policy to apply." Overlapping limits "aren't combined"; "If the agent reaches that limit, usage does not fall back to the user's identity-based policy." Does not cover AI Builder prompts. |
| **Who can build** | Copilot Studio authors setting, environment roles, template activation group | Indirectly | "The GitHub Copilot harness doesn't have its own maker-access setting." "Choosing a group in the **Copilot Studio authors** setting doesn't automatically remove access from users outside that group." |
| **Who can move the cap** | Power Platform tenant setting for add-on capacity assignment | Protects the other controls | "Allowing environment administrators to manage allocations doesn't restrict them to the environments they administer. It gives them allocation control across every environment in the tenant. Keep allocation restricted to tenant administrators unless that tenant-wide access is intentional." (*Govern Copilot Credit consumption*.) |

### 4.3 What happens when credits run out

- "When an environment has no allocated Copilot Credits, or uses all its allocated credits, any experience that requires credits stops working": end users see agents stop responding; makers cannot author, preview, test or evaluate. "Microsoft allows some level of overage consumption, similar to a grace period." (*Enforcement policy for agents consuming Copilot Credits*, 3 Aug 2026.)
- In an agent on this harness, a tool call fails with "Your environment is out of Copilot Credits." (*Resolve Copilot Studio usage limit and agent unavailable errors*, 14 Oct 2026.)
- For agent flows and workflows: "New agent flow and workflow runs are blocked until credits are available to the environment. Runs that already started finish normally." (*Resolve Copilot Studio usage limit and agent unavailable errors*.) Nothing equivalent is stated for a per-agent limit or for the agent's own triggered runs (Q7).
- A business process that depends on the agent therefore needs a fallback owner and procedure for when it stops, whether from a limit or from capacity.

### 4.4 Where to see consumption

- Per agent: the agent's **Monitor** tab ("the final, source-of-truth number used for billing"), and the **Manage Agents** page (month-to-date billed credits, limit, status **Within limit**, **Nearing limit** or **Over limit**).
- Monitor "shows billed credits only, so it can show less consumption than" the downloadable reports, which include non-billed credits and can be split by environment or agent, and by product feature, channel, model and tool; a per-user split is documented only "For agents powered by the standard harness".
- To find these agents: Power Platform admin center > **Manage** > **Copilot Studio**, filter **Harness** to **GitHub Copilot**, the value the page documents; it may change as the product picks up the new name. "**Harness** is currently a user interface column only." Licensing reports may call them "Process Agents".

### 4.5 Sizing a cap

Microsoft's guidance is to "Govern at the environment level, not just the published agent", classifying each environment as **exploration and prototyping**, **test and validation**, or **funded production**, and for funded production to "Confirm the cost owner and funding model, configure capacity for expected demand and continuity, and set limits based on service criticality" (*Govern Copilot Credit consumption*). The go-live agent belongs in a funded production environment.

1. Run the agent in a test and validation environment for a representative period with a generous limit and **Stop usage** off; read billed and non-billed credits from the report. Where there is no history yet, the Copilot Credit Estimator gives a directional figure.
2. Count expected trigger events per month (emails, items, schedule) and multiply by observed credits per run, then add build and evaluation usage for planned changes.
3. Set the per-agent limit at that figure plus a margin, the notification threshold well below it (the limit is not instant), and **Stop usage** on.
4. Keep the environment allocation above the sum of its agents' limits, with **Draw from tenant** cleared unless the cost owner accepts open-ended draw.
5. Name who gets the alert and what they do: raise, investigate, or let the agent stop.

## 5. Audit

### 5.1 Where evidence lives

| Source | What it records | Documented limits |
|---|---|---|
| **Purview Audit, Copilot Studio activities** (*View Copilot Studio audit logs in Purview*, 18 Aug 2026) | Maker and admin events: `BotCreate`, `BotDelete`, `BotUpdateOperation-BotPublish`, `BotUpdateOperation-BotShare`, `BotUpdateOperation-BotAuthUpdate`, `BotComponentCreate`/`Update`/`Delete`, `AIPluginOperation*`, `EnvironmentVariable*`. Usage: `CopilotInteraction`. | "The audit logs in the **Audit** solution don't include the full text or transcript ... only the transcript thread ID." "Some channels are excluded from logging." Users need a Microsoft 365 licence for events and transcripts to be recorded, so whether a trigger run with no signed-in user produces `CopilotInteraction` is not documented (Q5). "You can't disable activity collection." Transcripts are reached through what this page still calls "Data Security Posture Management (DSPM) for AI". No harness note; no event documented for triggers or hooks. |
| **Purview Audit, Agent 365 activities** (*Audit log activities*, 15 Oct 2026) | `AIInvokeAgent` ("invoked by a user, agent, or event"), `AIExecuteTool` ("Agent executed a tool call"), `AIInferenceCall`, `AIGuardrail` | Purview's Agent 365 page (1 May 2026, predates agent accounts) says "When you create an agent instance for Agent 365, it's automatically enabled for audit" and "Audit an agent instance as you would a user". No page states that Copilot Studio agents with accounts emit these events (Q5). |
| **Data Security Posture Management, AI observability** (Purview Agent 365 page) | Agents with activity in the last 30 days, risk level from Insider Risk Management, and per agent: "Entra-enabled status, created date, owner, agent user ID", risky activities and remediation recommendations | Use the current **Data Security Posture Management**; "The classic version doesn't support Agent 365." |
| **Entra audit and sign-in logs** (*Microsoft Entra Agent ID logs*, 28 Apr 2026) | Agent identity changes as service principal events, agent user changes as user events; `agentType` on `initiatedBy`, `performedBy`, `targetResources` (`agenticAppInstance`, `agentIDuser`, ...); agent sign-ins across all four sign-in log types, filter **Agent type** or **Is Agent** | The Copilot Studio audit page (18 Aug 2026) adds: "For agents with Microsoft Entra Agent IDs, authentication activity is also logged in Microsoft Entra ID and visible in the Microsoft Entra admin center." Graph access on `/beta`. |
| **Copilot Studio Monitor** (*Monitor agent performance overview (GitHub Copilot)*, 28 Sep 2026) | Sessions, autonomous runs, full transcripts "including ... details about tool invocations", credits per session | "The sessions list shows sessions from the past 28 days only." Downloads: "any time period within the last 29 days". Shared autonomous agents also have an **Activity** tab for runs. |
| **Copilot Studio protection status** (*Agent runtime protection status*, 1 May 2026) | On the **Agents** page, a per-agent **Protection status** of **Protected**, **Needs review** or **Unknown**; a summary of blocked messages from threats, policy violations and content moderation; **Security analytics** for the last 7, 14 or 30 days | A maker view with no harness note. "All published agents automatically have threat detection enabled." Counts blocked prompts and policy violations, not tool calls. |
| **Microsoft 365 admin center** (*Governance and Lifecycle actions*, 23 Sep 2026) | Soft-delete, restore and permanent-delete: "recorded in the audit log with information about the system that initiated the action" | Block, reassign and activation audit events not described on that page |
| **Post tool use and After tool failure hooks** (your own workflows) | Whatever you write: tool, parameters, result or error, `userAadObjectId`, `agentId` | Fail open; a broken hook means a missing record, not a stopped tool. Post tool use fires only on success. User fields are empty when nobody is signed in. |
| **Shared memory** | Nothing documented | No audit of memory creation, change or deletion; see F1 |

### 5.2 What the audit reviewer must be able to answer

| Question | Best documented source | Gap |
|---|---|---|
| Who changed the agent's instructions, tools or triggers, and when? | Purview: `BotComponent*`, `BotUpdateOperation-*`, `BotUpdateOperation-BotPublish` | Trigger-specific events not documented |
| Who was it shared with? | Purview: `BotUpdateOperation-BotShare` | n/a |
| What did it do on a given run, and why? | Monitor transcript (28 days), downloaded transcripts | Export before day 28 if you need longer |
| Which tools did it call, with what? | Monitor transcript; Agent 365 `AIExecuteTool` if emitted; Post tool use hook log | Q5 |
| Under which identity did it act? | Entra sign-in logs filtered by agent type; target system's own audit | Q1 |
| Who talked to it? | Purview `CopilotInteraction`; transcripts in Data Security Posture Management | Excluded channels; trigger runs (Q5) |
| Is it behaving riskily? | Data Security Posture Management AI observability; Entra ID Protection agent risk (preview) | Risk signals are detections, not a record of every action |
| What does it remember, and who changed that? | Ask the agent; "Everyone who interacts with the agent can view or delete its saved shared memories" (FAQ for agent accounts, 14 Oct 2026) | No audit of memory actions; auto-deletion after 28 days without interaction; see the memory skill |

## 6. Open questions, stated precisely

| # | Question | Documented answer |
|---|---|---|
| Q1 | Under which identity do a trigger's connection and the resulting run act when the agent has an account: the agent account, the maker, or each user? | None. The trigger page describes maker credentials (**Activate for myself**) and user credentials (**Share with others**) only. |
| Q2 | Does reassigning the owner in the Microsoft 365 admin center, or the maker leaving, change the alias, the "reports to" relationship or the Entra Agent ID sponsor? | None. Alias and reporting relationship are documented as unchangeable in preview. |
| Q3 | Who is sponsor, owner or manager on the agent's user account, and does a sponsor added in Entra survive a republish? | None |
| Q4 | Does blocking the **Microsoft Copilot Studio** connector in a data policy stop triggers on Microsoft Copilot harness agents? | None; the data policy page links to the standard-harness trigger article |
| Q5 | Do Copilot Studio agents with accounts emit the Agent 365 `AIInvokeAgent` and `AIExecuteTool` audit events, and does a trigger run with no signed-in user produce a `CopilotInteraction` event? | None. Agent 365 provisions the account; the Purview Agent 365 page predates agent accounts; Copilot Studio audit needs a licensed user. |
| Q6 | What happens when an agent reaches a per-agent limit in a Microsoft 365 admin center resource-based spending policy: stop, or alert only? | None |
| Q7 | Which stop path (block, quarantine, turn off, **Stop usage**, disabling the Entra Agent ID) stops trigger-driven runs of an agent with an account, what happens to a run in progress, and are events received while stopped dropped or replayed on restart? | None. Each path is documented for chat availability or tokens, not for triggers. |
| Q8 | Does deleting an agent with an account delete the agent's user account and mailbox and return the Frontier licence to the pool? | Deleting removes the Entra Agent ID; nothing on the account, mailbox or licence |
| Q9 | Which of the agent's channels (Teams, email, Office comments, triggered runs) obtain tokens for the agent's user account, so that a Conditional Access policy on it is evaluated? | None. The Conditional Access pages say a policy on the agent user is evaluated when a token is issued to that account; the Teams-only note on the identities page concerns connector scopes on the Entra Agent ID, a different identity. |
| Q10 | Is the Entra Agent ID provisioned at creation or at first publish for this harness? | The same page says both |
| Q11 | Does activating the Copilot Studio (Frontier) agent template apply an Agent 365 template (the default template's Purview **Audit enabled**, Entra lifecycle and ID Protection, Defender policies) to the agents created from it? | The agent-account page describes only the wizard's **Users** step; the general activation process includes **Apply a template** |

## 7. The review gate

Each criterion has a result (**Pass**, **Fail**, **Unknown**) and the evidence that supports it. **Blocking** criteria must pass for **Go**. **Condition** criteria may be open for **Go with conditions** if each has an owner and a date before which the agent runs only in the pilot audience.

### A. Admission

| # | Criterion | Evidence | Type |
|---|---|---|---|
| A1 | Template activation is scoped to a named security group, not everyone; any template or policies applied at activation are recorded (Q11) | Microsoft 365 admin center activation wizard | Blocking |
| A2 | **Agent accounts** is on only in the environment(s) approved for this agent, on the Early release cycle, not the default environment; the environment is classified as funded production | Power Platform admin center setting per environment, environment register | Blocking |
| A3 | A Frontier for AI Teammates licence is available and someone owns the 25-licence pool | Licence count, named owner | Condition |
| A4 | Identity planned before publish: display name, configurable part of the alias, job title, and the maker is the right person for the agent to report to for its whole life | Written identity plan | Blocking (once published, cannot be fixed) |
| A5 | The process owner accepts Frontier preview terms with no SLA and possible withdrawal of the feature, and the process can run without the agent | Signed acceptance, fallback procedure | Blocking |

### B. Ownership

| # | Criterion | Evidence | Type |
|---|---|---|---|
| B1 | Every role in section 2.3 is filled; the audit reviewer is not the agent's owner | Role map | Blocking |
| B2 | Entra Agent ID sponsors checked in the Microsoft Entra admin center (or the sponsor's My Account **Manage agents** page); a business sponsor group or second person added beside the auto-added owner | Screenshot of sponsors list | Blocking |
| B3 | Deputy named; "transfer or retire agents" is on the leaver checklist; Lifecycle Workflows sponsor tasks configured if licensed | Checklist entry, workflow | Condition |
| B4 | Retirement or review date set | Date in the gate record | Condition |

### C. Decision rights

| # | Criterion | Evidence | Type |
|---|---|---|---|
| C1 | Every trigger listed with event, filter options, **Editable by user** settings, activation mode and the connection identity | Trigger inventory | Blocking |
| C2 | Every tool, workflow and MCP server listed with authentication mode and the identity it acts as; connector scopes on the Entra Agent ID reviewed; custom connectors, MCP servers and REST tools inventoried by hand | Tool inventory, Entra **API permissions** screenshot | Blocking |
| C3 | Every action classified D0 to D4 (section 3.6) | Decision-rights matrix | Blocking |
| C4 | No D3 action can complete without a person outside the agent; no D4 tool present; D2 tools use individual operations and have Pre tool use, Post tool use and After tool failure hooks | Matrix, hook list | Blocking |
| C5 | Audience fixed: who can message it, which groups or distribution lists include it, recipient lists of 250 or fewer; the share page's prerequisites (recipients hold a Copilot Studio per-user licence, agent published to **Teams + Microsoft 365**) checked, since their application to agents with accounts is not stated | Sharing and membership list | Condition |
| C6 | Environment data policy reviewed: unneeded connectors blocked, HTTP blocked or filtered; whether the trigger block and the HTTP block reach this harness recorded as unknown until T2 | Data policy export | Condition |
| C7 | Conditional Access policies exist for the agent's user account (**Users, agents or workload identities** > **Agents** > agent users) and, separately, its agent identity, at least report-only, with the Teams-only enforcement noted | Policy names | Condition |
| C8 | Decision rights written into the instructions (section 8.3) | Instruction text | Blocking |
| C9 | A primary stop path from section 3.7 is chosen, its holder named, and it has been proved to stop a trigger-driven run on a test agent (T11) | Runbook line, T11 result | Blocking |

### D. Credit caps

| # | Criterion | Evidence | Type |
|---|---|---|---|
| D1 | Per-agent monthly limit set with a notification threshold and **Stop usage** on; if a Microsoft 365 admin center resource-based policy covers the agent, D3 applies instead and the stop behaviour is Q6 | **Manage Agents** screenshot, or policy export | Blocking |
| D2 | Environment allocation set and **Draw from the available capacity in my tenant** cleared, or the cost owner accepts open draw in writing; pay-as-you-go not relied on as a cap; allocation rights kept with tenant administrators | Allocation screenshot, tenant setting | Blocking |
| D3 | If a Microsoft 365 admin center resource-based policy covers the agent, its per-agent limit and alert recipients recorded, and Q6 tested (T5) | Policy export | Condition |
| D4 | Cap sized from pilot consumption (section 4.5), not guessed; build and evaluation usage budgeted | Sizing worksheet | Condition |
| D5 | Fallback for the business process when the agent stops (limit, capacity, block) | Runbook line | Blocking |

### E. Audit

| # | Criterion | Evidence | Type |
|---|---|---|---|
| E1 | Purview Audit shows this agent's `BotUpdateOperation-BotPublish` and a `CopilotInteraction` from the pilot | Audit search export | Blocking |
| E2 | Entra sign-in and audit logs searched for the agent identity and the agent user | Log export | Condition |
| E3 | Agent 365 `AIInvokeAgent` and `AIExecuteTool` searched for this agent; result recorded either way (T3) | Audit search export | Condition |
| E4 | Transcript retention decided: export schedule from Monitor inside 28 days, or reliance on `CopilotInteraction` and Data Security Posture Management transcripts under a Microsoft Copilot experiences retention policy (with Q5 tested for trigger runs) | Retention decision | Blocking when any action is D2 or higher |
| E5 | Post tool use and After tool failure hooks log D2 actions, success and failure, to a store the audit reviewer can read | Hooks, sample records | Condition |
| E6 | Review cadence set and the gate record filed | Calendar entry, record | Condition |

### F. Memory and data

| # | Criterion | Evidence | Type |
|---|---|---|---|
| F1 | Shared memory reviewed with the shared-agent-memory-governance assessment: memory rules in instructions, audience shares the same data access, retention schedule entry | Assessment | Blocking |
| F2 | Anything the agent must never read carries an encrypting sensitivity label that does not grant the agent VIEW and EXTRACT; content the agent creates is written only where its unlabelled state is acceptable | Label configuration, output locations | Condition |
| F3 | A Purview DLP policy includes the agent instance (directly or by security group) for Teams, SharePoint or OneDrive, and email, and the owner monitors its blocks | Policy name, monitoring owner | Condition |

### Verdict rules

- **No go**: any Blocking criterion is **Fail** or **Unknown**.
- **Go with conditions**: all Blocking criteria **Pass**; each open Condition has an owner and a date; the agent stays with its pilot audience until they close.
- **Go**: every criterion is **Pass**. Where a criterion depends on behaviour Microsoft has not documented, it passes only on the result of the matching tenant test, recorded with the tenant and date.

### Re-review triggers

Run the gate again when any of these happens:

1. A trigger, tool, workflow, MCP server or hook is added, or an action moves up a class.
2. The audience widens (new group, distribution list or share).
3. The owner, sponsor or maker changes, or the maker leaves.
4. The agent hits its limit, is stopped, or its limit is raised.
5. A cited Microsoft page changes its date, or an open question is answered.
6. The agent is blocked, quarantined or disabled, or a DLP policy starts blocking its messages.
7. Agent accounts leave Frontier, or Microsoft changes how they are licensed.
8. The scheduled review date arrives.

## 8. Artifacts

### 8.1 Gate record

```markdown
# Agent identity review gate: <agent display name>

Date: <YYYY-MM-DD>   Reviewer: <role>   Documentation relied on: <date>   Status: Frontier preview

Verdict: <Go | Go with conditions | No go>

Agent: <purpose in one line>   Environment: <name, release cycle>   Published: <yes/no>
Account: <alias>   Reports to: <role>   Entra Agent ID: <GUID from Settings > Advanced > Metadata>

| # | Criterion | Result | Evidence | Owner | Due |
|---|---|---|---|---|---|
| A1 | ... | Pass/Fail/Unknown | ... | ... | ... |

Open questions relied on: <Q numbers>
Tests run: <T numbers, date, result>
Next review: <date or trigger>
```

### 8.2 Decision-rights matrix

| Action | Tool or trigger | Identity it acts as | Class | Autonomous? | Controls in place | Human step |
|---|---|---|---|---|---|---|
| Read tracker | SharePoint list read | Agent account | D0 | Yes | Least privilege | None |
| Email reviewers | Outlook send | Agent account | D1 | Yes | Fixed group; not editable by user | None |
| Update item status | SharePoint update item | Agent account | D2 | Yes | Single operation; Pre/Post hooks | Owner reviews log weekly |
| Change site permissions | (not added) | n/a | D4 | Never | Connector action not added | n/a |

The identity column records each tool's configured authentication mode; which identity a trigger-started run uses is Q1 until T1 answers it.

### 8.3 Decision rights in the instructions

Adapt, keep the structure, and keep it consistent with the matrix. Instructions are a soft control and do not replace C4.

```text
Decision rights:
- You may read <sources> and summarise them for <audience>.
- You may send messages only to <group>. Never add recipients, forward outside that group, or reply to anyone outside the organisation.
- You may update <record type> only to set <fields>. Before any update, state what you will change and why in your run summary.
- You must not delete anything, change permissions or access, commit money, or make decisions about a person. When one of these is needed, prepare the request with the evidence and send it to <role> to act on.
- If a source, connection or permission is missing, or a tool returns an error, stop the affected action and report what is missing. Do not try another route.
- People own priorities and sign-off. Do not present a recommendation as a decision.
```

### 8.4 Credit cap worksheet

| Item | Value | Source |
|---|---|---|
| Trigger events per month | | Event source counts |
| Billed credits per run (pilot average) | | Downloaded agent report |
| Build, test and evaluation per month | | Pilot report, change plan |
| Monthly estimate | | Sum |
| Per-agent limit | Estimate plus margin | Cost owner |
| Notification threshold | Well below the limit | Cost owner |
| **Stop usage** | On | D1 |
| Environment allocation | At least the sum of agent limits | D2 |
| Alert recipient and response | | Runbook |

### 8.5 Audit evidence pack

1. Purview Audit export for the agent: publish, share, auth and component events since creation.
2. Purview Audit export of `CopilotInteraction` and any `AIInvokeAgent`/`AIExecuteTool` for a pilot week.
3. Entra sign-in logs filtered to the agent identity and the agent user for the same week.
4. Entra Agent ID **API permissions** and sponsors screenshots.
5. Monitor sessions export, including at least one autonomous run transcript with tool calls.
6. Post tool use and After tool failure hook log samples for each D2 tool.
7. **Manage Agents** screenshot showing limit, threshold and **Stop usage**.
8. Data Security Posture Management **AI observability** entry for the agent: owner, agent user ID, risk level; Copilot Studio **Protection status** summary for the agent.
9. T11 result: the stop path used, who ran it, and how long the agent took to stop.
10. Gate record (8.1) and decision-rights matrix (8.2).

## 9. Tenant test plan

Run these in a test and validation environment (section 4.5) with a test agent, test users and a low limit. Each maps to an open question.

| Test | Steps | Record | Answers |
|---|---|---|---|
| T1 Trigger identity | Give a test agent with an account a **New email** trigger and a tool that writes a list item. Activate for yourself, then share with a test user. Fire the trigger in both modes. | In the list's version history and in Entra sign-in logs (filter **Is Agent**), which identity created each item | Q1 |
| T2 Trigger block | Apply a data policy blocking **Microsoft Copilot Studio** to the environment. Try to add and to run a trigger on the test agent; with the **HTTP** connector blocked, run a REST API tool. | Whether adding is blocked, whether existing triggers stop, whether the REST tool is blocked, the error text | Q4 |
| T3 Agent 365 audit | Run the agent from chat and from a trigger. Search Purview Audit for `AIInvokeAgent`, `AIExecuteTool` and `CopilotInteraction` for that period. | Which events appear for each kind of run, and which identity they name | Q5 |
| T4 Stop usage | Set a per-agent limit just above current use, threshold at 50%, **Stop usage** on. Drive runs past the limit. | Time from limit to stop; notifications received; whether triggers keep firing; fate of a run in progress and of events received while stopped after you raise the limit | Q7 |
| T5 Microsoft 365 admin center limit | Cover the test agent with a resource-based policy with a low per-agent limit. Drive runs past it. | Whether the agent stops or only alerts; the message users see | Q6 |
| T6 Owner change | Reassign the test agent's owner in the Microsoft 365 admin center. | Copilot Studio owner; Entra Agent ID sponsors; agent user manager; alias; org chart | Q2 |
| T7 Sponsor persistence | Add a sponsor group to the Entra Agent ID; republish the agent from Copilot Studio. | Whether the added sponsor remains; who is sponsor or manager on the agent user | Q3 |
| T8 Conditional Access | Create a report-only policy targeting the agent user, and one targeting the agent identity. Use the agent in Teams, by email and by Office comment. | Which interactions show policy evaluation in sign-in logs | Q9 |
| T9 Delete | Delete the test agent in Copilot Studio. | Entra Agent ID, agent user, mailbox and licence state after 1 and 30 days; Agent Registry state | Q8 |
| T10 Provisioning time | Create a new agent with an account, save as draft, check Entra; then publish and check again. | When the Entra Agent ID and sponsor appear | Q10 |
| T11 Stop paths | Check the environment's IP firewall mode first. With a scheduled trigger firing every few minutes, apply each stop path in turn (Block, quarantine, **Turn off an agent**, disable the Entra Agent ID), then reverse it. | Whether runs stop, time to stop, the fate of a run in progress, whether missed events replay on restart, and what users see | Q7 |
| T12 Activation template | Review the Copilot Studio (Frontier) template in the Microsoft 365 admin center; check Purview Audit, Entra lifecycle and Defender for policies naming a test agent created from it. | Which template and policies, if any, cover the agent | Q11 |

## 10. When to say no

Decline, or keep the agent in its pilot, when any of these is true:

- the maker cannot stay the agent's "reports to" for its expected life;
- an action in class D3 can complete without a person outside the agent, or a D4 capability is reachable;
- nobody will own the per-agent limit and its alerts, or the business process has no fallback when the agent stops;
- the process needs a service level that Frontier, which has no SLA, cannot give;
- nobody can show the agent stopping on demand (T11);
- the audit reviewer cannot reconstruct what the agent did last month from the sources in section 5;
- the memory review (F1) fails.

## 11. What to watch

- **Add triggers to an agent (GitHub Copilot)** and **Give your agent an account**: any sentence on trigger identity for agents with accounts answers Q1.
- **Configure data policies for agents**: a harness note or a trigger example for this harness answers Q4.
- **Audit log activities** and the Purview Agent 365 page: a statement that Copilot Studio agents with accounts emit Agent 365 events answers Q5.
- **Manage Copilot Studio costs in the Microsoft 365 admin center**: behaviour at the per-agent limit answers Q6.
- **Hooks** and the tools pages for this harness: a human approval or confirmation setting would change section 3.5 and class D3.
- The maker-alias and reporting-relationship caution on the agent-account page: when it goes, A4 and Q2 change.
- **Preview Agent 365 features through the Frontier program**: Microsoft states that at general availability "Agent 365 is licensed per user" and "Agents don't require their own Agent 365 or Microsoft 365 E7 license." When agent accounts leave Frontier, A3, A5 and the licence pool change.
- **Use the Power Platform API to quarantine agents** and **Governance and Lifecycle actions**: a statement on triggers would answer Q7.

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

Other sources, read on 1 November 2026:

- [The GitHub Copilot harness is now the Microsoft Copilot harness](https://www.microsoft.com/en-us/copilot/blog/copilot-studio/the-github-copilot-harness-in-copilot-studio-is-now-the-microsoft-copilot-harness/), Microsoft Copilot Studio blog, 28 Oct 2026
