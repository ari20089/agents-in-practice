# Agent instructions

Every agent instructions item in this catalog is a folder under `agent-instructions/<slug>/`:

```
agent-instructions/<slug>/
├── metadata.json     # catalog sidecar (people and tooling; never added to the agent)
├── README.md         # setup for each tool (never added to the agent)
└── what you add to the agent:
    ├── INSTRUCTIONS.md   # pasted into the agent's Instructions field, as is
    └── knowledge/        # optional files uploaded as the agent's knowledge
```

`assets/` holds the gallery preview and anything else meant for people, such as an intake form. `_template/` is a starting point for new items; the validator skips it.

## Using an item

| Tool | Instructions | Knowledge files |
| --- | --- | --- |
| Agent Builder in Microsoft 365 Copilot | Paste `INSTRUCTIONS.md` into the agent's instructions | Upload on the **Configure** tab. Embedded file content "isn't supported in Microsoft 365 Government Community Cloud (GCC) environments", and uploaded files are stored "in the default geography of the tenant, not in the user's preferred data location (PDL)" ([Add knowledge sources to an agent in Agent Builder](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder-add-knowledge), 30 Sep 2026). In GCC, put the file in a SharePoint library the users can read and add it as SharePoint knowledge instead |
| Copilot Studio, agents on the standard harness | **Overview** page > **Instructions** > **Edit**, then paste; up to 8,000 characters ([Create and delete agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-first-bot), 31 Aug 2026) | **Add knowledge**, then upload ([Upload files as a knowledge source](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-add-file-upload), 29 Sep 2026) |
| Copilot Studio, agents on the Microsoft Copilot harness (formerly GitHub Copilot harness) | **Build** tab, **Instructions** section, then paste and **Save** ([Configure agent details and instructions](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/authoring-instructions), 23 Jun 2026). A character limit isn't documented as of 5 November 2026 | **Build** tab > **Knowledge** > **Add knowledge**, then drag the file into the upload area ([Add knowledge sources to an agent](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/knowledge-add-existing-copilot), 12 Oct 2026) |
| Microsoft 365 Agents Toolkit | The manifest's `instructions` property | An `EmbeddedKnowledge` capability. Microsoft's pages conflict: [Declarative agent schema 1.9](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-manifest-1.9) defines it (1 MB per file, 10 files), but [Add knowledge sources to your declarative agent](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/knowledge-sources) marks embedded file content as not available in Agents Toolkit (both 30 Sep 2026). Test it; if it fails, put the file in a SharePoint library the users can read and use the `OneDriveAndSharePoint` capability |

Each item's README lists the recommended settings, such as web search, actions and audience, and the conversation starters.

## Contributing

See [`../AGENT-INSTRUCTIONS-SCHEMA.md`](../AGENT-INSTRUCTIONS-SCHEMA.md) for the folder shape and limits, and [`../CONTRIBUTING.md`](../CONTRIBUTING.md) for how pull requests work. Run `npm test` from the repo root before opening a pull request.
