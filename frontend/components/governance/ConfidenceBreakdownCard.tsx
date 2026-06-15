"use client";

import React from "react";
import { useConfidencePropagation } from "../../hooks/useConfidencePropagation";

interface ConfidenceBreakdownCardProps {
  selectedNodeId: string | null;
}

export default function ConfidenceBreakdownCard({ selectedNodeId }: ConfidenceBreakdownCardProps) {
  const { agentConfidences, ruleConfidences, evidenceConfidences } = useConfidencePropagation(selectedNodeId);

  return (
    <section className="bg-[#fffbf2] border border-[#b9b29c]/25 p-5 rounded shadow-sm space-y-5">
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#817a67] font-bold block border-b border-[#b9b29c]/15 pb-2">
        // GOVERNANCE ENTITY CONFIDENCE METRICS (Audit Ledger Breakdown)
      </span>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Agent Confidence */}
        <div className="space-y-3">
          <div className="font-mono text-[10px] font-bold text-stone-700 border-b border-stone-200 pb-1.5 uppercase">
            Agent Actor Confidence
          </div>
          <div className="space-y-2">
            {agentConfidences.map((agent) => (
              <div key={agent.agent} className="flex justify-between items-center font-mono text-xs">
                <span className="text-stone-600">{agent.agent} Actor</span>
                <span className="font-bold text-[#715b3e]">{agent.confidence}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rule Confidence */}
        <div className="space-y-3">
          <div className="font-mono text-[10px] font-bold text-stone-700 border-b border-stone-200 pb-1.5 uppercase">
            Rule Evaluation Certainty
          </div>
          <div className="space-y-2">
            {ruleConfidences.map((rule) => (
              <div key={rule.rule} className="flex flex-col font-mono text-xs border-b border-stone-100 pb-1.5 last:border-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <span className="text-stone-700 truncate max-w-[75%]">{rule.rule.split(" (")[0]}</span>
                  <span className="font-bold text-[#715b3e]">{rule.confidence}%</span>
                </div>
                <div className="flex justify-between text-[9px] text-stone-400 mt-0.5">
                  <span>Target: {rule.rule.includes("SOC2") ? "SEC-CONST-1" : rule.rule.includes("Vulnerability") ? "SEC-CONST-2" : "FIN-CONST-1"}</span>
                  <span className={rule.result === "FAILED" ? "text-[#9e422c]" : "text-emerald-700"}>{rule.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Confidence */}
        <div className="space-y-3">
          <div className="font-mono text-[10px] font-bold text-stone-700 border-b border-stone-200 pb-1.5 uppercase">
            Evidence Ingestion Confidence
          </div>
          <div className="space-y-2">
            {evidenceConfidences.map((ev) => (
              <div key={ev.artifact} className="flex justify-between items-center font-mono text-xs">
                <span className="text-stone-600 truncate max-w-[80%]">{ev.artifact}</span>
                <span className="font-bold text-[#715b3e]">{ev.confidence}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
