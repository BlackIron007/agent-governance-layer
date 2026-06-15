import { GrcDeltaMetrics } from "../types/governanceReplay";

export const NODE_DELTAS: Record<string, GrcDeltaMetrics> = {
  "node-1": {
    approvalProbability: { from: 50, to: 95 },
    riskExposure: { from: 10, to: 32 },
    evidenceStrength: { from: 10, to: 68 },
    boardConsensus: { from: "0 Approve / 0 Reject", to: "0 Approve / 0 Reject" },
    constitutionalAlignment: { from: 100, to: 100 },
    regulatoryCompliance: { from: "PASS", to: "PASS" }
  },
  "node-2": {
    approvalProbability: { from: 95, to: 98 },
    riskExposure: { from: 32, to: 32 },
    evidenceStrength: { from: 68, to: 75 },
    boardConsensus: { from: "1 Approve / 0 Reject", to: "2 Approve / 0 Reject" },
    constitutionalAlignment: { from: 100, to: 100 },
    regulatoryCompliance: { from: "PASS", to: "PASS" }
  },
  "node-3": {
    approvalProbability: { from: 98, to: 68 },
    riskExposure: { from: 32, to: 45 },
    evidenceStrength: { from: 75, to: 50 },
    boardConsensus: { from: "0 Approve / 0 Reject", to: "1 Approve / 1 Reject" },
    constitutionalAlignment: { from: 100, to: 75 },
    regulatoryCompliance: { from: "PASS", to: "WARNING" }
  },
  "node-4": {
    approvalProbability: { from: 68, to: 42 },
    riskExposure: { from: 45, to: 72 },
    evidenceStrength: { from: 50, to: 64 },
    boardConsensus: { from: "1 Approve / 1 Reject", to: "1 Approve / 2 Reject" },
    constitutionalAlignment: { from: 75, to: 50 },
    regulatoryCompliance: { from: "WARNING", to: "FAIL" }
  },
  "node-5": {
    approvalProbability: { from: 42, to: 38 },
    riskExposure: { from: 72, to: 88 },
    evidenceStrength: { from: 64, to: 82 },
    boardConsensus: { from: "1 Approve / 2 Reject", to: "2 Approve / 2 Reject" },
    constitutionalAlignment: { from: 50, to: 40 },
    regulatoryCompliance: { from: "FAIL", to: "FAIL" }
  },
  "node-6": {
    approvalProbability: { from: 38, to: 24 },
    riskExposure: { from: 88, to: 92 },
    evidenceStrength: { from: 82, to: 85 },
    boardConsensus: { from: "2 Approve / 2 Reject", to: "2 Approve / 3 Reject" },
    constitutionalAlignment: { from: 40, to: 35 },
    regulatoryCompliance: { from: "FAIL", to: "FAIL" }
  },
  "node-7": {
    approvalProbability: { from: 24, to: 12 },
    riskExposure: { from: 92, to: 98 },
    evidenceStrength: { from: 85, to: 95 },
    boardConsensus: { from: "2 Approve / 3 Reject", to: "2 Approve / 3 Reject" },
    constitutionalAlignment: { from: 35, to: 30 },
    regulatoryCompliance: { from: "FAIL", to: "FAIL" }
  },
  "node-8": {
    approvalProbability: { from: 12, to: 38 },
    riskExposure: { from: 98, to: 98 },
    evidenceStrength: { from: 95, to: 95 },
    boardConsensus: { from: "2 Approve / 3 Reject", to: "2 Approve / 3 Reject" },
    constitutionalAlignment: { from: 30, to: 30 },
    regulatoryCompliance: { from: "FAIL", to: "FAIL" }
  }
};

export function getDeltaForNode(nodeId: string): GrcDeltaMetrics | null {
  return NODE_DELTAS[nodeId] || null;
}
