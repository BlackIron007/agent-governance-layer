"use client";

import { useMemo } from "react";
import { getDeltaForNode } from "../lib/governanceDeltaEngine";
import { getCrossExamForNode } from "../lib/governanceAnalysis";
import { MINIMAL_FIX_SET, COUNTERFACTUAL_OUTCOME } from "../lib/governanceCounterfactuals";

export function useGovernanceAnalysis(nodeId: string | null) {
  const deltaMetrics = useMemo(() => {
    if (!nodeId) return null;
    return getDeltaForNode(nodeId);
  }, [nodeId]);

  const crossExam = useMemo(() => {
    if (!nodeId) return null;
    return getCrossExamForNode(nodeId);
  }, [nodeId]);

  const rejectionDrivers = useMemo(() => {
    return [
      { name: "Missing SOC2 Certificate", weight: 50, rule: "SEC-CONST-1", status: "CRITICAL" },
      { name: "Constitutional Override Veto", weight: 25, rule: "SEC-CONST-2", status: "HIGH" },
      { name: "Regulatory Non-Compliance", weight: 15, rule: "NIST-AC-01", status: "HIGH" },
      { name: "Simulation Failure Exposure", weight: 10, rule: "MC-OUT-04", status: "WARNING" }
    ];
  }, []);

  return {
    deltaMetrics,
    crossExam,
    rejectionDrivers,
    minimalFixSet: MINIMAL_FIX_SET,
    counterfactualOutcome: COUNTERFACTUAL_OUTCOME
  };
}
