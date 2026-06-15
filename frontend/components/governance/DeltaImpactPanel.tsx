"use client";

import React from "react";
import { GrcDeltaMetrics } from "../../types/governanceReplay";

interface DeltaImpactPanelProps {
  metrics: GrcDeltaMetrics | null;
}

export default function DeltaImpactPanel({ metrics }: DeltaImpactPanelProps) {
  if (!metrics) {
    return (
      <div className="p-4 border border-[#b9b29c]/20 bg-[#fffbf2] rounded text-center text-xs text-stone-400 italic">
        Delta metrics mapping complete. Select node to view changes.
      </div>
    );
  }

  const items = [
    { label: "Approval Probability", from: `${metrics.approvalProbability.from}%`, to: `${metrics.approvalProbability.to}%`, isDanger: metrics.approvalProbability.to < metrics.approvalProbability.from },
    { label: "Risk Exposure", from: `${metrics.riskExposure.from}%`, to: `${metrics.riskExposure.to}%`, isDanger: metrics.riskExposure.to > metrics.riskExposure.from },
    { label: "Evidence Strength", from: `${metrics.evidenceStrength.from}%`, to: `${metrics.evidenceStrength.to}%`, isDanger: false },
    { label: "Board Consensus", from: metrics.boardConsensus.from, to: metrics.boardConsensus.to, isDanger: false },
    { label: "Constitutional Alignment", from: `${metrics.constitutionalAlignment.from}%`, to: `${metrics.constitutionalAlignment.to}%`, isDanger: metrics.constitutionalAlignment.to < metrics.constitutionalAlignment.from },
    { label: "Regulatory Compliance", from: metrics.regulatoryCompliance.from, to: metrics.regulatoryCompliance.to, isDanger: metrics.regulatoryCompliance.to === "FAIL" }
  ];

  return (
    <div className="border border-[#b9b29c]/25 bg-[#fffbf2] p-5 rounded space-y-3.5 text-[#373223] font-sans">
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#817a67] font-bold block border-b border-stone-200 pb-2">
        // GRC State Transition (What Changed?)
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
        {items.map((item, idx) => (
          <div key={idx} className="bg-[#fff9ee] p-3.5 border border-[#b9b29c]/20 rounded text-center space-y-1.5 flex flex-col justify-between min-h-[85px]">
            <span className="block text-[9px] font-mono text-stone-500 uppercase tracking-wider leading-tight">
              {item.label}
            </span>
            <div className="flex items-center justify-center gap-2 text-xs font-mono flex-wrap">
              <span className="text-stone-400 font-light">{item.from}</span>
              <span className="text-stone-300 font-light">&rarr;</span>
              <span className={`font-bold ${item.isDanger ? "text-[#9e422c]" : "text-emerald-700"} break-all`}>
                {item.to}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
