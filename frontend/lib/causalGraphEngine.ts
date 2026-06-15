export interface CausalNode {
  id: string;
  name: string;
  type: string;
  confidence: number;
  impactScore: number;
  upstreamIds: string[];
  downstreamIds: string[];
  directConsequences: string[];
  indirectConsequences: string[];
  verdictContributionPct: number;
}

export interface CausalEdge {
  sourceId: string;
  targetId: string;
  relationship: string;
  impactMagnitude: string;
  confidence: number;
}

export const CAUSAL_NODES: CausalNode[] = [
  {
    id: "node-vendor-select",
    name: "Vendor Selection Ingestion",
    type: "Arrival",
    confidence: 98,
    impactScore: 10,
    upstreamIds: [],
    downstreamIds: ["node-soc2-missing"],
    directConsequences: ["SOC2 Certificate scan initialized"],
    indirectConsequences: ["CISO safety review sequence"],
    verdictContributionPct: 5
  },
  {
    id: "node-soc2-missing",
    name: "SOC2 Certificate Missing",
    type: "Evidence",
    confidence: 100,
    impactScore: 50,
    upstreamIds: ["node-vendor-select"],
    downstreamIds: ["node-security-triggered"],
    directConsequences: ["Security Constitution Triggered", "CISO Veto Activated"],
    indirectConsequences: ["NIST Compliance Failure", "Monte Carlo Simulation Risk Spike"],
    verdictContributionPct: 47
  },
  {
    id: "node-security-triggered",
    name: "Security Constitution Triggered",
    type: "Constitution",
    confidence: 94,
    impactScore: 40,
    upstreamIds: ["node-soc2-missing"],
    downstreamIds: ["node-ciso-reject"],
    directConsequences: ["CISO Rejection enforced"],
    indirectConsequences: ["Regulatory NIST Compliance Failure"],
    verdictContributionPct: 20
  },
  {
    id: "node-ciso-reject",
    name: "CISO Rejection",
    type: "Board Vote",
    confidence: 97,
    impactScore: 45,
    upstreamIds: ["node-security-triggered"],
    downstreamIds: ["node-risk-spike"],
    directConsequences: ["Board Consensus Shifted"],
    indirectConsequences: ["Simulation failure forecasts"],
    verdictContributionPct: 15
  },
  {
    id: "node-risk-spike",
    name: "Risk Simulation Increase",
    type: "Simulation",
    confidence: 85,
    impactScore: 38,
    upstreamIds: ["node-ciso-reject"],
    downstreamIds: ["node-nist-fail"],
    directConsequences: ["Monte Carlo Outage Cascade projection of 41%"],
    indirectConsequences: ["NIST AC-1 Controls failure"],
    verdictContributionPct: 8
  },
  {
    id: "node-nist-fail",
    name: "NIST Compliance Failure",
    type: "Regulatory",
    confidence: 95,
    impactScore: 42,
    upstreamIds: ["node-risk-spike"],
    downstreamIds: ["node-final-verdict"],
    directConsequences: ["Regulatory framework AC-1 failure"],
    indirectConsequences: ["GRC Ledger Verdict locking"],
    verdictContributionPct: 5
  },
  {
    id: "node-final-verdict",
    name: "Final Verdict: BLOCKED",
    type: "Verdict",
    confidence: 98,
    impactScore: 90,
    upstreamIds: ["node-nist-fail"],
    downstreamIds: [],
    directConsequences: ["DEC-1495 proposal blocked"],
    indirectConsequences: ["Ledger hash cryptographically sealed"],
    verdictContributionPct: 0
  }
];

export const CAUSAL_EDGES: CausalEdge[] = [
  {
    sourceId: "node-vendor-select",
    targetId: "node-soc2-missing",
    relationship: "Vendor details initialized GRC trust portal scans",
    impactMagnitude: "+10 Ingress Friction",
    confidence: 98
  },
  {
    sourceId: "node-soc2-missing",
    targetId: "node-security-triggered",
    relationship: "Missing compliance certificate violates SEC-CONST-1 rule",
    impactMagnitude: "+35 Risk Score",
    confidence: 96
  },
  {
    sourceId: "node-security-triggered",
    targetId: "node-ciso-reject",
    relationship: "Rule violation mandates CISO security override protocol",
    impactMagnitude: "Veto Lock",
    confidence: 94
  },
  {
    sourceId: "node-ciso-reject",
    targetId: "node-risk-spike",
    relationship: "Security veto prompts worst-case Monte Carlo path computation",
    impactMagnitude: "Odds: 68% -> 42%",
    confidence: 97
  },
  {
    sourceId: "node-risk-spike",
    targetId: "node-nist-fail",
    relationship: "Outage failure risk level exceeds NIST safety margin limits",
    impactMagnitude: "+18 Risk Score",
    confidence: 85
  },
  {
    sourceId: "node-nist-fail",
    targetId: "node-final-verdict",
    relationship: "Regulatory access control failure locks GRC validation engine status",
    impactMagnitude: "Final block",
    confidence: 95
  }
];

export function getCausalTrace(nodeId: string) {
  const node = CAUSAL_NODES.find((n) => n.id === nodeId);
  if (!node) return { upstreams: [], downstreams: [] };

  const upstreams: string[] = [];
  const downstreams: string[] = [];

  // Helper to trace upstreams
  const traceUp = (id: string) => {
    const curr = CAUSAL_NODES.find((n) => n.id === id);
    if (!curr) return;
    curr.upstreamIds.forEach((upId) => {
      if (!upstreams.includes(upId)) {
        upstreams.push(upId);
        traceUp(upId);
      }
    });
  };

  // Helper to trace downstreams
  const traceDown = (id: string) => {
    const curr = CAUSAL_NODES.find((n) => n.id === id);
    if (!curr) return;
    curr.downstreamIds.forEach((downId) => {
      if (!downstreams.includes(downId)) {
        downstreams.push(downId);
        traceDown(downId);
      }
    });
  };

  traceUp(nodeId);
  traceDown(nodeId);

  return { upstreams, downstreams };
}
