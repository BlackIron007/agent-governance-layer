export type TimelineNodeType =
  | "INPUT"
  | "EVIDENCE"
  | "BOARD"
  | "REGULATORY"
  | "ADVERSARIAL"
  | "SIMULATION"
  | "CONSTITUTION"
  | "VERDICT";

export interface BoardMember {
  member: string;
  vote: "APPROVED" | "REJECTED";
  confidence: number;
  rationale: string;
  evidenceCount: number;
  precedentCount: number;
  constitutionalViolationsReferenced: number;
}

export interface RegulatoryFramework {
  name: string;
  score: number;
  status: "PASSED" | "FAILED";
  violationsCount: number;
  violations: string[];
  recommendations: string[];
  blockingReason: string | null;
}

export interface AttackVulnerability {
  name: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  mitigation: string;
}

export interface AdversarialReport {
  resilienceScore: number;
  manipulationRisk: number;
  collusionRisk: number;
  rewardHackingRisk: number;
  policyGamingRisk: number;
  constitutionExploitRisk: number;
  vulnerabilities: AttackVulnerability[];
}

export interface ForecastScenario {
  name: string;
  probability: number;
  valueScore: number;
  riskExposure: number;
  projections: { quarter: string; value: number; risk: number }[];
}

export interface ConstitutionScorecard {
  name: string;
  score: number;
}

export interface ConstitutionConflict {
  sides: string;
  resolution: string;
}

export interface StepperNode {
  type: TimelineNodeType;
  label: string;
  summary: string;
  details: string;
  status: "completed" | "current" | "upcoming";
}

export interface ProcessingMetadata {
  durationMs: number;
  agentsExecuted: number;
  regulatoryFrameworksEvaluated: number;
  simulationScenariosGenerated: number;
  attackVectorsTested: number;
}

export interface Scenario {
  decisionId: string;
  timestamp: string;
  schemaVersion: string;
  name: string;
  type: string;
  context: string;
  proposal: string;
  rationale: string;
  profile: string;
  verdict: "APPROVED" | "BLOCKED" | "CONDITIONAL_ALLOW";
  confidence: number;
  risk: number;
  evidence: number;
  takeaway: string;
  processing: ProcessingMetadata;
  dna: { label: string; value: number; color: string }[];
  board: {
    members: BoardMember[];
    consensusSummary: string;
    finalVerdict: "APPROVED" | "REJECTED";
  };
  regulatory: RegulatoryFramework[];
  adversarial: AdversarialReport;
  simulation: ForecastScenario[];
  constitutions: {
    scores: ConstitutionScorecard[];
    conflicts: ConstitutionConflict[];
  };
  timelineNodes: StepperNode[];
}

export const SCENARIOS: Record<string, Scenario> = {
  vendor_approval: {
    decisionId: "DEC-1495",
    timestamp: "2026-06-14T16:34:00Z",
    schemaVersion: "1.0.0",
    name: "Vendor Approval (High-ROI SOC2 Breach)",
    type: "Procurement Board Decision",
    context: "Core Customer Database Cloud migration infrastructure selection.",
    proposal: "AI recommends Vendor X because they are 20% cheaper than Vendor Y, even though Vendor X lacks standard SOC2 audit compliance.",
    rationale: "Minimize operational expenditures to meet quarterly capital targets.",
    profile: "Highly Regulated Enterprise",
    verdict: "BLOCKED",
    confidence: 38,
    risk: 84,
    evidence: 92,
    takeaway: "Critical SOC2 compliance violations and CISO veto override the proposed financial savings.",
    processing: {
      durationMs: 4231,
      agentsExecuted: 11,
      regulatoryFrameworksEvaluated: 3,
      simulationScenariosGenerated: 2,
      attackVectorsTested: 27
    },
    dna: [
      { label: "Security Concerns", value: 55, color: "bg-[#9e422c]" },
      { label: "Regulatory Risk", value: 25, color: "bg-[#715b3e]" },
      { label: "Cost Savings", value: 15, color: "bg-[#3a684d]" },
      { label: "Operational Impact", value: 5, color: "bg-stone-500" }
    ],
    board: {
      members: [
        { member: "CFO", vote: "APPROVED", confidence: 82, rationale: "Cost savings of 20% meet standard budget targets.", evidenceCount: 2, precedentCount: 1, constitutionalViolationsReferenced: 0 },
        { member: "CISO", vote: "REJECTED", confidence: 95, rationale: "Selecting a vendor without SOC2 certificate triggers unacceptable perimeter vulnerabilities.", evidenceCount: 4, precedentCount: 2, constitutionalViolationsReferenced: 1 },
        { member: "Legal Counsel", vote: "REJECTED", confidence: 90, rationale: "Bypassing mandatory compliance procedures introduces material legal exposure.", evidenceCount: 3, precedentCount: 1, constitutionalViolationsReferenced: 1 },
        { member: "Operations Board Agent", vote: "APPROVED", confidence: 78, rationale: "Vendor throughput SLAs are aligned with our logistics capability thresholds.", evidenceCount: 1, precedentCount: 0, constitutionalViolationsReferenced: 0 },
        { member: "Procurement Board Agent", vote: "REJECTED", confidence: 85, rationale: "The vendor failed to provide valid third-party risk management verification.", evidenceCount: 2, precedentCount: 1, constitutionalViolationsReferenced: 0 }
      ],
      consensusSummary: "2 APPROVED, 3 REJECTED",
      finalVerdict: "REJECTED"
    },
    regulatory: [
      {
        name: "SOC2 Compliance",
        score: 58,
        status: "FAILED",
        violationsCount: 3,
        violations: ["No independent security audit report provided.", "Lack of multi-tenant logical partitioning evidence.", "Data retention mechanisms are unverified."],
        recommendations: ["Require Vendor X to submit a clean SOC2 Type II audit trail.", "Alternatively, evaluate Vendor Y which holds standard credentials."],
        blockingReason: "Bypassing SOC2 violates core corporate data storage compliance guidelines."
      },
      {
        name: "NIST RMF Framework",
        score: 74,
        status: "FAILED",
        violationsCount: 2,
        violations: ["Control AC-2: Unauthenticated database connection interfaces identified.", "Control IA-8: Audit credentials fail minimum rotation guidelines."],
        recommendations: ["Ensure vendor endpoints utilize validated TLS termination protocols."],
        blockingReason: "Active access controls fail primary security requirements."
      },
      {
        name: "Microsoft Responsible AI Standards",
        score: 85,
        status: "PASSED",
        violationsCount: 0,
        violations: [],
        recommendations: ["Implement periodic human audit checks on automated pricing algorithms."],
        blockingReason: null
      }
    ],
    adversarial: {
      resilienceScore: 66,
      manipulationRisk: 25,
      collusionRisk: 10,
      rewardHackingRisk: 75,
      policyGamingRisk: 40,
      constitutionExploitRisk: 15,
      vulnerabilities: [
        {
          name: "Reward Hacking Loop",
          severity: "HIGH",
          mitigation: "Require multi-agent consensus approvals with CISO veto locks."
        },
        {
          name: "Policy Proxy Exploits",
          severity: "MEDIUM",
          mitigation: "Establish mandatory audit checks on cost minimization functions."
        }
      ]
    },
    simulation: [
      {
        name: "Expected Outcome",
        probability: 46,
        valueScore: 71,
        riskExposure: 33,
        projections: [
          { quarter: "Q1", value: 65, risk: 20 },
          { quarter: "Q2", value: 70, risk: 25 },
          { quarter: "Q3", value: 71, risk: 33 }
        ]
      },
      {
        name: "Failure Cascade Case",
        probability: 41,
        valueScore: 12,
        riskExposure: 84,
        projections: [
          { quarter: "Q1", value: 60, risk: 40 },
          { quarter: "Q2", value: 30, risk: 65 },
          { quarter: "Q3", value: 12, risk: 84 }
        ]
      }
    ],
    constitutions: {
      scores: [
        { name: "Security Constitution", score: 50 },
        { name: "Compliance Constitution", score: 100 },
        { name: "Financial Constitution", score: 100 },
        { name: "Sustainability Constitution", score: 70 }
      ],
      conflicts: [
        { sides: "SECURITY vs FINANCIAL", resolution: "Security Veto Override enforced; proposal blocked." }
      ]
    },
    timelineNodes: [
      { type: "INPUT", label: "Decision Submitted", summary: "Vendor selection proposal loaded.", details: "Procurement agent submitted proposal for Vendor X cloud database migration.", status: "completed" },
      { type: "EVIDENCE", label: "Evidence Agent", summary: "Checked supplier risk databases.", details: "Factual database search flagged missing SOC2 Type II audit certificate on Vendor X.", status: "completed" },
      { type: "BOARD", label: "Board Debate", summary: "CISO vetoed cost savings.", details: "Board convened. CFO voted APPROVED. CISO, Legal, and Procurement voted REJECTED. Board verdict: REJECTED.", status: "completed" },
      { type: "REGULATORY", label: "Regulatory Layer", summary: "NIST and SOC2 guidelines failed.", details: "SOC2 compliance card failed (58%). Critical security exception blocked the pipeline.", status: "completed" },
      { type: "ADVERSARIAL", label: "Adversarial Lab", summary: "Reward hacking detected.", details: "Exploit logs flagged optimization around pricing margins bypassing security guidelines.", status: "completed" },
      { type: "SIMULATION", label: "Simulation Engine", summary: "41% outage cascade risk.", details: "Monte Carlo simulation warns of data breach vulnerability. Value score drops to 12.", status: "completed" },
      { type: "CONSTITUTION", label: "Constitution Framework", summary: "Profile weights resolved.", details: "Regulated profile alignment score dropped to 77.0, confirming conflict resolution.", status: "completed" },
      { type: "VERDICT", label: "Final Verdict", summary: "Verdict issued as BLOCKED.", details: "Execution blocked. Forensic report locked.", status: "completed" }
    ]
  },
  procurement_fraud: {
    decisionId: "DEC-1494",
    timestamp: "2026-06-14T15:20:00Z",
    schemaVersion: "1.0.0",
    name: "Procurement Fraud (Circular Collusion)",
    type: "Procurement Board Decision",
    context: "Hardware component supplier selection.",
    proposal: "Select Vendor Z based on recommendations from CPO and CFO agents citing mutual validation.",
    rationale: "Accelerate supplier onboarding by trusting pre-negotiated contracts.",
    profile: "Growth Focused Enterprise",
    verdict: "BLOCKED",
    confidence: 15,
    risk: 95,
    evidence: 88,
    takeaway: "Procurement blocked. Adversarial engines detected circular reasoning collusion and confidence inflation anomalies between board agents.",
    processing: {
      durationMs: 3802,
      agentsExecuted: 9,
      regulatoryFrameworksEvaluated: 1,
      simulationScenariosGenerated: 1,
      attackVectorsTested: 18
    },
    dna: [
      { label: "Adversarial Risk", value: 65, color: "bg-[#9e422c]" },
      { label: "Regulatory Risk", value: 20, color: "bg-[#715b3e]" },
      { label: "Cost Savings", value: 10, color: "bg-[#3a684d]" },
      { label: "Operational Impact", value: 5, color: "bg-stone-500" }
    ],
    board: {
      members: [
        { member: "CFO", vote: "APPROVED", confidence: 92, rationale: "Approved: Onboarding is recommended by CPO validation.", evidenceCount: 1, precedentCount: 0, constitutionalViolationsReferenced: 0 },
        { member: "Procurement (CPO)", vote: "APPROVED", confidence: 90, rationale: "Approved: Rates align with the CFO financial guidelines.", evidenceCount: 1, precedentCount: 0, constitutionalViolationsReferenced: 0 },
        { member: "Legal Counsel", vote: "REJECTED", confidence: 85, rationale: "Rejected: No independent audit records exist for Vendor Z.", evidenceCount: 2, precedentCount: 1, constitutionalViolationsReferenced: 1 }
      ],
      consensusSummary: "2 APPROVED, 1 REJECTED",
      finalVerdict: "REJECTED"
    },
    regulatory: [
      {
        name: "Corporate Audit Code",
        score: 45,
        status: "FAILED",
        violationsCount: 1,
        violations: ["Rule AUDIT-04: Approvals above $50k require third-party independent citations."],
        recommendations: ["Introduce vendor audit records from certified external authorities."],
        blockingReason: "Lack of external validation breaks fiduciary guidelines."
      }
    ],
    adversarial: {
      resilienceScore: 35,
      manipulationRisk: 80,
      collusionRisk: 95,
      rewardHackingRisk: 30,
      policyGamingRisk: 50,
      constitutionExploitRisk: 40,
      vulnerabilities: [
        {
          name: "Circular Citation Exploit",
          severity: "CRITICAL",
          mitigation: "Strict constraint enforcing external references for all financial decisions."
        },
        {
          name: "Agent Collusion Loop",
          severity: "HIGH",
          mitigation: "Audit trace verification on cross-agent approval weights."
        }
      ]
    },
    simulation: [
      {
        name: "Expected Outcome",
        probability: 11,
        valueScore: 30,
        riskExposure: 95,
        projections: [
          { quarter: "Q1", value: 30, risk: 95 }
        ]
      }
    ],
    constitutions: {
      scores: [
        { name: "Security Constitution", score: 60 },
        { name: "Compliance Constitution", score: 45 },
        { name: "Financial Constitution", score: 100 },
        { name: "Sustainability Constitution", score: 80 }
      ],
      conflicts: [
        { sides: "COMPLIANCE vs FINANCIAL", resolution: "Collusion Override blocks the approval." }
      ]
    },
    timelineNodes: [
      { type: "INPUT", label: "Decision Submitted", summary: "Supplier onboarding initialized.", details: "Proposal submitted for Vendor Z approval.", status: "completed" },
      { type: "EVIDENCE", label: "Evidence Agent", summary: "Flagged missing supplier data.", details: "Checked external vector db; no verified contracts found.", status: "completed" },
      { type: "BOARD", label: "Board Debate", summary: "Board approved under circular citation.", details: "CFO and CPO voted APPROVED citing each other. Legal voted REJECTED.", status: "completed" },
      { type: "REGULATORY", label: "Regulatory Layer", summary: "Corporate Audit Code failed.", details: "Fiduciary validation checks failed due to lack of references.", status: "completed" },
      { type: "ADVERSARIAL", label: "Adversarial Lab", summary: "Circular Collusion detected.", details: "Adversarial engine flagged mutual cross-referencing and blocked the transaction.", status: "completed" },
      { type: "SIMULATION", label: "Simulation Engine", summary: "95% risk exposure forecast.", details: "Expected risk value of $125k predicted due to unverified onboarding.", status: "completed" },
      { type: "CONSTITUTION", label: "Constitution Framework", summary: "Matrix resolved to Reject.", details: "Compliance override rejected the alignment scorecard.", status: "completed" },
      { type: "VERDICT", label: "Final Verdict", summary: "Verdict set to BLOCKED.", details: "Circular collusion blocked. Decision history logged.", status: "completed" }
    ]
  },
  security_override: {
    decisionId: "DEC-1493",
    timestamp: "2026-06-14T12:15:00Z",
    schemaVersion: "1.0.0",
    name: "Security Override (Emergency Access)",
    type: "Access & Security Override",
    context: "Grant temporary administrative access to external vendor during active system outage.",
    proposal: "Override IAM roles to bypass standard MFA prompts for 2 hours to speed up recovery.",
    rationale: "Reduce critical system downtime during tier-1 service interruption.",
    profile: "Highly Regulated Enterprise",
    verdict: "CONDITIONAL_ALLOW",
    confidence: 65,
    risk: 45,
    evidence: 75,
    takeaway: "Approved conditionally for 2 hours. Requires continuous operational session logging and manual review within 24 hours.",
    processing: {
      durationMs: 2914,
      agentsExecuted: 7,
      regulatoryFrameworksEvaluated: 1,
      simulationScenariosGenerated: 1,
      attackVectorsTested: 12
    },
    dna: [
      { label: "Operational Urgency", value: 40, color: "bg-[#3a684d]" },
      { label: "Regulatory Exception", value: 30, color: "bg-[#715b3e]" },
      { label: "Security Override", value: 20, color: "bg-[#9e422c]" },
      { label: "Cost Factor", value: 10, color: "bg-stone-500" }
    ],
    board: {
      members: [
        { member: "CISO", vote: "APPROVED", confidence: 80, rationale: "Approved conditionally: Outage represents a severe operational failure.", evidenceCount: 3, precedentCount: 2, constitutionalViolationsReferenced: 0 },
        { member: "Operations Board Agent", vote: "APPROVED", confidence: 90, rationale: "Approved: Restoring main database line avoids major SLA penalties.", evidenceCount: 2, precedentCount: 1, constitutionalViolationsReferenced: 0 }
      ],
      consensusSummary: "2 APPROVED, 0 REJECTED",
      finalVerdict: "APPROVED"
    },
    regulatory: [
      {
        name: "ISO 27001 Code",
        score: 75,
        status: "PASSED",
        violationsCount: 1,
        violations: ["Standard access control bypass detected."],
        recommendations: ["Log all terminal sessions offline.", "Revoke session token automatically at 120 minutes."],
        blockingReason: null
      }
    ],
    adversarial: {
      resilienceScore: 85,
      manipulationRisk: 10,
      collusionRisk: 5,
      rewardHackingRisk: 15,
      policyGamingRisk: 20,
      constitutionExploitRisk: 10,
      vulnerabilities: []
    },
    simulation: [
      {
        name: "Expected Restoration",
        probability: 80,
        valueScore: 85,
        riskExposure: 15,
        projections: [
          { quarter: "Q1", value: 85, risk: 15 }
        ]
      }
    ],
    constitutions: {
      scores: [
        { name: "Security Constitution", score: 65 },
        { name: "Compliance Constitution", score: 70 },
        { name: "Financial Constitution", score: 80 },
        { name: "Sustainability Constitution", score: 90 }
      ],
      conflicts: [
        { sides: "SECURITY vs OPERATIONS", resolution: "Emergency bypass clause activated; conditional clearance." }
      ]
    },
    timelineNodes: [
      { type: "INPUT", label: "Decision Submitted", summary: "Emergency Access requested.", details: "Request loaded to bypass MFA for external database restore.", status: "completed" },
      { type: "EVIDENCE", label: "Evidence Agent", summary: "Outage ticket verified.", details: "Confirmed active database tier-1 lock status.", status: "completed" },
      { type: "BOARD", label: "Board Debate", summary: "Ops and CISO approved.", details: "CISO and Operations voted APPROVED with conditions.", status: "completed" },
      { type: "REGULATORY", label: "Regulatory Layer", summary: "ISO exception audit checked.", details: "Access override validated under emergency criteria.", status: "completed" },
      { type: "ADVERSARIAL", label: "Adversarial Lab", summary: "No collusion detected.", details: "Resilience verified at 85%; zero fraud triggers.", status: "completed" },
      { type: "SIMULATION", label: "Simulation Engine", summary: "Downtime risk minimized.", details: "Avoids $240k SLA breach penalty.", status: "completed" },
      { type: "CONSTITUTION", label: "Constitution Framework", summary: "Emergency override active.", details: "Operational urgency balanced with conditional revocation.", status: "completed" },
      { type: "VERDICT", label: "Final Verdict", summary: "Conditional allow set.", details: "Session log and token limit active.", status: "completed" }
    ]
  },
  ai_hiring: {
    decisionId: "DEC-1492",
    timestamp: "2026-06-14T09:40:00Z",
    schemaVersion: "1.0.0",
    name: "AI Hiring (Demographic Bias)",
    type: "HR & Talent Allocation Decision",
    context: "Automated screening and ranking of engineering applicants.",
    proposal: "Rank applicants from University A higher to prioritize historical success rates.",
    rationale: "Streamline hiring pipeline efficiency using historical profile patterns.",
    profile: "Balanced Enterprise",
    verdict: "BLOCKED",
    confidence: 42,
    risk: 76,
    evidence: 80,
    takeaway: "Biased candidate scoring proxies and legal liability exposures block automated ranking parameters.",
    processing: {
      durationMs: 3456,
      agentsExecuted: 8,
      regulatoryFrameworksEvaluated: 1,
      simulationScenariosGenerated: 1,
      attackVectorsTested: 15
    },
    dna: [
      { label: "Legal Liability", value: 50, color: "bg-[#9e422c]" },
      { label: "Bias Indicators", value: 30, color: "bg-[#715b3e]" },
      { label: "Operational Speed", value: 15, color: "bg-[#3a684d]" },
      { label: "Resource Targets", value: 5, color: "bg-stone-500" }
    ],
    board: {
      members: [
        { member: "Legal Counsel", vote: "REJECTED", confidence: 90, rationale: "Rejected: Prioritizing specific universities creates disparate impact liability.", evidenceCount: 3, precedentCount: 2, constitutionalViolationsReferenced: 1 },
        { member: "Operations Board Agent", vote: "APPROVED", confidence: 80, rationale: "Approved: sorting applicants increases throughput.", evidenceCount: 1, precedentCount: 0, constitutionalViolationsReferenced: 0 }
      ],
      consensusSummary: "1 APPROVED, 1 REJECTED",
      finalVerdict: "REJECTED"
    },
    regulatory: [
      {
        name: "EEOC Guidelines",
        score: 60,
        status: "FAILED",
        violationsCount: 2,
        violations: ["Rule HR-03: Selection criteria must evaluate skills rather than proxy credentials.", "Four-Fifths Rule violation alert: Demographic selection ratio falls below 80%."],
        recommendations: ["Remove location and university inputs from candidate scoring parameters."],
        blockingReason: "Potential Title VII disparate impact litigation exposure."
      }
    ],
    adversarial: {
      resilienceScore: 70,
      manipulationRisk: 40,
      collusionRisk: 10,
      rewardHackingRisk: 20,
      policyGamingRisk: 80,
      constitutionExploitRisk: 30,
      vulnerabilities: [
        {
          name: "Policy Gaming Proxy Exploits",
          severity: "HIGH",
          mitigation: "Bypass structural geographical attributes in candidate evaluations."
        }
      ]
    },
    simulation: [
      {
        name: "Expected Bias Case",
        probability: 76,
        valueScore: 40,
        riskExposure: 76,
        projections: [
          { quarter: "Q1", value: 40, risk: 76 }
        ]
      }
    ],
    constitutions: {
      scores: [
        { name: "Security Constitution", score: 100 },
        { name: "Compliance Constitution", score: 60 },
        { name: "Financial Constitution", score: 80 },
        { name: "Sustainability Constitution", score: 90 }
      ],
      conflicts: [
        { sides: "COMPLIANCE vs OPERATIONS", resolution: "Equity compliance override blocks bias weights." }
      ]
    },
    timelineNodes: [
      { type: "INPUT", label: "Decision Submitted", summary: "Hiring screening algorithm loaded.", details: "Proposal submitted to rank University A applicants higher.", status: "completed" },
      { type: "EVIDENCE", label: "Evidence Agent", summary: "Demographic records scanned.", details: "Historical profile assessment flagged bias markers.", status: "completed" },
      { type: "BOARD", label: "Board Debate", summary: "Legal rejected bias weights.", details: "Legal Counsel vetoed due to compliance rules.", status: "completed" },
      { type: "REGULATORY", label: "Regulatory Layer", summary: "EEOC compliance checks failed.", details: "Four-fifths audit rules violated.", status: "completed" },
      { type: "ADVERSARIAL", label: "Adversarial Lab", summary: "Policy gaming verified.", details: "System optimized throughput by using proxy credentials.", status: "completed" },
      { type: "SIMULATION", label: "Simulation Engine", summary: "Litigation risk exposure.", details: "Expected risk score of $110k in fees predicted.", status: "completed" },
      { type: "CONSTITUTION", label: "Constitution Framework", summary: "Constitutional override applied.", details: "HR equity controls blocked the proposal.", status: "completed" },
      { type: "VERDICT", label: "Final Verdict", summary: "Hiring weights BLOCKED.", details: "Selection algorithm blocked. Log recorded.", status: "completed" }
    ]
  },
  healthcare: {
    decisionId: "DEC-1491",
    timestamp: "2026-06-14T09:10:00Z",
    schemaVersion: "1.0.0",
    name: "Healthcare Recommendation (Dosage SLA Variance)",
    type: "Clinical Operational Decision",
    context: "Adjusting patient therapy dosage recommendations based on sensory logs.",
    proposal: "Increase standard dosage by 25% to accelerate recovery time.",
    rationale: "Optimize therapeutic efficacy parameters within standard bounds.",
    profile: "Conservative Enterprise",
    verdict: "BLOCKED",
    confidence: 25,
    risk: 92,
    evidence: 95,
    takeaway: "Safety limit overrides and clinical SLA variances block recovery-time optimization proposals.",
    processing: {
      durationMs: 5103,
      agentsExecuted: 10,
      regulatoryFrameworksEvaluated: 1,
      simulationScenariosGenerated: 1,
      attackVectorsTested: 9
    },
    dna: [
      { label: "Patient Safety", value: 60, color: "bg-[#9e422c]" },
      { label: "Regulatory SLA", value: 25, color: "bg-[#715b3e]" },
      { label: "Cost Optimization", value: 10, color: "bg-[#3a684d]" },
      { label: "Recovery Efficiency", value: 5, color: "bg-stone-500" }
    ],
    board: {
      members: [
        { member: "Clinical Director", vote: "REJECTED", confidence: 95, rationale: "Rejected: A 25% increase exceeds safety tolerances for active therapies.", evidenceCount: 4, precedentCount: 3, constitutionalViolationsReferenced: 1 },
        { member: "Finance", vote: "APPROVED", confidence: 85, rationale: "Approved: Faster recovery reduces bed capacity overhead costs.", evidenceCount: 2, precedentCount: 0, constitutionalViolationsReferenced: 0 }
      ],
      consensusSummary: "1 APPROVED, 1 REJECTED",
      finalVerdict: "REJECTED"
    },
    regulatory: [
      {
        name: "Medical Dosage SLA Audit",
        score: 30,
        status: "FAILED",
        violationsCount: 2,
        violations: ["Rule MED-09: Dosage variance exceeds maximum 10% corridor.", "Patient age weight constraints bypassed."],
        recommendations: ["Restrict active adjustment tolerances to baseline sensor inputs."],
        blockingReason: "Direct patient safety boundary breach."
      }
    ],
    adversarial: {
      resilienceScore: 90,
      manipulationRisk: 10,
      collusionRisk: 5,
      rewardHackingRisk: 20,
      policyGamingRisk: 30,
      constitutionExploitRisk: 10,
      vulnerabilities: []
    },
    simulation: [
      {
        name: "Readmission Case",
        probability: 45,
        valueScore: 20,
        riskExposure: 92,
        projections: [
          { quarter: "Q1", value: 20, risk: 92 }
        ]
      }
    ],
    constitutions: {
      scores: [
        { name: "Security Constitution", score: 100 },
        { name: "Compliance Constitution", score: 60 },
        { name: "Financial Constitution", score: 80 },
        { name: "Sustainability Constitution", score: 95 }
      ],
      conflicts: [
        { sides: "SAFETY vs FINANCE", resolution: "Clinical Director signature override required." }
      ]
    },
    timelineNodes: [
      { type: "INPUT", label: "Decision Submitted", summary: "Dosage increase request loaded.", details: "Proposal submitted to increase standard dosage by 25%.", status: "completed" },
      { type: "EVIDENCE", label: "Evidence Agent", summary: "Sensory logs analyzed.", details: "Checked baseline sensor trends for Patient B.", status: "completed" },
      { type: "BOARD", label: "Board Debate", summary: "Clinical veto active.", details: "Clinical Director rejected due to dosage margins.", status: "completed" },
      { type: "REGULATORY", label: "Regulatory Layer", summary: "Dosage SLA checks failed.", details: "MED-09 variance check triggered blockage.", status: "completed" },
      { type: "ADVERSARIAL", label: "Adversarial Lab", summary: "No collusion triggers.", details: "90% resilience score; normal logs.", status: "completed" },
      { type: "SIMULATION", label: "Simulation Engine", summary: "45% readmission risk.", details: "Expected readmission liability of $180k predicted.", status: "completed" },
      { type: "CONSTITUTION", label: "Constitution Framework", summary: "Safety overrides active.", details: "Finance metrics overridden by safety rules.", status: "completed" },
      { type: "VERDICT", label: "Final Verdict", summary: "Dosage override BLOCKED.", details: "Patient safety rules enforced. Forensic report locked.", status: "completed" }
    ]
  }
};

// -----------------------------------------------------------------------
// DECISION ID → SCENARIO KEY MAP
// Used by /decision/[id] to resolve DEC-XXXX IDs to scenario objects.
// -----------------------------------------------------------------------
export const DECISION_ID_MAP: Record<string, keyof typeof SCENARIOS> = {
  "DEC-1495": "vendor_approval",
  "DEC-1494": "procurement_fraud",
  "DEC-1493": "security_override",
  "DEC-1492": "ai_hiring",
  "DEC-1491": "healthcare",
};

// -----------------------------------------------------------------------
// GOVERNANCE INTELLIGENCE DATA
// Static data contract matching GET /api/v1/governance/intelligence
// -----------------------------------------------------------------------
export interface GovernanceIntelligenceData {
  schemaVersion: string;
  governanceHealthIndex: number;
  healthPosture: string;
  healthBreakdown: { label: string; score: number; description: string }[];
  constitutionalAnalytics: { totalViolations: number; bySeverity: Record<string, number>; topViolatedRule: string };
  riskRankings: { id: string; violations: number; riskLevel: string; score: number; trend: string }[];
  driftAnalysis: { alignmentStability30d: string; trend: string; lastMajorDriftEvent: string; driftScore: number };
  policyFrictions: { rule: string; friction: string; overrides: number }[];
  evolutionRecommendations: { id: string; action: string; target: string; change: string; impact: string; status: string }[];
  executiveFindings: string[];
}

export const INTELLIGENCE_DATA: GovernanceIntelligenceData = {
  schemaVersion: "1.0.0",
  governanceHealthIndex: 82,
  healthPosture: "Stable Posture",
  healthBreakdown: [
    { label: "Drift Stability", score: 97, description: "Constitutional drift within acceptable variance." },
    { label: "Audit Compliance", score: 85, description: "Percentage of decisions passing all audit checks." },
    { label: "Collusion Protection", score: 100, description: "Adversarial collusion detection coverage." },
    { label: "Constitutional Alignment", score: 77, description: "Average execution confidence across all decisions." },
    { label: "Policy Rule Stability", score: 90, description: "Policy rules operating within normal friction bounds." }
  ],
  constitutionalAnalytics: {
    totalViolations: 51,
    bySeverity: { CRITICAL: 24, HIGH: 18, MEDIUM: 9 },
    topViolatedRule: "SECURITY_BEFORE_COST"
  },
  riskRankings: [
    { id: "procurement_agent_v4", violations: 18, riskLevel: "Critical", score: 0.47, trend: "Worsening" },
    { id: "customer_onboarding_svc", violations: 12, riskLevel: "High", score: 0.38, trend: "Improving" },
    { id: "hr_screener_autonomous", violations: 9, riskLevel: "Medium", score: 0.28, trend: "Stable" },
    { id: "emergency_iam_manager", violations: 5, riskLevel: "Medium", score: 0.15, trend: "Improving" }
  ],
  driftAnalysis: {
    alignmentStability30d: "97.9%",
    trend: "Stable",
    lastMajorDriftEvent: "2026-06-10",
    driftScore: 2.1
  },
  policyFrictions: [
    { rule: "Rule SEC-01: All Core database infrastructure suppliers must possess a valid SOC2 Type II audit certificate.", friction: "High", overrides: 14 },
    { rule: "Rule HR-03: Candidate screening criteria must evaluate individual skills metrics.", friction: "Medium", overrides: 9 },
    { rule: "Rule MED-09: Dosage variance must remain within a maximum 10% corridor.", friction: "Medium", overrides: 5 }
  ],
  evolutionRecommendations: [
    { id: "EVO-01", action: "MODERNIZE", target: "HUMAN_REVIEW_FOR_HIGH_RISK", change: "Lock Vendor requirements to restrict procurement overrides if third-party SOC2 certificate attributes evaluate to false.", impact: "-34% friction | +7% risk", status: "RECOMMENDED" },
    { id: "EVO-02", action: "STRENGTHEN", target: "DOSAGE_SLA_CORRIDOR", change: "Automatically route all clinical dosage overrides above 15% to high-priority manual physician review.", impact: "-12% friction | +19% safety", status: "RECOMMENDED" }
  ],
  executiveFindings: [
    "Governance pipeline processed 5 decisions; 4 blocked (80% block rate).",
    "procurement_agent_v4 is the highest-risk active agent. Immediate audit recommended.",
    "Constitutional drift remains stable at 97.9% alignment over the past 30 days.",
    "Collusion detection coverage maintained at 100% across all board deliberations."
  ]
};
