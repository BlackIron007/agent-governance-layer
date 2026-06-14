"use client";

import { useState } from "react";
import { FileCheck, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { RegulatoryFramework } from "../lib/mockData";

interface RegulatoryAlignmentCardProps {
  frameworks: RegulatoryFramework[];
}

export default function RegulatoryAlignmentCard({ frameworks }: RegulatoryAlignmentCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFramework = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="border border-outline-variant/15 bg-surface shadow-sm w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex justify-between items-center text-left hover:bg-surface-container-low/20 transition-colors"
      >
        <span className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[#715b3e]" />
          Regulatory Intelligence Alignment
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-mono text-[#817a67] font-light">
            {frameworks.filter(f => f.status === "FAILED").length} Failed Audits
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-[#817a67]" /> : <ChevronDown className="w-4 h-4 text-[#817a67]" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 border-t border-[#b9b29c]/10 bg-surface-container-low/30 space-y-4 animate-fadeIn">
          <div className="divide-y divide-[#b9b29c]/15">
            {frameworks.map((fw, idx) => {
              const isFwExpanded = expandedIndex === idx;
              const isPassed = fw.status === "PASSED";

              return (
                <div key={idx} className="py-4 first:pt-0 last:pb-0">
                  <div 
                    onClick={() => toggleFramework(idx)}
                    className="flex justify-between items-center cursor-pointer hover:opacity-85 transition-opacity"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-[#373223]">{fw.name}</h4>
                      <p className="text-[10px] text-[#6b5d4f] font-light mt-0.5">
                        Alignment Score: {fw.score}% | {fw.violationsCount} Violations
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] uppercase font-mono px-2 py-0.5 border ${
                        isPassed
                          ? "text-emerald-700 bg-emerald-500/5 border-emerald-500/20"
                          : "text-[#9e422c] bg-[#9e422c]/5 border-[#9e422c]/20"
                      }`}>
                        {fw.status}
                      </span>
                      {isFwExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#817a67]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#817a67]" />}
                    </div>
                  </div>

                  {isFwExpanded && (
                    <div className="mt-4 pl-4 border-l-2 border-[#b9b29c]/30 space-y-3 animate-fadeIn">
                      {fw.violations.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-wider text-[#9e422c] font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Violations Detected
                          </span>
                          <ul className="list-disc pl-4 text-xs font-light text-[#373223] space-y-1">
                            {fw.violations.map((v, i) => <li key={i}>{v}</li>)}
                          </ul>
                        </div>
                      )}

                      {fw.recommendations.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-wider text-[#715b3e] font-medium">Recommended Remediation</span>
                          <ul className="list-disc pl-4 text-xs font-light text-[#6b5d4f] space-y-1">
                            {fw.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                          </ul>
                        </div>
                      )}

                      {fw.blockingReason && (
                        <div className="p-3 bg-[#9e422c]/5 border border-[#9e422c]/10 text-xs font-light text-[#9e422c]">
                          <strong>Blocking Exception:</strong> {fw.blockingReason}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
