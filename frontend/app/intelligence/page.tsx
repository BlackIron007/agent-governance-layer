"use client";

import Navbar from "../../components/Navbar";
import { Sparkles, TrendingUp, AlertTriangle, RefreshCw, Layers } from "lucide-react";

export default function IntelligencePage() {
  const riskiestAgents = [
    { id: "procurement_agent_v4", violations: 18, riskLevel: "Critical", score: 94 },
    { id: "customer_onboarding_svc", violations: 12, riskLevel: "High", score: 82 },
    { id: "hr_screener_autonomous", violations: 9, riskLevel: "Medium", score: 76 },
    { id: "emergency_iam_manager", violations: 5, riskLevel: "Medium", score: 65 }
  ];

  const policyFrictions = [
    { rule: "Rule SEC-01: All Core database infrastructure suppliers must possess a valid SOC2 Type II audit certificate.", friction: "High", overrides: 14 },
    { rule: "Rule HR-03: Candidate screening criteria must evaluate individual skills metrics.", friction: "Medium", overrides: 9 },
    { rule: "Rule MED-09: Dosage variance must remain within a maximum 10% corridor.", friction: "Medium", overrides: 5 }
  ];

  const evolutions = [
    { id: "EVO-01", target: "Security Constitution", change: "Lock Vendor requirements to restrict procurement overrides if third-party SOC2 certificate attributes evaluate to false.", status: "RECOMMENDED" },
    { id: "EVO-02", target: "Compliance Constitution", change: "Automatically route all clinical dosage overrides above 15% to high-priority manual physician review.", status: "RECOMMENDED" }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 flex flex-col items-center w-full max-w-5xl mx-auto px-6">
        <header className="w-full mb-8">
          <span className="text-[10px] font-normal tracking-[0.05em] uppercase text-[#817a67]">System Health Monitoring</span>
          <h1 className="text-4xl font-light tracking-tighter text-[#373223] mt-2">Governance Intelligence Hub</h1>
          <p className="text-sm text-[#6b5d4f] font-light mt-1">Institutional analysis of constitutional alignment, rule drift, and agent policy compliance.</p>
        </header>

        {/* 1. GOVERNANCE HEALTH INDEX */}
        <section className="w-full border border-outline-variant/15 p-8 bg-surface-container-low/40 flex flex-col md:flex-row items-center gap-8 mb-8 shadow-sm">
          <div className="flex flex-col items-center shrink-0">
            <span className="text-[9px] uppercase tracking-widest text-[#817a67] mb-2">Governance Posture</span>
            <div className="w-28 h-28 rounded-full border-4 border-[#715b3e]/20 flex items-center justify-center bg-[#fff9ee]">
              <span className="text-3xl font-light tracking-tighter text-[#373223]">82<span className="text-xs text-stone-400">/100</span></span>
            </div>
            <span className="text-[9px] font-mono uppercase text-[#3a684d] mt-3 font-semibold tracking-wider">Stable Posture</span>
          </div>
          <div className="flex-1 space-y-3 text-center md:text-left">
            <h3 className="text-lg font-light tracking-tight text-[#373223]">Overall Governance Health Index</h3>
            <p className="text-xs font-light text-[#6b5d4f] leading-relaxed">
              The overall posture is calculated continuously from active Constitutional Drift metrics, agent compliance violation rates, circular collusion indicators, and active policy friction points.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
              <span className="text-[9px] uppercase tracking-wider bg-[#fff9ee] border border-[#b9b29c]/20 px-2.5 py-1 text-[#6b5d4f]">Drift Index: 2.1% (Low)</span>
              <span className="text-[9px] uppercase tracking-wider bg-[#fff9ee] border border-[#b9b29c]/20 px-2.5 py-1 text-[#6b5d4f]">Collusion Index: 0.0% (Clean)</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          
          {/* 2. CONSTITUTION DRIFT */}
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
              <Layers className="w-6 h-6 text-[#715b3e] mb-2 stroke-1" />
              <span className="text-[9px] uppercase tracking-wider font-mono text-[#817a67]">Drift Telemetry Online</span>
              <span className="text-[10px] text-[#6b5d4f] font-light mt-1">Alignment stability: 97.9% over past 30 days</span>
            </div>
          </div>

          {/* 3. RISKFIEST AGENTS */}
          <div className="border border-outline-variant/15 p-6 bg-surface space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b border-[#b9b29c]/10">
              <h3 className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#715b3e]" />
                Riskiest Active Agents
              </h3>
              <span className="text-[9px] font-mono uppercase text-[#9e422c] font-semibold bg-red-500/5 px-2 py-0.5 border border-red-500/10">Audit Pending</span>
            </div>
            
            <div className="divide-y divide-[#b9b29c]/10 text-xs">
              {riskiestAgents.map((agent, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <p className="font-mono text-[#715b3e] font-medium">{agent.id}</p>
                    <p className="text-[10px] text-[#6b5d4f] font-light">Violations triggered: {agent.violations}</p>
                  </div>
                  <span className={`text-[9px] uppercase font-mono px-2 py-0.5 border ${
                    agent.riskLevel === "Critical" 
                      ? "text-[#9e422c] bg-[#9e422c]/5 border-[#9e422c]/20" 
                      : "text-amber-700 bg-amber-500/5 border-amber-500/20"
                  }`}>
                    {agent.riskLevel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. POLICY FRICTION */}
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
                    <span className="text-[9px] text-[#817a67] font-light block mt-0.5">{item.overrides} check failures</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. EVOLUTION FEED */}
          <div className="border border-outline-variant/15 p-6 bg-surface space-y-4 shadow-sm col-span-1 md:col-span-2">
            <div className="flex justify-between items-center pb-2 border-b border-[#b9b29c]/10">
              <h3 className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#715b3e]" />
                Recommended Constitutional Evolutions
              </h3>
              <span className="text-[9px] font-mono uppercase text-[#3a684d] font-semibold bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10">Active recommendations</span>
            </div>
            
            <div className="divide-y divide-[#b9b29c]/10 text-xs space-y-4">
              {evolutions.map((evo) => (
                <div key={evo.id} className="pt-3 flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-[#715b3e]">{evo.id}</span>
                      <span className="text-[10px] uppercase text-stone-500">— Target: {evo.target}</span>
                    </div>
                    <p className="font-light text-[#373223] leading-relaxed">{evo.change}</p>
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
