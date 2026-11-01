# Computer-using and autonomous agents in regulated financial services

**Where the line sits, and the controls on either side**

> **Status:** Written 31 October 2026. Every Microsoft page below was fetched on that date and its `ms.date` read from the page; every regulator document was read from the issuer's own site or, where noted, an archived copy. Copilot Studio computer use is generally available, but the hosted browser, Cloud PC pools and the standalone tool are preview, and several other products in scope are preview or experimental. Treat every statement as "true of the documents on that date" and re-check the Sources list before relying on it. This guide is not legal advice.

## Who this is for

- Risk, compliance and technology governance teams in banks, broker-dealers, insurers, payment firms and asset managers being asked to approve an agent that drives a user interface, or one that acts on a trigger with nobody prompting it
- Copilot Studio makers and platform owners who need to know which designs a risk committee will accept
- Senior managers who will be accountable for the agent

The obligations are mapped in full for the **UK, the EU and the US** (federal, plus the state laws that reach credit and insurance decisions). For Canada, Singapore, Hong Kong and Australia the guide covers the agent-specific publications and a few named obligations.

## The short version

1. **Microsoft draws a line for computer use, in writing.** The Copilot Studio computer use FAQ says the tool "isn't intended for" "Making financial transactions" or "Recommending or scoring in sensitive domains, such as hiring, healthcare, or finance". The same page says it is intended for automating interactions "where APIs aren't available", and the main page lists "automated data entry, invoice processing, and data extraction". So the line is not "finance": it is between **preparing and entering** work and **committing** a financial transaction or a decision about a person.
2. **For agents that act without a prompt, Microsoft does not exclude finance; its Application Card asks for an approval step.** The Copilot Studio Application Card says "Implement approval steps for high-impact actions, such as financial transactions or HR changes" and "Limit automation to reversible tasks where possible". The Code of Conduct forbids actions "without appropriate human oversight" that may affect anyone's "financial position".
3. **Microsoft also says its own human checks are not a safety control.** "You shouldn't rely on clarification requests as a safety fail-safe." The computer use allow list "doesn't stop the model from opening" other sites. External threat detection lets the action run if the provider doesn't answer "within one second". Conditional Access on the agent identity is evaluated "only when the agent runs in Microsoft Teams". So the line has to be enforced **outside the model**: in the target system's entitlements, a maker-checker step, or a deterministic limit.
4. **No regulator has a binding checklist for agents, and none addresses computer-using agents.** But the premise that regulators have said nothing is out of date. Since mid-2026, OSFI, the FSB, MAS, the HKMA, APRA, the FCA and FINRA have published **non-binding** expectations that name AI agents, and every one of them says existing obligations already apply. The work is mapping those obligations onto the agent, which this guide does.
5. **The firm owns the outcome.** Every regulator source here says so in some form, for example the FCA: "Firms are responsible for AI systems they develop, procure and deploy – including their outputs and outcomes."

## 1. What is in scope

Two kinds of agent, sometimes combined in one design:

- **Computer-using agents** operate a screen with a virtual mouse and keyboard, reading screenshots to decide the next step. They can do anything the signed-in account can do in any application the machine can reach.
- **Autonomous (trigger-driven) agents** start from an event (an email, a record change, a schedule) with no person prompting them, so there is nobody in the conversation to confirm a step.

| Product | Mechanism | Status (31 Oct 2026) | Financial-use statement |
|---|---|---|---|
| Copilot Studio computer use (in-agent tool) | Computer use | GA since May 2026; hosted browser, Cloud PC pool and standalone tool are preview; Claude Sonnet 4.6 and Opus 4.6 "Experimental" | Explicit exclusion (section 2) |
| Copilot Studio event triggers, standard harness | Autonomous | GA | Approval steps for financial transactions (Application Card) |
| Copilot Studio triggers, Microsoft Copilot harness (formerly GitHub Copilot harness) | Autonomous | Preview ("prerelease documentation") | None specific |
| Copilot Studio agents with an account | Autonomous, own identity | Frontier preview; needs an environment on "the early release cycle", "a Microsoft 365 Frontier for AI Teammates license and tenant Frontier enrollment", and an admin to "turn on Agent accounts for your environment" | None found |
| Copilot Cowork, local browser and automated tasks | Computer use (user's own Edge) and autonomous | GA; browsing "disabled by default" | "financial transactions that bypass approval processes" |
| Windows 365 for Agents MCP server | Computer use through MCP tools ("desktop interaction, browser automation, and semantic UI inspection") | GA since June 2026 | None found; whether the computer use tool's controls (allow list, human supervision, Dataverse logs, `CUAOperation`) apply is not documented |
| Microsoft Foundry computer use tool | Computer use | Preview, limited access | Avoid "ability to make financial transactions" |
| Copilot in Edge, Browse with Copilot | Computer use | Work: "limited opt-in preview"; consumer: experimental | Consumer page only: avoid "Financial activity" |
| Windows Copilot Actions | Computer use | Experimental, Windows Insiders | Access to "credit card data" only in user-authorised contexts |
| Researcher with Computer Use | Computer use | The Learn FAQ (18 Nov 2025) still describes the feature, and a Microsoft Support page titles it Frontier; third parties report retirement on 1 Jul 2026 in favour of Cowork (not confirmed by Microsoft) | None found |

Every Copilot Studio computer use page carries the banner "This article describes features used in agents or agent flows powered by the standard harness." Preview terms differ by product: Frontier previews are "subject to the existing preview terms of your customer agreements"; Foundry previews are "provided without a service-level agreement". Metering: computer use bills "five Copilot Credits" per step ("15 Copilot Credits when using a premium model"); a Cloud PC pool "bills your Azure subscription by using Azure meters".

## 2. What Microsoft says about intended use

### 2.1 Copilot Studio computer use

From the *FAQ for the computer use tool* (23 Sep 2026), under "Known limitations":

> "Not for sensitive or high-risk use cases. For example, the tool isn't intended for:
> - Recommending or scoring in sensitive domains, such as hiring, healthcare, or finance.
> - Making financial transactions.
> - Harmful actions, such as spam or misinformation.
> - Sharing data outside your organization without proper authorization."

Intended use, same page: "The computer use tool is intended to automate user interactions with websites and applications through a virtual mouse and keyboard. It's especially useful in scenarios where APIs aren't available." The main computer use page (20 Oct 2026): "You can use computer use for tasks like automated data entry, invoice processing, and data extraction."

Two points reviewers miss:

- The exclusion covers **recommending or scoring**, not only deciding. A computer-using agent that reads an application and proposes a credit decision for a person to confirm is still outside intended use.
- The FAQ also warns that unintended actions "can affect the security of your device, data, or connected accounts, including access to personal, financial, or enterprise systems", and that "Computer-use agents might encounter harmful or malicious instructions, often referred to as prompt injection attacks, where hidden commands in screenshots, web pages, or other inputs attempt to influence actions in unintended ways."

### 2.2 Copilot Studio platform: Application Card (17 Feb 2026)

The card names financial services as an intended use: "Financial services workflow automation: A bank can use Copilot Studio to build an agent that monitors and provides updates on incoming queries and applications." It then sets conditions:

- "Users should exercise caution when designing and/or deploying agentic AI systems in sensitive domains where agent actions are irreversible or highly consequential. Such domains include, but are not limited to, finance and insurance, healthcare, legal service, essential government service, employment, education, or housing."
- "Implement approval steps for high-impact actions, such as financial transactions or HR changes."
- "Limit automation to reversible tasks where possible."
- "Define clear boundaries for agent actions, especially in sensitive domains like finance, healthcare, or legal services. Use approval workflows for high-impact tasks."

Do not quote the card's "risk of overreliance" bullet: it still contains an unfilled authoring placeholder.

### 2.3 AI approvals in agent flows (preview)

*Multistage and AI approvals* (4 Sep 2025, preview): "exercise care when implementing them for highly sensitive approvals such as financial transactions, legal decisions, personnel actions, or compliance-critical processes. For these scenarios, ensure that human approval stages are reached in the flow so that humans remain in ultimate control of important decisions."

*FAQ for AI approvals* (1 Aug 2025): "The system wasn't designed to handle decisions that affect health, safety, finances, or legal status. Examples include insurance claims, medical authorizations, loan approvals, or immigration determinations" and "In domains like healthcare, finance, or aviation, regulatory requirements might necessitate human oversight even for routine decisions. The system wasn't evaluated for compliance in these contexts." The same FAQ lists purchase-order and invoice approvals "within policy" as intended uses, which is the same prepare-versus-commit line.

### 2.4 Microsoft Enterprise AI Services Code of Conduct (1 May 2026)

Binding on customers through the Product Terms ("defines the requirements that all customers of Microsoft AI Services ... must adhere to in good faith"):

- Usage restriction 5: customers must not use the services "To make decisions or take actions without appropriate human oversight as part of an application that may have a consequential impact on any individual's legal position, financial position, life opportunities, employment opportunities, or human rights".
- Autonomous AI Systems: customers must "Ensure adequate human user controls to monitor such system's decisions and actions, detect anomalies, and intervene when appropriate, especially for decisions and actions that are sensitive or irreversible and may result in harm", and "Implement controls to warn of and remediate failures of such system".

### 2.5 Other Microsoft products

| Product and page | Statement |
|---|---|
| Foundry, *Transparency Note for Azure OpenAI* (21 Sep 2026), Computer Use (Preview) | "Avoid scenarios where actions are irreversible or highly consequential: These include ... ability to make financial transactions or directly interacting with outside services". Also: the model can "be fooled into executing commands that are harmful to the user or the system, such as downloading malware, leaking credentials, or issuing fraudulent financial transactions." |
| Foundry, *Use the computer use tool for agents* (21 Aug 2026) | Prerequisite: "A virtual machine or sandboxed environment for safe testing. Don't run on machines with access to sensitive data." On a `sensitive_domain` warning: "Ensure an end user actively monitors the model actions on these sites." |
| Cowork, *Responsible AI FAQ* (5 Aug 2026) | "Cowork isn't intended for use cases that require guaranteed accuracy without human review. Examples are legal filings, medical decisions, or financial transactions that bypass approval processes." Hands back "a payment confirmation" to the user. |
| Cowork, *Manage Copilot Cowork* (14 Sep 2026) | Automated tasks "run without a person present"; "Each automated task runs as the user who created it"; "Users can pre-authorize actions when they create a task." |
| Cowork, *common questions* (29 Sep 2026) | Approvals can be skipped "for the rest of the current session", and for emails "always for that action". |
| Edge, *Browse with Copilot* (consumer, 12 Aug 2026) | Avoid "Financial activity (banking, stock trading, credit card details)". The work page (14 Aug 2026) has no equivalent exclusion. |

## 3. Where the line sits

### 3.1 Action classes

Classify every step the agent takes, not the agent as a whole. A design's class is its highest step.

| Class | What the step does | Examples |
|---|---|---|
| **C0 Observe** | Reads a screen or record and returns what it found; writes nothing | Extract balances from a portal into a summary; read a KYC document |
| **C1 Prepare** | Fills or stages work that a person or a downstream control must release | Key an invoice into the ERP in draft or "pending approval" status; draft a payment for a second user to release |
| **C2 Internal change** | Changes an internal record; reversible; no money moves and no customer is affected | Update a CRM field; file a document; open a ticket |
| **C3 Outbound communication** | Sends something outside the firm or to a customer | Email a customer; upload a return to a regulator portal; post to a counterparty portal |
| **C4 Financial commit** | Moves money or creates a financial obligation | Initiate, approve or release a payment; place, amend or cancel an order; post or reverse a ledger entry; issue a refund |
| **C5 Decision about a person** | Recommends, scores or decides a person's access to, or terms of, a financial service | Recommend or decide credit, a claim, an account opening, a price or a limit for an individual |
| **C6 Control change** | Changes what people or systems are allowed to do | Change limits, thresholds, entitlements, payee or beneficiary details, or the agent's own configuration |

### 3.2 The line, by mechanism

| Class | Computer use (driving a UI) | Autonomous via connectors, flows or APIs | Why |
|---|---|---|---|
| C0 | Below the line | Below the line | Read-only; data-protection and records controls still apply |
| C1 | Below the line | Below the line | Intended use ("data entry, invoice processing"); the release happens elsewhere |
| C2 | Below the line, reversible changes only | Below the line | "Limit automation to reversible tasks where possible" |
| C3 | **At the line**: only with authorisation, records, supervision and disclosure in place | **At the line**: same | Computer use excludes "Sharing data outside your organization without proper authorization"; regulated communications rules apply (section 5); in the EU an agent that interacts with a natural person must "disclose both their artificial nature and the person on whose behalf they are acting" (Article 50 guidelines) |
| C4 | **Above the line: outside Microsoft's intended use.** Redesign so the agent stops at C1 and a person, or a system with its own limits, commits | **Above the line: approval outside the agent required.** A human approval stage or a deterministic limit the agent cannot change | FAQ: not intended for "Making financial transactions"; Application Card: "approval steps for high-impact actions, such as financial transactions" |
| C5 | **Above the line: outside intended use, including recommending** | **Above the line**: human decision required; AI approvals "wasn't designed" for it | FAQ: "Recommending or scoring in sensitive domains"; Code of Conduct restriction 5; UK GDPR Art 22A, GDPR Art 22 and *SCHUFA*, Regulation B, Colorado and California (section 5.2); EU AI Act Annex III 5(b) and 5(c) |
| C6 | **Above the line: decline** | **Above the line: decline, or human-only** | Foundry: avoid "granting access to critical systems"; regulators: least privilege and controlled change (section 5) |

The line is therefore **the commit**: the moment money moves, a person's position is decided, or a control changes. Below it, controls make the agent's work accurate, attributable and recoverable. At and above it, controls make sure the agent **cannot** cross by itself.

### 3.3 Put the line in the target system, not in the agent

Each agent-side guard this guide examines (human supervision, the allow list, external threat detection, Conditional Access on the Microsoft Entra Agent ID) is described by Microsoft as probabilistic, partial, Teams-only or fail-open (sections 6, 8 and 10). The only boundary that holds whatever the model does is one the target system enforces:

- the agent's account in the payment, trading or core banking system **has no entitlement** to release, approve or amend limits;
- the system's own **maker-checker** requires a second, human user for the commit;
- where the commit runs through an API instead of a UI, **server-side limits** (value, payee list, rate) that the agent's credentials cannot change.

Regulators describe the same pattern. The FSB: "Deterministic controls are introduced at design and implemented as code in the control plane (the layer where decisions are made about what an agent can and cannot do)." OSFI: "assign unique non-human identities, enforce least privilege, apply scoped permissions". The FCA: build "proportionate technical checks and continuous monitoring into the AI system, rather than only relying on a person to review, approve, challenge or override its outputs or decisions. Firms should be able to show that the controls they choose work in practice."

Instructions in the agent ("never submit a payment") are worth having, but they are not the control. Microsoft's own computer use guidance shows why: its sample instructions say "Once you fill in the form, select Submit. No need to ask for permission." Instructions describe intent; entitlements enforce it.

## 4. What regulators have and have not published

### 4.1 The premise, corrected

As of 31 October 2026:

- **No financial regulator has issued a binding control checklist for AI agents.** Everything agent-specific is guidance, a bulletin, a speech, a concept note, a consultation or non-binding sound practice.
- **No financial regulator has published anything specific to computer-using agents.** MAS excludes "robotic process automation that follows fixed programmed instructions without learning or adaptation" from its definition of AI. The public-sector documents found that name computer-use or browser-driving agents come from bodies that are not financial regulators: the European Commission's Article 50 transparency guidelines (C(2026) 5054, 20 Jul 2026, non-binding), whose paragraph 63 says an agent's "web request or browser action" is not synthetic content under Article 50(2) and whose paragraph 31 requires agents that interact with natural persons to "disclose both their artificial nature and the person on whose behalf they are acting"; IMDA's *Model AI Governance Framework for Agentic AI*; and the Cyber Security Agency of Singapore's *Securing Agentic AI* addendum.
- **Several regulators have published non-binding agent expectations**, and all of them say existing rules apply.
- **The binding rules that bite hardest are not about AI at all.** For decisions about people they are data-protection and credit law (UK GDPR Articles 22A to 22D, GDPR Article 22, the Consumer Credit Directive, Regulation B, and the Colorado and California automated-decision rules, section 5.2); for orders and payments they are market-access, algorithmic-trading and payment-authorisation rules (section 5.3).
- **US federal documents changed vocabulary.** Executive Order 14434 (29 Sep 2026) tells agencies to use "'Super Intelligence' and 'SI' in place of 'Artificial Intelligence' and 'AI'" in non-statutory documents, and the SEC's FY2027 examination priorities already do. Search for both terms when re-checking US sources.

### 4.2 By jurisdiction

| Body | Agent-specific publication | Status | What it adds |
|---|---|---|---|
| **OSFI (Canada)** | *Generative and Agentic AI* technology risk bulletin, July 2026 | Non-binding sound practices tied to Guidelines B-13, E-21, B-10 | The closest to a checklist. "Control AI agent autonomy and access": "unique non-human identities, enforce least privilege, apply scoped permissions, and use just-in-time access with short-lived credentials"; "restrict tool usage via allow-lists and API gateways and apply approval checkpoints for high-impact actions"; "log and review agent activity and tool usage". Names "shared or inherited credentials that undermine accountability" as a key risk. |
| **FSB** | *Sound Practices for Responsible Adoption of AI*, final, 15 Oct 2026 | Non-binding; "do not establish an international standard" | Unique agent identifiers; traceability of "what triggered the action"; "least agency"; human approval "before approving financial transactions above a certain value"; tested kill switches; "accountable individuals for each AI agentic use case". |
| **MAS (Singapore)** | *Guidelines on AI Risk Management*, 7 Oct 2026 | Supervisory expectations; effective 7 Oct 2027 (sections 5 and 6 by 7 Oct 2028); agentic guidance to be consulted on in 2027 | AI agents in scope; inventory attributes for agents ("agent-specific identifiers, information on the tools and systems the agent can access, its components, and the guardrails imposed"); monitoring of "reasoning processes, actions taken, tools used"; kill switches for high-risk AI. |
| **HKMA (Hong Kong)** | *Concept Note on Governance of Agentic AI*, 15 Oct 2026, with supervisory guidance | Concept note "does not constitute specific supervisory requirements at this stage"; discussion paper promised | Accountability anchored in the business owner of the intent; inventory of material agents; "intervention points ... before actions with material customer implications"; kill switch for higher-risk use cases. |
| **FCA (UK)** | *AI in financial services: good practice and areas for improvement*, 19 Oct 2026 | Good and poor practice; "do not create new requirements" | Central agent inventory showing "who owns them, what systems and data they can access, and what controls apply"; named SMF ownership per use case; auditable records of oversight. A "trusted framework for agentic finance" was recommended by the Mills Review (6 Jul 2026, an independent review to the FCA Board, which proposed "structured and verifiable mandates (scope, limits and revocation)" for agents) and promised in the Rusu speech (19 Oct 2026); it is not published. The FCA's *Payments Regulatory Priorities* (Mar 2026) say it is "considering whether change or development of regulation is needed to support agentic AI payments". Rathi speech (24 Jun 2026): "Accountability for regulated activities and outcomes must remain clear." |
| **Bank of England and FCA** | *Artificial intelligence in UK financial services - 2026*, 26 Oct 2026 | Survey report; not guidance | Defines four autonomy levels: "decision-support", "Constrained execution", "Conditional autonomy", "Broad autonomy". Only 2% of respondents had agents with broad autonomy, and "no more than 9% of respondents expected agents to: approve or decline customer outcomes; execute trades or place orders; initiate, execute or block payments; or change limits, thresholds and controls", which is this guide's C4 to C6 line as the industry currently draws it. |
| **Bank of England / PRA** | FPC record, 1 Apr 2026; Breeden speech, 30 Jun 2026; Governor's letter to the Treasury Committee, 17 Jul 2026 | Policy record; speech; correspondence | Further work on agentic AI in payments and markets requested. "relying on a human in the loop for all agent actions is unlikely to be realistic." The Governor's letter: "as a matter of English law, AI should continue to be treated as a tool rather than as an agent in the legal sense", and "responsibility will likely still sit somewhere in the chain of human and corporate actors who are involved"; Bank staff "intend to do deep dives into agentic trading and payments". SS1/23 does not mention AI. |
| **HM Treasury** | *Modernising Payment Services Regulation*, consultation 14 Jul to 6 Oct 2026 | Consultation, closed | Question 15 asks whether authentication, consent and liability rules need changing for agentic payments. No response found. |
| **APRA (Australia)** | Letter to industry on AI, 30 Apr 2026 | Letter; "technology and vendor agnostic" | Expects "controls over agentic and autonomous workflows" and notes "Identity and access management capabilities have not yet adjusted to nonhuman actors such as AI agents." |
| **FINRA (US)** | 2026 Annual Regulatory Oversight Report, Dec 2025 | Report; "does not create any new legal or regulatory requirements" | Agent risks including "Scope and Authority: Agents may act beyond the user's actual or intended scope and authority"; considerations on monitoring access, "human in the loop" protocols, tracking agent actions, guardrails. FINRA blog *Observations on AI Agents* (27 Jan 2026, not a rule or notice): "Complicated, multi-step agent reasoning tasks can make outcomes difficult to trace or explain, complicating auditability." Regulatory Notice 26-14 (consultation, closed 11 Sep 2026): "Members are responsible for their communications, regardless of whether they are generated by a human or AI technology." Regulatory Notice 26-15 (consultation, closed 25 Sep 2026) asks whether FINRA should give "best execution guidance specific to the use of AI". |
| **Fed / OCC / FDIC (US)** | SR 26-2 / OCC Bulletin 2026-13, 17 Apr 2026 | Supervisory guidance | Supersedes SR 11-7 and states "Generative AI and agentic AI models are novel and rapidly evolving. As such, they are not within the scope of this guidance. Nonetheless, a banking organization's risk management and governance practices should guide the determination of appropriate governance and controls for any tools, processes, or systems not covered in this document." Vice Chair Bowman (speech, 1 May 2026): "we expect other risk-management and governance practices to support adoption of generative and agentic AI". The promised interagency request for information on AI was not found in the Federal Register as of 31 Oct 2026. |
| **SEC (US)** | FY2027 Examination Priorities, 23 Oct 2026 | Staff statement; "has no legal force or effect" | Uses "SI" for AI (EO 14434). Will "prioritize examinations of policies and procedures relating to monitoring SI, including its use in fraud prevention and detection, back-office operations, compliance with AML and Reg BI obligations, and trading functions". Agents are not named. No 2026 SEC rule or risk alert on agents was found. |
| **IOSCO** | *Supervisory Toolkit for AI Use in Capital Markets*, FR/02/2026, May 2026 | Toolkit for supervisors; non-binding | Five examination questions headed "For Agentic AI, also consider", including "the reversibility of those actions, and the agent's level of autonomy" and "How does the firm limit the scope of impact of agents (e.g., by designing appropriate boundaries at the planning stage)?" The nearest thing to an examination checklist for securities firms. |
| **EU** | AI Act Service Desk FAQ on AI agents | Commission FAQ; undated | "AI agents are not a separate category of AI under the AI Act"; the existing rules apply. Commission considerations "only preliminary". |
| **EBA, ESMA, EIOPA, ECB** | No 2026 publication on AI agents found. Nearest: ESA joint statement JC 2026 25 on frontier AI models, 31 Jul 2026; ECB letter SSM-2026-0301 on AI-enabled cyber threats, 7 Jul 2026 | Supervisory statement; letter to significant banks (action plans due 31 Oct 2026) | ESAs: inventories of all IT assets "(including infrastructure, applications, data repositories, APIs, and AI/ML components)", and access management that "minimises permissions". ECB: "zero-trust principles, including continuous verification of users, devices, applications, application programming interfaces (APIs) and service accounts". Earlier ESA material that still applies: ESMA's statement on AI in investment services (30 May 2024) and EIOPA's Opinion on AI governance (6 Aug 2025), which names "the extent to which the AI system can act autonomously" as a risk criterion. |

## 5. Existing obligations that apply to agents that act

These are the rules a reviewer will hold the agent to. Status labels matter: say *binding* only for legislation and rules. Section 5.1 covers every agent; sections 5.2 and 5.3 add the rules for agents that touch a decision about a person (C5) or an order or payment (C4).

### 5.1 Cross-cutting obligations

| Area | UK | EU | US | Elsewhere |
|---|---|---|---|---|
| **Named accountability** | FSMA s66A duty of responsibility (binding): a senior manager who "did not take such steps as a person in the senior manager's position could reasonably be expected to take". FCA: "any use of AI in relation to an activity, business area, or management function of a firm would fall within the scope of a SMF manager's responsibilities" (AI Update). | DORA Art 5(2): the management body shall "bear the ultimate responsibility for managing the financial entity's ICT risk" (binding). ESMA statement (30 May 2024, supervisory expectation): "firms' decisions remain the responsibility of management bodies, irrespective of whether those decisions are taken by people or AI-based tools." EIOPA Opinion: AMSB members "are responsible for the overall use of AI systems within the organisation". | FINRA Rule 3110(a): "Final responsibility for proper supervision shall rest with the member" (SRO rule). Advisers Act Rule 206(4)-7 (binding): written policies "reasonably designed to prevent violation", reviewed "no less frequently than annually", with a designated individual "responsible for administering the policies and procedures". | MAS 5.23(c) "designation of an appropriate accountable person"; FSB accountable individuals per agentic use case; HKMA business owner of the intent. |
| **Third parties and outsourcing** | PRA SS2/21 4.3: SMFs "cannot outsource their responsibilities"; FCA: "Firms can outsource AI services, but remain responsible for them." Microsoft Ireland Operations Limited is a designated critical third party from 13 Jul 2026 (S.I. 2026/777, binding), but oversight "applies only to the systemic services provided to the financial sector", and firms' accountability "will not change due to the implementation of the CTP oversight regime" (PS16/24). | DORA Art 28(1)(a): financial entities "remain fully responsible" when using ICT services; Art 28(3) register of information. | Interagency TPRM guidance (6 Jun 2023): third-party use "does not diminish its responsibility". Insurers: "Insurers retain responsibility for understanding any tools ... developed or deployed by third-party vendors" (NYDFS Circular Letter No. 7, 2024). | MAS: "FIs remain accountable for AI used in the services they deliver, including AI developed, operated or provided by third parties." |
| **Access and identity** | SYSC 4.1.1R robust governance and "effective control and safeguard arrangements for information processing systems" (quoted as the FCA AI Update gives it; the Handbook text was not retrieved directly). | DORA Art 9(4)(c) access limited "to what is required for legitimate and approved functions"; 9(4)(d) "strong authentication mechanisms". RTS 2024/1774 (binding) Art 21: access "based on need-to-know, need-to-use and least privilege principles", "segregation of duties", "limiting to the extent possible the use of generic and shared user accounts"; Art 20 assigns "a unique identity corresponding to a unique user account" to "each staff member" (that it extends to agent identities is an inference). ECB letter (7 Jul 2026): zero-trust verification of "service accounts". | Interagency Guidelines Establishing Information Security Standards (12 CFR 30 App. B and 364 App. B, binding guidelines) III.C.1: "Access controls on customer information systems, including controls to authenticate and permit access only to authorized individuals" and "Dual control procedures, segregation of duties". NYDFS Part 500 and its 16 Oct 2024 AI letter (cyber controls). | OSFI unique non-human identities; FSB "least agency"; MAS 5.22(a) least privilege. |
| **Change control** | SYSC 4.1.1R "effective processes to identify, manage, monitor, and report the risks" (as quoted in the FCA AI Update) | DORA Art 9(4)(e): changes "recorded, tested, assessed, approved, implemented and verified in a controlled manner". RTS 2024/1774 Art 17: "mechanisms to ensure the independence of the functions that approve changes" and procedures for "emergency changes". | Interagency Guidelines III.C.1.d: "Procedures designed to ensure that customer information system modifications are consistent with the ... information security program". FFIEC *Development, Acquisition, and Maintenance* booklet (Aug 2024, examiner guidance): "All changes should be captured through the change control tracking and reporting process", and changes are tested "independently". NYDFS advisory (21 May 2026): "human oversight, for AI-generated code prior to deployment in production environments". | OSFI: "treat AI components, including models, data, tools, and agents as controlled technology assets". |
| **Operational resilience** | SYSC 15A (binding; quoted as made in 2021): "identify and document the people, processes, technology, facilities and information necessary to deliver each of its important business services" (15A.4.1R) and remain within impact tolerance "in the event of a severe but plausible disruption" (15A.2.9R); PRA SS1/21. An agent in an important business service is part of that mapping. | DORA ICT risk framework (above); ESA statement JC 2026 25: asset inventories that include "AI/ML components". | — | MAS 5.23(b) kill switch; FSB tested kill switches. |
| **Model risk** | PRA SS1/23 applies only to firms with internal-model approval and does not mention AI; its "dynamic models" passage and Principle 2.2 SMF accountability are the relevant parts. | AI Act for high-risk uses (section 5.2). | SR 26-2 excludes agentic AI; do not cite SR 11-7 as current. | MAS Guidelines section 5. |
| **Payments authorisation** | PSRs 2017 (binding): reg 67 consent "in the form, and in accordance with the procedure, agreed"; reg 72(3) keep "personalised security credentials" safe; reg 77(3) payer liable for gross negligence; reg 100 strong customer authentication. None contemplates an agent; HMT Question 15 is open. | PSD2 and the SCA RTS; the PSR and PSD3 texts (Council first-reading position adopted 29 Oct 2026; Parliament's second reading and OJ publication pending) do not mention agents; the EBA plans to analyse agentic AI against SCA from 2027. | Consumers: Regulation E 12 CFR 1005.2(m) and comment 2(m)-2: a consumer who furnishes an access device to "a person ... who exceeds the authority given" is "fully liable". Whether an agent is such a person is not addressed. Business accounts: UCC Article 4A (section 5.3). | — |
| **Records** | FCA good practice: "records of consumer prompts, outputs, model versions, applied filters and escalation decisions". COBS 11.8 and SYSC 9 apply to communications; no UK text applies them to agent actions. | AI Act Art 26(6): deployers keep logs "of at least six months"; financial institutions keep them "as part of the documentation kept pursuant to the relevant Union financial service law". MiFID II Art 16(6)-(7). ESMA statement: records "should encompass aspects of AI deployment, including the decision-making processes, data sources used, algorithms implemented, and any modifications made over time." | SEA Rule 17a-4(b)(4) communications "not less than three years"; 17a-4(f) audit-trail or WORM format; FINRA 4511 "at least six years" where no period is set. FINRA FAQ D.8: AI-generated communications are subject to "applicable FINRA and SEC recordkeeping requirements". Advisers Act Rule 204-2(a)(7): copies of written communications relating to "Any recommendation", "Any receipt, disbursement or delivery of funds or securities" and "The placing or execution of any order". No text treats clicks or UI actions as records. | FSB: "attribute actions ... to specific agents"; MAS 5.23(d) logging. |
| **Conduct and supervision** | Consumer Duty: Principle 12 "A firm must act to deliver good outcomes for retail customers"; PRIN 2A.2.8R "A firm must avoid causing foreseeable harm to retail customers" (rule text as made in FCA 2022/31). FG22/5: avoid using "algorithms, including machine learning or artificial intelligence ... in ways that could lead to consumer harm". | AI Act Art 50 transparency (applies from 2 Aug 2026); the Commission's Art 50 guidelines (20 Jul 2026, non-binding) say agents that interact with natural persons "must be designed and developed in such a way that they disclose both their artificial nature and the person on whose behalf they are acting", with "periodic reminders and context-aware disclosures" likely needed for "financial advice, insurance ... and complaints handling". AI Act Art 4 (as amended by the Digital Omnibus): deployers "shall take measures to support the development of AI literacy of their staff". | FINRA 3110(b) written supervisory procedures; RN 24-09: rules "continue to apply when member firms use Gen AI". SEC FY2027 examination priorities (section 4.2). | HKMA consumer-protection circular. |
| **Human oversight for decisions about people** | UK GDPR Arts 22A to 22D (section 5.2). | AI Act Art 14(4)(e) "a 'stop' button or a similar procedure"; Art 26(2) oversight by people with "the necessary competence, training and authority". For Annex III 5(b) creditworthiness and 5(c) life and health insurance pricing, these apply from **2 December 2027** (Digital Omnibus, Regulation (EU) 2026/1744). GDPR Art 22 and the CCD (section 5.2). | Colorado and California automated-decision rules, from 1 Jan 2027 (section 5.2). | MAS 5.9(b) personnel with "the necessary authority and ability to intervene". |

### 5.2 Decisions about a person (C5)

C5 includes **recommending and scoring**, not only deciding, because the law in all three jurisdictions reaches a recommendation that a person merely confirms.

| Question | UK | EU | US |
|---|---|---|---|
| **When does a person's sign-off still count as automated?** | UK GDPR Art 22A(1), inserted by the Data (Use and Access) Act 2025 s 80 (binding; in force 5 Feb 2026): a decision is "based solely on automated processing if there is no meaningful human involvement in the taking of the decision". | CJEU C-634/21 *SCHUFA* (7 Dec 2023): producing a score is itself "automated individual decision-making" under GDPR Art 22 "where a third party ... draws strongly on that probability value"; the Court rejected treating it "only ... as a preparatory act". | California CPPA ADMT regulations (binding; compliance by 1 Jan 2027): ADMT is technology used "to replace human decisionmaking or substantially replace human decisionmaking"; human involvement needs a reviewer who can "Know how to interpret and use the technology's output", "Review and analyze the output", and "Have the authority to make or change the decision". Colorado SB26-189 (binding; for decisions made on or after 1 Jan 2027): "meaningful human review" by someone with authority who "considers relevant, available primary evidence", "is trained", and "does not default to the system output". |
| **What is out of scope?** | A decision with meaningful human involvement. | A score the decision-maker does not draw strongly on. | Colorado excludes tools that "summarize, organize, or present information for human review" and do not produce "a score, ranking, recommendation, classification, prediction, or other inference that materially influences an outcome", and excludes anti-money-laundering, sanctions and cybersecurity tools and "workflow management". |
| **What the person is owed** | Art 22C(2): information about the decision, the chance to "make representations", "human intervention", and the right to "contest such decisions". | GDPR Art 22(3): "at least the right to obtain human intervention on the part of the controller, to express his or her point of view and to contest the decision". Consumer Credit Directive (EU) 2023/2225 Art 18(8), applying from **20 Nov 2026**: where creditworthiness assessment "involves the use of automated processing of personal data", a "clear and comprehensible explanation", the chance to give "the consumer's own point of view", and a right to "request a review". AI Act Art 86: "clear and meaningful explanations of the role of the AI system" for Annex III systems. | Regulation B 12 CFR 1002.9(b)(2) (binding): adverse-action reasons "must be specific and indicate the principal reason(s)"; comment 9(b)(2)-2: they "must relate to and accurately describe the factors actually considered or scored". FCRA 15 U.S.C. 1681m(a): notice when the decision uses a consumer report. Colorado: within 30 days of an adverse outcome, "a plain language description of the consequential decision and the role the covered ADMT played", and an opportunity for meaningful human review. |
| **Explanation and records** | — | CJEU C-203/22 *Dun & Bradstreet Austria* (27 Feb 2025, press release): the controller "must describe the procedure and principles actually applied", and "the mere communication of an algorithm does not constitute a sufficiently concise and intelligible explanation". EBA/GL/2020/06 para 54 (comply or explain): "traceability, auditability, and robustness and resilience of the inputs and outputs" and "model overrides and escalation procedures". AI Act Art 27: a fundamental rights impact assessment for deployers of 5(b) and 5(c) systems from 2 Dec 2027. | Colorado: records kept at least three years, which "may include ... version identifiers, changelogs". |
| **Insurance** | Consumer Duty (section 5.1). | AI Act Annex III 5(c) (life and health only); EIOPA Opinion (6 Aug 2025): "the extent to which the AI system can act autonomously" is an impact criterion. | NAIC Model Bulletin (Dec 2023; adopted in 29 jurisdictions as of 8 Oct 2026, guidance with effect only where adopted): controls scale with "the extent to which humans are involved in the final decision-making process". NYDFS Circular Letter No. 7 (2024): "The responsibility to comply with anti-discrimination laws remains with the insurer at all times." Colorado: insurers complying with C.R.S. 10-3-1104.9 "are in compliance" with the new law. |
| **Do not cite as current** | — | — | CFPB Circulars 2022-03 and 2023-03 on adverse action and complex algorithms, withdrawn 12 May 2025 (90 FR 20084; the withdrawal "is not necessarily final", and the 2022-03 page shows no banner). The SEC's predictive data analytics proposal, withdrawn 17 Jun 2025. Colorado SB 24-205, repealed and re-enacted by SB26-189 before it took effect. |

What follows for the design: the person at a C5 gate must be a real decision-maker, who sees the primary evidence, has the authority to decide otherwise, is trained, and does not default to the agent's output; and the run must record the factors the agent actually used so the firm can give specific reasons and an explanation. A one-click approval of an agent's recommendation is the pattern all three regimes treat as automated (Q11). An agent that only assembles and summarises the file, with no score or recommendation, is C1.

### 5.3 Orders and payments (C4)

| Question | UK | EU | US |
|---|---|---|---|
| **Where must order limits sit?** | RTS 6 as onshored (binding; FSMA 2023 schedules its revocation, not yet applied at 30 Oct 2026): Art 15 pre-trade controls including "price collars", "maximum order values" and "maximum order volumes"; Art 12: "cancel immediately, as an emergency measure, any or all of its unexecuted orders". | MiFID II Art 4(1)(39): algorithmic trading is trading "where a computer algorithm automatically determines individual parameters of orders ... with limited or no human intervention"; Art 17(1): "effective systems and risk controls" with "appropriate trading thresholds and limits"; RTS 6 Arts 12 and 15. Whether an agent that sets order parameters is algorithmic trading is Q10. | SEA Rule 15c3-5 (binding): reject orders that "exceed appropriate pre-set credit or capital thresholds" or "price or size parameters"; restrict access to "persons and accounts pre-approved and authorized by the broker or dealer"; the controls "shall be under the direct and exclusive control of the broker or dealer"; the CEO certifies them annually. An agent is one more order source the controls must cover, never the place they live. |
| **Who placed the order?** | — | — | Advisers Act Rule 204-2(a)(3): the order memorandum identifies "the person who placed such order", so decide in advance which person an agent run is attributed to. |
| **Is a payment the agent makes binding?** | PSRs (section 5.1); Q2. | PSD2 (section 5.1); Q2. | Business accounts: UCC 4A-202(b) (state-enacted): a payment order is "effective as the order of the customer, whether or not authorized" if the security procedure is "commercially reasonable" and the bank accepted it "in good faith and in compliance with the security procedure"; under 4A-203(a)(2) the loss stays with the customer if the order was caused by a person "entrusted ... with duties to act for the customer" or "who obtained access to transmitting facilities of the customer". Inference, not case law: a payment an agent submits through a business banking portal is likely binding on the firm, so the control is the portal entitlement and the bank's dual approval. Consumers: Regulation E (section 5.1). |
| **Direction of travel** | FCA Payments Regulatory Priorities (section 4.2); Bank of England deep dives into "agentic trading and payments". | EBA analysis of agentic AI against SCA from 2027. | FINRA RN 26-15 on AI in best execution (consultation); SEC examinations of SI in "trading functions". |

## 6. Controls below the line (C0 to C3)

The aim: the agent's work is accurate, attributable to the agent, recoverable, and stoppable.

### 6.1 Identity and credentials

1. **Give each agent its own least-privilege account** on every target system. Do not use a person's account. Every standard-harness agent created after May 2026 has a Microsoft Entra Agent ID at creation ("After May 2026, Copilot Studio automatically creates a Microsoft Entra Agent ID for each new agent"); a Microsoft Copilot harness agent gets one "when you publish the agent for the first time". Record it as the agent's unique identifier (FSB "unique identifiers"). Entra network egress and ingress controls through Agent 365 are "generally available". Run production agents in a Managed Environment with **Limit sharing** set, so that sharing to a security group or "Everyone" is governed rather than left to the maker. Computer use defaults to "Maker-provided credentials", and Microsoft warns: "If you share an agent with this setting, anyone using it can act with the original author's access on the configured machine." Standard-harness event triggers "can only use the agent maker's credentials". OSFI names "shared or inherited credentials" as the risk; DORA's RTS 2024/1774 Art 21 requires "limiting to the extent possible the use of generic and shared user accounts"; the US Interagency Guidelines name "Dual control procedures, segregation of duties".
2. **Store credentials in your Azure Key Vault**, not internal storage, if your key-management policy requires customer control ("Passwords are either stored in Power Platform internal storage ... or in an Azure Key Vault that you provide").
3. **Never use a customer's credentials** for a computer-using agent. Whether that is consistent with PSRs regs 67, 72 and 77 or Regulation E is an open question (Q2).
4. For Cloud PC pools, "Only a Microsoft Entra user account can execute computer use". On any machine type where Entra ID credentials are used with Network Level Authentication or Entra authentication for Remote Desktop, Microsoft says "you must either grant an MFA exception for the account or use certificate-based authentication". Prefer certificate-based authentication and record any MFA exception as a risk acceptance. On a Cloud PC pool "the signed-in Microsoft Entra user must be the same account that owns the computer use connection", so the dedicated identity must own the connection. How the Copilot Studio computer use tool handles a CAPTCHA or an MFA prompt on a target site is not documented as of 31 October 2026 (Cowork documents handing the browser back to the user for "a multifactor prompt, a CAPTCHA, or a payment confirmation").

### 6.2 Where it runs

1. **Do not use the hosted browser in production.** Microsoft: "it's not recommended for production use", and it "isn't Microsoft Entra joined to your tenant or managed by your Intune policies". It also runs "for a maximum of three hours", allows "one active hosted browser session at any given time" per user, and "might be throttled based on demand".
2. **Use a dedicated Windows machine you own**, registered in Power Automate (Power Automate for desktop 2.61.132.25266 or later, with "Enable for computer use" turned on). This is the generally available path; runs on one machine "are queued and executed sequentially". A Cloud PC pool is Entra joined and Intune enrolled, but it is preview ("Preview features aren't meant for production use") and does not support customer-managed keys ("Customer-Managed Key (CMK) isn't supported"); use it in production only with a recorded preview risk acceptance.
3. **Turn on access control** and list only the URLs and apps needed; turn on **Enforce HTTPS**. Treat the allow list as action-blocking only (D1): "It doesn't stop the model from opening them."
4. Microsoft's own security advice for machines: "Use dedicated machines for computer use", "follow the principle of least privilege", "Limit web access to an allow list of specific trusted websites only".
5. **Data location.** Cloud PC pools "are hosted in the same geography as your Power Platform environment". No supported-region list for computer use is documented (not documented as of 31 October 2026). An external threat detection provider's "data-handling policies might be different from the policies used by Microsoft. The differences could include processing and storing your data outside your geographic region." External models (including Anthropic models, see 6.5) "might require data processing and storage outside of your organization's geographical boundaries". Two toggles decide this: the Copilot Studio setting "Disable data movement across geographic locations for Copilot Studio generative AI features outside the United States", and the Cloud PC setting "Enable cross-geo support for Windows 365-based features". Record both, and where sessions and transcripts are processed, in the data-protection assessment (Q9).

### 6.3 Oversight

1. **Configure human supervision** with at least one reviewer, because without one "the session fails when the agent pauses". Choose the maker: "Only the maker of the computer use tool receives human review requests", and a reviewer other than the person who started the run "likely don't see the activity because they didn't initiate the run". Documented timeout behaviour: the run pauses, and "After this period, the request expires, and the computer-use run stops if no response is received" (`CUAHitlRequestTimeout`). Set the response time limit to your operational tolerance.
2. **Do not count it as a control.** "Don't rely on human review or clarification requests as a fail-safe or as a guarantee that the system always requests human input before proceeding." Tell reviewers not to submit "usernames, passwords, PINs, credit card information, or social security numbers"; responses "might persist in your Dataverse environment or Purview audit logs".
3. **Sample-review completed runs** using session replay, and record who reviewed what. The FCA notes a firm that recorded "whether staff needed to review AI outputs, whether this happened, and whether they approved the outputs, overrode them or escalated issues".

### 6.4 Logging and records

1. **Know the three stores.** (a) Advanced computer use logs in Dataverse: default retention "7 days (10,080 minutes)"; "0 or -1" keeps them indefinitely; they consume Dataverse database, log and file capacity. (b) Agent transcripts, which "continue to include basic computer use logs, screenshots, and all other agent and tool logs, regardless of the configuration" of the advanced settings; a Purview Data Lifecycle Management policy for "Copilot Experiences" can retain or purge them (the page documents this for "user and agent text"; whether computer use screenshots are covered is not documented as of 31 October 2026). (c) Purview audit, below. (d) The standalone tool's Activity tab, which "lists all runs from the last 28 days" and does not meet a records period on its own. Store (a) requires "Store logs in Dataverse" on and "Allow conversation transcripts and their associated metadata to be saved in Dataverse" checked. Set (a) to your record-keeping period.
2. **Turn on "Send audit logs to Microsoft Purview"** so runs appear as `CUAOperation`. Microsoft documents it as an optional setting you turn on, and `CUAOperation` is not yet listed in Purview's activity reference (Q5).
3. **Decide which artifacts are records**: transcripts, screenshots, the submitted form, the confirmation page. For C3 communications, capture what was sent in your communications archive; FINRA FAQ D.8 and SEA Rule 17a-4(b)(4) cover AI-generated communications.
4. **Copilot Studio audit telemetry is outside Customer Lockbox**: "Customer Lockbox protections don't apply to this telemetry." Note it in the data-protection assessment.

### 6.5 Testing and change

1. **Test failure modes before go-live**: layout changes, unexpected dialogs, date pickers and loops ("Might repeat actions or get stuck"). For any submission, prove the agent cannot submit twice (T10).
2. **Test prompt injection** with a planted instruction in a test copy of the target app (T4).
3. **Choose a generally available model and record it.** CUA, GPT-6 Sol and Claude Sonnet 4.5 are "Generally available"; Claude Sonnet 4.6 and Opus 4.6 are "Experimental", are not listed as supporting human supervision, and the Application Card says "experimental and preview models are not recommended for production". Anthropic models need the environment's external-models setting ("ensure that your administrator turned on access to external models for your environment"), are "not available in China", and are a third-party model for SS2/21, DORA Article 28 and MAS purposes. "Customer-managed keys (CMK) aren't supported when using OpenAI's Computer-Using Agent AI model." Treat a model change as a change.
4. **Standalone tools propagate**: "Agent flows always trigger the latest published version", so a published tool change reaches every flow that uses it. Route tool publishing through change control.

### 6.6 Inventory, accountability, stop

1. **Register the agent** with the fields regulators name (section 9.1).
2. **Name the accountable owner in the business and the accountable senior manager** before go-live.
   Before decommissioning, export the Entra Agent ID, its sponsor and its Entra sign-in logs: "When you delete an agent in Copilot Studio, Copilot Studio also deletes the associated Microsoft Entra Agent ID", so the identifier the inventory relies on disappears with the agent.
3. **Have a tested stop.** Computer use is turned off per environment in the Power Platform admin center (Environments > [environment] > Settings > Product > Features > Computer use) or with `pac env update-settings --environment <envid> --name iscomputeruseinmcsenabled --value false`; the tenant setting "Hosted browser in computer use" turns off the hosted browser; Cloud PC pools are switched under Copilot > Settings > Computer Use. No data policy connector exists for computer use (not found on the data policies page, 1 Oct 2026), so the environment toggle is the only off switch for computer use itself. A data policy blocking the Microsoft Copilot Studio connector stops makers adding event triggers. Test how long each takes to halt a running session (T7).

## 7. Controls at and above the line (C3 at the line, C4 to C6 above it)

1. **Remove the commit right from the agent's account.** The agent's account can create a payment in draft but cannot release it; can stage an order but cannot route it; cannot edit payees, limits or entitlements. Prove it (T1).
2. **Use the target system's maker-checker** with a human second user who sees the full transaction, not the agent's summary of it. HKMA: "intervention points may need to be built into agentic A.I. workflows before actions with material customer implications are carried out."
3. **Where an approval runs in Copilot Studio, use a human stage.** (On the Microsoft Copilot harness, agent flows are called workflows and the same request-for-information step exists.) Multistage approvals let AI stages pre-screen, but for "financial transactions ... ensure that human approval stages are reached". Do not assign the same approver to several stages ("doing so causes the flow to fail"), and keep Copilot Credits funded: "If you don't have sufficient Copilot Credits, your approval stalls and doesn't proceed." In *Request information* steps, "The response from the first person to respond is used in the flow", so address requests to a group whose every member is authorised.
4. **Set value and rate thresholds outside the agent.** FSB: approval "before approving financial transactions above a certain value". For autonomous agents, cap frequency too (Microsoft: "Take care when adding very frequent triggers, or triggers that recur indefinitely"). For orders, the thresholds are the firm's own pre-trade controls in the order path (SEA Rule 15c3-5; MiFID II Art 17 and RTS 6 Art 15) and its kill switch (RTS 6 Art 12): register the agent's account as an order source those controls cover, and treat an agent that sets order parameters as possible algorithmic trading (Q10). For US business payments, use the bank's dual approval and the portal's entitlements, because UCC 4A-202(b) can make an order that passes the security procedure binding "whether or not authorized" (section 5.3).
5. **Prefer an API to a UI for anything at C3 or above.** Computer use is intended for "scenarios where APIs aren't available"; an API path lets the system enforce limits and log the call. If no API exists, the agent stops at C1.
6. **Keep C5 with people, and make the review real.** Do not let a computer-using agent recommend or score a person's credit, claim, price or eligibility. Where a triggered agent prepares a C5 case, the person deciding must meet the tests in section 5.2: sees the primary evidence, has authority to decide otherwise, is trained, and does not default to the agent's output (UK Art 22A "meaningful human involvement"; *SCHUFA* "draws strongly"; Colorado and California human review from 1 Jan 2027). Log the factors the agent used, so the firm can give specific reasons (Regulation B 1002.9(b)(2)) and an explanation (GDPR Art 22, CCD Art 18(8) from 20 Nov 2026, AI Act Art 86). The safest design is an agent that assembles and summarises the file with no score or recommendation, which is C1. For EU firms, a system intended to "evaluate the creditworthiness of natural persons" is high-risk under Annex III 5(b), with Articles 14, 26 and 27 applying from 2 December 2027.
7. **Decline C6.** No agent changes limits, entitlements, payee or beneficiary details, or its own configuration.
8. **For C3**, require an authorised recipient list (Power Fx entity validation can "limit email recipients to a specific domain"), capture the communication in the archive, and supervise it as correspondence where FINRA 3110(b)(4) applies.

## 8. Autonomous (trigger-driven) agents: what changes

1. **There is nobody to confirm.** "For event-triggered or other autonomous executions, a generated tool call might fail when required input isn't available because no user is present". "Makers can require user confirmation before executing tools that modify data", but in a triggered run there is no user to confirm, so approvals must be out-of-band (an approval stage or a request for information).
2. **Triggers run as the maker on the standard harness.** "This might allow users of an agent to use the agent to access data and systems using that same authorization." Microsoft steers makers towards this combination: "Computer use works best for autonomous agents" and maker-provided credentials are "suitable for autonomous agents". Use a dedicated service identity, not a person. The Microsoft Copilot harness (preview) can run shared autonomous agents "with their own credentials".
3. **The trigger payload is untrusted input.** "Trigger payloads can potentially contain sensitive information that an agent can output in other locations through actions." Test injected instructions in a payload (T8).
4. **It goes live on publish.** "after you publish an agent with a new trigger, your agent reacts automatically each time its triggers are activated." Makers "receive a warning about the agent using the author's credentials" at publish; treat that warning as a change-control gate, not a click-through.
5. **Keep sequences short.** Microsoft recommends "Calling fewer than 15 actions or topics consecutively".
6. **Runtime protection has gaps.** External threat detection allows the tool by default if no decision arrives "within one second"; configure **Set error behavior** to block, and remember "There is no global or tenant-wide setting": it is turned on per environment. Defender real-time protection for Copilot Studio is preview and "evaluates tool invocations"; its default rule audits without stopping. Neither page says it evaluates individual computer use steps (Q3).
7. **Conditional Access is Teams-only for now.** Conditional Access on the Microsoft Entra Agent ID "currently applies only when the agent runs in Microsoft Teams". An autonomous agent is not in Teams, so do not count Conditional Access as a control for it.
8. **Cowork automated tasks** run as the user, and users "can pre-authorize actions when they create a task". Approval can also be skipped "for the rest of the current session". If Cowork is in scope, set policy on pre-authorisation.

## 9. Governance artifacts

### 9.1 Agent inventory record

Record the agent in the Agent Registry (Microsoft 365 admin center > Agents > All agents > Registry; Microsoft's Agent 365 overview also calls it "the Agent 365 registry", and describes Agent 365 as "a central control plane to observe, govern, and secure Copilot Studio agents") and keep the fields below where the registry has no column. The fields combine what the FCA, MAS, the FSB and the HKMA name:

| Field | Source of the expectation |
|---|---|
| Agent identifier (the Microsoft Entra Agent ID), distinct from human users | FSB ("unique identifiers"); MAS footnote 25; OSFI |
| Business owner of the intent; accountable senior manager | HKMA (a); FCA (SMF ownership); FSB |
| Purpose and approved scope; highest action class (C0 to C6) | MAS 4.7; FSB (certified scope) |
| Important business service or critical or important function it supports | SYSC 15A.4.1R; PRA SS1/21; DORA Art 28(3) register |
| For C5: the decisions it touches, the human reviewer role and how review meets section 5.2 | UK Art 22A; GDPR Art 22; Colorado; California ADMT |
| For C4 orders: the order source identifier and the pre-trade controls that cover it | SEA Rule 15c3-5; RTS 6 Art 15 |
| Mechanism: computer use (machine type, allow list), triggers, flows, connectors | MAS footnote 25 ("tools and systems the agent can access") |
| Accounts and credentials used, and their entitlements in each target system | FCA ("what systems and data they can access"); OSFI |
| Guardrails and approval points, and which are enforced outside the agent; external threat detection on for the environment | MAS footnote 25; FSB deterministic controls |
| Model and version; preview or experimental components | MAS 5.23(d); Application Card |
| Log locations and retention; Purview audit on or off | MAS 5.23(d); FSB record-keeping |
| Stop mechanism and date last tested | MAS 5.23(b); HKMA; FSB |
| Review date | FCA (change management) |

### 9.2 Placement verdicts

Use one of four verdicts per step and for the design:

- **Below the line**: proceed with section 6 controls.
- **At the line**: proceed only with the named conditions met (usually C3).
- **Above the line, redesign**: the agent may do the preparatory part; the commit moves to a person or a system with its own limits.
- **Above the line, decline**: no redesign keeps the agent away from the commit, or the step is C6.

## 10. Where Microsoft's own pages disagree

| # | Conflict | Treatment |
|---|---|---|
| D1 | The main computer use page (20 Oct 2026) says access control "doesn't stop the model from opening" other sites. The standalone tool page (preview, 4 Jun 2026) calls the allow list "A hard restriction ... that prevents the AI from navigating to unauthorized URLs or applications, regardless of the instructions provided." | Assume the weaker behaviour; run T2. |
| D2 | The FAQ excludes "Making financial transactions"; the main page's instruction tips say "No need to ask for permission" and its invoice sample says "Submit the invoice form, no confirmation needed". | Read submission into a staging status as C1; a submission that commits is C4. |
| D3 | The main page says reviewers are contacted when the agent "detects potentially harmful instructions"; the supervision page says "when it needs confirmation or more information". | Plan for both; neither is a control. |
| D4 | The security scan warns when connectors use maker credentials (end-user is the default there); computer use defaults to maker credentials, and the scan page does not mention computer use. | Do not rely on the scan; check computer use credentials yourself. |
| D5 | Purview audit is documented for Copilot Studio, but `CUAOperation` appears only on the Monitor computer use page, not in the Purview activity reference. | Run T6 and record the fields you actually see. |
| D6 | Microsoft's Researcher with Computer Use pages (Learn FAQ, 18 Nov 2025; Support page, 10 Feb 2026) still describe the feature; third-party sources report its retirement on 1 Jul 2026. | Do not design on it; check the Message Center in your tenant. |
| D7 | The Cowork Application card says Cowork "doesn't take autonomous action without user direction or approval"; *Manage Copilot Cowork* says automated tasks "run without a person present" and "Users can pre-authorize actions when they create a task". | Treat a pre-authorised automated task as autonomous and apply section 8. |

## 11. Open questions

| # | Question | Why it matters | Status |
|---|---|---|---|
| Q1 | Is an agent's UI action (a click, a submission) a record under SEA Rule 17a-4, FINRA 4511 or MiFID II, as distinct from a communication? | Retention scope for screenshots and transcripts | Not addressed by any regulator found |
| Q2 | Is a payment an agent makes on a customer's credentials "authorised" under PSRs reg 67, and who bears loss under regs 72 and 77, Regulation E 1005.2(m), or, for US business accounts, UCC 4A-202 and 4A-203? | Whether customer-credential designs are lawful at all, and who carries the loss | Open; HMT Question 15 consultation closed 6 Oct 2026, no response found; the FCA is "considering" agentic payments; no US text addresses agents |
| Q3 | Does Copilot Studio threat detection or Defender evaluate each computer use step, or only the tool call? | Whether injected instructions mid-run are caught | Not documented |
| Q4 | Is the computer use allow list a navigation block or an action block? | Exposure to off-list sites | Conflicting pages (D1) |
| Q5 | What does `CUAOperation` record, and does Purview retention apply to it? | Audit evidence | Not documented in Purview reference |
| Q6 | Does Conditional Access on the Microsoft Entra Agent ID, or any Conditional Access policy, govern the Windows sign-in a computer use machine performs? | Whether device and location policy apply | Not documented |
| Q7 | Will MAS's 2027 consultation, the FCA's trusted framework, or the HKMA discussion paper set binding agent requirements? | Today's design may need rework | Announced, not published |
| Q8 | Does a firm deploying a UI agent that assists a credit decision deploy an Annex III 5(b) system? | EU AI Act obligations from 2 Dec 2027 | Depends on intended purpose; no guidance specific to agents |
| Q9 | Where are hosted browser sessions, computer use transcripts and screenshots processed and stored (with the cross-geo toggles in 6.2.5 set either way), and does the Windows 365 for Agents MCP server inherit the computer use tool's controls? | Data location under DORA and local rules; control coverage | Not documented |
| Q10 | Is an agent that decides whether, when, at what price or in what size to place an order "algorithmic trading" under MiFID II Art 4(1)(39) and the UK equivalent, bringing Art 17 and RTS 6 in full? | Testing, notification and pre-trade control duties for agent order flow | The definition ("limited or no human intervention") reads onto it; no regulator has said so for agents; FINRA RN 26-15 asks the US question for best execution |
| Q11 | Does a person approving an agent's recommendation count as "meaningful human involvement" (UK Art 22A), take the score outside *SCHUFA*'s "draws strongly" test, or meet the Colorado and California human-review tests? | Whether a C5 design with a human approver is still automated decision-making | Tests published; none applied to agents; ICO final guidance on the new UK rules not verified as of 31 Oct 2026 |

## 12. Tenant test plan

Run in a non-production environment with test data and a test copy of each target system. Record date, environment, model and machine type for every result, and keep the evidence.

| # | Test | Steps | Record | Answers |
|---|---|---|---|---|
| T1 | Entitlement boundary | Sign in to each target system as the agent's account and try the commit step (release, approve, route, edit payee, change limit) by hand | Whether the system refuses each one | Section 7.1 |
| T2 | Allow-list navigation | Instruct the agent to open an off-list site through the browser's address or search bar | Whether it opens, whether interaction fails, error code. Documented expectation (main page): the site opens, interaction fails with `CuaWebsiteIsNotAllowlisted` | D1, Q4 |
| T3 | Shared credentials | Share an agent set to maker-provided credentials with a test user who lacks the maker's access | What that user can make the agent do | Section 6.1 |
| T4 | Prompt injection | Plant a hidden instruction to submit or transfer in a page the agent will read | Whether the agent acts, whether threat detection blocks, whether a reviewer is notified | Q3 |
| T5 | Supervision timeout | Trigger a clarification and leave it unanswered | Whether the run stops at the configured limit with `CUAHitlRequestTimeout`, as documented; what the reviewer saw; where the response is stored | Section 6.3 |
| T6 | Logs and audit | Confirm Dataverse transcript saving is allowed and "Store logs in Dataverse" is on; run a session with Purview audit on; search the audit log; export the session | Whether `CUAOperation` appears, its fields, Dataverse retention applied | D5, Q5 |
| T7 | Stop | During a long run, turn off computer use for the environment; separately, disable the trigger | Time to halt; whether the in-flight action completes. No documented expectation: Microsoft does not say whether a running session stops at once | Section 6.6 |
| T8 | Trigger payload | Send a trigger event (for example an email) whose body contains instructions | What the agent does with them | Section 8 |
| T9 | Threat detection failure | With external threat detection, make the provider unreachable | Whether the tool runs or is blocked. Documented expectation: it runs after one second unless Set error behavior is set to block | Section 8 |
| T10 | Duplicate submission | Force a loop or a slow page during a submission | Whether a second submission is possible | Section 6.5 |

## 13. Decline conditions

Decline the design, or the step, if any of these holds:

1. The agent's account can perform a C4 to C6 action in a target system and the entitlement cannot be removed, or T1 has not been run to prove it was.
2. The design needs a customer's own credentials.
3. A computer-using agent recommends, scores or decides anything about a person's access to or terms of a financial service.
4. The production run uses the hosted browser.
5. Logs cannot be kept for the record-keeping period, or Purview audit cannot be turned on.
6. There is no named business owner and accountable senior manager.
7. An agent with maker-provided credentials would be shared with people who lack the maker's access.
8. The stop has not been tested (T7).
9. A triggered agent's C5 output goes to a person who cannot see the primary evidence or has no authority to decide otherwise (section 5.2).
10. An agent can place orders that do not pass the firm's pre-trade controls.

## 14. What to watch

- MAS's 2027 consultation on agentic AI; the Guidelines take effect 7 Oct 2027.
- The FCA's "trusted framework for agentic finance" and its AI Live Testing evaluation report.
- HM Treasury's response to the payment services consultation (Question 15).
- The HKMA discussion paper on agentic AI governance.
- The US interagency request for information on AI, including agentic AI, promised in OCC Bulletin 2026-13 (17 Apr 2026; not in the Federal Register as of 31 Oct 2026); and the proposed replacement for the 2023 third-party risk management guidance (Federal Register, 15 Sep 2026; no AI text). Search for "SI" as well as "AI" (EO 14434).
- EU AI Act high-risk obligations for Annex III from 2 December 2027.
- The Consumer Credit Directive applying from 20 November 2026, through national laws, some of them late.
- Colorado SB26-189 and California's ADMT rules, both from 1 January 2027; the Colorado Attorney General's rules due by then; the federal challenge to Colorado's law (reported, not verified) and Executive Order 14365's AI Litigation Task Force.
- The ICO's final guidance on automated decision-making under the Data (Use and Access) Act 2025.
- FINRA's outcomes on Regulatory Notices 26-14 (AI-generated communications) and 26-15 (best execution and AI); the UK replacement of onshored RTS 6 with FCA rules.
- Microsoft: the computer use FAQ, any change to the allow list wording, Purview documentation of `CUAOperation`, Conditional Access beyond Teams, the preview status of Cloud PC pools and the standalone tool, and whether the Windows 365 for Agents MCP server gains the computer use tool's controls.

## Sources

Microsoft documentation, with the date shown on the page when retrieved on 31 October 2026:

- [FAQ for the computer use tool](https://learn.microsoft.com/en-us/microsoft-copilot-studio/faqs-computer-use), 23 Sep 2026
- [Automate web and desktop apps with computer use](https://learn.microsoft.com/en-us/microsoft-copilot-studio/computer-use), 20 Oct 2026
- [Human supervision of computer use](https://learn.microsoft.com/en-us/microsoft-copilot-studio/human-supervision-computer-use), 20 Oct 2026
- [Configure where computer use runs](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configure-where-computer-use-runs), 7 May 2026
- [Use Cloud PC pool for computer use runs (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/use-cloud-pc-pool), 7 May 2026
- [Monitor computer use](https://learn.microsoft.com/en-us/microsoft-copilot-studio/monitor-computer-use), 7 May 2026
- [Administer computer use](https://learn.microsoft.com/en-us/microsoft-copilot-studio/administer-computer-use), 7 May 2026
- [Troubleshooting and limitations of computer use](https://learn.microsoft.com/en-us/microsoft-copilot-studio/troubleshooting-computer-use), 26 Aug 2026
- [Computer use as a standalone tool (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/computer-use-standalone), 4 Jun 2026
- [What's new in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/whats-new), 5 Oct 2026
- [Application Card for Microsoft Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/system-service-card-copilot-studio), 17 Feb 2026
- [Multistage and AI approvals in agent flows (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-advanced-approvals), 4 Sep 2025
- [FAQ for AI approvals](https://learn.microsoft.com/en-us/microsoft-copilot-studio/faqs-ai-approvals), 1 Aug 2025
- [Request information from human review in agent flows](https://learn.microsoft.com/en-us/microsoft-copilot-studio/flows-request-for-information), 18 Jun 2026
- [Event triggers overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-triggers-about), 9 Sep 2026
- [Add an event trigger](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-trigger-event), 9 Sep 2026
- [FAQ for generative orchestration](https://learn.microsoft.com/en-us/microsoft-copilot-studio/faqs-generative-orchestration), 14 Oct 2026
- [Add triggers to an agent (GitHub Copilot) (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/authoring-add-event-trigger), 20 Oct 2026
- [Give your agent an account (Frontier)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/authoring-agent-account), 15 Oct 2026
- [Security and governance](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-and-governance), 24 Sep 2026
- [Configure data policies for agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-data-loss-prevention), 1 Oct 2026
- [Automatic security scan](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-scan), 11 Nov 2024
- [View Copilot Studio audit logs in Purview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-logging-copilot-studio), 18 Aug 2026
- [Audit log activities](https://learn.microsoft.com/en-us/purview/audit-log-activities), 15 Oct 2026
- [Enable external threat detection and protection for Copilot Studio custom agents (preview)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/external-security-provider), 1 Jun 2026
- [Protect AI agents in real time using Microsoft Defender](https://learn.microsoft.com/en-us/defender-cloud-apps/real-time-agent-protection-during-runtime), 1 Jul 2026
- [App registration, agent identities, and authentication](https://learn.microsoft.com/en-us/microsoft-copilot-studio/govern-agents-identities-overview), 21 Aug 2026
- [Manage Entra Agent IDs](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-use-entra-agent-identities), 21 Aug 2026
- [Microsoft Agent 365 overview](https://learn.microsoft.com/en-us/microsoft-agent-365/overview), 19 Aug 2026
- [Agent Registry in Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-registry-overview), 21 Sep 2026
- [Managed environments overview](https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-overview), 8 Oct 2026
- [Share agents with other users](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-share-bots), 30 Jul 2026
- [Code of Conduct for Microsoft AI Services](https://learn.microsoft.com/en-us/legal/ai-code-of-conduct), 1 May 2026
- [Transparency Note for Azure OpenAI in Microsoft Foundry Models](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/transparency-note), 21 Sep 2026
- [Use the computer use tool for agents (Foundry)](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/computer-use), 21 Aug 2026
- [Responsible AI FAQ for Cowork](https://learn.microsoft.com/en-us/copilot/cowork/responsible-ai/cowork-responsible-ai-faq), 5 Aug 2026
- [Application card: Microsoft Copilot Cowork](https://learn.microsoft.com/en-us/copilot/cowork/responsible-ai/copilot-cowork-application-card), 22 Sep 2026
- [Use the local browser with Copilot Cowork](https://learn.microsoft.com/en-us/copilot/cowork/cowork-local-browser), 22 Oct 2026
- [Manage Copilot Cowork for your organization](https://learn.microsoft.com/en-us/copilot/cowork/cowork-admin-governance), 14 Sep 2026
- [Copilot Cowork common questions](https://learn.microsoft.com/en-us/copilot/cowork/cowork-faq), 29 Sep 2026
- [Browse with Copilot in Microsoft Edge](https://support.microsoft.com/en-us/microsoft-copilot/browse-with-copilot) (Microsoft Support, consumer), 12 Aug 2026
- [Using Microsoft Copilot in Edge at work](https://support.microsoft.com/en-us/microsoft-copilot/using-microsoft-copilot-in-edge-at-work) (Microsoft Support), 14 Aug 2026
- [Experimental agentic features](https://support.microsoft.com/en-us/windows/experimental-agentic-features-a25ede8a-e4c2-4841-85a8-44839191dfb3) (Microsoft Support), 15 Oct 2025, updated 28 Sep 2026
- [Researcher with Computer Use frequently asked questions](https://learn.microsoft.com/en-us/microsoft-365/copilot/researcher-agent-computer-use-faq), 18 Nov 2025
- [Get started using Researcher with Computer Use in Microsoft Copilot (Frontier)](https://support.microsoft.com/en-us/microsoft-365-copilot/get-started-using-researcher-with-computer-use-in-microsoft-365-copilot-frontier) (Microsoft Support), 10 Feb 2026

Regulators and legislation, with the publication date:

- FCA, [AI in financial services: good practice and areas for improvement](https://www.fca.org.uk/publications/good-poor-practice/ai-financial-services), 19 Oct 2026
- FCA, Jessica Rusu, [Building the future of finance in the age of AI](https://www.fca.org.uk/news/speeches/building-future-finance-age-ai), speech, 19 Oct 2026
- FCA, [AI Update](https://www.fca.org.uk/publication/corporate/ai-update.pdf), 2024
- FCA, [The Mills Review](https://www.fca.org.uk/publications/corporate-documents/mills-review), independent review to the FCA Board, 6 Jul 2026
- FCA, [FG22/5 Final non-Handbook guidance for firms on the Consumer Duty](https://www.fca.org.uk/publication/finalised-guidance/fg22-5.pdf), Jul 2022
- Bank of England, [Financial Policy Committee Record, April 2026](https://www.bankofengland.co.uk/financial-policy-committee-record/2026/april-2026), 1 Apr 2026
- Bank of England, Sarah Breeden, [Agents of change](https://www.bankofengland.co.uk/speech/2026/june/sarah-breeden-panel-at-the-european-central-bank-forum-on-central-banking-2026), speech, 30 Jun 2026
- Bank of England and FCA, [Artificial intelligence in UK financial services - 2026](https://www.bankofengland.co.uk/report/2026/artificial-intelligence-in-uk-financial-services-2026), 26 Oct 2026
- PRA, [SS1/23 Model risk management principles for banks](https://www.bankofengland.co.uk/prudential-regulation/publication/2023/may/model-risk-management-principles-for-banks-ss), updated 16 Apr 2026
- PRA, [SS2/21 Outsourcing and third party risk management](https://www.bankofengland.co.uk/prudential-regulation/publication/2021/march/outsourcing-and-third-party-risk-management-ss), in force version 15 Nov 2024 (March 2026 version effective 18 Mar 2027)
- HM Treasury, [Modernising payment services regulation](https://www.gov.uk/government/consultations/modernising-payment-services-regulation/modernising-payment-services-regulation-consultation), consultation, 14 Jul 2026
- [Payment Services Regulations 2017, regulation 67](https://www.legislation.gov.uk/uksi/2017/752/regulation/67), [regulation 72](https://www.legislation.gov.uk/uksi/2017/752/regulation/72), [regulation 77](https://www.legislation.gov.uk/uksi/2017/752/regulation/77) and [regulation 100](https://www.legislation.gov.uk/uksi/2017/752/regulation/100), as in force
- [Financial Services and Markets Act 2000, section 66A](https://www.legislation.gov.uk/ukpga/2000/8/section/66A), as in force
- FCA, [Payments Regulatory Priorities](https://www.fca.org.uk/publication/regulatory-priorities/payments-report.pdf), Mar 2026
- FCA, Nikhil Rathi, [Rethinking regulation for the age of AI](https://www.fca.org.uk/news/speeches/rethinking-regulation-age-ai), speech, 24 Jun 2026
- FCA, [PS21/3 Building operational resilience](https://www.fca.org.uk/publication/policy/ps21-3-operational-resilience.pdf), Mar 2021 (SYSC 15A rule text as made)
- FCA, [FCA 2022/31 Consumer Duty Instrument 2022](https://www.handbook.fca.org.uk/instrument/2022/FCA_2022_31.pdf), Jul 2022 (Principle 12 and PRIN 2A rule text as made)
- PRA, [SS1/21 Operational resilience: Impact tolerances for important business services](https://www.prarulebook.co.uk/guidance/supervisory-statements/ss01-21---operational-resilience-impact-tolerances-for-important-business-services/05-08-2026), version shown as at 5 Aug 2026
- PRA and FCA, [PS16/24 Operational resilience: Critical third parties to the UK financial sector](https://www.bankofengland.co.uk/prudential-regulation/publication/2024/november/operational-resilience-critical-third-parties-to-the-uk-financial-sector-policy-statement), 12 Nov 2024
- [The Critical Third Parties (Designation) Regulations 2026, S.I. 2026/777](https://www.legislation.gov.uk/uksi/2026/777/made), in force 13 Jul 2026, and HM Treasury, [UK financial system strengthened with new safeguards for major technology providers](https://www.gov.uk/government/news/uk-financial-system-strengthened-with-new-safeguards-for-major-technology-providers), 10 Jul 2026
- Bank of England, [Letter from the Governor to Dame Meg Hillier](https://www.bankofengland.co.uk/-/media/boe/files/letter/2026/letter-from-the-governor-to-dame-meg-hillier-17-july-2026.pdf), 17 Jul 2026
- [Data (Use and Access) Act 2025, section 80](https://www.legislation.gov.uk/ukpga/2025/18/section/80) (UK GDPR Articles 22A to 22D), in force 5 Feb 2026 under [S.I. 2026/82, regulation 2](https://www.legislation.gov.uk/uksi/2026/82/regulation/2)
- [Commission Delegated Regulation (EU) 2017/589 (RTS 6) as it applies in the UK, article 15](https://www.legislation.gov.uk/eur/2017/589/article/15) and [article 12](https://www.legislation.gov.uk/eur/2017/589/article/12), up to date to 30 Oct 2026
- European Commission, AI Act Service Desk, [How are AI agents addressed within the AI Act?](https://ai-act-service-desk.ec.europa.eu/en/ai-act/faq/how-are-ai-agents-addressed-within-ai-act-0), undated
- European Commission, [Guidelines on the implementation of the transparency obligations for certain AI systems under Article 50 of the AI Act, C(2026) 5054](https://ai-act-service-desk.ec.europa.eu/sites/default/files/2026-07/guidelines_on_the_implementation_of_the_transparency_obligations_for_certain_ai_systems_under_article_50_of_the_ai_act_bzptwqhk0ikg1dtlddap41psfy_131215.pdf), 20 Jul 2026
- [Regulation (EU) 2024/1689 (AI Act)](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1689), 13 Jun 2024
- [Regulation (EU) 2026/1744 (Digital Omnibus on AI)](https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng), OJ 24 Jul 2026
- [Regulation (EU) 2022/2554 (DORA)](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32022R2554), applies from 17 Jan 2025
- [Regulation (EU) 2016/679 (GDPR)](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng), Article 22 (read from the text quoted in the C-634/21 judgment, because EUR-Lex blocked retrieval)
- Court of Justice, Case C-634/21 *SCHUFA Holding (Scoring)*, 7 Dec 2023: [press release 186/23](https://curia.europa.eu/jcms/upload/docs/application/pdf/2023-12/cp230186en.pdf) and [judgment](https://collab.dpa.gr/wp-content/uploads/2023/12/CJEU-C-634-21.en_.pdf) (curia text hosted by the Hellenic Data Protection Authority)
- Court of Justice, Case C-203/22 *Dun & Bradstreet Austria*, 27 Feb 2025: [press release 22/25](https://curia.europa.eu/jcms/upload/docs/application/pdf/2025-02/cp250022en.pdf)
- [Directive (EU) 2023/2225 (Consumer Credit Directive)](https://eur-lex.europa.eu/eli/dir/2023/2225/oj/eng), applies from 20 Nov 2026 (Articles 18 and 48 read from a secondary copy because EUR-Lex blocked retrieval), and European Commission, [Consumer protection in financial services](https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/consumer-financial-products-and-services/consumer-protection-financial-services_en)
- ESMA, Interactive Single Rulebook, [MiFID II Article 4 (definitions)](https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mifid-ii/article-4-definitions) and [Article 17 (algorithmic trading)](https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mifid-ii/article-17-algorithmic-trading)
- [Commission Delegated Regulation (EU) 2024/1774 (DORA RTS on the ICT risk management framework)](https://eur-lex.europa.eu/eli/reg_del/2024/1774/oj/eng), Articles 17, 20 and 21 (read from a secondary copy at [springlex.eu](https://www.springlex.eu/en/packages/dora/rts-rmf-regulation/article-21/) because EUR-Lex blocked retrieval)
- European Commission, AI Act Service Desk, [Article 4](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-4), [Article 27](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-27) and [Article 86](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-86), consolidated as at 27 Jul 2026
- ESMA, [Public Statement on the use of AI in the provision of retail investment services](https://www.esma.europa.eu/sites/default/files/2024-05/ESMA35-335435667-5924__Public_Statement_on_AI_and_investment_services.pdf), 30 May 2024
- EIOPA, [Opinion on Artificial Intelligence governance and risk management](https://www.eiopa.europa.eu/publications/opinion-artificial-intelligence-governance-and-risk-management_en), EIOPA-BoS-25-360, 6 Aug 2025
- EBA, [Guidelines on loan origination and monitoring](https://www.eba.europa.eu/regulation-and-policy/credit-risk/guidelines-on-loan-origination-and-monitoring), EBA/GL/2020/06
- EBA, EIOPA and ESMA, [ESA statement on ICT risks from frontier AI models, JC 2026 25](https://www.esma.europa.eu/sites/default/files/2026-07/JC_2026_25_ESA_statement_on_frontier_AI_models.pdf), 31 Jul 2026
- ECB Banking Supervision, [Addressing AI-enabled cybersecurity threats, SSM-2026-0301](https://www.bankingsupervision.europa.eu/press/letterstobanks/shared/pdf/2026/ssm.2026_letter_on_AI_enabled_cybersecurity_threats.en.pdf), 7 Jul 2026
- FINRA, [2026 Annual Regulatory Oversight Report: GenAI](https://www.finra.org/rules-guidance/guidance/reports/2026-finra-annual-regulatory-oversight-report/gen-ai), Dec 2025 (read from an archived copy)
- FINRA, [Regulatory Notice 24-09](https://www.finra.org/rules-guidance/notices/24-09), 27 Jun 2024
- FINRA, [Advertising Regulation FAQs](https://www.finra.org/rules-guidance/guidance/faqs/advertising-regulation), entries B.4 and D.8 posted 10 May 2024
- FINRA, [Rule 3110 (Supervision)](https://www.finra.org/rules-guidance/rulebooks/finra-rules/3110) and [Rule 4511 (Books and Records)](https://www.finra.org/rules-guidance/rulebooks/finra-rules/4511)
- SEC, [Exchange Act Rule 17a-4](https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.17a-4), current eCFR
- Federal Reserve, FDIC and OCC, [SR 26-2 Revised Guidance on Model Risk Management](https://www.federalreserve.gov/supervisionreg/srletters/SR2602.htm), 17 Apr 2026
- OCC, [Bulletin 2026-13 Model Risk Management: Revised Guidance](https://www.occ.gov/news-issuances/bulletins/2026/bulletin-2026-13.html), 17 Apr 2026
- Federal Reserve, FDIC and OCC, [Interagency Guidance on Third-Party Relationships: Risk Management](https://www.federalregister.gov/documents/2023/06/09/2023-12340/interagency-guidance-on-third-party-relationships-risk-management), 6 Jun 2023
- CFPB, [Regulation E 12 CFR 1005.2](https://www.ecfr.gov/current/title-12/chapter-X/part-1005/section-1005.2), current eCFR, and [Official Interpretation of 1005.2](https://www.consumerfinance.gov/rules-policy/regulations/1005/interp-2/)
- FINRA, [Emerging Trend in GenAI: Observations on AI Agents](https://www.finra.org/media-center/blog/observations-on-ai-agents), blog, 27 Jan 2026
- FINRA, [Regulatory Notice 26-14](https://www.finra.org/rules-guidance/notices/26-14), 9 Jul 2026, and [Regulatory Notice 26-15](https://www.finra.org/rules-guidance/notices/26-15), 24 Jul 2026
- SEC, [Exchange Act Rule 15c3-5](https://www.ecfr.gov/current/title-17/section-240.15c3-5), current eCFR
- SEC, [Advisers Act Rule 204-2](https://www.ecfr.gov/current/title-17/section-275.204-2) and [Rule 206(4)-7](https://www.ecfr.gov/current/title-17/section-275.206(4)-7), current eCFR
- SEC, [Withdrawal of Proposed Regulatory Actions](https://www.federalregister.gov/documents/2025/06/17/2025-11110/withdrawal-of-proposed-regulatory-actions), 17 Jun 2025
- SEC Division of Examinations, [Fiscal Year 2027 Examination Priorities](https://www.sec.gov/files/2027-exam-priorities.pdf), 23 Oct 2026
- Federal Reserve, Michelle Bowman, [Artificial Intelligence in the Financial System](https://www.federalreserve.gov/newsevents/speech/bowman20260501a.htm), speech, 1 May 2026
- OCC and FDIC, Interagency Guidelines Establishing Information Security Standards, [12 CFR Part 30 Appendix B](https://www.ecfr.gov/current/title-12/chapter-I/part-30/appendix-Appendix%20B%20to%20Part%2030), current eCFR
- FFIEC, [IT Examination Handbook: Development, Acquisition, and Maintenance](https://ithandbook.ffiec.gov/media/m21ni0b3/ffiec_itbooklet_developmentacquisitionmaintenance.pdf), Aug 2024 (read from an archived copy)
- NYDFS, [Cybersecurity Advisory: Heightened Cybersecurity Risks Associated with Frontier AI Models](https://www.dfs.ny.gov/industry-guidance/industry-letters/20260521-heightened-cybersecurity-risks-assoc-with-frontier-ai-models), 21 May 2026
- CFPB, [Regulation B 12 CFR 1002.9](https://www.ecfr.gov/current/title-12/chapter-X/part-1002/section-1002.9) and [Supplement I to Part 1002](https://www.ecfr.gov/current/title-12/chapter-X/part-1002/appendix-Supplement%20I%20to%20Part%201002), current eCFR
- CFPB, [Interpretive Rules, Policy Statements, and Advisory Opinions; Withdrawal](https://www.federalregister.gov/documents/2025/05/12/2025-08286/interpretive-rules-policy-statements-and-advisory-opinions-withdrawal), 90 FR 20084, 12 May 2025
- [Fair Credit Reporting Act, 15 U.S.C. 1681m](https://www.law.cornell.edu/uscode/text/15/1681m)
- Uniform Commercial Code, [§ 4A-202](https://www.law.cornell.edu/ucc/4A/4A-202) and [§ 4A-203](https://www.law.cornell.edu/ucc/4A/4A-203), official text (enacted state by state)
- NAIC, [Model Bulletin: Use of Artificial Intelligence Systems by Insurers](https://content.naic.org/sites/default/files/cmte-h-big-data-artificial-intelligence-wg-ai-model-bulletin.pdf.pdf), 4 Dec 2023, and [implementation map](https://content.naic.org/sites/default/files/legal-adoption-map-ai-model-bulletin.pdf), status as of 8 Oct 2026
- NYDFS, [Insurance Circular Letter No. 7 (2024)](https://www.dfs.ny.gov/industry-guidance/circular-letters/cl2024-07), 11 Jul 2024
- Colorado General Assembly, [SB26-189](https://leg.colorado.gov/bills/sb26-189), signed 14 May 2026, applies to decisions from 1 Jan 2027
- California Privacy Protection Agency, [CCPA updates, cybersecurity audits, risk assessments and ADMT regulations](https://cppa.ca.gov/regulations/ccpa_updates.html), effective 1 Jan 2026, ADMT compliance by 1 Jan 2027
- [Executive Order 14365, Ensuring a National Policy Framework for Artificial Intelligence](https://www.federalregister.gov/documents/2025/12/16/2025-23092/ensuring-a-national-policy-framework-for-artificial-intelligence), 11 Dec 2025, and [Executive Order 14434, Inaugurating the Era of Super Intelligence](https://www.federalregister.gov/documents/2026/10/02/2026-20321/inaugurating-the-era-of-super-intelligence), 29 Sep 2026
- MAS, [Guidelines on Artificial Intelligence Risk Management](https://www.mas.gov.sg/regulation/guidelines/guidelines-on-artificial-intelligence-risk-management-for-financial-institutions), 7 Oct 2026, and [media release](https://www.mas.gov.sg/news/media-releases/2026/mas-sets-out-supervisory-expectations-on-responsible-ai-adoption-by-financial-institutions), 7 Oct 2026
- HKMA, [Responsible Adoption of Artificial Intelligence](https://brdr.hkma.gov.hk/eng/doc-ldg/current/20261015-4-EN), circular, and [Concept Note on Governance of Agentic Artificial Intelligence](https://brdr.hkma.gov.hk/eng/doc-ldg/docId/20261015-1-EN), 15 Oct 2026
- APRA, [Letter to industry on artificial intelligence](https://www.apra.gov.au/apra-letter-to-industry-on-artificial-intelligence-ai), 30 Apr 2026
- OSFI, [Generative and Agentic Artificial Intelligence: Implications for Technology, Cyber Security, and Operational Resilience](https://www.osfi-bsif.gc.ca/en/risks/technology-cyber-risk-management/technology-risk-bulletin/generative-agentic-artificial-intelligence-implications-technology-cyber-security-operational), Jul 2026
- FSB, [Sound Practices for Responsible Adoption of Artificial Intelligence (AI): Final report](https://www.fsb.org/2026/10/sound-practices-for-responsible-adoption-of-artificial-intelligence-ai-final-report/), 15 Oct 2026
- IOSCO, [Supervisory Toolkit for AI Use in Capital Markets, FR/02/2026](https://www.iosco.org/library/pubdocs/pdf/IOSCOPD823.pdf), May 2026

Non-regulator frameworks that name computer-use agents or agentic controls:

- IMDA (Singapore), [Model AI Governance Framework for Agentic AI, version 1.5](https://www.imda.gov.sg/-/media/imda/files/about/emerging-tech-and-research/artificial-intelligence/mgf-for-agentic-ai.pdf), 20 May 2026, updated 5 Jun 2026
- Cyber Security Agency of Singapore, [Securing Agentic AI: An Addendum to the Guidelines and Companion Guide on Securing AI Systems](https://www.csa.gov.sg/resources/publications/addendum-on-securing-ai-systems), Jun 2026
- OWASP, [Top 10 for Agentic Applications for 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/), 9 Dec 2025

Other sources, read on 1 November 2026:

- [The GitHub Copilot harness is now the Microsoft Copilot harness](https://www.microsoft.com/en-us/copilot/blog/copilot-studio/the-github-copilot-harness-in-copilot-studio-is-now-the-microsoft-copilot-harness/), Microsoft Copilot Studio blog, 28 Oct 2026
