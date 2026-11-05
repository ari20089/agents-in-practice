# HVE Core Adoption Check

## Overview

Check whether HVE Core (Microsoft's Hypervelocity Engineering framework) fits this repository: which agents and instruction files fit its languages, and where its instructions clash with existing Copilot instructions. Read only: you MUST NOT change files, install anything or run commands that change state.

## Inputs

None: read the workspace. If you can't, ask me for the file list, Copilot instruction files, `LICENSE`, `.gitignore`, manifests and lint config.

## How instructions combine (as of 4 November 2026)

- Copilot combines every applicable source (`copilot-instructions.md`, `AGENTS.md`, matching `.instructions.md` files, user instructions) with no general precedence order, so contradictions aren't resolved for you.
- An `.instructions.md` file applies when the agent works with files matching its `applyTo`; one with only a `description` loads when relevant (Local sessions). None apply to inline suggestions.
- Instruction files in the repository also reach Copilot cloud agent, the Copilot CLI and code review on GitHub.com. Extension instructions reach only that user's VS Code.

## Where HVE Core comes from

- **`main`**: the Copilot CLI plugin, clones and submodules (VS Code settings only). Plugin instructions aren't auto-applied.
- **Marketplace extensions**, last published 25 April 2026 (Stable 3.2.2, pre-release 3.3.101), lag `main` and use older agent names (task-researcher, pr-review). **HVE Core**: RPI, Git, Markdown, writing-style, commit and merge instructions; **HVE Core - Coding Standards**: language instructions; **HVE Core - All**: everything. Instructions apply by `applyTo` in every workspace; files can't be edited, but an extension can be disabled per workspace.
- **Selective clone** (`hve-core-installer`): copies chosen files into the repository, where they can be edited.
- Agents write to `.copilot-tracking/`; HVE says to add it to `.gitignore`.

## Instruction files

`applyTo`: the rules most likely to clash. "main" marks what the extensions lack.

Language:
- `csharp`, `csharp-tests` (both `**/*.cs`): `net10.0`, file-scoped namespaces, `src/` with `*.Tests` projects; xUnit and NSubstitute (Moq only in existing projects).
- `uv-projects` (`**/*.py, **/*.ipynb`): uv and `.venv`, Python 3.11 default, always install pytest, ruff and more; main: never `pip install` (also in `python-script`). `python-script` (`**/*.py`): a Microsoft MIT header, Google docstrings. `python-tests` (`**/*.py`): pytest-mock.
- `rust`, `rust-tests` (`**/*.rs`): no `unwrap()` or `expect()` in production, Tokio, `tracing` not `println!`, mockall.
- `typescript-doc-comments` (main; `**/*.ts, *.tsx, *.mts, *.cts`): TSDoc on reusable APIs; nothing else for TypeScript.
- `powershell` (`**/*.ps1, *.psm1, *.psd1`), `pester` (`**/*.Tests.ps1`): the Microsoft header, `#!/usr/bin/env pwsh` on `.ps1`, Pester 5 (main: 6).
- `bash` (`**/*.sh`): the Microsoft header, 2-space indent, ShellCheck.
- `terraform` (`**/*.tf, *.tfvars, **/terraform/**`): kebab-case files, snake_case names, `//` comments, never `#`; main: `this` for a single resource.
- `bicep` (`**/*.bicep, *.bicepparam, **/bicep/**`): camelCase parameters, `@description()` on every parameter, no hard-coded names or locations.
- None for any other language, JavaScript included.

Repository-wide:
- `markdown` (`**/*.md`): YAML frontmatter on every Markdown file, one H1. `writing-style` (`**/*.md`): no em dashes, no bold-prefixed list items, no "This document explains".
- `commit-message` (description only): Conventional Commits, scope from the main directory, imperative mood.
- `git-merge` (description only): no force-push; no push without approval (extensions: never).
- `hve-builder` (extensions: `prompt-builder`), `content-policy-citation` (main), on `**/*.prompt.md, *.agent.md, *.instructions.md, SKILL.md`: HVE's rules for your own Copilot files.
- main: seven ADR and planning files on `**/docs/planning/adrs/**`, `vex-standards` on `**/security/vex/**`, `licensing-posture` on `**/skills/**`. The rest match only `.copilot-tracking/**` or HVE's own files.

Agents on main (29):
- Any code repository: RPI Agent, Code Review, Documentation, ADR Creator, System Architecture Reviewer, Security Planner and Reviewer, SSSC (supply chain) Planner and Reviewer.
- Need evidence: Accessibility Planner and Reviewer, UX UI Designer (a UI); Privacy Planner and Reviewer (personal data); RAI Planner and Reviewer (AI features); Data Science and Engineering Coach (notebooks); Network ISA-95 Planner (edge Kubernetes); Backlog Manager, Functional Planner (Azure DevOps, GitHub or Jira).
- Not tied to code: PRD and BRD Builders, Meeting Analyst, DT Coach and Learning Tutor, Engagement Report Generator; experimental: Experiment Designer, PowerPoint Builder, HVE Demo Material Builder.

## Workflow Steps

1. **Profile the repository.** Count source files by language, skipping dependencies and build output. Note package managers, test libraries, licence, commit conventions (config, `CONTRIBUTING.md`, recent commits), lint config, `.editorconfig`.
2. **List existing Copilot customization:** `.github/copilot-instructions.md` first, then `AGENTS.md` in any folder, `CLAUDE.md`, `.claude/rules`, and `.github/` `instructions`, `agents`, `prompts`, `skills`. If HVE files are present (`.hve-tracking.json` or the names above), compare against those copies.
3. **Match instructions.** Glob each HVE `applyTo` against the repository; count matches.
4. **Find conflicts** between each matching HVE file's rules and existing instructions, then code and config:
   - **Contradiction**: both can't be followed (frontmatter required vs forbidden; another commit format; another owner's licence header).
   - **Overlap**: same topic, compatible; duplicated guidance.
   - **Practice**: no instruction, but code or config consistently does otherwise (Moq, `pip`, `.editorconfig`).
5. **Match agents** to repository evidence.
6. **Pick an install route.** A Contradiction in an extension's file means not using, or disabling, that extension here.

## Output

Return exactly these sections:

**Verdict:** {Adopt as is | Adopt selectively | Agents only | Not a fit yet}, with one sentence why. As is: no Contradiction. Selectively: at least one matching instruction fits as is; leave out or edit the others. Agents only: nothing fits without edits. Not a fit yet: nothing matches.

**Repository profile:** languages (file counts), stack, licence, commit and Markdown conventions, Copilot files.

**Instruction fit**
| HVE instruction | `applyTo` | Matches (count, example path) | Fit (Fits, Fits after changes, Leave out) | Note |
Only files with matches, then the languages HVE doesn't cover.

**Conflicts** (Contradictions first, or "None found")
| # | HVE file and rule | Existing rule or practice (`path:line`, short quote) | Type | Effect in Copilot | Resolution |

**Agent fit**
| Agent | Fit (Recommended, Optional, Not relevant) | Evidence |
One row for agents not tied to code.

**Install recommendation:** route (extensions, CLI plugin, submodule or selective clone), files to include or leave out, reach (one user, or everyone via the repository), the `.gitignore` line, and the change resolving each Contradiction.

**Couldn't check:** steps skipped and why.

## Success Criteria

Every conflict cites `path:line` and names the HVE file; every fit rests on evidence.

## Error Handling

- You MUST NOT propose a rule telling Copilot to ignore HVE; nothing gives it precedence. Resolve at the source: leave out, disable or edit the HVE file, narrow its `applyTo`, or change the repository's rule.
- With no `copilot-instructions.md`, say so; conflicts then come from other instruction files and Practice.
- If unsure whether rules clash, call it Overlap and give a test: run a typical task and check the response's References (inclusion, not compliance).
- HVE Core evolves fast: if workspace HVE files differ from these facts, use them and say so.
