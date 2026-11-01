# Computer-Using and Autonomous Agents in Regulated Financial Services

## Summary

Banks, insurers and investment firms are being asked to approve Microsoft agents that **drive a user interface** (Copilot Studio computer use, Cowork's browser, Foundry computer use) or **act on a trigger with nobody prompting them**. Microsoft's computer use FAQ says the tool "isn't intended for" **"Making financial transactions"** or **"Recommending or scoring in sensitive domains, such as hiring, healthcare, or finance"**, while naming data entry and invoice processing as intended uses. For triggered agents, Microsoft asks for "approval steps for high-impact actions, such as financial transactions".

No financial regulator has a **binding** checklist for AI agents, and none addresses computer-using agents. Since mid-2026, though, OSFI, the FSB, MAS, the HKMA, APRA, the FCA and FINRA have published **non-binding** expectations that name agents, and all of them say existing obligations apply.

This skill shows an agent where the line sits (at the **commit**: the moment money moves, a person's position is decided, or a control changes), maps the obligations that apply in each jurisdiction (in full for the UK, the EU and the US, including the US state laws on automated decisions), and produces the controls on either side, a risk committee paper, an inventory record and a tenant test plan.

## Skill

The full skill definition is in [`SKILL.md`](./SKILL.md), which points the agent at [`references/autonomy-line-guide.md`](./references/autonomy-line-guide.md) for the verbatim Microsoft statements, the action classes, the regulator tables, the controls, the open questions and the test plan. Copy the **whole folder** into your host's skills directory (see [skills/README.md](../README.md)).

### Trigger phrases

- *"Can a Copilot Studio computer use agent release payments in our bank portal?"*
- *"Is there a regulator checklist for AI agents in financial services?"*
- *"Write a risk committee paper for an autonomous agent that processes claims."*
- *"Which steps of this process can an agent do without a human approving?"*
- *"We want to replace our RPA bots with computer use. What controls do we need?"*
- *"Who is accountable under SM&CR for an agent that acts on a trigger?"*
- *"Can an agent recommend loan decisions if an underwriter approves them? We lend in Colorado and California."*
- *"Is an agent that places orders through our OMS algorithmic trading under MiFID II?"*
- *"Which DORA and GDPR obligations apply to an autonomous agent at an EU bank?"*
- *"Give me a test plan to prove the agent can't commit transactions."*

## Description

The skill works through seven steps:

1. **Identify the mechanism and its status.** Computer use is generally available, but the hosted browser, Cloud PC pools and the standalone tool are preview, some models are experimental, and agents with an account are Frontier preview. The skill flags what isn't fit for production.
2. **Classify every step** from C0 (observe) through C1 (prepare), C2 (internal change), C3 (outbound communication), C4 (financial commit), C5 (decision about a person, including recommending or scoring) to C6 (control change).
3. **Place each step against the line.** For computer use, C4 and C5 are outside Microsoft's intended use, so the agent stops at preparation and a person or a system commits. For triggered agents, C4 and C5 need an approval outside the agent. C6 is declined, or kept human-only. The line must be enforced by the target system's entitlements or maker-checker, because Microsoft documents its own agent-side guards (human supervision, the allow list, threat detection, Conditional Access) as partial.
4. **Map the regulatory position** for the user's jurisdictions, labelling each source as binding, supervisory expectation, guidance, consultation or speech.
   - **UK:** SM&CR and s66A, PRA SS1/23 and SS2/21, operational resilience (SYSC 15A, SS1/21), the critical third parties regime (Microsoft is designated; the firm's accountability does not change), the Consumer Duty, the Payment Services Regulations, onshored RTS 6, and the new automated decision-making rules in UK GDPR Articles 22A to 22D (in force 5 February 2026).
   - **EU:** DORA and its ICT risk RTS, GDPR Article 22 and the *SCHUFA* judgment on scores, the Consumer Credit Directive (applies 20 November 2026), MiFID II record-keeping and algorithmic trading rules, PSD2, the ESMA, EIOPA and EBA expectations, and the AI Act (high-risk duties from 2 December 2027).
   - **US:** FINRA 3110 and 4511, SEC Rules 17a-4 and 15c3-5, Advisers Act Rules 204-2 and 206(4)-7, SR 26-2, the Interagency information security guidelines and FFIEC change management, Regulation B adverse action reasons, FCRA, Regulation E, UCC Article 4A for business payments, the NAIC bulletin and NYDFS guidance for insurers, and Colorado's and California's automated-decision rules (from 1 January 2027).
   - **Agent-specific publications** from OSFI, the FSB, MAS, the HKMA, APRA, the FCA and FINRA.
5. **Select the controls**: a dedicated least-privilege identity per agent, where it runs, log retention and Purview audit, the inventory record, a tested stop, and the extra controls for triggered agents.
6. **Produce the artifact**: placement assessment, control set, risk committee paper, inventory record, regulatory mapping, instruction block, or a ten-test tenant plan.
7. **Recommend, then stop.** It never changes settings, agents or entitlements.

## Prerequisites

- None to run; the skill is self-contained.
- If the host has web access, the skill re-checks the cited Microsoft pages and regulator publications and reports what changed since the documentation date it relies on.
- To act on the output you need the normal Power Platform admin center, Copilot Studio, Purview and target-system administration roles.
- Computer use is metered (five Copilot Credits per step, 15 with a premium model) and a Cloud PC pool bills an Azure meter; the skill does not estimate cost.

## Limitations

- Written against documentation retrieved on **31 October 2026**. Several components are preview or experimental, and the regulator landscape is moving: MAS consults on agentic guidance in 2027, the FCA has promised a framework for agentic finance, the HKMA has promised a discussion paper, and HM Treasury has not responded on agentic payments.
- Microsoft renamed the GitHub Copilot harness to the Microsoft Copilot harness on 28 October 2026, and says the product will show the new name "over the coming weeks". As of 1 November 2026 the Learn pages cited here still use the old name, so the skill uses the new name and keeps the old one in page titles and quotes.
- Microsoft's own pages disagree in places, for example on whether the computer use allow list blocks navigation. The skill reports the conflict and assumes the weaker reading.
- FCA Handbook provisions (SYSC 4.1.1R, SYSC 9, COBS 11.8) are cited as the FCA's own publications describe them, and SYSC 15A and the Consumer Duty rules are quoted as made in the FCA legal instruments, because the Handbook text could not be retrieved directly. FINRA pages and the FFIEC booklet were read from archived copies where the live site blocked retrieval.
- EUR-Lex blocked retrieval. GDPR Article 22 is quoted from the Court of Justice judgment that reproduces it, and the Consumer Credit Directive and the DORA ICT risk RTS from secondary copies of the Official Journal text. Check them against EUR-Lex before relying on them.
- The ICO website could not be reached, so the ICO's guidance on the new UK automated decision-making rules is not cited.
- US state law moves fast: Colorado's law faces a federal challenge (reported, not verified), the Attorney General's rules are due by 1 January 2027, and UCC Article 4A is enacted state by state. The reading of UCC 4A-202 for agent payments is an inference from the statute, not case law.
- Whether an agent's UI actions are records, whether a payment an agent makes on someone's credentials is authorised, whether an agent that sets order parameters is algorithmic trading, and whether a person approving an agent's recommendation is meaningful human review, are open questions that no regulator has answered. The skill says so rather than guessing.
- This is not legal advice. Verify against the cited sources before relying on the output for a compliance, legal or regulatory decision.

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

Every Microsoft page above was re-checked for its date on 31 October 2026. The agent reads the same list at the end of [`references/autonomy-line-guide.md`](./references/autonomy-line-guide.md).

## Contributors

| Name | Links |
| --- | --- |
| Arindam Choudhury | [GitHub](https://github.com/ari20089) · [LinkedIn](https://www.linkedin.com/in/arindam-choudhury/) |

## Version history

| Version | Date | Comments |
| --- | --- | --- |
| 1.0 | October 2026 | Initial release |
| 1.1 | November 2026 | The GitHub Copilot harness is now the Microsoft Copilot harness; the skill uses the new name and keeps the old one in Learn page titles and quotes |

## Help

Skills are community samples without support. Search [existing issues](https://github.com/ari20089/agents-in-practice/issues) or [open a new one](https://github.com/ari20089/agents-in-practice/issues/new/choose). For Microsoft product questions use Microsoft Learn or your Microsoft support channel.

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**
