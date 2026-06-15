import { CrossExamData } from "../types/governanceReplay";

export const CROSS_EXAM_DATASET: Record<string, CrossExamData> = {
  "node-1": {
    nodeId: "node-1",
    question: "Should a new database recommendation trigger a deep compliance audit?",
    supportingArgs: [
      "Target database houses regulated client PII.",
      "Any migration creates perimeter risk vectors.",
      "GDPR standards mandate zero retention validation."
    ],
    opposingArgs: [
      "Standard software upgrades don't require board convening.",
      "Audit latency creates execution bottlenecks.",
      "Internal infrastructure remains isolated."
    ],
    position: "ALLOW",
    confidence: 95,
    reasoningSummary: "Initial proposal carries latency savings, justifying standard verification pipeline routing."
  },
  "node-2": {
    nodeId: "node-2",
    question: "Should cost savings outweigh potential compliance overrides?",
    supportingArgs: [
      "Annual savings of $120,000 verified.",
      "Meets corporate budget efficiency guidelines.",
      "Operations supports latency decreases."
    ],
    opposingArgs: [
      "Cost metrics do not offset GDPR breach liabilities.",
      "Budget targets are secondary to safety constitution rules."
    ],
    position: "ALLOW",
    confidence: 91,
    reasoningSummary: "Savings parameters validated; however, security and legal criteria must remain passing."
  },
  "node-3": {
    nodeId: "node-3",
    question: "Should a missing SOC2 certificate justify blocking this proposal?",
    supportingArgs: [
      "SEC-CONST-1 triggered.",
      "Security Constitution violation.",
      "NIST compliance failure.",
      "Elevated liability exposure."
    ],
    opposingArgs: [
      "20% operational latency savings.",
      "No active breach evidence.",
      "Alternative compensating controls exist.",
      "Vendor risk historically low."
    ],
    position: "BLOCK",
    confidence: 84,
    reasoningSummary: "Cost savings were insufficient to offset constitutional and regulatory violations."
  },
  "node-4": {
    nodeId: "node-4",
    question: "Is the CISO's unilateral veto policy alignment justified?",
    supportingArgs: [
      "CISO is the primary threat guardian.",
      "Unresolved perimeter vulnerabilities pose material risks.",
      "Veto triggers standard constitutional escalation."
    ],
    opposingArgs: [
      "Ops and CFO consensus overridden.",
      "Creates board alignment bottlenecks."
    ],
    position: "BLOCK",
    confidence: 88,
    reasoningSummary: "Critical scanner CVEs support immediate perimeter isolation vetoes."
  },
  "node-5": {
    nodeId: "node-5",
    question: "Should constitutional overrides take precedence over board consensus?",
    supportingArgs: [
      "Constitutions encode invariant risk constraints.",
      "Prevents consensus collusion.",
      "Guarantees compliance rules remain active."
    ],
    opposingArgs: [
      "Board debate is meant to be the supreme authority.",
      "Disenfranchises human operations."
    ],
    position: "BLOCK",
    confidence: 90,
    reasoningSummary: "Constitutional rules block proposals automatically when safety indices collapse."
  },
  "node-6": {
    nodeId: "node-6",
    question: "Does a 41% simulated failure cascade rate warrant GRC blocks?",
    supportingArgs: [
      "Exceeds standard 15% safety limit.",
      "Monte Carlo models reflect structural latency hazards.",
      "Avoids customer-facing outage scenarios."
    ],
    opposingArgs: [
      "Simulations compute worst-case parameters.",
      "Active servers rarely match simulated hazard loads."
    ],
    position: "BLOCK",
    confidence: 85,
    reasoningSummary: "High outage hazards threaten customer-facing SLA guarantees."
  },
  "node-7": {
    nodeId: "node-7",
    question: "Should NIST controls failure override procurement targets?",
    supportingArgs: [
      "NIST AC-1 violations prevent GRC sign-off.",
      "Exposes company to regulatory audit fines."
    ],
    opposingArgs: [
      "Deployment delay creates competitor lag."
    ],
    position: "BLOCK",
    confidence: 94,
    reasoningSummary: "Compliance standards require active SOC2 before database ingress authorization."
  },
  "node-8": {
    nodeId: "node-8",
    question: "Is the final blocked verdict irreversibly locked?",
    supportingArgs: [
      "Ledger cryptography seals audit blocks.",
      "Guarantees compliance trail remains immutable."
    ],
    opposingArgs: [
      "Manual overrides could authorize bypass."
    ],
    position: "BLOCK",
    confidence: 98,
    reasoningSummary: "Regulatory failures and board reject consensus force final GRC ledger locks."
  }
};

export function getCrossExamForNode(nodeId: string): CrossExamData | null {
  return CROSS_EXAM_DATASET[nodeId] || null;
}
