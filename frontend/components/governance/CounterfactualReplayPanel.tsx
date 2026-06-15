"use client";

import React from "react";
import { useCounterfactuals } from "../../hooks/useCounterfactuals";
import AlternativeOutcomeCard from "./AlternativeOutcomeCard";
import { HelpCircle } from "lucide-react";

interface CounterfactualReplayPanelProps {
  selectedNodeId: string | null;
}

export default function CounterfactualReplayPanel({ selectedNodeId }: CounterfactualReplayPanelProps) {
  const { counterfactual } = useCounterfactuals(selectedNodeId);

  if (!counterfactual) {
    return (
      <section className="bg-[#fffbf2] border border-[#b9b29c]/25 p-5 rounded shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#817a67] font-bold block border-b border-[#b9b29c]/15 pb-2 mb-3">
          // ALTERNATIVE OUTCOMES (Counterfactual Simulation)
        </span>
        <div className="text-stone-400 italic text-xs font-mono py-6 text-center">
          Select a node from the causal graph to simulate alternative futures...
        </div>
      </section>
    );
  }

  const isProbabilityImproving = counterfactual.counterfactualProbability > counterfactual.actualProbability;
  const isRiskImproving = counterfactual.counterfactualRisk < counterfactual.actualRisk;

  return (
    <section className="bg-[#fffbf2] border border-[#b9b29c]/25 p-5 rounded shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-[#b9b29c]/15 pb-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#817a67] font-bold">
          // ALTERNATIVE OUTCOMES (Counterfactual Simulation)
        </span>
        <span className="text-[9px] font-mono text-[#715b3e] bg-[#fff9ee] px-2 py-0.5 border border-[#b9b29c]/20">
          NODE: {counterfactual.eventName}
        </span>
      </div>

      <div className="bg-[#fff9ee] border border-[#b9b29c]/15 p-3 rounded text-xs leading-relaxed font-sans text-stone-700">
        <div className="font-semibold text-[11px] font-mono text-[#715b3e] uppercase mb-1">
          Counterfactual Premise:
        </div>
        <strong>If this event had not occurred:</strong> &ldquo;{counterfactual.counterfactualEventState}&rdquo;.
        <p className="mt-1.5 text-stone-500 font-normal">
          {counterfactual.description}
        </p>
      </div>

      {/* Side-by-Side Comparison Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Actual Future */}
        <div className="border border-red-200/60 bg-red-50/10 p-4 rounded space-y-3">
          <div className="font-mono text-[10px] font-bold text-[#9e422c] border-b border-red-200/30 pb-1 flex items-center justify-between">
            <span>ACTUAL OUTCOME</span>
            <span className="text-[9px] px-1.5 py-0.5 bg-red-100 border border-red-200/50 rounded-xs">OBSERVED</span>
          </div>
          <div className="space-y-1 font-mono text-xs">
            <div><strong className="text-stone-700">Verdict:</strong> <span className="text-[#9e422c] font-bold">{counterfactual.actualVerdict}</span></div>
            <div><strong className="text-stone-700">Risk Score:</strong> {counterfactual.actualRisk}</div>
            <div><strong className="text-stone-700">Confidence (Probability):</strong> {counterfactual.actualProbability}%</div>
            <div><strong className="text-stone-700">Evidence Strength:</strong> {selectedNodeId === "node-soc2-missing" || selectedNodeId === "node-3" ? 62 : 88}%</div>
            <div className="text-[10px] text-stone-500 mt-1.5 pt-1.5 border-t border-stone-200/50">
              <strong>Consensus:</strong> {counterfactual.actualBoardVote}
            </div>
          </div>
        </div>

        {/* Counterfactual Future */}
        <div className="border border-emerald-200/60 bg-emerald-50/10 p-4 rounded space-y-3">
          <div className="font-mono text-[10px] font-bold text-emerald-800 border-b border-emerald-200/30 pb-1 flex items-center justify-between">
            <span>COUNTERFACTUAL OUTCOME</span>
            <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 border border-emerald-200/50 rounded-xs">SIMULATED</span>
          </div>
          <div className="space-y-1 font-mono text-xs">
            <div><strong className="text-stone-700">Verdict:</strong> <span className="text-emerald-700 font-bold">{counterfactual.counterfactualVerdict}</span></div>
            <div><strong className="text-stone-700">Risk Score:</strong> {counterfactual.counterfactualRisk}</div>
            <div><strong className="text-stone-700">Confidence (Probability):</strong> {counterfactual.counterfactualProbability}%</div>
            <div><strong className="text-stone-700">Evidence Strength:</strong> {selectedNodeId === "node-soc2-missing" || selectedNodeId === "node-3" ? 98 : 95}%</div>
            <div className="text-[10px] text-stone-500 mt-1.5 pt-1.5 border-t border-stone-200/50">
              <strong>Consensus:</strong> {counterfactual.counterfactualBoardVote}
            </div>
          </div>
        </div>
      </div>

      {/* Metric Deltas Box */}
      <div className="bg-[#fff9ee] p-3 border border-[#b9b29c]/25 rounded text-xs font-mono">
        <div className="font-bold text-[10px] text-stone-700 uppercase mb-2 border-b border-stone-200 pb-1">
          Outcome Metric Deltas
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] text-stone-400">VERDICT</span>
            <span className="font-bold text-[#373223]">{counterfactual.actualVerdict.toUpperCase()} &rarr; {counterfactual.counterfactualVerdict.toUpperCase()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-stone-400">RISK</span>
            <span className="font-bold text-[#373223]">{counterfactual.actualRisk} &rarr; {counterfactual.counterfactualRisk}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-stone-400">CONFIDENCE</span>
            <span className="font-bold text-[#373223]">{counterfactual.actualProbability}% &rarr; {counterfactual.counterfactualProbability}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-stone-400">EVIDENCE STRENGTH</span>
            <span className="font-bold text-[#373223]">{selectedNodeId === "node-soc2-missing" || selectedNodeId === "node-3" ? 62 : 88}% &rarr; {selectedNodeId === "node-soc2-missing" || selectedNodeId === "node-3" ? 98 : 95}%</span>
          </div>
        </div>
      </div>

      {/* Quick Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        <AlternativeOutcomeCard 
          label="Approval Probability" 
          actualValue={counterfactual.actualProbability} 
          altValue={counterfactual.counterfactualProbability} 
          valueSuffix="%" 
          isNegativeProgress={!isProbabilityImproving}
        />
        <AlternativeOutcomeCard 
          label="Risk Exposure" 
          actualValue={counterfactual.actualRisk} 
          altValue={counterfactual.counterfactualRisk} 
          isNegativeProgress={!isRiskImproving}
        />
        <AlternativeOutcomeCard 
          label="Verdict Change" 
          actualValue={counterfactual.actualVerdict} 
          altValue={counterfactual.counterfactualVerdict} 
        />
        <AlternativeOutcomeCard 
          label="Consensus Vote" 
          actualValue={counterfactual.actualBoardVote.split(" | ")[0] || counterfactual.actualBoardVote} 
          altValue={counterfactual.counterfactualBoardVote.split(" | ")[0] || counterfactual.counterfactualBoardVote} 
        />
      </div>
    </section>
  );
}
