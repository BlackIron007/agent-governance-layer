// RegulatoryAlignmentCard.tsx — Regulatory Scorecard with PASS/WARNING/FAIL hierarchy
"use client";

import { useState } from "react";
import { FileCheck, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { RegulatoryFramework } from "../lib/mockData";

interface RegulatoryAlignmentCardProps {
  frameworks: RegulatoryFramework[];
  defaultOpen?: boolean;
}

function getStatusConfig(status: string, score: number) {
  if (status === "PASSED") return {
    label: "PASS",
    bg: "bg-emerald-500/8 border-emerald-500/25",
    text: "text-emerald-700",
    badge: "text-emerald-700 bg-emerald-500/8 border-emerald-500/25",
    bar: "bg-emerald-500",
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
  };
  if (score >= 65) return {
    label: "WARNING",
    bg: "bg-amber-500/5 border-amber-500/20",
    text: "text-amber-700",
    badge: "text-amber-700 bg-amber-500/5 border-amber-500/20",
    bar: "bg-amber-500",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
  };
  return {
    label: "FAIL",
    bg: "bg-[#9e422c]/5 border-[#9e422c]/20",
    text: "text-[#9e422c]",
    badge: "text-[#9e422c] bg-[#9e422c]/5 border-[#9e422c]/20",
    bar: "bg-[#9e422c]",
    icon: XCircle,
    iconColor: "text-[#9e422c]",
  };
}

function FrameworkCard({ fw, index }: { fw: RegulatoryFramework; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = getStatusConfig(fw.status, fw.score);
  const StatusIcon = cfg.icon;

  return (
    <div className={`border ${cfg.bg} overflow-hidden`}>
      {/* Card header */}
      <div
        className="p-4 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <StatusIcon className={`w-4 h-4 mt-0.5 shrink-0 ${cfg.iconColor}`} strokeWidth={1.5} />
            <div className="flex-1">
              <h4 className={`text-xs font-semibold ${cfg.text}`}>{fw.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[8px] uppercase font-mono font-bold px-1.5 py-0.5 border ${cfg.badge}`}>
                  {cfg.label}
                </span>
                {fw.violationsCount > 0 && (
                  <span className="text-[8px] text-[#9e422c] font-mono">
                    {fw.violationsCount} violation{fw.violationsCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-lg font-light font-mono ${cfg.text}`}>{fw.score}%</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5 text-[#817a67]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#817a67]" />}
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-3 w-full bg-[#f5eddd]/80 h-1.5 rounded-full overflow-hidden">
          <div
            className={`${cfg.bar} h-full rounded-full transition-all duration-700`}
            style={{ width: `${fw.score}%` }}
          />
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-[#b9b29c]/15 bg-[#fff9ee]/60 p-4 space-y-3 animate-fadeIn">
          {fw.violations.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[8px] uppercase tracking-wider text-[#9e422c] font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Critical Violations
              </span>
              <ul className="space-y-1">
                {fw.violations.map((v, i) => (
                  <li key={i} className="text-xs font-light text-[#373223] leading-relaxed flex items-start gap-1.5">
                    <span className="text-[#9e422c] mt-0.5 shrink-0">·</span> {v}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {fw.recommendations.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[8px] uppercase tracking-wider text-[#715b3e] font-semibold">Remediation Path</span>
              <ul className="space-y-1">
                {fw.recommendations.map((r, i) => (
                  <li key={i} className="text-xs font-light text-[#6b5d4f] leading-relaxed flex items-start gap-1.5">
                    <span className="text-[#3a684d] mt-0.5 shrink-0">→</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {fw.blockingReason && (
            <div className="p-3 bg-[#9e422c]/8 border border-[#9e422c]/15 text-xs font-light text-[#9e422c]">
              <strong className="font-semibold">Blocking Exception: </strong>{fw.blockingReason}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RegulatoryAlignmentCard({ frameworks, defaultOpen = false }: RegulatoryAlignmentCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const failCount = frameworks.filter(f => f.status === "FAILED").length;
  const passCount = frameworks.filter(f => f.status === "PASSED").length;

  return (
    <div className="border border-outline-variant/15 bg-surface shadow-sm w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex justify-between items-center text-left hover:bg-surface-container-low/20 transition-colors"
        id="regulatory-review-section"
      >
        <span className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[#715b3e]" />
          Regulatory Compliance Review
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="text-emerald-700">{passCount} PASS</span>
            <span className="text-[#b9b29c]">·</span>
            <span className="text-[#9e422c]">{failCount} FAIL</span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4 text-[#817a67]" /> : <ChevronDown className="w-4 h-4 text-[#817a67]" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 border-t border-[#b9b29c]/10 bg-surface-container-low/30 space-y-3 animate-fadeIn">
          {/* Quick status summary */}
          <div className="flex gap-2 mb-4">
            {frameworks.map((fw, i) => {
              const cfg = getStatusConfig(fw.status, fw.score);
              return (
                <div key={i} className={`flex-1 text-center py-2 px-1 border text-[8px] uppercase font-mono font-bold ${cfg.badge}`}>
                  {fw.name.split(" ")[0]}
                  <div className="text-[10px] font-light mt-0.5">{cfg.label}</div>
                </div>
              );
            })}
          </div>

          {/* Detailed framework cards */}
          <div className="space-y-3">
            {frameworks.map((fw, idx) => (
              <FrameworkCard key={idx} fw={fw} index={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
