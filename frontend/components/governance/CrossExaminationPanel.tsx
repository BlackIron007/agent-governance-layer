"use client";

import React from "react";
import { HelpCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { CrossExamData } from "../../types/governanceReplay";

interface CrossExaminationPanelProps {
  data: CrossExamData | null;
}

export default function CrossExaminationPanel({ data }: CrossExaminationPanelProps) {
  if (!data) {
    return (
      <div className="p-4 border border-[#b9b29c]/20 bg-[#fffbf2] rounded text-center text-xs text-stone-400 italic">
        Select a causality node to initiate cross-examination.
      </div>
    );
  }

  const isBlock = data.position === "BLOCK";

  return (
    <div className="border border-[#b9b29c]/25 bg-[#fffbf2] p-5 rounded space-y-4 text-[#373223] font-sans">
      <div className="border-b border-[#b9b29c]/20 pb-2 flex justify-between items-center">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#817a67] font-bold">
          // Challenge This Conclusion
        </span>
        <span className={`text-[8px] font-mono font-bold px-2 py-0.5 border rounded ${
          isBlock ? "text-[#9e422c] bg-red-50 border-red-500/20" : "text-emerald-700 bg-emerald-50 border-emerald-500/20"
        }`}>
          POSITION: {data.position} ({data.confidence}% Conf)
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2 items-start text-xs font-semibold">
          <HelpCircle className="w-4 h-4 text-[#715b3e] shrink-0 mt-0.5" />
          <span>{data.question}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {/* Supporting */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono font-bold text-stone-500 uppercase block">
              Arguments FOR decision
            </span>
            <ul className="space-y-1 text-[10.5px] text-[#6b5d4f] list-disc list-inside">
              {data.supportingArgs.map((arg, idx) => (
                <li key={idx} className="leading-normal">{arg}</li>
              ))}
            </ul>
          </div>

          {/* Opposing */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono font-bold text-stone-500 uppercase block">
              Arguments AGAINST decision
            </span>
            <ul className="space-y-1 text-[10.5px] text-[#6b5d4f] list-disc list-inside">
              {data.opposingArgs.map((arg, idx) => (
                <li key={idx} className="leading-normal">{arg}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-200 mt-2">
          <span className="text-[9px] font-mono font-bold text-[#817a67] uppercase block mb-1">
            Final system rationale
          </span>
          <p className="text-xs text-[#6b5d4f] leading-relaxed font-serif italic">
            "{data.reasoningSummary}"
          </p>
        </div>
      </div>
    </div>
  );
}
