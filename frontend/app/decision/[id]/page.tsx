"use client";

import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import VerdictHeroCard from "../../../components/VerdictHeroCard";
import DecisionDNA from "../../../components/DecisionDNA";
import ExecutiveBoardConsensusCard from "../../../components/ExecutiveBoardConsensusCard";
import RegulatoryAlignmentCard from "../../../components/RegulatoryAlignmentCard";
import GovernanceAttackReportCard from "../../../components/GovernanceAttackReportCard";
import EnterpriseForecastCard from "../../../components/EnterpriseForecastCard";
import ConstitutionScorecardCard from "../../../components/ConstitutionScorecardCard";
import NarrativeTimelineStepper from "../../../components/NarrativeTimelineStepper";
import { SCENARIOS, DECISION_ID_MAP } from "../../../lib/mockData";
import { FileText, Calendar, ShieldCheck, Cpu, Clock, Layers, Shield, Zap } from "lucide-react";

export default function DecisionDetailPage() {
  const params = useParams();
  const rawId = params.id as string;

  // Use centralized map from mockData
  const scenarioKey = DECISION_ID_MAP[rawId] || "vendor_approval";
  const scenario = SCENARIOS[scenarioKey];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 flex flex-col items-center w-full max-w-4xl mx-auto px-6">
        
        <header className="w-full border-b border-[#b9b29c]/20 pb-6 mb-8 flex justify-between items-end">
          <div className="space-y-2">
            <span className="text-[9px] font-mono uppercase text-[#715b3e] flex items-center gap-1.5 font-bold">
              <FileText className="w-3.5 h-3.5" /> SECURE GOVERNANCE AUDIT RECORD
            </span>
            <h1 className="text-4xl font-light tracking-tighter text-[#373223]">Forensic Audit File {scenario.decisionId}</h1>
            <p className="text-xs text-[#6b5d4f] font-light">
              Decision Type: <strong className="font-semibold text-stone-700 uppercase tracking-wide text-[10px]">{scenario.type}</strong>
            </p>
          </div>
          <div className="text-right text-[10px] uppercase font-mono text-[#817a67] space-y-1">
            <div className="flex items-center gap-1.5 justify-end">
              <Calendar className="w-3.5 h-3.5" />
              <span>Processed: {new Date(scenario.timestamp).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cryptographic Hash Verified</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end text-stone-400">
              <span>Schema v{scenario.schemaVersion}</span>
            </div>
          </div>
        </header>

        {/* Forensic Metadata Summary */}
        <section className="w-full bg-surface border border-outline-variant/15 p-6 mb-6 space-y-4 shadow-sm">
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

        {/* Processing Metadata — Pipeline Execution Stats */}
        <section className="w-full bg-surface border border-outline-variant/15 p-5 mb-6 shadow-sm">
          <h4 className="text-[10px] uppercase tracking-widest text-[#817a67] font-medium border-b border-[#b9b29c]/10 pb-2 mb-4">
            Pipeline Execution Metadata
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <div className="flex flex-col items-center bg-[#fff9ee] border border-[#b9b29c]/10 p-3 text-center">
              <Clock className="w-4 h-4 text-[#715b3e] mb-1.5" />
              <span className="text-lg font-light text-[#373223] font-mono">{(scenario.processing.durationMs / 1000).toFixed(2)}s</span>
              <span className="text-[9px] uppercase tracking-wider text-[#817a67] mt-0.5">Duration</span>
            </div>
            <div className="flex flex-col items-center bg-[#fff9ee] border border-[#b9b29c]/10 p-3 text-center">
              <Cpu className="w-4 h-4 text-[#715b3e] mb-1.5" />
              <span className="text-lg font-light text-[#373223] font-mono">{scenario.processing.agentsExecuted}</span>
              <span className="text-[9px] uppercase tracking-wider text-[#817a67] mt-0.5">Agents Run</span>
            </div>
            <div className="flex flex-col items-center bg-[#fff9ee] border border-[#b9b29c]/10 p-3 text-center">
              <Layers className="w-4 h-4 text-[#715b3e] mb-1.5" />
              <span className="text-lg font-light text-[#373223] font-mono">{scenario.processing.regulatoryFrameworksEvaluated}</span>
              <span className="text-[9px] uppercase tracking-wider text-[#817a67] mt-0.5">Reg. Frameworks</span>
            </div>
            <div className="flex flex-col items-center bg-[#fff9ee] border border-[#b9b29c]/10 p-3 text-center">
              <Zap className="w-4 h-4 text-[#715b3e] mb-1.5" />
              <span className="text-lg font-light text-[#373223] font-mono">{scenario.processing.simulationScenariosGenerated}</span>
              <span className="text-[9px] uppercase tracking-wider text-[#817a67] mt-0.5">Simulations</span>
            </div>
            <div className="flex flex-col items-center bg-[#fff9ee] border border-[#b9b29c]/10 p-3 text-center">
              <Shield className="w-4 h-4 text-[#715b3e] mb-1.5" />
              <span className="text-lg font-light text-[#373223] font-mono">{scenario.processing.attackVectorsTested}</span>
              <span className="text-[9px] uppercase tracking-wider text-[#817a67] mt-0.5">Attack Vectors</span>
            </div>
          </div>
        </section>

        {/* Forensic report content: Everything collapsed by default except Verdict Hero & DNA */}
        <div className="w-full space-y-6">
          {/* 1. Verdict Hero (Expanded) */}
          <VerdictHeroCard
            verdict={scenario.verdict}
            confidence={scenario.confidence}
            risk={scenario.risk}
            evidence={scenario.evidence}
            takeaway={scenario.takeaway}
          />

          {/* 2. Decision DNA Card (Expanded) */}
          <DecisionDNA dna={scenario.dna} />

          {/* 3. Executive Board (Collapsed by default) */}
          <ExecutiveBoardConsensusCard
            members={scenario.board.members}
            consensusSummary={scenario.board.consensusSummary}
            finalVerdict={scenario.board.finalVerdict}
          />

          {/* 4. Regulatory Scorecard (Collapsed by default) */}
          <RegulatoryAlignmentCard frameworks={scenario.regulatory} />

          {/* 5. Adversarial Lab (Collapsed by default) */}
          <GovernanceAttackReportCard report={scenario.adversarial} />

          {/* 6. Enterprise Forecasts (Collapsed by default) */}
          <EnterpriseForecastCard scenarios={scenario.simulation} />

          {/* 7. Constitutional Scorecard (Collapsed by default) */}
          <ConstitutionScorecardCard
            scores={scenario.constitutions.scores}
            conflicts={scenario.constitutions.conflicts}
          />

          {/* 8. Narrative Timeline (Progressive Replay) */}
          <NarrativeTimelineStepper steps={scenario.timelineNodes} />
        </div>

      </main>
    </div>
  );
}
