"use client";

import { usePathname } from "next/navigation";
import { CheckCircle2, ChevronRight, Activity, Calendar, ShieldCheck } from "lucide-react";

interface LifecycleStage {
  id: string;
  label: string;
}

const LIFECYCLE_STAGES: LifecycleStage[] = [
  { id: "proposal", label: "Proposal" },
  { id: "evidence", label: "Evidence" },
  { id: "board", label: "Executive Board" },
  { id: "constitution", label: "Constitution" },
  { id: "adversarial", label: "Adversarial" },
  { id: "simulation", label: "Simulation" },
  { id: "regulatory", label: "Regulatory" },
  { id: "verdict", label: "Verdict" },
  { id: "audit", label: "Audit Record" },
  { id: "intelligence", label: "Intelligence" },
];

export default function GlobalGovernanceTracker() {
  const pathname = usePathname();

  // Determine active index based on route name
  let activeIdx = 0; // Default to overview (Landing)
  let decisionIdLabel = "SYSTEM_IDLE";
  if (pathname === "/") {
    activeIdx = -1; // Special Overview layout: highlight all overview nodes
    decisionIdLabel = "DEC-PREVIEW";
  } else if (pathname.includes("/command-center")) {
    activeIdx = 2; // Active = Executive Board
    decisionIdLabel = "DEC-1495";
  } else if (pathname.includes("/decision-history")) {
    activeIdx = 8; // Active = Audit Record (history)
    decisionIdLabel = "DEC-LEDGER";
  } else if (pathname.includes("/decision/")) {
    activeIdx = 8; // Active = Audit Record (details)
    // Extract decision id from route if possible
    const match = pathname.match(/\/decision\/(DEC-\d+)/);
    decisionIdLabel = match ? match[1] : "DEC-1495";
  } else if (pathname.includes("/intelligence")) {
    activeIdx = 9; // Active = Intelligence
    decisionIdLabel = "DRIFT-MONITOR";
  }

  // Timestamps for completing stages (mocked relative to active index)
  const timestamps = [
    "21:11:00",
    "21:11:02",
    "21:11:04",
    "21:11:06",
    "21:11:08",
    "21:11:10",
    "21:11:12",
    "21:11:14",
    "21:11:14",
    "21:11:15"
  ];

  return (
    <div className="w-full bg-[#f5eddd] border-b border-[#b9b29c]/25 py-2.5 px-4 md:px-6 shadow-sm">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        {/* Left Side: Indicator Label */}
        <div className="flex items-center gap-3 shrink-0 text-[10px] font-mono text-[#817a67]">
          <Activity className="w-3.5 h-3.5 text-[#715b3e] animate-pulse" />
          <span className="flex items-center gap-1">
            GOVERNANCE LINEAGE: <strong className="text-[#715b3e] font-semibold bg-[#715b3e]/10 px-1.5 py-0.5 border border-[#715b3e]/20">{decisionIdLabel}</strong>
          </span>
        </div>

        {/* Right Side: Horizontal flow */}
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2 justify-center">
          {LIFECYCLE_STAGES.map((stage, idx) => {
            // Determine styling status
            let isComplete = false;
            let isActive = false;
            
            if (activeIdx === -1) {
              isComplete = true; // highlight all for landing overview preview
            } else if (idx < activeIdx) {
              isComplete = true;
            } else if (idx === activeIdx) {
              isActive = true;
            }

            return (
              <div key={stage.id} className="flex items-center gap-1">
                <div 
                  className={`flex flex-col items-center px-2 py-1 border text-[9px] uppercase font-mono transition-all duration-300 relative ${
                    isActive
                      ? "bg-[#715b3e] text-[#fff9ee] border-[#715b3e] scale-105 font-bold shadow-sm animate-pulse"
                      : isComplete
                      ? "text-[#3a684d] border-[#3a684d]/30 bg-[#3a684d]/5"
                      : "text-stone-400 border-stone-200 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-1 font-semibold">
                    {isComplete && <CheckCircle2 className="w-2.5 h-2.5 text-[#3a684d] shrink-0" />}
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#fff9ee] animate-ping shrink-0" />}
                    <span>{stage.label}</span>
                  </div>
                  {isComplete && (
                    <span className="text-[7.5px] font-mono text-stone-500 font-light block mt-0.5 opacity-80">
                      {timestamps[idx]}
                    </span>
                  )}
                  {isActive && (
                    <span className="text-[7.5px] font-mono text-[#fff9ee]/80 font-semibold block mt-0.5 animate-pulse">
                      ACTIVE
                    </span>
                  )}
                </div>
                {idx < LIFECYCLE_STAGES.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-stone-300" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// Decision Lineage Banner Component
// Displays stateful details of a given active decision tracking lineage
// ───────────────────────────────────────────────────────────────────────
interface DecisionLineageBannerProps {
  decisionId: string;
}

export function DecisionLineageBanner({ decisionId }: DecisionLineageBannerProps) {
  const steps = [
    { label: "Submitted", status: "PASS", time: "16:34:00" },
    { label: "Debated", status: "VETO_OVERRIDE", time: "16:34:01" },
    { label: "Constitutionally Evaluated", status: "CONFLICT", time: "16:34:01" },
    { label: "Attack Tested", status: "EXPLOIT_DETECTED", time: "16:34:02" },
    { label: "Simulated", status: "CASCADE_WARNING", time: "16:34:03" },
    { label: "Audited", status: "BLOCKED", time: "16:34:04" },
    { label: "Archived", status: "SAVED", time: "16:34:04" },
  ];

  return (
    <div className="w-full bg-[#fffbf2] border border-[#b9b29c]/25 p-4 mb-6 shadow-sm animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#b9b29c]/15 pb-2 mb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#715b3e] font-bold">
          // Lineage Audit Track: {decisionId}
        </span>
        <div className="flex items-center gap-3 text-[9px] font-mono text-[#817a67]">
          <span className="flex items-center gap-1 text-emerald-700">
            <ShieldCheck className="w-3 h-3" /> Ledger Cryptography Locked
          </span>
          <span className="text-stone-300">|</span>
          <span>Timestamp: 2026-06-14</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((s, i) => (
          <div key={i} className="bg-stone-50/50 border border-stone-200 p-2 text-center flex flex-col justify-between">
            <span className="text-[9px] font-mono text-stone-400 uppercase">Step 0{i + 1}</span>
            <span className="text-[10.5px] font-semibold text-stone-700 block mt-0.5 leading-tight">{s.label}</span>
            <div className="mt-1.5 flex justify-between items-center text-[8.5px] font-mono border-t border-stone-100 pt-1">
              <span className="text-[#817a67]">{s.time}</span>
              <span className={`px-1 uppercase font-bold shrink-0 ${
                s.status === "PASS" || s.status === "SAVED"
                  ? "text-emerald-700 bg-emerald-50"
                  : "text-[#9e422c] bg-[#9e422c]/5"
              }`}>
                {s.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
