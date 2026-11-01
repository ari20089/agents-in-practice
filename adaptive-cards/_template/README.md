# Your Card Title

## Summary

Two or three sentences on what the card shows, what it asks the user for, and what the host gets back. Say what it doesn't do, for example "it doesn't update itself after a response".

## What's in the folder

| File | What it's for | Where it goes |
|---|---|---|
| [`card.json`](./card.json) | The card template, schema version 1.5, with N `${...}` bindings | Pasted into the host, with the bindings replaced |
| [`data.json`](./data.json) | Made-up sample values for every binding | The Adaptive Cards Designer's sample data pane |

## The bindings

| Binding | What goes there | Sample |
|---|---|---|
| `${title}` | What to put there | The value in `data.json` |

## What comes back

| Field | Value |
|---|---|
| `actionSubmitId` | `your_card_submit` |
| `answer` | What the user typed |

## Use it

**Power Automate**

1. The action to add, and where to paste `card.json`.
2. How to replace the bindings with dynamic content.

**Copilot Studio**

1. The node to add, and how to replace the bindings with variables in **Formula** mode.

**A bot**

How to expand the template with the templating SDK, and how the response arrives.

Delete any host the card doesn't support.

## Prerequisites

- Host and licence requirements

## Limitations

- Host differences (versions, action styles, actions a host doesn't support), preview caveats, the documentation date relied on

## Sources

- [Page title](https://learn.microsoft.com/), DD Mon YYYY

## Contributors

| Name | Links |
| --- | --- |
| Your Name | [GitHub](https://github.com/your-handle) · [LinkedIn](https://www.linkedin.com/in/your-handle/) |

## Version history

| Version | Date | Comments |
| --- | --- | --- |
| 1.0 | Month YYYY | Initial release |

## Help

Adaptive Cards here are community samples without support. Search [existing issues](https://github.com/ari20089/agents-in-practice/issues) or [open a new one](https://github.com/ari20089/agents-in-practice/issues/new/choose).

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
