---
name: computer-use-autonomous-agents-fs
description: Use when a regulated financial firm is designing or approving a Microsoft agent that drives a user interface (Copilot Studio computer use, Cowork browser, Foundry computer use) or acts on a trigger with no prompt (Copilot Studio event triggers, agents with an account, Cowork automated tasks), and needs to know where the line on financial transactions and decisions about people falls, which regulatory obligations apply, and what controls go on each side. Trigger phrases include "computer use agent in a bank", "can an agent make payments", "autonomous agent risk committee", "RPA replacement with computer use", "regulator checklist for AI agents", "SM&CR for AI agents", "FINRA supervision of AI agents", "DORA controls for AI agents", "GDPR Article 22 agent", "Reg B adverse action agent", "human in the loop for autonomous agents". Do not use for chat-only assistants that take no actions, for non-Microsoft agent platforms, or for general AI policy with no agent in view.
---

# Computer-Using and Autonomous Agents in Regulated Financial Services

Microsoft's computer use FAQ says the tool "isn't intended for" "Making financial transactions" or "Recommending or scoring in sensitive domains, such as hiring, healthcare, or finance", while naming data entry and invoice processing as intended uses. For agents that act on a trigger, Microsoft's Application Card tells makers to "Implement approval steps for high-impact actions, such as financial transactions". No financial regulator has a binding checklist for agents, and none addresses computer-using agents, but several have published non-binding agent expectations and all say existing rules apply. This skill classifies each step of a proposed agent, places it against the line, maps the obligations that apply (in full for the UK, the EU and the US), and produces the controls and artifacts a risk committee needs. It is advisory: never change tenant settings, agents, entitlements or policies.

## Before Starting

Determine the following before proceeding. If the user has not supplied them, ask for the missing ones.

1. **Use case** — the business process end to end: which systems the agent touches, what it reads, what it enters or sends, and what the final step is.
2. **Mechanism** — Copilot Studio computer use (and where it runs: hosted browser, Cloud PC pool, own machine), Copilot Studio event triggers (standard or Microsoft Copilot harness, formerly GitHub Copilot harness), an agent with an account (Frontier), Cowork browser or automated tasks, Foundry computer use, the Windows 365 for Agents MCP server, Edge or Windows agent features. If unsure, ask how the agent was built and say what you assumed.
3. **Credentials** — maker-provided, end-user, a dedicated agent account, or a customer's own credentials, for each target system; and what that account is entitled to do there.
4. **Firm and jurisdictions** — firm type (bank, broker-dealer, investment adviser or firm, insurer, payment firm) and every jurisdiction whose rules apply (UK, EU and the member states, US and the states, Singapore, Hong Kong, Canada, Australia, other). For the US, also which customers are in Colorado or California, and whether payments are from consumer or business accounts. Defaults to asking; do not assume the UK.
5. **Artifact wanted** — placement assessment (default), control set, risk committee paper, inventory record, regulatory mapping, instruction block, or tenant test plan.
6. **Documentation date** — if you have web access, re-check the pages in the guide's Sources list, compare each Microsoft page's `ms.date` with the listed date, look for newer regulator publications named in the guide's section 14, and say what changed. US federal documents since 29 Sep 2026 say "SI" (Super Intelligence) for AI, so search both terms. If you do not have web access, say you are relying on 31 October 2026.
7. **Tenant observations** — results the user already has from tests T1 to T10. Report them as *observed in tenant*, with the environment and date, separate from *documented* and *not documented*.

## Output Structure

Produce, in this order:

1. **Use case in one line** — mechanism, trigger, target systems, final step.
2. **Step inventory** — a table: step, system, mechanism, credentials, action class (C0 to C6), placement verdict.
3. **Overall placement** — the design's highest class and verdict (below the line, at the line, above the line: redesign, above the line: decline), with the Microsoft wording that puts it there.
4. **Regulatory position** — the corrected premise in two sentences, then the obligations that apply in the user's jurisdictions from guide sections 4 and 5, each labelled *binding*, *supervisory expectation*, *guidance*, *consultation* or *speech*.
5. **Controls below the line** — from guide section 6, only the ones that apply, each with its reason.
6. **Controls at and above the line** — from guide sections 7 and 8, stating for each where it is enforced (target system, flow, agent instructions) and which ones the model cannot bypass.
7. **Conflicts and open questions** — the rows of D1 to D7 and Q1 to Q11 that bear on this design.
8. **Observed in tenant** — only if the user supplied results; otherwise omit the heading.
9. **Assumptions** — one line listing defaults you applied. Omit if the user supplied everything.
10. **The requested artifact** — see Step 6.
11. **Recommendation** — proceed, proceed with conditions, redesign (say how), or decline (name the decline condition).
12. **Sources and dates** — one line naming the pages relied on and their dates, with the preview status of each component in use.

Use tables for the inventory, mapping and test plan, numbered lists for controls and checklists, and a fenced block for any text the user will paste into an agent.

## Step 1: Identify the mechanism and its status

Read [references/autonomy-line-guide.md](references/autonomy-line-guide.md) section 1. Name each mechanism and its status (GA, preview, Frontier, experimental). Flag these at once if present:

- the hosted browser in a production design ("not recommended for production use");
- a Cloud PC pool or the standalone computer use tool in a production design (both preview: "Preview features aren't meant for production use");
- experimental models (Claude Sonnet 4.6, Opus 4.6), which are not listed as supporting human supervision;
- Researcher with Computer Use (status unclear; see D6);
- an agent with an account or a Microsoft Copilot harness trigger (both preview).

## Step 2: Classify every step

Use the guide's section 3.1 classes. Classify steps, not the agent; the design takes its highest step's class. Apply these readings:

| If the step... | Class |
|---|---|
| Submits into a draft, pending or approval queue that someone else releases | C1 |
| Submits and the submission itself commits money, an order or a ledger entry | C4 |
| Recommends or scores a person's credit, claim, price or eligibility, even for a human to confirm | C5 |
| Assembles or summarises a case for a person to decide, with no score, ranking or recommendation | C1 |
| Edits payees, beneficiaries, limits, entitlements, or the agent's own setup | C6 |
| Sends anything to a customer, counterparty or regulator | C3 |

If you cannot tell whether a submission stages or commits, ask. Do not guess C1.

## Step 3: Place each step against the line

Use the guide's section 3.2 table, which differs by mechanism:

- **Computer use:** C4 and C5 are outside Microsoft's intended use. The verdict is *redesign*: the agent stops at C1 and a person, or a system with its own limits, commits. C6 is *decline*.
- **Autonomous via connectors, flows or APIs:** C4 and C5 need an approval outside the agent, or a deterministic limit the agent cannot change. C6 is *decline* or human-only.
- **C3** is *at the line* for both: proceed only with an authorised recipient list, communications capture and supervision.

Then apply section 3.3: check that the line is enforced by the target system's entitlements or maker-checker, not by the agent's instructions. If the only guard is in the prompt or in human supervision, the step is not below the line, whatever its class.

## Step 4: Map the regulatory position

State the corrected premise from guide section 4.1, then give the rows from sections 4.2 and 5 for the user's jurisdictions. Keep the status of each source exactly as the guide gives it. Always include, where they apply:

- named accountability (SM&CR and s66A; DORA Art 5 and the ESMA statement; FINRA 3110, Advisers Act Rule 206(4)-7);
- third-party responsibility (SS2/21 and the critical third parties regime, under which Microsoft is designated but the firm's accountability does not change; DORA Art 28; interagency guidance);
- access and change control (SYSC 4; DORA Art 9 and RTS 2024/1774 Arts 17, 20, 21; the Interagency Guidelines and the FFIEC booklet);
- records (FCA good practice; AI Act Art 26(6), ESMA statement; SEA 17a-4, FINRA 4511, FAQ D.8, Advisers Act 204-2), plus open question Q1;
- for payments on anyone's credentials: PSRs regs 67, 72, 77, 100, PSD2, Regulation E 1005.2(m), or UCC 4A-202 and 4A-203 for US business accounts, plus open question Q2;
- for C4 orders: SEA Rule 15c3-5; MiFID II Art 17 and RTS 6, plus open question Q10;
- for C5, from guide section 5.2: UK GDPR Arts 22A to 22D; GDPR Art 22 with *SCHUFA*, the Consumer Credit Directive Art 18(8) from 20 November 2026, and AI Act Annex III 5(b) or 5(c) with Articles 14, 26 and 27 from 2 December 2027; Regulation B 1002.9 and FCRA 1681m, Colorado SB26-189 and California ADMT rules from 1 January 2027, and the NAIC bulletin or NYDFS Circular Letter No. 7 for insurers; plus open question Q11.

## Step 5: Select the controls

From guide sections 6, 7 and 8, select the controls that fit the design. For each, say where it is enforced and whether it holds if the model misbehaves. Always cover: a dedicated least-privilege identity per agent; where it runs; log retention and Purview audit; inventory record and named owners; a tested stop. For autonomous agents, add the section 8 items. Name the documented weaknesses that apply: human supervision is not a fail-safe, the allow list may not block navigation (D1), external threat detection (preview) allows the tool by default if the provider does not answer within one second, and Conditional Access on the Microsoft Entra Agent ID applies only in Teams.

For a C5 step, state the reviewer test from guide section 5.2 and whether the design meets it. For a C4 order, name the pre-trade controls that cover the agent's order source.

Then pull the open questions that match the scenario from guide section 11: payments on anyone's credentials, Q2; audit evidence, Q5; own machine or Cloud PC sign-in, Q6; a credit, claim or pricing step in the EU, Q8; data location or the Windows 365 for Agents MCP server, Q9; records of UI actions, Q1; agent order flow, Q10; a person approving an agent's recommendation about a person, Q11.

## Step 6: Produce the artifact

| Request | Guide sections | Output shape |
|---|---|---|
| Placement assessment | 3, 4.1, 13 | Step inventory, verdicts, decline conditions met or not |
| Control set | 6, 7, 8 | Numbered controls grouped by below and above the line, each with where it is enforced and its regulatory hook |
| Risk committee paper | 2, 3, 4, 5, 7, 11, 13 | Decision sought, use case, placement, Microsoft position, regulatory position, controls, open questions, residual risk, recommendation |
| Inventory record | 9.1 | The field table filled in for this agent, *unknown* where the user has not said |
| Regulatory mapping | 4, 5 | Table of obligations by jurisdiction with status labels |
| Instruction block | 3.3, 7 | A fenced block of scope rules for the agent, preceded by a line saying instructions are not the control and naming the controls that are |
| Tenant test plan | 12 | T1 to T10 with steps and what to record, minus tests already run |

Every artifact carries the documentation date and the preview status of the components it relies on.

## Step 7: Recommend, then stop

Give one recommendation: proceed, proceed with conditions, redesign, or decline. Name each decline condition from guide section 13 that applies. Do not offer to change settings, agents or entitlements.

## Rules

- **Never** say a regulator requires something when the source is guidance, a bulletin, a speech, a concept note or a consultation. Use the status labels in Step 4.
- **Never** say no regulator has published anything on AI agents. Say no binding checklist exists and none addresses computer-using agents, then name the non-binding publications.
- **Never** describe human supervision, clarification requests, agent instructions or the computer use allow list as the control that keeps an agent below the line. Microsoft documents each as partial or probabilistic.
- **Never** cite SR 11-7 as current US guidance (SR 26-2 superseded it on 17 Apr 2026 and excludes agentic AI), and never say PRA SS1/23 mentions AI.
- **Never** say EU AI Act high-risk obligations for Annex III uses apply before 2 December 2027.
- **Never** state whether an agent-initiated payment is authorised under the PSRs, PSD2, Regulation E or UCC Article 4A. It is open question Q2; say so and give the provisions.
- **Never** cite CFPB Circulars 2022-03 or 2023-03 as current (withdrawn 12 May 2025), or Colorado SB 24-205 as the law in force (SB26-189 replaced it, for decisions from 1 January 2027). Cite Regulation B 1002.9(b)(2) for the reasons duty.
- **Never** treat a person's approval of an agent's recommendation about a person as taking the step out of C5, or as meaningful human review, unless the design meets the tests in guide section 5.2.
- **Never** classify a submission as C1 without knowing it lands in a queue someone else releases.
- **Always** quote Microsoft and regulator wording from the reference guide or a live fetch of the cited source, not from memory, and mark anything the guide calls an inference as an inference.
- **Always** keep *documented*, *observed in tenant* and *not documented* apart.
- **Always** keep firm names, system names, account names and customer data the user shares out of any reusable example or artifact.
- This is not legal advice. Say so in any risk committee paper or regulatory mapping.

## Examples

**Input:** "Our accounts payable team wants a Copilot Studio agent with computer use to read supplier invoices from a shared mailbox, key them into our ERP and then release payment in the bank's web portal. It runs on a trigger every hour. We're a UK bank. Can we do this?"

**Output (abridged):**

> **Use case:** Event trigger (standard harness) → computer use → ERP invoice entry → bank portal payment release.
>
> | Step | System | Class | Verdict |
> |---|---|---|---|
> | Read invoice from mailbox | Exchange | C0 | Below the line |
> | Key invoice into ERP as "pending approval" | ERP | C1 | Below the line |
> | Release payment in bank portal | Bank portal | C4 | Above the line: redesign |
>
> **Overall placement:** C4 by computer use, outside Microsoft's intended use: the tool "isn't intended for ... Making financial transactions" (FAQ for the computer use tool, 23 Sep 2026). Redesign so the agent stops after ERP entry and a person releases payment through the existing maker-checker.
> **Regulatory position:** No binding regulator checklist for agents exists, and none addresses computer-using agents. FCA good and poor practice (19 Oct 2026, non-binding) expects an agent inventory and named SMF ownership; s66A (binding) applies to the accountable senior manager; PRA SS2/21 (supervisory statement): SMFs "cannot outsource their responsibilities". Whether payments released on a person's portal login are consistent with PSRs reg 67 consent is open (Q2).
> **Controls:** dedicated ERP account with no approve or post rights (T1); the trigger runs as the maker, so use a service identity; a registered machine the bank owns (or a Cloud PC pool with a recorded preview risk acceptance), not the hosted browser; Dataverse log retention set to the records period and Purview audit on; human supervision configured but not counted as a control; tested stop (T7).
> **Open questions:** Q2 (portal login and PSRs reg 67), Q5, Q6.
> **Recommendation:** redesign, then proceed with conditions. No decline condition is met once the ERP and portal entitlements are removed and T1 proves it; if the portal release right cannot be removed, decline condition 1 applies.
> **Sources and dates:** computer use FAQ (23 Sep 2026), computer use (20 Oct 2026), event triggers (9 Sep 2026), FCA good and poor practice (19 Oct 2026). Cloud PC pool is preview. Not legal advice.

**Input:** "We're a US bank. When a consumer loan application lands in our loan origination system, a Copilot Studio agent would read the file and the credit report, score it, recommend approve or decline, and put it in the underwriter's queue. Some applicants live in Colorado and California."

**Output (abridged):**

> **Use case:** Event trigger (standard harness) → connector to the loan system → score and recommendation → underwriter queue.
>
> | Step | System | Class | Verdict |
> |---|---|---|---|
> | Read application and credit report | Loan system | C0 | Below the line |
> | Score and recommend approve or decline | Loan system | C5 | Above the line: redesign |
> | Write a case summary to the underwriter queue | Loan system | C1 | Below the line |
>
> **Overall placement:** C5 by a triggered agent. Not computer use, but the Code of Conduct bars actions "without appropriate human oversight" that may affect a person's "financial position", and the Application Card asks for "approval steps for high-impact actions".
> **Regulatory position:** No binding regulator checklist for agents exists. SR 26-2 (supervisory guidance) leaves agentic AI outside model risk guidance, so general risk management applies. Regulation B 1002.9(b)(2) (binding): reasons must "accurately describe the factors actually considered or scored". FCRA 1681m notice applies. Colorado SB26-189 (binding, decisions from 1 Jan 2027) covers a score or recommendation that "materially influences" the decision and requires review by someone who "does not default to the system output"; California's ADMT rules (binding, compliance by 1 Jan 2027) apply where the technology would "substantially replace human decisionmaking". CFPB Circular 2022-03 was withdrawn on 12 May 2025; do not rely on it.
> **Controls:** the agent's loan-system account cannot set a decision status (T1); a dedicated identity, not the maker's credentials; the underwriter sees the source documents, not only the summary; log the factors used; Purview audit on; tested stop (T7).
> **Open questions:** Q11.
> **Recommendation:** redesign so the agent summarises the file with no score or recommendation (C1), then proceed with conditions. If the score must stay, proceed only where the underwriter review meets the guide's section 5.2 tests; otherwise decline condition 9 applies.

**Input:** "We're an investment firm in the Netherlands. Each morning a Copilot Studio agent would rebalance discretionary client portfolios by placing orders through our order management system's API."

**Output (abridged):**

> **Use case:** Scheduled trigger → model portfolio and positions → order calculation → order placement through the OMS API.
>
> | Step | System | Class | Verdict |
> |---|---|---|---|
> | Read model portfolio and positions | OMS | C0 | Below the line |
> | Calculate rebalancing orders | Agent | C1 | Below the line |
> | Place orders | OMS API | C4 | Above the line: approval outside the agent required |
>
> **Overall placement:** C4 by an autonomous agent through an API. Application Card: "Implement approval steps for high-impact actions, such as financial transactions".
> **Regulatory position:** No binding regulator checklist for agents exists. An agent that sets "whether to initiate the order, the timing, price or quantity ... with limited or no human intervention" may be algorithmic trading under MiFID II Art 4(1)(39), bringing Art 17 and RTS 6 (binding); open question Q10. DORA Art 9 and RTS 2024/1774 Arts 17 and 21 (binding) cover the agent's identity and changes to it. ESMA's statement (supervisory expectation): decisions stay with management bodies "irrespective of whether those decisions are taken by people or AI-based tools". This is not an AI Act Annex III use.
> **Controls:** the agent's OMS account stages orders that a portfolio manager releases; pre-trade price collars and maximum order values in the OMS cover the agent's order source and cannot be changed by it; kill switch tested; changes to the agent's instructions, tools or model approved independently of the maker.
> **Open questions:** Q10, Q1.
> **Recommendation:** proceed with conditions, with the agent proposing and a person releasing. Automatic placement needs a compliance decision on Q10 first; if orders can bypass the pre-trade controls, decline condition 10 applies.

## References

- [references/autonomy-line-guide.md](references/autonomy-line-guide.md) — the products in scope and their status (section 1), Microsoft's intended-use statements verbatim (2), the action classes and the line by mechanism (3), what regulators have published and its status (4), the obligations crosswalk, with decisions about people and orders and payments by jurisdiction (5), controls below the line (6), at and above it (7), for autonomous agents (8), the inventory record and verdicts (9), Microsoft's conflicting pages (10), open questions Q1 to Q11 (11), tenant tests T1 to T10 (12), decline conditions (13), what to watch (14), and all sources with dates. Read it before answering; read the section named in Step 6 before building an artifact.
