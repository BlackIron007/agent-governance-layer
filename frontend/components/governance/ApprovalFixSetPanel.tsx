"use client";

import React from "react";
import { Check } from "lucide-react";
import { ApprovalFixItem, CounterfactualOutcome } from "../../types/governanceReplay";

interface ApprovalFixSetPanelProps {
  fixes: ApprovalFixItem[];
  outcome: CounterfactualOutcome;
}

export default function ApprovalFixSetPanel({ fixes, outcome }: ApprovalFixSetPanelProps) {
  return (
    <div className="border border-[#b9b29c]/25 bg-[#fffbf2] p-5 rounded space-y-4 text-[#373223] font-sans">
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#817a67] font-bold block border-b border-stone-200 pb-2">
        // Minimal Approval Fix Set
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
        {/* Recommended Fixes */}
        <div className="space-y-2.5">
          <span className="text-[9.5px] font-mono font-bold text-stone-500 uppercase block">
            Required Changes to Reverse Verdict
          </span>
          <div className="space-y-2">
            {fixes.map((fix) => (
              <div key={fix.id} className="flex items-start gap-2 text-xs text-[#6b5d4f] font-mono">
                <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-500/20 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <div>
                  <span className="text-stone-800 font-semibold">{fix.description}</span>
                  <span className="block text-[10px] text-emerald-700 mt-0.5">Impact: +{fix.impactProbabilityPct}% approval probability</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projected Outcomes */}
        <div className="space-y-3 bg-[#fff9ee] p-4 border border-[#b9b29c]/20 rounded">
          <span className="text-[9.5px] font-mono font-bold text-[#715b3e] uppercase block">
            Projected Counterfactual Outcome
          </span>
          
          <div className="grid grid-cols-2 gap-4 pt-1 font-mono text-xs">
            <div>
              <span className="text-[9px] text-stone-400 uppercase block">Verdict Posture</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[#9e422c] font-bold">{outcome.currentVerdict}</span>
                <span className="text-stone-300">&rarr;</span>
                <span className="text-emerald-700 font-bold">{outcome.projectedVerdict}</span>
              </div>
            </div>

            <div>
              <span className="text-[9px] text-stone-400 uppercase block">Approval Odds</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[#9e422c] font-bold">{outcome.currentProbabilityPct}%</span>
                <span className="text-stone-300">&rarr;</span>
                <span className="text-emerald-700 font-bold">{outcome.projectedProbabilityPct}%</span>
              </div>
            </div>

            <div className="col-span-2 border-t border-stone-200 pt-2 flex justify-between items-center text-[10.5px]">
              <span>Est. GRC Friction Reduction:</span>
              <span className="font-bold text-[#715b3e]">
                {outcome.currentFriction} &rarr; {outcome.projectedFriction}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
