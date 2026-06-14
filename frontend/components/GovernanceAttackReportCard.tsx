// GovernanceAttackReportCard.tsx — Adversarial Governance Lab Cybersecurity Dashboard
"use client";

import { useState } from "react";
import { ShieldAlert, ChevronDown, ChevronUp, Zap, Eye, GitBranch, Activity, Target } from "lucide-react";
import { AdversarialReport } from "../lib/mockData";

interface GovernanceAttackReportCardProps {
  report: AdversarialReport;
  defaultOpen?: boolean;
}

function ResilienceGauge({ score }: { score: number }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "#3a684d" : score >= 50 ? "#715b3e" : "#9e422c";
  const label = score >= 75 ? "RESILIENT" : score >= 50 ? "MODERATE" : "VULNERABLE";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={r} stroke="#f5eddd" strokeWidth="5" fill="transparent" />
          <circle
            cx="48" cy="48" r={r}
            stroke={color} strokeWidth="5" fill="transparent"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="ring-animate"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-xl font-light font-mono" style={{ color }}>{score}</span>
          <span className="block text-[8px] text-[#817a67]">/100</span>
        </div>
      </div>
      <div>
        <span className="text-[8px] uppercase font-mono font-bold block text-center" style={{ color }}>{label}</span>
        <span className="text-[9px] text-[#817a67] font-light block text-center">Resilience Score</span>
      </div>
    </div>
  );
}

function RiskBar({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  const isHigh = value >= 60;
  const isMed = value >= 30 && value < 60;
  const color = isHigh ? "#9e422c" : isMed ? "#b07840" : "#3a684d";
  const barColor = isHigh ? "bg-[#9e422c]" : isMed ? "bg-amber-600" : "bg-[#3a684d]";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px]">
        <span className="flex items-center gap-1.5 text-[#6b5d4f] font-light">
          <Icon className="w-3 h-3" style={{ color }} />
          {label}
        </span>
        <span className="font-mono font-semibold" style={{ color }}>{value}%</span>
      </div>
      <div className="w-full bg-[#f5eddd] h-1.5 rounded-full overflow-hidden">
        <div className={`${barColor} h-full rounded-full transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ThreatCard({ vuln }: { vuln: { name: string; severity: string; mitigation: string } }) {
  const severityConfig = {
    CRITICAL: { bg: "bg-[#9e422c]/8", border: "border-[#9e422c]/25", text: "text-[#9e422c]", dot: "bg-[#9e422c]" },
    HIGH:     { bg: "bg-amber-500/8", border: "border-amber-500/25", text: "text-amber-700", dot: "bg-amber-500" },
    MEDIUM:   { bg: "bg-[#715b3e]/5", border: "border-[#715b3e]/20", text: "text-[#715b3e]", dot: "bg-[#715b3e]" },
    LOW:      { bg: "bg-surface/60",  border: "border-[#b9b29c]/15", text: "text-[#6b5d4f]", dot: "bg-[#b9b29c]"  },
  }[vuln.severity] ?? { bg: "bg-surface", border: "border-[#b9b29c]/15", text: "text-[#817a67]", dot: "bg-[#b9b29c]" };

  return (
    <div className={`border ${severityConfig.border} ${severityConfig.bg} p-4 space-y-2 threat-pulse`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${severityConfig.dot} shrink-0 mt-0.5`} />
          <span className={`text-xs font-semibold ${severityConfig.text}`}>{vuln.name}</span>
        </div>
        <span className={`text-[8px] uppercase font-mono font-bold px-1.5 py-0.5 border ${severityConfig.border} ${severityConfig.text} shrink-0`}>
          {vuln.severity}
        </span>
      </div>
      <p className="text-[10px] font-light text-[#6b5d4f] leading-relaxed pl-3.5">
        <strong className="font-medium text-[#373223]">Mitigation: </strong>{vuln.mitigation}
      </p>
    </div>
  );
}

export default function GovernanceAttackReportCard({ report, defaultOpen = false }: GovernanceAttackReportCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const vulnCount = report.vulnerabilities.length;
  const criticalCount = report.vulnerabilities.filter(v => v.severity === "CRITICAL").length;

  return (
    <div className="border border-outline-variant/15 bg-surface shadow-sm w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex justify-between items-center text-left hover:bg-surface-container-low/20 transition-colors"
        id="adversarial-findings-section"
      >
        <span className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#9e422c]" />
          Adversarial Governance Lab
        </span>
        <div className="flex items-center gap-3">
          {criticalCount > 0 && (
            <span className="text-[9px] uppercase font-mono text-[#9e422c] bg-[#9e422c]/5 border border-[#9e422c]/20 px-2 py-0.5 font-semibold">
              {criticalCount} CRITICAL
            </span>
          )}
          <span className="text-[10px] font-mono text-[#817a67]">
            Resilience: {report.resilienceScore}/100
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-[#817a67]" /> : <ChevronDown className="w-4 h-4 text-[#817a67]" />}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-[#b9b29c]/10 bg-surface-container-low/30 animate-fadeIn">
          {/* Top dashboard: Gauge + Risk Metrics */}
          <div className="p-6 border-b border-[#b9b29c]/10">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Resilience Gauge */}
              <div className="flex flex-col items-center shrink-0 bg-[#fff9ee] border border-[#b9b29c]/15 p-6">
                <span className="text-[8px] uppercase tracking-widest text-[#817a67] font-medium mb-3">
                  Governance Resilience
                </span>
                <ResilienceGauge score={report.resilienceScore} />
              </div>

              {/* Risk Bars */}
              <div className="flex-1 space-y-3">
                <h4 className="text-[9px] uppercase tracking-widest text-[#817a67] font-medium mb-3 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#9e422c]" />
                  Threat Surface Analysis
                </h4>
                <RiskBar label="Manipulation Risk" value={report.manipulationRisk} icon={Eye} />
                <RiskBar label="Collusion Risk" value={report.collusionRisk} icon={GitBranch} />
                <RiskBar label="Reward Hacking Risk" value={report.rewardHackingRisk} icon={Target} />
                <RiskBar label="Policy Gaming Risk" value={report.policyGamingRisk} icon={Zap} />
                <RiskBar label="Constitution Exploit Risk" value={report.constitutionExploitRisk} icon={ShieldAlert} />
              </div>
            </div>
          </div>

          {/* Vulnerability / Attack Cards */}
          <div className="p-6 space-y-3">
            <h4 className="text-[9px] uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#9e422c]" />
              Detected Attack Vulnerabilities &amp; Exploits
              {vulnCount > 0 && (
                <span className="ml-auto text-[9px] font-mono text-[#9e422c]">{vulnCount} exploit{vulnCount > 1 ? "s" : ""} found</span>
              )}
            </h4>
            {vulnCount > 0 ? (
              <div className="space-y-3">
                {report.vulnerabilities.map((vuln, idx) => (
                  <ThreatCard key={idx} vuln={vuln} />
                ))}
              </div>
            ) : (
              <div className="p-4 border border-dashed border-[#b9b29c]/20 bg-surface/50 text-xs font-light text-[#6b5d4f] text-center italic">
                Zero vulnerability exploits detected under current audit parameters.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
