"use client";

import { useState } from "react";
import { Play, ChevronDown, ChevronUp, BarChart2 } from "lucide-react";
import { ForecastScenario } from "../lib/mockData";

interface EnterpriseForecastCardProps {
  scenarios: ForecastScenario[];
}

export default function EnterpriseForecastCard({ scenarios }: EnterpriseForecastCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleScenario = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="border border-outline-variant/15 bg-surface shadow-sm w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex justify-between items-center text-left hover:bg-surface-container-low/20 transition-colors"
      >
        <span className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
          <Play className="w-4 h-4 text-[#715b3e]" />
          Enterprise Simulation Forecasts (Monte Carlo)
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-mono text-[#817a67] font-light">
            {scenarios.length} Futures Evaluated
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-[#817a67]" /> : <ChevronDown className="w-4 h-4 text-[#817a67]" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 border-t border-[#b9b29c]/10 bg-surface-container-low/30 space-y-4 animate-fadeIn">
          <div className="divide-y divide-[#b9b29c]/15">
            {scenarios.map((sc, idx) => {
              const isFwExpanded = expandedIndex === idx;

              return (
                <div key={idx} className="py-4 first:pt-0 last:pb-0">
                  <div
                    onClick={() => toggleScenario(idx)}
                    className="flex justify-between items-center cursor-pointer hover:opacity-85 transition-opacity"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-[#373223]">{sc.name}</h4>
                      <p className="text-[10px] text-[#6b5d4f] font-light mt-0.5">
                        Probability: {sc.probability}% | Value Score: {sc.valueScore} | Risk Exposure Score: {sc.riskExposure}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] uppercase font-mono px-2.5 py-0.5 bg-[#fff9ee] border border-[#b9b29c]/15 text-[#715b3e] font-medium">
                        Prob: {sc.probability}%
                      </span>
                      {isFwExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#817a67]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#817a67]" />}
                    </div>
                  </div>

                  {isFwExpanded && (
                    <div className="mt-4 pl-4 border-l-2 border-[#b9b29c]/30 space-y-4 animate-fadeIn">
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase tracking-wider text-[#817a67] font-medium flex items-center gap-1.5">
                          <BarChart2 className="w-3.5 h-3.5 text-[#715b3e]" />
                          Quarterly Financial Impact Projections
                        </span>

                        <div className="flex flex-col gap-3">
                          {sc.projections.map((p, i) => (
                            <div key={i} className="flex items-center justify-between text-xs font-light text-[#373223]">
                              <span className="font-semibold text-stone-700">{p.quarter} Baseline Target</span>
                              <div className="flex items-center gap-4">
                                <span className="text-emerald-700">Value Score: {p.value}</span>
                                <span className="text-[#9e422c]">Risk Exposure: {p.risk}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
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
