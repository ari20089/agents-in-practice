# Security

## Reporting a vulnerability

If you believe you have found a security issue in this repository (for example a skill or script that leaks data, executes unsafe commands, or contains a credential), **do not open a public issue**.

Instead, use GitHub's private vulnerability reporting for this repository: **Security** tab → **Report a vulnerability**. Include the skill name, the file involved, a description of the issue, and reproduction steps if you have them.

You should receive an acknowledgement within a few days. Reports are handled on a best-effort basis by the maintainer.

## Scope

This repository contains instruction files and small helper scripts. It does not run services or store data. Issues in Microsoft products referenced by the skills should be reported to Microsoft through the [Microsoft Security Response Center](https://msrc.microsoft.com/).

## For contributors

- Never commit secrets, tokens, tenant identifiers or personal data, even as examples.
- Scripts under `skills/*/scripts/` must not download and execute remote code, write outside the working directory, or require elevated privileges without saying so in the skill's `README.md`.
