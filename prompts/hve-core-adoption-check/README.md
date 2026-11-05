# HVE Core Adoption Check

## Summary

[HVE Core](https://github.com/microsoft/hve-core) (Hypervelocity Engineering) is Microsoft's framework of agents, instruction files and skills for GitHub Copilot. A team adding it to a repository that already has a `.github/copilot-instructions.md` has two questions: which parts fit our code, and where will HVE's instructions fight ours? Copilot combines every applicable instruction source without a general precedence order, so a contradiction between HVE and the repository's own rules isn't settled for you; Copilot gets both.

Which HVE you get also depends on how you install it. As of 4 November 2026, the Copilot CLI plugin tracks HVE Core's `main` branch, while the Visual Studio Marketplace extensions were last published on 25 April 2026, are split into collections, and use older agent names. The language rules live in **HVE Core - Coding Standards** or **HVE Core - All**, not in the extension called **HVE Core**.

Paste this prompt into GitHub Copilot Chat with the repository open, and Copilot reads the code and its Copilot files and reports back:

- a **verdict**: Adopt as is, Adopt selectively, Agents only, or Not a fit yet;
- a **repository profile**: languages, stack, licence, commit and Markdown conventions, and the Copilot customization already there;
- **instruction fit**: each HVE instruction file whose `applyTo` pattern matches files in the repository, with the count and an example path, and the repository's languages HVE doesn't cover;
- **conflicts**: each HVE rule against the existing rule or practice it meets, with the repository side as `path:line`, typed as a Contradiction, an Overlap or a Practice conflict, and a resolution at the source;
- **agent fit**: each HVE agent as Recommended, Optional or Not relevant, with the evidence;
- an **install recommendation**: which extensions, the CLI plugin, a submodule or a selective clone; which files to include or leave out; whether the result reaches one developer or everyone through the repository; the `.gitignore` line HVE needs; and the change that resolves each Contradiction.

It only reads. It doesn't install HVE Core, change files or run commands that change anything.

## What's in the folder

| File | What it's for | Where it goes |
|---|---|---|
| [`PROMPT.md`](./PROMPT.md) | The prompt: how instructions combine, where HVE Core comes from, its instruction files with the rules most likely to clash, its agents, the steps, the report format and the rules. 7,993 of the 8,000 characters allowed, so trim before adding to it. | Pasted into chat, as is |
| [`assets/preview.png`](./assets/preview.png) | The gallery image: what the prompt compares, the four install routes, how it decides, and a condensed version of the report from the second test run on the sample repository described under Limitations | For people only |

## Run it

**GitHub Copilot Chat in VS Code**

1. Open the repository. In the Chat view, start a **Local** session and leave the **Agent** control on Agent, so it can search the whole repository.
2. Paste the contents of `PROMPT.md` and send it.
3. If Copilot asks to run a terminal command, allow only read-only ones (such as `git log` to read recent commit subjects).

Run it before installing any HVE extension if you can. Once one is installed, its instructions also apply in the session; the **HVE Core** extension's Markdown, writing-style and commit rules apply to this very task. To check a repository with an HVE extension already installed, disable the extension for that workspace first.

To run it again with `/hve-core-adoption-check`, save it as `.github/prompts/hve-core-adoption-check.prompt.md` with this header above the prompt. Prompt files run only in Local harness sessions; in any other session, paste the prompt.

```markdown
---
description: Check which HVE Core agents and instructions fit this repository and where they conflict with its Copilot instructions.
agent: agent
---
```

**GitHub Copilot CLI or another coding agent**

Start the agent in the repository's root and paste the prompt. It works the same way in any agent that can read the files.

**A chat that can't see the repository**

Paste the prompt and attach the file list (with extensions), `.github/copilot-instructions.md`, any `AGENTS.md`, `CLAUDE.md`, `.claude/rules/` and `.github/instructions/*.instructions.md` files, `LICENSE`, `.gitignore`, the package manifests and any commit or lint config. The report says which steps it couldn't run.

The prompt has no placeholders.

## What it checks

The prompt states the facts below so the agent doesn't need HVE Core installed or current documentation. HVE Core's `main` was read at commit `5867249` (4 November 2026) and re-checked on 5 November 2026 at three later commits: `ad69514` changed no agents, instructions or `plugin.json`; `8931ffb` added one line about table delimiter rows to `markdown.instructions.md` and changed no rule the prompt states; `be6ab37` moved `pester.instructions.md` from Pester 5.x to 6.x, which the prompt now states. The Marketplace releases were read from the tags `hve-core-v3.2.2` (23 March 2026) and `hve-core-v3.3.101` (committed 24 April 2026, released and published to the Marketplace 25 April 2026, UTC) and from the Marketplace listings.

| What the prompt says | Basis |
|---|---|
| Copilot combines instruction sources with no general precedence order | "There is no precedence rule that applies across all harnesses"; "Copilot combines applicable user and repository instructions without a general precedence order between instruction files"; Local: "Avoid contradictory rules rather than relying on their order" (Custom instructions reference). HVE Core's instructions page agrees: "Applicable instruction sources are additive, and no source outranks another" (Customizing with Instructions) |
| Resolve at the source, never with a rule telling Copilot to ignore HVE | "Don't rely on a universal precedence order", "remove or narrow the conflicting personal rule", "Don't add another rule to compensate" (Custom instructions) |
| How an `.instructions.md` file applies; description-only files; inline suggestions | `applyTo` matches "files the agent works with"; "In Local sessions, a `description` lets the agent decide whether to read an instructions file for the task"; custom instructions "don't apply to inline suggestions as you type" (Custom instructions; Custom instructions reference) |
| What it inventories: `AGENTS.md` in any folder, `CLAUDE.md`, `.claude/rules` | Copilot discovers `AGENTS.md` at the repository root, in the working directory and intermediate directories, and along the paths to files it works with; Local checks "the workspace-root `CLAUDE.md`, `.claude/CLAUDE.md`" and reads Markdown files in `.claude/rules` (Custom instructions reference). GitHub's support table also lists `GEMINI.md` as agent instructions for Copilot cloud agent and the Copilot CLI, and `REVIEW.md` for Copilot code review on GitHub.com (Support for different types of custom instructions); the prompt doesn't inventory either |
| Repository instruction files reach Copilot cloud agent, the CLI and code review on GitHub.com; an extension reaches one user's VS Code | The support table lists repository-wide and path-specific instructions as supported by Copilot code review on GitHub.com, Copilot cloud agent and Copilot CLI (Support for different types of custom instructions). VS Code says to "share project instructions through source control" (Custom instructions). An extension is installed per user; that it reaches only that user's VS Code is this prompt's inference |
| `main` is what the CLI plugin gets; its instructions aren't auto-applied | The plugin registration "tracks `main`" (HVE Core Identity and Channels); "Instruction files in plugin directories are **not** auto-applied via `applyTo` pattern matching" (Copilot CLI Plugin) |
| Marketplace extensions: dates, versions, collections, older agent names | Visual Studio Marketplace version history for `ise-hve-essentials.hve-core`, `hve-coding-standards` and `hve-core-all`: latest Stable 3.2.2 (23 March 2026), latest pre-release 3.3.101 (25 April 2026). The **HVE Core** listing shows 17 agents (`task-researcher`, `task-planner`, `pr-review` and others), 15 prompts and 7 instructions (`commit-message`, `git-merge`, `markdown`, `prompt-builder`, `pull-request`, `writing-style`, `hve-core-location`). The **HVE Core - Coding Standards** listing shows the language instructions for Bash, Bicep, C#, PowerShell, Python, Rust and Terraform, and three code review agents. **HVE Core - All** is the "Full bundle of all stable HVE Core agents, prompts, instructions, and skills" |
| Extension instructions apply by `applyTo`; files can't be modified; an extension can be disabled per workspace | The extension contributes its instructions through VS Code's `chatInstructions` contribution point (HVE Core's packaging scripts). After installing, "Instructions apply to matching files through their `applyTo` patterns" (HVE Core Identity and Channels); cons: "Can't modify custom agents, skills, or instructions" (VS Code Extension Installation). "You can disable an extension globally or only for your current Workspace" (Extension Marketplace). No VS Code page documents turning off one extension-contributed instruction |
| Submodules and clones: VS Code settings only | HVE Core's decision matrix recommends a [Submodule](https://github.com/microsoft/hve-core/blob/main/docs/getting-started/methods/submodule.md) for teams that want controlled updates, and a Peer Directory Clone for a solo developer (Installing HVE Core). With a submodule, "Every team member gets the exact same version, and updates are explicit commits", and `.vscode/settings.json` points `chat.instructionsFilesLocations` at whole HVE folders such as `lib/hve-core/.github/instructions/coding-standards` (Git Submodule Installation); a peer clone does the same with `../hve-core` paths (Peer Directory Clone Installation). VS Code says the setting "remains supported" and that "GitHub Copilot CLI and the GitHub Copilot app don't inherit editor settings" (Custom instructions reference). Whether Copilot cloud agent and code review on GitHub.com read instructions from a submodule's folders isn't documented as of 5 November 2026. HVE's other settings-based methods (git-ignored folder, Codespaces, multi-root workspace, mounted directory) work the same way; the prompt calls them clones. Read at `main` commit `8931ffb` on 5 November 2026 |
| Selective clone | "Teams that need a repository-owned subset can use `hve-core-installer`"; it "can copy agents, instructions, and complete skill directories" and records the result in `.hve-tracking.json` (Installing HVE Core) |
| `.copilot-tracking/` | HVE Core agents "create ephemeral workflow artifacts in a `.copilot-tracking/` folder within your project. Add this line to your project's `.gitignore`" (VS Code Extension Installation) |
| Language instructions, their `applyTo` and what "main" marks | The frontmatter and rules of each file under `.github/instructions/coding-standards/` on `main` and at `hve-core-v3.3.101`. The rules named are the ones most likely to clash, not every rule: the files run from 116 to 675 lines. Same in both: the `applyTo` patterns, `net10.0` and xUnit with NSubstitute (`csharp-tests` applies to every `.cs` file, not only tests), uv and `.venv` with Python 3.11 and an "Always Install" list, a Microsoft Corporation copyright and "SPDX-License-Identifier: MIT" header for Python, PowerShell and Bash (worded "Copyright (c) Microsoft Corporation." in the releases and in Bash on `main`, and "Copyright (c) 2026 Microsoft Corporation. All rights reserved." for Python and PowerShell on `main`), "Use 2 spaces for indentation" in Bash, "Do not use `#` for comments" in Terraform. Only on `main`: "Never use `pip install` directly", Terraform's `"this"` naming, `typescript-doc-comments`, and "Pester 6.x is the testing framework" (the releases say "Pester 5.x") |
| No JavaScript, Java, Go and other language instructions | No instruction file on `main` or in the releases targets them |
| Repository-wide instructions | `markdown` ("All markdown files MUST include YAML frontmatter"; the prompt's "one H1" simplifies "Do NOT use an H1 heading when YAML frontmatter contains a `title:` field… If no frontmatter exists, begin the file with a top-level heading"), `writing-style` ("Do not use em dashes", bolded-prefix list items, "This document explains"), `commit-message` ("Use Conventional Commit Messages"), the same in both. `git-merge`: on `main`, pushes need explicit authorization; in the releases, "Never push, force-push, or rewrite remote history on behalf of the user". `hve-builder` on `main` is `prompt-builder` in the releases, with the same `applyTo`; `content-policy-citation` is `main` only. The extensions also carry `shared/hve-core-location` with `applyTo: "**"`, which tells Copilot where to look when a referenced HVE file is missing; it applies to every file but states no coding rule, so the prompt leaves it out. **HVE Core - All** also carries `shared/story-quality` (work item story conventions) with `applyTo: '**/*.agent.md, **/.github/instructions/ado/**'`, so it reaches the repository's own custom agents; the prompt doesn't name it |
| Other `applyTo` patterns that can match an ordinary repository | On `main`, seven files match `**/docs/planning/adrs/**`: the four ADR Creator files plus `disclaimer-language`, `telemetry-overlay` and `untrusted-content-boundary`. `vex-standards` matches `**/security/vex/**` and `licensing-posture` matches `**/skills/**`. `content-policy-citation` also matches `**/.github/workflows/*.md`, `**/.github/workflows/**/*.md` and `**/.github/hooks/**`, which the prompt leaves out. `disclaimer-language` also matches `**/docs/planning/outcome-hypotheses/**`, and two engagement-reporting files match `**/engagement.yaml`, the Engagement Report Generator's own configuration file; the prompt counts that file as one of HVE's own. Every other distributed file matches only `.copilot-tracking/` paths or HVE Core's own folders and files (`plugin.json`, read 4 November 2026 and re-checked at `be6ab37` on 5 November 2026) |
| 29 agents on `main` and how they fit | The non-subagent entries in `plugin.json` and each agent's description. Grouping them by the evidence they need (a UI, personal data, AI features, notebooks, a backlog) is this prompt's own judgement, not HVE Core's |
| Checking a test result with References | "Check the response's References section, where available, for the instructions file"; it "helps check inclusion, not compliance" (Custom instructions) |

How it decides: an HVE rule that can't be followed alongside an existing rule is a **Contradiction**; the same topic with compatible rules is an **Overlap**; a rule no instruction states but the code or config consistently breaks is a **Practice** conflict. The verdict is Adopt as is with no Contradiction, Adopt selectively when at least one matching instruction fits as is, Agents only when nothing fits without edits, and Not a fit yet when nothing matches. A Contradiction in an extension's file means not using that extension, or disabling it for the workspace, because its files can't be modified. Otherwise the resolution is at the source: leave out or edit the HVE file in a selective clone, drop its folder from a submodule's settings, narrow its `applyTo`, or change the repository's own rule.

## Prerequisites

- GitHub Copilot Chat in VS Code with the Agent control on Agent, the GitHub Copilot CLI, or another coding agent that can read the repository.
- Nothing from HVE Core is needed to run the check. To act on it, one of:
  - a VS Code extension from the Visual Studio Marketplace: `ise-hve-essentials.hve-core` (core), `ise-hve-essentials.hve-coding-standards` (language instructions), `ise-hve-essentials.hve-core-all` (everything stable), or another collection;
  - the Copilot CLI plugin: `copilot plugin marketplace add microsoft/hve-core`, then `copilot plugin install hve-core@hve-core`;
  - a git submodule (or peer clone) of `microsoft/hve-core`, with `.vscode/settings.json` pointing VS Code at its folders;
  - the `hve-core-installer` skill for a selective clone into the repository.

## Limitations

- **HVE Core's documentation and the Marketplace disagree.** HVE Core's install pages on `main` (7 to 28 October 2026) describe one extension, `ise-hve-essentials.hve-core`, with "the complete active HVE Core component set". As of 4 November 2026 the Visual Studio Marketplace still lists the collection extensions, all last published on 25 April 2026, and the **HVE Core** extension holds only the core collection. The prompt describes both. When HVE Core publishes the consolidated extension, update the "Where HVE Core comes from" section.
- **Agent names differ by route.** The 29 agents the prompt names are `main`'s. The extensions use older names (`task-researcher`, `task-planner`, `pr-review`, `code-review-full` and others), and the prompt doesn't map them one to one. Its instruction facts mark what the extensions lack; the Stable 3.2.2 extensions also lack `python-tests`.
- HVE Core calls itself "a highly opinionated, rapidly evolving agentic SDLC framework", "best treated as a source of patterns and learning rather than a stable platform, foundation, or production dependency". If HVE files are already in the workspace, the prompt compares against those instead of its own facts.
- HVE Core's own pages disagree on precedence. Its Team Adoption and Governance page (7 October 2026) says "`copilot-instructions.md` highest-priority rules override everything" and "More specific `applyTo` patterns take precedence over broader ones". Its later instructions page (26 October 2026) says "no source outranks another", and VS Code's reference (4 November 2026) says there is no general precedence order. The prompt follows the later two.
- The prompt names the rules most likely to clash, not every rule in the instruction files, so it can miss a conflict with a less prominent rule. Read the HVE file behind each Fits row before adopting it.
- These aren't documented as of 4 November 2026: whether extension-contributed instructions apply in Copilot harness sessions as well as Local ones; how the Copilot harness treats an instruction file with only a `description`; and whether one extension-contributed instruction can be turned off. VS Code's settings switch whole sources (such as `chat.includeApplyingInstructions`), not single files.
- It reads only the repository. User and organization instructions also combine with HVE's in a session, and it can't see them.
- It doesn't assess HVE Core's skills, only its agents and instructions.
- Tried in two rounds on one sample repository, each run by a coding agent given only the prompt and the files, not inside GitHub Copilot Chat itself. The sample was a Python API with a notebook, a React form, Terraform and a Bash script. Its `copilot-instructions.md` called for Poetry, `unittest`, a Contoso Apache-2.0 header, no Markdown front matter, ticket-key commits, Python 3.12 and type hints, and it had `#` comments in Terraform and a 4-space `.editorconfig` for shell. Both rounds found 9 of the 10 planted issues: uv against Poetry, pytest against `unittest`, the Microsoft MIT header in both Python and Bash, front matter, Conventional Commits, Python 3.11 against 3.12 (as an Overlap), `#` comments, the indent, uncovered JavaScript and the missing `.copilot-tracking/` line. Both missed the type hints Overlap, because the prompt doesn't list HVE's type-hint rule. Both matched agents to evidence: Privacy for a stored customer email, RAI for an OpenAI call, Accessibility for the form. Round one ran before this review. Its verdict was Agents only, and it filed the indent clash under a type the prompt doesn't define. Round two ran the reviewed prompt and answered Adopt selectively (`writing-style` and `git-merge` fit as is). It filed the indent clash as Practice, said which Marketplace extension carries each clashing file, and said a committed clone reaches Copilot cloud agent and code review on GitHub.com. It attributed the pytest install rule to the wrong Python file, because the prompt then grouped the three Python files' rules; the prompt now lists each file's rules separately. That change hasn't been re-run.

## Sources

VS Code documentation, with the date each page showed when read on 4 November 2026:

- [Custom instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions), 4 Nov 2026
- [Custom instructions reference](https://code.visualstudio.com/docs/agents/reference/custom-instructions-reference), 4 Nov 2026: "Combine instruction sources", the settings and the instruction locations for each harness
- [Extension Marketplace](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace), 4 Nov 2026: disabling an extension for a workspace
- [Use prompt files in VS Code](https://code.visualstudio.com/docs/agent-customization/prompt-files), 4 Nov 2026, read on 5 November 2026

GitHub documentation, read on 4 November 2026:

- [Support for different types of custom instructions](https://docs.github.com/en/copilot/reference/custom-instructions-support), no date shown: which Copilot features read repository-wide, path-specific and agent instructions

Visual Studio Marketplace, read on 4 November 2026 (listings and version history):

- [HVE Core](https://marketplace.visualstudio.com/items?itemName=ise-hve-essentials.hve-core), 3.3.101 pre-release (25 Apr 2026), 3.2.2 Stable (23 Mar 2026)
- [HVE Core - Coding Standards](https://marketplace.visualstudio.com/items?itemName=ise-hve-essentials.hve-coding-standards), same versions and dates
- [HVE Core - All](https://marketplace.visualstudio.com/items?itemName=ise-hve-essentials.hve-core-all), same versions and dates

HVE Core ([microsoft/hve-core](https://github.com/microsoft/hve-core), MIT licence), `main` read at commit `5867249` on 4 November 2026 and re-checked at `8931ffb` and `be6ab37` on 5 November 2026, with each page's `ms.date`:

- [Customizing with Instructions](https://github.com/microsoft/hve-core/blob/main/docs/customization/instructions.md), 26 Oct 2026
- [Team Adoption and Governance](https://github.com/microsoft/hve-core/blob/main/docs/customization/team-adoption.md), 7 Oct 2026
- [Installing HVE Core](https://github.com/microsoft/hve-core/blob/main/docs/getting-started/install.md), 28 Oct 2026
- [HVE Core Identity and Channels](https://github.com/microsoft/hve-core/blob/main/docs/getting-started/packages.md), 7 Oct 2026
- [VS Code Extension Installation](https://github.com/microsoft/hve-core/blob/main/docs/getting-started/methods/extension.md), 7 Oct 2026
- [Copilot CLI Plugin](https://github.com/microsoft/hve-core/blob/main/docs/getting-started/methods/cli-plugins.md), 7 Oct 2026
- [Git Submodule Installation](https://github.com/microsoft/hve-core/blob/main/docs/getting-started/methods/submodule.md), 7 Oct 2026, read at `8931ffb` on 5 November 2026
- [Peer Directory Clone Installation](https://github.com/microsoft/hve-core/blob/main/docs/getting-started/methods/peer-clone.md), 7 Oct 2026, read at `8931ffb` on 5 November 2026
- The other settings-based method pages, each setting `chat.instructionsFilesLocations`, read at `8931ffb` on 5 November 2026: [Git-Ignored Folder](https://github.com/microsoft/hve-core/blob/main/docs/getting-started/methods/git-ignored.md) (7 Oct 2026), [GitHub Codespaces](https://github.com/microsoft/hve-core/blob/main/docs/getting-started/methods/codespaces.md) (2 Oct 2026), [Multi-Root Workspace](https://github.com/microsoft/hve-core/blob/main/docs/getting-started/methods/multi-root.md) (7 Oct 2026), [Mounted Directory](https://github.com/microsoft/hve-core/blob/main/docs/getting-started/methods/mounted.md) (7 Oct 2026)
- [Agent Systems Catalog](https://github.com/microsoft/hve-core/blob/main/docs/agents/README.md), 7 Oct 2026
- [Contributing Prompts to HVE Core](https://github.com/microsoft/hve-core/blob/main/docs/contributing/prompts.md), 7 Oct 2026: the section names the prompt uses (Overview, Inputs, Workflow Steps, Success Criteria, Error Handling)
- [`plugin.json`](https://github.com/microsoft/hve-core/blob/main/plugin.json): the distributed agents and instruction files (`main` keeps the version at 3.2.2; it isn't a release target)
- [`.github/instructions/`](https://github.com/microsoft/hve-core/tree/main/.github/instructions), undated: each instruction file's `applyTo` and rules
- [`.github/agents/`](https://github.com/microsoft/hve-core/tree/main/.github/agents), undated: each agent's name and description
- [`scripts/extension/`](https://github.com/microsoft/hve-core/tree/main/scripts/extension), undated: the `chatInstructions` contribution
- Release tags [`hve-core-v3.2.2`](https://github.com/microsoft/hve-core/tree/hve-core-v3.2.2) (23 Mar 2026) and [`hve-core-v3.3.101`](https://github.com/microsoft/hve-core/tree/hve-core-v3.3.101) (committed 24 Apr 2026, released 25 Apr 2026 UTC): the instruction files the extensions were built from

## Contributors

| Name | Links |
| --- | --- |
| Arindam Choudhury | [GitHub](https://github.com/ari20089) · [LinkedIn](https://www.linkedin.com/in/arindam-choudhury/) |

## Version history

| Version | Date | Comments |
| --- | --- | --- |
| 1.0 | November 2026 | Initial release |
| 1.1 | November 2026 | Adds the submodule route (VS Code settings only) from HVE Core's install decision matrix, and Pester 6 on `main`. Also corrects the `applyTo` matches, the H1 rule, the licence header wording and the tag dates, and notes `GEMINI.md` and `REVIEW.md`. |

## Help

Prompts here are community samples without support. Search [existing issues](https://github.com/ari20089/agents-in-practice/issues) or [open a new one](https://github.com/ari20089/agents-in-practice/issues/new/choose). For HVE Core questions use its own repository; for GitHub Copilot questions use GitHub's documentation or your support channel.

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
