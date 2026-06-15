"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { SkeletonIntelligencePage } from "../../components/SkeletonLoader";
import { fetchGovernanceIntelligence } from "../../lib/api";
import {
  Sparkles, TrendingUp, TrendingDown, Minus,
  AlertTriangle, RefreshCw, Activity, Brain,
  ShieldCheck, ArrowUp, ArrowDown, ChevronRight
} from "lucide-react";

// ── Types matching backend GovernanceIntelligenceReport ──────────────

interface HealthBreakdown {
  label: string;
  score: number;
  description?: string;
}

interface RiskRanking {
  id: string;
  violations: number;
  risk_level: string;
  score: number;
  trend: string;
}

interface PolicyFriction {
  rule: string;
  friction: string;
  overrides: number;
}

interface PolicyEvolution {
  id?: string;
  action?: string;
  target?: string;
  change?: string;
  impact?: string;
  status?: string;
  recommendation?: string;
  rationale?: string;
}

interface IntelligenceData {
  governance_health_index: number;
  health_posture: string;
  health_breakdown: HealthBreakdown[];
  constitutional_analytics?: {
    total_violations?: number;
    by_severity?: Record<string, number>;
    top_violated_rule?: string;
  };
  risk_rankings: RiskRanking[];
  drift_analysis?: {
    alignment_stability_30d?: string;
    trend?: string;
    drift_score?: number;
  };
  policy_frictions: PolicyFriction[];
  policy_evolution_recommendations?: PolicyEvolution[];
}

// ── Mock fallback data ────────────────────────────────────────────────

const MOCK_INTELLIGENCE: IntelligenceData = {
  governance_health_index: 82,
  health_posture: "Stable Posture",
  health_breakdown: [
    { label: "Drift Stability",         score: 97, description: "Constitutional drift within acceptable variance." },
    { label: "Audit Compliance",        score: 85, description: "Percentage of decisions passing all audit checks." },
    { label: "Collusion Protection",    score: 100, description: "Adversarial collusion detection coverage." },
    { label: "Constitutional Alignment",score: 77, description: "Average execution confidence across all decisions." },
    { label: "Policy Rule Stability",   score: 90, description: "Policy rules operating within normal friction bounds." },
  ],
  constitutional_analytics: {
    total_violations: 51,
    by_severity: { CRITICAL: 24, HIGH: 18, MEDIUM: 9 },
    top_violated_rule: "SECURITY_BEFORE_COST",
  },
  risk_rankings: [
    { id: "procurement_agent_v4",    violations: 18, risk_level: "Critical", score: 0.47, trend: "Worsening" },
    { id: "customer_onboarding_svc", violations: 12, risk_level: "High",     score: 0.38, trend: "Improving" },
    { id: "hr_screener_autonomous",  violations: 9,  risk_level: "Medium",   score: 0.28, trend: "Stable"   },
    { id: "emergency_iam_manager",   violations: 5,  risk_level: "Medium",   score: 0.15, trend: "Improving" },
  ],
  drift_analysis: {
    alignment_stability_30d: "97.9%",
    trend: "Stable",
    drift_score: 2.1,
  },
  policy_frictions: [
    { rule: "Rule SEC-01: All Core database infrastructure suppliers must possess a valid SOC2 Type II audit certificate.", friction: "High", overrides: 14 },
    { rule: "Rule HR-03: Candidate screening criteria must evaluate individual skills metrics.", friction: "Medium", overrides: 9 },
    { rule: "Rule MED-09: Dosage variance must remain within a maximum 10% corridor.", friction: "Medium", overrides: 5 },
  ],
  policy_evolution_recommendations: [
    { id: "EVO-01", action: "MODERNIZE", target: "HUMAN_REVIEW_FOR_HIGH_RISK", change: "Lock Vendor requirements to restrict procurement overrides if third-party SOC2 certificate attributes evaluate to false.", impact: "-34% friction | +7% risk", status: "RECOMMENDED" },
    { id: "EVO-02", action: "STRENGTHEN", target: "DOSAGE_SLA_CORRIDOR", change: "Automatically route all clinical dosage overrides above 15% to high-priority manual physician review.", impact: "-12% friction | +19% safety", status: "RECOMMENDED" },
  ],
};

// ── Sub-components ────────────────────────────────────────────────────

function HealthGauge({ score, posture }: { score: number; posture: string }) {
  const r = 48;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 85 ? "#3a684d" : score >= 65 ? "#715b3e" : "#9e422c";
  const postureColor = score >= 85 ? "text-[#3a684d]" : score >= 65 ? "text-[#715b3e]" : "text-[#9e422c]";

  return (
    <div className="flex flex-col items-center gap-3 shrink-0">
      <span className="text-[9px] uppercase tracking-widest text-[#817a67] font-medium">Governance Health Index</span>
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={r} stroke="#f5eddd" strokeWidth="7" fill="transparent" />
          <circle
            cx="70" cy="70" r={r}
            stroke={color} strokeWidth="7" fill="transparent"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="ring-animate"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-3xl font-light tracking-tighter" style={{ color }}>{score}</span>
          <span className="block text-[10px] text-stone-400">/100</span>
        </div>
      </div>
      <span className={`text-[9px] font-mono uppercase font-semibold tracking-wider ${postureColor}`}>{posture}</span>
    </div>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "Worsening") return <ArrowDown className="w-3 h-3 text-[#9e422c]" />;
  if (trend === "Improving") return <ArrowUp className="w-3 h-3 text-[#3a684d]" />;
  return <Minus className="w-3 h-3 text-[#817a67]" />;
}

function FrictionDot({ level }: { level: string }) {
  const colors = { High: "bg-[#9e422c]", Medium: "bg-amber-600", Low: "bg-[#3a684d]" };
  return <span className={`w-2 h-2 rounded-full ${colors[level as keyof typeof colors] ?? "bg-[#817a67]"} shrink-0 mt-1`} />;
}

export default function IntelligencePage() {
  const [data, setData] = useState<IntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchGovernanceIntelligence()
      .then((res) => setData(res))
      .catch(() => {
        setError("Governance Intelligence feed offline. Displaying cached analysis.");
        setData(MOCK_INTELLIGENCE);
      })
      .finally(() => {
        setLoading(false);
        setRetrying(false);
      });
  };

  useEffect(() => { loadData(); }, []);

  const retry = () => { setRetrying(true); loadData(); };

  const d = data ?? MOCK_INTELLIGENCE;
  const topViolations = [
    { rule: "SECURITY_BEFORE_COST",      count: d.constitutional_analytics?.by_severity?.CRITICAL ?? 24, severity: "CRITICAL", trend: "Increasing" },
    { rule: "COMPLIANCE_BEFORE_SPEED",   count: d.constitutional_analytics?.by_severity?.HIGH     ?? 18, severity: "HIGH",     trend: "Stable"     },
    { rule: "HUMAN_REVIEW_FOR_HIGH_RISK",count: d.constitutional_analytics?.by_severity?.MEDIUM   ?? 9,  severity: "MEDIUM",   trend: "Decreasing" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 flex flex-col items-center w-full max-w-5xl mx-auto px-4 md:px-6">

        {/* ── Header ── */}
        <header className="w-full mb-8 animate-fadeIn">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-normal tracking-[0.05em] uppercase text-[#817a67]">System Health Monitoring</span>
              <h1 className="text-4xl font-light tracking-tighter text-[#373223] mt-2 flex items-center gap-3">
                <Brain className="w-8 h-8 text-[#715b3e]" strokeWidth={1} />
                Governance Intelligence Hub
              </h1>
              <p className="text-sm text-[#6b5d4f] font-light mt-1">
                Continuous AI system analysis — constitutional alignment, rule drift, and policy evolution.
              </p>
            </div>
            <button
              onClick={retry}
              disabled={retrying || loading}
              className="flex items-center gap-1.5 text-[9px] uppercase font-mono text-[#715b3e] border border-[#715b3e]/25 px-3 py-2 hover:bg-[#715b3e]/5 transition-colors disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3 h-3 ${(retrying || loading) ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </header>

        {/* Error banner */}
        {error && (
          <div className="w-full border border-amber-500/25 bg-amber-500/5 p-3 mb-6 flex items-center gap-2 text-xs text-amber-700 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* ── System Activity Ribbon ── */}
        <section className="w-full bg-[#f5eddd] border border-[#b9b29c]/20 px-4 py-2.5 mb-6 flex flex-wrap justify-between items-center gap-4 text-[10px] font-mono text-[#817a67]">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#715b3e]" />
            <span>SYSTEM STATE SUMMARY:</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span>Agents Active: <strong className="text-[#373223]">11</strong></span>
            <span className="text-[#b9b29c]">|</span>
            <span>Constitutions Monitored: <strong className="text-[#373223]">4</strong></span>
            <span className="text-[#b9b29c]">|</span>
            <span>Regulatory Frameworks: <strong className="text-[#373223]">5</strong></span>
            <span className="text-[#b9b29c]">|</span>
            <span>Attack Vectors Simulated: <strong className="text-[#373223]">27</strong></span>
            <span className="text-[#b9b29c]">|</span>
            <span>Enterprise Simulations Today: <strong className="text-[#3a684d]">180</strong></span>
          </div>
        </section>

        {/* ── Latest Governance Signals Live Feed ── */}
        <section className="w-full bg-[#fffbf2] border border-[#b9b29c]/20 p-5 mb-6 space-y-4">
          <div className="flex justify-between items-center border-b border-[#b9b29c]/15 pb-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#817a67] font-bold">
              // Latest Governance Signals Feed
            </span>
            <span className="text-[8px] font-mono text-[#3a684d] animate-pulse">● LIVE STREAM</span>
          </div>
          <div className="space-y-2 text-xs font-mono text-[#6b5d4f]">
            <div className="flex justify-between hover:bg-stone-50 p-1.5 transition-colors">
              <span className="text-[#9e422c]">14:32</span>
              <span className="flex-1 px-4 text-[#373223]">Procurement Agent drift increased 0.8%</span>
              <span className="text-stone-400">WARNING</span>
            </div>
            <div className="flex justify-between hover:bg-stone-50 p-1.5 transition-colors">
              <span className="text-[#3a684d]">13:11</span>
              <span className="flex-1 px-4 text-[#373223]">Policy friction reduced after constitutional update</span>
              <span className="text-[#3a684d]">RESOLVED</span>
            </div>
            <div className="flex justify-between hover:bg-stone-50 p-1.5 transition-colors">
              <span className="text-emerald-700">12:02</span>
              <span className="flex-1 px-4 text-[#373223]">Collusion risk dropped below threshold</span>
              <span className="text-emerald-700">PASS</span>
            </div>
            <div className="flex justify-between hover:bg-stone-50 p-1.5 transition-colors">
              <span className="text-[#9e422c]">11:17</span>
              <span className="flex-1 px-4 text-[#373223]">New regulatory conflict pattern detected</span>
              <span className="text-[#9e422c]">BLOCKING</span>
            </div>
          </div>
        </section>

        {/* ── Most Important Governance Finding Today (Minor Correction 3) ── */}
        <section className="w-full bg-[#f5eddd] border border-[#9e422c]/30 p-5 mb-6 shadow-sm animate-fadeIn">
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#9e422c] font-bold block border-b border-[#9e422c]/15 pb-1 mb-2">
            // Most Important Governance Finding Today
          </span>
          <p className="text-sm font-light text-[#373223] leading-relaxed">
            Procurement Agent drift increased 0.8% after policy update. Constitutional alignment remains stable but monitoring threshold has been crossed.
          </p>
        </section>

        {/* Loading state */}
        {loading ? (
          <SkeletonIntelligencePage />
        ) : (
          <div className="w-full space-y-8 animate-fadeIn">

            {/* ── 1. GOVERNANCE HEALTH INDEX ── */}
            <section className="w-full border border-outline-variant/15 p-6 md:p-8 bg-surface-container-low/40 flex flex-col lg:flex-row items-start lg:items-center gap-8 shadow-sm">
              <HealthGauge score={d.governance_health_index} posture={d.health_posture} />
              <div className="flex-1 w-full space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#715b3e]" />
                  <h3 className="text-xs uppercase tracking-widest text-[#817a67] font-medium">
                    Institutional Security Posture Breakdown
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {d.health_breakdown.map((item, idx) => (
                    <div key={idx} className="bg-surface border border-[#b9b29c]/15 p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-[#6b5d4f] font-light">{item.label}</span>
                        <span className="font-mono text-xs font-semibold text-[#715b3e]">{item.score}%</span>
                      </div>
                      <div className="w-full bg-[#f5eddd] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${item.score}%`,
                            background: item.score >= 85 ? "#3a684d" : item.score >= 65 ? "#715b3e" : "#9e422c",
                          }}
                        />
                      </div>
                      {item.description && (
                        <p className="text-[9px] text-[#817a67] font-light leading-relaxed">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── 2-col grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

              {/* 2. CONSTITUTIONAL DRIFT */}
              <div className="border border-outline-variant/15 p-6 bg-surface space-y-4 shadow-sm">
                <div className="flex justify-between items-center pb-2 border-b border-[#b9b29c]/10">
                  <h3 className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#715b3e]" />
                    Constitutional Drift Analysis
                  </h3>
                  <span className={`text-[9px] font-mono uppercase font-semibold px-2 py-0.5 border ${
                    d.drift_analysis?.trend === "Stable"
                      ? "text-[#3a684d] bg-emerald-500/5 border-emerald-500/10"
                      : "text-amber-700 bg-amber-500/5 border-amber-500/10"
                  }`}>
                    {d.drift_analysis?.trend ?? "Stable"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#fff9ee] border border-[#b9b29c]/10 p-3 text-center">
                    <span className="text-2xl font-light text-[#3a684d] font-mono">{d.drift_analysis?.alignment_stability_30d ?? "97.9%"}</span>
                    <span className="block text-[9px] uppercase text-[#817a67] mt-1 font-light">Alignment Stability (30d)</span>
                  </div>
                  <div className="bg-[#fff9ee] border border-[#b9b29c]/10 p-3 text-center">
                    <span className="text-2xl font-light text-[#715b3e] font-mono">{d.drift_analysis?.drift_score ?? 2.1}</span>
                    <span className="block text-[9px] uppercase text-[#817a67] mt-1 font-light">Drift Score</span>
                  </div>
                </div>
                <p className="text-xs font-light text-[#6b5d4f] leading-relaxed">
                  Decision patterns show strong constitutional alignment. Drift remains within ±3% of baseline across all active constitutional frameworks.
                </p>
              </div>

              {/* 3. RISKIEST AGENTS */}
              <div className="border border-outline-variant/15 p-6 bg-surface space-y-4 shadow-sm">
                <div className="flex justify-between items-center pb-2 border-b border-[#b9b29c]/10">
                  <h3 className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#9e422c]" />
                    Riskiest Agents Leaderboard
                  </h3>
                  <span className="text-[9px] font-mono uppercase text-[#9e422c] font-semibold bg-red-500/5 px-2 py-0.5 border border-red-500/10">
                    Audit Pending
                  </span>
                </div>
                <div className="divide-y divide-[#b9b29c]/10 text-xs">
                  {d.risk_rankings.map((agent, idx) => (
                    <div key={idx} className="py-3 flex justify-between items-center gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-[10px] font-mono text-[#817a67] shrink-0">#{idx + 1}</span>
                        <div className="min-w-0">
                          <p className="font-mono text-[#715b3e] font-medium truncate">{agent.id}</p>
                          <p className="text-[10px] text-[#6b5d4f] font-light">{agent.violations} violations</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <TrendIcon trend={agent.trend} />
                        <div className="text-right">
                          <span className="text-[10px] font-mono font-medium block">{agent.score.toFixed(2)}</span>
                          <span className={`text-[8px] uppercase font-mono px-1.5 py-0.5 border ${
                            agent.risk_level === "Critical"
                              ? "text-[#9e422c] bg-[#9e422c]/5 border-[#9e422c]/20"
                              : agent.risk_level === "High"
                              ? "text-amber-700 bg-amber-500/5 border-amber-500/20"
                              : "text-[#817a67] bg-[#b9b29c]/5 border-[#b9b29c]/20"
                          }`}>
                            {agent.risk_level}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. TOP CONSTITUTIONAL VIOLATIONS */}
              <div className="border border-outline-variant/15 p-6 bg-surface space-y-4 shadow-sm col-span-1 md:col-span-2">
                <div className="flex justify-between items-center pb-2 border-b border-[#b9b29c]/10">
                  <h3 className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#715b3e]" />
                    Top Constitutional Violations
                  </h3>
                  {d.constitutional_analytics?.total_violations && (
                    <span className="text-[9px] font-mono text-[#9e422c]">
                      {d.constitutional_analytics.total_violations} total failures
                    </span>
                  )}
                </div>
                <div className="divide-y divide-[#b9b29c]/10 text-xs">
                  {topViolations.map((v, idx) => (
                    <div key={idx} className="py-3 flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className={`text-[8px] uppercase font-mono font-bold px-1.5 py-0.5 border shrink-0 ${
                          v.severity === "CRITICAL"
                            ? "text-[#9e422c] bg-[#9e422c]/5 border-[#9e422c]/20"
                            : v.severity === "HIGH"
                            ? "text-amber-700 bg-amber-500/5 border-amber-500/20"
                            : "text-[#817a67] bg-[#b9b29c]/5 border-[#b9b29c]/20"
                        }`}>
                          {v.severity}
                        </span>
                        <p className="font-semibold text-stone-700 font-mono truncate">{v.rule}</p>
                      </div>
                      <div className="text-right shrink-0 flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[10px] text-[#6b5d4f]">
                          {v.trend === "Increasing" ? (
                            <TrendingUp className="w-3 h-3 text-[#9e422c]" />
                          ) : v.trend === "Decreasing" ? (
                            <TrendingDown className="w-3 h-3 text-[#3a684d]" />
                          ) : (
                            <Minus className="w-3 h-3 text-[#817a67]" />
                          )}
                          <span>{v.trend}</span>
                        </div>
                        <span className="text-[11px] font-bold text-[#373223] font-mono">{v.count} failures</span>
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
                  {d.policy_frictions.map((item, idx) => (
                    <div key={idx} className="py-3 flex justify-between items-start gap-4">
                      <div className="flex items-start gap-2 flex-1">
                        <FrictionDot level={item.friction} />
                        <p className="font-light text-[#373223] leading-relaxed">{item.rule}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-[10px] uppercase font-semibold block ${
                          item.friction === "High" ? "text-[#9e422c]" : "text-amber-700"
                        }`}>
                          {item.friction} Friction
                        </span>
                        <span className="text-[9px] text-[#817a67] font-light block mt-0.5">
                          {item.overrides} overrides
                        </span>
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
                    Policy Evolution Recommendations
                    <span className="text-[9px] font-light normal-case text-[#817a67]">(Constitutional Evolution Engine)</span>
                  </h3>
                  <span className="text-[9px] font-mono uppercase text-[#3a684d] font-semibold bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10">
                    {(d.policy_evolution_recommendations ?? []).length} Active
                  </span>
                </div>
                <div className="divide-y divide-[#b9b29c]/10 space-y-4">
                  {(d.policy_evolution_recommendations ?? []).map((evo, i) => (
                    <div key={evo.id ?? i} className="pt-3 flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {evo.action && (
                            <span className="font-mono text-[10px] font-bold text-[#715b3e] bg-[#715b3e]/8 border border-[#715b3e]/20 px-2 py-0.5">
                              {evo.action}
                            </span>
                          )}
                          {evo.target && (
                            <span className="text-[10px] uppercase text-stone-500 font-mono">
                              → {evo.target}
                            </span>
                          )}
                          {evo.id && (
                            <span className="text-[9px] text-[#817a67] font-mono">{evo.id}</span>
                          )}
                        </div>
                        <p className="text-xs font-light text-[#373223] leading-relaxed">
                          {evo.change ?? evo.recommendation ?? ""}
                        </p>
                        {(evo.impact ?? evo.rationale) && (
                          <div className="flex items-center gap-1.5">
                            <ChevronRight className="w-3 h-3 text-[#3a684d]" />
                            <p className="text-[10px] text-[#3a684d] font-mono font-medium">
                              {evo.impact ?? evo.rationale}
                            </p>
                          </div>
                        )}
                      </div>
                      <button className="px-4 py-2 border border-[#715b3e] text-[#715b3e] uppercase text-[9px] tracking-wider hover:bg-[#715b3e] hover:text-[#fff9ee] transition-all shrink-0 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        Approve &amp; Evolve
                      </button>
                    </div>
                  ))}
                  {(d.policy_evolution_recommendations ?? []).length === 0 && (
                    <div className="py-6 text-center text-xs font-light text-[#817a67]">
                      No evolution recommendations at this time. Constitutional alignment is optimal.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
