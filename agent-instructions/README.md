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
| Agent Builder in Microsoft 365 Copilot | Paste `INSTRUCTIONS.md` into the agent's instructions | Upload on the **Configure** tab |
| Copilot Studio | **Overview** page > **Instructions** > **Edit**, then paste | **Add knowledge**, then upload |
| Microsoft 365 Agents Toolkit | The manifest's `instructions` property | An `EmbeddedKnowledge` capability |

Each item's README lists the recommended settings, such as web search, actions and audience, and the conversation starters.

## Contributing

See [`../AGENT-INSTRUCTIONS-SCHEMA.md`](../AGENT-INSTRUCTIONS-SCHEMA.md) for the folder shape and limits, and [`../CONTRIBUTING.md`](../CONTRIBUTING.md) for how pull requests work. Run `npm test` from the repo root before opening a pull request.
