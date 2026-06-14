"use client";

import Navbar from "../../components/Navbar";
import { Sparkles, TrendingUp, AlertTriangle, RefreshCw, Activity } from "lucide-react";

export default function IntelligencePage() {
  const healthBreakdown = [
    { label: "Drift Stability", score: 97 },
    { label: "Audit Compliance", score: 85 },
    { label: "Collusion Protection", score: 100 },
    { label: "Constitutional Alignment", score: 77 },
    { label: "Policy Rule Stability", score: 90 }
  ];

  const violations = [
    { rule: "SECURITY_BEFORE_COST", count: 24, trend: "Increasing", severity: "CRITICAL" },
    { rule: "COMPLIANCE_BEFORE_SPEED", count: 18, trend: "Stable", severity: "HIGH" },
    { rule: "HUMAN_REVIEW_FOR_HIGH_RISK", count: 9, trend: "Decreasing", severity: "MEDIUM" }
  ];

  const riskiestAgents = [
    { id: "procurement_agent_v4", violations: 18, riskLevel: "Critical", score: 0.47, trend: "Worsening" },
    { id: "customer_onboarding_svc", violations: 12, riskLevel: "High", score: 0.38, trend: "Improving" },
    { id: "hr_screener_autonomous", violations: 9, riskLevel: "Medium", score: 0.28, trend: "Stable" },
    { id: "emergency_iam_manager", violations: 5, riskLevel: "Medium", score: 0.15, trend: "Improving" }
  ];

  const policyFrictions = [
    { rule: "Rule SEC-01: All Core database infrastructure suppliers must possess a valid SOC2 Type II audit certificate.", friction: "High", overrides: 14 },
    { rule: "Rule HR-03: Candidate screening criteria must evaluate individual skills metrics.", friction: "Medium", overrides: 9 },
    { rule: "Rule MED-09: Dosage variance must remain within a maximum 10% corridor.", friction: "Medium", overrides: 5 }
  ];

  const evolutions = [
    { id: "EVO-01", action: "MODERNIZE", target: "HUMAN_REVIEW_FOR_HIGH_RISK", change: "Lock Vendor requirements to restrict procurement overrides if third-party SOC2 certificate attributes evaluate to false.", impact: "-34% friction | +7% risk", status: "RECOMMENDED" },
    { id: "EVO-02", action: "STRENGTHEN", target: "DOSAGE_SLA_CORRIDOR", change: "Automatically route all clinical dosage overrides above 15% to high-priority manual physician review.", impact: "-12% friction | +19% safety", status: "RECOMMENDED" }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 flex flex-col items-center w-full max-w-5xl mx-auto px-6">
        <header className="w-full mb-8">
          <span className="text-[10px] font-normal tracking-[0.05em] uppercase text-[#817a67]">System Health Monitoring</span>
          <h1 className="text-4xl font-light tracking-tighter text-[#373223] mt-2">Governance Intelligence Hub</h1>
          <p className="text-sm text-[#6b5d4f] font-light mt-1">Continuous system analysis of constitutional alignment, rule drift, and policy evolution.</p>
        </header>

        {/* 1. GOVERNANCE HEALTH INDEX & BREAKDOWN */}
        <section className="w-full border border-outline-variant/15 p-8 bg-surface-container-low/40 flex flex-col lg:flex-row items-center gap-8 mb-8 shadow-sm">
          <div className="flex flex-col items-center shrink-0">
            <span className="text-[9px] uppercase tracking-widest text-[#817a67] mb-2">Governance Health Index</span>
            <div className="w-28 h-28 rounded-full border-4 border-[#715b3e]/20 flex items-center justify-center bg-[#fff9ee]">
              <span className="text-3xl font-light tracking-tighter text-[#373223]">82<span className="text-xs text-stone-400">/100</span></span>
            </div>
            <span className="text-[9px] font-mono uppercase text-[#3a684d] mt-3 font-semibold tracking-wider">Stable Posture</span>
          </div>

          <div className="flex-1 w-full space-y-4">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#715b3e]" />
                Institutional Security Posture Breakdown
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {healthBreakdown.map((item, idx) => (
                <div key={idx} className="bg-surface border border-[#b9b29c]/15 p-3 flex justify-between items-center text-xs">
                  <span className="text-[#6b5d4f] font-light">{item.label}</span>
                  <span className="font-mono font-medium text-[#715b3e]">{item.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          
          {/* 2. CONSTITUTIONAL DRIFT */}
          <div className="border border-outline-variant/15 p-6 bg-surface space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b border-[#b9b29c]/10">
              <h3 className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#715b3e]" />
                Constitutional Alignment Drift
              </h3>
              <span className="text-[9px] font-mono uppercase text-[#3a684d] font-semibold bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10">Synchronized</span>
            </div>
            <p className="text-xs font-light text-[#6b5d4f] leading-relaxed">
              Historical scoring variance showing that decisions match the registered constitutions. Drift remains within acceptable limits.
            </p>
            <div className="bg-surface-container-low h-32 border border-dashed border-[#b9b29c]/30 flex flex-col justify-center items-center text-center opacity-60">
              <span className="text-[9px] uppercase tracking-wider font-mono text-[#817a67]">Drift Telemetry Online</span>
              <span className="text-[10px] text-[#6b5d4f] font-light mt-1">Alignment stability: 97.9% over past 30 days</span>
            </div>
          </div>

          {/* 3. MOST DANGEROUS AGENTS */}
          <div className="border border-outline-variant/15 p-6 bg-surface space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b border-[#b9b29c]/10">
              <h3 className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#715b3e]" />
                Most Dangerous Agents Leaderboard
              </h3>
              <span className="text-[9px] font-mono uppercase text-[#9e422c] font-semibold bg-red-500/5 px-2 py-0.5 border border-red-500/10">Audit Pending</span>
            </div>
            
            <div className="divide-y divide-[#b9b29c]/10 text-xs">
              {riskiestAgents.map((agent, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <p className="font-mono text-[#715b3e] font-medium">{agent.id}</p>
                    <p className="text-[10px] text-[#6b5d4f] font-light">Violations: {agent.violations} | Trend: {agent.trend}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-medium block">Risk: {agent.score}</span>
                    <span className={`text-[8px] uppercase font-mono px-1.5 py-0.5 border ${
                      agent.riskLevel === "Critical" 
                        ? "text-[#9e422c] bg-[#9e422c]/5 border-[#9e422c]/20" 
                        : "text-amber-700 bg-amber-500/5 border-amber-500/20"
                    }`}>
                      {agent.riskLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. TOP CONSTITUTIONAL VIOLATIONS */}
          <div className="border border-outline-variant/15 p-6 bg-surface space-y-4 shadow-sm col-span-1 md:col-span-2">
            <div className="flex justify-between items-center pb-2 border-b border-[#b9b29c]/10">
              <h3 className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#715b3e]" />
                Top Constitutional Violations
              </h3>
              <span className="text-[9px] font-mono uppercase text-[#817a67]">Active check failures</span>
            </div>
            
            <div className="divide-y divide-[#b9b29c]/10 text-xs">
              {violations.map((v, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-stone-700">{v.rule}</p>
                    <p className="text-[10px] text-[#6b5d4f] font-light">Trend: {v.trend}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-bold block">{v.count} Failures</span>
                    <span className={`text-[8px] uppercase font-mono px-1.5 py-0.5 border ${
                      v.severity === "CRITICAL" 
                        ? "text-[#9e422c] bg-[#9e422c]/5 border-[#9e422c]/20" 
                        : "text-amber-700 bg-amber-500/5 border-amber-500/20"
                    }`}>
                      {v.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. POLICY FRICTION */}
          <div className="border border-outline-variant/15 p-6 bg-surface space-y-4 shadow-sm col-span-1 md:col-span-2">
            <div className="flex justify-between items-center pb-2 border-b border-[#b9b29c]/10">
              <h3 className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#715b3e]" />
                Constitutional Policy Friction Index
              </h3>
              <span className="text-[9px] font-mono uppercase text-[#6b5d4f]">Ledger analysis</span>
            </div>
            
            <div className="divide-y divide-[#b9b29c]/10 text-xs">
              {policyFrictions.map((item, idx) => (
                <div key={idx} className="py-3 flex justify-between items-start gap-4">
                  <p className="font-light text-[#373223] leading-relaxed flex-1">{item.rule}</p>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-semibold text-amber-700 block">Friction: {item.friction}</span>
                    <span className="text-[9px] text-[#817a67] font-light block mt-0.5">{item.overrides} overrides</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. POLICY EVOLUTION RECOMMENDATIONS */}
          <div className="border border-outline-variant/15 p-6 bg-surface space-y-4 shadow-sm col-span-1 md:col-span-2">
            <div className="flex justify-between items-center pb-2 border-b border-[#b9b29c]/10">
              <h3 className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#715b3e]" />
                Policy Evolution Recommendations (Evolution Engine)
              </h3>
              <span className="text-[9px] font-mono uppercase text-[#3a684d] font-semibold bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10">Active recommendations</span>
            </div>
            
            <div className="divide-y divide-[#b9b29c]/10 text-xs space-y-4">
              {evolutions.map((evo) => (
                <div key={evo.id} className="pt-3 flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-[#715b3e]">{evo.action}</span>
                      <span className="text-[10px] uppercase text-stone-500">— Target: {evo.target}</span>
                    </div>
                    <p className="font-light text-[#373223] leading-relaxed">{evo.change}</p>
                    <p className="text-[10px] text-[#3a684d] font-mono font-medium mt-1">Impact: {evo.impact}</p>
                  </div>
                  <button className="px-4 py-2 border border-[#715b3e] text-[#715b3e] uppercase text-[9px] tracking-wider hover:bg-[#715b3e] hover:text-[#fff9ee] transition-all shrink-0">
                    Approve & Evolve
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
