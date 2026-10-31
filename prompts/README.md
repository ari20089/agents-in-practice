# Prompts

Every prompt in this catalog is a folder under `prompts/<slug>/`:

```
prompts/<slug>/
├── metadata.json     # catalog sidecar (people and tooling; never pasted)
├── README.md         # what it checks and how to run it (never pasted)
└── PROMPT.md         # the text you paste into chat, as is
```

`assets/` holds the gallery preview and anything else meant for people. `_template/` is a starting point for new prompts; the validator skips it.

## Using a prompt

| Tool | How |
| --- | --- |
| GitHub Copilot Chat in VS Code | In a Local session, paste `PROMPT.md` into chat, or save it as `.github/prompts/<slug>.prompt.md` and type `/<slug>` |
| Other Copilot chats | Paste `PROMPT.md`, then attach the files its README lists |

Each prompt's README gives the prompt file header and says what the prompt reads.

## Contributing

See [`../PROMPT-SCHEMA.md`](../PROMPT-SCHEMA.md) for the folder shape and limits, and [`../CONTRIBUTING.md`](../CONTRIBUTING.md) for how pull requests work. Run `npm test` from the repo root before opening a pull request.
