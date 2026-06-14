"use client";

import { useState } from "react";
import { UserCheck, ChevronDown, ChevronUp } from "lucide-react";
import { BoardMember } from "../lib/mockData";

interface ExecutiveBoardConsensusCardProps {
  members: BoardMember[];
  consensusSummary: string;
  finalVerdict: "APPROVED" | "REJECTED";
}

export default function ExecutiveBoardConsensusCard({ members, consensusSummary, finalVerdict }: ExecutiveBoardConsensusCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-outline-variant/15 bg-surface shadow-sm w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex justify-between items-center text-left hover:bg-surface-container-low/20 transition-colors"
      >
        <span className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#715b3e]" />
          Executive Board Room Consensus
        </span>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] uppercase font-mono px-2 py-0.5 border ${
            finalVerdict === "APPROVED"
              ? "text-emerald-700 bg-emerald-500/5 border-emerald-500/20"
              : "text-[#9e422c] bg-[#9e422c]/5 border-[#9e422c]/20"
          }`}>
            BOARD: {finalVerdict}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-[#817a67]" /> : <ChevronDown className="w-4 h-4 text-[#817a67]" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 border-t border-[#b9b29c]/10 bg-surface-container-low/30 space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member, idx) => (
              <div key={idx} className="border border-[#b9b29c]/15 bg-surface p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs font-semibold text-[#373223] block">{member.member}</span>
                    <span className="text-[9px] text-[#817a67] font-light">Confidence: {member.confidence}%</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[9px] px-2 py-0.5 border ${
                      member.vote === "APPROVED"
                        ? "text-emerald-700 bg-emerald-500/5 border-emerald-500/20"
                        : "text-[#9e422c] bg-[#9e422c]/5 border-[#9e422c]/20"
                    }`}>
                      {member.vote}
                    </span>
                    <span className="text-[8px] uppercase font-mono text-[#817a67] font-light">
                      {member.evidenceCount} Citations
                    </span>
                  </div>
                </div>
                <p className="text-xs font-light text-[#6b5d4f] leading-relaxed italic border-t border-[#b9b29c]/5 pt-2">
                  &ldquo;{member.rationale}&rdquo;
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-[#b9b29c]/15 pt-4 flex justify-between items-center text-[10px] uppercase font-mono text-[#6b5d4f]">
            <span>Consensus: {consensusSummary}</span>
            <span className="font-semibold text-[#715b3e]">Audit Record Locked</span>
          </div>
        </div>
      )}
    </div>
  );
}
