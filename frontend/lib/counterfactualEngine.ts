export interface CounterfactualBranch {
  nodeId: string;
  eventName: string;
  actualEventState: string;
  counterfactualEventState: string;
  description: string;
  actualProbability: number;
  counterfactualProbability: number;
  actualRisk: number;
  counterfactualRisk: number;
  actualVerdict: string;
  counterfactualVerdict: string;
  actualBoardVote: string;
  counterfactualBoardVote: string;
}

export const COUNTERFACTUAL_BRANCHES: Record<string, CounterfactualBranch> = {
  "node-vendor-select": {
    nodeId: "node-vendor-select",
    eventName: "Vendor Selection Ingestion",
    actualEventState: "Vendor X database procurement proposal ingested",
    counterfactualEventState: "No vendor proposal ingested",
    description: "If no vendor selection recommendation had been ingested, no risk verification workflow would have launched.",
    actualProbability: 38,
    counterfactualProbability: 0,
    actualRisk: 84,
    counterfactualRisk: 10,
    actualVerdict: "Blocked",
    counterfactualVerdict: "Dismissed (No Action)",
    actualBoardVote: "CFO: Approve | CISO: Reject | Legal: Reject",
    counterfactualBoardVote: "CFO: N/A | CISO: N/A | Legal: N/A"
  },
  "node-soc2-missing": {
    nodeId: "node-soc2-missing",
    eventName: "SOC2 Certificate Missing",
    actualEventState: "SOC2 missing or expired in trust registry",
    counterfactualEventState: "SOC2 Present (Valid Certificate)",
    description: "Providing a valid SOC2 Type II audit report resolves the primary compliance failure, bypassing the Security Constitution ruleset veto.",
    actualProbability: 38,
    counterfactualProbability: 74,
    actualRisk: 84,
    counterfactualRisk: 51,
    actualVerdict: "Blocked",
    counterfactualVerdict: "Conditional Approval",
    actualBoardVote: "CFO: Approve | CISO: Reject | Legal: Reject",
    counterfactualBoardVote: "CFO: Approve | CISO: Approve (Pending Audit) | Legal: Approve"
  },
  "node-security-triggered": {
    nodeId: "node-security-triggered",
    eventName: "Security Constitution Triggered",
    actualEventState: "SEC-CONST-1 rule violation detected",
    counterfactualEventState: "SEC-CONST-1 rule bypassed (Compliance Waiver)",
    description: "If the SEC-CONST-1 rule was waived or satisfied by supplementary security logs, CISO rejection override wouldn't trigger.",
    actualProbability: 38,
    counterfactualProbability: 68,
    actualRisk: 84,
    counterfactualRisk: 55,
    actualVerdict: "Blocked",
    counterfactualVerdict: "Conditional Approval",
    actualBoardVote: "CISO: Reject | Legal: Reject",
    counterfactualBoardVote: "CISO: Conditional Approve | Legal: Approve"
  },
  "node-ciso-reject": {
    nodeId: "node-ciso-reject",
    eventName: "CISO Rejection",
    actualEventState: "CISO enforces security perimeter veto protocol",
    counterfactualEventState: "CISO Approve (Conditional on Encryption)",
    description: "If the CISO approved the database proposal subject to application-level column encryption, the board consensus shifts.",
    actualProbability: 38,
    counterfactualProbability: 72,
    actualRisk: 84,
    counterfactualRisk: 45,
    actualVerdict: "Blocked",
    counterfactualVerdict: "Conditional Approval",
    actualBoardVote: "Board: 2-3 Reject",
    counterfactualBoardVote: "Board: 3-2 Approve"
  },
  "node-risk-spike": {
    nodeId: "node-risk-spike",
    eventName: "Risk Simulation Increase",
    actualEventState: "Transaction simulation projects 41% outage cascade",
    counterfactualEventState: "Transaction simulation projects normal load (15% risk)",
    description: "If the Monte Carlo transaction simulator predicted normal load tolerance levels, operational friction stays low.",
    actualProbability: 38,
    counterfactualProbability: 65,
    actualRisk: 84,
    counterfactualRisk: 48,
    actualVerdict: "Blocked",
    counterfactualVerdict: "Approved (Standard Monitoring)",
    actualBoardVote: "Operations: Reject | Procurement: Reject",
    counterfactualBoardVote: "Operations: Approve | Procurement: Approve"
  },
  "node-nist-fail": {
    nodeId: "node-nist-fail",
    eventName: "NIST Compliance Failure",
    actualEventState: "NIST AC-1 Access Control standard violation logged",
    counterfactualEventState: "NIST AC-1 controls standard passed",
    description: "Satisfying the NIST AC-1 access control baseline through alternative multi-factor validation prevents regulatory block.",
    actualProbability: 38,
    counterfactualProbability: 88,
    actualRisk: 84,
    counterfactualRisk: 35,
    actualVerdict: "Blocked",
    counterfactualVerdict: "Approved (Compliant)",
    actualBoardVote: "Regulatory Layer: BLOCK",
    counterfactualBoardVote: "Regulatory Layer: PASS"
  },
  "node-final-verdict": {
    nodeId: "node-final-verdict",
    eventName: "Final Verdict",
    actualEventState: "Verdict: BLOCKED",
    counterfactualEventState: "Verdict: APPROVED (via override)",
    description: "Overriding the automated decision via executive GRC committee keys registers a manual approval status on-chain.",
    actualProbability: 38,
    counterfactualProbability: 95,
    actualRisk: 84,
    counterfactualRisk: 25,
    actualVerdict: "Blocked",
    counterfactualVerdict: "Approved (Manual Veto Bypass)",
    actualBoardVote: "Committee: 0-5 Veto Enforced",
    counterfactualBoardVote: "Committee: 4-1 Bypass Approved"
  }
};

export function getCounterfactualForNode(nodeId: string): CounterfactualBranch | null {
  // Map page node IDs (node-1, node-2, etc.) or causal node IDs (node-soc2-missing, etc.)
  let key = nodeId;
  if (nodeId === "node-1") key = "node-vendor-select";
  if (nodeId === "node-2") key = "node-vendor-select"; // or map to something else
  if (nodeId === "node-3") key = "node-soc2-missing";
  if (nodeId === "node-4") key = "node-ciso-reject";
  if (nodeId === "node-5") key = "node-security-triggered";
  if (nodeId === "node-6") key = "node-risk-spike";
  if (nodeId === "node-7") key = "node-nist-fail";
  if (nodeId === "node-8") key = "node-final-verdict";
  return COUNTERFACTUAL_BRANCHES[key] || COUNTERFACTUAL_BRANCHES[nodeId] || null;
}
