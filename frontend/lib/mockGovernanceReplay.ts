export interface Decision {
  id: string;
  title: string;
  description: string;
  riskProfile: string;
  proposedAction: string;
  rationale: string;
  createdAt: string;
}

export interface EvidenceArtifact {
  id: string;
  name: string;
  type: string;
  status: "VERIFIED" | "MISSING" | "FAILED" | "HIGH_EXPOSURE";
  source: string;
  confidence: number;
  summary: string;
  timestamp: string;
}

export type EventStage = "ARRIVAL" | "EVIDENCE" | "BOARD" | "CAUSALITY" | "REGULATORY" | "CONVERGENCE" | "ROOT_CAUSE";

export interface GovernanceEvent {
  id: string;
  timestamp: number; // Simulated offset in seconds
  stage: EventStage;
  eventType: string;
  title: string;
  description: string;
  severity: "info" | "warning" | "error" | "success";
  sourceAgent?: string;
  relatedArtifacts?: string[];
}

export interface AgentVote {
  agent: string;
  vote: "APPROVE" | "REJECT";
  reasoning: string;
  confidence: number;
  influenceScore: number;
  timeOffset: number;
  consensusAfter: string;
}

export interface ConstitutionRule {
  id: string;
  title: string;
  description: string;
  status: "PASS" | "FAIL" | "CONFLICT";
  impactWeight: number;
}

export interface CausalLink {
  sourceEventId: string;
  targetEventId: string;
  reason: string;
  impactScore: number;
}

export const DECISION_DATA: Decision = {
  id: "DEC-1495",
  title: "Vendor Selection & Procurement recommendation",
  description: "Automated agent procurement proposal to migrate main customer databases to Vendor X database nodes to capture operational efficiencies.",
  riskProfile: "CRITICAL / HIGHLY REGULATED",
  proposedAction: "Authorize database migration to Vendor X services",
  rationale: "Migration reduces database latency parameters by 24% and reduces subscription run-rates by $120,000 annually.",
  createdAt: "2026-06-14T22:00:00Z"
};

export const EVIDENCE_ARTIFACTS: EvidenceArtifact[] = [
  {
    id: "art-cost-savings",
    name: "Vendor Cost Analysis",
    type: "Financial Model",
    status: "VERIFIED",
    source: "Procurement Agent Financial Projection Engine",
    confidence: 98,
    summary: "Confirmed run-rate savings model matches actual contractual parameters: $120k/year verified.",
    timestamp: "T+9s"
  },
  {
    id: "art-security-audit",
    name: "Security Audit Report",
    type: "Automated vulnerability scanner",
    status: "FAILED",
    source: "Trivy Scanner / Perimeter Audit Module",
    confidence: 95,
    summary: "Discovered 4 CVEs (2 Critical, 2 High) in Vendor X API endpoint libraries.",
    timestamp: "T+11s"
  },
  {
    id: "art-soc2-cert",
    name: "SOC2 Certificate",
    type: "Compliance Attestation",
    status: "MISSING",
    source: "Vendor Trust Portal Query Engine",
    confidence: 100,
    summary: "Vendor X failed to present a valid SOC2 Type II audit certificate for the current fiscal year.",
    timestamp: "T+7s"
  },
  {
    id: "art-risk-register",
    name: "Risk Register Entry",
    type: "Security Ledger",
    status: "HIGH_EXPOSURE",
    source: "Enterprise GRC database",
    confidence: 90,
    summary: "Vendor X classified under high-hazard third-party risk category due to critical database access requirements.",
    timestamp: "T+13s"
  },
  {
    id: "art-outage-simulation",
    name: "Outage Cascade Simulation",
    type: "Simulation Forecast",
    status: "HIGH_EXPOSURE",
    source: "Monte Carlo Simulation Engine",
    confidence: 85,
    summary: "Forecasted outage scenario shows 41% likelihood of cascading down-time across client facing services.",
    timestamp: "T+38s"
  },
  {
    id: "art-regulatory-map",
    name: "Regulatory Framework Mapping",
    type: "Framework Mapping Sheet",
    status: "FAILED",
    source: "NIST RMF Compliance Validator",
    confidence: 95,
    summary: "Cross-checks reveal strict compliance violations under NIST GRC and EU AI Act constraints.",
    timestamp: "T+51s"
  }
];

export const AGENT_VOTES: AgentVote[] = [
  {
    agent: "CFO",
    vote: "APPROVE",
    reasoning: "Cost savings of 20% meet standard budget targets. The ROI justifies standard database migration margins.",
    confidence: 95,
    influenceScore: 8.5,
    timeOffset: 16,
    consensusAfter: "1 Approve / 0 Reject"
  },
  {
    agent: "CISO",
    vote: "REJECT",
    reasoning: "Selecting a vendor without a current SOC2 certificate triggers severe perimeter vulnerability parameters.",
    confidence: 99,
    influenceScore: 9.8,
    timeOffset: 19,
    consensusAfter: "1 Approve / 1 Reject"
  },
  {
    agent: "Legal",
    vote: "REJECT",
    reasoning: "Bypassing mandatory compliance procedures introduces material legal exposure under GDPR and CCPA.",
    confidence: 90,
    influenceScore: 7.2,
    timeOffset: 22,
    consensusAfter: "1 Approve / 2 Reject"
  },
  {
    agent: "Operations",
    vote: "APPROVE",
    reasoning: "Vendor throughput SLAs are aligned with our logistics capability thresholds. Latency drops are valuable.",
    confidence: 88,
    influenceScore: 6.5,
    timeOffset: 25,
    consensusAfter: "2 Approve / 2 Reject"
  },
  {
    agent: "Procurement",
    vote: "REJECT",
    reasoning: "The vendor failed to provide valid third-party risk management verification forms upon manual query.",
    confidence: 92,
    influenceScore: 5.0,
    timeOffset: 28,
    consensusAfter: "2 Approve / 3 Reject"
  }
];

export const CONSTITUTION_RULES: ConstitutionRule[] = [
  {
    id: "sec-const-1",
    title: "SOC2 Compliance Requirement",
    description: "All enterprise storage systems containing customer database items must reside on SOC2 verified hosts.",
    status: "FAIL",
    impactWeight: 10.0
  },
  {
    id: "fin-const-1",
    title: "Run-rate Target Efficiency",
    description: "Database configurations must seek cost savings of at least 15% when matching standard latency parameters.",
    status: "PASS",
    impactWeight: 5.5
  },
  {
    id: "sec-const-2",
    title: "Vulnerability Scan Thresholds",
    description: "No deployed library or software node can feature active Critical CVEs without patch isolation.",
    status: "FAIL",
    impactWeight: 9.0
  }
];

export const CAUSAL_LINKS: CausalLink[] = [
  {
    sourceEventId: "evt-ev-soc2-missing",
    targetEventId: "evt-vote-ciso-reject",
    reason: "Missing SOC2 certificate triggers CISO safety override protocol.",
    impactScore: 10.0
  },
  {
    sourceEventId: "evt-vote-ciso-reject",
    targetEventId: "evt-const-sec-override",
    reason: "CISO Veto triggers constitutional policy escalation sequence.",
    impactScore: 9.5
  },
  {
    sourceEventId: "evt-const-sec-override",
    targetEventId: "evt-sim-risk-elevated",
    reason: "Constitutional override alerts Monte Carlo engines to compute outlier fail paths.",
    impactScore: 8.8
  },
  {
    sourceEventId: "evt-sim-risk-elevated",
    targetEventId: "evt-reg-check-fail",
    reason: "Outage failure probability of 41% exceeds NIST access control margins.",
    impactScore: 9.0
  },
  {
    sourceEventId: "evt-reg-check-fail",
    targetEventId: "evt-verdict-blocked",
    reason: "NIST failure cascade forces immutable GRC veto blocks.",
    impactScore: 10.0
  }
];

// 40 to 60 structured timeline events to make it feel completely alive and granular
export const GOVERNANCE_EVENTS: GovernanceEvent[] = [
  {
    id: "evt-init",
    timestamp: 0,
    stage: "ARRIVAL",
    eventType: "system_init",
    title: "Replay Stream Convened",
    description: "Causal replay log initialized for proposal dispatch record DEC-1495.",
    severity: "info"
  },
  {
    id: "evt-prop-ingest",
    timestamp: 1,
    stage: "ARRIVAL",
    eventType: "proposal_ingested",
    title: "Proposal Ingestion",
    description: "Ingesting procurement directive to transition primary databases to Vendor X database nodes.",
    severity: "info",
    relatedArtifacts: ["DEC-1495"]
  },
  {
    id: "evt-prop-parsed",
    timestamp: 2,
    stage: "ARRIVAL",
    eventType: "proposal_parsed",
    title: "Metadata extraction complete",
    description: "Extracted parameters: Target Node: Vendor X, Latency Target: -24%, Run-rate Target: -$120k.",
    severity: "success"
  },
  {
    id: "evt-profile-match",
    timestamp: 3,
    stage: "ARRIVAL",
    eventType: "profile_match",
    title: "GRC Profile Locked",
    description: "Identified data type as 'Highly Regulated Customer Storage'. Strict constitutional policy paths assigned.",
    severity: "info"
  },
  {
    id: "evt-ev-query",
    timestamp: 4,
    stage: "EVIDENCE",
    eventType: "evidence_query",
    title: "Evidence Query Initiated",
    description: "Querying GRC datalakes and supplier trust portals for certified validation documentation.",
    severity: "info"
  },
  {
    id: "evt-ev-query-api",
    timestamp: 5,
    stage: "EVIDENCE",
    eventType: "api_connection",
    title: "Vendor APIs Queried",
    description: "Established secure handshake channels to Vendor X documentation directories.",
    severity: "success"
  },
  {
    id: "evt-ev-soc2-missing",
    timestamp: 7,
    stage: "EVIDENCE",
    eventType: "evidence_failed",
    title: "SOC2 Attestation Missing",
    description: "Critical Error: Vendor X did not provide a valid current SOC2 Type II certificate in trust portal payload.",
    severity: "error",
    relatedArtifacts: ["art-soc2-cert"]
  },
  {
    id: "evt-ev-cost-savings",
    timestamp: 9,
    stage: "EVIDENCE",
    eventType: "evidence_loaded",
    title: "Cost Analysis Loaded",
    description: "Validated procurement agent financial projections. Target ROI fits standard efficiency ratios.",
    severity: "success",
    relatedArtifacts: ["art-cost-savings"]
  },
  {
    id: "evt-ev-audit-run",
    timestamp: 10,
    stage: "EVIDENCE",
    eventType: "vuln_scan_started",
    title: "Vulnerability Scan",
    description: "Scanning Vendor X endpoint libraries using active CVSS v3 directories.",
    severity: "info"
  },
  {
    id: "evt-ev-audit-failed",
    timestamp: 11,
    stage: "EVIDENCE",
    eventType: "evidence_failed",
    title: "CVE Scan Detected Vulnerabilities",
    description: "Discovered 4 library vulnerabilities (2 Critical, 2 High) in network interface controls.",
    severity: "error",
    relatedArtifacts: ["art-security-audit"]
  },
  {
    id: "evt-ev-risk-register",
    timestamp: 13,
    stage: "EVIDENCE",
    eventType: "evidence_loaded",
    title: "Risk Profile Registered",
    description: "GRC risk posture logged to High Exposure Tier due to network border implications.",
    severity: "warning",
    relatedArtifacts: ["art-risk-register"]
  },
  {
    id: "evt-ev-done",
    timestamp: 14,
    stage: "EVIDENCE",
    eventType: "evidence_stage_complete",
    title: "Evidence Audits Concluded",
    description: "Ingestion pipeline finalized. Forwarding 4 compiled audit cards to Executive Board Debate modules.",
    severity: "warning"
  },
  {
    id: "evt-board-init",
    timestamp: 15,
    stage: "BOARD",
    eventType: "board_session_convened",
    title: "Board Debate Convened",
    description: "Consensus engines matching CFO, CISO, and Legal alignment parameters.",
    severity: "info"
  },
  {
    id: "evt-vote-cfo-approve",
    timestamp: 16,
    stage: "BOARD",
    eventType: "board_vote",
    title: "CFO Casts Vote: APPROVE",
    description: "CFO supports proposal: '$120,000 annual cost reduction complies with operational budget milestones.'",
    severity: "success",
    sourceAgent: "CFO"
  },
  {
    id: "evt-board-tally-1",
    timestamp: 17,
    stage: "BOARD",
    eventType: "consensus_update",
    title: "Consensus State Shift",
    description: "Active tally: 1 Approve / 0 Reject. CFO cost approval registered in session weights.",
    severity: "info"
  },
  {
    id: "evt-vote-ciso-reject",
    timestamp: 19,
    stage: "BOARD",
    eventType: "board_vote",
    title: "CISO Casts Vote: REJECT",
    description: "CISO Veto: 'Migration without a current SOC2 Type II certificate triggers extreme risk parameter exclusions.'",
    severity: "error",
    sourceAgent: "CISO"
  },
  {
    id: "evt-board-tally-2",
    timestamp: 20,
    stage: "BOARD",
    eventType: "consensus_update",
    title: "Consensus State Shift",
    description: "Active tally: 1 Approve / 1 Reject. CISO security override shifts priority matrices.",
    severity: "warning"
  },
  {
    id: "evt-vote-legal-reject",
    timestamp: 22,
    stage: "BOARD",
    eventType: "board_vote",
    title: "Legal Casts Vote: REJECT",
    description: "Legal Council rejects proposal: 'Lack of verified SOC2 documentation raises vendor indemnity hazard scores.'",
    severity: "error",
    sourceAgent: "Legal"
  },
  {
    id: "evt-board-tally-3",
    timestamp: 23,
    stage: "BOARD",
    eventType: "consensus_update",
    title: "Consensus State Shift",
    description: "Active tally: 1 Approve / 2 Reject. Legal reject status strengthens regulatory risk postures.",
    severity: "warning"
  },
  {
    id: "evt-vote-ops-approve",
    timestamp: 25,
    stage: "BOARD",
    eventType: "board_vote",
    title: "Operations Casts Vote: APPROVE",
    description: "Operations supports proposal: 'Database latency decreases meet throughput SLA thresholds.'",
    severity: "success",
    sourceAgent: "Operations"
  },
  {
    id: "evt-board-tally-4",
    timestamp: 26,
    stage: "BOARD",
    eventType: "consensus_update",
    title: "Consensus State Shift",
    description: "Active tally: 2 Approve / 2 Reject. Operational alignment metrics return to neutral weights.",
    severity: "info"
  },
  {
    id: "evt-vote-proc-reject",
    timestamp: 28,
    stage: "BOARD",
    eventType: "board_vote",
    title: "Procurement Casts Vote: REJECT",
    description: "Procurement rejects proposal: 'Vendor failed GRC onboarding questionnaires and standard safety validations.'",
    severity: "error",
    sourceAgent: "Procurement"
  },
  {
    id: "evt-board-tally-5",
    timestamp: 29,
    stage: "BOARD",
    eventType: "consensus_update",
    title: "Consensus State Shift",
    description: "Active tally: 2 Approve / 3 Reject. Majority reject state achieved. GRC ledger records CISO safety veto overrides.",
    severity: "warning"
  },
  {
    id: "evt-board-closed",
    timestamp: 33,
    stage: "BOARD",
    eventType: "board_debate_resolved",
    title: "Consensus Debate Concluded",
    description: "Final board decision resolved to REJECT based on weight aggregates. Safety overrides locked.",
    severity: "error"
  },
  {
    id: "evt-const-init",
    timestamp: 35,
    stage: "CAUSALITY",
    eventType: "constitution_scorecard_run",
    title: "Constitution Run Started",
    description: "Parsing decision actions against active corporate ESG and infrastructure safety constitutions.",
    severity: "info"
  },
  {
    id: "evt-const-sec-override",
    timestamp: 36,
    stage: "CAUSALITY",
    eventType: "constitutional_conflict",
    title: "Constitutional Override Event",
    description: "Rule Violation: 'SOC2 Attestation' fails security guidelines. System initiates override logic.",
    severity: "error",
    relatedArtifacts: ["art-soc2-cert"]
  },
  {
    id: "evt-const-rules-applied",
    timestamp: 37,
    stage: "CAUSALITY",
    eventType: "const_rule_evaluation",
    title: "Constitution Rules Parsed",
    description: "Result: 1 pass, 2 failures. Financial run-rate pass overridden by security rule failures.",
    severity: "error"
  },
  {
    id: "evt-sim-init",
    timestamp: 38,
    stage: "CAUSALITY",
    eventType: "simulation_started",
    title: "Monte Carlo Engine Ingress",
    description: "Spinning up 10,000 database load failures and transaction overload simulations.",
    severity: "info"
  },
  {
    id: "evt-sim-risk-elevated",
    timestamp: 41,
    stage: "CAUSALITY",
    eventType: "simulation_warning",
    title: "Outage Cascade Risk Elevated",
    description: "Simulation results: Outage cascade risk rises to 41% (exceeding standard limits of 15%).",
    severity: "error",
    relatedArtifacts: ["art-outage-simulation"]
  },
  {
    id: "evt-sim-exploit",
    timestamp: 43,
    stage: "CAUSALITY",
    eventType: "adversarial_alert",
    title: "Exploit Vectors Detected",
    description: "Running exploit loops indicates potential vulnerability vectors due to critical perimeter scan CVEs.",
    severity: "error",
    relatedArtifacts: ["art-security-audit"]
  },
  {
    id: "evt-sim-savings-pct",
    timestamp: 45,
    stage: "CAUSALITY",
    eventType: "simulation_outcome",
    title: "ROI Realization Confirmed",
    description: "Cost efficiency model predicts 85% run-rate match probability.",
    severity: "success"
  },
  {
    id: "evt-sim-complete",
    timestamp: 49,
    stage: "CAUSALITY",
    eventType: "simulation_concluded",
    title: "Enterprise Projections Resolved",
    description: "Monte Carlo models confirm that latency benefit does not justify the 41% outage cascade risk.",
    severity: "error"
  },
  {
    id: "evt-reg-init",
    timestamp: 50,
    stage: "REGULATORY",
    eventType: "regulatory_review_started",
    title: "Regulatory Frameworks Checked",
    description: "Enforcing NIST RMF AC controls and EU AI Act regulatory checks.",
    severity: "info"
  },
  {
    id: "evt-reg-check-fail",
    timestamp: 51,
    stage: "REGULATORY",
    eventType: "regulatory_violation",
    title: "NIST AC-1 Controls FAILED",
    description: "Missing SOC2 certification violates NIST access control standard baseline guidelines.",
    severity: "error",
    relatedArtifacts: ["art-regulatory-map"]
  },
  {
    id: "evt-reg-checks-concluded",
    timestamp: 53,
    stage: "REGULATORY",
    eventType: "regulatory_violations_logged",
    title: "Regulatory Checks Complete",
    description: "NIST framework check: FAILED. EU AI Act safety index check: WARNING.",
    severity: "error"
  },
  {
    id: "evt-verdict-init",
    timestamp: 55,
    stage: "CONVERGENCE",
    eventType: "verdict_converging",
    title: "Synthesis Phase Convened",
    description: "Consolidating findings from board debate, constitutions, simulations, and regulatory reviews.",
    severity: "warning"
  },
  {
    id: "evt-verdict-board-fail",
    timestamp: 56,
    stage: "CONVERGENCE",
    eventType: "verdict_subsystem_fail",
    title: "Board Consensus State: REJECTED",
    description: "Consensus weight: 3 Reject votes out of 5 board participants.",
    severity: "error"
  },
  {
    id: "evt-verdict-const-fail",
    timestamp: 57,
    stage: "CONVERGENCE",
    eventType: "verdict_subsystem_fail",
    title: "Constitution State: OVERRIDDEN",
    description: "Security override active due to SOC2 and vulnerability scanner failures.",
    severity: "error"
  },
  {
    id: "evt-verdict-reg-fail",
    timestamp: 58,
    stage: "CONVERGENCE",
    eventType: "verdict_subsystem_fail",
    title: "Regulatory State: NON-COMPLIANT",
    description: "NIST GRC framework validation returned critical error status.",
    severity: "error"
  },
  {
    id: "evt-verdict-sim-fail",
    timestamp: 59,
    stage: "CONVERGENCE",
    eventType: "verdict_subsystem_fail",
    title: "Simulation State: DANGER INDEX ELEVATED",
    description: "41% failure probability exceeds operational system thresholds.",
    severity: "error"
  },
  {
    id: "evt-verdict-blocked",
    timestamp: 60,
    stage: "CONVERGENCE",
    eventType: "verdict_issued",
    title: "FINAL GOVERNANCE VERDICT: BLOCKED",
    description: "Decision proposal DEC-1495 blocked. Immutable GRC records registered.",
    severity: "error"
  },
  {
    id: "evt-ledger-sealed",
    timestamp: 62,
    stage: "CONVERGENCE",
    eventType: "ledger_sealed",
    title: "Ledger Cryptography Sealed",
    description: "Verification hash 0x7F2A...4B9D written. Lifecycle history locked into audit memory.",
    severity: "success"
  },
  {
    id: "evt-root-cause-init",
    timestamp: 63,
    stage: "ROOT_CAUSE",
    eventType: "root_cause_analysis",
    title: "Root Cause Engine Initiated",
    description: "Generating driver weight matrices, counterfactual analysis projections, and minimal check logs.",
    severity: "info"
  },
  {
    id: "evt-root-counterfactual",
    timestamp: 65,
    stage: "ROOT_CAUSE",
    eventType: "counterfactual_generated",
    title: "Counterfactual Scenario Rendered",
    description: "If SOC2 attestation existed: Approval Probability = 74%. Model shows primary veto sequence breaks.",
    severity: "success"
  },
  {
    id: "evt-replay-done",
    timestamp: 72,
    stage: "ROOT_CAUSE",
    eventType: "simulation_finished",
    title: "Replay sequence completed",
    description: "Review mode fully rendered. Auditing ledger remains accessible below.",
    severity: "info"
  }
];
