# Skills

Every skill in this catalog is a folder under `skills/<slug>/`:

```
skills/<slug>/
├── metadata.json     # catalog sidecar (people and tooling; never loaded by the agent)
├── README.md         # human-facing overview (never loaded by the agent)
└── the skill itself (agent-facing, loaded verbatim):
    ├── SKILL.md      # frontmatter (name + description) + instructions
    ├── references/   # optional docs the agent reads on demand
    ├── scripts/      # optional executable helpers
    └── assets/       # optional templates and data files
```

`_template/` is a starting point for new skills; it is skipped by the validator.

## Installing a skill

Copy the **whole folder** so the agent gets the `references/` the instructions point to. The host discovers the skill by the `name` field in `SKILL.md`.

| Host | Where to put it |
| --- | --- |
| GitHub Copilot in VS Code | `.github/skills/<slug>/` in your repository |
| GitHub Copilot CLI | `.github/skills/<slug>/` or your agent's configured skills directory |
| Copilot Studio (Microsoft Copilot harness, formerly GitHub Copilot harness) | Add as a skill to the agent per the Copilot Studio documentation for skills |
| Microsoft 365 Copilot / Copilot in SharePoint | Upload the folder to the site's **Agent Assets** library, **Skills** folder |
| Any other Agent Skills host | Per the host's documentation; the folder layout is the standard one |

The `metadata.json` and `README.md` files are harmless if copied along but are not needed by the agent.

## Contributing

See [`../CONTRIBUTING.md`](../CONTRIBUTING.md) for the submission shape and [`../SKILL-SCHEMA.md`](../SKILL-SCHEMA.md) for the `SKILL.md` structure. Run `node scripts/validate-skills.mjs` from the repo root before opening a pull request.
