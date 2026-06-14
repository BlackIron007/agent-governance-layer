"use client";

import { useState, useEffect } from "react";
import { Play } from "lucide-react";

interface Node {
  id: string;
  label: string;
  desc: string;
}

const FLOW_NODES: Node[] = [
  { id: "proposal", label: "Proposal", desc: "AI proposal ingested into command memory." },
  { id: "evidence", label: "Evidence", desc: "Retrieve third-party certificates and databases." },
  { id: "board", label: "Board Debate", desc: "Executive agents dispute operational weights." },
  { id: "constitution", label: "Constitution", desc: "Verify system weights alignment score." },
  { id: "adversarial", label: "Adversarial", desc: "Simulate red-team exploit scenarios." },
  { id: "simulation", label: "Simulation", desc: "Monte Carlo projected risk forecasts." },
  { id: "regulatory", label: "Regulatory", desc: "NIST, SOC2 framework compliance." },
  { id: "verdict", label: "Verdict", desc: "Synthesis outcome locked and sealed." },
];

export default function GovernanceFlowVisualizer() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % FLOW_NODES.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <div className="border border-outline-variant/15 p-5 bg-surface shadow-sm space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-[#b9b29c]/10">
        <h3 className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
          Live Governance Reasoning Flow
        </h3>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="text-[9px] uppercase font-mono text-[#715b3e] hover:underline flex items-center gap-1"
        >
          <Play className="w-2.5 h-2.5" />
          {isAnimating ? "Pause Simulation" : "Resume Flow"}
        </button>
      </div>

      {/* Narrative Stepper Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 relative">
        {FLOW_NODES.map((node, idx) => {
          const isActive = idx === activeIdx;
          return (
            <div
              key={node.id}
              className={`p-3 border text-center transition-all duration-500 relative overflow-hidden group ${
                isActive
                  ? "bg-[#715b3e]/8 border-[#715b3e] scale-[1.03] shadow-sm"
                  : "bg-surface-container-lowest border-outline-variant/15 opacity-60 hover:opacity-95"
              }`}
            >
              {/* Animated scanning bar overlay */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#715b3e]/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
              )}
              
              <span className={`text-[9px] font-mono block ${isActive ? "text-[#715b3e] font-bold" : "text-stone-400"}`}>
                0{idx + 1}
              </span>
              <span className="text-xs font-medium text-stone-700 block mt-1">
                {node.label}
              </span>

              {/* Tooltip Hover explanation */}
              <div className="absolute inset-0 bg-[#fffbf2] p-2 flex items-center justify-center text-[9.5px] leading-tight text-[#6b5d4f] font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-stone-300">
                {node.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
