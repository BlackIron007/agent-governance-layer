import { useMemo } from "react";
import { getCounterfactualForNode, CounterfactualBranch } from "../lib/counterfactualEngine";

export function useCounterfactuals(selectedNodeId: string | null) {
  const counterfactual = useMemo(() => {
    if (!selectedNodeId) return null;
    return getCounterfactualForNode(selectedNodeId);
  }, [selectedNodeId]);

  return {
    counterfactual
  };
}
