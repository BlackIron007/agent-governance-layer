import { EventStage } from "../lib/mockGovernanceReplay";

export interface GrcDeltaMetrics {
  approvalProbability: { from: number; to: number };
  riskExposure: { from: number; to: number };
  evidenceStrength: { from: number; to: number };
  boardConsensus: { from: string; to: string };
  constitutionalAlignment: { from: number; to: number };
  regulatoryCompliance: { from: "PASS" | "FAIL" | "WARNING"; to: "PASS" | "FAIL" | "WARNING" };
}

export interface CrossExamData {
  nodeId: string;
  question: string;
  supportingArgs: string[];
  opposingArgs: string[];
  position: "BLOCK" | "ALLOW" | "CONDITIONAL";
  confidence: number;
  reasoningSummary: string;
}

export interface ApprovalFixItem {
  id: string;
  description: string;
  impactProbabilityPct: number;
}

export interface CounterfactualOutcome {
  currentVerdict: "BLOCKED";
  currentProbabilityPct: number;
  projectedVerdict: "APPROVED";
  projectedProbabilityPct: number;
  currentFriction: number;
  projectedFriction: number;
}
