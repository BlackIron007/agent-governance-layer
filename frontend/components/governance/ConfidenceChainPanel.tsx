"use client";

import React from "react";
import { ArrowRight, TrendingUp, TrendingDown, ShieldAlert } from "lucide-react";
import { useConfidencePropagation } from "../../hooks/useConfidencePropagation";

interface ConfidenceChainPanelProps {
  selectedNodeId: string | null;
}

export default function ConfidenceChainPanel({ selectedNodeId }: ConfidenceChainPanelProps) {
  const { propagated } = useConfidencePropagation(selectedNodeId);

  const steps = [
    {
      name: "Evidence Layer",
      score: propagated.evidenceLayer,
      desc: "Confidence based on parsed SOC2 certifications and vendor questionnaires."
    },
    {
      name: "Board Layer",
      score: propagated.boardLayer,
      desc: "Deliberation confidence factoring in security and financial agent consensus."
    },
    {
      name: "Simulation Layer",
      score: propagated.simulationLayer,
      desc: "Confidence derived from automated Monte Carlo transaction outage risk simulations."
    },
    {
      name: "Regulatory Layer",
      score: propagated.regulatoryLayer,
      desc: "Framework mapping alignment confidence with NIST and EU AI Act baselines."
    },
    {
      name: "Final Verdict",
      score: propagated.finalVerdictLayer,
      desc: "Aggregated proof confidence sealed to the immutable GRC consensus ledger."
    }
  ];

  // Find which layer produced the largest confidence drop
  let largestDropLayer = "None";
  let largestDropVal = 0;
  for (let i = 1; i < steps.length; i++) {
    const diff = steps[i].score - steps[i - 1].score;
    if (diff < largestDropVal) {
      largestDropVal = diff;
      largestDropLayer = steps[i].name;
    }
  }

  return (
    <section className="bg-[#fffbf2] border border-[#b9b29c]/25 p-5 rounded shadow-sm space-y-4">
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#817a67] font-bold block border-b border-[#b9b29c]/15 pb-2 mb-3">
        // CONFIDENCE PROPAGATION CHAIN (Layered certainty verification)
      </span>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 pt-1">
        {steps.map((step, idx) => {
          const prevScore = idx > 0 ? steps[idx - 1].score : null;
          const diff = prevScore !== null ? step.score - prevScore : 0;
          const isIncrease = diff > 0;
          const isConstant = diff === 0;

          return (
            <div key={idx} className="bg-[#fff9ee] p-3 border border-[#b9b29c]/20 rounded flex flex-col justify-between h-[155px]">
              <div>
                <div className="flex justify-between items-start border-b border-[#b9b29c]/15 pb-1">
                  <span className="text-[10px] font-bold font-mono tracking-wider text-[#373223] leading-tight block max-w-[80%]">
                    {step.name}
                  </span>
                  <span className="text-xs font-bold font-mono text-[#715b3e]">
                    {step.score}%
                  </span>
                </div>
                <p className="text-[9.5px] leading-tight text-stone-500 mt-2">
                  {step.desc}
                </p>
              </div>

              <div className="text-[9px] font-mono border-t border-[#b9b29c]/15 pt-2 flex justify-between items-center mt-2">
                {prevScore !== null ? (
                  <div className="flex items-center gap-1">
                    {isIncrease ? (
                      <>
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">+{diff}% Confidence</span>
                      </>
                    ) : isConstant ? (
                      <span className="text-stone-400">Neutral Shift</span>
                    ) : (
                      <>
                        <TrendingDown className="w-3.5 h-3.5 text-[#9e422c]" />
                        <span className="text-[#9e422c]">{diff}% Confidence</span>
                      </>
                    )}
                  </div>
                ) : (
                  <span className="text-stone-400">Baseline Stage</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {largestDropVal < 0 && (
        <div className="bg-red-50/55 border border-red-200/50 p-3 rounded flex items-center gap-2 text-xs font-mono text-stone-700">
          <ShieldAlert className="w-4 h-4 text-[#9e422c] shrink-0" />
          <div>
            <strong>Largest Confidence Drop Detected:</strong> <span className="text-[#9e422c] font-bold">{largestDropLayer}</span> &mdash; dropped by <span className="text-[#9e422c] font-bold">{Math.abs(largestDropVal)}%</span> during processing.
          </div>
        </div>
      )}
    </section>
  );
}
