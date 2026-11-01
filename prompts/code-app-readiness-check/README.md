# Code App Readiness Check

## Summary

Before a team turns an existing React or Vue app into a Power Apps code app, they ask the same question: will it work, and what has to change? This prompt answers it from the code. Paste it into GitHub Copilot Chat with the repository open, and Copilot reads the project and reports back:

- a **verdict**: Ready, Ready after fixes, Needs rework, or Not a fit;
- **findings** with the file and line, why each one matters in a code app, the fix and a rough effort;
- an ordered **fix list**, blockers first, with the files to change and the `pa` commands to run;
- a **connector map**: each external endpoint the app calls, and the connector or flow that replaces it;
- what to sort out **before the first push** that the code can't show (environment, licences, CSP), and a **test plan** for after it.

It only reads. It doesn't change files or run commands that change anything.

## What's in the folder

| File | What it's for | Where it goes |
|---|---|---|
| [`PROMPT.md`](./PROMPT.md) | The prompt: what a code app is, ten checks, severities, the report format and the rules. 7,996 of the 8,000 characters allowed. | Pasted into chat, as is |

## Run it

**GitHub Copilot Chat in VS Code**

1. Open the app's repository and start a chat session in the Chat view with the **Agent** control on Agent, so it can search the whole repository.
2. Paste the contents of `PROMPT.md` and send it.
3. If Copilot asks to run a terminal command, allow only read-only ones (such as listing files). The prompt doesn't need any.

To run it again with `/code-app-readiness-check`, save it as `.github/prompts/code-app-readiness-check.prompt.md` with this header above the prompt. Prompt files run only in Local harness sessions; in any other session, paste the prompt.

```markdown
---
description: Check whether this app can become a Power Apps code app, with a verdict and a fix list.
agent: agent
---
```

**GitHub Copilot CLI or another coding agent**

Start the agent in the repository's root and paste the prompt. It works the same way in any agent that can read the files.

**A chat that can't see the repository**

Paste the prompt and attach the files it asks for: `package.json`, the build config, `index.html`, the router, the names of any `.env*` files (not their contents), and the files that sign users in or call APIs. The report says which checks it couldn't run.

The prompt has no placeholders.

## What it checks

Each check rests on documented behaviour, stated in the prompt itself so the agent doesn't need current documentation:

| # | Check | What it flags | Basis |
|---|---|---|---|
| 1 | App shape | Server rendering, API routes or a server the UI depends on | Code apps "support single-page applications (SPAs)", and `pa app push` "takes a compiled app" (Architecture) |
| 2 | Build output | Output folder other than `dist`, entry other than `index.html`, root-absolute asset URLs | `pa app init` records the build folder and entry in `power.config.json`: `--build-path` defaults to `./dist` and `--file-entry-point` to `index.html` (CLI environment variables). Microsoft's Vite plugin sets `base: './'`, "Needed for publishing static assets correctly" (`@microsoft/power-apps-vite` 1.0.13 source). Under that plugin `import.meta.env.BASE_URL` is the literal `'./'`, which the browser resolves against the current route, so URLs built in code should use `new URL('./file.png', import.meta.url)`, which Vite rewrites at build time (Vite: Static Asset Handling). With webpack, `output.publicPath: 'auto'` works out the path at run time and is the default for web targets (webpack: Public Path) |
| 3 | Routing | History routers with no base; navigation that bypasses the router | Microsoft's starter template sets `basename: new URL(".", location.href).pathname`, "IMPORTANT: Set basename for proper routing when hosted in Power Apps" (`templates/starter/src/router.tsx`). For Vue, Vue Router says that when you deploy to a subfolder you should use "the `base` property of the router", and that hash mode "doesn't require any special treatment on the server level" (Vue Router: Different history modes) |
| 4 | Authentication | MSAL, OIDC and third-party sign-in, stored tokens, bearer headers | "The Power Apps host manages end-user authentication" (Architecture); key feature "Microsoft Entra authentication and authorization" (Overview); the user's identity comes from `getContext()` (Get context data). Default `connect-src 'none'` and `frame-src 'self'` block a library's token calls and sign-in iframes (Configure CSP) |
| 5 | Direct calls | `fetch`, `axios`, Graph and Web API clients, sockets | Default CSP `connect-src 'none'` (Configure CSP); data goes through "Power Platform data sources and 1,500+ connectors" (Overview); Excel Online connectors "aren't yet supported" (Connect to data); flows must be "solution-aware instant flows that use the Power Apps trigger" (Add flows); Dataverse actions via `pa app add dataverse-api` (CLI reference); the Copilot Studio connector for calls to an agent (Connect to Copilot Studio); custom connector over your own API, which the how-to leaves anonymous and tells you to "Secure your API if you move beyond development/testing" (Azure Functions how-to). One exception: a telemetry SDK such as Application Insights is Review, not Blocker, because Microsoft's documented fix is to "add the App Insights endpoints to your environment's CSP settings" (Set up Azure App Insights) |
| 6 | Offline and background work | Service workers, PWA manifest, Web Workers, cached records | Default `worker-src 'none'` and `manifest-src 'none'` (Configure CSP). Offline use isn't documented |
| 7 | Third-party resources | CDN scripts, web fonts, remote styles and images, cross-origin iframes, form posts | Default `script-src`, `font-src`, `style-src`, `img-src`, `media-src`, `frame-src` and `form-action` (Configure CSP) |
| 8 | Secrets and configuration | Keys and tokens in source or in `VITE_*`-style build variables | Assets are served "on a publicly accessible endpoint… Don't store sensitive user or organizational data in the app" (System configuration); `@envvar:` references (Use environment variables); for other per-environment values, "store values in Dataverse (for example, a settings table) or use getContext() to detect the environment" (Set up Azure App Insights) |
| 9 | Client library | Missing `@microsoft/power-apps`, leftover `initialize` calls | "Apps must no longer import or call `initialize`" (v1.0 migration guide) |
| 10 | Platform fit | Power Apps for Windows, SharePoint forms, Power BI data integration, Git integration, IP restriction, FetchXML, alternate keys, polymorphic lookups, embedding | Overview limitations; Connect to Dataverse; Embed in an iframe |

Two things the code can't show go into the report's **Before you push** list. Data access runs as each user: "End-users see consent dialog for connector permissions", and "Code apps don't yet support Secure Implicit Connections" (Overview). An app that reached its data with one shared key or service account must give every user access to each data source instead. The environment's data policy is enforced "during app launch" (Overview; Learn's page is now titled Data policies), so every connector in the connector map has to be allowed together; and flow callers need "the App Opener security role or an equivalent role" (Add flows).

CSP is set per environment by an admin, and "When you customize a directive, the values you supply are appended to the default value. If the default value is `'none'`, your custom values replace the default value" (Configure CSP). The prompt treats opening `connect-src` as an option to list, not the fix, because the change applies to every code app in the environment.

After the fixes, the [Connector Call Wrapper Generator](../../agent-instructions/connector-call-wrapper-generator/) writes a typed data layer over the connectors in the connector map.

## Prerequisites

- An existing single-page app: React, Vue or another framework, with any bundler. The checks are written with Vite, React Router and Vue Router in mind.
- GitHub Copilot Chat in VS Code with the Agent control on Agent, the GitHub Copilot CLI, or another coding agent that can read the repository.
- Nothing on Power Platform is needed to run the check. To act on it: an environment with code apps turned on, Node.js LTS, the Power Apps CLI (`npm install --global @microsoft/power-apps-cli`), and end users with Power Apps Premium, pay-as-you-go, an App Pass or auto-claim (Overview).

## Limitations

- Written against 18 Microsoft Learn pages dated 5 March 2026 to 14 October 2026, read on 31 October and 1 November 2026, and against Microsoft's code apps templates (last changed 1 July 2026) and `@microsoft/power-apps-vite` 1.0.13. Code apps change often; check the Sources before relying on a finding.
- Repositories created before the Power Apps CLI (`pa`) may still reference the earlier `pac code init`, `pac code run` and `pac code push` commands (the `@microsoft/power-apps-vite` README and Microsoft's templates README still show them). The prompt names only `pa`; the rename isn't documented on Learn as of 31 October 2026.
- It assumes the default CSP. If your environment's admin has changed it, some Must fix findings may already be allowed. Ask for the environment's CSP settings and compare.
- Some things aren't documented as of 31 October 2026, so the prompt says so instead of guessing: whether reloading a nested route works once hosted, and whether code apps work offline. Both go in the test plan. On the first, Vue Router's own page explains the risk: with history mode, "without a proper server configuration, the users will get a 404 error if they access `https://example.com/user/id` directly", and no code apps page says whether the host serves `index.html` for unknown paths. Hash mode avoids the question.
- Microsoft's routing and build fixes are for React and Vite. The Vue fix follows Vue Router's own subfolder guidance, and the webpack fix follows webpack's; neither comes from a Microsoft page.
- Two Learn pages disagree on environment variables. Set up Azure App Insights (5 March 2026) says "Environment variables aren't yet supported for code apps"; Use environment variables (13 August 2026) documents `@envvar:` references in `pa app add data-source`. The prompt uses `@envvar:` for data sources only.
- The library names in each check are examples, not a complete list. The agent can miss a hit, so treat the report as a first pass and run the test plan after the first push.
- Tried on two sample apps, run by a coding agent that could read the files: a React app with 15 planted problems (MSAL, Graph and API calls, a PWA plugin, a PDF.js worker, Google Fonts, a tag script, a key in `.env`, a `build` output folder, no router base) and a Vue app with 14 (Firebase sign-in, Supabase and axios calls, an offline queue in IndexedDB, a service worker and manifest, a Maps script, keys in `.env.production`, a leftover `initialize()`, a fixed `base`, no router base, anchors that bypass the router). It found all of them in both. Not yet run inside GitHub Copilot Chat itself.

## Sources

Microsoft Learn, with each page's `ms.date` when it was read on 31 October 2026:

- [Power Apps code apps overview](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/overview), 23 Sep 2026
- [Code apps architecture](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/architecture), 12 Aug 2026
- [Code apps system configuration](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/system-limits-configuration), 15 Sep 2026
- [Quickstart: Create a code app using the Power Apps CLI](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/create-an-app-from-scratch), 13 Aug 2026
- [Configure Content Security Policy](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/content-security-policy), 7 Apr 2026
- [Connect your code app to data](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/connect-to-data), 2 Oct 2026
- [Connect your code app to Dataverse](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/connect-to-dataverse), 14 Aug 2026
- [Add Power Automate flows to a code app](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/add-flows), 13 Aug 2026
- [Create a basic asset management API with Azure Functions](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/create-basic-asset-management-api-azure-functions), 5 Mar 2026
- [Get context data](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/retrieve-context), 2 Oct 2026
- [Use environment variables in code app data sources](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/use-environment-variables), 13 Aug 2026
- [Set up Azure App Insights for your code app](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/set-up-azure-app-insights), 5 Mar 2026
- [Embed a code app in an iframe](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/embed-iframe), 6 Mar 2026
- [Power Apps client library for code apps v1.0 migration guide](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/migrate-to-v1), 5 Mar 2026
- [Power Apps CLI environment variables](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/reference/environment-variables), 2 Oct 2026
- [Power Apps CLI command reference](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/reference/cli), 2 Oct 2026
- [Connect to Copilot Studio](https://learn.microsoft.com/en-us/power-apps/developer/code-apps/how-to/connect-to-copilot-studio), 13 Aug 2026
- [Data policies](https://learn.microsoft.com/en-us/power-platform/admin/wp-data-loss-prevention), 14 Oct 2026, read on 1 November 2026

Other sources, read on 31 October 2026:

- [microsoft/PowerAppsCodeApps templates](https://github.com/microsoft/PowerAppsCodeApps/tree/main/templates): `starter/src/router.tsx` (unchanged since 24 Oct 2025) and `vite/vite.config.ts` (5 Feb 2026); the templates folder was last changed 1 Jul 2026
- [@microsoft/power-apps-vite](https://www.npmjs.com/package/@microsoft/power-apps-vite) 1.0.13, published 2 Sep 2026: the plugin's `base` and dev server settings
- [Vite: Static Asset Handling, `new URL(url, import.meta.url)`](https://vite.dev/guide/assets#new-url-url-import-meta-url)
- [Vue Router: Different history modes](https://router.vuejs.org/guide/essentials/history-mode.html), last changed 14 Oct 2026
- [webpack: Public Path](https://webpack.js.org/guides/public-path/), last changed 8 Sep 2026
- [Use prompt files in VS Code](https://code.visualstudio.com/docs/copilot/customization/prompt-files), updated 28 Oct 2026

## Contributors

| Name | Links |
| --- | --- |
| Arindam Choudhury | [GitHub](https://github.com/ari20089) · [LinkedIn](https://www.linkedin.com/in/arindam-choudhury/) |

## Version history

| Version | Date | Comments |
| --- | --- | --- |
| 1.0 | October 2026 | Initial release |
| 1.1 | November 2026 | Uses "data policy", Power Platform's current term, instead of DLP |

## Help

Prompts here are community samples without support. Search [existing issues](https://github.com/ari20089/agents-in-practice/issues) or [open a new one](https://github.com/ari20089/agents-in-practice/issues/new/choose). For Microsoft product questions use Microsoft Learn or your Microsoft support channel.

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
