"use client";

import { Suspense } from "react";
import GovernanceReplayModal from "../../components/GovernanceReplayModal";

function WarRoomContent() {
  return <GovernanceReplayModal isStandalone={true} />;
}

export default function GovernanceWarRoomV5() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fff9ee] flex items-center justify-center font-mono text-xs text-[#817a67]">
        Loading Governance Control Monitor...
      </div>
    }>
      <WarRoomContent />
    </Suspense>
  );
}
