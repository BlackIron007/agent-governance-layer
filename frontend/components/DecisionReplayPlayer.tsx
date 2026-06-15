"use client";

import GovernanceReplayModal from "./GovernanceReplayModal";

interface DecisionReplayPlayerProps {
  onClose: () => void;
  verdict: "APPROVED" | "BLOCKED" | "CONDITIONAL_ALLOW";
  events?: any[];
}

export default function DecisionReplayPlayer({ onClose }: DecisionReplayPlayerProps) {
  return <GovernanceReplayModal onClose={onClose} />;
}
