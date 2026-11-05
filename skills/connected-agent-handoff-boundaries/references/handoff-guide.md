# Connected-agent handoff boundaries in Copilot Studio

**Who may delegate what to whom, and what survives the handoff**

> **Status:** Written 30 October 2026 and revised 5 November 2026, when every source in the list at the end was re-read. Several of the mechanisms below are in preview: the standard-harness "Add other agents" page carries the preview banner, Foundry, Fabric and Agents SDK connections are public preview, the Microsoft Copilot harness pages point to "Create an agent (preview)", and the Customer Conversation pages are "prerelease documentation and is subject to change." Treat every statement as "true of the docs on that date" and re-check the sources at the end before relying on it.

## The short version

1. Microsoft Copilot Studio's handoff guidance sits on three pages that never meet. Agent-to-agent delegation is on **Multi-agent orchestration patterns and best practices**, handoff to people on **Hand off to a live agent**, and handoff from the Employee Self-Service agent to other Copilot agents on **Agent handoff for Employee Self-Service agent**. A fourth page, **Apply generative orchestration capabilities**, defines the three decision tiers: no confirmation, confirmation in the conversation, and offline approval. It scopes them to one agent's own actions.
2. No page says who may delegate which kind of action to which kind of agent. The closest is one example on the patterns page: "if the parent agent isn't allowed to delete records but the connected agent can, the parent agent shouldn't call the connected agent in scenarios where deletion might happen without proper approval."
3. What survives a handoff depends on the mechanism and the harness, and the defaults lean towards passing more:
   - a child agent "always receives the parent's conversation context";
   - a standard-harness connected agent receives history unless you clear **Pass conversation history to this agent**, which "is enabled by default";
   - the A2A sample payload carries "Full chat history";
   - a live-agent handoff sends "All user-defined topic variables".
4. Some things do not survive by default:
   - the user's exact words ("the orchestrating model creates the task description and can rephrase or expand the user's request");
   - citations ("might not always be maintained");
   - anything a subagent said to the user that it does not return as an output;
   - access ("Access to a parent agent doesn't automatically grant access to its connected agents").
5. The boundary is therefore yours to design. The pattern in section 6 does this: classify every action by type, set its tier where it executes, cap the delegate's privilege at the user's, pass the minimum context, and require a return contract.

## 1. Where Microsoft's guidance lives

| Question | Page | What it covers | What it leaves out |
|---|---|---|---|
| How does one agent delegate to another? | Multi-agent orchestration patterns and best practices (4 Nov 2026; standard harness only) | Inline (child) versus connected agents. Four governance headings: orchestration, data handoff, security, audit and monitoring. Nine instruction practices. | Any rule for which actions may cross; it gives one example |
| How do I hand off to a person? | Hand off to a live agent (30 Apr 2026) | Escalate topic, Transfer conversation node, and the context variables sent to the engagement hub | Agent-to-agent handoff; any way to exclude a variable |
| How does the Employee Self-Service agent hand off? | Agent handoff for Employee Self-Service agent (15 May 2026), with Connecting agents overview (10 Jun 2026) | Hub versus handoff patterns, contextual handoff, return path, two-level depth | Any data boundary for third-party target agents |
| Which actions need confirmation or approval? | Apply generative orchestration capabilities (4 Nov 2026; standard harness only), section "Control layers and decision boundaries" | Deterministic, hybrid and AI layers; the three decision tiers | How those tiers apply when the action runs in a different agent |

Supporting pages (mechanics, settings, limits) are in the Sources list. The one on context distribution in the standard harness (4 Nov 2026) and its companion on designing subagents (4 Nov 2026) hold most of the "what survives" detail.

## 2. Handoff mechanisms, by harness

Three Copilot Studio harnesses and the Employee Self-Service agent in Microsoft Copilot each handle delegation differently. Ask which one the user is on before answering anything else.

| Mechanism | Harness or product | What it is (documented) |
|---|---|---|
| **Child agent** | Standard | "a lightweight agent that exists within the context of your main agent". For when "You don't need separate configuration settings, authentication, or deployment capabilities for the subagents." |
| **Connected agent** (Copilot Studio) | Standard | A separate published agent "in the same environment as your main agent", configured to allow connections |
| **External connected agent** | Standard | A2A, Microsoft Foundry (preview), Fabric Data agents (preview), Microsoft 365 Agents SDK (preview). "Fabric Data agents don't currently function when your main agent is deployed to Microsoft Copilot." |
| **Topic redirect** | Standard | "You can explicitly redirect to a child or connected agent from within a topic. Once the agent is done, the originating topic where you redirected from resumes." Not supported for Fabric Data agents. |
| **Connected agent** | Microsoft Copilot (formerly GitHub Copilot) | Copilot Studio, Foundry, A2A or Microsoft 365 Agents SDK agents, all added from one Add a connected agent dialog |
| **Sub-agent** | Customer Conversation | A specialist built inside the primary agent that "shares its configuration, deployment, and application lifecycle management (ALM) with the primary agent" |
| **Connected agent** | Customer Conversation | "Currently only Azure AI Foundry agents" (the product's current name, used on the other pages, is Microsoft Foundry) |
| **Live-agent handoff** | Standard; Customer Conversation has escalation paths per sub-agent | Transfer conversation node to an engagement hub; generic hubs need a custom adapter, and "Handoff currently supports only Direct Line" |
| **Hub agent** | Microsoft Copilot (Employee Self-Service agent) | The Employee Self-Service agent coordinates connected agents and assembles one answer; "only supports connecting agents within the same environment" |
| **Agent handoff** | Microsoft Copilot (Employee Self-Service agent) | The Employee Self-Service agent passes the conversation to a target agent that "owns the interaction for that task". Targets can be line-of-business agents or store agents "like Workday, Now Assist, or SAP Joule". It "can route to agents across environments". |

Child agents are documented for the standard harness only. The Microsoft Copilot harness pages (Learn still titles them "GitHub Copilot"; Microsoft renamed the harness on 28 October 2026) describe connected agents; the Customer Conversation harness has sub-agents. The Employee Self-Service pages say "Microsoft Copilot" and "Copilot Chat" for the product and its chat surface; this guide follows them, and uses "Microsoft 365 Copilot" only as the catalog's platform label.

Availability in US Government (GCC) and sovereign clouds: the Copilot Studio for US Government customers page (20 Jul 2026) does not mention child, connected, A2A, Foundry or Agents SDK agents, or live-agent handoff. Not documented as of 5 November 2026; confirm in the target cloud before relying on any mechanism here.

The harnesses differ on who talks to the user:

- **Microsoft Copilot harness** (as described on the standard-harness page Context distribution in the standard harness, section "How the GitHub Copilot harness differs"): the orchestration layer "never lets a connected agent take over communication", and "Connected agent messages pass through the parent's AI layer at every turn."
- **Standard harness:** a subagent "can message the user on its own while it runs," and the parent "can't stop a running subagent."

## 3. What crosses each handoff

### 3.1 Child agent (standard harness)

- Context: "always receives the parent conversation context," with "no setting to exclude it."
- Task: "By default, a child agent receives a natural language task to accomplish from the main agent when the agent calls it."
- Inputs: optional, typed, optionally required. **Should prompt user** lets the child ask the user for a missing value.
- Return: "a natural language summary of what happened during its execution," plus any configured outputs.
- After running: **Don't respond** (default), **Write the response with generative AI**, **Send specific response** or **Send an adaptive card**. This setting "doesn't prevent these messages because it only tells the parent what to do when the subagent finishes."
- Tools: child agents "have their own limits for the number of tools, separate from the limits of the parent agent." A tool can be restricted to explicit references by clearing **Allow agent to decide dynamically when to use this tool**.

### 3.2 Connected Copilot Studio agent (standard harness)

- Prerequisites: same environment; published; "configured to allow connections from other agents"; the maker "must either be the owner of the connected agent or have the agent shared with them."
- Default exposure: "By default, any agent can connect to another agent in the same environment." The opt-out is the agent's own setting, **Let other agents connect to and use this one**.
- Context: **Pass conversation history to this agent**, which "is enabled by default." Clearing it "limits the information being passed to the agent to just the explicit task that the main agent wants the other agent to complete."
- Description: "once an agent is connected, you control its description locally. Any updates to the connected agent's description don't automatically sync with your main agent."
- Version: "Your main agent can only use the latest version of a connected agent after that agent is published."
- Sharing: "Depending on your authentication setup, you might need to share the connected agent with end users of the main agent so they can access it and it can work correctly at runtime."
- Knowledge: "Child and connected agents respect the Use general knowledge setting of the main agent," but "might sometimes use the underlying language model knowledge when generating questions or messages."
- Citations: "might not always be maintained when passing outputs back from an agent back to a calling agent."
- Depth: "If you use an agent as a main agent with one or more connected agents, you can't also use the same agent as a connected agent for a second main agent." The error `ConnectedAgentChainingNotSupported` says the same: "those subagents can't have their own connected agents."
- Authentication (error `ConnectedAgentAuthMismatch`), three rules: "If the connected agent has No authentication configured, any orchestrator authentication is acceptable." "If the connected agent requires authentication, the orchestrator must use the same authentication method." "Manual authentication (Generic OAuth2) on the orchestrator isn't compatible with connected agents that require authentication. Both agents must use the same manual authentication configuration, or the connected agent must have no authentication requirement." The fix it gives is to make "both agents use the same authentication method (for example, both use Authenticate with Microsoft)" under **Settings > Security > Authentication**.

### 3.3 Connected agent (Microsoft Copilot harness)

- Flow, two of the page's six steps: "The connected agent runs in its own orchestration context, with its own configuration." "The primary agent sends the relevant conversation history and user message to the connected agent."
- Rephrasing: "the orchestrating model creates the task description and can rephrase or expand the user's request. Don't design connected-agent workflows that depend on the original prompt being forwarded verbatim."
- Size: "Connected-agent handoffs are subject to a messaging payload limit, so an oversized file handoff might not reach the primary agent. Return compact structured data when possible, and create or process the file in the primary agent." No number is given.
- Sharing: "Access to a parent agent doesn't automatically grant access to its connected agents. Share each connected agent separately with every intended user or group."
- Routing is based on "The connected agent's name and description", "The user's message and conversation context" and "Your primary agent's instructions."
- Removal: "Removing a connected agent from your agent doesn't delete the connected agent itself. It only removes the delegation relationship."
- Shared context: Compare Copilot Studio agent harnesses says this harness supports "ongoing subagent conversations with shared context."
- Billing: every connected-agent page for this harness notes "Using, building, testing, and evaluating agents might consume Copilot Credits." How a delegated run is metered is not documented as of 5 November 2026.
- **Not documented:** a setting equivalent to **Pass conversation history to this agent**. The add, manage and overview pages for this harness do not mention one. For external agents the generative orchestration FAQ says passing full history is configurable without naming the setting; see Q3.

### 3.4 External agents (A2A, Foundry, Agents SDK)

- A2A payload (standard-harness sample): "A unique `contextId`", "Message IDs", "Locale information", "Full chat history, not just the latest user utterance", "Message content parts". The history sits in the metadata key `copilotstudio.microsoft.com/a2a/chathistory`.
- A2A authentication: "None", "API key" or "OAuth 2.0". On the Microsoft Copilot harness, "A2A connections use the custom connector infrastructure" and the prerequisites say the remote agent must be "reachable from Copilot Studio over the public internet", while a note on the same page says the custom connector infrastructure lets you reach A2A agents "running on-premises or within a virtual network". The page states both; check which applies to your network.
- Foundry (Microsoft Copilot harness): "The connection authenticates with your Microsoft Entra ID user login," and the authentication type field shows "Microsoft Entra ID User Login". The page does not say whose identity the connection uses when someone other than the maker chats with the agent.
- Foundry Activity endpoint, a conflict between pages: the standard-harness Connect to a Microsoft Foundry agent (preview, 26 Aug 2026) says "You can currently enable the Activity endpoint only programmatically, by using the REST API or the Python SDK." The Microsoft Copilot harness Foundry page (14 Oct 2026) also allows "Publish the Foundry agent to Microsoft 365 or Microsoft Teams": for a prompt agent, publishing enables "the Activity protocol and the required `BotServiceRbac` authorization scheme" automatically. The Customer Conversation page (23 Oct 2026) lists both routes: publishing "to Microsoft 365 and Teams", or the REST API or Python SDK. Follow the page for the harness in use.
- Microsoft 365 Agents SDK (Microsoft Copilot harness): the agent is reached at its messaging endpoint, which "speaks the Activity protocol"; "Copilot Studio supports no authentication, API key, and OAuth 2.0", and the wizard "creates the connector for the agent". The standard-harness page (preview) has you pick the method "from the Connection string dropdown" without listing the options.
- Customer Conversation: connected Foundry agents "can't reference tools, topics, events, sub-agents, or variables from the primary agent's orchestration."
- Responsibility, as worded on the A2A, Foundry and Agents SDK pages: "When you connect to agents outside of Copilot Studio, you're responsible for the use of such agents." The pages list what you must ensure:
  - "Data flows, data handling, and data sharing between agents are appropriate for your use case and meet relevant requirements and laws."
  - "Appropriate permissions, boundaries, and approvals are provisioned, if prudent for your use case."
  - "Proper observability, identity and traceability, and human oversight functions are in place."

### 3.5 Live-agent handoff

- "When your agent hands off a conversation, it can share the full history of the conversation, and all relevant variables."
- Default context variables:
  - `va_Scope`, `va_LastTopic`, `va_Topics`, `va_LastPhrases` and `va_Phrases`;
  - `va_ConversationId`, `va_AgentMessage`, `va_BotId` and `va_Language`;
  - "All user-defined topic variables".
- "Your agent gathers all context variables across topics and merges them before sending to the engagement hub. If there are topics with similarly named context variables, the agent promotes the most recently defined topic variable."
- `va_Topics` "Doesn't include topics that were redirected to."
- The Transfer conversation node's private message is stored in `va_AgentMessage`.
- Generic hubs receive a `handoff.initiate` event activity with the context in its value and the transcript as an attachment.
- **Not documented:** any way to exclude a user-defined topic variable from the payload.
- Dynamics 365 Customer Service as the hub: the agent "shares the full history of the conversation and all variables collected in the interaction". Prerequisites include "a product license for Copilot Studio and a product license for the Chat Add-in for Dynamics 365 Customer service"; for a web app, "Your agent and Dynamics 365 Customer Service must be in the same environment"; for a Teams plan, the two environments "must be in the same geographical region". The page also offers single sign-on, with a linked page on passing the authentication token to the agent in live chat.
- **Not documented** (as of 5 November 2026): live-agent handoff on the Microsoft Copilot harness; none of its connected-agent pages covers it.
- **Not documented** (as of 5 November 2026): what a Customer Conversation sub-agent's escalation path sends to the human representative. The live-agent pages above apply to the standard harness only.

### 3.6 Employee Self-Service agent handoff (Microsoft Copilot)

- The Employee Self-Service agent "supports contextual handoff, which passes both the conversation history and the user's original prompt to the target agent."
- Target ownership: "The target agent owns the full session and can manage auth flows directly with the user." Step-up authentication such as an MFA prompt "for sensitive actions" is supported.
- Return: "When the user is done with the target agent, they must take an explicit action to return to the Employee Self-Service agent."
- Depth: "Don't go more than two levels deep in your agent hierarchy," because "Conversation context degrades as it passes through multiple layers."
- Testing: "Agent handoff must be tested in Copilot Chat. The 'Test' view in Copilot Studio doesn't support handoff."
- Live-agent support "can't be routed with the hub agent"; it needs agent handoff.

### 3.7 What does not come back

From the standard-harness context pages:

- "While a component runs, the orchestration layer can't see the messages that the component sends to the user."
- "What a component keeps to itself stays hidden. Topic variables and multi-turn conversations inside subagents exist inside the component. The orchestration layer sees them only if they are returned as outputs."
- "Adaptive Card action buttons and user interactions with them don't reach the standard harness context."
- "A subagent that returns no outputs is a red flag."

## 4. Credentials and confirmation, where they live

| Control | Where it is set | Documented behaviour |
|---|---|---|
| **Ask the end user before running** | Each tool, in the agent that owns it (documented on a standard-harness page) | "ask the agent for confirmation before running the tool. This option is set to No by default." |
| **Authentication** on a tool | Each tool | "End user" or "Maker-provided" credentials; "By default, user authentication applies." |
| **Control maker credential options** | Power Platform admin center, per environment or environment group | Admins choose end-user, maker-provided or both; "By default, both End-user and Maker-provided credentials are enabled." With maker credentials, "an end user might retrieve information or perform actions that only the maker's account is permitted to do." Once set, "all existing and new agents in that environment adhere to this rule", and "environment group settings override any environment settings." Trade-off when maker-provided credentials are prevented: "agents triggered by scheduled or autonomous events, or that attempt to run in the background, fail due to missing credentials. All agent triggers must involve an active user." |
| Event triggers | Agent | "Currently, agents with event triggers use only the maker's credentials for authentication. Tools called by an agent in response to a trigger must also use the maker's credentials." |
| Data policies | Power Platform admin center | Connectors covering, among others, HTTP requests, Power Platform connectors as tools, event triggers, publishing channels, Azure Bot Service skills and chat without Microsoft Entra ID authentication. **None is listed for connected or child agents.** |
| FAQ statement | Generative orchestration FAQ | "Admins can restrict which tools and agents are available." The FAQ does not name the mechanism for agents. |
| MCP server tools | Each MCP server added as a tool; data policy in the Power Platform admin center | "Blocking Power Platform connectors also blocks access to tools in connected MCP servers, which rely on Power Platform connectors for connectivity." For an MCP server the tool page's "Details section is similar" to other tools; whether **Ask the end user before running** and **Authentication** apply per MCP tool or per server is not documented as of 5 November 2026. All three harnesses can call MCP. |
| Sharing | Maker-credentials guidance | "Combine credential restriction with agent sharing controls for even tighter security." |
| Employee Self-Service hub rollout | Microsoft 365 admin center | "deploy the app to selected users for the initial rollout." |

The consequence is the gap this skill exists for. Confirmation and credentials are set **per tool, in the agent that owns the tool**. The parent's settings do not travel with a delegation. A connected agent whose tool uses maker-provided credentials can act beyond the user's own permissions, whichever agent the user started in. The admin control does not close this per agent: it covers the whole environment or environment group, and it stops every triggered agent there.

## 5. Microsoft's decision tiers (one agent)

From "Control layers and decision boundaries" (generative orchestration guidance, 4 Nov 2026):

- **Deterministic layer**, "for mission-critical or irreversible actions. For example, when processing a payment or deleting a record, use a strictly authored topic or flow". It adds: "you might either not expose such actions to the AI planner or always wrap them in a topic that requires user confirmation."
- **Hybrid (intercept) layer**, "for medium-risk processes". It allows "an approval step to have a manager review it", or a task "up to a certain value limit, then be required to escalate."
- **AI harness layer**, "for lower-risk queries"; "The agent doesn't need to stop and ask permission for routine tasks."

Then: "explicitly define decision boundaries. Look at which actions and topics:

- Can be executed without confirmation (the AI can just do them)
- Require the user's confirmation within the conversation
- Require offline approval (for example, an admin must confirm via an approval workflow)"

Enforcement is "through your topic design, for example by adding a confirmation node, through the platform's approval features, or via logic in the triggers."

The patterns page adds the bridge to multi-agent: "Treat a connected agent call like any other powerful action. If it's doing something sensitive, subject it to the necessary checks or user consent."

## 6. The boundary pattern

Everything in this section is **this skill's design pattern**, built on the documented facts above. It is not Microsoft guidance; say so when presenting it.

### 6.1 Action types

Classify every tool, flow, topic and delegate by the most consequential thing it can do.

| Type | What it covers | Examples | Tier (section 5) |
|---|---|---|---|
| **A1 Answer** | Read shared knowledge; no personal or restricted data | Policy lookups, product FAQs, summaries of public content | No confirmation |
| **A2 Read scoped data** | Read data whose access depends on who asks | Leave balance, case history, account details, mailbox or file content | No confirmation, but only with end-user credentials |
| **A3 Prepare** | Create or change something the user can undo, visible to the user only | Draft an email, draft a ticket, save a preference | No confirmation; must be reported back |
| **A4 Commit** | A change or message that other people see or rely on | Send an email or Teams message, submit a ticket or approval, update a shared record | Confirmation in the conversation, in the agent that executes |
| **A5 Irreversible or high-impact** | Cannot be undone, moves money, changes access, or discloses data outside the organisation | Delete records, make a payment, grant a role, send data to an external agent or party | Offline approval, or a deterministic topic with a confirmation node. Never reached by generative routing alone. |
| **A6 Hand over the conversation** | Another agent or a person owns the user from here | Employee Self-Service agent handoff, live-agent transfer | User-initiated or explicit topic; disclosure recorded |

A delegate's type is the **highest** type among the tools it can reach, not the type of the request that usually triggers it.

### 6.2 Who may delegate what to whom

Delegators are the parent's generative routing (by description), a topic redirect (deterministic) and an autonomous trigger (maker credentials only). Delegates are below.

| Type | Child agent | Connected agent, same environment | External agent (A2A, Foundry, Agents SDK, third-party store agent) | Person (engagement hub) |
|---|---|---|---|---|
| A1 | Generative routing | Generative routing | Generative routing; scoped request only, history off where the setting can be found (Q3) | Yes |
| A2 | Generative routing; end-user credentials on its tools | Generative routing; end-user credentials on its tools; shared with the same users as the parent | Only after a recorded data-sharing decision. The A2A sample sends full chat history. | Yes; review which topic variables travel |
| A3 | Generative routing | Generative routing; return `actionsTaken` | Topic redirect only | Not applicable |
| A4 | Generative routing; confirmation on the child's tool | Topic redirect, or generative routing with **Ask the end user before running** on the delegate's tool and test T3 passed | Not delegated, unless the parent confirms first and the external agent's own approvals are documented | Preferred when judgement is needed |
| A5 | Deterministic topic with a confirmation node, or offline approval | Not delegated without offline approval | Not delegated | Preferred |
| A6 | Not applicable | Not applicable | Employee Self-Service handoff, with the disclosure recorded | Explicit topic or the Escalate topic |

Autonomous delegators (event or scheduled triggers) may delegate A1 to A3; A4 and A5 only after offline approval, because the trigger and its tools run with the maker's credentials. For the same reason an autonomous delegator cannot run where the admin prevents maker-provided credentials: such agents "fail due to missing credentials" (section 4). Keep autonomous delegators, and their standard-harness connected agents (which must share their environment), in an environment that allows maker-provided credentials, separate from user-facing agents in environments that restrict them. Record each A2 to A5 tool they reach as a maker-credential exception with an owner.

### 6.3 Seven rules

1. **The tier travels with the action, not the agent.** Set confirmation and approval in the agent that owns the tool. On the standard harness the parent cannot stop a running subagent. On the Microsoft Copilot harness the parent is the only communicator, so put any confirmation in the parent before it delegates, and run T3 to see whether the delegate's own prompt reaches the user.
2. **Privilege ceiling.** A delegation must not let the user achieve through the delegate anything they could not achieve directly. For A2 to A5, delegate tools use end-user credentials. Maker-provided credentials are for A1 on shared resources only, plus the recorded exceptions an autonomous delegator needs (section 6.2). The admin restriction on maker-provided credentials forces end-user credentials on every tool, but it covers every agent in the environment or environment group and makes triggered agents fail (section 4), so apply it to environments that hold no autonomous agents.
3. **Least context.** Clear **Pass conversation history to this agent** unless the delegate needs it, and send a `scopedRequest` input either way. For external delegates, the FAQ says passing full history is configurable but no page names the setting (Q3): look for it, and until T6 shows the history is withheld, assume it goes and decide whether the agent should be connected at all. Keep secrets and special-category data out of topic variables before a live-agent transfer.
4. **Return contract.** Every delegate returns Microsoft's contract (`answered`, `scopedRequest`, `findings` or `interactionSummary`, `openQuestions`). Delegates that can act at A3 to A5 also return this skill's `actionsTaken`. That is a list of the changes made, with the record or message identifier for each, or "none".
5. **Irreversible actions are never routed by description.** A5 tools are not exposed to generative routing. Clear **Allow agent to decide dynamically when to use this tool**, and reach them only through a topic redirect with a confirmation node or an approval flow.
6. **Flat and explicit.** One level of delegation. Each delegate's description says what it must not do, as well as what it does, because the parent routes on descriptions. Connected-agent descriptions are local copies; review them whenever the delegate changes.
7. **Same audience.** Share each connected agent with exactly the users of the parent. Turn off **Let other agents connect to and use this one** on agents that hold A4 or A5 tools and are not meant to be delegates.

### 6.4 Boundary matrix template

One row per delegate. The skill fills it in from the user's design.

| Delegate | Mechanism and harness | Highest action type | Who may invoke it (routing, redirect, trigger) | Context it receives | Credentials on its tools | Where confirmation happens | Return contract | Shared with | Open risks |
|---|---|---|---|---|---|---|---|---|---|

## 7. Paste-ready instruction blocks

The quoted lines are Microsoft's, from the subagent design page (4 Nov 2026). The lines marked *boundary* are this skill's. Adapt the names.

**Parent (top-level) instructions**

```text
Whenever any topic or agent is called, always look for the 'answered' boolean output before deciding what to reply. Topics and agents have their own channel of communication with the user. If 'answered' is true, always assume that the request has been answered appropriately using at least one of the output variables, and check which ones based on the output description. Do not give an awkward acknowledgement of the answered content. Only provide the unanswered outputs, and continue the conversation naturally with the next step.

# boundary
When delegating to any agent, pass only the part of the request that agent handles, in its scopedRequest input.
NEVER delegate a request that would delete data, move money, change anyone's access or send data outside the organisation. Route it to the <approval topic> instead.
Before delegating any request that sends a message or changes a shared record, ask the user to confirm the exact action and wait for the answer.
If a delegate returns actionsTaken, tell the user what was changed, using the identifiers it returned.
```

**Subagent instructions (silent subagent)**

```text
Do NOT reply or communicate with the user directly.
Only fulfill the scopedRequest provided in the input and respond with the result.

# boundary
You MUST NOT delete records, make payments, change permissions or send data outside the organisation. If the scopedRequest needs one of these, do not attempt it; return it in openQuestions with the reason.
Return actionsTaken: every record or message you created or changed, with its identifier, or "none".
```

**Subagent description (what the parent routes on)**

```text
<What it handles, in one sentence>. Does not <the action types it must not be routed for>.
If its answered output is true, the user has already received their response and it should not be answered again.
```

The second line of the description block is Microsoft's.

## 8. Handoff contract

| Name | Direction | Type | Description for the orchestrator | Source |
|---|---|---|---|---|
| `scopedRequest` | Input | String | The specific request this agent should fulfill. | Microsoft |
| `answered` | Output | Boolean | True when the user already received an answer to the scopedRequest. | Microsoft |
| `scopedRequest` | Output | String | The request this agent worked on. | Microsoft |
| `interactionSummary` | Output | String | A short summary of the response that was delivered to the user. | Microsoft |
| `findings` | Output | String | The answer to the scopedRequest, for the parent to deliver to the user. | Microsoft |
| `openQuestions` | Output | String | Any part of the user's request that remains unanswered. | Microsoft |
| `actionsTaken` | Output | String | Every record or message this agent created or changed, with its identifier, or "none". | This skill |

On the standard harness these are child-agent inputs and outputs, or redirect-node inputs and outputs for agents that support them. Microsoft's pages do not say how explicit inputs and outputs are declared for a connected agent on the Microsoft Copilot harness. Treat that as open question Q3.

## 9. Gaps and open questions

| # | Question | What the documentation says |
|---|---|---|
| Q1 | Whose identity does a connected agent's tool use at runtime when the parent was reached by a signed-in user? | Per tool only: end-user or maker-provided. The auth-mismatch rules require the same method on both agents when the connected agent requires authentication. Nothing says a user token is passed through. |
| Q2 | Does a delegate's **Ask the end user before running** prompt reach the user on the Microsoft Copilot harness? | Not documented. That harness "never lets a connected agent take over communication." |
| Q3 | Is there a context or history setting for connected agents on the Microsoft Copilot harness, and for A2A, Foundry and Agents SDK connections? | Stated, not located. The generative orchestration FAQ (14 Oct 2026): "You can configure if the full conversation history is passed, and the task to complete, when your agent delegates to other external agents." It names neither the setting nor the harness, and no add or manage page for A2A, Foundry or Agents SDK agents (either harness) or for Microsoft Copilot harness connected agents shows one (checked 5 November 2026). The multi-agent patterns page (4 Nov 2026, standard harness only) says "A connected agent has a context-inclusion setting that controls whether it receives the conversation history, so confirm that setting rather than assuming the history is passed automatically"; the only such setting documented is **Pass conversation history to this agent**, for connected Copilot Studio agents. The A2A sample payload carries full chat history. T1 and T6 show what arrives. |
| Q4 | Can an admin block connected or child agents, or connections from one agent to another? | No data policy connector is listed for them. The FAQ says admins "can restrict which tools and agents are available" without naming how. On both harnesses "A2A connections use the custom connector infrastructure", and Microsoft Copilot harness Agents SDK connections also create a connector; if creating it fails, that page says to "check that the messaging endpoint URL is correct and that your environment allows custom connectors". So custom-connector data policies may apply. Beyond that troubleshooting line, this is inferred, not documented. Blocking Power Platform connectors does block tools in connected MCP servers (documented). |
| Q5 | Which identifier links a parent transcript to its connected agent's transcript? | "Typically, identifiers in the telemetry link the two." No field is named. |
| Q6 | Should the parent's instructions say it is the only agent that talks to the user? | Both pages are dated 4 Nov 2026 and apply to the standard harness only. The patterns page still gives the parent line as a "Do" ("You're the only agent that communicates with the user") and as checklist item 1, but a note now says "Routing all user communication through the parent is one valid design, not the only one" and points to the subagent page for the context contract. The subagent page says: "Telling the parent agent, 'You're the only agent that talks to the user,' doesn't work." Follow the subagent page, which the patterns page defers to, and instruct the subagent instead. |
| Q7 | How deep can delegation go on the Microsoft Copilot harness? | Standard harness: one level (chaining error). Employee Self-Service: two levels including the hub. Microsoft Copilot harness: not stated. |
| Q8 | Can a live-agent handoff exclude a topic variable? | Not documented. "All user-defined topic variables" are listed. |
| Q9 | What data controls apply when the Employee Self-Service agent hands off to a third-party store agent? | It passes "the conversation history and the user's original prompt". No filtering is documented. |
| Q10 | Is the standard-harness connection exposure on or off by default? | The page says "By default, any agent can connect to another agent in the same environment," then says to turn the setting on "if it isn't already." Check each agent's setting rather than relying on either reading. |

## 10. Tenant test plan

Run in a non-production environment with test accounts. Record the date, harness and agent versions, and keep transcripts.

| # | Test | Steps | Record | Answers |
|---|---|---|---|---|
| T1 | History toggle | Put a unique marker phrase in an early user turn. Route a later request to the connected agent, first with **Pass conversation history to this agent** on, then off (standard harness; on other harnesses, once). Ask the connected agent to list what it knows. | Whether the marker appears in the delegate's transcript and reply | Rule 3; Q3 |
| T2 | Privilege ceiling | Give the delegate's tool maker-provided credentials. Ask, as a user without access to the target data, for that data through the parent. | Whether the data or action is returned | Rule 2; Q1 |
| T3 | Confirmation reach | Set **Ask the end user before running** on a delegate's A4 tool. Invoke it through the parent on each harness in use. | Whether the user sees the prompt, and what happens if they decline | Rule 1; Q2 |
| T4 | Return contract | Ask a two-part question where the delegate can answer only one part. | Whether the parent answers once, and completes or flags the other part | Rule 4 |
| T5 | Live-agent payload | Store a marker value in a topic variable, then transfer. Inspect the context the hub receives (or `handoff.initiate` for a generic hub). | Which variables arrived | Rule 3; Q8 |
| T6 | External payload | On a test A2A or Agents SDK agent, log the incoming request. | Whether chat history arrives, and how much | Rule 3; Q3 |
| T7 | Audit correlation | Run one delegated request. Find both transcripts and any telemetry. | The identifiers that link them | Q5 |
| T8 | Sharing | Use an account that can reach the parent but not the connected agent. | Error, silent failure or fallback answer | Rule 7 |
| T9 | Autonomous delegation | Fire the parent's trigger so that it delegates. | Whose credentials the delegate's tools used | Section 6.2; Q1 |
| T10 | Routing for an irreversible action | With A5 tools set not to be chosen dynamically, phrase a request that matches the A5 tool's description. | Whether anything executes without the topic and confirmation | Rule 5 |

## 11. Review checklist

1. Every delegate has a row in the boundary matrix with its highest action type.
2. No A5 tool is reachable by generative routing.
3. No delegate tool at A2 to A5 uses maker-provided credentials, or the exception is written down with the owner's name.
4. **Pass conversation history to this agent** is off unless the row says why it is on.
5. Every delegate returns `answered` and `openQuestions`. Delegates at A3 to A5 also return `actionsTaken`.
6. Each connected agent is shared with the parent's audience and no wider.
7. **Let other agents connect to and use this one** is off on agents not meant to be delegates.
8. External delegates have a recorded data-sharing decision that covers chat history.
9. Topic variables that reach a live-agent transfer hold nothing the person on the other side should not see.
10. Tests T1 to T10 have been run on the harness in use, or are scheduled before production.

## 12. What to watch

- **Multi-agent orchestration patterns** (`guidance/multi-agent-patterns`). Revised 4 Nov 2026: it now applies to the standard harness only, calls parent-only communication "one valid design, not the only one" and defers to the subagent page, but still lists the "only agent that communicates" line as a Do and a checklist item. Removing that line would settle Q6.
- **Connected agents overview (GitHub Copilot)** and its add page. A context-inclusion setting would answer Q3.
- **Configure data policies for agents** (`admin-data-loss-prevention`). A connector for agent connections would answer Q4.
- **Add tools to custom agents** (`add-tools-custom-agent`). Any note on confirmation inside connected agents would answer Q2.
- **Hand off to a live agent** (`advanced-hand-off`). An exclusion option would answer Q8.

## Sources

Microsoft documentation, with each page's `ms.date` when it was last re-read on 5 November 2026 (the "Last updated on" footer of a page can show a different date):

**Handoff guidance (the three pages)**

- [Multi-agent orchestration patterns and best practices](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/multi-agent-patterns), 4 Nov 2026
- [Hand off to a live agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-hand-off), 30 Apr 2026
- [Agent handoff for Employee Self-Service agent](https://learn.microsoft.com/en-us/copilot/employee-self-service/agent-handoff), 15 May 2026

**Decision tiers**

- [Apply generative orchestration capabilities](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/generative-orchestration), 4 Nov 2026
- [FAQ for generative orchestration](https://learn.microsoft.com/en-us/microsoft-copilot-studio/faqs-generative-orchestration), 14 Oct 2026

**Mechanics: standard harness**

- [Add other agents overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-add-other-agents) (preview), 30 Oct 2026
- [Add a child agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-child-agent), 25 Aug 2026
- [Connect to an existing Copilot Studio agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-copilot-studio-agent), 30 Oct 2026
- [Connect to an agent over the Agent2Agent (A2A) protocol](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-agent-to-agent), 26 Aug 2026
- [Connect to a Microsoft Foundry agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-foundry-agent) (preview), 26 Aug 2026
- [Context distribution in the standard harness](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/generative-orchestration-context-design), 4 Nov 2026
- [Design subagents that avoid duplicate messages](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/generative-orchestration-subagents), 4 Nov 2026
- [Configure handoff to any generic engagement hub](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-generic-handoff), 16 Sep 2026
- [Configure handoff to Dynamics 365 Customer Service](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-hand-off-omnichannel), 25 Nov 2025
- [Connect to a Microsoft 365 Agents SDK agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-agent-microsoft-365-agents-sdk-agent) (preview), 13 Feb 2026

**Mechanics: Microsoft Copilot harness (formerly GitHub Copilot harness)**

- [Connected agents overview (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/authoring-add-other-agents), 6 Oct 2026
- [Add a connected agent to an agent (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/add-agent-connected), 14 Oct 2026
- [Manage connected agents in an agent (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/manage-connected-agents), 14 Oct 2026
- [Add an Agent2Agent (A2A) agent as a connected agent (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/add-agent-to-agent), 14 Oct 2026
- [Add a Foundry agent as a connected agent (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/add-agent-foundry), 14 Oct 2026
- [Add a Microsoft 365 Agents SDK agent as a connected agent (GitHub Copilot)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/add-agent-m-365-sdk), 14 Oct 2026

**Mechanics: Customer Conversation harness (prerelease)**

- [Sub-agents overview (Customer Conversation) (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/sub-agents-overview-customer-conversation), 8 Oct 2026
- [Add a connected agent (Customer Conversation) (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/add-agent-connected-customer-conversation), 23 Oct 2026

**Harnesses**

- [Harnesses in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/harnesses-overview), 19 Oct 2026
- [Compare Copilot Studio agent harnesses](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/choose-harness), 30 Sep 2026
- [Copilot Studio for US Government customers](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-licensing-gcc), 20 Jul 2026

**Employee Self-Service agent (Microsoft Copilot)**

- [Connecting agents overview](https://learn.microsoft.com/en-us/copilot/employee-self-service/connecting-agents-overview), 10 Jun 2026
- [Set up the Employee Self-Service hub for custom engine agents](https://learn.microsoft.com/en-us/copilot/employee-self-service/multi-agent-hub), 2 Oct 2026

**Credentials, confirmation and admin controls**

- [Add tools to custom agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/add-tools-custom-agent), 1 Oct 2026
- [Control maker-provided credentials for authentication](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-no-maker-authentication), 1 Sep 2025
- [Configure data policies for agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-data-loss-prevention), 1 Oct 2026
- [Resolve agent error codes in Microsoft Copilot Studio](https://learn.microsoft.com/en-us/troubleshoot/power-platform/copilot-studio/authoring/error-codes), 28 Oct 2026

Changed since the first reading on 30 October 2026: multi-agent orchestration patterns (from 21 May 2026), Apply generative orchestration capabilities (from 18 Sep 2026), context distribution and designing subagents (from 27 Aug 2026), Add other agents overview (from 15 May 2026) and Connect to an existing Copilot Studio agent (from 30 Mar 2026); the quotes used here still hold. Added on 5 November 2026: the two Agents SDK pages, the Dynamics 365 Customer Service handoff page, the standard-harness Foundry page and the US Government page. The Employee Self-Service pages moved to `learn.microsoft.com/en-us/copilot/employee-self-service/`; the old `microsoft-365/copilot/` addresses redirect.

Other sources, read on 1 November 2026:

- [The GitHub Copilot harness is now the Microsoft Copilot harness](https://www.microsoft.com/en-us/copilot/blog/copilot-studio/the-github-copilot-harness-in-copilot-studio-is-now-the-microsoft-copilot-harness/), Microsoft Copilot Studio blog, 28 Oct 2026
