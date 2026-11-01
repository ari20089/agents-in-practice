# Code App PR Description

## Summary

A team working on a Power Apps code app opens pull requests every day, and reviewers ask the same five questions of each one: which screens changed, which data sources came in, what users will now be asked to consent to, whether anyone needs a different licence, and what was tested. This prompt answers them from the diff. Paste it into GitHub Copilot Chat on the branch, fill in the base branch and what you tested, and Copilot writes the pull request description in the same shape every time:

- **Screens touched**: routes added, changed, removed or renamed, and screens reached through a shared component or an app-wide setting;
- **Data sources added**: connectors, tables, Dataverse tables, actions and functions, flows and Copilot Studio agents added, removed, refreshed or rebound, and how each is bound (connection reference, connection ID, native, `@envvar:`);
- **Connector permissions changed**: the operations the app now calls or no longer calls, read or write, with what that means for consent, each user's access, the data policy, and anything the default Content Security Policy (CSP) blocks or the public build exposes;
- **Licensing impact**: No change, Possible change or Change, with the reason and what to confirm;
- **Test evidence**: tests in the diff and what they assert, your manual testing, the gaps, and up to five checks before merging.

Every row names its file. Anything the diff can't show is marked "To confirm" or listed under the description as not checked. It only reads: it doesn't change files, run the tests or push.

## What's in the folder

| File | What it's for | Where it goes |
|---|---|---|
| [`PROMPT.md`](./PROMPT.md) | The prompt: what a code app diff contains, the order to read it in, the description template and the rules. 7,827 of the 8,000 characters allowed. | Pasted into chat, as is, with the two placeholders filled in |

## Run it

**GitHub Copilot Chat in VS Code**

1. Check out the branch. In the Chat view, start a **Local** session with the **Agent** control on Agent, so Copilot can run `git` and open the generated service files.
2. Paste the contents of `PROMPT.md`, fill in the two placeholders, and send it.
3. When Copilot asks to run a terminal command, allow only read-only ones: `git diff`, `git log`, `git status`, `git show` and listing files.
4. Copy the fenced block into the pull request description. Read the list under the block of what it couldn't check.

To run it again with `/code-app-pr-description`, save it as `.github/prompts/code-app-pr-description.prompt.md` with this header above the prompt. Prompt files run only in Local harness sessions; in any other session, paste the prompt. Leave the placeholders in the saved file and fill them in each time: the prompt asks for them if you don't.

```markdown
---
description: Write the pull request description for this code app branch: screens, data sources, connector permissions, licensing, test evidence.
agent: agent
---
```

**GitHub Copilot CLI or another coding agent**

Start the agent in the repository's root on the branch and paste the prompt. It works the same way in any agent that can run `git`.

**A chat that can't see the repository**

Paste the prompt and the output of `git diff --stat <base>...HEAD`, `git diff <base>...HEAD`, `git log <base>..HEAD` and `git status --short`, and attach `power.config.json`. Without the generated service files it can't map every method to its operation, and says so.

**Placeholders**

- `<base branch, such as main>`: the branch the pull request merges into. If it isn't checked out locally, the prompt uses `origin/<base>`.
- `<what you ran and what you saw…>`: your manual testing in a sentence or two. Say whether you ran it locally or pushed it to an environment, whether you signed in as the maker or as a user without maker rights, and which screens you opened. Write "nothing yet" if you haven't tested; the description then says "Not stated" and lists every gap.

## What it checks

The facts the prompt relies on are stated in the prompt, so the agent doesn't need current documentation. Each rests on these pages:

| Section | What it reports | Basis |
|---|---|---|
| Screens touched | Routes and page components; shared components traced to the screens that render them; app-wide settings | Code apps "support single-page applications (SPAs)" (Architecture), so screens are routes, not a platform concept. `pa app set-setting` "writes the setting to `appSettings` in `power.config.json`", and the header setting applies "for all app users" (CLI reference; System configuration) |
| Data sources added | Entries in `power.config.json` and the generated files for each data source | `power.config.json` "contains metadata… for Power Platform connections and to publish an app" (Architecture). Its keys come from the `PowerConfig` type in Microsoft's Dataverse sample. Adding a data source "automatically generates a typed TypeScript model and service file"; `pa app remove data-source` and `pa app refresh data-source` (Connect to data). A flow "Adds the flow and its connection references to `power.config.json`" and writes `schemas/logicflows/` (Add flows). A Dataverse action or function writes `<schemaPath>/dataverse/`, regenerates `dataSourcesInfo.ts` and "Adds the Dataverse reference" to `power.config.json` (Add a Dataverse action or function). Action services carry "This file is autogenerated" and name each `operationName`; table services expose `create`, `get`, `getAll`, `update` and `delete` (Microsoft's Release Planner sample; Connect to Dataverse) |
| Data sources added: binding | Connection reference, connection ID, native, `@envvar:` | A connection reference "makes the solution environment-aware and portable across Dev, Test, and Prod environments"; "Native Dataverse doesn't use a connection ID, connection reference, or dataset" (Connect to data; CLI reference). `@envvar:` references for "tabular arguments such as dataset and table" are "persisted in the data source configuration" (Use environment variables) |
| Data sources added: flags | Client library below 1.1.1; Excel Online | Flows need "`@microsoft/power-apps` version 1.1.1 or later" and must be "solution-aware instant flows that use the Power Apps trigger" (Add flows); so do Dataverse actions and functions (Add a Dataverse action or function). Excel Online (Business) and Excel Online (OneDrive) "aren't yet supported" (Connect to data). The prompt reads the installed version from the lockfile, not the range in `package.json` |
| Connector permissions changed: read or write | Each operation classed Read or Write | Dataverse functions "perform operations that have no side effects" (Use Web API functions); actions can change data. Connector operations are classed by name, then by the generated service's comment |
| Connector permissions changed: consent | Whether users may see the consent dialog again | "End-users see consent dialog for connector permissions", and "Consent suppression works for both Microsoft connectors that use OAuth and custom connectors that use OAuth" (Overview). For canvas apps, "the consent dialog lists the specific permissions that the app uses", is "presented to the user again for the aggregated permissions" when actions are added, and "The permissions continue with the maximum set of actions that have ever been used" (Manage connections in canvas apps). The prompt says this is documented for canvas apps only |
| Connector permissions changed: access | What each user needs for each new source | "Code apps don't yet support Secure Implicit Connections" (Overview); flow callers need "the App Opener security role or an equivalent role" (Add flows) |
| Connector permissions changed: data policy | Each new connector the policy must allow | "Data Loss policy enforcement during app launch" (Overview); a violating app is put "in to a *suspended* or *quarantine* state", and "the latency for full enforcement is 24 hours" at most (Data policies) |
| Connector permissions changed: outside connectors | `fetch`, `axios`, sockets, CDN resources, cross-origin iframes, keys in client code | Default `connect-src 'none'`, `script-src 'self'`, `font-src 'self'`, `frame-src 'self'`; settings apply "to all code apps in the environment" and need an environment administrator (Configure CSP). Built files are hosted "on a publicly accessible endpoint… Don't store sensitive user or organizational data in the app" (System configuration) |
| Licensing impact: audience | New users, guests, edit grants | `pa app share` grants `play` (default) or `edit`; "Grant `edit` access when a service principal needs to run `pa app push`" (CLI reference). "Code apps follow canvas app sharing limits", and guests can use them through Azure B2B (Overview; Microsoft now calls this Microsoft Entra B2B collaboration) |
| Licensing impact: licences and cost | No change, Possible change or Change | End users need "Power Apps Premium license", "Pay-as-you-go enabled", "An App Pass" or "Auto-claim enabled" (Overview). For an instant flow in the context of an app, "every user running the flow needs a Power Apps Premium license or a Dynamics 365 license" (Power Apps licensing FAQs). "*Copilot Credits* are the unit that measures agent usage"; the no-charge row for Microsoft 365 Copilot licensed users covers employee-facing use where "the agent operates using the authenticated Microsoft Copilot USL user's identity" (Copilot Studio billing rates). The connector is `shared_microsoftcopilotstudio` (Connect to Copilot Studio) |
| Test evidence | Tests and what they assert, your notes, gaps, checks before merge | No Microsoft claim. The prompt forbids saying tests pass unless the diff or your notes show the result, doesn't count a test that asserts nothing about the app, and treats a local run as weaker evidence than a pushed app |

How it sets the licensing verdict: **Change** when the branch adds an audience (a `pa app share` or guest access) or a Copilot Studio agent call; **Possible change** when it adds a flow (for users on an App Pass or pay-as-you-go) or a custom connector to a service that bills separately; otherwise **No change**, because every user already needs one of the four licence options and the code apps pages name no connector that needs more.

The [Code App Readiness Check](../code-app-readiness-check/) covers the step before this one: whether an existing app can become a code app at all.

## Prerequisites

- A Power Apps code app in a git repository, with the branch checked out and the base branch available locally or as `origin/<base>`.
- GitHub Copilot Chat in VS Code with the Agent control on Agent, the GitHub Copilot CLI, or another coding agent that can run read-only `git` commands.
- Nothing on Power Platform is needed to write the description. To act on it, someone with access to the environment checks the data policy, CSP settings, sharing limits and licences it names.

## Limitations

- Written against 17 Microsoft Learn pages dated 27 August 2025 to 30 October 2026, all read on 1 November 2026, and against Microsoft's PowerAppsCodeApps repository as of 19 October 2026. Code apps change often; check the Sources before relying on a section.
- The keys inside `power.config.json` aren't documented on Learn as of 1 November 2026. The prompt names the keys typed in Microsoft's Dataverse sample, which can change without notice.
- Generated file locations differ between Microsoft's own pages and samples (`src/generated/services/`, `src/services/`, `.power/schemas/`, `schemas/logicflows/`, `<schemaPath>/dataverse/`). The prompt recognises generated files by their "This file is autogenerated" header rather than by folder.
- Repositories set up before the Power Apps CLI (`pa`) may still run `pac code` commands in scripts and pipelines. The prompt reads them as their `pa app` equivalents; the rename isn't documented on Learn as of 1 November 2026.
- Whether the consent dialog in a code app follows the canvas app rule (shown again when operations are added, never reduced) isn't documented for code apps as of 1 November 2026. The prompt says users "may" see it again.
- Two licensing questions aren't documented as of 1 November 2026: whether a Copilot Studio agent call from a code app counts as included use for Microsoft 365 Copilot licensed users, and whether an App Pass or pay-as-you-go covers an instant flow run from a code app (the licensing FAQ names Power Apps Premium and Dynamics 365 only). The prompt reports both as things to confirm, not as costs. The same FAQ says stricter licence checks start in February 2027; code apps already require a premium licence for every user.
- Whether running the app locally applies the environment's CSP isn't documented as of 1 November 2026, so the prompt doesn't treat a local run as proof that the pushed app works. Local runs can also hit the browser's local network access prompt (Quickstart).
- Read or write is decided from the operation's name, its Dataverse type and the generated service's comment. An operation with an unclear name may be classed wrongly, and a Copilot Studio agent can take actions of its own; the table is a starting point for the reviewer, not a permission audit.
- The prompt can't see the environment: the data policy, CSP settings, sharing limits, who holds which licence, or whether a connection reference or environment variable exists in the target solution. It names what to confirm instead.
- Tried three times on one sample branch, run by a coding agent that could run `git`. The first version was given a React code app with 16 planted changes and reported all 16. After review the branch grew to 28: added `@envvar:` bindings, a Dataverse table, function and bound action on a lockfile pinned to 1.0.3, a pipeline with `pac code push` and an edit grant to a service principal, a new screen, and an uncommitted change. The prompt as published reported all 28, classed the Dataverse function as a read, and copied none of the connection, environment or app IDs, the site or org URLs, the email or the key value. Table cells still ran longer than asked. Not yet run inside GitHub Copilot Chat itself.

## Sources

Microsoft Learn, with each page's `ms.date` when it was read on 1 November 2026:

- [Power Apps code apps overview](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/overview), 23 Sep 2026
- [Code apps architecture](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/architecture), 12 Aug 2026
- [Code apps system configuration](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/system-limits-configuration), 15 Sep 2026
- [Quickstart: Create a code app using the Power Apps CLI](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/create-an-app-from-scratch), 13 Aug 2026
- [Connect your code app to data](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/connect-to-data), 2 Oct 2026
- [Connect your code app to Dataverse](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/connect-to-dataverse), 14 Aug 2026
- [Add a Dataverse action or function to a code app](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/add-dataverse-action-function), 13 Aug 2026
- [Use environment variables in code app data sources](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/use-environment-variables), 13 Aug 2026
- [Add Power Automate flows to a code app](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/add-flows), 13 Aug 2026
- [Connect to Copilot Studio](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/connect-to-copilot-studio), 13 Aug 2026
- [Configure Content Security Policy](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/content-security-policy), 7 Apr 2026
- [Power Apps CLI command reference](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/reference/cli), 2 Oct 2026
- [Use Microsoft Dataverse Web API functions](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/use-web-api-functions), 11 Jun 2026
- [Manage connections in canvas apps](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/add-manage-connections), 27 Aug 2025
- [Data policies](https://learn.microsoft.com/en-us/power-platform/admin/wp-data-loss-prevention), 14 Oct 2026
- [Power Apps licensing FAQs](https://learn.microsoft.com/en-us/power-platform/admin/powerapps-licensing-faq), 8 Oct 2026
- [Copilot Studio billing rates and management](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management), 30 Oct 2026

Other sources, read on 1 November 2026:

- [microsoft/PowerAppsCodeApps](https://github.com/microsoft/PowerAppsCodeApps), last changed 19 Oct 2026: the `PowerConfig` type in `samples/Dataverse/plugins/powerApps.ts`, and the generated `MicrosoftCopilotStudioService.ts` in `powercat/release-planner/` (autogenerated header, `operationName`, `.power/schemas/` import)
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
