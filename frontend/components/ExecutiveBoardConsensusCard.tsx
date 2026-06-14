// ExecutiveBoardConsensusCard.tsx — Board Debate Visualization
"use client";

import { useState } from "react";
import { Users, ChevronDown, ChevronUp, TrendingUp, TrendingDown, FileText, BookOpen } from "lucide-react";
import { BoardMember } from "../lib/mockData";

interface ExecutiveBoardConsensusCardProps {
  members: BoardMember[];
  consensusSummary: string;
  finalVerdict: "APPROVED" | "REJECTED";
  defaultOpen?: boolean;
}

function ConfidenceRing({ value, approved }: { value: number; approved: boolean }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = approved ? "#3a684d" : "#9e422c";

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} stroke="#f5eddd" strokeWidth="3.5" fill="transparent" />
        <circle
          cx="28" cy="28" r={r}
          stroke={color} strokeWidth="3.5" fill="transparent"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="ring-animate"
        />
      </svg>
      <span className="absolute text-[10px] font-mono font-semibold" style={{ color }}>{value}%</span>
    </div>
  );
}

function BoardConsensusMeter({ members }: { members: BoardMember[] }) {
  const approvedCount = members.filter(m => m.vote === "APPROVED").length;
  const rejectedCount = members.filter(m => m.vote === "REJECTED").length;
  const total = members.length;

  return (
    <div className="border border-[#b9b29c]/15 bg-[#fff9ee] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-widest text-[#817a67] font-medium">Board Consensus Meter</span>
        <span className={`text-[9px] uppercase font-mono px-2 py-0.5 border font-semibold ${
          approvedCount > rejectedCount
            ? "text-emerald-700 bg-emerald-500/5 border-emerald-500/20"
            : "text-[#9e422c] bg-[#9e422c]/5 border-[#9e422c]/20"
        }`}>
          {approvedCount > rejectedCount ? "MAJORITY APPROVED" : approvedCount < rejectedCount ? "MAJORITY REJECTED" : "TIE"}
        </span>
      </div>

      {/* Visual vote dots */}
      <div className="flex items-center gap-2">
        {members.map((m, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-[8px] font-bold transition-all ${
              m.vote === "APPROVED"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700"
                : "bg-[#9e422c]/10 border-[#9e422c]/30 text-[#9e422c]"
            }`}>
              {m.member.charAt(0)}
            </div>
            <span className="text-[7px] uppercase tracking-wide text-[#817a67] font-light text-center" style={{ maxWidth: "40px", lineHeight: 1.2 }}>
              {m.member.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Consensus bar */}
      <div className="space-y-1.5">
        <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
          {members.map((m, i) => (
            <div
              key={i}
              className={`flex-1 transition-all ${m.vote === "APPROVED" ? "bg-emerald-500" : "bg-[#9e422c]"}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[9px] font-mono">
          <span className="text-emerald-700">{approvedCount} Approved</span>
          <span className="text-[#817a67]">{total} Total Votes</span>
          <span className="text-[#9e422c]">{rejectedCount} Rejected</span>
        </div>
      </div>
    </div>
  );
}

export default function ExecutiveBoardConsensusCard({
  members,
  consensusSummary,
  finalVerdict,
  defaultOpen = false,
}: ExecutiveBoardConsensusCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const approvedCount = members.filter(m => m.vote === "APPROVED").length;

  return (
    <div className="border border-outline-variant/15 bg-surface shadow-sm w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex justify-between items-center text-left hover:bg-surface-container-low/20 transition-colors"
        id="board-debate-section"
      >
        <span className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
          <Users className="w-4 h-4 text-[#715b3e]" />
          Executive Board Debate
        </span>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] uppercase font-mono px-2 py-0.5 border ${
            finalVerdict === "APPROVED"
              ? "text-emerald-700 bg-emerald-500/5 border-emerald-500/20"
              : "text-[#9e422c] bg-[#9e422c]/5 border-[#9e422c]/20"
          }`}>
            {approvedCount}/{members.length} APPROVE
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-[#817a67]" /> : <ChevronDown className="w-4 h-4 text-[#817a67]" />}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-[#b9b29c]/10 bg-surface-container-low/30 animate-fadeIn">
          {/* Consensus Meter */}
          <div className="p-6 pb-0">
            <BoardConsensusMeter members={members} />
          </div>

          {/* Member cards */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {members.map((member, idx) => {
              const approved = member.vote === "APPROVED";
              return (
                <div
                  key={idx}
                  className={`border bg-surface p-4 space-y-3 ${
                    approved ? "border-emerald-500/15" : "border-[#9e422c]/15"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-[#373223] block">{member.member}</span>
                      <span className="text-[9px] text-[#817a67] font-light">Confidence: {member.confidence}%</span>
                    </div>
                    <ConfidenceRing value={member.confidence} approved={approved} />
                  </div>

                  {/* Vote badge */}
                  <div className={`flex items-center gap-1.5 text-[9px] uppercase font-mono font-semibold px-2 py-1 w-fit border ${
                    approved
                      ? "text-emerald-700 bg-emerald-500/5 border-emerald-500/20"
                      : "text-[#9e422c] bg-[#9e422c]/5 border-[#9e422c]/20"
                  }`}>
                    {approved ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {member.vote}
                  </div>

                  {/* Rationale */}
                  <p className="text-xs font-light text-[#6b5d4f] leading-relaxed italic border-t border-[#b9b29c]/10 pt-2">
                    &ldquo;{member.rationale}&rdquo;
                  </p>

                  {/* Evidence + Precedent badges */}
                  <div className="flex gap-3 text-[9px] text-[#817a67] font-light">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {member.evidenceCount} Citations
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {member.precedentCount} Precedents
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 border-t border-[#b9b29c]/10 pt-4 flex justify-between items-center text-[10px] uppercase font-mono text-[#6b5d4f]">
            <span>Consensus: {consensusSummary}</span>
            <span className="font-semibold text-[#715b3e]">Audit Record Locked</span>
          </div>
        </div>
      )}
    </div>
  );
}
