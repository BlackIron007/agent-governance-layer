import { ApprovalFixItem, CounterfactualOutcome } from "../types/governanceReplay";

export const MINIMAL_FIX_SET: ApprovalFixItem[] = [
  {
    id: "fix-soc2",
    description: "Provide valid SOC2 Type II certification",
    impactProbabilityPct: 24
  },
  {
    id: "fix-procure",
    description: "Complete third-party GRC procurement onboarding",
    impactProbabilityPct: 13
  },
  {
    id: "fix-cve",
    description: "Resolve critical security scanner library CVEs",
    impactProbabilityPct: 16
  }
];

export const COUNTERFACTUAL_OUTCOME: CounterfactualOutcome = {
  currentVerdict: "BLOCKED",
  currentProbabilityPct: 38,
  projectedVerdict: "APPROVED",
  projectedProbabilityPct: 91,
  currentFriction: 84,
  projectedFriction: 29
};
