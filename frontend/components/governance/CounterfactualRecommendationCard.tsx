"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface CounterfactualRecommendationCardProps {
  currentVerdict: string;
  projectedVerdict: string;
  currentProbabilityPct: number;
  projectedProbabilityPct: number;
}

export default function CounterfactualRecommendationCard({ 
  currentVerdict, 
  projectedVerdict, 
  currentProbabilityPct, 
  projectedProbabilityPct 
}: CounterfactualRecommendationCardProps) {
  return (
    <div className="bg-[#fffbf2] border border-[#b9b29c]/25 p-4 rounded space-y-3 font-sans text-xs">
      <div className="flex items-center gap-2 text-[#715b3e] border-b border-[#b9b29c]/15 pb-2">
        <Sparkles className="w-4 h-4 text-[#715b3e]" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
          Forensic Recommendation Recommendation
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3.5 font-mono text-[11px] text-[#6b5d4f]">
        <div>
          <span className="text-[9px] text-stone-400 uppercase block font-semibold">
            Verdict Posture
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[#9e422c] font-bold">{currentVerdict}</span>
            <span className="text-stone-300 font-light">&rarr;</span>
            <span className="text-emerald-700 font-bold">{projectedVerdict}</span>
          </div>
        </div>

        <div>
          <span className="text-[9px] text-stone-400 uppercase block font-semibold">
            Approval likelihood
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[#9e422c] font-bold">{currentProbabilityPct}%</span>
            <span className="text-stone-300 font-light">&rarr;</span>
            <span className="text-emerald-700 font-bold">{projectedProbabilityPct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
