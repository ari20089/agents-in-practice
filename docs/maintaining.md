# Maintaining this repository

Notes for whoever holds the keys. Contributors don't need this; [CONTRIBUTING.md](../CONTRIBUTING.md) is for them.

## Repository settings that make the PR process real

The files in the repo describe the process; these settings enforce it. Set them once in **Settings** on GitHub.

### Branch protection for `main`

**Settings → Branches → Add branch ruleset** (or a classic branch protection rule) targeting `main`:

- Require a pull request before merging
  - Required approvals: 1
  - Dismiss stale approvals when new commits are pushed
  - Require review from Code Owners
- Require status checks to pass before merging
  - Require branches to be up to date before merging
  - Required checks: `Validate skills`, `One skill per PR`
- Require conversation resolution before merging
- Block force pushes
- Restrict deletions
- Do not allow bypassing the above settings (uncheck the admin bypass, so the maintainer goes through the same path)

The two check names are the `name:` values of the jobs in [`.github/workflows/validate-skills.yml`](../.github/workflows/validate-skills.yml). They only appear in the picker after the workflow has run at least once on `main`.

### Pull requests

**Settings → General → Pull Requests**:

- Allow squash merging only (uncheck merge commits and rebase merging)
- Default to pull request title for squash merge commit message
- Automatically delete head branches

### Security and issues

- **Settings → Code security → Private vulnerability reporting: Enable.** [`SECURITY.md`](../SECURITY.md) and the issue chooser both link to it; the link 404s until this is on.
- **Settings → General → Features**: Issues on, Discussions optional, Wiki off.
- **Settings → Actions → General**: Allow actions from GitHub and verified creators; Workflow permissions: read-only (the workflow sets `permissions: contents: read` itself, but the repo default should match).

### Labels

Create these so issue templates, Dependabot and triage line up: `bug`, `enhancement`, `dependencies`, `skill: <slug>` per skill as they arrive, `good first issue`, `needs-info`.

## Reviewing a pull request

CI covers layout and metadata. The review covers what CI cannot:

1. **Facts.** Open every Microsoft Learn page the skill cites. If the page's `ms.date` is newer than the date the skill quotes, ask for a re-verify. If a claim has no citation, ask for one.
2. **Agent-facing versus human-facing.** Setup narrative, credits and disclaimers belong in the skill's `README.md`; nothing a person wouldn't say to an agent belongs in `SKILL.md` or `references/`.
3. **Does it do what the description says.** Try the trigger phrases in at least one host, or ask the author for evidence that they did.
4. **Scripts.** If the skill ships `scripts/`, read them. No remote code execution, no writes outside the working directory, no elevated privileges without a note in the README.
5. **Secrets and identifiers.** None, even in examples.

Style, wording and heading choices are the author's. Don't comment on them. The bar for a comment is "must change before merge".

## Merging

Squash-merge with the PR title as the message. Bump `metadata.json` `updatedAt` on skill changes if the author didn't. After merge, confirm the root README catalog renders and the `Validate skills` badge is green.

## Adding a co-owner for a skill

When an external author contributes a skill they will keep maintaining, add a line to [`.github/CODEOWNERS`](../.github/CODEOWNERS) giving them ownership of their folder alongside the maintainer. They'll be auto-requested on future changes to it.

## Releasing

There are no releases. Each skill carries its own `version` and `updatedAt` in `metadata.json` and a version history table in its README. Hosts install skills by copying the folder from `main`.
