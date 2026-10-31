# Your Prompt Title

## Summary

Two or three sentences on the question the prompt answers, who runs it, and what they get back.

## What's in the folder

| File | What it's for | Where it goes |
|---|---|---|
| [`PROMPT.md`](./PROMPT.md) | The prompt. N of the 8,000 characters allowed. | Pasted into chat, as is |

## Run it

**GitHub Copilot Chat in VS Code**

1. Open the repository. In the Chat view, start a **Local** session and leave the **Agent** control on Agent.
2. Paste the contents of `PROMPT.md` and send it.

To run it again with `/your-slug`, save it as `.github/prompts/your-slug.prompt.md` with this header above the prompt. Prompt files run only in Local harness sessions; in any other session, paste the prompt.

```markdown
---
description: One line on what the prompt does.
agent: agent
---
```

**Placeholders**

- `<placeholder>`: what to put there. Delete this list if the prompt has none.

## What it checks

What the prompt looks at, what it doesn't, and the facts its checks rely on, each with its Microsoft Learn page.

## Prerequisites

- Tool and licence requirements

## Limitations

- Known gaps, preview caveats, the documentation date relied on

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

Prompts here are community samples without support. Search [existing issues](https://github.com/ari20089/agents-in-practice/issues) or [open a new one](https://github.com/ari20089/agents-in-practice/issues/new/choose).

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
