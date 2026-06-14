// EnterpriseForecastCard.tsx — Boardroom Monte Carlo Forecasting Visualization
"use client";

import { useState } from "react";
import { BarChart2, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ForecastScenario } from "../lib/mockData";

interface EnterpriseForecastCardProps {
  scenarios: ForecastScenario[];
  defaultOpen?: boolean;
}

const SCENARIO_CONFIG: Record<string, { icon: string; accent: string; barColor: string; riskBg: string }> = {
  "Best Case":           { icon: "✦", accent: "#3a684d", barColor: "bg-[#3a684d]",  riskBg: "bg-emerald-500/10" },
  "Expected Outcome":    { icon: "◈", accent: "#715b3e", barColor: "bg-[#715b3e]",  riskBg: "bg-amber-500/10" },
  "Delayed Case":        { icon: "◷", accent: "#b07840", barColor: "bg-amber-600",  riskBg: "bg-amber-500/15" },
  "Regulatory Failure":  { icon: "⚠", accent: "#9e422c", barColor: "bg-[#9e422c]",  riskBg: "bg-red-500/10" },
  "Failure Cascade":     { icon: "☠", accent: "#7a1f0e", barColor: "bg-red-900",    riskBg: "bg-red-900/10" },
  "Failure Cascade Case":{ icon: "☠", accent: "#7a1f0e", barColor: "bg-red-900",    riskBg: "bg-red-900/10" },
};

function getScenarioConfig(name: string) {
  return SCENARIO_CONFIG[name] ?? { icon: "◈", accent: "#715b3e", barColor: "bg-[#715b3e]", riskBg: "bg-amber-500/10" };
}

function QuarterBar({ quarter, value, risk, accent }: { quarter: string; value: number; risk: number; accent: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <div className="w-full flex flex-col gap-1 items-center">
        {/* Value bar */}
        <div className="w-full h-20 bg-[#f5eddd] rounded-sm overflow-hidden flex flex-col justify-end relative">
          <div
            className="w-full transition-all duration-700"
            style={{ height: `${value}%`, background: accent, opacity: 0.7 }}
          />
          <span className="absolute top-1 left-0 right-0 text-center text-[8px] font-mono font-semibold" style={{ color: accent }}>
            {value}
          </span>
        </div>
        {/* Risk indicator */}
        <div
          className="w-full h-2 rounded-sm overflow-hidden bg-[#f5eddd]"
          title={`Risk: ${risk}%`}
        >
          <div
            className="h-full rounded-sm transition-all duration-700"
            style={{ width: `${risk}%`, background: risk >= 60 ? "#9e422c" : risk >= 35 ? "#b07840" : "#3a684d" }}
          />
        </div>
      </div>
      <span className="text-[9px] uppercase font-mono text-[#817a67] font-medium">{quarter}</span>
    </div>
  );
}

function ScenarioCard({ sc, isExpanded, onToggle }: {
  sc: ForecastScenario;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const cfg = getScenarioConfig(sc.name);
  const isPositive = sc.valueScore >= 60;
  const isNeutral = sc.valueScore >= 40 && sc.valueScore < 60;
  const ValueIcon = isPositive ? TrendingUp : isNeutral ? Minus : TrendingDown;
  const valueColor = isPositive ? "text-emerald-700" : isNeutral ? "text-amber-700" : "text-[#9e422c]";

  return (
    <div
      className="border overflow-hidden transition-all"
      style={{ borderColor: `${cfg.accent}25` }}
    >
      {/* Card header */}
      <div
        className="p-4 cursor-pointer hover:opacity-90 transition-opacity"
        style={{ background: `${cfg.accent}06` }}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg" style={{ color: cfg.accent }}>{cfg.icon}</span>
            <div>
              <h4 className="text-xs font-semibold text-[#373223]">{sc.name}</h4>
              <p className="text-[9px] text-[#817a67] font-light mt-0.5">
                Probability: <span className="font-mono font-semibold" style={{ color: cfg.accent }}>{sc.probability}%</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Value score */}
            <div className="text-right">
              <div className={`flex items-center gap-1 ${valueColor}`}>
                <ValueIcon className="w-3 h-3" />
                <span className="text-sm font-light font-mono">{sc.valueScore}</span>
              </div>
              <span className="text-[8px] uppercase text-[#817a67] font-light">Value</span>
            </div>
            {/* Risk score */}
            <div className="text-right">
              <span className="text-sm font-light font-mono text-[#9e422c]">{sc.riskExposure}</span>
              <span className="block text-[8px] uppercase text-[#817a67] font-light">Risk</span>
            </div>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#817a67]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#817a67]" />}
          </div>
        </div>

        {/* Probability bar */}
        <div className="mt-3 w-full bg-[#f5eddd] h-1 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${cfg.barColor} transition-all duration-700`}
            style={{ width: `${sc.probability}%` }}
          />
        </div>
      </div>

      {/* Quarter projections */}
      {isExpanded && sc.projections.length > 0 && (
        <div className="p-4 border-t animate-fadeIn" style={{ borderColor: `${cfg.accent}15` }}>
          <div className="flex items-center gap-1.5 mb-3">
            <BarChart2 className="w-3.5 h-3.5" style={{ color: cfg.accent }} />
            <span className="text-[9px] uppercase tracking-widest font-medium" style={{ color: cfg.accent }}>
              Quarter-by-Quarter Projection
            </span>
          </div>
          <div className="flex gap-2 items-end">
            {sc.projections.map((p, i) => (
              <QuarterBar key={i} quarter={p.quarter} value={p.value} risk={p.risk} accent={cfg.accent} />
            ))}
          </div>
          <div className="flex gap-3 mt-3 text-[8px] font-light text-[#817a67]">
            <span>▪ Value Score</span>
            <span style={{ color: "#9e422c" }}>▪ Risk Exposure</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EnterpriseForecastCard({ scenarios, defaultOpen = false }: EnterpriseForecastCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleScenario = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="border border-outline-variant/15 bg-surface shadow-sm w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex justify-between items-center text-left hover:bg-surface-container-low/20 transition-colors"
        id="enterprise-simulation-section"
      >
        <span className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#715b3e]" />
          Enterprise Simulation Forecasts
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-mono text-[#817a67] font-light">
            {scenarios.length} Monte Carlo Scenarios
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-[#817a67]" /> : <ChevronDown className="w-4 h-4 text-[#817a67]" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 border-t border-[#b9b29c]/10 bg-surface-container-low/30 space-y-3 animate-fadeIn">
          <h4 className="text-[9px] uppercase tracking-widest text-[#817a67] font-medium mb-4">
            Boardroom Scenario Analysis — Click any scenario to view quarterly projections
          </h4>
          <div className="space-y-3">
            {scenarios.map((sc, idx) => (
              <ScenarioCard
                key={idx}
                sc={sc}
                isExpanded={expandedIndex === idx}
                onToggle={() => toggleScenario(idx)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
