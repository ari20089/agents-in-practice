# Dataverse Table Designer

## Summary

Most Dataverse problems that are expensive to fix start on the first day of a project:

- a table created as organization-owned when people needed to see only their own rows;
- a choice column holding a list of suppliers that the business now wants to maintain itself;
- a lookup to a table with nothing in it but a name;
- a parental relationship that deletes child rows nobody expected to lose.

Several of these can't be changed later. Table ownership, schema names and column data types are fixed once saved, so the fix is a new table or column and a data migration.

These agent instructions turn a Copilot agent into a data model designer. Describe a business process in plain language, and it proposes:

- **tables**, reusing standard tables such as account and contact before creating custom ones, with the table type and **ownership model** for each, and the limits that come with elastic and virtual tables;
- **columns** with types, requirement levels, date behaviour and schema names under your publisher prefix;
- **relationships** with the lookup column, what happens on delete, and hierarchies;
- **choices**, global or local, single or multi-select;
- a **choice or lookup review** that flags choices that should be lookups and lookups that should be choices, with the signals from the process and the cost of changing later;
- the **security** the design needs: privilege levels, Append and Append To for lookups, columns that can't be secured;
- the decisions in the design that **can't be undone**;
- a **solution checklist** in build order, from publisher and solution to managed export.

It designs only. It doesn't create tables or call Power Platform, so the person building the solution stays in control.

## What's in the folder

| File | What it's for | Where it goes |
|---|---|---|
| [`INSTRUCTIONS.md`](./INSTRUCTIONS.md) | The designer's behaviour: inputs, design steps, naming, output format and rules. 7,772 of the 8,000 characters allowed. | The agent's **Instructions** field, pasted as is |
| [`knowledge/dataverse-design-reference.txt`](./knowledge/dataverse-design-reference.txt) | Reference data: table types and their limits, ownership options, privileges, column types, date and time behaviour, computed columns, choices, relationship behaviours, column security, solution, layering and retention rules, the choice or lookup rubric, the decisions that can't be undone, and sources | Uploaded as the agent's only knowledge source |

All behaviour is in the instructions. The knowledge file only holds facts the designer looks up and quotes.

## Set up

**Agent settings for any tool**

| Setting | Value | Why |
|---|---|---|
| Name | Dataverse Table Designer | Fits Agent Builder's 30-character limit |
| Description | Turns a business process into a Dataverse data model and a solution checklist. | |
| Knowledge | `dataverse-design-reference.txt` only | The designer states Dataverse behaviour only from this file |
| Web search | Off | People paste process descriptions; the facts come from the knowledge file |
| Actions | None | It designs; it never creates tables |
| Audience | Makers, business analysts and developers starting a Dataverse solution | |

**Conversation starters**

- *Design the tables for our equipment loan process.*
- *We track supplier onboarding in a spreadsheet. Here are the columns.*
- *Should this be a choice or a lookup?*
- *Review the data model I already have.*

**Agent Builder in Microsoft 365 Copilot**

1. Create an agent and paste `INSTRUCTIONS.md` into its instructions.
2. On the **Configure** tab, upload `dataverse-design-reference.txt` as knowledge, turn off **Search all websites**, and turn on **Only use specified sources**.
3. Add the conversation starters and test with a process you know well.

**Copilot Studio**

1. Create an agent. On its **Overview** page, in the **Instructions** section, select **Edit** and paste `INSTRUCTIONS.md`.
2. Select **Add knowledge** and upload `dataverse-design-reference.txt`.
3. Turn off **Web Search** in the Knowledge section.

**Microsoft 365 Agents Toolkit**

1. Put the contents of `INSTRUCTIONS.md` in the manifest's `instructions` property. It must be 8,000 characters or less.
2. Add `dataverse-design-reference.txt` to an `EmbeddedKnowledge` capability. Embedded files must be 1 MB or smaller; this one is about 33 KB.
3. Don't add the `WebSearch` capability.

## How to use it

Give it the process the way you'd explain it to a new colleague: the steps, who does each one, what gets recorded, who should see what, roughly how many records a year, and any system that sends or reads the data. Paste a form, a spreadsheet's column headings or a process document if you have one.

It asks up to five questions that change the design. Say "draft it first" to get a design with each assumption marked **confirm**. It won't settle the ownership model until it knows who sees whose rows.

A row from the choice or lookup review, for an equipment loan process (made-up example):

| Column | Current | Recommend | Rule IDs | Signals | Cost to change later |
|---|---|---|---|---|---|
| Asset > Supplier | Choice, 40 options | Lookup to a new Supplier table | CL1, CL2, CL3 | Each supplier has a contact and a contract end date; procurement adds suppliers monthly | Data type can't change after save: new column, data migration, every form, view and flow updated |

## Prerequisites

- Microsoft 365 Copilot with Agent Builder, Copilot Studio, or the Microsoft 365 Agents Toolkit, to host the agent.
- To build the design: a Dataverse environment and a security role that can create solutions and tables.
- Ideally, your organization's solution publisher and prefix already exist. If not, the checklist starts with creating them.

## Limitations

- Written against 33 Microsoft Learn pages dated 25 May 2018 to 27 October 2026, all read on 1 November 2026. Dataverse changes often; check the dates in Sources.
- Filtered record ownership is in preview. The designer marks it as preview and gives a production alternative.
- The choice or lookup rubric (CL1 to CL12), the ownership rubric (OW1 to OW6), the list of decisions that can't be undone (IR1 to IR13) and the thresholds of about 30 options are this item's design, built on Microsoft's guidance but not Microsoft guidance.
- **Plans** in Power Apps (generally available) and **Start with Copilot** in the table designer also generate Dataverse tables from a description, and they build them. This agent doesn't build anything. It gives a reviewable design with the reasons, the choice or lookup review, the security checks, the decisions that can't be undone and a build checklist, and it can review a model that Plans or Copilot generated.
- It doesn't estimate Dataverse storage or licensing cost, and it doesn't design apps, flows, business rules or plug-ins.
- It designs from what you tell it. Have someone who knows the process and your security model review the design before you build, and build in a development environment first.

## Sources

Microsoft Learn, with each page's `ms.date` when it was read on 1 November 2026:

**Tables**

- [Types of tables](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/types-of-entities), 31 Aug 2026
- [Create and edit tables using Power Apps](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/create-edit-entities-portal), 31 Aug 2026
- [Tables and metadata in Microsoft Dataverse](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/create-edit-metadata), 17 Apr 2026
- [Create and edit elastic tables](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/create-edit-elastic-tables), 31 Mar 2025
- [Create and edit virtual tables that contain data from an external data source](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/create-edit-virtual-entities), 9 Sep 2026
- [Get started with virtual tables (entities)](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/virtual-entities/get-started-ve), 7 Jan 2026
- [Filtered record ownership (preview)](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/filtered-view-record-ownership), 24 Sep 2026
- [Overview of plans](https://learn.microsoft.com/en-us/power-apps/maker/plan-designer/plan-designer), 7 Aug 2026

**Columns and choices**

- [Types of columns](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/types-of-fields), 14 Sep 2026
- [Create and edit columns in Dataverse using Power Apps](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/create-edit-field-portal), 9 Jan 2026
- [Behavior and format of the date and time column](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/behavior-format-date-time-field), 9 Apr 2026
- [Create a choice](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/custom-picklists), 21 Apr 2026
- [Create and edit choice columns overview](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/create-edit-global-option-sets), 5 Aug 2022
- [Autonumber columns](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/autonumber-fields), 26 Feb 2019
- [Work with formula columns](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/formula-columns), 9 Jan 2026
- [Automate calculations by defining calculated columns](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/define-calculated-fields), 22 May 2024
- [Define rollup columns that aggregate values](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/define-rollup-fields), 30 Apr 2024
- [Define status reason transitions for the Case or custom tables](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/define-status-reason-transitions), 25 May 2018
- [Define alternate keys using Power Apps](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/define-alternate-keys-portal), 14 May 2025
- [Work with alternate keys](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/define-alternate-keys-entity), 30 Mar 2026

**Relationships**

- [Microsoft Dataverse table relationships](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/create-edit-entity-relationships), 14 Sep 2026
- [Create a relationship between tables](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-entity-lookup), 16 Sep 2026
- [Create many-to-many table relationships overview](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/create-edit-nn-relationships), 16 Sep 2024
- [Define and query hierarchically related data](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/define-query-hierarchical-data), 21 Aug 2026
- [Use multi-table lookup columns](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/multitable-lookup), 27 Oct 2026

**Security**

- [Ownership-based security in Microsoft Dataverse](https://learn.microsoft.com/en-us/power-platform/admin/wp-security-cds), 5 Oct 2026
- [Security roles and privileges for Dataverse](https://learn.microsoft.com/en-us/power-platform/admin/security-roles-privileges), 9 Dec 2025
- [Column-level security to control access](https://learn.microsoft.com/en-us/power-platform/admin/field-level-security), 21 Sep 2026
- [Microsoft Dataverse teams management](https://learn.microsoft.com/en-us/power-platform/admin/manage-teams), 15 Jul 2025

**Solutions and data lifecycle**

- [Create a solution](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/create-solution), 9 Jan 2026
- [Solution concepts](https://learn.microsoft.com/en-us/power-platform/alm/solution-concepts-alm), 29 Jan 2025
- [Solution layers](https://learn.microsoft.com/en-us/power-platform/alm/solution-layers-alm), 30 Jan 2025
- [Dataverse long term data retention overview](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-retention-overview), 10 Apr 2026

The agent reads the same list at the end of [`knowledge/dataverse-design-reference.txt`](./knowledge/dataverse-design-reference.txt).

## Contributors

| Name | Links |
| --- | --- |
| Arindam Choudhury | [GitHub](https://github.com/ari20089) · [LinkedIn](https://www.linkedin.com/in/arindam-choudhury/) |

## Version history

| Version | Date | Comments |
| --- | --- | --- |
| 1.0 | November 2026 | Initial release |

## Help

Agent instructions here are community samples without support. Search [existing issues](https://github.com/ari20089/agents-in-practice/issues) or [open a new one](https://github.com/ari20089/agents-in-practice/issues/new/choose). For Microsoft product questions use Microsoft Learn or your Microsoft support channel.

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
