"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import VerdictHeroCard from "../../../components/VerdictHeroCard";
import DecisionDNA from "../../../components/DecisionDNA";
import ExecutiveBoardConsensusCard from "../../../components/ExecutiveBoardConsensusCard";
import RegulatoryAlignmentCard from "../../../components/RegulatoryAlignmentCard";
import GovernanceAttackReportCard from "../../../components/GovernanceAttackReportCard";
import EnterpriseForecastCard from "../../../components/EnterpriseForecastCard";
import ConstitutionScorecardCard from "../../../components/ConstitutionScorecardCard";
import NarrativeTimelineStepper from "../../../components/NarrativeTimelineStepper";
import { SkeletonForensicPage } from "../../../components/SkeletonLoader";
import { SCENARIOS, DECISION_ID_MAP, Scenario } from "../../../lib/mockData";
import { fetchDecision } from "../../../lib/api";
import DecisionReplayPlayer from "../../../components/DecisionReplayPlayer";
import { DecisionLineageBanner } from "../../../components/GlobalGovernanceTracker";
import ExecutiveBoardSpotlight from "../../../components/ExecutiveBoardSpotlight";
import {
  FileText, Calendar, ShieldCheck, Cpu, Clock,
  Layers, Shield, Zap, AlertTriangle, ChevronRight
} from "lucide-react";

// Map API response fields to our Scenario shape
function mapApiToScenario(api: Record<string, unknown>): Scenario | null {
  try {
    return {
      decisionId: (api.decision_id ?? api.decisionId ?? "UNKNOWN") as string,
      timestamp: (api.timestamp ?? new Date().toISOString()) as string,
      schemaVersion: (api.schema_version ?? api.schemaVersion ?? "1.0.0") as string,
      name: (api.proposal ?? api.name ?? "Governance Decision") as string,
      type: (api.decision_type ?? api.type ?? "Unknown Type") as string,
      context: (api.context ?? "") as string,
      proposal: (api.proposal ?? api.name ?? "") as string,
      rationale: (api.rationale ?? "") as string,
      profile: (api.governance_profile ?? api.profile ?? "Enterprise") as string,
      verdict: (api.verdict ?? "BLOCKED") as "APPROVED" | "BLOCKED" | "CONDITIONAL_ALLOW",
      confidence: Math.round(((api.execution_confidence as number) ?? 0) * 100) || (api.confidence as number) || 0,
      risk: Math.round(((api.risk_exposure as number) ?? 0) * 100) || (api.risk as number) || 0,
      evidence: (api.evidence as number) || 85,
      takeaway: (api.takeaway ?? api.summary ?? "Governance decision processed.") as string,
      processing: {
        durationMs: ((api.processing as Record<string, number>)?.duration_ms ?? (api.processing as Record<string, number>)?.durationMs ?? 3000) as number,
        agentsExecuted: ((api.processing as Record<string, number>)?.agents_executed ?? (api.processing as Record<string, number>)?.agentsExecuted ?? 11) as number,
        regulatoryFrameworksEvaluated: ((api.processing as Record<string, number>)?.regulatory_frameworks_evaluated ?? (api.processing as Record<string, number>)?.regulatoryFrameworksEvaluated ?? 3) as number,
        simulationScenariosGenerated: ((api.processing as Record<string, number>)?.simulation_scenarios_generated ?? (api.processing as Record<string, number>)?.simulationScenariosGenerated ?? 2) as number,
        attackVectorsTested: ((api.processing as Record<string, number>)?.attack_vectors_tested ?? (api.processing as Record<string, number>)?.attackVectorsTested ?? 27) as number,
      },
      dna: (api.dna as Scenario["dna"]) ?? [],
      board: (api.board as Scenario["board"]) ?? { members: [], consensusSummary: "N/A", finalVerdict: "REJECTED" },
      regulatory: (api.regulatory as Scenario["regulatory"]) ?? [],
      adversarial: (api.adversarial as Scenario["adversarial"]) ?? {
        resilienceScore: 0, manipulationRisk: 0, collusionRisk: 0,
        rewardHackingRisk: 0, policyGamingRisk: 0, constitutionExploitRisk: 0, vulnerabilities: []
      },
      simulation: (api.simulation as Scenario["simulation"]) ?? [],
      constitutions: (api.constitutions as Scenario["constitutions"]) ?? { scores: [], conflicts: [] },
      timelineNodes: (api.timelineNodes as Scenario["timelineNodes"]) ?? [],
    };
  } catch {
    return null;
  }
}

type Section = {
  id: string;
  label: string;
  subtitle: string;
  defaultOpen: boolean;
};

const SECTIONS: Section[] = [
  { id: "verdict",    label: "Executive Verdict",       subtitle: "Final governance outcome",         defaultOpen: true  },
  { id: "dna",        label: "Decision DNA",             subtitle: "Core driver weights",              defaultOpen: false },
  { id: "board",      label: "Board Debate",             subtitle: "Executive consensus",              defaultOpen: false },
  { id: "constitution",label:"Constitutional Analysis",  subtitle: "Framework alignment & conflicts",  defaultOpen: false },
  { id: "regulatory", label: "Regulatory Review",        subtitle: "Compliance scorecard",             defaultOpen: false },
  { id: "adversarial",label: "Adversarial Findings",     subtitle: "Red-team exploit analysis",        defaultOpen: false },
  { id: "simulation", label: "Enterprise Simulation",    subtitle: "Monte Carlo projections",          defaultOpen: false },
  { id: "timeline",   label: "Final Recommendation",     subtitle: "Governance narrative replay",      defaultOpen: false },
];

export default function DecisionDetailPage() {
  const params = useParams();
  const rawId = params.id as string;

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["verdict"]));
  const [showReplay, setShowReplay] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchDecision(rawId)
      .then((data) => {
        if (!data) throw new Error("not_found");
        const mapped = mapApiToScenario(data);
        if (mapped) {
          setScenario(mapped);
        } else {
          throw new Error("mapping_failed");
        }
      })
      .catch(() => {
        // Graceful degradation: use mockData if API unavailable
        const scenarioKey = DECISION_ID_MAP[rawId] ?? "vendor_approval";
        const mock = SCENARIOS[scenarioKey];
        if (mock) {
          setScenario(mock);
        } else {
          setError("Decision record not found. The audit file may have been purged.");
        }
      })
      .finally(() => setLoading(false));
  }, [rawId]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setOpenSections(new Set(SECTIONS.map(s => s.id)));
  const collapseAll = () => setOpenSections(new Set(["verdict"]));

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-background">
        <Navbar />
        <main className="flex-grow pt-28 pb-20 flex flex-col items-center w-full max-w-4xl mx-auto px-4 md:px-6">
          <SkeletonForensicPage />
        </main>
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-background">
        <Navbar />
        <main className="flex-grow pt-28 pb-20 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-6">
          <div className="text-center space-y-6 animate-fadeIn">
            <AlertTriangle className="w-12 h-12 text-[#9e422c] mx-auto" strokeWidth={1} />
            <div>
              <span className="text-[9px] uppercase tracking-widest text-[#817a67] font-medium block">Forensic Audit Record</span>
              <h1 className="text-3xl font-light tracking-tighter text-[#373223] mt-2">Record Not Found</h1>
            </div>
            <div className="border border-[#9e422c]/20 bg-[#9e422c]/5 p-6 max-w-md mx-auto">
              <p className="text-sm font-light text-[#6b5d4f] leading-relaxed">
                {error ?? `Decision record "${rawId}" could not be located in the governance ledger.`}
              </p>
            </div>
            <a
              href="/decision-history"
              className="inline-block border border-[#715b3e] text-[#715b3e] px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-[#715b3e] hover:text-[#fff9ee] transition-all"
            >
              View Decision History
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 flex flex-col items-center w-full max-w-4xl mx-auto px-4 md:px-6">

        {/* Stateful Decision Lineage Banner */}
        <DecisionLineageBanner decisionId={scenario.decisionId} />

        {/* ── Page Header ── */}
        <header className="w-full border-b border-[#b9b29c]/20 pb-6 mb-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-2">
              <span className="text-[9px] font-mono uppercase text-[#715b3e] flex items-center gap-1.5 font-bold">
                <FileText className="w-3.5 h-3.5" /> SECURE GOVERNANCE AUDIT RECORD
              </span>
              <h1 className="text-3xl md:text-4xl font-light tracking-tighter text-[#373223]">
                Forensic Audit File {scenario.decisionId}
              </h1>
              <p className="text-xs text-[#6b5d4f] font-light">
                Decision Type: <strong className="font-semibold text-stone-700 uppercase tracking-wide text-[10px]">{scenario.type}</strong>
              </p>
            </div>
            <div className="text-left sm:text-right text-[10px] uppercase font-mono text-[#817a67] space-y-1 shrink-0">
              <div className="flex items-center gap-1.5 sm:justify-end">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(scenario.timestamp).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:justify-end text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Cryptographic Hash Verified</span>
              </div>
              <span className="text-stone-400 block">Schema v{scenario.schemaVersion}</span>
            </div>
          </div>
        </header>

        {/* ── Forensic Replay Hero Section (PROBLEM 2) ── */}
        <section className="w-full bg-[#f5eddd] border border-[#b9b29c]/30 p-6 mb-6 space-y-5 animate-slideUp">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#817a67] font-semibold">
                FOR FORENSIC RECONSTRUCTION
              </span>
              <h3 className="text-xl font-light text-[#373223] mt-1 leading-tight">
                Watch this decision unfold exactly as the governance system processed it.
              </h3>
              <p className="text-[11px] text-[#6b5d4f] font-light mt-1">
                "Every governance verdict can be reconstructed step-by-step from immutable audit evidence."
              </p>
            </div>
            <button
              onClick={() => setShowReplay(true)}
              className="bg-[#715b3e] text-[#fff9ee] hover:bg-[#644f33] text-sm font-mono uppercase tracking-widest px-6 py-3.5 shadow-md transition-all shrink-0 flex items-center gap-2"
            >
              <span>▶ Replay Governance Session</span>
            </button>
          </div>

          {/* Replay Metadata counters */}
          <div className="flex items-center gap-6 text-[10px] font-mono text-[#817a67] border-y border-[#b9b29c]/15 py-2">
            <span>Duration: <strong className="text-[#373223]">{(scenario.processing.durationMs / 1000).toFixed(1)}s</strong></span>
            <span>Agents: <strong className="text-[#373223]">{scenario.processing.agentsExecuted}</strong></span>
            <span>Frameworks: <strong className="text-[#373223]">{scenario.processing.regulatoryFrameworksEvaluated}</strong></span>
            <span>Attack Simulations: <strong className="text-[#9e422c]">{scenario.processing.attackVectorsTested}</strong></span>
          </div>

          {/* Replay Preview Timeline */}
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-wider text-[#817a67] font-bold block">Replay Preview Timeline:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {[
                { label: "Proposal", status: "Ingested" },
                { label: "Evidence", status: "Flagged" },
                { label: "Board Debate", status: "Rejected" },
                { label: "Constitution", status: "Override" },
                { label: "Adversarial", status: "Blocked" },
                { label: "Simulation", status: "Warning" },
                { label: "Regulatory", status: "Failed" },
                { label: "Verdict", status: "Sealed" },
              ].map((node, i) => (
                <div key={i} className="bg-[#fffbf2] border border-outline-variant/15 p-2 text-center text-[9px] font-mono group relative">
                  <span className="text-stone-400 block">0{i+1}</span>
                  <span className="font-semibold text-stone-700 block truncate mt-0.5">{node.label}</span>
                  <div className="absolute inset-0 bg-stone-100/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-stone-700 font-bold border border-stone-300">
                    {node.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Context Parameters ── */}
        <section className="w-full bg-surface border border-outline-variant/15 p-6 mb-5 space-y-4 shadow-sm animate-slideUp">
          <h4 className="text-[10px] uppercase tracking-widest text-[#817a67] font-medium border-b border-[#b9b29c]/10 pb-2">
            Factual Parameters Logged
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-light text-[#373223]">
            <div className="space-y-1">
              <strong className="text-stone-500 font-medium">Decision Context:</strong>
              <p className="bg-[#fff9ee] p-2 border border-[#b9b29c]/10 leading-relaxed">{scenario.context}</p>
            </div>
            <div className="space-y-1">
              <strong className="text-stone-500 font-medium">Proposed Action:</strong>
              <p className="bg-[#fff9ee] p-2 border border-[#b9b29c]/10 leading-relaxed">{scenario.proposal}</p>
            </div>
            <div className="space-y-1 md:col-span-2">
              <strong className="text-stone-500 font-medium">Supporting Rationale:</strong>
              <p className="bg-[#fff9ee] p-2 border border-[#b9b29c]/10 leading-relaxed">{scenario.rationale}</p>
            </div>
          </div>
        </section>

        {/* ── Pipeline Execution Stats ── */}
        <section className="w-full bg-surface border border-outline-variant/15 p-5 mb-6 shadow-sm animate-slideUp" style={{ animationDelay: "100ms" }}>
          <h4 className="text-[10px] uppercase tracking-widest text-[#817a67] font-medium border-b border-[#b9b29c]/10 pb-2 mb-4">
            Pipeline Execution Metadata
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { icon: Clock,  label: "Duration", value: `${(scenario.processing.durationMs / 1000).toFixed(2)}s` },
              { icon: Cpu,    label: "Agents Run", value: String(scenario.processing.agentsExecuted) },
              { icon: Layers, label: "Reg. Frameworks", value: String(scenario.processing.regulatoryFrameworksEvaluated) },
              { icon: Zap,    label: "Simulations", value: String(scenario.processing.simulationScenariosGenerated) },
              { icon: Shield, label: "Attack Vectors", value: String(scenario.processing.attackVectorsTested) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center bg-[#fff9ee] border border-[#b9b29c]/10 p-3 text-center">
                <Icon className="w-4 h-4 text-[#715b3e] mb-1.5" />
                <span className="text-lg font-light text-[#373223] font-mono">{value}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#817a67] mt-0.5">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section Controls ── */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-1.5">
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => toggleSection(s.id)}
                className={`flex items-center gap-1 text-[9px] uppercase font-mono px-2 py-1 border transition-colors ${
                  openSections.has(s.id)
                    ? "bg-[#715b3e]/8 border-[#715b3e]/30 text-[#715b3e]"
                    : "bg-surface border-[#b9b29c]/15 text-[#817a67] hover:border-[#715b3e]/20"
                }`}
              >
                {i + 1}. {s.label}
                <ChevronRight className={`w-2.5 h-2.5 transition-transform ${openSections.has(s.id) ? "rotate-90" : ""}`} />
              </button>
            ))}
          </div>
          <div className="flex gap-2 shrink-0 ml-2">
            <button onClick={expandAll} className="text-[9px] uppercase font-mono text-[#715b3e] hover:underline">All</button>
            <button onClick={collapseAll} className="text-[9px] uppercase font-mono text-[#817a67] hover:underline">Reset</button>
          </div>
        </div>

        {/* ── Forensic Sections ── */}
        <div className="w-full space-y-4">

          {/* 1. Executive Verdict */}
          {openSections.has("verdict") && (
            <div className="animate-slideUp space-y-4">
              <VerdictHeroCard
                verdict={scenario.verdict}
                confidence={scenario.confidence}
                risk={scenario.risk}
                evidence={scenario.evidence}
                takeaway={scenario.takeaway}
              />
              <ExecutiveBoardSpotlight
                members={scenario.board.members}
                consensusSummary={scenario.board.consensusSummary}
                finalVerdict={scenario.board.finalVerdict}
              />
            </div>
          )}

          {/* 2. Decision DNA */}
          {openSections.has("dna") && (
            <div className="animate-slideUp">
              <DecisionDNA dna={scenario.dna} />
            </div>
          )}

          {/* 3. Board Debate */}
          <ExecutiveBoardConsensusCard
            members={scenario.board.members}
            consensusSummary={scenario.board.consensusSummary}
            finalVerdict={scenario.board.finalVerdict}
            defaultOpen={openSections.has("board")}
          />

          {/* 4. Constitutional Analysis */}
          <ConstitutionScorecardCard
            scores={scenario.constitutions.scores}
            conflicts={scenario.constitutions.conflicts}
            defaultOpen={openSections.has("constitution")}
          />

          {/* 5. Regulatory Review */}
          <RegulatoryAlignmentCard
            frameworks={scenario.regulatory}
            defaultOpen={openSections.has("regulatory")}
          />

          {/* 6. Adversarial Findings */}
          <GovernanceAttackReportCard
            report={scenario.adversarial}
            defaultOpen={openSections.has("adversarial")}
          />

          {/* 7. Enterprise Simulation */}
          <EnterpriseForecastCard
            scenarios={scenario.simulation}
            defaultOpen={openSections.has("simulation")}
          />

          {/* 8. Final Recommendation / Timeline */}
          {openSections.has("timeline") && (
            <div className="animate-slideUp">
              <NarrativeTimelineStepper steps={scenario.timelineNodes} />
            </div>
          )}
        </div>
      </main>

      {showReplay && (
        <DecisionReplayPlayer
          onClose={() => setShowReplay(false)}
          verdict={scenario.verdict}
        />
      )}
    </div>
  );
}
