"use client";

import { CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

interface VerdictHeroCardProps {
  verdict: "APPROVED" | "BLOCKED" | "CONDITIONAL_ALLOW";
  confidence: number;
  risk: number;
  evidence: number;
  takeaway: string;
}

export default function VerdictHeroCard({ verdict, confidence, risk, evidence, takeaway }: VerdictHeroCardProps) {
  // Styling variables based on verdict status
  let verdictLabel = "ALLOWED";
  let verdictBg = "bg-emerald-500/5 border-emerald-600/20";
  let verdictText = "text-emerald-700 dark:text-emerald-400";
  let VerdictIcon = CheckCircle2;

  if (verdict === "BLOCKED") {
    verdictLabel = "BLOCKED";
    verdictBg = "bg-red-500/5 border-red-600/20";
    verdictText = "text-[#9e422c]";
    VerdictIcon = ShieldAlert;
  } else if (verdict === "CONDITIONAL_ALLOW") {
    verdictLabel = "CONDITIONAL ALLOW";
    verdictBg = "bg-amber-500/5 border-amber-600/20";
    verdictText = "text-amber-700 dark:text-amber-400";
    VerdictIcon = AlertTriangle;
  }

  const renderDial = (value: number, label: string, color: string, trackColor: string) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              className={trackColor}
              strokeWidth="5"
              fill="transparent"
            />
            {/* Foreground circle */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              className={`${color} transition-all duration-500 ease-out`}
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-xl font-light tracking-tighter text-[#373223]">{value}%</span>
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-[#6b5d4f] font-light text-center">{label}</span>
      </div>
    );
  };

  return (
    <div className={`border border-outline-variant/15 p-8 ${verdictBg} flex flex-col gap-6 w-full shadow-sm`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <VerdictIcon className={`w-8 h-8 ${verdictText}`} strokeWidth={1.5} />
          <div>
            <span className="text-xs uppercase tracking-widest text-[#817a67] font-light">Final Governance Verdict</span>
            <h2 className={`text-3xl font-light tracking-tighter ${verdictText} mt-0.5`}>{verdictLabel}</h2>
          </div>
        </div>
        <div className="bg-[#fff9ee] border border-[#b9b29c]/20 px-3 py-1 text-[9px] uppercase tracking-widest text-[#715b3e] font-medium">
          Locked Verification
        </div>
      </div>

      {/* Executive Decision Memo Section */}
      <div className="border border-[#b9b29c]/20 bg-[#fffbf2] p-5 space-y-3">
        <span className="text-[9px] font-mono uppercase tracking-widest text-[#817a67] font-bold block border-b border-[#b9b29c]/15 pb-1">
          // Executive Decision Memo
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-light text-[#6b5d4f] leading-relaxed">
          <div className="space-y-1">
            <span className="text-[9px] uppercase text-[#817a67] font-semibold block">Primary Cause</span>
            <p className="text-[#373223] font-light">
              {verdict === "BLOCKED" 
                ? "Vendor X lacks standard SOC2 audit compliance and triggers unacceptable perimeter vulnerability flags." 
                : verdict === "CONDITIONAL_ALLOW" 
                ? "Emergency recovery parameters bypass MFA rules conditionally for a strict 2-hour window." 
                : "All systems validation tests passed without high-severity conflicts."}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] uppercase text-[#817a67] font-semibold block">Board Outcome</span>
            <p className="text-[#373223] font-light">
              {verdict === "BLOCKED" ? "4 of 5 executives rejected proposal (Legal, CISO, and Procurement vetoes)." : "Unanimous approval registered."}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] uppercase text-[#817a67] font-semibold block">Constitutional Conflict</span>
            <p className="text-[#373223] font-light">
              {verdict === "BLOCKED" ? "Security Constitution overrode Financial Constitution directives." : "No active conflicts resolved."}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] uppercase text-[#817a67] font-semibold block">Regulatory & Forecast Status</span>
            <p className="text-[#373223] font-light">
              {verdict === "BLOCKED" 
                ? "NIST RMF compliance failed. Simulation projects 8% post-deployment cost increase in failure cascade." 
                : "Regulatory review verified. Projected downtime cost reduced."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 py-4 border-y border-[#b9b29c]/10">
        {renderDial(confidence, "Execution Confidence", "stroke-[#715b3e]", "stroke-[#eed0ac]/20")}
        {renderDial(risk, "Risk Exposure", "stroke-[#9e422c]", "stroke-[#9e422c]/10")}
        {renderDial(evidence, "Evidence Strength", "stroke-[#3a684d]", "stroke-[#c4f7d3]/20")}
      </div>

      <div className="bg-[#fff9ee] p-4 border border-[#b9b29c]/15">
        <span className="text-[9px] uppercase tracking-widest text-[#817a67] font-light block mb-1">Executive Takeaway</span>
        <p className="text-sm font-light leading-relaxed text-[#373223] italic">
          &ldquo;{takeaway}&rdquo;
        </p>
      </div>
    </div>
  );
}
