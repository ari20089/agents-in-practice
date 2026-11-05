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
| GitHub Copilot CLI | `.github/skills/<slug>/`, `.claude/skills/<slug>/` or `.agents/skills/<slug>/` in your repository, or `~/.copilot/skills/<slug>/` or `~/.agents/skills/<slug>/` for every project ([About agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills), read on 5 November 2026) |
| Copilot Studio, agents on the Microsoft Copilot harness | **Build** tab > **Skills** > **Add skill** > **Upload a skill**, then upload a `.zip` of the folder; it must include `SKILL.md` ([Add and manage an uploaded skill](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/skills-add-existing), 10 Sep 2026). Microsoft renamed the GitHub Copilot harness to the Microsoft Copilot harness on 28 October 2026 ([Copilot Studio blog](https://www.microsoft.com/en-us/copilot/blog/copilot-studio/the-github-copilot-harness-in-copilot-studio-is-now-the-microsoft-copilot-harness/)); Learn and the product may still show the old name |
| Copilot Studio, agents on the Customer Conversation harness | Uploading a skill isn't offered: Generative and Topic skills are "created directly from the **Add skill** dialog" ([Skills overview for agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/skills-overview), 19 Oct 2026) |
| Microsoft 365 Copilot, agents built in Agent Builder | **Configure** tab > **Skills** > **Add**, then upload a `.zip` with `SKILL.md` at its root; "Don't upload `SKILL.md` by itself". Up to 8 skills per agent, 50 MB per package, 350 files, directory depth 3, skill instructions under 20,000 characters. Needs a Microsoft 365 Copilot licence or pay-as-you-go; in tenants that use Information Barriers, users can't add skills ([Add skills in Agent Builder](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder-add-skills) and [Skills in declarative agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-skills), both 26 Oct 2026) |
| Microsoft 365 Copilot, agents built with Microsoft 365 Agents Toolkit | Add the skill directory to the agent project; "`.zip` isn't supported". Same limits, with the complete app package limited to 10 MB ([Skills in declarative agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-skills), 26 Oct 2026) |
| Copilot in SharePoint | Not an install target for these folders. Site skills are created through chat with the built-in **Create skill** capability and stored at `/Agent Assets/Skills/<skill-name>/SKILL.md`; skills "can't connect to external systems or execute custom code". Uploading a skill folder isn't documented as of 5 November 2026 ([Extend Copilot in SharePoint with skills](https://learn.microsoft.com/en-us/sharepoint/copilot-in-sharepoint-skills), 28 Sep 2026) |
| Any other Agent Skills host | Per the host's documentation; the folder layout is the standard one |

The `metadata.json` and `README.md` files are harmless if copied along but are not needed by the agent.

Each skill's page in the [gallery](https://ari20089.github.io/agents-in-practice/) offers a `<slug>.zip` with the files the agent loads and `SKILL.md` at its root, the shape Agent Builder documents. Upload it as it is to Agent Builder or to a Copilot Studio agent on the Microsoft Copilot harness, or unzip it into `.github/skills/<slug>/`.

## Contributing

See [`../CONTRIBUTING.md`](../CONTRIBUTING.md) for the submission shape and [`../SKILL-SCHEMA.md`](../SKILL-SCHEMA.md) for the `SKILL.md` structure. Run `node scripts/validate-skills.mjs` from the repo root before opening a pull request.
