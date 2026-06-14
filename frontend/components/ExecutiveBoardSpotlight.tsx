"use client";

import { BoardMember } from "../lib/mockData";
import { Users, TrendingUp, TrendingDown, BookOpen, FileText } from "lucide-react";

interface ExecutiveBoardSpotlightProps {
  members: BoardMember[];
  consensusSummary: string;
  finalVerdict: "APPROVED" | "REJECTED";
}

export default function ExecutiveBoardSpotlight({ members, consensusSummary, finalVerdict }: ExecutiveBoardSpotlightProps) {
  const approvedCount = members.filter(m => m.vote === "APPROVED").length;
  const rejectedCount = members.filter(m => m.vote === "REJECTED").length;

  return (
    <div className="border border-[#b9b29c]/30 bg-[#fffbf2] p-6 w-full shadow-md space-y-6 animate-fadeIn">
      {/* Spotlight Header */}
      <div className="border-b border-[#b9b29c]/25 pb-3">
        <span className="text-[9px] font-mono uppercase tracking-widest text-[#817a67] font-bold">
          // CRITICAL MOAT LAYERS
        </span>
        <h2 className="text-2xl font-light tracking-tighter text-[#373223] mt-1 flex items-center gap-2">
          <Users className="w-6 h-6 text-[#715b3e]" strokeWidth={1.5} />
          EXECUTIVE BOARD DELIBERATION
        </h2>
        <p className="text-xs text-[#6b5d4f] font-light mt-1">
          5 specialized governance agents independently evaluated this proposal before a final recommendation was issued.
        </p>
      </div>

      {/* Consensus Convergence and Conflict Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Consensus Visualizer */}
        <div className="bg-[#f5eddd] border border-[#b9b29c]/20 p-5 flex flex-col justify-between items-center text-center">
          <span className="text-[9px] font-mono uppercase text-[#817a67] font-bold">Consensus Summary</span>
          <div className="my-3">
            <span className="text-4xl font-light font-mono text-[#9e422c]">{rejectedCount} / {members.length}</span>
            <span className="block text-[10px] text-[#817a67] uppercase mt-1">REJECTED PROPOSAL</span>
          </div>
          <div className="w-full space-y-1">
            <div className="flex justify-between text-[9px] font-mono">
              <span className="text-emerald-700">{approvedCount} APPROVED</span>
              <span className="text-[#9e422c]">{rejectedCount} REJECTED</span>
            </div>
            <div className="h-2 w-full bg-stone-200 overflow-hidden flex gap-0.5 rounded-full">
              {members.map((m, i) => (
                <div 
                  key={i} 
                  className={`h-full flex-1 ${m.vote === "APPROVED" ? "bg-emerald-50" : "bg-[#9e422c]"}`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Board Conflicts */}
        <div className="md:col-span-2 bg-[#f5eddd] border border-[#b9b29c]/20 p-5 space-y-3">
          <span className="text-[9px] font-mono uppercase text-[#817a67] font-bold block border-b border-[#b9b29c]/10 pb-1">
            Key Disagreement
          </span>
          <div className="space-y-2.5 text-xs text-[#6b5d4f]">
            <div className="grid grid-cols-4 gap-1 leading-normal border-b border-stone-200/50 pb-1.5">
              <span className="font-semibold text-emerald-700">CFO Agent:</span>
              <span className="col-span-3 text-stone-700">Approve due to 20% savings ($120k margin parameters).</span>
            </div>
            <div className="grid grid-cols-4 gap-1 leading-normal border-b border-stone-200/50 pb-1.5">
              <span className="font-semibold text-[#9e422c]">CISO Agent:</span>
              <span className="col-span-3 text-stone-700">Reject due to SOC2 compliance violations (unacceptable perimeter risk).</span>
            </div>
            <div className="grid grid-cols-4 gap-1 leading-normal">
              <span className="font-semibold text-[#9e422c]">Legal Agent:</span>
              <span className="col-span-3 text-stone-700">Reject due to compliance exposure and liability risks.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spotlight Member Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {members.map((m, i) => {
          const approved = m.vote === "APPROVED";
          return (
            <div 
              key={i}
              className={`bg-surface border p-4 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-sm ${
                approved ? "border-emerald-500/20" : "border-[#9e422c]/20"
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-stone-800">{m.member}</span>
                  <span className={`text-[8px] font-mono font-bold px-1 ${
                    approved ? "text-emerald-700 bg-emerald-50" : "text-[#9e422c] bg-red-50"
                  }`}>{m.vote}</span>
                </div>
                <p className="text-[10.5px] leading-relaxed text-[#6b5d4f] italic font-light">
                  "{m.rationale}"
                </p>
              </div>

              <div className="border-t border-[#b9b29c]/10 mt-3 pt-2 space-y-1 text-[8.5px] font-mono text-[#817a67]">
                <div>Influence Score: <strong className="text-stone-700">{(m.confidence / 10).toFixed(1)}/10</strong></div>
                <div className="flex gap-2">
                  <span className="flex items-center gap-0.5"><FileText className="w-2.5 h-2.5" /> {m.evidenceCount} Citations</span>
                  <span className="flex items-center gap-0.5"><BookOpen className="w-2.5 h-2.5" /> {m.precedentCount} Precedents</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
