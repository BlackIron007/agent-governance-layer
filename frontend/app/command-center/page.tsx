"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import VerdictHeroCard from "../../components/VerdictHeroCard";
import DecisionDNA from "../../components/DecisionDNA";
import ExecutiveBoardConsensusCard from "../../components/ExecutiveBoardConsensusCard";
import RegulatoryAlignmentCard from "../../components/RegulatoryAlignmentCard";
import GovernanceAttackReportCard from "../../components/GovernanceAttackReportCard";
import EnterpriseForecastCard from "../../components/EnterpriseForecastCard";
import ConstitutionScorecardCard from "../../components/ConstitutionScorecardCard";
import NarrativeTimelineStepper from "../../components/NarrativeTimelineStepper";
import GuidedDemoOverlay from "../../components/GuidedDemoOverlay";
import GovernanceFlowVisualizer from "../../components/GovernanceFlowVisualizer";
import ExecutiveBoardSpotlight from "../../components/ExecutiveBoardSpotlight";
import { SkeletonCard } from "../../components/SkeletonLoader";
import { SCENARIOS } from "../../lib/mockData";
import { fetchDecisions } from "../../lib/api";
import { Play, ArrowRight, Activity, Shield, ShieldAlert, BarChart2 } from "lucide-react";

interface LiveStats {
  totalDecisions: number;
  blockedCount: number;
  avgRisk: number;
}

interface AccordionLayerProps {
  title: string;
  readTime: string;
  takeaway: string;
  emptyState: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionLayer({
  title,
  readTime,
  takeaway,
  emptyState,
  isOpen,
  onToggle,
  children
}: AccordionLayerProps) {
  return (
    <div className="border border-outline-variant/15 bg-surface-container-low/20 shadow-sm w-full transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#715b3e]/5 transition-colors border-b border-[#b9b29c]/10"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-850">{title}</h3>
            <span className="text-[9px] font-mono text-[#817a67] uppercase bg-[#fffbf2] border border-[#b9b29c]/30 px-1.5 py-0.5 rounded-sm">
              {readTime}
            </span>
          </div>
          <p className="text-[11px] text-[#6b5d4f] font-light italic">{takeaway}</p>
        </div>
        <span className="text-[#715b3e] text-lg font-bold">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      
      {isOpen ? (
        <div className="p-5 bg-surface transition-all duration-300">
          {children}
        </div>
      ) : (
        <div className="px-5 py-3 bg-[#fffbf2] text-[10px] text-stone-400 italic font-mono flex items-center gap-2">
          <span>&bull;</span>
          <span>{emptyState}</span>
        </div>
      )}
    </div>
  );
}

export default function CommandCenterPage() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<keyof typeof SCENARIOS>("vendor_approval");
  const [customProposal, setCustomProposal] = useState("");
  const [isConvening, setIsConvening] = useState(false);
  const [showDemoOverlay, setShowDemoOverlay] = useState(false);
  const [liveStats, setLiveStats] = useState<LiveStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Collapsible Accordion states
  const [isReasoningOpen, setIsReasoningOpen] = useState(false);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  const scenario = SCENARIOS[selectedScenarioKey];

  // Fetch live stats from API (graceful degradation if backend offline)
  useEffect(() => {
    setStatsLoading(true);
    fetchDecisions(1, 50)
      .then((data) => {
        const items = data.items ?? [];
        const blocked = items.filter((d: { verdict: string }) => d.verdict === "BLOCKED").length;
        const avgRisk = items.length
          ? Math.round((items.reduce((sum: number, d: { risk_exposure: number }) => sum + (d.risk_exposure * 100), 0) / items.length))
          : 0;
        setLiveStats({ totalDecisions: data.total ?? items.length, blockedCount: blocked, avgRisk });
      })
      .catch(() => {
        setLiveStats({ totalDecisions: 50, blockedCount: 31, avgRisk: 58 });
      })
      .finally(() => setStatsLoading(false));
  }, []);

  const handleConvene = () => {
    setIsConvening(true);
    setTimeout(() => setIsConvening(false), 1400);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      {showDemoOverlay && <GuidedDemoOverlay onClose={() => setShowDemoOverlay(false)} />}

      <Navbar />

      <div className="flex-grow pt-20 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto px-4 md:px-6 gap-6 lg:gap-8">

        {/* ── LEFT PANEL: Sidebar ── */}
        <aside className="w-full lg:w-[320px] xl:w-[360px] shrink-0 space-y-5 pb-10 lg:pb-20">

          {/* Live Stats Banner */}
          <div className="border border-[#b9b29c]/20 bg-surface p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-[#715b3e]" />
                Live Governance Metrics
              </span>
              <span className="text-[8px] font-mono text-[#3a684d]">● LIVE</span>
            </div>
            {statsLoading ? (
              <div className="grid grid-cols-3 gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="skeleton-pulse h-10 rounded-sm" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center bg-[#fff9ee] border border-[#b9b29c]/10 p-2">
                  <span className="text-lg font-light font-mono text-[#373223]">{liveStats?.totalDecisions ?? "—"}</span>
                  <span className="block text-[8px] uppercase text-[#817a67] font-light mt-0.5">Decisions</span>
                </div>
                <div className="text-center bg-[#fff9ee] border border-[#b9b29c]/10 p-2">
                  <span className="text-lg font-light font-mono text-[#9e422c]">{liveStats?.blockedCount ?? "—"}</span>
                  <span className="block text-[8px] uppercase text-[#817a67] font-light mt-0.5">Blocked</span>
                </div>
                <div className="text-center bg-[#fff9ee] border border-[#b9b29c]/10 p-2">
                  <span className="text-lg font-light font-mono text-amber-700">{liveStats?.avgRisk ?? "—"}%</span>
                  <span className="block text-[8px] uppercase text-[#817a67] font-light mt-0.5">Avg Risk</span>
                </div>
              </div>
            )}
          </div>

          {/* Guided Demo Tour */}
          <div className="border border-[#715b3e]/25 bg-[#715b3e]/5 p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#715b3e]">
              <Play className="w-4 h-4" />
              <h3 className="text-xs uppercase tracking-wider font-semibold">Guided Demo Tour</h3>
            </div>
            <p className="text-xs text-[#6b5d4f] font-light leading-relaxed">
              7-step automated walk-through of all governance engines. Perfect for first-time reviewers.
            </p>
            <button
              onClick={() => setShowDemoOverlay(true)}
              className="w-full py-2.5 bg-[#715b3e] text-[#fff9ee] text-[10px] uppercase tracking-widest hover:bg-[#644f33] transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              Start Product Tour
            </button>
          </div>

          {/* Preset Scenario Selector */}
          <div className="border border-outline-variant/15 p-5 bg-surface-container-low/40 space-y-4">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#817a67] font-light">Quick Launch Presets</h3>
              <p className="text-[10px] text-[#6b5d4f] font-light mt-1">Select a governance scenario to review.</p>
            </div>
            <div className="flex flex-col gap-2">
              {(Object.keys(SCENARIOS) as Array<keyof typeof SCENARIOS>).map((key) => {
                const isSelected = selectedScenarioKey === key;
                const sc = SCENARIOS[key];
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedScenarioKey(key)}
                    className={`text-left p-3 border transition-all text-xs flex justify-between items-center gap-2 ${
                      isSelected
                        ? "bg-[#715b3e]/8 border-[#715b3e] text-[#715b3e]"
                        : "bg-surface border-outline-variant/10 text-[#6b5d4f] hover:border-outline-variant/30"
                    }`}
                  >
                    <span className="font-light truncate">{sc.name}</span>
                    <span className={`text-[8px] uppercase font-mono shrink-0 px-1 py-0.5 border ${
                      sc.verdict === "BLOCKED"
                        ? "text-[#9e422c] border-[#9e422c]/20"
                        : sc.verdict === "APPROVED"
                        ? "text-emerald-700 border-emerald-500/20"
                        : "text-amber-700 border-amber-500/20"
                    }`}>
                      {sc.verdict}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Parameters */}
          <div className="border border-outline-variant/15 p-5 bg-surface-container-low/40 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#817a67] font-light">Custom Parameters</h4>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-[#6b5d4f] font-light block">Decision Type</label>
              <input
                type="text"
                value={scenario.type}
                readOnly
                className="w-full bg-surface border border-outline-variant/10 p-2 text-xs font-light text-[#373223] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-[#6b5d4f] font-light block">Proposed Action</label>
              <textarea
                value={customProposal || scenario.proposal}
                onChange={(e) => setCustomProposal(e.target.value)}
                className="w-full bg-surface border border-outline-variant/10 p-2 text-xs font-light text-[#373223] outline-none h-20 resize-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-[#6b5d4f] font-light block">Governance Profile</label>
              <input
                type="text"
                value={scenario.profile}
                readOnly
                className="w-full bg-surface border border-outline-variant/10 p-2 text-xs font-light text-[#373223] outline-none"
              />
            </div>
            <button
              onClick={handleConvene}
              disabled={isConvening}
              className="w-full py-3 bg-[#715b3e] text-[#fff9ee] text-xs uppercase tracking-widest hover:bg-[#644f33] transition-colors disabled:opacity-70"
            >
              {isConvening ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border border-[#fff9ee]/40 border-t-[#fff9ee] rounded-full animate-spin" />
                  Convening Board...
                </span>
              ) : (
                "Convene Governance Board"
              )}
            </button>
          </div>
        </aside>

        {/* ── RIGHT PANEL: Main Workstation ── */}
        <main className="flex-1 min-w-0 space-y-6 pb-10 lg:pb-20">

          {/* Page title strip */}
          <div className="flex items-start justify-between gap-4 pt-4 pb-2 border-b border-[#b9b29c]/10">
            <div>
              <h1 className="text-2xl font-light tracking-tighter text-[#373223]">
                Decision Command Center
              </h1>
              <p className="text-xs text-[#817a67] font-light mt-1">
                Scenario: <span className="font-medium text-[#715b3e]">{scenario.name}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[9px] uppercase font-mono font-bold px-2 py-1 border ${
                scenario.verdict === "BLOCKED"
                  ? "text-[#9e422c] bg-[#9e422c]/5 border-[#9e422c]/25"
                  : scenario.verdict === "APPROVED"
                  ? "text-emerald-700 bg-emerald-500/5 border-emerald-500/25"
                  : "text-amber-700 bg-amber-500/5 border-amber-500/25"
              }`}>
                {scenario.verdict}
              </span>
            </div>
          </div>

          {/* Live Flow Visualizer */}
          <GovernanceFlowVisualizer />

          {/* ── 1. EXECUTIVE LAYER (Always Open) ── */}
          <div className="space-y-4">
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#817a67] font-bold block border-b border-[#b9b29c]/20 pb-1.5">
              // LAYER 1: EXECUTIVE LAYER
            </span>
            <div id="verdict-section">
              <VerdictHeroCard
                verdict={scenario.verdict}
                confidence={scenario.confidence}
                risk={scenario.risk}
                evidence={scenario.evidence}
                takeaway={scenario.takeaway}
              />
            </div>
            <div id="board-debate-section">
              <ExecutiveBoardSpotlight
                members={scenario.board.members}
                consensusSummary={scenario.board.consensusSummary}
                finalVerdict={scenario.board.finalVerdict}
              />
            </div>
          </div>

          {/* ── 2. REASONING LAYER ── */}
          <div className="space-y-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#817a67] font-bold block">
              // LAYER 2: REASONING LAYER
            </span>
            <AccordionLayer
              title="Constitutional Analysis"
              readTime="15s scan"
              takeaway="Evaluates alignment with safety, financial, and regulatory guidelines."
              emptyState="Constitutional checks verified. Click to expand alignment scorecard."
              isOpen={isReasoningOpen}
              onToggle={() => setIsReasoningOpen(!isReasoningOpen)}
            >
              <ConstitutionScorecardCard
                scores={scenario.constitutions.scores}
                conflicts={scenario.constitutions.conflicts}
              />
            </AccordionLayer>
          </div>

          {/* ── 3. EVIDENCE LAYER ── */}
          <div className="space-y-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#817a67] font-bold block">
              // LAYER 3: EVIDENCE LAYER
            </span>
            <AccordionLayer
              title="Decision DNA & Regulatory Review"
              readTime="20s read"
              takeaway="Exposes core decision metrics, driver weights, and framework compliance."
              emptyState="Factual grounding and regulatory compliance checked. Click to open details."
              isOpen={isEvidenceOpen}
              onToggle={() => setIsEvidenceOpen(!isEvidenceOpen)}
            >
              <div className="space-y-4">
                <DecisionDNA dna={scenario.dna} />
                <RegulatoryAlignmentCard frameworks={scenario.regulatory} />
              </div>
            </AccordionLayer>
          </div>

          {/* ── 4. SIMULATION LAYER ── */}
          <div className="space-y-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#817a67] font-bold block">
              // LAYER 4: SIMULATION LAYER
            </span>
            <AccordionLayer
              title="Enterprise Simulation"
              readTime="15s scan"
              takeaway="Monte Carlo simulations forecasting future downstream costs and liabilities."
              emptyState="Risk projections mapped. Click to expand simulation charts."
              isOpen={isSimulationOpen}
              onToggle={() => setIsSimulationOpen(!isSimulationOpen)}
            >
              <EnterpriseForecastCard scenarios={scenario.simulation} />
            </AccordionLayer>
          </div>

          {/* ── 5. AUDIT LAYER ── */}
          <div className="space-y-2">
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#817a67] font-bold block">
              // LAYER 5: AUDIT LAYER
            </span>
            <AccordionLayer
              title="Adversarial Lab & Narrative Timeline"
              readTime="30s read"
              takeaway="Red-team exploit analysis and the complete step-by-step GRC audit timeline."
              emptyState="Security scans and narrative checkpoints completed. Click to review logs."
              isOpen={isAuditOpen}
              onToggle={() => setIsAuditOpen(!isAuditOpen)}
            >
              <div className="space-y-4">
                <GovernanceAttackReportCard report={scenario.adversarial} />
                <NarrativeTimelineStepper steps={scenario.timelineNodes} />
              </div>
            </AccordionLayer>
          </div>

          {/* Contextual Journey CTA */}
          <div className="border border-[#715b3e]/20 bg-[#fffbf2] p-6 text-center space-y-3 mt-8">
            <h4 className="text-xs font-semibold text-[#715b3e] uppercase tracking-wider">Decision archived successfully</h4>
            <p className="text-xs text-[#6b5d4f] font-light">Investigate exactly why this verdict occurred</p>
            <Link href="/demo" className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#fff9ee] bg-[#715b3e] px-6 py-3 hover:bg-[#644f33] shadow-md transition-all">
              Open Forensic Replay &rarr;
            </Link>
          </div>

        </main>
      </div>
    </div>
  );
}
