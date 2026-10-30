# Governing shared agent memory in Copilot Studio

**Retention, eDiscovery and deletion for the memory that agent accounts share**

> **Status:** Written 30 October 2026 against Frontier preview documentation. Agent accounts and shared memory are prerelease features and Microsoft's pages carry the "subject to change" banner. Treat every statement below as "true of the docs on that date" and re-check the sources in the last section before you rely on it.

## Who this is for

- Microsoft 365 and Purview admins who are being asked to approve a Copilot Studio agent with its own account
- Compliance, records, privacy and legal teams who own retention schedules, legal holds and data subject requests
- Copilot Studio makers who want to know what they are signing their team up for

## The short version

1. An agent with an account keeps **one memory shared by everyone who talks to it**. Microsoft's own words: "shared memory has no privacy boundary between users." There is no end-user opt-out and no admin switch that turns off shared memory alone.
2. Microsoft Purview's documented coverage for Copilot Studio is built on **prompts and responses**, which are copied into a hidden folder in the user's Exchange mailbox. Retention policies, eDiscovery holds and the search-and-purge workflow all attach to that mailbox copy.
3. **Shared memory is not a prompt or a response, and no Microsoft page says where it is stored, whether a retention policy reaches it, whether a hold preserves it, or whether deleting the agent deletes it.** The only documented lifecycle control is automatic deletion after 28 days with no interaction, plus the fact that any user can view or delete memories at will.
4. Microsoft 365 Copilot's personal memory just gained Purview retention and eDiscovery support (Message Center MC1478965, rollout completed October 2026) because it lives in the user's mailbox. Copilot Studio shared memory is a different feature, is not mentioned in that notice, and should not be assumed to behave the same way.
5. Until Microsoft closes the gap, you govern shared memory **upstream** (what goes in, who can create agents, what the instructions say) and **by test** (run the hold, DSR and decommission scenarios in your own tenant and keep the evidence). This guide gives you the controls, the test plan and the runbooks.

## 1. Four things called "memory" that behave differently

The word "memory" now covers four distinct features in the Microsoft 365 and Copilot Studio estate. Governance conversations go wrong when people argue about one while reading documentation for another.

| Feature | Scope | Where it lives (documented?) | Lifecycle | Purview coverage (documented?) |
|---|---|---|---|---|
| **Microsoft 365 Copilot memory** (saved memories, inferred details, custom instructions) | Per user | Yes: hidden `CopilotMemory` folder in the user's Exchange mailbox, item class `IPM.Contact` | Until the user deletes it; turning memory off does not delete | Partly. eDiscovery search and Graph purge documented. MC1478965 adds Data Lifecycle Management retention and inactive-version preservation; the admin doc page still says retention does not apply. No audit log entries for memory actions. |
| **Copilot Studio memory, GitHub Copilot harness** | Per user, per agent | Partly: "a dedicated folder in Microsoft-managed storage", saved as files. Not Dataverse, not a mailbox. | Deleted after 28 days with no interaction from that user; user can delete in chat or portal; maker cannot see it; turning memory off does not delete | Not mentioned anywhere in Purview documentation |
| **Copilot Studio memory, Customer Conversation harness** | Per customer, per agent | Not stated | Structured schema, 30-day retention window | Not mentioned anywhere in Purview documentation |
| **Shared memory, agents with an account (Frontier)** | **One memory per agent, shared by every user** | **Not stated** | Deleted after 28 days with no interaction from anyone; any user can view or delete; no opt-out; cannot be disabled without disabling agent accounts | **Not mentioned anywhere in Purview documentation** |

The first row is the one Microsoft has been actively closing gaps on. The last row is the subject of this guide.

## 2. What Microsoft documents about shared memory today

All quotations are from the Copilot Studio agent-account pages dated 14 and 15 October 2026.

**What it holds.** "Shared memory holds two kinds of information: facts about the work, such as team processes and terminology, and details about individual people, such as how someone prefers to receive updates."

**Who can see it.** "Anyone who works with the agent. A record about one person can be used in later conversations with other people. The agent is guided not to bring up one person's details with someone else, but shared memory has no privacy boundary between users."

**Permission and label bypass.** The agent's People card says: "Any files or chats you share can be summarized and included in the agent's responses to any user, even users without permissions to the files or chats and regardless of sensitivity label." The one hard stop is encryption: "Agents with an account can't read protected documents," meaning documents whose sensitivity label applies encryption.

**Who can delete it.** "Everyone who interacts with the agent can view or delete its saved shared memories."

**Retention.** "If no one interacts with the agent for 28 days, the system automatically deletes its shared memories."

**Opt-out.** "End users can't opt out of shared memory in this preview. By using the agent, you consent to its use of shared memory." And for admins: "shared memory can't be turned off independently of agent accounts. To turn off shared memory, an admin must turn off agent accounts altogether."

**Exclusions.** Microsoft lists categories the agent is guided to exclude: ID numbers and similar personal identifiers, credentials and secrets, anything a person asks it not to remember, judgments about performance or conduct, health information, protected characteristics, content already in instructions or knowledge, and single-remark inferences. These are model instructions, not a technical filter. Microsoft 365 Copilot's admin page is explicit for its own memory that "admins can't restrict what type of information is added to Copilot memory," and nothing in the Copilot Studio pages suggests a stronger control exists for shared memory.

**Deletion of the agent.** "When you delete an agent in Copilot Studio, Copilot Studio also deletes the associated Microsoft Entra Agent ID." Nothing is said about the agent account, its mailbox, or its shared memory.

**Storage location.** Not stated. The closest documented sibling, per-user memory on the same harness, is stored as files in a per-user folder in Microsoft-managed storage. Whether shared memory uses the same mechanism scoped to the agent, or something else, is not documented.

## 3. Where Purview reaches, and where it does not

Microsoft's Purview pages for Copilot Studio (May 2026) and for Agent 365 (May 2026) both show a table of ticks: audit, classification, sensitivity labels, DLP, Insider Risk, Communication Compliance, eDiscovery and Data Lifecycle Management are all "supported for AI interactions." Read the fine print and every one of those ticks is about **interactions**, meaning prompts and responses, or about the agent's **mailbox and Teams traffic** when it is treated as a user.

| Data | Retention (DLM) | eDiscovery search | Hold preserves it | Search-and-purge | Audit log | Classification / DLP |
|---|---|---|---|---|---|---|
| Prompts and responses with the agent | Documented: "Microsoft Copilot experiences" location, copy stored in the *user's* mailbox hidden folder | Documented: item class `IPM.SkypeTeams.Message.Copilot.Studio.*` | Documented: deletion suspended under retention, Litigation Hold or eDiscovery hold on the mailbox | Documented: Graph `purgeData`, 10 items per mailbox per run | Documented | Documented on prompt/response text |
| Email and Teams messages sent or received by the agent account | Documented for Agent 365: "include the agent instance in policies as you would a user"; Teams, OneDrive, SharePoint and email locations | Documented: "Identify an agent instance as you would a user" | Follows normal mailbox rules | Normal mailbox rules | Documented: "Audit an agent instance as you would a user" | Documented: agent-to-human and human-to-agent in Teams, SharePoint, email |
| **Shared memory** | **Not documented** | **Not documented** | **Not documented** | **Not documented** | **Not documented** (Microsoft 365 Copilot's own memory explicitly generates no audit entries) | **Not documented** (classification runs on the interaction text that feeds memory, not on what memory retains) |

Two details make this worse than "undocumented":

- **The mechanism Purview relies on does not obviously apply.** Everything Purview does for AI data hangs off a copy in an Exchange mailbox. Per-user Copilot Studio memory is documented as files in Microsoft-managed storage, not a mailbox item. If shared memory works the same way, there is nothing for a retention policy or a hold to attach to. If instead it lives in the agent account's own mailbox (the agent now has one), it might be discoverable by treating the agent as a custodian. Nobody outside Microsoft knows which, and the guide's test plan is designed to find out.
- **Any user can delete memory, and no audit trail is documented.** A custodian under a legal hold can ask the agent to forget something, or open the memory portal and delete everything, and the documentation gives you no record that it happened and no hold that stops it. For Microsoft 365 Copilot memory, Microsoft states outright that "memory and personalization actions don't generate audit log entries in Purview." Assume the same for shared memory until you observe otherwise.

## 4. The open questions, stated precisely

These are the questions a records manager or litigation counsel will ask, with the current answer.

| # | Question | Documented answer |
|---|---|---|
| Q1 | Where is shared memory stored, and in whose mailbox or storage account does it sit? | None |
| Q2 | Does a Purview retention policy on the "Microsoft Copilot experiences" location, or on the agent's mailbox, retain or delete shared memory? | None |
| Q3 | Does an eDiscovery hold or Litigation Hold on the agent account, or on a user who talks to the agent, prevent deletion of shared memory, including the 28-day auto-delete and user-initiated deletes? | None |
| Q4 | Can an eDiscovery search return shared memory items, and if so under which item class or location? | None |
| Q5 | Is there any audit record when a memory is created, updated or deleted, and by whom? | None (and "no" for the nearest documented sibling) |
| Q6 | Does deleting, unpublishing or removing the account from an agent delete its shared memory? | None (only the Entra Agent ID deletion is documented) |
| Q7 | Does a scheduled trigger run count as "interaction" for the 28-day clock, meaning an always-on agent's memory never expires? | None |
| Q8 | Can an admin enumerate or export shared memory for a data subject request without being a user of the agent? | None |
| Q9 | Does shared memory inherit data residency from the environment, the tenant, or the agent's mailbox? | None |

## 5. A governance model you can run now

You cannot wait for Microsoft to answer Q1 through Q9 before someone in your tenant publishes an agent with an account. The controls below work with what exists today. They are grouped by where in the lifecycle they bite.

### 5.1 Admission: decide who can create these agents and where

Agent accounts need two admin actions, and both are your gate:

- In the Microsoft 365 admin center, the **Copilot Studio (Frontier)** agent template activation wizard lets you pick the users or groups allowed to create agents with accounts. Use a named security group, not "everyone," and keep the template inactive until that group exists and has been reviewed.
- In the Power Platform admin center, **Agent accounts** is an environment-level setting. Enable it in one pilot environment on the early release cycle. Do not enable it in default or production environments until the test plan in section 6 has been completed.

Because shared memory cannot be switched off independently, these two settings are the only off switch you have. Record who owns them.

### 5.2 Design: write the memory rules into the agent's instructions

Microsoft's design guidance is that makers "control how retained context is used through instructions and by designating authoritative business records and policies." Make that mandatory. Every agent with an account should ship with an instruction block that:

- names the authoritative records (the tracker, the policy document, the system of record) and says they win over anything in memory;
- states which categories must never be remembered, restating Microsoft's exclusion list in your own terms and adding anything specific to your regulated data;
- tells the agent to confirm before remembering anything about a named person other than their stated working preferences;
- instructs the agent to remind users that memory is shared when they share a file or a chat.

A starting point:

```text
Memory rules:
- The approved workstream tracker and the team policy site are authoritative. If something you remember conflicts with them, follow them and correct your memory.
- Do not remember: personal identifiers, contact details beyond work email, health or leave reasons, performance or conduct remarks, anything about a person's protected characteristics, credentials, customer personal data, or the contents of any document labelled Confidential or higher.
- Before saving a memory about a specific person that is not a working preference they stated themselves, ask the person who shared it to confirm it may be shared with the whole team.
- When a user shares a file or a chat, remind them once that your memory is shared with everyone who works with you.
```

Instructions are a soft control. They reduce what gets in; they do not give you retention, holds or audit. Treat them as necessary, not sufficient.

### 5.3 Notice and consent: do not rely on the built-in banner alone

Microsoft shows a notice on the agent's People card and in the first conversation. For personal data about people who never talk to the agent (the colleague whose leave is mentioned in a chat, the customer named in a forwarded email), that notice reaches nobody. Add:

- a short written notice to every audience the agent is added to (team, channel, distribution list) before the agent joins;
- an entry in your records of processing, and a decision on whether a DPIA is needed, before publishing;
- a rule that the agent's audience is limited to groups whose members already share the same data access, so the permission-bypass behaviour of shared memory does not create a new disclosure path.

### 5.4 Classification: protect at the source, not in memory

Purview classification and DLP act on the prompt and response text and on the agent's mail and Teams traffic. They do not act on memory. So:

- keep encrypted sensitivity labels on anything the agent must never summarize, since encryption is the only documented hard stop;
- apply a DLP policy that includes the agent instance as a user, so sensitive content sent to it by email or Teams is blocked or audited before it becomes a prompt;
- use DSPM for AI's "Detect unethical behavior in AI" and sensitive-info policies on Copilot Studio interactions to see what is being fed to the agent, which is the best proxy you have for what memory might contain.

### 5.5 Retention: set it where it works, document where it does not

- Create a Data Lifecycle Management retention policy for the **Microsoft Copilot experiences** location so prompts and responses with the agent are retained for your required period. This is documented and works today.
- Apply your normal mailbox retention policy to the agent account's mailbox, as Agent 365 guidance says to treat it like a user.
- Write down, in your retention schedule, that shared memory is **not covered** by either policy as of the date you checked, that its only documented lifecycle is 28-day inactivity deletion, and that an always-on agent may never hit that threshold (Q7). This is the entry an auditor needs to see.

### 5.6 Holds and eDiscovery: assume memory is not preserved until you prove otherwise

When a hold notice lands that touches a process the agent runs:

1. Put the agent account on hold as a custodian, as well as the human users. This is documented to preserve its mailbox traffic and the users' prompt/response copies.
2. Immediately export what the agent currently remembers by asking it in chat and via the memory portal, and preserve that export under the case. This is the only documented way to see shared memory, and anyone can delete it at any time.
3. Instruct users in the hold notice **not** to ask the agent to forget anything and not to use "Delete all memories."
4. Run an eDiscovery search against the agent's mailbox for `IPM.Contact` and for the Copilot item classes to check whether memory items surface there (Q1, Q4). Record the result either way.
5. Note in the case file that shared memory has no documented hold protection or audit trail.

### 5.7 Deletion and data subject requests

For a request to access or erase what the agent holds about a person:

- **Access:** ask the agent what it remembers about the person, capture the answer, and check the memory portal. Also run the documented eDiscovery workflow on the prompt/response copies, because that is where the raw inputs live.
- **Erasure:** ask the agent to forget the specific memory and confirm it is gone by asking again. For the interaction records, use the documented search-and-purge workflow (eDiscovery search plus Graph `purgeData`, up to 10 items per mailbox per run, holds removed first then reapplied). Microsoft's own eDiscovery page warns that "deleting a conversation or message from Microsoft Purview or eDiscovery doesn't delete the associated Copilot memory," so do both.
- **Evidence:** because no audit record is documented, screenshot or export the before and after state and file it with the request.

### 5.8 Decommissioning

Set the retirement date when you publish. When it arrives, in this order:

1. Switch off triggers so the agent stops generating interactions (and stops resetting the 28-day clock).
2. Export shared memory one last time if any retention obligation applies to it.
3. Delete all memories through the portal.
4. Remove the agent from its audiences, remove tool connections and permissions.
5. Delete the agent, which is documented to delete the Entra Agent ID.
6. Check the agent's mailbox state in Exchange: if it persists as an inactive mailbox under hold, note that; if it is gone, note that. Then check whether the agent still appears in the Agent 365 registry.

Step 6 is where you learn the answer to Q6 for your tenant. Record it.

## 6. The test plan: close the open questions in your own tenant

Run this in the pilot environment before any production use, with a test agent and test users, and keep the results as your evidence that you checked. Each test maps to a question in section 4.

| Test | Steps | What to record | Answers |
|---|---|---|---|
| T1 Locate | Have two test users share distinct, easily searchable facts with the agent. Run eDiscovery searches on each user's mailbox and on the agent account's mailbox for the facts, for item class `IPM.Contact`, and for `IPM.SkypeTeams.Message.Copilot.Studio.*`. | Which locations and item classes return the memory fact, if any, versus only the prompt/response copies | Q1, Q4 |
| T2 Retention | Apply a short "Microsoft Copilot experiences" retention policy (delete after 1 day) and a short mailbox retention policy to the agent. Wait the documented 1 to 16 days. | Whether prompts/responses are purged (expected) and whether the shared memory fact survives (expected, but unproven) | Q2 |
| T3 Hold | Place an eDiscovery hold on the agent account and one user. Have another user ask the agent to forget the fact, then use "Delete all memories." | Whether the memory survives the deletion attempt under hold; whether any audit event appears in Purview Audit or Entra sign-in logs | Q3, Q5 |
| T4 Expiry | Leave a second test agent untouched for 29 days; leave a third with a daily trigger but no human interaction. | Whether memory expires in both cases | Q7 |
| T5 Export | Attempt to enumerate shared memory as a Compliance Administrator who has never chatted with the agent. | Whether any admin path exists beyond becoming a user of the agent | Q8 |
| T6 Decommission | Follow section 5.8 on the test agent. | Mailbox state after deletion; registry state; whether a recreated agent with the same name starts with empty memory | Q6 |

Re-run T1 and T3 whenever the Copilot Studio or Purview documentation changes, since those are the two tests most likely to flip as Microsoft extends the Microsoft 365 Copilot memory work to agents.

## 7. When not to give an agent an account yet

Given the state of the documentation, decline agent accounts for a process if any of these are true:

- the process routinely handles special-category personal data, customer personal data, or regulated records with a defined retention schedule;
- the process is a plausible subject of litigation or regulatory inquiry in the next 12 months and you cannot accept undocumented hold behaviour;
- the team using the agent does not already share uniform access to the data the agent will see;
- you cannot name an owner who will run the DSR and decommission runbooks above.

Microsoft's own guidance for the preview is to "start with one recurring shared process that has clear decision points." Reporting roll-ups, status collection and internal document triage fit. HR, legal matters, customer complaints and anything touching health or financial identifiers do not.

## 8. What to watch

The gap is likely to close in pieces. Watch these specific places:

- **MC1478965 and successors.** The notice that brought Microsoft 365 Copilot memory under Purview retention was published 24 September 2026 and updated 22 October 2026. A follow-on notice extending retention and eDiscovery to Copilot Studio or agent memory is the thing to look for.
- **The Copilot Studio agent-account FAQ** (`faq-agent-accounts`) and **memory overview** pages. Any sentence about storage location, admin deletion or Purview will appear there first.
- **The Purview pages for Copilot Studio and Agent 365** (`ai-copilot-studio`, `ai-agent-365`). Both currently date from May 2026 and predate agent accounts; a revision is the signal that coverage has been defined.
- **The eDiscovery AI data page** (`edisc-search-copilot-data`). A new row in the item-class table for agent memory would answer Q4 outright.
- **Your own T1 and T3 results.** Rerun them after each of the above changes.

## Sources

Microsoft documentation, with the date shown on the page when retrieved on 30 October 2026:

- [FAQ for agent accounts (Frontier)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/faq-agent-accounts), 14 Oct 2026
- [Give your agent an account (Frontier)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/authoring-agent-account), 15 Oct 2026
- [Memory (GitHub Copilot) (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/memory-overview), 27 Jul 2026
- [Memory (Customer Conversation) (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/memory-overview-customer-conversation), 8 Oct 2026
- [Manage Entra Agent IDs](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-use-entra-agent-identities), 21 Aug 2026
- [Use Microsoft Purview to manage data security and compliance for Microsoft Copilot Studio](https://learn.microsoft.com/en-us/purview/ai-copilot-studio), 1 May 2026
- [Use Microsoft Purview to manage data security and compliance for Microsoft Agent 365](https://learn.microsoft.com/en-us/purview/ai-agent-365), 1 May 2026
- [Learn about retention for Copilot and AI apps](https://learn.microsoft.com/en-us/purview/retention-policies-copilot), 23 Sep 2025
- [Search for and delete AI application data in eDiscovery](https://learn.microsoft.com/en-us/purview/edisc-search-copilot-data), 19 Jun 2026
- [Manage Copilot personalization and memory](https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-personalization-memory), 2 Sep 2026
- [Microsoft Agent 365 overview](https://learn.microsoft.com/en-us/microsoft-agent-365/overview), 19 Aug 2026
- [MC1478965: Microsoft Purview Data Lifecycle Management, retention for Copilot memory](https://mc.merill.net/message/MC1478965) (archived copy), published 24 Sep 2026, updated 22 Oct 2026
- [Delegate shared business processes to agents that are more persistent and proactive with Microsoft Copilot Studio](https://www.microsoft.com/en-us/copilot/blog/copilot-studio/delegate-shared-business-processes-to-agents-that-are-more-persistent-and-proactive-with-microsoft-copilot-studio/), Microsoft Copilot Blog, 15 Oct 2026

Commentary that identified parts of the gap before this guide:

- Holger Imbery, [Agents With Their Own Accounts: What Changes When Copilot Studio Agents Stop Borrowing Your Identity](https://dev.to/holgerimbery/agents-with-their-own-accounts-what-changes-when-copilot-studio-agents-stop-borrowing-your-identity-1bhm), Oct 2026
- Rajesh Beri, [Copilot Studio Agents Keep Shared Memory, No User Opt-Out](https://www.beri.net/article/copilot-studio-agent-accounts-frontier-shared-memory-no-permission-boundary-entra-identity-ai-teammates-license), 19 Oct 2026
- EDRM, [Ransomware logs and Copilot memory put AI agent records on the eDiscovery agenda](https://edrm.net/2026/10/ransomware-logs-and-copilot-memory-put-ai-agent-records-on-the-ediscovery-agenda/), Oct 2026
- [New in Frontier: Delegate Business Processes to Copilot Studio Agents](https://futurework.blog/2026/10/16/new-in-frontier-delegate-business-processes-to-copilot-studio-agents/), 16 Oct 2026
