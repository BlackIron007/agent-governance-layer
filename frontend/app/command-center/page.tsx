"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import VerdictHeroCard from "../../components/VerdictHeroCard";
import DecisionDNA from "../../components/DecisionDNA";
import ExecutiveBoardConsensusCard from "../../components/ExecutiveBoardConsensusCard";
import RegulatoryAlignmentCard from "../../components/RegulatoryAlignmentCard";
import GovernanceAttackReportCard from "../../components/GovernanceAttackReportCard";
import EnterpriseForecastCard from "../../components/EnterpriseForecastCard";
import ConstitutionScorecardCard from "../../components/ConstitutionScorecardCard";
import NarrativeTimelineStepper from "../../components/NarrativeTimelineStepper";
import { SCENARIOS } from "../../lib/mockData";
import { Play, ArrowRight } from "lucide-react";

export default function CommandCenterPage() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<keyof typeof SCENARIOS>("vendor_approval");
  const [customProposal, setCustomProposal] = useState("");
  const [isConvening, setIsConvening] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);

  const scenario = SCENARIOS[selectedScenarioKey];

  const handleConvene = () => {
    setIsConvening(true);
    setTimeout(() => {
      setIsConvening(false);
    }, 1200);
  };

  const startTour = () => {
    setTourStep(1);
    setSelectedScenarioKey("vendor_approval");
  };

  const nextTourStep = () => {
    if (tourStep === 1) {
      setTourStep(2);
    } else if (tourStep === 2) {
      setTourStep(3);
    } else if (tourStep === 3) {
      setTourStep(4);
    } else if (tourStep === 4) {
      setTourStep(5);
    } else {
      setTourStep(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Navbar />

      <div className="flex-grow pt-20 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto px-6 gap-8">
        
        {/* LEFT PANEL: Sidebar */}
        <aside className="w-full lg:w-[350px] shrink-0 space-y-6 pb-20">
          
          {/* Guided Tour Banner */}
          <div className="border border-[#715b3e]/20 bg-[#715b3e]/5 p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#715b3e]">
              <Play className="w-4 h-4" />
              <h3 className="text-xs uppercase tracking-wider font-semibold">Guided Demo Tour</h3>
            </div>
            <p className="text-xs text-[#6b5d4f] font-light leading-relaxed">
              Automated workflow walk-through illustrating all ten governance engines.
            </p>
            {tourStep === null ? (
              <button
                onClick={startTour}
                className="w-full py-2 bg-[#715b3e] text-[#fff9ee] text-[10px] uppercase tracking-widest hover:bg-[#644f33] transition-colors"
              >
                Start Product Tour
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-mono text-[#715b3e]">
                  <span>Step {tourStep} of 5</span>
                  <span>Active</span>
                </div>
                <button
                  onClick={nextTourStep}
                  className="w-full py-2 border border-[#715b3e] text-[#715b3e] text-[10px] uppercase tracking-widest hover:bg-[#715b3e] hover:text-[#fff9ee] transition-all flex items-center justify-center gap-2"
                >
                  {tourStep === 5 ? "Finish Tour" : "Next Tour Step"} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Preset Selector */}
          <div className="border border-outline-variant/15 p-6 bg-surface-container-low/40 space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#817a67] font-light">Quick Launch Presets</h3>
              <p className="text-[10px] text-[#6b5d4f] font-light mt-1">Order prioritized for judging review.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              {(Object.keys(SCENARIOS) as Array<keyof typeof SCENARIOS>).map((key) => {
                const isSelected = selectedScenarioKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedScenarioKey(key);
                      setTourStep(null);
                    }}
                    className={`text-left p-3 border transition-all text-xs flex justify-between items-center ${
                      isSelected
                        ? "bg-[#715b3e]/5 border-[#715b3e] text-[#715b3e] font-semibold"
                        : "bg-surface border-outline-variant/10 text-[#6b5d4f] hover:border-outline-variant/30"
                    }`}
                  >
                    <span className="font-light">{SCENARIOS[key].name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Custom parameters Form */}
          <div className="border border-outline-variant/15 p-6 bg-surface-container-low/40 space-y-4">
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
              className="w-full py-3 bg-[#715b3e] text-[#fff9ee] text-xs uppercase tracking-widest hover:bg-[#644f33] transition-colors"
            >
              {isConvening ? "Convening Board..." : "Convene Governance Board"}
            </button>
          </div>
        </aside>

        {/* RIGHT PANEL: Main Workstation View */}
        <main className="flex-1 space-y-6 pb-20">
          
          {/* Guided Tour Prompts Banner */}
          {tourStep !== null && (
            <div className="border border-[#715b3e] bg-[#fff9ee] p-4 text-xs font-light text-[#715b3e] animate-fadeIn flex items-center justify-between">
              <div>
                {tourStep === 1 && <span><strong>Step 1:</strong> Loaded Scenario 1 (Vendor Approval). Check Verdict Dials and DNA Weights.</span>}
                {tourStep === 2 && <span><strong>Step 2:</strong> View Board consensus cards below. Note CFO approval vs CISO reject.</span>}
                {tourStep === 3 && <span><strong>Step 3:</strong> Expand Adversarial Lab findings. The system detected <strong>Reward Hacking</strong> exploits.</span>}
                {tourStep === 4 && <span><strong>Step 4:</strong> Expand Regulatory scorecards. High compliance failure blocked execution.</span>}
                {tourStep === 5 && <span><strong>Step 5:</strong> Product tour complete! Feel free to review final reports or choose other presets.</span>}
              </div>
              <button 
                onClick={nextTourStep}
                className="px-3 py-1 bg-[#715b3e] text-[#fff9ee] text-[10px] uppercase tracking-widest font-mono shrink-0"
              >
                {tourStep === 5 ? "Close" : "Next"}
              </button>
            </div>
          )}

          {/* 1. Verdict Hero Card (Highest Priority) */}
          <VerdictHeroCard
            verdict={scenario.verdict}
            confidence={scenario.confidence}
            risk={scenario.risk}
            evidence={scenario.evidence}
            takeaway={scenario.takeaway}
          />

          {/* 2. Decision DNA Card */}
          <DecisionDNA dna={scenario.dna} />

          {/* 3. Executive Board Consensus Card */}
          <ExecutiveBoardConsensusCard
            members={scenario.board.members}
            consensusSummary={scenario.board.consensusSummary}
            finalVerdict={scenario.board.finalVerdict}
          />

          {/* 4. Regulatory Scorecard */}
          <RegulatoryAlignmentCard frameworks={scenario.regulatory} />

          {/* 5. Adversarial Lab */}
          <GovernanceAttackReportCard report={scenario.adversarial} />

          {/* 6. Enterprise Simulation Forecasts */}
          <EnterpriseForecastCard scenarios={scenario.simulation} />

          {/* 7. Constitutional Scorecards */}
          <ConstitutionScorecardCard
            scores={scenario.constitutions.scores}
            conflicts={scenario.constitutions.conflicts}
          />

          {/* 8. Narrative Timeline Stepper */}
          <NarrativeTimelineStepper steps={scenario.timelineNodes} />

        </main>
      </div>
    </div>
  );
}
