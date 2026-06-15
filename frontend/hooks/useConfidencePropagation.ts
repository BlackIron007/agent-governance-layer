import { useMemo } from "react";
import { 
  AGENT_CONFIDENCES, 
  RULE_CONFIDENCES, 
  EVIDENCE_CONFIDENCES, 
  calculatePropagatedConfidence 
} from "../lib/confidencePropagationEngine";

export function useConfidencePropagation(selectedNodeId: string | null) {
  const propagated = useMemo(() => {
    return calculatePropagatedConfidence(selectedNodeId || "node-soc2-missing");
  }, [selectedNodeId]);

  return {
    agentConfidences: AGENT_CONFIDENCES,
    ruleConfidences: RULE_CONFIDENCES,
    evidenceConfidences: EVIDENCE_CONFIDENCES,
    propagated
  };
}
