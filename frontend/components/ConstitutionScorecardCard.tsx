"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { ConstitutionScorecard, ConstitutionConflict } from "../lib/mockData";

interface ConstitutionScorecardCardProps {
  scores: ConstitutionScorecard[];
  conflicts: ConstitutionConflict[];
}

export default function ConstitutionScorecardCard({ scores, conflicts }: ConstitutionScorecardCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-outline-variant/15 bg-surface shadow-sm w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex justify-between items-center text-left hover:bg-surface-container-low/20 transition-colors"
      >
        <span className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#715b3e]" />
          Constitutional Scorecard & Alignment
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-mono text-[#817a67] font-light">
            {conflicts.length} Friction Conflicts Detected
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-[#817a67]" /> : <ChevronDown className="w-4 h-4 text-[#817a67]" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 border-t border-[#b9b29c]/10 bg-surface-container-low/30 space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {scores.map((score, idx) => (
              <div key={idx} className="border border-[#b9b29c]/15 bg-surface p-4 flex flex-col justify-center items-center text-center">
                <span className="text-[9px] uppercase tracking-wider text-[#817a67] font-light">{score.name}</span>
                <span className="text-xl font-light tracking-tighter text-[#373223] mt-1">{score.score}%</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-1.5 border-b border-[#b9b29c]/10 pb-2">
              <AlertCircle className="w-3.5 h-3.5 text-[#715b3e]" />
              Friction Point & Principle Conflict Resolution
            </h4>

            {conflicts.length > 0 ? (
              <div className="space-y-3">
                {conflicts.map((c, idx) => (
                  <div key={idx} className="bg-surface border border-[#b9b29c]/15 p-4 space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-[#373223]">
                      <span>{c.sides}</span>
                      <span className="text-[9px] text-[#3a684d] uppercase font-mono">RESOLVED</span>
                    </div>
                    <p className="text-xs font-light text-[#6b5d4f] leading-relaxed">
                      <strong>Resolution Outcome:</strong> {c.resolution}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border border-dashed border-[#b9b29c]/20 bg-surface/50 text-xs font-light text-[#6b5d4f] text-center italic">
                Zero constitutional principles friction logs identified.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
