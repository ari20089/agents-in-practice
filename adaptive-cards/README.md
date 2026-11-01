# Adaptive Cards

Every Adaptive Card in this catalog is a folder under `adaptive-cards/<slug>/`:

```
adaptive-cards/<slug>/
├── metadata.json     # catalog sidecar (people and tooling; never pasted)
├── README.md         # what the card shows and how to use it in each host (never pasted)
├── card.json         # the card template you paste
└── data.json         # sample values for every ${...} binding in the card
```

`assets/` holds the gallery preview and anything else meant for people. `_template/` is a starting point for new cards; the validator skips it.

## Using a card

| Host | How |
| --- | --- |
| Power Automate | Paste `card.json` into a Microsoft Teams card action, and replace each `${...}` with dynamic content |
| Copilot Studio | Paste `card.json` into an Adaptive Card node, switch to **Formula** and replace each `"${...}"` with a variable |
| A bot | Expand `card.json` with your data using the Adaptive Cards templating SDK, then send it |
| Adaptive Cards Designer | Paste `card.json` and `data.json` and switch to preview mode, to see it without a host |

Each card's README gives the steps for each host it supports, every binding, and what comes back when the user submits.

## Contributing

See [`../ADAPTIVE-CARD-SCHEMA.md`](../ADAPTIVE-CARD-SCHEMA.md) for the folder shape and limits, and [`../CONTRIBUTING.md`](../CONTRIBUTING.md) for how pull requests work. Run `npm test` from the repo root before opening a pull request.
