# Connector Call Wrapper Generator

## Summary

In a Power Apps code app, every data source the CLI adds becomes a generated model and service in `src/generated/`. Most projects then call those services straight from components, and each component re-implements the same loading flag, try/catch and "no records" check, slightly differently.

Those hand-written checks often share one bug. A failed call can come back as `success: false` instead of throwing, so a try/catch that only checks `result.data` shows a permissions error or a timeout as an empty list.

These agent instructions turn a coding agent into a generator for the layer that should sit in between. Name a Dataverse table, a connector operation, a Dataverse action or function, or a flow, and it writes:

- `src/data/dataResult.ts`, once: `run()`, which turns every call into `{ ok: true, data }` or `{ ok: false, error }`, plus helpers for OData quoting, changed-field updates, lookups and `{ value: [] }` responses;
- `src/data/useData.ts`, once: React hooks with **loading, error, empty and success** states, retry, "load more" paging, and protection against late responses;
- `src/data/<name>/`: a typed repository for the data source (selected columns, server-side filters, safe updates) and the hooks the screens use;
- a component example and, if the project has a test runner, tests.

It reads the generated files and uses their exact method names, so it never invents an API, and it never edits `src/generated/`, which the CLI regenerates.

Microsoft's code apps plugin for GitHub Copilot CLI and other coding agents has skills that add data sources (`add-dataverse`, `add-connector`, `add-sharepoint` and others). This agent picks up after that step and wraps what the CLI generated.

## What's in the folder

| File | What it's for | Where it goes |
|---|---|---|
| [`INSTRUCTIONS.md`](./INSTRUCTIONS.md) | The generator's behaviour: inputs, steps, the rules every call follows, and the output format. 6,086 of the 8,000 characters allowed. | The agent's instructions, pasted as is |
| [`knowledge/code-apps-data-reference.txt`](./knowledge/code-apps-data-reference.txt) | Reference data: generated file layout, service signatures by data source type, result and option types, documented data rules, unsupported scenarios, the wrapper templates, where Learn and the packages differ, open questions and sources | The agent's knowledge, or a file in the repository |

The templates in the knowledge file compile under TypeScript strict mode against `@microsoft/power-apps` 1.5.0, and their tests (success, `success: false`, a thrown error, empty results, stale responses and paging) pass.

## Set up

**Agent settings for any tool**

| Setting | Value | Why |
|---|---|---|
| Name | Connector Call Wrapper Generator | Agent Builder allows 30 characters; use "Code App Wrapper Generator" there |
| Description | Writes a typed data access layer with loading, error and empty states for a Power Apps code app's generated services. | |
| Knowledge | `code-apps-data-reference.txt` only | The generator copies its templates and cites its rules |
| Web search | Off | The rules and templates come from the knowledge file; people paste their generated code |
| Actions | None | It writes code; it doesn't call Power Platform |

**Conversation starters**

- *Wrap the accounts table for a searchable list with paging.*
- *Wrap Office 365 Users MyProfile_V2 for a profile header.*
- *I added an approval flow. Wrap its Run call with a saving state.*
- *Here's my generated service. What will you build?*

**GitHub Copilot (VS Code or Copilot cloud agent)**

This is where the generator works best: it reads `src/generated/` itself and writes the files into the project.

1. In the code app's repository, save the knowledge file as `.github/agents/code-apps-data-reference.txt`.
2. Create `.github/agents/connector-call-wrapper-generator.agent.md` with this header, then paste the contents of `INSTRUCTIONS.md` below it:

   ```markdown
   ---
   name: Connector Call Wrapper Generator
   description: Writes a typed data access layer with loading, error and empty states for a Power Apps code app's generated services.
   tools: ["read", "search", "edit"]
   ---
   ```

3. Select the agent in Copilot Chat and name the data source. Add `"execute"` to `tools` if you want it to run the build and tests itself.

**Copilot Studio**

1. Create an agent. On its **Overview** page, in the **Instructions** section, select **Edit** and paste `INSTRUCTIONS.md`.
2. Select **Add knowledge** and upload `code-apps-data-reference.txt`.
3. Turn off **Web Search** in the Knowledge section.
4. Users paste the generated `Service.ts`, `Model.ts` and `CommonModels.ts` files and get the wrapper files back.

**Agent Builder in Microsoft 365 Copilot**

1. Create an agent and paste `INSTRUCTIONS.md` into its instructions.
2. On the **Configure** tab, upload `code-apps-data-reference.txt` as knowledge, turn off **Search all websites**, and turn on **Only use specified sources**.
3. Users paste the generated files, as in Copilot Studio.

## Prerequisites

- A code app created with the Power Apps CLI (`pa`) and `@microsoft/power-apps` 1.0 or later; Dataverse actions and flows need 1.1.1 or later.
- The data source already added with `pa app add data-source`, `pa app add dataverse-api` or `pa app add flow`, so the generated files exist. If they don't, the agent gives the command and waits.
- A coding agent that can read the repository (GitHub Copilot), or a chat agent that the developer pastes the generated files into.
- The React templates assume React 18 or later. The repository and `run()` work with any framework.

## Limitations

- Written against 16 Microsoft Learn pages dated 5 March 2026 to 29 October 2026, all read on 31 October 2026, and against `@microsoft/power-apps` 1.5.0 and `@microsoft/power-apps-cli` 1.3.0. Generated code changes between CLI versions; the agent follows the generated file over the reference.
- Learn and the packages differ in places, including `getall` versus `getAll` and the generated folder names. The knowledge file lists each difference.
- Four questions aren't answered by the documentation, including whether the client library URL-encodes `filter` values. The agent names them instead of assuming.
- The wrapper pattern (state names, file layout, helpers) is this item's design, not Microsoft guidance.
- Review generated code like any other pull request. Test writes against a non-production environment first.

## Contributors

| Name | Links |
| --- | --- |
| Arindam Choudhury | [GitHub](https://github.com/ari20089) · [LinkedIn](https://www.linkedin.com/in/arindam-choudhury/) |

## Version history

| Version | Date | Comments |
| --- | --- | --- |
| 1.0 | October 2026 | Initial release |

## Help

Agent instructions here are community samples without support. Search [existing issues](https://github.com/ari20089/agents-in-practice/issues) or [open a new one](https://github.com/ari20089/agents-in-practice/issues/new/choose). For Microsoft product questions use Microsoft Learn or your Microsoft support channel.

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
