// ConstitutionScorecardCard.tsx — Constitution Conflict Matrix
"use client";

import { useState } from "react";
import { Scale, ChevronDown, ChevronUp, ArrowRight, AlertCircle } from "lucide-react";
import { ConstitutionScorecard, ConstitutionConflict } from "../lib/mockData";

interface ConstitutionScorecardCardProps {
  scores: ConstitutionScorecard[];
  conflicts: ConstitutionConflict[];
  defaultOpen?: boolean;
}

const DOMAIN_CONFIG: Record<string, { color: string; barColor: string; icon: string }> = {
  "Security Constitution":      { color: "#9e422c", barColor: "bg-[#9e422c]",  icon: "🛡" },
  "Compliance Constitution":    { color: "#715b3e", barColor: "bg-[#715b3e]",  icon: "⚖" },
  "Financial Constitution":     { color: "#3a684d", barColor: "bg-[#3a684d]",  icon: "💰" },
  "Sustainability Constitution":{ color: "#5b6b3a", barColor: "bg-[#5b6b3a]", icon: "🌱" },
};

function getDomainConfig(name: string) {
  return DOMAIN_CONFIG[name] ?? { color: "#715b3e", barColor: "bg-[#715b3e]", icon: "◈" };
}

function AlignmentBar({ name, score }: { name: string; score: number }) {
  const cfg = getDomainConfig(name);
  const level = score >= 80 ? "HIGH" : score >= 50 ? "MODERATE" : "LOW";
  const levelColor = score >= 80 ? "text-emerald-700" : score >= 50 ? "text-amber-700" : "text-[#9e422c]";

  return (
    <div className="border border-[#b9b29c]/15 bg-surface p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{cfg.icon}</span>
          <span className="text-[10px] uppercase tracking-wider text-[#373223] font-medium">
            {name.replace(" Constitution", "")}
          </span>
        </div>
        <div className="text-right">
          <span className="text-lg font-light font-mono" style={{ color: cfg.color }}>{score}%</span>
          <span className={`block text-[8px] uppercase font-mono font-semibold ${levelColor}`}>{level}</span>
        </div>
      </div>
      <div className="w-full bg-[#f5eddd] h-2 rounded-full overflow-hidden">
        <div
          className={`${cfg.barColor} h-full rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function ConflictCard({ conflict }: { conflict: ConstitutionConflict }) {
  const parts = conflict.sides.split(" vs ");
  return (
    <div className="border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
        <span className="text-[9px] uppercase tracking-widest text-amber-700 font-semibold">Principle Conflict</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {parts.map((part, i) => (
          <span key={i} className="flex items-center gap-1">
            <span className="px-2 py-0.5 bg-[#fff9ee] border border-[#b9b29c]/20 text-[10px] uppercase font-mono font-semibold text-[#373223]">
              {part.trim()}
            </span>
            {i < parts.length - 1 && (
              <ArrowRight className="w-3 h-3 text-amber-600 shrink-0" />
            )}
          </span>
        ))}
        <span className="text-[9px] uppercase font-mono text-[#3a684d] font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5">
          RESOLVED
        </span>
      </div>
      <p className="text-xs font-light text-[#6b5d4f] leading-relaxed border-t border-amber-500/10 pt-2">
        <strong className="font-medium text-[#373223]">Resolution: </strong>{conflict.resolution}
      </p>
    </div>
  );
}

export default function ConstitutionScorecardCard({ scores, conflicts, defaultOpen = false }: ConstitutionScorecardCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length) : 0;

  return (
    <div className="border border-outline-variant/15 bg-surface shadow-sm w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex justify-between items-center text-left hover:bg-surface-container-low/20 transition-colors"
        id="constitution-analysis-section"
      >
        <span className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#715b3e]" />
          Constitutional Analysis
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-mono text-[#817a67] font-light">
            Avg Alignment: {avgScore}%
          </span>
          <span className="text-[10px] font-mono text-amber-700">
            {conflicts.length} Conflicts
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-[#817a67]" /> : <ChevronDown className="w-4 h-4 text-[#817a67]" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 border-t border-[#b9b29c]/10 bg-surface-container-low/30 space-y-6 animate-fadeIn">
          {/* Section title */}
          <div>
            <h4 className="text-[9px] uppercase tracking-widest text-[#817a67] font-medium mb-4">
              Constitutional Alignment Matrix
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scores.map((score, idx) => (
                <AlignmentBar key={idx} name={score.name} score={score.score} />
              ))}
            </div>
          </div>

          {/* Conflict relationships */}
          {conflicts.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[9px] uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Detected Principle Conflicts &amp; Resolutions
              </h4>
              <div className="space-y-3">
                {conflicts.map((c, idx) => (
                  <ConflictCard key={idx} conflict={c} />
                ))}
              </div>
            </div>
          )}

          {conflicts.length === 0 && (
            <div className="p-4 border border-dashed border-[#b9b29c]/20 bg-surface/50 text-xs font-light text-[#6b5d4f] text-center">
              No constitutional principle conflicts identified in this decision.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
