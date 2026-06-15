export interface AgentConfidence {
  agent: string;
  confidence: number;
}

export interface RuleConfidence {
  rule: string;
  result: "PASSED" | "FAILED";
  confidence: number;
}

export interface EvidenceConfidence {
  artifact: string;
  confidence: number;
}

export interface PropagatedConfidence {
  evidenceLayer: number;
  boardLayer: number;
  simulationLayer: number;
  regulatoryLayer: number;
  finalVerdictLayer: number;
}

export const AGENT_CONFIDENCES: AgentConfidence[] = [
  { agent: "CFO", confidence: 91 },
  { agent: "CISO", confidence: 97 },
  { agent: "Legal", confidence: 72 },
  { agent: "Operations", confidence: 65 },
  { agent: "Procurement", confidence: 88 }
];

export const RULE_CONFIDENCES: RuleConfidence[] = [
  { rule: "SEC-CONST-1 (SOC2 Compliance)", result: "FAILED", confidence: 94 },
  { rule: "SEC-CONST-2 (Vulnerability Scan)", result: "FAILED", confidence: 89 },
  { rule: "FIN-CONST-1 (Run-rate Target)", result: "PASSED", confidence: 98 },
  { rule: "GRC-SIM-04 (Service Availability)", result: "FAILED", confidence: 85 }
];

export const EVIDENCE_CONFIDENCES: EvidenceConfidence[] = [
  { artifact: "SOC2 Report", confidence: 100 },
  { artifact: "Vendor Questionnaire", confidence: 62 },
  { artifact: "Proposal Payload DEC-1495", confidence: 98 },
  { artifact: "Cost Analysis sheet #FIN-294", confidence: 90 }
];

export function calculatePropagatedConfidence(nodeId: string): PropagatedConfidence {
  // Base numbers defined in spec, with minor variation depending on active node to feel dynamic.
  let seed = 0;
  if (nodeId === "node-soc2-missing" || nodeId === "node-3") seed = 1;
  if (nodeId === "node-ciso-reject" || nodeId === "node-4") seed = -2;
  if (nodeId === "node-risk-spike" || nodeId === "node-6") seed = 3;
  
  return {
    evidenceLayer: 88 + seed,
    boardLayer: 81 + seed,
    simulationLayer: 74 + seed,
    regulatoryLayer: 92 + seed,
    finalVerdictLayer: 84 + seed
  };
}
