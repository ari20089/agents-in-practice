Check whether the web app in this repository can become a Power Apps code app, and tell me what to fix first. Read the code; don't change files or run commands that change anything.

If you can't read the workspace, ask me for `package.json`, the build config, `index.html`, the router, the `.env*` file names (not values) and the sign-in and API files, and say which checks you couldn't run.

## What a code app is
A single-page app compiled to static files. `pa app push` uploads the build output (by default `./dist` with entry `index.html`, set by `pa app init`). The Power Apps host serves it from a public endpoint, under a nested path, and signs users in with Microsoft Entra ID. The app reaches data only through Power Platform connectors, as each user, through the services that `pa app add data-source` generates and the Power Apps client library for code apps (`@microsoft/power-apps`).

Content Security Policy (CSP) is enforced by default. Defaults: `connect-src 'none'`, `worker-src 'none'`, `manifest-src 'none'`, `form-action 'none'`, `script-src 'self'` and `img-src 'self' data:` plus platform sources, `media-src 'self' data:`, `font-src 'self'`, `style-src 'self' 'unsafe-inline'`, `frame-src 'self'`, `frame-ancestors 'self' https://*.powerapps.com`. Only an admin can change them, for every code app in the environment.

## Checks
Search the whole repository, not only `src/`; record each hit's file and line.

1. **App shape.** Blocker: server rendering or server code the UI depends on (Next.js or Nuxt SSR, API routes, Express). Fix: a static single-page build, with server logic moved behind a custom connector, a Dataverse action or a flow.
2. **Build output.** Must fix: output folder isn't `dist` or entry file isn't `index.html`, unless `pa app init` was given `--build-path` or `--file-entry-point`; asset URLs are absolute to the site root. With Vite, add the `powerApps()` plugin from `@microsoft/power-apps-vite`, which sets `base: './'`. With webpack, keep `output.publicPath` `'auto'` (the default) or relative; flag `'/'`. Flag root URLs in code (`'/logo.png'`): use imports or `new URL('./logo.png', import.meta.url)`, not `import.meta.env.BASE_URL` (`'./'` under the plugin).
3. **Routing.** Must fix: a history-mode router with no base, so routes resolve against the domain root instead of the app's folder. React fix: `createBrowserRouter(routes, { basename: new URL(".", location.href).pathname })`, and strip a trailing `/index.html` from the address with `history.replaceState` first. Vue: the same base and `replaceState` step with `createWebHistory()`, or `createWebHashHistory()`. Flag navigation that bypasses the router (`window.location = '/...'`). Reloading a nested route isn't documented: put it in the test plan.
4. **Authentication.** Blocker: the app signs users in itself: MSAL, `oidc-client-ts`, Auth0, Firebase or Supabase auth, Auth.js, login pages, stored tokens, bearer headers. The host already signs users in, and default CSP blocks the token calls (`connect-src`) and sign-in iframes (`frame-src`). Fix: remove the flow; read the user with `getContext()` from `@microsoft/power-apps/app` (`user.fullName`, `user.userPrincipalName`, `user.systemUserId` and more); control access with app sharing and Dataverse security roles; put your own APIs behind an Entra OAuth custom connector.
5. **Direct calls.** Blocker: every network call that isn't a generated connector service: `fetch`, `axios`, `XMLHttpRequest`, GraphQL or Graph clients, Dataverse Web API or SharePoint REST URLs, Firebase or Supabase SDKs, WebSocket, SignalR. Default `connect-src 'none'` blocks them. Name a replacement for each: a standard connector (Office 365 Users for profiles, Copilot Studio for agent calls), native Dataverse (`pa app add data-source --connector dataverse --table <name>`), a Dataverse action (`pa app add dataverse-api`), a SharePoint or SQL connector table, a solution-aware instant flow with the Power Apps trigger, or a custom connector over your API. Excel Online connectors aren't supported yet. Opening `connect-src` to an origin is an option to list, never the fix. Exception: a telemetry SDK (Application Insights via `setConfig({ logger })`) is Review; the documented fix is an admin adding its endpoints to `connect-src`.
6. **Offline and background work.** Must fix: service workers and PWA setup (`vite-plugin-pwa`, Workbox), a web app manifest, and Web Workers (`new Worker`, or libraries that start one, such as PDF.js); default `worker-src` and `manifest-src` are `'none'`. Offline support isn't documented: a feature that assumes it or queues changes to sync later needs a design decision. Review: business records cached in `localStorage` or IndexedDB.
7. **Third-party resources.** Must fix: scripts from a CDN or a tag (analytics, chat widgets, maps), web fonts from a CDN, remote stylesheets, images, audio or video, iframes to other origins, native `<form action>` posts. Fix: install from npm and bundle, or put fonts and media in the build; otherwise an admin adds the origin.
8. **Secrets and configuration.** Blocker: keys, secrets, connection strings or tokens in source or in build-time variables (`VITE_*`, `REACT_APP_*`, `VUE_APP_*`, `NEXT_PUBLIC_*`); the compiled app is publicly hosted. Fix: move them behind a connector. For per-environment values, use `@envvar:` references in `pa app add data-source`, or a Dataverse settings table.
9. **Client library.** Note whether `@microsoft/power-apps`, `@microsoft/power-apps-vite` and `power.config.json` exist. Client library 1.0 removed `initialize`: flag any use. Never suggest editing generated files (`src/generated/`).
10. **Platform fit.** Flag needs code apps don't support: Power Apps for Windows, SharePoint forms integration, Power BI data integration (not embedding), Power Platform Git integration, IP restriction (use Conditional Access), Dataverse FetchXML, alternate keys, polymorphic lookups or table definition CRUD, scheduled or automated flows. Embedding elsewhere needs that origin in `frame-ancestors`; only same-tenant users can open it.

## Severity
- **Blocker**: the app can't work as a code app until this changes.
- **Must fix**: breaks under the default host or CSP; contained.
- **Review**: may work; say what to test.

## Report
1. **Verdict**: Ready (nothing above Review), Ready after fixes (Must fix only), Needs rework (any Blocker) or Not a fit (a core need isn't supported or documented, such as offline-first use), with a sentence on why.
2. **Stack**: framework, bundler, router, build command and output, sign-in library, HTTP clients.
3. **Findings**: a table with #, Area, Severity, Evidence (`path:line` and the code), Why, Fix, Effort (S, M, L), in check order; "Not found" for a check with no hits.
4. **Fix list**: numbered, Blockers first, build and routing before data calls; each step names files to change and any `pa` command.
5. **Connector map**: each external endpoint → the replacement, and what to confirm.
6. **Before you push**: code apps turned on for the environment; users licensed (Power Apps Premium, pay-as-you-go, an App Pass or auto-claim); the data policy allows every mapped connector together; every user has access to each data source (data runs as the user, with a consent dialog; no Secure Implicit Connections; flows need the App Opener security role); CSP changes still needed.
7. **Test plan after the first push**: open every route and reload a nested one, run each data call, watch the console for CSP violations, and run it as a user without maker rights.

## Rules
- Every finding needs evidence from this repository. A package in `package.json` that the code never uses is Review, not Blocker.
- Never suggest calling an API around a connector, turning off CSP, or editing generated files.
- If unsure whether something works, mark it Review and say how to test it.
- If you find a secret, give its file and line, never the value. Don't copy real IDs or tenant names into the report.
